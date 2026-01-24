import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api'; // Import API
import BatchResults from '../components/admin/BatchResults';
import ManualStandings from '../components/admin/ManualStandings';
import ManageForms from '../components/admin/ManageForms';

export default function AdminPanel({ teams, sports, genders }) {
    const [activeTab, setActiveTab] = useState('results'); // 'results', 'standings', 'forms'
    const [publishStatus, setPublishStatus] = useState('idle');
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/login');
    };

    const handlePublish = async () => {
        if (!confirm("This will overwrite the static database and update the live site. Continue?")) return;
        setPublishStatus('publishing');
        try {
            await api.publishData();
            setPublishStatus('success');
            setTimeout(() => setPublishStatus('idle'), 3000);
        } catch (err) {
            console.error(err);
            setPublishStatus('error');
            setTimeout(() => setPublishStatus('idle'), 3000);
        }
    };

    return (
        <div className="min-h-screen bg-theme-bg text-theme-text-main p-8 font-sans">
            <div className="max-w-6xl mx-auto">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6 md:mb-10 border-b border-theme-border pb-6 gap-4">
                        <h1 className="text-3xl md:text-4xl font-bold text-theme-accent-base text-center md:text-left">Admin Dashboard</h1>
                        <div className="flex flex-row flex-wrap sm:flex-row gap-3 w-full md:w-auto">
                            <button
                                onClick={handlePublish}
                                disabled={publishStatus === 'publishing'}
                                className={`px-3 py-2 md:px-4 md:py-2 text-sm md:text-base rounded-lg font-bold text-white transition-all text-center ${publishStatus === 'success' ? 'bg-emerald-500' :
                                    publishStatus === 'error' ? 'bg-red-500' :
                                        'bg-purple-600 hover:bg-purple-700'
                                    }`}
                            >
                                {publishStatus === 'publishing' ? 'Publishing...' :
                                    publishStatus === 'success' ? 'Published!' :
                                        publishStatus === 'error' ? 'Error!' :
                                            '☁️ Publish Changes'}
                            </button>
                            <button
                                onClick={handleLogout}
                                className="px-3 py-2 md:px-4 md:py-2 text-sm md:text-base bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-bold shadow-md text-center"
                            >
                                Log Out
                            </button>
                            <Link to="/" className="px-3 py-2 md:px-4 md:py-2 text-sm md:text-base bg-theme-surface hover:bg-theme-surfaceHover text-theme-text-main rounded-lg transition-colors border border-theme-border text-center">
                                <span className="hidden md:block">Back to Scoreboard</span>
                                <span className="block md:hidden">⏎</span>
                            </Link>
                        </div>
                    </div>

                    {/* Tabs */}
                    {/* Tabs */}
                    <div className="flex flex-row flex-wrap gap-2 md:gap-4 mb-8">
                        <button
                            onClick={() => setActiveTab('results')}
                            className={`flex-1 sm:flex-none px-3 md:px-6 py-2 rounded-lg font-bold text-sm md:text-base transition-all text-center ${activeTab === 'results' ? 'bg-theme-accent-base text-white shadow-lg' : 'bg-theme-surface text-theme-text-muted hover:bg-theme-surfaceHover'}`}
                        >
                            Batch Results
                        </button>
                        <button
                            onClick={() => setActiveTab('standings')}
                            className={`flex-1 sm:flex-none px-3 md:px-6 py-2 rounded-lg font-bold text-sm md:text-base transition-all text-center ${activeTab === 'standings' ? 'bg-theme-accent-base text-white shadow-lg' : 'bg-theme-surface text-theme-text-muted hover:bg-theme-surfaceHover'}`}
                        >
                            Manage Standings
                        </button>
                        <button
                            onClick={() => setActiveTab('forms')}
                            className={`flex-1 sm:flex-none px-3 md:px-6 py-2 rounded-lg font-bold text-sm md:text-base transition-all text-center ${activeTab === 'forms' ? 'bg-theme-accent-base text-white shadow-lg' : 'bg-theme-surface text-theme-text-muted hover:bg-theme-surfaceHover'}`}
                        >
                            Manage Forms
                        </button>
                    </div>

                    <div className="bg-theme-surface rounded-xl border border-theme-border p-4 md:p-8 shadow-xl">
                        {activeTab === 'results' && (
                            <BatchResults teams={teams} sports={sports} genders={genders} />
                        )}

                        {activeTab === 'standings' && (
                            <ManualStandings teams={teams} sports={sports} genders={genders} />
                        )}

                        {activeTab === 'forms' && (
                            <ManageForms />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
