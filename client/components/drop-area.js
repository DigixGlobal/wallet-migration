import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import { importKeystores } from '../actions/keystore';

class DropArea extends Component {
  render() {
    return (
      <Dropzone
        className="ui message info dragbox"
        activeClassName="active"
        accept=".json"
        name="name"
        onDrop={this.props.importKeystores}
        multiple
      >
        <div className="ui padded one column grid">
          <div className="center aligned column">
            <i className="icon upload large"></i>
            <p>Click or Drag and Drop your file here to upload.</p>
          </div>
        </div>
      </Dropzone>
    );
  }
}

DropArea.propTypes = {
  importKeystores: PropTypes.func.isRequired,
};

export default connect(null, { importKeystores })(DropArea);
