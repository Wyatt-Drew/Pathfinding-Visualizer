import React, {Component} from 'react';
import './Dropdown.css';

  class Submenu extends React.Component {
    render() {
      return (
        <ul className="nav__submenu">
          <li className="nav__submenu-item ">
            <button className='button-02' onClick={() => this.props.updateSearchMethod('Dijkstra')}>Dijkstra's Algorithm</button>
          </li>
          <li className="nav__submenu-item ">
            <button className='button-02' onClick={() =>  this.props.updateSearchMethod('DFS')}>Depth-first Search</button>
          </li>
          <li className="nav__submenu-item " >
            <button className='button-02' onClick={() => this.props.updateSearchMethod('BFS')}>Breadth-first Search</button>
          </li>
          <li className="nav__submenu-item ">
            <button className='button-02' onClick={() => this.props.updateSearchMethod('A* Search')}>A* Search</button>
          </li>
        </ul>
      )
    }
  }
  export default Submenu;