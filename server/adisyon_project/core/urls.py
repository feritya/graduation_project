from django.urls import path, include
from rest_framework.routers import DefaultRouter
from core.views import TableViewSet, ProductViewSet, OrderViewSet, ProductListView,OrderCreateView,SummaryReportView

router = DefaultRouter()
router.register(r'tables', TableViewSet)
router.register(r'products', ProductViewSet)
router.register(r'orders', OrderViewSet)

urlpatterns = [
    path('orders/create/', OrderCreateView.as_view(), name='order-create'),
    path('products/', ProductListView.as_view(), name='product-list'),
    path('reports/summary/', SummaryReportView.as_view(), name='report-summary'),
    path('', include(router.urls)),     
]
