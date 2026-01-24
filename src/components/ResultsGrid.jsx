// Accept arrays for filtering
export default function ResultsGrid({ selectedDate, selectedSport, selectedGender, selectedTeam, fixtures, teams }) {
    if (!fixtures || !teams) return null;

    // Sort fixtures by date (descending)
    let sorted = [...fixtures].sort((a, b) => new Date(b.date) - new Date(a.date));
    const teamLookup = new Map(teams.map((t) => [t.id, t]));

    // Multi-select Filtering Logic
    // For each criterion: If array is NOT empty AND item value is NOT included, filter it out.
    // (Behavior: Empty selection = Show All. Non-empty selection = Show Matches.)

    sorted = sorted.filter(f => {
        // Date Filter
        if (selectedDate && selectedDate.length > 0 && !selectedDate.includes(f.date)) return false;

        // Sport Filter
        if (selectedSport && selectedSport.length > 0 && !selectedSport.includes(f.sport.toLowerCase())) return false;

        // Gender Filter
        if (selectedGender && selectedGender.length > 0 && !selectedGender.includes(f.gender.toLowerCase())) return false;

        // Team Filter
        // For teams, check if home OR away team is in the selected set
        if (selectedTeam && selectedTeam.length > 0) {
            const homeName = teamLookup.get(f.homeTeamId)?.name.toLowerCase();
            const awayName = teamLookup.get(f.awayTeamId)?.name.toLowerCase();
            const homeMatch = homeName && selectedTeam.includes(homeName);
            const awayMatch = awayName && selectedTeam.includes(awayName);
            if (!homeMatch && !awayMatch) return false;
        }

        return true;
    });

    const formatDate = (dateStr) => {
        const dateObj = new Date(dateStr);
        return dateObj.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {sorted.map((result) => {
                const homeTeam = teamLookup.get(result.homeTeamId);
                const awayTeam = teamLookup.get(result.awayTeamId);

                return (
                    <div
                        key={result.id}
                        className="bg-theme-surface border border-theme-border/50 rounded-xl p-4 hover:-translate-y-1 hover:shadow-lg hover:shadow-theme-accent-base/10 transition-all duration-300 group"
                    >
                        <div className="flex justify-between items-center mb-3 text-xs text-theme-text-dim font-medium uppercase tracking-wider">
                            <span>{new Date(result.date).toLocaleDateString()}</span>
                            <span className="text-emerald-500">Final</span>
                        </div>

                        <div className="flex items-center justify-between gap-4">
                            {/* Home Team */}
                            <div className="flex-1 flex flex-col items-center gap-2">
                                {/* <img
                                    src={homeTeam?.image}
                                    alt={homeTeam?.name}
                                    className="w-12 h-12 rounded object-cover"
                                /> */}
                                <span className="text-md font-bold text-center text-theme-text-main line-clamp-1">
                                    {homeTeam?.shortName}
                                </span>
                            </div>

                            {/* Score */}
                            <div className="flex flex-col items-center">
                                <div className="text-3xl font-black text-theme-text-main slashed-zero tabular-nums tracking-tight">
                                    {result.homeScore}
                                    <span className="text-theme-text-dim px-1">:</span>
                                    {result.awayScore}
                                </div>
                            </div>

                            {/* Away Team */}
                            <div className="flex-1 flex flex-col items-center gap-2">
                                {/* <img
                                    src={awayTeam?.image}
                                    alt={awayTeam?.name}
                                    className="w-12 h-12 rounded object-cover"
                                /> */}
                                <span className="text-md font-bold text-center text-theme-text-main line-clamp-1">
                                    {awayTeam?.shortName}
                                </span>
                            </div>
                        </div>

                        <div className="text-center">
                            <span className="text-sm text-theme-text-dim">
                                {result.sport} ({result.gender})
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
