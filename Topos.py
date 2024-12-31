class Topos:
   def __init__(self):
       self.objects = {}
       self.arrows = {}
       self.subobject_classifier = None
       
   def object(self, name: str, elements=None):
       """Add object in topos with subobjects"""
       self.objects[name] = {
           'elements': elements or set(),
           'subobjects': set()
       }
       
   def arrow(self, source: str, target: str, mapping: dict):
       """Add morphism between objects"""
       self.arrows[(source, target)] = mapping
       
   def pullback(self, f, g):
       """Compute pullback of arrows f,g"""
       src_f, tgt_f = f
       src_g, tgt_g = g
       if tgt_f != tgt_g:
           raise ValueError("Arrows must share codomain")
           
       elements = {
           (x,y) for x in self.objects[src_f]['elements']
                 for y in self.objects[src_g]['elements']
                 if self.arrows[f][x] == self.arrows[g][y]
       }
       return elements
       
   def exponential(self, A: str, B: str):
       """Compute exponential object B^A"""
       arrows = []
       for f in self.arrows:
           if f[0] == A and f[1] == B:
               arrows.append(f)
       return arrows
       
   def subobject_classifier(self):
       """Get subobject classifier Ω"""
       if not self.subobject_classifier:
           self.subobject_classifier = {True, False}
       return self.subobject_classifier
