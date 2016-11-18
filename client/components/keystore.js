import React, { PropTypes, Component } from 'react';
import { Segment, Header, Grid } from 'semantic-ui-react';
import Identicon from '@digix/react-components/components/identicon';
import DownloadKeystore from './download-keystore';
import Mnemonic from './mnemonic';
import PasswordEntryForm from './password-entry-form';

export default class Keystore extends Component {
  constructor(props) {
    super(props);
    this.handlePasswordSubmit = this.handlePasswordSubmit.bind(this);
  }
  handlePasswordSubmit(e) {
    e.preventDefault();
    const password = e.currentTarget.querySelectorAll('[name=password]')[0].value;
    this.props.unlockKeystore(this.props.keystore, password);
  }
  render() {
    const { keystore, handleClick, active } = this.props;
    return (
      <Segment
        textAlign="left"
        className={`selectable${(active || keystore.pwDerivedKey) ? ' active' : ''}`}
        onClick={() => handleClick(keystore.key)}
      >
        <Grid verticalAlign="middle" >
          <Grid.Column width={3}>
            <Identicon address={keystore.keystore.addresses[0]} />
          </Grid.Column>
          <Grid.Column textAlign="center" width={13}>
            <Header>
              <Header.Subheader as="h3" className="truncated">
                0x{keystore.keystore.addresses[0]}
              </Header.Subheader>
            </Header>
            {(active || keystore.pwDerivedKey) &&
              <div>
                {!keystore.pwDerivedKey ?
                  <PasswordEntryForm
                    error={!!keystore.error}
                    disabled={keystore.unlocking}
                    onCompleted={this.handlePasswordSubmit}
                  />
                :
                  <div>
                    <Mnemonic keystore={keystore} />
                    <DownloadKeystore keystore={keystore} />
                  </div>
                }
              </div>
            }
          </Grid.Column>
        </Grid>
      </Segment>
    );
  }
}

Keystore.propTypes = {
  keystore: PropTypes.object.isRequired,
  active: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired,
  unlockKeystore: PropTypes.func.isRequired,
};
