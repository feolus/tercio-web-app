import React from 'react';

interface ToggleSwitchProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    labelOn?: string;
    labelOff?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ label, checked, onChange, labelOn = 'Sí', labelOff = 'No' }) => {
    return (
        <label className="flex items-center justify-between cursor-pointer w-full">
            <span className="text-sm font-medium text-slate-600">{label}</span>
            <div className="relative">
                <input type="checkbox" className="sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
                <div className={`block w-14 h-8 rounded-full transition-colors ${checked ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${checked ? 'transform translate-x-full' : ''}`}></div>
            </div>
        </label>
    );
};

export default ToggleSwitch;