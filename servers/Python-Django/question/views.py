from django.http import HttpResponse
from question.models import Questions

def index(request):
    return HttpResponse(Questions.objects.all())