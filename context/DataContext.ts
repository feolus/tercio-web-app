import { createContext } from 'react';
import { Troop, Weapon, Artillery, BattlePlan, NobilityTitle, Season, TitleAssignment, User } from '../types';

export interface DataContextType {
    allUsers: User[];
    masterTroops: Troop[];
    masterWeapons: Weapon[];
    masterArtillery: Artillery[];
    savedBattlePlans: BattlePlan[];
    activeWarOrderPlanId: string | null;
    nobilityTitles: NobilityTitle[];
    seasons: Season[];
    titleAssignments: TitleAssignment[];

    updateMasterData: (dataType: 'troops' | 'weapons' | 'artillery' | 'nobilityTitles' | 'seasons', data: any[]) => Promise<void>;
    addBattlePlan: (plan: BattlePlan) => Promise<void>;
    updateBattlePlan: (plan: BattlePlan) => Promise<void>;
    deleteBattlePlan: (planId: string) => Promise<void>;
    setActiveWarOrderPlanId: React.Dispatch<React.SetStateAction<string | null>>;
    updateTitleAssignments: (assignments: TitleAssignment[]) => Promise<void>;
}

export const DataContext = createContext<DataContextType>({} as DataContextType);