import React from 'react';
import {
  Button, Form, FormGroup, Input,
} from 'reactstrap';

import firebaseData from '../helpers/data/firebaseData';

// TODO: config proxy the localhost redirects
const patreonLink = `https://patreon.com/oauth2/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_PATREON_CLIENT_ID}&redirect_uri=http://localhost:5000/api/patreon/redirect&scope=identity${encodeURI('[email]')}%20identity`;

// TODO: Add proptypes
// TODO: Add tests
export default function Profile(props) {
  const clearUsername = () => {
    // localStorage.removeItem('userData');
    // localStorage.removeItem('userUnits');
    // setUserUnits('');
    // setUserData('');
    props.handleClearAllyCode();
  };

  const submitUsername = (e) => {
    e.preventDefault();
    firebaseData.updateUserInfo(props.user);
    // TODO: set username in App.js
    // setPlayerData();
  };

  const usernameForm = <Form inline>
    <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
      <Input
        type="text"
        name="username"
        id="username"
        placeholder="Username"
        onChange={props.handleUsername}
      />
    </FormGroup>
    <Button className="ult300" type="submit" onClick={submitUsername}>Submit</Button>
  </Form>;

  const handleUnlinkPatreonAccount = () => {
    firebaseData.unlinkPatreonAccount(props.user);
    props.unlinkPatreonAccount();
  };

  const togglePatreonButton = !props.user.patreonId
    ? <Button className="btn-sm mr-1 ult300" href={patreonLink}>
          Link Patreon
        </Button>
    : <Button className="btn-sm mr-1 ult300" onClick={handleUnlinkPatreonAccount}>
          Unlink Patreon
        </Button>;

  return (
    <div className="Profile">
      <div className="profileWrapper">
        <h1>{props.user.username ? props.user.username : ''}</h1>
        {props.user.username ? '' : usernameForm}
        {togglePatreonButton}
        {!props.user.username
          ? ''
          : <Button
              className="btn-sm ult300"
              onClick={clearUsername}
            >Clear Username</Button>
        }

        {/* <Button onClick={handleMerge}>Merge</Button> */}

      </div>
    </div>
  );
}
