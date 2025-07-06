import requests
import os

from dotenv import load_dotenv
load_dotenv()

backend_url = os.getenv("backend_url")
sentiment_analyzer_url = os.getenv("sentiment_analyzer_url")


def get_request(endpoint, **kwargs):
    params = ""
    if kwargs:
        params = "&".join(f"{k}={v}" for k, v in kwargs.items())
    request_url = backend_url + endpoint + "?" + params
    response = requests.get(request_url)
    return response.json()


def post_review(data_dict):
    request_url = backend_url + "/insert_review"
    response = requests.post(request_url, json=data_dict)
    return response.json()
    print("Network exception occurred")


def analyze_review_sentiments(text):
    request_url = sentiment_analyzer_url + "analyze/" + text
    try:
        print(f"[DEBUG] Sentiment request URL: {request_url}")
        response = requests.get(request_url)
        print(f"[DEBUG] Response text: {response.text}")
        return response.json()
    except Exception as err:
        print(f"[ERROR] Sentiment analysis failed: {err}")
        return {"sentiment": "neutral"}

