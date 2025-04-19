from rest_framework import serializers
from .models import Table, Product, Order, OrderItem
from rest_framework.exceptions import ValidationError

class TableSerializer(serializers.ModelSerializer):
    class Meta:
        model = Table
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)  # Ürün bilgilerini içerecek şekilde ayarlandı
    product_id = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all(), source='product' )
    class Meta:
        model = OrderItem
        fields = ['product', 'product_id', 'quantity']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=False)
    total_price = serializers.SerializerMethodField()
    class Meta:
        model = Order
        fields = ['id', 'table', 'waiter', 'is_paid','status', 'items', 'total_price',]
        read_only_fields = ['created_at']

    def get_total_price(self, obj):
        return sum(item.product.price * item.quantity for item in obj.items.all())

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        table= validated_data.pop('table')

        existing_order = Order.objects.filter(table=table, is_paid=False).first()
        if existing_order:
            raise serializers.ValidationError(f"Bu masa için zaten açık bir sipariş var. sipariş id: {existing_order.id}" )

        order = Order.objects.create(table=table ,**validated_data )

        order.table.is_occupied = True
        order.table.save()

        for item_data in items_data:
            product = item_data['product']
            quantity = item_data['quantity']

            if product.stock < quantity:
                raise serializers.ValidationError(
                    f"'{product.name}' ürününden yeterli stok yok. Mevcut stok: {product.stock}"
                )
            product.stock -= quantity
            product.save()
            OrderItem.objects.create(order=order, product=product, quantity=quantity)
        return order

    def update(self, instance, validated_data):
        items_data = validated_data.pop('items', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if items_data is not None:
            previous_items = {item.product.id: item.quantity for item in instance.items.all()} # Eski ürünleri ve miktarlarını al
            # Eski ürünleri sil
            instance.items.all().delete()
            # Yeni ürünleri ekle
            for item_data in items_data:
                product = item_data['product']
                quantity = item_data['quantity']
                previous_quantity = previous_items.get(product.id, 0)

                quantity_diff   = quantity - previous_quantity # Yeni miktar ile eski miktar arasındaki farkı hesapla

                if product.stock < quantity_diff:
                    raise serializers.ValidationError(
                        f"'{product.name}' ürününden yeterli stok yok. Mevcut stok: {product.stock}"
                    )
                product.stock -= quantity_diff  
                product.save()
                OrderItem.objects.create(order=instance, product=product, quantity=quantity)

        return instance