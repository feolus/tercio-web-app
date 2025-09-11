import React, { useContext } from 'react';
import Card from './common/Card';
import SectionHeader from './common/SectionHeader';
import { DataContext } from '../context/DataContext';
import { UserContext } from '../context/UserContext';
import { Role } from '../types';

const WarLibrary: React.FC = () => {
    const { savedBattlePlans, deleteBattlePlan } = useContext(DataContext);
    const { currentUser } = useContext(UserContext);

    const canDelete = currentUser?.role === Role.Commander || currentUser?.role === Role.Oficial || currentUser?.role === Role.Capitan;

    const handleDelete = (planId: string) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este plan de batalla de forma permanente?')) {
            deleteBattlePlan(planId);
        }
    };

    return (
        <Card>
            <SectionHeader title="Biblioteca de Guerra" description="Consulta y gestiona todos los planes de batalla guardados." />
            <div className="mt-4 space-y-3">
                {savedBattlePlans.length === 0 ? (
                    <div className="text-center py-12">
                        <h3 className="text-xl font-semibold text-slate-600">No hay planes de batalla guardados.</h3>
                        <p className="text-slate-500 mt-2">Ve a "Plan de Batalla" para crear el primero.</p>
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
                            {canDelete && (
                                <button 
                                    onClick={() => handleDelete(plan.id)}
                                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors w-full sm:w-auto"
                                >
                                    Eliminar
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>
        </Card>
    );
};

export default WarLibrary;