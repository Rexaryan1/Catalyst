from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain_groq import ChatGroq  # Import Groq's LLM
from users.models import UserProfile
from django.conf import settings

def buildUserProfile(user_id):
    profile = UserProfile.objects.get(user_id=user_id)

    user_data = {
        "learning_streak": profile.learning_streak,
        "strong_topics": profile.strong_topics,
        "weak_topics": profile.weak_topics,
        "average_accuracy": profile.average_accuracy,
        "avg_difficulty": profile.avg_difficulty,
        "average_time_per_question": profile.average_time_per_question
    }

    template = """
    You are an AI learning coach analyzing user study performance. Given the following data, write a brief summary of the user's learning behavior, strengths, and areas to improve.

    Data:
    - Learning Streak: {learning_streak} days
    - Strong Topics: {strong_topics}
    - Weak Topics: {weak_topics}
    - Average Accuracy: {average_accuracy}%
    - Average Difficulty Attempted: {avg_difficulty}
    - Average Time per Question: {average_time_per_question} seconds

    Write a paragraph summarizing this user's learning profile in clear English.
    """

    prompt = PromptTemplate.from_template(template)

    # Replace with your actual Groq API key or load it from env vars
    llm = ChatGroq(model="llama3-70b-8192", api_key= settings.AI["key"])
    chain = LLMChain(llm=llm, prompt=prompt)
    summary = chain.run(user_data)
    return summary

