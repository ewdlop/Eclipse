from typing import Protocol, TypeVar, List, Dict
from abc import ABC, abstractmethod

# Type variables
T = TypeVar('T')
AnyonType = TypeVar('AnyonType', str, int)
Position = tuple[int, int]

class ToricInterface(Protocol):
   """Interface for toric code systems"""
   def create_anyon_pair(self, type: AnyonType, pos1: Position, pos2: Position) -> None:
       """Create anyon pair at given positions"""
       ...
       
   def braiding_phase(self, path1: List[Position], path2: List[Position]) -> complex:
       """Calculate braiding phase between paths"""
       ...
   
   def measure_wilson_loop(self, path: List[Position]) -> int:
       """Measure Wilson loop operator"""
       ...

class FusionInterface(Protocol[T]):
   """Interface for fusion rules"""
   def fusion_channels(self, a: T, b: T) -> List[T]:
       """Get allowed fusion channels"""
       ...
       
   def fusion_rules(self) -> Dict[tuple[T,T], T]:
       """Get complete fusion rule table"""
       ...

class TopologicalInterface(Protocol):
   """Interface for topological properties"""
   def modular_matrices(self) -> tuple[np.ndarray, np.ndarray]:
       """Get S and T modular matrices"""
       ...
       
   def calculate_invariants(self) -> Dict[str, float]:
       """Calculate topological invariants"""
       ...
