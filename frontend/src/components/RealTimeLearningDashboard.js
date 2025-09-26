import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, Eye, Clock, MapPin, Camera, Zap, Activity } from 'lucide-react';

const RealTimeLearningDashboard = ({ behaviorProfile, recentInteractions = [] }) => {
  const [learningEvents, setLearningEvents] = useState([]);
  const [patternStrength, setPatternStrength] = useState({
    morning_coffee: 92,
    evening_portrait: 73,
    macro_photography: 85,
    location_correlation: 67
  });
  const [neuralActivity, setNeuralActivity] = useState([]);

  useEffect(() => {
    // Simulate real-time learning events
    const interval = setInterval(() => {
      const newEvent = generateLearningEvent();
      setLearningEvents(prev => [newEvent, ...prev].slice(0, 6));
      
      // Update pattern strength
      updatePatternStrength(newEvent);
      
      // Add neural activity
      setNeuralActivity(prev => [
        ...prev.slice(-20),
        { timestamp: Date.now(), intensity: Math.random() * 100 }
      ]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const generateLearningEvent = () => {
    const eventTypes = [
      { 
        type: 'pattern_reinforced', 
        icon: TrendingUp, 
        color: 'text-green-400',
        message: 'Morning coffee pattern strengthened',
        impact: '+5% confidence'
      },
      { 
        type: 'new_correlation', 
        icon: Eye, 
        color: 'text-blue-400',
        message: 'Kitchen → Macro mode correlation discovered',
        impact: 'New insight'
      },
      { 
        type: 'temporal_pattern', 
        icon: Clock, 
        color: 'text-purple-400',
        message: 'Evening routine pattern detected',
        impact: 'Temporal learning'
      },
      { 
        type: 'context_learning', 
        icon: MapPin, 
        color: 'text-orange-400',
        message: 'Location-based preference learned',
        impact: 'Context awareness'
      }
    ];

    const event = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    return {
      ...event,
      timestamp: new Date(),
      confidence: Math.random() * 0.3 + 0.7,
      id: Date.now()
    };
  };

  const updatePatternStrength = (event) => {
    setPatternStrength(prev => {
      const newStrength = { ...prev };
      const keys = Object.keys(newStrength);
      const randomKey = keys[Math.floor(Math.random() * keys.length)];
      newStrength[randomKey] = Math.min(newStrength[randomKey] + Math.random() * 3, 100);
      return newStrength;
    });
  };

  const PatternVisualization = ({ pattern, strength }) => (
    <div className="bg-gray-800 p-3 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium capitalize">
          {pattern.replace(/_/g, ' ')}
        </span>
        <span className="text-xs text-gray-400">{Math.round(strength)}%</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
          style={{ width: `${Math.min(strength, 100)}%` }}
        />
      </div>
    </div>
  );

  const NeuralNetworkViz = () => (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <Activity className="w-5 h-5 text-blue-400" />
        Neural Network Activity
      </h3>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-500 rounded-full mx-auto mb-2 animate-pulse flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div className="text-xs">Time Context</div>
        </div>
        <div className="text-center">
          <div className="w-12 h-12 bg-purple-500 rounded-full mx-auto mb-2 animate-pulse flex items-center justify-center">
            <Brain className="w-6 h-6" />
          </div>
          <div className="text-xs">Behavioral Engine</div>
        </div>
        <div className="text-center">
          <div className="w-12 h-12 bg-green-500 rounded-full mx-auto mb-2 animate-pulse flex items-center justify-center">
            <Camera className="w-6 h-6" />
          </div>
          <div className="text-xs">Prediction Output</div>
        </div>
      </div>
      
      {/* Neural activity graph */}
      <div className="h-16 bg-gray-700 rounded p-2 flex items-end gap-1">
        {neuralActivity.slice(-15).map((activity, index) => (
          <div
            key={activity.timestamp}
            className="bg-blue-400 rounded-t flex-1 transition-all duration-300"
            style={{ height: `${(activity.intensity / 100) * 100}%` }}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Brain className="w-8 h-8 text-blue-400" />
        <h2 className="text-2xl font-bold">AI Learning Dashboard</h2>
        <div className="ml-auto bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          Live Learning Active
        </div>
      </div>

      {/* Real-time stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold">{behaviorProfile?.total_patterns || 12}</div>
          <div className="text-sm opacity-80">Active Patterns</div>
        </div>
        <div className="bg-gradient-to-br from-green-600 to-green-700 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold">
            {Math.round((behaviorProfile?.average_confidence || 0.78) * 100)}%
          </div>
          <div className="text-sm opacity-80">Avg Confidence</div>
        </div>
        <div className="bg-gradient-to-br from-purple-600 to-purple-700 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold">{behaviorProfile?.total_interactions || 89}</div>
          <div className="text-sm opacity-80">Learning Events</div>
        </div>
        <div className="bg-gradient-to-br from-orange-600 to-orange-700 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold">187ms</div>
          <div className="text-sm opacity-80">Prediction Speed</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Real-time Learning Events */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Live Learning Events
          </h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {learningEvents.map((event) => (
              <div key={event.id} className="flex items-center gap-3 p-3 bg-gray-700/50 rounded animate-fadeIn">
                <event.icon className={`w-4 h-4 ${event.color}`} />
                <div className="flex-1">
                  <div className="text-sm font-medium">{event.message}</div>
                  <div className="text-xs text-gray-400 flex items-center gap-2">
                    <span>{event.timestamp.toLocaleTimeString()}</span>
                    <span>•</span>
                    <span className={event.color}>{event.impact}</span>
                  </div>
                </div>
                <div className={`text-xs px-2 py-1 rounded ${event.color} bg-current/20`}>
                  {Math.round(event.confidence * 100)}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pattern Strength Visualization */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            Pattern Strength Evolution
          </h3>
          <div className="space-y-3">
            {Object.entries(patternStrength).map(([pattern, strength]) => (
              <PatternVisualization key={pattern} pattern={pattern} strength={strength} />
            ))}
          </div>
        </div>
      </div>

      {/* Neural Network Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <NeuralNetworkViz />
        
        {/* AI Insights */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5 text-purple-400" />
            AI Insights
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="font-medium text-blue-400 mb-1">Strongest Pattern</div>
              <div className="text-sm">Morning coffee routine (8:00-8:30 AM)</div>
              <div className="text-xs text-gray-400">92% confidence • 15 occurrences</div>
            </div>
            <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
              <div className="font-medium text-purple-400 mb-1">Emerging Trend</div>
              <div className="text-sm">Evening portrait sessions increasing</div>
              <div className="text-xs text-gray-400">73% confidence • Growing pattern</div>
            </div>
            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="font-medium text-green-400 mb-1">Context Discovery</div>
              <div className="text-sm">Kitchen location → Macro mode preference</div>
              <div className="text-xs text-gray-400">Location-based learning active</div>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Analytics */}
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Brain className="w-5 h-5 text-blue-400" />
          Advanced Behavioral Analytics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-700 rounded-lg">
            <div className="text-2xl font-bold text-blue-400">94.2%</div>
            <div className="text-sm text-gray-400">Prediction Accuracy</div>
            <div className="text-xs text-green-400 mt-1">↑ 2.1% this week</div>
          </div>
          <div className="text-center p-4 bg-gray-700 rounded-lg">
            <div className="text-2xl font-bold text-purple-400">3.7x</div>
            <div className="text-sm text-gray-400">Learning Velocity</div>
            <div className="text-xs text-green-400 mt-1">↑ Accelerating</div>
          </div>
          <div className="text-center p-4 bg-gray-700 rounded-lg">
            <div className="text-2xl font-bold text-orange-400">8/10</div>
            <div className="text-sm text-gray-400">Recent Predictions Accepted</div>
            <div className="text-xs text-green-400 mt-1">High user satisfaction</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeLearningDashboard;