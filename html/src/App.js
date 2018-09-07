import React from 'react';
import { BrowserRouter as Router, Route, Link} from "react-router-dom";
import Humburger from "./Humburger";
import Dropdown from './Dropdown';
import Stream from './Stream';
import AboutUs from './AboutUs';
import Guestbook from './Guestbook';

import './index.css';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {dropdownActive: false};
  }

  render() {
    return (
    <Router>              
      <div id="app">
        <header>
          <Humburger 
            onClick={() => this.setState({dropdownActive: !this.state.dropdownActive})}
          />
          <div id="header-text">
            <Link to="/">
              <h1>Taxeedee: 
                <span id="subtitle">Travels of Olga and Jack</span>
              </h1>
            </Link>      
          </div>
        </header>

        <main>        
          <Dropdown 
            active={this.state.dropdownActive}
            onClick={() => this.setState({dropdownActive: false})}
          />
            <Route exact path="/" component={Stream} />
              <Route path="/about" component={AboutUs} />
              <Route path="/guestbook" component={Guestbook} />       
        </main>             
        <footer>
          Ταξίδι: Greek for Travel
        </footer>
      </div>
    </Router>               
      );
  }
}

export default App;