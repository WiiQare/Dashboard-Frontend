import { useStepContext } from '@/context/StepContext';
import React, { useEffect } from 'react';

const Stepper: React.FC = () => {
  const { activeStepIndex } = useStepContext();

  useEffect(() => {
    const stepperItems = document.querySelectorAll('.stepper-item');
    stepperItems.forEach((step: any, i) => {
      if (i <= activeStepIndex) {
        step.classList.add('bg-primary', 'text-white');

        if (i < activeStepIndex)
          step?.nextSibling?.classList?.add('border-primary');
      } else {
        step.classList.remove('bg-primary', 'text-white');
      }
    });
  }, [activeStepIndex]);

  return (
    <div className="w-full md:w-2/3 flex flex-row items-center justify-center py-4 mb-14 md:mb-16">
      <div className="flex flex-col relative">
        <div className="stepper-item flex items-center justify-center w-12 h-12 text-center font-medium border-2 rounded-full">
          1
        </div>
        <span className="absolute -bottom-6 text-xs w-max md:-left-8">
          Identité <span className="hidden md:inline">du beneficiare</span>{' '}
        </span>
      </div>

      <div className="flex-auto border-t-2"></div>

      <div className="flex flex-col relative">
        <div className="stepper-item flex items-center justify-center w-12 h-12 text-center font-medium border-2 rounded-full">
          2
        </div>
        <span className="absolute -bottom-6 text-xs w-max md:-left-8">
          Montant <span className="hidden md:inline">du pass santé</span>{' '}
        </span>
      </div>
      <div className="flex-auto border-t-2"></div>
      <div className="flex flex-col relative">
        <div className="stepper-item flex items-center justify-center w-12 h-12 text-center font-medium border-2 rounded-full">
          3
        </div>
        <span className="absolute -bottom-6 text-xs w-max md:-left-8">
          Généré le <span className="hidden md:inline">Pass Santé </span>{' '}
        </span>
      </div>
    </div>
  );
};

export default Stepper;
