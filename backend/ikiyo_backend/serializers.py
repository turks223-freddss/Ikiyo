from rest_framework import serializers
from .models import User, Item, Task
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
    
    
    
#django have make_password() function try to implement later or soon 
#Change direct comparison to user.check_password(data["password"]) after hashing passwords.