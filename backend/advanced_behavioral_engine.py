"""
Advanced Behavioral Engine - Enhanced AI for Digital Twin You
Implements sophisticated pattern recognition and contextual learning
"""

import sqlite3
import json
import numpy as np
from datetime import datetime, timedelta
from collections import defaultdict
import random

class AdvancedBehavioralEngine:
    def __init__(self):
        self.confidence_threshold = 0.7
        self.sequence_length = 3
        
    def create_contextual_patterns(self, interactions):
        """Create sophisticated behavioral patterns"""
        patterns = {}
        
        # Temporal sequence analysis
        temporal_patterns = self._analyze_temporal_sequences(interactions)
        patterns.update(temporal_patterns)
        
        # Location-time correlations
        location_time_patterns = self._analyze_location_time_correlations(interactions)
        patterns.update(location_time_patterns)
        
        # Setting evolution patterns
        evolution_patterns = self._analyze_setting_evolution(interactions)
        patterns.update(evolution_patterns)
        
        return patterns
    
    def _analyze_temporal_sequences(self, interactions):
        """Analyze sequences of user actions"""
        sequences = {}
        
        for i in range(len(interactions) - self.sequence_length + 1):
            sequence = interactions[i:i + self.sequence_length]
            sequence_key = self._create_sequence_key(sequence)
            
            if sequence_key not in sequences:
                sequences[sequence_key] = {
                    'count': 0,
                    'confidence': 0,
                    'next_action_probability': {}
                }
            
            sequences[sequence_key]['count'] += 1
            sequences[sequence_key]['confidence'] = min(sequences[sequence_key]['count'] * 0.1, 0.95)
            
            # Predict next action
            if i + self.sequence_length < len(interactions):
                next_action = interactions[i + self.sequence_length]
                next_key = f"{next_action.get('action_type', 'unknown')}_{next_action.get('context', {}).get('subject', 'general')}"
                
                if next_key not in sequences[sequence_key]['next_action_probability']:
                    sequences[sequence_key]['next_action_probability'][next_key] = 0
                sequences[sequence_key]['next_action_probability'][next_key] += 1
        
        return sequences
    
    def _analyze_location_time_correlations(self, interactions):
        """Find correlations between location, time, and settings"""
        correlations = defaultdict(lambda: defaultdict(list))
        
        for interaction in interactions:
            context = interaction.get('context', {})
            settings = interaction.get('settings', {})
            
            hour = datetime.fromisoformat(context.get('timestamp', datetime.now().isoformat())).hour
            location = context.get('location', 'unknown')
            subject = context.get('subject', 'general')
            
            time_slot = self._get_time_slot(hour)
            correlation_key = f"{location}_{time_slot}_{subject}"
            
            correlations[correlation_key]['settings'].append(settings)
            correlations[correlation_key]['frequency'] = len(correlations[correlation_key]['settings'])
        
        # Calculate most common settings for each correlation
        processed_correlations = {}
        for key, data in correlations.items():
            if data['frequency'] >= 3:  # Minimum occurrences
                most_common_settings = self._get_most_common_settings(data['settings'])
                processed_correlations[key] = {
                    'settings': most_common_settings,
                    'confidence': min(data['frequency'] * 0.15, 0.95),
                    'frequency': data['frequency'],
                    'correlation_strength': self._calculate_correlation_strength(data['settings'])
                }
        
        return processed_correlations
    
    def _analyze_setting_evolution(self, interactions):
        """Analyze how user preferences evolve over time"""
        evolution_patterns = {}
        
        # Group interactions by week
        weekly_groups = defaultdict(list)
        for interaction in interactions:
            timestamp = datetime.fromisoformat(interaction.get('context', {}).get('timestamp', datetime.now().isoformat()))
            week_key = f"{timestamp.year}-W{timestamp.isocalendar()[1]}"
            weekly_groups[week_key].append(interaction)
        
        # Analyze evolution
        weeks = sorted(weekly_groups.keys())
        for i in range(len(weeks) - 1):
            current_week = weekly_groups[weeks[i]]
            next_week = weekly_groups[weeks[i + 1]]
            
            evolution = self._compare_weekly_patterns(current_week, next_week)
            if evolution['significance'] > 0.3:  # Significant change
                evolution_patterns[f"evolution_{weeks[i]}_to_{weeks[i+1]}"] = evolution
        
        return evolution_patterns
    
    def analyze_photo_composition(self, photo_metadata):
        """Analyze photo composition patterns (simulated)"""
        # Simulate advanced composition analysis
        composition_patterns = {
            'rule_of_thirds_usage': random.uniform(0.6, 0.9),
            'subject_positioning': self._analyze_subject_placement(photo_metadata),
            'lighting_preferences': self._analyze_lighting_patterns(photo_metadata),
            'depth_of_field_preference': random.choice(['shallow', 'medium', 'deep']),
            'color_temperature_bias': random.choice(['warm', 'neutral', 'cool'])
        }
        return composition_patterns
    
    def _analyze_subject_placement(self, metadata):
        """Analyze where user typically places subjects"""
        placements = ['center', 'left_third', 'right_third', 'upper_third', 'lower_third']
        weights = [0.3, 0.25, 0.25, 0.1, 0.1]  # Realistic distribution
        return np.random.choice(placements, p=weights)
    
    def _analyze_lighting_patterns(self, metadata):
        """Analyze lighting preferences"""
        hour = datetime.now().hour
        if 6 <= hour < 10:
            return {'preference': 'soft_morning', 'strength': 0.8}
        elif 10 <= hour < 16:
            return {'preference': 'natural_bright', 'strength': 0.9}
        elif 16 <= hour < 20:
            return {'preference': 'golden_hour', 'strength': 0.95}
        else:
            return {'preference': 'artificial_warm', 'strength': 0.7}
    
    def generate_insights(self, user_id):
        """Generate deep behavioral insights"""
        conn = sqlite3.connect('backend/digital_twin.db')
        cursor = conn.cursor()
        
        # Get user interactions
        cursor.execute('''
            SELECT * FROM user_interactions 
            WHERE user_id = ? 
            ORDER BY timestamp DESC 
            LIMIT 50
        ''', (user_id,))
        
        interactions = [dict(zip([col[0] for col in cursor.description], row)) 
                      for row in cursor.fetchall()]
        
        # Get patterns
        cursor.execute('''
            SELECT * FROM behavior_patterns 
            WHERE user_id = ? 
            ORDER BY confidence DESC
        ''', (user_id,))
        
        patterns = [dict(zip([col[0] for col in cursor.description], row)) 
                   for row in cursor.fetchall()]
        
        conn.close()
        
        # Generate insights
        insights = {
            'pattern_evolution': self._analyze_pattern_evolution(interactions),
            'context_correlations': self._find_context_correlations(interactions),
            'prediction_accuracy': self._calculate_prediction_accuracy(patterns),
            'learning_velocity': self._calculate_learning_velocity(interactions),
            'behavioral_clusters': self._identify_behavioral_clusters(interactions),
            'anomaly_detection': self._detect_behavioral_anomalies(interactions)
        }
        
        return insights
    
    def _analyze_pattern_evolution(self, interactions):
        """Analyze how patterns evolve over time"""
        if len(interactions) < 10:
            return {'status': 'insufficient_data'}
        
        recent = interactions[:len(interactions)//2]
        older = interactions[len(interactions)//2:]
        
        recent_patterns = self._extract_pattern_signatures(recent)
        older_patterns = self._extract_pattern_signatures(older)
        
        evolution = {
            'stability_score': self._calculate_stability(recent_patterns, older_patterns),
            'new_patterns_emerged': len(recent_patterns) - len(older_patterns),
            'pattern_refinement': self._calculate_refinement_score(recent_patterns, older_patterns)
        }
        
        return evolution
    
    def _find_context_correlations(self, interactions):
        """Find correlations between different contexts"""
        correlations = {}
        
        # Time-based correlations
        time_correlations = defaultdict(list)
        for interaction in interactions:
            context = json.loads(interaction.get('context', '{}'))
            timestamp = context.get('timestamp', datetime.now().isoformat())
            hour = datetime.fromisoformat(timestamp).hour
            time_slot = self._get_time_slot(hour)
            
            settings = json.loads(interaction.get('settings', '{}'))
            time_correlations[time_slot].append(settings)
        
        correlations['time_based'] = {
            slot: self._calculate_setting_consistency(settings_list)
            for slot, settings_list in time_correlations.items()
            if len(settings_list) >= 3
        }
        
        return correlations
    
    def _calculate_prediction_accuracy(self, patterns):
        """Calculate prediction accuracy metrics"""
        if not patterns:
            return {'accuracy': 0, 'confidence_distribution': {}}
        
        high_confidence = len([p for p in patterns if p['confidence'] > 0.8])
        medium_confidence = len([p for p in patterns if 0.5 < p['confidence'] <= 0.8])
        low_confidence = len([p for p in patterns if p['confidence'] <= 0.5])
        
        total = len(patterns)
        
        return {
            'accuracy': (high_confidence * 0.9 + medium_confidence * 0.7 + low_confidence * 0.4) / total,
            'confidence_distribution': {
                'high': high_confidence / total,
                'medium': medium_confidence / total,
                'low': low_confidence / total
            },
            'total_patterns': total
        }
    
    def _calculate_learning_velocity(self, interactions):
        """Calculate how fast the AI is learning"""
        if len(interactions) < 5:
            return {'velocity': 'slow', 'trend': 'stable'}
        
        # Analyze learning speed over time
        recent_week = [i for i in interactions[:7] if i]
        previous_week = [i for i in interactions[7:14] if i]
        
        recent_diversity = len(set(json.loads(i.get('context', '{}')).get('subject', 'general') 
                                 for i in recent_week))
        previous_diversity = len(set(json.loads(i.get('context', '{}')).get('subject', 'general') 
                                   for i in previous_week))
        
        velocity = 'fast' if recent_diversity > previous_diversity else 'moderate'
        trend = 'accelerating' if len(recent_week) > len(previous_week) else 'stable'
        
        return {
            'velocity': velocity,
            'trend': trend,
            'learning_rate': len(recent_week) / max(len(previous_week), 1)
        }
    
    def _identify_behavioral_clusters(self, interactions):
        """Identify clusters of similar behaviors"""
        clusters = defaultdict(list)
        
        for interaction in interactions:
            context = json.loads(interaction.get('context', '{}'))
            subject = context.get('subject', 'general')
            location = context.get('location', 'unknown')
            
            cluster_key = f"{subject}_{location}"
            clusters[cluster_key].append(interaction)
        
        # Filter significant clusters
        significant_clusters = {
            key: {
                'size': len(interactions),
                'consistency': self._calculate_cluster_consistency(interactions),
                'dominant_settings': self._get_dominant_cluster_settings(interactions)
            }
            for key, interactions in clusters.items()
            if len(interactions) >= 3
        }
        
        return significant_clusters
    
    def _detect_behavioral_anomalies(self, interactions):
        """Detect unusual behavioral patterns"""
        anomalies = []
        
        # Detect time anomalies
        usual_hours = defaultdict(int)
        for interaction in interactions:
            context = json.loads(interaction.get('context', '{}'))
            timestamp = context.get('timestamp', datetime.now().isoformat())
            hour = datetime.fromisoformat(timestamp).hour
            usual_hours[hour] += 1
        
        # Find unusual activity times
        avg_activity = sum(usual_hours.values()) / len(usual_hours) if usual_hours else 0
        for hour, count in usual_hours.items():
            if count > avg_activity * 2:  # Significantly higher activity
                anomalies.append({
                    'type': 'unusual_activity_time',
                    'hour': hour,
                    'activity_level': count / avg_activity
                })
        
        return anomalies
    
    # Helper methods
    def _get_time_slot(self, hour):
        if 6 <= hour < 10: return 'morning'
        elif 10 <= hour < 16: return 'day'
        elif 16 <= hour < 20: return 'evening'
        else: return 'night'
    
    def _create_sequence_key(self, sequence):
        return "_".join([f"{s.get('action_type', 'unknown')}:{s.get('context', {}).get('subject', 'general')}" 
                        for s in sequence])
    
    def _get_most_common_settings(self, settings_list):
        """Find most common settings combination"""
        if not settings_list:
            return {}
        
        # Count setting combinations
        setting_counts = defaultdict(int)
        for settings in settings_list:
            settings_key = json.dumps(settings, sort_keys=True)
            setting_counts[settings_key] += 1
        
        # Return most common
        most_common = max(setting_counts.items(), key=lambda x: x[1])
        return json.loads(most_common[0])
    
    def _calculate_correlation_strength(self, settings_list):
        """Calculate how consistent settings are"""
        if len(settings_list) <= 1:
            return 0
        
        # Calculate consistency across different setting types
        consistency_scores = []
        setting_keys = set()
        for settings in settings_list:
            setting_keys.update(settings.keys())
        
        for key in setting_keys:
            values = [s.get(key) for s in settings_list if key in s]
            if values:
                unique_values = len(set(values))
                consistency = 1 - (unique_values - 1) / len(values)
                consistency_scores.append(consistency)
        
        return sum(consistency_scores) / len(consistency_scores) if consistency_scores else 0
    
    def _compare_weekly_patterns(self, week1, week2):
        """Compare patterns between two weeks"""
        if not week1 or not week2:
            return {'significance': 0}
        
        # Extract pattern signatures
        patterns1 = self._extract_pattern_signatures(week1)
        patterns2 = self._extract_pattern_signatures(week2)
        
        # Calculate difference
        common_patterns = set(patterns1.keys()) & set(patterns2.keys())
        new_patterns = set(patterns2.keys()) - set(patterns1.keys())
        
        significance = len(new_patterns) / max(len(patterns2), 1)
        
        return {
            'significance': significance,
            'new_patterns': list(new_patterns),
            'evolved_patterns': list(common_patterns),
            'stability_score': len(common_patterns) / max(len(patterns1), 1)
        }
    
    def _extract_pattern_signatures(self, interactions):
        """Extract pattern signatures from interactions"""
        signatures = {}
        for interaction in interactions:
            context = json.loads(interaction.get('context', '{}'))
            subject = context.get('subject', 'general')
            location = context.get('location', 'unknown')
            
            signature = f"{subject}_{location}"
            if signature not in signatures:
                signatures[signature] = 0
            signatures[signature] += 1
        
        return signatures
    
    def _calculate_stability(self, recent_patterns, older_patterns):
        """Calculate pattern stability score"""
        if not older_patterns:
            return 0
        
        common = set(recent_patterns.keys()) & set(older_patterns.keys())
        return len(common) / len(older_patterns)
    
    def _calculate_refinement_score(self, recent_patterns, older_patterns):
        """Calculate how much patterns have been refined"""
        if not recent_patterns or not older_patterns:
            return 0
        
        total_recent = sum(recent_patterns.values())
        total_older = sum(older_patterns.values())
        
        return total_recent / max(total_older, 1)
    
    def _calculate_setting_consistency(self, settings_list):
        """Calculate consistency of settings"""
        if len(settings_list) <= 1:
            return 1.0
        
        # Calculate variance in settings
        consistency_scores = []
        all_keys = set()
        for settings in settings_list:
            all_keys.update(settings.keys())
        
        for key in all_keys:
            values = [s.get(key) for s in settings_list if key in s]
            if values:
                unique_ratio = len(set(values)) / len(values)
                consistency_scores.append(1 - unique_ratio)
        
        return sum(consistency_scores) / len(consistency_scores) if consistency_scores else 0
    
    def _calculate_cluster_consistency(self, interactions):
        """Calculate consistency within a behavioral cluster"""
        if len(interactions) <= 1:
            return 1.0
        
        settings_list = [json.loads(i.get('settings', '{}')) for i in interactions]
        return self._calculate_setting_consistency(settings_list)
    
    def _get_dominant_cluster_settings(self, interactions):
        """Get dominant settings for a cluster"""
        settings_list = [json.loads(i.get('settings', '{}')) for i in interactions]
        return self._get_most_common_settings(settings_list)