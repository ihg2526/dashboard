const getButtonClass = (isActive) =>
    `px-4 py-2 rounded font-medium text-sm uppercase transition-all duration-200 border ${isActive
        ? 'bg-theme-accent-base text-white border-theme-accent-base shadow-[0_0_10px_rgba(99,102,241,0.4)]'
        : 'bg-theme-surface text-theme-text-muted border-theme-border hover:bg-theme-surfaceHover hover:text-theme-text-main'
    }`;

export default function Filters({
    selectedSports,
    selectedGenders,
    selectedDates,
    availableDates,
    teams,
    selectedTeams,
    onToggleSport,
    onToggleGender,
    onToggleDate,
    onToggleTeam,
    sportOptions,
    genderOptions
}) {
    // Helper to format date for display
    const formatDateLabel = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    // Use passed options directly

    const getButtonClass = (isActive) =>
        `px-4 py-1 rounded-full font-medium text-sm uppercase transition-all duration-200 border shrink-0 ${isActive
            ? 'bg-theme-accent-base text-white border-theme-accent-base shadow-[0_0_10px_rgba(99,102,241,0.4)]'
            : 'bg-theme-surface text-theme-text-muted border-theme-border hover:bg-theme-surfaceHover hover:text-theme-text-main'
        }`;

    return (
        <section className="space-y-6">
            <div>
                <div className="flex flex-nowrap md:flex-wrap overflow-x-auto md:overflow-visible gap-3 mb-5 pb-2 md:pb-0 scrollbar-hide">
                    <span className="text-theme-text-main font-bold my-0 shrink-0 sticky left-0 bg-theme-bg z-10 pr-2">Sport: </span>
                    {sportOptions.map((sport) => (
                        <button
                            key={sport}
                            onClick={() => onToggleSport(sport.toLowerCase())}
                            className={getButtonClass(selectedSports.includes(sport.toLowerCase()))}
                        >
                            {sport}
                        </button>
                    ))}
                </div>

                <div className="flex flex-nowrap md:flex-wrap overflow-x-auto md:overflow-visible gap-3 mb-5 pb-2 md:pb-0 scrollbar-hide">
                    <span className="text-theme-text-main font-bold my-0 shrink-0 sticky left-0 bg-theme-bg z-10 pr-2">Gender: </span>
                    {genderOptions.map((gender) => (
                        <button
                            key={gender}
                            onClick={() => onToggleGender(gender.toLowerCase())}
                            className={getButtonClass(selectedGenders.includes(gender.toLowerCase()))}
                        >
                            {gender}
                        </button>
                    ))}
                </div>

                {/* Team Filters */}
                <div className="flex flex-nowrap md:flex-wrap overflow-x-auto md:overflow-visible gap-3 mb-5 pb-2 md:pb-0 scrollbar-hide">
                    <span className="text-theme-text-main font-bold my-0 shrink-0 sticky left-0 bg-theme-bg z-10 pr-2">Team: </span>
                    {teams && teams.map((team) => (
                        <button
                            key={team.id}
                            onClick={() => onToggleTeam(team.name.toLowerCase())}
                            className={getButtonClass(selectedTeams.includes(team.name.toLowerCase()))}
                        >
                            {team.name}
                        </button>
                    ))}
                </div>

                {/* Date Filters */}
                <div className="flex flex-nowrap md:flex-wrap overflow-x-auto md:overflow-visible gap-3 pb-2 md:pb-0 scrollbar-hide">
                    <span className="text-theme-text-main font-bold my-0 shrink-0 sticky left-0 bg-theme-bg z-10 pr-2">Date: </span>
                    {availableDates && availableDates.map((date) => (
                        <button
                            key={date}
                            onClick={() => onToggleDate(date)}
                            className={getButtonClass(selectedDates.includes(date))}
                        >
                            {formatDateLabel(date)}
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}
