import numpy as np
import matplotlib.pyplot as plt
import scipy.constants as const

class CosmicMotionAnalysis:
    """
    Comprehensive analysis of rocket science and celestial mechanics
    """
    
    @staticmethod
    def rocket_trajectory_calculation(
        initial_velocity=0,  # m/s
        launch_angle=45,     # degrees
        initial_height=0,    # meters
        payload_mass=1000,   # kg
        fuel_mass=50000      # kg
        ):
        """
        Calculate rocket trajectory using simplified physics model
        
        Parameters:
        initial_velocity (float): Initial launch velocity
        launch_angle (float): Launch angle from horizontal
        initial_height (float): Initial launch height
        payload_mass (float): Mass of payload
        fuel_mass (float): Mass of fuel
        
        Returns:
        dict: Rocket trajectory characteristics
        """
        # Gravitational acceleration
        g = const.g
        
        # Convert launch angle to radians
        theta = np.deg2rad(launch_angle)
        
        # Initial velocity components
        v0x = initial_velocity * np.cos(theta)
        v0y = initial_velocity * np.sin(theta)
        
        # Rocket mass calculation (including changing mass due to fuel consumption)
        def rocket_mass(t):
            """
            Calculate rocket mass over time
            Simplified linear fuel consumption model
            """
            total_mass = payload_mass + fuel_mass
            mass_flow_rate = fuel_mass / (total_mass / g)  # Approximate burn time
            return total_mass - mass_flow_rate * t
        
        # Time of flight calculation
        def time_of_flight():
            """
            Compute total flight time
            """
            # Quadratic formula for time
            return (2 * v0y) / g
        
        # Trajectory calculation
        def trajectory_points(dt=0.1):
            """
            Compute trajectory points
            """
            t_total = time_of_flight()
            t = np.arange(0, t_total, dt)
            
            # Trajectory calculations
            x = v0x * t
            y = initial_height + v0y * t - 0.5 * g * t**2
            
            return {
                'time': t,
                'x_position': x,
                'y_position': y,
                'masses': [rocket_mass(ti) for ti in t]
            }
        
        return {
            'initial_conditions': {
                'initial_velocity': initial_velocity,
                'launch_angle': launch_angle,
                'initial_height': initial_height,
                'payload_mass': payload_mass,
                'fuel_mass': fuel_mass
            },
            'trajectory': trajectory_points(),
            'total_flight_time': time_of_flight()
        }
    
    @staticmethod
    def earth_galactic_rotation():
        """
        Analyze Earth's motion relative to Milky Way center
        
        Returns:
        dict: Galactic rotation characteristics
        """
        # Galactic parameters
        galactic_center_distance = 26000  # Light-years
        galactic_rotation_period = 225e6  # years
        
        # Solar system characteristics
        def solar_system_motion():
            """
            Compute solar system motion parameters
            """
            # Orbital velocity calculation
            orbital_velocity = (
                2 * np.pi * galactic_center_distance * const.parsec / 
                (galactic_rotation_period * const.year)
            )
            
            # Precession and wobble
            precession_period = 26000  # years
            axial_tilt = 23.5  # degrees
            
            return {
                'orbital_velocity': orbital_velocity,
                'precession_period': precession_period,
                'axial_tilt': axial_tilt
            }
        
        # Galactic coordinate calculation
        def galactic_coordinates():
            """
            Compute Earth's position in galactic coordinate system
            """
            # Simplified galactic coordinate generation
            galactic_longitude = np.random.uniform(0, 360)
            galactic_latitude = np.random.uniform(-90, 90)
            
            return {
                'galactic_longitude': galactic_longitude,
                'galactic_latitude': galactic_latitude
            }
        
        # Complex motion calculation
        def complex_galactic_motion():
            """
            Simulate complex galactic motion
            """
            # Multiple motion components
            motions = {
                'galactic_rotation': solar_system_motion()['orbital_velocity'],
                'local_group_motion': 600e3,  # m/s, relative to cosmic microwave background
                'solar_system_peculiar_motion': 20e3  # m/s
            }
            
            return motions
        
        return {
            'galactic_center_distance': galactic_center_distance,
            'rotation_period': galactic_rotation_period,
            'solar_system_motion': solar_system_motion(),
            'galactic_coordinates': galactic_coordinates(),
            'complex_motion': complex_galactic_motion()
        }
    
    def visualize_cosmic_motion(self):
        """
        Visualize rocket trajectory and Earth's galactic motion
        """
        plt.figure(figsize=(15, 6))
        
        # Rocket Trajectory
        plt.subplot(121)
        rocket_results = self.rocket_trajectory_calculation()
        plt.plot(
            rocket_results['trajectory']['x_position'],
            rocket_results['trajectory']['y_position']
        )
        plt.title('Rocket Trajectory')
        plt.xlabel('Horizontal Distance (m)')
        plt.ylabel('Vertical Distance (m)')
        
        # Earth Galactic Motion
        plt.subplot(122)
        galactic_results = self.earth_galactic_rotation()
        
        # Visualize multiple motion components
        motion_components = galactic_results['complex_motion']
        plt.bar(
            motion_components.keys(), 
            [v/1000 for v in motion_components.values()]
        )
        plt.title('Earth Galactic Motion Components')
        plt.xlabel('Motion Type')
        plt.ylabel('Velocity (km/s)')
        plt.xticks(rotation=45)
        
        plt.tight_layout()
        plt.show()

def main():
    # Create cosmic motion analysis instance
    cosmic_analysis = CosmicMotionAnalysis()
    
    # Rocket Trajectory Analysis
    print("Rocket Trajectory Analysis:")
    rocket_results = cosmic_analysis.rocket_trajectory_calculation()
    print(f"Total Flight Time: {rocket_results['total_flight_time']:.2f} seconds")
    
    # Earth Galactic Rotation Analysis
    print("\nEarth Galactic Rotation Analysis:")
    galactic_results = cosmic_analysis.earth_galactic_rotation()
    print(f"Galactic Center Distance: {galactic_results['galactic_center_distance']} light-years")
    print("\nSolar System Motion:")
    for key, value in galactic_results['solar_system_motion'].items():
        print(f"{key}: {value}")
    
    # Visualize cosmic motion
    cosmic_analysis.visualize_cosmic_motion()

if __name__ == "__main__":
    main()
