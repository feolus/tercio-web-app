import React, { useState, useContext, useMemo } from 'react';
import Card from './common/Card';
import SectionHeader from './common/SectionHeader';
import { DataContext } from '../context/DataContext';
import { BattlePlan, BattleTask, User, BattleGroup, BattleKnight, Artillery, Troop, Weapon } from '../types';
import AssignmentModal from './AssignmentModal';

const AvailableKnightsPanel: React.FC<{
    users: User[];
    assignedKnightIds: Set<string>;
    onDragStart: (e: React.DragEvent<HTMLDivElement>, user: User) => void;
}> = ({ users, assignedKnightIds, onDragStart }) => {
    
    const availableKnights = useMemo(() => 
        users.filter(u => !assignedKnightIds.has(u.uid))
             .sort((a, b) => a.name.localeCompare(b.name)),
    [users, assignedKnightIds]);

    return (
        <Card className="w-full flex flex-col bg-slate-50 h-[30vh] lg:h-auto">
            <h3 className="text-lg font-bold text-slate-700 mb-4 pb-2 border-b-2">Miembros Disponibles</h3>
            <div className="overflow-y-auto flex-grow pr-2 space-y-2">
                {availableKnights.length > 0 ? availableKnights.map(user => (
                    <div
                        key={user.uid}
                        draggable
                        onDragStart={(e) => onDragStart(e, user)}
                        className="p-3 bg-white border border-slate-200 rounded-lg cursor-grab active:cursor-grabbing hover:bg-amber-50 hover:border-amber-300 transition-all shadow-sm"
                    >
                        <p className="font-semibold text-slate-800">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.role}</p>
                    </div>
                )) : (
                    <p className="text-center text-slate-500 pt-10">Todos los miembros han sido asignados.</p>
                )}
            </div>
        </Card>
    );
};

const AvailableArtilleryPanel: React.FC<{
    artillery: Artillery[];
    onDragStart: (e: React.DragEvent<HTMLDivElement>, piece: Artillery) => void;
}> = ({ artillery, onDragStart }) => {
    return (
         <Card className="w-full flex flex-col bg-slate-50 h-[30vh] lg:h-auto">
            <h3 className="text-lg font-bold text-slate-700 mb-4 pb-2 border-b-2">Artillería Disponible</h3>
            <div className="overflow-y-auto flex-grow pr-2 space-y-2">
                {artillery.map(piece => (
                    <div
                        key={piece.id}
                        draggable
                        onDragStart={(e) => onDragStart(e, piece)}
                        className="p-3 bg-white border border-slate-200 rounded-lg cursor-grab active:cursor-grabbing hover:bg-sky-50 hover:border-sky-300 transition-all shadow-sm flex items-center gap-3"
                    >
                        <img src={piece.imageUrl} alt={piece.name} className="w-10 h-10 rounded-md object-cover" />
                        <p className="font-semibold text-slate-800 text-sm">{piece.name}</p>
                    </div>
                ))}
            </div>
        </Card>
    )
};

const BattleGroupCard: React.FC<{
    group: BattleGroup;
    users: User[];
    masterArtillery: Artillery[];
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
    onRemoveKnight: (userId: string, groupId: string) => void;
    onRemoveArtillery: (artilleryId: string, groupId: string) => void;
}> = ({ group, users, masterArtillery, onDragOver, onDrop, onRemoveKnight, onRemoveArtillery }) => {
    const [isDragOver, setIsDragOver] = useState(false);
    
    const groupKnights = useMemo(() => 
        group.knights.map(k => users.find(u => u.uid === k.userId)).filter(Boolean) as User[],
    [group.knights, users]);

    const groupArtillery = useMemo(() =>
        (group.artilleryIds || []).map(id => masterArtillery.find(a => a.id === id)).filter(Boolean) as Artillery[],
    [group.artilleryIds, masterArtillery]);


    return (
        <Card 
            className={`transition-all duration-200 flex flex-col ${isDragOver ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-300' : 'bg-white'}`}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onDragEnter={() => setIsDragOver(true)}
            onDragLeave={() => setIsDragOver(false)}
        >
            <h4 className="text-amber-600 font-bold text-xl mb-3">{group.task}</h4>
            
            <div className="space-y-2 min-h-[50px] flex-grow">
                {groupKnights.length === 0 && groupArtillery.length === 0 && <p className="text-sm text-slate-400 text-center pt-2">Arrastra miembros o artillería aquí</p>}

                {groupKnights.map(knight => (
                    <div key={knight.uid} className="bg-slate-100 p-2 rounded-md flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-700">{knight.name}</span>
                        <button 
                            onClick={() => onRemoveKnight(knight.uid, group.id)}
                            className="text-red-500 hover:text-red-700 text-lg font-bold leading-none"
                            title="Eliminar de este grupo"
                        >&times;</button>
                    </div>
                ))}
            </div>
            
            {(groupArtillery.length > 0) && (
                 <div className="mt-3 pt-3 border-t border-slate-200 space-y-1">
                     {groupArtillery.map(piece => (
                         <div key={piece.id} className="bg-sky-100 p-1.5 rounded-md flex justify-between items-center">
                            <span className="text-xs font-medium text-sky-800">{piece.name}</span>
                            <button 
                                onClick={() => onRemoveArtillery(piece.id, group.id)}
                                className="text-red-500 hover:text-red-700 text-base font-bold leading-none"
                                title="Eliminar artillería"
                            >&times;</button>
                        </div>
                     ))}
                </div>
            )}
        </Card>
    );
};


const BattlePlanner: React.FC = () => {
    const { addBattlePlan, savedBattlePlans, updateBattlePlan, masterArtillery, masterTroops, masterWeapons, allUsers: users } = useContext(DataContext);
    
    const [planName, setPlanName] = useState('');
    const [planDate, setPlanDate] = useState(new Date().toISOString().split('T')[0]);
    const [activePlan, setActivePlan] = useState<BattlePlan | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [assigningUser, setAssigningUser] = useState<User | null>(null);
    const [targetGroup, setTargetGroup] = useState<BattleGroup | null>(null);

    const handleSaveNewPlan = () => {
        if (!planName || !planDate) {
            alert('Por favor, introduce un nombre y fecha para el plan.');
            return;
        }

        const newPlan: BattlePlan = {
            id: `plan_${Date.now()}`,
            name: planName,
            date: planDate,
            groups: Object.values(BattleTask).map(task => ({
                id: `group_${task}_${Date.now()}`,
                task: task,
                knights: [],
                artilleryIds: [],
            })),
            selectedKnights: [],
            status: 'planning',
        };

        addBattlePlan(newPlan).then(() => {
            setActivePlan(newPlan);
            setPlanName('');
            setPlanDate(new Date().toISOString().split('T')[0]); // Reset date as well
        });
    };

    const handleKnightDragStart = (e: React.DragEvent<HTMLDivElement>, user: User) => {
        e.dataTransfer.setData("userId", user.uid);
    };

    const handleArtilleryDragStart = (e: React.DragEvent<HTMLDivElement>, piece: Artillery) => {
        e.dataTransfer.setData("artilleryId", piece.id);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, group: BattleGroup) => {
        e.preventDefault();
        if (activePlan?.status === 'completed') return;

        const userId = e.dataTransfer.getData("userId");
        const artilleryId = e.dataTransfer.getData("artilleryId");
        
        if (userId) {
            const userToAssign = users.find(u => u.uid === userId);
            if (userToAssign) {
                setAssigningUser(userToAssign);
                setTargetGroup(group);
                setIsModalOpen(true);
            }
        } else if (artilleryId) {
            if (!activePlan) return;
            const updatedPlan = {
                ...activePlan,
                groups: activePlan.groups.map(g => {
                    if (g.id === group.id) {
                        const currentArtillery = g.artilleryIds || [];
                        if (currentArtillery.includes(artilleryId)) return g;
                        return { ...g, artilleryIds: [...currentArtillery, artilleryId] };
                    }
                    return g;
                })
            };
            updateBattlePlan(updatedPlan);
            setActivePlan(updatedPlan);
        }
    };
    
    const handleSaveAssignment = (assignment: BattleKnight) => {
        if (!activePlan || !assigningUser || !targetGroup) return;

        const updatedPlan: BattlePlan = {
            ...activePlan,
            groups: activePlan.groups.map(g => {
                if (g.id === targetGroup.id) {
                    return { ...g, knights: [...g.knights, assignment] };
                }
                return g;
            }),
            selectedKnights: [...activePlan.selectedKnights, assigningUser.uid]
        };
        
        updateBattlePlan(updatedPlan);
        setActivePlan(updatedPlan);
        closeModal();
    };

    const handleRemoveKnight = (userId: string, groupId: string) => {
        if (!activePlan || activePlan.status === 'completed') return;

        const updatedPlan: BattlePlan = {
            ...activePlan,
            groups: activePlan.groups.map(g => {
                if (g.id === groupId) {
                    return { ...g, knights: g.knights.filter(k => k.userId !== userId) };
                }
                return g;
            }),
            selectedKnights: activePlan.selectedKnights.filter(id => id !== userId),
        };
        updateBattlePlan(updatedPlan);
        setActivePlan(updatedPlan);
    };

     const handleRemoveArtillery = (artilleryId: string, groupId: string) => {
        if (!activePlan || activePlan.status === 'completed') return;

        const updatedPlan: BattlePlan = {
            ...activePlan,
            groups: activePlan.groups.map(g => {
                if (g.id === groupId) {
                    return { ...g, artilleryIds: (g.artilleryIds || []).filter(id => id !== artilleryId) };
                }
                return g;
            }),
        };
        updateBattlePlan(updatedPlan);
        setActivePlan(updatedPlan);
    };

    const handleCompletePlan = () => {
        if (!activePlan) return;
        if (window.confirm('¿Estás seguro de que quieres finalizar este plan? Una vez finalizado, no podrás editarlo.')) {
            const completedPlan = { ...activePlan, status: 'completed' as const };
            updateBattlePlan(completedPlan);
            setActivePlan(completedPlan);
        }
    };
    
    const handleExportPlan = () => {
        if (!activePlan) return;

        const headers = ['Grupo de Batalla', 'Tipo de Asignación', 'Nombre', 'Arma', 'Tropa 1', 'Tropa 2', 'Tropa 3', 'Tropa 4', 'Tropa 5'];
        const csvRows = [headers.join(',')];

        activePlan.groups.forEach(group => {
            if (group.knights.length === 0 && (!group.artilleryIds || group.artilleryIds.length === 0)) {
                return;
            }

            group.knights.forEach(knight => {
                const user = users.find(u => u.uid === knight.userId);
                const weapon = masterWeapons.find(w => w.id === knight.selectedWeaponId);
                const troops = knight.selectedTroops.map(tId => masterTroops.find(t => t.id === tId)?.name || '');
                
                const row = [
                    `"${group.task}"`,
                    'Miembro',
                    `"${user?.name || 'Desconocido'}"`,
                    `"${weapon?.name || 'N/A'}"`,
                    ...troops.concat(Array(5 - troops.length).fill('')).map(t => `"${t}"`)
                ];
                csvRows.push(row.join(','));
            });

            (group.artilleryIds || []).forEach(artId => {
                const artillery = masterArtillery.find(a => a.id === artId);
                const row = [
                    `"${group.task}"`,
                    'Artillería',
                    `"${artillery?.name || 'Desconocida'}"`,
                    ...Array(6).fill('')
                ];
                csvRows.push(row.join(','));
            });
        });
        
        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `plan_${activePlan.name.replace(/ /g, '_')}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setAssigningUser(null);
        setTargetGroup(null);
    };

    if (!activePlan) {
        return (
            <Card>
                <SectionHeader title="Plan de Batalla" description="Selecciona un plan para editarlo o crea uno nuevo." />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800 mb-4">Crear Nuevo Plan</h3>
                         <div className="space-y-4 p-4 bg-slate-50 rounded-lg">
                             <div>
                                <label htmlFor="planName" className="block text-sm font-medium text-slate-700">Nombre del Plan</label>
                                <input id="planName" type="text" value={planName} onChange={(e) => setPlanName(e.target.value)} placeholder="Ej: Asedio de la Ciudad" className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md"/>
                            </div>
                             <div>
                                <label htmlFor="planDate" className="block text-sm font-medium text-slate-700">Fecha</label>
                                <input id="planDate" type="date" value={planDate} onChange={(e) => setPlanDate(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md"/>
                            </div>
                            <button onClick={handleSaveNewPlan} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded-lg">
                                Crear y Editar
                            </button>
                        </div>
                    </div>
                     <div>
                        <h3 className="text-xl font-bold text-slate-800 mb-4">Cargar Plan Existente</h3>
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                             {[...savedBattlePlans].sort((a,b) => b.date.localeCompare(a.date)).map(plan => (
                                <div key={plan.id} className="bg-slate-100 p-3 rounded-lg flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div>
                                            <p className="font-semibold">{plan.name}</p>
                                            <p className="text-xs text-slate-500">{plan.date}</p>
                                        </div>
                                         {plan.status === 'completed' && (
                                            <span className="text-xs font-bold bg-slate-400 text-white px-2 py-0.5 rounded-full">COMPLETADO</span>
                                        )}
                                    </div>
                                    <button onClick={() => setActivePlan(plan)} className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-lg">Cargar</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Card>
        );
    }
    
    // Read-only view for completed plans
    if (activePlan.status === 'completed') {
        return (
             <div>
                <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                     <div>
                        <SectionHeader title={`Revisando: ${activePlan.name}`} description={`Fecha: ${activePlan.date}`} />
                         <span className="text-lg font-bold bg-slate-500 text-white px-3 py-1 rounded-full">PLAN FINALIZADO</span>
                    </div>
                    <div className="flex gap-4">
                         <button onClick={handleExportPlan} className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-lg">
                            Exportar
                        </button>
                        <button onClick={() => setActivePlan(null)} className="bg-slate-500 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg">
                            &larr; Volver
                        </button>
                    </div>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                     {activePlan.groups.map(group => (
                        <Card key={group.id}>
                            <h4 className="text-amber-600 font-bold text-xl mb-3">{group.task}</h4>
                            <div className="space-y-2">
                                {group.knights.map(knight => {
                                    const user = users.find(u => u.uid === knight.userId);
                                    return <div key={knight.userId} className="bg-slate-100 p-2 rounded-md text-sm font-medium">{user?.name || 'Desconocido'}</div>
                                })}
                                {(group.artilleryIds || []).map(artId => {
                                    const artillery = masterArtillery.find(a => a.id === artId);
                                    return <div key={artId} className="bg-sky-100 p-2 rounded-md text-xs font-medium">{artillery?.name || 'Desconocida'}</div>
                                })}
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    const assignedKnightIds = new Set(activePlan.selectedKnights);

    return (
        <div>
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                 <SectionHeader title={`Editando: ${activePlan.name}`} description={`Fecha: ${activePlan.date}`} />
                <div className="flex gap-4">
                    <button onClick={handleExportPlan} className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-lg">
                        Exportar
                    </button>
                    <button onClick={handleCompletePlan} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg">
                        Finalizar Plan
                    </button>
                    <button 
                        onClick={() => setActivePlan(null)} 
                        className="bg-slate-500 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg"
                    >
                        &larr; Volver
                    </button>
                </div>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="w-full lg:w-1/4 flex flex-col gap-4">
                    <AvailableKnightsPanel users={users} assignedKnightIds={assignedKnightIds} onDragStart={handleKnightDragStart} />
                    <AvailableArtilleryPanel artillery={masterArtillery} onDragStart={handleArtilleryDragStart} />
                </div>

                <div className="w-full lg:w-3/4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {activePlan.groups.map(group => (
                        <BattleGroupCard 
                            key={group.id} 
                            group={group}
                            users={users}
                            masterArtillery={masterArtillery}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, group)}
                            onRemoveKnight={handleRemoveKnight}
                            onRemoveArtillery={handleRemoveArtillery}
                        />
                    ))}
                </div>
            </div>

            {isModalOpen && assigningUser && targetGroup && (
                <AssignmentModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    onSave={handleSaveAssignment}
                    user={assigningUser}
                    group={targetGroup}
                />
            )}
        </div>
    );
};

export default BattlePlanner;