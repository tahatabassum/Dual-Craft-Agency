import os
import json
import urllib.request
import urllib.error
import html
from dotenv import load_dotenv

def send_contact_email(name: str, email: str, phone: str, message: str):
    # Load .env file dynamically to pick up changes without needing to restart the server
    load_dotenv(override=True)
    
    resend_api_key = os.getenv("RESEND_API_KEY")
    if not resend_api_key:
        print("[WARNING] RESEND_API_KEY not found in environment variables. Email notification skipped.")
        return False
        
    to_email = os.getenv("CONTACT_NOTIFICATION_EMAIL", "dualcraft.agency@gmail.com")
    
    # If they verify their domain later, they can set RESEND_FROM_EMAIL. 
    # Otherwise, it must use onboarding@resend.dev for testing.
    from_email = os.getenv("RESEND_FROM_EMAIL", "Dual Craft <onboarding@resend.dev>")
    
    # Escape user inputs to prevent XSS/HTML Injection inside notification email readers
    escaped_name = html.escape(name)
    escaped_email = html.escape(email)
    escaped_phone = html.escape(phone) if phone else 'Not provided'
    escaped_message = html.escape(message)
    
    subject = f"New Lead: {escaped_name} contacted Dual Craft"
    
    html_content = f"""
    <h3>New Contact Form Submission</h3>
    <p><strong>Name:</strong> {escaped_name}</p>
    <p><strong>Email:</strong> {escaped_email}</p>
    <p><strong>Phone:</strong> {escaped_phone}</p>
    <p><strong>Message:</strong></p>
    <p style="white-space: pre-wrap; padding: 10px; background: #f5f5f0; border-radius: 5px;">{escaped_message}</p>
    """
    
    url = "https://api.resend.com/emails"
    headers = {
        "Authorization": f"Bearer {resend_api_key}",
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }
    
    data = {
        "from": from_email,
        "to": [to_email],
        "subject": subject,
        "html": html_content
    }
    
    try:
        req = urllib.request.Request(
            url, 
            data=json.dumps(data).encode("utf-8"), 
            headers=headers,
            method="POST"
        )
        with urllib.request.urlopen(req) as response:
            res_body = response.read().decode("utf-8")
            print(f"[SUCCESS] Email sent successfully via Resend: {res_body}")
            return True
    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8")
        print(f"[ERROR] Failed to send email via Resend (HTTPError): {e.code} - {err_body}")
        return False
    except Exception as e:
        print(f"[ERROR] Failed to send email via Resend: {str(e)}")
        return False
