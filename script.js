document.addEventListener('DOMContentLoaded', () => {
    // Initialize Feather Icons
    feather.replace();

    // Hamburger Menu Toggle
    const menuToggle = document.getElementById('menuToggle');
    const dropdownMenu = document.getElementById('dropdownMenu');

    menuToggle.addEventListener('click', () => {
        dropdownMenu.classList.toggle('hidden');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (event) => {
        if (!menuToggle.contains(event.target) && !dropdownMenu.contains(event.target)) {
            dropdownMenu.classList.add('hidden');
        }
    });

    // Redirect to TennantInputForm page when "Take Picture" button is clicked
    const takePictureButton = document.getElementById('takePictureButton');
    takePictureButton.addEventListener('click', () => {
        const baseUrl = window.location.origin;
        window.location.href = `${baseUrl}/TennantInputForm/`;
    });

    // Update Auditor Dashboard link
    const auditorDashboardLink = document.getElementById('auditorDashboardLink');
    auditorDashboardLink.href = `${window.location.origin}/AuditorDashboard/`;
});