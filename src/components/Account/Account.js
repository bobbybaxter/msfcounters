import React from 'react';
import {
  Button, Form, FormGroup, Input,
} from 'reactstrap';
import MetaTags from 'react-meta-tags';

import './Account.scss';
import firebaseData from '../../helpers/data/firebaseData';

// const userUnitsInStorage = JSON.parse(localStorage.getItem('userUnits'));
// const userDataInStorage = JSON.parse(localStorage.getItem('userData'));

const patreonLink = `https://patreon.com/oauth2/authorize?response_type=code&client_id=${process.env.REACT_APP_PATREON_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_PATREON_REDIRECT}&scope=identity${encodeURI('[email]')}%20identity`;

// TODO: Add proptypes
// TODO: Add tests
export default function Account(props) {
  // const [userData, setUserData] = useState(userDataInStorage || '');
  // const [userUnits, setUserUnits] = useState(userUnitsInStorage || '');

  // const setPlayerData = () => {
  //   // will get playerData once MSF has an API
  // };

  const clearPid = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('userUnits');
    // setUserUnits('');
    // setUserData('');
    props.handleClearPid();
  };

  const submitPid = (e) => {
    e.preventDefault();
    firebaseData.updateUserInfo(props.user);
    // setPlayerData(); // Not needed until MSF has an API
  };

  const pidForm = <Form inline>
    <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
      <Input
        type="text"
        name="pid"
        id="pid"
        placeholder="Player ID"
        onChange={props.handlePid}
      />
    </FormGroup>
    <Button className="ult300" type="submit" onClick={submitPid}>Submit</Button>
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
    <div className="Account">
      <MetaTags>
        <title>Account</title>
        <meta name="description" content="Link your MSF Player ID and Patreon email"/>
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </MetaTags>
      <div className="accountWrapper">
        <h1>{props.user.pid ? props.user.pid : ''}</h1>
        {props.user.pid ? '' : pidForm}
        {togglePatreonButton}
        {!props.user.pid
          ? ''
          : <Button
              className="btn-sm ult300"
              onClick={clearPid}
            >Clear Player ID</Button>
        }

        {/* <Button onClick={handleMerge}>Merge</Button> */}

      </div>
    </div>
  );
}
