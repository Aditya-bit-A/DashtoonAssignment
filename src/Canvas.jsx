import { useRef, useEffect, useState } from 'react';
import './Canvas.css'; // Import your styles

export function Canvas(props) {
  const canvasRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedImage, setDraggedImage] = useState(null);
  const [imagePositions, setImagePositions] = useState([]);

  useEffect(() => {
    // Function to load an image onto the canvas
    const loadImage = (url, x, y, width, height) => {
      const image = new Image();
      image.src = url;
      image.onload = () => {
        const context = canvas.getContext('2d');
        context.globalCompositeOperation = 'source-over'; // Draw on top of previously drawn image
        context.drawImage(image, x, y, width, height);
      };
    };

    // Clear canvas and fill with white background
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.fillStyle = 'white';
    context.fillRect(0, 0, props.width, props.height);

    // Load images onto the canvas based on props
    props.image_urls.forEach((url, index) => {
      const x = index * 120;
      const y = 0;
      loadImage(url.imageUrl, x, y, 200, 200);
      setImagePositions((prevPositions) => [...prevPositions, { x, y }]);
    });

  }, [props.image_urls]);

  // Mouse down event handler
  const handleMouseDown = (event) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const mouseX = event.nativeEvent.offsetX;
    const mouseY = event.nativeEvent.offsetY;

    // Check if the mouse is over an image
    for (let i = 0; i < imagePositions.length; i++) {
      const { x, y } = imagePositions[i];
      if (mouseX >= x && mouseX <= x + 100 && mouseY >= y && mouseY <= y + 100) {
        setIsDragging(true);
        setDraggedImage(i);
        break;
      }
    }
  };

  // Mouse move event handler
  const handleMouseMove = (event) => {
    if (isDragging) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      const mouseX = event.nativeEvent.offsetX;
      const mouseY = event.nativeEvent.offsetY;

      // Function to load an image onto the canvas
      const loadImage = (url, x, y, width, height) => {
        const image = new Image();
        image.src = url;
        image.onload = () => {
          context.globalCompositeOperation = 'source-over';
          context.drawImage(image, x, y, width, height);
        };
      };

      const newPositions = [...imagePositions];
      newPositions[draggedImage] = { x: mouseX - 50, y: mouseY - 50 };

      // Clear canvas and redraw images in new positions
      context.clearRect(0, 0, canvas.width, canvas.height);
      newPositions.forEach((position, index) => {
        const { x, y } = position;
        const imgObj = props.image_urls[index];
        loadImage(imgObj.imageUrl, x, y, 200, 200);
      });
      setImagePositions(newPositions);
    }
  };

  // Mouse up event handler
  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggedImage(null);
  };

  return (
    <canvas
      className='canva'
      ref={canvasRef}
      width={props.width}
      height={props.height}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    />
  );
}
