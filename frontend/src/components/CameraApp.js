import React, { useState, useEffect } from 'react';
import { Camera, Brain, ArrowLeft, Zap, CheckCircle, X } from 'lucide-react';
import { predictSettings, recordFeedback } from '../services/api';

const CameraApp = ({ onBack, onLearnBehavior, behaviorProfile }) => {
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [currentSettings, setCurrentSettings] = useState({
    brightness: '0',
    focus: 'auto',
    warmth: 'neutral',
    mode: 'photo'
  });
  const [showFeedback, setShowFeedback] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadAISuggestion();
  }, []);

  const loadAISuggestion = async () => {
    setIsLoading(true);
    try {
      const context = {
        timestamp: new Date().toISOString(),
        subject: getSubjectFromTime(),
        location: 'home'
      };

      const prediction = await predictSettings(context);
      
      if (prediction.has_prediction) {
        setAiSuggestion({
          title: getPresetName(new Date().getHours()),
          settings: prediction.suggested_settings,
          confidence: Math.round(prediction.confidence * 100),
          reason: prediction.reason,
          patternMatches: prediction.pattern_matches
        });
      }
    } catch (error) {
      console.error('Failed to get AI suggestion:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSubjectFromTime = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 10) return 'coffee';
    if (hour >= 10 && hour < 16) return 'general';
    if (hour >= 16 && hour < 20) return 'portrait';
    return 'general';
  };

  const getPresetName = (hour) => {
    if (hour >= 6 && hour < 10) return 'Morning Photography';
    if (hour >= 10 && hour < 16) return 'Daytime Shots';
    if (hour >= 16 && hour < 20) return 'Golden Hour';
    return 'Evening Mode';
  };

  const applyAISuggestion = async () => {
    if (!aiSuggestion) return;

    // Apply the suggested settings
    setCurrentSettings(aiSuggestion.settings);
    
    // Learn from this behavior
    await onLearnBehavior('applied_ai_preset', {
      timestamp: new Date().toISOString(),
      preset: aiSuggestion.title,
      settings: aiSuggestion.settings
    }, aiSuggestion.settings);

    // Record positive feedback
    await recordFeedback(true, aiSuggestion.settings);
    
    setAiSuggestion(null);
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 3000);
  };

  const rejectAISuggestion = async () => {
    if (!aiSuggestion) return;

    // Record negative feedback
    await recordFeedback(false, currentSettings);
    
    setAiSuggestion(null);
  };

  const takePhoto = async (mode) => {
    const photoSettings = { ...currentSettings, mode };
    
    // Learn from this photo
    await onLearnBehavior('took_photo', {
      timestamp: new Date().toISOString(),
      subject: getSubjectFromTime(),
      location: 'home',
      settings: photoSettings
    }, photoSettings);

    // Show success feedback
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 2000);
  };

  const SettingControl = ({ label, value, options, onChange }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">{label}</label>
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Camera Header */}
      <div className="flex items-center justify-between p-4 bg-black/50">
        <button 
          className="text-blue-400 flex items-center gap-2"
          onClick={onBack}
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <h1 className="text-xl font-semibold">Samsung Camera</h1>
        <div className="w-12"></div>
      </div>

      {/* Success Feedback */}
      {showFeedback && (
        <div className="absolute top-20 left-4 right-4 z-10 bg-green-600 p-3 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          <span>AI learning updated! Your preferences have been saved.</span>
        </div>
      )}

      {/* AI Suggestion Banner */}
      {aiSuggestion && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 m-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-5 h-5" />
            <span className="font-semibold">{aiSuggestion.title}</span>
            <span className="text-xs bg-white/20 px-2 py-1 rounded">
              {aiSuggestion.confidence}% confident
            </span>
          </div>
          <div className="text-sm opacity-80 mb-3">
            {aiSuggestion.reason}
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm mb-3">
            {Object.entries(aiSuggestion.settings).map(([key, value]) => (
              <div key={key} className="bg-white/10 px-3 py-1 rounded">
                {key}: {value}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <button 
              className="flex-1 bg-white text-blue-600 font-semibold py-2 rounded flex items-center justify-center gap-2"
              onClick={applyAISuggestion}
            >
              <Zap className="w-4 h-4" />
              Apply AI Settings
            </button>
            <button 
              className="px-4 py-2 border border-white/30 rounded text-white flex items-center justify-center"
              onClick={rejectAISuggestion}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="p-4 m-4 bg-gray-800 rounded-lg text-center">
          <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
          <div className="text-sm text-gray-400">AI analyzing your patterns...</div>
        </div>
      )}

      {/* Camera Viewfinder */}
      <div className="relative h-96 bg-gray-800 m-4 rounded-lg overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-400 text-center">
            <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Camera Viewfinder</p>
            <p className="text-sm opacity-60">
              {aiSuggestion ? 'AI-optimized settings ready' : 'Manual settings active'}
            </p>
          </div>
        </div>
        
        {/* Settings Overlay */}
        <div className="absolute top-4 left-4 bg-black/50 p-2 rounded text-xs">
          <div>Brightness: {currentSettings.brightness}</div>
          <div>Focus: {currentSettings.focus}</div>
          <div>Warmth: {currentSettings.warmth}</div>
        </div>
      </div>

      {/* Manual Settings Panel */}
      <div className="p-4 bg-gray-900 m-4 rounded-lg">
        <h3 className="font-semibold mb-4">Manual Settings</h3>
        <div className="grid grid-cols-2 gap-4">
          <SettingControl
            label="Brightness"
            value={currentSettings.brightness}
            options={[
              { value: '-2', label: '-2' },
              { value: '-1', label: '-1' },
              { value: '0', label: '0' },
              { value: '+1', label: '+1' },
              { value: '+2', label: '+2' }
            ]}
            onChange={(value) => setCurrentSettings(prev => ({ ...prev, brightness: value }))}
          />
          <SettingControl
            label="Focus"
            value={currentSettings.focus}
            options={[
              { value: 'auto', label: 'Auto' },
              { value: 'macro', label: 'Macro' },
              { value: 'close-up', label: 'Close-up' },
              { value: 'face', label: 'Face' }
            ]}
            onChange={(value) => setCurrentSettings(prev => ({ ...prev, focus: value }))}
          />
          <SettingControl
            label="Warmth"
            value={currentSettings.warmth}
            options={[
              { value: 'cool', label: 'Cool' },
              { value: 'neutral', label: 'Neutral' },
              { value: 'warm', label: 'Warm' }
            ]}
            onChange={(value) => setCurrentSettings(prev => ({ ...prev, warmth: value }))}
          />
        </div>
      </div>

      {/* Camera Controls */}
      <div className="p-4">
        <div className="flex items-center justify-center gap-8 mb-6">
          <button 
            className="w-16 h-16 bg-white rounded-full flex items-center justify-center"
            onClick={() => takePhoto('photo')}
          >
            <div className="w-12 h-12 bg-blue-600 rounded-full"></div>
          </button>
        </div>

        <div className="flex justify-around text-center">
          <button 
            className="bg-blue-600 px-4 py-2 rounded-lg"
            onClick={() => takePhoto('portrait')}
          >
            Portrait
          </button>
          <button 
            className="bg-gray-600 px-4 py-2 rounded-lg"
            onClick={() => takePhoto('photo')}
          >
            Photo
          </button>
          <button 
            className="bg-gray-600 px-4 py-2 rounded-lg"
            onClick={() => takePhoto('macro')}
          >
            Macro
          </button>
        </div>
      </div>

      {/* Learning Stats */}
      {behaviorProfile && (
        <div className="p-4 m-4 bg-gray-900 rounded-lg">
          <h3 className="font-semibold mb-3">AI Learning Status</h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-400">
                {behaviorProfile.total_patterns}
              </div>
              <div className="text-gray-400">Patterns</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-400">
                {Math.round((behaviorProfile.average_confidence || 0) * 100)}%
              </div>
              <div className="text-gray-400">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-400">
                {behaviorProfile.total_interactions}
              </div>
              <div className="text-gray-400">Photos</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraApp;