import "./ConverterLayout.css";
import { useState, useEffect } from "react";
import ImageListItem from "../ImageListItem/ImageListItem";
import { ReactSortable } from "react-sortablejs";
import { jsPDF } from "jspdf";
import {
  getImageDimensions,
  readFileAsDataURL,
  removeFileExtension,
} from "../../utils/utils";
import DragDrop from "../DragDrop/DragDrop";

const ConverterLayout = () => {


  const [pageOrientation, setPageOrientaion] = useState('p')
  const [pageSize, setPageSize] = useState('fit')
  const [pageMargin, setPageMargin] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [numOfConversion, setNumOfConversion] = useState(0)
  const [selectedSortedFiles, setSelectedSortedFiles] = useState([])

  const [selectedSortableFilesDisplay, setSelectedSortableFilesDisplay] = new useState() // Uses on to display images

  const displayableFilesList = async (ssf = []) => {
    const newssf = [];
    for (const { fileid, f } of ssf) {
      const imgSrc = await readFileAsDataURL(f);
      const fileName = f.name;
      const fileSize = f.size;
      newssf.push({ fileid, imgSrc, fileName, fileSize });
    }
    return newssf
  }

  useEffect(() => {
    (async () => setSelectedSortableFilesDisplay(await displayableFilesList(selectedSortedFiles)))()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSortedFiles])



  const removeImage = (fileid) => {
    setSelectedSortedFiles(
      selectedSortedFiles.filter((s) => s.fileid !== fileid)
    );
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


  const addSelectedFiles = (newFiles) => {
    setSelectedSortedFiles([...selectedSortedFiles, ...newFiles])
  }

  const handleConvert = () => {

    if (selectedSortedFiles.length > 0) {

      setIsLoading(true)
      const pdfFilename = removeFileExtension(selectedSortedFiles[0].f.name) + ".pdf"

      const convert = async () => {

        let doc = undefined;

        let i = 0
        for (const { f } of selectedSortedFiles) {

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
        setIsLoading(false)
        setNumOfConversion(numOfConversion + 1)
      }

      convert()

    }

  };

  return (
    <div className="container">


      <DragDrop
        addSelectedFiles={addSelectedFiles}
      />



      {selectedSortedFiles.length > 0 && <div className="row border rounded p-3">

        <div className="col-12 col-md-6">
          <ReactSortable
            handle=".handle"
            animation={200}
            delayOnTouchStart={true}
            delay={2}
            list={selectedSortedFiles}
            setList={setSelectedSortedFiles}
          >
            {selectedSortableFilesDisplay.map((item) => (
              <ImageListItem
                key={item.fileid}
                {...item}
                onRemove={() => removeImage(item.fileid)}
              />
            ))}
          </ReactSortable>
        </div>

        <div className="col-12 col-md-6">

          {selectedSortedFiles.length > 0 && (
            <div className="d-flex flex-column justify-content-center m-3 p-2">

              <div className="d-flex flex-column">

                <label className="m-2">
                  Page Size:
                  <select className="form-select"
                    onChange={(e) => {
                      setPageSize(e.target.value)
                    }}
                  >
                    <option value="fit">Fit Image size</option>
                    <option value="a4">A4</option>
                    <option value="letter">Letter</option>
                  </select>
                </label>

                <label className="m-2">
                  Page Margin:
                  <select className="form-select"
                    onChange={(e) => {
                      setPageMargin(parseInt(e.target.value))
                    }} >
                    <option value="0">No Margin</option>
                    <option value="20">Small Margin</option>
                    <option value="40">Big Margin</option>
                  </select>
                </label>

                {(pageSize !== 'fit') &&
                  <label className="m-2">
                    Page Orientation:
                    <select className="form-select"
                      onChange={(e) => {
                        setPageOrientaion(e.target.value)
                      }}>
                      <option value="p">Portrait</option>
                      <option value="l">Landscape</option>
                    </select>
                  </label>
                }


              </div>


              {isLoading &&

                <div className="d-flex justify-content-center">
                  <span className="loader"></span>
                </div>
              }

              {numOfConversion > 0 && <p className="m-3"> <small> File is Automatically Downloaded, Please check your <u>Downloads</u> ! </small> </p>}



              <button
                type="button"
                className="btn btn-primary btn-lg btn-block orange-btn m-2"
                onClick={handleConvert}
                disabled={isLoading}
              >
                Convert
              </button>
            </div>
          )}
        </div>
      </div>
      }


    </div>
  );
};

export default ConverterLayout;
