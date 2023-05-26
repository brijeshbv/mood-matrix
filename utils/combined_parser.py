import json
import random

def prepare_user_data():
    ms_per_sec = 1000
    with open('json_data/git_log.json', 'r') as f:
        git_commits = f.read()
        git_commits = json.loads(git_commits)
    with open('json_data/emails_log.json', 'r') as f:
        emails_json = f.read()
        emails_json = json.loads(emails_json)
    tasks = {}
    for email in emails_json:
        email_id = email['email']
        if email_id not in tasks.keys() :
            tasks[f'{email_id}'] = [{
                'type': 'email',
                'time': email['time']//ms_per_sec,
                'time_spent' : random.choice(range(1,30)),
                'content': email['content']
            }]
        else:
            tasks[f'{email_id}'].append({
                'type': 'email',
                'time': email['time']//ms_per_sec,
                'time_spent' : random.choice(range(1,30)),
                'content': email['content']
            })

    for email, data in git_commits.items():
        if email not in tasks.keys():
            tasks[email] = [{
                'type': 'git_log',
                'time': data[0]['time']//ms_per_sec,
                'time_spent' : random.choice(range(40,120)),
                'content': data[0]['content']
            }]
        else:
            tasks[email].append({
                'type': 'git_log',
                'time': data[0]['time']//ms_per_sec,
                'time_spent' : random.choice(range(40,120)),
                'content': data[0]['content']
            })

    file_path = "json_data/comnined_data.json"

    # Write JSON data to the file
    with open(file_path, 'w') as file:
        json.dump(tasks, file)
        file.write('\n')

    return tasks