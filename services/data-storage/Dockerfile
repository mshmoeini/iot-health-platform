FROM python:3.11-slim

WORKDIR /app

# برای اینکه print ها فوری دیده بشن
ENV PYTHONUNBUFFERED=1

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# کل src رو بیار داخل کانتینر
COPY src ./src

CMD ["python", "-u", "src/main.py"]
