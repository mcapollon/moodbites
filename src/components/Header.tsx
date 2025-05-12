import React from 'react';
import { UtensilsCrossed } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <UtensilsCrossed size={24} />
          <h1 className="text-xl font-bold">MoodBites</h1>
        </div>
        <div className="text-sm">Recipes for Your Mood</div>
      </div>
    </header>
  );
};

export default Header;