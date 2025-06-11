# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
import uuid
from django.db import models
from django.contrib.postgres.fields import ArrayField

class Question(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    topic = models.CharField(max_length=255, blank=True, null=True)
    difficulty = models.CharField(max_length=50, blank=True, null=True)  # Instead of TextField, since difficulty is likely a short string like 'easy', 'medium'
    source = models.TextField(blank=True, null=True)
    options = ArrayField(models.TextField(), blank=False, null=False)  # Ideal if you want to store a list of options cleanly
    correct_index = models.IntegerField()
    text = models.TextField()

    def __str__(self):
        return self.text[:80]  # show a snippet of the question

    class Meta:
        db_table = 'questions'
        verbose_name = "Question"
        verbose_name_plural = "Questions"


