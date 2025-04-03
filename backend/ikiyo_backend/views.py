from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from .models import User, Item, Inventory
from .serializers import UserSerializer, LoginSerializer, ItemSerializer
from django.shortcuts import get_object_or_404
import json


# User ViewSet
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]  # For testing, allows any request (Change in production)

# Login API View
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        
        if serializer.is_valid():
            user = serializer.validated_data  # This is already a User object
            
             # Serialize the user object
            user_data = UserSerializer(instance=user).data
            
            # Instead of trying to access user["email"], get the attribute directly
            return Response({"message": "Login successful", "user": user.userID}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class EditUserView(APIView):
    def patch(self, request, user_id):
        user = get_object_or_404(User, userID=user_id)

        # Get request data
        new_username = request.data.get("username", None)
        new_description = request.data.get("description", None)

        # Update username if provided
        if new_username:
            if User.objects.exclude(userID=user.userID).filter(username=new_username).exists():
                return Response({"error": "Username already taken"}, status=status.HTTP_400_BAD_REQUEST)
            user.username = new_username

        # Update description if provided
        if new_description is not None:
            user.description = new_description

        # Save updates
        user.save()
        return Response({"message": "User updated successfully", "data": UserSerializer(user).data}, status=status.HTTP_200_OK)

class ItemListView(APIView):
    def get(self, request):
        items = Item.objects.all()  # Retrieve all items
        serializer = ItemSerializer(items, many=True)  # Serialize the data
        return Response(serializer.data, status=status.HTTP_200_OK)  # Return JSON response
    
class GetUserByIDView(APIView):
    def post(self, request):
        
        try:
            data = json.loads(request.body)  # Debugging
            print("Received data:", data)  # Log request body
        except json.JSONDecodeError:
            return Response({"detail": "Invalid JSON"}, status=status.HTTP_400_BAD_REQUEST)
        
        user_id = request.data.get('userID')  # Get the userID from the request data
        print("Extracted userID:", user_id)  # Debugging

        if not user_id:
            return Response({"detail": "userID is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Fetch the user by user_id
            user = User.objects.get(userID=user_id)
            serializer = UserSerializer(user)  # Serialize the user object
            return Response(serializer.data, status=status.HTTP_200_OK)  # Return user data in JSON
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)  # Handle case where user doesn't exist

class BuyItemView(APIView):
    def post(self, request):
        user_id = request.data.get("userID")
        item_id = request.data.get("item_id")
        price = request.data.get("price")

        if not user_id or not item_id or not price:
            return Response({"detail": "Missing required fields."}, status=status.HTTP_400_BAD_REQUEST)

        # Get the user and item
        user = get_object_or_404(User, userID=user_id)
        item = get_object_or_404(Item, item_id=item_id)

        # Convert price to a float (in case it's sent as a string)
        price = float(price)

        # Determine if the user can afford the item
        if user.gold >= price:
            user.gold -= price  # Deduct gold
        elif user.rubby >= price:
            user.rubby -= price  # Deduct rubby
        else:
            return Response({"detail": "Insufficient balance."}, status=status.HTTP_400_BAD_REQUEST)

        # Save the updated user balance
        user.save()

        # Add item to inventory
        Inventory.objects.create(owner=user, item=item)

        return Response({"message": "Item purchased successfully."}, status=status.HTTP_200_OK)
    

class UserInventoryView(APIView):
    def post(self, request):
        user_id = request.data.get('userID')  # Get userID from the request

        if not user_id:
            return Response({"detail": "userID is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(userID=user_id)  # Check if user exists
            inventory_items = Inventory.objects.filter(owner=user)  # Get items owned by the user
            item_ids = [inventory.item.item_id for inventory in inventory_items]  # Extract item IDs

            return Response({"userID": user_id, "owned_items": item_ids}, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        

class DisplayInventoryRoom(APIView):
    def post(self, request):
        user_id = request.data.get('userID')  # Get userID from the request

        if not user_id:
            return Response({"detail": "userID is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Check if user exists
            user = User.objects.get(userID=user_id)
            # Get inventory items for this user and filter by category 'furniture'
            inventory_items = Inventory.objects.filter(owner=user)
            furniture_items = [inventory.item for inventory in inventory_items if inventory.item.category.lower() == 'furniture']
            
            # Serialize the filtered items
            serializer = ItemSerializer(furniture_items, many=True)
            return Response({"userID": user_id, "furniture_items": serializer.data}, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)


class DisplayInventoryAvatar(APIView):
    def post(self, request):
        user_id = request.data.get('userID')  # Get userID from the request

        if not user_id:
            return Response({"detail": "userID is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Check if user exists
            user = User.objects.get(userID=user_id)
            # Get inventory items for this user and filter by category 'accessories'
            inventory_items = Inventory.objects.filter(owner=user)
            accessories_items = [inventory.item for inventory in inventory_items if inventory.item.category.lower() == 'accessories']
            
            # Serialize the filtered items
            serializer = ItemSerializer(accessories_items, many=True)
            return Response({"userID": user_id, "accessories_items": serializer.data}, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

    