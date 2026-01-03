import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useSettings } from '../context/SettingsContext';

export const TaskModal = ({ isOpen, onClose, onSave, initialData }) => {
    const { currentTheme } = useTheme();
    const { appConfig } = useSettings();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        recurrence: 'daily',
        daysOfWeek: [], // 0=Sun, 6=Sat
        startDate: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                startDate: initialData.startDate.split('T')[0] // Ensure date input format
            });
        } else {
            setFormData({
                title: '',
                description: '',
                recurrence: 'daily',
                daysOfWeek: [],
                startDate: new Date().toISOString().split('T')[0]
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...formData,
            startDate: new Date(formData.startDate).toISOString()
        });
        onClose();
    };

    const handleDayToggle = (dayIndex) => {
        setFormData(prev => {
            const days = prev.daysOfWeek.includes(dayIndex)
                ? prev.daysOfWeek.filter(d => d !== dayIndex)
                : [...prev.daysOfWeek, dayIndex];
            return { ...prev, daysOfWeek: days };
        });
    };

    const daysLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 text-left">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-4 border-b border-slate-100 dark:border-slate-800">
                    <h2 className="text-lg font-semibold dark:text-white">
                        {initialData ? appConfig.taskStrings.editHabit : appConfig.taskStrings.newHabit}
                    </h2>
                    <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <X size={20} className="text-slate-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
                        <input
                            type="text"
                            required
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-500 outline-none bg-transparent dark:text-white"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            placeholder="e.g. Read 30 mins"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description (Optional)</label>
                        <textarea
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-500 outline-none bg-transparent dark:text-white resize-none h-20"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Add details..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Start Date</label>
                            <input
                                type="date"
                                required
                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-500 outline-none bg-transparent dark:text-white"
                                value={formData.startDate}
                                onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Recurrence</label>
                            <select
                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-500 outline-none bg-transparent dark:text-white"
                                value={formData.recurrence}
                                onChange={e => setFormData({ ...formData, recurrence: e.target.value })}
                            >
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="one-time">One-time</option>
                            </select>
                        </div>
                    </div>

                    {formData.recurrence === 'weekly' && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Repeats On</label>
                            <div className="flex justify-between gap-1">
                                {daysLabels.map((day, index) => (
                                    <button
                                        key={day}
                                        type="button"
                                        onClick={() => handleDayToggle(index)}
                                        className={`text-xs w-8 h-8 rounded-full flex items-center justify-center transition-colors ${formData.daysOfWeek.includes(index)
                                            ? `${currentTheme.intensity.bg} text-white shadow-sm`
                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'
                                            }`}
                                    >
                                        {day[0]}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="pt-2 flex justify-end gap-2 text-sm">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={`${currentTheme.intensity.bg} hover:opacity-90 text-white px-6 py-2 rounded-lg shadow-sm transition-all active:scale-95 font-medium`}
                        >
                            Save Habit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
