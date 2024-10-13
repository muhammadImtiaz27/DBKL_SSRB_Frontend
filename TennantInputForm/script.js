const video = document.getElementById("video");
const btnTakePicture = document.getElementById("btnTakePicture");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const formTennant = document.getElementById("formTennant");
const inputICNumber = document.getElementById("inputICNumber");
const btnSubmit = document.getElementById("btnSubmit");

let tennantICNumber, tennantImage, tennantLatitude, tennantLongitude;

function geoLocationSuccess(position) {
  console.log("User's current location:");
  console.log(position);

  // Destructure latitude and longitude
  tennantLatitude = position.coords.latitude;
  tennantLongitude = position.coords.longitude;

  console.log(tennantICNumber, tennantLatitude, tennantLongitude);
}

// When Geolocation fails to get user's current location
function geoLocationFail() {
  alert("Could not get your current position.");
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

  // Extract the image

  // Get user's current location
  // First, check if navigator is supported by the browser
  // prettier-ignore
  if (navigator.geolocation) {
    // If navigator exist, attempt to get user's current location
    navigator.geolocation.getCurrentPosition(geoLocationSuccess, geoLocationFail);
  } 
  else {
    alert("Geolocation is not supported by this browser.");
  }
});
