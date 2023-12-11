document.getElementById('fileInput').addEventListener('change', function(event) {
    var selectedFile = event.target.files[0];

    // Check if a file is selected
    if (selectedFile) {
        // Navigate to index.html
        window.location.href = 'editor/index.html';
    } else {
        // Handle the case when no file is selected
        alert('No file selected');
    }
});