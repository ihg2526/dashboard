import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api'; // Import API
import BatchResults from '../components/admin/BatchResults';
import ManualStandings from '../components/admin/ManualStandings';
import ManageForms from '../components/admin/ManageForms';

export default function AdminPanel({ teams, sports, genders }) {
    const [activeTab, setActiveTab] = useState('results'); // 'results', 'standings', 'forms'
    const [publishStatus, setPublishStatus] = useState('idle');

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
                <div className="flex justify-between items-center mb-10 border-b border-theme-border pb-6">
                    <h1 className="text-4xl font-bold text-theme-accent-base">Admin Dashboard</h1>
                    <div className="flex gap-4">
                        <button
                            onClick={handlePublish}
                            disabled={publishStatus === 'publishing'}
                            className={`px-4 py-2 rounded-lg font-bold text-white transition-all ${publishStatus === 'success' ? 'bg-emerald-500' :
                                publishStatus === 'error' ? 'bg-red-500' :
                                    'bg-purple-600 hover:bg-purple-700'
                                }`}
                        >
                            {publishStatus === 'publishing' ? 'Publishing...' :
                                publishStatus === 'success' ? 'Published!' :
                                    publishStatus === 'error' ? 'Error!' :
                                        '☁️ Publish Changes'}
                        </button>
                        <Link to="/" className="px-4 py-2 bg-theme-surface hover:bg-theme-surfaceHover text-theme-text-main rounded-lg transition-colors border border-theme-border">
                            ← Back to Scoreboard
                        </Link>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap gap-2 md:gap-4 mb-8">
                    <button
                        onClick={() => setActiveTab('results')}
                        className={`px-4 md:px-6 py-2 rounded-lg font-bold text-sm md:text-base transition-all ${activeTab === 'results' ? 'bg-theme-accent-base text-white shadow-lg' : 'bg-theme-surface text-theme-text-muted hover:bg-theme-surfaceHover'}`}
                    >
                        Batch Results
                    </button>
                    <button
                        onClick={() => setActiveTab('standings')}
                        className={`px-4 md:px-6 py-2 rounded-lg font-bold text-sm md:text-base transition-all ${activeTab === 'standings' ? 'bg-theme-accent-base text-white shadow-lg' : 'bg-theme-surface text-theme-text-muted hover:bg-theme-surfaceHover'}`}
                    >
                        Manage Standings
                    </button>
                    <button
                        onClick={() => setActiveTab('forms')}
                        className={`px-4 md:px-6 py-2 rounded-lg font-bold text-sm md:text-base transition-all ${activeTab === 'forms' ? 'bg-theme-accent-base text-white shadow-lg' : 'bg-theme-surface text-theme-text-muted hover:bg-theme-surfaceHover'}`}
                    >
                        Manage Forms
                    </button>
                </div>

                <div className="bg-theme-surface rounded-xl border border-theme-border p-8 shadow-2xl">
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
    );
}
