#!/usr/bin/env python3
"""
Digital Twin You - Backend API
Samsung PRISM GenAI Hackathon 2025

Core AI engine for behavioral learning and camera setting predictions.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import json
import datetime
from behavioral_engine import BehavioralEngine
from advanced_behavioral_engine import AdvancedBehavioralEngine
from privacy_manager import PrivacyManager
import random

app = Flask(__name__)
CORS(app)

# Initialize core components
behavior_engine = BehavioralEngine()
advanced_engine = AdvancedBehavioralEngine()
privacy_manager = PrivacyManager()

# Database initialization
def init_db():
    conn = sqlite3.connect('digital_twin.db')
    cursor = conn.cursor()
    
    # User behavior patterns table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS behavior_patterns (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            pattern_key TEXT NOT NULL,
            settings TEXT NOT NULL,
            confidence REAL NOT NULL,
            frequency INTEGER DEFAULT 1,
            last_used TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # User interactions table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS user_interactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            action_type TEXT NOT NULL,
            context TEXT NOT NULL,
            settings TEXT,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    conn.commit()
    conn.close()

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'Digital Twin You API',
        'version': '1.0.0',
        'timestamp': datetime.datetime.now().isoformat()
    })

@app.route('/api/learn-behavior', methods=['POST'])
def learn_behavior():
    """Learn from user camera behavior"""
    try:
        data = request.get_json()
        user_id = data.get('user_id', 'demo_user')
        action = data.get('action')
        context = data.get('context', {})
        settings = data.get('settings', {})
        
        # Privacy check
        if not privacy_manager.has_consent(user_id, 'behavioral_learning'):
            return jsonify({'error': 'User consent required'}), 403
        
        # Learn from behavior
        result = behavior_engine.learn_pattern(user_id, context, settings)
        
        # Store interaction
        conn = sqlite3.connect('digital_twin.db')
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO user_interactions (user_id, action_type, context, settings)
            VALUES (?, ?, ?, ?)
        ''', (user_id, action, json.dumps(context), json.dumps(settings)))
        conn.commit()
        conn.close()
        
        return jsonify({
            'status': 'learned',
            'pattern_key': result['pattern_key'],
            'confidence': result['confidence'],
            'frequency': result['frequency']
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/predict-settings', methods=['POST'])
def predict_settings():
    """Predict optimal camera settings based on context"""
    try:
        data = request.get_json()
        user_id = data.get('user_id', 'demo_user')
        context = data.get('context', {})
        
        # Get prediction from AI engine
        prediction = behavior_engine.predict_settings(user_id, context)
        
        if prediction:
            return jsonify({
                'has_prediction': True,
                'suggested_settings': prediction['settings'],
                'confidence': prediction['confidence'],
                'reason': prediction['reason'],
                'pattern_matches': prediction['pattern_matches']
            })
        else:
            return jsonify({
                'has_prediction': False,
                'message': 'Not enough behavioral data for confident prediction'
            })
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/feedback', methods=['POST'])
def record_feedback():
    """Record user feedback on AI predictions"""
    try:
        data = request.get_json()
        user_id = data.get('user_id', 'demo_user')
        prediction_accepted = data.get('accepted', False)
        actual_settings = data.get('actual_settings', {})
        
        # Update AI model based on feedback
        behavior_engine.update_from_feedback(user_id, prediction_accepted, actual_settings)
        
        return jsonify({
            'status': 'feedback_recorded',
            'message': 'AI model updated based on your feedback'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/behavior-profile', methods=['GET'])
def get_behavior_profile():
    """Get user's behavioral profile summary"""
    try:
        user_id = request.args.get('user_id', 'demo_user')
        
        # Get behavioral statistics
        conn = sqlite3.connect('digital_twin.db')
        cursor = conn.cursor()
        
        # Get pattern count
        cursor.execute('SELECT COUNT(*) FROM behavior_patterns WHERE user_id = ?', (user_id,))
        pattern_count = cursor.fetchone()[0]
        
        # Get interaction count
        cursor.execute('SELECT COUNT(*) FROM user_interactions WHERE user_id = ?', (user_id,))
        interaction_count = cursor.fetchone()[0]
        
        # Get top patterns
        cursor.execute('''
            SELECT pattern_key, confidence, frequency 
            FROM behavior_patterns 
            WHERE user_id = ? 
            ORDER BY confidence DESC, frequency DESC 
            LIMIT 5
        ''', (user_id,))
        top_patterns = cursor.fetchall()
        
        conn.close()
        
        return jsonify({
            'user_id': user_id,
            'total_patterns': pattern_count,
            'total_interactions': interaction_count,
            'top_patterns': [
                {
                    'pattern': pattern[0],
                    'confidence': pattern[1],
                    'frequency': pattern[2]
                } for pattern in top_patterns
            ],
            'learning_progress': min(pattern_count * 10, 100)
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/privacy/consent', methods=['POST'])
def manage_consent():
    """Manage user privacy consent"""
    try:
        data = request.get_json()
        user_id = data.get('user_id', 'demo_user')
        consent_type = data.get('consent_type')
        granted = data.get('granted', False)
        
        privacy_manager.set_consent(user_id, consent_type, granted)
        
        return jsonify({
            'status': 'consent_updated',
            'user_id': user_id,
            'consent_type': consent_type,
            'granted': granted
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/behavioral-insights', methods=['GET'])
def get_behavioral_insights():
    """Get deep behavioral insights for demo"""
    try:
        user_id = request.args.get('user_id', 'demo_user')
        
        insights = advanced_engine.generate_insights(user_id)
        
        return jsonify({
            'pattern_evolution': insights['pattern_evolution'],
            'context_correlations': insights['context_correlations'],
            'prediction_accuracy': insights['prediction_accuracy'],
            'learning_velocity': insights['learning_velocity'],
            'behavioral_clusters': insights.get('behavioral_clusters', {}),
            'anomaly_detection': insights.get('anomaly_detection', [])
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/simulate-learning', methods=['POST'])
def simulate_learning_event():
    """Simulate AI learning in real-time for demo"""
    try:
        data = request.get_json()
        event_type = data.get('event_type', 'pattern_reinforcement')
        
        # Generate realistic learning event
        learning_event = {
            'timestamp': datetime.datetime.now().isoformat(),
            'event_type': event_type,
            'confidence_change': random.uniform(0.05, 0.15),
            'pattern_affected': f"morning_coffee_{random.randint(1,3)}",
            'learning_impact': 'positive',
            'neural_activity': random.uniform(0.6, 1.0),
            'context_correlation': random.choice(['time_based', 'location_based', 'subject_based'])
        }
        
        return jsonify(learning_event)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/composition-analysis', methods=['POST'])
def analyze_photo_composition():
    """Analyze photo composition patterns"""
    try:
        data = request.get_json()
        photo_metadata = data.get('metadata', {})
        
        composition_analysis = advanced_engine.analyze_photo_composition(photo_metadata)
        
        return jsonify({
            'composition_patterns': composition_analysis,
            'recommendations': {
                'rule_of_thirds': composition_analysis['rule_of_thirds_usage'] > 0.7,
                'subject_positioning': composition_analysis['subject_positioning'],
                'lighting_optimization': composition_analysis['lighting_preferences']
            },
            'learning_impact': 'composition_preferences_updated'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/samsung-ecosystem', methods=['GET'])
def get_ecosystem_status():
    """Get Samsung ecosystem integration status"""
    try:
        # Simulate Samsung ecosystem integration
        ecosystem_status = {
            'galaxy_phone': {
                'status': 'active',
                'learning_data': 'camera_patterns',
                'sync_status': 'real_time',
                'patterns_shared': 12
            },
            'galaxy_watch': {
                'status': 'connected',
                'learning_data': 'context_timing',
                'sync_status': 'synced',
                'patterns_shared': 8
            },
            'galaxy_buds': {
                'status': 'connected',
                'learning_data': 'audio_preferences',
                'sync_status': 'synced',
                'patterns_shared': 3
            },
            'galaxy_tablet': {
                'status': 'syncing',
                'learning_data': 'viewing_patterns',
                'sync_status': 'pending',
                'patterns_shared': 0
            }
        }
        
        return jsonify({
            'ecosystem_devices': ecosystem_status,
            'total_devices': len(ecosystem_status),
            'active_devices': len([d for d in ecosystem_status.values() if d['status'] == 'active']),
            'cross_device_learning': True,
            'knox_security': 'enabled'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    init_db()
    print("Digital Twin You API Starting...")
    print("Samsung PRISM GenAI Hackathon 2025")
    print("Privacy-First Behavioral AI")
    print("Advanced Learning Engine: ACTIVE")
    print("Samsung Ecosystem Integration: READY")
    app.run(debug=True, host='0.0.0.0', port=5000)