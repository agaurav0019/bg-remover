import React, { useState, useEffect, useRef } from "react";
import * as faceapi from "face-api.js";
import "./FaceDetection.css";

const FaceDetection = (props) => {
  const [initializing, setInitializing] = useState(false);
  const image = props.imgUrl;
  const canvasRef = useRef();
  const imageRef = useRef();

  // I want to store cropped image in this state
  const [pic, setPic] = useState();

  useEffect(() => {
    const loadModels = async () => {
      setInitializing(true);
      Promise.all([
        // models getting from public/model directory
        faceapi.nets.tinyFaceDetector.load("/models"),
        faceapi.nets.faceLandmark68Net.load("/models"),
        faceapi.nets.faceRecognitionNet.load("/models"),
        faceapi.nets.faceExpressionNet.load("/models"),
      ])
        .then(console.log("success", "/models"))
        .then(handleImageClick)
        .catch((e) => {
            console.error(e);
            setPic(null);
            props.getCroppedImage(null);
        });
    };
    loadModels();
  }, [props.imgUrl]);

  const handleImageClick = async () => {
    if (initializing) {
      setInitializing(false);
    }
    canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(
      imageRef.current
    );
    const displaySize = {
      width: 500,
      height: 350,
    };
    faceapi.matchDimensions(canvasRef.current, displaySize);
    const detections = await faceapi.detectSingleFace(
      imageRef.current,
      new faceapi.TinyFaceDetectorOptions()
    );
    // .withFaceLandmarks();
    const resizeDetections = faceapi.resizeResults(detections, displaySize);
    canvasRef.current
      .getContext("2d")
      .clearRect(0, 0, displaySize.width, displaySize.height);
    faceapi.draw.drawDetections(canvasRef.current, resizeDetections);
    // faceapi.draw.drawFaceLandmarks(canvasRef.current, resizeDetections);
    console.log(
      `Width ${detections.box._width} and Height ${detections.box._height}`
    );
    extractFaceFromBox(imageRef.current, detections.box);
    console.log(detections);
  };

  async function extractFaceFromBox(imageRef, box) {
    const regionsToExtract = [
      new faceapi.Rect(box.x-50, box.y-50, box.width+100, box.height+100),
    ];
    let faceImages = await faceapi.extractFaces(imageRef, regionsToExtract);

    if (faceImages.length === 0) {
      console.log("No face found");
      setPic(null);
      props.getCroppedImage(null);
    } else {
      const outputImage = new Image();
      faceImages.forEach((cnv) => {
        outputImage.src = cnv.toDataURL();
        setPic(cnv.toDataURL());
        props.getCroppedImage(cnv.toDataURL());
      });
      console.log("face found ");
      console.log(pic);
    }
  };

  return (
    <>
      <div className="face-detection-container">
        <div
          className="display-flex justify-content-center"
          style={{ position: "relative" }}
        >
          <img
            ref={imageRef}
            src={image}
            alt="face"
            crossorigin="anonymous"
            style={{maxHeight:"350px"}}
            className="img-thumbnail rounded m-2"
          />
          <canvas ref={canvasRef} className="position-absolute" />
        </div>
        <br />
      </div>
      <div>
        {pic ? <img src={pic} alt="face" className="img-thumbnail rounded m-2" style={{maxHeight:"300px"}}/>:<>Unable to detect face</>}
      </div>
    </>
  );
};

export default FaceDetection;