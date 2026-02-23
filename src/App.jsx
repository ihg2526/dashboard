import { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, Outlet, Navigate } from 'react-router-dom';
import { api } from './services/api';

// Components
import HeaderBar from './components/HeaderBar';
import NavBar from './components/NavBar';
import FooterBar from './components/FooterBar';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Forms from './pages/Forms';
import Scoreboard from './pages/Scoreboard';




function MainLayout() {
    return (
        <div className="min-h-screen bg-theme-bg flex flex-col font-sans">
            <HeaderBar />
            <NavBar />
            <div className="flex-grow">
                <Outlet />
            </div>
            <FooterBar />


        </div>
    );
}

export default function App() {
    // Data State
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({
        teams: [],
        standings: [],
        fixtures: [],
        sports: [],
        genders: [],
    });

    // Filter State (Global across scoreboard views)
    const [selectedSports, setSelectedSports] = useState([]);
    const [selectedGenders, setSelectedGenders] = useState([]);
    const [selectedTeams, setSelectedTeams] = useState([]);
    const [selectedDates, setSelectedDates] = useState([]);

    // Load Data
    const loadData = async () => {
        try {
            const initialData = await api.fetchInitialData();
            setData(initialData);
        } catch (error) {
            console.error("Failed to load data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // Derive unique dates from fixtures, sorted descending
    const availableDates = Array.from(new Set(data.fixtures.map(f => f.date)))
        .sort((a, b) => new Date(b) - new Date(a));

    const toggleSelection = (current, item, setter) => {
        if (current.includes(item)) {
            setter(current.filter(i => i !== item));
        } else {
            setter([...current, item]);
        }
    };

    return (
        <HashRouter>
            <Routes>
                {/* Main Public Routes */}
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Home data={data} />} />
                    <Route path="/about" element={<About teams={data.teams} />} />
                    <Route path="/forms" element={<Forms />} />
                    <Route path="/results" element={
                        <Scoreboard
                            data={data}
                            loading={loading}
                            onToggleSport={(sport) => toggleSelection(selectedSports, sport, setSelectedSports)}
                            onToggleGender={(gender) => toggleSelection(selectedGenders, gender, setSelectedGenders)}
                            onToggleDate={(date) => toggleSelection(selectedDates, date, setSelectedDates)}
                            onToggleTeam={(team) => toggleSelection(selectedTeams, team, setSelectedTeams)}
                            selectedSports={selectedSports}
                            selectedGenders={selectedGenders}
                            selectedDates={selectedDates}
                            selectedTeams={selectedTeams}
                            availableDates={availableDates}
                        />
                    } />
                </Route>


            </Routes>
        </HashRouter>
    );
}
