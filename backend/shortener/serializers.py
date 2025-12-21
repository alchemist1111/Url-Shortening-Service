from rest_framework import serializers
from .models import ShortUrl
from .validations import validate_url

# serializer for creating a ShortUrl
class ShortUrlCreateSerializer(serializers.Serializer):
    """
        For: POST /shorten
        Input: { "url": "https://..." }
    """
    url = serializers.URLField(max_length=2048)
    
    # Validate the URL field
    def validate_url(self, value: str) -> str:
        return validate_url(self, value)
    
    def create(self, validated_data):
        # Uses model helper for unique shortcode generation
        return ShortUrl.create_unique(original_url=validated_data["url"])


# Serializer for updating a ShortUrl
class ShortUrlUpdateSerializer(serializers.Serializer):
    """
        For: PUT /shorten/{shortCode}
        Input: { "url": "https://..." }
        
    """
    url = serializers.URLField(max_length=2048)
    
        
    # Validate the URL field
    def validate_url(self, value: str) -> str:
        return validate_url(self, value)
    
    # Update the original URL
    def update(self, instance: ShortUrl, validated_data):
        instance.update_url(new_url=validated_data["url"])
        instance.save()
        return instance

# Serializer for response of ShortUrl representation of CRUD operations
class ShortUrlResponseSerializer(serializers.ModelSerializer):
    """
        For: returning the short URL resource (Create + Retrieve + Update).
        Output matches the spec fields:
        { id, url, shortCode, createdAt, updatedAt }
        
    """ 
    url = serializers.CharField(source="original_url", read_only=True)
    shortCode = serializers.CharField(source="short_code", read_only=True)
    createdAt = serializers.DateTimeField(source="created_at", read_only=True)
    expiresAt = serializers.DateTimeField(source="expires_at", read_only=True)
    updatedAt = serializers.DateTimeField(source="updated_at", read_only=True)  
    
    class Meta:
        model = ShortUrl
        fields = ['id', 'url', 'shortCode', 'createdAt', 'expiresAt', 'updatedAt']



class ShortUrlStatsSerializer(ShortUrlResponseSerializer):
    """
        For: GET /shorten/{shortCode}/stats
        Adds: accessCount
        
    """
    accessCount = serializers.IntegerField(source="access_count", read_only=True)

    class Meta(ShortUrlResponseSerializer.Meta):
        fields = ShortUrlResponseSerializer.Meta.fields + ["accessCount"]        