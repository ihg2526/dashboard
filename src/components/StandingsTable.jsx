export default function StandingsTable({ standings, teams }) {
    // If not loaded yet, return null or skeleton
    if (!standings || !teams) return null;

    const teamLookup = new Map(teams.map(t => [t.id, t]));

    // Check if we have extended stats (played, won, etc.)
    const hasStats = standings.some(s => s.played !== undefined);

    // Sort standings by points (descending)
    // If stats exist, use GD as tiebreaker
    const sorted = [...standings].sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (hasStats) {
            const gdA = (a.goalsFor || 0) - (a.goalsAgainst || 0);
            const gdB = (b.goalsFor || 0) - (b.goalsAgainst || 0);
            return gdB - gdA;
        }
        return 0; // No tiebreaker for manual points only
    });

    if (sorted.length === 0) return <div className="text-theme-text-muted italic p-4">No standings available.</div>;

    return (
        <div className="overflow-x-auto rounded-lg border border-theme-border/50 shadow-xl bg-theme-surface">
            <table className="w-full text-theme-text-main">
                <thead>
                    <tr className="bg-theme-surface border-b border-theme-border">
                        <th className="px-3 py-3 text-left text-xs font-bold uppercase tracking-wider text-theme-text-muted">#</th>
                        <th className="px-3 py-3 text-left text-xs font-bold uppercase tracking-wider text-theme-text-muted">Team</th>
                        {hasStats && (
                            <>
                                <th className="px-3 py-3 text-center text-xs font-bold uppercase tracking-wider text-theme-text-muted" title="Played">P</th>
                                <th className="px-3 py-3 text-center text-xs font-bold uppercase tracking-wider text-theme-text-muted" title="Won">W</th>
                                <th className="px-3 py-3 text-center text-xs font-bold uppercase tracking-wider text-theme-text-muted" title="Drawn">D</th>
                                <th className="px-3 py-3 text-center text-xs font-bold uppercase tracking-wider text-theme-text-muted" title="Lost">L</th>
                                <th className="px-3 py-3 text-center text-xs font-bold uppercase tracking-wider text-theme-text-muted" title="Goals For">GF</th>
                                <th className="px-3 py-3 text-center text-xs font-bold uppercase tracking-wider text-theme-text-muted" title="Goals Against">GA</th>
                                <th className="px-3 py-3 text-center text-xs font-bold uppercase tracking-wider text-theme-text-muted" title="Goal Difference">GD</th>
                            </>
                        )}
                        <th className="px-3 py-3 text-center text-xs font-bold uppercase tracking-wider text-theme-accent-base" title="Points">Pts</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-theme-border/30 bg-theme-bg/30">
                    {sorted.map((row, index) => {
                        const goalDifference = (row.goalsFor || 0) - (row.goalsAgainst || 0);
                        const teamInfo = teamLookup.get(row.teamId);

                        let rowClass = 'hover:bg-theme-surfaceHover/50 transition-colors';

                        // Top ranks highlighting
                        if (index === 0) rowClass += ' bg-theme-accent-base/10 shadow-[inset_3px_0_0_0_#6366f1]';
                        else if (index === 1) rowClass += ' bg-theme-accent-base/5 shadow-[inset_3px_0_0_0_rgba(99,102,241,0.5)]';
                        else if (index === 2) rowClass += ' shadow-[inset_3px_0_0_0_rgba(99,102,241,0.3)]';

                        return (
                            <tr key={row.teamId} className={rowClass}>
                                <td className="px-3 py-3 text-sm font-semibold text-theme-text-dim">{index + 1}</td>
                                <td className="px-3 py-3 text-sm font-semibold flex items-center gap-3">
                                    {teamInfo?.image ? (
                                        <img src={teamInfo.image} alt={teamInfo.name} className="w-6 h-6 rounded object-cover" />
                                    ) : (
                                        <span className="w-6 h-6 rounded bg-theme-surface flex items-center justify-center text-[10px] font-bold text-theme-text-muted uppercase ring-1 ring-theme-border">
                                            {teamInfo?.shortName || '?'}
                                        </span>
                                    )}
                                    <span className="text-theme-text-main truncate max-w-[120px] sm:max-w-none">{teamInfo?.name || `Team ${row.teamId}`}</span>
                                </td>
                                {hasStats && (
                                    <>
                                        <td className="px-3 py-3 text-sm text-center text-theme-text-dim">{row.played}</td>
                                        <td className="px-3 py-3 text-sm text-center text-theme-text-dim">{row.won}</td>
                                        <td className="px-3 py-3 text-sm text-center text-theme-text-dim">{row.drawn}</td>
                                        <td className="px-3 py-3 text-sm text-center text-theme-text-dim">{row.lost}</td>
                                        <td className="px-3 py-3 text-sm text-center text-theme-text-dim">{row.goalsFor}</td>
                                        <td className="px-3 py-3 text-sm text-center text-theme-text-dim">{row.goalsAgainst}</td>
                                        <td className="px-3 py-3 text-sm text-center text-theme-text-main font-medium">{goalDifference > 0 ? '+' : ''}{goalDifference}</td>
                                    </>
                                )}
                                <td className="px-3 py-3 text-sm text-center font-bold text-theme-accent-base">{row.points}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
