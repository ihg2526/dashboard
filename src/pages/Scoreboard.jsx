// HeaderBar moved to App layout
import { useMemo } from 'react';
import Filters from '../components/Filters';
import StandingsTable from '../components/StandingsTable';
import HeadToHeadMatrix from '../components/HeadToHeadMatrix';
import ResultsGrid from '../components/ResultsGrid';
import SEO from '../components/SEO';

export default function Scoreboard({
    data,
    loading,
    onToggleSport,
    onToggleGender,
    onToggleDate,
    onToggleTeam,
    selectedSports,
    selectedGenders,
    selectedDates,
    selectedTeams,
    availableDates
}) {

    if (loading) {
        return (
            <div className="min-h-screen bg-theme-bg flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-theme-accent-base border-t-transparent rounded-full animate-spin"></div>
                    <div className="text-theme-text-muted animate-pulse">Loading Live Scores...</div>
                </div>
            </div>
        );
    }

    // 1. Filter Fixtures (Centralized Logic)
    const filteredFixtures = useMemo(() => {
        return data.fixtures.filter(f => {
            // Sport (Case-insensitive)
            if (selectedSports.length > 0 && !selectedSports.includes(f.sport.toLowerCase())) return false;

            // Gender (Case-insensitive)
            if (selectedGenders.length > 0 && !selectedGenders.includes(f.gender.toLowerCase())) return false;

            // Date
            if (selectedDates.length > 0 && !selectedDates.includes(f.date)) return false;

            // Team (Check if Home or Away team is selected)
            if (selectedTeams.length > 0) {
                const homeTeam = data.teams.find(t => t.id === f.homeTeamId);
                const awayTeam = data.teams.find(t => t.id === f.awayTeamId);
                const homeMatch = homeTeam && selectedTeams.includes(homeTeam.name.toLowerCase());
                const awayMatch = awayTeam && selectedTeams.includes(awayTeam.name.toLowerCase());
                if (!homeMatch && !awayMatch) return false;
            }

            return true;
        });
    }, [data.fixtures, data.teams, selectedSports, selectedGenders, selectedDates, selectedTeams]);

    // 2. Standings Source (Always use Official Standings)
    const activeStandings = data.standings || [];


    return (
        <div className="min-h-screen bg-theme-bg text-theme-text-main px-4 md:px-6 font-sans mt-5">
            <SEO
                title="Scoreboard | 25/26 IHG Dashboard"
                description="Live scores, detailed standings, and head-to-head records for the IHG tournament."
            />
            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-4 space-y-10">
                {/* Standings Section */}
                <Filters
                    selectedSports={selectedSports}
                    selectedGenders={selectedGenders}
                    selectedDates={selectedDates}
                    availableDates={availableDates}
                    teams={data.teams}
                    selectedTeams={selectedTeams}
                    onToggleSport={onToggleSport}
                    onToggleGender={onToggleGender}
                    onToggleDate={onToggleDate}
                    onToggleTeam={onToggleTeam}
                    sportOptions={data.sports}
                    genderOptions={data.genders}
                />

                {/* Standings Section */}
                <section className="py-8">
                    <h2 className="text-3xl font-bold text-theme-text-main mb-8 border-b border-theme-accent-base/30 pb-2 inline-block">
                        {/* Title */}
                        Standings
                    </h2>

                    {(() => {
                        // Filter standings by selection (redundant for dynamic, but needed for manual if we partly filter manual)
                        // Actually, for dynamic, they are ALREADY filtered by virtue of fixtures being filtered.
                        // For manual, we still need to hide non-matching sports/genders if selected.

                        const currentStandings = activeStandings.filter(s => {
                            // Even if we use manual standings, we should still respect the Sport/Gender filters if they exist
                            // (Though usually we switch to dynamic if ANY filter exists, so this might be redundant but safe)
                            if (selectedSports.length > 0 && !selectedSports.includes((s.sport || '').toLowerCase())) return false;
                            if (selectedGenders.length > 0 && !selectedGenders.includes((s.gender || '').toLowerCase())) return false;
                            return true;
                        });

                        if (currentStandings.length === 0) return <div className="text-theme-text-muted italic">No standings available for current selection.</div>;

                        // Sort by Sport then Gender
                        currentStandings.sort((a, b) => {
                            const sportA = a.sport || '';
                            const sportB = b.sport || '';
                            const genderA = a.gender || '';
                            const genderB = b.gender || '';

                            if (sportA !== sportB) return sportA.localeCompare(sportB);
                            return genderA.localeCompare(genderB);
                        });

                        return (
                            <div className="flex flex-col gap-12">
                                {currentStandings.map((s, index) => (
                                    <div key={index} className="space-y-4">
                                        <h3 className="text-xl font-bold text-theme-text-main border-l-4 border-theme-accent-base pl-3">
                                            {s.sport} <span className="text-theme-text-muted font-normal text-sm ml-2">({s.gender})</span>
                                        </h3>
                                        <StandingsTable standings={s.entries} teams={data.teams} />
                                    </div>
                                ))}
                            </div>
                        );
                    })()}
                </section>

                {/* Head-to-Head Matrix */}
                <section className="py-8">
                    <h2 className="text-3xl font-bold text-theme-text-main mb-6 border-b border-theme-accent-base/30 pb-2 inline-block">
                        Head-to-Head Summary
                    </h2>

                    <div className="grid grid-cols-1 xl:grid-cols-3 md:grid-cols-2 gap-8 justify-items-center md:justify-items-stretch overflow-x-hidden">
                        {(() => {
                            // Use the centralized filteredFixtures
                            // Group by Sport|Gender
                            const groups = {};
                            filteredFixtures.forEach(f => {
                                const key = `${f.sport}|${f.gender}`;
                                if (!groups[key]) groups[key] = [];
                                groups[key].push(f);
                            });

                            // Sort keys for consistent order
                            const sortedKeys = Object.keys(groups).sort();

                            if (sortedKeys.length === 0) {
                                return <div className="text-theme-text-muted italic">No matching results found.</div>;
                            }

                            return sortedKeys.map(key => {
                                const [sport, gender] = key.split('|');
                                return (
                                    <HeadToHeadMatrix
                                        key={key}
                                        teams={data.teams}
                                        fixtures={groups[key]}
                                        title={`${sport} (${gender})`}
                                    />
                                );
                            });
                        })()}
                    </div>
                </section>

                {/* Results Section */}
                <section className="pb-8">
                    <h2 className="text-3xl font-bold text-theme-text-main mb-8 border-b border-theme-accent-base/30 pb-2 inline-block">
                        Recent Results
                    </h2>
                    <ResultsGrid
                        fixtures={data.fixtures}
                        teams={data.teams}
                        selectedDate={selectedDates}
                        selectedSport={selectedSports}
                        selectedGender={selectedGenders}
                        selectedTeam={selectedTeams}
                    />
                </section>
            </main>

            {/* Footer */}
            {/* Header removed for global layout */}
        </div>
    );
}
