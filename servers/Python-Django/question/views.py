from django.http import HttpResponse
from question.models import Question

def index(request):
    return HttpResponse(Question.objects.all())