import React, {Component} from 'react';
import './Dropdown.css';

  class Submenu extends React.Component {
    render() {
      return (
        <ul className="nav__submenu">
          <li className="nav__submenu-item "id='startButtonDijkstra'>
            <button className='button-01'>Dijkstra's Algorithm</button>
          </li>
          {/* <li className="nav__submenu-item " id='startButtonAStar2'>
            <button className='button-01'>A* Search</button>
          </li> */}
          {/* <li className="nav__submenu-item " id='startButtonGreedy'>
            <button className='button-01'>Greedy Best-first Search</button>
          </li> */}
          <li className="nav__submenu-item " id='startButtonBFS'>
            <button className='button-01'>Breadth-first Search</button>
          </li>
          {/* <li className="nav__submenu-item " id='startButtonDFS'>
            <button className='button-01'>Depth-first Search</button>
          </li> */}
        </ul>
      )
    }
  }
  export default Submenu;