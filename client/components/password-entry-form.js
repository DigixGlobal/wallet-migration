import React, { PropTypes, Component } from 'react';
import { Button, Icon, Input } from 'semantic-ui-react';

export default class PasswordEntryForm extends Component {
  componentDidMount() {
    this.refs.form[0].focus();
  }
  render() {
    return (
      <form ref="form" onSubmit={this.props.onCompleted}>
        <Input
          fluid
          error={this.props.error}
          disabled={this.props.disabled}
          size="big"
          iconPosition="left"
          placeholder="Enter wallet password"
        >
          <input
            type="password"
            name="password"
            placeholder="Unlock Account..."
          />
          <Icon
            name={this.props.error ? 'cancel' : 'unlock'}
            color={this.props.error ? 'red' : 'black'}
          />
          <Button
            disabled={this.props.disabled}
            content="Unlock Account"
            type="submit"
          />
        </Input>
      </form>
    );
  }
}

PasswordEntryForm.propTypes = {
  onCompleted: PropTypes.func,
  disabled: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
};
