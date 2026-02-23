import db from '../data/db.json';

// --- Helpers to replicate backend logic for static site ---

function calculateStatsForFixtures(fixtures) {
    const statsMap = new Map();

    const getInit = (teamId) => ({
        teamId, played: 0, won: 0, drawn: 0, lost: 0
    });

    const ensure = (id) => {
        if (!statsMap.has(id)) statsMap.set(id, getInit(id));
        return statsMap.get(id);
    };

    fixtures.forEach(f => {
        if (f.status !== 'Final') return;

        const homeId = Number(f.homeTeamId);
        const awayId = Number(f.awayTeamId);
        const homeScore = Number(f.homeScore);
        const awayScore = Number(f.awayScore);

        const h = ensure(homeId);
        const a = ensure(awayId);

        h.played++;
        a.played++;

        if (homeScore > awayScore) {
            h.won++;
            a.lost++;
        } else if (awayScore > homeScore) {
            a.won++;
            h.lost++;
        } else {
            h.drawn++;
            a.drawn++;
        }
    });

    return statsMap;
}

function enrichStandings(standings, fixtures) {
    if (!standings) return [];

    return standings.map(standing => {
        const sport = standing.sport;
        const gender = standing.gender;

        const relevantFixtures = fixtures.filter(f =>
            f.sport === sport &&
            (f.gender || '').toLowerCase() === (gender || '').toLowerCase()
        );

        if (relevantFixtures.length > 0) {
            const statsMap = calculateStatsForFixtures(relevantFixtures);

            const enrichedEntries = standing.entries.map(entry => {
                const teamId = Number(entry.teamId);
                const stats = statsMap.get(teamId) || {
                    played: 0, won: 0, drawn: 0, lost: 0
                };
                return { ...entry, ...stats };
            });

            return { ...standing, entries: enrichedEntries };
        } else {
            const enrichedEntries = standing.entries.map(entry => ({
                ...entry, played: 0, won: 0, drawn: 0, lost: 0
            }));
            return { ...standing, entries: enrichedEntries };
        }
    });
}

function calculateAggregatedStandings(fixtures, standingsData) {
    if ((!fixtures || fixtures.length === 0) && (!standingsData || standingsData.length === 0)) {
        return { overall: [], female: [], male: [] };
    }

    const getInitStats = (teamId) => ({
        teamId, played: 0, won: 0, drawn: 0, lost: 0, points: 0
    });

    const overallMap = new Map();
    const femaleMap = new Map();
    const maleMap = new Map();

    const ensureStats = (map, teamId) => {
        if (!map.has(teamId)) map.set(teamId, getInitStats(teamId));
        return map.get(teamId);
    };

    if (fixtures && fixtures.length > 0) {
        fixtures.forEach(fixture => {
            if (fixture.status !== 'Final') return;

            const homeId = Number(fixture.homeTeamId);
            const awayId = Number(fixture.awayTeamId);
            const homeScore = Number(fixture.homeScore);
            const awayScore = Number(fixture.awayScore);
            const gender = (fixture.gender || '').toLowerCase();

            [overallMap, femaleMap, maleMap].forEach(map => {
                ensureStats(map, homeId);
                ensureStats(map, awayId);
            });

            let homeWon = 0, awayWon = 0, drawn = 0, homeLost = 0, awayLost = 0;

            if (homeScore > awayScore) { homeWon = 1; awayLost = 1; }
            else if (awayScore > homeScore) { awayWon = 1; homeLost = 1; }
            else { drawn = 1; }

            const updateStats = (map) => {
                const h = map.get(homeId);
                const a = map.get(awayId);
                h.played += 1; h.won += homeWon; h.drawn += drawn; h.lost += homeLost;
                a.played += 1; a.won += awayWon; a.drawn += drawn; a.lost += awayLost;
            };

            updateStats(overallMap);
            if (gender === 'female' || gender === 'mixed') updateStats(femaleMap);
            if (gender === 'male' || gender === 'mixed') updateStats(maleMap);
        });
    }

    if (standingsData && Array.isArray(standingsData)) {
        standingsData.forEach(standing => {
            const gender = (standing.gender || '').toLowerCase();
            const entries = standing.entries || [];

            entries.forEach(entry => {
                const teamId = Number(entry.teamId);
                const points = Number(entry.points);

                const addPoints = (map, multiplier = 1) => {
                    const stats = ensureStats(map, teamId);
                    stats.points += (points * multiplier);
                };

                addPoints(overallMap, 1);
                if (gender === 'female') addPoints(femaleMap, 1);
                else if (gender === 'male') addPoints(maleMap, 1);
                else if (gender === 'mixed') {
                    addPoints(femaleMap, 0.5);
                    addPoints(maleMap, 0.5);
                }
            });
        });
    }

    const format = (map) => Array.from(map.values());
    return {
        overall: format(overallMap),
        female: format(femaleMap),
        male: format(maleMap)
    };
}

// --- Static API Implementations ---

export const api = {
    fetchTeams: async () => db.teams || [],

    fetchStandings: async () => enrichStandings(db.standings || [], db.fixtures || []),

    fetchAggregatedStandings: async () => calculateAggregatedStandings(db.fixtures || [], db.standings || []),

    fetchFixtures: async () => db.fixtures || [],

    fetchMetadata: async () => db.metadata || {},

    fetchInitialData: async () => ({
        teams: db.teams || [],
        fixtures: db.fixtures || [],
        sports: db.metadata?.sports || [],
        genders: db.metadata?.genders || [],
        standings: enrichStandings(db.standings || [], db.fixtures || []),
        forms: db.forms || []
    }),

    fetchForms: async () => db.forms || [],

    // Mutations are disabled for the static site
    uploadForm: async () => { throw new Error('Static site: upload disabled'); },
    deleteForm: async () => { throw new Error('Static site: delete disabled'); },
    addResults: async () => { throw new Error('Static site: add results disabled'); },
    saveStandings: async () => { throw new Error('Static site: save standings disabled'); },
    login: async () => { throw new Error('Static site: login disabled'); }
};
