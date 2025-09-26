"""
Behavioral Engine - Core AI for Digital Twin You
Implements simple but effective pattern recognition for camera settings.
"""

import sqlite3
import json
import datetime
from typing import Dict, List, Optional

class BehavioralEngine:
    def __init__(self):
        self.confidence_threshold = 0.7
        self.min_pattern_frequency = 3
        
    def create_pattern_key(self, context: Dict) -> str:
        """Create a unique key for behavioral patterns"""
        time_slot = self._get_time_slot(context.get('timestamp', datetime.datetime.now()))
        subject = context.get('subject', 'general')
        location = context.get('location', 'unknown')
        
        return f"{time_slot}_{subject}_{location}"
    
    def _get_time_slot(self, timestamp) -> str:
        """Convert timestamp to time slot category"""
        if isinstance(timestamp, str):
            timestamp = datetime.datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
        
        hour = timestamp.hour
        
        if 6 <= hour < 10:
            return 'morning'
        elif 10 <= hour < 16:
            return 'day'
        elif 16 <= hour < 20:
            return 'evening'
        else:
            return 'night'
    
    def learn_pattern(self, user_id: str, context: Dict, settings: Dict) -> Dict:
        """Learn from user behavior and update patterns"""
        pattern_key = self.create_pattern_key(context)
        
        conn = sqlite3.connect('digital_twin.db')
        cursor = conn.cursor()
        
        # Check if pattern exists
        cursor.execute('''
            SELECT id, frequency, confidence FROM behavior_patterns 
            WHERE user_id = ? AND pattern_key = ?
        ''', (user_id, pattern_key))
        
        existing = cursor.fetchone()
        
        if existing:
            # Update existing pattern
            pattern_id, frequency, confidence = existing
            new_frequency = frequency + 1
            new_confidence = min(new_frequency * 0.15, 0.95)  # Cap at 95%
            
            cursor.execute('''
                UPDATE behavior_patterns 
                SET frequency = ?, confidence = ?, settings = ?, last_used = CURRENT_TIMESTAMP
                WHERE id = ?
            ''', (new_frequency, new_confidence, json.dumps(settings), pattern_id))
            
        else:
            # Create new pattern
            new_frequency = 1
            new_confidence = 0.15
            
            cursor.execute('''
                INSERT INTO behavior_patterns (user_id, pattern_key, settings, confidence, frequency)
                VALUES (?, ?, ?, ?, ?)
            ''', (user_id, pattern_key, json.dumps(settings), new_confidence, new_frequency))
        
        conn.commit()
        conn.close()
        
        return {
            'pattern_key': pattern_key,
            'confidence': new_confidence,
            'frequency': new_frequency
        }
    
    def predict_settings(self, user_id: str, context: Dict) -> Optional[Dict]:
        """Predict optimal settings based on learned patterns"""
        pattern_key = self.create_pattern_key(context)
        
        conn = sqlite3.connect('digital_twin.db')
        cursor = conn.cursor()
        
        # Find exact pattern match
        cursor.execute('''
            SELECT settings, confidence, frequency FROM behavior_patterns
            WHERE user_id = ? AND pattern_key = ? AND confidence >= ?
        ''', (user_id, pattern_key, self.confidence_threshold))
        
        exact_match = cursor.fetchone()
        
        if exact_match:
            settings, confidence, frequency = exact_match
            conn.close()
            
            return {
                'settings': json.loads(settings),
                'confidence': confidence,
                'reason': f'Based on {frequency} similar photos',
                'pattern_matches': frequency,
                'match_type': 'exact'
            }
        
        # Find similar patterns (same time slot)
        time_slot = self._get_time_slot(context.get('timestamp', datetime.datetime.now()))
        cursor.execute('''
            SELECT settings, confidence, frequency FROM behavior_patterns
            WHERE user_id = ? AND pattern_key LIKE ? AND confidence >= ?
            ORDER BY confidence DESC, frequency DESC
            LIMIT 1
        ''', (user_id, f'{time_slot}_%', self.confidence_threshold * 0.8))
        
        similar_match = cursor.fetchone()
        conn.close()
        
        if similar_match:
            settings, confidence, frequency = similar_match
            
            return {
                'settings': json.loads(settings),
                'confidence': confidence * 0.9,  # Reduce confidence for similar match
                'reason': f'Based on {frequency} similar time patterns',
                'pattern_matches': frequency,
                'match_type': 'similar'
            }
        
        return None
    
    def update_from_feedback(self, user_id: str, accepted: bool, actual_settings: Dict):
        """Update AI model based on user feedback"""
        # This is a simplified feedback mechanism
        # In production, this would involve more sophisticated model updates
        
        if not accepted and actual_settings:
            # If user rejected suggestion and provided actual settings,
            # we can learn from their preference
            current_time = datetime.datetime.now()
            context = {
                'timestamp': current_time,
                'subject': 'feedback_correction',
                'location': 'unknown'
            }
            
            # Learn from the corrected settings
            self.learn_pattern(user_id, context, actual_settings)
    
    def get_learning_stats(self, user_id: str) -> Dict:
        """Get learning statistics for user"""
        conn = sqlite3.connect('digital_twin.db')
        cursor = conn.cursor()
        
        # Get pattern statistics
        cursor.execute('''
            SELECT 
                COUNT(*) as total_patterns,
                AVG(confidence) as avg_confidence,
                SUM(frequency) as total_interactions,
                MAX(confidence) as max_confidence
            FROM behavior_patterns 
            WHERE user_id = ?
        ''', (user_id,))
        
        stats = cursor.fetchone()
        conn.close()
        
        return {
            'total_patterns': stats[0] or 0,
            'average_confidence': round(stats[1] or 0, 2),
            'total_interactions': stats[2] or 0,
            'max_confidence': round(stats[3] or 0, 2),
            'learning_progress': min((stats[0] or 0) * 10, 100)
        }

# Demo data initialization for hackathon
def initialize_demo_data():
    """Initialize with realistic demo patterns for presentation"""
    engine = BehavioralEngine()
    demo_user = "demo_user"
    
    # Morning coffee routine
    morning_context = {
        'timestamp': datetime.datetime(2025, 1, 15, 8, 0, 0),
        'subject': 'coffee',
        'location': 'kitchen'
    }
    morning_settings = {
        'brightness': '+2',
        'focus': 'macro',
        'warmth': 'warm',
        'mode': 'portrait'
    }
    
    # Simulate 10 days of morning coffee photos
    for i in range(10):
        engine.learn_pattern(demo_user, morning_context, morning_settings)
    
    # Evening portrait routine
    evening_context = {
        'timestamp': datetime.datetime(2025, 1, 15, 19, 0, 0),
        'subject': 'portrait',
        'location': 'living_room'
    }
    evening_settings = {
        'brightness': '+1',
        'focus': 'face',
        'warmth': 'neutral',
        'mode': 'portrait'
    }
    
    # Simulate 7 days of evening portraits
    for i in range(7):
        engine.learn_pattern(demo_user, evening_context, evening_settings)
    
    print("Demo data initialized with realistic behavioral patterns")

if __name__ == "__main__":
    initialize_demo_data()