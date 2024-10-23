const details = document.querySelector('.details');

// Make these two global variables, so we can access them in other functions, outside scope, still in this file btw.
let map, mapEvent;

// Data obtained from database
let arr_of_tennant = [
    {
        ic: '000123456789',
        currStatus: 'good',
        image: 'tennant_image_placeholder.jpg',
        lat: 5.391502764281349,
        lng: 100.29951095581055,
    },
    {
        ic: '123445567899',
        currStatus: 'warning',
        image: 'tennant_image_placeholder.jpg',
        lat: 5.341450504069681,
        lng: 100.28766632080078,
    },
    {
        ic: '123125365758',
        currStatus: 'error',
        image: 'tennant_image_placeholder.jpg',
        lat: 5.451115939009762,
        lng: 100.19514083862306,
    },
];

// Display all markers
function displayAllMarkers() {
    for (const currTenant of arr_of_tennant) {
        let popupStyle;

        if (currTenant.currStatus == 'good') {
            popupStyle = 'green-popup';
        } else if (currTenant.currStatus == 'warning') {
            popupStyle = 'yellow-popup';
        } else {
            popupStyle = 'red-popup';
        }

        L.marker([currTenant.lat, currTenant.lng])
            .addTo(map)
            .bindPopup(
                L.popup({
                    maxWidth: 250,
                    minWidth: 100,
                    className: popupStyle, // Add your own custom styling to your popup
                })
            )
            .setPopupContent(currTenant.ic)
            .openPopup();
    }
}

// Display all details
function displayAllDetails() {
    for (const currTenant of arr_of_tennant) {
        let detailStyle;

        if (currTenant.currStatus == 'good') {
            detailStyle = 'detail--green';
        } else if (currTenant.currStatus == 'warning') {
            detailStyle = 'detail--yellow';
        } else {
            detailStyle = 'detail--red';
        }

        let htmlElement = `
            <li class="detail ${detailStyle}">
                <img src="tennant_image_placeholder.jpg" class="tennant_image" alt="something" />
                <h2 class="detail__title">${currTenant.ic}</h2>
            </li>
        `;

        details.insertAdjacentHTML('beforeend', htmlElement);
    }
}

// When Geolocation successfully get user's current location
function success(position) {
    console.log(position);

    // Destructure latitude and longitude
    const { latitude } = position.coords;
    const { longitude } = position.coords;

    console.log('Current position: ', latitude, longitude);

    // The "map" inside the map() method, is the ID of an element, where we want to display the map.
    // L is a namespace
    // The setView() basically displays where the map should be at, when it is loaded.
    // In this case, it should be at user's current location
    // The setView() method expects two arguments.
    // 1st argument: an array of latitude and longitude
    // 2nd argument: how zoomed in or zoomed out the map should be, on the coordinate provided. The higher the value, the more zoomed in
    map = L.map('map').setView([latitude, longitude], 13);

    // The map being displayed, is made up of tiles. And the tiles comes from this url below
    // We can change the url below, to change the appearance of the map
    // Here are some alternative styling: https://leaflet-extras.github.io/leaflet-providers/preview/
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // L.marker([latitude, longitude]).addTo(map).bindPopup("Yoooooo.<br> Where I'm at.").openPopup();

    // Display all markers
    displayAllMarkers();

    // Display all details
    displayAllDetails();
}

// When Geolocation fails to get user's current location
function fail() {
    alert('Could not get your position.');
}

// Check if navigator exists (older browsers don't support navigator)
// prettier-ignore
if (navigator.geolocation) {
    // If navigator exists, attempt to get user's current location.
    navigator.geolocation.getCurrentPosition(success, fail);
} 
else {
    alert('Geolocation is not supported by this browser.');
}

