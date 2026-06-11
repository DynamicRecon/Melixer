from django.shortcuts import render
from rest_framework import viewsets, filters
from .models import Book
from .serializers import BookSerializer

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all().order_by('title')
    serializer_class = BookSerializer

    # Allow filtering and searching
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'author', 'genre', 'isbn', 'series_name']
    ordering_fields = ['title', 'author', 'publication_year', 'rating', 'created_at']