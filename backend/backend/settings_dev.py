from .settings import *

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'Melixer_dev',
        'USER': 'carl_dev',
        'PASSWORD': '*tBh_Ybxm.~::Zo',
        'HOST': 'roseweb.local',
        'PORT': '3306',
    },
}

# Allow React dev server
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",   # Create React App
    "http://127.0.0.1:3000",   # Create React App
    "http://localhost:5173",   # Vite
    "http://127.0.0.1:5173",   # Vite
]