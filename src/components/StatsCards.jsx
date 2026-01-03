import { Trophy, Flame, Star, Activity } from 'lucide-react';
import { useHabitContext } from '../context/HabitContext';
import { useTheme } from '../context/ThemeContext';
import { useSettings } from '../context/SettingsContext';
import { calculateStats } from '../utils/habitUtils';

const StatCard = ({ title, value, icon: Icon, color, subtext }) => (
    <div className="group bg-white dark:bg-slate-800 p-3 md:p-5 rounded-xl md:rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-3 md:gap-5 transition-all duration-300 hover:shadow-md">
        <div className={`w-10 h-10 md:w-14 md:h-14 rounded-lg md:rounded-2xl flex items-center justify-center ${color} shadow-lg shadow-current/20 group-hover:scale-110 transition-transform duration-300`}>
            <Icon size={20} className="md:w-7 md:h-7 text-white" />
        </div>
        <div>
            <p className="text-slate-400 dark:text-slate-500 text-[8px] md:text-[10px] uppercase font-black tracking-[0.1em] mb-0.5 md:mb-1">{title}</p>
            <div className="text-xl md:text-3xl font-black text-slate-800 dark:text-white leading-none">{value}</div>
            {subtext && <p className="text-[8px] md:text-[10px] text-slate-400 dark:text-slate-500 mt-1 md:mt-1.5 font-medium">{subtext}</p>}
        </div>
    </div>
);

export const StatsCards = () => {
    const { tasks, completions, isTaskActiveForDate } = useHabitContext();
    const { currentTheme } = useTheme();
    const { appConfig } = useSettings();
    const { perfectDays, currentStreak, bestStreak } = calculateStats(tasks, completions, isTaskActiveForDate);

    return (
        <div className="flex overflow-x-auto md:grid md:grid-cols-3 gap-3 md:gap-4 pb-4 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
            <div className="flex-shrink-0 w-[240px] md:w-auto">
                <StatCard
                    title={appConfig.statsLabels.perfect}
                    value={perfectDays}
                    icon={Star}
                    color={currentTheme.intensity.bg}
                    subtext="Total perfect days"
                />
            </div>
            <div className="flex-shrink-0 w-[240px] md:w-auto">
                <StatCard
                    title={appConfig.statsLabels.current}
                    value={currentStreak}
                    icon={Flame}
                    color={currentTheme.intensity.bg}
                    subtext="Current streak"
                />
            </div>
            <div className="flex-shrink-0 w-[240px] md:w-auto">
                <StatCard
                    title={appConfig.statsLabels.best}
                    value={bestStreak}
                    icon={Trophy}
                    color={currentTheme.intensity.bg}
                    subtext="Best streak"
                />
            </div>
        </div>
    );
};
