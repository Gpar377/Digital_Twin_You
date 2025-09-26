/**
 * API Service for Digital Twin You
 * Handles communication with the backend AI engine
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const USER_ID = 'demo_user'; // In production, this would be dynamic

/**
 * Generic API request handler
 */
const apiRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Request failed for ${endpoint}:`, error);
    throw error;
  }
};

/**
 * Learn from user behavior
 */
export const learnBehavior = async (action, context, settings) => {
  return apiRequest('/learn-behavior', {
    method: 'POST',
    body: JSON.stringify({
      user_id: USER_ID,
      action,
      context,
      settings
    })
  });
};

/**
 * Get AI prediction for camera settings
 */
export const predictSettings = async (context) => {
  return apiRequest('/predict-settings', {
    method: 'POST',
    body: JSON.stringify({
      user_id: USER_ID,
      context
    })
  });
};

/**
 * Record user feedback on AI predictions
 */
export const recordFeedback = async (accepted, actualSettings) => {
  return apiRequest('/feedback', {
    method: 'POST',
    body: JSON.stringify({
      user_id: USER_ID,
      accepted,
      actual_settings: actualSettings
    })
  });
};

/**
 * Get user's behavioral profile
 */
export const getBehaviorProfile = async () => {
  return apiRequest(`/behavior-profile?user_id=${USER_ID}`);
};

/**
 * Manage privacy consent
 */
export const setPrivacyConsent = async (consentType, granted) => {
  return apiRequest('/privacy/consent', {
    method: 'POST',
    body: JSON.stringify({
      user_id: USER_ID,
      consent_type: consentType,
      granted
    })
  });
};

/**
 * Health check
 */
export const healthCheck = async () => {
  return apiRequest('/health');
};

// Mock data for offline demo (fallback)
const mockBehaviorProfile = {
  user_id: USER_ID,
  total_patterns: 5,
  total_interactions: 23,
  average_confidence: 0.78,
  max_confidence: 0.92,
  learning_progress: 50,
  top_patterns: [
    {
      pattern: 'morning_coffee_kitchen',
      confidence: 0.92,
      frequency: 8
    },
    {
      pattern: 'evening_portrait_living_room',
      confidence: 0.85,
      frequency: 6
    },
    {
      pattern: 'day_general_unknown',
      confidence: 0.73,
      frequency: 9
    }
  ]
};

const mockPrediction = {
  has_prediction: true,
  suggested_settings: {
    brightness: '+2',
    focus: 'macro',
    warmth: 'warm',
    mode: 'portrait'
  },
  confidence: 0.87,
  reason: 'Based on 8 similar photos',
  pattern_matches: 8
};

/**
 * Fallback functions for offline demo
 */
export const getBehaviorProfileOffline = () => {
  return Promise.resolve(mockBehaviorProfile);
};

export const predictSettingsOffline = (context) => {
  const hour = new Date().getHours();
  
  // Morning coffee routine
  if (hour >= 8 && hour <= 10) {
    return Promise.resolve(mockPrediction);
  }
  
  // No prediction for other times
  return Promise.resolve({
    has_prediction: false,
    message: 'Not enough behavioral data for confident prediction'
  });
};

/**
 * Auto-retry wrapper for API calls
 */
const withRetry = (apiFunction, maxRetries = 2) => {
  return async (...args) => {
    let lastError;
    
    for (let i = 0; i <= maxRetries; i++) {
      try {
        return await apiFunction(...args);
      } catch (error) {
        lastError = error;
        
        if (i === maxRetries) {
          console.warn('API call failed, using offline fallback');
          
          // Return mock data for demo purposes
          if (apiFunction === getBehaviorProfile) {
            return getBehaviorProfileOffline();
          } else if (apiFunction === predictSettings) {
            return predictSettingsOffline(...args);
          }
          
          throw error;
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  };
};

// Export retry-wrapped functions for production use
export const getBehaviorProfileWithRetry = withRetry(getBehaviorProfile);
export const predictSettingsWithRetry = withRetry(predictSettings);

// Demo initialization
export const initializeDemo = async () => {
  try {
    // Check if backend is available
    await healthCheck();
    console.log('✅ Backend connected successfully');
    
    // Set default privacy consents for demo
    await setPrivacyConsent('behavioral_learning', true);
    await setPrivacyConsent('camera_settings_prediction', true);
    
    return { status: 'connected', mode: 'online' };
  } catch (error) {
    console.warn('⚠️ Backend not available, running in offline demo mode');
    return { status: 'offline', mode: 'demo' };
  }
};