# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class UserProfiles(models.Model):
    user = models.OneToOneField('Users', models.DO_NOTHING, primary_key=True)
    learning_streak = models.IntegerField(blank=True, null=True)
    strong_topics = models.JSONField(default=list , blank=True)
    weak_topics = models.TextField(blank=True, null=True)  # This field type is a guess.
    average_accuracy = models.FloatField(blank=True, null=True)
    avg_difficulty = models.FloatField(blank=True, null=True)
    average_time_per_question = models.FloatField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    modified_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'user_profiles'

class UserManager(models.Manager):
    def create_user(self,user):
        user = self.create(user)
        return user

class Users(models.Model):
    id = models.UUIDField(primary_key=True)
    email = models.CharField(unique=True, max_length=255)
    name = models.CharField(max_length=100, blank=True, null=True)
    password_hash = models.TextField(blank=True, null=True)
    auth_provider = models.CharField(max_length=50, blank=True, null=True)
    provider_user_id = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    objects = UserManager

    @classmethod
    def create(self,user):
        User = self.create(user)
        return User 

    class Meta:
        managed = False
        db_table = 'users'
