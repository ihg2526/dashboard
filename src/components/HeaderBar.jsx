export default function HeaderBar() {
    return (
        <header className="pt-6 md:pt-10 pb-4 px-4">
            <div className="max-w-6xl mx-auto text-center space-y-3">
                <h1 className="text-3xl md:text-5xl font-bold text-theme-accent-base drop-shadow-[0_2px_10px_rgba(99,102,241,0.5)]">
                    25/26 IHG Dashboard
                </h1>
                <p className="text-theme-text-muted text-lg font-serif italic">Hall standings and recent results</p>
            </div>
        </header>
    );
}
