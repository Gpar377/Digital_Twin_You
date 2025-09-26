import React, { useState, useEffect } from 'react';
import { Smartphone, Watch, Headphones, Tablet, Wifi, Shield, Zap, RefreshCw } from 'lucide-react';

const SamsungEcosystemDemo = () => {
  const [deviceSync, setDeviceSync] = useState({
    galaxy_phone: { 
      status: 'active', 
      learning_data: 'camera_patterns',
      sync_status: 'real_time',
      patterns_shared: 12,
      battery_impact: '&lt; 1%'
    },
    galaxy_watch: { 
      status: 'connected', 
      learning_data: 'context_timing',
      sync_status: 'synced',
      patterns_shared: 8,
      battery_impact: '&lt; 0.5%'
    },
    galaxy_buds: { 
      status: 'connected', 
      learning_data: 'audio_preferences',
      sync_status: 'synced',
      patterns_shared: 3,
      battery_impact: '&lt; 0.2%'
    },
    galaxy_tablet: { 
      status: 'syncing', 
      learning_data: 'viewing_patterns',
      sync_status: 'pending',
      patterns_shared: 0,
      battery_impact: 'N/A'
    }
  });

  const [crossDeviceLearning, setCrossDeviceLearning] = useState([]);

  useEffect(() => {
    // Simulate cross-device learning events
    const interval = setInterval(() => {
      const learningEvent = generateCrossDeviceLearning();
      setCrossDeviceLearning(prev => [learningEvent, ...prev].slice(0, 5));
      
      // Update sync status
      updateSyncStatus();
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const generateCrossDeviceLearning = () => {
    const events = [
      {
        source: 'Galaxy Watch',
        target: 'Galaxy Phone',
        learning: 'Morning routine timing detected → Camera auto-ready at 8 AM',
        impact: 'Proactive camera preparation',
        icon: Watch,
        color: 'text-blue-400'
      },
      {
        source: 'Galaxy Phone',
        target: 'Galaxy Tablet',
        learning: 'Photo editing preferences → Tablet photo app optimization',
        impact: 'Consistent editing experience',
        icon: Smartphone,
        color: 'text-green-400'
      },
      {
        source: 'Galaxy Buds',
        target: 'Galaxy Phone',
        learning: 'Music listening patterns → Camera video mode suggestions',
        impact: 'Audio-visual correlation',
        icon: Headphones,
        color: 'text-purple-400'
      }
    ];

    return {
      ...events[Math.floor(Math.random() * events.length)],
      timestamp: new Date(),
      id: Date.now()
    };
  };

  const updateSyncStatus = () => {
    setDeviceSync(prev => {
      const updated = { ...prev };
      
      // Simulate tablet sync completion
      if (updated.galaxy_tablet.status === 'syncing') {
        const random = Math.random();
        if (random > 0.7) {
          updated.galaxy_tablet.status = 'connected';
          updated.galaxy_tablet.sync_status = 'synced';
          updated.galaxy_tablet.patterns_shared = 5;
          updated.galaxy_tablet.battery_impact = '&lt; 0.3%';
        }
      }
      
      // Update pattern counts
      Object.keys(updated).forEach(device => {
        if (updated[device].status === 'active' || updated[device].status === 'connected') {
          updated[device].patterns_shared += Math.floor(Math.random() * 2);
        }
      });
      
      return updated;
    });
  };

  const DeviceCard = ({ deviceKey, device, icon: Icon, name, color }) => (
    <div className={`bg-gray-800 p-4 rounded-lg border-l-4 ${color} relative`}>
      <div className="flex items-center gap-3 mb-3">
        <Icon className="w-6 h-6 text-white" />
        <div>
          <h3 className="font-semibold">{name}</h3>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              device.status === 'active' ? 'bg-green-400' :
              device.status === 'connected' ? 'bg-blue-400' :
              device.status === 'syncing' ? 'bg-yellow-400 animate-pulse' :
              'bg-gray-400'
            }`} />
            <span className="text-xs text-gray-400 capitalize">{device.status}</span>
          </div>
        </div>
        
        {device.sync_status === 'real_time' && (
          <div className="absolute top-2 right-2">
            <Wifi className="w-4 h-4 text-green-400 animate-pulse" />
          </div>
        )}
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">Learning Data:</span>
          <span className="text-white capitalize">{device.learning_data.replace(/_/g, ' ')}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Patterns Shared:</span>
          <span className="text-blue-400 font-semibold">{device.patterns_shared}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Battery Impact:</span>
          <span className="text-green-400">{device.battery_impact}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Sync Status:</span>
          <span className={`capitalize ${
            device.sync_status === 'real_time' ? 'text-green-400' :
            device.sync_status === 'synced' ? 'text-blue-400' :
            'text-yellow-400'
          }`}>
            {device.sync_status.replace(/_/g, ' ')}
          </span>
        </div>
      </div>
    </div>
  );

  const totalPatterns = Object.values(deviceSync).reduce((sum, device) => sum + device.patterns_shared, 0);
  const activeDevices = Object.values(deviceSync).filter(d => d.status === 'active' || d.status === 'connected').length;

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2">
          <Smartphone className="w-8 h-8 text-blue-400" />
          <RefreshCw className="w-6 h-6 text-purple-400" />
        </div>
        <h2 className="text-2xl font-bold">Samsung Galaxy Ecosystem</h2>
        <div className="ml-auto bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm flex items-center gap-2">
          <Shield className="w-4 h-4" />
          Knox Secured
        </div>
      </div>

      {/* Ecosystem Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold">{activeDevices}/4</div>
          <div className="text-sm opacity-80">Connected Devices</div>
        </div>
        <div className="bg-gradient-to-br from-green-600 to-green-700 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold">{totalPatterns}</div>
          <div className="text-sm opacity-80">Shared Patterns</div>
        </div>
        <div className="bg-gradient-to-br from-purple-600 to-purple-700 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold">100%</div>
          <div className="text-sm opacity-80">On-Device Processing</div>
        </div>
        <div className="bg-gradient-to-br from-orange-600 to-orange-700 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold">&lt; 1%</div>
          <div className="text-sm opacity-80">Battery Impact</div>
        </div>
      </div>

      {/* Device Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <DeviceCard
          deviceKey="galaxy_phone"
          device={deviceSync.galaxy_phone}
          icon={Smartphone}
          name="Galaxy Phone"
          color="border-blue-500"
        />
        <DeviceCard
          deviceKey="galaxy_watch"
          device={deviceSync.galaxy_watch}
          icon={Watch}
          name="Galaxy Watch"
          color="border-green-500"
        />
        <DeviceCard
          deviceKey="galaxy_buds"
          device={deviceSync.galaxy_buds}
          icon={Headphones}
          name="Galaxy Buds"
          color="border-purple-500"
        />
        <DeviceCard
          deviceKey="galaxy_tablet"
          device={deviceSync.galaxy_tablet}
          icon={Tablet}
          name="Galaxy Tablet"
          color="border-orange-500"
        />
      </div>

      {/* Cross-Device Learning Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Cross-Device Learning
          </h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {crossDeviceLearning.map((event) => (
              <div key={event.id} className="p-3 bg-gray-700/50 rounded">
                <div className="flex items-center gap-2 mb-2">
                  <event.icon className={`w-4 h-4 ${event.color}`} />
                  <span className="text-sm font-medium">{event.source} → {event.target}</span>
                </div>
                <div className="text-sm text-gray-300 mb-1">{event.learning}</div>
                <div className="text-xs text-gray-400 flex items-center gap-2">
                  <span>{event.timestamp.toLocaleTimeString()}</span>
                  <span>•</span>
                  <span className={event.color}>{event.impact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Samsung Knox Security */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-400" />
            Knox Security & Privacy
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="font-medium text-blue-400 mb-1">End-to-End Encryption</div>
              <div className="text-sm text-gray-300">All behavioral data encrypted with Knox</div>
            </div>
            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="font-medium text-green-400 mb-1">On-Device Processing</div>
              <div className="text-sm text-gray-300">No data leaves Samsung ecosystem</div>
            </div>
            <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
              <div className="font-medium text-purple-400 mb-1">User Control</div>
              <div className="text-sm text-gray-300">Granular privacy settings per device</div>
            </div>
            <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
              <div className="font-medium text-orange-400 mb-1">Secure Sync</div>
              <div className="text-sm text-gray-300">Knox-to-Knox encrypted synchronization</div>
            </div>
          </div>
        </div>
      </div>

      {/* Ecosystem Benefits */}
      <div className="mt-6 bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-4 rounded-lg border border-blue-500/30">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-400" />
          Ecosystem Intelligence Benefits
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="font-medium text-blue-400 mb-1">Contextual Awareness</div>
            <div className="text-gray-300">Watch detects morning routine → Phone prepares camera</div>
          </div>
          <div>
            <div className="font-medium text-green-400 mb-1">Seamless Experience</div>
            <div className="text-gray-300">Consistent preferences across all Galaxy devices</div>
          </div>
          <div>
            <div className="font-medium text-purple-400 mb-1">Predictive Intelligence</div>
            <div className="text-gray-300">Multi-device data improves AI predictions</div>
          </div>
          <div>
            <div className="font-medium text-orange-400 mb-1">Privacy Protected</div>
            <div className="text-gray-300">All learning stays within Samsung Knox ecosystem</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SamsungEcosystemDemo;