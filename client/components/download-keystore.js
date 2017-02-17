import React, { PropTypes, Component } from 'react';
import { Dimmer, Loader, Form, Input, Modal, Popup, Icon, Button, Header } from 'semantic-ui-react';
import Wallet from 'ethereumjs-wallet';

export default class DownloadKeystore extends Component {
  constructor(props) {
    super(props);
    this.state = { open: false };
    this.handleShow = this.handleShow.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleShow(open) {
    this.setState({ open });
  }
  handleChange(e) {
    const newState = this.state;
    newState[e.target.name] = e.target.value;
    const basicValidation = newState.password && newState.password.length >= 6;
    const ready = basicValidation && newState.password === newState.confirm;
    this.setState({ [e.target.name]: e.target.value, ready });
  }
  handleSubmit(e) {
    e.preventDefault();
    if (!this.state.ready) { return null; }
    this.setState({ loading: true });
    return setTimeout(() => {
      const password = this.state.password;
      const { unlocked, pwDerivedKey } = this.props.keystore;
      const address = unlocked.getAddresses()[0];
      const privateKey = unlocked.exportPrivateKey(address, pwDerivedKey);
      const wallet = Wallet.fromPrivateKey(new Buffer(privateKey, 'hex'));
      const fileName = wallet.getV3Filename();
      const serialized = JSON.stringify(wallet.toV3(password, { n: 1024 }));
      const element = document.createElement('a');
      element.setAttribute('href', `data:application/json;charset=utf-8,${encodeURIComponent(serialized)}`);
      element.setAttribute('download', fileName);
      document.body.appendChild(element);
      element.click();
      this.setState({ loading: false });
      this.handleShow(false);
    }, 10);
  }
  renderPasswordBox({ text, name }) {
    return (
      <Form.Input
        fluid
        error={this.state.error}
        disabled={this.state.disabled}
        size="big"
        iconPosition="left"
      >
        <input
          onChange={this.handleChange}
          ref={name}
          type="password"
          name={name}
          placeholder={text}
        />
        <Icon
          name={this.state.error ? 'cancel' : 'key'}
          color={this.state.error ? 'red' : 'black'}
        />
      </Form.Input>
    );
  }
  render() {
    return (
      <span>
        <Popup
          trigger={
            <Button size="tiny" color="blue" onClick={() => this.handleShow(true)}>
              <Icon name="file archive outline" /> Download Keystore
            </Button>
          }
          positioning="bottom left"
          content="Download a keystore file compatible with Geth and MyEtherWallet"
          inverted
        />
        <Modal open={this.state.open} onClose={() => this.handleShow(false)}>
          <Dimmer active={this.state.loading} inverted>
            <Loader inverted />
          </Dimmer>
          <Header>
            <Icon name="file archive outline" />
            <Header.Content>
              Download Keystore
            </Header.Content>
          </Header>
          <Modal.Content>
            <p>
              Select a password (minimum 6 character) to encrypt your keystore. <b>Do not forget this password!</b>
            </p>
            <Form onSubmit={this.handleSubmit}>
              <Form.Group widths="equal">
                {this.renderPasswordBox({ text: 'Enter Password', name: 'password' })}
                {this.renderPasswordBox({ text: 'Confirm Password', name: 'confirm' })}
              </Form.Group>
              <Form.Button type="submit" color="blue" disabled={!this.state.ready}>
                <Icon name="download" /> Download
              </Form.Button>
            </Form>
          </Modal.Content>
        </Modal>
      </span>

    );
  }
}

DownloadKeystore.propTypes = {
  keystore: PropTypes.object,
};
