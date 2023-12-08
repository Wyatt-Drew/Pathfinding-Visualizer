import React, { Component } from 'react';
import './Node.css';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import TimeToLeaveIcon from '@mui/icons-material/TimeToLeave';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';



export default class Node extends Component {
  static getContent(isFinish, isStart, isWeight) {
    if (isFinish) {
      return <SportsScoreIcon className="node-svg" />;
    } else if (isStart) {
      return <TimeToLeaveIcon className="node-svg" />;
    } else if (isWeight) {
      return <FitnessCenterIcon className="node-svg" />;
    } else {
      return null;
    }
  }
  render() {
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
      content, 
    } = this.props;
    const extraClassName = isFinish
      ? 'node-finish'
      : isStart
      ? 'node-start'
      : isWall
      ? 'node-wall'
      : isWeight
      ? 'node-weight'
      : '';

    return (
      <div
        id={`node-${row}-${col}`}
        direction={direction}
        className={`node ${extraClassName}`}
        onMouseDown={() => onMouseDown(row, col)}
        onMouseEnter={() => onMouseEnter(row, col)}
      >
        {content}
      </div>
    );
  }
}
