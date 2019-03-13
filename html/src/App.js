import React from 'react';
import {BrowserRouter as Router, Link, Route} from 'react-router-dom';
import AboutUs from './AboutUs';
import Dropdown from './Dropdown';
import Guestbook from './Guestbook';
import Humburger from './Humburger';
import InstagramBanner from './InstagramBanner';
import Stream from './Stream';
import MapPanel from './MapPanel';
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
            <InstagramBanner/>
            <Route exact path="/" component={Stream} />
            <Route path="/about" component={AboutUs} />
            <Route path="/guestbook" component={Guestbook} />
            <Route path="/map" component={MapPanel} />
            <Route path="/post/:id" render={(props)=> {
              return <Stream post_id={props.match.params.id} />;
            }} />
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
