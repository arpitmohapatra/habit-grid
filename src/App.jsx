import { useState } from 'react';
import { HabitProvider } from './context/HabitContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import { YearGrid } from './components/YearGrid';
import { TaskPanel } from './components/TaskPanel';
import { StatsCards } from './components/StatsCards';
import { ColorLegend } from './components/ColorLegend';
import { Sun, Moon, Palette, Settings, Activity, Grid3X3 } from 'lucide-react';
import clsx from 'clsx';

function AppContent() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('daily'); // 'daily' or 'grid'
  const { darkMode, setDarkMode, currentTheme, setTheme, allThemes, currentThemeKey } = useTheme();
  const { appConfig } = useSettings();
  const [showThemePicker, setShowThemePicker] = useState(false);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setActiveTab('daily');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-24 md:pb-10 transition-colors duration-500">
      {/* Optimized Header - Ultra compact for web */}
      <header className={`sticky top-0 z-40 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700/50 px-4 py-1.5 md:px-8 md:py-2 flex justify-between items-center`}>
        <div className="flex flex-col">
          <h1 className="text-lg md:text-xl font-black text-slate-800 dark:text-white tracking-tight leading-none truncate max-w-[150px] sm:max-w-none">
            {appConfig.title}
          </h1>
          <p className="hidden md:block text-slate-400 text-[8px] font-bold tracking-widest uppercase mt-0.5">
            {appConfig.subtitle}
          </p>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex bg-slate-100 dark:bg-slate-900/50 p-1 rounded-lg border border-slate-200 dark:border-slate-700/50">
          <button
            onClick={() => setActiveTab('daily')}
            className={clsx(
              "px-4 py-1 rounded-md text-[11px] font-bold transition-all duration-300",
              activeTab === 'daily'
                ? `${currentTheme.intensity.bg} text-white shadow-md`
                : "text-slate-500"
            )}
          >
            Daily View
          </button>
          <button
            onClick={() => setActiveTab('grid')}
            className={clsx(
              "px-4 py-1 rounded-md text-[11px] font-bold transition-all duration-300",
              activeTab === 'grid'
                ? `${currentTheme.intensity.bg} text-white shadow-md`
                : "text-slate-500"
            )}
          >
            Year Matrix
          </button>
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-1 md:gap-2">
          <div className="relative">
            <button
              onClick={() => setShowThemePicker(!showThemePicker)}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all duration-200 text-slate-600 dark:text-slate-300"
              title="Theme Color"
            >
              <Palette size={16} strokeWidth={2.5} />
            </button>
            {showThemePicker && (
              <div className="absolute right-0 mt-2 p-2 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-50 flex gap-1.5 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                {Object.entries(allThemes).map(([key, t]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setTheme(key);
                      setShowThemePicker(false);
                    }}
                    className={`w-6 h-6 rounded transition-all hover:scale-110 active:scale-90 ${t.intensity.bg} ${currentThemeKey === key ? 'ring-2 ring-offset-1 ring-slate-400' : ''}`}
                    title={t.name}
                  />
                ))}
              </div>
            )}
          </div>
          <button
            onClick={setDarkMode}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all duration-200 text-slate-600 dark:text-slate-300"
          >
            {darkMode ? <Sun size={16} strokeWidth={2.5} /> : <Moon size={16} strokeWidth={2.5} />}
          </button>
          <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all duration-200 text-slate-600 dark:text-slate-300">
            <Settings size={16} strokeWidth={2.5} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="p-2 md:p-4 max-w-6xl mx-auto w-full">
        {activeTab === 'daily' ? (
          <div className="flex flex-col gap-4 md:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Quick Stats on Mobile, Full on Desktop */}
            <StatsCards />
            <div className="max-w-2xl mx-auto w-full">
              <TaskPanel selectedDate={selectedDate} />
            </div>
          </div>
        ) : (
          <div
            className="bg-white dark:bg-slate-800 p-1 md:p-2 rounded-xl md:rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/50 animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col"
            style={{ height: 'calc(100vh - 125px)' }}
          >
            <div className="flex flex-col md:flex-row gap-1 justify-between items-start md:items-center mb-1 md:mb-2 px-2 pt-1 shrink-0">
              <h2 className="text-[10px] md:text-sm font-black text-slate-800 dark:text-white tracking-tight">
                {new Date().getFullYear()} Achievement Matrix
              </h2>
              <ColorLegend />
            </div>
            <div className="flex-1 flex items-center justify-center min-h-0 overflow-hidden">
              <YearGrid selectedDate={selectedDate} onDateSelect={handleDateSelect} />
            </div>
          </div>
        )}
      </main>

      {/* Mobile Navigation Bar - Fixed at bottom */}
      <nav className="fixed bottom-0 left-0 right-0 md:hidden z-50 px-4 pb-6 pb-safe pt-2 bg-gradient-to-t from-slate-50 dark:from-slate-900 via-slate-50/80 dark:via-slate-900/80 to-transparent">
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-2xl shadow-2xl p-1.5 flex gap-1 max-w-[300px] mx-auto">
          <button
            onClick={() => setActiveTab('daily')}
            className={clsx(
              "flex-1 flex flex-col items-center gap-1 py-2 rounded-xl text-[10px] font-bold transition-all duration-300",
              activeTab === 'daily'
                ? `${currentTheme.intensity.bg} text-white shadow-lg`
                : "text-slate-500 dark:text-slate-400"
            )}
          >
            <Activity size={18} strokeWidth={2.5} />
            Daily
          </button>
          <button
            onClick={() => setActiveTab('grid')}
            className={clsx(
              "flex-1 flex flex-col items-center gap-1 py-2 rounded-xl text-[10px] font-bold transition-all duration-300",
              activeTab === 'grid'
                ? `${currentTheme.intensity.bg} text-white shadow-lg`
                : "text-slate-500 dark:text-slate-400"
            )}
          >
            <Grid3X3 size={18} strokeWidth={2.5} />
            Matrix
          </button>
        </div>
      </nav>
    </div>
  );
}

function App() {
  return (
    <SettingsProvider>
      <ThemeProvider>
        <HabitProvider>
          <AppContent />
        </HabitProvider>
      </ThemeProvider>
    </SettingsProvider>
  );
}

export default App;
