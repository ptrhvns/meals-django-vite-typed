"""config URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django import urls
from django.conf import settings
from django.contrib import admin

urlpatterns = [
    urls.path("api/accounts/", urls.include("accounts.urls")),
    urls.path("api/recipes/", urls.include("recipes.urls")),
    urls.path("api/shared/", urls.include("shared.urls")),
]

if settings.DEBUG:
    urlpatterns += [urls.path("admin/", admin.site.urls)]
