//Name: runSearchAlgorithm
//Purpose: returns *all* nodes in the order in which they were visited. 
//Also makes nodes point back to their previous node, effectively allowing 
//us to compute the shortest path by backtracking from the finish node.
export function runSearchAlgorithm(grid, startNode, finishNode, method) {
  const visitedNodesInOrder = [];
  const unvisitedNodes = getAllNodes(grid);
  startNode.distance = 0;
    switch (method){
      case 'Dijkstra'://weighted
        return dijkstraSearch(grid, startNode, finishNode, visitedNodesInOrder, unvisitedNodes);
      case 'DFS'://Unweighted
        //Depth first search priority: up, right, down, left
        depthFirstSearch(startNode, finishNode, grid, visitedNodesInOrder);
        return visitedNodesInOrder;
      case 'BFS'://unweighted
        breathFirstSearch(startNode, finishNode, grid, visitedNodesInOrder);
        return visitedNodesInOrder;
      case 'A* Search'://Weighted
        return aStar(startNode, finishNode, grid, visitedNodesInOrder);
      default:
        console.error('Invalid search method');
        return [];
    }
  }
//Name: aStar
//Purpose: Performs the A* search algorithm on a grid to find the shortest path between start and finish nodes.
  function aStar(startNode, finishNode, grid, visitedNodesInOrder) {
    const openSet = [startNode];
    const closedSet = [];
  
    while (!!openSet.length) {
      sortNodesByAStarDistance(openSet, finishNode);
      const currentNode = openSet.shift();
  
      if (currentNode.isVisited) continue;
  
      currentNode.isVisited = true;
      visitedNodesInOrder.push(currentNode);
  
      if (currentNode === finishNode) return visitedNodesInOrder;
  
      closedSet.push(currentNode);
  
      const neighbors = getUnvisitedNeighbors(currentNode, grid);
      for (const neighbor of neighbors) {
        if (closedSet.includes(neighbor)) continue;
  
        const tentativeGScore = currentNode.distance + 1 + neighbor.isWeight;
        if (!openSet.includes(neighbor) || tentativeGScore < neighbor.distance) {
          neighbor.previousNode = currentNode;
          neighbor.distance = tentativeGScore;
          if (!openSet.includes(neighbor)) openSet.push(neighbor);
        }
      }
    }
  
    return visitedNodesInOrder;
  }
  
  // A* helper function to sort nodes by A* distance (f = g + h).
  function sortNodesByAStarDistance(openSet, finishNode) {
    openSet.sort(
      (nodeA, nodeB) =>
        (nodeA.distance + nodeA.isWeight + heuristic(nodeA, finishNode)) -
        (nodeB.distance + nodeB.isWeight + heuristic(nodeB, finishNode))
    );
  }
  
  // A* helper function to calculate the heuristic (Manhattan distance) between two nodes.
  function heuristic(nodeA, nodeB) {
    return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
  }
  
//Name: breathFirstSearch
//Purpose: Performs the breadth-first search algorithm on a grid to find the shortest path between start and finish nodes.
  function breathFirstSearch(startNode, finishNode, grid, visitedNodesInOrder) {
    const queue = [];
    queue.push(startNode);
    while (queue.length > 0) {
      const currentNode = queue.shift();
      if (currentNode.isVisited) continue;
      currentNode.isVisited = true;
      visitedNodesInOrder.push(currentNode);
      if (currentNode === finishNode) return visitedNodesInOrder;
      const neighbors = getUnvisitedNeighbors(currentNode, grid);
      for (const neighbor of neighbors) {
        neighbor.previousNode = currentNode;
        queue.push(neighbor);
      }
    }
    return visitedNodesInOrder;
  }

//Name: dijkstraSearch
//Purpose: Performs Dijkstra's algorithm on a grid to find the shortest path between start and finish nodes.
//Note: Normally Dijkstra's algorithm would be implemented with something like a minheap 
//for efficiency.  Here I have implemented it with an array which I sort each time because
//we have a relatively small number of nodes.
function dijkstraSearch(grid, startNode, finishNode, visitedNodesInOrder, unvisitedNodes) {
  while (!!unvisitedNodes.length) {
    sortNodesByDistance(unvisitedNodes);
    const closestNode = unvisitedNodes.shift();
    // If we encounter a wall, we skip it.
    if (closestNode.isWall) continue;
    // If the closest node is at a distance of infinity, we must be trapped and should therefore stop.
    if (closestNode.distance === Infinity) return visitedNodesInOrder;
    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);
    if (closestNode === finishNode) return visitedNodesInOrder;
    updateUnvisitedNeighbors(closestNode, grid);
  }
}
//Name: depthFirstSearch
//Purpose: Performs the depth-first search algorithm on a grid to find the shortest path between start and finish nodes.
function depthFirstSearch(node, finishNode, grid, visitedNodesInOrder) {
  node.isVisited = true;
  visitedNodesInOrder.push(node);
  if (node === finishNode) {
    return true;
  }
  const neighbors = getUnvisitedNeighbors(node, grid);
  for (const neighbor of neighbors) {
    neighbor.previousNode = node;
    if (!neighbor.isVisited) {
      if (depthFirstSearch(neighbor, finishNode, grid, visitedNodesInOrder)) {
        return true;
      }
    }
  }
  return false;
}

// Helper function to sort nodes by distance.
function sortNodesByDistance(unvisitedNodes) {
  unvisitedNodes.sort((nodeA, nodeB) => (nodeA.distance + nodeA.isWeight) - (nodeB.distance + nodeB.isWeight));
}
// Helper function to update unvisited neighbors' distances.
function updateUnvisitedNeighbors(node, grid) {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
  for (const neighbor of unvisitedNeighbors) {
    neighbor.distance = node.distance + 1 + neighbor.isWeight;
    neighbor.previousNode = node;
  }
}
// Helper function to get unvisited neighbors of a node.
function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const {col, row} = node;
  // If we encounter a wall, we skip it.
  if (row > 0 && !grid[row - 1][col].isWall) neighbors.push(grid[row - 1][col]); //up
  if (col < grid[0].length - 1 && !grid[row][col + 1].isWall) neighbors.push(grid[row][col + 1]); //right
  if (row < grid.length - 1 && !grid[row + 1][col].isWall) neighbors.push(grid[row + 1][col]); //down
  if (col > 0 && !grid[row][col - 1].isWall) neighbors.push(grid[row][col - 1]); //left
  return neighbors.filter(neighbor => !neighbor.isVisited);
}
// Helper function to get all nodes in the grid.
function getAllNodes(grid) {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
}

//Name: getSolution
//Purpose: Backtracks from the finishNode to find the shortest path.
//Note: Only works when called *after* the search method above has found the finish node.
export function getSolution(finishNode, grid) {
  const nodesInSolutionPath = [];
  let currentNode = finishNode;
  if (currentNode.previousNode == null) {return [];} 
  let north = 1;
  let east = 2;
  let south = 3;
  let west = 4;
  while (currentNode !== null) {
    if (currentNode.previousNode !== null)
    {
      //Record which direction it is moving
      if (currentNode.row < currentNode.previousNode.row) currentNode.direction = north;
      if (currentNode.row > currentNode.previousNode.row) currentNode.direction = south;
      if (currentNode.col < currentNode.previousNode.col) currentNode.direction = west;
      if (currentNode.col > currentNode.previousNode.col) currentNode.direction = east;
    }
    //Shift to the next node.
    nodesInSolutionPath.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInSolutionPath;
}
