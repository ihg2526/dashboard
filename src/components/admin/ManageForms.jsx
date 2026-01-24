import { useState, useEffect } from 'react';
import { api } from '../../services/api';

export default function ManageForms() {
    const [forms, setForms] = useState([]);
    const [formName, setFormName] = useState('');
    const [formFile, setFormFile] = useState(null);
    const [status, setStatus] = useState('idle');

    // Fetch forms on load
    useEffect(() => {
        api.fetchForms().then(setForms).catch(console.error);
    }, []);

    const handleFormUpload = async (e) => {
        e.preventDefault();
        setStatus('submitting');

        if (!formName || !formFile) {
            setStatus('error');
            return;
        }

        const formData = new FormData();
        formData.append('name', formName);
        formData.append('file', formFile);

        try {
            const newForm = await api.uploadForm(formData);
            setForms([...forms, newForm]);
            setStatus('success');
            setFormName('');
            setFormFile(null);
            // Reset file input
            e.target.reset();
            setTimeout(() => setStatus('idle'), 3000);
        } catch (err) {
            console.error(err);
            setStatus('error');
        }
    };

    const handleDeleteForm = async (id) => {
        if (!confirm('Are you sure you want to delete this form?')) return;
        try {
            await api.deleteForm(id);
            setForms(forms.filter(f => f.id !== id));
        } catch (err) {
            console.error(err);
            alert('Failed to delete form');
        }
    };

    return (
        <div>
            {status === 'success' && (
                <div className="mb-6 p-4 bg-emerald-500/20 border border-emerald-500/50 rounded-lg text-emerald-400 font-medium animate-pulse">
                    ✅ Uploaded successfully!
                </div>
            )}

            {status === 'error' && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 font-medium">
                    ❌ Failed to upload. Please check your inputs.
                </div>
            )}

            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="text-3xl">📄</span> Manage Forms
            </h2>
            <p className="text-theme-text-muted mb-6">Upload documents (PDF, Doc, etc) to be displayed on the Forms page.</p>

            <form onSubmit={handleFormUpload} className="mb-10 bg-theme-bg/30 p-6 rounded-lg border border-theme-border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-bold text-theme-text-muted mb-2">Display Name</label>
                        <input
                            type="text"
                            className="w-full h-12 bg-theme-bg border border-theme-border rounded px-3 text-theme-text-main focus:border-theme-accent-base"
                            value={formName}
                            onChange={(e) => setFormName(e.target.value)}
                            placeholder="e.g. Season Schedule"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-theme-text-muted mb-2">File</label>
                        <input
                            type="file"
                            className="w-full h-12 bg-theme-bg border border-theme-border rounded px-3 py-1.5 text-theme-text-main focus:border-theme-accent-base file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-theme-surfaceHover file:text-theme-accent-base hover:file:bg-theme-border"
                            onChange={(e) => setFormFile(e.target.files[0])}
                            required
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="px-8 py-3 bg-theme-accent-base hover:bg-theme-accent-hover text-white rounded-lg font-bold shadow-lg shadow-theme-accent-base/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {status === 'submitting' ? 'Uploading...' : 'Upload Form'}
                </button>
            </form>

            <h3 className="text-xl font-bold mb-4">Uploaded Forms</h3>
            <div className="space-y-4">
                {forms.length === 0 ? (
                    <p className="text-theme-text-dim italic">No forms uploaded yet.</p>
                ) : (
                    forms.map(form => (
                        <div key={form.id} className="flex items-center justify-between bg-theme-bg/50 p-4 rounded-xl border border-theme-border">
                            <div>
                                <h4 className="font-bold text-lg">{form.name}</h4>
                                <p className="text-xs text-theme-text-dim font-mono mt-1">{form.originalName}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <a
                                    href={form.path}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-theme-accent-base hover:underline text-sm font-medium"
                                >
                                    View
                                </a>
                                <button
                                    onClick={() => handleDeleteForm(form.id)}
                                    className="text-red-400 hover:text-red-300 transition-colors bg-red-500/10 p-2 rounded-lg hover:bg-red-500/20"
                                    title="Delete"
                                >
                                    <i className="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
