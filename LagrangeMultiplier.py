class LagrangeMultiplier:
   def __init__(self):
       self.lambda_params = []
   
   def constrained_lagrangian(self, L, constraints):
       """L_c = L + Σλᵢφᵢ"""
       def L_constrained(q, dq, lambda_):
           return L(q, dq) + sum(l*c(q,dq) for l,c in zip(lambda_, constraints))
       return L_constrained
       
   def vary_action(self, L_c, q, dq, lambda_):
       """δS = ∫(∂L_c/∂q - d/dt(∂L_c/∂q̇))dt = 0"""
       def equations(q, dq, lambda_):
           dL_dq = grad(L_c, 0)(q, dq, lambda_)
           dL_ddq = grad(L_c, 1)(q, dq, lambda_)
           return dL_dq - d_dt(dL_ddq)
       return equations
   
   def solve_constrained(self, eqns, constraints):
       """Solve EL equations with constraints"""
       # Augmented system [q; λ]
       def augmented_system(state):
           q = state[:self.n]
           lambda_ = state[self.n:]
           return np.concatenate([
               eqns(q, lambda_),
               constraints(q)
           ])
       return solve_ivp(augmented_system, t_span, y0)
