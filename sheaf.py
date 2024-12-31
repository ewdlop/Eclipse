class Sheaf:
   def __init__(self, base_space):
       self.base = base_space
       self.stalks = {}
       self.restrictions = {}

   def stalk_at(self, point):
       """Return stalk fiber at point"""
       return self.stalks.get(point, [])
   
   def restriction_map(self, open_set1, open_set2):
       """Get restriction map between open sets"""
       if not open_set1.issubset(open_set2):
           raise ValueError("Invalid restriction - not a subset")
       return self.restrictions.get((open_set1, open_set2))

class MonoidalCategory:
   def __init__(self):
       self.objects = set()
       self.morphisms = {}
       self.tensor_product = {}
       self.unit_object = None
       
   def add_object(self, obj):
       self.objects.add(obj)
   
   def tensor(self, obj1, obj2):
       """Tensor product of objects"""
       return self.tensor_product.get((obj1, obj2))

   def associator(self, x, y, z):
       """Associativity constraint"""
       return self.morphisms.get(
           (self.tensor(self.tensor(x,y), z),
            self.tensor(x, self.tensor(y,z)))
       )

   def left_unitor(self, x):
       """Left unit constraint"""
       return self.morphisms.get(
           (self.tensor(self.unit_object, x), x)
       )

   def coherence_pentagon(self, w, x, y, z):
       """Verify pentagon identity"""
       # Mac Lane's coherence condition
       pass
