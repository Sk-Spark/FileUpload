import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import {State} from './componets/const';
import {Home} from './componets/Home';
import {Download} from './componets/Download';
import { Upload } from './Upload';
import { NavBar } from './componets/NavBar';
import { Delete } from './componets/Delete';

function App() {
  const [state, setState] = useState(State.home);

  const showHome = state === State.home;
  const showDownload = state === State.download;
  const showUpload = state === State.upload;
  const showDelete = state === State.delete;

  return (
    <div className="App">
      { <NavBar state={state} setState={setState}/>}
      { showHome && <Home setState={setState}/>}
      { showDownload && <Download setState={setState}/>}
      { showUpload && <Upload setState={setState}/>}
      { showDelete && <Delete setState={setState}/>}
    </div>
  );
}

export default App;
