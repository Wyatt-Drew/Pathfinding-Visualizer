import React, { useState, useEffect } from 'react';
class MazeGenerator {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.maze = Array.from(Array(height), () => Array(width).fill(0));
    }
  
    generateMaze(startX, startY, goalX, goalY) {
      this.divide(0, 0, this.width - 1, this.height - 1, startX, startY, goalX, goalY);
      return this.getMazeWalls();
    }
  
    divide(x, y, width, height, startX, startY, goalX, goalY) {
      if (width < 2 || height < 2) {
        return;
      }
  
      // Divide horizontally or vertically
      const horizontal = Math.random() < 0.5;
  
      // Create a passage along the division
      const passageX = horizontal ? Math.floor(this.getRandom(x, x + width)) : Math.floor(x + width / 2);
      const passageY = horizontal ? Math.floor(y + height / 2) : Math.floor(this.getRandom(y, y + height));
  
      // Create walls
      for (let i = x; i <= x + width; i++) {
        for (let j = y; j <= y + height; j++) {
          if ((horizontal && j !== passageY) || (!horizontal && i !== passageX)) {
            this.maze[j][i] = 1;
          }
        }
      }
  
      // Recursively divide the resulting chambers
      this.divide(x, y, horizontal ? width : passageX - x, horizontal ? passageY - y : height, startX, startY, goalX, goalY);
      this.divide(horizontal ? x : passageX + 1, horizontal ? passageY + 1 : y, horizontal ? width : x + width - passageX - 1, horizontal ? height : passageY - y, startX, startY, goalX, goalY);
    }
  
    getRandom(min, max) {
      return min + Math.random() * (max - min);
    }
  
    getMazeWalls() {
      const xWalls = [];
      const yWalls = [];
  
      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          if (this.maze[y][x] === 1) {
            xWalls.push(x);
            yWalls.push(y);
          }
        }
      }
  
      return [xWalls, yWalls];
    }
  }
  
  import React, { useState, useEffect } from 'react';

  // Your existing React component structure
  const MazeComponent = () => {
    // State to store maze walls
    const [xWalls, setXWalls] = useState([]);
    const [yWalls, setYWalls] = useState([]);
  
    // Effect to generate maze walls when the component mounts
    useEffect(() => {
      const mazeGenerator = new MazeGenerator(50, 20);
      const [newXWalls, newYWalls] = mazeGenerator.generateMaze(16, 11, 21, 11);
      
      // Update state with new maze walls
      setXWalls(newXWalls);
      setYWalls(newYWalls);
    }, []);
  
    // Render the maze using the generated walls
    return (
      <div>
        <h1>Maze Component</h1>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(50, 20px)` }}>
          {Array.from({ length: 20 }, (_, y) => (
            Array.from({ length: 50 }, (_, x) => (
              <div
                key={`${x}-${y}`}
                style={{
                  width: '20px',
                  height: '20px',
                  border: '1px solid #ccc',
                  backgroundColor: xWalls.includes(x) && yWalls.includes(y) ? 'black' : 'white',
                }}
              ></div>
            ))
          ))}
        </div>
      </div>
    );
  };
  
  export default MazeComponent;
  