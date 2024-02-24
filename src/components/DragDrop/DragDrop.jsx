import "./DragDrop.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import ImageListItem from "../ImageListItem/ImageListItem";
import { ReactSortable } from "react-sortablejs";
import { v4 as uuidv4 } from "uuid";

const DragDrop = () => {
  const fileInputRef = useRef();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedSortableFiles, setSelectedSortableFiles] = useState([]);

  const onAddFilesClicked = () => {
    fileInputRef.current.click();
  };

  const onFileInputChange = async (e) => {
    e.preventDefault();
    const files = e.target.files;
    await imageSelectorOnChange(Array.from(files));
  };

  const validateFileType = (file) => {
    if (file) {
      const supportedFilesList = ["jpg", "jpeg", "png"];
      const fileType = file.type.toString().toLowerCase();
      for (const supportedFile of supportedFilesList) {
        if (fileType.includes(supportedFile)) {
          return true;
        }
      }

      return false;
    } else return false;
  };

  const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.addEventListener("load", () => {
        resolve(reader.result);
      });

      reader.addEventListener("error", () => {
        reject(new Error("Error reading file."));
      });

      reader.readAsDataURL(file);
    });
  };

  const imageSelectorOnChange = async (files) => {
    console.log("files", files);
    const validFiles = files
      .filter((f) => validateFileType(f))
      .map((f) => ({ f, fileid: uuidv4() }));
    setSelectedFiles([...selectedFiles, ...validFiles]);
  };

  useEffect(() => {
    console.log("selectedFiles: ", selectedFiles);

    const display = async () => {
      const ssf = [];
      for (const { fileid, f } of selectedFiles) {
        const imgSrc = await readFileAsDataURL(f);
        ssf.push({ fileid, imgSrc });
      }
      setSelectedSortableFiles(ssf);
    };

    display();
  }, [selectedFiles]);

  return (
    <div className="container">
      <div className="p-2 m-2 d-flex justify-content-center align-items-center drag-n-drop">
        <div className="d-flex flex-column align-items-center justify-content-center">
          <FontAwesomeIcon
            icon={faCloudArrowUp}
            className="cloud-color"
            size="3x"
          />
          <p className="py-1">Drop your files here</p>
          <button
            type="button"
            className="btn btn-outline-primary btn-lg btn-lgg"
            onClick={onAddFilesClicked}
          >
            Add Files
          </button>
        </div>
      </div>

      <form>
        <input
          type="file"
          className="hide-input"
          ref={fileInputRef}
          onChange={onFileInputChange}
          name="images"
          accept="image/*"
          multiple
        />
      </form>

      <ReactSortable
        handle=".handle"
        animation={200}
        delayOnTouchStart={true}
        delay={2}
        list={selectedSortableFiles}
        setList={setSelectedSortableFiles}
      >
        {selectedSortableFiles.map((item) => (
          <ImageListItem key={item.fileid} {...item} />
        ))}
      </ReactSortable>

      {selectedSortableFiles.length > 0 && (
        <div className="d-flex justify-content-center m-3 p-2">
          <button type="button" className="btn btn-primary btn-lg btn-block orange-btn">
            Convert
          </button>
        </div>
      )}
    </div>
  );
};

export default DragDrop;
