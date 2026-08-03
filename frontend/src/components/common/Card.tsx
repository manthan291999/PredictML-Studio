import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hoverable = false, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`glass-panel rounded-2xl overflow-hidden ${hoverable ? 'glass-panel-hover cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  title: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ title, icon, action, className = '' }) => {
  return (
    <div className={`px-6 py-4 border-b border-slate-200/60 bg-slate-50/40 flex items-center justify-between ${className}`}>
      <h3 className="font-semibold text-slate-800 flex items-center tracking-tight text-sm md:text-base">
        {icon && <span className="mr-2.5 flex items-center">{icon}</span>}
        {title}
      </h3>
      {action && <div className="flex items-center">{action}</div>}
    </div>
  );
};

export const CardBody: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  return <div className={`p-5 md:p-6 ${className}`}>{children}</div>;
};
