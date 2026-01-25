'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, LayoutGrid, Bot, PhoneCall, FileText, HelpCircle, Menu, Sparkles, MousePointer2 } from 'lucide-react';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  target: string;
  hash?: string; // URL hash to navigate to
  icon: React.ReactNode;
  mobileDescription?: string;
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to your Dashboard',
    description: 'Let\'s take a quick tour! You\'ll navigate between sections using the sidebar on the left. Hover to expand it and click to switch views.',
    target: 'center',
    icon: <Sparkles className="w-6 h-6" />,
  },
  {
    id: 'overview',
    title: 'Overview',
    description: 'Click here to see your home base. View and edit your business details, see call statistics, and monitor performance at a glance.',
    mobileDescription: 'Tap the menu icon to access navigation. The Overview tab shows your business details and stats.',
    target: 'sidebar-overview',
    hash: '#overview',
    icon: <LayoutGrid className="w-6 h-6" />,
  },
  {
    id: 'agent',
    title: 'Voice Agent',
    description: 'Click here to configure your AI voice agent. Customize greetings, set the system prompt, and connect tools like Google Calendar.',
    mobileDescription: 'The Agent tab lets you configure how your AI assistant behaves on calls.',
    target: 'sidebar-agent',
    hash: '#agent',
    icon: <Bot className="w-6 h-6" />,
  },
  {
    id: 'calls',
    title: 'Call History',
    description: 'Click here to view your complete call history and read full transcripts of conversations with your agent.',
    mobileDescription: 'The Calls tab shows your call history with full conversation transcripts.',
    target: 'sidebar-calls',
    hash: '#calls',
    icon: <PhoneCall className="w-6 h-6" />,
  },
  {
    id: 'documents',
    title: 'Knowledge Base',
    description: 'Click here to upload documents like PDFs and text files to help your agent answer customer questions.',
    mobileDescription: 'Upload PDFs and documents to train your agent on your business.',
    target: 'sidebar-documents',
    hash: '#documents',
    icon: <FileText className="w-6 h-6" />,
  },
];

interface BusinessTutorialProps {
  businessId: number;
  isOpen: boolean;
  onClose: () => void;
}

export function BusinessTutorial({ businessId, isOpen, onClose }: BusinessTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const step = tutorialSteps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === tutorialSteps.length - 1;

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Navigate to tab when step changes
  useEffect(() => {
    if (isOpen && step.hash) {
      window.history.pushState(null, '', step.hash);
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    }
  }, [isOpen, step.hash, currentStep]);

  // Find and highlight target element
  const updateTargetRect = useCallback(() => {
    if (!step || step.target === 'center' || isMobile) {
      setTargetRect(null);
      return;
    }

    // Map tutorial targets to actual elements
    const targetMap: Record<string, string> = {
      'sidebar-overview': '[data-tutorial="overview"]',
      'sidebar-agent': '[data-tutorial="agent"]',
      'sidebar-calls': '[data-tutorial="calls"]',
      'sidebar-documents': '[data-tutorial="documents"]',
    };

    const selector = targetMap[step.target] || step.target;
    const element = document.querySelector(selector);

    if (element) {
      const rect = element.getBoundingClientRect();
      setTargetRect(rect);
    }
  }, [step, isMobile]);

  useEffect(() => {
    if (isOpen) {
      // Small delay to let navigation happen first
      const timer = setTimeout(updateTargetRect, 100);
      window.addEventListener('resize', updateTargetRect);
      window.addEventListener('scroll', updateTargetRect);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', updateTargetRect);
        window.removeEventListener('scroll', updateTargetRect);
      };
    }
  }, [isOpen, currentStep, updateTargetRect]);

  const handleNext = () => {
    if (isLastStep) {
      handleComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem(`tutorial-completed-${businessId}`, 'true');
    setCurrentStep(0);
    // Navigate back to overview when done
    window.history.pushState(null, '', '#overview');
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    onClose();
  };

  const handleSkip = () => {
    localStorage.setItem(`tutorial-completed-${businessId}`, 'true');
    setCurrentStep(0);
    onClose();
  };

  // Get description based on device
  const getDescription = () => {
    if (isMobile && step.mobileDescription) {
      return step.mobileDescription;
    }
    return step.description;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100]">
          {/* Dark overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/75"
          />

          {/* Spotlight highlight for sidebar item */}
          {targetRect && step.target !== 'center' && !isMobile && (
            <>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute z-[101] pointer-events-none"
                style={{
                  top: targetRect.top - 6,
                  left: targetRect.left - 6,
                  width: targetRect.width + 12,
                  height: targetRect.height + 12,
                }}
              >
                {/* Glowing ring */}
                <div className="absolute inset-0 rounded-xl bg-white/10 ring-2 ring-[#8B6F47] shadow-[0_0_20px_rgba(139,111,71,0.5)]" />
                {/* Pulsing animation */}
                <motion.div
                  className="absolute inset-0 rounded-xl ring-2 ring-[#8B6F47]"
                  animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </motion.div>

              {/* Animated cursor clicking on sidebar item */}
              <motion.div
                className="absolute z-[103] pointer-events-none"
                initial={{ opacity: 0, x: 50, y: 50 }}
                animate={{
                  opacity: [0, 1, 1, 1, 0],
                  x: [50, 0, 0, 0, 0],
                  y: [50, 0, 0, -2, 0],
                  scale: [1, 1, 0.9, 1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 0.5,
                  times: [0, 0.3, 0.5, 0.6, 1],
                }}
                style={{
                  top: targetRect.top + targetRect.height / 2 - 8,
                  left: targetRect.left + targetRect.width + 8,
                }}
              >
                <div className="relative">
                  <MousePointer2 className="w-6 h-6 text-[#8B6F47] drop-shadow-lg" fill="#8B6F47" />
                  {/* Click ripple effect */}
                  <motion.div
                    className="absolute -top-1 -left-1 w-8 h-8 rounded-full bg-[#8B6F47]/30"
                    animate={{
                      scale: [0, 1.5, 0],
                      opacity: [0, 0.5, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 0.5,
                      times: [0.5, 0.7, 1],
                    }}
                  />
                </div>
              </motion.div>
            </>
          )}

          {/* Tutorial Card - Centered */}
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <motion.div
              key={step.id}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="relative z-[102] w-full max-w-lg"
            >
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#8B6F47] to-[#A67A5B] px-6 py-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white">
                        {step.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                        <p className="text-white/60 text-sm">Step {currentStep + 1} of {tutorialSteps.length}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleSkip}
                      className="w-9 h-9 rounded-lg hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="px-6 py-5">
                  <p className="text-base text-[#5D4E37] leading-relaxed">{getDescription()}</p>
                  {isMobile && step.target !== 'center' && (
                    <div className="mt-4 flex items-center gap-2 text-sm text-[#8B7355] bg-[#F5F0E8] rounded-lg px-4 py-3">
                      <Menu className="w-5 h-5 flex-shrink-0" />
                      <span>Use the menu button in the top-left to navigate</span>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-[#FAF8F5] border-t border-[#E8DCC8]/50 flex items-center justify-between">
                  {/* Progress dots */}
                  <div className="flex items-center gap-2">
                    {tutorialSteps.map((_, idx) => (
                      <div
                        key={idx}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                          idx === currentStep
                            ? 'bg-[#8B6F47] scale-110'
                            : idx < currentStep
                              ? 'bg-[#8B6F47]/50'
                              : 'bg-[#E8DCC8]'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Navigation */}
                  <div className="flex items-center gap-3">
                    {!isFirstStep && (
                      <button
                        onClick={handlePrev}
                        className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-[#8B7355] hover:text-[#5D4E37] hover:bg-[#F5F0E8] rounded-lg transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Back
                      </button>
                    )}
                    {isFirstStep && (
                      <button
                        onClick={handleSkip}
                        className="px-4 py-2 text-sm font-medium text-[#8B7355] hover:text-[#5D4E37] hover:bg-[#F5F0E8] rounded-lg transition-colors"
                      >
                        Skip tour
                      </button>
                    )}
                    <button
                      onClick={handleNext}
                      className="flex items-center gap-1.5 px-5 py-2 bg-gradient-to-r from-[#8B6F47] to-[#A67A5B] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity shadow-sm"
                    >
                      {isLastStep ? 'Get started' : 'Next'}
                      {!isLastStep && <ChevronRight className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

// Helper button to show in header
export function TutorialHelpButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-9 h-9 rounded-xl bg-white border border-[#E8DCC8]/50 flex items-center justify-center text-[#8B7355] hover:text-[#5D4E37] hover:border-[#8B6F47]/30 transition-all"
      title="Show tutorial"
    >
      <HelpCircle className="w-4 h-4" />
    </button>
  );
}

// Hook to manage tutorial state
export function useTutorial(businessId: number) {
  const [showTutorial, setShowTutorial] = useState(false);
  const [hasCheckedStorage, setHasCheckedStorage] = useState(false);

  useEffect(() => {
    // Check if tutorial has been completed
    const completed = localStorage.getItem(`tutorial-completed-${businessId}`);
    if (!completed) {
      // Small delay to let page render first
      const timer = setTimeout(() => {
        setShowTutorial(true);
      }, 800);
      return () => clearTimeout(timer);
    }
    setHasCheckedStorage(true);
  }, [businessId]);

  const openTutorial = () => setShowTutorial(true);
  const closeTutorial = () => setShowTutorial(false);

  return {
    showTutorial,
    openTutorial,
    closeTutorial,
    hasCheckedStorage,
  };
}
