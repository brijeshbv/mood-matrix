from flask import Blueprint, request, jsonify
from matrix.db import get_users
from utils.combined_parser import prepare_user_data
from matrix.api.utils import expect
import datetime
import json
import itertools
import matrix.api.llmbox
from flask_cors import CORS, cross_origin
import re
mood_mtx_api_v1 = Blueprint(
    'mood_mtx_api_v1', 'mood_mtx_api_v1', url_prefix='/api/v1')

CORS(mood_mtx_api_v1, support_credentials=True)


def filter_dicts_by_date(data, year=None, month=None, day=None):
    def filter_func(item):
        time_field = item.get('time')
        # print(time_field)
        if not time_field:
            return False

        dt = datetime.datetime.fromtimestamp(time_field)
        # print(dt)
        return (year is None or dt.year == int(year)) and (month is None or dt.month == int(month)) and (
                day is None or dt.day == int(day))

    filtered_data = list(filter(filter_func, data))
    return filtered_data


@mood_mtx_api_v1.route('/users', methods=['GET'])
def api_get_users():
    gitcommit = json.load(open("json_data/combined_data.json"))
    return jsonify(list(gitcommit.keys()))


@mood_mtx_api_v1.route('/sentiment/<email>', methods=['GET'], defaults={'year': None, 'month': None, 'day': None})
@mood_mtx_api_v1.route('/sentiment/<email>/<year>', methods=['GET'], defaults={'month': None, 'day': None})
@mood_mtx_api_v1.route('/sentiment/<email>/<year>/<month>', methods=['GET'], defaults={'day': None})
@mood_mtx_api_v1.route('/sentiment/<email>/<year>/<month>/<day>', methods=['GET'])
def get_sentiment(email, year, month, day):
    gitcommit = json.load(open("json_data/combined_data.json"))
    commits = filter_dicts_by_date(gitcommit[email], year, month, day)
    if len(commits) > 0:
        return matrix.api.llmbox.get_sentiment(commits)
    return "No entries"


@mood_mtx_api_v1.route('/summary/<email>', methods=['GET'], defaults={'year': None, 'month': None, 'day': None})
@mood_mtx_api_v1.route('/summary/<email>/<year>', methods=['GET'], defaults={'month': None, 'day': None})
@mood_mtx_api_v1.route('/summary/<email>/<year>/<month>', methods=['GET'], defaults={'day': None})
@mood_mtx_api_v1.route('/summary/<email>/<year>/<month>/<day>', methods=['GET'])
def get_summary(email, year, month, day):
    gitcommit = json.load(open("json_data/combined_data.json"))
    commits = filter_dicts_by_date(gitcommit[email], year, month, day)
    if len(commits) > 0:
        return matrix.api.llmbox.get_summaries(commits)
    return "No entries"


@mood_mtx_api_v1.route('/coach/<email>', methods=['GET'], defaults={'year': None, 'month': None, 'day': None})
@mood_mtx_api_v1.route('/coach/<email>/<year>', methods=['GET'], defaults={'month': None, 'day': None})
@mood_mtx_api_v1.route('/coach/<email>/<year>/<month>', methods=['GET'], defaults={'day': None})
@mood_mtx_api_v1.route('/coach/<email>/<year>/<month>/<day>', methods=['GET'])
def get_coach(email, year, month, day):
    gitcommit = json.load(open("json_data/combined_data.json"))
    commits = filter_dicts_by_date(gitcommit[email], year, month, day)
    if len(commits) > 0:
        return matrix.api.llmbox.get_coaches(commits)
    return "No entries"

@mood_mtx_api_v1.route('/coach_agent/<email>', methods=['GET'],  defaults={'year':None, 'month': None, 'day': None})
@mood_mtx_api_v1.route('/coach_agent/<email>/<year>', methods=['GET'],  defaults={ 'month': None, 'day': None})
@mood_mtx_api_v1.route('/coach_agent/<email>/<year>/<month>', methods=['GET'],  defaults={ 'day': None})
@mood_mtx_api_v1.route('/coach_agent/<email>/<year>/<month>/<day>', methods=['GET'])
def coach_user(email, year, month, day):
    gitcommit = json.load(open("json_data/combined_data.json"))
    commits = filter_dicts_by_date(gitcommit[email], year, month, day)
    if len(commits) > 0:
        return matrix.api.llmbox.coach_user(email, commits)
    return "No entries"

@mood_mtx_api_v1.route('/sentiment_overtime/<email>', methods=['GET'],  defaults={'year':datetime.datetime.today().year, 'month': datetime.datetime.today().month, 'day': datetime.datetime.today().day})
@mood_mtx_api_v1.route('/sentiment_overtime/<email>/<year>', methods=['GET'],  defaults={ 'month': datetime.datetime.today().month, 'day': datetime.datetime.today().day})
@mood_mtx_api_v1.route('/sentiment_overtime/<email>/<year>/<month>', methods=['GET'],  defaults={ 'day': datetime.datetime.today().day})
@mood_mtx_api_v1.route('/sentiment_overtime/<email>/<year>/<month>/<day>', methods=['GET'])
def get_sentiment_overtime(email, year, month, day):
    gitcommit = json.load(open("json_data/combined_data.json"))
    current = datetime.date(int(year),int(month),int(day))   #datetime.datetime.today()
    dates = [current - datetime.timedelta(days = x) for x in range(70)]  #go for 70 days
    sentiments = [] #tuples(POSITIVE, NEGATIVE, NEUTRAL)
    for date in dates:
        commits = filter_dicts_by_date(gitcommit[email], date.year, date.month, date.day)
        if len(commits) > 0:
            today = matrix.api.llmbox.get_sentiment(commits).get('output_text')
            today = [[int(j) for j in i.split() if j.isdigit()] for i in today.split('\n')[1:]]
            today = list(itertools.chain(*today))
            print(today)
            sentiments.append(today)
        else:
            sentiments.append([0,0,0])
    return sentiments


@mood_mtx_api_v1.route('/raw_data', methods=['GET'])
def get_raw_data():
    data = prepare_user_data()
    return jsonify(data)


@cross_origin(supports_credentials=True)
@mood_mtx_api_v1.route('/users_rating', methods=['GET'])
def api_get_user_with_rating():
    gitcommit = json.load(open("json_data/combined_data.json"))
    email_ids = list(gitcommit.keys())
    email_dict = []
    paginate = 0
    response = {}
    for email_id in email_ids:
        dictionary = {"email": email_id,
                    'name':email_id.split('@')[0]}
        if paginate < 100:
            context = filter_dicts_by_date(gitcommit[email_id])
            if len(context) > 0:
                summary = matrix.api.llmbox.get_sentiment(context)
                if summary is not None:
                    dictionary['rating'] = summary['output_text']

        email_dict.append(dictionary)
        paginate += 1
    pos, neg, neut = 0, 0 , 0
    for summary in email_dict:
        if 'rating' in summary.keys():
            positive , neutral, negative  = re.findall(r'\d+', summary['rating'])
            pos += int(positive)
            neg += int(negative)
            neut += int(neutral)

    response['org_summary'] = {
        'positive': pos,
        'negative': neg,
        'neutral': neut,
    }
    response['data'] = email_dict
    response = jsonify(response)
    response.headers.add("Access-Control-Allow-Origin", '*')
    response.headers.add("Access-Control-Allow-Credentials", True)
    return response
