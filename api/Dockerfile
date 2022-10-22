# Snippet taken from https://blog.logrocket.com/build-deploy-flask-app-using-docker/
FROM python:3.10-alpine
COPY ./requirements.txt /app/requirements.txt
WORKDIR /app
RUN pip install -r requirements.txt
COPY . /app
CMD python app.py
