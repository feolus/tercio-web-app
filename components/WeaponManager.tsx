import React, { useState, useContext } from 'react';
import { DataContext } from '../context/DataContext';
import { Weapon } from '../types';
import Card from './common/Card';

const WeaponManager: React.FC = () => {
    const { masterWeapons, updateMasterData } = useContext(DataContext);
    const [isAdding, setIsAdding] = useState(false);
    const [editingWeapon, setEditingWeapon] = useState<Weapon | null>(null);
    const [formData, setFormData] = useState<Omit<Weapon, 'id'>>({ name: '', imageUrl: '' });

    const handleSave = () => {
        if (!formData.name) return;
        let updatedWeapons;
        if (editingWeapon) {
            updatedWeapons = masterWeapons.map(w => w.id === editingWeapon.id ? { ...editingWeapon, ...formData } : w);
        } else {
            const newWeapon: Weapon = { id: `weapon_${Date.now()}`, ...formData };
            updatedWeapons = [...masterWeapons, newWeapon];
        }
        updateMasterData('weapons', updatedWeapons);
        resetForm();
    };

    const handleDelete = (id: string) => {
        if (window.confirm("¿Seguro que quieres eliminar esta arma de la lista maestra?")) {
            updateMasterData('weapons', masterWeapons.filter(w => w.id !== id));
        }
    };

    const startEdit = (weapon: Weapon) => {
        setEditingWeapon(weapon);
        setFormData({ name: weapon.name, imageUrl: weapon.imageUrl });
        setIsAdding(true);
    };

    const resetForm = () => {
        setIsAdding(false);
        setEditingWeapon(null);
        setFormData({ name: '', imageUrl: '' });
    };

    return (
        <div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Gestionar Armas (Maestro)</h3>
            {!isAdding && (
                <button onClick={() => setIsAdding(true)} className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-lg mb-4">
                    + Añadir Arma
                </button>
            )}
            {isAdding && (
                <Card className="bg-slate-100/50 mb-4 p-4 space-y-3">
                    <h4 className="font-bold">{editingWeapon ? 'Editando' : 'Nueva'} Arma</h4>
                    <input type="text" value={formData.name} onChange={e => setFormData(p => ({...p, name: e.target.value}))} placeholder="Nombre" className="w-full bg-white border border-slate-300 rounded p-2 text-slate-800"/>
                    <input type="text" value={formData.imageUrl} onChange={e => setFormData(p => ({...p, imageUrl: e.target.value}))} placeholder="URL de la imagen" className="w-full bg-white border border-slate-300 rounded p-2 text-slate-800"/>
                    <div className="flex gap-2">
                        <button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded">Guardar</button>
                        <button onClick={resetForm} className="bg-slate-500 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded">Cancelar</button>
                    </div>
                </Card>
            )}
            <div className="space-y-2 max-h-96 overflow-y-auto">
                {masterWeapons.sort((a, b) => a.name.localeCompare(b.name)).map(w => (
                    <div key={w.id} className="bg-slate-100 p-3 rounded-lg flex justify-between items-center">
                        <p className="font-semibold">{w.name}</p>
                        <div className="flex gap-2">
                            <button onClick={() => startEdit(w)} className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-1 px-3 rounded">Editar</button>
                            <button onClick={() => handleDelete(w.id)} className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-1 px-3 rounded">Eliminar</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WeaponManager;