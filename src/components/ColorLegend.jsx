import { useTheme } from '../context/ThemeContext';

export const ColorLegend = () => {
    const { currentTheme } = useTheme();

    const levels = [
        { label: '0%', color: 'bg-slate-100 dark:bg-slate-700/40 border border-transparent' },
        { label: '1-25%', color: currentTheme.intensity[1] },
        { label: '26-50%', color: currentTheme.intensity[2] },
        { label: '51-75%', color: currentTheme.intensity[3] },
        { label: '76-100%', color: currentTheme.intensity[4] },
    ];

    return (
        <div className="flex items-center gap-4 text-xs text-slate-500">
            <span>Less</span>
            <div className="flex gap-1">
                {levels.map((level, i) => (
                    <div
                        key={i}
                        className={`w-3.5 h-3.5 md:w-3 md:h-3 rounded-sm ${level.color}`}
                        title={level.label}
                    />
                ))}
            </div>
            <span>More</span>
        </div>
    );
};
