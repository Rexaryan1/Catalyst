from django.test import TestCase
from .services import RoadmapService

# Create your tests here.
<<<<<<< HEAD
def RoadmapTestCase(TestCase):
    def test_roadmap_creation(self):
        # Arrange
        service = RoadmapService()
        user_id = 1  # Assuming a user with ID 1 exists
        roadmap_data = {
            'title': 'Test Roadmap',
            'description': 'This is a test roadmap.',
            'user_id': user_id
        }
        # Act
        roadmap = service.create_roadmap(roadmap_data)
        # Assert
        self.assertIsNotNone(roadmap)
=======

>>>>>>> 27e38c1 (changes to models and added practice)
