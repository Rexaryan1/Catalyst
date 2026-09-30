// Mock payload for the /preview route — lets the session-quiz-page UI be
// checked against upcoming set types (reading-comprehension stimulus text,
// data-interpretation tables) before the real backend contract lands.
export const SESSION_PREVIEW_MOCK = {
  "sessionId": "7f3c1e2a-9b4d-4e6f-8a2c-1d5e9f0b3a7c",
  "date": "2026-09-15",
  "subject": "CAT",
  "questionCount": 7,
  "estimatedMinutes": 8,
  "weeklyProgress": 3,
  "bloomsRange": { "min": 1, "max": 5 },
  "overallAccuracy": 71,
  "focusAreas": [
    {
      "topic": "Reading Comprehension",
      "type": "review",
      "questionCount": 2,
      "difficulty": "medium",
      "topicHeadline": "Consolidate: Reading Comprehension",
      "reason": "65-79% recent accuracy — ready to move past basic recall.",
      "accuracy": null,
      "questions": [
        {
          "id": "a1b2c3d4-0001-4a11-8b11-000000000001",
          "text": "The passage primarily argues that urban foxes…",
          "response_type": "mcq",
          "difficulty": "medium",
          "bloom_level": 2,
          "snippet_body": null,
          "snippet_line_range": null,
          "snippet_output": null,
          "image_url": null,
          "table_data": null,
          "table_name": null,
          "table_unit": null,
          "stimulus_text": "For centuries, foxes were creatures of hedgerow and woodland edge, wary of anything that smelled of smoke or steel. The animals now denning under garden sheds in London and Berlin are, technically, the same species — but city foxes forage on a schedule tuned to bin-collection days, cross roads at signalled junctions, and show measurably less fear of direct human eye contact than their rural cousins. Biologists call this shift “behavioural plasticity”; it is not evolution in the genetic sense, since a fox born in Bristol and one born in the Chilterns are not yet meaningfully different animals. What has changed is faster, and stranger: a species learning, within a handful of generations, to read a city the way it once read a forest.",
          "isBookmarked": false,
          "status": "unanswered",
          "options": [
            "have genetically diverged from their rural counterparts within a few generations",
            "have adapted their behaviour, not their biology, to city life",
            "are less intelligent than rural foxes due to human contact",
            "avoid roads and bin-collection schedules out of learned fear"
          ],
          "snippet_language": null
        },
        {
          "id": "a1b2c3d4-0001-4a11-8b11-000000000002",
          "text": "The phrase “read a city the way it once read a forest” most nearly suggests that urban foxes…",
          "response_type": "mcq",
          "difficulty": "hard",
          "bloom_level": 4,
          "snippet_body": null,
          "snippet_line_range": null,
          "snippet_output": null,
          "image_url": null,
          "table_data": null,
          "table_name": null,
          "table_unit": null,
          "stimulus_text": "For centuries, foxes were creatures of hedgerow and woodland edge, wary of anything that smelled of smoke or steel. The animals now denning under garden sheds in London and Berlin are, technically, the same species — but city foxes forage on a schedule tuned to bin-collection days, cross roads at signalled junctions, and show measurably less fear of direct human eye contact than their rural cousins. Biologists call this shift “behavioural plasticity”; it is not evolution in the genetic sense, since a fox born in Bristol and one born in the Chilterns are not yet meaningfully different animals. What has changed is faster, and stranger: a species learning, within a handful of generations, to read a city the way it once read a forest.",
          "isBookmarked": false,
          "status": "unanswered",
          "options": [
            "navigate and interpret urban cues with the same instinctive skill they once applied to wild terrain",
            "are unable to survive without human intervention",
            "prefer forests to cities but were forced to relocate",
            "have lost their ability to sense danger"
          ],
          "snippet_language": null
        }
      ]
    },
    {
      "topic": "Data Interpretation",
      "type": "weakness",
      "questionCount": 4,
      "difficulty": "mixed",
      "topicHeadline": "Focus: Data Interpretation",
      "reason": "54% on 19 attempt(s).",
      "accuracy": 54,
      "questions": [
        {
          "id": "b2c3d4e5-0002-4b22-8c22-000000000001",
          "text": "Which department had the largest absolute increase in headcount from 2022 to 2024?",
          "response_type": "mcq",
          "difficulty": "easy",
          "bloom_level": 1,
          "snippet_body": null,
          "snippet_line_range": null,
          "snippet_output": null,
          "image_url": null,
          "table_data": {
            "header": ["Department", "2022", "2023", "2024"],
            "rows": [
              ["Engineering", 42, 58, 71],
              ["Sales", 30, 33, 29],
              ["Support", 18, 26, 35],
              ["Design", 9, 11, 14]
            ]
          },
          "table_name": "Employees per Department (2022–2024)",
          "table_unit": "employees",
          "stimulus_text": null,
          "isBookmarked": false,
          "status": "unanswered",
          "options": ["Engineering", "Support", "Design", "Sales"],
          "snippet_language": null
        },
        {
          "id": "b2c3d4e5-0002-4b22-8c22-000000000002",
          "text": "In 2023, what share of the total headcount across all four departments did Sales represent, to the nearest whole percent?",
          "response_type": "mcq",
          "difficulty": "medium",
          "bloom_level": 3,
          "snippet_body": null,
          "snippet_line_range": null,
          "snippet_output": null,
          "image_url": null,
          "table_data": {
            "header": ["Department", "2022", "2023", "2024"],
            "rows": [
              ["Engineering", 42, 58, 71],
              ["Sales", 30, 33, 29],
              ["Support", 18, 26, 35],
              ["Design", 9, 11, 14]
            ]
          },
          "table_name": "Employees per Department (2022–2024)",
          "table_unit": "employees",
          "stimulus_text": null,
          "isBookmarked": false,
          "status": "unanswered",
          "options": ["21%", "26%", "31%", "36%"],
          "snippet_language": null
        },
        {
          "id": "b2c3d4e5-0002-4b22-8c22-000000000003",
          "text": "Which department is the only one to see a year-on-year decline in any period shown?",
          "response_type": "mcq",
          "difficulty": "easy",
          "bloom_level": 2,
          "snippet_body": null,
          "snippet_line_range": null,
          "snippet_output": null,
          "image_url": null,
          "table_data": {
            "header": ["Department", "2022", "2023", "2024"],
            "rows": [
              ["Engineering", 42, 58, 71],
              ["Sales", 30, 33, 29],
              ["Support", 18, 26, 35],
              ["Design", 9, 11, 14]
            ]
          },
          "table_name": "Employees per Department (2022–2024)",
          "table_unit": "employees",
          "stimulus_text": null,
          "isBookmarked": false,
          "status": "unanswered",
          "options": ["Engineering", "Sales", "Support", "Design"],
          "snippet_language": null
        },
        {
          "id": "b2c3d4e5-0002-4b22-8c22-000000000004",
          "text": "If Design's headcount keeps growing by the same absolute amount each year as it did from 2023 to 2024, what will it be in 2025?",
          "response_type": "mcq",
          "difficulty": "medium",
          "bloom_level": 3,
          "snippet_body": null,
          "snippet_line_range": null,
          "snippet_output": null,
          "image_url": null,
          "table_data": {
            "header": ["Department", "2022", "2023", "2024"],
            "rows": [
              ["Engineering", 42, 58, 71],
              ["Sales", 30, 33, 29],
              ["Support", 18, 26, 35],
              ["Design", 9, 11, 14]
            ]
          },
          "table_name": "Employees per Department (2022–2024)",
          "table_unit": "employees",
          "stimulus_text": null,
          "isBookmarked": false,
          "status": "unanswered",
          "options": ["15", "16", "17", "18"],
          "snippet_language": null
        }
      ]
    },
    {
      "topic": "Laws of Motion",
      "type": "advance",
      "questionCount": 1,
      "difficulty": "hard",
      "topicHeadline": "Push mastered: Laws of Motion",
      "reason": "≥80% recent accuracy — ready for higher-order application.",
      "accuracy": null,
      "questions": [
        {
          "id": "c3d4e5f6-0003-4c33-8d33-000000000001",
          "text": "A block of mass m rests on the frictionless incline (30°) of a wedge being pushed with horizontal acceleration a, as shown. What value of a keeps the block stationary relative to the wedge?",
          "response_type": "mcq",
          "difficulty": "hard",
          "bloom_level": 5,
          "snippet_body": null,
          "snippet_line_range": null,
          "snippet_output": null,
          "image_url": "https://cmds-test.vedantu.com/prod/question-sets/5c21680c-cfd3-4dab-944e-993bb586f9cc4447403202005499293.png",
          "table_data": null,
          "table_name": null,
          "table_unit": null,
          "stimulus_text": null,
          "isBookmarked": false,
          "status": "unanswered",
          "options": ["a = g sin30°", "a = g cos30°", "a = g tan30°", "a = g / tan30°"],
          "snippet_language": null
        }
      ]
    }
  ]
};