import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Node from './Grid/Node/Node';
import Menu from './Dropdown/Menu';
import Grid from './Grid/Grid';
import './PathfindingVisualizer.css';
import {runSearchAlgorithm, getSolution} from './algorithms/runSearchAlgorithm';
import {getNewGridWithWallToggled, getInitialGrid, clearVisitedNodes, clearShortestPath, restoreNodeTraits,
  animateSearch} from './Grid/Grid';

// Importing icons from Material-UI library
import WeightIcon from '@mui/icons-material/FitnessCenter';
import WallIcon from '@mui/icons-material/Square';
import FinishIcon from '@mui/icons-material/SportsScore';
import StartIcon from '@mui/icons-material/TimeToLeave';

//Constants
export const START_NODE_ROW = 11;
export const START_NODE_COL = 15;
export const FINISH_NODE_ROW = 11;
export const FINISH_NODE_COL = 35;



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
  handleMouseDown = (row, col) => {
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col, this.state.placingWall);
    this.setState({ grid: newGrid, mouseIsPressed: true });
  };

  handleMouseEnter = (row, col) => {
    if (!this.state.mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col, this.state.placingWall);
    this.setState({ grid: newGrid });
  };

  handleMouseUp = () => {
    this.setState({ mouseIsPressed: false });
  };
  //Name: generateWeights
  //Purpose: To randomly place weights around the grid
  generateWeights = () => {
    this.resetBetweenRuns();
    const { grid } = this.state;
    const newGrid = grid.slice();
    let chance = 0.1;
    for (let row = 0; row < grid.length; row ++) {
      for (let col = 0; col < grid[row].length; col++) {
        if(Math.random() <= chance && !grid[row][col].isWall) 
        {
          grid[row][col].isWeight = true
        }
      }
    }
    this.setState({ grid: newGrid }, null);
  }
//Name: generateMaze
//Purpose: To create a random maze pattern.
generateMaze = () => {
  this.resetGrid();
  const { grid } = this.state;
  // Create a new grid based on the existing grid
  const newGrid = grid.slice();
  // Generate the maze
  this.createWalls(newGrid);
  // Update the state with the new grid
  this.setState({ grid: newGrid }, null);
};
//Name: createWalls
//Purpose: Helper function to handle wall logic during maze creation
createWalls = (grid) => {
  //Make every tile a wall
  for (let row = 0; row < grid.length; row ++) {
    for (let col = 0; col < grid[row].length; col++) {
      grid[row][col].isWall = true;
      grid[row][col].isWeight = false;
    }
  }
  //Make the center of every 3x3 sq not a wall
  let queue = [];
  for (let row = 1; row < grid.length; row += 2) {
    for (let col = 1; col < grid[row].length; col += 2) {
      grid[row][col].isWall = false;
      grid[row][col].isConnected = false;
      queue.push(grid[row][col]);
    }
  }
  //Connect every 3x3 sq
  this.randomPathCreator(grid, queue);
}
//Name: randomPathCreator
//Purpose: Helper function to connect every 3x3 box to form paths
randomPathCreator(grid, queue) {
  while (queue.length) {
    const curPath = queue.pop();
    // randomize directions N, E, S, W
    const directions = [1, 2, 3, 4].sort(() => Math.random() - 0.5);
    while (directions.length) {
      const direction = directions.pop();
      let newPath = null;
      switch (direction) {
        case 1: // North
          newPath = grid[curPath.row - 2]?.[curPath.col];
          break;
        case 2: // East
          newPath = grid[curPath.row]?.[curPath.col + 2];
          break;
        case 3: // South
          newPath = grid[curPath.row + 2]?.[curPath.col];
          break;
        case 4: // West
          newPath = grid[curPath.row]?.[curPath.col - 2];
          break;
      }
      //Remove the wall if appropriate
      if (newPath != null && !newPath.isConnected) {
        const wallToRemove =
          direction % 2 === 0
            ? grid[curPath.row][curPath.col + (direction === 2 ? 1 : -1)]
            : grid[curPath.row + (direction === 3 ? 1 : -1)][curPath.col];
        wallToRemove.isWall = false;
        newPath.isConnected = true;
        queue.push(newPath);
      }
    }
  }
}
  // Function to initiate the search algorithm and visualization
  visualize() {
    this.resetBetweenRuns();
    const {grid} = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = runSearchAlgorithm(grid, startNode, finishNode, searchMethod);
    const nodesInSolutionPath = getSolution(finishNode,grid);
    animateSearch(visitedNodesInOrder, nodesInSolutionPath);
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
      restoreNodeTraits(this.state.grid);
      clearVisitedNodes(this.state.grid);
      clearShortestPath(this.state.grid);
      this.forceUpdate();
  };

  render() {
    const {grid, mouseIsPressed} = this.state;

    return (
      <>
        <Menu visualize={this.visualize} 
              updateSearchMethod={this.updateSearchMethod} 
              searchMethod={searchMethod} 
              resetGrid={this.resetGrid}
              generateMaze = {this.generateMaze} 
              generateWeights = {this.generateWeights}></Menu>
        <div className = 'container' style={{ marginTop: '1px' }}>
                <div className = "box"><StartIcon class = "node-start node-header"></StartIcon>Start Node</div>
                <div className = "box"><FinishIcon class = "node-finish node-header"></FinishIcon>Target Node</div>
                <div className = "box"><WeightIcon class = "node-header"></WeightIcon>Weight Node</div>
                <div className = "box"><WallIcon class = "node-header"></WallIcon>Wall Node</div>
        </div>
        <div className = "container">
            <input type="radio" name="placing" id="Wall" checked={this.state.placingWall}onChange={this.handleRadioToggle}/>
              <label htmlFor="Wall" id = "wallButton">
                    <i aria-hidden="true"><WallIcon></WallIcon>Wall</i> 
              </label>
              <div></div>
              <input type="radio" name="placing" id="Weight" checked={!this.state.placingWall}onChange={this.handleRadioToggle}/>
              <label htmlFor="Weight" id = "weightButton">
              <i aria-hidden="true"><WeightIcon></WeightIcon>Weight</i>	
              </label> 
        </div>
        <Grid
          grid={grid}
          mouseIsPressed={mouseIsPressed}
          handleMouseDown={this.handleMouseDown}
          handleMouseEnter={this.handleMouseEnter}
        />
      </>
    );
  }
}
