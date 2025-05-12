import React from 'react';
import Header from './Header';
import ProgressStepper from './ui/ProgressStepper';
import { useAppContext } from '../context/AppContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentStep } = useAppContext();
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <ProgressStepper />
        </div>
        
        <div className="mt-8">
          {children}
        </div>
      </main>
      
      <footer className="bg-gray-100 py-4 border-t border-gray-200">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} MoodBites. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;