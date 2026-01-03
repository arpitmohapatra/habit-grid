import { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { startOfDay, format, isSameDay, getDay } from 'date-fns';

const HabitContext = createContext(null);

export const useHabitContext = () => {
    const context = useContext(HabitContext);
    if (!context) {
        throw new Error('useHabitContext must be used within a HabitProvider');
    }
    return context;
};

export const HabitProvider = ({ children }) => {
    const [tasks, setTasks] = useLocalStorage('habit-tasks', []);
    const [completions, setCompletions] = useLocalStorage('habit-completions', {});

    // Add a new task
    const addTask = (taskData) => {
        const newTask = {
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            ...taskData
        };
        setTasks(prev => [...prev, newTask]);
    };

    // Edit existing task
    const editTask = (id, updates) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    };

    // Delete task
    const deleteTask = (id) => {
        setTasks(prev => prev.filter(t => t.id !== id));
        // Optional: cleanup completions for this task? 
        // Keeping them might be good for history if task is re-added, but for now we let them be or could clean them up.
        // implementation: we generally iterate keys and delete, but maybe too expensive.
    };

    // Toggle completion status
    const toggleCompletion = (taskId, date) => {
        const dateKey = `${taskId}-${format(date, 'yyyy-MM-dd')}`;
        setCompletions(prev => {
            const newCompletions = { ...prev };
            if (newCompletions[dateKey]) {
                delete newCompletions[dateKey];
            } else {
                newCompletions[dateKey] = true;
            }
            return newCompletions;
        });
    };

    // Check if task is active on a specific date based on recurrence
    const isTaskActiveForDate = (task, date) => {
        const start = startOfDay(new Date(task.startDate));
        const current = startOfDay(date);

        if (current < start) return false;

        if (task.recurrence === 'one-time') {
            return isSameDay(start, current);
        }

        if (task.recurrence === 'daily') {
            return true;
        }

        if (task.recurrence === 'weekly') {
            // daysOfWeek is array of indexes 0-6 (Sun-Sat)
            const dayIndex = getDay(current);
            return task.daysOfWeek.includes(dayIndex);
        }

        return false;
    };

    // Get active tasks for a specific date
    const getTasksForDate = (date) => {
        return tasks.filter(task => isTaskActiveForDate(task, date));
    };

    // Get completion status
    const isTaskCompleted = (taskId, date) => {
        const dateKey = `${taskId}-${format(date, 'yyyy-MM-dd')}`;
        return !!completions[dateKey];
    };

    // Calculate stats logic (simplified for now, can expand later)
    const getTaskCompletionRate = (taskId) => {
        // Logic to calculate individual task stats can go here
        return 0;
    };

    return (
        <HabitContext.Provider value={{
            tasks,
            completions,
            addTask,
            editTask,
            deleteTask,
            toggleCompletion,
            getTasksForDate,
            isTaskCompleted,
            isTaskActiveForDate
        }}>
            {children}
        </HabitContext.Provider>
    );
};
