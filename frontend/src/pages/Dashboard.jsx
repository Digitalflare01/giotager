import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getExifLocation, updateExifLocation, stripExifLocation } from '../utils/exifHelper';
import { compressImage, fileToBase64, base64ToFile } from '../utils/imageCompressor';
import { UploadCloud, MapPin, Download, Settings2, Trash2 } from 'lucide-react';
import LocationPicker from '../components/LocationPicker';

const Dashboard = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');

    // EXIF State
    const [currentLocation, setCurrentLocation] = useState(null);
    const [newLat, setNewLat] = useState('');
    const [newLng, setNewLng] = useState('');

    // Output settings
    const [exportFormat, setExportFormat] = useState('image/jpeg');
    const [maxSizeMB, setMaxSizeMB] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Removed auth effect and logout handler

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    };

    const onFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        // Only accept images
        if (!selectedFile.type.startsWith('image/')) {
            showMessage('error', 'Please upload an image file.');
            return;
        }

        setFile(selectedFile);

        try {
            const b64 = await fileToBase64(selectedFile);
            setPreviewUrl(b64);

            // Attempt to read EXIF GPS if JPEG
            if (selectedFile.type === 'image/jpeg') {
                const loc = getExifLocation(b64);
                if (loc) {
                    setCurrentLocation(loc);
                    setNewLat(loc.lat.toFixed(6));
                    setNewLng(loc.lng.toFixed(6));
                    showMessage('success', 'Location data found in image.');
                } else {
                    setCurrentLocation(null);
                    setNewLat('');
                    setNewLng('');
                    showMessage('info', 'No GPS location data found in this image.');
                }
            } else {
                setCurrentLocation(null);
                showMessage('info', 'Location reading is only natively supported for JPEGs currently.');
            }
        } catch (err) {
            console.error(err);
            showMessage('error', 'Could not process the uploaded file.');
        }
    };

    const handleProcessAndDownload = async () => {
        if (!file) {
            showMessage('error', 'Please upload a file first.');
            return;
        }

        setIsProcessing(true);
        showMessage('info', 'Processing image...');

        try {
            // 1. Compress Image & Convert Format
            const compressedFile = await compressImage(file, {
                maxSizeMB: Number(maxSizeMB),
                fileType: exportFormat
            });

            // 2. Modify EXIF location (Only if JPEG, as piexifjs only supports JPEG)
            let finalDataUrl = await fileToBase64(compressedFile);

            if (exportFormat === 'image/jpeg') {
                if (newLat && newLng) {
                    finalDataUrl = updateExifLocation(finalDataUrl, parseFloat(newLat), parseFloat(newLng));
                } else {
                    finalDataUrl = stripExifLocation(finalDataUrl); // Ensure it's stripped if left blank
                }
            }

            // 3. Trigger Download
            const ext = exportFormat.split('/')[1];
            const newFilename = `swichlocation_${Date.now()}.${ext}`;

            const a = document.createElement('a');
            a.href = finalDataUrl;
            a.download = newFilename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            showMessage('success', 'Image processed and downloaded successfully!');

            // TODO: Optionally send log to /api/save_data.php for tracking

        } catch (err) {
            console.error("Processing failed:", err);
            showMessage('error', 'Failed to process the image.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div style={{ paddingBottom: '3rem' }}>
            <nav className="navbar">
                <Link to="/" className="nav-brand">
                    <MapPin color="var(--primary)" size={28} />
                    SwichLocation
                </Link>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Free EXIF Editor</span>
                </div>
            </nav>

            <div className="container">
                {message.text && (
                    <div className={`message ${message.type === 'error' ? 'error' : 'success'} animate-fade-in`}>
                        {message.text}
                    </div>
                )}

                <div className="dashboard-grid">
                    {/* Main workspace (Left Column) */}
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <UploadCloud color="var(--primary)" />
                            Image Workspace
                        </h2>

                        {!previewUrl ? (
                            <div
                                className="upload-zone"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={onFileChange}
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                />
                                <UploadCloud size={48} color="var(--text-secondary)" style={{ marginBottom: '1rem' }} />
                                <h3 style={{ marginBottom: '0.5rem' }}>Browse or Drop Image</h3>
                                <p style={{ color: 'var(--text-secondary)' }}>Supports JPEG, PNG, WEBP</p>
                            </div>
                        ) : (
                            <div className="preview-container">
                                <img src={previewUrl} alt="Preview" className="preview-image" />
                                <button
                                    className="btn btn-secondary"
                                    style={{ position: 'absolute', top: 10, right: 10, width: 'auto', padding: '0.5rem 1rem', background: 'rgba(0,0,0,0.6)', border: 'none' }}
                                    onClick={() => { setFile(null); setPreviewUrl(''); setCurrentLocation(null); setNewLat(''); setNewLng(''); }}
                                >
                                    <Trash2 size={16} color="var(--danger)" /> Clear
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Settings Sidebar (Right Column) */}
                    <div className="glass-panel exif-panel">
                        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Settings2 color="var(--secondary)" />
                            Location & Export
                        </h3>

                        <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', marginBottom: '1.5rem' }}>
                            <h4 style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.85rem', textTransform: 'uppercase' }}>Current EXIF Data</h4>
                            <div className="exif-item">
                                <span className="exif-label">Latitude</span>
                                <span className="exif-val">{currentLocation?.lat ? currentLocation.lat.toFixed(6) : 'None'}</span>
                            </div>
                            <div className="exif-item">
                                <span className="exif-label">Longitude</span>
                                <span className="exif-val">{currentLocation?.lng ? currentLocation.lng.toFixed(6) : 'None'}</span>
                            </div>
                        </div>

                        <h4 style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.85rem', textTransform: 'uppercase' }}>Modify Location</h4>
                        <div className="form-group">
                            <label className="form-label">New Latitude</label>
                            <input
                                type="number"
                                step="any"
                                className="form-input"
                                placeholder="e.g. 40.7128"
                                value={newLat}
                                onChange={(e) => setNewLat(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">New Longitude</label>
                            <input
                                type="number"
                                step="any"
                                className="form-input"
                                placeholder="e.g. -74.0060"
                                value={newLng}
                                onChange={(e) => setNewLng(e.target.value)}
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                            <label className="form-label">Pick on Map</label>
                            <LocationPicker
                                onLocationSelect={(lat, lng) => {
                                    setNewLat(lat.toFixed(6));
                                    setNewLng(lng.toFixed(6));
                                }}
                                initialPosition={currentLocation ? [currentLocation.lat, currentLocation.lng] : [51.505, -0.09]}
                            />
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginTop: '0.5rem', fontWeight: '500' }}>
                                Click the map or use the search icon inside the map to pin a location.
                            </p>
                        </div>

                        <button
                            className="btn btn-secondary"
                            style={{ marginBottom: '2rem' }}
                            onClick={() => { setNewLat(''); setNewLng(''); }}
                        >
                            <Trash2 size={16} /> Strip Location Data
                        </button>

                        <h4 style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.85rem', textTransform: 'uppercase' }}>Export Settings</h4>

                        <div className="form-group">
                            <label className="form-label">Export Format</label>
                            <select
                                className="form-input"
                                value={exportFormat}
                                onChange={(e) => setExportFormat(e.target.value)}
                            >
                                <option value="image/jpeg">JPEG (Preserves Location)</option>
                                <option value="image/png">PNG (Location removed)</option>
                                <option value="image/webp">WEBP (Location removed)</option>
                            </select>
                        </div>

                        <div className="form-group" style={{ marginBottom: '2rem' }}>
                            <label className="form-label">Max File Size (MB): <span style={{ color: 'var(--text-primary)' }}>{maxSizeMB}MB</span></label>
                            <input
                                type="range"
                                min="0.1" max="5" step="0.1"
                                className="form-input"
                                style={{ padding: 0, height: '6px' }}
                                value={maxSizeMB}
                                onChange={(e) => setMaxSizeMB(e.target.value)}
                            />
                        </div>

                        <button
                            className="btn btn-primary"
                            onClick={handleProcessAndDownload}
                            disabled={isProcessing || !file}
                        >
                            <Download size={18} />
                            {isProcessing ? 'Processing...' : 'Process & Download'}
                        </button>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
