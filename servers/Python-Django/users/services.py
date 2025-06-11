
import json
from django.conf import settings
from typing import Optional
from django.utils import timezone
from users.models import UserProfile, User
import ollama
from groq import Groq

client = Groq(api_key= settings.AI["key"])

class RoadmapGenerationError(Exception):
    """Custom exception for roadmap generation failures"""
    pass


class RoadmapService:
    def __init__(self):
        self.llm_model = "llama3.2"
        self.base_prompt = """You are an expert JEE preparation advisor. Create a detailed study roadmap 
        based on the following student profile and additional instructions:"""

    def _get_user_profile(self, user_id: str) -> Optional[UserProfile]:
        try:
            return UserProfile.objects.get(user__id=user_id)
        except UserProfile.DoesNotExist:
            return None
        except Exception as e:
            raise RoadmapGenerationError(f"Error fetching profile: {str(e)}")

    def _format_weak_topics(self, weak_topics: str) -> list:
        """Convert comma-separated weak topics string to list"""
        return [topic.strip() for topic in weak_topics.split(',')] if weak_topics else []

    def build_structured_prompt(self, user_id: str, user_prompt: str) -> str:
        profile = self._get_user_profile(user_id)
        if not profile:
            raise RoadmapGenerationError("User profile not found")

        try:
            # Format profile data
            weak_topics_list = self._format_weak_topics(profile.weak_topics)

            structured_data = {
                "learning_streak": profile.learning_streak,
                "strong_topics": json.loads(profile.strong_topics),
                "weak_topics": weak_topics_list,
                "average_accuracy": profile.average_accuracy,
                "avg_difficulty": profile.avg_difficulty,
                "time_per_question": profile.average_time_per_question,
                "last_updated": profile.modified_at.strftime("%Y-%m-%d")
            }

            prompt = f"{self.base_prompt}\n\nStudent Profile:\n{json.dumps(structured_data, indent=2)}\n\n"
            prompt += f"Additional Instructions:\n{user_prompt}\n\n"
            prompt += "Provide a week-by-week roadmap focusing on weak areas while maintaining strong topics. Include roadmap recommendations and key milestones."

            return prompt

        except Exception as e:
            raise RoadmapGenerationError(f"Error building prompt: {str(e)}")

    def generate_roadmap(self, user_id: str, user_prompt: str) -> dict:
        try:
            response = client.chat.completions.create(
                model=settings.AI["model"],
                messages=[
                    {
                        "role": "user",
                        "content": structured_prompt
                    }
                ],
            )
            response = response.choices[0].message.content

            return {
                "roadmap": response,
                "prompt_used": structured_prompt,
                "model": self.llm_model,
                "generated_at": timezone.now().isoformat()
            }

        except Exception as e:
            raise RoadmapGenerationError(f"Generation failed: {str(e)}")
