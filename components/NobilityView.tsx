import React, { useState, useContext, useMemo, useEffect } from 'react';
import Card from './common/Card';
import SectionHeader from './common/SectionHeader';
import { DataContext } from '../context/DataContext';
import { UserContext } from '../context/UserContext';
import { Season, NobilityTitle, TitleAssignment } from '../types';

type NobilityTab = 'assignment' | 'summary' | 'titles' | 'seasons';

const SeasonManager: React.FC = () => {
    const { seasons, updateMasterData } = useContext(DataContext);
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({ name: '', startDate: '' });

    const handleAddSeason = () => {
        if (!formData.name || !formData.startDate) {
            alert("Por favor, introduce nombre y fecha de inicio.");
            return;
        }
        const newSeason: Season = {
            id: `season_${Date.now()}`,
            name: formData.name,
            startDate: formData.startDate,
            isActive: true,
        };
        const updatedSeasons = seasons.map(s => ({ ...s, isActive: false }));
        updateMasterData('seasons', [...updatedSeasons, newSeason]);
        setIsAdding(false);
        setFormData({ name: '', startDate: '' });
    };

    return (
        <div className="mt-4">
            <h3 className="text-xl font-bold text-slate-800 mb-2">Gestionar Temporadas</h3>
            {!isAdding && (
                 <button onClick={() => setIsAdding(true)} className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-lg mb-4">
                    + Iniciar Nueva Temporada
                </button>
            )}
            {isAdding && (
                <Card className="bg-slate-100/50 mb-4 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input type="text" value={formData.name} onChange={e => setFormData(p => ({...p, name: e.target.value}))} placeholder="Nombre de la Temporada" className="bg-white border border-slate-300 rounded p-2 text-slate-800"/>
                        <input type="date" value={formData.startDate} onChange={e => setFormData(p => ({...p, startDate: e.target.value}))} className="bg-white border border-slate-300 rounded p-2 text-slate-800"/>
                        <div className="flex gap-2">
                             <button onClick={handleAddSeason} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded">Guardar</button>
                             <button onClick={() => setIsAdding(false)} className="bg-slate-500 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded">Cancelar</button>
                        </div>
                    </div>
                </Card>
            )}
             <div className="space-y-2">
                {seasons.sort((a,b) => b.startDate.localeCompare(a.startDate)).map(s => (
                    <div key={s.id} className={`p-3 rounded-lg flex justify-between items-center ${s.isActive ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                        <p className="font-semibold">{s.name} <span className="text-sm text-slate-500">(Inicio: {new Date(s.startDate).toLocaleDateString()})</span></p>
                        {s.isActive && <span className="text-xs font-bold bg-emerald-500 text-white px-2 py-1 rounded-full">ACTIVA</span>}
                    </div>
                ))}
            </div>
        </div>
    )
};

const TitleManager: React.FC = () => {
    const { nobilityTitles, updateMasterData } = useContext(DataContext);
    const [isAdding, setIsAdding] = useState(false);
    const [editingTitle, setEditingTitle] = useState<NobilityTitle | null>(null);
    const [name, setName] = useState('');

    const handleSave = () => {
        if (!name) return;
        if (editingTitle) {
            updateMasterData('nobilityTitles', nobilityTitles.map(t => t.id === editingTitle.id ? {...t, name} : t));
        } else {
            const newTitle: NobilityTitle = { id: `title_${Date.now()}`, name };
            updateMasterData('nobilityTitles', [...nobilityTitles, newTitle]);
        }
        resetForm();
    };

    const handleDelete = (id: string) => {
        if (window.confirm("¿Seguro que quieres eliminar este título?")) {
            updateMasterData('nobilityTitles', nobilityTitles.filter(t => t.id !== id));
        }
    };
    
    const startEdit = (title: NobilityTitle) => {
        setEditingTitle(title);
        setName(title.name);
        setIsAdding(true);
    };

    const resetForm = () => {
        setIsAdding(false);
        setEditingTitle(null);
        setName('');
    };
    
    return (
        <div className="mt-4">
             <h3 className="text-xl font-bold text-slate-800 mb-2">Gestionar Títulos</h3>
            {!isAdding && (
                 <button onClick={() => setIsAdding(true)} className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-lg mb-4">
                    + Añadir Título
                </button>
            )}
            {isAdding && (
                 <Card className="bg-slate-100/50 mb-4 p-4">
                    <div className="flex gap-4">
                        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Nombre del Título" className="flex-grow bg-white border border-slate-300 rounded p-2 text-slate-800"/>
                        <button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded">Guardar</button>
                        <button onClick={resetForm} className="bg-slate-500 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded">Cancelar</button>
                    </div>
                </Card>
            )}
             <div className="space-y-2">
                {nobilityTitles.map(t => (
                    <div key={t.id} className="bg-slate-100 p-3 rounded-lg flex justify-between items-center">
                        <p className="font-semibold">{t.name}</p>
                        <div className="flex gap-2">
                            <button onClick={() => startEdit(t)} className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-1 px-3 rounded">Editar</button>
                            <button onClick={() => handleDelete(t.id)} className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-1 px-3 rounded">Eliminar</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
};

const WeeklyAssignment: React.FC = () => {
    const { users } = useContext(UserContext);
    const { seasons, nobilityTitles, titleAssignments, updateTitleAssignments } = useContext(DataContext);
    const [assignments, setAssignments] = useState<Record<string, string | null>>({});

    const activeSeason = useMemo(() => seasons.find(s => s.isActive), [seasons]);
    const currentWeek = useMemo(() => {
        if (!activeSeason) return null;
        const startDate = new Date(activeSeason.startDate);
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return Math.floor(diffDays / 7) + 1;
    }, [activeSeason]);

    useEffect(() => {
        if (activeSeason && currentWeek) {
            const currentWeekAssignments = titleAssignments.filter(a => a.seasonId === activeSeason.id && a.weekNumber === currentWeek);
            const assignmentsMap = currentWeekAssignments.reduce((acc, curr) => {
                acc[curr.userId] = curr.titleId;
                return acc;
            }, {} as Record<string, string | null>);
            setAssignments(assignmentsMap);
        }
    }, [activeSeason, currentWeek, titleAssignments]);

    if (!activeSeason) {
        return <div className="text-center py-10"><p className="text-slate-500">No hay temporada activa. Ve a "Gestionar Temporadas" para iniciar una.</p></div>
    }

    const handleAssignmentChange = (userId: string, titleId: string | null) => {
        setAssignments(prev => ({...prev, [userId]: titleId}));
    };

    const handleSave = () => {
        if (!activeSeason || !currentWeek) return;
        const otherSeasonAssignments = titleAssignments.filter(a => a.seasonId !== activeSeason.id);
        const newAssignmentsForThisSeason: TitleAssignment[] = users.map(user => ({
            id: `assign_${activeSeason.id}_${currentWeek}_${user.uid}`,
            seasonId: activeSeason.id,
            weekNumber: currentWeek,
            userId: user.uid,
            titleId: assignments[user.uid] || null
        }));
        
        // This logic should be improved to handle updates better, but for now it replaces the week's assignments
        const otherWeeksAssignments = titleAssignments.filter(a => a.seasonId === activeSeason.id && a.weekNumber !== currentWeek)
        
        updateTitleAssignments([...otherSeasonAssignments, ...otherWeeksAssignments, ...newAssignmentsForThisSeason]);
        alert(`Asignaciones para la Semana ${currentWeek} guardadas.`);
    };

    return (
        <div className="mt-4">
            <div className="flex justify-between items-center mb-4">
                 <h3 className="text-xl font-bold text-slate-800">Asignaciones para la Semana {currentWeek} <span className="text-base font-normal text-slate-500">({activeSeason.name})</span></h3>
                 <button onClick={handleSave} className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded-lg">Guardar Asignaciones de la Semana</button>
            </div>
            <div className="space-y-2">
                {users.sort((a,b) => a.name.localeCompare(b.name)).map(user => (
                    <div key={user.uid} className="bg-slate-100 p-3 rounded-lg flex justify-between items-center">
                        <p className="font-semibold">{user.name}</p>
                        <select 
                            value={assignments[user.uid] || ''}
                            onChange={e => handleAssignmentChange(user.uid, e.target.value || null)}
                            className="bg-white border border-slate-300 rounded p-2 text-slate-800"
                        >
                            <option value="">-- Sin Título --</option>
                            {nobilityTitles.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                    </div>
                ))}
            </div>
        </div>
    );
};

const SeasonSummary: React.FC = () => {
    const { users } = useContext(UserContext);
    const { seasons, nobilityTitles, titleAssignments } = useContext(DataContext);
    const [selectedSeasonId, setSelectedSeasonId] = useState<string | null>(null);

    const summaryData = useMemo(() => {
        if (!selectedSeasonId) return null;
        const seasonAssignments = titleAssignments.filter(a => a.seasonId === selectedSeasonId);
        const summary = users.reduce((acc, user) => {
            acc[user.uid] = {
                userName: user.name,
                titles: nobilityTitles.reduce((titleAcc, title) => {
                    titleAcc[title.id] = 0;
                    return titleAcc;
                }, {} as Record<string, number>)
            };
            return acc;
        }, {} as Record<string, { userName: string, titles: Record<string, number> }>);

        for (const assignment of seasonAssignments) {
            if (assignment.titleId && summary[assignment.userId]) {
                summary[assignment.userId].titles[assignment.titleId]++;
            }
        }
        return Object.values(summary).filter(u => Object.values(u.titles).some(count => count > 0));
    }, [selectedSeasonId, titleAssignments, users, nobilityTitles]);

    return (
         <div className="mt-4">
            <h3 className="text-xl font-bold text-slate-800 mb-2">Resumen de Temporada</h3>
            <select
                value={selectedSeasonId || ''}
                onChange={e => setSelectedSeasonId(e.target.value)}
                className="bg-white border border-slate-300 rounded p-2 text-slate-800 mb-4 w-full md:w-1/3"
            >
                <option value="">-- Selecciona una temporada --</option>
                {seasons.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            {summaryData && (
                <div className="overflow-x-auto">
                    <table className="w-full text-left table-auto">
                        <thead className="bg-slate-100">
                             <tr>
                                <th className="px-4 py-3 font-semibold text-slate-600">Miembro</th>
                                {nobilityTitles.map(t => <th key={t.id} className="px-4 py-3 font-semibold text-slate-600 text-center">{t.name}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {summaryData.map(userData => (
                                <tr key={userData.userName} className="border-b border-slate-200 hover:bg-slate-50">
                                    <td className="px-4 py-3 font-medium text-slate-800">{userData.userName}</td>
                                    {nobilityTitles.map(t => (
                                        <td key={t.id} className="px-4 py-3 text-slate-600 text-center">{userData.titles[t.id] || 0}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};


const NobilityManager: React.FC = () => {
    const [activeTab, setActiveTab] = useState<NobilityTab>('assignment');

    const tabClass = (tabName: NobilityTab) => {
        const baseClasses = 'whitespace-nowrap py-3 px-1 border-b-2 font-medium text-base transition-colors focus:outline-none';
        if (activeTab === tabName) {
            return `${baseClasses} border-sky-500 text-sky-600`;
        }
        return `${baseClasses} border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300`;
    };

    return (
        <Card>
            <SectionHeader 
                title="Nobleza" 
                description="Gestiona temporadas, títulos y asignaciones semanales."
            />
            <div className="border-b border-slate-200 mt-4">
                <nav className="-mb-px flex space-x-6" aria-label="Nobility Tabs">
                     <button onClick={() => setActiveTab('assignment')} className={tabClass('assignment')}>Asignación Semanal</button>
                     <button onClick={() => setActiveTab('summary')} className={tabClass('summary')}>Resumen de Temporada</button>
                     <button onClick={() => setActiveTab('titles')} className={tabClass('titles')}>Gestionar Títulos</button>
                     <button onClick={() => setActiveTab('seasons')} className={tabClass('seasons')}>Gestionar Temporadas</button>
                </nav>
            </div>
            
            <div className="mt-2">
                {activeTab === 'assignment' && <WeeklyAssignment />}
                {activeTab === 'summary' && <SeasonSummary />}
                {activeTab === 'titles' && <TitleManager />}
                {activeTab === 'seasons' && <SeasonManager />}
            </div>
        </Card>
    );
};

export default NobilityManager;