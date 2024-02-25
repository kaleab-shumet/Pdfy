import "./DragDrop.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import ImageListItem from "../ImageListItem/ImageListItem";
import { ReactSortable } from "react-sortablejs";
import { v4 as uuidv4 } from "uuid";
import { jsPDF } from "jspdf";
import {
  getImageDimensions,
  readFileAsDataURL,
  removeFileExtension,
  validateFileType,
} from "../../utils/utils";

const DragDrop = () => {
  const fileInputRef = useRef();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedSortableFiles, setSelectedSortableFiles] = useState([]);
  const [isImageSelectorChanged, setImageSelectorChanged] = useState(false);


  const [pageOrientation, setPageOrientaion] = useState('p')
  const [pageSize, setPageSize] = useState('fit')
  const [pageMargin, setPageMargin] = useState(20)

  const onAddFilesClicked = () => {
    setSelectedFiles(newSelectedFilesBasedOnSorting());
    fileInputRef.current.click();
  };

  const onFileInputChange = async (e) => {
    e.preventDefault();
    const files = e.target.files;
    await imageSelectorOnChange(Array.from(files));
  };

  const imageSelectorOnChange = async (files) => {
    console.log("files", files);
    const validFiles = files
      .filter((f) => validateFileType(f))
      .map((f) => ({ f, fileid: uuidv4() }));

    setSelectedFiles([...selectedFiles, ...validFiles]);
    setImageSelectorChanged(true);
  };

  const removeImage = (fileid) => {
    console.log("Removing Image ...");

    const newSortedFiles = selectedSortableFiles.filter((s) => s.fileid !== fileid);
    const newSelectedFiles = selectedFiles.filter((s) => s.fileid !== fileid);

    setSelectedSortableFiles(newSortedFiles);
    setSelectedFiles(newSelectedFiles);
  };

  useEffect(() => {
    if (isImageSelectorChanged) {
      setImageSelectorChanged(false);
      const display = async () => {
        const ssf = [];
        for (const { fileid, f } of selectedFiles) {
          const imgSrc = await readFileAsDataURL(f);
          const fileName = f.name;
          const fileSize = f.size;
          ssf.push({ fileid, imgSrc, fileName, fileSize });
        }
        setSelectedSortableFiles(ssf);
      };

      display();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFiles]);

  const newSelectedFilesBasedOnSorting = () => {
    const sortedFileidArray = selectedSortableFiles.map((m) => m.fileid);
    const newSortedSelectedFiles = [];
    for (const sf of sortedFileidArray) {
      const foundFile = selectedFiles.find((f) => f.fileid === sf);
      if (foundFile) {
        newSortedSelectedFiles.push(foundFile);
      }
    }
    return newSortedSelectedFiles;
  };

  const pageSelector = (orientation, size) => {



    if (typeof size === 'string') {
      return {
        orientation,
        format: size,
      }
    }

    else if (typeof size == 'object') {
      const { width, height } = size
      const orientation = height > width ? "p" : "l"

      return {
        orientation,
        format: [width, height]
      }
    }

  }

  const handleConvert = () => {
    const newSortedSelectedFiles = newSelectedFilesBasedOnSorting();


    if (newSortedSelectedFiles.length > 0) {

      const pdfFilename = removeFileExtension(newSortedSelectedFiles[0].f.name) + ".pdf"

      const convert = async () => {

        console.log({ newSortedSelectedFiles });

        let doc = undefined;

        let i = 0
        for (const { fileid, f } of newSortedSelectedFiles) {
          const imageBase64 = await readFileAsDataURL(f)
          const { width, height } = await getImageDimensions(f)
          const pdfSetting = pageSize === 'fit' ? pageSelector(pageOrientation, { width, height }) : pageSelector(pageOrientation, pageSize)

          const options = {
            unit: 'px',
            compress: true,
            hotfixes: ['px_scaling'],
            ...pdfSetting
          }

          console.log(options);
          console.log(pdfSetting);
          if (i < 1) {
            doc = new jsPDF(options)

          }
          else {
            if (pageSize === 'fit')
              doc.addPage([width, height], height > width ? "p" : "l")

            else {
              doc.addPage(pageSize)
            }
          }

          const pdfPageWidth = doc.internal.pageSize.getWidth()
          const pdfPageHeight = doc.internal.pageSize.getHeight()

          console.log({ pdfPageWidth, pdfPageHeight });
          console.log({ width, height });

          const widthFactor = width / pdfPageWidth
          const heightFactor = height / pdfPageHeight


          const maxFactor = pageSize === 'fit' ? 1 : Math.max(widthFactor, heightFactor)
          let calcSize = undefined

          if (maxFactor > 1) {

            calcSize = {
              width: (width / maxFactor) - (2 * pageMargin),
              height: (height / maxFactor) - (2 * pageMargin)
            }

          }
          else {
            calcSize = {
              width: width - (2 * pageMargin),
              height: height - (2 * pageMargin)
            }
          }




          const alignXStart = Math.abs(pdfPageWidth - calcSize.width) / 2
          const alignYStart = Math.abs(pdfPageHeight - calcSize.height) / 2



          doc.addImage(imageBase64, 'JPEG', alignXStart, alignYStart, calcSize.width, calcSize.height)
          i++;
        }

        doc.save(pdfFilename);
      }

      convert()

    }

  };

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


      <div className="row">

        <div className="col-12 col-md-6">
          <ReactSortable
            handle=".handle"
            animation={200}
            delayOnTouchStart={true}
            delay={2}
            list={selectedSortableFiles}
            setList={setSelectedSortableFiles}
          >
            {selectedSortableFiles.map((item) => (
              <ImageListItem
                key={item.fileid}
                {...item}
                onRemove={() => removeImage(item.fileid)}
              />
            ))}
          </ReactSortable>
        </div>

        <div className="col-12 col-md-6">

          {selectedSortableFiles.length > 0 && (
            <div className="d-flex flex-column justify-content-center m-3 p-2">

              <div className="d-flex flex-column">

                <label className="m-2">
                  Page Size:
                  <select className="form-select">
                    <option value="fit">Fit Image size</option>
                    <option value="a4">A4</option>
                    <option value="letter">Letter</option>
                  </select>
                </label>

                <label className="m-2">
                  Page Orientation:
                  <select className="form-select">
                    <option value="p">Portrait</option>
                    <option value="l">Landscape</option>
                  </select>
                </label>


              </div>



              <button
                type="button"
                className="btn btn-primary btn-lg btn-block orange-btn m-2"
                onClick={handleConvert}
              >
                Convert
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DragDrop;
