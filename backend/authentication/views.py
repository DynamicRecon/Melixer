from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.authtoken.models import Token


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    username = request.data.get('username')
    password = request.data.get('password')
    email    = request.data.get('email','')

    if not username or not password:
        return Response({'error':'Username or Password are required'}, status=status.HTTP_400_BAD_REQUEST)
    
    if User.objects.filter(username=username).exists():
        return Response({'error': 'User already exists.'}, status=status.HTTP_400_BAD_REQUEST)
    
    user = User.objects.create_user(username=username,password=password,email=email)
    token, _ = Token.objects.get_or_create(user=user)

    return Response({'token':token.key, 'username': user.username}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)

    if not user:
        return Response({'error':'invalid username or password'}, status=status.HTTP_401_UNAUTHORIZED)
    
    token, _ = Token.objects.get_or_create(user=user)

    return Response({'token': token.key, 'user':user.username})


@api_view(['POST'])
def logout(request):
    request.user.auth_token_delete()
    return Response({'message':'logged out successfully'})

@api_view(['GET'])
def  me(request):
    return Response({'username':request.user.username, 'email': request.user.email})