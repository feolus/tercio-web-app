import React, { useState, useMemo, useContext } from 'react';
import { User, BattleGroup, BattleKnight, Troop, UserTroop, Weapon, UserWeapon } from '../types';
import Card from './common/Card';
import { DataContext } from '../context/DataContext';

interface AssignmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (assignment: BattleKnight) => void;
    user: User;
    group: BattleGroup;
}

const AssignmentModal: React.FC<AssignmentModalProps> = ({ isOpen, onClose, onSave, user, group }) => {
    const { masterTroops, masterWeapons } = useContext(DataContext);
    const [selectedWeaponId, setSelectedWeaponId] = useState<string | undefined>(user.weapons.find(w => w.isFavorite)?.weaponId || user.weapons[0]?.weaponId);
    const [selectedTroopIds, setSelectedTroopIds] = useState<string[]>([]);

    const userOwnedTroops = useMemo(() => {
        return user.troops.map(ut => {
            const masterData = masterTroops.find(mt => mt.id === ut.troopId);
            if (!masterData) return null;
            const leadership = ut.leadershipDoctrine ? Math.floor(masterData.leadership * 0.84) : masterData.leadership;
            return { ...masterData, ...ut, calculatedLeadership: leadership };
        }).filter((t): t is Troop & UserTroop & { calculatedLeadership: number } => t !== null)
          .sort((a,b) => b.tier - a.tier || a.name.localeCompare(b.name));
    }, [user, masterTroops]);

    const userOwnedWeapons = useMemo(() => {
         return user.weapons.map(uw => {
            const masterData = masterWeapons.find(mw => mw.id === uw.weaponId);
            return masterData ? { ...masterData, ...uw } : null;
        }).filter((w): w is Weapon & UserWeapon => w !== null);
    }, [user, masterWeapons]);

    const selectedWeapon = useMemo(() => {
        return userOwnedWeapons.find(w => w.weaponId === selectedWeaponId);
    }, [selectedWeaponId, userOwnedWeapons]);
    
    const totalLeadership = selectedWeapon?.leadership || 700;
    
    const usedLeadership = useMemo(() => {
        return selectedTroopIds.reduce((acc, troopId) => {
            const troop = userOwnedTroops.find(t => t.troopId === troopId);
            return acc + (troop?.calculatedLeadership || 0);
        }, 0);
    }, [selectedTroopIds, userOwnedTroops]);

    const handleTroopSelection = (troopId: string) => {
        setSelectedTroopIds(prev =>
            prev.includes(troopId)
                ? prev.filter(id => id !== troopId)
                : [...prev, troopId]
        );
    };
    
    const handleSave = () => {
        if (!user) return;
        const assignment: BattleKnight = {
            userId: user.uid,
            selectedTroops: selectedTroopIds,
            selectedWeaponId: selectedWeaponId,
        };
        onSave(assignment);
    };
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-4xl h-[80vh] flex flex-col bg-slate-50">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-amber-600">Asignar Equipamiento</h2>
                        <p className="text-slate-500">Para: <span className="font-bold">{user.name}</span> | Tarea: <span className="font-bold">{group.task}</span></p>
                    </div>
                    <button onClick={onClose} className="text-2xl font-bold text-slate-500 hover:text-slate-800">&times;</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-grow overflow-hidden">
                    {/* Left Column - Weapons */}
                    <div className="flex flex-col">
                         <h3 className="text-lg font-semibold text-slate-800 mb-2">1. Seleccionar Arma</h3>
                        <div className="overflow-y-auto space-y-2 p-2 bg-slate-100 rounded-lg flex-grow">
                             {userOwnedWeapons.map(weapon => (
                                <label key={weapon.weaponId} className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${selectedWeaponId === weapon.weaponId ? 'bg-amber-100 border-amber-400 border-2' : 'bg-white border'}`}>
                                    <input type="radio" name="weapon" value={weapon.weaponId} checked={selectedWeaponId === weapon.weaponId} onChange={(e) => setSelectedWeaponId(e.target.value)} className="sr-only" />
                                    <img src={weapon.imageUrl} alt={weapon.name} className="w-10 h-10 rounded-md mr-3" />
                                    <span className="font-medium text-slate-700">{weapon.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Right Column - Troops */}
                    <div className="md:col-span-2 flex flex-col">
                        <div className="flex justify-between items-center mb-2">
                             <h3 className="text-lg font-semibold text-slate-800">2. Seleccionar Tropas</h3>
                             <div className="text-right">
                                <p className="font-semibold">Liderazgo</p>
                                <p className={`text-sm font-bold ${usedLeadership > totalLeadership ? 'text-red-500' : 'text-emerald-500'}`}>{usedLeadership} / {totalLeadership}</p>
                            </div>
                        </div>
                        <div className="overflow-y-auto grid grid-cols-1 lg:grid-cols-2 gap-3 p-2 bg-slate-100 rounded-lg flex-grow">
                            {userOwnedTroops.map(troop => (
                                <label key={troop.troopId} className={`flex items-center p-2 rounded-lg cursor-pointer transition-all ${selectedTroopIds.includes(troop.troopId) ? 'bg-sky-100 border-sky-400 border-2' : 'bg-white border'}`}>
                                    <input type="checkbox" checked={selectedTroopIds.includes(troop.troopId)} onChange={() => handleTroopSelection(troop.troopId)} className="h-5 w-5 rounded border-gray-300 text-sky-600 focus:ring-sky-500 mr-3" />
                                    <img src={troop.imageUrl} alt={troop.name} className="w-10 h-10 rounded-md mr-3" />
                                    <div>
                                        <p className="font-medium text-sm text-slate-800">{troop.name}</p>
                                        <p className="text-xs text-slate-500">Liderazgo: {troop.calculatedLeadership}</p>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-4">
                    <button onClick={onClose} className="bg-slate-500 hover:bg-slate-600 text-white font-bold py-2 px-6 rounded-lg">Cancelar</button>
                    <button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded-lg">Guardar Asignación</button>
                </div>
            </Card>
        </div>
    );
};

export default AssignmentModal;