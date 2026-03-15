
import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

class EmailService:
    def __init__(self):
        # Configuration from environment variables
        self.host = os.environ.get("SMTP_HOST", "smtp.gmail.com")
        self.port = int(os.environ.get("SMTP_PORT", 587))
        self.user = os.environ.get("SMTP_USER", "")
        self.password = os.environ.get("SMTP_PASS", "")
        self.from_email = os.environ.get("SMTP_FROM", "notifications@churnsense.ai")

    def send_email(self, to_email: str, subject: str, html_content: str):
        """Sends an HTML email to the specified recipient."""
        if not self.user or not self.password:
            # Fallback for local development when SMTP is not configured
            print(f"--- MOCK EMAIL SENT ---")
            print(f"To: {to_email}")
            print(f"Subject: {subject}")
            print(f"Body: {html_content[:200]}...")
            print(f"-----------------------")
            return True

        try:
            msg = MIMEMultipart()
            msg['From'] = self.from_email
            msg['To'] = to_email
            msg['Subject'] = subject
            msg.attach(MIMEText(html_content, 'html'))

            with smtplib.SMTP(self.host, self.port) as server:
                server.starttls()
                server.login(self.user, self.password)
                server.send_message(msg)
            return True
        except Exception as e:
            print(f"CRITICAL: Failed to send email to {to_email}: {e}")
            return False

    def send_otp_email(self, to_email: str, otp: str, user_name: str):
        subject = f"ChurnSense AI: Verification Code {otp}"
        html = f"""
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #2563eb;">ChurnSense AI</h2>
            <p>Hello {user_name},</p>
            <p>Your verification code for logging into the ChurnSense Intelligence Platform is:</p>
            <div style="background: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #111827;">
                {otp}
            </div>
            <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
                This code will expire in 15 minutes. If you did not request this, please ignore this email.
            </p>
        </div>
        """
        return self.send_email(to_email, subject, html)

    def send_prediction_alert(self, to_email: str, customer_name: str, risk_level: str, probability: float, insight: str):
        subject = f"Churn Alert: {customer_name} identified as {risk_level} Risk"
        color = "#ef4444" if risk_level == "High" else "#f59e0b" if risk_level == "Medium" else "#10b981"
        html = f"""
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <div style="display: flex; align-items: center; margin-bottom: 20px;">
                <h2 style="color: #2563eb; margin: 0;">ChurnSense AI Analysis</h2>
            </div>
            <p>A new high-fidelity churn analysis has been completed for <b>{customer_name}</b>.</p>
            
            <div style="margin: 20px 0; padding: 15px; border-left: 5px solid {color}; background: #f9fafb;">
                <p style="margin: 0; font-weight: bold; color: {color}; text-transform: uppercase; font-size: 12px;">Risk Level</p>
                <h3 style="margin: 5px 0;">{risk_level} ({probability}%)</h3>
            </div>

            <h4 style="color: #374151;">Executive Insight</h4>
            <p style="color: #4b5563; font-style: italic;">"{insight}"</p>
            
            <div style="margin-top: 30px; text-align: center;">
                <a href="#" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">View Full Analysis</a>
            </div>
        </div>
        """
        return self.send_email(to_email, subject, html)

email_service = EmailService()
