from typing import TypeVar, Generic, Callable
T = TypeVar('T')
U = TypeVar('U') 

class Monad(Generic[T]):
   def __init__(self, value: T):
       self.value = value
       
   @staticmethod
   def unit(value: T) -> 'Monad[T]':
       return Monad(value)
       
   def bind(self, f: Callable[[T], 'Monad[U]']) -> 'Monad[U]':
       return f(self.value)

from dataclasses import dataclass

class NCategoryMorphism:
   def __init__(self, source: str, target: str, n: int):
       self.source = source 
       self.target = target
       self.n = n # Category level

   def compose(self, other: 'NCategoryMorphism') -> 'NCategoryMorphism':
       if self.target != other.source:
           raise ValueError("Morphisms not composable")
       return NCategoryMorphism(self.source, other.target, min(self.n, other.n))
       
   def identity(obj: str, n: int) -> 'NCategoryMorphism':
       return NCategoryMorphism(obj, obj, n)

@dataclass  
class HigherCategory:
   # For n-categories
   objects: list[str]
   morphisms: list[NCategoryMorphism]
   dimension: int
   
   def compose_n_morphisms(self, f: NCategoryMorphism, g: NCategoryMorphism) -> NCategoryMorphism:
       """Vertical composition of n-morphisms"""
       if f.n != g.n or f.target != g.source:
           raise ValueError("Invalid composition")
       return f.compose(g)
