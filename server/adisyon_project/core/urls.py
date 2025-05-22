from django.urls import path, include
from rest_framework.routers import DefaultRouter
from core.views import TableViewSet, ProductViewSet, OrderViewSet, ProductListView,OrderCreateView,SummaryReportView,CategoryViewSet,DailyReportView,MonthlyReportView,CustomDateRangeReportView

router = DefaultRouter()
router.register(r'tables', TableViewSet)

router.register(r'orders', OrderViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'products', ProductViewSet)
urlpatterns = [
    path('reports/daily/', DailyReportView.as_view(), name='report-daily'),

    path('reports/monthly/', MonthlyReportView.as_view(), name='report-monthly'),
    path('reports/custom/', CustomDateRangeReportView.as_view(), name='report-custom'),
    path('', include(router.urls)),     
]
