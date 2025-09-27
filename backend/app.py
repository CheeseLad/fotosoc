import os
import time
import tempfile
import json
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_mail import Mail, Message
from datetime import datetime, timezone
import pytz
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
app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.environ.get('MAIL_DEFAULT_SENDER')
app.config['MAIL_REPLY_TO'] = os.environ.get('MAIL_REPLY_TO')

# Google Calendar Configuration (Environment Variables)
SERVICE_ACCOUNT_FILE = os.environ.get('SERVICE_ACCOUNT_FILE', './credentials.json')
SCOPES = ["https://www.googleapis.com/auth/calendar"]
CALENDAR_ID = os.environ.get('CALENDAR_ID')

# Google Sheets API setup
SHEETS_SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]
SHEET_ID = os.environ.get('SHEET_ID')  # Set this in your .env or environment
SHEET_RANGE = os.environ.get('SHEET_RANGE', 'Sheet1!A1:D100')  # Adjust as needed

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

def add_booking_to_calendar(booking):
    try:
        # Parse the datetime strings from frontend format "YYYY-MM-DD HH:MM"
        start_dt_naive = datetime.strptime(booking['start_datetime'], "%Y-%m-%d %H:%M")
        end_dt_naive = datetime.strptime(booking['end_datetime'], "%Y-%m-%d %H:%M")
        
        # Get user's timezone (default to Dublin if not provided)
        user_timezone = booking.get('timezone', 'Europe/Dublin')
        user_tz = pytz.timezone(user_timezone)
        
        # Get Dublin timezone for the calendar event
        dublin_tz = pytz.timezone('Europe/Dublin')
        
        # Localize the naive datetimes to user's timezone
        start_dt_user = user_tz.localize(start_dt_naive)
        end_dt_user = user_tz.localize(end_dt_naive)
        
        # Convert to Dublin timezone for the calendar event
        start_dt_dublin = start_dt_user.astimezone(dublin_tz)
        end_dt_dublin = end_dt_user.astimezone(dublin_tz)
        
        # Format for Google Calendar API
        start_datetime = start_dt_dublin.isoformat()
        end_datetime = end_dt_dublin.isoformat()
        
        print(f"🕐 Timezone conversion: {user_timezone} → Europe/Dublin")
        print(f"🕐 Start: {start_dt_user} → {start_dt_dublin}")
        print(f"🕐 End: {end_dt_user} → {end_dt_dublin}")
        
    except ValueError as e:
        print(f"🚨 ERROR: Incorrect datetime format! Must be 'YYYY-MM-DD HH:MM'. Error: {e}")
        return None
    except Exception as e:
        print(f"🚨 ERROR: Timezone conversion failed: {e}")
        return None

    # Format equipment list for calendar event
    equipment_list = booking.get('equipment', [])
    if isinstance(equipment_list, list) and len(equipment_list) > 0:
        # Multiple equipment items
        equipment_names = [item.get('name', 'Unknown') for item in equipment_list]
        equipment_quantities = [item.get('quantity', 1) for item in equipment_list]
        
        # Create equipment summary for title
        if len(equipment_names) == 1:
            equipment_summary = f"{equipment_names[0]} (x{equipment_quantities[0]})"
        else:
            equipment_summary = f"{len(equipment_names)} items"
        
        # Create detailed equipment description
        equipment_details = []
        for i, (name, qty) in enumerate(zip(equipment_names, equipment_quantities)):
            equipment_details.append(f"• {name}: {qty}")
        equipment_description = "\n".join(equipment_details)
        
        event = {
            "summary": f"DCU Fotosoc Equipment Loan: {equipment_summary}",
            "description": f"Equipment Loan Request - APPROVED\n\nEquipment:\n{equipment_description}\n\nBorrower: {booking['user_email']}",
            "start": {
                "dateTime": start_datetime,
                "timeZone": "Europe/Dublin"
            },
            "end": {
                "dateTime": end_datetime,
                "timeZone": "Europe/Dublin"
            },
            "location": "DCU Fotosoc",
            "organizer": {
                "displayName": "Magdalena Kudlewska",
                "email": app.config["MAIL_DEFAULT_SENDER"]
            }
        }
    else:
        # Fallback for single equipment (backward compatibility)
        equipment_name = booking.get('equipment_name', 'Unknown Equipment')
        amount = booking.get('amount', 1)
        
        event = {
            "summary": f"DCU Fotosoc Equipment Loan: {equipment_name}",
            "description": f"Equipment Loan Request - APPROVED\n\nEquipment: {equipment_name}\nQuantity: {amount}\nBorrower: {booking['user_email']}",
            "start": {
                "dateTime": start_datetime,
                "timeZone": "Europe/Dublin"
            },
            "end": {
                "dateTime": end_datetime,
                "timeZone": "Europe/Dublin"
            },
            "location": "DCU Fotosoc",
            "organizer": {
                "displayName": "Magdalena Kudlewska",
                "email": app.config["MAIL_DEFAULT_SENDER"]
            }
        }

    try:
        event_response = service.events().insert(calendarId=CALENDAR_ID, body=event).execute()
        print("✅ Event created successfully:", event_response.get("id"))
        return event_response.get("id"), start_datetime, end_datetime
    except Exception as e:
        print(f"❌ Google Calendar API error: {e}")
        return None


import tempfile

def generate_ics_file(booking, start_datetime_dublin, end_datetime_dublin):
    """Generate an ICS calendar file for the user's personal calendar."""
    # Convert Dublin datetime to UTC for ICS format
    dublin_tz = pytz.timezone('Europe/Dublin')
    utc_tz = pytz.UTC
    
    # Parse the Dublin datetime strings and convert to UTC
    start_dt_dublin = datetime.fromisoformat(start_datetime_dublin.replace('Z', '+00:00'))
    end_dt_dublin = datetime.fromisoformat(end_datetime_dublin.replace('Z', '+00:00'))
    
    # Convert to UTC for ICS format
    start_dt_utc = start_dt_dublin.astimezone(utc_tz)
    end_dt_utc = end_dt_dublin.astimezone(utc_tz)
    
    # Format for ICS (YYYYMMDDTHHMMSSZ)
    start_ics = start_dt_utc.strftime('%Y%m%dT%H%M%SZ')
    end_ics = end_dt_utc.strftime('%Y%m%dT%H%M%SZ')
    
    # Format equipment list for ICS description
    equipment_list = booking.get('equipment', [])
    if isinstance(equipment_list, list) and len(equipment_list) > 0:
        # Multiple equipment items
        equipment_names = [item.get('name', 'Unknown') for item in equipment_list]
        equipment_quantities = [item.get('quantity', 1) for item in equipment_list]
        
        # Create equipment summary for title
        if len(equipment_names) == 1:
            equipment_summary = f"{equipment_names[0]} (x{equipment_quantities[0]})"
        else:
            equipment_summary = f"{len(equipment_names)} items"
        
        # Create detailed equipment description
        equipment_details = []
        for name, qty in zip(equipment_names, equipment_quantities):
            equipment_details.append(f"• {name}: {qty}")
        equipment_description = "\\n".join(equipment_details)
        
        summary = f"DCU Fotosoc Equipment Loan: {equipment_summary}"
        description = f"Equipment Loan Request - APPROVED\\n\\nEquipment:\\n{equipment_description}\\n\\nBorrower: {booking['user_email']}\\n\\nEquipment Officer: Magdalena Kudlewska\\nDCU Fotosoc"
    else:
        # Fallback for single equipment (backward compatibility)
        equipment_name = booking.get('equipment_name', 'Unknown Equipment')
        amount = booking.get('amount', 1)
        summary = f"DCU Fotosoc Equipment Loan: {equipment_name}"
        description = f"Equipment Loan Request - APPROVED\\n\\nEquipment: {equipment_name}\\nQuantity: {amount}\\nBorrower: {booking['user_email']}\\n\\nEquipment Officer: Magdalena Kudlewska\\nDCU Fotosoc"
    
    ics_content = f"""BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//DCU Fotosoc//Equipment Loan//EN
BEGIN:VEVENT
UID:{booking['id']}@dcufotosoc.ie
DTSTAMP:{datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%SZ')}
DTSTART:{start_ics}
DTEND:{end_ics}
SUMMARY:{summary}
DESCRIPTION:{description}
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

def send_booking_email(user_email, equipment_list, start_datetime, end_datetime, event_link, booking):
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

        # Format equipment list for email
        if isinstance(equipment_list, list) and len(equipment_list) > 0:
            # Multiple equipment items
            equipment_details = []
            total_items = 0
            for item in equipment_list:
                name = item.get('name', 'Unknown Equipment')
                quantity = item.get('quantity', 1)
                total_items += quantity
                equipment_details.append(f"• {name}: {quantity}")
            
            equipment_text = "\n".join(equipment_details)
            equipment_summary = f"{len(equipment_list)} item{'s' if len(equipment_list) != 1 else ''} (Total: {total_items})"
        else:
            # Fallback for single equipment (backward compatibility)
            equipment_name = booking.get('equipment_name', 'Unknown Equipment')
            amount = booking.get('amount', 1)
            equipment_text = f"• {equipment_name}: {amount}"
            equipment_summary = f"1 item (Total: {amount})"

        msg.body = f"""
Hey {first_name},

Great news! Your DCU Fotosoc equipment loan request has been approved.

📸 Equipment ({equipment_summary}):
{equipment_text}

📅 Loan Period: From {start_formatted} until {end_formatted}

If you have any questions or need to make changes, please reply to this email!

Kind regards,
Magdalena Kudlewska,
DCU Fotosoc Equipment Officer 25/26

https://dcufotosoc.ie/
        """

        # Attach ICS file with properly converted times
        ics_file_path = generate_ics_file(booking, start_datetime, end_datetime)
        with open(ics_file_path, "rb") as f:
            msg.attach("DCU_Fotosoc_Equipment_Loan.ics", "text/calendar", f.read())

        # Send email
        mail.send(msg)
        print(f"✅ Email sent to {user_email}")

    except Exception as e:
        print(f"❌ Failed to send email: {e}")



# ---------------- Equipment Endpoints ----------------
@app.route("/api/equipment", methods=["GET"])
def get_equipment():
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
        return jsonify(equipment_list)

@app.route('/api/equipment/<string:equipment_name>', methods=["PATCH"])
def update_equipment(equipment_name):
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
@app.route("/api/book", methods=["POST"])
def book_equipment():
        """Book equipment, sync with Google Calendar, and send email confirmation with ICS file."""
        data = request.json

        user_email = data.get("user_email")
        equipment_list = data.get("equipment", [])  # Get equipment array from frontend
        start_datetime_str = data.get("start_datetime")
        end_datetime_str = data.get("end_datetime")

        if not user_email or not equipment_list or not start_datetime_str or not end_datetime_str:
            return {"error": "Missing required fields"}, 400

        # Validate equipment list
        if not isinstance(equipment_list, list) or len(equipment_list) == 0:
            return {"error": "Equipment list must be a non-empty array"}, 400

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

        # Get current equipment from Google Sheet
        sheet_equipment = get_equipment_from_sheet()
        
        # Validate and check availability for each equipment item
        equipment_validation = []
        for item in equipment_list:
            name = item.get('name')
            quantity = int(item.get('quantity', 1))
            
            if not name:
                return {"error": "Equipment name is required for all items"}, 400
            
            # Find equipment in sheet
            eq_row = next((item for item in sheet_equipment if item.get('EQUIPMENT_NAME') == name), None)
            if not eq_row:
                return {"error": f"Equipment {name} not found in sheet"}, 400
            
            try:
                current_qty = int(eq_row.get('CURRENT_AMOUNT', eq_row.get('MAX_AMOUNT', 0)))
            except Exception:
                current_qty = 0
            
            if current_qty < quantity:
                return {"error": f"Not enough {name} available (requested: {quantity}, available: {current_qty})"}, 400
            
            equipment_validation.append({
                'name': name,
                'quantity': quantity,
                'current_qty': current_qty,
                'new_qty': current_qty - quantity
            })

        # Update quantities in Google Sheet for all equipment
        updated_equipment = []
        for item in equipment_validation:
            update_success = update_current_quantity_in_sheet(item['name'], item['new_qty'])
            if not update_success:
                # Rollback all previously updated quantities
                for rollback_item in updated_equipment:
                    update_current_quantity_in_sheet(rollback_item['name'], rollback_item['current_qty'])
                return {"error": f"Failed to update amount for {item['name']} in sheet"}, 500
            updated_equipment.append(item)

        # Create booking object for calendar and email (no database storage)
        booking_data = {
            'user_email': user_email,
            'equipment': equipment_list,  # Pass the full equipment array
            'start_datetime': start_datetime_str,  # Use original format for calendar function
            'end_datetime': end_datetime_str,      # Use original format for calendar function
            'timezone': data.get('timezone', 'Europe/Dublin'),
            'id': int(time.time())  # Generate a simple ID based on timestamp
        }

        try:
            # Sync with Google Calendar and get converted times
            calendar_result = add_booking_to_calendar(booking_data)
            if not calendar_result:
                # Rollback all quantities if calendar creation fails
                for rollback_item in updated_equipment:
                    update_current_quantity_in_sheet(rollback_item['name'], rollback_item['current_qty'])
                return {"error": "Failed to create calendar event"}, 500
            
            event_id, start_datetime_dublin, end_datetime_dublin = calendar_result
            event_link = f"https://www.google.com/calendar/event?eid={event_id}" if event_id else "N/A"

            # Send email confirmation with ICS file
            send_booking_email(user_email, equipment_list, start_datetime_dublin, end_datetime_dublin, event_link, booking_data)

            return {"message": "Booking successful", "booking_id": booking_data['id'], "event_id": event_id}, 200

        except Exception as e:
            # Rollback all quantities if any error occurs during booking process
            print(f"❌ Booking failed, rolling back quantities: {e}")
            for rollback_item in updated_equipment:
                update_current_quantity_in_sheet(rollback_item['name'], rollback_item['current_qty'])
            return {"error": f"Booking failed: {str(e)}"}, 500

      
      
@app.route("/api/book", methods=["GET"])
def get_bookings():
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

@app.route('/', methods=['GET'])
def serve_index():
    return jsonify({"status": "ok"}), 200

if __name__ == '__main__':
    app.run(debug=False)
