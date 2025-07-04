from .profileSynthesis import buildUserProfile
from typing import Dict, Any, List, Optional
import chromadb
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
import json
import logging
from langchain_groq import ChatGroq
from django.conf import settings

logger = logging.getLogger(__name__)


def generate_roadmap(user_id, subject, topic, additional_comments=None):
    # Placeholder logic — replace with actual roadmap generation logic
    llm = ChatGroq(model="llama3-70b-8192", api_key=settings.AI["key"])
    profile = buildUserProfile(user_id)
    question_set = fetch_relevant_questions(subject, topic, additional_comments)
    final_roadmap = generate_roadmap_blocks(llm, profile, subject, topic, additional_comments, question_set)

    return final_roadmap


def fetch_relevant_questions(
        subject: str,
        topic: str,
        additional_comments: Optional[str] = "",
        n_results: int = 50
) -> List[Dict]:
    """
    Perform similarity search on ChromaDB to fetch relevant questions

    Args:
        subject: Main subject area
        topic: Specific topic within the subject
        additional_comments: Extra context or user input
        n_results: Number of questions to retrieve

    Returns:
        List of relevant questions with metadata
    """
    try:
        # better and industry way of initialising the chroma db
        chroma_client = chromadb.PersistentClient(path="/Users/abhinavrana/Catalyst/servers/chroma_db")
        collection = chroma_client.get_or_create_collection(name="questions")
        search_query = f"{subject} {topic} {additional_comments}".strip()

        # Perform similarity search
        results = collection.query(
            query_texts=[search_query],
            n_results=n_results,
            include=['documents', 'metadatas', 'distances']
        )

        # Structure the results
        questions = []
        for i in range(len(results['documents'][0])):
            question_data = {
                'id': results['ids'][0][i] if 'ids' in results else f"q_{i}",
                'text': results['documents'][0][i],
                'topic': results['metadatas'][0][i].get('topic', topic),
                'difficulty': results['metadatas'][0][i].get('difficulty', 'medium'),
                'source': results['metadatas'][0][i].get('source', 'unknown'),
                'similarity_score': 1 - results['distances'][0][i]  # Convert distance to similarity
            }
            questions.append(question_data)

        logger.info(
            f"Retrieved {len(questions)} questions for query: {search_query}"
        )
        return questions

    except Exception as e:
        logger.error(f"Error fetching questions: {str(e)}")
        return []


def generate_roadmap_blocks(
        llm,
        user_profile: str,
        subject: str,
        topic: str,
        additional_comments: str,
        questions: List[Dict],
        num_blocks: int = 5,
        questions_per_block: int = 4
) -> Dict[str, Any]:
    """
    Generate intelligent roadmap blocks using LLM
    """
    questions_summary = []
    for q in questions[:50]:  # Max limit for prompt brevity
        questions_summary.append({
            'id': q['id'],
            'text': q['text'][:200] + "..." if len(q['text']) > 200 else q['text'],
            'difficulty': q['difficulty'],
            'topic': q['topic'],
            'similarity_score': round(q.get('similarity_score', 0), 3)
        })

    template = """
    You are an expert education strategist and curriculum designer. Your goal is to construct a personalized and structured roadmap for the learner using the provided questions.

    === USER PROFILE ===
    {user_profile}

    === LEARNING REQUEST ===
    - Subject: {subject}
    - Topic: {topic}
    - Additional Instructions: {additional_comments}

    === QUESTION BANK ===
    {questions_data}

    === TASK ===
    1. Design a structured roadmap with {num_blocks} learning blocks, each having ~{questions_per_block} questions.
    2. Evaluate each question for clarity, relevance, and alignment with the topic and user profile.
    3. You MAY DROP irrelevant or redundant questions.
    4. You MAY REORDER or GROUP questions into logical learning steps.
    5. You MAY ADD new synthetic questions to ensure flow and continuity.
    6. Each block should build on the previous one, progressing from basics to mastery.
    7. Vary difficulty across blocks (start easy, end hard or balanced).
    8. Give each block a title and 1-2 sentence description.
    9. For each question, add a clear learning objective.

    === OUTPUT FORMAT (Strict JSON) ===
    {{
        "roadmap_title": "Personalized Learning Path for {topic}",
        "total_blocks": {num_blocks},
        "estimated_duration": "X hours",
        "difficulty_level": "beginner/intermediate/advanced/mixed",
        "blocks": [
            {{
                "block_number": 1,
                "block_title": "Introductory Concepts",
                "block_description": "What this block will teach the learner",
                "estimated_time": "20 minutes",
                "questions": [
                    {{
                        "question_id": "existing_or_synthetic_id",
                        "question_text": "Actual or modified question text",
                        "difficulty": "easy/medium/hard",
                        "topic": "Micro-topic name",
                        "learning_objective": "What the learner will gain"
                    }}
                ]
            }}
        ],
        "learning_tips": "High-quality advice for the learner"
    }}

    ONLY return valid JSON. DO NOT include markdown or explanations.
    """

    prompt = PromptTemplate.from_template(template)

    try:
        chain = LLMChain(llm=llm, prompt=prompt)
        response = chain.run({
            'user_profile': user_profile,
            'subject': subject,
            'topic': topic,
            'additional_comments': additional_comments or "None",
            'questions_data': json.dumps(questions_summary, indent=2),
            'num_blocks': num_blocks,
            'questions_per_block': questions_per_block
        })

        try:
            roadmap = json.loads(response.strip())
            logger.info("Successfully generated intelligent roadmap.")
            return roadmap
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse LLM response: {e}")
            return create_fallback_roadmap(questions, num_blocks, questions_per_block)

    except Exception as e:
        logger.error(f"LLM chain failed: {e}")
        return create_fallback_roadmap(questions, num_blocks, questions_per_block)


def create_fallback_roadmap(
        questions: List[Dict],
        num_blocks: int,
        questions_per_block: int
) -> Dict[str, Any]:
    """
    Generate a simple deterministic roadmap if LLM fails
    """
    difficulty_order = {'easy': 1, 'medium': 2, 'hard': 3}
    sorted_questions = sorted(questions, key=lambda q: difficulty_order.get(q['difficulty'], 2))

    blocks = []
    idx = 0

    for block_num in range(1, num_blocks + 1):
        block_questions = []
        for _ in range(questions_per_block):
            if idx < len(sorted_questions):
                q = sorted_questions[idx]
                block_questions.append({
                    "question_id": q['id'],
                    "question_text": q['text'],
                    "difficulty": q['difficulty'],
                    "topic": q['topic'],
                    "learning_objective": f"Understand key concept in {q['topic']}"
                })
                idx += 1

        blocks.append({
            "block_number": block_num,
            "block_title": f"Block {block_num}: {'Foundations' if block_num == 1 else 'Advanced Concepts'}",
            "block_description": f"This block focuses on key areas for step {block_num}",
            "estimated_time": f"{15 + block_num * 5} minutes",
            "questions": block_questions
        })

    return {
        "roadmap_title": "Auto-Generated Learning Roadmap",
        "total_blocks": num_blocks,
        "estimated_duration": f"{num_blocks * 20} minutes",
        "difficulty_level": "mixed",
        "blocks": blocks,
        "learning_tips": "Begin with foundational blocks and revisit challenging topics after each review."
    }