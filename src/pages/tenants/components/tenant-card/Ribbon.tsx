import React from 'react';

export default function Ribbon({
  priority,
  children,
}: {
  priority: string;
  children: React.ReactNode;
}) {
  const getRibbonClass = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return 'ribbon-custom ribbon-custom-critical';
      case 'IMPORTANT':
        return 'ribbon-custom ribbon-custom-important';
      default:
        return 'ribbon-custom';
    }
  };

  return (
    <div className={`${getRibbonClass(priority)} text-xl font-bold text-white`}>
      {children}
    </div>
  );
}
