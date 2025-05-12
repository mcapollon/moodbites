import React from 'react';
import { Check, AlertCircle } from 'lucide-react';
import { AnalysisStep } from '../../types';
import { useAppContext } from '../../context/AppContext';

interface StepData {
  id: AnalysisStep;
  label: string;
  description: string;
  optional?: boolean;
}

const ProgressStepper: React.FC = () => {
  const { currentStep, completedSteps } = useAppContext();
  
  const steps: StepData[] = [
    {
      id: 'facial',
      label: 'Facial Analysis',
      description: 'Analyze your facial expression',
    },
    {
      id: 'voice',
      label: 'Voice Analysis',
      description: 'Analyze your voice patterns',
      optional: true,
    },
    {
      id: 'text',
      label: 'Text Input',
      description: 'Tell us how you feel',
      optional: true,
    },
    {
      id: 'recipe',
      label: 'Recipe',
      description: 'Get your personalized recipe',
    },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = currentStep === step.id;
          const isUpcoming = !isCompleted && !isCurrent;
          
          return (
            <React.Fragment key={step.id}>
              {/* Step indicator */}
              <div className="relative flex flex-col items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-200 ${
                    isCompleted
                      ? 'bg-teal-600 text-white'
                      : isCurrent
                      ? 'bg-teal-100 border-2 border-teal-600 text-teal-600'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {isCompleted ? (
                    <Check size={18} />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <div className="mt-2 text-sm font-medium text-center">
                  <div className={isCurrent ? 'text-teal-600' : isUpcoming ? 'text-gray-500' : 'text-gray-700'}>
                    {step.label}
                    {step.optional && <span className="ml-1 text-xs text-gray-400">(Optional)</span>}
                  </div>
                  <div className="hidden md:block text-xs text-gray-500 mt-1 max-w-[120px] text-center">
                    {step.description}
                  </div>
                </div>
              </div>
              
              {/* Line connecting steps */}
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 transition-colors duration-200 ${
                    completedSteps.includes(steps[index + 1].id) || currentStep === steps[index + 1].id
                      ? 'bg-teal-600'
                      : 'bg-gray-200'
                  }`}
                ></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressStepper;