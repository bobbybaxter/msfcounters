/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable max-len */
import React from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import {
  BrowserRouter,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import ReactGA from 'react-ga';

import './App.scss';

// import Account from '../components/Account/Account';
import Counters from '../components/Counters/Counters';
import MyNavbar from '../components/MyNavbar/MyNavbar';
import NotFound from '../components/NotFound/NotFound';
import SubmissionForm from '../components/SubmissionForm/SubmissionForm';

import characterData from '../helpers/data/characters.json';
import firebaseConnection from '../helpers/data/firebaseConnection';
import firebaseData from '../helpers/data/firebaseData';
import getCounterData from '../helpers/data/countersData';

import addImageRefs from '../helpers/addImageRefs';

firebaseConnection();

// const PrivateRoute = ({ component: Component, authenticated, ...rest }) => {
//   const routeChecker = (props) => (authenticated === true
//     ? (<Component {...props} {...rest} />)
//     : (<Redirect to={{ pathname: '/', state: { from: props.location } }} />));
//   return <Route {...rest} render={(props) => routeChecker(props)} />;
// };

const sessionStorageSquads = JSON.parse(sessionStorage.getItem('MsfSquads'));
const sessionStorageCountersNormal = JSON.parse(sessionStorage.getItem('MsfCountersNormal'));
const sessionStorageCountersReverse = JSON.parse(sessionStorage.getItem('MsfCountersReverse'));

const defaultUser = {
  id: '',
  pid: '',
  email: '',
  patreonId: '',
  patronStatus: '',
};

// TODO: Test Account Page and add in here and navbar when ready
class App extends React.Component {
  state = {
    user: defaultUser,
    data: null,
    authenticated: false,
    characters: characterData.data,
    squads: sessionStorageSquads || [],
    countersNormal: sessionStorageCountersNormal || [],
    countersReverse: sessionStorageCountersReverse || [],
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

  getCounters = async () => {
    const counters = await getCounterData();
    console.log('counters :>> ', counters);
    if (counters) {
      const countersNormal = addImageRefs(counters.countersNormal, this.state.characters);
      const countersReverse = addImageRefs(counters.countersReverse, this.state.characters);
      sessionStorage.setItem('MsfSquads', JSON.stringify(counters.squads));
      sessionStorage.setItem('MsfCountersNormal', JSON.stringify(countersNormal));
      sessionStorage.setItem('MsfCountersReverse', JSON.stringify(countersReverse));
      this.setState({
        squads: counters.squads,
        countersNormal,
        countersReverse,
      });
    }
  };

  componentDidMount() {
    this.removeListener = firebase.auth().onAuthStateChanged(this.authenticateUser);
    ReactGA.pageview(window.location.pathname);
    if (!sessionStorageSquads) {
      this.getCounters();
    }
  }

  handlePid = (e) => {
    const user = { ...this.state.user };
    user.username = e.target.value;
    this.setState({ user });
  };

  handleClearPid = () => {
    const {
      id, pid, email, patreonId, patronStatus,
    } = this.state;
    const user = {
      id,
      pid,
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
        pid: res.pid,
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
                    <Route exact path="/" render={(props) => <Counters
                        {...props}
                        user={user}
                        countersNormal={this.state.countersNormal}
                        countersReverse={this.state.countersReverse}
                      />
                    } />
                    <Route exact path="/submit" component={ SubmissionForm } />

                    {/* <PrivateRoute
                      path="/profile"
                      authenticated={authenticated}
                      component={Account}
                      handleClearPid={this.handleClearPid}
                      handlePid={this.handlePid}
                      unlinkPatreonAccount={this.unlinkPatreonAccount}
                      user={user}
                    /> */}

                    <Route component={NotFound} />
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
