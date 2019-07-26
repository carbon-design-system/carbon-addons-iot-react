import React, { Component } from 'react';
import '../src/index.scss';

export default class Container extends Component {
  render() {
    const { story } = this.props;

    return (
      <div
        className="storybook-container"
        style={{
          padding: '3em',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div style={{ width: '100%' }}>{story()}</div>
      </div>
    );
  }
}
