import React, { useState, useContext } from 'react';
import { DataContext } from '../context/DataContext';
import { Troop } from '../types';
import Card from './common/Card';

const TroopManager: React.FC = () => {
    const { masterTroops, updateMasterData } = useContext(DataContext);
    const [isAdding, setIsAdding] = useState(false);
    const [editingTroop, setEditingTroop] = useState<Troop | null>(null);
    const [formData, setFormData] = useState<Omit<Troop, 'id'>>({ name: '', tier: 3, leadership: 150, imageUrl: '' });

    const handleSave = () => {
        if (!formData.name) return;
        let updatedTroops;
        if (editingTroop) {
            updatedTroops = masterTroops.map(t => t.id === editingTroop.id ? { ...editingTroop, ...formData } : t);
        } else {
            const newTroop: Troop = { id: `troop_${Date.now()}`, ...formData };
            updatedTroops = [...masterTroops, newTroop];
        }
        updateMasterData('troops', updatedTroops);
        resetForm();
    };

    const handleDelete = (id: string) => {
        if (window.confirm("¿Seguro que quieres eliminar esta tropa de la lista maestra?")) {
            updateMasterData('troops', masterTroops.filter(t => t.id !== id));
        }
    };
    
    const startEdit = (troop: Troop) => {
        setEditingTroop(troop);
        setFormData({ name: troop.name, tier: troop.tier, leadership: troop.leadership, imageUrl: troop.imageUrl });
        setIsAdding(true);
    };

    const resetForm = () => {
        setIsAdding(false);
        setEditingTroop(null);
        setFormData({ name: '', tier: 3, leadership: 150, imageUrl: '' });
    };
    
    return (
        <div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Gestionar Tropas (Maestro)</h3>
            {!isAdding && (
                <button onClick={() => setIsAdding(true)} className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-lg mb-4">
                    + Añadir Tropa
                </button>
            )}
            {isAdding && (
                <Card className="bg-slate-100/50 mb-4 p-4 space-y-3">
                    <h4 className="font-bold">{editingTroop ? 'Editando' : 'Nueva'} Tropa</h4>
                    <input type="text" value={formData.name} onChange={e => setFormData(p => ({...p, name: e.target.value}))} placeholder="Nombre" className="w-full bg-white border border-slate-300 rounded p-2 text-slate-800"/>
                    <input type="number" value={formData.tier} onChange={e => setFormData(p => ({...p, tier: parseInt(e.target.value)}))} placeholder="Tier" className="w-full bg-white border border-slate-300 rounded p-2 text-slate-800"/>
                    <input type="number" value={formData.leadership} onChange={e => setFormData(p => ({...p, leadership: parseInt(e.target.value)}))} placeholder="Liderazgo" className="w-full bg-white border border-slate-300 rounded p-2 text-slate-800"/>
                    <input type="text" value={formData.imageUrl} onChange={e => setFormData(p => ({...p, imageUrl: e.target.value}))} placeholder="URL de la imagen" className="w-full bg-white border border-slate-300 rounded p-2 text-slate-800"/>
                    <div className="flex gap-2">
                        <button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded">Guardar</button>
                        <button onClick={resetForm} className="bg-slate-500 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded">Cancelar</button>
                    </div>
                </Card>
            )}
            <div className="space-y-2 max-h-96 overflow-y-auto">
                {masterTroops.sort((a,b) => b.tier - a.tier || a.name.localeCompare(b.name)).map(t => (
                    <div key={t.id} className="bg-slate-100 p-3 rounded-lg flex justify-between items-center">
                        <p className="font-semibold">{t.name} (T{t.tier})</p>
                        <div className="flex gap-2">
                            <button onClick={() => startEdit(t)} className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-1 px-3 rounded">Editar</button>
                            <button onClick={() => handleDelete(t.id)} className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-1 px-3 rounded">Eliminar</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TroopManager;