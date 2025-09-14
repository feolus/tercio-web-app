import React, { useState, useContext, useMemo, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import { User, Role } from '../types';
import Card from './common/Card';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';

const ROLE_HIERARCHY: Record<Role, number> = {
    [Role.Commander]: 5,
    [Role.Oficial]: 4,
    [Role.Capitan]: 3,
    [Role.SargentoDeLevas]: 2,
    [Role.Knight]: 1,
    [Role.Escudero]: 0,
};

const StaffManager: React.FC = () => {
    const { updateUser, removeUser, currentUser } = useContext(UserContext);

    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        discordId: '',
        role: Role.Escudero,
    });
    
    const [currentPage, setCurrentPage] = useState(1);
    const USERS_PER_PAGE = 15;

    useEffect(() => {
        if (!db) {
            setError("La conexión con la base de datos no está disponible.");
            setLoading(false);
            return;
        }

        const unsub = onSnapshot(collection(db, 'users'),
            (snapshot) => {
                setUsers(snapshot.docs.map(doc => doc.data() as User));
                setLoading(false);
                setError(null);
            },
            (err) => {
                console.error("Error fetching users for StaffManager:", err);
                setError("No tienes permiso para ver la lista de miembros.");
                setLoading(false);
            }
        );

        return () => unsub();
    }, []);

    const sortedUsers = useMemo(() => 
        [...users].sort((a, b) => a.name.localeCompare(b.name)),
    [users]);

    const totalPages = Math.ceil(sortedUsers.length / USERS_PER_PAGE);
    
    const paginatedUsers = useMemo(() => {
        const startIndex = (currentPage - 1) * USERS_PER_PAGE;
        return sortedUsers.slice(startIndex, startIndex + USERS_PER_PAGE);
    }, [currentPage, sortedUsers]);

    useEffect(() => {
        if (paginatedUsers.length === 0 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    }, [paginatedUsers, currentPage]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value as Role }));
    };

    const handleSave = () => {
        if (!formData.name) {
            alert('Por favor, completa el Nick.');
            return;
        }

        if (editingUser) {
            updateUser({ ...editingUser, name: formData.name, discordId: formData.discordId, role: formData.role });
        }
        resetForm();
    };
    
    const startEdit = (user: User) => {
        setEditingUser(user);
        setFormData({ name: user.name, discordId: user.discordId || '', role: user.role });
        setIsFormVisible(true);
    };

    const resetForm = () => {
        setIsFormVisible(false);
        setEditingUser(null);
        setFormData({ name: '', discordId: '', role: Role.Escudero });
    };

    const Form = () => {
        if (!currentUser) return null;

        const availableRoles = Object.values(Role).filter(role => 
            ROLE_HIERARCHY[role] < ROLE_HIERARCHY[currentUser.role]
        );

        return (
            <Card className="bg-slate-100/50 mt-4">
                <h4 className="text-lg font-bold mb-4 text-amber-600">Editando Miembro</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Nick en el juego" className="bg-white border border-slate-300 rounded p-2 text-slate-800" />
                    <input type="text" name="discordId" value={formData.discordId} onChange={handleInputChange} placeholder="ID de Discord (ej: user#1234)" className="bg-white border border-slate-300 rounded p-2 text-slate-800" />
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        className="bg-white border border-slate-300 rounded p-2 text-slate-800"
                    >
                         {availableRoles.map(role => (
                            <option key={role} value={role}>{role}</option>
                         ))}
                    </select>
                </div>
                <div className="flex gap-4 mt-4">
                    <button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded">Guardar Cambios</button>
                    <button onClick={resetForm} className="bg-slate-500 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded">Cancelar</button>
                </div>
            </Card>
        );
    };

    const PaginationControls = () => {
        if (totalPages <= 1) return null;

        return (
            <div className="flex justify-center items-center gap-4 mt-6">
                <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-sm font-medium text-slate-700 bg-white rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Anterior
                </button>
                <span className="text-sm font-semibold text-slate-500">
                    Página {currentPage} de {totalPages}
                </span>
                <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 text-sm font-medium text-slate-700 bg-white rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Siguiente
                </button>
            </div>
        );
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                    <h3 className="text-xl font-bold text-slate-800">Gestionar Plana Mayor</h3>
                    <p className="text-slate-500 mt-1">Edita los perfiles y roles de los miembros registrados.</p>
                </div>
            </div>

            {isFormVisible && <Form />}

            {loading && <p className="mt-4 text-center">Cargando miembros...</p>}

            {error && (
                 <div className="mt-4 p-4 text-center bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    <h3 className="font-bold">Error de Permisos</h3>
                    <p>{error}</p>
                </div>
            )}

            {!loading && !error && (
                <>
                    <div className="mt-4 space-y-2 max-h-[60vh] overflow-y-auto pr-2">
                        {paginatedUsers.map(user => {
                    const isCurrentUser = currentUser?.uid === user.uid;
                    let canEdit = false;
                    let canDelete = false;
                    
                    if (currentUser && !isCurrentUser) {
                        canDelete = currentUser.role === Role.Commander;
                        canEdit = ROLE_HIERARCHY[currentUser.role] > ROLE_HIERARCHY[user.role];
                    }

                    return (
                        <div key={user.uid} className="bg-slate-100 p-3 rounded-lg flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center gap-3">
                                <div>
                                    <p className="font-semibold">{user.name} <span className="text-xs text-slate-500">({user.email})</span></p>
                                    <p className="text-xs text-slate-500">Discord: {user.discordId || 'N/A'}</p>
                                </div>
                            </div>
                             <div className="flex items-center gap-4">
                                <span className={`text-sm font-medium ml-2 px-2.5 py-1 rounded-full ${
                                    user.role === Role.Commander ? 'bg-amber-500 text-slate-900' : 
                                    user.role === Role.Oficial ? 'bg-emerald-500 text-white' :
                                    user.role === Role.Capitan ? 'bg-teal-500 text-white' :
                                    user.role === Role.SargentoDeLevas ? 'bg-cyan-500 text-white' :
                                    user.role === Role.Knight ? 'bg-sky-500 text-white' :
                                    'bg-slate-500 text-white'}`}>{user.role}</span>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => startEdit(user)} 
                                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-1 px-3 rounded disabled:bg-slate-400 disabled:cursor-not-allowed"
                                        disabled={!canEdit}
                                        title={!canEdit ? "No tienes permiso para editar este miembro" : "Editar miembro"}
                                    >
                                        Editar
                                    </button>
                                    <button 
                                        onClick={() => removeUser(user.uid)} 
                                        className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-1 px-3 rounded disabled:bg-slate-400 disabled:cursor-not-allowed"
                                        disabled={!canDelete}
                                        title={isCurrentUser ? "No puedes eliminarte a ti mismo" : !canDelete ? "No tienes permisos para eliminar" : "Eliminar miembro"}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
                        })}
                    </div>
                    <PaginationControls />
                </>
            )}
        </div>
    );
};

export default StaffManager;