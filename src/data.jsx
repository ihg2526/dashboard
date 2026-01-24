// Fixed data for 6 teams league

export const teamsData = [
    { id: 1, name: 'Eusoff', image: '../assets/logos/eh.png', shortName: 'EH' },
    { id: 2, name: 'Temasek', image: '../assets/logos/te.png', shortName: 'TE' },
    { id: 3, name: 'King Edward', image: '../assets/logos/ke.png', shortName: 'KE' },
    { id: 4, name: 'Raffles', image: '../assets/logos/rh.png', shortName: 'RH' },
    { id: 5, name: 'Sheares', image: '../assets/logos/sh.png', shortName: 'SH' },
    { id: 6, name: 'Kent Ridge', image: '../assets/logos/kr.png', shortName: 'KR' }
];

// League standings (calculated from fixtures)
export const standingsData = [
    { teamId: 1, played: 5, won: 4, drawn: 1, lost: 0, goalsFor: 16, goalsAgainst: 5, points: 13 },
    { teamId: 2, played: 5, won: 3, drawn: 1, lost: 1, goalsFor: 12, goalsAgainst: 8, points: 10 },
    { teamId: 3, played: 5, won: 2, drawn: 2, lost: 1, goalsFor: 10, goalsAgainst: 8, points: 8 },
    { teamId: 4, played: 5, won: 2, drawn: 1, lost: 2, goalsFor: 9, goalsAgainst: 10, points: 7 },
    { teamId: 5, played: 5, won: 1, drawn: 1, lost: 3, goalsFor: 7, goalsAgainst: 13, points: 4 },
    { teamId: 6, played: 5, won: 0, drawn: 0, lost: 5, goalsFor: 4, goalsAgainst: 14, points: 0 }
];

export const sports = ['All', 'Basketball', 'Football', 'Volleyball', 'Tennis', 'Swimming', 'Touch Rugby', 'Badminton', 'Ultimate Frisbee', 'Table Tennis', 'Floorball', 'Sepak Takraw', 'Handball', 'Netball', 'Softball'];
export const genders = ['All', 'Male', 'Female'];

// Recent match results
export const fixturesData = [
    {
        id: 1,
        homeTeamId: 1,
        homeScore: 3,
        awayTeamId: 6,
        awayScore: 0,
        date: '2026-01-20',
        status: 'Final',
        sport: 'Basketball',
        gender: 'Male'
    },
    {
        id: 2,
        homeTeamId: 2,
        homeScore: 2,
        awayTeamId: 3,
        awayScore: 2,
        date: '2026-01-19',
        status: 'Final',
        sport: 'Basketball',
        gender: 'Male'
    },
    {
        id: 3,
        homeTeamId: 4,
        homeScore: 1,
        awayTeamId: 5,
        awayScore: 2,
        date: '2026-01-18',
        status: 'Final',
        sport: 'Basketball',
        gender: 'Male'
    },
    {
        id: 4,
        homeTeamId: 3,
        homeScore: 3,
        awayTeamId: 6,
        awayScore: 1,
        date: '2026-01-17',
        status: 'Final',
        sport: 'Basketball',
        gender: 'Male'
    },
    {
        id: 5,
        homeTeamId: 5,
        homeScore: 2,
        awayTeamId: 2,
        awayScore: 3,
        date: '2026-01-16',
        status: 'Final',
        sport: 'Basketball',
        gender: 'Male'
    },
    {
        id: 6,
        homeTeamId: 1,
        homeScore: 4,
        awayTeamId: 4,
        awayScore: 2,
        date: '2026-01-15',
        status: 'Final',
        sport: 'Basketball',
        gender: 'Male'
    }
];
