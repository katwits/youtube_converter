let video = document.getElementById("link");

document.getElementById("submit").addEventListener("click", () => {
    // Get the video URL from the input field
    let videoUrl = video.value.trim();

    // Make sure the URL is not empty
    if (videoUrl === '') {
        alert('Please enter a valid YouTube URL');
        return;
    }

    // Send a POST request to the server
    fetch('http://localhost:3000/convert', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: videoUrl })
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.blob();
    }).then(blob => {
        // Handle the response blob (if needed)
        console.log('Conversion successful');
    }).catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
});
