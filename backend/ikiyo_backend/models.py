from django.db import models
from django.conf import settings

class User(models.Model):
    userID = models.AutoField(primary_key=True)  # Auto-incrementing unique ID
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)  # Store hashed passwords, not plain text!
    gold = models.IntegerField(default=0)  # Default value is 0
    rubby = models.IntegerField(default=0)  # Default value is 0
    description = models.CharField(max_length=300, blank=True, null=True)  # Can be empty
    
    buddy = models.OneToOneField(
        'self',
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='partner'
    )

    def save(self, *args, **kwargs):
        # Save the current buddy before saving
        old_buddy = None
        if self.pk:
            old_buddy = User.objects.filter(pk=self.pk).first()
            if old_buddy:
                old_buddy = old_buddy.buddy

        super().save(*args, **kwargs)

        # Handle setting the new buddy's buddy to self
        if self.buddy:
            if self.buddy.buddy != self:
                self.buddy.buddy = self
                self.buddy.save()
        
        # Handle old buddy: if buddy was removed, unset the buddy on the old buddy too
        if old_buddy and old_buddy != self.buddy:
            old_buddy.buddy = None
            old_buddy.save()
    
    def __str__(self):
        return self.username
    

class PartnerRequest(models.Model):
    from_user = models.ForeignKey(User, related_name='sent_partner_requests', on_delete=models.CASCADE)
    to_user = models.ForeignKey(User, related_name='received_partner_requests', on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    accepted = models.BooleanField(default=False)

    class Meta:
        unique_together = ('from_user', 'to_user')  # Prevent duplicates

    def accept(self):
        # Set both users as buddies
        self.from_user.buddy = self.to_user
        self.to_user.buddy = self.from_user
        self.from_user.save()
        self.to_user.save()
        self.accepted = True
        self.save()

    def decline(self):
        # Optionally delete or mark as declined
        self.delete()

    def __str__(self):
        return f"{self.from_user} ➔ {self.to_user} (Accepted: {self.accepted})"

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
    


class Task(models.Model):
    assigned_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='tasks_assigned'
    )
    assigned_to = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='tasks_received'
    )
    task_title = models.CharField(max_length=255)
    task_description = models.TextField()
    difficulty_level = models.CharField(max_length=50)
    attachment = models.FileField(upload_to='task_attachments/', null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.task_title} (Assigned to: {self.assigned_to.username})"
    
    
class FriendList(models.Model):
    from_user = models.ForeignKey(
        'User',
        on_delete=models.CASCADE,
        related_name='friendlist_from'
    )
    to_user = models.ForeignKey(
        'User',
        on_delete=models.CASCADE,
        related_name='friendlist_to'
    )
    accepted = models.BooleanField(default=False)

    class Meta:
        unique_together = ('from_user', 'to_user')

    def __str__(self):
        status = "Accepted" if self.accepted else "Pending"
        return f"{self.from_user} → {self.to_user} ({status})"


class FriendRequest(models.Model):
    from_user = models.ForeignKey(
        'User',
        on_delete=models.CASCADE,
        related_name='friend_requests_sent'
    )
    to_user = models.ForeignKey(
        'User',
        on_delete=models.CASCADE,
        related_name='friend_requests_received'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        unique_together = ('from_user', 'to_user')

    def __str__(self):
        return f"Request from {self.from_user} to {self.to_user}"

class Message(models.Model):
    sender = models.ForeignKey(User, related_name='sent_messages', on_delete=models.CASCADE)
    recipient = models.ForeignKey(User, related_name='received_messages', on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ['timestamp']

    def __str__(self):
        return f'Message from {self.sender} to {self.recipient}'
    
