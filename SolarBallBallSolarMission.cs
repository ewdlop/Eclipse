using System;
using System.Collections.Generic;

namespace SolarSailSimulator
{
    public class SolarSail
    {
        // Solar sail physical parameters
        public double SailArea { get; set; }          // m²
        public double SailMass { get; set; }          // kg
        public double Reflectivity { get; set; }      // 0-1
        public double EmissivityFront { get; set; }   // 0-1
        public double EmissivityBack { get; set; }    // 0-1

        // Constants
        private const double SOLAR_CONSTANT = 1361.0;     // W/m² at 1 AU
        private const double C = 299792458.0;             // Speed of light (m/s)
        private const double AU = 149597870700.0;         // Astronomical Unit (m)

        public SolarSail(double area, double mass, double reflectivity = 0.85)
        {
            SailArea = area;
            SailMass = mass;
            Reflectivity = reflectivity;
            EmissivityFront = 0.05;
            EmissivityBack = 0.55;
        }

        // Calculate solar radiation pressure force
        public double CalculateRadiationForce(double distance, double angle)
        {
            // Solar radiation pressure at given distance (in AU)
            double pressure = SOLAR_CONSTANT / (C * Math.Pow(distance, 2));
            
            // Calculate force components
            double normalForce = 2 * pressure * SailArea * Reflectivity * Math.Cos(angle) * Math.Cos(angle);
            double tangentialForce = pressure * SailArea * (1 - Reflectivity) * Math.Cos(angle) * Math.Sin(angle);
            
            return Math.Sqrt(Math.Pow(normalForce, 2) + Math.Pow(tangentialForce, 2));
        }

        // Calculate acceleration
        public double CalculateAcceleration(double force)
        {
            return force / SailMass;
        }

        // Calculate characteristic acceleration
        public double CalculateCharacteristicAcceleration()
        {
            return 2 * SOLAR_CONSTANT * SailArea * Reflectivity / (C * SailMass);
        }

        // Calculate optimal sail angle for maximum thrust
        public double CalculateOptimalAngle()
        {
            return Math.Acos(Math.Sqrt(1.0 / 3.0));  // ~35.26 degrees
        }

        // Calculate thermal load
        public double CalculateThermalLoad(double distance, double angle)
        {
            double solarFlux = SOLAR_CONSTANT / Math.Pow(distance, 2);
            double absorbedPower = solarFlux * SailArea * (1 - Reflectivity) * Math.Cos(angle);
            return absorbedPower;
        }

        // Calculate sail temperature
        public double CalculateSailTemperature(double distance, double angle)
        {
            double absorptivity = 1 - Reflectivity;
            double effectiveEmissivity = (EmissivityFront + EmissivityBack) / 2;
            double solarFlux = SOLAR_CONSTANT / Math.Pow(distance, 2);
            
            // Stefan-Boltzmann equation
            const double STEFAN_BOLTZMANN = 5.67e-8;  // W/(m²·K⁴)
            double temperature = Math.Pow(
                (absorptivity * solarFlux * Math.Cos(angle)) / 
                (effectiveEmissivity * STEFAN_BOLTZMANN),
                0.25
            );
            
            return temperature;
        }

        // Calculate travel time to destination
        public double CalculateTravelTime(double startDistance, double endDistance, double angle)
        {
            double acceleration = CalculateAcceleration(
                CalculateRadiationForce(startDistance, angle)
            );
            
            double deltaV = Math.Sqrt(2 * acceleration * (endDistance - startDistance) * AU);
            return deltaV / acceleration;
        }
    }

    public class SolarSailMission
    {
        private SolarSail Sail { get; set; }
        private double StartDistance { get; set; }  // AU
        private double EndDistance { get; set; }    // AU
        private double SailAngle { get; set; }      // radians

        public SolarSailMission(SolarSail sail, double startDistance, double endDistance, double sailAngle)
        {
            Sail = sail;
            StartDistance = startDistance;
            EndDistance = endDistance;
            SailAngle = sailAngle;
        }

        public void CalculateMissionParameters()
        {
            Console.WriteLine("太陽帆ミッション解析:");
            Console.WriteLine("===============================");
            
            // Characteristic acceleration
            double charAccel = Sail.CalculateCharacteristicAcceleration();
            Console.WriteLine($"特性加速度: {charAccel:F6} m/s²");
            
            // Initial force
            double initialForce = Sail.CalculateRadiationForce(StartDistance, SailAngle);
            Console.WriteLine($"初期放射圧力: {initialForce:F6} N");
            
            // Initial acceleration
            double initialAccel = Sail.CalculateAcceleration(initialForce);
            Console.WriteLine($"初期加速度: {initialAccel:F6} m/s²");
            
            // Travel time
            double travelTime = Sail.CalculateTravelTime(StartDistance, EndDistance, SailAngle);
            Console.WriteLine($"予想飛行時間: {travelTime / (24 * 3600):F2} 日");
            
            // Thermal analysis
            double initialTemp = Sail.CalculateSailTemperature(StartDistance, SailAngle);
            Console.WriteLine($"初期セール温度: {initialTemp:F1} K");
            
            // Performance metrics
            double areaToMassRatio = Sail.SailArea / Sail.SailMass;
            Console.WriteLine($"面積質量比: {areaToMassRatio:F2} m²/kg");
        }
    }

    class Program
    {
        static void Main()
        {
            // IKAROS-like solar sail
            var ikaros = new SolarSail(
                area: 196,     // 14m x 14m
                mass: 315,     // kg
                reflectivity: 0.85
            );

            // Earth to Mars mission
            var marsMission = new SolarSailMission(
                sail: ikaros,
                startDistance: 1.0,    // Earth (1 AU)
                endDistance: 1.524,    // Mars (~1.524 AU)
                sailAngle: Math.PI / 6 // 30 degrees
            );

            marsMission.CalculateMissionParameters();

            // Example trajectories
            Console.WriteLine("\n軌道解析:");
            Console.WriteLine("===============================");
            
            double[] distances = { 0.5, 1.0, 1.5, 2.0 };  // AU
            foreach (var distance in distances)
            {
                double force = ikaros.CalculateRadiationForce(distance, ikaros.CalculateOptimalAngle());
                double accel = ikaros.CalculateAcceleration(force);
                Console.WriteLine($"距離 {distance:F1} AU での加速度: {accel:E3} m/s²");
            }
        }
    }
}
