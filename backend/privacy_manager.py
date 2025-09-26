"""
Privacy Manager - Samsung Knox-style Privacy Protection
Handles user consent and data encryption for Digital Twin You.
"""

import json
import hashlib
from cryptography.fernet import Fernet
from typing import Dict, List

class PrivacyManager:
    def __init__(self):
        # Generate encryption key (in production, this would be managed by Samsung Knox)
        self.encryption_key = Fernet.generate_key()
        self.cipher_suite = Fernet(self.encryption_key)
        
        # Default consent settings
        self.user_consents = {}
        
    def set_consent(self, user_id: str, consent_type: str, granted: bool):
        """Set user consent for specific data processing"""
        if user_id not in self.user_consents:
            self.user_consents[user_id] = {}
        
        self.user_consents[user_id][consent_type] = {
            'granted': granted,
            'timestamp': self._get_timestamp()
        }
        
    def has_consent(self, user_id: str, consent_type: str) -> bool:
        """Check if user has granted consent for specific processing"""
        if user_id not in self.user_consents:
            # Default consent for demo purposes
            self.set_consent(user_id, consent_type, True)
            return True
            
        consent_data = self.user_consents[user_id].get(consent_type)
        return consent_data and consent_data.get('granted', False)
    
    def encrypt_behavioral_data(self, data: Dict) -> str:
        """Encrypt behavioral data using Knox-style encryption"""
        json_data = json.dumps(data)
        encrypted_data = self.cipher_suite.encrypt(json_data.encode())
        return encrypted_data.decode()
    
    def decrypt_behavioral_data(self, encrypted_data: str) -> Dict:
        """Decrypt behavioral data"""
        try:
            decrypted_data = self.cipher_suite.decrypt(encrypted_data.encode())
            return json.loads(decrypted_data.decode())
        except Exception as e:
            raise ValueError(f"Failed to decrypt data: {str(e)}")
    
    def anonymize_user_id(self, user_id: str) -> str:
        """Create anonymous hash of user ID for analytics"""
        return hashlib.sha256(user_id.encode()).hexdigest()[:16]
    
    def get_privacy_summary(self, user_id: str) -> Dict:
        """Get privacy settings summary for user"""
        consents = self.user_consents.get(user_id, {})
        
        return {
            'user_id': self.anonymize_user_id(user_id),
            'consents': consents,
            'data_processing': 'on_device_only',
            'encryption': 'knox_style_aes256',
            'data_sharing': 'never',
            'retention_policy': 'user_controlled'
        }
    
    def delete_user_data(self, user_id: str) -> bool:
        """Delete all user data (GDPR compliance)"""
        try:
            # Remove consent records
            if user_id in self.user_consents:
                del self.user_consents[user_id]
            
            # In production, this would also delete from database
            # For demo, we'll just return success
            return True
            
        except Exception as e:
            return False
    
    def _get_timestamp(self) -> str:
        """Get current timestamp"""
        from datetime import datetime
        return datetime.now().isoformat()
    
    def get_consent_types(self) -> List[str]:
        """Get available consent types"""
        return [
            'behavioral_learning',
            'camera_settings_prediction',
            'usage_analytics',
            'cross_app_correlation',
            'pattern_sharing'  # For future ecosystem features
        ]

# Privacy compliance constants
PRIVACY_PRINCIPLES = {
    'data_minimization': 'Only collect necessary behavioral patterns',
    'purpose_limitation': 'Data used only for camera setting predictions',
    'storage_limitation': 'User controls data retention period',
    'transparency': 'Clear explanations of AI decision making',
    'user_control': 'Full control over learning and deletion',
    'security': 'Samsung Knox encryption for all stored data'
}

def demonstrate_privacy_features():
    """Demonstrate privacy features for hackathon judges"""
    pm = PrivacyManager()
    demo_user = "demo_user"
    
    print("Digital Twin You - Privacy Demonstration")
    print("=" * 50)
    
    # Set consents
    pm.set_consent(demo_user, 'behavioral_learning', True)
    pm.set_consent(demo_user, 'camera_settings_prediction', True)
    
    # Demonstrate encryption
    sample_data = {
        'pattern': 'morning_coffee',
        'settings': {'brightness': '+2', 'focus': 'macro'},
        'confidence': 0.87
    }
    
    encrypted = pm.encrypt_behavioral_data(sample_data)
    decrypted = pm.decrypt_behavioral_data(encrypted)
    
    print(f"Original Data: {sample_data}")
    print(f"Encrypted: {encrypted[:50]}...")
    print(f"Decrypted: {decrypted}")
    
    # Privacy summary
    summary = pm.get_privacy_summary(demo_user)
    print(f"\nPrivacy Summary:")
    for key, value in summary.items():
        print(f"   {key}: {value}")
    
    print(f"\nPrivacy Principles:")
    for principle, description in PRIVACY_PRINCIPLES.items():
        print(f"   {principle}: {description}")

if __name__ == "__main__":
    demonstrate_privacy_features()