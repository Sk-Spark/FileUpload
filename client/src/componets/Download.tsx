import React, { useEffect, useState } from 'react';
import { FileLink } from './FileLink';
import { LinkType } from './const';

interface DownloadPros{
    setState:any;
}

export const Download = (props:DownloadPros) => {
  const setState = props.setState; 
  const [apiData, setApiData] = useState({} as any);
  const [filesList, setFileslist] = useState(Array<any>);

  useEffect(()=>{
    fetch(
			'http://localhost:8383/download',
			{
				method: 'GET'
			}
		)
			.then((response) => response.json())
			.then((result) => {
				console.log('Success:', result);
        setApiData({error:false, rsp:result});
			})
			.catch((error) => {
        console.error('Error:', error);
        setApiData({error:true, rsp:error});
			});
  },[]);

  useEffect(()=>{
    const newFiles:any = [];
    let k=0;
    if(apiData.error === false){
      const files = apiData.rsp.data;
      files.forEach((file:any) => {
        newFiles.push(<FileLink fileName={file} linkType={LinkType.download} /> );
        console.log(file);
      });
    }
    console.log('#1 newFiles:',newFiles);
    setFileslist(newFiles);
  },[apiData]);

  console.log('#1 filesList:',filesList)

  return (
    <div className="download-div">
      <h3> Download Files </h3>
      {filesList.length>0 && filesList}
    </div>
  );
}