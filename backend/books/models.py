from django.db import models

# Create your models here.

class Book(models.Model):
    #biblographic info
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    publisher = models.CharField(max_length=255, blank=True, null=True)
    publication_year = models.IntegerField(blank=True, null=True)
    isbn = models.CharField(max_length=13, unique=True, blank=True, null=True)
    genre = models.CharField(max_length=100, blank=True, null=True)
    language = models.CharField(max_length=50, default='English')
    pages = models.IntegerField(blank=True, null=True)
    cover_image = models.URLField(blank=True, null=True)
    #personal tracking
    READ_STATUS = [
        ('unread', 'Unread'),
        ('reading', 'Currently Reading'),
        ('finished', 'Finished'),
    ]
    read_status = models.CharField(max_length=20, choices=READ_STATUS, default='unread')
    date_started = models.DateField(blank=True, null=True)
    date_finished = models.DateField(blank=True, null=True)
    rating = models.IntegerField(blank=True, null=True)  # 1-5
    notes = models.TextField(blank=True, null=True)
    is_favorite = models.BooleanField(default=False)
    #physical info
    FORMAT_CHOICES = [
        ('hardcover', 'Hardcover'),
        ('paperback', 'Paperback'),
        ('ebook', 'eBook'),
        ('audiobook', 'Audiobook'),
    ]
    format = models.CharField(max_length=20, choices=FORMAT_CHOICES, default='paperback')

    CONDITION_CHOICES = [
        ('new', 'New'),
        ('good', 'Good'),
        ('fair', 'Fair'),
        ('poor', 'Poor'),
    ]
    condition = models.CharField(max_length=20, choices=CONDITION_CHOICES, default='good')
    shelf_location = models.CharField(max_length=100, blank=True, null=True)
    is_owned = models.BooleanField(default=True)
    loaned_to = models.CharField(max_length=100, blank=True, null=True)

    # Series Info
    series_name = models.CharField(max_length=255, blank=True, null=True)
    series_volume = models.IntegerField(blank=True, null=True)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} by {self.author}"
