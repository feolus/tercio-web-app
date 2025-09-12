import React, { useState, useEffect, ReactNode, useContext } from 'react';
import { useAuth } from './context/AuthContext';
import { DataContext, DataContextType } from './context/DataContext';
import { UserContext, UserContextType } from './context/UserContext';
import LoginView from './components/LoginView';
import CommanderView from './components/CommanderView';
import OfficerView from './components/OfficerView';
import KnightView from './components/KnightView';
import CapitanView from './components/CapitanView';
import DrillmasterView from './components/DrillmasterView';
import EscuderoView from './components/EscuderoView';
import { Role, User, Troop, Weapon, Artillery, BattlePlan, NobilityTitle, Season, TitleAssignment } from './types';
import { db } from './firebase';
import {
    collection,
    onSnapshot,
    doc,
    setDoc,
    getDoc,
    getDocs,
    deleteDoc,
    updateDoc,
    writeBatch,
} from 'firebase/firestore';
import { INITIAL_TROOPS, INITIAL_WEAPONS, INITIAL_ARTILLERY, INITIAL_NOBILITY_TITLES } from './constants';

const MainApp: React.FC = () => {
    const { currentUser, error } = useContext(UserContext);
    const { logout } = useAuth();

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen text-center">
                <h2 className="text-2xl font-bold text-red-600 mb-4">Ha ocurrido un error</h2>
                <p className="text-slate-700 mb-2">No se pudo cargar el perfil del usuario. Este es el error:</p>
                <code className="bg-slate-200 text-red-700 p-4 rounded-md text-sm">{error}</code>
                <p className="mt-4 text-slate-500">Por favor, verifica tu configuración de Firebase y las reglas de seguridad de Firestore.</p>
            </div>
        );
    }

    if (!currentUser) {
        return <div className="flex items-center justify-center h-screen"><p>Cargando datos del usuario...</p></div>;
    }

    const renderViewByRole = () => {
        switch (currentUser.role) {
            case Role.Commander: return <CommanderView />;
            case Role.Oficial: return <OfficerView />;
            case Role.Capitan: return <CapitanView />;
            case Role.SargentoDeLevas: return <DrillmasterView />;
            case Role.Knight: return <KnightView />;
            case Role.Escudero: return <EscuderoView />;
            default: return <div>Rol no reconocido.</div>;
        }
    };
    
    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <header className="flex justify-between items-center mb-6 flex-wrap gap-4">
                 <h1 className="text-3xl font-bold text-amber-600">Tercio de Guarnicion</h1>
                <div className='flex items-center gap-4'>
                    <span className="text-slate-600">Bienvenido, <span className="font-bold">{currentUser.name}</span> ({currentUser.role})</span>
                    <button onClick={logout} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg">
                        Cerrar Sesión
                    </button>
                </div>
            </header>
            <main>
                {renderViewByRole()}
            </main>
        </div>
    );
};

const App: React.FC = () => {
    const { authUser, loading } = useAuth();
    
    // User state
    const [users, setUsers] = useState<User[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Data state
    const [masterTroops, setMasterTroops] = useState<Troop[]>([]);
    const [masterWeapons, setMasterWeapons] = useState<Weapon[]>([]);
    const [masterArtillery, setMasterArtillery] = useState<Artillery[]>([]);
    const [savedBattlePlans, setSavedBattlePlans] = useState<BattlePlan[]>([]);
    const [activeWarOrderPlanId, setActiveWarOrderPlanId] = useState<string | null>(null);
    const [nobilityTitles, setNobilityTitles] = useState<NobilityTitle[]>([]);
    const [seasons, setSeasons] = useState<Season[]>([]);
    const [titleAssignments, setTitleAssignments] = useState<TitleAssignment[]>([]);

    // Firestore real-time listeners
    useEffect(() => {
        const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
            setUsers(snapshot.docs.map(doc => doc.data() as User));
        });

        const masterDataRef = doc(db, 'masterData', 'singleton');
        const unsubMasterData = onSnapshot(masterDataRef, async (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setMasterTroops(data.troops || []);
                setMasterWeapons(data.weapons || []);
                setMasterArtillery(data.artillery || []);
                setNobilityTitles(data.nobilityTitles || []);
                setSeasons(data.seasons || []);
            } else {
                await setDoc(masterDataRef, {
                    troops: INITIAL_TROOPS,
                    weapons: INITIAL_WEAPONS,
                    artillery: INITIAL_ARTILLERY,
                    nobilityTitles: INITIAL_NOBILITY_TITLES,
                    seasons: []
                });
            }
        });

        const unsubBattlePlans = onSnapshot(collection(db, 'battlePlans'), (snapshot) => {
            setSavedBattlePlans(snapshot.docs.map(doc => doc.data() as BattlePlan));
        });

        const unsubAssignments = onSnapshot(collection(db, 'titleAssignments'), (snapshot) => {
            setTitleAssignments(snapshot.docs.map(doc => doc.data() as TitleAssignment));
        });

        return () => {
            unsubUsers();
            unsubMasterData();
            unsubBattlePlans();
            unsubAssignments();
        };
    }, []);

    // Handle user session and profile creation
    useEffect(() => {
        const handleUserSession = async () => {
            if (authUser) {
                try {
                    const userRef = doc(db, "users", authUser.uid);
                    const userSnap = await getDoc(userRef);

                    if (userSnap.exists()) {
                        setCurrentUser(userSnap.data() as User);
                    } else {
                        const usersCollection = collection(db, 'users');
                        const isFirstUser = (await getDocs(usersCollection)).empty;
                        const newUser: User = {
                            uid: authUser.uid,
                            email: authUser.email!,
                            name: authUser.displayName || authUser.email!.split('@')[0],
                            role: isFirstUser ? Role.Commander : Role.Escudero,
                            troops: [],
                            weapons: [],
                        };
                        await setDoc(userRef, newUser);
                        setCurrentUser(newUser);
                    }
                } catch (err: any) {
                    console.error("Error handling user session:", err);
                    setError(`Error al cargar el perfil: ${err.message}`);
                }
            } else {
                setCurrentUser(null);
            }
        };
        if (!loading) {
            handleUserSession();
        }
    }, [authUser, loading]);

    // Firestore update functions
    const updateUser = async (updatedUser: User) => {
        await setDoc(doc(db, 'users', updatedUser.uid), updatedUser, { merge: true });
    };

    const removeUser = async (uid: string) => {
        if (window.confirm('¿Seguro que quieres eliminar a este usuario? Esta acción es irreversible.')) {
            await deleteDoc(doc(db, 'users', uid));
        }
    };

    const updateMasterData = async (dataType: 'troops' | 'weapons' | 'artillery' | 'nobilityTitles' | 'seasons', data: any[]) => {
        await updateDoc(doc(db, 'masterData', 'singleton'), { [dataType]: data });
    };

    const addBattlePlan = async (plan: BattlePlan) => {
        await setDoc(doc(db, 'battlePlans', plan.id), plan);
    };

    const updateBattlePlan = async (plan: BattlePlan) => {
        await setDoc(doc(db, 'battlePlans', plan.id), plan, { merge: true });
    };

    const deleteBattlePlan = async (planId: string) => {
        await deleteDoc(doc(db, 'battlePlans', planId));
    };

    const updateTitleAssignments = async (assignments: TitleAssignment[]) => {
        const batch = writeBatch(db);
        assignments.forEach(assignment => {
            const docRef = doc(db, 'titleAssignments', assignment.id);
            batch.set(docRef, assignment);
        });
        await batch.commit();
    };

    const userContextValue: UserContextType = { users, currentUser, error, updateUser, removeUser };
    const dataContextValue: DataContextType = {
        masterTroops, masterWeapons, masterArtillery, savedBattlePlans,
        activeWarOrderPlanId, nobilityTitles, seasons, titleAssignments,
        updateMasterData, addBattlePlan, updateBattlePlan, deleteBattlePlan, setActiveWarOrderPlanId,
        updateTitleAssignments
    };

    if (loading) {
        return <div className="flex items-center justify-center h-screen"><p>Autenticando...</p></div>;
    }

    return (
        <DataContext.Provider value={dataContextValue}>
            <UserContext.Provider value={userContextValue}>
                {authUser ? <MainApp /> : <LoginView />}
            </UserContext.Provider>
        </DataContext.Provider>
    );
};

export default App;