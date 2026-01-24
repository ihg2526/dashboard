import { useState, useEffect } from 'react';
import { api } from '../../services/api';

export default function ManualStandings({ teams, sports, genders }) {
    const [standingsSport, setStandingsSport] = useState('');
    const [standingsGender, setStandingsGender] = useState('');
    const [standingsEntries, setStandingsEntries] = useState([]);
    const [status, setStatus] = useState('idle');

    // Initialize entries when teams load
    useEffect(() => {
        if (standingsEntries.length === 0 && teams.length > 0) {
            setStandingsEntries(teams.map(t => ({ teamId: t.id, points: 0 })));
        }
    }, [teams, standingsEntries.length]);

    const handleStandingChange = (teamId, points) => {
        setStandingsEntries(prev => prev.map(e =>
            e.teamId === teamId ? { ...e, points: parseInt(points) || 0 } : e
        ));
    };

    const handleStandingsSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');

        if (!standingsSport || !standingsGender) {
            setStatus('error');
            return;
        }

        const payload = {
            sport: standingsSport,
            gender: standingsGender,
            entries: standingsEntries
        };

        try {
            await api.saveStandings(payload);
            setStatus('success');
            setTimeout(() => setStatus('idle'), 3000);
        } catch (err) {
            console.error(err);
            setStatus('error');
        }
    };

    return (
        <div>
            {status === 'success' && (
                <div className="mb-6 p-4 bg-emerald-500/20 border border-emerald-500/50 rounded-lg text-emerald-400 font-medium animate-pulse">
                    ✅ Saved successfully!
                </div>
            )}

            {status === 'error' && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 font-medium">
                    ❌ Failed to save. Please check your inputs.
                </div>
            )}

            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="text-3xl">🏆</span> Manual Standings Entry
            </h2>
            <p className="text-theme-text-muted mb-6">Enter points directly for each team for a specific category.</p>

            <form onSubmit={handleStandingsSubmit}>
                <div className="grid grid-cols-2 gap-6 mb-8">
                    <div>
                        <label className="block text-sm font-bold text-theme-text-muted mb-2">Sport</label>
                        <select
                            className="w-full bg-theme-bg border border-theme-border rounded px-3 py-2 text-theme-text-main focus:border-theme-accent-base"
                            value={standingsSport}
                            onChange={(e) => setStandingsSport(e.target.value)}
                            required
                        >
                            <option value="">Select Sport...</option>
                            {sports.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-theme-text-muted mb-2">Gender</label>
                        <select
                            className="w-full bg-theme-bg border border-theme-border rounded px-3 py-2 text-theme-text-main focus:border-theme-accent-base"
                            value={standingsGender}
                            onChange={(e) => setStandingsGender(e.target.value)}
                            required
                        >
                            <option value="">Select Gender...</option>
                            {genders.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    {standingsEntries.map(entry => {
                        const team = teams.find(t => t.id === entry.teamId);
                        return (
                            <div key={entry.teamId} className="flex items-center justify-between bg-theme-bg/50 p-3 rounded border border-theme-border">
                                <div className="flex items-center gap-3">
                                    {team?.image && <img src={team.image} className="w-8 h-8 object-contain" alt={team.name} />}
                                    <span className="font-bold">{team?.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-theme-text-muted uppercase">Pts</span>
                                    <input
                                        type="number"
                                        className="w-16 bg-theme-surface border border-theme-border rounded px-2 py-1 text-center font-bold focus:border-theme-accent-base"
                                        value={entry.points}
                                        onChange={(e) => handleStandingChange(entry.teamId, e.target.value)}
                                        min="0"
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>

                <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full px-8 py-3 bg-theme-accent-base hover:bg-theme-accent-hover text-white rounded-lg font-bold shadow-lg shadow-theme-accent-base/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {status === 'submitting' ? 'Saving Manual Standings...' : 'Save Standings'}
                </button>
            </form>
        </div>
    );
}
