from django.db import models
from django.core.validators import URLValidator
from django.core.exceptions import ValidationError
from django.utils import timezone
import secrets
import string
import uuid

# Model for shortened URLs
class ShortUrl(models.Model):
    """
       Stores original URLs and their generated short codes.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    original_url = models.URLField(max_length=2028)
    short_code = models.CharField(max_length=50, unique=True)
    access_count = models.BigIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'short_urls'
        indexes = [
            models.Index(fields=['short_code'], name='idx_short_code'),
            models.Index(fields=['created_at'], name='idx_created_at'),
            models.Index(fields=['expires_at'], name='idx_expires_at'),
            models.Index(fields=['updated_at'], name='idx_updated_at'),
        ]
    
    def __str__(self) -> str:
        return f"{self.short_code} for original url: {self.original_url}"  
    
    @staticmethod
    def _generate_short_code(length: int=6) -> str:
        """
          Generate a random Base62 short code.
          6 chars => 62^6 possibilities (~56.8B).
          
        """
        alphabet = string.ascii_letters + string.digits
        return ''.join(secrets.choice(alphabet) for _ in range(length))
    
    @classmethod
    def create_unique(cls, original_url: str, length: int = 6, max_attempts: int = 10, expires_at: timezone.datetime = None) -> "ShortUrl":
        """
           Create a ShortURL with a unique short_code.
           Uses the database UNIQUE constraint as the final authority.
           Retries on collisions.
           Sets expiration.
           Returns the created ShortUrl instance.    
        
        """  
        # Validate the original URL
        validator = URLValidator(schemes=['http', 'https'])
        try:
            validator(original_url)
        except ValidationError as e:
            raise ValidationError({'url': 'Enter a valid http(s) URL.'}) from e
        
        for _ in range(max_attempts):
            code = cls._generate_short_code(length)
            if not cls.objects.filter(short_code=code).exists():
                return cls.objects.create(
                    original_url=original_url,
                    short_code=code,
                    expires_at=expires_at,
                )
        # If collisions are extremely unlucky
        raise RuntimeError("Could not generate a unique short code. Try increasing code length.")
    
    
    def update_url(self, new_url: str) -> None:
        """
           Update the original URL and save.
        """
        validator = URLValidator(schemes=["http", "https"])
        validator(new_url)
        self.original_url = new_url
        self.updated_at = timezone.now()
        self.save(update_fields=["original_url", "updated_at"])        
                
