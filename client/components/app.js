import React, { Component } from 'react';
import { Container, Header, Segment, Divider, Image } from 'semantic-ui-react';
import logo from '@digix/react-components/assets/digix_logo.png';
import Keystores from './keystores';

export default class App extends Component {
  render() {
    return (
      <Segment vertical textAlign="center">
        <Container>
          <Divider hidden />
          <Image centered size="tiny" src={logo} />
          <Header.Subheader as="h3" className="ui">Digix Global</Header.Subheader>
          <Header as="h2">Wallet Migration Tool</Header>
          <p>Download a backup of your migrated keystore below...</p>
          <Divider hidden />
          <Keystores />
        </Container>
      </Segment>
    );
  }
}
