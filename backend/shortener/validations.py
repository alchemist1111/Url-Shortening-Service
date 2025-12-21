from django.core.exceptions import ValidationError
from django.core.validators import URLValidator


# Validate that a URL uses http or https scheme
def validate_url(self, value: str) -> str:
    # Enforce http/https only
    if not (value.startswith('http://') or value.startswith('https://')):
        raise ValidationError('URL must start with http:// or https://')
    return value
    