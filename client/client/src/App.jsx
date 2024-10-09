import { useState } from "react";
import "./App.css";

function App() {
  const [singleFile, setSingleFile] = useState(null); // variable
  const [multipleFiles, setMultipleFiles] = useState([]);
  const [fetchedSingleFile, setFetchedSingleFile] = useState(null);
  const [fetchedMultipleFiles, setFetchedMultipleFiles] = useState([]);
  const [dogImageUrl, setDogImageUrl] = useState(null);

  // Handle file input for single upload
  const handleSingleFileChange = (e) => {
    setSingleFile(e.target.files[0]);
  };

  const handleMultipleFilesChange = (e) => {
    setMultipleFiles(e.target.files);
  };

  // const handleDogImageChange = (e) => {
  //   setDogImageUrl(e.target.files[0]);
  // };

  // Upload a single file to the server
  const uploadSingleFile = async () => {
    const formData = new FormData();
    formData.append("file", singleFile);

    try {
      const response = await fetch("http://localhost:8000/save/single", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error("Error uploading single file:", error);
    }
  };

  // Upload multiple files to the server
  const uploadMultipleFiles = async () => {
    const formData = new FormData();
    for (let i = 0; i < multipleFiles.length; i++) {
      formData.append("files", multipleFiles[i]);
    }

    try {
      const response = await fetch("http://localhost:8000/save/multiple", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error("Error uploading multiple files:", error);
    }
  };

  const fetchSingleFile = async () => {
    try {
      const response = await fetch("http://localhost:8000/fetch/single");
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setFetchedSingleFile(url);
    } catch (error) {
      console.error("Error fetching single file:", error);
    }
  };

  const fetchMultipleFile = async () => {
    const imageFetching = [];
    try {
      for (let i = 0; i < 3; i++) {
        imageFetching.push(
          fetch("http://localhost:8000/fetch/single").then((response) =>
            response.blob()
          )
        );
      }
      Promise.all(imageFetching).then((blobs) => {
        const imageUrls = blobs.map((blob) => URL.createObjectURL(blob));
        setFetchedMultipleFiles(imageUrls);
      });
    } catch (error) {
      console.error("Error fetching multiple file:", error);
    }
  };

  const fetchRandomDogImage = async () => {
    try {
      const response = await fetch("https://dog.ceo/api/breeds/image/random");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("Fetched Dog image: " + data.message);
      setDogImageUrl(data.message); // Update state with the image URL
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  // const downloadDogImage = async (url) => {
  //   try {
  //     const response = await fetch(url);
  //     if (!response.ok) {
  //       throw new Error("Network response was not ok");
  //     }
  //     return await response.blob();
  //   } catch (error) {
  //     console.error("There was a problem with the fetch operation:", error);
  //   }
  // };

  // Upload a single file to the server
  const uploadDogImage = async () => {
    try {
      const imageBlob = await fetch(dogImageUrl).then((response) => 
                                  response.blob());
      const formData = new FormData();
      formData.append("file", imageBlob, "dog-image.jpg");
      const response = await fetch("http://localhost:8000/save/single", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error("Error uploading single file:", error);
    }
  };

  return (
    <div className="container">
      <h1>File Upload and Fetch App</h1>

      {/* Section for uploading single file */}
      <div className="section">
        <h2>Upload Single File</h2>
        <input type="file" onChange={handleSingleFileChange} />
        <button onClick={uploadSingleFile}>Upload Single File</button>
      </div>

      {/* Section for uploading multiple files */}
      <div className="section">
        <h2>Upload Multiple Files</h2>
        <input type="file" multiple onChange={handleMultipleFilesChange} />
        <button onClick={uploadMultipleFiles}>Upload Multiple Files</button>
      </div>

      <div className="section">
        <h2>Fetch Single File</h2>
        <button onClick={fetchSingleFile}>Fetch Single File</button>
        {fetchedSingleFile && (
          <div>
            <h2>single</h2>
            <img
              src={fetchedSingleFile}
              alt="Fetched Single"
              style={{ width: "200px", marginTop: "10px" }}
            />
          </div>
        )}
      </div>
      <div className="section"> 
        <h2>Fetch Multiple File</h2>
        <button onClick={fetchMultipleFile}>Fetch Multiple Files</button>
        {fetchedMultipleFiles && (
          <div>
            {fetchedMultipleFiles.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Fetched Multiple ${index}`}
                style={{ width: "200px", marginTop: "10px" }}
              />
            ))}
          </div>
        )}
      </div>
      <div className="section">
        <h2>Fetch Random Dog Image</h2>
        <button onClick={fetchRandomDogImage}>Fetch Random Dog Image</button>
        {dogImageUrl && (
          <div>
            <img
              src={dogImageUrl}
              alt="Fetched Dog Image"
              style={{ width: "200px", marginTop: "10px" }}
            />
            <button onClick={uploadDogImage}>Upload Dog Image</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
