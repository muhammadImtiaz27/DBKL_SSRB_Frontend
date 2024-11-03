// Make these two global variables, so we can access them in other functions, outside scope, still in this file btw.
let map, mapEvent;

// Data obtained from database. Keep this array unchanged
const arr_of_tennant = [
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
    {
        ic: '000643674326',
        currStatus: 'good',
        image: 'tennant_image_placeholder.jpg',
        lat: 5.401502764281,
        lng: 100.29951095581055,
    },
    {
        ic: '123456788765',
        currStatus: 'warning',
        image: 'tennant_image_placeholder.jpg',
        lat: 5.411450504069681,
        lng: 100.28766632080078,
    },
    {
        ic: '567456323455',
        currStatus: 'error',
        image: 'tennant_image_placeholder.jpg',
        lat: 5.421115939009762,
        lng: 100.19514083862306,
    },
    {
        ic: '085321456789',
        currStatus: 'good',
        image: 'tennant_image_placeholder.jpg',
        lat: 5.431502764281349,
        lng: 100.29951095581055,
    },
    {
        ic: '125643189065',
        currStatus: 'warning',
        image: 'tennant_image_placeholder.jpg',
        lat: 5.441450504069681,
        lng: 100.28766632080078,
    },
    {
        ic: '000723451277',
        currStatus: 'error',
        image: 'tennant_image_placeholder.jpg',
        lat: 5.471115939009762,
        lng: 100.19514083862306,
    },
];

// Store some markers in an array. We will use this array to remove markers from the map.
let arr_of_markers = [];

// Use this array to display tennants information and markers
// You can change this array
// When launching the website for the first time, it will display all tenants
// Use spread operator to make a shallow copy
let arr_filtered_data = [...arr_of_tennant];

const details = document.querySelector('.details');
const input_tennant_ic = document.getElementById('input_tennant_ic');
const dropdown_menu = document.getElementById('dropdown_menu');
const modal = document.getElementById('myModal');
const btn_change_map_style = document.querySelector('.btn_change_map_style');
const closeModalBtn = document.getElementById('closeModal');
const img_OpenTopoMap = document.getElementById('img_OpenTopoMap');
const img_OpenStreetMap_standard = document.getElementById('img_OpenStreetMap_standard');
const img_EsriSatellite = document.getElementById('img_EsriSatellite');

// Display all markers
function displayAllMarkers() {
    for (const currTenant of arr_filtered_data) {
        let popupStyle;

        //prettier-ignore
        if (currTenant.currStatus == 'good') {
            popupStyle = 'green-popup';
        } 
        else if (currTenant.currStatus == 'warning') {
            popupStyle = 'yellow-popup';
        } 
        else {
            popupStyle = 'red-popup';
        }

        let marker = L.marker([currTenant.lat, currTenant.lng])
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

        arr_of_markers.push(marker);
    }
}

// Display all details
function displayAllDetails() {
    // prettier-ignore
    for (const currTenant of arr_filtered_data) {
        let detailStyle;

        if (currTenant.currStatus == 'good') {
            detailStyle = 'detail--green';
        } 
        else if (currTenant.currStatus == 'warning') {
            detailStyle = 'detail--yellow';
        } 
        else {
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

function removeDetails() {
    // Remove all child elements of detail element
    // In other words, remove all <li> elements inside the <ul> elements
    details.innerHTML = '';
}

function removeMarkers() {
    for (var i = 0; i < arr_of_markers.length; i++) {
        map.removeLayer(arr_of_markers[i]);
    }
    arr_of_markers = []; // Clear the array after removing markers
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

// When the user select one of the items from the dropdown menu
dropdown_menu.addEventListener('change', function () {
    const selected_item = dropdown_menu.value;
    console.log(selected_item);

    arr_filtered_data.length = 0;

    // Use spread operator to make a shallow copy of an array
    // arr_filtered_data = [...arr_of_tennant];

    // prettier-ignore
    if (selected_item == 'default') {
        arr_filtered_data = [...arr_of_tennant];
    } 

    else if(selected_item == "good to error"){

        arr_filtered_data = [...arr_of_tennant];

        // Define the order for the status
        const statusOrder = { good: 1, warning: 2, error: 3 };

        // Sort the array based on status
        arr_filtered_data.sort((a, b) => {
            return statusOrder[a.currStatus] - statusOrder[b.currStatus];
        });
    }

    else if(selected_item == "error to good"){

        arr_filtered_data = [...arr_of_tennant];

        // Define the order for the status
        const statusOrder = { error: 1, warning: 2, good: 3 };

        // Sort the array based on status
        arr_filtered_data.sort((a, b) => {
            return statusOrder[a.currStatus] - statusOrder[b.currStatus];
        });

    }

    else {
        for (const curr_tenant of arr_of_tennant) {
            if (curr_tenant.currStatus == selected_item) {
                arr_filtered_data.push(curr_tenant);
            }
        }
    }

    console.log(arr_filtered_data);

    removeMarkers();
    removeDetails();

    displayAllMarkers();
    displayAllDetails();
});

// When the user press the enter key when typing something in the input_tennant_ic text field
input_tennant_ic.addEventListener('keydown', function (event) {
    // Check if the user pressed the Enter key
    if (event.key == 'Enter') {
        // Get the input value
        const tennant_ic = input_tennant_ic.value;
        console.log(tennant_ic);

        // Clear the array first
        arr_filtered_data.length = 0;

        // Find the object where its "ic" property is equal to the input provided by the user
        for (const curr_tenant of arr_of_tennant) {
            if (curr_tenant.ic == tennant_ic) {
                arr_filtered_data.push(curr_tenant);
            }
        }

        removeMarkers();
        removeDetails();

        displayAllMarkers();
        displayAllDetails();
    }
});

// Open modal on button click
btn_change_map_style.addEventListener('click', function (event) {
    modal.style.display = 'flex';
});

// Close modal on close button click
closeModalBtn.addEventListener('click', function (event) {
    modal.style.display = 'none';
});

// Close modal when clicking outside of modal content
window.addEventListener('click', function (event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// When the user click Open Street Map (Standard) image
img_OpenStreetMap_standard.addEventListener('click', function () {
    // Remove existing layers
    map.eachLayer((l) => map.removeLayer(l));

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 17,
        attribution: '© OpenTopoMap contributors',
    }).addTo(map);

    removeMarkers();
    removeDetails();

    displayAllMarkers();
    displayAllDetails();

    modal.style.display = 'none';
});

// When the user click Open Topo Map image
img_OpenTopoMap.addEventListener('click', function () {
    // Remove existing layers
    map.eachLayer((l) => map.removeLayer(l));

    L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        maxZoom: 17,
        attribution: '© OpenTopoMap contributors',
    }).addTo(map);

    removeMarkers();
    removeDetails();

    displayAllMarkers();
    displayAllDetails();

    modal.style.display = 'none';
});

// When the user click Esri Satellite image
img_EsriSatellite.addEventListener('click', function () {
    // Remove existing layers
    map.eachLayer((l) => map.removeLayer(l));

    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 17,
        attribution: '© Esri & the GIS User Community',
    }).addTo(map);

    removeMarkers();
    removeDetails();

    displayAllMarkers();
    displayAllDetails();

    modal.style.display = 'none';
});

// Check if navigator exists (older browsers don't support navigator)
// prettier-ignore
if (navigator.geolocation) {
    // If navigator exists, attempt to get user's current location.
    navigator.geolocation.getCurrentPosition(success, fail);
} 
else {
    alert('Geolocation is not supported by this browser.');
}
