from django.http import HttpResponse
from question.models import models

def index(request):
    return HttpResponse(models.)