import { NavLink } from 'react-router-dom';

export default function NavBar() {
    const navItems = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Forms', path: '/forms' },
        { name: 'Results', path: '/results' },
    ];

    return (
        <nav className="bg-theme-surface border-y border-theme-border sticky top-0 z-50 shadow-lg">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex items-center justify-around md:justify-center space-x-1 md:space-x-8 h-14 md:h-16">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) =>
                                `text-sm md:text-lg font-medium transition-colors duration-200 px-3 py-2 rounded-md ${isActive
                                    ? 'text-theme-accent-base bg-theme-surfaceHover'
                                    : 'text-theme-text-muted hover:text-theme-text-main hover:bg-theme-surfaceHover/50'
                                }`
                            }
                        >
                            {item.name}
                        </NavLink>
                    ))}
                </div>
            </div>
        </nav>
    );
}
