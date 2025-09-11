import React from 'react';

// FIX: Extend CardProps with React.HTMLAttributes<HTMLDivElement> to allow passing standard div props like onDragOver.
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
    return (
        <div className={`bg-white border border-slate-200 rounded-lg shadow-lg p-4 sm:p-6 ${className}`} {...props}>
            {children}
        </div>
    );
};

export default Card;