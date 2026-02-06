import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { getBackendUrl } from '../utils/paths';
import SEO from '../components/SEO';

export default function Forms() {
    const [forms, setForms] = useState([]);

    useEffect(() => {
        api.fetchForms().then(setForms).catch(console.error);
    }, []);

    return (
        <div className="min-h-screen bg-theme-bg text-theme-text-main py-8 px-4 md:py-12 md:px-6">
            <SEO
                title="Forms & Resources | 25/26 IHG Dashboard"
                description="Download necessary forms and resources for the IHG tournament, including risk acknowledgement and Par-Q forms."
            />
            <div className="max-w-4xl mx-auto">
                <div className="bg-theme-surface rounded-2xl border border-theme-border p-8 shadow-xl">
                    <h1 className="text-4xl font-bold text-theme-accent-base mb-8">Forms & Resources</h1>

                    <div className="grid gap-6">
                        {/* Static Forms */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-theme-bg/50 rounded-xl border border-theme-border gap-4">
                            <div>
                                <h3 className="text-xl font-bold text-theme-text-main">
                                    Risk acknowledgement form</h3>
                                <p className="text-theme-text-dim mt-1">
                                    Please complete this form before the first match regardless of sport.</p>
                            </div>
                            <a
                                href="https://forms.gle/QCgJrgqXg4EspTtS7"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-theme-surfaceHover text-theme-accent-base border border-theme-accent-base rounded-lg hover:bg-theme-accent-base hover:text-white transition-colors"
                            >
                                Open Form
                            </a>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-theme-bg/50 rounded-xl border border-theme-border gap-4">
                            <div>
                                <h3 className="text-xl font-bold text-theme-text-main">Par-Q</h3>
                                <p className="text-theme-text-dim mt-1">Once a day on the match day and before the first match of the day</p>
                            </div>
                            <a
                                href="https://forms.gle/2PcZrbC5eQHLfZZZ7"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-theme-surfaceHover text-theme-accent-base border border-theme-accent-base rounded-lg hover:bg-theme-accent-base hover:text-white transition-colors"
                            >
                                Open Form
                            </a>
                        </div>

                        {/* Dynamic Forms */}
                        {forms.map(form => (
                            <div key={form.id} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-theme-bg/50 rounded-xl border border-theme-border gap-4">
                                <div>
                                    <h3 className="text-xl font-bold text-theme-text-main">{form.name}</h3>
                                    <p className="text-theme-text-dim mt-1">Uploaded document</p>
                                </div>
                                <a
                                    href={getBackendUrl(form.path)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 bg-theme-surfaceHover text-theme-accent-base border border-theme-accent-base rounded-lg hover:bg-theme-accent-base hover:text-white transition-colors"
                                >
                                    Open Form
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
