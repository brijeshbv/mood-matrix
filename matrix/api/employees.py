from flask import Blueprint, request, jsonify
from matrix.db import get_users

from flask_cors import CORS
from matrix.api.utils import expect
from datetime import datetime
import json
import matrix.api.llmbox

mood_mtx_api_v1 = Blueprint(
    'mood_mtx_api_v1', 'mood_mtx_api_v1', url_prefix='/api/v1')

CORS(mood_mtx_api_v1)

def filter_dicts_by_date(data, year=None, month=None, day=None):
    def filter_func(item):
        time_field = item.get('time')
        # print(time_field)
        if not time_field:
            return False

        dt = datetime.fromtimestamp(time_field/1000)
        # print(dt)
        return (year is None or dt.year == int(year)) and (month is None or dt.month == int(month)) and (
                    day is None or dt.day == int(day))

    filtered_data = list(filter(filter_func, data))
    return filtered_data

@mood_mtx_api_v1.route('/users', methods=['GET'])
def api_get_users():
    gitcommit = json.load(open("json_data/git_log.json"))
    return jsonify(list(gitcommit.keys()))


@mood_mtx_api_v1.route('/sentiment/<email>', methods=['GET'],  defaults={'year':None, 'month': None, 'day': None})
@mood_mtx_api_v1.route('/sentiment/<email>/<year>', methods=['GET'],  defaults={ 'month': None, 'day': None})
@mood_mtx_api_v1.route('/sentiment/<email>/<year>/<month>', methods=['GET'],  defaults={ 'day': None})
@mood_mtx_api_v1.route('/sentiment/<email>/<year>/<month>/<day>', methods=['GET'])
def get_sentiment(email, year, month, day):
    gitcommit = json.load(open("json_data/git_log.json"))
    commits = filter_dicts_by_date(gitcommit[email], year, month, day)
    if len(commits) > 0:
        return matrix.api.llmbox.get_sentiment(commits[0])
    return []


@mood_mtx_api_v1.route('/summary/<email>', methods=['GET'],  defaults={'year':None, 'month': None, 'day': None})
@mood_mtx_api_v1.route('/summary/<email>/<year>', methods=['GET'],  defaults={ 'month': None, 'day': None})
@mood_mtx_api_v1.route('/summary/<email>/<year>/<month>', methods=['GET'],  defaults={ 'day': None})
@mood_mtx_api_v1.route('/summary/<email>/<year>/<month>/<day>', methods=['GET'])
def get_summary(email, year, month, day):
    gitcommit = json.load(open("json_data/git_log.json"))
    commits = filter_dicts_by_date(gitcommit[email], year, month, day)
    if len(commits) > 0:
        return matrix.api.llmbox.get_summary(commits[0])
    return []

@mood_mtx_api_v1.route('/coach/<email>', methods=['GET'],  defaults={'year':None, 'month': None, 'day': None})
@mood_mtx_api_v1.route('/coach/<email>/<year>', methods=['GET'],  defaults={ 'month': None, 'day': None})
@mood_mtx_api_v1.route('/coach/<email>/<year>/<month>', methods=['GET'],  defaults={ 'day': None})
@mood_mtx_api_v1.route('/coach/<email>/<year>/<month>/<day>', methods=['GET'])
def get_coach(email, year, month, day):
    gitcommit = json.load(open("json_data/git_log.json"))
    commits = filter_dicts_by_date(gitcommit[email], year, month, day)
    if len(commits) > 0:
        return matrix.api.llmbox.get_coach(commits[0])
    return []
