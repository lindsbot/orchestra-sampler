import React from 'react';
import styles from './App.css';
import sampler from './sampler.js';


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {test: 'foo'};
    sampler();
  }
  render() {
    return (
      <div className={styles.app}>
        bar
      </div>
    );
  }
}
