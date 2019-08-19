import React, { Component } from 'react';
import '../src/styles.scss';

export default class Container extends Component {
  render() {
    const { story } = this.props;

    return (
      <div
        className="storybook-container"
        style={{
          padding: '3rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {story()}
      </div>
    );
  }
}
