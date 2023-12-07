import React, {Component} from 'react';
import Submenu from './Submenu';

class Menu extends Component {  
    render() {
      return (
        <nav className="nav" id="menu-container">
          <ul className="nav__menu">
            <li className="nav__menu-item">
              <a href="https://wyatt-drew.github.io/" className='button-01' >
                Homepage
              </a>
            </li>
            <li className="nav__menu-item">
              <button className='button-01'>Algorithms</button>
              <Submenu />
            </li>
            <li className="nav__menu-item">
              <button className='button-01' onClick={() => this.props.visualize()}>Visualize Dijkstra </button>
            </li>
          </ul>
        </nav>
      )
    }
  }
  export default Menu;