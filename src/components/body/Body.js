import React, { useState } from "react";
import "./Body.css";
import ImageCapture from "../imageCapture/ImageCapture";
import FaceDetection from "../faceDetection/FaceDetection";

const Body = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [WebCamImage, setWebcamImage] = useState(null);
  const [webCamblobImg, setWebcamBlobImg] = useState(null);
  const [takeSelfie, setTakeSelfie] = useState(false);
  const [removedBackground, setRemovedBackground] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [showLoader, setShowLoader] = useState(false);

  const onSelfieButtonHandler = () => {
    setTakeSelfie(true);
    setRemovedBackground(null);
    setWebcamImage(null);
    setSelectedImage(null);
  };

  const onImageChangeHandler = (event) => {
    setSelectedImage(event.target.files[0]);
    setWebcamImage(null);
    setWebcamBlobImg(null);
    setRemovedBackground(null);
    setTakeSelfie(false);
  };

  const capturedImageData = (e) => {
    setTakeSelfie(false);
    setWebcamImage(e);
    setSelectedImage(null);
    const blob = dataURLtoBlob(e);
    setWebcamBlobImg(blob);
  };

  function dataURLtoBlob(dataURL) {
    const splitDataUrl = dataURL.split(",");
    const type = splitDataUrl[0].match(/:(.*?);/)[1];
    const byteString = atob(splitDataUrl[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }

    return new Blob([arrayBuffer], { type });
  }

  const handleRemoveBackground = async (isOriginal) => {
    setShowLoader(true);
    const blob = croppedImage && dataURLtoBlob(croppedImage);
    const image = isOriginal ? selectedImage || webCamblobImg : blob;
    const apiKey = "gmtqSpEVk4tTU5jXwqrjpq31";
    const apiUrl = "https://api.remove.bg/v1.0/removebg";

    const formData = new FormData();
    formData.append("image_file", image, image.name);
    formData.append("size", "auto");

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "X-Api-Key": apiKey,
        },
        body: formData,
      });

      const data = await res.blob();

      const reader = new FileReader();
      reader.onloadend = () => setRemovedBackground(reader.result);
      reader.readAsDataURL(data);
      setShowLoader(false);
    } catch (error) {
      console.log(error);
      setShowLoader(false);
    }
  };

  const getCroppedImage = (event) => {
    setCroppedImage(event);
  };

  return (
    <>
      {showLoader && (
        <>
          <div className="wrapper"></div>
          <div className="overlay show"></div>
          <div className="spanner show">
            <div className="loader"></div>
            <p>In Progress</p>
          </div>
        </>
      )}
      <div className="mt-4">
        <div className="mt-4 p-3">
          <div className="text-white fs-3 fw-bold mb-3 mt-4 text-center">
            Choose image to remove background
          </div>
          <div className="mb-3">
            <div className="d-flex justify-content-center mb-3">
              <div className="d-flex btn-container">
                <div className="file">
                  <label htmlFor="input-file">Select a file</label>
                  <input
                    id="input-file"
                    type="file"
                    accept=".jpg, .jpeg, .png, .gif"
                    className="form-control w-75"
                    onChange={onImageChangeHandler}
                  />
                </div>
                <div>
                  <button
                    className="btn btn-md capture-image"
                    onClick={onSelfieButtonHandler}
                  >
                    Take Selfie
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="container text-center mt-5">
            {takeSelfie ? (
              <ImageCapture
                capturedImageData={capturedImageData}
              ></ImageCapture>
            ) : (
              (WebCamImage || selectedImage) && (
                <>
                  <div>
                    <FaceDetection
                      getCroppedImage={getCroppedImage}
                      imgUrl={
                        WebCamImage
                          ? WebCamImage
                          : selectedImage
                          ? URL.createObjectURL(selectedImage)
                          : ""
                      }
                    ></FaceDetection>
                  </div>
                  {removedBackground && (
                    <div>
                      <img
                        className="img-thumbnail rounded img-custom m-2"
                        src={removedBackground}
                        alt="img"
                      />
                    </div>
                  )}
                  {!removedBackground && (
                    <>
                      <h2 className="mt-3">Erase Background</h2>
                      <div className="d-flex justify-content-center">
                        <div className="m-2">
                          <button
                            className="btn btn-md btn-danger mt-3"
                            onClick={() => {
                              handleRemoveBackground(true);
                            }}
                          >
                            Original Image
                          </button>
                        </div>
                        <div className="m-2">
                          <button
                            className="btn btn-md btn-danger mt-3"
                            onClick={() => {
                              handleRemoveBackground(false);
                            }}
                          >
                            Cropped Img
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </>
              )
            )}
          </div>
          {removedBackground && (
            <div className="d-flex form-check form-switch justify-content-center mt-5">
              <a
                className="w-full"
                href={removedBackground}
                download={"save.png"}
              >
                <button className="btn btn-success btn-md">Download</button>
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Body;
