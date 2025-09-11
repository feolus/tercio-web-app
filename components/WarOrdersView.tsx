import React, { useContext } from 'react';
import { DataContext } from '../context/DataContext';
import { UserContext } from '../context/UserContext';
import { Troop, UserTroop, BattlePlan } from '../types';
import Card from './common/Card';
import SectionHeader from './common/SectionHeader';

const calculateLeadership = (troop: Troop, userTroop: UserTroop | undefined): number => {
    if (!userTroop) return troop.leadership;
    return userTroop.leadershipDoctrine ? Math.floor(troop.leadership * 0.84) : troop.leadership;
};

const WarOrdersView: React.FC = () => {
    const { savedBattlePlans, activeWarOrderPlanId, setActiveWarOrderPlanId } = useContext(DataContext);
    const { currentUser, users } = useContext(UserContext);
    const { masterTroops, masterWeapons, masterArtillery } = useContext(DataContext);

    if (!currentUser) return null;

    const activePlan = savedBattlePlans.find(p => p.id === activeWarOrderPlanId);

    const renderMyAssignment = (plan: BattlePlan) => {
        const myGroup = plan.groups.find(group => group.knights.some(k => k.userId === currentUser.uid));

        return (
            <div>
                 <div className="flex justify-between items-center mb-6">
                    <SectionHeader title="Órdenes de Guerra" description={`Viendo el plan: ${plan.name} (${plan.date})`} />
                    <button 
                        onClick={() => setActiveWarOrderPlanId(null)}
                        className="bg-slate-500 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                    >
                        &larr; Volver a la lista
                    </button>
                </div>

                {!myGroup && (
                    <Card>
                        <div className="text-center py-12">
                            <h3 className="text-xl font-semibold text-slate-600">No estás asignado a ningún grupo en este plan.</h3>
                            <p className="text-slate-500 mt-2">Descansa, guerrero. Tu momento llegará.</p>
                        </div>
                    </Card>
                )}

                {myGroup && (() => {
                    const myBattleKnight = myGroup.knights.find(k => k.userId === currentUser.uid);
                    if (!myBattleKnight) return null;

                    const myUserTroops = currentUser.troops.map(ut => {
                        const troopData = masterTroops.find(t => t.id === ut.troopId);
                        return troopData ? { ...ut, ...troopData, calculatedLeadership: calculateLeadership(troopData, ut) } : null;
                    }).filter(t => t !== null) as (UserTroop & Troop & { calculatedLeadership: number })[];

                    const selectedTroopsData = myBattleKnight.selectedTroops.map(troopId =>
                        myUserTroops.find(t => t.troopId === troopId)
                    ).filter(Boolean) as (UserTroop & Troop & { calculatedLeadership: number })[];

                    const selectedUserWeapon = currentUser.weapons.find(w => w.weaponId === myBattleKnight.selectedWeaponId);
                    const masterWeapon = masterWeapons.find(mw => mw.id === selectedUserWeapon?.weaponId);
                    const totalLeadership = selectedUserWeapon?.leadership || 700;
                    const usedLeadership = selectedTroopsData.reduce((sum, troop) => sum + (troop?.calculatedLeadership || 0), 0);

                    const groupMates = myGroup.knights.filter(k => k.userId !== currentUser.uid).map(k => users.find(u => u.uid === k.userId)?.name).filter(Boolean);
                    const groupArtillery = myGroup.artilleryIds?.map(id => masterArtillery.find(a => a.id === id)?.name).filter(Boolean) || [];

                    return (
                        <Card className="bg-slate-50">
                            <div className="mb-6 pb-4 border-b-2 border-slate-200">
                                <h3 className="text-amber-600 font-bold text-2xl">{myGroup.task}</h3>
                                <p className="text-slate-500">Esta es tu asignación para la batalla.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Left Column: My Setup */}
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="font-bold text-lg text-slate-800 mb-2">Mi Equipamiento</h4>
                                        <div className="bg-slate-100 p-4 rounded-lg">
                                            {masterWeapon && <p className="text-slate-700"><strong>Arma:</strong> {masterWeapon.name}</p>}
                                            <div className="mt-2">
                                                <p className="text-sm">Liderazgo: <span className={usedLeadership > totalLeadership ? 'text-red-500 font-bold' : 'text-emerald-400 font-bold'}>{usedLeadership}</span> / {totalLeadership}</p>
                                                <div className="w-full bg-slate-200 rounded-full h-2.5 mt-1">
                                                    <div className={`h-2.5 rounded-full ${usedLeadership > totalLeadership ? 'bg-red-600' : 'bg-emerald-500'}`} style={{ width: `${Math.min(100, (usedLeadership / totalLeadership) * 100)}%` }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-bold text-lg text-slate-800 mb-2">Mis Tropas Seleccionadas</h4>
                                        <div className="flex flex-wrap gap-3">
                                            {selectedTroopsData.length > 0 ? selectedTroopsData.map(troop => (
                                                <div key={troop.troopId} className="p-2 rounded-lg bg-slate-100 border border-slate-200 flex-grow">
                                                    <div className="flex items-center gap-3">
                                                        <img src={troop.imageUrl} alt={troop.name} className="w-10 h-10 rounded" />
                                                        <div>
                                                            <p className="font-bold text-sm">{troop.name}</p>
                                                            <p className="text-xs text-slate-600">Liderazgo: {troop.calculatedLeadership}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )) : <p className="text-sm text-slate-400 p-4">No se te han asignado tropas.</p>}
                                        </div>
                                    </div>

                                </div>
                                {/* Right Column: Group Info */}
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="font-bold text-lg text-slate-800 mb-2">Compañeros de Grupo</h4>
                                        {groupMates.length > 0 ? (
                                            <ul className="list-disc list-inside bg-slate-100 p-4 rounded-lg space-y-1">
                                                {groupMates.map(name => <li key={name} className="text-slate-700">{name}</li>)}
                                            </ul>
                                        ) : (
                                            <p className="text-sm text-slate-400 bg-slate-100 p-4 rounded-lg">Luchas solo en este grupo.</p>
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg text-slate-800 mb-2">Artillería del Grupo</h4>
                                        {groupArtillery.length > 0 ? (
                                            <ul className="list-disc list-inside bg-slate-100 p-4 rounded-lg space-y-1">
                                                {groupArtillery.map(name => <li key={name} className="text-slate-700">{name}</li>)}
                                            </ul>
                                        ) : (
                                            <p className="text-sm text-slate-400 bg-slate-100 p-4 rounded-lg">Sin apoyo de artillería asignado.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )
                })()}
            </div>
        );
    }

    return (
        <div>
            {!activePlan ? (
                <Card>
                    <SectionHeader title="Órdenes de Guerra" description="Selecciona un plan de batalla de la biblioteca para ver tus asignaciones." />
                    <div className="mt-6 space-y-3">
                        {savedBattlePlans.length === 0 ? (
                             <div className="text-center py-12">
                                <h3 className="text-xl font-semibold text-slate-600">La Biblioteca de Guerra está vacía.</h3>
                                <p className="text-slate-500 mt-2">Un Comandante u Oficial debe grabar un plan primero.</p>
                            </div>
                        ) : (
                            [...savedBattlePlans].sort((a,b) => b.date.localeCompare(a.date)).map(plan => (
                                <div key={plan.id} className="bg-slate-100 p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <h4 className="font-semibold text-lg text-slate-800">{plan.name}</h4>
                                            <p className="text-sm text-slate-500">Fecha: {plan.date}</p>
                                        </div>
                                         {plan.status === 'completed' && (
                                            <span className="text-xs font-bold bg-slate-400 text-white px-2 py-0.5 rounded-full">COMPLETADO</span>
                                        )}
                                    </div>
                                    <button 
                                        onClick={() => setActiveWarOrderPlanId(plan.id)}
                                        className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-lg transition-colors w-full sm:w-auto"
                                    >
                                        Cargar Plan
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </Card>
            ) : (
                renderMyAssignment(activePlan)
            )}
        </div>
    );
};

export default WarOrdersView;