import React from 'react';
import { Troop, UserTroop } from '../types';
import Card from './common/Card';
import ToggleSwitch from './common/ToggleSwitch';

interface TroopCardProps {
    troop: Troop;
    userTroop?: UserTroop;
    onUpdate: (troopId: string, updatedData: Partial<UserTroop>) => void;
    onRemove: (troopId: string) => void;
}

const getTierColor = (tier: number, type: 'text' | 'border' | 'bg') => {
    const colors = {
        5: 'amber-400',
        4: 'purple-500',
        3: 'sky-500',
        2: 'emerald-500',
        1: 'slate-400',
    };
    const color = colors[tier as keyof typeof colors] || 'slate-600';
    switch(type) {
        case 'text': return `text-${color}`;
        case 'border': return `border-${color}`;
        case 'bg': return `bg-${color}`;
    }
};

const TroopCard: React.FC<TroopCardProps> = ({ troop, userTroop, onUpdate, onRemove }) => {
    const isOwned = !!userTroop;

    const leadershipWithDoctrine = userTroop?.leadershipDoctrine 
        ? Math.floor(troop.leadership * 0.84) 
        : troop.leadership;

    const handleToggleOwned = (owned: boolean) => {
        if(owned) {
            onUpdate(troop.id, {});
        } else {
            onRemove(troop.id);
        }
    }

    return (
        <Card className="flex flex-col transition-all duration-200">
            <div className="flex items-start gap-4 mb-4">
                <img src={troop.imageUrl} alt={troop.name} className={`w-20 h-20 rounded-lg object-cover border-4 ${getTierColor(troop.tier, 'border')}`} />
                <div className="flex-1">
                    <h3 className="font-bold text-lg text-slate-900">{troop.name}</h3>
                    <p className={`${getTierColor(troop.tier, 'text')} font-semibold`}>Tier {troop.tier}</p>
                    <p className="text-sm text-slate-500">
                        Liderazgo: 
                        <span className={`font-bold ml-1 ${userTroop?.leadershipDoctrine ? 'text-emerald-400' : 'text-slate-700'}`}>
                           {leadershipWithDoctrine}
                        </span>
                        {userTroop?.leadershipDoctrine && <span className="text-slate-500 line-through ml-1">{troop.leadership}</span>}
                    </p>
                </div>
                <div className="flex flex-col items-end">
                    <label className="flex items-center cursor-pointer">
                        <span className="mr-2 text-sm font-medium">{isOwned ? 'Obtenida' : 'No Obtenida'}</span>
                        <div className="relative">
                            <input type="checkbox" className="sr-only" checked={isOwned} onChange={(e) => handleToggleOwned(e.target.checked)} />
                            <div className={`block w-10 h-6 rounded-full transition-colors ${isOwned ? 'bg-amber-500' : 'bg-slate-300'}`}></div>
                            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isOwned ? 'transform translate-x-full' : ''}`}></div>
                        </div>
                    </label>
                </div>
            </div>
            
            {isOwned && (
                <div className="space-y-3 pt-4 border-t border-slate-200">
                    <ToggleSwitch 
                        label="Maestría"
                        checked={userTroop.mastery}
                        onChange={(c) => onUpdate(troop.id, { mastery: c })}
                    />
                     <ToggleSwitch 
                        label="Doctrina de Liderazgo"
                        checked={userTroop.leadershipDoctrine}
                        onChange={(c) => onUpdate(troop.id, { leadershipDoctrine: c })}
                    />
                     <ToggleSwitch 
                        label="Favorita"
                        checked={userTroop.isFavorite}
                        onChange={(c) => onUpdate(troop.id, { isFavorite: c })}
                    />
                     <ToggleSwitch 
                        label="Nivel Máximo"
                        checked={userTroop.isMaxLevel}
                        onChange={(c) => onUpdate(troop.id, { isMaxLevel: c })}
                    />
                </div>
            )}
        </Card>
    );
};

export default TroopCard;