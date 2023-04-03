import React, { useState, useRef } from "react";
import "./App.css";

const filterOptions = [
  { id: "brightness", name: "Brightness" },
  { id: "saturation", name: "Saturation" },
  { id: "inversion", name: "Inversion" },
  { id: "grayscale", name: "Grayscale" },
];
function App() {
  const [previewImg, setPreviewImg] = useState(null);
  const [activeFilter, setActiveFilter] = useState("brightness");
  const [sliderValue, setSliderValue] = useState(100);
  const [brightness, setBrightness] = useState("100");
  const [saturation, setSaturation] = useState("100");
  const [inversion, setInversion] = useState("0");
  const [grayscale, setGrayscale] = useState("0");
  const [rotate, setRotate] = useState(0);
  const [flipHorizontal, setFlipHorizontal] = useState(1);
  const [flipVertical, setFlipVertical] = useState(1);
  const fileInputRef = useRef(null);
  const previewImgRef = useRef(null);
  const loadImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreviewImg(file);
    resetFilter();
  };

  const applyFilter = () => {
    previewImgRef.current.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
    previewImgRef.current.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;
  };

  const resetFilter = () => {
    setBrightness("100");
    setSaturation("100");
    setInversion("0");
    setGrayscale("0");
    setRotate(0);
    setFlipHorizontal(1);
    setFlipVertical(1);
    setActiveFilter("brightness");
    setSliderValue(100);
  };

  const saveImage = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const image = new Image();
    image.onload = () => {
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;

      ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
      ctx.translate(canvas.width / 2, canvas.height / 2);
      if (rotate !== 0) {
        ctx.rotate((rotate * Math.PI) / 180);
      }
      ctx.scale(flipHorizontal, flipVertical);
      ctx.drawImage(
        image,
        -canvas.width / 2,
        -canvas.height / 2,
        canvas.width,
        canvas.height
      );

      const link = document.createElement("a");
      link.download = "image.jpg";
      link.href = canvas.toDataURL();
      link.click();
    };

    image.src = URL.createObjectURL(previewImg);
  };

  const handleFilterClick = (option) => {
    setActiveFilter(option.id);

    switch (option.id) {
      case "brightness":
        setSliderValue(brightness);
        break;
      case "saturation":
        setSliderValue(saturation);
        break;
      case "inversion":
        setSliderValue(inversion);
        break;
      default:
        setSliderValue(grayscale);
    }
  };
  const handleSliderChange = (event) => {
    setSliderValue(event.target.value);
    switch (activeFilter) {
      case "brightness":
        setBrightness(event.target.value);
        break;
      case "saturation":
        setSaturation(event.target.value);
        break;
      case "inversion":
        setInversion(event.target.value);
        break;
      default:
        setGrayscale(event.target.value);
    }
  };
  const handleRotate = (option) => {
    if (option === "left") {
      setRotate(rotate - 90);
    } else if (option === "right") {
      setRotate(rotate + 90);
    } else if (option === "horizontal") {
      setFlipHorizontal(flipHorizontal === 1 ? -1 : 1);
    } else {
      setFlipVertical(flipVertical === 1 ? -1 : 1);
    }
  };
  return (
    <div className={`container ${!previewImg ? "disable" : ""}`}>
      <h2>Easy Image Editor</h2>
      <div className="wrapper">
        <div className="editor-panel">
          <div className="filter">
            <label className="title">Filters</label>

            <div className="options">
              {filterOptions.map((option) => (
                <button
                  key={option.id}
                  id={option.id}
                  className={activeFilter === option.id ? "active" : ""}
                  onClick={() => handleFilterClick(option)}
                >
                  {option.name}
                </button>
              ))}
            </div>
            <div className="slider">
              <div className="filter-info">
                <p className="name">{activeFilter}</p>
                <p className="value">{`${sliderValue}%`}</p>
              </div>
              <input
                type="range"
                min="0"
                max={
                  activeFilter === "brightness" || activeFilter === "saturation"
                    ? "200"
                    : "100"
                }
                value={sliderValue}
                onChange={handleSliderChange}
              />
            </div>
          </div>
          <div className="rotate">
            <label className="title">Rotate & Flip</label>
            <div className="options">
              <button id="left" onClick={() => handleRotate("left")}>
                <i className="fa-solid fa-rotate-left"></i>
              </button>
              <button id="right" onClick={() => handleRotate("right")}>
                <i className="fa-solid fa-rotate-right"></i>
              </button>
              <button
                id="horizontal"
                onClick={() => handleRotate("horizontal")}
              >
                <i className="bx bx-reflect-vertical"></i>
              </button>
              <button id="vertical" onClick={() => handleRotate("vertical")}>
                <i className="bx bx-reflect-horizontal"></i>
              </button>
            </div>
          </div>
        </div>
        <div className="preview-img">
          {previewImg ? (
            <img
              src={URL.createObjectURL(previewImg)}
              alt="preview"
              ref={previewImgRef}
              onLoad={applyFilter}
            />
          ) : (
            <img src="image-placeholder.svg" alt="preview-img" />
          )}
        </div>
      </div>
      <div className="controls">
        <button className="reset-filter" onClick={resetFilter}>
          Reset Filters
        </button>
        <div className="row">
          <input
            type="file"
            className="file-input"
            accept="image/*"
            hidden
            ref={fileInputRef}
            onChange={loadImage}
          />
          <button
            className="choose-img"
            onClick={() => fileInputRef.current.click()}
          >
            Choose Image
          </button>
          <button onClick={saveImage} className="save-img">
            Save Image
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
