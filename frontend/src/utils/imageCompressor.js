import imageCompression from 'browser-image-compression';

/**
 * Compresses an image file and optionally converts its format.
 * @param {File} file 
 * @param {object} options 
 * @returns {Promise<File>}
 */
export const compressImage = async (file, options = {}) => {
    const {
        maxSizeMB = 1,
        maxWidthOrHeight = 1920,
        fileType = file.type // default keep original type
    } = options;

    const compressionOptions = {
        maxSizeMB,
        maxWidthOrHeight,
        useWebWorker: true,
        fileType: fileType // can be 'image/jpeg', 'image/png', 'image/webp'
    };

    try {
        const compressedFile = await imageCompression(file, compressionOptions);
        return compressedFile;
    } catch (error) {
        console.error("Image compression failed:", error);
        throw error;
    }
};

/**
 * Converts File to Base64 String URL.
 */
export const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
};

/**
 * Converts Base64 String back to File.
 */
export const base64ToFile = async (dataUrl, filename) => {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type });
};
