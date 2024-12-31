class ConstrainedSystem:
   def __init__(self):
       self.coordinates = None
       self.velocities = None
       
   def holonomic_constraint(self, q, t):
       """f(q,t) = 0: Position/time dependent"""
       constraints = {
           'pendulum': lambda q: q[0]**2 + q[1]**2 - L**2,
           'rolling': lambda q: q[1] - r*q[0]
       }
       return constraints
       
   def nonholonomic_constraint(self, q, dq):
       """f(q,dq,t) = 0: Velocity dependent"""
       constraints = {
           'knife_edge': lambda q,dq: dq[1]*np.cos(q[0]) - dq[0]*np.sin(q[0]),
           'rolling_disk': lambda q,dq: dq[0] + r*np.cos(q[2])*dq[3]
       }
       return constraints
       
   def pfaffian_form(self, q, dq):
       """A(q)dq = 0: Matrix form"""
       def rolling_constraint():
           A = np.array([[1, 0, r*np.cos(q[2])]])
           return A
           
       def knife_edge():
           A = np.array([[np.sin(q[0]), -np.cos(q[0])]])
           return A
           
       return rolling_constraint(), knife_edge()

   def euler_lagrange(self, L, constraints):
       """Modified E-L with constraints"""
       def modified_action(q, dq, lambda_):
           return L(q, dq) + sum(l*c for l,c in zip(lambda_, constraints))
           
       # Solve constrained equations of motion
       equations = self.variational_principle(modified_action)
       return equations

