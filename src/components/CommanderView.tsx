import React, { useState, useContext, useMemo } from 'react';
import SectionHeader from './common/SectionHeader';
import BattlePlanner from './BattlePlanner';
import TroopManager from './TroopManager';
import WeaponManager from './WeaponManager';
import ArtilleryManager from './ArtilleryManager';
import StaffManager from './StaffManager';
import Card from './common/Card';
import { UserContext } from '../context/UserContext';
import { DataContext } from '../context/DataContext';
import HeroPanel from './HeroPanel';
import TroopCard from './TroopCard';
import { UserTroop } from '../types';
import WarOrdersView from './WarOrdersView';
import WarLibrary from './WarLibrary';
import NobilityManager from './NobilityView';

type MainCategory = 'caballero' | 'comandancia' | 'archivos';
type GarrisonTab = 'troops' | 'weapons' | 'artillery';

const getTierColor = (tier: number, type?: 'text' | 'border' | 'bg') => {
    const colors = {
        5: { border: 'border-amber-400', bg: 'bg-amber-400', text: 'text-amber-500' },
        4: { border: 'border-purple-500', bg: 'bg-purple-500', text: 'text-purple-600' },
        3: { border: 'border-sky-500', bg: 'bg-sky-500', text: 'text-sky-600' },
        2: { border: 'border-emerald-500', bg: 'bg-emerald-500', text: 'text-emerald-600' },
        1: { border: 'border-slate-400', bg: 'bg-slate-400', text: 'text-slate-500' },
    };
    const colorSet = colors[tier as keyof typeof colors] || { border: 'border-slate-600', bg: 'bg-slate-600', text: 'text-slate-700' };

    if (!type) return colorSet.border;
    
    switch(type) {
        case 'text': return colorSet.text;
        case 'border': return colorSet.border;
        case 'bg': return colorSet.bg;
    }
};

const AddTroopsModal = ({ isOpen, onClose, onUpdate, onRemove, userTroopsMap }: { 
    isOpen: boolean; 
    onClose: () => void;
    onUpdate: (troopId: string, updatedData: Partial<UserTroop>) => void;
    onRemove: (troopId: string) => void;
    userTroopsMap: Map<string, UserTroop>;
}) => {
    const { masterTroops } = useContext(DataContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [tierFilter, setTierFilter] = useState<number[]>([1, 2, 3, 4, 5]);
    
    const filteredMasterTroops = useMemo(() => {
        return masterTroops
            .filter(troop => tierFilter.includes(troop.tier))
            .filter(troop => troop.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .sort((a, b) => b.tier - a.tier || a.name.localeCompare(b.name));
    }, [masterTroops, searchTerm, tierFilter]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4" aria-modal="true" role="dialog">
            <Card className="w-full max-w-7xl h-[90vh] flex flex-col bg-slate-50">
                <div className="flex justify-between items-center mb-4">
                     <h2 className="text-2xl sm:text-3xl font-bold text-amber-600">Añadir Tropas a tu Cuartel</h2>
                    <button onClick={onClose} className="text-2xl font-bold text-slate-500 hover:text-slate-800">&times;</button>
                </div>
                 <div className="bg-slate-100 p-4 rounded-lg mb-4 flex flex-col sm:flex-row gap-4 sticky top-0 z-10">
                     <input
                        type="text"
                        placeholder="Buscar tropas..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full sm:w-1/3 bg-white text-slate-800 placeholder-slate-500 border border-slate-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold mr-2">Filtrar por Tier:</span>
                        {[5, 4, 3, 2, 1].map(tier => (
                            <button
                                key={tier}
                                onClick={() => {
                                    setTierFilter(prev => 
                                        prev.includes(tier) ? prev.filter(t => t !== tier) : [...prev, tier]
                                    );
                                }}
                                className={`px-3 py-1 text-sm font-bold rounded-full border-2 transition-all ${
                                    tierFilter.includes(tier) ? `${getTierColor(tier, 'bg')} text-slate-900 ${getTierColor(tier, 'border')}` : `bg-slate-200 hover:bg-slate-300 ${getTierColor(tier, 'border')}`
                                }`}
                            >
                                T{tier}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="overflow-y-auto flex-grow pr-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                         {filteredMasterTroops.map(troop => (
                            <TroopCard
                                key={troop.id}
                                troop={troop}
                                userTroop={userTroopsMap.get(troop.id)}
                                onUpdate={onUpdate}
                                onRemove={onRemove}
                            />
                        ))}
                    </div>
                </div>
            </Card>
        </div>
    );
};


const CommanderView: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState<MainCategory>('caballero');
    const [activeSubTab, setActiveSubTab] = useState<string>('my_equipment');
    const [garrisonTab, setGarrisonTab] = useState<GarrisonTab>('troops');
    
    const { currentUser, updateUser } = useContext(UserContext);
    const { masterTroops } = useContext(DataContext);
    const [isAddingTroops, setIsAddingTroops] = useState(false);
    
    const handleCategoryChange = (category: MainCategory) => {
        setActiveCategory(category);
        // Set default sub-tab for the new category
        switch (category) {
            case 'caballero':
                setActiveSubTab('my_equipment');
                break;
            case 'comandancia':
                setActiveSubTab('battle_plan');
                break;
            case 'archivos':
                setActiveSubTab('war_library');
                break;
        }
    };

    const handleTroopUpdate = (troopId: string, updatedData: Partial<UserTroop>) => {
        if (!currentUser) return;

        const existingTroop = currentUser.troops.find(t => t.troopId === troopId);
        let newTroops: UserTroop[];

        if (existingTroop) {
            newTroops = currentUser.troops.map(t =>
                t.troopId === troopId ? { ...t, ...updatedData } : t
            );
        } else {
             newTroops = [...currentUser.troops, { 
                troopId,
                mastery: false,
                leadershipDoctrine: false,
                isFavorite: false,
                isMaxLevel: false,
                ...updatedData
             }];
        }
        
        updateUser({ ...currentUser, troops: newTroops });
    };

    const handleTroopRemove = (troopId: string) => {
        if(!currentUser) return;
        const newTroops = currentUser.troops.filter(t => t.troopId !== troopId);
        updateUser({...currentUser, troops: newTroops});
    };
    
    if (!currentUser) return <div>Cargando...</div>;

    const userTroopsMap = new Map(currentUser.troops.map(t => [t.troopId, t]));
    
    const ownedTroops = masterTroops
        .filter(troop => userTroopsMap.has(troop.id))
        .sort((a, b) => b.tier - a.tier || a.name.localeCompare(b.name));

    const categoryTabClass = (categoryName: MainCategory) => {
        const baseClasses = 'whitespace-nowrap py-4 px-2 border-b-4 font-bold text-xl transition-colors focus:outline-none';
        if (activeCategory === categoryName) {
            return `${baseClasses} border-amber-500 text-amber-600`;
        }
        return `${baseClasses} border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300`;
    };

    const subTabClass = (subTabName: string) => {
        const baseClasses = 'whitespace-nowrap py-3 px-1 border-b-2 font-medium text-lg transition-colors focus:outline-none';
        if (activeSubTab === subTabName) {
            return `${baseClasses} border-sky-500 text-sky-600`;
        }
        return `${baseClasses} border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300`;
    };
    
    const garrisonTabClass = (tabName: GarrisonTab) => {
        const baseClasses = 'whitespace-nowrap py-3 px-1 border-b-2 font-medium text-base transition-colors focus:outline-none';
        if (garrisonTab === tabName) {
            return `${baseClasses} border-sky-500 text-sky-600`;
        }
        return `${baseClasses} border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300`;
    };

    return (
        <div>
             <SectionHeader 
                title="Panel del Comandante" 
                description="Gestiona tu equipo personal, planifica batallas y administra la guarnición." 
            />
            
            <div className="border-b-2 border-slate-300 mt-6">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button onClick={() => handleCategoryChange('caballero')} className={categoryTabClass('caballero')}>
                        Caballero
                    </button>
                    <button onClick={() => handleCategoryChange('comandancia')} className={categoryTabClass('comandancia')}>
                        Comandancia
                    </button>
                    <button onClick={() => handleCategoryChange('archivos')} className={categoryTabClass('archivos')}>
                        Archivos
                    </button>
                </nav>
            </div>

            <div className="border-b border-slate-200 mt-4">
                 <nav className="-mb-px flex space-x-8" aria-label="Sub-Tabs">
                    {activeCategory === 'caballero' && (
                        <>
                             <button onClick={() => setActiveSubTab('my_equipment')} className={subTabClass('my_equipment')}>Mi Equipamiento</button>
                             <button onClick={() => setActiveSubTab('my_troops')} className={subTabClass('my_troops')}>Mis Tropas</button>
                             <button onClick={() => setActiveSubTab('war_orders')} className={subTabClass('war_orders')}>Órdenes de Guerra</button>
                        </>
                    )}
                    {activeCategory === 'comandancia' && (
                        <>
                             <button onClick={() => setActiveSubTab('battle_plan')} className={subTabClass('battle_plan')}>Plan de Batalla</button>
                             <button onClick={() => setActiveSubTab('garrison')} className={subTabClass('garrison')}>Guarnición</button>
                             <button onClick={() => setActiveSubTab('plana_mayor')} className={subTabClass('plana_mayor')}>Plana Mayor</button>
                        </>
                    )}
                    {activeCategory === 'archivos' && (
                        <>
                             <button onClick={() => setActiveSubTab('war_library')} className={subTabClass('war_library')}>Biblioteca de Guerra</button>
                             <button onClick={() => setActiveSubTab('nobility')} className={subTabClass('nobility')}>Nobleza</button>
                        </>
                    )}
                </nav>
            </div>

            <div className="mt-6">
                {activeCategory === 'caballero' && activeSubTab === 'my_equipment' && (
                    <HeroPanel user={currentUser} onUpdate={updateUser} />
                )}

                {activeCategory === 'caballero' && activeSubTab === 'my_troops' && (
                     <div>
                        <div className="flex justify-between items-start mb-6 pb-2 border-b-2 border-slate-200">
                            <div>
                               <h2 className="text-2xl sm:text-3xl font-bold text-amber-600">Mis Tropas</h2>
                                <p className="text-slate-500 mt-1">Administra tus unidades disponibles y su estado.</p>
                            </div>
                            <button onClick={() => setIsAddingTroops(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg transition-colors whitespace-nowrap">
                                + Añadir Tropa
                            </button>
                        </div>
                        
                        {ownedTroops.length === 0 ? (
                             <div className="text-center py-16 bg-slate-100/50 rounded-lg">
                                <h3 className="text-xl font-semibold text-slate-600">Tu cuartel está vacío.</h3>
                                <p className="text-slate-500 mt-2">¡Haz clic en "Añadir Tropa" para empezar a construir tu ejército!</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                                {ownedTroops.map(troop => (
                                    <TroopCard
                                        key={troop.id}
                                        troop={troop}
                                        userTroop={userTroopsMap.get(troop.id)}
                                        onUpdate={handleTroopUpdate}
                                        onRemove={handleTroopRemove}
                                    />
                                ))}
                            </div>
                        )}

                        <AddTroopsModal 
                            isOpen={isAddingTroops}
                            onClose={() => setIsAddingTroops(false)}
                            onUpdate={handleTroopUpdate}
                            onRemove={handleTroopRemove}
                            userTroopsMap={userTroopsMap}
                        />

                    </div>
                )}
                
                {activeCategory === 'caballero' && activeSubTab === 'war_orders' && (
                    <WarOrdersView />
                )}

                {activeCategory === 'comandancia' && activeSubTab === 'battle_plan' && (
                    <BattlePlanner />
                )}
                
                {activeCategory === 'comandancia' && activeSubTab === 'garrison' && (
                     <div>
                        <div className="border-b border-slate-200">
                            <nav className="-mb-px flex space-x-6" aria-label="Garrison Tabs">
                                <button
                                    onClick={() => setGarrisonTab('troops')}
                                    className={garrisonTabClass('troops')}
                                    aria-current={garrisonTab === 'troops' ? 'page' : undefined}
                                >
                                    Gestionar Tropas
                                </button>
                                <button
                                    onClick={() => setGarrisonTab('weapons')}
                                    className={garrisonTabClass('weapons')}
                                    aria-current={garrisonTab === 'weapons' ? 'page' : undefined}
                                >
                                    Gestionar Armas
                                </button>
                                <button
                                    onClick={() => setGarrisonTab('artillery')}
                                    className={garrisonTabClass('artillery')}
                                    aria-current={garrisonTab === 'artillery' ? 'page' : undefined}
                                >
                                    Artillería
                                </button>
                            </nav>
                        </div>
                        <div className="mt-6">
                            <Card className="bg-slate-50">
                                {garrisonTab === 'troops' && <TroopManager />}
                                {garrisonTab === 'weapons' && <WeaponManager />}
                                {garrisonTab === 'artillery' && <ArtilleryManager />}
                            </Card>
                        </div>
                    </div>
                )}

                {activeCategory === 'comandancia' && activeSubTab === 'plana_mayor' && (
                    <Card>
                        <StaffManager />
                    </Card>
                )}

                {activeCategory === 'archivos' && activeSubTab === 'war_library' && (
                    <WarLibrary />
                )}

                {activeCategory === 'archivos' && activeSubTab === 'nobility' && (
                    <NobilityManager />
                )}
            </div>
        </div>
    );
};

export default CommanderView;