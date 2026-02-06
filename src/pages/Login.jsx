import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import SEO from '../components/SEO';

export default function Login() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoggingIn(true);

        try {
            const data = await api.login(password);
            localStorage.setItem('adminToken', data.token);
            navigate('/admin');
        } catch (err) {
            console.error(err);
            setError('Invalid password');
        } finally {
            setIsLoggingIn(false);
        }
    };

    return (
        <div className="min-h-screen bg-theme-bg flex items-center justify-center p-4">
            <SEO title="Admin Login | 25/26 IHG Dashboard" />
            <div className="bg-theme-surface border border-theme-border p-8 rounded-xl shadow-2xl max-w-md w-full">
                <h1 className="text-3xl font-bold text-theme-text-main mb-6 text-center">Admin Access</h1>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-theme-text-muted mb-2 font-medium">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-theme-bg border border-theme-border rounded-lg text-theme-text-main focus:outline-none focus:ring-2 focus:ring-theme-accent-base"
                            placeholder="Enter master password"
                            required
                        />
                    </div>

                    {error && (
                        <div className="text-red-500 bg-red-500/10 p-3 rounded-lg text-sm text-center font-bold border border-red-500/20">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoggingIn}
                        className="w-full bg-theme-accent-base hover:bg-theme-accent-hover text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-theme-accent-base/20 disabled:opacity-50"
                    >
                        {isLoggingIn ? 'Verifying...' : 'Unlock Dashboard'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <a href="/" className="text-theme-text-dim hover:text-theme-text-main text-sm">
                        ← Back to Scoreboard
                    </a>
                </div>
            </div>
        </div>
    );
}
