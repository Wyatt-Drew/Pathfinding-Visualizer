import React, {Component} from 'react';
import './Node.css';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import TimeToLeaveIcon from '@mui/icons-material/TimeToLeave';

export default class Node extends Component {
  render() {
    const {
      col,
      isFinish,
      isStart,
      isWall,
      onMouseDown,
      onMouseEnter,
      onMouseUp,
      row,
      direction,
    } = this.props;
    const extraClassName = isFinish
      ? 'node-finish'
      : isStart
      ? 'node-start'
      : isWall
      ? 'node-wall'
      : '';


    const nodeContent = isFinish ? <SportsScoreIcon></SportsScoreIcon>
    :isStart ? <TimeToLeaveIcon></TimeToLeaveIcon>
    : null;

    return (
      <div
        id={`node-${row}-${col}`}
        direction = {direction}
        className={`node ${extraClassName}`}
        onMouseDown={() => onMouseDown(row, col)}
        onMouseEnter={() => onMouseEnter(row, col)}
        // onMouseUp={() => onMouseUp()}>
        >
        {nodeContent}
        </div>
    );
  }
}
