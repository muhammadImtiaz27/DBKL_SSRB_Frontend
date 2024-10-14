import config from './config.js';

const video = document.getElementById("video");
const btnTakePicture = document.getElementById("btnTakePicture");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const formTennant = document.getElementById("formTennant");
const inputICNumber = document.getElementById("inputICNumber");
const btnSubmit = document.getElementById("btnSubmit");

let tennantICNumber, tennantImage, tennantLocation, tennantLatitude, tennantLongitude;

function geoLocationSuccess(position) {
  console.log("User's current location:");
  console.log(position);

  // Destructure latitude and longitude
  tennantLatitude = position.coords.latitude;
  tennantLongitude = position.coords.longitude;
  const tennantLocation = `${tennantLatitude}, ${tennantLongitude}`;

  // Submit the tennant's data to the API
  submitTennantData(tennantICNumber, tennantImage, tennantLocation)
  .then((data) => {
    console.log("API call succeeded:", data);
    alert("API call succeeded: " + JSON.stringify(data));
  })
  .catch((error) => {
    console.error("API call failed:", error);
    alert("API call failed: " + error);
  });
}

// When Geolocation fails to get user's current location
function geoLocationFail() {
  alert("Could not get your current position.");
}

// Submit the tennant data to the API
async function submitTennantData(ic, image, location) {
  // Create a FormData object
  const formData = new FormData();

  console.log("Submitting tennant data to the API...:", ic, image, location); 

  // Append the tenant's IC number, image, latitude, and longitude to the FormData object
  formData.append("IC", ic);
  formData.append("Selfie", image);
  formData.append("Location", location);

  try {
    // Make a POST request to the API endpoint
    let response = await fetch(config.apiUrl+'/tenant/verify', {
      method: "POST",
      body: formData,
    });

    let responseText = await response.text();
    if (!response.ok) {
      // Extract error message from response body
      let errorString = getErrorMessageFromResponseBody(responseText);
      throw new Error(errorString); // API errors get thrown here
    }
    // Parse the response JSON
    let responseJson = JSON.parse(responseText);

    console.log("Success:", responseJson);

    // Return the response JSON
    return responseJson;
  } catch (error) {
    // Handle all errors here
    console.error("Error:", error.message);
    return error.message;
  }
}

// Extract error message from response body
function getErrorMessageFromResponseBody(string) {
  let errorString = string;

  try {
    let json = JSON.parse(string);
    if (json.message) {
      errorString = json.message;
    }
  } catch (parseOrAccessError) {}

  return errorString;
}


// Request permission to access user's camera
navigator.mediaDevices
  .getUserMedia({ video: true })
  .then((stream) => {
    // If user granted access
    btnTakePicture.removeAttribute("disabled");
    btnSubmit.removeAttribute("disabled");
    video.srcObject = stream;
    video.play();
  })
  .catch((err) => {
    // If user did not grant access or an error occurred.
    console.log("An error occurred: " + err);
  });

// Capture the image when the Take Picture button is clicked
btnTakePicture.addEventListener("click", () => {
  // Set the canvas dimensions to match the video
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  // Draw the video frame to the canvas
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
});

// When the user click the Submit button
formTennant.addEventListener("submit", function (e) {
  // Prevent the form from submitting the traditional way
  e.preventDefault();

  // Extract Tennant's IC Number from the input
  tennantICNumber = inputICNumber.value;

  // Capture image from canvas and convert to File
  canvas.toBlob((blob) => {
    // Convert the Blob to a File
    tennantImage = new File([blob], "tennantImage.jpg", { type: blob.type });

    // Get user's current location
    // First, check if navigator is supported by the browser
    if (navigator.geolocation) {
      // If navigator exists, attempt to get user's current location
      navigator.geolocation.getCurrentPosition(geoLocationSuccess, geoLocationFail);
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  });
});