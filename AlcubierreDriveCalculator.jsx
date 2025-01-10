import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AlcubierreDriveCalculator = () => {
  const [speed, setSpeed] = useState(1); // c = speed of light
  const [bubbleRadius, setBubbleRadius] = useState(100); // meters
  const [thickness, setThickness] = useState(1); // meters

  // Constants
  const c = 2.998e8; // Speed of light in m/s
  const G = 6.674e-11; // Gravitational constant
  const hbar = 1.055e-34; // Reduced Planck constant
  const massOfSun = 1.989e30; // Mass of Sun in kg

  // Calculate energy requirements
  const calculateEnergyDensity = (v, R, δ) => {
    // Using modified York's equation
    return -(c ** 4) / (8 * Math.PI * G) * (v ** 2 * R ** 2) / (δ ** 2);
  };

  const calculateTotalEnergy = (v, R, δ) => {
    const density = calculateEnergyDensity(v, R, δ);
    const volume = 4 * Math.PI * R ** 2 * δ;
    return density * volume;
  };

  // Generate data for energy requirements at different speeds
  const energyData = Array.from({ length: 10 }, (_, i) => {
    const vel = (i + 1) * c;
    const energy = Math.abs(calculateTotalEnergy(vel, bubbleRadius, thickness));
    return {
      speed: (i + 1),
      energy: Math.log10(energy / (massOfSun * c * c)), // In solar masses
    };
  });

  // Generate data for bubble shape
  const bubbleShapeData = Array.from({ length: 50 }, (_, i) => {
    const x = (i - 25) * bubbleRadius / 10;
    const shapeFunction = Math.exp(-(x ** 2) / (2 * thickness ** 2));
    return {
      position: x,
      warp: shapeFunction,
    };
  });

  // Calculate key metrics
  const energyRequired = Math.abs(calculateTotalEnergy(speed * c, bubbleRadius, thickness));
  const solarMasses = energyRequired / (massOfSun * c * c);
  const timeDialation = 1 / Math.sqrt(1 - (speed ** 2));
  const properAcceleration = 0; // Theoretically zero inside the bubble

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Alcubierre Drive Parameters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium">Speed (c)</label>
              <input
                type="number"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                min="0"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Bubble Radius (m)</label>
              <input
                type="number"
                value={bubbleRadius}
                onChange={(e) => setBubbleRadius(Number(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Wall Thickness (m)</label>
              <input
                type="number"
                value={thickness}
                onChange={(e) => setThickness(Number(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                min="0.1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Energy Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={energyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="speed" label={{ value: 'Speed (c)', position: 'bottom' }} />
                <YAxis label={{ value: 'Energy (log₁₀ solar masses)', angle: -90, position: 'left' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="energy" name="Required Energy" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Warp Bubble Shape</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={bubbleShapeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="position" label={{ value: 'Position (m)', position: 'bottom' }} />
                <YAxis label={{ value: 'Warp Factor', angle: -90, position: 'left' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="warp" name="Warp Function" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Key Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-100 rounded-lg">
              <h3 className="font-bold">Energy Requirements</h3>
              <p>{solarMasses.toExponential(2)} solar masses</p>
            </div>
            <div className="p-4 bg-gray-100 rounded-lg">
              <h3 className="font-bold">Time Dilation Factor</h3>
              <p>{timeDialation.toExponential(2)}</p>
            </div>
            <div className="p-4 bg-gray-100 rounded-lg">
              <h3 className="font-bold">Proper Acceleration</h3>
              <p>{properAcceleration} m/s²</p>
            </div>
            <div className="p-4 bg-gray-100 rounded-lg">
              <h3 className="font-bold">Energy Density</h3>
              <p>{calculateEnergyDensity(speed * c, bubbleRadius, thickness).toExponential(2)} J/m³</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlcubierreDriveCalculator;
