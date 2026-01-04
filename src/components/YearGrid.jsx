import { useHabitContext } from '../context/HabitContext';
import { useTheme } from '../context/ThemeContext';
import { calculateDailyIntensity } from '../utils/habitUtils';
import { startOfYear, eachDayOfInterval, endOfYear, isSameDay, isAfter, format, isToday as isDateToday } from 'date-fns';
import clsx from 'clsx';

export const YearGrid = ({ selectedDate, onDateSelect }) => {
    const { tasks, completions, isTaskActiveForDate } = useHabitContext();
    const { currentTheme } = useTheme();

    const today = new Date();
    const yearStart = startOfYear(today);
    const yearEnd = endOfYear(today);

    // Get all days of the year
    const days = eachDayOfInterval({
        start: yearStart,
        end: yearEnd
    });

    const getIntensityColor = (date) => {
        if (isAfter(date, today)) {
            return 'bg-slate-100/30 dark:bg-slate-800/10 border border-slate-200 dark:border-slate-700/50 opacity-40';
        }

        const intensity = calculateDailyIntensity(date, tasks, completions, isTaskActiveForDate);
        switch (intensity) {
            case 0: return 'bg-slate-200/50 dark:bg-slate-800/40 border border-slate-300 dark:border-slate-600';
            case 1: return `${currentTheme.intensity[1]} border border-white/10`;
            case 2: return `${currentTheme.intensity[2]} border border-white/10`;
            case 3: return `${currentTheme.intensity[3]} border border-white/10`;
            case 4: return `${currentTheme.intensity[4]} border border-white/10`;
            default: return 'bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-600';
        }
    };

    return (
        <div className="w-full flex items-center justify-center">
            <div
                className="grid gap-0.5 sm:gap-0.5 md:gap-1 mx-auto w-fit max-w-full overflow-visible"
                style={{
                    gridTemplateColumns: 'repeat(21, minmax(0, 1fr))',
                }}
            >
                {days.slice(0, 366).map((day) => {
                    const isToday = isDateToday(day);
                    const isSelected = isSameDay(day, selectedDate);
                    const isFuture = isAfter(day, today);

                    return (
                        <div
                            key={day.toISOString()}
                            onClick={() => !isFuture && onDateSelect(day)}
                            title={format(day, 'MMM d, yyyy')}
                            className={clsx(
                                "aspect-square w-[4.2vw] sm:w-[3vw] md:w-[2.8vw] lg:w-[2.8vh] max-w-[30px] min-w-[14px] rounded-[1px] sm:rounded-sm transition-colors duration-200 relative flex items-center justify-center",
                                !isFuture ? "cursor-pointer" : "cursor-default",
                                getIntensityColor(day),
                                (isToday || isSelected) && "ring-1 sm:ring-2 ring-slate-400 dark:ring-slate-500 z-10"
                            )}
                        >
                            <span className={clsx(
                                "text-[10px] sm:text-[10px] md:text-[11px] font-bold select-none",
                                isFuture ? "text-slate-400 dark:text-slate-600" : "text-slate-700 dark:text-slate-200",
                                (isToday || isSelected) && "text-slate-900 dark:text-white font-black"
                            )}>
                                {format(day, 'd')}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

