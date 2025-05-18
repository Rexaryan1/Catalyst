from django.shortcuts import render
from django.http import *
from users.models import Users

# Create your views here.
def index(request : HttpRequest):
    if request.method == "GET":
        return HttpResponse(Users.objects.all())
    elif request.method == "POST":
        print("hit")
        Users.objects.get_or_create(request.body)