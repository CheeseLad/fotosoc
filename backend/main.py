import os
import time
import tempfile
import json
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_mail import Mail, Message
from flask_restx import Api, Resource, fields
from datetime import datetime
from googleapiclient.discovery import build
from google.oauth2 import service_account
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
from dotenv import load_dotenv

# Load environment variables from a .env file if present
load_dotenv()

app = Flask(__name__)
CORS(app)

# ---------------- Flask Configuration ----------------

# Flask-Mail configuration (Environment Variables)
app.config['MAIL_SERVER'] = os.environ.get('MAIL_SERVER', 'smtp.purelymail.com')
app.config['MAIL_PORT'] = int(os.environ.get('MAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = os.environ.get('MAIL_USE_TLS', 'True') == 'True'
app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME', 'equipment@dcufotosoc.ie')
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.environ.get('MAIL_DEFAULT_SENDER', 'equipment@dcufotosoc.ie')
app.config['MAIL_REPLY_TO'] = os.environ.get('MAIL_REPLY_TO', 'equipment@dcufotosoc.ie')

# Google Calendar Configuration (Environment Variables)
SERVICE_ACCOUNT_FILE = os.environ.get('SERVICE_ACCOUNT_FILE', './credentials.json')
SCOPES = ["https://www.googleapis.com/auth/calendar"]
CALENDAR_ID = os.environ.get('CALENDAR_ID')

# Google Sheets API setup
SHEETS_SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]
SHEET_ID = os.environ.get('SHEET_ID')  # Set this in your .env or environment
SHEET_RANGE = os.environ.get('SHEET_RANGE', 'Sheet1!A1:C100')  # Adjust as needed

def update_current_quantity_in_sheet(equipment_name, new_quantity):
    creds = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SHEETS_SCOPES
    )
    sheets_service = build('sheets', 'v4', credentials=creds)
    sheet = sheets_service.spreadsheets()
    # Read all equipment to find the row
    result = sheet.values().get(spreadsheetId=SHEET_ID, range=SHEET_RANGE).execute()
    values = result.get('values', [])
    if not values:
        return False
    headers = values[0]
    name_idx = headers.index('EQUIPMENT_NAME') if 'EQUIPMENT_NAME' in headers else None
    curr_idx = headers.index('CURRENT_AMOUNT') if 'CURRENT_AMOUNT' in headers else None
    if name_idx is None or curr_idx is None:
        return False
    for i, row in enumerate(values[1:], start=2):  # start=2 for 1-based row in sheet
        if len(row) > name_idx and row[name_idx] == equipment_name:
            # Prepare the range for CURRENT_AMOUNT cell
            cell_range = f"Sheet1!{chr(65+curr_idx)}{i}"
            sheet.values().update(
                spreadsheetId=SHEET_ID,
                range=cell_range,
                valueInputOption="RAW",
                body={"values": [[str(new_quantity)]]}
            ).execute()
            return True
    return False


def get_equipment_from_sheet():
    creds = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SHEETS_SCOPES
    )
    sheets_service = build('sheets', 'v4', credentials=creds)
    sheet = sheets_service.spreadsheets()
    result = sheet.values().get(spreadsheetId=SHEET_ID, range=SHEET_RANGE).execute()
    values = result.get('values', [])
    # Expect header row: EQUIPMENT_NAME, MAX_AMOUNT
    equipment_list = []
    if values:
        headers = values[0]
        for row in values[1:]:
            item = dict(zip(headers, row))
            equipment_list.append(item)
    return equipment_list

# Authenticate Google Calendar API
credentials = service_account.Credentials.from_service_account_file(
    SERVICE_ACCOUNT_FILE, scopes=SCOPES
)
service = build("calendar", "v3", credentials=credentials)


mail = Mail(app)

# Swagger API setup
api = Api(app, version='1.0', title='DCU Fotosoc Equipment Booking API', description='API for booking and managing equipment for DCU Fotosoc')

ns = api.namespace('api', description="Operations for booking and managing equipment for DCU Fotosoc")

# ---------------- Data Models (No Database) ----------------
# Using Google Sheets as the primary data source


# ---------------- API Models for Swagger ----------------
equipment_model = api.model('Equipment', {
    'id': fields.Integer(description='Equipment ID'),
    'name': fields.String(required=True, description='Name of the equipment'),
    'description': fields.String(description='Description of the equipment'),
    'amount': fields.Integer(required=True, description='Number of available items'),
    'image_link': fields.String(description='Link to equipment image'),
})

equipment_update_model = api.model('EquipmentUpdate', {
    'name': fields.String(description='New name for the equipment'),
    'amount': fields.Integer(description='New amount')
})

booking_model = api.model("Booking", {
    "user_email": fields.String(required=True, description="User's email"),
    "user_phone": fields.String(required=True, description="User's phone number"),
    "equipment": fields.String(required=True, description="Equipment name"),
    "amount": fields.Integer(required=True, description="Amount requested"),
    "start_datetime": fields.String(required=True, description="Start datetime (YYYY-MM-DD HH:MM)"),
    "end_datetime": fields.String(required=True, description="End datetime (YYYY-MM-DD HH:MM)")
})



def add_booking_to_calendar(booking):
    try:
        # Parse the datetime strings from frontend format "YYYY-MM-DD HH:MM"
        start_datetime = datetime.strptime(booking['start_datetime'], "%Y-%m-%d %H:%M").isoformat() + "Z"
        end_datetime = datetime.strptime(booking['end_datetime'], "%Y-%m-%d %H:%M").isoformat() + "Z"
    except ValueError:
        print("🚨 ERROR: Incorrect datetime format! Must be 'YYYY-MM-DD HH:MM'")
        return None

    event = {
        "summary": f"DCU Fotosoc Equipment Loan: {booking['equipment_name']}",
        "description": f"Equipment Loan Request - APPROVED\n\nEquipment: {booking['equipment_name']}\nQuantity: {booking['amount']}\nBorrower: {booking['user_email']}\n\nEquipment Officer: Magdalena Kudlewska\nDCU Fotosoc",
        "start": {
            "dateTime": start_datetime,
            "timeZone": "UTC"
        },
        "end": {
            "dateTime": end_datetime,
            "timeZone": "UTC"
        },
        "organizer": {
            "displayName": "Magdalena Kudlewska",
            "email": "equipment@dcufotosoc.ie"
        },
        "attendees": [
            {
                "email": booking['user_email'],
                "displayName": booking['user_email'].split('@')[0].replace('.', ' ').title(),
                "responseStatus": "accepted"
            }
        ],
        "location": "DCU Fotosoc"
    }

    #print("📌 Google Calendar Event Request:", json.dumps(event, indent=4))

    try:
        event_response = service.events().insert(calendarId=CALENDAR_ID, body=event, sendUpdates="all").execute()
        print("✅ Event created successfully:", event_response.get("id"))
        return event_response.get("id")
    except Exception as e:
        print(f"❌ Google Calendar API error: {e}")
        return None


import tempfile

def generate_ics_file(booking):
    """Generate an ICS calendar file for the user's personal calendar."""
    ics_content = f"""BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//DCU Fotosoc//Equipment Loan//EN
BEGIN:VEVENT
UID:{booking['id']}@dcufotosoc.ie
DTSTAMP:{datetime.utcnow().strftime('%Y%m%dT%H%M%SZ')}
DTSTART:{booking['start_datetime'].replace('-', '').replace(':', '')}
DTEND:{booking['end_datetime'].replace('-', '').replace(':', '')}
SUMMARY:DCU Fotosoc Equipment Loan: {booking['equipment_name']}
DESCRIPTION:Equipment Loan Request - APPROVED\\n\\nEquipment: {booking['equipment_name']}\\nQuantity: {booking['amount']}\\nBorrower: {booking['user_email']}\\n\\nEquipment Officer: Magdalena Kudlewska\\nDCU Fotosoc
LOCATION:DCU Fotosoc
ORGANIZER;CN=Magdalena Kudlewska:mailto:equipment@dcufotosoc.ie
ATTENDEE;CN={booking['user_email']}:mailto:{booking['user_email']}
END:VEVENT
END:VCALENDAR
"""

    # Create a temporary ICS file
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".ics")
    with open(temp_file.name, "w") as f:
        f.write(ics_content)

    return temp_file.name  # Return file path


def get_ordinal_suffix(day):
    """Get ordinal suffix for day (1st, 2nd, 3rd, 4th, etc.)"""
    if 10 <= day % 100 <= 20:
        suffix = 'th'
    else:
        suffix = {1: 'st', 2: 'nd', 3: 'rd'}.get(day % 10, 'th')
    return suffix

def send_booking_email(user_email, equipment_name, amount, start_datetime, end_datetime, event_link, booking):
    """Send an email confirmation with an ICS file for adding to a personal calendar."""
    try:
        # Extract and capitalize first name from email (format: first.last@mail.com)
        first_name = user_email.split('@')[0].split('.')[0].capitalize()
        
        # Format datetime for human reading
        start_dt = datetime.strptime(booking['start_datetime'], "%Y-%m-%d %H:%M")
        end_dt = datetime.strptime(booking['end_datetime'], "%Y-%m-%d %H:%M")
        
        start_formatted = start_dt.strftime("%d{sup} %B %Y at %I:%M%p").replace("{sup}", get_ordinal_suffix(start_dt.day))
        end_formatted = end_dt.strftime("%d{sup} %B %Y at %I:%M%p").replace("{sup}", get_ordinal_suffix(end_dt.day))

        msg = Message(
            subject="DCU Fotosoc Equipment Loan Request - APPROVED",
            sender=("Magdalena Kudlewska", app.config["MAIL_DEFAULT_SENDER"]),
            reply_to=app.config["MAIL_REPLY_TO"],
            recipients=[user_email]
        )

        msg.body = f"""
Hey {first_name},

Great news! Your DCU Fotosoc equipment loan request has been approved.

📸 Equipment: {equipment_name}
🔢 Amount: {amount}
📅 Loan Period: From {start_formatted} until {end_formatted}

You can view your loan details in your Google Calendar:
{event_link}

Alternatively, import the attached ICS file into your calendar.

If you have any questions or need to make changes, please reply to this email!

Kind regards,
Magdalena Kudlewska
DCU Fotosoc Equipment Officer 25/26
        """

        # Attach ICS file
        ics_file_path = generate_ics_file(booking)
        with open(ics_file_path, "rb") as f:
            msg.attach("DCU_Fotosoc_Equipment_Loan.ics", "text/calendar", f.read())

        # Send email
        mail.send(msg)
        print(f"✅ Email sent to {user_email}")

    except Exception as e:
        print(f"❌ Failed to send email: {e}")



# ---------------- Equipment Endpoints ----------------
@ns.route("/equipment")
class EquipmentList(Resource):
    @api.marshal_list_with(equipment_model)
    def get(self):
        """List all equipment from Google Sheet"""
        sheet_equipment = get_equipment_from_sheet()
        equipment_list = []
        for idx, item in enumerate(sheet_equipment):
            name = item.get('EQUIPMENT_NAME')
            max_qty = int(item.get('MAX_AMOUNT', 0))
            current_qty = int(item.get('CURRENT_AMOUNT', 0))
            image_link = item.get('IMAGE_LINK', '')
            equipment_list.append({
                "id": idx + 1,
                "name": name,
                "amount": current_qty,
                "max_amount": max_qty,
                "image_link": image_link
            })
        return equipment_list

@ns.route('/equipment/<string:equipment_name>')
class EquipmentItem(Resource):
    @api.expect(equipment_update_model)
    def patch(self, equipment_name):
        """Update only CURRENT_AMOUNT for an equipment item in Google Sheets"""
        data = request.json
        if 'amount' in data:
            new_quantity = data['amount']
            update_success = update_current_quantity_in_sheet(equipment_name, new_quantity)
            if update_success:
                return {'message': 'Current amount updated successfully'}, 200
            else:
                return {'error': 'Equipment not found or update failed'}, 404
        else:
            return {'error': 'No amount provided'}, 400


# ---------------- Booking Endpoint ----------------
@ns.route("/book")
class EquipmentBooking(Resource):
    @api.expect(booking_model)
    def post(self):
        """Book equipment, sync with Google Calendar, and send email confirmation with ICS file."""
        data = request.json

        user_email = data.get("user_email")
        equipment_name = data.get("equipment")
        amount = int(data.get("amount", 1))
        start_datetime_str = data.get("start_datetime")
        end_datetime_str = data.get("end_datetime")

        if not user_email or not equipment_name or not start_datetime_str or not end_datetime_str:
            return {"error": "Missing required fields"}, 400

        try:
            # Parse and validate datetime format from frontend
            start_dt = datetime.strptime(start_datetime_str, "%Y-%m-%d %H:%M")
            end_dt = datetime.strptime(end_datetime_str, "%Y-%m-%d %H:%M")
            start_datetime = start_dt.isoformat() + "Z"
            end_datetime = end_dt.isoformat() + "Z"
        except ValueError:
            return {"error": "Invalid date/time format. Use 'YYYY-MM-DD HH:MM'."}, 400

        if end_datetime <= start_datetime:
            return {"error": "End date/time must be after start date/time"}, 400

        # Get current amount from Google Sheet
        sheet_equipment = get_equipment_from_sheet()
        eq_row = next((item for item in sheet_equipment if item.get('EQUIPMENT_NAME') == equipment_name), None)
        if not eq_row:
            return {"error": f"Equipment {equipment_name} not found in sheet"}, 400
        try:
            current_qty = int(eq_row.get('CURRENT_AMOUNT', eq_row.get('MAX_AMOUNT', 0)))
        except Exception:
            current_qty = 0
        if current_qty < amount:
            return {"error": f"Not enough {equipment_name} available"}, 400

        # Update CURRENT_AMOUNT in Google Sheet
        new_qty = current_qty - amount
        update_success = update_current_quantity_in_sheet(equipment_name, new_qty)
        if not update_success:
            return {"error": "Failed to update amount in sheet"}, 500

        # Create booking object for calendar and email (no database storage)
        booking_data = {
            'user_email': user_email,
            'user_phone': data.get('user_phone', ''),
            'equipment_name': equipment_name,
            'amount': amount,
            'start_datetime': start_datetime_str,  # Use original format for calendar function
            'end_datetime': end_datetime_str,      # Use original format for calendar function
            'id': int(time.time())  # Generate a simple ID based on timestamp
        }

        try:
            # Sync with Google Calendar
            event_id = add_booking_to_calendar(booking_data)
            if not event_id:
                # Rollback amount if calendar creation fails
                update_current_quantity_in_sheet(equipment_name, current_qty)
                return {"error": "Failed to create calendar event"}, 500

            event_link = f"https://www.google.com/calendar/event?eid={event_id}" if event_id else "N/A"

            # Send email confirmation with ICS file
            send_booking_email(user_email, equipment_name, amount, start_datetime, end_datetime, event_link, booking_data)

            return {"message": "Booking successful", "booking_id": booking_data['id'], "event_id": event_id}, 200

        except Exception as e:
            # Rollback amount if any error occurs during booking process
            print(f"❌ Booking failed, rolling back amount: {e}")
            update_current_quantity_in_sheet(equipment_name, current_qty)
            return {"error": f"Booking failed: {str(e)}"}, 500

      
      
    def get(self):
        """List all bookings from Google Calendar"""
        try:
            events = service.events().list(calendarId=CALENDAR_ID).execute()
            bookings = []
            for event in events.get("items", []):
                if event.get("summary", "").startswith("Booking:"):
                    # Extract booking info from calendar event
                    summary = event.get("summary", "")
                    description = event.get("description", "")
                    equipment_name = summary.replace("Booking: ", "")
                    
                    # Parse description for user email and amount
                    lines = description.split('\n')
                    user_email = lines[0].replace("User: ", "") if lines else ""
                    amount = int(lines[1].replace("Amount: ", "")) if len(lines) > 1 else 1
                    
                    bookings.append({
                        "id": event.get("id", ""),
                        "user_email": user_email,
                        "equipment_name": equipment_name,
                        "amount": amount,
                        "start_datetime": event.get("start", {}).get("dateTime", ""),
                        "end_datetime": event.get("end", {}).get("dateTime", "")
                    })
            return bookings
        except Exception as e:
            print(f"❌ Error fetching bookings from calendar: {e}")
            return {"error": "Failed to fetch bookings"}, 500

if __name__ == '__main__':
    app.run(debug=True)
