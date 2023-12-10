// Grid.js
import React from 'react';
import Node from './Node/Node'; // Import the Node component

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
