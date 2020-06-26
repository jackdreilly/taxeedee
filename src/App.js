import "firebase/analytics";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { default as React } from "react";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";
import AboutUs from "./AboutUs";
import Dropdown from "./Dropdown";
import Guestbook from "./Guestbook";
import Humburger from "./Humburger";
import "./index.css";
import InstagramIMG from "./insta";
import MapPanel from "./MapPanel";
import Stream from "./Stream";
const firebaseConfig = {
  apiKey: "AIzaSyCEbW8Q_FwFdh8RqHfb0lJmC7jHTkdnmK4",
  authDomain: "quiklyrics-go.firebaseapp.com",
  databaseURL: "https://quiklyrics-go.firebaseio.com",
  projectId: "quiklyrics-go",
  storageBucket: "quiklyrics-go.appspot.com",
  messagingSenderId: "325638833931",
  appId: "1:325638833931:web:c931da3ff35bd46a49040e",
  measurementId: "G-QWTVR98C46",
};

firebase.initializeApp(firebaseConfig);
export const analytics = firebase.analytics();
export const firestore = firebase.firestore();
export const auth = firebase.auth();
auth.signInAnonymously();

export function uid() {
  return _uid;
}
var _uid = "";
auth.onAuthStateChanged((u) => (_uid = u ? u.uid : ""));

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { dropdownActive: false };
  }

  render() {
    return (
      <Router>
        <div id="app">
          <header>
            <Humburger
              onClick={() =>
                this.setState({ dropdownActive: !this.state.dropdownActive })
              }
            />
            <div id="header-text">
              <Link to="/">
                <h1>
                  Taxeedee:
                  <span id="subtitle">Travels of Olga and Jack</span>
                </h1>
              </Link>
            </div>
            <InstagramIMG />
          </header>

          <main>
            <Dropdown
              active={this.state.dropdownActive}
              onClick={() => this.setState({ dropdownActive: false })}
            />
            <Route exact path="/" component={Stream} />
            <Route path="/about" component={AboutUs} />
            <Route path="/guestbook" component={Guestbook} />
            <Route path="/map" component={MapPanel} />
            <Route
              path="/post/:id"
              render={(props) => {
                return <Stream post_id={props.match.params.id} />;
              }}
            />
          </main>
          <footer>Ταξίδι: Greek for Travel</footer>
        </div>
      </Router>
    );
  }
}

export default App;
