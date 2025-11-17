'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from 'react';
import type { Session, User, Provider } from '@supabase/supabase-js';
import { supabase } from './supabase';

// ---- Your domain types & mock data (kept) ----
import {
  User as AppUser,          // kept in case you reference it elsewhere
  Business,
  Agent,
  Document,
  Conversation,
  Message,
  PhoneNumber,
  mockUser,                 // not used for auth anymore; keep if you need it elsewhere
  mockBusinesses,
  mockAgents,
  mockDocuments,
  mockConversations,
  mockMessages,
  mockPhoneNumbers,
} from './mock-data';

// ---- Context shape ----
interface AppContextType {
  // Auth (Supabase)
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name?: string) => Promise<boolean>;
  signInWithProvider: (provider: Provider, redirectTo?: string) => Promise<void>;
  logout: () => Promise<void>;

  // Your existing app data & actions (mock/in-memory)
  businesses: Business[];
  agents: Agent[];
  documents: Document[];
  conversations: Conversation[];
  messages: Message[];
  phoneNumbers: PhoneNumber[];

  createBusiness: (business: Omit<Business, 'id' | 'created_at' | 'owner_user_id'>) => void;
  updateBusiness: (id: number, updates: Partial<Business>) => void;
  deleteBusiness: (id: number) => void;

  createAgent: (agent: Omit<Agent, 'id' | 'created_at' | 'updated_at'>) => void;
  updateAgent: (id: number, updates: Partial<Agent>) => void;
  deleteAgent: (id: number) => void;

  createDocument: (document: Omit<Document, 'id' | 'uploaded_at' | 'updated_at'>) => void;
  deleteDocument: (id: number) => void;

  createConversation: (conversation: Omit<Conversation, 'id'>) => void;
  createMessage: (message: Omit<Message, 'id' | 'created_at'>) => void;

  createPhoneNumber: (phoneNumber: Omit<PhoneNumber, 'id' | 'created_at'>) => void;
  updatePhoneNumber: (id: number, updates: Partial<PhoneNumber>) => void;
  deletePhoneNumber: (id: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // ---------- AUTH (Supabase) ----------
  const [session, setSession] = useState<Session | null>(null);
  const user = session?.user ?? null;
  const isAuthenticated = !!user;

  // Load current session and subscribe to changes
  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (mounted) setSession(data.session ?? null);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      if (mounted) setSession(s);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return false;
    setSession(data.session ?? null);
    return !!data.session;
  }, []);

  // IMPORTANT: only upsert profile if session exists (email confirmation OFF).
  // If confirmation is ON, session is null here; rely on DB trigger or defer.
  const register = useCallback(async (email: string, password: string, name?: string) => {
    const redirectTo = `${window.location.origin}/auth/callback`;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectTo,
        data: name ? { full_name: name } : undefined,
      },
    });
    if (error) return false;

    if (data.user && data.session) {
      try {
        const { error: upsertErr } = await supabase.from('profiles').upsert({
          id: data.user.id,
          full_name: name ?? (data.user.user_metadata as any)?.full_name ?? null,
          email: data.user.email,
        });
        // Non-fatal if it fails (RLS/confirmation timing)
        if (upsertErr) {
          // console.warn('profiles upsert failed:', upsertErr);
        }
      } catch {
        // swallow; not fatal for registration UX
      }
    }

    setSession(data.session ?? null); // may be null until email is confirmed
    return true;
  }, []);

  const signInWithProvider = useCallback(async (provider: Provider, redirectTo?: string) => {
    const callbackUrl = redirectTo ?? `${window.location.origin}/auth/callback`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: callbackUrl },
    });
    if (error) throw error;
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null);
  }, []);

  // ---------- YOUR EXISTING MOCK DATA STATE ----------
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);

  // Initialize with mock data (domain only; auth now uses Supabase)
  useEffect(() => {
    setBusinesses(mockBusinesses);
    setAgents(mockAgents);
    setDocuments(mockDocuments);
    setConversations(mockConversations);
    setMessages(mockMessages);
    setPhoneNumbers(mockPhoneNumbers);
  }, []);

  // ---------- Domain CRUD (unchanged behavior) ----------
  // Business
  const createBusiness = (businessData: Omit<Business, 'id' | 'created_at' | 'owner_user_id'>) => {
    const newBusiness: Business = {
      ...businessData,
      id: Date.now(),
      created_at: new Date().toISOString(),
      owner_user_id: user?.id || 'user-1',
    };
    setBusinesses(prev => [...prev, newBusiness]);
  };

  const updateBusiness = (id: number, updates: Partial<Business>) => {
    setBusinesses(prev => prev.map(b => (b.id === id ? { ...b, ...updates } : b)));
  };

  const deleteBusiness = (id: number) => {
    setBusinesses(prev => prev.filter(b => b.id !== id));
    // cascade deletes (in-memory)
    setAgents(prev => prev.filter(a => a.business_id !== id));
    setDocuments(prev => prev.filter(doc => {
      const agent = agents.find(a => a.id === doc.agent_id);
      return agent?.business_id !== id;
    }));
    setConversations(prev => prev.filter(conv => {
      const agent = agents.find(a => a.id === conv.agent_id);
      return agent?.business_id !== id;
    }));
    setPhoneNumbers(prev => prev.filter(phone => {
      const agent = agents.find(a => a.id === phone.agent_id);
      return agent?.business_id !== id;
    }));
  };

  // Agent
  const createAgent = (agentData: Omit<Agent, 'id' | 'created_at' | 'updated_at'>) => {
    const newAgent: Agent = {
      ...agentData,
      id: Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setAgents(prev => [...prev, newAgent]);
  };

  const updateAgent = (id: number, updates: Partial<Agent>) => {
    setAgents(prev => prev.map(a => (a.id === id ? { ...a, ...updates, updated_at: new Date().toISOString() } : a)));
  };

  const deleteAgent = (id: number) => {
    setAgents(prev => prev.filter(a => a.id !== id));
    setDocuments(prev => prev.filter(d => d.agent_id !== id));
    setConversations(prev => prev.filter(c => c.agent_id !== id));
    setPhoneNumbers(prev => prev.filter(p => p.agent_id !== id));
  };

  // Document
  const createDocument = (documentData: Omit<Document, 'id' | 'uploaded_at' | 'updated_at'>) => {
    const newDocument: Document = {
      ...documentData,
      id: Date.now(),
      uploaded_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setDocuments(prev => [...prev, newDocument]);
  };

  const deleteDocument = (id: number) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  // Conversation / Message
  const createConversation = (conversationData: Omit<Conversation, 'id'>) => {
    const newConversation: Conversation = { ...conversationData, id: Date.now() };
    setConversations(prev => [...prev, newConversation]);
  };

  const createMessage = (messageData: Omit<Message, 'id' | 'created_at'>) => {
    const newMessage: Message = {
      ...messageData,
      id: Date.now(),
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  // Phone number
  const createPhoneNumber = (phoneNumberData: Omit<PhoneNumber, 'id' | 'created_at'>) => {
    const newPhoneNumber: PhoneNumber = {
      ...phoneNumberData,
      id: Date.now(),
      created_at: new Date().toISOString(),
    };
    setPhoneNumbers(prev => [...prev, newPhoneNumber]);
  };

  const updatePhoneNumber = (id: number, updates: Partial<PhoneNumber>) => {
    setPhoneNumbers(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deletePhoneNumber = (id: number) => {
    setPhoneNumbers(prev => prev.filter(p => p.id !== id));
  };

  const value: AppContextType = useMemo(() => ({
    // Auth
    user,
    session,
    isAuthenticated,
    login,
    register,
    signInWithProvider,
    logout,

    // Domain data
    businesses,
    agents,
    documents,
    conversations,
    messages,
    phoneNumbers,

    createBusiness,
    updateBusiness,
    deleteBusiness,
    createAgent,
    updateAgent,
    deleteAgent,
    createDocument,
    deleteDocument,
    createConversation,
    createMessage,
    createPhoneNumber,
    updatePhoneNumber,
    deletePhoneNumber,
  }), [
    user, session, isAuthenticated,
    login, register, signInWithProvider, logout,
    businesses, agents, documents, conversations, messages, phoneNumbers,
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within an AppProvider');
  return ctx;
}
