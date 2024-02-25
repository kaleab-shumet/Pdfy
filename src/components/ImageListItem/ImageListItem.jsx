/* eslint-disable react/prop-types */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort, faXmark } from "@fortawesome/free-solid-svg-icons";
import "./ImageListItem.css";
import { prettyFileSize } from "../../utils/utils";

const ImageListItem = ({ fileid, imgSrc, fileName, fileSize, onRemove }) => {
  const pFileSize = prettyFileSize(fileSize);
  return (
    <div
      className="d-flex border align-items-center my-1 px-4 py-1"
      id={fileid}
    >
      <img src={imgSrc} className="image-preview" />
      <div className="p-2 d-flex flex-column">
        <span>{fileName}</span>
        <small className="mwrap"><em>Size: {pFileSize}</em></small>
      </div>
      <div className="d-flex ms-auto">
        <div className="d-flex align-items-center">
          <FontAwesomeIcon className="mx-2 handle" icon={faSort} />
          <FontAwesomeIcon
            className="mx-2 close"
            icon={faXmark}
            onClick={onRemove}
          />
        </div>
      </div>
    </div>
  );
};

export default ImageListItem;
