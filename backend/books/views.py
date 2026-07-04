from django.shortcuts import render
from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from .models import Book
from .serializers import BookSerializer

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all().order_by('title')
    serializer_class = BookSerializer
    permission_class = [IsAuthenticated]
    # Allow filtering and searching
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'author', 'genre', 'isbn', 'series_name']
    ordering_fields = ['title', 'author', 'publication_year', 'rating', 'created_at']
    
    def get_queryset(self):
        return Book.objects.filter(user=self.request.user).order_by('title')