FROM python:3.8-slim
WORKDIR /app
COPY . .
RUN pip install flask nltk && python -c "import nltk; nltk.download('vader_lexicon')"
CMD ["python", "app.py"]
