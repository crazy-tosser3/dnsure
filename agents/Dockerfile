FROM python:3.14

WORKDIR /app

COPY ./requirements.txt /app

RUN pip install -r requirements.txt

EXPOSE 8000


CMD [ "fastapi run" ]