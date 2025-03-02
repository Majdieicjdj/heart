import React, { useState } from 'react';
import Header from './components/Header';
import ProgressBar from './components/ProgressBar';
import { FormData, AnalysisResult } from './types';
import { analyzeFormData } from './utils';

// Form Steps
import PersonalInfo from './components/FormSteps/PersonalInfo';
import MedicalHistory from './components/FormSteps/MedicalHistory';
import LifestyleHabits from './components/FormSteps/LifestyleHabits';
import Symptoms from './components/FormSteps/Symptoms';
import VitalSigns from './components/FormSteps/VitalSigns';
import DoctorReports from './components/FormSteps/DoctorReports';

// Results Components
import RiskIndicator from './components/ResultsPage/RiskIndicator';
import AnalysisGraph from './components/ResultsPage/AnalysisGraph';
import FilePreview from './components/ResultsPage/FilePreview';
import SummaryCard from './components/ResultsPage/SummaryCard';
import Recommendations from './components/ResultsPage/Recommendations';

import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, HeartPulse, RefreshCw } from 'lucide-react';

const STEPS = [
  'Personal Info',
  'Medical History',
  'Lifestyle',
  'Symptoms',
  'Vital Signs',
  'Doctor Reports',
];

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    // Personal Information
    name: '',
    age: '',
    gender: '',
    email: '',
    phone: '',
    
    // Medical History
    hasHeartDisease: '',
    hasFamilyHistory: '',
    hasDiabetes: '',
    hasHypertension: '',
    hasHighCholesterol: '',
    hasPreviousSurgeries: '',
    
    // Lifestyle & Habits
    isSmoker: '',
    consumesAlcohol: '',
    exerciseFrequency: '',
    dietType: '',
    
    // Symptoms
    hasChestPain: '',
    chestPainSeverity: 5,
    hasShortnessOfBreath: '',
    hasFatigue: '',
    hasDizziness: '',
    hasSwelling: '',
    
    // Vital Signs & Test Results
    systolicBP: '',
    diastolicBP: '',
    cholesterolLevel: '',
    bloodSugar: '',
    restingHeartRate: '',
    bmi: '',
    ecgImage: null,
    echoImage: null,
    
    // Doctor Reports
    doctorReports: [],
  });

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      submitForm();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const submitForm = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const result = analyzeFormData(formData);
      setAnalysisResult(result);
      setShowResults(true);
      setIsLoading(false);
    }, 2000);
  };

  const resetForm = () => {
    setShowResults(false);
    setCurrentStep(0);
  };

  const renderFormStep = () => {
    switch (currentStep) {
      case 0:
        return <PersonalInfo formData={formData} updateFormData={updateFormData} />;
      case 1:
        return <MedicalHistory formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <LifestyleHabits formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <Symptoms formData={formData} updateFormData={updateFormData} />;
      case 4:
        return <VitalSigns formData={formData} updateFormData={updateFormData} />;
      case 5:
        return <DoctorReports formData={formData} updateFormData={updateFormData} />;
      default:
        return null;
    }
  };

  const renderResults = () => {
    if (!analysisResult) return null;
    
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="card flex flex-col items-center">
              <RiskIndicator 
                percentage={analysisResult.riskPercentage} 
                riskLevel={analysisResult.riskLevel} 
              />
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <div className="card h-full">
              <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
                Health Metrics Analysis
              </h2>
              <AnalysisGraph data={analysisResult.graphData} />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <SummaryCard formData={formData} />
            
            <div className="mt-6">
              <button
                type="button"
                onClick={resetForm}
                className="btn btn-outline w-full flex items-center justify-center"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Start New Assessment
              </button>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <Recommendations 
              recommendations={analysisResult.recommendations} 
              keyFactors={analysisResult.keyFactors} 
            />
            
            {(formData.ecgImage || formData.echoImage) && (
              <FilePreview 
                files={[formData.ecgImage, formData.echoImage].filter(Boolean) as File[]} 
                title="Medical Images" 
              />
            )}
            
            {formData.doctorReports.length > 0 && (
              <FilePreview 
                files={formData.doctorReports} 
                title="Doctor Reports" 
              />
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-secondary-900 transition-colors duration-200">
      <Header />
      
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {!showResults ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6 flex items-center justify-center">
                <HeartPulse className="h-10 w-10 text-primary-600 mr-3" />
                <h1 className="text-2xl sm:text-3xl font-display font-bold text-secondary-900 dark:text-white">
                  Heart Disease Risk Assessment
                </h1>
              </div>
              
              <div className="card">
                <ProgressBar 
                  currentStep={currentStep} 
                  totalSteps={STEPS.length} 
                  labels={STEPS} 
                />
                
                <form>
                  {renderFormStep()}
                  
                  <div className="mt-8 flex justify-between">
                    <button
                      type="button"
                      onClick={prevStep}
                      disabled={currentStep === 0}
                      className="btn btn-outline flex items-center"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Previous
                    </button>
                    
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={isLoading}
                      className="btn btn-primary flex items-center"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : currentStep === STEPS.length - 1 ? (
                        <>
                          Submit
                          <HeartPulse className="h-4 w-4 ml-2" />
                        </>
                      ) : (
                        <>
                          Next
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6 flex items-center justify-center">
                <HeartPulse className="h-10 w-10 text-primary-600 mr-3" />
                <h1 className="text-2xl sm:text-3xl font-display font-bold text-secondary-900 dark:text-white">
                  Your Heart Health Results
                </h1>
              </div>
              
              {renderResults()}
            </motion.div>
          )}
        </div>
      </main>
      
      <footer className="py-6 px-4 sm:px-6 lg:px-8 border-t border-secondary-200 dark:border-secondary-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-secondary-600 dark:text-secondary-400">
            © 2025 HeartGuard. All rights reserved.
          </p>
          <p className="text-sm text-secondary-500 dark:text-secondary-500 mt-2 sm:mt-0">
            This tool is for informational purposes only and not a substitute for medical advice.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;