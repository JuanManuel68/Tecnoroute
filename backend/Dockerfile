FROM python:3.11

# Evitar buffer en logs
ENV PYTHONUNBUFFERED 1

# Crear directorio
WORKDIR /app

# Instalar dependencias
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copiar todo el backend
COPY . /app/

# Exponer el puerto (Railway usará PORT automáticamente)
EXPOSE 8000

# Comando default para correr Django
CMD python manage.py migrate && python manage.py runserver 0.0.0.0:$PORT
