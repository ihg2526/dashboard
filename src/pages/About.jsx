import React from 'react';
import TeamStrip from '../components/TeamStrip';

export default function About({ teams }) {
    return (
        <div className="min-h-screen bg-theme-bg text-theme-text-main py-8 px-4 md:py-12 md:px-6">
            <div className="max-w-4xl mx-auto">
                <div className="bg-theme-surface rounded-2xl border border-theme-border p-8 shadow-xl space-y-6">
                    <h1 className="text-4xl font-bold text-theme-accent-base border-b border-theme-border pb-4">About IHG 25/26</h1>

                    <div className="space-y-4 text-theme-text-muted text-lg leading-relaxed">
                        <p>
                            Inter Hall Games (IHG) is an annual competition between the 6 Residential Halls within NUS, namely Sheares, Kent Ridge, Temasek, Eusoff, Raffles, King Edward VII. The competition consists of 31 different sports for the various athletes of respective Halls to compete for the title of IHG Champions.
                        </p>

                        <TeamStrip teams={teams} />

                        <p>
                            This dashboard serves as the central hub for all match information. Here you can find:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-theme-text-main">
                            <li>Match results</li>
                            <li>Detailed league standings</li>
                            <li>Head-to-head records</li>
                        </ul>
                    </div>

                    <div className="pt-6 border-t border-theme-border">
                        <h3 className="text-xl font-bold text-theme-text-main mb-2">Contact Us</h3>
                        <p className="text-theme-text-dim">
                            For inquiries or to report score discrepancies, please contact the sports committee.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
