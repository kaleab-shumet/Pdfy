import { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";

import { validateAndFormatFiles } from "../../utils/utils";

// eslint-disable-next-line react/prop-types
const DragDrop = ({ addSelectedFiles }) => {
    const fileInputRef = useRef();
    const [isDragging, setIsDragging] = useState(false);

    const onAddFilesClicked = () => {
        fileInputRef.current.click();
    };

    const onFileInputChange = async (e) => {
        e.preventDefault();
        const files = Array.from(e.target.files);
        const validFiles = validateAndFormatFiles(files)
        addSelectedFiles(validFiles);
    };

    const handleOnDrop = (e) => {
        e.preventDefault();
        const newFiles = Array.from(e.dataTransfer.files);
        const newValidFiles = validateAndFormatFiles(newFiles)
        addSelectedFiles(newValidFiles);
        setIsDragging(false)
    }

    const handleOnDragOver = (e) => {
        e.preventDefault();

        setIsDragging(true);
    }



    return (
        <div
            className={`p-2 m-2 d-flex justify-content-center align-items-center drag-n-drop ${isDragging ? "on-drag" : ""}`}
            onDragOver={handleOnDragOver}
            onDragLeave={() => {
                setIsDragging(false)
            }}
            onDrop={handleOnDrop}
        >
            <div className="d-flex flex-column align-items-center justify-content-center">
                <FontAwesomeIcon
                    icon={faCloudArrowUp}
                    className="cloud-color"
                    size="3x"
                />
                <p className="py-1"> {isDragging ? "Drop your files here" : "Drag and Drop your files here"}</p>
                <button
                    type="button"
                    className="btn btn-outline-primary btn-lg btn-lgg"
                    onClick={onAddFilesClicked}
                >
                    Add Files
                </button>
            </div>

            <input
                type="file"
                className="hide-input"
                ref={fileInputRef}
                onChange={onFileInputChange}
                name="images"
                accept="image/*"
                multiple
            />
        </div>
    )
}

export default DragDrop