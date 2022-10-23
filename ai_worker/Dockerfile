FROM bitnami/scikit-learn-intel:latest
COPY ./requirements.txt /app/requirements.txt
WORKDIR /app
RUN pip install -r requirements.txt
COPY . /app
CMD python app.py
