from django.urls import path, include
from rest_framework_simplejwt.views  import (
    TokenObtainPairView, 
    TokenRefreshView,
    TokenVerifyView,
    

)

from users.views import RegisterView, LoginView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),  
    # path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

]