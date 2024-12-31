class TreeOfLife:
   def __init__(self):
       self.root = Node("LUCA")  # Last Universal Common Ancestor
       self.all_species = {}
       
   def verify_tree(self):
       """Verify biological tree properties"""
       def check_node(node, ancestors=None):
           if ancestors is None:
               ancestors = set()
           
           # Check taxonomy consistency
           if not self._verify_taxonomy(node):
               return False
               
           # No horizontal gene transfer cycles
           if node in ancestors:
               return False
               
           # Single parent rule (except HGT)
           if len(node.parents) > 1 and not node.horizontal_transfer:
               return False
               
           ancestors.add(node)
           for child in node.children:
               if not check_node(child, ancestors.copy()):
                   return False
           return True
           
       def _verify_taxonomy(node):
           if node.parent:
               # Child must be more specific than parent
               return self._is_valid_descendant(node.taxonomy, 
                                             node.parent.taxonomy)
           return True
           
       def _verify_evolutionary_order(node):
           """Check temporal ordering of speciation"""
           if node.parent:
               return node.time >= node.parent.time
           return True
           
       return check_node(self.root)

   def check_monophyletic(self, taxon):
       """Verify if taxon forms monophyletic group"""
       def find_mrca(species_list):
           # Find Most Recent Common Ancestor
           ancestors = [self.get_ancestors(s) for s in species_list]
           common = set.intersection(*map(set, ancestors))
           return min(common, key=lambda x: x.time)
           
       species = self.get_species_in_taxon(taxon)
       mrca = find_mrca(species)
       
       # All descendants must be in taxon
       descendants = self.get_descendants(mrca)
       return all(d in species for d in descendants)
