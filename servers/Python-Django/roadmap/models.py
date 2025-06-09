# roadmap/models.py

import uuid
from django.db import models
from question.models import Question
from users.models import User  


class Roadmap(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.DO_NOTHING, blank=True, null=True)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    modified_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    class Meta:
        db_table = 'roadmaps'
        verbose_name = "Roadmap"
        verbose_name_plural = "Roadmaps"

    def __str__(self):
        return self.title


class RoadmapQuestion(models.Model):
    roadmap = models.ForeignKey(Roadmap, on_delete=models.CASCADE, primary_key=True)
    question = models.ForeignKey(Question, on_delete=models.CASCADE, primary_key=True)
    position = models.IntegerField(blank=True, null=True)

    class Meta:
        db_table = 'roadmap_question'
        unique_together = (('roadmap', 'question'),)
        managed = False

