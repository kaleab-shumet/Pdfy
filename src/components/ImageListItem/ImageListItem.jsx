import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsUpDown, faXmark } from "@fortawesome/free-solid-svg-icons";
import "./ImageListItem.css";

const ImageListItem = ({ fileid, imgSrc }) => {
  return (
    <div className="d-flex border align-items-center my-1 px-4 py-1">
      <img src={imgSrc} className="image-preview" />
      <div className="p-2 d-flex flex-column">
        <span>{fileid}</span>
        <small className="mwrap">Size: fileSize</small>
      </div>
      <div className="d-flex ms-auto">
        <div className="d-flex align-items-center">            
          <FontAwesomeIcon className="mx-2 handle" icon={faArrowsUpDown} />
          <FontAwesomeIcon className="mx-2 close" icon={faXmark} />
        </div>
      </div>
    </div>
  );
};

export default ImageListItem;
