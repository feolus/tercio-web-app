import React, { useContext, useState, useMemo } from 'react';
import { User, UserWeapon, Weapon } from '../types';
import { DataContext } from '../context/DataContext';
import SectionHeader from './common/SectionHeader';
import Card from './common/Card';
import ToggleSwitch from './common/ToggleSwitch';

interface HeroPanelProps {
    user: User;
    onUpdate: (user: User) => void;
}

const HeroPanel: React.FC<HeroPanelProps> = ({ user, onUpdate }) => {
    const { masterWeapons } = useContext(DataContext);
    const [selectedWeaponToAdd, setSelectedWeaponToAdd] = useState<string>('');

    const userWeaponIds = useMemo(() => new Set(user.weapons.map(w => w.weaponId)), [user.weapons]);
    
    const ownedWeaponsData = useMemo(() => {
        return user.weapons
            .map(uw => {
                const masterWeapon = masterWeapons.find(mw => mw.id === uw.weaponId);
                return masterWeapon ? { ...masterWeapon, ...uw } : null;
            })
            .filter((weapon): weapon is Weapon & UserWeapon => weapon !== null)
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [user.weapons, masterWeapons]);

    const availableMasterWeapons = useMemo(() => {
        return masterWeapons
            .filter(mw => !userWeaponIds.has(mw.id))
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [masterWeapons, userWeaponIds]);

    const handleWeaponUpdate = (weaponId: string, updatedData: Partial<UserWeapon>) => {
        let newWeapons = user.weapons.map(w =>
            w.weaponId === weaponId ? { ...w, ...updatedData } : w
        );
        
        if (updatedData.isFavorite && updatedData.isFavorite === true) {
            newWeapons = newWeapons.map(w => 
                w.weaponId !== weaponId ? { ...w, isFavorite: false } : w
            );
        }

        onUpdate({ ...user, weapons: newWeapons });
    };

    const handleAddWeapon = () => {
        if (!selectedWeaponToAdd || user.weapons.some(w => w.weaponId === selectedWeaponToAdd)) {
            return;
        }

        const newWeapon: UserWeapon = {
            weaponId: selectedWeaponToAdd,
            leadership: 700,
            epicWeaponBlueprint: false,
            epicArmorBlueprint: false,
            reforgedArmor: false,
            isFavorite: user.weapons.length === 0,
        };

        onUpdate({ ...user, weapons: [...user.weapons, newWeapon] });
        setSelectedWeaponToAdd('');
    };

    const handleRemoveWeapon = (weaponId: string) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta arma de tu equipamiento?')) {
            const newWeapons = user.weapons.filter(w => w.weaponId !== weaponId);
            onUpdate({ ...user, weapons: newWeapons });
        }
    };

    return (
        <div>
            <SectionHeader title="Equipamiento del Héroe" description="Gestiona las armas que posees y sus atributos." />
            
            <Card className="mb-6 bg-slate-50">
                <h3 className="text-lg font-bold text-slate-700 mb-3">Añadir Nueva Arma</h3>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <select
                        value={selectedWeaponToAdd}
                        onChange={(e) => setSelectedWeaponToAdd(e.target.value)}
                        className="flex-grow bg-white text-slate-800 border border-slate-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        aria-label="Seleccionar arma para añadir"
                    >
                        <option value="">Selecciona un arma...</option>
                        {availableMasterWeapons.map((weapon) => (
                            <option key={weapon.id} value={weapon.id}>
                                {weapon.name}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={handleAddWeapon}
                        disabled={!selectedWeaponToAdd}
                        className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Añadir Arma
                    </button>
                </div>
            </Card>

            {ownedWeaponsData.length === 0 ? (
                <Card>
                    <div className="text-center py-8">
                        <h3 className="text-xl font-semibold text-slate-600">No tienes armas equipadas.</h3>
                        <p className="text-slate-500 mt-2">Usa el menú de arriba para añadir tu primera arma.</p>
                    </div>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {ownedWeaponsData.map(weapon => (
                        <Card key={weapon.weaponId} className="flex flex-col">
                            <div className="flex items-start gap-4 mb-4">
                                <img
                                    src={weapon.imageUrl}
                                    alt={weapon.name}
                                    className="w-20 h-20 rounded-lg object-cover border-4 border-slate-300"
                                />
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg text-slate-900">{weapon.name}</h3>
                                </div>
                                <button
                                    onClick={() => handleRemoveWeapon(weapon.weaponId)}
                                    className="text-xs bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 rounded transition-colors"
                                    aria-label={`Eliminar ${weapon.name}`}
                                >
                                    Eliminar
                                </button>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-slate-200 flex-grow flex flex-col justify-between">
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-2">
                                        Liderazgo: <span className="text-amber-600 font-bold">{weapon.leadership}</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="700"
                                        max="1000"
                                        step="5"
                                        value={weapon.leadership}
                                        onChange={(e) => handleWeaponUpdate(weapon.weaponId, { leadership: parseInt(e.target.value, 10) })}
                                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                                        aria-label={`Liderazgo para ${weapon.name}`}
                                    />
                                </div>
                                <div className="space-y-3 mt-4">
                                    <ToggleSwitch
                                        label="Plano de Arma Épica"
                                        checked={weapon.epicWeaponBlueprint}
                                        onChange={(c) => handleWeaponUpdate(weapon.weaponId, { epicWeaponBlueprint: c })}
                                    />
                                    <ToggleSwitch
                                        label="Plano de Armadura Épica"
                                        checked={weapon.epicArmorBlueprint}
                                        onChange={(c) => handleWeaponUpdate(weapon.weaponId, { epicArmorBlueprint: c })}
                                    />
                                    <ToggleSwitch
                                        label="Armadura Reforjada"
                                        checked={weapon.reforgedArmor}
                                        onChange={(c) => handleWeaponUpdate(weapon.weaponId, { reforgedArmor: c })}
                                    />
                                    <ToggleSwitch
                                        label="Favorita"
                                        checked={weapon.isFavorite}
                                        onChange={(c) => handleWeaponUpdate(weapon.weaponId, { isFavorite: c })}
                                    />
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HeroPanel;