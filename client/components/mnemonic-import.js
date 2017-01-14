import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { Form, Button } from 'semantic-ui-react';
import lightwallet from 'eth-lightwallet';

import { importMnemonic } from '../actions/keystore';

class MnemonicImport extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(e) {
    e.preventDefault();
    const el = e.target.elements.string;
    if (!lightwallet.keystore.isSeedValid(el.value)) { return alert('Invalid Phrase'); }
    return this.props.importMnemonic(el.value)
    .then(() => { el.value = ''; })
    .catch(err => alert(err));
  }
  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        {this.state.mnemonic ?
          <Form.Group widths="equal">
            <Form.Input
              size="large"
              type="password"
              name="password"
              placeholder="Enter New Password"
            />
            <Form.Input
              size="large"
              type="password"
              name="passwordConfirm"
              placeholder="Confirm Password"
            />
            <Form.Field>
              <Button content="Set Password" icon="key" color="blue" fluid size="large" />
            </Form.Field>
          </Form.Group>
        :
          <Form.Input
            fluid
            size="large"
            name="string"
            placeholder="Enter 12 Word Mnemonic"
            action={<Button color="blue" content="Restore Mnemonic" icon="ellipsis horizontal" />}
          />
        }
      </Form>
    );
  }
}

MnemonicImport.propTypes = {
  importMnemonic: PropTypes.func.isRequired,
};

export default connect(null, { importMnemonic })(MnemonicImport);
