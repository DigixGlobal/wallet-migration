import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { Divider, Header, Segment, Loader } from 'semantic-ui-react';
import { getKeystores, unlockKeystore } from '../actions/keystore';

import Keystore from './keystore';

class Keystores extends Component {
  constructor(props) {
    super(props);
    this.state = { activeKeystore: false };
    this.handleClickKeystore = this.handleClickKeystore.bind(this);
  }
  componentDidMount() {
    this.props.getKeystores();
  }
  handleClickKeystore(activeKeystore) {
    this.setState({ activeKeystore });
  }
  renderKeystores() {
    const { keystores } = this.props.keystore;
    return (
      <div>
        <Divider hidden />
        {keystores.length === 0 ?
          <Segment>No keystores found in LocalStorage - please upload one</Segment>
        :
          <Segment.Group>
            <Segment attached="top">Available Keystores</Segment>
            {keystores.map((ks) => {
              return (
                <Keystore
                  key={ks.key}
                  keystore={ks}
                  handleClick={this.handleClickKeystore}
                  unlockKeystore={this.props.unlockKeystore}
                  active={this.state.activeKeystore === ks.key}
                />
              );
            })}
          </Segment.Group>
        }
      </div>
    );
  }
  render() {
    const { keystore } = this.props;
    if (!keystore.loaded) {
      return <Loader inverted content="Loading" />;
    }
    return (
      <div>
        {!keystore.loaded ?
          <Loader inverted content="Loading" />
        :
          this.renderKeystores()
        }
      </div>
    );
  }
}

Keystores.propTypes = {
  getKeystores: PropTypes.func.isRequired,
  unlockKeystore: PropTypes.func.isRequired,
  keystore: PropTypes.object.isRequired,
};

export default connect(({ keystore }) => ({ keystore }), { getKeystores, unlockKeystore })(Keystores);
