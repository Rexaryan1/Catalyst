from django.shortcuts import render
from django.http import *
from users.models import User
from users.services import *

# Create your views here.
def index(request : HttpRequest):
    if request.method == "GET":
        return HttpResponse(User.objects.all())
    elif request.method == "POST":
        print("hit")
        User.objects.get_or_create(request.body)

def roadmap(request : HttpRequest):
    user1 = User.objects.all()
    user1 = user1[0]
    AI_response = RoadmapService.generate_roadmap(user1.id,"Generate a roadmap")
    return HttpResponse(AI_response['roadmap'])
