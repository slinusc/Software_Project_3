export function getUserLocation() {
    return new Promise((resolve, reject) => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(position => {
                const user_latlng = L.latLng(position.coords.latitude, position.coords.longitude);
                resolve(user_latlng);
            }, () => {
                reject(new Error("Unable to retrieve location"));
            });
        } else {
            reject(new Error("Geolocation is not supported by this browser"));
        }
    });
}