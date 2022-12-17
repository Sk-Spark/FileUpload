import { FaDownload, FaRegTrashAlt } from 'react-icons/fa';
import { LinkType } from './const';

export const FileLink = (props:{fileName:string, linkType:LinkType}) =>{
    const fileName = props.fileName;
    const icon = props.linkType === LinkType.download ? <FaDownload/> : <FaRegTrashAlt/>
    const link = props.linkType === LinkType.download ? 
        <a href={`http://localhost:8383/getFile?file=${fileName}`}>{icon}</a> : 
        <a href={`http://localhost:8383/delete?file=${fileName}`}>{icon}</a>
    return(
        <div className="download-link-div">
            <label>{fileName}</label>
            {link}
        </div>
    )
}
