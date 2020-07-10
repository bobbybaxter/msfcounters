import React, {useState} from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
// import {
//   BrowserRouter, Redirect, Route, Switch,
// } from 'react-router-dom';
import ReactGA from 'react-ga';

import MyNavbar from '../components/MyNavbar';
import Profile from './profile';
import SubmissionForm from './submissionForm';

import firebaseConnection from '../helpers/data/firebaseConnection';
import firebaseData from '../helpers/data/firebaseData';

import characterData from '../helpers/data/characters.json';
// import getSquadData from '../helpers/data/squadsData';
// import getCounterData from '../helpers/data/countersData';
import { getSquadData } from '../pages/api/squads';
import { getCounterData } from '../pages/api/counters';

import buildOpponentTeam from '../helpers/buildOpponentTeam';
import buildSquad from '../helpers/buildSquad';
import Counters from '../components/Counters';
import Head from 'next/head';

import '../styles/counters.module.scss';

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

const getCounters = (counterData, characters, squads, type) => {
  const counters = squads.map((squad) => buildSquadObjects(counterData, characters, squad, squads, type));

  return counters ? (counters.filter((x) => x !== '')) : '';
}

const buildSquadObjects = (res, characters, squad, squads, view) => {
  // get the correct counter info
  const counterInfo = res
    .filter((x) => (view === 'normal'
      ? x.opponentTeam === squad.id
      : x.counterTeam === squad.id
    ));

  // get the left side squad
  const leftSideSquad = buildSquad(squad, characters);

  // get the right side squads
  const rightSideSquads = counterInfo
    .map((matchup) => buildOpponentTeam(
      matchup, squads, characters, view,
    ));

  // put them into an object and push into state
  const squadObject = rightSideSquads.length ? { leftSideSquad, rightSideSquads } : '';
  return squadObject;
}

const App = ( { squadData, counterData } ) => {
  const [ user, setUser ] = useState(defaultUser);
  // const [ data, setData] = useState(null);
  const [ authenticated, setAuthenticated ] = useState(false);
  const [ characters, setCharacters ] = useState(characterData.data);
  const [ squads, setSquads ] = useState(squadData || []);
  const [ countersNormal, setCountersNormal ] = useState(getCounters(counterData, characters, squads, 'normal') || []);
  const [ countersReverse, setCountersReverse ] = useState(getCounters(counterData, characters, squads, 'reverse') || []);

  // state = {
  //   user: defaultUser,
  //   data: null,
  //   authenticated: false,
  //   characters: characterData.data,
  //   squads: [],
  //   countersNormal: [],
  //   countersReverse: [],
  // }

  const authenticateUser = (authUser) => {
    if (authUser) {
      const user = { id: authUser.uid, email: authUser.email };
      validateAccount(user);
      firebase.auth().getRedirectResult()
        .then((result) => {
          if (result.credential) {
            result.user.getIdToken(true)
              .then((token) => sessionStorage.setItem('token', token));
          }
        });
      setAuthenticated( true );
    } else {
      setAuthenticated( false );
    }
  }

  // const buildSquadObjects = (res, squad, view) => {
  //   // get the correct counter info
  //   const counterInfo = res
  //     .filter((x) => (view === 'normal'
  //       ? x.opponentTeam === squad.id
  //       : x.counterTeam === squad.id
  //     ));

  //   // get the left side squad
  //   const leftSideSquad = buildSquad(squad, characters);

  //   // get the right side squads
  //   const rightSideSquads = counterInfo
  //     .map((matchup) => buildOpponentTeam(
  //       matchup, squads, characters, view,
  //     ));

  //   // put them into an object and push into state
  //   const squadObject = rightSideSquads.length ? { leftSideSquad, rightSideSquads } : '';
  //   return squadObject;
  // }

  // const getCounters = async () => {
  //   await getCounterData()
  //     .then((res) => {
  //       // seems verbose, but it queues up all of the
  //       // counters at once before distributing to child components
  //       const normal = [];
  //       const reverse = [];
  //       squads.forEach((squad) => {
  //         normal.push(buildSquadObjects(data.counters, squad, 'normal'));
  //         reverse.push(buildSquadObjects(data.counters, squad, 'reverse'));
  //       });
  //       setCountersNormal( normal.filter((x) => x !== '') );
  //       setCountersReverse( reverse.filter((x) => x !== '') );
  //     })
  //     .catch((err) => console.error(err));
  // };

  // const getCounters = async () => {
  //   await getCounterData()
  //     .then((res) => {
  //       // seems verbose, but it queues up all of the
  //       // counters at once before distributing to child components
  //       const normal = [];
  //       const reverse = [];
  //       squads.forEach((squad) => {
  //         normal.push(buildSquadObjects(res, squad, 'normal'));
  //         reverse.push(buildSquadObjects(res, squad, 'reverse'));
  //       });
  //       setCountersNormal( normal.filter((x) => x !== '') );
  //       setCountersReverse( reverse.filter((x) => x !== '') );
  //     })
  //     .catch((err) => console.error(err));
  // };

  // const getSquads = async () => {
  //   await getSquadData()
  //     .then((res) => setSquads(res))
  //     .then(() => getCounters())
  //     .catch((err) => console.error(err));
  // };

  // componentDidMount() {
  //   this.removeListener = firebase.auth().onAuthStateChanged(this.authenticateUser);
  //   ReactGA.pageview(window.location.pathname);
  //   this.getSquads();
  // }

  const handleUsername = (e) => {
    const userCopy = { ...user };
    userCopy.username = e.target.value;
    setUser( userCopy );
  };

  const handleClearAllyCode = () => {
    const {
      id, username, email, patreonId, patronStatus,
    } = user;
    const userCopy = {
      id,
      username,
      email,
      patreonId,
      patronStatus,
    };
    setUser( userCopy );
    firebaseData.updateUserInfo(userCopy);
  };

  const handleLogout = () => {
    setUser( defaultUser );
  }

  const setUserInfo = (res) => {
    setUser({
        ...user,
        email: res.email,
        username: res.username,
        id: res.id,
        patreonId: res.patreonId,
        patronStatus: res.patronStatus,
      },
    );
  };

  const unlinkPatreonAccount = () => {
    setUser({
        ...user,
        patreonId: '',
        patronStatus: '',
    });
  };

  const validateAccount = (user) => {
    firebaseData.getUserByFirebaseAuthUid(user.id)
      .then((res) => {
        if (res !== '') {
          setUserInfo(res);
          return console.log(`Firebase user ${res.email} validated`);
        }
        console.log('No Firebase user found in DB');
        firebaseData.createUser(user)
          .then((response) => setUserInfo(response));
        return console.log('User created in Firebase');
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <Head>
        <link 
          href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,300;0,400;1,300;1,400&family=Source+Sans+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&display=swap" 
          rel="stylesheet"
          key="google-fonts"
        />
      </Head>
      <div className="App">
        <MyNavbar
          authenticated={authenticated}
          handleLogout={handleLogout}
        />
        <Counters 
          user={user}
          countersNormal={countersNormal}
          countersReverse={countersReverse}
        />
        {/* <BrowserRouter basename="/" hashType="slash">
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
        </BrowserRouter> */}
      </div>
    </>
  );
}

const counterDataRequest = () => getCounterData()
  .then((res) => res)
  .catch((err) => console.error(err));

const squadDataRequest = () => getSquadData()
  .then((res) => res)
  .catch((err) => console.error(err));

export async function getServerSideProps() {
  // Fetch data from external API
  const squadData = await squadDataRequest();
  const counterData = await counterDataRequest();

  return { props: { squadData, counterData } };
}

export default App;
