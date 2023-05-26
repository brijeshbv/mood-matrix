from flask import Blueprint, request, jsonify
from matrix.db import get_users

from flask_cors import CORS
from matrix.api.utils import expect
from datetime import datetime


mood_mtx_api_v1 = Blueprint(
    'mood_mtx_api_v1', 'mood_mtx_api_v1', url_prefix='/api/v1')

CORS(mood_mtx_api_v1)

@mood_mtx_api_v1.route('/', methods=['GET'])
def api_get_users():
    users = get_users(20)
    return jsonify(users)


