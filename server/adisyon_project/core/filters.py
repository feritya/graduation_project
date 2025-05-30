import django_filters
from .models import Order

class OrderFilter(django_filters.FilterSet):
    class Meta:
        model = Order
        fields = {
            'is_paid': ['exact'],
            'status': ['exact'],
        }
