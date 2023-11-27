import React, { useState } from 'react';
import { Canvas } from './Canvas';

import './App.css';

const REACT_APP_AUTH_TOKEN = "Bearer VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM"
// Use authToken in your API requests or wherever needed
const authToken = REACT_APP_AUTH_TOKEN;





// Function to generate images based on user input
async function generate(query) {
  let data = { "inputs": query };
  const response = await fetch(
    "https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud",
    {
      headers: {
        "Accept": "image/png",
        "Authorization": authToken,
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify(data),
    }
  );
  const result = await response.blob();
  const imageUrl = URL.createObjectURL(result);
  console.log(result, " ->", imageUrl);
  return imageUrl;
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: 'Generate your Imagination Here',
      data: false,
      pages: 1,
      generated_images: [],
      send_to: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // Function to add an image to the generated_images state
  addImage = (newImage) => {
    this.setState((prevState) => ({
      generated_images: [...prevState.generated_images, newImage]
    }));
  };

  // Function to handle changes in the text area
  handleChange(event) {
    this.setState({ query: event.target.value });
  }

  // Function to handle form submission
  handleSubmit(event) {
    event.preventDefault();
    let data = { "inputs": this.state.query };
    this.setState({ data: true });

    // Fetch image from the generator API
    fetch("https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud",
      {
        headers: {
          "Accept": "image/png",
          "Authorization": "Bearer VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM",
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(data),
      })
      .then((response) => response.blob())
      .then((blob) => {
        const imageUrl = URL.createObjectURL(blob);
        this.addImage(imageUrl);
        this.setState({ data: false });
      });
  }

  // Function to add an element to the send_to state
  addToSendTo = (newElement) => {
    this.setState((prevState) => {
      const existingIds = prevState.send_to.map((element) => element.id);

      // Check if the new element's id is not already in the array
      if (!existingIds.includes(newElement.id)) {
        return { send_to: [...prevState.send_to, newElement] };
      }

      return null; // No need to update state if the element is already in send_to
    });
  };

  // Function to add an image to the canvas
  addToCanvas(index) {
    const newImage = this.state.generated_images[index];
    const newElement = {
      id: index,
      imageUrl: newImage,
      x: index,
      y: index,
    };
    this.addToSendTo(newElement);
  }

  render() {
    return (
      <div className="mid_body">
        <div className="left-side">
          <form onSubmit={this.handleSubmit}>
            <label>
              <h4>Write Description of the Comic Page:</h4>
              <textarea value={this.state.query} onChange={this.handleChange} />
            </label>
            <input className="btn btn-warning" type="submit" value="Submit" />
            <h4>{this.state.data ? "Generating, Rich Imagination Takes time to generate...." : ""}</h4>
          </form>
          <h2>Generated Images </h2>
          <div className="grid-container">
            {this.state.generated_images.map((item, index) => (
              <div className="grid-item" key={index}>
                <img src={item} height="300" width="280" alt="Converted Image" />
                <button onClick={() => this.addToCanvas(index)}>Add</button>
              </div>
            ))}
          </div>
        </div>

        <div className="right-side">
          <h2>Your comic page</h2>
          <Canvas image_urls={this.state.send_to} height="700" width="550"></Canvas>
        </div>
      </div>
    );
  }
}

export default App;
