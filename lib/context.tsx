'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Business, Agent, Document, Conversation, Message, PhoneNumber, mockUser, mockBusinesses, mockAgents, mockDocuments, mockConversations, mockMessages, mockPhoneNumbers } from './mock-data';

interface AppContextType {
  user: User | null;
  businesses: Business[];
  agents: Agent[];
  documents: Document[];
  conversations: Conversation[];
  messages: Message[];
  phoneNumbers: PhoneNumber[];
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
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
  const [user, setUser] = useState<User | null>(null);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);

  const isAuthenticated = !!user;

  // Initialize with mock data
  useEffect(() => {
    setBusinesses(mockBusinesses);
    setAgents(mockAgents);
    setDocuments(mockDocuments);
    setConversations(mockConversations);
    setMessages(mockMessages);
    setPhoneNumbers(mockPhoneNumbers);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock login - accept any email/password
    if (email && password) {
      setUser(mockUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const createBusiness = (businessData: Omit<Business, 'id' | 'created_at' | 'owner_user_id'>) => {
    const newBusiness: Business = {
      ...businessData,
      id: Date.now(),
      created_at: new Date().toISOString(),
      owner_user_id: user?.id || 'user-1'
    };
    setBusinesses(prev => [...prev, newBusiness]);
  };

  const updateBusiness = (id: number, updates: Partial<Business>) => {
    setBusinesses(prev => prev.map(business => 
      business.id === id ? { ...business, ...updates } : business
    ));
  };

  const deleteBusiness = (id: number) => {
    setBusinesses(prev => prev.filter(business => business.id !== id));
    // Also delete related agents, documents, conversations, phone numbers
    setAgents(prev => prev.filter(agent => agent.business_id !== id));
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

  const createAgent = (agentData: Omit<Agent, 'id' | 'created_at' | 'updated_at'>) => {
    const newAgent: Agent = {
      ...agentData,
      id: Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setAgents(prev => [...prev, newAgent]);
  };

  const updateAgent = (id: number, updates: Partial<Agent>) => {
    setAgents(prev => prev.map(agent => 
      agent.id === id ? { ...agent, ...updates, updated_at: new Date().toISOString() } : agent
    ));
  };

  const deleteAgent = (id: number) => {
    setAgents(prev => prev.filter(agent => agent.id !== id));
    // Also delete related documents, conversations, and phone numbers
    setDocuments(prev => prev.filter(doc => doc.agent_id !== id));
    setConversations(prev => prev.filter(conv => conv.agent_id !== id));
    setPhoneNumbers(prev => prev.filter(phone => phone.agent_id !== id));
  };

  const createDocument = (documentData: Omit<Document, 'id' | 'uploaded_at' | 'updated_at'>) => {
    const newDocument: Document = {
      ...documentData,
      id: Date.now(),
      uploaded_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setDocuments(prev => [...prev, newDocument]);
  };

  const deleteDocument = (id: number) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const createConversation = (conversationData: Omit<Conversation, 'id'>) => {
    const newConversation: Conversation = {
      ...conversationData,
      id: Date.now()
    };
    setConversations(prev => [...prev, newConversation]);
  };

  const createMessage = (messageData: Omit<Message, 'id' | 'created_at'>) => {
    const newMessage: Message = {
      ...messageData,
      id: Date.now(),
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const createPhoneNumber = (phoneNumberData: Omit<PhoneNumber, 'id' | 'created_at'>) => {
    const newPhoneNumber: PhoneNumber = {
      ...phoneNumberData,
      id: Date.now(),
      created_at: new Date().toISOString()
    };
    setPhoneNumbers(prev => [...prev, newPhoneNumber]);
  };

  const updatePhoneNumber = (id: number, updates: Partial<PhoneNumber>) => {
    setPhoneNumbers(prev => prev.map(phone => 
      phone.id === id ? { ...phone, ...updates } : phone
    ));
  };

  const deletePhoneNumber = (id: number) => {
    setPhoneNumbers(prev => prev.filter(phone => phone.id !== id));
  };

  return (
    <AppContext.Provider value={{
      user,
      businesses,
      agents,
      documents,
      conversations,
      messages,
      phoneNumbers,
      isAuthenticated,
      login,
      logout,
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
      deletePhoneNumber
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
