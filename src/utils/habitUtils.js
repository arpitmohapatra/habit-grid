import { startOfDay, subDays, eachDayOfInterval, format, isSameDay } from 'date-fns';

/**
 * Calculate the intensity level (0-4) for a given date
 * @param {Date} date - The date to check
 * @param {Array} tasks - List of all tasks
 * @param {Object} completions - Map of completions
 * @param {Function} isTaskActiveForDate - Helper to check if task is active
 * @returns {number} 0 (0%), 1 (1-25%), 2 (26-50%), 3 (51-75%), 4 (76-100%)
 */
export const calculateDailyIntensity = (date, tasks, completions, isTaskActiveForDate) => {
    const activeTasks = tasks.filter(task => isTaskActiveForDate(task, date));

    if (activeTasks.length === 0) return 0;

    const completedCount = activeTasks.reduce((acc, task) => {
        const key = `${task.id}-${format(date, 'yyyy-MM-dd')}`;
        return acc + (completions[key] ? 1 : 0);
    }, 0);

    const percentage = completedCount / activeTasks.length;

    if (percentage === 0) return 0;
    if (percentage <= 0.25) return 1;
    if (percentage <= 0.50) return 2;
    if (percentage <= 0.75) return 3;
    return 4;
};

/**
 * Calculate stats: Perfect Days, Current Streak, Best Streak
 */
export const calculateStats = (tasks, completions, isTaskActiveForDate) => {
    const today = startOfDay(new Date());
    // We'll scan back 365 days or just from the beginning of time? 
    // For streaks, we usually scan backwards from today.

    // 1. Perfect Days (Total count in the last year or all time? Let's do last 365 days for consistency with grid)
    const pastYearDates = eachDayOfInterval({
        start: subDays(today, 364),
        end: today
    });

    let perfectDays = 0;
    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;

    // Iterate chronologically for best streak
    pastYearDates.forEach(date => {
        const activeTasks = tasks.filter(task => isTaskActiveForDate(task, date));

        if (activeTasks.length > 0) {
            const completedCount = activeTasks.reduce((acc, task) => {
                const key = `${task.id}-${format(date, 'yyyy-MM-dd')}`;
                return acc + (completions[key] ? 1 : 0);
            }, 0);

            if (completedCount === activeTasks.length) {
                perfectDays++;
                tempStreak++;
            } else {
                tempStreak = 0;
            }
        } else {
            // Days with no tasks don't count towards perfect days or streaks
            // But they also don't break a streak if we want to allow skipping empty days.
            // Requirement check: "Current Streak (consecutive perfect days)". 
            // If skip empty days, the streak is "consecutive perfect active days".
            // Let's assume empty days DO break the streak for simplicity, OR they are ignored.
            // Usually, streaks are broken by a FAIL, not by a day with nothing to do.
            // However, to avoid "365" for a new user, we must ensure we don't increment.
            // If we don't reset tempStreak to 0, it behaves as "neutral". 
            // BUT, if the user has NO habits at all, it should be 0.
        }

        if (tempStreak > bestStreak) bestStreak = tempStreak;
    });

    // Re-calculate current streak walking backwards from today
    let calcCurrentStreak = 0;
    let foundFirstActiveDay = false;

    // We scan back up to 365 days
    for (let i = 0; i < 365; i++) {
        const checkDate = subDays(today, i);
        const active = tasks.filter(t => isTaskActiveForDate(t, checkDate));

        if (active.length > 0) {
            const completed = active.reduce((acc, t) => acc + (completions[`${t.id}-${format(checkDate, 'yyyy-MM-dd')}`] ? 1 : 0), 0);
            const isPerfect = completed === active.length;

            if (isPerfect) {
                calcCurrentStreak++;
                foundFirstActiveDay = true;
            } else {
                // Today failed? That breaks the streak unless we are still looking for the first active day.
                // If today is failed, streak is 0. If a past day failed, streak ends there.
                break;
            }
        } else {
            // No tasks on this day.
            if (foundFirstActiveDay) {
                // Neutral day in middle of streak - keep going (skip it)
            } else {
                // Haven't found a perfect day yet. If today has no tasks, we keep looking back.
            }
        }
    }

    return {
        perfectDays,
        currentStreak: calcCurrentStreak,
        bestStreak
    };
};
