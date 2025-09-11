import React from 'react';

interface SectionHeaderProps {
    title: string;
    description?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, description }) => {
    return (
        <div className="mb-6 pb-2 border-b-2 border-slate-200">
            <h2 className="text-2xl sm:text-3xl font-bold text-amber-600">{title}</h2>
            {description && <p className="text-slate-500 mt-1">{description}</p>}
        </div>
    );
};

export default SectionHeader;