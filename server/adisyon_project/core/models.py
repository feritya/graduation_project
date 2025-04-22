from django.db import models
from users.models import CustomUser

class Table(models.Model): #bu sınıf masa bilgilerini tutmak için kullanılıyor
   
    name = models.CharField(max_length=20, default="masa")
    is_occupied = models.BooleanField(default=False)
    
    def __str__(self):
        return self.name

class Product(models.Model): #bu sınıf ürün bilgilerini tutmak için kullanılıyor
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.name

class Order(models.Model): #bu sınıf sipariş bilgilerini tutmak için kullanılıyor

    STATUS_CHOICES = [
        ('received', 'Alındı'),
        ('preparing', 'Hazırlanıyor'),
        ('ready', 'Hazır'),
        ('served', 'Serviste'),
        ('paid', 'Ödendi'),
    ]

    table = models.ForeignKey(Table, on_delete=models.CASCADE) 
    waiter = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True, limit_choices_to={'role': 'waiter'})
    created_at = models.DateTimeField(auto_now_add=True)
    is_paid = models.BooleanField(default=False)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='received')  


    def __str__(self):
        return f"{self.table} - {self.created_at.strftime('%d.%m.%Y %H:%M')}" #bu şekilde tarih ve saat formatını değiştirdik

class OrderItem(models.Model): #bu sınıf sipariş içeriğini tutmak için kullanılıyor
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items') #sipariş bilgisi
    product = models.ForeignKey(Product, on_delete=models.CASCADE) #ürün bilgisi
    quantity = models.PositiveIntegerField() #ürün adedi

    def __str__(self):
        return f"{self.quantity} x {self.product.name}" #bu şekilde siparişin içeriğini gösteriyoruz
