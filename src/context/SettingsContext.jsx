import { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const SettingsContext = createContext(null);

export const SettingsProvider = ({ children }) => {
    const [appConfig, setAppConfig] = useLocalStorage('habit-app-config', {
        title: 'Habit Grid',
        subtitle: 'Consistent daily actions create success.',
        showMonthLabels: true,
        gridCellSize: 12,
        gridGap: 4,
        statsLabels: {
            perfect: 'Perfect Days',
            current: 'Current Streak',
            best: 'Best Streak'
        },
        taskStrings: {
            noTasks: 'No habits scheduled for this day.',
            addTask: 'Add First Habit',
            editHabit: 'Edit Habit',
            newHabit: 'New Habit',
            analyticsTitle: 'Year Analytics',
            selectDay: 'Select a day to manage tasks'
        }
    });

    const updateConfig = (key, value) => {
        setAppConfig(prev => ({ ...prev, [key]: value }));
    };

    return (
        <SettingsContext.Provider value={{ appConfig, updateConfig }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) throw new Error('useSettings must be used within SettingsProvider');
    return context;
};
