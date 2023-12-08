import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Node from './Node/Node';
import Menu from './Dropdown/Menu';
import './PathfindingVisualizer.css';
import {runSearchAlgorithm, getSolution} from '../algorithms/runSearchAlgorithm';
import { forceUpdate } from 'react';
//icons
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import SquareIcon from '@mui/icons-material/Square';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import TimeToLeaveIcon from '@mui/icons-material/TimeToLeave';
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

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({grid});
    document.addEventListener("mousedown", this.handleClick);
    document.addEventListener("mouseup", this.handleMouseUp);
  }
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

  //Name: animateSearch
  //Purpose: This function displays the order that nodes were visited.
  animateSearch(visitedNodesInOrder, nodesInSolutionPath) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateSolution(nodesInSolutionPath);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
      }, 10 * i);
    }
  }

  //Name: animateSolution
  //Purpose: This function displays the solution that was found.
  animateSolution(nodesInSolutionPath) {
    for (let i = 0; i < nodesInSolutionPath.length; i++) {
      setTimeout(() => {
        const node = nodesInSolutionPath[i];
        const element = document.getElementById(`node-${node.row}-${node.col}`);
        if (element) {
          if (node.isFinish || node.isStart) {
            element.innerHTML = "";
          } 
            element.className = 'node node-shortest-path';
            this.addSVG(element, node.direction);
        }
      }, 50 * i);
    }
  }

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

  visualize() {
    this.resetBetweenRuns();
    const {grid} = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = runSearchAlgorithm(grid, startNode, finishNode, searchMethod);
    const nodesInSolutionPath = getSolution(finishNode,grid);
    this.animateSearch(visitedNodesInOrder, nodesInSolutionPath);
  }
  handleRadioToggle = () => {
    this.setState({ placingWall: !this.state.placingWall });
  };

  updateSearchMethod = (method) => {
    searchMethod = method;
    this.forceUpdate();
  };


  resetBetweenRuns = () => {
    this.setState(prevState => ({
      grid: prevState.grid.map(row =>
        row.map(node => {
          const content = Node.getContent(node.isFinish, node.isStart, node.isWeight);
  
          return {
            ...node,
            isStart: node.isStart,
            isFinish: node.isFinish,
            isVisited: false,
            distance: Infinity,
            previousNode: null,
            isWall: node.isWall,
            content,
          };
        })
      ),
    }), () => {
      this.clearVisitedNodes();
      this.clearShortestPath();
      this.forceUpdate();
    });
  };

  resetGrid = () => {
    const newGrid = getInitialGrid();
    this.setState({ grid: newGrid });
    this.resetBetweenRuns();
  };

  
  clearVisitedNodes = () => {
    const visitedNodes = document.querySelectorAll('.node-visited');
    visitedNodes.forEach(node => {
      node.classList.remove('node-visited');
    });
  };
  clearShortestPath = () => {
    const pathNodes = document.querySelectorAll('.node-shortest-path');
    pathNodes.forEach(node => {
      node.classList.remove('node-shortest-path');
    });
  };
  render() {
    const {grid, mouseIsPressed} = this.state;

    return (
      <>
        <Menu visualize={this.visualize} 
              updateSearchMethod={this.updateSearchMethod} 
              searchMethod={searchMethod} 
              resetGrid={this.resetGrid} ></Menu>
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
                  const {row, col, isFinish, isStart, isWall, isWeight, content} = node;
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
                      content={content} 
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

const createNode = (col, row) => {
  const isStart = row === START_NODE_ROW && col === START_NODE_COL;
  const isFinish = row === FINISH_NODE_ROW && col === FINISH_NODE_COL;
  const isWeight = false; 
  const content = Node.getContent(isFinish, isStart, isWeight);
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
    content,
  };
};

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

