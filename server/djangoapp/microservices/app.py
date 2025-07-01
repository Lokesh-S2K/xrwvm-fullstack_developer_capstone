from flask import Flask
from nltk.sentiment import SentimentIntensityAnalyzer
import nltk
import json

nltk.download('vader_lexicon')

app = Flask("Sentiment Analyzer")
sia = SentimentIntensityAnalyzer()

@app.get('/')
def home():
    return "Welcome to the Sentiment Analyzer. Use /analyze/<text>"

@app.get('/analyze/<input_txt>')
def analyze_sentiment(input_txt):
    scores = sia.polarity_scores(input_txt)
    pos, neg, neu = float(scores['pos']), float(scores['neg']), float(scores['neu'])

    if neg > pos and neg > neu:
        sentiment = "negative"
    elif neu > neg and neu > pos:
        sentiment = "neutral"
    else:
        sentiment = "positive"

    return json.dumps({"sentiment": sentiment})

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)

