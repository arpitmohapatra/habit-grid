import { createContext, useContext, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const ThemeContext = createContext(null);

const THEMES = {
    emerald: {
        name: 'Emerald',
        primary: 'emerald',
        intensity: {
            1: 'bg-emerald-200',
            2: 'bg-emerald-400',
            3: 'bg-emerald-600',
            4: 'bg-emerald-800',
            text: 'text-emerald-600',
            bg: 'bg-emerald-500'
        }
    },
    blue: {
        name: 'Ocean',
        primary: 'blue',
        intensity: {
            1: 'bg-blue-200',
            2: 'bg-blue-400',
            3: 'bg-blue-600',
            4: 'bg-blue-800',
            text: 'text-blue-600',
            bg: 'bg-blue-500'
        }
    },
    rose: {
        name: 'Rose',
        primary: 'rose',
        intensity: {
            1: 'bg-rose-200',
            2: 'bg-rose-400',
            3: 'bg-rose-600',
            4: 'bg-rose-800',
            text: 'text-rose-600',
            bg: 'bg-rose-500'
        }
    },
    violet: {
        name: 'Violet',
        primary: 'violet',
        intensity: {
            1: 'bg-violet-200',
            2: 'bg-violet-400',
            3: 'bg-violet-600',
            4: 'bg-violet-800',
            text: 'text-violet-600',
            bg: 'bg-violet-500'
        }
    },
    amber: {
        name: 'Amber',
        primary: 'amber',
        intensity: {
            1: 'bg-amber-200',
            2: 'bg-amber-400',
            3: 'bg-amber-600',
            4: 'bg-amber-800',
            text: 'text-amber-600',
            bg: 'bg-amber-500'
        }
    }
};

export const ThemeProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useLocalStorage('theme-dark-mode', false);
    const [currentThemeKey, setCurrentThemeKey] = useLocalStorage('theme-color-key', 'emerald');

    useEffect(() => {
        const root = document.documentElement;
        console.log('🌓 Dark mode changed:', darkMode);

        if (darkMode) {
            root.classList.add('dark');
            console.log('✅ Added dark class');
        } else {
            root.classList.remove('dark');
            console.log('❌ Removed dark class');
        }

        console.log('📋 Current classes:', root.className);
    }, [darkMode]);

    const theme = THEMES[currentThemeKey] || THEMES.emerald;

    const toggleDarkMode = () => {
        console.log('🔄 Toggle called, current darkMode:', darkMode);
        setDarkMode(prev => {
            console.log('🔄 Setting darkMode from', prev, 'to', !prev);
            return !prev;
        });
    };

    return (
        <ThemeContext.Provider value={{
            darkMode,
            setDarkMode: toggleDarkMode,
            currentTheme: theme,
            currentThemeKey,
            setTheme: setCurrentThemeKey,
            allThemes: THEMES
        }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within ThemeProvider');
    return context;
};
