import React, {Component} from 'react';
import './Node.css';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import TimeToLeaveIcon from '@mui/icons-material/TimeToLeave';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

// Node component representing a single node in the pathfinding grid
export default class Node extends Component {
  render() {
    // Destructuring props to extract relevant properties
    const {
      col,
      isFinish,
      isStart,
      isWall,
      onMouseDown,
      onMouseEnter,
      row,
      direction,
      isWeight,
    } = this.props;
    // Determine the extra CSS class based on node properties
    const extraClassName = isFinish
      ? 'node-finish'
      : isStart
      ? 'node-start'
      : isWall
      ? 'node-wall'
      : isWeight
      ? 'node-weight'
      : '';

     // Determine the SVG content of the node based on its type (start, finish, weight)
    const nodeContent = isFinish ? <SportsScoreIcon className="node-svg"></SportsScoreIcon>
    :isStart ? <TimeToLeaveIcon className="node-svg"></TimeToLeaveIcon>
    :isWeight ? <FitnessCenterIcon className="node-svg"></FitnessCenterIcon>
    : null;
    // Render the Node component with appropriate styles and event handlers
    return (
      <div
        id={`node-${row}-${col}`}
        direction = {direction}
        className={`node ${extraClassName}`}
        onMouseDown={() => onMouseDown(row, col)}
        onMouseEnter={() => onMouseEnter(row, col)}
        >
        {nodeContent}
        </div>
    );
  }
}