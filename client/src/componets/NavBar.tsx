import React from 'react';
import { State } from './const';
interface NavBarPros{
    state: State
    setState:any;
}

export const NavBar = (props:NavBarPros) =>{
  const {setState, state} = props ;

  const OnHomeClick = () =>{
    console.log('Upload Clicked');
    setState(State.home);
  }
  
  const OnUploadClick = () =>{
    console.log('Upload Clicked');
    setState(State.upload);
  }

  const OnDownloadClick = () =>{
    setState(State.download);
    console.log('Download Clicked');
  }

  const OnDeleteClick = () =>{
    setState(State.delete);
    console.log('Download Clicked');
  }

  return(
      <div className='navbar-div'>
          <button className={ state===State.home? 'selected-btn':''} onClick={OnHomeClick} >Home</button>
          <button className={ state===State.upload? 'selected-btn':''} onClick={OnUploadClick} >Upload</button>
          <button className={ state===State.download? 'selected-btn':''} onClick={OnDownloadClick}>Download</button>
          <button className={ state===State.delete? 'selected-btn':''} onClick={OnDeleteClick}>Delete</button>
      </div>
  );
}