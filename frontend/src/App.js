import React, { useState, useEffect } from 'react';
import { Camera, Brain, Zap, Shield, Clock, MapPin, User, Activity, Smartphone } from 'lucide-react';
import CameraApp from './components/CameraApp';
import RealTimeLearningDashboard from './components/RealTimeLearningDashboard';
import SamsungEcosystemDemo from './components/SamsungEcosystemDemo';
import { getBehaviorProfile, learnBehavior } from './services/api';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [behaviorProfile, setBehaviorProfile] = useState(null);
  const [learningProgress, setLearningProgress] = useState(0);
  const [recentInteractions, setRecentInteractions] = useState([]);

  useEffect(() => {
    loadBehaviorProfile();
  }, []);

  const loadBehaviorProfile = async () => {
    try {
      const profile = await getBehaviorProfile();
      setBehaviorProfile(profile);
      setLearningProgress(profile.learning_progress || 0);
    } catch (error) {
      console.error('Failed to load behavior profile:', error);
    }
  };

  const handleBehaviorLearning = async (action, context, settings) => {
    try {
      await learnBehavior(action, context, settings);
      await loadBehaviorProfile(); // Refresh profile
    } catch (error) {
      console.error('Failed to learn behavior:', error);
    }
  };

  const HomeScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold">Digital Twin You</h1>
          </div>
          <p className="text-gray-300">AI-Powered Camera Assistant for Samsung Galaxy</p>
          <div className="mt-2 text-sm text-blue-200">
            Samsung PRISM GenAI Hackathon 2025
          </div>
        </div>

        {/* Learning Progress */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-6 h-6 text-yellow-400" />
            <h3 className="text-xl font-semibold">AI Learning Progress</h3>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${learningProgress}%` }}
            ></div>
          </div>
          
          {behaviorProfile && (
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {behaviorProfile.total_patterns}
                </div>
                <div className="text-gray-400">Patterns Learned</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {Math.round((behaviorProfile.average_confidence || 0) * 100)}%
                </div>
                <div className="text-gray-400">Avg Confidence</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {behaviorProfile.total_interactions}
                </div>
                <div className="text-gray-400">Photos Analyzed</div>
              </div>
            </div>
          )}
        </div>

        {/* Current Context */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Current Context</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-400" />
              <span>{new Date().toLocaleTimeString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-400" />
              <span>Home</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-purple-400" />
              <span>{new Date().toLocaleDateString('en-US', { weekday: 'short' })}</span>
            </div>
          </div>
        </div>

        {/* Top Learned Patterns */}
        {behaviorProfile && behaviorProfile.top_patterns && behaviorProfile.top_patterns.length > 0 && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4">Top Learned Patterns</h3>
            <div className="space-y-3">
              {behaviorProfile.top_patterns.map((pattern, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div>
                    <div className="font-medium">{pattern.pattern.replace(/_/g, ' ')}</div>
                    <div className="text-sm text-gray-400">Used {pattern.frequency} times</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-400">
                      {Math.round(pattern.confidence * 100)}%
                    </div>
                    <div className="text-xs text-gray-400">Confidence</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* App Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div 
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 cursor-pointer hover:bg-white/20 transition-all duration-300 group ring-2 ring-blue-400 shadow-2xl"
            onClick={() => setCurrentView('camera')}
          >
            <div className="text-center">
              <Camera className="w-12 h-12 mx-auto mb-4 text-blue-400 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold mb-2">Samsung Camera</h3>
              <p className="text-gray-400 text-sm mb-3">AI-Enhanced Photography</p>
              <div className="p-2 bg-blue-500/20 rounded text-xs">
                AI Assistant Ready
              </div>
            </div>
          </div>
          
          <div 
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 cursor-pointer hover:bg-white/20 transition-all duration-300 group"
            onClick={() => setCurrentView('dashboard')}
          >
            <div className="text-center">
              <Activity className="w-12 h-12 mx-auto mb-4 text-green-400 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold mb-2">AI Dashboard</h3>
              <p className="text-gray-400 text-sm mb-3">Real-time Learning</p>
              <div className="p-2 bg-green-500/20 rounded text-xs">
                Live Analytics
              </div>
            </div>
          </div>
          
          <div 
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 cursor-pointer hover:bg-white/20 transition-all duration-300 group"
            onClick={() => setCurrentView('ecosystem')}
          >
            <div className="text-center">
              <Smartphone className="w-12 h-12 mx-auto mb-4 text-purple-400 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold mb-2">Galaxy Ecosystem</h3>
              <p className="text-gray-400 text-sm mb-3">Cross-device AI</p>
              <div className="p-2 bg-purple-500/20 rounded text-xs">
                Knox Secured
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="mt-8 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-green-400" />
            <span className="font-semibold text-green-400">Privacy Protected</span>
          </div>
          <p className="text-sm text-gray-300">
            All learning happens on-device with Samsung Knox encryption. 
            Your behavioral data never leaves your phone.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-7xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
      {currentView === 'home' && <HomeScreen />}
      {currentView === 'camera' && (
        <CameraApp 
          onBack={() => setCurrentView('home')}
          onLearnBehavior={handleBehaviorLearning}
          behaviorProfile={behaviorProfile}
        />
      )}
      {currentView === 'dashboard' && (
        <div className="min-h-screen bg-gray-900">
          <div className="p-4 bg-gray-800 flex items-center justify-between">
            <button 
              className="text-blue-400 flex items-center gap-2"
              onClick={() => setCurrentView('home')}
            >
              ← Back to Home
            </button>
            <h1 className="text-xl font-semibold text-white">AI Learning Dashboard</h1>
            <div></div>
          </div>
          <RealTimeLearningDashboard 
            behaviorProfile={behaviorProfile}
            recentInteractions={recentInteractions}
          />
        </div>
      )}
      {currentView === 'ecosystem' && (
        <div className="min-h-screen bg-gray-900">
          <div className="p-4 bg-gray-800 flex items-center justify-between">
            <button 
              className="text-blue-400 flex items-center gap-2"
              onClick={() => setCurrentView('home')}
            >
              ← Back to Home
            </button>
            <h1 className="text-xl font-semibold text-white">Samsung Galaxy Ecosystem</h1>
            <div></div>
          </div>
          <SamsungEcosystemDemo />
        </div>
      )}
    </div>
  );
}

export default App;