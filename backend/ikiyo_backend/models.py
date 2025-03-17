from django.db import models

class User(models.Model):
    userID = models.AutoField(primary_key=True)  # Auto-incrementing unique ID
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)  # Store hashed passwords, not plain text!
    gold = models.IntegerField(default=0)  # Default value is 0
    rubby = models.IntegerField(default=0)  # Default value is 0

    def __str__(self):
        return self.username