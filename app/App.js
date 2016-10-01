import React from 'react';
import './App.css';
import { playSample, startLoop } from './sampler.js';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {test: 'foo'};
  }
  render() {
    return (
      <div className="app">
        <p>mixolydian</p>
        <div className="piano mixolydian">
          <div className="button" onClick={ () => {playSample('Grand Piano', 'G3')} }>G</div>
          <div className="button" onClick={ () => {playSample('Grand Piano', 'A3')} }>A</div>
          <div className="button" onClick={ () => {playSample('Grand Piano', 'B3')} }>B</div>
          <div className="button" onClick={ () => {playSample('Grand Piano', 'C4')} }>C</div>
          <div className="button" onClick={ () => {playSample('Grand Piano', 'D4')} }>D</div>
          <div className="button" onClick={ () => {playSample('Grand Piano', 'E4')} }>E</div>
          <div className="button" onClick={ () => {playSample('Grand Piano', 'F4')} }>F</div>
          <div className="button" onClick={ () => {playSample('Grand Piano', 'G4')} }>G</div>
        </div>
        <p>dorian</p>
        <div className="piano dorian">
          <div className="button" onClick={ () => {playSample('Grand Piano', 'E3')} }>E</div>
          <div className="button" onClick={ () => {playSample('Grand Piano', 'F3')} }>F</div>
          <div className="button" onClick={ () => {playSample('Grand Piano', 'G3')} }>G</div>
          <div className="button" onClick={ () => {playSample('Grand Piano', 'A3')} }>A</div>
          <div className="button" onClick={ () => {playSample('Grand Piano', 'B3')} }>B</div>
          <div className="button" onClick={ () => {playSample('Grand Piano', 'C4')} }>C</div>
          <div className="button" onClick={ () => {playSample('Grand Piano', 'D4')} }>D</div>
          <div className="button" onClick={ () => {playSample('Grand Piano', 'E4')} }>E</div>
        </div>
      </div>
    );
  }
}
