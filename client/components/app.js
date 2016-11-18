import React, { Component } from 'react';
import { Container, Header, Segment, Divider, Image } from 'semantic-ui-react';
import logo from '@digix/react-components/assets/digix_logo.png';
import Keystores from './keystores';
import DropArea from './drop-area';

export default class App extends Component {
  render() {
    return (
      <Segment vertical textAlign="center">
        <Container>
          <Divider hidden />
          <Image centered size="tiny" src={logo} />
          <Header.Subheader as="h3" className="ui">Digix Global</Header.Subheader>
          <Header as="h2">Wallet Migration Tool</Header>
        </Container>
        <Divider hidden />
        <Container text>
          This tool converts the old style (Jan 2016) lightwallet keystore used by the Digix beta app into a more modern Geth and MyEtherWallet compatible version.
        </Container>
        <Divider hidden />
        <Container text>
          <DropArea />
          <Divider hidden />
          <Keystores />
        </Container>
      </Segment>
    );
  }
}
