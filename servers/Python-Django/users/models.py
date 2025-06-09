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

class User(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.CharField(unique=True, max_length=255)
    name = models.CharField(max_length=100, blank=True, null=True)
    password_hash = models.TextField(blank=True, null=True)
    auth_provider = models.CharField(max_length=50, blank=True, null=True)
    provider_user_id = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)

    class Meta:
        db_table = 'users'
        managed = False  # keep this only if Django is NOT managing this table
        verbose_name = "User"
        verbose_name_plural = "Users"

    def __str__(self):
        return self.email


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    learning_streak = models.IntegerField(blank=True, null=True)
    strong_topics = ArrayField(
        base_field=models.TextField(),
        default=list,
        blank=True,
    )
    weak_topics = ArrayField(
        base_field=models.TextField(),
        default=list,
        blank=True,
    )
    average_accuracy = models.FloatField(blank=True, null=True)
    avg_difficulty = models.FloatField(blank=True, null=True)
    average_time_per_question = models.FloatField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    modified_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    class Meta:
        db_table = 'user_profiles'
        managed = False  # same note as above
        verbose_name = "User Profile"
        verbose_name_plural = "User Profiles"

    def __str__(self):
        return f"Profile of {self.user.email}"


