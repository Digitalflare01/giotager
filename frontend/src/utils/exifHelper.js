import piexif from 'piexifjs';

// Converts standard decimal degrees to EXIF rational format
function degToDmsRational(degrees) {
    const d = Math.floor(degrees);
    const minFloat = (degrees - d) * 60;
    const m = Math.floor(minFloat);
    const secFloat = (minFloat - m) * 60;
    const s = Math.round(secFloat * 100);

    return [
        [d, 1],
        [m, 1],
        [s, 100]
    ];
}

/**
 * Removes existing GPS data and sets new GPS location data.
 * Also allows setting a custom Meta Name (ImageDescription).
 * @param {string} fileData - The base64 Image data URL
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {string} metaName - Custom Meta Name string
 * @returns {string} - Modified Image data URL
 */
export const updateExifMetadata = (fileData, lat, lng, metaName = '') => {
    try {
        const exifObj = piexif.load(fileData);

        // Clear existing GPS data completely first
        exifObj["GPS"] = {};

        if (lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng)) {
            const latRef = lat >= 0 ? "N" : "S";
            const lngRef = lng >= 0 ? "E" : "W";

            const latDms = degToDmsRational(Math.abs(lat));
            const lngDms = degToDmsRational(Math.abs(lng));

            exifObj["GPS"][piexif.GPSIFD.GPSLatitudeRef] = latRef;
            exifObj["GPS"][piexif.GPSIFD.GPSLatitude] = latDms;

            exifObj["GPS"][piexif.GPSIFD.GPSLongitudeRef] = lngRef;
            exifObj["GPS"][piexif.GPSIFD.GPSLongitude] = lngDms;
        }

        // Handle Custom Meta Name
        if (!exifObj["0th"]) {
            exifObj["0th"] = {};
        }

        if (metaName) {
            exifObj["0th"][piexif.ImageIFD.ImageDescription] = metaName;
            exifObj["0th"][piexif.ImageIFD.Artist] = metaName;
        }

        const exifBytes = piexif.dump(exifObj);
        return piexif.insert(exifBytes, fileData);
    } catch (error) {
        console.warn("Could not modify EXIF data:", error);
        return fileData; // Return original if it fails (e.g., format not supported)
    }
};

/**
 * Strips all GPS data from the image but can optionally apply a meta name.
 * @param {string} fileData 
 * @param {string} metaName
 * @returns {string} - modified base64 string
 */
export const stripExifLocation = (fileData, metaName = '') => {
    try {
        const exifObj = piexif.load(fileData);
        exifObj["GPS"] = {};

        if (metaName) {
            if (!exifObj["0th"]) exifObj["0th"] = {};
            exifObj["0th"][piexif.ImageIFD.ImageDescription] = metaName;
            exifObj["0th"][piexif.ImageIFD.Artist] = metaName;
        }

        const exifBytes = piexif.dump(exifObj);
        return piexif.insert(exifBytes, fileData);
    } catch (error) {
        console.warn("Could not strip EXIF GPS data:", error);
        return fileData;
    }
};

/**
 * Reads GPS rational arrays from piexif and converts to Decimal Degree.
 */
function dmsRationalToDeg(dmsArray, ref) {
    if (!dmsArray || dmsArray.length !== 3) return null;
    const d = dmsArray[0][0] / dmsArray[0][1];
    const m = dmsArray[1][0] / dmsArray[1][1];
    const s = dmsArray[2][0] / dmsArray[2][1];
    let deg = d + (m / 60) + (s / 3600);
    if (ref === "S" || ref === "W") deg = deg * -1;
    return deg;
}

/**
 * Extracts GPS location from image base64.
 * @param {string} fileData 
 * @returns {object} { lat, lng } or null
 */
export const getExifLocation = (fileData) => {
    try {
        const exifObj = piexif.load(fileData);
        const gpsData = exifObj["GPS"];
        if (gpsData && Object.keys(gpsData).length > 0 && gpsData[piexif.GPSIFD.GPSLatitude]) {
            const latRef = gpsData[piexif.GPSIFD.GPSLatitudeRef] || "N";
            const lngRef = gpsData[piexif.GPSIFD.GPSLongitudeRef] || "E";

            const lat = dmsRationalToDeg(gpsData[piexif.GPSIFD.GPSLatitude], latRef);
            const lng = dmsRationalToDeg(gpsData[piexif.GPSIFD.GPSLongitude], lngRef);

            return { lat, lng };
        }
        return null;
    } catch (error) {
        console.warn("Could not read EXIF data:", error);
        return null;
    }
};
