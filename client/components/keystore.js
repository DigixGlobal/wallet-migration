import React, { PropTypes, Component } from 'react';
import { Input, Popup, Icon, Button, Segment, Header, Grid } from 'semantic-ui-react';
import Identicon from '@digix/react-components/components/identicon';
import Mnemonic from './mnemonic';
import PasswordEntryForm from './password-entry-form';

export default class Keystore extends Component {
  constructor(props) {
    super(props);
    this.handlePasswordSubmit = this.handlePasswordSubmit.bind(this);
    this.handleDownload = this.handleDownload.bind(this);
  }
  handlePasswordSubmit(e) {
    e.preventDefault();
    const password = e.currentTarget.querySelectorAll('[name=password]')[0].value;
    this.props.unlockKeystore(this.props.keystore, password);
  }
  handleDownload() {
    const serialized = this.props.keystore.unlocked.serialize();
    const address = this.props.keystore.keystore.addresses[0];
    const element = document.createElement('a');
    element.setAttribute('href', `data:application/json;charset=utf-8,${encodeURIComponent(serialized)}`);
    element.setAttribute('download', `${address}.json`);
    element.click();
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
              <Header.Subheader as="h3" className="truncated" textAlign="center">
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
                    <Popup
                      trigger={
                        <Button size="tiny" color="blue" onClick={this.handleDownload}>
                          <Icon name="file archive outline" /> Download Lightwallet
                        </Button>
                      }
                      positioning="bottom left"
                      content="Download a password-protected JSON file compatible with MyEtherWallet"
                      inverted
                    />
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
