import React, {useState} from 'react';

interface UploadPros {
  setState: any;
}

export const Upload =(props:UploadPros) =>{
	const [selectedFile, setSelectedFile] = useState({} as any);
	const [isSelected, setIsSelected] = useState(false);
  const [apiResp, setApiResponce] = useState({} as any);

	const changeHandler = (event:any) => {
    const files = event.target.files;
    console.log('event:', event.target.files);    
    setSelectedFile(files);
		setIsSelected(true);

	};

	const handleSubmission = () => {
		const formData = new FormData();
    for (const key of Object.keys(selectedFile)) {
      formData.append('files', selectedFile[key]);
    }
		fetch(
			'http://localhost:8383/upload',
			{
				method: 'POST',
				body: formData,
			}
		)
			.then((response) => response.json())
			.then((result) => {
				console.log('Success:', result);
        setApiResponce({error:false, rsp:result});
			})
			.catch((error) => {
        console.error('Error:', error);
        setApiResponce({error:true, rsp:error});
			});
	};

  const showError = apiResp && apiResp.error === true;  
  let lblMsg = '';
  if(!isSelected)
    lblMsg = 'Select a file to show details';
  else if(!showError && apiResp.rsp)
    lblMsg = 'File(s) uploaded successfully !!!';
  else if(showError)
    lblMsg = 'Error while Uploading Files !!!';
  else if(isSelected)
    lblMsg = `${selectedFile.length} file(s) selected.`;

	return(
   <div className='upload-div'>
			<label>{lblMsg}</label>
			<input type="file" name="files" onChange={changeHandler} multiple={true}/>
			<div>
				<button onClick={handleSubmission}>Upload Files</button>
			</div>
		</div>
	)
}
