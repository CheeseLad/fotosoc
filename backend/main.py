from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_mail import Mail, Message
from flask_restx import Api, Resource, fields
from datetime import datetime
from googleapiclient.discovery import build
from google.oauth2 import service_account
import os
import time
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
import tempfile

from dotenv import load_dotenv

# Load environment variables from a .env file if present
load_dotenv()

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ---------------- Flask Configuration ----------------
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///equipment.db'  # Use your database path
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Flask-Mail configuration (Environment Variables)
app.config['MAIL_SERVER'] = os.environ.get('MAIL_SERVER', 'smtp.purelymail.com')
app.config['MAIL_PORT'] = int(os.environ.get('MAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = os.environ.get('MAIL_USE_TLS', 'True') == 'True'
app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.environ.get('MAIL_DEFAULT_SENDER', 'loans@dcufotosoc.ie')
app.config['MAIL_REPLY_TO'] = os.environ.get('MAIL_REPLY_TO', 'equipment@dcufotosoc.ie')

# Google Calendar Configuration (Environment Variables)
SERVICE_ACCOUNT_FILE = os.environ.get('SERVICE_ACCOUNT_FILE', './credentials.json')
SCOPES = ["https://www.googleapis.com/auth/calendar"]
CALENDAR_ID = os.environ.get('CALENDAR_ID')

# Authenticate Google Calendar API
credentials = service_account.Credentials.from_service_account_file(
    SERVICE_ACCOUNT_FILE, scopes=SCOPES
)
service = build("calendar", "v3", credentials=credentials)


db = SQLAlchemy(app)
mail = Mail(app)

# Swagger API setup
api = Api(app, version='1.0', title='Equipment Booking API', description='API for booking and managing equipment')

ns = api.namespace('api', description="Operations for booking and managing equipment")

# ---------------- Equipment Model ----------------
class Equipment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    quantity = db.Column(db.Integer, default=0)
    image = db.Column(db.String(255), nullable=True, default="placeholder.jpg")

    def __repr__(self):
        return f'<Equipment {self.name}: {self.quantity}>'
      
class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_email = db.Column(db.String(120), nullable=False)
    equipment_name = db.Column(db.String(80), nullable=False)
    quantity = db.Column(db.Integer, default=1)
    start_datetime = db.Column(db.String(25), nullable=False)
    end_datetime = db.Column(db.String(25), nullable=False)


# ---------------- API Models for Swagger ----------------
equipment_model = api.model('Equipment', {
    'id': fields.Integer(description='Equipment ID'),
    'name': fields.String(required=True, description='Name of the equipment'),
    'quantity': fields.Integer(required=True, description='Number of available items')
})

equipment_update_model = api.model('EquipmentUpdate', {
    'name': fields.String(description='New name for the equipment'),
    'quantity': fields.Integer(description='New quantity')
})

booking_model = api.model("Booking", {
    "user_email": fields.String(required=True, description="User's email"),
    "equipment": fields.String(required=True, description="Equipment name"),
    "quantity": fields.Integer(required=True, description="Quantity requested"),
    "start_datetime": fields.String(required=True, description="Start datetime (YYYY-MM-DD HH:MM)"),
    "end_datetime": fields.String(required=True, description="End datetime (YYYY-MM-DD HH:MM)")
})

import json

def add_booking_to_calendar(booking):
    try:
        start_datetime = datetime.strptime(booking.start_datetime, "%Y-%m-%dT%H:%M:%S%z").isoformat()
        end_datetime = datetime.strptime(booking.end_datetime, "%Y-%m-%dT%H:%M:%S%z").isoformat()
    except ValueError:
        print("🚨 ERROR: Incorrect datetime format! Must be 'YYYY-MM-DD HH:MM'")
        return None

    event = {
        "summary": f"Booking: {booking.equipment_name}",
        "description": f"User: {booking.user_email}\nQuantity: {booking.quantity}",
        "start": {
            "dateTime": start_datetime,
            "timeZone": "UTC"
        },
        "end": {
            "dateTime": end_datetime,
            "timeZone": "UTC"
        },
    }

    print("📌 Google Calendar Event Request:", json.dumps(event, indent=4))

    try:
        event_response = service.events().insert(calendarId=CALENDAR_ID, body=event, sendUpdates="all").execute()
        print("✅ Event created successfully:", event_response)
        return event_response.get("id")
    except Exception as e:
        print(f"❌ Google Calendar API error: {e}")
        return None


from flask_mail import Message
import tempfile

def generate_ics_file(booking):
    """Generate an ICS calendar file for the user's personal calendar."""
    ics_content = f"""BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//YourApp//Booking//EN
BEGIN:VEVENT
UID:{booking.id}@yourapp.com
DTSTAMP:{datetime.utcnow().strftime('%Y%m%dT%H%M%SZ')}
DTSTART:{booking.start_datetime.replace('-', '').replace(':', '')}
DTEND:{booking.end_datetime.replace('-', '').replace(':', '')}
SUMMARY:Booking: {booking.equipment_name}
DESCRIPTION: User: {booking.user_email}\\nQuantity: {booking.quantity}
END:VEVENT
END:VCALENDAR
"""

    # Create a temporary ICS file
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".ics")
    with open(temp_file.name, "w") as f:
        f.write(ics_content)

    return temp_file.name  # Return file path


def send_booking_email(user_email, equipment_name, quantity, start_datetime, end_datetime, event_link, booking):
    """Send an email confirmation with an ICS file for adding to a personal calendar."""
    try:
        msg = Message(
            subject="Booking Confirmation - Equipment Rental",
            sender=app.config["MAIL_DEFAULT_SENDER"],
            reply_to=app.config["MAIL_REPLY_TO"],
            recipients=[user_email]
        )

        msg.body = f"""
        Hello,

        Your booking has been confirmed!

        📌 Equipment: {equipment_name}
        📅 Start: {start_datetime}
        ⏳ End: {end_datetime}
        🔢 Quantity: {quantity}

        You can view your booking in your Google Calendar:
        {event_link}

        Alternatively, import the attached ICS file into your calendar.

        Thank you for using our service!
        """

        # Attach ICS file
        ics_file_path = generate_ics_file(booking)
        with open(ics_file_path, "rb") as f:
            msg.attach("booking.ics", "text/calendar", f.read())

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
        """List all equipment"""
        equipment = Equipment.query.all()
        return [
            {
                "id": eq.id,
                "name": eq.name,
                "quantity": eq.quantity,
                "image_url": f"http://127.0.0.1:5000/uploads/{eq.image}"
            }
            for eq in equipment
        ]

    def post(self):
        """Add new equipment with an optional image"""
        name = request.form.get("name")
        quantity = request.form.get("quantity", 0, type=int)
        image = request.files.get("image")

        if not name:
            return {"error": "Equipment name is required"}, 400

        # Save uploaded file or use default placeholder
        if image:
            filename = secure_filename(image.filename)
            image.save(os.path.join(app.config["UPLOAD_FOLDER"], filename))
        else:
            filename = "placeholder.jpg"

        new_equipment = Equipment(name=name, quantity=quantity, image=filename)
        db.session.add(new_equipment)
        db.session.commit()
        return {"message": "Equipment added", "id": new_equipment.id}, 201

@ns.route("/uploads/<filename>")
class Uploads(Resource):
    def get(self, filename):
        """Serve uploaded images"""
        return send_from_directory(app.config["UPLOAD_FOLDER"], filename)


@ns.route('/equipment/<int:equipment_id>')
class EquipmentItem(Resource):
    @api.expect(equipment_update_model)
    def patch(self, equipment_id):
        """Update an existing equipment item"""
        equipment = Equipment.query.get(equipment_id)
        if not equipment:
            return {'error': 'Equipment not found'}, 404

        data = request.json
        if 'name' in data:
            equipment.name = data['name']
        if 'quantity' in data:
            equipment.quantity = data['quantity']

        db.session.commit()
        return {'message': 'Equipment updated successfully'}, 200

    def delete(self, equipment_id):
        """Remove equipment"""
        equipment = Equipment.query.get(equipment_id)
        if not equipment:
            return {'error': 'Equipment not found'}, 404

        db.session.delete(equipment)
        db.session.commit()
        return {'message': 'Equipment removed'}, 200


# ---------------- Booking Endpoint ----------------
@ns.route("/book")
class EquipmentBooking(Resource):
    @api.expect(booking_model)
    def post(self):
        """Book equipment, sync with Google Calendar, and send email confirmation with ICS file."""
        data = request.json

        user_email = data.get("user_email")
        equipment_name = data.get("equipment")
        quantity = data.get("quantity", 1)
        start_datetime_str = data.get("start_datetime")
        end_datetime_str = data.get("end_datetime")

        if not user_email or not equipment_name or not start_datetime_str or not end_datetime_str:
            return {"error": "Missing required fields"}, 400

        try:
            start_datetime = datetime.strptime(start_datetime_str, "%Y-%m-%d %H:%M").isoformat() + "Z"
            end_datetime = datetime.strptime(end_datetime_str, "%Y-%m-%d %H:%M").isoformat() + "Z"
        except ValueError:
            return {"error": "Invalid date/time format. Use 'YYYY-MM-DD HH:MM'."}, 400

        if end_datetime <= start_datetime:
            return {"error": "End date/time must be after start date/time"}, 400

        equipment = Equipment.query.filter_by(name=equipment_name).first()
        if not equipment or equipment.quantity < quantity:
            return {"error": f"Not enough {equipment_name} available"}, 400

        equipment.quantity -= quantity
        new_booking = Booking(
            user_email=user_email,
            equipment_name=equipment_name,
            quantity=quantity,
            start_datetime=start_datetime,
            end_datetime=end_datetime
        )

        db.session.add(new_booking)
        db.session.commit()

        # Sync with Google Calendar
        event_id = add_booking_to_calendar(new_booking)
        event_link = f"https://www.google.com/calendar/event?eid={event_id}" if event_id else "N/A"

        # Send email confirmation with ICS file
        send_booking_email(user_email, equipment_name, quantity, start_datetime, end_datetime, event_link, new_booking)

        return {"message": "Booking successful", "booking_id": new_booking.id, "event_id": event_id}, 200

      
      
    def get(self):
        """List all bookings"""
        bookings = Booking.query.all()
        return [
            {
                "id": booking.id,
                "user_email": booking.user_email,
                "equipment_name": booking.equipment_name,
                "quantity": booking.quantity,
                "start_datetime": booking.start_datetime,
                "end_datetime": booking.end_datetime
            }
            for booking in bookings
        ]


@ns.route('/book/<int:booking_id>')
class CancelBooking(Resource):
    def delete(self, booking_id):
        """Cancel a booking and restore equipment quantity"""
        booking = Booking.query.get(booking_id)
        if not booking:
            return {'error': 'Booking not found'}, 404

        equipment = Equipment.query.filter_by(name=booking.equipment_name).first()
        if equipment:
            equipment.quantity += booking.quantity

        db.session.delete(booking)
        db.session.commit()

        return {'message': 'Booking canceled and equipment restored'}, 200
      
@ns.route("/sync_calendar")
class SyncCalendar(Resource):
    def post(self):
        """Clear Google Calendar and sync all bookings"""
        
        # Step 1: Fetch all events from Google Calendar
        try:
            events = service.events().list(calendarId=CALENDAR_ID).execute()
            for event in events.get("items", []):
                service.events().delete(calendarId=CALENDAR_ID, eventId=event["id"]).execute()
                time.sleep(0.1)
            print("✅ All previous events deleted from Google Calendar.")
        except Exception as e:
            print(f"❌ Error while clearing calendar: {e}")
            return {"error": "Failed to clear calendar"}, 500

        # Step 2: Sync database bookings to Google Calendar
        bookings = Booking.query.all()
        for booking in bookings:
            add_booking_to_calendar(booking)

        return {"message": "Calendar cleared and all bookings synced"}, 200



# Initialize database
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)
