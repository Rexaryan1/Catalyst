# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class Answers(models.Model):
    id = models.UUIDField(primary_key=True)
    user = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)
    roadmap = models.ForeignKey('Roadmaps', models.DO_NOTHING, blank=True, null=True)
    question = models.ForeignKey('Questions', models.DO_NOTHING, blank=True, null=True)
    selected_index = models.IntegerField()
    is_correct = models.BooleanField(blank=True, null=True)
    answered_at = models.DateTimeField(blank=True, null=True)
    time_taken_seconds = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'answers'
        unique_together = (('user', 'roadmap', 'question'),)


class QuestionAttempts(models.Model):
    id = models.UUIDField(primary_key=True)
    user = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)
    question = models.ForeignKey('Questions', models.DO_NOTHING, blank=True, null=True)
    attempt_count = models.IntegerField(blank=True, null=True)
    correct_attempts = models.IntegerField(blank=True, null=True)
    incorrect_attempts = models.IntegerField(blank=True, null=True)
    last_attempted_at = models.DateTimeField(blank=True, null=True)
    total_time_spent_seconds = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'question_attempts'


class Questions(models.Model):
    id = models.UUIDField(primary_key=True)
    topic = models.CharField(blank=True, null=True)
    difficulty = models.TextField(blank=True, null=True)  # This field type is a guess.
    source = models.TextField(blank=True, null=True)
    options = models.TextField()  # This field type is a guess.
    correct_index = models.IntegerField()
    text = models.TextField()

    def __str__(self):
        return self.text 
    
    class Meta:
        managed = False
        db_table = 'questions'


class RoadmapQuestion(models.Model):
    pk = models.CompositePrimaryKey('roadmap_id', 'question_id')
    roadmap = models.ForeignKey('Roadmaps', models.DO_NOTHING)
    question = models.ForeignKey(Questions, models.DO_NOTHING)
    position = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'roadmap_question'


class Roadmaps(models.Model):
    id = models.UUIDField(primary_key=True)
    user = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)
    title = models.CharField()
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    modified_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'roadmaps'


class UserProfiles(models.Model):
    user = models.OneToOneField('Users', models.DO_NOTHING, primary_key=True)
    learning_streak = models.IntegerField(blank=True, null=True)
    strong_topics = models.TextField(blank=True, null=True)  # This field type is a guess.
    weak_topics = models.TextField(blank=True, null=True)  # This field type is a guess.
    average_accuracy = models.FloatField(blank=True, null=True)
    avg_difficulty = models.FloatField(blank=True, null=True)
    average_time_per_question = models.FloatField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    modified_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'user_profiles'


class Users(models.Model):
    id = models.UUIDField(primary_key=True)
    email = models.CharField(unique=True, max_length=255)
    name = models.CharField(max_length=100, blank=True, null=True)
    password_hash = models.TextField(blank=True, null=True)
    auth_provider = models.CharField(max_length=50, blank=True, null=True)
    provider_user_id = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'users'
