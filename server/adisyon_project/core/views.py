from django.shortcuts import render
from .filters import OrderFilter

from rest_framework import viewsets
from .models import Table, Product, Order, OrderItem, Category
from .serializers import TableSerializer, ProductSerializer, OrderSerializer, OrderItemSerializer, CategorySerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from core.permissions import IsWaiter
from rest_framework.decorators import action

from django.db.models import Sum,Count,F
from datetime import datetime
from django.utils.dateparse import parse_date
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters


class TableViewSet(viewsets.ModelViewSet):
    queryset = Table.objects.all()
    serializer_class = TableSerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().order_by('-created_at')
    serializer_class = OrderSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_class = OrderFilter
    ordering_fields = ['created_at']

    # 1. Sipariş durumunu güncelle
    @action(detail=True, methods=['patch'], url_path='update-status')
    def update_status(self, request, pk=None):
        order = self.get_object()
        new_status = request.data.get('status')

        valid_statuses = dict(Order.STATUS_CHOICES).keys()
        if new_status not in valid_statuses:
            return Response({"error": "Geçersiz durum."}, status=status.HTTP_400_BAD_REQUEST)

        order.status = new_status
        order.save()
        return Response({'message': f"Durum '{new_status}' olarak güncellendi."}, status=status.HTTP_200_OK)

    # 2. Ödeme durumunu doğrudan güncelle
    @action(detail=True, methods=['patch'], url_path='update-payment')
    def update_payment_status(self, request, pk=None):
        order = self.get_object()
        is_paid = request.data.get('is_paid')

        if str(is_paid).lower() not in ['true', 'false', '1', '0']:
            return Response({"error": "Geçersiz ödeme durumu (true/false olmalı)."}, status=status.HTTP_400_BAD_REQUEST)

        order.is_paid = str(is_paid).lower() in ['true', '1']
        order.save()
        return Response({'message': f"Ödeme durumu '{order.is_paid}' olarak güncellendi."}, status=status.HTTP_200_OK)

    # 3. Hızlıca 'ödendi' olarak işaretle
    @action(detail=True, methods=['patch'], url_path='mark-paid')
    def mark_as_paid(self, request, pk=None):
        order = self.get_object()

        if order.is_paid:
            return Response({"message": "Zaten ödenmiş."}, status=status.HTTP_400_BAD_REQUEST)

        order.is_paid = True
        order.status = 'paid'
        order.save()
        order.table.is_occupied = False
        order.table.save()

        return Response({"message": "Sipariş ödendi olarak işaretlendi."}, status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        order = self.get_object()

        for item in order.items.all():
            product = item.product
            product.stock += item.quantity
            product.save()

        order.table.is_occupied = False
        order.table.save()
        order.delete()

        return Response({"message": "Sipariş silindi ve stoklar iade edildi."}, status=status.HTTP_204_NO_CONTENT)
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
class OrderItemViewSet(viewsets.ModelViewSet):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer
class ProductListView(APIView):
    # permission_classes = [IsAuthenticated]

    def get(self, request):
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)
class OrderCreateView(APIView):
    # permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = OrderSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()  
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)     
class SummaryRepofrtView(APIView):
    def get(self, request):
        orders = Order.objects.filter(is_paid=True)

        total_revenue = OrderItem.objects.filter(order__in=orders).aggregate(
            revenue=Sum(F('product__price') * F('quantity'))
        )['revenue'] or 0

        total_items_sold = OrderItem.objects.filter(order__in=orders).aggregate(
            total=Sum('quantity')
        )['total'] or 0

        top_products = (
            OrderItem.objects
            .filter(order__in=orders)
            .values('product__name')
            .annotate(sold=Sum('quantity'))
            .order_by('-sold')[:5]
        )

        return Response({
            "total_revenue": total_revenue,
            "total_items_sold": total_items_sold,
            "top_products": list(top_products)
        })
class SummaryReportView(APIView):

    def get(self, request):
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        orders = Order.objects.filter(is_paid=True)
        if start_date:
            orders = orders.filter(created_at__date__gte=parse_date(start_date))
        if end_date:
            orders = orders.filter(created_at__date__lte=parse_date(end_date))

        total_revenue = orders.aggregate(total=Sum('items__product__price'))['total'] or 0

        total_items_sold = OrderItem.objects.filter(order__in=orders).aggregate(total=Sum('quantity'))['total'] or 0

        top_products = (
            OrderItem.objects.filter(order__in=orders)
            .values('product__name')
            .annotate(total_quantity=Sum('quantity'))
            .order_by('-total_quantity')[:5]
        )

        return Response({
            "total_revenue": total_revenue,
            "total_items_sold": total_items_sold,
            "top_products": top_products
        })


class DailyReportView(APIView):
    def get(self, request):
        today = datetime.today().date()
        orders = Order.objects.filter(is_paid=True, created_at__date=today)

        total_revenue = OrderItem.objects.filter(order__in=orders).aggregate(
            revenue=Sum(F('product__price') * F('quantity'))
        )['revenue'] or 0

        top_products = (
            OrderItem.objects
            .filter(order__in=orders)
            .values('product__name')
            .annotate(sold=Sum('quantity'))
            .order_by('-sold')
        )

        return Response({
            "date": str(today),
            "total_revenue": total_revenue,
            "top_products": list(top_products)
        })

class MonthlyReportView(APIView):
    def get(self, request):
        year = int(request.GET.get('year', datetime.today().year))
        month = int(request.GET.get('month', datetime.today().month))

        orders = Order.objects.filter(is_paid=True, created_at__year=year, created_at__month=month)

        total_revenue = OrderItem.objects.filter(order__in=orders).aggregate(
            revenue=Sum(F('product__price') * F('quantity'))
        )['revenue'] or 0

        top_products = (
            OrderItem.objects
            .filter(order__in=orders)
            .values('product__name')
            .annotate(sold=Sum('quantity'))
            .order_by('-sold')
        )

        return Response({
            "year": year,
            "month": month,
            "total_revenue": total_revenue,
            "top_products": list(top_products)
        })

class CustomDateRangeReportView(APIView):  
    def get(self, request):
        start_date = request.query_params.get('start')
        end_date = request.query_params.get('end')

        if not start_date or not end_date:
            return Response(
                {"error": "Lütfen 'start' ve 'end' tarihlerini belirtin."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            start = datetime.strptime(start_date, "%Y-%m-%d").date()
            end = datetime.strptime(end_date, "%Y-%m-%d").date()
        except ValueError as e:
            return Response(
                {"error": f"Tarih formatı hatalı: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Buradan sonrası aynı kalıyor
        orders = Order.objects.filter(is_paid=True, created_at__date__range=(start, end))

        total_revenue = OrderItem.objects.filter(order__in=orders).aggregate(
            revenue=Sum(F('product__price') * F('quantity'))
        )['revenue'] or 0

        top_products = (
            OrderItem.objects
            .filter(order__in=orders)
            .values('product__name')
            .annotate(sold=Sum('quantity'))
            .order_by('-sold')
        )

        return Response({
            "start": start_date,
            "end": end_date,
            "total_revenue": total_revenue,
            "top_products": list(top_products)
        })