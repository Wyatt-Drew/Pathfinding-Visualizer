import React, {Component} from 'react';
import Submenu from './Submenu';
import DropDownIcon from '@mui/icons-material/ArrowDropDown';

class Menu extends Component {  
  
    render() {
      const { searchMethod } = this.props;
      
      return (
        <nav className="nav" id="menu-container">
          <ul className="nav__menu">
            <li className="nav__menu-item">
              <a href="https://wyatt-drew.github.io/" className='button-01' >
                Homepage
              </a>
            </li>
            <li className="nav__menu-item">
              <button className='button-01' onClick={() => this.props.resetGrid()}>Reset </button>
            </li>

            <li className="nav__menu-item">
              <button className='button-01' onClick={() => this.props.generateMaze()}>Generate Maze </button>
            </li>
            <li className="nav__menu-item">
              <button className='button-01' onClick={() => this.props.generateWeights()}>Generate Weights </button>
            </li>
            <li className="nav__menu-item">
            <button className='button-01' onClick={() => {this.props.visualize(); }}>Visualize {searchMethod}</button>
            </li>
            <li className="nav__menu-item">
              <button className='button-01'>Algorithms<DropDownIcon></DropDownIcon></button>
              <Submenu updateSearchMethod={this.props.updateSearchMethod} />
            </li>
          </ul>
        </nav>
      )
    }
  }
  export default Menu;