def analyze_cousins(family_tree):
   """Find cousin relationships in family tree"""
   cousins = {}
   angles = {}
   
   for person1 in family_tree:
       for person2 in family_tree:
           # Skip if same person or siblings
           if person1 == person2 or are_siblings(person1, person2):
               continue
               
           degree = cousin_degree(person1, person2)
           if degree:
               cousins[(person1, person2)] = degree
               # Calculate viewing angle
               angles[(person1, person2)] = relative_angle(
                   family_tree[person1]['position'], 
                   family_tree[person2]['position']
               )
   
   return {
       'relationships': cousins,
       'mutual_views': [pair for pair, angle in angles.items() 
                       if is_mutual_view(angle)]
   }

def is_mutual_view(angle):
   """Check if angle allows mutual viewing"""
   return -45 <= angle <= 45  # Direct line of sight

def relative_angle(pos1, pos2):
   """Calculate relative viewing angle between positions"""
   dx = pos2[0] - pos1[0]
   dy = pos2[1] - pos1[1]
   return math.degrees(math.atan2(dy, dx))

def cousin_degree(person1, person2):
   """Calculate cousin degree (1st, 2nd etc)"""
   common_ancestor = find_common_ancestor(person1, person2)
   if not common_ancestor:
       return None
   return min(
       ancestor_distance(person1, common_ancestor),
       ancestor_distance(person2, common_ancestor)
   ) - 1
