import { useState } from "react";
import Navbar from "./components/Navbar";
import Body from "./components/body/Body";

function App() {

  const [selectedImage, setSelectedImage] = useState(null);

  const onChangeHandler =(event)=>{
    setSelectedImage(event.target.files[0]);
  }

  return (
    <div className="App">
      <Navbar></Navbar>
      <Body onImageChangeHandler={onChangeHandler} selectedImage={selectedImage}></Body>
    </div>
  );
}

export default App;
