import React, {Component} from 'react';
import Submenu from './Submenu';

class Menu extends Component {  
    render() {
      return (
        <nav className="nav">
          <ul className="nav__menu">
            <li className="nav__menu-item">
              <a href="https://wyatt-drew.github.io/">Homepage</a>
            </li>
            <li className="nav__menu-item">
              <a href="#">Algorithms</a>
              <Submenu />
            </li>
            <li className="nav__menu-item">
              <a href="#">Visualize Algorithm</a>
            </li>
          </ul>
        </nav>
      )
    }
  }
  export default Menu;