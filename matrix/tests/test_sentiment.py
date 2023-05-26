import pytest
from matrix.api import llmbox

def test_get_sentiment_positive():
    content = "I love this product! It's amazing."
    data = {'content': content}
    sentiment = llmbox.get_sentiment(data)
    assert sentiment == 'positive'

def test_get_sentiment_negative():
    content = "This movie is terrible. I hated it."
    data = {'content': content}
    sentiment = llmbox.get_sentiment(data)
    assert sentiment == 'negative'

def test_get_sentiment_neutral():
    content = "This book is okay. Not too good, not too bad."
    data = {'content': content}
    sentiment = llmbox.get_sentiment(data)
    assert sentiment == 'neutral'
