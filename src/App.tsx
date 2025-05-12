import React from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import Layout from './components/Layout';
import FacialAnalysis from './components/FacialAnalysis';
import VoiceAnalysis from './components/VoiceAnalysis';
import TextInput from './components/TextInput';
import RecipeRecommendation from './components/RecipeRecommendation';
import SavedRecipes from './components/SavedRecipes';
import './index.css';

const AppContent: React.FC = () => {
  const { currentStep } = useAppContext();
  
  return (
    <Layout>
      {currentStep === 'facial' && <FacialAnalysis />}
      {currentStep === 'voice' && <VoiceAnalysis />}
      {currentStep === 'text' && <TextInput />}
      {currentStep === 'recipe' && (
        <div className="space-y-8">
          <RecipeRecommendation />
          <SavedRecipes />
        </div>
      )}
    </Layout>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;