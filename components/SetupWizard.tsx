'use client';

import { useState, useCallback, useEffect, ReactNode, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  MapPin,
  Phone,
  Bot,
  Plug,
  ArrowLeft,
  X,
  Sparkles,
  FileText,
  Loader2,
  Check,
  AlertCircle,
  PenLine,
  MessageCircle,
  LogOut
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { GlowButton } from '@/components/ui/glow-button';
import { AddressAutocomplete } from '@/components/AddressAutocomplete';
import { useApp } from '@/lib/context';
import { useCreateBusiness } from '@/lib/hooks/use-businesses';
import { useCreateAgent } from '@/lib/hooks/use-agents';

interface SetupWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (businessId: number) => void;
}

interface WizardData {
  businessName: string;
  businessEmail: string;
  address: string;
  areaCode: string;
  agentName: string;
  systemPrompt: string;
  greeting: string;
  goodbye: string;
  integrations: string[];
}

const initialData: WizardData = {
  businessName: '',
  businessEmail: '',
  address: '',
  areaCode: '',
  agentName: '',
  systemPrompt: '',
  greeting: 'Hello! Thank you for calling. How can I help you today?',
  goodbye: 'Thank you for calling. Have a great day!',
  integrations: [],
};

const steps = [
  { id: 1, title: 'Business' },
  { id: 2, title: 'Location' },
  { id: 3, title: 'Phone' },
  { id: 4, title: 'Agent' },
  { id: 5, title: 'Connect' },
  { id: 6, title: 'Review' },
];

const promptTemplates = [
  { name: 'Receptionist', emoji: '👋', prompt: 'You are a friendly and professional receptionist. Help callers with general inquiries, transfer calls to the appropriate department, and take messages when needed. Always maintain a warm and welcoming tone.' },
  { name: 'Scheduler', emoji: '📅', prompt: 'You are an efficient appointment scheduler. Help callers book, reschedule, or cancel appointments. Confirm all details including date, time, and purpose. Be courteous and ensure accuracy.' },
  { name: 'Support', emoji: '🛠️', prompt: 'You are a helpful customer support agent. Assist callers with questions about products or services, troubleshoot issues, and escalate complex problems when necessary. Be patient and solution-oriented.' },
];

const validateAreaCode = (code: string): { valid: boolean; message?: string } => {
  if (!code) return { valid: false, message: 'Area code is required' };
  if (!/^\d{3}$/.test(code)) return { valid: false, message: 'Enter a 3-digit area code' };
  if (code[0] === '0' || code[0] === '1') return { valid: false, message: 'Area codes cannot start with 0 or 1' };
  return { valid: true };
};

const integrations = [
  { id: 'google-calendar', name: 'Google Calendar', description: 'Schedule appointments and check availability' },
  { id: 'outlook-calendar', name: 'Outlook', description: 'Sync with Microsoft 365 calendar' },
  { id: 'google-drive', name: 'Google Drive', description: 'Access docs, FAQs, and files' },
  { id: 'notion', name: 'Notion', description: 'Pull from your workspace' },
  { id: 'dropbox', name: 'Dropbox', description: 'Access shared documents' },
  { id: 'custom-docs', name: 'Upload Files', description: 'PDFs, Word docs, text files' },
];

// Brand icons using Icons8 CDN for multicolor versions
const BrandLogos: Record<string, ReactNode> = {
  'google-calendar': (
    <img
      src="https://img.icons8.com/color/96/google-calendar--v1.png"
      alt="Google Calendar"
      className="w-10 h-10"
    />
  ),
  'outlook-calendar': (
    <img
      src="https://img.icons8.com/color/96/microsoft-outlook-2019--v2.png"
      alt="Outlook"
      className="w-10 h-10"
    />
  ),
  'google-drive': (
    <img
      src="https://img.icons8.com/color/96/google-drive--v1.png"
      alt="Google Drive"
      className="w-10 h-10"
    />
  ),
  'notion': (
    <img
      src="https://img.icons8.com/ios-filled/100/000000/notion.png"
      alt="Notion"
      className="w-10 h-10"
    />
  ),
  'dropbox': (
    <img
      src="https://img.icons8.com/color/96/dropbox.png"
      alt="Dropbox"
      className="w-10 h-10"
    />
  ),
  'custom-docs': (
    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B6F47] to-[#A67A5B] flex items-center justify-center">
      <FileText className="w-5 h-5 text-white" />
    </div>
  ),
};

// Launch celebration burst component - positioned around button
function LaunchBurst({ isActive, buttonRef }: { isActive: boolean; buttonRef: React.RefObject<HTMLButtonElement | null> }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (isActive && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    }
  }, [isActive, buttonRef]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100]" style={{ overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: position.x, top: position.y, transform: 'translate(-50%, -50%)' }}>
        {/* Expanding rings */}
        <motion.div
          className="absolute rounded-full border-4 border-[#7C9A6E]"
          style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
          initial={{ width: 0, height: 0, opacity: 1 }}
          animate={{ width: 250, height: 250, opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
        <motion.div
          className="absolute rounded-full border-2 border-[#8BC34A]"
          style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
          initial={{ width: 0, height: 0, opacity: 0.8 }}
          animate={{ width: 180, height: 180, opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut', delay: 0.05 }}
        />

        {/* Sparkle particles */}
        {[...Array(12)].map((_, i) => {
          const angle = (i * 30) * (Math.PI / 180);
          const distance = 60 + Math.random() * 30;
          return (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-[#7C9A6E]"
              style={{ left: '50%', top: '50%' }}
              initial={{ x: '-50%', y: '-50%', opacity: 1, scale: 1 }}
              animate={{
                x: Math.cos(angle) * distance - 4,
                y: Math.sin(angle) * distance - 4,
                opacity: 0,
                scale: 0,
              }}
              transition={{ duration: 0.4, ease: 'easeOut', delay: i * 0.015 }}
            />
          );
        })}
      </div>
    </div>
  );
}

export function SetupWizard({ isOpen, onClose, onComplete }: SetupWizardProps) {
  const { user } = useApp();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<WizardData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLaunchBurst, setShowLaunchBurst] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof WizardData, string>>>({});
  const launchButtonRef = useRef<HTMLButtonElement>(null);
  const [touched, setTouched] = useState<Partial<Record<keyof WizardData, boolean>>>({});

  const createBusinessMutation = useCreateBusiness();
  const createAgentMutation = useCreateAgent();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Global Enter key handler
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in a textarea
      if (e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (currentStep === 6) {
          if (!isSubmitting) {
            // Trigger submit
            document.getElementById('launch-btn')?.click();
          }
        } else {
          // Trigger next
          document.getElementById('next-btn')?.click();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStep, isSubmitting]);

  const updateData = useCallback((updates: Partial<WizardData>) => {
    setData(prev => ({ ...prev, ...updates }));
    const clearedErrors = { ...errors };
    Object.keys(updates).forEach(key => delete clearedErrors[key as keyof WizardData]);
    setErrors(clearedErrors);
  }, [errors]);

  const markTouched = (field: keyof WizardData) => setTouched(prev => ({ ...prev, [field]: true }));

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof WizardData, string>> = {};
    switch (step) {
      case 1:
        if (!data.businessName.trim()) newErrors.businessName = 'Required';
        else if (data.businessName.length < 2) newErrors.businessName = 'Too short';
        if (!data.businessEmail.trim()) newErrors.businessEmail = 'Required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.businessEmail)) newErrors.businessEmail = 'Invalid email';
        break;
      case 2:
        if (!data.address.trim()) newErrors.address = 'Required';
        break;
      case 3:
        const v = validateAreaCode(data.areaCode);
        if (!v.valid) newErrors.areaCode = v.message;
        break;
      case 4:
        if (!data.systemPrompt.trim()) newErrors.systemPrompt = 'Required';
        else if (data.systemPrompt.length < 20) newErrors.systemPrompt = 'Add more detail';
        break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => { if (validateStep(currentStep)) { setCurrentStep(prev => Math.min(prev + 1, 6)); setTouched({}); } };
  const handleBack = () => { setCurrentStep(prev => Math.max(prev - 1, 1)); setTouched({}); };
  const toggleIntegration = (id: string) => setData(prev => ({ ...prev, integrations: prev.integrations.includes(id) ? prev.integrations.filter(i => i !== id) : [...prev.integrations, id] }));

  const handleSubmit = async () => {
    if (!user) return;
    setIsSubmitting(true);
    setShowLaunchBurst(true);

    try {
      const business = await createBusinessMutation.mutateAsync({ owner_user_id: user.id, name: data.businessName, business_email: data.businessEmail, address: data.address });
      await createAgentMutation.mutateAsync({ business_id: business.id, area_code: data.areaCode, name: data.agentName || `${data.businessName} Agent`, prompt: data.systemPrompt, greeting: data.greeting, goodbye: data.goodbye });

      // Wait for burst animation
      setTimeout(() => {
        onComplete(business.id);
        handleClose();
      }, 800);
    } catch (error) {
      console.error('Failed to create business:', error);
      setShowLaunchBurst(false);
      setIsSubmitting(false);
    }
  };

  const handleClose = () => { setCurrentStep(1); setData(initialData); setErrors({}); setTouched({}); setShowLaunchBurst(false); onClose(); };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-[#FAF8F3]">
        {/* Launch celebration burst */}
        <LaunchBurst isActive={showLaunchBurst} buttonRef={launchButtonRef} />

        {/* Background with abstract blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Large soft blob - top right */}
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#E8DCC8]/60 via-[#D4C4A8]/40 to-transparent blur-3xl" />
          {/* Medium blob - bottom left */}
          <div className="absolute -bottom-24 -left-24 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-[#C9B790]/50 via-[#E8DCC8]/30 to-transparent blur-3xl" />
          {/* Small accent blob - middle left */}
          <div className="absolute top-1/3 -left-16 w-[200px] h-[200px] rounded-full bg-gradient-to-r from-[#A67A5B]/20 to-transparent blur-2xl" />
          {/* Tiny floating blob - top left */}
          <div className="absolute top-20 left-1/4 w-[100px] h-[100px] rounded-full bg-[#8B6F47]/10 blur-2xl" />
          {/* Subtle blob - bottom right */}
          <div className="absolute bottom-1/4 right-10 w-[150px] h-[150px] rounded-full bg-gradient-to-bl from-[#C9B790]/30 to-transparent blur-2xl" />
        </div>

        <div className="relative h-full flex flex-col">
          {/* Header with close button */}
          <div className="px-6 py-4 flex items-center justify-end">
            <button onClick={handleClose} className="w-10 h-10 rounded-full bg-[#E8DCC8] hover:bg-[#D4C4A8] flex items-center justify-center transition-colors">
              <X className="h-5 w-5 text-[#8B6F47]" />
            </button>
          </div>

          {/* Step Indicators - Responsive */}
          <div className="flex justify-center mb-6 px-4">
            {/* Mobile: Simple progress dots */}
            <div className="flex items-center gap-2 sm:hidden">
              {steps.map((step) => {
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                return (
                  <div
                    key={step.id}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      isCompleted ? 'bg-[#8B6F47]' : isActive ? 'bg-[#8B6F47] ring-2 ring-[#8B6F47]/30' : 'bg-[#E8DCC8]'
                    }`}
                  />
                );
              })}
              <span className="ml-2 text-sm text-[#8B6F47] font-medium">{currentStep}/6</span>
            </div>

            {/* Desktop: Full step indicators */}
            <div className="hidden sm:flex items-center gap-2 md:gap-3">
              {steps.map((step, idx) => {
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                return (
                  <div key={step.id} className="flex items-center gap-2 md:gap-3">
                    <div className="flex flex-col items-center">
                      <motion.div
                        className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-base md:text-lg font-semibold transition-all ${
                          isCompleted ? 'bg-[#8B6F47] text-white' : isActive ? 'bg-[#8B6F47] text-white ring-4 ring-[#8B6F47]/20' : 'bg-[#E8DCC8] text-[#A67A5B]/60'
                        }`}
                        animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                      >
                        {isCompleted ? <Check className="w-4 h-4 md:w-5 md:h-5" /> : step.id}
                      </motion.div>
                      <span className={`text-[10px] md:text-xs mt-1 md:mt-1.5 font-medium ${isActive || isCompleted ? 'text-[#8B6F47]' : 'text-[#A67A5B]/50'}`}>
                        {step.title}
                      </span>
                    </div>
                    {idx < steps.length - 1 && (
                      <div className={`w-4 md:w-8 h-0.5 rounded-full mb-5 ${isCompleted ? 'bg-[#8B6F47]' : 'bg-[#E8DCC8]'}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Content - Centered on all screen sizes */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-6 flex items-center justify-center" style={{ paddingBottom: '8%' }}>
            <div className="w-full max-w-lg">
              <AnimatePresence mode="wait">
                <motion.div key={currentStep} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.15 }}>
                  {currentStep === 1 && <Step1 data={data} updateData={updateData} errors={errors} touched={touched} markTouched={markTouched} onNext={handleNext} />}
                  {currentStep === 2 && <Step2 data={data} updateData={updateData} errors={errors} onNext={handleNext} onBack={handleBack} />}
                  {currentStep === 3 && <Step3 data={data} updateData={updateData} touched={touched} markTouched={markTouched} onNext={handleNext} onBack={handleBack} />}
                  {currentStep === 4 && <Step4 data={data} updateData={updateData} errors={errors} onNext={handleNext} onBack={handleBack} />}
                  {currentStep === 5 && <Step5 data={data} toggleIntegration={toggleIntegration} onNext={handleNext} onBack={handleBack} />}
                  {currentStep === 6 && <Step6 data={data} onEdit={setCurrentStep} onBack={handleBack} onSubmit={handleSubmit} isSubmitting={isSubmitting} launchButtonRef={launchButtonRef} />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// Navigation buttons component
function NavButtons({ onBack, onNext, nextLabel = 'Continue', showBack = true, isLoading = false, nextVariant = 'primary', buttonRef }: { onBack?: () => void; onNext: () => void; nextLabel?: string; showBack?: boolean; isLoading?: boolean; nextVariant?: 'primary' | 'success'; buttonRef?: React.RefObject<HTMLButtonElement | null> }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="mt-8 pt-6 border-t border-[#E8DCC8]/50">
      <div className="flex items-center justify-between">
        {showBack && onBack ? (
          <button onClick={onBack} className="flex items-center gap-2 text-[#8B6F47] hover:text-[#6B5D4D] font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        ) : <div />}
        {nextVariant === 'success' ? (
        <motion.button
          ref={buttonRef}
          id="launch-btn"
          onClick={onNext}
          disabled={isLoading}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="relative overflow-hidden rounded-2xl font-medium h-12 px-8 text-sm flex items-center justify-center gap-3 bg-[#7C9A6E] text-white shadow-xl shadow-[#7C9A6E]/25 disabled:opacity-50"
        >
          {/* Shimmer effect on hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            initial={{ x: '-100%' }}
            animate={isHovered ? { x: '100%' } : { x: '-100%' }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          />

          <span className="relative z-10 flex items-center gap-2">
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <motion.span
                animate={isHovered ? {
                  rotate: [0, -10, 10, -10, 10, 0],
                  scale: [1, 1.2, 1.2, 1.2, 1.2, 1],
                } : {}}
                transition={{ duration: 0.5 }}
              >
                <Sparkles className="w-4 h-4" />
              </motion.span>
            )}
            {nextLabel}
          </span>
        </motion.button>
        ) : (
          <GlowButton id="next-btn" onClick={onNext} disabled={isLoading}>
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {nextLabel}
          </GlowButton>
        )}
      </div>
      {/* Enter key hint - hidden on mobile */}
      <p className="hidden sm:block text-center text-xs text-[#A67A5B]/40 mt-3">
        Press <kbd className="px-1.5 py-0.5 bg-[#E8DCC8]/50 rounded text-[#8B6F47] font-mono text-[10px]">Enter ↵</kbd> to continue
      </p>
    </div>
  );
}

// Elegant step header component - responsive
function StepHeader({ stepNumber, title, subtitle }: { stepNumber: number; title: string; subtitle: string }) {
  return (
    <div className="text-center mb-6 sm:mb-8">
      <div className="text-4xl sm:text-6xl font-extralight text-[#C9B790]/60 mb-1 sm:mb-2 tracking-tight">
        {String(stepNumber).padStart(2, '0')}
      </div>
      <h1 className="text-xl sm:text-2xl font-bold text-[#5D4E37]">{title}</h1>
      <p className="text-sm sm:text-base text-[#8B6F47]/60 mt-1">{subtitle}</p>
    </div>
  );
}

// Step 1: Business Details
function Step1({ data, updateData, errors, touched, markTouched, onNext }: { data: WizardData; updateData: (u: Partial<WizardData>) => void; errors: Partial<Record<keyof WizardData, string>>; touched: Partial<Record<keyof WizardData, boolean>>; markTouched: (f: keyof WizardData) => void; onNext: () => void }) {
  return (
    <div>
      <StepHeader stepNumber={1} title="Business Details" subtitle="Tell us about your business" />

      <div className="space-y-5">
        <div>
          <Label className="text-[#5D4E37] font-medium">Business Name</Label>
          <Input
            autoFocus
            value={data.businessName}
            onChange={(e) => updateData({ businessName: e.target.value })}
            onBlur={() => markTouched('businessName')}
            placeholder="Acme Corporation"
            className={`mt-2 bg-white border-2 h-12 rounded-xl text-[#2D2416] placeholder:text-[#A67A5B]/40 ${errors.businessName && touched.businessName ? 'border-red-400' : 'border-[#E8DCC8] focus:border-[#8B6F47]'}`}
          />
          {errors.businessName && touched.businessName && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.businessName}</p>}
        </div>

        <div>
          <Label className="text-[#5D4E37] font-medium">Business Email</Label>
          <Input
            type="email"
            value={data.businessEmail}
            onChange={(e) => updateData({ businessEmail: e.target.value })}
            onBlur={() => markTouched('businessEmail')}
            placeholder="contact@acme.com"
            className={`mt-2 bg-white border-2 h-12 rounded-xl text-[#2D2416] placeholder:text-[#A67A5B]/40 ${errors.businessEmail && touched.businessEmail ? 'border-red-400' : 'border-[#E8DCC8] focus:border-[#8B6F47]'}`}
          />
          {errors.businessEmail && touched.businessEmail && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.businessEmail}</p>}
        </div>
      </div>

      <NavButtons onNext={onNext} showBack={false} />
    </div>
  );
}

// Step 2: Location with map preview
function Step2({ data, updateData, errors, onNext, onBack }: { data: WizardData; updateData: (u: Partial<WizardData>) => void; errors: Partial<Record<keyof WizardData, string>>; onNext: () => void; onBack: () => void }) {
  const encodedAddress = encodeURIComponent(data.address);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
  const mapUrl = data.address && apiKey ? `https://maps.googleapis.com/maps/api/staticmap?center=${encodedAddress}&zoom=15&size=400x200&scale=2&maptype=roadmap&markers=color:brown%7C${encodedAddress}&key=${apiKey}` : '';

  return (
    <div>
      <StepHeader stepNumber={2} title="Location" subtitle="Where is your business located?" />

      <div>
        <Label className="text-[#5D4E37] font-medium">Business Address</Label>
        <AddressAutocomplete
          value={data.address}
          onSelect={(address) => updateData({ address })}
          placeholder="Start typing your address..."
          className={`mt-2 bg-white border-2 h-12 rounded-xl text-[#2D2416] placeholder:text-[#A67A5B]/40 ${errors.address ? 'border-red-400' : 'border-[#E8DCC8] focus:border-[#8B6F47]'}`}
        />
        {errors.address && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.address}</p>}
      </div>

      {/* Map Preview */}
      {data.address && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-5">
          <div className="rounded-xl overflow-hidden border-2 border-[#E8DCC8] bg-white">
            {apiKey ? (
              <img
                src={mapUrl}
                alt="Location preview"
                className="w-full h-[150px] object-cover"
              />
            ) : (
              <div className="w-full h-[100px] bg-[#F5F0E8] flex items-center justify-center">
                <MapPin className="w-8 h-8 text-[#8B6F47]/30" />
              </div>
            )}
            <div className="p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#8B6F47]/10 flex items-center justify-center flex-shrink-0">
                <Check className="w-5 h-5 text-[#8B6F47]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[#2D2416] font-medium truncate">{data.address}</p>
                <p className="text-xs text-[#8B6F47]/50">Address confirmed</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <NavButtons onBack={onBack} onNext={onNext} />
    </div>
  );
}

// Step 3: Phone Setup with validation
function Step3({ data, updateData, touched, markTouched, onNext, onBack }: { data: WizardData; updateData: (u: Partial<WizardData>) => void; touched: Partial<Record<keyof WizardData, boolean>>; markTouched: (f: keyof WizardData) => void; onNext: () => void; onBack: () => void }) {
  const validation = validateAreaCode(data.areaCode);
  const showError = touched.areaCode && !validation.valid;

  return (
    <div>
      <StepHeader stepNumber={3} title="Phone Number" subtitle="Choose your local area code" />

      {/* Centered area code input - responsive */}
      <div className="flex flex-col items-center">
        <div className="flex items-center justify-center gap-1">
          <span className="text-3xl sm:text-4xl text-[#5D4E37]/40 font-light">(</span>
          <Input
            value={data.areaCode}
            onChange={(e) => updateData({ areaCode: e.target.value.replace(/\D/g, '').slice(0, 3) })}
            onBlur={() => markTouched('areaCode')}
            placeholder="555"
            maxLength={3}
            inputMode="numeric"
            className={`w-20 sm:w-28 h-14 sm:h-16 text-center text-2xl sm:text-3xl font-mono bg-white border-2 rounded-xl text-[#2D2416] ${showError ? 'border-red-400' : validation.valid ? 'border-[#8B6F47]' : 'border-[#E8DCC8]'}`}
          />
          <span className="text-3xl sm:text-4xl text-[#5D4E37]/40 font-light">)</span>
          <span className="text-lg sm:text-2xl text-[#5D4E37]/30 font-mono ml-1">XXX-XXXX</span>
        </div>
        {showError && (
          <p className="text-red-500 text-sm mt-3 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />{validation.message}
          </p>
        )}
      </div>

      {/* Quick select - responsive */}
      <div className="mt-6 sm:mt-8 text-center">
        <p className="text-xs text-[#A67A5B]/60 mb-3">Popular area codes</p>
        <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
          {['212', '310', '312', '415', '512', '617', '702', '818'].map(code => (
            <button
              key={code}
              onClick={() => { updateData({ areaCode: code }); markTouched('areaCode'); }}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm font-mono transition-all ${data.areaCode === code ? 'bg-[#8B6F47] text-white' : 'bg-[#F5F0E8] text-[#8B6F47] hover:bg-[#E8DCC8]'}`}
            >
              {code}
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      {validation.valid && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-6 p-4 bg-[#8B6F47]/5 rounded-xl border border-[#8B6F47]/20 text-center">
          <p className="text-sm text-[#6B5D4D]">Your phone number will be</p>
          <p className="text-2xl font-mono font-semibold text-[#2D2416] mt-1">({data.areaCode}) XXX-XXXX</p>
        </motion.div>
      )}

      <NavButtons onBack={onBack} onNext={onNext} />
    </div>
  );
}

// Step 4: Agent Config with clear layout
function Step4({ data, updateData, errors, onNext, onBack }: { data: WizardData; updateData: (u: Partial<WizardData>) => void; errors: Partial<Record<keyof WizardData, string>>; onNext: () => void; onBack: () => void }) {
  return (
    <div>
      <StepHeader stepNumber={4} title="Agent Personality" subtitle="How should your agent behave?" />

      {/* Templates - responsive grid */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-5">
        {promptTemplates.map(t => (
          <button
            key={t.name}
            onClick={() => updateData({ systemPrompt: t.prompt })}
            className={`p-3 sm:p-4 rounded-xl border-2 text-center transition-all ${data.systemPrompt === t.prompt ? 'border-[#8B6F47] bg-[#8B6F47]/5 shadow-md' : 'border-[#E8DCC8] hover:border-[#A67A5B] bg-white'}`}
          >
            <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">{t.emoji}</div>
            <div className="text-xs sm:text-sm font-medium text-[#5D4E37]">{t.name}</div>
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px bg-[#E8DCC8]" />
        <span className="text-sm text-[#A67A5B]/60 font-medium">or</span>
        <div className="flex-1 h-px bg-[#E8DCC8]" />
      </div>

      {/* Custom prompt - responsive padding */}
      <div className="p-3 sm:p-4 bg-white rounded-xl border-2 border-[#E8DCC8]">
        <Label className="text-[#5D4E37] font-semibold text-sm flex items-center gap-2 mb-2 sm:mb-3">
          <PenLine className="w-4 h-4 text-[#8B6F47]" />
          Custom Instructions
        </Label>
        <Textarea
          value={data.systemPrompt}
          onChange={(e) => updateData({ systemPrompt: e.target.value })}
          placeholder="Describe how your agent should talk to callers..."
          rows={3}
          className={`bg-[#FDFCFA] border rounded-lg text-[#2D2416] placeholder:text-[#A67A5B]/40 resize-none ${errors.systemPrompt ? 'border-red-400' : 'border-[#E8DCC8]'}`}
        />
        {errors.systemPrompt && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.systemPrompt}</p>}
      </div>

      {/* Greeting/Goodbye - Responsive stack on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-6">
        <div className="bg-white p-3 sm:p-4 rounded-xl border-2 border-[#E8DCC8]">
          <Label className="text-[#5D4E37] font-semibold text-sm mb-2 flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-[#8B6F47]" />
            Greeting Message
          </Label>
          <Textarea
            value={data.greeting}
            onChange={(e) => updateData({ greeting: e.target.value })}
            className="bg-[#FDFCFA] border-[#E8DCC8] rounded-lg text-sm text-[#2D2416] resize-none"
            placeholder="Hello! How can I help you today?"
            rows={2}
          />
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-xl border-2 border-[#E8DCC8]">
          <Label className="text-[#5D4E37] font-semibold text-sm mb-2 flex items-center gap-2">
            <LogOut className="w-4 h-4 text-[#8B6F47]" />
            Goodbye Message
          </Label>
          <Textarea
            value={data.goodbye}
            onChange={(e) => updateData({ goodbye: e.target.value })}
            className="bg-[#FDFCFA] border-[#E8DCC8] rounded-lg text-sm text-[#2D2416] resize-none"
            placeholder="Thank you for calling. Have a great day!"
            rows={2}
          />
        </div>
      </div>

      <NavButtons onBack={onBack} onNext={onNext} />
    </div>
  );
}

// Step 5: Integrations
function Step5({ data, toggleIntegration, onNext, onBack }: { data: WizardData; toggleIntegration: (id: string) => void; onNext: () => void; onBack: () => void }) {
  return (
    <div>
      <StepHeader stepNumber={5} title="What can your agent access?" subtitle="Connect tools to help your agent assist customers better" />

      {/* Clear instruction for multi-select */}
      <div className="bg-[#8B6F47]/5 rounded-lg px-4 py-2 mb-4 text-center">
        <p className="text-sm text-[#8B6F47] font-medium">Select all that apply</p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {integrations.map(int => {
          const isSelected = data.integrations.includes(int.id);
          return (
            <motion.button
              key={int.id}
              onClick={() => toggleIntegration(int.id)}
              whileTap={{ scale: 0.98 }}
              className={`p-3 sm:p-4 rounded-xl border-2 text-left transition-all relative ${isSelected ? 'border-[#8B6F47] bg-white shadow-md' : 'border-[#E8DCC8] bg-white hover:border-[#A67A5B]/50'}`}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#8B6F47] flex items-center justify-center">
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
              )}
              <div className="mb-2 sm:mb-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 [&>img]:w-8 [&>img]:h-8 sm:[&>img]:w-10 sm:[&>img]:h-10 [&>div]:w-8 [&>div]:h-8 sm:[&>div]:w-10 sm:[&>div]:h-10">
                  {BrandLogos[int.id]}
                </div>
              </div>
              <p className="font-medium text-[#5D4E37] text-sm sm:text-base">{int.name}</p>
              <p className="text-[10px] sm:text-xs text-[#8B6F47]/60 mt-0.5 line-clamp-2">{int.description}</p>
            </motion.button>
          );
        })}
      </div>

      {data.integrations.length > 0 && (
        <div className="mt-4 p-3 bg-[#8B6F47]/5 rounded-lg text-center">
          <p className="text-sm text-[#8B6F47] font-medium">{data.integrations.length} integration{data.integrations.length > 1 ? 's' : ''} selected</p>
        </div>
      )}

      <NavButtons onBack={onBack} onNext={onNext} nextLabel={data.integrations.length > 0 ? 'Continue' : 'Skip for now'} />
    </div>
  );
}

// Step 6: Review
function Step6({ data, onEdit, onBack, onSubmit, isSubmitting, launchButtonRef }: { data: WizardData; onEdit: (step: number) => void; onBack: () => void; onSubmit: () => void; isSubmitting: boolean; launchButtonRef: React.RefObject<HTMLButtonElement | null> }) {
  const selectedInts = integrations.filter(i => data.integrations.includes(i.id));

  return (
    <div>
      <StepHeader stepNumber={6} title="Review & Launch" subtitle="Make sure everything looks good" />

      <div className="space-y-3">
        <ReviewRow icon={Building2} label="Business" value={data.businessName} sub={data.businessEmail} onEdit={() => onEdit(1)} />
        <ReviewRow icon={MapPin} label="Location" value={data.address} onEdit={() => onEdit(2)} />
        <ReviewRow icon={Phone} label="Phone" value={`(${data.areaCode}) XXX-XXXX`} sub="Will be provisioned" onEdit={() => onEdit(3)} />
        <ReviewRow icon={Bot} label="Agent" value={data.systemPrompt.length > 60 ? data.systemPrompt.slice(0, 60) + '...' : data.systemPrompt} onEdit={() => onEdit(4)} />
        <ReviewRow icon={Plug} label="Integrations" value={selectedInts.length > 0 ? selectedInts.map(i => i.name).join(', ') : 'None selected'} onEdit={() => onEdit(5)} />
      </div>

      <NavButtons onBack={onBack} onNext={onSubmit} nextLabel="Launch Business" nextVariant="success" isLoading={isSubmitting} buttonRef={launchButtonRef} />
    </div>
  );
}

function ReviewRow({ icon: Icon, label, value, sub, onEdit }: { icon: typeof Building2; label: string; value: string; sub?: string; onEdit: () => void }) {
  return (
    <button onClick={onEdit} className="w-full p-4 bg-white rounded-xl border border-[#E8DCC8] flex items-center gap-4 hover:shadow-md hover:border-[#A67A5B]/50 transition-all text-left group">
      <div className="w-12 h-12 rounded-xl bg-[#F5F0E8] flex items-center justify-center flex-shrink-0">
        <Icon className="w-6 h-6 text-[#8B6F47]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-[#A67A5B]/60 uppercase tracking-wide">{label}</p>
        <p className="text-sm font-medium text-[#2D2416] truncate mt-0.5">{value}</p>
        {sub && <p className="text-xs text-[#8B6F47]/50 mt-0.5">{sub}</p>}
      </div>
      <span className="text-xs text-[#A67A5B]/40 group-hover:text-[#8B6F47] transition-colors font-medium">Edit</span>
    </button>
  );
}
