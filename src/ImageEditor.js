import React, { useState, useRef, useEffect } from 'react';
import './ImageEditor.css'; // Create a separate CSS file for styling

const ImageEditor = () => {
    const [image, setImage] = useState(null);
    const [referenceImage, setReferenceImage] = useState(null);
    const [adjustedImage, setAdjustedImage] = useState(null);
    const [brightness, setBrightness] = useState(100);
    const [sharpen, setSharpen] = useState(0);
    const [greyscale, setGreyscale] = useState(false);
  
    const imgRef = useRef();
  
    useEffect(() => {
      if (image) {
        setReferenceImage(image);
        applyAdjustments();
      }
    }, [image, brightness, sharpen, greyscale]);
  
    const applyAdjustments = () => {
      if (referenceImage) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = referenceImage.width;
        canvas.height = referenceImage.height;
  
        // Apply brightness
        ctx.filter = `brightness(${brightness}%)`;
  
        // Draw the reference image onto the canvas
        ctx.drawImage(referenceImage, 0, 0, referenceImage.width, referenceImage.height);
  
        // Apply sharpening
        if (sharpen > 0) {
            const extremeSharpen = 10; // Set to a higher value for extreme sharpening
            ctx.filter += ` contrast(110%) brightness(90%) saturate(200%) blur(${extremeSharpen}px)`;
          }
  
        // Apply greyscale conversion
        if (greyscale) {
          ctx.filter = 'grayscale(100%)';
        }
  
        const adjustedImg = new Image();
        adjustedImg.src = canvas.toDataURL();
        setAdjustedImage(adjustedImg);
      }
    };
  
    const handleBrightnessChange = (event) => {
      setBrightness(event.target.value);
    };
  
    const handleSharpenChange = (event) => {
      setSharpen(event.target.value);
    };
  
    const handleGreyscaleToggle = () => {
      setGreyscale(!greyscale);
    };
  
    const handleFileChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.src = e.target.result;
          setImage(img);
        };
        reader.readAsDataURL(file);
      }
    };
  
    const handleReset = () => {
      setBrightness(100);
      setSharpen(0);
      setGreyscale(false);
      setAdjustedImage(null);
      setImage(image); // Clear the uploaded image
      setReferenceImage(image); // Clear the reference image
    };

  return (
    <div className="image-editor-container">
       <div  class="grid-container">
        <div className="left-half">
            <input type="file" accept="image/*" onChange={handleFileChange} className='file-input'/>
           
        </div>
        <div className="right-half" >
            {image && <img ref={imgRef} src={image.src} alt="Selected" className='grid-image contain' />}
        </div>
        <div className="right-half">
            {/* Show the effect of parameter changes on the adjusted image */}
            {adjustedImage && <img src={adjustedImage.src} alt="Effect" className="effect-image grid-image contain" />}
        </div>
        <div className="left-half">
            <label htmlFor="brightness">Brightness:</label>
            <input
            type="range"
            id="brightness"
            min="0"
            max="200"
            value={brightness}
            onChange={handleBrightnessChange}
            />
            <br />
            <br />
          <label htmlFor="sharpen">Sharpen:</label>
          <input
            type="range"
            id="sharpen"
            min="0"
            max="10"
            step="0.1"
            value={sharpen}
            onChange={handleSharpenChange}
          />
          <br />
          <br />
          <button onClick={handleGreyscaleToggle}>
            {greyscale ? 'Disable Greyscale' : 'Enable Greyscale'}
          </button>
          <br />
          <br />
            <button onClick={handleReset}>Reset</button>
        </div>
        </div>
        
        
    </div>
  );
};

export default ImageEditor;