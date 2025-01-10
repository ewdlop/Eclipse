```jsx
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const UniverseFateVisualizer = () => {
  const [scenarioType, setScenarioType] = useState('bigRip');
  
  // Constants
  const H0 = 67.4; // Hubble constant (km/s/Mpc)
  const OMEGA_M = 0.315; // Matter density
  const OMEGA_L = 0.685; // Dark energy density
  const w = -1.03; // Dark energy equation of state

  // Generate timeline data for different scenarios
  const generateTimelineData = (scenario) => {
    switch(scenario) {
      case 'bigRip':
        return Array.from({ length: 50 }, (_, i) => {
          const t = i * 5e9; // Time in years
          const scale = Math.exp(H0 * t / (3e10));
          return {
            time: t / 1e9,
            size: Math.min(scale, 100),
            density: 1 / Math.pow(scale, 3),
            temperature: 2.7 / scale
          };
        });
      
      case 'heatDeath':
        return Array.from({ length: 50 }, (_, i) => {
          const t = i * 1e10;
          const scale = Math.pow(t / 1e10, 1/2);
          return {
            time: t / 1e9,
            size: scale,
            density: 1 / Math.pow(scale, 3),
            temperature: 2.7 / scale
          };
        });
      
      case 'bigCrunch':
        return Array.from({ length: 50 }, (_, i) => {
          const t = i * 2e9;
          const maxTime = 50e9;
          const scale = 1 + Math.sin(Math.PI * t / maxTime);
          return {
            time: t / 1e9,
            size: scale,
            density: 1 / Math.pow(scale, 3),
            temperature: 2.7 / scale
          };
        });
      
      default:
        return [];
    }
  };

  const timelineData = generateTimelineData(scenarioType);

  // Key events based on scenario
  const getKeyEvents = (scenario) => {
    switch(scenario) {
      case 'bigRip':
        return [
          { time: "1e9 years", event: "Galaxies begin to be torn apart" },
          { time: "10e9 years", event: "Solar systems disintegrate" },
          { time: "10e-11 sec before end", event: "Atoms are shredded" },
          { time: "Final moment", event: "Spacetime itself is torn" }
        ];
      
      case 'heatDeath':
        return [
          { time: "10e14 years", event: "Last stars burn out" },
          { time: "10e40 years", event: "Black holes evaporate" },
          { time: "10e100 years", event: "Iron stars cool to absolute zero" },
          { time: "10e1500 years", event: "Quantum effects dominate" }
        ];
      
      case 'bigCrunch':
        return [
          { time: "10e9 years", event: "Universe begins contracting" },
          { time: "20e9 years", event: "Galaxies begin merging" },
          { time: "40e9 years", event: "Matter compressed to plasma" },
          { time: "50e9 years", event: "Singularity reached" }
        ];
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Ultimate Fate of the Universe</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <select 
              value={scenarioType}
              onChange={(e) => setScenarioType(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="bigRip">Big Rip</option>
              <option value="heatDeath">Heat Death</option>
              <option value="bigCrunch">Big Crunch</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Universe Scale Factor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="time" 
                  label={{ value: 'Time (billions of years)', position: 'bottom' }} 
                />
                <YAxis 
                  label={{ value: 'Scale Factor', angle: -90, position: 'left' }} 
                />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="size" 
                  name="Universe Scale" 
                  stroke="#8884d8" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Matter Density and Temperature</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="time" 
                  label={{ value: 'Time (billions of years)', position: 'bottom' }} 
                />
                <YAxis 
                  label={{ value: 'Relative Value', angle: -90, position: 'left' }} 
                />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="density" 
                  name="Matter Density" 
                  stroke="#82ca9d" 
                />
                <Line 
                  type="monotone" 
                  dataKey="temperature" 
                  name="Temperature" 
                  stroke="#ff7300" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Key Events Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {getKeyEvents(scenarioType).map((event, index) => (
              <div key={index} className="p-4 bg-gray-100 rounded-lg">
                <div className="font-bold">{event.time}</div>
                <div>{event.event}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
```
export default UniverseFateVisualizer;
