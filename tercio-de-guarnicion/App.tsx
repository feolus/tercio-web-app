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
import { INITIAL_TROOPS, INITIAL_WEAPONS, INITIAL_ARTILLERY, INITIAL_NOBILITY_TITLES } from './constants';

const MainApp: React.FC = () => {
    const { currentUser } = useContext(UserContext);
    const { logout } = useAuth();

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
        // FIX: Use Firebase v8 onSnapshot syntax.
        const unsubUsers = db.collection('users').onSnapshot((snapshot) => {
            setUsers(snapshot.docs.map(doc => doc.data() as User));
        });

        // FIX: Use Firebase v8 doc reference syntax.
        const masterDataRef = db.collection('masterData').doc('singleton');
        // FIX: Use Firebase v8 onSnapshot syntax.
        const unsubMasterData = masterDataRef.onSnapshot(async (docSnap) => {
            // FIX: Use Firebase v8 docSnap.exists property.
            if (docSnap.exists) {
                const data = docSnap.data();
                setMasterTroops(data.troops || []);
                setMasterWeapons(data.weapons || []);
                setMasterArtillery(data.artillery || []);
                setNobilityTitles(data.nobilityTitles || []);
                setSeasons(data.seasons || []);
            } else {
                // FIX: Use Firebase v8 set method.
                await masterDataRef.set({
                    troops: INITIAL_TROOPS,
                    weapons: INITIAL_WEAPONS,
                    artillery: INITIAL_ARTILLERY,
                    nobilityTitles: INITIAL_NOBILITY_TITLES,
                    seasons: []
                });
            }
        });

        // FIX: Use Firebase v8 onSnapshot syntax.
        const unsubBattlePlans = db.collection('battlePlans').onSnapshot((snapshot) => {
            setSavedBattlePlans(snapshot.docs.map(doc => doc.data() as BattlePlan));
        });

        // FIX: Use Firebase v8 onSnapshot syntax.
        const unsubAssignments = db.collection('titleAssignments').onSnapshot((snapshot) => {
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
                // FIX: Use Firebase v8 doc reference syntax.
                const userRef = db.collection("users").doc(authUser.uid);
                // FIX: Use Firebase v8 get method.
                const userSnap = await userRef.get();

                // FIX: Use Firebase v8 docSnap.exists property.
                if (userSnap.exists) {
                    setCurrentUser(userSnap.data() as User);
                } else {
                    // FIX: Use Firebase v8 get method and collection reference.
                    const isFirstUser = (await db.collection('users').get()).empty;
                    const newUser: User = {
                        uid: authUser.uid,
                        email: authUser.email!,
                        name: authUser.displayName || authUser.email!.split('@')[0],
                        role: isFirstUser ? Role.Commander : Role.Escudero,
                        troops: [],
                        weapons: [],
                    };
                    // FIX: Use Firebase v8 set method.
                    await userRef.set(newUser);
                    setCurrentUser(newUser);
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
        // FIX: Use Firebase v8 set method with merge option.
        await db.collection('users').doc(updatedUser.uid).set(updatedUser, { merge: true });
    };

    const removeUser = async (uid: string) => {
        if (window.confirm('¿Seguro que quieres eliminar a este usuario? Esta acción es irreversible.')) {
            // FIX: Use Firebase v8 delete method.
            await db.collection('users').doc(uid).delete();
        }
    };

    const updateMasterData = async (dataType: 'troops' | 'weapons' | 'artillery' | 'nobilityTitles' | 'seasons', data: any[]) => {
        // FIX: Use Firebase v8 update method.
        await db.collection('masterData').doc('singleton').update({ [dataType]: data });
    };

    const addBattlePlan = async (plan: BattlePlan) => {
        // FIX: Use Firebase v8 set method.
        await db.collection('battlePlans').doc(plan.id).set(plan);
    };

    const updateBattlePlan = async (plan: BattlePlan) => {
        await db.collection('battlePlans').doc(plan.id).set(plan, { merge: true });
    };

    const deleteBattlePlan = async (planId: string) => {
        // FIX: Use Firebase v8 delete method.
        await db.collection('battlePlans').doc(planId).delete();
    };

    const updateTitleAssignments = async (assignments: TitleAssignment[]) => {
        // FIX: Use Firebase v8 db.batch() method. This also resolves the "Cannot find name 'writeBatch'" error.
        const batch = db.batch();
        assignments.forEach(assignment => {
            // FIX: Use Firebase v8 doc reference syntax.
            const docRef = db.collection('titleAssignments').doc(assignment.id);
            batch.set(docRef, assignment);
        });
        await batch.commit();
    };

    const userContextValue: UserContextType = { users, currentUser, updateUser, removeUser };
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