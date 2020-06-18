import React from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import {
  BrowserRouter, Redirect, Route, Switch,
} from 'react-router-dom';
import ReactGA from 'react-ga';

import MyNavbar from '../components/MyNavbar/MyNavbar';
import Profile from '../components/Profile/Profile';
import SubmissionForm from '../components/SubmissionForm/SubmissionForm';

import firebaseConnection from '../helpers/data/firebaseConnection';
import firebaseData from '../helpers/data/firebaseData';

import './App.scss';
import characterData from '../helpers/data/characters.json';
import getSquadData from '../helpers/data/squadsData';
import getCounterData from '../helpers/data/countersData';

import buildOpponentTeam from '../helpers/buildOpponentTeam';
import buildSquad from '../helpers/buildSquad';
import Counters5v5 from '../components/Counters/Counters';

firebaseConnection();

const PrivateRoute = ({ component: Component, authenticated, ...rest }) => {
  const routeChecker = (props) => (authenticated === true
    ? (<Component {...props} {...rest} />)
    : (<Redirect to={{ pathname: '/auth', state: { from: props.location } }} />));
  return <Route {...rest} render={(props) => routeChecker(props)} />;
};

// const PublicRoute = ({ component: Component, authenticated, ...rest }) => {
//   const routeChecker = props => (authenticated === false
//     ? (<Component {...props} {...rest} />)
//     : (<Redirect to={{ pathname: '/5v5', state: { from: props.location } }} />));
//   return <Route {...rest} render={props => routeChecker(props)} />;
// };

const defaultUser = {
  id: '',
  username: '',
  email: '',
  patreonId: '',
  patronStatus: '',
};

class App extends React.Component {
  state = {
    user: defaultUser,
    data: null,
    authenticated: false,
    characters: characterData.data,
    squads: [],
    countersNormal: [],
    countersReverse: [],
  }

  authenticateUser = (authUser) => {
    if (authUser) {
      const user = { id: authUser.uid, email: authUser.email };
      this.validateAccount(user);
      firebase.auth().getRedirectResult()
        .then((result) => {
          if (result.credential) {
            result.user.getIdToken(true)
              .then((token) => sessionStorage.setItem('token', token));
          }
        });
      this.setState({ authenticated: true });
    } else {
      this.setState({ authenticated: false });
    }
  }

  buildSquadObjects = (res, squad, view) => {
    // get the correct counter info
    const counterInfo = res
      .filter((x) => (view === 'normal'
        ? x.opponentTeam === squad.id
        : x.counterTeam === squad.id
      ));

    // get the left side squad
    const leftSideSquad = buildSquad(squad, this.state.characters);

    // get the right side squads
    const rightSideSquads = counterInfo
      .map((matchup) => buildOpponentTeam(
        matchup, this.state.squads, this.state.characters, view,
      ));

    // put them into an object and push into state
    const squadObject = rightSideSquads.length ? { leftSideSquad, rightSideSquads } : '';
    return squadObject;
  }

  getCounters = async () => {
    await getCounterData()
      .then((res) => {
        // seems verbose, but it queues up all of the
        // counters at once before distributing to child components
        const normal = [];
        const reverse = [];
        this.state.squads.forEach((squad) => {
          normal.push(this.buildSquadObjects(res, squad, 'normal'));
          reverse.push(this.buildSquadObjects(res, squad, 'reverse'));
        });
        this.setState({ countersNormal5v5: normal.filter((x) => x !== '') });
        this.setState({ countersReverse5v5: reverse.filter((x) => x !== '') });
      })
      .catch((err) => console.error(err));
  };

  getSquads = async () => {
    await getSquadData()
      .then((res) => this.setState({ squads: res }))
      .then(() => this.getCounters())
      .catch((err) => console.error(err));
  };

  componentDidMount() {
    this.removeListener = firebase.auth().onAuthStateChanged(this.authenticateUser);
    ReactGA.pageview(window.location.pathname);
    this.getSquads();
  }

  handleUsername = (e) => {
    const user = { ...this.state.user };
    user.username = e.target.value;
    this.setState({ user });
  };

  handleClearAllyCode = () => {
    const {
      id, username, email, patreonId, patronStatus,
    } = this.state;
    const user = {
      id,
      username,
      email,
      patreonId,
      patronStatus,
    };
    this.setState({ user });
    firebaseData.updateUserInfo(user);
  };

  handleLogout = () => {
    this.setState({ user: defaultUser });
  }

  setUserInfo = (res) => {
    this.setState((prevState) => ({
      user: {
        ...prevState.user,
        email: res.email,
        username: res.username,
        id: res.id,
        patreonId: res.patreonId,
        patronStatus: res.patronStatus,
      },
    }));
  };

  unlinkPatreonAccount = () => {
    this.setState((prevState) => ({
      user: {
        ...prevState.user,
        patreonId: '',
        patronStatus: '',
      },
    }));
  };

  validateAccount = (user) => {
    firebaseData.getUserByFirebaseAuthUid(user.id)
      .then((res) => {
        if (res !== '') {
          this.setUserInfo(res);
          return console.log(`Firebase user ${res.email} validated`);
        }
        console.log('No Firebase user found in DB');
        firebaseData.createUser(user)
          .then((response) => this.setUserInfo(response));
        return console.log('User created in Firebase');
      })
      .catch((err) => console.error(err));
  };

  render() {
    const { authenticated, user } = this.state;
    return (
      <div className="App">
        <BrowserRouter basename="/" hashType="slash">
            <React.Fragment>
              <MyNavbar
                authenticated={authenticated}
                handleLogout={this.handleLogout}
              />
              <div>
                  <Switch>
                    <Route exact path="/" render={(props) => <Counters5v5
                        {...props}
                        user={user}
                        countersNormal={this.state.countersNormal}
                        countersReverse={this.state.countersReverse}
                      />
                    } />
                    <Route exact path="/submit" component={ SubmissionForm } />

                    <PrivateRoute
                      path="/profile"
                      authenticated={authenticated}
                      component={Profile}
                      handleClearUsername={this.handleClearUsername}
                      handleUsername={this.handleUsername}
                      unlinkPatreonAccount={this.unlinkPatreonAccount}
                      user={user}
                    />

                    <Redirect from="*" to="/" />
                  </Switch>
              </div>
            </React.Fragment>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
