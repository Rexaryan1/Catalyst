import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Catalyst.settings")
django.setup()




import uuid
import random
from django.utils import timezone
from users.models import User, UserProfile
from roadmap.models import Roadmap, RoadmapQuestion
from question.models import Question
from practice.models import Answer, QuestionAttempt



# Fetch at least 5 existing questions
questions = list(Question.objects.all()[:5])
if len(questions) < 5:
    raise Exception("❌ You must have at least 5 questions in the DB.")

# ✅ 1. Create Users
users = []
for i in range(5):
    user = User.objects.create(
        id=uuid.uuid4(),
        email=f"user{i}@example.com",
        name=f"User {i}",
        password_hash="dummy_hash",
        auth_provider="email"
    )
    users.append(user)

# ✅ 2. Create UserProfiles
for user in users:
    UserProfile.objects.create(
        user=user,
        learning_streak=random.randint(1, 10),
        strong_topics=["loops", "recursion"],
        weak_topics=["graph", "math"],
        average_accuracy=round(random.uniform(50, 100), 2),
        avg_difficulty=round(random.uniform(1, 3), 2),
        average_time_per_question=round(random.uniform(20, 100), 2)
    )

# ✅ 3. Create Roadmaps
roadmaps = []
for i, user in enumerate(users):
    roadmap = Roadmap.objects.create(
        id=uuid.uuid4(),
        user=user,
        title=f"Learning Path {i}",
        description=f"Auto-generated roadmap {i}"
    )
    roadmaps.append(roadmap)

# ✅ 4. Create RoadmapQuestions
for roadmap in roadmaps:
    sample_questions = random.sample(questions, 5)
    for pos, question in enumerate(sample_questions):
        RoadmapQuestion.objects.create(
            roadmap=roadmap,
            question=question,
            position=pos + 1
        )

# ✅ 5. Create Answers
for user in users:
    for roadmap in random.sample(roadmaps, 3):
        for question in random.sample(questions, 3):
            Answer.objects.create(
                id=uuid.uuid4(),
                user=user,
                roadmap=roadmap,
                question=question,
                selected_index=random.randint(0, len(question.options) - 1),
                is_correct=random.choice([True, False]),
                answered_at=timezone.now(),
                time_taken_seconds=random.randint(10, 60)
            )

# ✅ 6. Create QuestionAttempts
for user in users:
    for question in random.sample(questions, 5):
        QuestionAttempt.objects.create(
            id=uuid.uuid4(),
            user=user,
            question=question,
            attempt_count=random.randint(1, 3),
            correct_attempts=random.randint(0, 2),
            incorrect_attempts=random.randint(0, 2),
            total_time_spent_seconds=random.randint(30, 300),
            last_attempted_at=timezone.now()
        )

print("✅ All models populated with at least 5 entries.")

