from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from .models import User, Item, Inventory, PartnerRequest,Task, FriendList, FriendRequest, Message, Avatar, GameInfo
from .serializers import UserSerializer, LoginSerializer, ItemSerializer, TaskSerializer, MessageSerializer, GameInfoSerializer
from django.shortcuts import get_object_or_404
import json
from django.db.models import Q
from django.core.exceptions import ValidationError


# User ViewSet
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]  # For testing, allows any request (Change in production)
    def perform_create(self, serializer):
        user = serializer.save()
        # Create an Avatar linked to this user
        Avatar.objects.create(user=user)

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
            accessories_items = [inventory.item for inventory in inventory_items if inventory.item.category.lower() == 'avatar']
            
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
        elif action == 'search':  # <--- NEW ACTION
            return self.search_user(request)
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
        request_obj.delete()  # Delete after accepting
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
        request_obj.delete()   # Delete after declining
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
        buddy = user.buddy
        
        from ikiyo_backend.models import Task  # Make sure to import your Task model
        Task.objects.filter(
            Q(assigned_by=user, assigned_to=buddy) | Q(assigned_by=buddy, assigned_to=user)
        ).delete()


        # This will trigger your save() logic to update both users
        user.buddy = None
        user.save()
        buddy.buddy = None  # Also unset for the other user
        buddy.save()

        return Response({'message': f'Buddy relationship with {buddy_username} has been removed.'}, status=status.HTTP_200_OK)
    
    def search_user(self, request):
        target_id = request.data.get('target_id')
        username = request.data.get('username')

        if not target_id and not username:
            return Response({'error': 'target_id or username is required for search.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Use Q to filter by either userID or username
            user = User.objects.filter(
                Q(userID=target_id) | Q(username__iexact=username)
            ).first()

            if not user:
                return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

            data = {
                'userID': user.userID,
                'username': user.username,
                'buddy_id': user.buddy.userID if user.buddy else None,
            }
            return Response({'user': data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': f'Error during search: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
class TaskActionView(APIView):
    def get_reward(self, difficulty_level):
        reward_map = {
            'very easy': 10,
            'easy': 20,
            'normal': 30,
            'hard': 40,
            'very hard': 50
        }
        return reward_map.get(difficulty_level.lower(), 0)

    def post(self, request):
        print("Received data:", request.data)  # <-- This line will log the incoming POST data
        action = request.data.get('action', 'create')
        user_id = request.data.get('userID')

        if not user_id:
            return Response({"error": "userID is required."}, status=status.HTTP_400_BAD_REQUEST)

        user = get_object_or_404(User, userID=user_id)

        if action == 'create':
            if not user.buddy:
                return Response({"error": "This user does not have a buddy to assign the task to."}, status=status.HTTP_400_BAD_REQUEST)

            task_title = request.data.get('task_title')
            task_description = request.data.get('task_description')
            difficulty_level = request.data.get('difficulty_level')
            attachment = request.data.get('attachment')  # Expect URL now
            icon = request.data.get('icon')  # New field

            if not all([task_title, task_description, difficulty_level]):
                return Response({"error": "task_title, task_description, and difficulty_level are required."}, status=status.HTTP_400_BAD_REQUEST)

            reward = self.get_reward(difficulty_level)

            task = Task.objects.create(
                assigned_by=user,
                assigned_to=user.buddy,
                task_title=task_title,
                task_description=task_description,
                difficulty_level=difficulty_level,
                attachment=attachment,
                reward=reward,
                icon=icon
            )
            serializer = TaskSerializer(task)
            return Response({"message": "Task created successfully.", "task": serializer.data}, status=status.HTTP_201_CREATED)

        elif action == 'edit':
            task_id = request.data.get('task_id')
            if not task_id:
                return Response({"error": "task_id is required to edit a task."}, status=status.HTTP_400_BAD_REQUEST)

            task = get_object_or_404(Task, id=task_id)

            task_title = request.data.get('task_title')
            task_description = request.data.get('task_description')
            difficulty_level = request.data.get('difficulty_level')
            attachment = request.data.get('attachment')  # Expect URL now
            icon = request.data.get('icon')

            if task_title:
                task.task_title = task_title
            if task_description:
                task.task_description = task_description
            if difficulty_level:
                task.difficulty_level = difficulty_level
                task.reward = self.get_reward(difficulty_level)
                
            if attachment is not None:  # Explicitly check if attachment is not None
                task.attachment = attachment
            elif attachment is None:  # Handle case where attachment is null
                task.attachment = None
                
            if icon:
                task.icon = icon

            task.save()
            serializer = TaskSerializer(task)
            return Response({"message": "Task updated successfully.", "task": serializer.data}, status=status.HTTP_200_OK)

        elif action == 'delete':
            task_id = request.data.get('task_id')
            if not task_id:
                return Response({"error": "task_id is required to delete a task."}, status=status.HTTP_400_BAD_REQUEST)

            task = get_object_or_404(Task, id=task_id)

            if task.assigned_by != user:
                return Response({"error": "Only the user who assigned this task can delete it."}, status=status.HTTP_403_FORBIDDEN)

            task.delete()
            return Response({"message": "Task deleted successfully."}, status=status.HTTP_200_OK)

        elif action == 'list_assigned_by':
            tasks_assigned = Task.objects.filter(assigned_by=user)

            if not tasks_assigned.exists():
                return Response({"message": "No tasks assigned by this user."}, status=status.HTTP_404_NOT_FOUND)

            serializer = TaskSerializer(tasks_assigned, many=True)
            return Response({"tasks_assigned_by_user": serializer.data}, status=status.HTTP_200_OK)

        elif action == 'list_assigned_to':
            tasks_received = Task.objects.filter(assigned_to=user)

            if not tasks_received.exists():
                return Response({"message": "No tasks assigned to this user."}, status=status.HTTP_404_NOT_FOUND)

            serializer = TaskSerializer(tasks_received, many=True)
            return Response({"tasks_assigned_to_user": serializer.data}, status=status.HTTP_200_OK)
        
        elif action == 'submit':
            task_id = request.data.get('task_id')
            submission = request.data.get('submission')
            submission_attachment = request.data.get('submission_attachment')

            if not task_id or not submission:
                return Response({"error": "task_id and submission are required."}, status=status.HTTP_400_BAD_REQUEST)

            task = get_object_or_404(Task, id=task_id)

            if task.assigned_to != user:
                return Response({"error": "Only the assigned user can submit this task."}, status=status.HTTP_403_FORBIDDEN)

            task.submission = submission
            if submission_attachment:
                task.submission_attachment = submission_attachment
            task.status = "For validation"
            task.save()

            serializer = TaskSerializer(task)
            return Response({"message": "Task submitted for validation.", "task": serializer.data}, status=status.HTTP_200_OK)

        elif action == 'verify':
            task_id = request.data.get('task_id')
            verified = request.data.get('verified', False)

            if not task_id:
                return Response({"error": "task_id is required."}, status=status.HTTP_400_BAD_REQUEST)

            task = get_object_or_404(Task, id=task_id)

            if task.assigned_by != user:
                return Response({"error": "Only the assigning user can verify the task."}, status=status.HTTP_403_FORBIDDEN)

            if verified:
                task.status = "Complete"
                task.verification = True
                task.save()
                serializer = TaskSerializer(task)
                return Response({"message": "Submission verified successfully.", "task": serializer.data}, status=status.HTTP_200_OK)
            else:
                return Response({"message": "Verification flag not set to true."}, status=status.HTTP_400_BAD_REQUEST)

        elif action == 'claim':
            task_id = request.data.get('task_id')

            if not task_id:
                return Response({"error": "task_id is required to claim a task."}, status=status.HTTP_400_BAD_REQUEST)

            task = get_object_or_404(Task, id=task_id)

            if task.assigned_to != user:
                return Response({"error": "Only the assigned user can claim the reward."}, status=status.HTTP_403_FORBIDDEN)

            if task.status != "Complete" or not task.verification:
                return Response({"error": "Task must be complete and verified to claim reward."}, status=status.HTTP_400_BAD_REQUEST)

            if hasattr(user, 'gold'):
                user.gold += task.reward
                user.save()
                task.delete()
                return Response({"message": f"Reward of {task.reward} gold claimed successfully and task deleted."}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "User does not have a 'gold' field."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        else:
            return Response({"error": "Invalid action. Use 'create', 'edit', or 'delete'."}, status=status.HTTP_400_BAD_REQUEST)


class FriendActionView(APIView):
    def post(self, request):
        action = request.data.get('action')
        user_id = request.data.get('userID')
        print("Incoming action:", request.data.get('action'))

        if not user_id:
            return Response({"error": "userID is required."}, status=status.HTTP_400_BAD_REQUEST)

        user = get_object_or_404(User, userID=user_id)

        # ===== ADD FRIEND =====
        if action == 'add_friend':
            to_user_id = request.data.get('to_user_id')
            if not to_user_id:
                return Response({"error": "to_user_id is required."}, status=status.HTTP_400_BAD_REQUEST)
            to_user = get_object_or_404(User, userID=to_user_id)

            if FriendRequest.objects.filter(from_user=user, to_user=to_user).exists():
                return Response({"error": "Friend request already sent."}, status=status.HTTP_400_BAD_REQUEST)

            FriendRequest.objects.create(from_user=user, to_user=to_user)
            return Response({"message": "Friend request sent."}, status=status.HTTP_201_CREATED)

        # ===== DECLINE FRIEND =====
        elif action == 'decline_friend':
            request_id = request.data.get('request_id')
            friend_request = get_object_or_404(FriendRequest, id=request_id, to_user=user)
            friend_request.delete()
            return Response({"message": "Friend request declined."}, status=status.HTTP_200_OK)

        # ===== REMOVE REQUEST =====
        elif action == 'remove_request':
            request_id = request.data.get('request_id')
            friend_request = get_object_or_404(FriendRequest, id=request_id, from_user=user)
            friend_request.delete()
            return Response({"message": "Friend request canceled."}, status=status.HTTP_200_OK)

        # ===== ACCEPT FRIEND =====
        elif action == 'accept_friend':
            request_id = request.data.get('request_id')
            friend_request = get_object_or_404(FriendRequest, id=request_id, to_user=user)

            # Save accepted friendship
            FriendList.objects.create(from_user=friend_request.from_user, to_user=friend_request.to_user, accepted=True)
            friend_request.delete()
            return Response({"message": "Friend request accepted."}, status=status.HTTP_200_OK)

       # ===== VIEW FRIENDS =====
        elif action == 'friends':
            friends = FriendList.objects.filter(
                Q(from_user=user) | Q(to_user=user),
                accepted=True
            )
            friend_data = []
            for friend in friends:
                other_user = friend.to_user if friend.from_user == user else friend.from_user
                serialized_user = UserSerializer(other_user).data
                friend_data.append(serialized_user)
            
            return Response({"friends": friend_data}, status=status.HTTP_200_OK)
                
        
         # ===== VIEW FRIENDS_REQUEST =====
        elif action == 'view_friend_requests':
            requests = FriendRequest.objects.filter(to_user=user)
            request_list = []
            for fr in requests:
                request_list.append({
                    "request_id": fr.id,
                    "from_user_id": fr.from_user.userID,
                    "from_username": fr.from_user.username,
                    "created_at": fr.created_at
                })
            return Response({"friend_requests": request_list}, status=status.HTTP_200_OK)
        # ===== SEARCH USER =====
        elif action == "search":
            query = request.data.get('query')

            if not query:
                return Response({"error": "Search query is required."}, status=status.HTTP_400_BAD_REQUEST)

            users = User.objects.filter(
                (Q(userID__icontains=query) | Q(username__icontains=query)) & ~Q(userID=user.userID)
            ).values('userID', 'username')

            return Response({"results": list(users)}, status=status.HTTP_200_OK)

        else:
            print(f"Unknown action received: '{action}'")
            return Response({"error": f"Invalid action '{action}'."}, status=status.HTTP_400_BAD_REQUEST)

class ChatView(APIView):
    def post(self, request):
        action = request.data.get('action')
        user_id = request.data.get('userID')
        user = get_object_or_404(User, userID=user_id)

        if action == 'send_message':
            recipient_id = request.data.get('recipient_id')
            content = request.data.get('content')

            if not all([recipient_id, content]):
                return Response({"error": "recipient_id and content are required."}, status=status.HTTP_400_BAD_REQUEST)

            recipient = get_object_or_404(User, userID=recipient_id)

            # Check if they are friends
            is_friend = FriendList.objects.filter(
                (Q(from_user=user, to_user=recipient) | Q(from_user=recipient, to_user=user)),
                accepted=True
            ).exists()

            if not is_friend:
                return Response({"error": "You can only chat with friends."}, status=status.HTTP_403_FORBIDDEN)

            message = Message.objects.create(sender=user, recipient=recipient, content=content)
            serializer = MessageSerializer(message)
            return Response({"message": "Message sent.", "data": serializer.data}, status=status.HTTP_201_CREATED)

        elif action == 'get_messages':
            friend_id = request.data.get('friend_id')
            if not friend_id:
                return Response({"error": "friend_id is required."}, status=status.HTTP_400_BAD_REQUEST)

            friend = get_object_or_404(User, userID=friend_id)

            # Get messages between the two users
            messages = Message.objects.filter(
                (Q(sender=user, recipient=friend) | Q(sender=friend, recipient=user))
            ).order_by('timestamp')

            serializer = MessageSerializer(messages, many=True)
            return Response({"messages": serializer.data}, status=status.HTTP_200_OK)

        else:
            return Response({"error": "Invalid action. Use 'create', 'edit', or 'delete'."}, status=status.HTTP_400_BAD_REQUEST)

class FriendActionView(APIView):
    def post(self, request):
        action = request.data.get('action')
        user_id = request.data.get('userID')

        if not user_id:
            return Response({"error": "userID is required."}, status=status.HTTP_400_BAD_REQUEST)

        user = get_object_or_404(User, userID=user_id)

        # ===== ADD FRIEND =====
        if action == 'add_friend':
            to_user_id = request.data.get('to_user_id')
            if not to_user_id:
                return Response({"error": "to_user_id is required."}, status=status.HTTP_400_BAD_REQUEST)
            to_user = get_object_or_404(User, userID=to_user_id)

            if FriendRequest.objects.filter(from_user=user, to_user=to_user).exists():
                return Response({"error": "Friend request already sent."}, status=status.HTTP_400_BAD_REQUEST)

            FriendRequest.objects.create(from_user=user, to_user=to_user)
            return Response({"message": "Friend request sent."}, status=status.HTTP_201_CREATED)

        # ===== DECLINE FRIEND =====
        elif action == 'decline_friend':
            request_id = request.data.get('request_id')
            friend_request = get_object_or_404(FriendRequest, id=request_id, to_user=user)
            friend_request.delete()
            return Response({"message": "Friend request declined."}, status=status.HTTP_200_OK)

        # ===== REMOVE REQUEST =====
        elif action == 'remove_request':
            request_id = request.data.get('request_id')
            friend_request = get_object_or_404(FriendRequest, id=request_id, from_user=user)
            friend_request.delete()
            return Response({"message": "Friend request canceled."}, status=status.HTTP_200_OK)

        # ===== ACCEPT FRIEND =====
        elif action == 'accept_friend':
            request_id = request.data.get('request_id')
            friend_request = get_object_or_404(FriendRequest, id=request_id, to_user=user)

            # Save accepted friendship
            FriendList.objects.create(from_user=friend_request.from_user, to_user=friend_request.to_user, accepted=True)
            friend_request.delete()
            return Response({"message": "Friend request accepted."}, status=status.HTTP_200_OK)

        # ===== VIEW FRIENDS =====
        elif action == 'view_friends':
            friends = FriendList.objects.filter(
                Q(from_user=user) | Q(to_user=user),
                accepted=True
            )
            friend_data = []
            for friend in friends:
                if friend.from_user == user:
                    other_user = friend.to_user
                else:
                    other_user = friend.from_user

                friend_data.append({
                    'userID': other_user.userID,
                    'username': other_user.username,
                    'status': other_user.status
                })

            return Response({"friends": friend_data}, status=status.HTTP_200_OK)
         
         
         # ===== VIEW FRIENDS_REQUEST =====
        elif action == 'view_friend_requests':
            requests = FriendRequest.objects.filter(to_user=user)
            request_list = []
            for fr in requests:
                request_list.append({
                    "request_id": fr.id,
                    "from_user_id": fr.from_user.userID,
                    "from_username": fr.from_user.username,
                    "created_at": fr.created_at
                })
            return Response({"friend_requests": request_list}, status=status.HTTP_200_OK)
        # ===== SEARCH USER =====
        elif action == 'search_user':
            query = request.data.get('query')

            if not query:
                return Response({"error": "Search query is required."}, status=status.HTTP_400_BAD_REQUEST)

            users = User.objects.filter(
                Q(userID__icontains=query) | Q(username__icontains=query)
            ).values('userID', 'username')

            return Response({"results": list(users)}, status=status.HTTP_200_OK)

        else:
            return Response({"error": "Invalid action. Use 'add_friend', 'decline_friend', 'remove_request', 'accept_friend', or 'view_friends'."}, status=status.HTTP_400_BAD_REQUEST)


class ChatView(APIView):
    def post(self, request):
        action = request.data.get('action')
        user_id = request.data.get('userID')
        user = get_object_or_404(User, userID=user_id)

        if action == 'send_message':
            recipient_id = request.data.get('recipient_id')
            content = request.data.get('content')

            if not all([recipient_id, content]):
                return Response({"error": "recipient_id and content are required."}, status=status.HTTP_400_BAD_REQUEST)

            recipient = get_object_or_404(User, userID=recipient_id)

            # Check if they are friends
            is_friend = FriendList.objects.filter(
                (Q(from_user=user, to_user=recipient) | Q(from_user=recipient, to_user=user)),
                accepted=True
            ).exists()

            if not is_friend:
                return Response({"error": "You can only chat with friends."}, status=status.HTTP_403_FORBIDDEN)

            message = Message.objects.create(sender=user, recipient=recipient, content=content)
            serializer = MessageSerializer(message)
            return Response({"message": "Message sent.", "data": serializer.data}, status=status.HTTP_201_CREATED)

        elif action == 'get_messages':
            friend_id = request.data.get('friend_id')
            if not friend_id:
                return Response({"error": "friend_id is required."}, status=status.HTTP_400_BAD_REQUEST)

            friend = get_object_or_404(User, userID=friend_id)

            # Get messages between the two users
            messages = Message.objects.filter(
                (Q(sender=user, recipient=friend) | Q(sender=friend, recipient=user))
            ).order_by('timestamp')

            serializer = MessageSerializer(messages, many=True)
            return Response({"messages": serializer.data}, status=status.HTTP_200_OK)
        
        elif action == 'get_friend_data':
            friend_id = request.data.get('friend_id')
            if not friend_id:
                return Response({"error": "friend_id is required."}, status=status.HTTP_400_BAD_REQUEST)

            friend = get_object_or_404(User, userID=friend_id)

            # Check if they are friends
            is_friend = FriendList.objects.filter(
                (Q(from_user=user, to_user=friend) | Q(from_user=friend, to_user=user)),
                accepted=True
            ).exists()

            if not is_friend:
                return Response({"error": "You can only view data of friends."}, status=status.HTTP_403_FORBIDDEN)

            friend_data = {
                "userID": friend.userID,
                "username": friend.username,
                "status": friend.status
            }
            return Response({"friend_data": friend_data}, status=status.HTTP_200_OK)

        else:
            return Response({"error": "Invalid action. Use 'send_message' or 'get_messages'."}, status=status.HTTP_400_BAD_REQUEST)

class RetrieveAvatarView(APIView):
    def post(self, request):
        user_id = request.data.get("userID")

        if not user_id:
            return Response({"error": "userID is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            avatar = Avatar.objects.get(user__userID=user_id)
            avatar_data = {
                "avatarID": avatar.avatarID,
                "userID": avatar.user.userID,
                "head": avatar.head,
                "body": avatar.body,
                "left_arm": avatar.left_arm,
                "right_arm": avatar.right_arm,
                "left_leg": avatar.left_leg,
                "right_leg": avatar.right_leg,
                "hat": avatar.hat,
                "eyes": avatar.eyes,
                "face_accessories": avatar.face_accessories,
                "facial_expression": avatar.facial_expression,
                "upperwear": avatar.upperwear,
                "lowerwear": avatar.lowerwear,
                "shoes": avatar.shoes,
            }
            return Response(avatar_data, status=status.HTTP_200_OK)

        except Avatar.DoesNotExist:
            return Response({"error": "Avatar not found for the given userID."}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request):
        user_id = request.data.get("userID")
        item_type = request.data.get("item_type")  # e.g., "hat", "eyes"
        item_url = request.data.get("url")         # URL of the item image

        if not user_id or not item_type or not item_url:
            return Response({"error": "userID, item_type, and url are required."}, status=status.HTTP_400_BAD_REQUEST)

        valid_fields = [
            "hat", "eyes", "face_accessories", "facial_expression",
            "upperwear", "lowerwear", "shoes"
        ]

        if item_type not in valid_fields:
            return Response({"error": f"Invalid item_type. Must be one of {valid_fields}."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            avatar = Avatar.objects.get(user__userID=user_id)
            setattr(avatar, item_type, item_url)
            avatar.save()
            return Response({"message": f"{item_type} equipped successfully."}, status=status.HTTP_200_OK)

        except Avatar.DoesNotExist:
            return Response({"error": "Avatar not found for the given userID."}, status=status.HTTP_404_NOT_FOUND)
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        
class GameInfoView(APIView):
    def post(self, request):
        action = request.data.get('action')

        if action == 'display_events':
            events = GameInfo.objects.filter(category__iexact='event').order_by('-date')
            serializer = GameInfoSerializer(events, many=True)
            return Response({"events": serializer.data}, status=status.HTTP_200_OK)

        elif action == 'display_announcements':
            announcements = GameInfo.objects.filter(category__iexact='announcement').order_by('-date')
            serializer = GameInfoSerializer(announcements, many=True)
            return Response({"announcements": serializer.data}, status=status.HTTP_200_OK)

        elif action == 'add':
            serializer = GameInfoSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response({"message": "Game info added.", "data": serializer.data}, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        elif action == 'edit':
            info_id = request.data.get('info_id')
            if not info_id:
                return Response({"error": "info_id is required for editing."}, status=status.HTTP_400_BAD_REQUEST)

            game_info = get_object_or_404(GameInfo, pk=info_id)
            serializer = GameInfoSerializer(game_info, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({"message": "Game info updated.", "data": serializer.data}, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        elif action == 'delete':
            info_id = request.data.get('info_id')
            if not info_id:
                return Response({"error": "info_id is required for deletion."}, status=status.HTTP_400_BAD_REQUEST)

            game_info = get_object_or_404(GameInfo, pk=info_id)
            game_info.delete()
            return Response({"message": "Game info deleted."}, status=status.HTTP_204_NO_CONTENT)

        else:
            return Response({"error": "Invalid action. Valid actions: display_events, display_announcements, add, edit, delete."},
                            status=status.HTTP_400_BAD_REQUEST)