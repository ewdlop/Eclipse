class TreeOfLife:
   def __init__(self):
       self.taxonomy = {
           'domain': ['Bacteria', 'Archaea', 'Eukarya'],
           'kingdom': ['Animalia', 'Plantae', 'Fungi', 'Protista', 'Monera'],
           'phylum': {},
           'class': {},
           'order': {},
           'family': {},
           'genus': {},
           'species': {}
       }
       self.phylogenetic_tree = nx.DiGraph()
       
   def add_organism(self, name, taxonomy, traits, genetic_data):
       """Add organism with taxonomic/genetic info"""
       node = {
           'taxonomy': taxonomy,
           'traits': traits,
           'genetic': genetic_data,
           'evolutionary_distance': self._calc_distance(genetic_data)
       }
       self.phylogenetic_tree.add_node(name, **node)
       
   def find_common_ancestor(self, org1, org2):
       """Find most recent common ancestor"""
       path1 = nx.shortest_path(self.phylogenetic_tree, 'root', org1)
       path2 = nx.shortest_path(self.phylogenetic_tree, 'root', org2)
       for node in reversed(path1):
           if node in path2:
               return node
               
   def calculate_divergence(self, org1, org2):
       """Calculate evolutionary divergence time"""
       ancestor = self.find_common_ancestor(org1, org2)
       if ancestor:
           t1 = self._molecular_clock(org1, ancestor)
           t2 = self._molecular_clock(org2, ancestor) 
           return max(t1, t2)
       return None

   def _molecular_clock(self, org1, org2):
       """Estimate divergence using molecular clock"""
       mutations = self._compare_sequences(
           self.phylogenetic_tree.nodes[org1]['genetic'],
           self.phylogenetic_tree.nodes[org2]['genetic']
       )
       return mutations * MUTATION_RATE # Years

  def check_loop_free(graph):
    def dfs(node, visited, path_set):
       visited.add(node)
       path_set.add(node)
       
       for neighbor in graph[node]:
           if neighbor not in visited:
               if dfs(neighbor, visited, path_set):
                   return True
           elif neighbor in path_set:
               return True
               
       path_set.remove(node)
         return False
  
   visited = set()
   path_set = set()
   
   for node in graph:
       if node not in visited:
           if dfs(node, visited, path_set):
               return False # Has loop
               
   return True # No loops

  def is_loop_free(graph):
    # Kahn's algorithm
    in_degree = {node: 0 for node in graph}
    for node in graph:
        for neighbor in graph[node]:
            in_degree[neighbor] += 1
            
    queue = [node for node, deg in in_degree.items() if deg == 0]
    count = 0
    
    while queue:
        node = queue.pop(0)
        count += 1
        
        for neighbor in graph[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
                
    return count == len(graph)

def check_tree_properties(tree):
   """Verify tree properties: connected, acyclic, N-1 edges"""
   
   def is_connected(tree):
       visited = set()
       def dfs(node):
           visited.add(node)
           for neighbor in tree[node]:
               if neighbor not in visited:
                   dfs(neighbor)
       
       start = next(iter(tree))
       dfs(start)
       return len(visited) == len(tree)

   def count_edges(tree):
       return sum(len(neighbors) for neighbors in tree.values()) // 2

   def is_acyclic(tree):
       visited = set()
       def dfs(node, parent):
           visited.add(node)
           for neighbor in tree[node]:
               if neighbor != parent:
                   if neighbor in visited:
                       return False
                   if not dfs(neighbor, node):
                       return False
           return True
       
       return dfs(next(iter(tree)), None)

   n = len(tree)
   return {
       'is_connected': is_connected(tree),
       'correct_edges': count_edges(tree) == n-1,
       'is_acyclic': is_acyclic(tree),
       'is_tree': is_connected(tree) and count_edges(tree) == n-1 and is_acyclic(tree)
   }
