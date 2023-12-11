// Grid.js
import React from 'react';
import Node from './Node/Node'; // Import the Node component
import {START_NODE_ROW, START_NODE_COL, FINISH_NODE_ROW, FINISH_NODE_COL} from '../PathfindingVisualizer';
// Name: getInitialGrid
// Purpose: Create the initial grid with nodes
export const getInitialGrid = () => {
    const grid = [];
    for (let row = 0; row < 23; row++) {
      const currentRow = [];
      for (let col = 0; col < 51; col++) {
        currentRow.push(createNode(col, row));
      }
      grid.push(currentRow);
    }
    return grid;
  };
  //Name: createNode
  //Purpose: Helper function to create nodes during grid creation
export const createNode = (col, row) => {
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
  // Name: getNewGridWithWallToggled
  // Purpose: Toggle between wall and weight nodes in the grid
export const getNewGridWithWallToggled = (grid, row, col,placingWall) => {
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
  
// Function to clear visited nodes
export const clearVisitedNodes = (grid) => {
  const visitedNodes = document.querySelectorAll('.node-visited');
  visitedNodes.forEach(node => {
    node.classList.remove('node-visited');
  });
};
// Function to clear the shortest path
export const clearShortestPath = (grid) => {
  const pathNodes = document.querySelectorAll('.node-shortest-path');
  pathNodes.forEach(node => {
    node.classList.remove('node-shortest-path');
  });
};
// Name: restoreNodeTraits
// Purpose: Additive function to restore any traits that may have been removed or modified.
export const restoreNodeTraits = (grid) => {
  // Iterate over each row and column in the grid
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const node = grid[row][col];
      node.isVisited = false;
      node.distance = Infinity;
      node.previousNode = null;
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


const Grid = ({ grid, mouseIsPressed, handleMouseDown, handleMouseEnter }) => {
  return (
    <div className="grid">
      {grid.map((row, rowIdx) => (
        <div key={rowIdx}>
          {row.map((node, nodeIdx) => (
            <Node
              key={nodeIdx}
              col={node.col}
              isFinish={node.isFinish}
              isStart={node.isStart}
              isWall={node.isWall}
              isWeight={node.isWeight}
              mouseIsPressed={mouseIsPressed}
              onMouseDown={() => handleMouseDown(node.row, node.col)}
              onMouseEnter={() => handleMouseEnter(node.row, node.col)}
              row={node.row}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Grid;
