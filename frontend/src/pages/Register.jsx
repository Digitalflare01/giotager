import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            // In a real app, URL comes from env
            const response = await axios.post('http://localhost:8000/api/register.php', {
                email,
                password,
                contact_number: contactNumber
            });

            if (response.data.status === 'success') {
                setSuccess('Registration successful. Redirecting to login...');
                setTimeout(() => navigate('/login'), 2000);
            } else {
                setError(response.data.message || 'Registration failed');
            }
        } catch (err) {
            setError('Connection error. Is the backend running?');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card glass-panel">
                <h2 className="text-gradient" style={{ textAlign: 'center', marginBottom: '0.5rem', fontSize: '2rem' }}>Create Account</h2>
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                    Join SwichLocation to manage your EXIF tags easily.
                </p>

                {error && <div className="message error animate-fade-in">{error}</div>}
                {success && <div className="message success animate-fade-in">{success}</div>}

                <form onSubmit={handleRegister}>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            className="form-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="you@example.com"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Contact Number</label>
                        <input
                            type="tel"
                            className="form-input"
                            value={contactNumber}
                            onChange={(e) => setContactNumber(e.target.value)}
                            required
                            placeholder="+1 (555) 000-0000"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Create a strong password"
                            minLength="6"
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading || success}>
                        {loading ? 'Creating Account...' : 'Register'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 500 }}>Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
