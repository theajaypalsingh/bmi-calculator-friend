
import React from 'react';

interface PageHeaderProps {
  title: string;
  description: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description }) => {
  return (
    <div className="w-full bg-gray-700 mb-8">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white text-center">{title}</h1>
        <p className="text-center text-white/90 mt-2">{description}</p>
      </div>
    </div>
  );
};

export default PageHeader;
