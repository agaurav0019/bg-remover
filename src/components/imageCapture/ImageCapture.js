import React, { useRef, useEffect } from "react";
import "./ImageCapture.css";

const ImageCapture = (props) => {
  let videoRef = useRef(null);

  const getUserCamera = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        let video = videoRef.current;

        if ("srcObject" in video) {
          let oldStream = video.srcObject;
          if (oldStream instanceof MediaStream) {
            oldStream.getTracks().forEach((track) => track.stop());
          }
        }

        video.srcObject = stream;

        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.error("Error starting video playback:", error);
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const captureImageHandler = () => {
    let height = 300;
    let width = 300;
    let video = videoRef.current;
    let canvas = document.createElement("canvas");
    canvas.height = height;
    canvas.width = width;
    let ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas data to data URL
    const dataUrl = canvas.toDataURL();
    props.capturedImageData(dataUrl);
  };

  useEffect(() => {
    getUserCamera();
  }, [videoRef]);

  return (
    <div className="container">
      <video className="container canvas-custom" ref={videoRef}></video>
      <div>
        <button className="btn btn-danger" onClick={captureImageHandler}>
          Take Selfie
        </button>
      </div>
    </div>
  );
};

export default ImageCapture;
