from django.conf.urls import url
from . import views

urlpatterns = [
	url(r'^$', views.home, name='home'),
	url(r'^home/$', views.home, name='home'),
	url(r'^posts/$', views.index, name='home'),
	url(r'^details/(?P<id>\d+)/$', views.details, name='details')
]
