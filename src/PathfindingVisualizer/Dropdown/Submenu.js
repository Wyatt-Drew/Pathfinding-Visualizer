import React, {Component} from 'react';
import './Dropdown.css';

  class Submenu extends React.Component {
    render() {
      return (
        <ul className="nav__submenu">
          <li className="nav__submenu-item "id='startButtonDijkstra'>
            <a href="#">Dijkstra's Algorithm</a>
          </li>
          <li className="nav__submenu-item " id='startButtonAStar2'>
            <a href="#">A* Search</a>
          </li>
          <li className="nav__submenu-item " id='startButtonGreedy'>
            <a href="#">Greedy Best-first Search</a>
          </li>
          <li className="nav__submenu-item " id='startButtonBFS'>
            <a href="#">Breadth-first Search</a>
          </li>
          <li className="nav__submenu-item " id='startButtonDFS'>
            <a href="#">Depth-first Search</a>
          </li>
        </ul>
      )
    }
  }
  export default Submenu;