export function calculateStandingsFromFixtures(fixtures, teams) {
    if (!fixtures || fixtures.length === 0) return [];

    // Helper to get defaults
    const getInitStats = (teamId) => ({
        teamId,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        points: 0
    });

    // Group by Sport|Gender
    const groups = {};

    fixtures.forEach(fixture => {
        // Only process finished games
        if (fixture.status !== 'Final') return;

        const key = `${fixture.sport}|${fixture.gender}`;
        if (!groups[key]) {
            groups[key] = {
                sport: fixture.sport,
                gender: fixture.gender,
                teamsMap: new Map()
            };
        }

        const group = groups[key];
        const homeId = Number(fixture.homeTeamId);
        const awayId = Number(fixture.awayTeamId);
        const homeScore = Number(fixture.homeScore);
        const awayScore = Number(fixture.awayScore);

        if (!group.teamsMap.has(homeId)) group.teamsMap.set(homeId, getInitStats(homeId));
        if (!group.teamsMap.has(awayId)) group.teamsMap.set(awayId, getInitStats(awayId));

        const homeStats = group.teamsMap.get(homeId);
        const awayStats = group.teamsMap.get(awayId);

        // Update Played
        homeStats.played += 1;
        awayStats.played += 1;

        // Update Goals
        homeStats.goalsFor += homeScore;
        homeStats.goalsAgainst += awayScore;
        awayStats.goalsFor += awayScore;
        awayStats.goalsAgainst += homeScore;

        // Update W/D/L & Points
        if (homeScore > awayScore) {
            homeStats.won += 1;
            homeStats.points += 3;
            awayStats.lost += 1;
        } else if (awayScore > homeScore) {
            awayStats.won += 1;
            awayStats.points += 3;
            homeStats.lost += 1;
        } else {
            homeStats.drawn += 1;
            homeStats.points += 1;
            awayStats.drawn += 1;
            awayStats.points += 1;
        }
    });

    // Convert map to array and format
    const results = Object.values(groups).map(group => {
        const entries = Array.from(group.teamsMap.values());
        return {
            sport: group.sport,
            gender: group.gender,
            entries
        };
    });

    return results;
}

export function calculateAggregatedStandings(fixtures, teams) {
    if (!fixtures || fixtures.length === 0) return { overall: [], female: [], male: [] };

    // Helper to get defaults
    const getInitStats = (teamId) => ({
        teamId,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        points: 0
    });

    // Maps for aggregation
    const overallMap = new Map();
    const femaleMap = new Map();
    const maleMap = new Map();

    fixtures.forEach(fixture => {
        // Only process finished games
        if (fixture.status !== 'Final') return;

        const homeId = Number(fixture.homeTeamId);
        const awayId = Number(fixture.awayTeamId);
        const homeScore = Number(fixture.homeScore);
        const awayScore = Number(fixture.awayScore);
        const gender = fixture.gender.toLowerCase(); // Ensure case-insensitive match

        // Ensure teams exist in maps
        [overallMap, femaleMap, maleMap].forEach(map => {
            if (!map.has(homeId)) map.set(homeId, getInitStats(homeId));
            if (!map.has(awayId)) map.set(awayId, getInitStats(awayId));
        });

        // Determine points
        let homePoints = 0;
        let awayPoints = 0;
        let homeWon = 0;
        let awayWon = 0;
        let drawn = 0;
        let homeLost = 0;
        let awayLost = 0;

        if (homeScore > awayScore) {
            homePoints = 3;
            homeWon = 1;
            awayLost = 1;
        } else if (awayScore > homeScore) {
            awayPoints = 3;
            awayWon = 1;
            homeLost = 1;
        } else {
            homePoints = 1;
            awayPoints = 1;
            drawn = 1;
        }

        // Helper to update a specific map with weighted points
        const updateStats = (map, multiplier = 1) => {
            const h = map.get(homeId);
            const a = map.get(awayId);

            h.played += 1;
            h.won += homeWon;
            h.drawn += drawn;
            h.lost += homeLost;
            h.goalsFor += homeScore;
            h.goalsAgainst += awayScore;
            h.points += (homePoints * multiplier);

            a.played += 1;
            a.won += awayWon;
            a.drawn += drawn;
            a.lost += awayLost;
            a.goalsFor += awayScore;
            a.goalsAgainst += homeScore;
            a.points += (awayPoints * multiplier);
        };

        // --- OVERALL: Always add full stats ---
        updateStats(overallMap, 1);

        // --- FEMALE ---
        if (gender === 'female') {
            updateStats(femaleMap, 1);
        } else if (gender === 'mixed') {
            // Mixed games count for female but with HALF points
            updateStats(femaleMap, 0.5);
        }

        // --- MALE ---
        if (gender === 'male') {
            updateStats(maleMap, 1);
        } else if (gender === 'mixed') {
            // Mixed games count for male but with HALF points
            updateStats(maleMap, 0.5);
        }
    });

    // Helper to format map to array
    const format = (map) => Array.from(map.values());

    return {
        overall: format(overallMap),
        female: format(femaleMap),
        male: format(maleMap)
    };
}
