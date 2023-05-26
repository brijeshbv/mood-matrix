import re
import sys
import json
from datetime import datetime
import dataclasses
from dataclasses import dataclass

@dataclass
class Email:
    email: str
    date: datetime
    content: str

def parse_txt(filepath):
    file = open(filepath)
    content = file.read()
    email_contents = content.split('\nFrom ')
    email_contents[0] = email_contents[0][5:]   #remove the From from the first entry

    email_array = []
    for email in email_contents:
        #get email
        email = email.split('\n')
        first_line = email[0].split(' ')
        #print(first_line)
        email_str = '@'.join(first_line[0:1] + first_line[2:3])
        #get date
        date = datetime.strptime(' '.join(first_line[4:]).strip(), "%a %b %d %H:%M:%S %Y")
        #get content(body + subject)
        body = '\n'.join(email[3:])
        pattern = r'In-Reply-To:(.*?)(?=^Message-ID:[^\n]*$)^(Message-ID:[^\n]*$)'
        body = re.sub(pattern, '', body, flags=re.DOTALL|re.MULTILINE)

        email_element = Email(email_str, date, body)
        email_array.append(email_element)
    return email_array

#encoding datetime to JSON
class DateTimeEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime):
            return obj.timestamp() * 1000
        return super().default(obj)


#parse text to dataframe
def parse_to_json(email_array):
    #convert to dict
    email_dicts = [dataclasses.asdict(email) for email in email_array]
    with open("emails.json", "w") as file:
        json.dump(email_dicts, file, indent=4, cls=DateTimeEncoder)

#arguments for this python script in just filepath to email logs txt file
arguments = sys.argv
email_array = parse_txt(arguments[1])
parse_to_json(email_array)

