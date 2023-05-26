import json
import random
from datetime import datetime

file_path = "junlog.txt"
output_file_path = "git_log.json"


commits = {}


def extract_commit_time(commit_message):
    for line in commit_message.split("\n"):
        if line.startswith("Date:"):
            date_str = line.split("Date:")[1].strip()
            commit_time = datetime.strptime(date_str, "%a %b %d %H:%M:%S %Y %z")
            # Format commit_time into datetime object
            commit_time = int(commit_time.timestamp() * 1000)
            return commit_time
    return None


def split_git_log(log_text):
    log_entries = log_text.strip().split("\n\n")
    log_dict = {}
    headers = log_entries[0::2]
    messages = log_entries[1::2]
    # enumerate headers with index
    for index, entry in enumerate(headers):
        lines = entry.split("\n")
        if len(lines) > 1:
            email = lines[1].split("<")[1].split(">")[0].strip()
            message = "\n".join(lines[4:])

            commit_time = extract_commit_time(entry)

            if commit_time is None:
                continue

            log_entry = {
                "type": "commit",
                "time": commit_time,
                "time spent": random.randint(1, 120),
                "content": messages[index],
            }

            if email in log_dict:
                log_dict[email].append(log_entry)
            else:
                log_dict[email] = [log_entry]

    return log_dict


with open(file_path, "r") as file:
    git_log = file.read()
    # print(split_git_log(git_log))

    with open(output_file_path, "w") as output_file:
        json.dump(split_git_log(git_log), output_file, default=str)

    print(f"Commits saved to {output_file_path}.")
