import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SolarSailVisualizer = () => {
  // Sail parameters
  const [sailArea, setSailArea] = useState(196);  // m²
  const [sailMass, setSailMass] = useState(315);  // kg
  const [reflectivity, setReflectivity] = useState(0.85);

  // Constants
  const SOLAR_CONSTANT = 1361;  // W/m²
  const C = 299792458;         // m/s
  const AU = 149597870700;     // m

  // Generate performance data
  const generateForceData = () => {
    const angles = Array.from({ length: 91 }, (_, i) => i * Math.PI / 180);
    return angles.map(angle => {
      const pressure = SOLAR_CONSTANT / C;
      const normalForce = 2 * pressure * sailArea * reflectivity * Math.cos(angle) * Math.cos(angle);
      const tangentialForce = pressure * sailArea * (1 - reflectivity) * Math.cos(angle) * Math.sin(angle);
      const totalForce = Math.sqrt(Math.pow(normalForce, 2) + Math.pow(tangentialForce, 2));
      
      return {
        angle: angle * 180 / Math.PI,
        normalForce,
        tangentialForce,
        totalForce
      };
    });
  };

  const generateDistanceData = () => {
    const distances = Array.from({ length: 50 }, (_, i) => 0.2 + i * 0.1);
    return distances.map(distance => {
      const optimalAngle = Math.acos(Math.sqrt(1/3));
      const pressure = SOLAR_CONSTANT / (C * Math.pow(distance, 2));
      const force = 2 * pressure * sailArea * reflectivity * Math.pow(Math.cos(optimalAngle), 2);
      const acceleration = force / sailMass;
      
      return {
        distance,
        force,
        acceleration
      };
    });
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>太陽帆パラメータ設定</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium">セール面積 (m²)</label>
              <input
                type="number"
                value={sailArea}
                onChange={(e) => setSailArea(Number(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">質量 (kg)</label>
              <input
                type="number"
                value={sailMass}
                onChange={(e) => setSailMass(Number(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">反射率</label>
              <input
                type="number"
                value={reflectivity}
                step="0.01"
                min="0"
                max="1"
                onChange={(e) => setReflectivity(Number(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>角度に対する力の分布</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={generateForceData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="angle" 
                  label={{ value: '太陽に対する角度 (度)', position: 'bottom' }} 
                />
                <YAxis 
                  label={{ value: '力 (N)', angle: -90, position: 'left' }} 
                />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="normalForce" 
                  name="法線方向の力" 
                  stroke="#8884d8" 
                />
                <Line 
                  type="monotone" 
                  dataKey="tangentialForce" 
                  name="接線方向の力" 
                  stroke="#82ca9d" 
                />
                <Line 
                  type="monotone" 
                  dataKey="totalForce" 
                  name="合力" 
                  stroke="#ff7300" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>距離による性能変化</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={generateDistanceData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="distance" 
                  label={{ value: '太陽からの距離 (AU)', position: 'bottom' }} 
                />
                <YAxis 
                  label={{ value: '加速度 (m/s²)', angle: -90, position: 'left' }} 
                />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="acceleration" 
                  name="加速度" 
                  stroke="#8884d8" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SolarSailVisualizer;
