from rest_framework import serializers
from .models import User, Item, Task, Message, GameInfo, RoomItem
from django.contrib.auth import authenticate

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'  # Includes all fields


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        try:
            user = User.objects.get(email=data["email"])  # Get user by email
        except User.DoesNotExist:
            raise serializers.ValidationError("User not found")

        # Direct password comparison (since it's stored in plain text)
        if data["password"] != user.password:
            raise serializers.ValidationError("Invalid credentials")

        return user  # Return the user object if credentials are valid

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__'  # Include all fields from the Item model

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'
        

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'sender', 'recipient', 'content', 'timestamp', 'is_read']
    

class GameInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameInfo
        fields = '__all__'

class RoomItemSerializer(serializers.ModelSerializer):
    item_name = serializers.CharField(source='item.item.item_name', read_only=True)

    class Meta:
        model = RoomItem
        fields = ['id', 'item_name', 'type', 'x', 'y', 'width', 'height', 'state', 'allowOverlap', 'placed', 'image']
    
#django have make_password() function try to implement later or soon 
#Change direct comparison to user.check_password(data["password"]) after hashing passwords.