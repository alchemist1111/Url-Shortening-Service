from django.urls import path
from .views import (
    ShortenCreateAPIView,
    ShortenDetailAPIView,
    ShortenStatsAPIView,
    RedirectAPIView,
)

urlpatterns = [
    # CRUD endpoints
    path('shorten/', ShortenCreateAPIView.as_view(), name='shorten-create'),
    path("shorten/<str:shortCode>", ShortenDetailAPIView.as_view(), name="shorten-detail"),
    path("shorten/<str:shortCode>/stats", ShortenStatsAPIView.as_view(), name="shorten-stats"),
    
    # Redirect endpoint
    path("r/<str:shortCode>", RedirectAPIView.as_view(), name="redirect"),
]