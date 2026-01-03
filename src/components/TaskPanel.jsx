import { useState } from 'react';
import { format } from 'date-fns';
import { useHabitContext } from '../context/HabitContext';
import { useTheme } from '../context/ThemeContext';
import { useSettings } from '../context/SettingsContext';
import { Check, Plus, Trash2, Edit2, Calendar } from 'lucide-react';
import { TaskModal } from './TaskModal';

export const TaskPanel = ({ selectedDate }) => {
    const { getTasksForDate, toggleCompletion, isTaskCompleted, deleteTask, addTask, editTask } = useHabitContext();
    const { currentTheme } = useTheme();
    const { appConfig } = useSettings();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    const activeTasks = getTasksForDate(selectedDate);
    const sortedTasks = [...activeTasks].sort((a, b) => a.title.localeCompare(b.title));

    const handleSave = (taskData) => {
        if (editingTask) {
            editTask(editingTask.id, taskData);
        } else {
            addTask(taskData);
        }
    };

    const openNewTaskModal = () => {
        setEditingTask(null);
        setIsModalOpen(true);
    };

    const openEditModal = (task) => {
        setEditingTask(task);
        setIsModalOpen(true);
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col h-full overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50 gap-2">
                <div className="min-w-0 flex-1">
                    <h2 className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5 text-xs sm:text-sm md:text-base">
                        <Calendar size={16} className={`${currentTheme.intensity.text} shrink-0`} />
                        <span className="truncate">{format(selectedDate, 'MMM d, yyyy')}</span>
                    </h2>
                    <p className="text-[10px] text-slate-500 mt-0.5 whitespace-nowrap">
                        {activeTasks.length} {activeTasks.length === 1 ? 'task' : 'tasks'}
                    </p>
                </div>
                <button
                    onClick={openNewTaskModal}
                    className={`${currentTheme.intensity.bg} hover:opacity-90 text-white p-1.5 sm:px-3 sm:py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1 active:scale-95 shrink-0`}
                >
                    <Plus size={16} />
                    <span className="hidden sm:inline">Add Task</span>
                    <span className="sm:hidden">Add</span>
                </button>
            </div>

            {/* Task List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {sortedTasks.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
                        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                            <Check size={24} className="text-slate-300" />
                        </div>
                        <p className="text-sm">{appConfig.taskStrings.noTasks}</p>
                        <button onClick={openNewTaskModal} className={`${currentTheme.intensity.text} text-sm hover:underline font-medium`}>Create one?</button>
                    </div>
                ) : (
                    sortedTasks.map(task => {
                        const isCompleted = isTaskCompleted(task.id, selectedDate);
                        return (
                            <div key={task.id} className={`group flex items-center justify-between p-3 rounded-xl border transition-all ${isCompleted
                                ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-700'
                                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                                }`}>
                                <div className="flex items-center gap-3 flex-1 text-left">
                                    <button
                                        onClick={() => toggleCompletion(task.id, selectedDate)}
                                        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${isCompleted
                                            ? `${currentTheme.intensity.bg} border-transparent text-white scale-100`
                                            : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 text-transparent scale-95 hover:scale-100'
                                            }`}
                                    >
                                        <Check size={14} strokeWidth={3} />
                                    </button>
                                    <div className={isCompleted ? 'opacity-50 line-through transition-opacity' : ''}>
                                        <h3 className="font-medium text-slate-800 dark:text-slate-200 text-sm whitespace-pre-wrap">{task.title}</h3>
                                        {task.description && (
                                            <p className="text-xs text-slate-500 line-clamp-1">{task.description}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-0.5 sm:gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => openEditModal(task)}
                                        className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                    >
                                        <Edit2 size={14} />
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (confirm('Delete this habit permanently?')) deleteTask(task.id);
                                        }}
                                        className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <TaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                initialData={editingTask}
            />
        </div>
    );
};
