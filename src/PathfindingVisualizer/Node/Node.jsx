import React, {Component} from 'react';
import './Node.css';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import TimeToLeaveIcon from '@mui/icons-material/TimeToLeave';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

export default class Node extends Component {
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


    const nodeContent = isFinish ? <SportsScoreIcon className="node-svg"></SportsScoreIcon>
    :isStart ? <TimeToLeaveIcon className="node-svg"></TimeToLeaveIcon>
    :isWeight ? <FitnessCenterIcon className="node-svg"></FitnessCenterIcon>
    : null;

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