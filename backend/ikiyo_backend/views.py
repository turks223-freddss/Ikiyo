from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from .models import User, Item, Inventory, PartnerRequest,Task
from .serializers import UserSerializer, LoginSerializer, ItemSerializer, TaskSerializer
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
    
    
class BuddyRequestView(APIView):

    def post(self, request):
        action = request.data.get('action')
        
        if not action:
            return Response({'error': 'Action is required.'}, status=status.HTTP_400_BAD_REQUEST)

        # Call the specific method for the action
        if action == 'list':
            return self.list_pending_requests(request)
        elif action == 'send_request':
            return self.send_buddy_request(request)
        elif action == 'accept':
            return self.accept_buddy_request(request)
        elif action == 'decline':
            return self.decline_buddy_request(request)
        elif action == 'remove_buddy':
            return self.remove_buddy(request)
        else:
            return Response({'error': 'Invalid action.'}, status=status.HTTP_400_BAD_REQUEST)

    def list_pending_requests(self, request):
        user_id = request.data.get('user_id')

        if not user_id:
            return Response({'error': 'user_id is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(userID=user_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        pending_requests = PartnerRequest.objects.filter(to_user=user, accepted=False)
        data = [
            {
                'id': req.id,
                'from_user_id': req.from_user.userID,
                'from_username': req.from_user.username,
                'timestamp': req.timestamp,
                'accepted': req.accepted
            } 
            for req in pending_requests
        ]
        return Response({'pending_requests': data}, status=status.HTTP_200_OK)

    def send_buddy_request(self, request):
        user_id = request.data.get('user_id')
        target_id = request.data.get('target_id')

        if not user_id or not target_id:
            return Response({'error': 'user_id and target_id are required for sending a request.'}, status=status.HTTP_400_BAD_REQUEST)

        if str(user_id) == str(target_id):
            return Response({'error': 'You cannot send a request to yourself.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(userID=user_id)
            target_user = User.objects.get(userID=target_id)
        except User.DoesNotExist:
            return Response({'error': 'User or target user not found.'}, status=status.HTTP_404_NOT_FOUND)

        if PartnerRequest.objects.filter(from_user=user, to_user=target_user).exists():
            return Response({'error': 'Request already sent.'}, status=status.HTTP_400_BAD_REQUEST)

        PartnerRequest.objects.create(from_user=user, to_user=target_user)
        return Response({'message': 'Buddy request sent.'}, status=status.HTTP_201_CREATED)

    def accept_buddy_request(self, request):
        user_id = request.data.get('user_id')
        target_id = request.data.get('target_id')

        if not user_id or not target_id:
            return Response({'error': 'user_id and target_id are required for accepting a request.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(userID=user_id)
            request_obj = PartnerRequest.objects.get(from_user__userID=target_id, to_user=user, accepted=False)
        except User.DoesNotExist:
            return Response({'error': 'User or target user not found.'}, status=status.HTTP_404_NOT_FOUND)
        except PartnerRequest.DoesNotExist:
            return Response({'error': 'No pending request from this user.'}, status=status.HTTP_404_NOT_FOUND)

        request_obj.accept()
        return Response({'message': f'Buddy request from {request_obj.from_user.username} accepted.'}, status=status.HTTP_200_OK)

    def decline_buddy_request(self, request):
        user_id = request.data.get('user_id')
        target_id = request.data.get('target_id')

        if not user_id or not target_id:
            return Response({'error': 'user_id and target_id are required for declining a request.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(userID=user_id)
            request_obj = PartnerRequest.objects.get(from_user__userID=target_id, to_user=user, accepted=False)
        except User.DoesNotExist:
            return Response({'error': 'User or target user not found.'}, status=status.HTTP_404_NOT_FOUND)
        except PartnerRequest.DoesNotExist:
            return Response({'error': 'No pending request from this user.'}, status=status.HTTP_404_NOT_FOUND)

        request_obj.decline()
        return Response({'message': f'Buddy request from {request_obj.from_user.username} declined.'}, status=status.HTTP_200_OK)
    
    def remove_buddy(self, request):
        user_id = request.data.get('user_id')

        if not user_id:
            return Response({'error': 'user_id is required to remove a buddy.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(userID=user_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        if not user.buddy:
            return Response({'error': 'User has no buddy to remove.'}, status=status.HTTP_400_BAD_REQUEST)

        # Store buddy for message (optional)
        buddy_username = user.buddy.username

        # This will trigger your save() logic to update both users
        user.buddy = None
        user.save()

        return Response({'message': f'Buddy relationship with {buddy_username} has been removed.'}, status=status.HTTP_200_OK)
    
class TaskActionView(APIView):
    def post(self, request):
        action = request.data.get('action', 'create')  # Default to 'create' if no action is provided
        user_id = request.data.get('userID')

        if not user_id:
            return Response({"error": "userID is required."}, status=status.HTTP_400_BAD_REQUEST)

        user = get_object_or_404(User, userID=user_id)

        # ===== CREATE =====
        if action == 'create':
            if not user.buddy:
                return Response({"error": "This user does not have a buddy to assign the task to."}, status=status.HTTP_400_BAD_REQUEST)

            task_title = request.data.get('task_title')
            task_description = request.data.get('task_description')
            difficulty_level = request.data.get('difficulty_level')
            attachment = request.FILES.get('attachment')

            if not all([task_title, task_description, difficulty_level]):
                return Response({"error": "task_title, task_description, and difficulty_level are required."}, status=status.HTTP_400_BAD_REQUEST)

            task = Task.objects.create(
                assigned_by=user,
                assigned_to=user.buddy,
                task_title=task_title,
                task_description=task_description,
                difficulty_level=difficulty_level,
                attachment=attachment
            )
            serializer = TaskSerializer(task)
            return Response({"message": "Task created successfully.", "task": serializer.data}, status=status.HTTP_201_CREATED)

        # ===== EDIT =====
        elif action == 'edit':
            task_id = request.data.get('task_id')
            if not task_id:
                return Response({"error": "task_id is required to edit a task."}, status=status.HTTP_400_BAD_REQUEST)

            task = get_object_or_404(Task, id=task_id)

            # Update only the fields provided
            task_title = request.data.get('task_title')
            task_description = request.data.get('task_description')
            difficulty_level = request.data.get('difficulty_level')
            attachment = request.FILES.get('attachment')

            if task_title:
                task.task_title = task_title
            if task_description:
                task.task_description = task_description
            if difficulty_level:
                task.difficulty_level = difficulty_level
            if attachment:
                task.attachment = attachment

            task.save()
            serializer = TaskSerializer(task)
            return Response({"message": "Task updated successfully.", "task": serializer.data}, status=status.HTTP_200_OK)

        # ===== DELETE =====
        elif action == 'delete':
            task_id = request.data.get('task_id')
            if not task_id:
                return Response({"error": "task_id is required to delete a task."}, status=status.HTTP_400_BAD_REQUEST)

            task = get_object_or_404(Task, id=task_id)

            # Check if the user is the one who assigned the task
            if task.assigned_by != user:
                return Response({"error": "Only the user who assigned this task can delete it."}, status=status.HTTP_403_FORBIDDEN)

            task.delete()
            return Response({"message": "Task deleted successfully."}, status=status.HTTP_200_OK)
        
          # ===== LIST - Assigned by User =====
        elif action == 'list_assigned_by':
            # List tasks assigned by the user
            tasks_assigned = Task.objects.filter(assigned_by=user)

            if not tasks_assigned.exists():
                return Response({"message": "No tasks assigned by this user."}, status=status.HTTP_404_NOT_FOUND)

            # Serialize the tasks and return them
            serializer = TaskSerializer(tasks_assigned, many=True)
            return Response({"tasks_assigned_by_user": serializer.data}, status=status.HTTP_200_OK)

        # ===== LIST - Assigned to User =====
        elif action == 'list_assigned_to':
            # List tasks assigned to the user
            tasks_received = Task.objects.filter(assigned_to=user)

            if not tasks_received.exists():
                return Response({"message": "No tasks assigned to this user."}, status=status.HTTP_404_NOT_FOUND)

            # Serialize the tasks and return them
            serializer = TaskSerializer(tasks_received, many=True)
            return Response({"tasks_assigned_to_user": serializer.data}, status=status.HTTP_200_OK)


        else:
            return Response({"error": "Invalid action. Use 'create', 'edit', or 'delete'."}, status=status.HTTP_400_BAD_REQUEST)