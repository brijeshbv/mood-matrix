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

@mood_mtx_api_v1.route('/', methods=['GET'])
def api_get_users():
    users = get_users(20)
    return jsonify(users)


@mood_mtx_api_v1.route('/sentiment/<email>', methods=['GET'],  defaults={'year':None, 'month': None, 'day': None})
@mood_mtx_api_v1.route('/sentiment/<email>/<year>', methods=['GET'],  defaults={ 'month': None, 'day': None})
@mood_mtx_api_v1.route('/sentiment/<email>/<year>/<month>', methods=['GET'],  defaults={ 'day': None})
@mood_mtx_api_v1.route('/sentiment/<email>/<year>/<month>/<day>', methods=['GET'])
def get_sentiment(email, month, day, year):
    gitcommit = json.load(open("matrix/api/git_log.json"))
    commits = gitcommit[email]
    if len(commits) > 0:
        return matrix.api.llmbox.get_sentiment(commits[0])


@mood_mtx_api_v1.route('/summary/<email>', methods=['GET'],  defaults={'year':None, 'month': None, 'day': None})
@mood_mtx_api_v1.route('/summary/<email>/<year>', methods=['GET'],  defaults={ 'month': None, 'day': None})
@mood_mtx_api_v1.route('/summary/<email>/<year>/<month>', methods=['GET'],  defaults={ 'day': None})
@mood_mtx_api_v1.route('/summary/<email>/<year>/<month>/<day>', methods=['GET'])
def get_summary(email, month, day, year):
    gitcommit = json.load(open("matrix/api/git_log.json"))
    commits = gitcommit[email]
    if len(commits) > 0:
        return matrix.api.llmbox.get_summary(commits[0])

