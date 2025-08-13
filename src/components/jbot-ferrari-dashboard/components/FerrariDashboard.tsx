import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence, HTMLMotionProps } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Gauge, 
  Fuel, 
  AlertTriangle, 
  Clock, 
  ArrowRight, 
  ChevronRight, 
  BarChart2, 
  FileText, 
  MessageSquare,
  Flag,
  Zap,
  DollarSign,
  Home,
  Crown,
  MapPin,
  Bot,
  Brain,
  Activity,
  Server,
  Database,
  Users,
  Settings,
  Terminal,
  LineChart,
  GitBranch,
  Shield,
  Eye,
  Cpu,
  Network,
  Lock,
  Code,
  Palette,
  Wand2,
  LucideIcon,
  Power,
  X
} from 'lucide-react';
import FerrariLogo from './FerrariLogo';
import CarbonFiberPattern from './CarbonFiberPattern';
import SimpleCanvas from '../../components/ferrari-dashboard/SimpleCanvas';
import ChatButton from '../../components/ferrari-dashboard/ChatButton';

interface LenderUpdate {
  id: string;
  title: string;
  description: string;
  date: string;
  priority: 'high' | 'medium' | 'low';
  read: boolean;
}

interface StreetNode {
  x: number;
  y: number;
  connections: number[];
}

interface NavItem {
  icon: LucideIcon;
  label: string;
  href: string;
  badge?: string;
  count?: string;
}

interface NavSection {
  section: string;
  items: NavItem[];
}

interface RaceTrack {
  id: string;
  type: string;
  progress: number;
  color: string;
}

// Add JBot Core Control interface
interface JBotCoreStatus {
  active: boolean;
  mode: 'race' | 'qualifying' | 'practice';
  securityLevel: 'maximum' | 'high' | 'standard';
  lastModified: string;
}

interface AssistantStats {
  name: string;
  status: 'active' | 'inactive';
  messages: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  avgResponseTime: string;
  type: 'core' | 'assistant' | 'staff' | 'member';
  lastActive: string;
  imageId: string;
  size: string;
  age: string;
  cpuUsage: number;
  memoryUsage: number;
  uptime: number;
  errorRate: number;
  queueLength: number;
  successRate: number;
}

interface AssistantMetrics {
  assistants: number;
  staff: number;
  members: number;
  totalActive: number;
}

interface AssistantLimits {
  type: 'core' | 'assistant' | 'staff' | 'member';
  maxDailyMessages: number;
  maxConcurrentUsers: number;
  maxContextLength: number;
  maxResponseTime: number;
  features: {
    apiAccess: boolean;
    fileUploads: boolean;
    customization: boolean;
    priorityQueue: boolean;
    systemAccess: boolean;
  };
  resourceLimits: {
    cpuLimit: number;  // percentage
    memoryLimit: number;  // MB
    storageLimit: number; // GB
  };
}

interface AIProviderCosts {
  name: string;
  costs: {
    basePrice: number;
    tokenRate: number;
    storageRate: number;
    apiCalls: number;
  };
  usage: {
    tokensUsed: number;
    storageUsed: number;
    apiCallsMade: number;
  };
}

interface OperationalCosts {
  staff: {
    developers: number;
    support: number;
    training: number;
  };
  overhead: {
    servers: number;
    hosting: number;
    maintenance: number;
  };
  licenses: {
    software: number;
    apis: number;
    security: number;
  };
  education: {
    training: number;
    certifications: number;
    resources: number;
  };
}

interface PricingData {
  type: AssistantStats['type'];
  budget: {
    monthlyPrice: number;
    messagePrice: number;
    storagePrice: number;
  };
  actual: {
    monthlyPrice: number;
    messagePrice: number;
    storagePrice: number;
  };
  aiProviders: AIProviderCosts[];
  operational: OperationalCosts;
}

interface MotionDivProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
}

const sideNavItems: NavSection[] = [
  {
    section: "DASHBOARD FEATURES",
    items: [
      { icon: Bot, label: 'Builders/Developers Dashboard', href: '/builders', badge: 'NEW' },
      { icon: Users, label: 'Brokers Dashboard', href: '/brokers', badge: 'NEW' },
      { icon: DollarSign, label: 'Lenders Dashboard', href: '/lenders', badge: 'NEW' },
      { icon: Brain, label: 'Bot Training Dashboard', href: '/bot-training', badge: 'NEW' },
      { icon: BarChart2, label: 'Financial Overview', href: '/financial', badge: 'NEW' }
    ]
  },
  {
    section: "COMMON AREAS",
    items: [
      { icon: Eye, label: 'AiiQ Vision', href: '/vision' },
      { icon: GitBranch, label: '3 Step Process', href: '/process' },
      { icon: Database, label: 'Lender Matching', href: '/matching' },
      { icon: FileText, label: 'Project Evaluation', href: '/evaluation' },
      { icon: MessageSquare, label: 'Whiteboard Room', href: '/whiteboard' },
      { icon: Users, label: 'CyberCafe', href: '/cyber-cafe' },
      { icon: Crown, label: 'Executive Suite', href: '/executive', badge: 'VIP' }
    ]
  },
  {
    section: "AIIQ TOOLS",
    items: [
      { icon: BarChart2, label: 'Market Reports', href: '/reports' },
      { icon: Terminal, label: 'Presentation Builder', href: '/presentations' },
      { icon: FileText, label: 'Document Templates', href: '/templates' },
      { icon: Server, label: 'Document Center', href: '/documents' },
      { icon: Activity, label: 'Status Tracking', href: '/tracking' },
      { icon: GitBranch, label: 'Project Pipeline', href: '/pipeline' },
      { icon: LineChart, label: 'Analytics Suite', href: '/analytics' }
    ]
  },
  {
    section: "PROCESS STATUS",
    items: [
      { icon: Clock, label: 'Initial Review', href: '/review' },
      { icon: Brain, label: 'Scoring Analysis', href: '/scoring' },
      { icon: FileText, label: 'Document Status', href: '/doc-status' },
      { icon: Activity, label: 'Matching Progress', href: '/matching-progress', badge: 'LIVE' }
    ]
  },
  {
    section: "AI SERVICES",
    items: [
      { icon: Bot, label: 'JBot', href: '/jbot', badge: 'VIP', count: 'ONLINE' },
      { icon: Bot, label: 'Rasa', href: '/rasa', count: '0 msgs' },
      { icon: Cpu, label: 'Ollama', href: '/ollama', count: '0 msgs' },
      { icon: Brain, label: 'Claude', href: '/claude', count: '0 msgs' }
    ]
  },
  {
    section: "SECURITY & COMPLIANCE",
    items: [
      { icon: DollarSign, label: 'Pricing', href: '/pricing' },
      { icon: Shield, label: 'Terms & Conditions', href: '/terms' },
      { icon: Lock, label: 'Privacy Policy', href: '/privacy' }
    ]
  },
  {
    section: "QUICK ACCESS",
    items: [
      { icon: FileText, label: 'Text', href: '/text' },
      { icon: Code, label: 'Code', href: '/code' },
      { icon: Palette, label: 'Design', href: '/design' },
      { icon: Database, label: 'Vault', href: '/vault' },
      { icon: Bot, label: 'AI', href: '/ai' },
      { icon: BarChart2, label: 'Data', href: '/data' },
      { icon: MessageSquare, label: 'Chat', href: '/chat' },
      { icon: Wand2, label: 'Magic', href: '/magic' }
    ]
  }
];

const aiProviderCosts: AIProviderCosts[] = [
  {
    name: 'OpenAI',
    costs: {
      basePrice: 20,
      tokenRate: 0.002,
      storageRate: 0.08,
      apiCalls: 0.0001
    },
    usage: {
      tokensUsed: 1000000,
      storageUsed: 50,
      apiCallsMade: 100000
    }
  },
  {
    name: 'Claude',
    costs: {
      basePrice: 25,
      tokenRate: 0.0015,
      storageRate: 0.07,
      apiCalls: 0.00008
    },
    usage: {
      tokensUsed: 800000,
      storageUsed: 40,
      apiCallsMade: 80000
    }
  },
  {
    name: 'Droplet',
    costs: {
      basePrice: 15,
      tokenRate: 0.001,
      storageRate: 0.05,
      apiCalls: 0.00005
    },
    usage: {
      tokensUsed: 500000,
      storageUsed: 30,
      apiCallsMade: 60000
    }
  },
  {
    name: 'Google',
    costs: {
      basePrice: 30,
      tokenRate: 0.0025,
      storageRate: 0.1,
      apiCalls: 0.00015
    },
    usage: {
      tokensUsed: 600000,
      storageUsed: 35,
      apiCallsMade: 70000
    }
  }
];

const operationalCosts: OperationalCosts = {
  staff: {
    developers: 12000,
    support: 8000,
    training: 3000
  },
  overhead: {
    servers: 2000,
    hosting: 1500,
    maintenance: 1000
  },
  licenses: {
    software: 1500,
    apis: 1000,
    security: 800
  },
  education: {
    training: 1000,
    certifications: 800,
    resources: 500
  }
};

const calculateProviderCost = (provider: AIProviderCosts): number => {
  return provider.costs.basePrice +
    (provider.usage.tokensUsed * provider.costs.tokenRate) +
    (provider.usage.storageUsed * provider.costs.storageRate) +
    (provider.usage.apiCallsMade * provider.costs.apiCalls);
};

const calculateTotalOperationalCost = (costs: OperationalCosts): number => {
  return Object.values(costs).reduce((total, category) => 
    total + Object.values(category as Record<string, number>).reduce((sum, cost) => sum + (cost as number), 0), 0);
};

const PricingWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'providers' | 'operational'>('overview');

  const totalProviderCosts = aiProviderCosts.reduce((sum, provider) => 
    sum + calculateProviderCost(provider), 0);
  const totalOperationalCosts = calculateTotalOperationalCost(operationalCosts);
  const monthlyTotal = totalProviderCosts + totalOperationalCosts;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-ferrari-red hover:text-ferrari-red/80 transition-colors"
      >
        <DollarSign className="w-5 h-5" />
        <span>Pricing Overview</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '0.5rem',
              width: '800px',
              backgroundColor: 'var(--dark-card)',
              borderRadius: '0.5rem',
              boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.1)',
              zIndex: 50
            }}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-ferrari-red">Cost Analysis</h3>
                <div className="flex gap-4">
                  <button
                    onClick={() => setSelectedTab('overview')}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedTab === 'overview' 
                        ? 'bg-ferrari-red/20 text-ferrari-red' 
                        : 'text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setSelectedTab('providers')}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedTab === 'providers' 
                        ? 'bg-blue-500/20 text-blue-400' 
                        : 'text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    AI Providers
                  </button>
                  <button
                    onClick={() => setSelectedTab('operational')}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedTab === 'operational' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    Operational
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-gray-300"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {selectedTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-black/40 p-4 rounded-lg border border-ferrari-red/10">
                      <div className="text-sm text-gray-400 mb-1">AI Providers</div>
                      <div className="text-2xl font-bold text-white">
                        ${totalProviderCosts.toFixed(2)}
                      </div>
                    </div>
                    <div className="bg-black/40 p-4 rounded-lg border border-ferrari-red/10">
                      <div className="text-sm text-gray-400 mb-1">Operational</div>
                      <div className="text-2xl font-bold text-white">
                        ${totalOperationalCosts.toFixed(2)}
                      </div>
                    </div>
                    <div className="bg-black/40 p-4 rounded-lg border border-ferrari-red/10">
                      <div className="text-sm text-gray-400 mb-1">Monthly Total</div>
                      <div className="text-2xl font-bold text-white">
                        ${monthlyTotal.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/40 p-4 rounded-lg border border-ferrari-red/10">
                    <h4 className="text-sm font-medium text-gray-400 mb-3">Recommended Pricing</h4>
                    <div className="grid grid-cols-4 gap-4">
                      {Object.keys(assistantLimits).map((type) => {
                        const cost = monthlyTotal / Object.keys(assistantLimits).length;
                        const markup = type === 'core' ? 2.5 : type === 'assistant' ? 2 : type === 'staff' ? 1.75 : 1.5;
                        return (
                          <div key={type} className="text-center">
                            <div className="text-sm font-medium capitalize text-gray-400">{type}</div>
                            <div className="text-xl font-bold text-white mt-1">
                              ${(cost * markup).toFixed(2)}
                            </div>
                            <div className="text-xs text-gray-500">per month</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {selectedTab === 'providers' && (
                <div className="space-y-4">
                  {aiProviderCosts.map((provider) => {
                    const total = calculateProviderCost(provider);
                    return (
                      <div key={provider.name} className="bg-black/40 p-4 rounded-lg border border-ferrari-red/10">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-medium text-white">{provider.name}</h4>
                          <div className="text-xl font-bold text-white">${total.toFixed(2)}</div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <div className="text-gray-400">Tokens</div>
                            <div className="text-white mt-1">
                              {provider.usage.tokensUsed.toLocaleString()} @ ${provider.costs.tokenRate}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-400">Storage</div>
                            <div className="text-white mt-1">
                              {provider.usage.storageUsed}GB @ ${provider.costs.storageRate}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-400">API Calls</div>
                            <div className="text-white mt-1">
                              {provider.usage.apiCallsMade.toLocaleString()} @ ${provider.costs.apiCalls}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {selectedTab === 'operational' && (
                <div className="space-y-4">
                  {Object.entries(operationalCosts).map(([category, costs]) => (
                    <div key={category} className="bg-black/40 p-4 rounded-lg border border-ferrari-red/10">
                      <h4 className="font-medium text-white capitalize mb-3">{category}</h4>
                      <div className="grid grid-cols-3 gap-4">
                        {Object.entries(costs).map(([item, cost]) => (
                          <div key={item} className="bg-black/20 p-3 rounded-lg">
                            <div className="text-sm text-gray-400 capitalize">{item}</div>
                            <div className="text-lg font-bold text-white mt-1">${(cost as number).toString()}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Add the SideNav component
function SideNav({ onViewChange }: { onViewChange: (isMobile: boolean) => void }) {
  const [showMobileView, setShowMobileView] = useState(false);

  const toggleView = () => {
    setShowMobileView(!showMobileView);
    onViewChange(!showMobileView);
  };

  return (
    <div className={`${showMobileView ? 'w-full' : 'w-64'} h-screen bg-dark-card border-r border-ferrari-red/10 overflow-y-auto`}>
      <div className="px-4 py-4 border-b border-ferrari-red/10">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="flex-shrink-0">
              <FerrariLogo className="w-8 h-8 text-ferrari-red" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-semibold text-white leading-tight">Professional Loan</span>
              <span className="text-sm text-gray-400">Matching</span>
            </div>
          </Link>
          <button
            onClick={toggleView}
            className="px-3 py-1 rounded-full text-sm bg-ferrari-red/20 text-ferrari-red hover:bg-ferrari-red/30 transition-colors"
          >
            {showMobileView ? 'Show Desktop' : 'Show Mobile'}
          </button>
        </div>
      </div>
      
      <div className="py-6">
        {sideNavItems.map((section, idx) => (
          <div key={idx} className="mb-8">
            <div className="px-4 mb-3">
              <h3 className="text-sm font-semibold text-gray-400">{section.section}</h3>
            </div>
            <div className="space-y-2">
              {section.items.map((item, itemIdx) => (
                <Link
                  key={itemIdx}
                  to={item.href}
                  className="flex items-center gap-3 px-4 py-3 text-base text-gray-300 hover:bg-ferrari-red/10 hover:text-white group"
                >
                  <item.icon className="w-5 h-5" />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className={`px-2 py-1 text-sm rounded-full ${
                      item.badge === 'NEW' ? 'bg-ferrari-red/20 text-ferrari-red' :
                      item.badge === 'VIP' ? 'bg-racing-yellow/20 text-racing-yellow' :
                      item.badge === 'LIVE' ? 'bg-green-500/20 text-green-500' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {item.count && (
                    <span className="text-sm text-gray-500">{item.count}</span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="px-4 py-4 border-t border-ferrari-red/10">
        <PricingWidget />
      </div>
    </div>
  );
}

// Sample assistant data with the actual assistants from your system
const assistantData: AssistantStats[] = [
  // Core Assistants
  {
    name: 'JBot',
    status: 'active',
    messages: { daily: 150, weekly: 842, monthly: 3256 },
    avgResponseTime: '1.2s',
    type: 'core',
    lastActive: 'Now',
    imageId: 'fbd6873bbd78',
    size: '3.8 GB',
    age: '43 hours ago',
    cpuUsage: 45,
    memoryUsage: 2.8,
    uptime: 99.9,
    errorRate: 0.1,
    queueLength: 0,
    successRate: 99.9
  },
  {
    name: 'Claude',
    status: 'active',
    messages: { daily: 120, weekly: 756, monthly: 2890 },
    avgResponseTime: '2.1s',
    type: 'core',
    lastActive: '2m ago',
    imageId: '293c0a0aad56',
    size: '4.1 GB',
    age: '43 hours ago',
    cpuUsage: 38,
    memoryUsage: 3.2,
    uptime: 99.8,
    errorRate: 0.2,
    queueLength: 1,
    successRate: 99.8
  },
  {
    name: 'Ollama',
    status: 'active',
    messages: { daily: 89, weekly: 456, monthly: 1890 },
    avgResponseTime: '1.5s',
    type: 'core',
    lastActive: '5m ago',
    imageId: '89fa737d3b85',
    size: '4.1 GB',
    age: '13 days ago',
    cpuUsage: 32,
    memoryUsage: 2.6,
    uptime: 99.7,
    errorRate: 0.3,
    queueLength: 0,
    successRate: 99.7
  },
  {
    name: 'Rasa',
    status: 'inactive',
    messages: { daily: 0, weekly: 234, monthly: 1256 },
    avgResponseTime: '1.8s',
    type: 'core',
    lastActive: '2h ago',
    imageId: '8fdf8f752f6e',
    size: '3.8 GB',
    age: '2 weeks ago',
    cpuUsage: 0,
    memoryUsage: 0,
    uptime: 95.0,
    errorRate: 0,
    queueLength: 0,
    successRate: 100
  },
  // Additional Assistants
  {
    name: 'Camille',
    status: 'active',
    messages: { daily: 45, weekly: 312, monthly: 1245 },
    avgResponseTime: '1.9s',
    type: 'assistant',
    lastActive: '15m ago',
    imageId: '293c0a0aad56',
    size: '4.1 GB',
    age: '43 hours ago',
    cpuUsage: 28,
    memoryUsage: 2.4,
    uptime: 99.5,
    errorRate: 0.5,
    queueLength: 0,
    successRate: 99.5
  },
  {
    name: 'Chloe',
    status: 'active',
    messages: { daily: 38, weekly: 289, monthly: 1156 },
    avgResponseTime: '1.7s',
    type: 'assistant',
    lastActive: '20m ago',
    imageId: '0bd442c5ec29',
    size: '4.1 GB',
    age: '45 hours ago',
    cpuUsage: 25,
    memoryUsage: 2.2,
    uptime: 99.6,
    errorRate: 0.4,
    queueLength: 0,
    successRate: 99.6
  },
  {
    name: 'Cecelia',
    status: 'active',
    messages: { daily: 42, weekly: 298, monthly: 1189 },
    avgResponseTime: '1.8s',
    type: 'assistant',
    lastActive: '10m ago',
    imageId: '21a555d0cb63',
    size: '4.1 GB',
    age: '2 days ago',
    cpuUsage: 27,
    memoryUsage: 2.3,
    uptime: 99.4,
    errorRate: 0.6,
    queueLength: 0,
    successRate: 99.4
  },
  {
    name: 'Crystal',
    status: 'active',
    messages: { daily: 35, weekly: 276, monthly: 1098 },
    avgResponseTime: '1.6s',
    type: 'assistant',
    lastActive: '25m ago',
    imageId: '1b79ca3c938b',
    size: '4.1 GB',
    age: '2 days ago',
    cpuUsage: 24,
    memoryUsage: 2.1,
    uptime: 99.3,
    errorRate: 0.7,
    queueLength: 0,
    successRate: 99.3
  },
  {
    name: 'Claire',
    status: 'active',
    messages: { daily: 40, weekly: 285, monthly: 1145 },
    avgResponseTime: '1.7s',
    type: 'assistant',
    lastActive: '18m ago',
    imageId: 'cf489428b0a6',
    size: '4.1 GB',
    age: '2 days ago',
    cpuUsage: 26,
    memoryUsage: 2.2,
    uptime: 99.5,
    errorRate: 0.5,
    queueLength: 0,
    successRate: 99.5
  },
  {
    name: 'Claudia',
    status: 'active',
    messages: { daily: 37, weekly: 268, monthly: 1078 },
    avgResponseTime: '1.8s',
    type: 'assistant',
    lastActive: '22m ago',
    imageId: 'bab1668136a0',
    size: '4.1 GB',
    age: '2 days ago',
    cpuUsage: 23,
    memoryUsage: 2.0,
    uptime: 99.2,
    errorRate: 0.8,
    queueLength: 0,
    successRate: 99.2
  }
];

const assistantLimits: Record<AssistantStats['type'], AssistantLimits> = {
  core: {
    type: 'core',
    maxDailyMessages: 10000,
    maxConcurrentUsers: 100,
    maxContextLength: 8192,
    maxResponseTime: 30, // seconds
    features: {
      apiAccess: true,
      fileUploads: true,
      customization: true,
      priorityQueue: true,
      systemAccess: true
    },
    resourceLimits: {
      cpuLimit: 100,
      memoryLimit: 16384,
      storageLimit: 100
    }
  },
  assistant: {
    type: 'assistant',
    maxDailyMessages: 5000,
    maxConcurrentUsers: 50,
    maxContextLength: 4096,
    maxResponseTime: 60,
    features: {
      apiAccess: true,
      fileUploads: true,
      customization: false,
      priorityQueue: false,
      systemAccess: false
    },
    resourceLimits: {
      cpuLimit: 50,
      memoryLimit: 8192,
      storageLimit: 50
    }
  },
  staff: {
    type: 'staff',
    maxDailyMessages: 2000,
    maxConcurrentUsers: 20,
    maxContextLength: 2048,
    maxResponseTime: 90,
    features: {
      apiAccess: false,
      fileUploads: true,
      customization: false,
      priorityQueue: false,
      systemAccess: false
    },
    resourceLimits: {
      cpuLimit: 30,
      memoryLimit: 4096,
      storageLimit: 20
    }
  },
  member: {
    type: 'member',
    maxDailyMessages: 1000,
    maxConcurrentUsers: 10,
    maxContextLength: 1024,
    maxResponseTime: 120,
    features: {
      apiAccess: false,
      fileUploads: false,
      customization: false,
      priorityQueue: false,
      systemAccess: false
    },
    resourceLimits: {
      cpuLimit: 20,
      memoryLimit: 2048,
      storageLimit: 10
    }
  }
};

// Add usage tracking function
const checkAssistantLimits = (assistant: AssistantStats): boolean => {
  const limits = assistantLimits[assistant.type];
  
  // Check if daily message limit is exceeded
  if (assistant.messages.daily >= limits.maxDailyMessages) {
    console.warn(`${assistant.name} has reached daily message limit`);
    return false;
  }

  // Check resource usage
  if (assistant.cpuUsage > limits.resourceLimits.cpuLimit ||
      assistant.memoryUsage > limits.resourceLimits.memoryLimit) {
    console.warn(`${assistant.name} has exceeded resource limits`);
    return false;
  }

  return true;
};

function AssistantMonitoring({ stats }: { stats: AssistantStats[] }) {
  const metrics: AssistantMetrics = {
    assistants: stats.length,
    staff: stats.filter(s => s.type === 'staff').length,
    members: stats.filter(s => s.type === 'member').length,
    totalActive: stats.filter(s => s.status === 'active').length
  };

  // Sort assistants: Core first, then by name
  const sortedStats = [...stats].sort((a, b) => {
    if (a.type === 'core' && b.type !== 'core') return -1;
    if (a.type !== 'core' && b.type === 'core') return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Left column - Assistant Status */}
      <div className="space-y-6">
        <div className="grid grid-cols-4 gap-4">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            initial={false}
            style={{ backgroundColor: '#12131a', borderRadius: '0.375rem', padding: '1rem', border: '1px solid rgba(127, 29, 29, 0.3)' }}
          >
            <div className="text-2xl font-bold text-red-500">{metrics.assistants}</div>
            <div className="text-sm text-gray-400">Assistants</div>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            initial={false}
            style={{ backgroundColor: '#12131a', borderRadius: '0.375rem', padding: '1rem', border: '1px solid rgba(161, 98, 7, 0.3)' }}
          >
            <div className="text-2xl font-bold text-yellow-500">{metrics.totalActive}</div>
            <div className="text-sm text-gray-400">Active</div>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            initial={false}
            style={{ backgroundColor: '#12131a', borderRadius: '0.375rem', padding: '1rem', border: '1px solid rgba(22, 101, 52, 0.3)' }}
          >
            <div className="text-2xl font-bold text-green-500">99.7%</div>
            <div className="text-sm text-gray-400">Uptime</div>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            initial={false}
            style={{ backgroundColor: '#12131a', borderRadius: '0.375rem', padding: '1rem', border: '1px solid rgba(59, 130, 246, 0.3)' }}
          >
            <div className="text-2xl font-bold text-blue-500">1.8s</div>
            <div className="text-sm text-gray-400">Avg Response</div>
          </motion.div>
        </div>

        <div className="bg-black/60 backdrop-blur-md rounded-xl p-6 border border-ferrari-red/30">
          <h3 className="text-lg font-semibold text-white mb-4">Assistant Status</h3>
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {sortedStats.map((assistant) => (
              <div key={assistant.name} className="flex items-center justify-between p-3 bg-dark-card rounded-lg border border-ferrari-red/10">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    assistant.status === 'active' ? 'bg-green-500' : 'bg-gray-500'
                  }`} />
                  <div>
                    <div className="text-sm font-medium text-white">{assistant.name}</div>
                    <div className="text-xs text-gray-400">
                      {assistant.imageId.slice(0, 8)} • {assistant.size}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-sm font-medium text-white">{assistant.cpuUsage}%</div>
                    <div className="text-xs text-gray-400">CPU</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-white">{assistant.memoryUsage}GB</div>
                    <div className="text-xs text-gray-400">RAM</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-white">{assistant.successRate}%</div>
                    <div className="text-xs text-gray-400">Success</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right column - Performance Metrics */}
      <div className="space-y-6">
        <div className="bg-black/60 backdrop-blur-md rounded-xl p-6 border border-ferrari-red/30">
          <h3 className="text-lg font-semibold text-white mb-4">Performance Metrics</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-dark-card rounded-lg p-4 border border-ferrari-red/10">
                <h4 className="text-sm font-medium text-gray-400 mb-2">System Load</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-white">32.4%</div>
                    <div className="text-sm text-gray-400">Average CPU</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">2.6GB</div>
                    <div className="text-sm text-gray-400">Memory Used</div>
                  </div>
                </div>
              </div>
              <div className="bg-dark-card rounded-lg p-4 border border-ferrari-red/10">
                <h4 className="text-sm font-medium text-gray-400 mb-2">Response Times</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-white">1.7s</div>
                    <div className="text-sm text-gray-400">Average</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">2.8s</div>
                    <div className="text-sm text-gray-400">Peak</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-dark-card rounded-lg p-4 border border-ferrari-red/10">
                <h4 className="text-sm font-medium text-gray-400 mb-2">Message Volume</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-white">556</div>
                    <div className="text-sm text-gray-400">Today</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">15.2k</div>
                    <div className="text-sm text-gray-400">Monthly</div>
                  </div>
                </div>
              </div>
              <div className="bg-dark-card rounded-lg p-4 border border-ferrari-red/10">
                <h4 className="text-sm font-medium text-gray-400 mb-2">Success Rate</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-white">99.5%</div>
                    <div className="text-sm text-gray-400">Success</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">0.5%</div>
                    <div className="text-sm text-gray-400">Error</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-black/60 backdrop-blur-md rounded-xl p-6 border border-ferrari-red/30">
          <h3 className="text-lg font-semibold text-white mb-4">Lender Updates</h3>
          <div className="space-y-4">
            {/* Move your existing lender updates content here */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FerrariDashboard() {
  const [speed, setSpeed] = useState(0);
  const [rpm, setRpm] = useState(1000);
  const [fuel, setFuel] = useState(100);
  const [selectedUpdate, setSelectedUpdate] = useState<string | null>(null);
  const [isTestDriving, setIsTestDriving] = useState(false);
  const [carPosition, setCarPosition] = useState({ x: 50, y: 50 });
  const [carDirection, setCarDirection] = useState(0); // degrees
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [assistantTip, setAssistantTip] = useState("Use arrow keys to navigate. Try to reach high speeds while maintaining control!");
  const [showAssistantMessage, setShowAssistantMessage] = useState(false);
  const [activeSection, setActiveSection] = useState('Bot Management');
  const [systemHealth, setSystemHealth] = useState({
    cpu: 45,
    memory: 68,
    storage: 32,
    network: 89
  });

  // Add new state for bot metrics
  const [botMetrics, setBotMetrics] = useState({
    activeUsers: 128,
    responseTime: 234, // ms
    accuracy: 97.5,
    trainingProgress: 78
  });
  
  // Sample lender updates
  const lenderUpdates: LenderUpdate[] = [
    {
      id: 'update-1',
      title: 'New Interest Rate Changes',
      description: 'Federal Reserve has announced new interest rate changes affecting mortgage loans. Review the updated rates for your clients.',
      date: 'Today, 10:30 AM',
      priority: 'high',
      read: false
    },
    {
      id: 'update-2',
      title: 'Compliance Update Required',
      description: 'New regulatory compliance documents need to be reviewed and acknowledged by all lenders by end of week.',
      date: 'Today, 9:15 AM',
      priority: 'high',
      read: false
    },
    {
      id: 'update-3',
      title: 'Client Satisfaction Survey Results',
      description: 'Q2 client satisfaction survey results are now available. Overall satisfaction has increased by 12%.',
      date: 'Yesterday',
      priority: 'medium',
      read: true
    },
    {
      id: 'update-4',
      title: 'New Marketing Materials',
      description: 'New marketing materials for the summer campaign are now available in the resource center.',
      date: 'Jul 15',
      priority: 'low',
      read: true
    }
  ];
  
  // Street maze data
  const streetMaze: StreetNode[] = [
    { x: 50, y: 50, connections: [1, 3] },
    { x: 150, y: 50, connections: [0, 2, 4] },
    { x: 250, y: 50, connections: [1, 5] },
    { x: 50, y: 150, connections: [0, 4, 6] },
    { x: 150, y: 150, connections: [1, 3, 5, 7] },
    { x: 250, y: 150, connections: [2, 4, 8] },
    { x: 50, y: 250, connections: [3, 7] },
    { x: 150, y: 250, connections: [4, 6, 8] },
    { x: 250, y: 250, connections: [5, 7] }
  ];
  
  // Simulate dashboard metrics
  useEffect(() => {
    if (!isTestDriving) return;

    const interval = setInterval(() => {
      setSpeed(prev => {
        const newSpeed = prev + (Math.random() * 10 - 5);
        return Math.max(0, Math.min(200, newSpeed));
      });
      
      setRpm(prev => {
        const newRpm = prev + (Math.random() * 500 - 250);
        return Math.max(1000, Math.min(8000, newRpm));
      });
      
      setFuel(prev => Math.max(0, prev - 0.1));
    }, 500);
    
    return () => clearInterval(interval);
  }, [isTestDriving]);
  
  // Draw street maze
  useEffect(() => {
    if (!canvasRef.current || !isTestDriving) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw streets
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 10;
    
    streetMaze.forEach(node => {
      node.connections.forEach(connIdx => {
        const connNode = streetMaze[connIdx];
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(connNode.x, connNode.y);
        ctx.stroke();
      });
    });
    
    // Draw nodes
    ctx.fillStyle = '#666';
    streetMaze.forEach(node => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, 5, 0, Math.PI * 2);
      ctx.fill();
    });
    
    // Draw car
    ctx.save();
    ctx.translate(carPosition.x, carPosition.y);
    ctx.rotate(carDirection * Math.PI / 180);
    
    // Car body
    ctx.fillStyle = '#FF2800'; // Ferrari Red
    ctx.beginPath();
    ctx.roundRect(-15, -8, 30, 16, 5);
    ctx.fill();
    
    // Windshield
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.roundRect(-8, -6, 10, 12, 2);
    ctx.fill();
    
    ctx.restore();
    
  }, [isTestDriving, carPosition, carDirection, streetMaze]);
  
  // Handle keyboard controls for test drive
  useEffect(() => {
    if (!isTestDriving) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      const moveSpeed = 5;
      
      switch(e.key) {
        case 'ArrowUp':
          setCarPosition(prev => ({
            x: prev.x + moveSpeed * Math.cos(carDirection * Math.PI / 180),
            y: prev.y + moveSpeed * Math.sin(carDirection * Math.PI / 180)
          }));
          if (speed > 100) {
            setAssistantTip("Great speed! Remember to slow down for corners. Your driving skills qualify you for our premium financing options!");
          }
          break;
        case 'ArrowDown':
          setCarPosition(prev => ({
            x: prev.x - moveSpeed * Math.cos(carDirection * Math.PI / 180),
            y: prev.y - moveSpeed * Math.sin(carDirection * Math.PI / 180)
          }));
          setAssistantTip("Backing up? Try using the forward gears to experience the full power of the Ferrari!");
          break;
        case 'ArrowLeft':
          setCarDirection(prev => prev - 15);
          if (speed > 80) {
            setAssistantTip("Taking corners at high speed - impressive control! You'd qualify for our performance driver discount!");
          }
          break;
        case 'ArrowRight':
          setCarDirection(prev => prev + 15);
          if (speed > 80) {
            setAssistantTip("Sharp turning at high speeds! Your driving skills are exceptional. Ready to discuss financing options?");
          }
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTestDriving, carDirection, speed]);
  
  const startTestDrive = () => {
    setIsTestDriving(true);
    setCarPosition({ x: 50, y: 50 });
    setCarDirection(0);
    setFuel(100);
  };
  
  const endTestDrive = () => {
    setIsTestDriving(false);
  };
  
  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-blue-500';
    }
  };
  
  const [activeRaces, setActiveRaces] = useState<RaceTrack[]>([
    { id: 'loan-123', type: 'Bridge Loan', progress: 15, color: '#e10600' },
    { id: 'loan-456', type: 'Construction', progress: 42, color: '#6b46c1' },
    { id: 'loan-789', type: 'Development', progress: 28, color: '#f59e0b' }
  ]);

  const [jbotCore, setJbotCore] = useState<JBotCoreStatus>({
    active: true,
    mode: 'race',
    securityLevel: 'maximum',
    lastModified: new Date().toISOString()
  });

  // Sort assistants: Core first, then by name
  const sortedStats = [...assistantData].sort((a, b) => {
    if (a.type === 'core' && b.type !== 'core') return -1;
    if (a.type !== 'core' && b.type === 'core') return 1;
    return a.name.localeCompare(b.name);
  });

  const renderPitWallAnalytics = () => (
    <div className="bg-[#1a1a1f] rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Gauge className="h-5 w-5 text-yellow-500 mr-2" />
          <h2 className="text-lg font-semibold">Pit Wall Analytics</h2>
        </div>
        <button className="text-sm text-yellow-500 hover:text-yellow-400">
          View Telemetry <ChevronRight className="h-4 w-4 inline-block ml-1" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          initial={false}
          style={{ backgroundColor: '#12131a', borderRadius: '0.375rem', padding: '1rem', border: '1px solid rgba(127, 29, 29, 0.3)' }}
        >
          <div className="text-2xl font-bold text-red-500">94%</div>
          <div className="text-sm text-gray-400">Qualifying Rate</div>
        </motion.div>
        <motion.div 
          whileHover={{ scale: 1.05 }}
          initial={false}
          style={{ backgroundColor: '#12131a', borderRadius: '0.375rem', padding: '1rem', border: '1px solid rgba(161, 98, 7, 0.3)' }}
        >
          <div className="text-2xl font-bold text-yellow-500">$4.2M</div>
          <div className="text-sm text-gray-400">Circuit Revenue</div>
        </motion.div>
        <motion.div 
          whileHover={{ scale: 1.05 }}
          initial={false}
          style={{ backgroundColor: '#12131a', borderRadius: '0.375rem', padding: '1rem', border: '1px solid rgba(22, 101, 52, 0.3)' }}
        >
          <div className="text-2xl font-bold text-green-500">24</div>
          <div className="text-sm text-gray-400">Active Racers</div>
        </motion.div>
      </div>

      {/* Race Track Visualizer */}
      <div className="mt-6 bg-[#12131a] rounded-lg p-4">
        <h3 className="text-sm font-semibold mb-4">Active Races</h3>
        <div className="relative h-48 overflow-hidden rounded-md">
          <svg viewBox="0 0 1000 600" className="w-full h-full">
            <defs>
              <linearGradient id="trackGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: '#1a1b21' }} />
                <stop offset="50%" style={{ stopColor: '#2a2b33' }} />
                <stop offset="100%" style={{ stopColor: '#1a1b21' }} />
              </linearGradient>
            </defs>
            <path 
              d="M100,300 C100,200 300,100 500,100 C700,100 900,200 900,300 C900,400 700,500 500,500 C300,500 100,400 100,300 Z" 
              fill="none"
              stroke="url(#trackGradient)"
              strokeWidth="40"
            />
            {activeRaces.map((race) => {
              const position = race.progress / 100;
              const pathLength = 2400; // Approximate path length
              const point = position * pathLength;
              return (
                <motion.circle
                  key={race.id}
                  cx={100 + (point % 800)}
                  cy={300 + Math.sin(point / 100) * 200}
                  r="8"
                  fill={race.color}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                />
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );

  // Add JBot Core Controls section
  const renderJBotCoreControls = () => (
    <div className="bg-[#0a0b0f] rounded-2xl p-6 border border-red-500/10">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-3">
          <Bot className="w-6 h-6 text-red-500" />
          JBot Core Controls
        </h3>
        <div className={`px-3 py-1 rounded-full text-sm ${
          jbotCore.active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
        }`}>
          {jbotCore.active ? 'Active' : 'Inactive'}
        </div>
      </div>
      
      <div className="grid gap-4">
        <div className="bg-black/20 rounded-xl p-4 border border-red-500/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-red-500" />
              <span className="text-white">Security Level</span>
            </div>
            <select 
              value={jbotCore.securityLevel}
              onChange={(e) => setJbotCore(prev => ({ ...prev, securityLevel: e.target.value as any }))}
              className="bg-black/30 border border-red-500/10 rounded-lg px-3 py-1 text-red-400"
            >
              <option value="maximum">Maximum</option>
              <option value="high">High</option>
              <option value="standard">Standard</option>
            </select>
          </div>
        </div>

        <div className="bg-black/20 rounded-xl p-4 border border-red-500/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Gauge className="w-5 h-5 text-red-500" />
              <span className="text-white">Operation Mode</span>
            </div>
            <select 
              value={jbotCore.mode}
              onChange={(e) => setJbotCore(prev => ({ ...prev, mode: e.target.value as any }))}
              className="bg-black/30 border border-red-500/10 rounded-lg px-3 py-1 text-red-400"
            >
              <option value="race">Race</option>
              <option value="qualifying">Qualifying</option>
              <option value="practice">Practice</option>
            </select>
          </div>
        </div>

        <button 
          onClick={() => setJbotCore(prev => ({ ...prev, active: !prev.active }))}
          className={`w-full mt-4 px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
            jbotCore.active 
              ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
              : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
          }`}
        >
          <Power className="w-5 h-5" />
          {jbotCore.active ? 'Deactivate JBot Core' : 'Activate JBot Core'}
        </button>

        <p className="text-xs text-gray-500 mt-2">
          Last modified: {new Date(jbotCore.lastModified).toLocaleString()}
        </p>
      </div>
    </div>
  );

  const [showMobileView, setShowMobileView] = useState(false);

  return (
    <div className="flex h-screen bg-[#0a0b0f]">
      <SideNav onViewChange={setShowMobileView} />
      {!showMobileView && (
        <div className="flex-1 relative overflow-hidden">
          {/* Background Image */}
          <div 
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: 'url("/images/ferrari_cruise.svg")',
              backgroundSize: '100%',
              backgroundPosition: 'bottom',
              backgroundRepeat: 'no-repeat',
              transition: 'all 0.5s ease-out'
            }}
          />
          
          {/* Content Overlay */}
          <div className="relative z-10 p-8">
            {/* Profile Header */}
            <div className="mb-8">
              <div className="bg-black/60 backdrop-blur-md rounded-xl p-6 border border-ferrari-red/30 flex items-center gap-6 hover:border-ferrari-red/50 transition-all duration-300">
                <div className="relative w-28 h-28 rounded-lg overflow-hidden border-2 border-ferrari-red/50 bg-white">
                  <img
                    src="/images/jbot.jpg"
                    alt="JBot Profile"
                    className="rounded-lg object-cover object-center scale-[1.35] w-full h-full"
                  />
                </div>
                <div className="flex flex-col">
                  <h1 className="text-4xl font-bold text-white mb-2">JBot Ferrari <span className="text-ferrari-red">Dashboard</span></h1>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-ferrari-red/20 text-ferrari-red text-sm rounded-full">Elite Driver</span>
                    <span className="px-3 py-1 bg-racing-yellow/20 text-racing-yellow text-sm rounded-full">VIP Status</span>
                    <button 
                      onClick={() => window.location.href = '/training-center'}
                      className="px-4 py-1.5 bg-green-500/20 text-green-400 text-sm rounded-full hover:bg-green-500/30 transition-colors flex items-center gap-2 border border-green-500/30"
                    >
                      <Brain className="w-4 h-4" />
                      Training Center
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Grid Layout */}
            <div className="grid grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Performance Metrics */}
                <div className="bg-black/60 backdrop-blur-md rounded-xl p-6 border border-ferrari-red/30">
                  <h2 className="text-xl font-semibold text-white mb-4">Performance Metrics</h2>
                  <div className="grid grid-cols-3 gap-4">
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      initial={false}
                      style={{ 
                        backgroundColor: 'rgba(0, 0, 0, 0.4)',
                        borderRadius: '0.5rem',
                        padding: '1rem',
                        border: '1px solid rgba(239, 68, 68, 0.1)',
                        textAlign: 'center'
                      }}
                    >
                      <div className="text-2xl font-bold text-ferrari-red">94%</div>
                      <div className="text-sm text-gray-400">Approval Rate</div>
                    </motion.div>
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      initial={false}
                      style={{ 
                        backgroundColor: 'rgba(0, 0, 0, 0.4)',
                        borderRadius: '0.5rem',
                        padding: '1rem',
                        border: '1px solid rgba(234, 179, 8, 0.1)',
                        textAlign: 'center'
                      }}
                    >
                      <div className="text-2xl font-bold text-racing-yellow">$4.2M</div>
                      <div className="text-sm text-gray-400">Monthly Volume</div>
                    </motion.div>
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      initial={false}
                      className="text-center p-4 bg-black/40 rounded-lg border border-green-500/10"
                    >
                      <div className="text-2xl font-bold text-green-500">24</div>
                      <div className="text-sm text-gray-400">Active Clients</div>
                    </motion.div>
                  </div>
                </div>

                {/* Assistant Status */}
                <div className="bg-black/60 backdrop-blur-md rounded-xl p-6 border border-ferrari-red/30">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-white">Assistant Status</h2>
                    <div className="flex gap-4">
                      <div className="text-center">
                        <div className="text-sm font-medium text-white">10</div>
                        <div className="text-xs text-gray-400">Total</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium text-green-500">9</div>
                        <div className="text-xs text-gray-400">Active</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium text-blue-500">99.7%</div>
                        <div className="text-xs text-gray-400">Uptime</div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {sortedStats.map((assistant) => (
                      <div key={assistant.name} className="flex items-center justify-between p-3 bg-black/40 rounded-lg border border-ferrari-red/10">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${
                            assistant.status === 'active' ? 'bg-green-500' : 'bg-gray-500'
                          }`} />
                          <div>
                            <div className="text-sm font-medium text-white">{assistant.name}</div>
                            <div className="text-xs text-gray-400">
                              {assistant.imageId.slice(0, 8)} • {assistant.size}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <div className="text-sm font-medium text-white">{assistant.cpuUsage}%</div>
                            <div className="text-xs text-gray-400">CPU</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-medium text-white">{assistant.memoryUsage}GB</div>
                            <div className="text-xs text-gray-400">RAM</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-medium text-white">{assistant.successRate}%</div>
                            <div className="text-xs text-gray-400">Success</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Most Active Assistants */}
                <div className="bg-black/60 backdrop-blur-md rounded-xl p-6 border border-ferrari-red/30">
                  <h2 className="text-xl font-semibold text-white mb-4">Most Active Assistants</h2>
                  <div className="space-y-3">
                    {[...assistantData]
                      .sort((a, b) => b.messages.daily - a.messages.daily)
                      .slice(0, 10)
                      .map((assistant) => (
                        <div key={assistant.name} className="flex items-center justify-between p-3 bg-black/40 rounded-lg border border-ferrari-red/10">
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${
                              assistant.status === 'active' ? 'bg-green-500' : 'bg-gray-500'
                            }`} />
                            <div>
                              <div className="text-sm font-medium text-white">{assistant.name}</div>
                              <div className="text-xs text-gray-400">Last active: {assistant.lastActive}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="text-center">
                              <div className="text-sm font-medium text-white">{assistant.messages.daily}</div>
                              <div className="text-xs text-gray-400">Today</div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm font-medium text-white">{assistant.messages.weekly}</div>
                              <div className="text-xs text-gray-400">Week</div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm font-medium text-white">{assistant.messages.monthly}</div>
                              <div className="text-xs text-gray-400">Month</div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm font-medium text-white">{assistant.avgResponseTime}</div>
                              <div className="text-xs text-gray-400">Avg Response</div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Base Models Section */}
                <div className="bg-black/60 backdrop-blur-md rounded-xl p-6 border border-ferrari-red/30">
                  <h2 className="text-xl font-semibold text-white mb-4">Base Models</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <Link to="/llama2" className="bg-black/40 rounded-lg p-4 border border-ferrari-red/10 hover:border-ferrari-red/30 transition-all">
                      <h4 className="text-lg font-medium text-white mb-1">Llama2</h4>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-sm">Age: 1 year</span>
                        <span className="text-gray-400 text-sm">Base Model</span>
                      </div>
                    </Link>
                    <Link to="/mistral" className="bg-black/40 rounded-lg p-4 border border-ferrari-red/10 hover:border-ferrari-red/30 transition-all">
                      <h4 className="text-lg font-medium text-white mb-1">Mistral</h4>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-sm">Age: 6 months</span>
                        <span className="text-gray-400 text-sm">Base Model</span>
                      </div>
                    </Link>
                    <Link to="/codellama" className="bg-black/40 rounded-lg p-4 border border-ferrari-red/10 hover:border-ferrari-red/30 transition-all">
                      <h4 className="text-lg font-medium text-white mb-1">CodeLlama</h4>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-sm">Age: 8 months</span>
                        <span className="text-gray-400 text-sm">Base Model</span>
                      </div>
                    </Link>
                    <Link to="/neural-chat" className="bg-black/40 rounded-lg p-4 border border-ferrari-red/10 hover:border-ferrari-red/30 transition-all">
                      <h4 className="text-lg font-medium text-white mb-1">Neural Chat</h4>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-sm">Age: 3 months</span>
                        <span className="text-gray-400 text-sm">Base Model</span>
                      </div>
                    </Link>
                  </div>
                </div>

              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* System Metrics */}
                <div className="bg-black/60 backdrop-blur-md rounded-xl p-6 border border-ferrari-red/30">
                  <h2 className="text-xl font-semibold text-white mb-4">System Metrics</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black/40 rounded-lg p-4 border border-ferrari-red/10">
                      <h4 className="text-sm font-medium text-gray-400 mb-2">System Load</h4>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl font-bold text-white">32.4%</div>
                          <div className="text-sm text-gray-400">Average CPU</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-white">2.6GB</div>
                          <div className="text-sm text-gray-400">Memory Used</div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-black/40 rounded-lg p-4 border border-ferrari-red/10">
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Response Times</h4>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl font-bold text-white">1.7s</div>
                          <div className="text-sm text-gray-400">Average</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-white">2.8s</div>
                          <div className="text-sm text-gray-400">Peak</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lender Updates */}
                <div className="bg-black/60 backdrop-blur-md rounded-xl p-6 border border-ferrari-red/30">
                  <h2 className="text-xl font-semibold text-white mb-4">Lender Updates</h2>
                  <div className="space-y-3">
                    {lenderUpdates.map(update => (
                      <div 
                        key={update.id}
                        className="bg-black/40 rounded-lg p-4 hover:bg-black/60 transition-colors"
                      >
                        <div className="flex items-start">
                          <div className={`w-2 h-2 mt-2 rounded-full ${getPriorityColor(update.priority)} mr-3`} />
                          <div>
                            <h3 className="font-medium text-white">{update.title}</h3>
                            <p className="text-sm text-gray-400 mt-1">{update.description}</p>
                            <span className="text-xs text-gray-500 mt-2 block">{update.date}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <ChatButton assistantId="jbot" />
    </div>
  );
} 

