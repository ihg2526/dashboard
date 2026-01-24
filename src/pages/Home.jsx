import React from 'react';

export default function Home() {
    return (
        <div className="min-h-screen bg-theme-bg text-theme-text-main py-8 px-4 md:py-12 md:px-6">
            <div className="max-w-4xl mx-auto text-center space-y-8">
                <div className="p-8 bg-theme-surface rounded-2xl border border-theme-border shadow-2xl">
                    <h2 className="text-4xl font-bold text-theme-accent-base mb-6">Welcome to the Dashboard</h2>
                    <p className="text-xl text-theme-text-muted leading-relaxed">
                        Stay updated with the latest scores, schedules, and standings for the Inter-Hall Games.
                    </p>

                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-6 bg-theme-bg/50 rounded-xl border border-theme-border hover:border-theme-accent-base/50 transition-colors">
                            <h3 className="text-xl font-bold text-theme-text-main mb-2">Live Results</h3>
                            <p className="text-theme-text-dim">Check recent match outcomes and upcoming fixtures.</p>
                        </div>
                        <div className="p-6 bg-theme-bg/50 rounded-xl border border-theme-border hover:border-theme-accent-base/50 transition-colors">
                            <h3 className="text-xl font-bold text-theme-text-main mb-2">Standings</h3>
                            <p className="text-theme-text-dim">See how your hall ranks against the competition.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
