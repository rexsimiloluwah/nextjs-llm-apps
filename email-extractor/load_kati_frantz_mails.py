from __future__ import print_function

import re
import html 
import base64
import os.path
from typing import Optional 

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

# If modifying these scopes, delete the file token.json.
SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']

def clean_filename(filename: str, max_length: Optional[int]=100):
    """Removes unwanted characters from a filename.

    Args:
        filename (str): The filename to be cleaned
        max_length (int): Max length parameter for truncating the filename
    """
    # Remove non-alphanumeric characters and replace spaces with underscores
    filename = re.sub(r'[^\w\s-]', '', filename).strip().replace(' ', '_')
    
    # Truncate the filename to the specified max length
    filename = filename[:max_length]
    
    return filename

def remove_whitespace(text: str):
    """Remove unnecessary whitespace from text"""
    # Remove leading and trailing spaces and newlines
    cleaned_text = text.strip()
    
    # Remove multiple spaces and newlines with a single space
    cleaned_text = re.sub(r'\s+', ' ', cleaned_text)
    cleaned_text = re.sub(r'\n+', '\n', text)
    
    return cleaned_text

def write_mail_to_txt(output_dir: str, filename: str, mail_body: str):
    """Writes the mail body to a file.
    
    Args:
        output_dir (str): The output directory
        filename (str): The filename
        mail_body (str): The mail body
    """
    if not os.path.isdir(output_dir):
        os.mkdir(output_dir)

    with open(os.path.join(output_dir, filename), "w+", encoding="utf-8") as file:
        file.write(mail_body)

def fetch_emails(service, sender_email: str):
    """Fetch the mails from a sender's email address.
    
    Args:
        sender_email (str): The sender's email address
    """
    try:
        results = service.users().messages().list(userId='me', q=f'from:{sender_email}').execute()
        messages = results.get('messages', [])
        if not messages:
            print('No emails found.')
            return
        print('Emails from', sender_email, ':')
        for message in messages:
            msg = service.users().messages().get(userId='me', id=message['id']).execute()
            
            subject = [header['value'] for header in msg['payload']['headers'] if header['name'] == 'Subject'][0]
            email_body = msg["payload"]["parts"][0]["body"]["data"]

            decoded_body = base64.urlsafe_b64decode(email_body).decode("utf-8")

            subject = html.unescape(subject)
            body = html.unescape("".join(decoded_body.split("\n")))

            filename = clean_filename(subject)

            write_mail_to_txt("./docs", f"{filename}.txt", body)

    except Exception as e:
        print('An error occurred:', e)

def main():
    """Shows basic usage of the Gmail API.
    
    Lists the user's Gmail labels.
    """
    creds = None
    # The file token.json stores the user's access and refresh tokens, and is
    # created automatically when the authorization flow completes for the first
    # time.
    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        # Save the credentials for the next run
        with open('token.json', 'w') as token:
            token.write(creds.to_json())

    try:
        # Call the Gmail API
        service = build('gmail', 'v1', credentials=creds)
        fetch_emails(service, "frantz@mailcoach.cloud")

    except HttpError as error:
        # TODO - Handle errors from gmail API.
        print(f'An error occurred: {error}')


if __name__ == '__main__':
    main()