import { useState } from 'react';
import { api } from '../../services/api';

export default function BatchResults({ teams, sports, genders }) {
    const [entries, setEntries] = useState([
        { homeTeamId: '', awayTeamId: '', homeScore: '', awayScore: '', sport: '', gender: '', date: new Date().toISOString().split('T')[0] }
    ]);
    const [status, setStatus] = useState('idle'); // idle, submitting, success, error

    const handleEntryChange = (index, field, value) => {
        const newEntries = [...entries];
        newEntries[index][field] = value;
        setEntries(newEntries);
    };

    const addRow = () => {
        setEntries([...entries, { homeTeamId: '', awayTeamId: '', homeScore: '', awayScore: '', sport: '', gender: '', date: new Date().toISOString().split('T')[0] }]);
    };

    const removeRow = (index) => {
        if (entries.length > 1) {
            setEntries(entries.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');

        // Basic validation
        const validEntries = entries.filter(e => e.homeTeamId && e.awayTeamId && e.homeScore !== '' && e.awayScore !== '' && e.sport && e.gender && e.date);

        if (validEntries.length === 0) {
            setStatus('error');
            return;
        }

        // Convert IDs and scores to numbers
        const formattedEntries = validEntries.map(e => ({
            ...e,
            homeTeamId: parseInt(e.homeTeamId),
            awayTeamId: parseInt(e.awayTeamId),
            homeScore: parseInt(e.homeScore),
            awayScore: parseInt(e.awayScore)
        }));

        try {
            await api.addResults(formattedEntries);
            setStatus('success');
            // Reset form
            setEntries([{ homeTeamId: '', awayTeamId: '', homeScore: '', awayScore: '', sport: '', gender: '', date: new Date().toISOString().split('T')[0] }]);
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
                <span className="text-3xl">📝</span> Batch Result Entry
            </h2>
            <form onSubmit={handleSubmit}>
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full min-w-[800px] border-collapse">
                        <thead>
                            <tr className="text-left text-xs uppercase tracking-wider text-theme-text-muted border-b border-theme-border">
                                <th className="p-3">Sport</th>
                                <th className="p-3">Gender</th>
                                <th className="p-3">Date</th>
                                <th className="p-3">Home Team</th>
                                <th className="p-3 w-20">Score</th>
                                <th className="p-3 w-20">Score</th>
                                <th className="p-3">Away Team</th>
                                <th className="p-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-theme-border/30">
                            {entries.map((entry, index) => (
                                <tr key={index} className="hover:bg-theme-surfaceHover/50 transition-colors">
                                    <td className="p-2">
                                        <select
                                            className="w-full bg-theme-bg border border-theme-border rounded px-2 py-1 focus:border-theme-accent-base text-sm"
                                            value={entry.sport}
                                            onChange={(e) => handleEntryChange(index, 'sport', e.target.value)}
                                            required
                                        >
                                            <option value="">Select...</option>
                                            {sports.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </td>
                                    <td className="p-2">
                                        <select
                                            className="w-full bg-theme-bg border border-theme-border rounded px-2 py-1 focus:border-theme-accent-base text-sm"
                                            value={entry.gender}
                                            onChange={(e) => handleEntryChange(index, 'gender', e.target.value)}
                                            required
                                        >
                                            <option value="">Select...</option>
                                            {genders.map(g => <option key={g} value={g}>{g}</option>)}
                                        </select>
                                    </td>
                                    <td className="p-2">
                                        <input
                                            type="date"
                                            className="w-full bg-theme-bg border border-theme-border rounded px-2 py-1 focus:border-theme-accent-base text-sm text-theme-text-main scheme-dark"
                                            value={entry.date}
                                            onChange={(e) => handleEntryChange(index, 'date', e.target.value)}
                                            required
                                        />
                                    </td>
                                    <td className="p-2">
                                        <select
                                            className="w-full bg-theme-bg border border-theme-border rounded px-2 py-1 focus:border-theme-accent-base text-sm"
                                            value={entry.homeTeamId}
                                            onChange={(e) => handleEntryChange(index, 'homeTeamId', e.target.value)}
                                            required
                                        >
                                            <option value="">Home Team...</option>
                                            {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                        </select>
                                    </td>
                                    <td className="p-2">
                                        <input
                                            type="number"
                                            className="w-full bg-theme-bg border border-theme-border rounded px-2 py-1 focus:border-theme-accent-base text-center font-mono font-bold"
                                            value={entry.homeScore}
                                            onChange={(e) => handleEntryChange(index, 'homeScore', e.target.value)}
                                            required
                                            min="0"
                                        />
                                    </td>
                                    <td className="p-2">
                                        <input
                                            type="number"
                                            className="w-full bg-theme-bg border border-theme-border rounded px-2 py-1 focus:border-theme-accent-base text-center font-mono font-bold"
                                            value={entry.awayScore}
                                            onChange={(e) => handleEntryChange(index, 'awayScore', e.target.value)}
                                            required
                                            min="0"
                                        />
                                    </td>
                                    <td className="p-2">
                                        <select
                                            className="w-full bg-theme-bg border border-theme-border rounded px-2 py-1 focus:border-theme-accent-base text-sm"
                                            value={entry.awayTeamId}
                                            onChange={(e) => handleEntryChange(index, 'awayTeamId', e.target.value)}
                                            required
                                        >
                                            <option value="">Away Team...</option>
                                            {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                        </select>
                                    </td>
                                    <td className="p-2 text-center">
                                        {entries.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeRow(index)}
                                                className="text-red-400 hover:text-red-300 transition-colors">
                                                <i className="fa-solid fa-trash"></i>
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-6">
                    {entries.map((entry, index) => (
                        <div key={index} className="bg-theme-bg/50 p-4 rounded-xl border border-theme-border relative">
                            {entries.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeRow(index)}
                                    className="absolute top-2 right-2 text-red-400 p-2"
                                >
                                    <i className="fa-solid fa-trash"></i>
                                </button>
                            )}
                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <select
                                    className="bg-theme-bg border border-theme-border rounded px-3 py-2 text-sm"
                                    value={entry.sport}
                                    onChange={(e) => handleEntryChange(index, 'sport', e.target.value)}
                                    required
                                >
                                    <option value="">Sport...</option>
                                    {sports.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                                <select
                                    className="bg-theme-bg border border-theme-border rounded px-3 py-2 text-sm"
                                    value={entry.gender}
                                    onChange={(e) => handleEntryChange(index, 'gender', e.target.value)}
                                    required
                                >
                                    <option value="">Gender...</option>
                                    {genders.map(g => <option key={g} value={g}>{g}</option>)}
                                </select>
                            </div>
                            <input
                                type="date"
                                className="w-full bg-theme-bg border border-theme-border rounded px-3 py-2 text-sm mb-3 scheme-dark"
                                value={entry.date}
                                onChange={(e) => handleEntryChange(index, 'date', e.target.value)}
                                required
                            />

                            <div className="flex items-center gap-2 mb-2">
                                <select
                                    className="flex-1 bg-theme-bg border border-theme-border rounded px-3 py-2 text-sm"
                                    value={entry.homeTeamId}
                                    onChange={(e) => handleEntryChange(index, 'homeTeamId', e.target.value)}
                                    required
                                >
                                    <option value="">Home...</option>
                                    {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                </select>
                                <input
                                    type="number"
                                    className="w-16 bg-theme-bg border border-theme-border rounded px-2 py-2 text-center font-bold"
                                    value={entry.homeScore}
                                    onChange={(e) => handleEntryChange(index, 'homeScore', e.target.value)}
                                    min="0"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <select
                                    className="flex-1 bg-theme-bg border border-theme-border rounded px-3 py-2 text-sm"
                                    value={entry.awayTeamId}
                                    onChange={(e) => handleEntryChange(index, 'awayTeamId', e.target.value)}
                                    required
                                >
                                    <option value="">Away...</option>
                                    {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                </select>
                                <input
                                    type="number"
                                    className="w-16 bg-theme-bg border border-theme-border rounded px-2 py-2 text-center font-bold"
                                    value={entry.awayScore}
                                    onChange={(e) => handleEntryChange(index, 'awayScore', e.target.value)}
                                    min="0"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 flex gap-4">
                    <button
                        type="button"
                        onClick={addRow}
                        className="px-4 py-2 bg-theme-surfaceHover hover:bg-theme-border rounded text-sm font-medium transition-colors border border-theme-border"
                    >
                        <span className="hidden md:inline">+ Add Another Match</span>
                        <span className="md:hidden">+ Add</span>
                    </button>
                    <button
                        type="submit"
                        disabled={status === 'submitting'}
                        className="ml-auto px-8 py-2 bg-theme-accent-base hover:bg-theme-accent-hover text-white rounded font-bold shadow-lg shadow-theme-accent-base/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {status === 'submitting' ? 'Saving...' : 'Save All Results'}
                    </button>
                </div>
            </form>
        </div>
    );
}
