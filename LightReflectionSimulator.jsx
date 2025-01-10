import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const LightReflectionSimulator = () => {
  // Constants
  const EARTH_ALBEDO = 0.30;      // Earth's average albedo
  const MOON_ALBEDO = 0.12;       // Moon's average albedo
  const EARTH_RADIUS = 6371;      // km
  const MOON_RADIUS = 1737;       // km
  const MOON_DISTANCE = 384400;   // km
  const SOLAR_CONSTANT = 1361;    // W/m²

  const [timeOfDay, setTimeOfDay] = useState(0);
  const [moonPhase, setMoonPhase] = useState(0);
  const [surfaceType, setSurfaceType] = useState('average');

  // Surface albedo values
  const surfaceAlbedos = {
    snow: 0.90,
    desert: 0.40,
    forest: 0.15,
    ocean: 0.06,
    average: EARTH_ALBEDO
  };

  // Calculate light intensity based on angle
  const calculateIntensity = (angle) => {
    return Math.max(0, Math.cos(angle * Math.PI / 180));
  };

  // Generate reflection data over 24 hours
  const generateDayData = () => {
    return Array.from({ length: 24 }, (_, hour) => {
      const angle = (hour * 15) - 180; // Convert hour to angle
      const sunIntensity = calculateIntensity((angle + 180) % 360 - 180);
      const moonIntensity = calculateIntensity((angle + moonPhase + 180) % 360 - 180);
      
      const directSunlight = SOLAR_CONSTANT * sunIntensity;
      const moonReflection = SOLAR_CONSTANT * moonIntensity * MOON_ALBEDO * 
                            (Math.PI * Math.pow(MOON_RADIUS, 2)) / 
                            (4 * Math.PI * Math.pow(MOON_DISTANCE, 2));
      const earthReflection = directSunlight * surfaceAlbedos[surfaceType];

      return {
        hour,
        sunlight: directSunlight,
        moonReflection: moonReflection,
        earthReflection: earthReflection,
        totalIllumination: directSunlight + moonReflection
      };
    });
  };

  // Calculate energy exchanges
  const calculateEnergyExchange = () => {
    const earthCrossSectionArea = Math.PI * Math.pow(EARTH_RADIUS, 2);
    const moonCrossSectionArea = Math.PI * Math.pow(MOON_RADIUS, 2);
    
    const solarEnergyEarth = SOLAR_CONSTANT * earthCrossSectionArea;
    const solarEnergyMoon = SOLAR_CONSTANT * moonCrossSectionArea;
    
    const earthReflectedEnergy = solarEnergyEarth * surfaceAlbedos[surfaceType];
    const moonReflectedEnergy = solarEnergyMoon * MOON_ALBEDO;
    
    return {
      earthReceived: solarEnergyEarth,
      earthReflected: earthReflectedEnergy,
      moonReceived: solarEnergyMoon,
      moonReflected: moonReflectedEnergy
    };
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Earth-Moon Light Reflection Simulator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium">Surface Type</label>
              <select 
                value={surfaceType}
                onChange={(e) => setSurfaceType(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value="average">Average Earth</option>
                <option value="snow">Snow</option>
                <option value="desert">Desert</option>
                <option value="forest">Forest</option>
                <option value="ocean">Ocean</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Moon Phase (degrees)</label>
              <input
                type="range"
                min="0"
                max="360"
                value={moonPhase}
                onChange={(e) => setMoonPhase(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Light Intensity Over 24 Hours</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={generateDayData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="hour" 
                  label={{ value: 'Hour of Day', position: 'bottom' }} 
                />
                <YAxis 
                  label={{ value: 'Light Intensity (W/m²)', angle: -90, position: 'left' }} 
                />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="sunlight" 
                  name="Direct Sunlight" 
                  stroke="#ffd700" 
                />
                <Line 
                  type="monotone" 
                  dataKey="moonReflection" 
                  name="Moon Reflection" 
                  stroke="#c0c0c0" 
                />
                <Line 
                  type="monotone" 
                  dataKey="earthReflection" 
                  name="Earth Reflection" 
                  stroke="#4169e1" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Energy Exchange Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(calculateEnergyExchange()).map(([key, value]) => (
              <div key={key} className="p-4 bg-gray-100 rounded-lg">
                <h3 className="font-bold">{key.replace(/([A-Z])/g, ' $1').trim()}</h3>
                <p>{value.toExponential(2)} Watts</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LightReflectionSimulator;
