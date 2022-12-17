import React from 'react';
import { State } from './const';
interface HomePros{
    setState:any;
}

export const Home = (props:HomePros) => {
  const setState = props.setState; 

  return (
    <div className="home-div">
      <h1>File Upload</h1>
      <label>Qr Code to be displayed here</label>
    </div>
  );
}