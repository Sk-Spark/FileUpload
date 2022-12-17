import React, { useEffect, useState } from 'react';
import { FaRegTrashAlt } from 'react-icons/fa';

interface DownloadPros{
    setState:any;
}
const FileLink = (props:{fileName:string, onClickDelete:any}) =>{
    const fileName = props.fileName;
    return(
      <div className="download-link-div">
        <label>{fileName}</label>
        {/* <a href={`http://localhost:8383/delete?file=${fileName}`}><FaRegTrashAlt/></a> */}
        <label className='delete-icon'>
          <FaRegTrashAlt onClick={props.onClickDelete}/>
        </label>
    </div>
    );
}

export const Delete = (props:DownloadPros) => {
  const setState = props.setState; 
  const [apiData, setApiData] = useState({} as any);
  const [filesList, setFileslist] = useState(Array<any>);
  const [reload, setReload] = useState(false);

  useEffect(()=>{
    fetch('http://localhost:8383/download',{method: 'GET'})
			.then((response) => response.json())
			.then((result) => {
				console.log('Success:', result);
        setApiData({error:false, rsp:result});
			})
			.catch((error) => {
        console.error('Error:', error);
        setApiData({error:true, rsp:error});
			});
  },[reload]);

  const OnDeleteClick = (file:string) =>{
    console.log('#1 Delete File: ',file);
    fetch(`http://localhost:8383/delete?file=${file}`,{method: 'GET'})
			.then((response) => response.json())
			.then((result) => {
				console.log('Success:', result);
        setApiData({error:false, rsp:result});
			})
			.catch((error) => {
        console.error('Error:', error);
        setApiData({error:true, rsp:error});
			})
      .finally(()=>{
        setReload(!reload);
      });
  }

  useEffect(()=>{
    const newFiles:any = [];
    if(apiData.error === false){
      const files = apiData.rsp.data;
      files.forEach((file:any) => {
        newFiles.push(<FileLink fileName={file} onClickDelete={()=>{OnDeleteClick(file)}} /> );
        console.log(file);
      });
    }
    setFileslist(newFiles);
  },[apiData]);

  return (
    <div className="download-div">
      <h3> Delete Files </h3>
      {filesList.length>0 && filesList}
    </div>
  );
}