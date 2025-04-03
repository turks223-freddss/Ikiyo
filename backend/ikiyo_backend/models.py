from django.db import models

class User(models.Model):
    userID = models.AutoField(primary_key=True)  # Auto-incrementing unique ID
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)  # Store hashed passwords, not plain text!
    gold = models.IntegerField(default=0)  # Default value is 0
    rubby = models.IntegerField(default=0)  # Default value is 0
    description = models.CharField(max_length=300, blank=True, null=True)  # Can be empty
    
    def __str__(self):
        return self.username

class Item(models.Model):
    item_id = models.AutoField(primary_key=True)
    item_name = models.CharField(max_length=255)
    image = models.CharField(max_length=255, blank=True, null=True)  # Store file path or URL
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=100)
    part = models.CharField(max_length=100, blank=True, null=True)  # Can be null

    def __str__(self):
        return self.item_name

class Inventory(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)  # If user is deleted, remove items
    item = models.ForeignKey(Item, on_delete=models.CASCADE)  # If item is deleted, remove from inventory

    def __str__(self):
        return f"{self.owner.username} owns {self.item.item_name}"
    
