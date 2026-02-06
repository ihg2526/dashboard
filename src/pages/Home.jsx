import { useEffect, useState } from 'react';
import { api } from '../services/api';
import StandingsTable from '../components/StandingsTable';
import SEO from '../components/SEO';

export default function Home({ data }) {
    const [activeTab, setActiveTab] = useState('overall');
    const [aggregatedStandings, setAggregatedStandings] = useState({ overall: [], female: [], male: [] });

    useEffect(() => {
        const fetchStandings = async () => {
            try {
                const result = await api.fetchAggregatedStandings();
                setAggregatedStandings(result);
            } catch (error) {
                console.error("Failed to load aggregated standings:", error);
            }
        };

        fetchStandings();
    }, []);

    const tabs = [
        { id: 'overall', label: 'Overall' },
        { id: 'female', label: 'Female' },
        { id: 'male', label: 'Male' }
    ];

    return (
        <div className="min-h-screen bg-theme-bg text-theme-text-main py-8 px-4 md:py-12 md:px-6">
            <SEO
                title="Home | 25/26 IHG Dashboard"
                description="Welcome to the official 25/26 IHG Dashboard. Track championship standings, live results, and team performance."
            />
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Welcome Section */}
                <div className="text-center space-y-4">
                    <h2 className="text-4xl font-bold text-theme-accent-base">Welcome to the Dashboard</h2>
                    <p className="text-xl text-theme-text-muted leading-relaxed max-w-2xl mx-auto">
                        Track the race for the championship.
                    </p>
                </div>

                {/* Standings Section */}
                <div className="bg-theme-surface rounded-2xl border border-theme-border shadow-2xl overflow-hidden">
                    <div className="p-6 border-b border-theme-border/50">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <h3 className="text-2xl font-bold text-theme-text-main flex items-center gap-2">
                                <span>🏆</span> Championship Standings
                            </h3>

                            {/* Tabs */}
                            <div className="flex bg-theme-bg/50 p-1 rounded-lg border border-theme-border">
                                {tabs.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${activeTab === tab.id
                                            ? 'bg-theme-accent-base text-white shadow-md'
                                            : 'text-theme-text-muted hover:text-theme-text-main hover:bg-theme-surface'
                                            }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {activeTab !== 'overall' && (
                            <p className="mt-2 text-xs text-theme-text-dim text-right italic">
                                * Mixed games contribute half points
                            </p>
                        )}
                    </div>

                    <div className="p-0 sm:p-6">
                        <StandingsTable
                            standings={aggregatedStandings[activeTab]}
                            teams={data?.teams || []}
                            minimal={true}
                        />
                    </div>
                </div>

                {/* Quick Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-theme-surface/50 rounded-xl border border-theme-border hover:border-theme-accent-base/50 transition-colors">
                        <h3 className="text-xl font-bold text-theme-text-main mb-2">Live Results</h3>
                        <p className="text-theme-text-dim mb-4">Check recent match outcomes and upcoming fixtures.</p>
                        <a href="#/results" className="text-theme-accent-base font-semibold hover:underline">Go to Scoreboard &rarr;</a>
                    </div>
                    <div className="p-6 bg-theme-surface/50 rounded-xl border border-theme-border hover:border-theme-accent-base/50 transition-colors">
                        <h3 className="text-xl font-bold text-theme-text-main mb-2">Detailed Statistics</h3>
                        <p className="text-theme-text-dim mb-4">Deep dive into sport-specific rankings and head-to-head records.</p>
                        <a href="#/results" className="text-theme-accent-base font-semibold hover:underline">View Details &rarr;</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
