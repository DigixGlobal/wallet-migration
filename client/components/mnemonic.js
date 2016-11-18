import React, { PropTypes, Component } from 'react';
import { Divider, Modal, Popup, Icon, Button, Header } from 'semantic-ui-react';

export default class Mnemonic extends Component {
  constructor(props) {
    super(props);
    this.state = { open: false };
    this.handleShow = this.handleShow.bind(this);
  }
  handleShow(open) {
    const seed = open && this.props.keystore.unlocked.getSeed(this.props.keystore.pwDerivedKey);
    this.setState({ open: seed });
  }
  render() {
    return (
      <span>
        <Popup
          trigger={
            <Button size="tiny" onClick={() => this.handleShow(true)}>
              <Icon name="ellipsis horizontal" /> Show Mnemonic
            </Button>
          }
          positioning="bottom left"
          content="Copy the 12 word phrase that can be used to restore account"
          inverted
        />
        <Modal
          basic
          open={!!this.state.open}
        >
          <Header inverted as="h2">
            <Icon name="horizontal ellipsis" />
            <Header.Content>
              Secret Mnemonic
              <Header.Subheader>
                12 word phrase used to restore your account
              </Header.Subheader>
            </Header.Content>
          </Header>
          <Modal.Content>
            <Header as="h2" inverted>
              {this.state.open}
              <Divider hidden />
              <Header.Subheader>0x{this.props.keystore.keystore.addresses[0]}</Header.Subheader>
            </Header>
          </Modal.Content>
          <Modal.Actions>
            <Button color="green" inverted onClick={() => this.handleShow(false)}>
              <Icon name="checkmark" /> Done
            </Button>
          </Modal.Actions>
        </Modal>
      </span>

    );
  }
}

Mnemonic.propTypes = {
  keystore: PropTypes.object,
};
