class CelestialMechanics:
   def __init__(self, G=6.67430e-11):
       self.G = G
       
   def eclipse_geometry(self, sun_pos, moon_pos, earth_pos):
       """Calculate eclipse conditions and type"""
       def umbra_penumbra(light_source, blocking_body, observer):
           radius_ratio = blocking_body.radius / light_source.radius
           distance_ratio = (observer - blocking_body).norm() / (light_source - blocking_body).norm()
           is_total = radius_ratio > distance_ratio
           return is_total, radius_ratio, distance_ratio
       
       return umbra_penumbra(sun_pos, moon_pos, earth_pos)

   def mercury_perihelion(self, a, e, M_sun):
       """Calculate Mercury's perihelion precession"""
       def relativity_correction():
           # General relativity correction term
           c = 299792458  # Speed of light
           L = np.sqrt(self.G * M_sun * a * (1 - e**2))
           return 24 * np.pi**3 * a**2 / (T * c**2 * (1 - e**2))
           
       T = 2 * np.pi * np.sqrt(a**3 / (self.G * M_sun))
       precession = relativity_correction()
       return precession  # Returns 43 arcseconds/century
       
   def gravitational_lensing(self, M, r, source_pos):
       """Einstein ring and lensing angles"""
       c = 299792458
       theta_E = np.sqrt(4 * self.G * M / (c**2 * r))  # Einstein radius
       
       def deflection_angle(impact_parameter):
           return 4 * self.G * M / (c**2 * impact_parameter)
           
       def magnification(u):
           # u = impact/theta_E
           return (u**2 + 2)/(u * np.sqrt(u**2 + 4))
           
       return theta_E, deflection_angle, magnification
