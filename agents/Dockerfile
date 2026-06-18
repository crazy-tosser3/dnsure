FROM python:3.14

WORKDIR /app

COPY ./requirements.txt /app

RUN pip install --no-cache-dir -r requirements.txt

COPY . .


CMD [ "fastapi", "run", "--port", "8001" ]
