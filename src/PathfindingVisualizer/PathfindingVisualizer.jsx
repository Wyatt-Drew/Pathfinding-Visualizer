import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Node from './Node/Node';
import Menu from './Dropdown/Menu';
import './PathfindingVisualizer.css';
import {runSearchAlgorithm, getSolution} from './algorithms/runSearchAlgorithm';

// Importing icons from Material-UI library
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import SquareIcon from '@mui/icons-material/Square';

//Constants
const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;

// Creating arrows
const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
svg.style.height = "100%";
svg.style.width = "100%";
const down = <KeyboardArrowDownIcon/>;
const up = <KeyboardArrowUpIcon/>;
const left = <KeyboardArrowLeftIcon/>;
const right = <KeyboardArrowRightIcon/>; 

//Global variables
var mouseIsPressed = false;
var searchMethod = 'Dijkstra';
export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      placingWall: true,
    };
    this.visualize = this.visualize.bind(this);
  }
  // Initialize the grid and add event listeners
  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({grid});
    document.addEventListener("mousedown", this.handleClick);
    document.addEventListener("mouseup", this.handleMouseUp);
  }
  // Functions to handle mouse events for placing walls or weights
  //Note: Even though it might seem like these two functions should be one.
  //This handleClick and handleMouseDown work together to ensure responsiveness.
  //handleClick() circumvents default browser behaviour which prevents events when
  //dragging divs.  handleMouseDown() ensures that even the div that you already entered
  //counts for placing a wall there.
  handleClick(event)
  {
    event.preventDefault();
    mouseIsPressed= true;
  }
  handleMouseDown(row, col) {
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col, this.state.placingWall);
    this.setState({grid: newGrid});
  }
  handleMouseEnter(row, col) {
    if (!mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col, this.state.placingWall);
    this.setState({grid: newGrid});
  }
  handleMouseUp(event) {
    event.preventDefault();
    mouseIsPressed= false;
  }
//Name: generateMaze
//Purpose: To create a preset maze pattern.
generateMaze = () => {
  this.resetGrid();
  const { grid } = this.state;
  // Create a new grid based on the existing grid
  const newGrid = grid.slice();
  // Generate the maze
  this.createWalls(newGrid);
  // Update the state with the new grid
  this.setState({ grid: newGrid }, () => {
    console.log("Maze generated");
  });
};

createWalls = (grid) => {
  //Make every tile a wall
  for (let row = 0; row < grid.length; row ++) {
    for (let col = 0; col < grid[row].length; col++) {
      grid[row][col].isWall = true;
      grid[row][col].isConnected = true;
    }
  }
  //Make the center of every 3x3 sq not a wall
  let queue = [];
  for (let row = 0; row < grid.length; row += 2) {
    for (let col = 1; col < grid[row].length; col += 2) {
      grid[row][col].isWall = false;
      grid[row][col].isConnected = false;
      queue.push(grid[row][col]);
    }
  }
  //Connect every 3x3 sq
  this.randomPathCreator(grid, queue);
}
randomPathCreator(grid, queue) {
  if (!queue.length) {
    return;
  }
  const curPath = queue.pop();
  // randomize directions N, E, S, W
  const directions = [1, 2, 3, 4].sort(() => Math.random() - 0.5);
  while (directions.length) {
    let direction = directions.pop();
    let newPath = null;
    switch (direction) {
      case 1: // North
        newPath = grid[curPath.row - 2]?.[curPath.col];
        if (newPath != null && !newPath.isConnected) {
          if (grid[newPath.row - 1]?.[newPath.col] != null) {
            grid[newPath.row - 1][newPath.col].isWall = false;
            newPath.isConnected = true;
          }
        }
        break;
      case 2: // East
        newPath = grid[curPath.row]?.[curPath.col + 2];
        if (newPath != null && !newPath.isConnected) {
          if (grid[newPath.row]?.[newPath.col + 1] != null) {
            grid[newPath.row][newPath.col + 1].isWall = false;
            newPath.isConnected = true;
          }
        }
        break;
      case 3: // South
        newPath = grid[curPath.row + 2]?.[curPath.col];
        if (newPath != null && !newPath.isConnected) {
          if (grid[newPath.row + 1]?.[newPath.col] != null) {
            grid[newPath.row + 1][newPath.col].isWall = false;
            newPath.isConnected = true;
          }
        }
        break;
      case 4: // West
        newPath = grid[curPath.row]?.[curPath.col - 2];
        if (newPath != null && !newPath.isConnected) {
          if (grid[newPath.row]?.[newPath.col - 1] != null) {
            grid[newPath.row][newPath.col - 1].isWall = false;
            newPath.isConnected = true;
          }
        }
        break;
    }
    this.randomPathCreator(grid, queue);
  }
}

  //Name: animateSearch
  //Purpose: This function displays the order that nodes were visited and the solution.
  animateSearch(visitedNodesInOrder, nodesInSolutionPath) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      // Iterate through visited nodes and animate them
      if (i === visitedNodesInOrder.length) {
        console.log(i);
        console.log("soln path length", nodesInSolutionPath.length);
        // If all visited nodes are processed, animate the solution
        setTimeout(() => {
          this.animateSolution(nodesInSolutionPath);
        }, 10 * i);
        return;
      }
      // Animate each visited node
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
      }, 10 * i);
    }
  }

  //Name: animateSolution
  //Purpose: Helper function that displays the solution that was found.
  animateSolution(nodesInSolutionPath) {
    for (let i = 0; i < nodesInSolutionPath.length; i++) {
      setTimeout(() => {
        const node = nodesInSolutionPath[i];
        const element = document.getElementById(`node-${node.row}-${node.col}`);
        if (element) {
          this.addSVG(element, node.direction);
          if (node.isFinish || node.isStart) {
            element.removeChild(svg); //Ensures the SVG is removed from all nodes at the end
          }
            element.className = 'node node-shortest-path';
        }
      }, 50 * i);
    }
  }
  //Purpose: To add SVG arrows indicating the direction of the solution path 
  //Note: There is only one SVG for arrows so only one arrow can exist.
  addSVG(element, direction)
  {
    switch (direction)
    {
      case 1:
        ReactDOM.render(up, svg);
        break;
      case 2:
        ReactDOM.render(right, svg);
        break;
      case 3:
        ReactDOM.render(down, svg);
        break;
      case 4:
        ReactDOM.render(left, svg);
        break;
    }
    // Add the SVG container to the document
    element.appendChild(svg);
  }
  // Function to initiate the search algorithm and visualization
  visualize() {
    this.resetBetweenRuns();
    const {grid} = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = runSearchAlgorithm(grid, startNode, finishNode, searchMethod);
    const nodesInSolutionPath = getSolution(finishNode,grid);
    this.animateSearch(visitedNodesInOrder, nodesInSolutionPath);
  }
  // Toggle function for changing between placing walls or weights
  handleRadioToggle = () => {
    this.setState({ placingWall: !this.state.placingWall });
  };
  // Function to update the search algorithm method
  updateSearchMethod = (method) => {
    searchMethod = method;
    this.forceUpdate();
  };
  // Function to completely reset the grid to its initial state.
  resetGrid = () => {
    const newGrid = getInitialGrid();
    this.setState({ grid: newGrid });
    this.resetBetweenRuns();
  };
  // Function to partially reset the grid between algorithm runs.
  // This does not include walls or weights
  resetBetweenRuns = () => {
      this.restoreNodeTraits();
      this.clearVisitedNodes();
      this.clearShortestPath();
      this.forceUpdate();
  };
  // Function to clear visited nodes
  clearVisitedNodes = () => {
    const visitedNodes = document.querySelectorAll('.node-visited');
    visitedNodes.forEach(node => {
      node.classList.remove('node-visited');
    });
  };
  // Function to clear the shortest path
  clearShortestPath = () => {
    const pathNodes = document.querySelectorAll('.node-shortest-path');
    pathNodes.forEach(node => {
      node.classList.remove('node-shortest-path');
    });
  };
  // Additive function to restore any traits that may have been removed or modified.
  restoreNodeTraits = () => {
    const { grid } = this.state;
    // Iterate over each row and column in the grid
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        const node = grid[row][col];
        node.isVisited = false;
        node.distance = Infinity;
        const element = document.getElementById(`node-${row}-${col}`);
        if (element) {
          // Check if the node is a start or finish node
          if (node.isStart) {
            node.distance = 0;
            element.className = 'node node-start';
          } else if (node.isFinish) {
            element.className = 'node node-finish';
          }
        }
      }
    }
  };
  render() {
    const {grid, mouseIsPressed} = this.state;

    return (
      <>
        <Menu visualize={this.visualize} 
              updateSearchMethod={this.updateSearchMethod} 
              searchMethod={searchMethod} 
              resetGrid={this.resetGrid}
              generateMaze = {this.generateMaze} ></Menu>
        <div className = 'container' style={{ marginTop: '1px' }}>
                <div className = "box"><Node isStart={true} row = {-1} col={-1}
                onMouseDown={() => {}}onMouseEnter={() => {}}></Node>Start Node</div>
                <div className = "box"><Node isFinish={true} row = {-1} col={-1}
                onMouseDown={() => {}}onMouseEnter={() => {}}></Node>Target Node</div>
                <div className = "box"><Node isWeight={true} row = {-1} col={-1}
                onMouseDown={() => {}}onMouseEnter={() => {}}></Node>Weight Node</div>
                <div className = "box"><Node isWall={true} row = {-1} col={-1}
                onMouseDown={() => {}}onMouseEnter={() => {}}></Node>Wall Node</div>
        </div>
        <div className = "container">
            <input type="radio" name="placing" id="Wall" checked={this.state.placingWall}onChange={this.handleRadioToggle}/>
              <label htmlFor="Wall" id = "wallButton">
                    <i aria-hidden="true"><SquareIcon></SquareIcon>Wall</i> 
              </label>
              <div></div>
              <input type="radio" name="placing" id="Weight" checked={!this.state.placingWall}onChange={this.handleRadioToggle}/>
              <label htmlFor="Weight" id = "weightButton">
              <i aria-hidden="true"><FitnessCenterIcon></FitnessCenterIcon>Weight</i>	
              </label> 
        </div>

        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const {row, col, isFinish, isStart, isWall, isWeight} = node;
                  return (
                  <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      isWeight={isWeight}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) => this.handleMouseEnter(row, col)}
                      row={row}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}
// Function to create the initial grid with nodes
const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 20; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};
// Helper function to create nodes during grid creation
const createNode = (col, row) => {
  const isStart = row === START_NODE_ROW && col === START_NODE_COL;
  const isFinish = row === FINISH_NODE_ROW && col === FINISH_NODE_COL;
  const isWeight = false; 
  return {
    col,
    row,
    isStart,
    isFinish,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    isWeight,
    previousNode: null,
  };
};
// Function to toggle between wall and weight nodes in the grid
const getNewGridWithWallToggled = (grid, row, col,placingWall) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: (!node.isWall  && placingWall),
    isWeight: (!node.isWeight && !placingWall),
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

