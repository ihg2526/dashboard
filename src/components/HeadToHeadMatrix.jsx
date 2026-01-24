import { useMemo } from 'react';

export default function HeadToHeadMatrix({ teams, fixtures, title }) {
    const headToHead = useMemo(() => {
        const map = new Map();

        if (!fixtures) return map;

        fixtures.forEach((f) => {
            if (f.status !== 'Final') return;

            // Canonical key to treat (A vs B) same as (B vs A)
            // Ensure IDs are treated as numbers for consistent comparison
            const homeId = Number(f.homeTeamId);
            const awayId = Number(f.awayTeamId);
            const minId = Math.min(homeId, awayId);
            const maxId = Math.max(homeId, awayId);
            const key = `${minId}|${maxId}`;

            if (!map.has(key)) {
                map.set(key, { [minId]: 0, [maxId]: 0 });
            }

            const record = map.get(key);

            // Add scores to the respective team ID
            // Ensure scores are numbers
            record[homeId] += Number(f.homeScore);
            record[awayId] += Number(f.awayScore);
        });
        return map;
    }, [fixtures]);

    const getMatchCell = (rowId, colId) => {
        // Ensure IDs are numbers
        const rId = Number(rowId);
        const cId = Number(colId);

        if (rId === cId) return '—';

        const minId = Math.min(rId, cId);
        const maxId = Math.max(rId, cId);
        const key = `${minId}|${maxId}`;

        const record = headToHead.get(key);

        if (!record) return '—';

        // Return score oriented to the Row Team
        return `${record[rId]}-${record[cId]}`;
    };

    return (
        <div className="flex flex-col gap-2 w-full h-full">
            <div className="overflow-x-auto border border-theme-border/50 rounded-lg w-full">
                <table className="w-full text-sm border-collapse table-fixed">
                    <thead>
                        <tr className="bg-theme-surface">
                            <th className="px-2 py-3 text-center text-xs font-bold uppercase tracking-wider text-theme-text-muted border-b border-theme-border">Team</th>
                            {teams.map((col) => (
                                <th key={col.id} className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-theme-text-muted border-b border-theme-border">
                                    {col.shortName}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-theme-bg/30 divide-y divide-theme-border/10">
                        {teams.map((row) => (
                            <tr key={row.id} className="hover:bg-theme-surfaceHover/30 transition-colors">
                                <td className="px-4 py-2 font-bold text-center text-theme-text-dim border-r border-theme-border/30 bg-theme-surface/20">
                                    {row.shortName}
                                </td>
                                {teams.map((col) => (
                                    <td key={col.id} className="px-1 py-1 text-center font-medium text-xs text-theme-text-dim/80 hover:bg-theme-accent-base/10 transition-colors cursor-default">
                                        {getMatchCell(row.id, col.id)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {title && (
                <div className="flex justify-center px-1">
                    <span className="text-[14px] uppercase font-bold tracking-widest text-theme-text-muted/80">{title}</span>
                </div>
            )}
        </div>
    );
}
