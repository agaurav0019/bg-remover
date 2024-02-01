import React from "react";
import "./Body.css";

const Body = (props) => {
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
                className="form-control w-75"
                onChange={props.onImageChangeHandler}
              ></input>
            </div>
          </div>
          <div className="text-center mt-5">
            {props.selectedImage && (
              <img
                src={
                  props.selectedImage
                    ? URL.createObjectURL(props.selectedImage)
                    : ""
                }
                className="img-thumbnail rounded img-custom"
                alt=""
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Body;
