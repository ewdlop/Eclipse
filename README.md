# Eclipse

日月神教

```python
class RetardedPotential:
   def __init__(self):
       self.c = 299792458  # Speed of light
       
   def lienard_wiechert(self, r, v, a, t_ret):
       """Calculate Liénard-Wiechert potentials"""
       R = r - self.source_position(t_ret)
       R_mag = np.linalg.norm(R)
       n = R / R_mag
       beta = v / self.c
       gamma = 1 / np.sqrt(1 - np.dot(beta, beta))
       
       # Scalar and vector potentials
       phi = self.q / (4*np.pi*epsilon_0) * 1/(R_mag * gamma**2 * (1 - np.dot(n, beta)))
       A = self.q / (4*np.pi*epsilon_0*self.c) * beta / (R_mag * (1 - np.dot(n, beta)))
       
       return phi, A

   def radiation_fields(self, phi, A, r, t):
       """Get radiative E and B fields"""
       E = -grad(phi) - partial_t(A)
       B = curl(A)
       
       # Far-field radiation terms (1/r)
       E_rad = self.q/(4*np.pi*epsilon_0*self.c) * n.cross(n.cross(a))/(R_mag * (1 - np.dot(n, beta))**3)
       B_rad = n.cross(E_rad)/self.c
       
       return E_rad, B_rad
       
   def power_radiated(self, a, v):
       """Larmor formula for radiated power"""
       gamma = 1/np.sqrt(1 - v**2/self.c**2)
       P = 2*self.q**2*gamma**6/(3*self.c**3) * (
           a**2 - (v.cross(a))**2/self.c**2
       )
       return P

   def lienard_wiechert(self, r, t, source):
       """Calculate Liénard-Wiechert potentials and fields"""
       # Retarded time calculation
       t_ret = t - np.linalg.norm(r - source.position(t))/self.c
       
       # Get source properties at retarded time 
       pos = source.position(t_ret)
       vel = source.velocity(t_ret)
       acc = source.acceleration(t_ret)
       
       # Calculate potentials
       R = r - pos
       R_mag = np.linalg.norm(R)
       n = R/R_mag
       beta = vel/self.c
       gamma = 1/np.sqrt(1 - np.dot(beta,beta))
       
       # Fields
       self.E = (
           source.q/(4*np.pi*epsilon_0) * (
               n-beta/(gamma**2*(1-np.dot(n,beta))**3) * 
               (1 + 1/(self.c*R_mag)*(1-np.dot(n,beta)))
           )
       )
       
       self.B = n.cross(self.E)/self.c
       
       return self.E, self.B
       
   def radiated_power(self):
       """Total radiated power using Poynting vector"""
       S = np.cross(self.E, self.B)/mu_0
       return np.linalg.norm(S)


```
