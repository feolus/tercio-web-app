import React, { useState, useContext } from 'react';
import { DataContext } from '../context/DataContext';
import { Artillery } from '../types';
import Card from './common/Card';

const ArtilleryManager: React.FC = () => {
    const { masterArtillery, updateMasterData } = useContext(DataContext);
    const [isAdding, setIsAdding] = useState(false);
    const [editingArtillery, setEditingArtillery] = useState<Artillery | null>(null);
    const [formData, setFormData] = useState<Omit<Artillery, 'id'>>({ name: '', imageUrl: '' });

    const handleSave = () => {
        if (!formData.name) return;
        let updatedArtillery;
        if (editingArtillery) {
            updatedArtillery = masterArtillery.map(a => a.id === editingArtillery.id ? { ...editingArtillery, ...formData } : a);
        } else {
            const newArtillery: Artillery = { id: `artillery_${Date.now()}`, ...formData };
            updatedArtillery = [...masterArtillery, newArtillery];
        }
        updateMasterData('artillery', updatedArtillery);
        resetForm();
    };

    const handleDelete = (id: string) => {
        if (window.confirm("¿Seguro que quieres eliminar esta pieza de artillería de la lista maestra?")) {
            updateMasterData('artillery', masterArtillery.filter(a => a.id !== id));
        }
    };

    const startEdit = (artillery: Artillery) => {
        setEditingArtillery(artillery);
        setFormData({ name: artillery.name, imageUrl: artillery.imageUrl });
        setIsAdding(true);
    };

    const resetForm = () => {
        setIsAdding(false);
        setEditingArtillery(null);
        setFormData({ name: '', imageUrl: '' });
    };

    return (
        <div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Gestionar Artillería (Maestro)</h3>
            {!isAdding && (
                <button onClick={() => setIsAdding(true)} className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-lg mb-4">
                    + Añadir Artillería
                </button>
            )}
            {isAdding && (
                <Card className="bg-slate-100/50 mb-4 p-4 space-y-3">
                    <h4 className="font-bold">{editingArtillery ? 'Editando' : 'Nueva'} Artillería</h4>
                    <input type="text" value={formData.name} onChange={e => setFormData(p => ({...p, name: e.target.value}))} placeholder="Nombre" className="w-full bg-white border border-slate-300 rounded p-2 text-slate-800"/>
                    <input type="text" value={formData.imageUrl} onChange={e => setFormData(p => ({...p, imageUrl: e.target.value}))} placeholder="URL de la imagen" className="w-full bg-white border border-slate-300 rounded p-2 text-slate-800"/>
                    <div className="flex gap-2">
                        <button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded">Guardar</button>
                        <button onClick={resetForm} className="bg-slate-500 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded">Cancelar</button>
                    </div>
                </Card>
            )}
            <div className="space-y-2 max-h-96 overflow-y-auto">
                {masterArtillery.sort((a, b) => a.name.localeCompare(b.name)).map(a => (
                    <div key={a.id} className="bg-slate-100 p-3 rounded-lg flex justify-between items-center">
                        <p className="font-semibold">{a.name}</p>
                        <div className="flex gap-2">
                            <button onClick={() => startEdit(a)} className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-1 px-3 rounded">Editar</button>
                            <button onClick={() => handleDelete(a.id)} className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-1 px-3 rounded">Eliminar</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ArtilleryManager;