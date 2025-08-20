from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.postgres.fields import ArrayField
from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.db.models import Count, Q, Subquery, OuterRef

# Create your models here.
class User(AbstractUser):
    name = models.CharField(max_length=255)
    email = models.EmailField(max_length=255, unique=True)
    password = models.CharField(max_length=255)
    username = None
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

class UserProfileQuerySet(models.QuerySet):
    def with_computed_fields(self):
        from roadmap.models import Roadmap
        from practice.models import Answer

        roadmap_count = models.Subquery(
            Roadmap.objects
            .filter(user=OuterRef('user'))
            .order_by()
            .values('user')
            .annotate(rcount=Count('id'))
            .values('rcount')[:1]
        )
        question_solved_count = models.Subquery(
            Answer.objects
            .filter(user=OuterRef('user'), is_correct=True)
            .order_by()
            .values('user')
            .annotate(qcount=Count('id'))
            .values('qcount')[:1]
        )
        return self.annotate(
            total_roadmaps_generated=roadmap_count,
            total_questions_solved=question_solved_count,
        )


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
    taste_keywords_list = models.JSONField(default=list, blank=True)
    embedding_list = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    modified_at = models.DateTimeField(auto_now=True, blank=True, null=True)
    objects = UserProfileQuerySet.as_manager()