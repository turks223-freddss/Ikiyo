from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, LoginView, EditUserView,ItemListView, GetUserByIDView, BuyItemView, UserInventoryView, DisplayInventoryAvatar,DisplayInventoryRoom, BuddyRequestView, TaskActionView

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    path('', include(router.urls)),
    path('login/', LoginView.as_view(), name='login'),  # Add login endpoint
    path("edit-user/<int:user_id>/", EditUserView.as_view(), name="edit-user"),#patch
    path('items/', ItemListView.as_view(), name='item-list'),  # Endpoint: /api/items/
    path('user/', GetUserByIDView.as_view(), name='get-user-by-id'),  # Endpoint to get user by ID using POST
    path('buy-item/', BuyItemView.as_view(), name='buy-item'),  # Add the route for buying an item
    path('user-inventory/', UserInventoryView.as_view(), name='user-inventory'),
    path('display-inventory-room/', DisplayInventoryRoom.as_view(), name='display-inventory-room'),
    path('display-inventory-avatar/', DisplayInventoryAvatar.as_view(), name='display-inventory-avatar'),
    path('buddy/', BuddyRequestView.as_view(), name='buddy-request'),
    path('task-action/', TaskActionView.as_view(), name='task-action'),
]