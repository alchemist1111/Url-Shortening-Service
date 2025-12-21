from django.db.models import F
from django.http import HttpResponseRedirect
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import ShortUrl
from .serializers import (
    ShortUrlCreateSerializer,
    ShortUrlUpdateSerializer,
    ShortUrlResponseSerializer,
    ShortUrlStatsSerializer,
)

class ShortenCreateAPIView(APIView):
    """
        POST /shorten
        Body: { "url": "https://..." }
        
    """
    def post(self, request):
        serializer = ShortUrlCreateSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            obj = serializer.save()
            out = ShortUrlResponseSerializer(obj)
            return Response(out.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ShortenDetailAPIView(APIView):
    """
        GET /shorten/<shortCode>
        PUT /shorten/<shortCode>
        DELETE /shorten/<shortCode>
        
    """
    def get_object(self, short_code: str) -> ShortUrl:
        return get_object_or_404(ShortUrl, short_code=short_code)
    
    def get(self, request, shortCode: str):
        obj = self.get_object(shortCode)
        out = ShortUrlResponseSerializer(obj)
        return Response(out.data, status=status.HTTP_200_OK)
    
    def put(self, request, shortCode: str):
        obj = self.get_object(shortCode)
        serializer = ShortUrlUpdateSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            obj = serializer.update(obj, serializer.validated_data)
            out = ShortUrlResponseSerializer(obj)
            return Response(out.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, shortCode: str):
        obj = self.get_object(shortCode)
        obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ShortenStatsAPIView(APIView):
    """
       GET /shorten/<shortCode>/stats
       
    """
    def get(self, request, shortCode: str):
        obj = get_object_or_404(ShortUrl, short_code=shortCode)
        out = ShortUrlStatsSerializer(obj)
        return Response(out.data, status=status.HTTP_200_OK)

class RedirectAPIView(APIView):
    """
        GET /r/<shortCode>
        Performs HTTP redirect to the original URL and increments access_count atomically.

    """
    authentication_classes = []
    permission_classes = []
    
    def get(self, request, shortCode: str):
        obj = get_object_or_404(ShortUrl, short_code=shortCode)
        
        # Atomic increment to avoid lost updates under concurrency
        ShortUrl.objects.filter(id=obj.id).update(access_count=F("access_count") + 1)
        
        # 302 redirect is safer since URLs can be updated
        return HttpResponseRedirect(redirect_to=obj.original_url)