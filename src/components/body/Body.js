import React, { useState } from "react";
import "./Body.css";
import ImageCapture from "../imageCapture/ImageCapture";

const Body = () => {
  debugger;
  const [selectedImage, setSelectedImage] = useState(null);
  const [WebCamImage, setWebcamImage] = useState(null);
  const [webCamblobImg, setWebcamBlobImg] = useState(null);
  const [takeSelfie, setTakeSelfie] = useState(false);
  const [removedBackground, setRemovedBackground] = useState(null);

  const onSelfieButtonHandler = () => {
    setTakeSelfie(true);
    setRemovedBackground(null);
    setWebcamImage(null);
    setSelectedImage(null);
  };

  const onImageChangeHandler = (event) => {
    debugger;
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

  const handleRemoveBackground = async () => {
    const image = selectedImage || webCamblobImg;
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
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="mt-4">
        <div className="mt-4 p-3">
          <div className="text-white fs-3 fw-bold mb-3 mt-4 text-center">
            Choose image to remove background
          </div>
          <div className="mb-3">
            <div className="d-flex justify-content-center mb-3">
              <input
                type="file"
                accept=".jpg, .jpeg, .png, .gif"
                className="form-control w-75"
                onChange={onImageChangeHandler}
              ></input>
            </div>
          </div>
          <div className="d-flex justify-content-center mb-3">
            <div>
              <button
                className="btn btn-md btn-primary me-2"
                onClick={onSelfieButtonHandler}
              >
                Take Selfie
              </button>
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
                  <img
                    src={
                      WebCamImage
                        ? WebCamImage
                        : selectedImage
                        ? URL.createObjectURL(selectedImage)
                        : ""
                    }
                    className="img-thumbnail rounded img-custom m-2"
                    alt=""
                  />
                  {!removedBackground && (
                    <div>
                      <button
                        className="btn btn-md btn-danger mt-3"
                        onClick={handleRemoveBackground}
                      >
                        Erase background
                      </button>
                    </div>
                  )}
                </>
              )
            )}
            {removedBackground && (
              <img
                className="img-thumbnail rounded img-custom m-2"
                src={removedBackground}
                alt="img"
              />
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
