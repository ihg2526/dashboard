export default function TeamStrip({ teams }) {
    return (
        <section className="py-1">
            <div className="max-w-6xl mx-auto px-4 py-6 flex gap-4 overflow-x-auto no-scrollbar">
                {teams.map((team) => (
                    <div
                        key={team.id}
                        className="flex flex-col items-center gap-2 px-2 py-4 rounded-lg backdrop-blur-sm min-w-[100px] w-1/6 hover:scale-105 transition-all duration-200"
                    >
                        <img
                            src={team.image}
                            alt={team.name}
                            className="w-full max-h-[150px] object-cover rounded drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                        />
                        <div className="text-sm font-semibold text-center leading-tight text-theme-text-muted">
                            {team.name} ({team.shortName})
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
