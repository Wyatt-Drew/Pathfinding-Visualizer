Pathfinding Visualizer

This pathfinding visualizer is a React application designed to showcase how various pathfinding algorithms work. It allows users to interactively visualize the process of finding the shortest path between a start node and a target node on a grid.

Deployment
The application is deployed and accessible at https://wyatt-drew.github.io/Pathfinding-Visualizer/.

Usage
Once the application is loaded, you can interact with the grid and choose different pathfinding algorithms from the menu. Click the "Visualize" button to see the algorithm in action. Experiment with placing nodes and observe how the algorithms find the optimal path.

Features
- Interactive Grid: Users can place a start node, a target node, walls, and weight nodes on the grid.
- Multiple Algorithms: The visualizer supports various pathfinding algorithms, including Dijkstra's, Depth-First Search (DFS), Breadth-First Search (BFS), and A* Search.
- Real-Time Visualization: The algorithm's progress is visualized in real-time, showing the order in which nodes are visited and the final solution path.
- Node Types: Different node types are represented by icons, including start node, target node, wall node, and weight node.

Algorithms
The application supports the following pathfinding algorithms:

- Dijkstra's Algorithm: Finds the shortest path in a weighted graph.
- Depth-First Search (DFS): An unweighted algorithm that explores as far as possible along each branch before backtracking.
- Breadth-First Search (BFS): An unweighted algorithm that explores all the vertices at the same level before moving on to the next level.
- A* Search: A weighted algorithm that uses a combination of the cost to reach the node and a heuristic to estimate the remaining cost.