import React, { Component } from 'react';
import { Container, Header, Segment, Divider, Image } from 'semantic-ui-react';
import logo from '@digix/react-components/assets/digix_logo.png';
import Keystores from './keystores';
import DropArea from './drop-area';

export default class App extends Component {
  render() {
    return (
      <Segment vertical textAlign="center" className="pusher" style={{ padding: 0 }}>
        <Container>
          <Divider hidden />
          <Image centered size="tiny" src={logo} />
          <Header.Subheader as="h3" className="ui">Digix Global</Header.Subheader>
          <Header as="h2">Wallet Migration Tool</Header>
        </Container>
        <Container text>
          This tool converts the old style (Jan 2016) lightwallet keystore used by the Digix beta app into a more modern Geth and MyEtherWallet compatible version.
        </Container>
        <Container text>
          <DropArea />
          <Divider hidden />
          <Keystores />
        </Container>
        <Container className="footer" textAlign="left">
          <Segment secondary size="small" attached="top" compact>
            <b>Project source code available on <a href="https://github.com/DigixGlobal/wallet-migration" target="_blank">Github</a>.</b>
            <br />
            Disclaimer: Ethereum, Digix Migration Wallet, and some of the libraries in use are under active development. There is always the possibility that something unexpected happens - do not invest more than you are willing to lose, and use care. We cannot take responsibility for any lost funds.
          </Segment>
        </Container>
      </Segment>
    );
  }
}
