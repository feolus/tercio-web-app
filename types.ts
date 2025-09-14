export enum Role {
    Commander = 'Comandante',
    Oficial = 'Oficial',
    Capitan = 'Capitán',
    SargentoDeLevas = 'Sargento de Levas',
    Knight = 'Caballero',
    Escudero = 'Escudero',
}

export interface UserTroop {
    troopId: string;
    mastery: boolean;
    leadershipDoctrine: boolean;
    isFavorite: boolean;
    isMaxLevel: boolean;
}

export interface UserWeapon {
    weaponId: string;
    leadership: number;
    epicWeaponBlueprint: boolean;
    epicArmorBlueprint: boolean;
    reforgedArmor: boolean;
    isFavorite: boolean;
}

export interface User {
    uid: string;
    email: string;
    name: string;
    discordId?: string;
    role: Role;
    troops: UserTroop[];
    weapons: UserWeapon[];
}

export interface Troop {
    id: string;
    name: string;
    tier: number;
    leadership: number;
    imageUrl: string;
}

export interface Weapon {
    id: string;
    name: string;
    imageUrl: string;
}

export interface Artillery {
    id: string;
    name: string;
    imageUrl: string;
}

export interface BattleKnight {
    userId: string;
    selectedTroops: string[];
    selectedWeaponId?: string;
}

export interface BattleGroup {
    id:string;
    task: string;
    knights: BattleKnight[];
    artilleryIds?: string[];
}

export interface BattlePlan {
    id: string;
    name: string;
    date: string;
    groups: BattleGroup[];
    selectedKnights: string[];
    status: 'planning' | 'completed';
}

export interface NobilityTitle {
    id: string;
    name: string;
}

export interface Season {
    id: string;
    name: string;
    startDate: string;
    isActive: boolean;
}

export interface TitleAssignment {
    id: string;
    seasonId: string;
    weekNumber: number;
    userId: string;
    titleId: string | null;
}