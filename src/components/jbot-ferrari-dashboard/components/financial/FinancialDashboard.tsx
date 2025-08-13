import React, { useState, useRef, useEffect, useCallback } from 'react';
import CodeLlamaWidget from '../../../components/CodeLlamaWidget';
import DirectChat from '../../../pages/DirectChat';
import ModelStatusWidget from '../../../components/ModelWarmupStatus';
import {
  Mail,
  FileText,
  MessageSquare,
  DollarSign,
  PieChart,
  BarChart2,
  Calendar,
  Inbox,
  Send,
  Archive,
  Trash2,
  Folder,
  Plus,
  Search,
  Filter,
  Upload,
  Clock,
  CreditCard,
  Pencil,
  Bot,
  X
} from 'lucide-react';
import AccountsSection from './AccountsSection';
import CanvasSection from './CanvasSection';
import Editor from '@monaco-editor/react';
import * as monaco from 'monaco-editor';

interface EmailMessage {
  id: string;
  from: string;
  subject: string;
  date: string;
  content: string;
  attachments: Array<{
    name: string;
    type: string;
    size: number;
  }>;
  category: 'invoice' | 'receipt' | 'statement' | 'other';
  processed: boolean;
}

interface FinancialDocument {
  id: string;
  name: string;
  type: 'invoice' | 'receipt' | 'statement' | 'report' | 'projection' | 'other';
  date: string;
  amount?: number;
  category: string;
  tags: string[];
  path: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  attachments?: FinancialDocument[];
  relatedDocuments?: FinancialDocument[];
}

interface FinancialMetrics {
  cashFlow: {
    incoming: number;
    outgoing: number;
    projected: number;
  };
  expenses: {
    category: string;
    amount: number;
    trend: 'up' | 'down' | 'stable';
  }[];
  revenue: {
    current: number;
    projected: number;
    growth: number;
  };
  profitLoss: {
    profit: number;
    loss: number;
    margin: number;
  };
}

interface Message {
  role: string;
  content: string;
  created_at: string;
}

interface Conversation {
  id: number;
  created_at: string;
  source: string;
  topic: string;
  messages: Message[];
  raw_text: string;
  format?: string;
}

// Move interfaces to top
interface ConversationsSectionProps {
  conversations: Conversation[];
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>;
  documents: {
    folders: string[];
    items: FinancialDocument[];
  };
}

// Add the topics constant
const TOPICS = {
  'DASHBOARD FEATURES': [
    'Builders/Developers Dashboard',
    'Brokers Dashboard',
    'Lenders Dashboard',
    'Bot Training Dashboard',
    'Financial Overview'
  ],
  'COMMON AREAS': [
    'AiiQ Vision',
    '3 Step Process',
    'Lender Matching',
    'Project Evaluation',
    'Whiteboard Room',
    'CyberCafe',
    'Executive Suite'
  ],
  'AIIQ TOOLS': [
    'Market Reports',
    'Presentation Builder',
    'Document Templates',
    'Document Center',
    'Status Tracking',
    'Project Pipeline',
    'Analytics Suite'
  ],
  'PROCESS STATUS': [
    'Initial Review',
    'Scoring Analysis',
    'Document Status',
    'Matching Progress'
  ],
  'AI SERVICES': [
    'JBot',
    'Rasa',
    'Ollama',
    'Claude'
  ],
  'SECURITY & COMPLIANCE': [
    'Pricing',
    'Terms & Conditions',
    'Privacy Policy'
  ],
  'QUICK ACCESS': [
    'Text',
    'Code',
    'Design',
    'Vault',
    'AI',
    'Data',
    'Chat'
  ]
};

// Add a localStorageService for conversations
const localStorageService = {
  getConversations: () => {
    try {
      const saved = localStorage.getItem('aiiq_conversations');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Error retrieving conversations from localStorage:', e);
      return [];
    }
  },
  
  saveConversation: (conversation: Conversation) => {
    try {
      const conversations = localStorageService.getConversations();
      conversations.unshift(conversation);
      localStorage.setItem('aiiq_conversations', JSON.stringify(conversations));
      return true;
    } catch (e) {
      console.error('Error saving conversation to localStorage:', e);
      return false;
    }
  }
};

// Move ConversationsSection outside of FinancialDashboard
const ConversationsSection: React.FC<ConversationsSectionProps> = ({
  conversations,
  setConversations,
  documents
}) => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedSource, setSelectedSource] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [showCanvas, setShowCanvas] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<string>('text');
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const contentRef = useRef('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [color, setColor] = useState('#FFFFFF');
  const [lineWidth, setLineWidth] = useState(2);
  const lastPos = useRef({ x: 0, y: 0 });

  const sources = ['claude', 'cursor', 'openai', 'ollama', 'rasa', 'other'];
  const formats = [
    { value: 'text', label: 'Plain Text (.txt)', language: 'plaintext' },
    { value: 'json', label: 'JSON (.json)', language: 'json' },
    { value: 'md', label: 'Markdown (.md)', language: 'markdown' },
    { value: 'html', label: 'HTML (.html)', language: 'html' },
    { value: 'js', label: 'JavaScript (.js)', language: 'javascript' },
    { value: 'ts', label: 'TypeScript (.ts)', language: 'typescript' },
    { value: 'jsx', label: 'React JSX (.jsx)', language: 'javascript' },
    { value: 'tsx', label: 'React TSX (.tsx)', language: 'typescript' },
    { value: 'python', label: 'Python (.py)', language: 'python' },
    { value: 'sql', label: 'SQL (.sql)', language: 'sql' },
    { value: 'env', label: 'Environment (.env)', language: 'plaintext' },
    { value: 'css', label: 'CSS (.css)', language: 'css' },
  ];

  useEffect(() => {
    if (showCanvas && canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        setContext(ctx);
      }
    }
  }, [showCanvas]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!context) return;
    setIsDrawing(true);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      lastPos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !context || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const currentPos = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };

    context.beginPath();
    context.moveTo(lastPos.current.x, lastPos.current.y);
    context.lineTo(currentPos.x, currentPos.y);
    context.stroke();

    lastPos.current = currentPos;
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    if (context && canvasRef.current) {
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  // Update fetchConversations to use localStorage
  const fetchConversations = useCallback(async (source?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Get conversations from localStorage
      const allConversations = localStorageService.getConversations();
      
      // Filter by source if specified
      const filteredConversations = source
        ? allConversations.filter((conv: Conversation) => conv.source === source)
        : allConversations;
      
      setConversations(filteredConversations);
    } catch (e) {
      console.error("Error fetching conversations:", e);
      setError("Could not load conversations");
    } finally {
      setLoading(false);
    }
  }, [setConversations, setLoading, setError]);

  // Update conversations when source changes
  useEffect(() => {
    fetchConversations(selectedSource);
  }, [selectedSource, fetchConversations]);

  function handleEditorDidMount(editor: monaco.editor.IStandaloneCodeEditor) {
    editorRef.current = editor;
    editor.setValue(contentRef.current);
  }

  const handleEditorChange = (value: string | undefined) => {
    contentRef.current = value || '';
  };

  // Update handleSave to use localStorage
  const handleSave = async (topic: string) => {
    if (!editorRef.current) return;
    
    const content = contentRef.current;
    if (!content.trim()) return;

    setError(null);
    setSuccess(null);

    // Get the selected format
    const format = formats.find(f => f.value === selectedFormat) || formats[0];

    try {
      // Create conversation object
      const newConversation = {
        id: Date.now(),
        created_at: new Date().toISOString(),
        source: selectedSource || 'cursor',
        topic: topic || 'Untitled',
        format: selectedFormat || 'text',
        messages: [
          { role: 'user', content, created_at: new Date().toISOString() }
        ],
        raw_text: content
      };
      
      // Save to localStorage
      const saved = localStorageService.saveConversation(newConversation);
      
      if (saved) {
        // Clear editor
        contentRef.current = '';
        editorRef.current.setValue('');
        
        // Refresh conversations
        fetchConversations(selectedSource);
        
        setSuccess(`Conversation saved successfully in ${format.label} format!`);
        setTimeout(() => setSuccess(null), 3000);
      } else {
        throw new Error('Failed to save conversation');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save conversation');
      console.error('Error saving conversation:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-[3fr_1fr] gap-6">
        <div className="bg-black/20 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Conversation History</h3>
            <div className="flex items-center space-x-2">
              <select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                className="bg-black/30 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ferrari-red/50"
              >
                <option value="">All Sources</option>
                <option value="financial-report">Financial Reports</option>
                <option value="investment">Investments</option>
                <option value="budget">Budget</option>
                <option value="jbot">JBot</option>
              </select>
              <button
                onClick={() => fetchConversations(selectedSource)}
                className="px-3 py-2 bg-ferrari-red/10 hover:bg-ferrari-red/20 text-ferrari-red rounded-lg text-sm"
              >
                Refresh
              </button>
            </div>
          </div>
          
          {/* Add error message display */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg mb-4 flex items-center">
              <div className="mr-2">⚠️</div>
              <div>{error}</div>
            </div>
          )}
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left">ID</th>
                  <th className="text-left">Date</th>
                  <th className="text-left">Topic</th>
                  <th className="text-left">Source</th>
                  <th className="text-left">Format</th>
                  <th className="text-left">Conversation</th>
                </tr>
              </thead>
              <tbody>
                {conversations && conversations.map((conv) => (
                  <tr key={conv.id} className="border-t border-ferrari-red/10">
                    <td className="py-2">{conv.id}</td>
                    <td className="py-2">{new Date(conv.created_at).toLocaleString()}</td>
                    <td className="py-2 capitalize">{conv.topic}</td>
                    <td className="py-2 capitalize">{conv.source}</td>
                    <td className="py-2">{conv.format || 'text'}</td>
                    <td className="py-2">
                      <pre className="whitespace-pre-wrap bg-black/80 p-2 rounded text-sm font-mono overflow-auto max-h-40">
                        {conv.raw_text}
                      </pre>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Monaco Editor for new conversations */}
      <div className="grid grid-cols-[3fr_1fr] gap-6">
        <div className="bg-black/20 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">New Conversation</h3>
            <div className="flex items-center space-x-2">
              <select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                className="bg-black/30 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ferrari-red/50"
              >
                <option value="">Select Source</option>
                {sources.map((source) => (
                  <option key={source} value={source}>
                    {source.charAt(0).toUpperCase() + source.slice(1)}
                  </option>
                ))}
              </select>
              
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="bg-black/30 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ferrari-red/50"
              >
                <option value="">Select Topic</option>
                {Object.entries(TOPICS).map(([category, topics]) => (
                  <optgroup key={category} label={category}>
                    {topics.map((topic) => (
                      <option key={topic} value={topic}>
                        {topic}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              
              <select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="bg-black/30 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ferrari-red/50"
              >
                <option value="">Select Format</option>
                {formats.map((format) => (
                  <option key={format.value} value={format.value}>
                    {format.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Success message */}
          {success && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-3 rounded-lg mb-4 flex items-center">
              <div className="mr-2">✓</div>
              <div>{success}</div>
            </div>
          )}
          
          <div className="mb-4 relative">
            <div className="h-[600px] border border-ferrari-red/10 rounded-lg overflow-hidden">
              {!showCanvas ? (
                <Editor
                  height="100%"
                  defaultLanguage="markdown"
                  language={formats.find(f => f.value === selectedFormat)?.language || 'markdown'}
                  defaultValue=""
                  theme="vs-dark"
                  onMount={handleEditorDidMount}
                  onChange={handleEditorChange}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    rulers: [],
                    wordWrap: 'on',
                    wordBasedSuggestions: 'off',
                    autoClosingQuotes: 'never',
                    autoIndent: 'none',
                    formatOnPaste: false,
                    formatOnType: false
                  }}
                />
              ) : (
                <div className="w-full h-full bg-black/40 flex items-center justify-center">
                  <canvas
                    ref={canvasRef}
                    width="800"
                    height="600"
                    className="border border-ferrari-red/10 bg-black"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                  />
                </div>
              )}
            </div>
            
            <div className="absolute bottom-4 right-4 flex items-center gap-2">
              <button
                onClick={() => setShowCanvas(!showCanvas)}
                className="p-2 bg-ferrari-red/10 hover:bg-ferrari-red/20 text-ferrari-red rounded-lg"
                title={showCanvas ? "Switch to Text Editor" : "Switch to Canvas"}
              >
                <Pencil className="w-4 h-4" />
              </button>
              
              {showCanvas && (
                <>
                  <button
                    onClick={clearCanvas}
                    className="p-2 bg-ferrari-red/10 hover:bg-ferrari-red/20 text-ferrari-red rounded-lg"
                    title="Clear Canvas"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer"
                    title="Change Color"
                  />
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={lineWidth}
                    onChange={(e) => setLineWidth(parseInt(e.target.value))}
                    className="w-24"
                    title="Change Line Width"
                  />
                </>
              )}
            </div>
          </div>
          
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSave(selectedTopic || 'Untitled')}
                disabled={loading}
                className="px-4 py-2 bg-ferrari-red hover:bg-ferrari-red/80 text-white rounded-lg flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <span>Save Conversation</span>
                  </>
                )}
              </button>
            </div>
            
            <div className="text-sm text-gray-400">
              Format: Human: message<br />Assistant: response
            </div>
          </div>
        </div>
        
        <div className="bg-black/20 p-4 rounded-lg">
          <h3 className="font-medium mb-4">Related Documents</h3>
          <div className="space-y-2">
            {documents.items.slice(0, 5).map((doc) => (
              <div key={doc.id} className="p-2 bg-black/40 rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium">{doc.name}</span>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {new Date(doc.date).toLocaleDateString()} • {doc.type}
                </div>
              </div>
            ))}
            {documents.items.length === 0 && (
              <div className="text-sm text-gray-400">No related documents found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const FinancialDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'accounts' | 'email' | 'documents' | 'chat' | 'conversations' | 'canvas'>('overview');
  const [showMobileView, setShowMobileView] = useState(false);
  const [emails, setEmails] = useState<EmailMessage[]>([]);
  const [documents, setDocuments] = useState<{
    folders: string[];
    items: FinancialDocument[];
  }>({
    folders: ['Invoices', 'Receipts', 'Statements', 'Reports', 'Projections'],
    items: []
  });
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [metrics, setMetrics] = useState<FinancialMetrics>({
    cashFlow: { incoming: 0, outgoing: 0, projected: 0 },
    expenses: [],
    revenue: { current: 0, projected: 0, growth: 0 },
    profitLoss: { profit: 0, loss: 0, margin: 0 }
  });
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [editorContent, setEditorContent] = useState('');
  const [selectedSource, setSelectedSource] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isCodeLlamaOpen, setIsCodeLlamaOpen] = useState(false);
  const [isOllamaOpen, setIsOllamaOpen] = useState(false);
  const [isGemmaOpen, setIsGemmaOpen] = useState(false);
  const [isClaudeOpen, setIsClaudeOpen] = useState(false);
  const [activeChat, setActiveChat] = useState<string | null>(null);

  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const contentRef = useRef<string>('');

  // Add file management state
  const [files, setFiles] = useState<{name: string, path: string, size: string, type: string, lastModified: string}[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string>('root');
  const [folderStructure, setFolderStructure] = useState<{[key: string]: string[]}>({
    'root': ['loans', 'documents', 'personal'],
    'loans': ['active', 'pending', 'completed'],
    'documents': ['tax_returns', 'bank_statements', 'pay_stubs', 'business_docs'],
    'personal': ['identification', 'references', 'credit_reports']
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  
  // Fetch conversations from local storage
  const fetchConversations = useCallback(() => {
    try {
      const storedConversations = localStorage.getItem('conversations');
      const allConversations = storedConversations ? JSON.parse(storedConversations) : [];
      
      // Filter by source if selected
      const filteredConversations = selectedSource 
        ? allConversations.filter((conv: any) => conv.source === selectedSource)
        : allConversations;
        
      setConversations(filteredConversations);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setConversations([]);
    }
  }, [selectedSource]);
  
  // Load conversations when component mounts or source changes
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);
  
  // File management functions
  const navigateToFolder = (folder: string) => {
    setCurrentFolder(folder);
    // In a real implementation, this would fetch files from your file server
    const mockFiles = generateMockFiles(folder);
    setFiles(mockFiles);
  };
  
  const generateMockFiles = (folder: string) => {
    // This would be replaced with actual API calls to your file server
    const folderFiles: {name: string, path: string, size: string, type: string, lastModified: string}[] = [];
    
    if (folder === 'loans') {
      folderFiles.push(
        {name: 'commercial_loan_application.pdf', path: 'loans/commercial_loan_application.pdf', size: '1.2 MB', type: 'PDF', lastModified: '4/10/2023'},
        {name: 'investment_property_details.xlsx', path: 'loans/investment_property_details.xlsx', size: '458 KB', type: 'Excel', lastModified: '4/12/2023'}
      );
    } else if (folder === 'documents/tax_returns') {
      folderFiles.push(
        {name: '2022_tax_return.pdf', path: 'documents/tax_returns/2022_tax_return.pdf', size: '3.4 MB', type: 'PDF', lastModified: '3/15/2023'},
        {name: '2021_tax_return.pdf', path: 'documents/tax_returns/2021_tax_return.pdf', size: '3.1 MB', type: 'PDF', lastModified: '3/10/2022'}
      );
    }
    
    return folderFiles;
  };
  
  const saveFile = (file: File, targetFolder: string) => {
    // In a real implementation, this would upload the file to your file server
    console.log(`Saving file ${file.name} to folder ${targetFolder}`);
    // Add the file to our local state for demonstration
    setFiles([...files, {
      name: file.name,
      path: `${targetFolder}/${file.name}`,
      size: `${(file.size / 1024).toFixed(0)} KB`,
      type: file.type ? file.type.split('/')[1]?.toUpperCase() || 'UNKNOWN' : 'UNKNOWN',
      lastModified: new Date().toLocaleDateString()
    }]);
  };
  
  const searchFiles = (query: string) => {
    // In a real implementation, this would search your file server
    setSearchQuery(query);
    // Mock search results
    if (query) {
      const results = [
        {name: 'loan_application.pdf', path: 'loans/loan_application.pdf', size: '1.2 MB', type: 'PDF', lastModified: '4/10/2023'},
        {name: 'property_tax_statement.pdf', path: 'documents/tax_returns/property_tax_statement.pdf', size: '580 KB', type: 'PDF', lastModified: '2/22/2023'}
      ].filter(file => file.name.toLowerCase().includes(query.toLowerCase()));
      setFiles(results);
    } else {
      setFiles([]);
    }
  };
  
  // File upload handler
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      saveFile(files[0], currentFolder);
    }
  };

  const handleChatFocus = (chat: string) => {
    setActiveChat(chat);
  };

  // Email Management Section
  const EmailSection = () => (
    <div className="grid grid-cols-[250px_1fr] gap-4 h-full">
      <div className="bg-black/20 rounded-lg p-4">
        <div className="space-y-2">
          <button className="w-full flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-ferrari-red/10 text-left">
            <Inbox className="w-4 h-4" />
            <span>Inbox</span>
            <span className="ml-auto text-sm text-gray-400">24</span>
          </button>
          <button className="w-full flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-ferrari-red/10 text-left">
            <Send className="w-4 h-4" />
            <span>Processed</span>
          </button>
          <button className="w-full flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-ferrari-red/10 text-left">
            <Archive className="w-4 h-4" />
            <span>Archived</span>
          </button>
          <button className="w-full flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-ferrari-red/10 text-left">
            <Trash2 className="w-4 h-4" />
            <span>Trash</span>
          </button>
        </div>

        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-400 px-4 mb-2">Categories</h4>
          <div className="space-y-1">
            <button className="w-full flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-ferrari-red/10 text-left">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <span>Invoices</span>
            </button>
            <button className="w-full flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-ferrari-red/10 text-left">
              <span className="w-2 h-2 rounded-full bg-green-400" />
              <span>Receipts</span>
            </button>
            <button className="w-full flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-ferrari-red/10 text-left">
              <span className="w-2 h-2 rounded-full bg-yellow-400" />
              <span>Statements</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-black/20 rounded-lg p-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search emails..."
              className="w-full bg-black/20 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ferrari-red/50"
            />
          </div>
          <button className="p-2 hover:bg-ferrari-red/10 rounded-lg">
            <Filter className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2">
          {/* Email list items would go here */}
        </div>
      </div>
    </div>
  );

  // Document Storage Section
  const DocumentSection = () => (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h2 className="text-xl font-semibold mb-4">Conversation History</h2>
        
        <div className="flex justify-between items-center mb-4">
          <select 
            className="bg-zinc-800 p-2 rounded text-sm"
            value={selectedSource} 
            onChange={(e) => setSelectedSource(e.target.value)}
          >
            <option value="">All Sources</option>
            <option value="Claude">Claude</option>
            <option value="Ollama3">Ollama3</option>
            <option value="Gemma">Gemma</option>
            <option value="Cursor">Cursor</option>
          </select>
          
          <button 
            className="bg-zinc-800 px-4 py-2 rounded hover:bg-zinc-700 text-sm"
            onClick={fetchConversations}
          >
            Refresh
          </button>
        </div>
        
        <div className="bg-zinc-900 rounded-lg overflow-hidden">
          <div className="grid grid-cols-12 gap-2 p-2 bg-zinc-800 text-sm font-medium">
            <div className="col-span-1">ID</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-2">Topic</div>
            <div className="col-span-2">Source</div>
            <div className="col-span-2">Format</div>
            <div className="col-span-3">Conversation</div>
          </div>
          
          <div className="max-h-[300px] overflow-y-auto">
            {conversations.length > 0 ? (
              conversations.map((conv) => (
                <div 
                  key={conv.id} 
                  className="grid grid-cols-12 gap-2 p-2 text-sm border-t border-zinc-800 hover:bg-zinc-800 cursor-pointer"
                  onClick={() => setSelectedConversation(conv)}
                >
                  <div className="col-span-1 truncate">{conv.id.toString().substring(0, 5)}...</div>
                  <div className="col-span-2">{new Date(conv.created_at).toLocaleString()}</div>
                  <div className="col-span-2 truncate">{conv.topic || 'Untitled'}</div>
                  <div className="col-span-2">{conv.source}</div>
                  <div className="col-span-2">{conv.format}</div>
                  <div className="col-span-3 max-h-20 overflow-hidden">
                    {selectedConversation?.id === conv.id ? (
                      <div className="bg-zinc-700 p-2 rounded max-h-[200px] overflow-y-auto">
                        {conv.messages.map((msg, i) => (
                          <div key={i} className="mb-2">
                            <div className="font-medium">{msg.role === 'user' ? 'You' : conv.source}:</div>
                            <div>{msg.content}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="truncate">{conv.messages[0]?.content || ''}</div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-zinc-500">No conversations found</div>
            )}
          </div>
        </div>
      </div>
      
      <div className="bg-zinc-900 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Document Management</h2>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Search files..." 
              className="px-3 py-1 bg-zinc-800 rounded text-sm"
              value={searchQuery}
              onChange={(e) => searchFiles(e.target.value)}
            />
            <label className="px-3 py-1 bg-orange-600 text-white rounded text-sm cursor-pointer hover:bg-orange-700">
              Upload File
              <input type="file" className="hidden" onChange={handleFileUpload} />
            </label>
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-2 mb-4">
          {folderStructure[currentFolder === 'root' ? 'root' : currentFolder]?.map((folder) => (
            <div 
              key={folder} 
              className="bg-zinc-800 p-2 rounded cursor-pointer hover:bg-zinc-700 flex items-center"
              onClick={() => navigateToFolder(currentFolder === 'root' ? folder : `${currentFolder}/${folder}`)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1H2V6zm0 3v6a2 2 0 002 2h12a2 2 0 002-2V9H2z" clipRule="evenodd" />
              </svg>
              <span className="truncate">{folder}</span>
            </div>
          ))}
        </div>
        
        <div className="bg-zinc-800 rounded overflow-hidden">
          <div className="grid grid-cols-12 gap-2 p-2 bg-zinc-700 text-sm font-medium">
            <div className="col-span-5">Name</div>
            <div className="col-span-3">Type</div>
            <div className="col-span-2">Size</div>
            <div className="col-span-2">Modified</div>
          </div>
          
          <div className="max-h-[300px] overflow-y-auto">
            {files.length > 0 ? (
              files.map((file, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 p-2 text-sm border-t border-zinc-700 hover:bg-zinc-700">
                  <div className="col-span-5 truncate flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                    </svg>
                    {file.name}
                  </div>
                  <div className="col-span-3">{file.type}</div>
                  <div className="col-span-2">{file.size}</div>
                  <div className="col-span-2">{file.lastModified}</div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-zinc-500">
                {searchQuery ? "No files match your search" : "No files in this folder"}
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-zinc-500">
            {currentFolder === 'root' ? 'Home' : currentFolder.replace('/', ' / ')}
          </div>
          {currentFolder !== 'root' && (
            <button 
              className="px-3 py-1 bg-zinc-800 text-white rounded text-sm hover:bg-zinc-700"
              onClick={() => {
                const folderParts = currentFolder.split('/');
                folderParts.pop();
                const parentFolder = folderParts.length === 0 ? 'root' : folderParts.join('/');
                navigateToFolder(parentFolder);
              }}
            >
              Back to Parent
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // Overview/Metrics Section
  const OverviewSection = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-black/20 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm text-gray-400">Cash Flow</h4>
            <DollarSign className="w-4 h-4 text-green-400" />
          </div>
          <div className="text-2xl font-bold">${metrics.cashFlow.incoming - metrics.cashFlow.outgoing}</div>
          <div className="text-sm text-gray-400 mt-1">
            Projected: ${metrics.cashFlow.projected}
          </div>
        </div>

        <div className="bg-black/20 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm text-gray-400">Revenue</h4>
            <BarChart2 className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold">${metrics.revenue.current}</div>
          <div className="text-sm text-gray-400 mt-1">
            Growth: {metrics.revenue.growth}%
          </div>
        </div>

        <div className="bg-black/20 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm text-gray-400">Profit Margin</h4>
            <PieChart className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold">{metrics.profitLoss.margin}%</div>
          <div className="text-sm text-gray-400 mt-1">
            Profit: ${metrics.profitLoss.profit}
          </div>
        </div>

        <div className="bg-black/20 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm text-gray-400">Pending</h4>
            <Clock className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="text-2xl font-bold">24</div>
          <div className="text-sm text-gray-400 mt-1">
            Need attention
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[2fr_1fr] gap-6">
        <div className="bg-black/20 p-4 rounded-lg">
          <h3 className="font-medium mb-4">Cash Flow Projection</h3>
          {/* Cash flow chart would go here */}
        </div>

        <div className="bg-black/20 p-4 rounded-lg">
          <h3 className="font-medium mb-4">Expense Breakdown</h3>
          {/* Expense pie chart would go here */}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-black/20 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Recent Transactions</h3>
            <button className="text-sm text-ferrari-red hover:text-ferrari-red/80">
              View All
            </button>
          </div>
          {/* Transaction list would go here */}
        </div>

        <div className="bg-black/20 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Upcoming Payments</h3>
            <button className="text-sm text-ferrari-red hover:text-ferrari-red/80">
              View All
            </button>
          </div>
          {/* Upcoming payments list would go here */}
        </div>
      </div>

      {/* Model Status Widget */}
      <ModelStatusWidget />
    </div>
  );

  return (
    <div className="flex h-screen bg-[#0a0b0f]">
      <div className={`${showMobileView ? 'w-full' : 'w-64'} h-screen bg-dark-card border-r border-ferrari-red/10 overflow-y-auto`}>
        <div className="px-4 py-4 border-b border-ferrari-red/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bot className="w-8 h-8 text-ferrari-red" />
              <div className="flex flex-col">
                <span className="text-base font-semibold text-white leading-tight">Financial</span>
                <span className="text-sm text-gray-400">Management</span>
              </div>
            </div>
            <button
              onClick={() => setShowMobileView(!showMobileView)}
              className="px-3 py-1 rounded-full text-sm bg-ferrari-red/20 text-ferrari-red hover:bg-ferrari-red/30 transition-colors"
            >
              {showMobileView ? 'Show Desktop' : 'Show Mobile'}
            </button>
          </div>
        </div>

        <div className="py-6">
          <div className="px-4 mb-3">
            <h3 className="text-sm font-semibold text-gray-400">Navigation</h3>
          </div>
          <div className="space-y-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-base text-gray-300 hover:bg-ferrari-red/10 hover:text-white group ${
                activeTab === 'overview' ? 'bg-ferrari-red/10 text-white' : ''
              }`}
            >
              <BarChart2 className="w-5 h-5" />
              <span>Overview</span>
            </button>
            <button
              onClick={() => setActiveTab('accounts')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-base text-gray-300 hover:bg-ferrari-red/10 hover:text-white group ${
                activeTab === 'accounts' ? 'bg-ferrari-red/10 text-white' : ''
              }`}
            >
              <CreditCard className="w-5 h-5" />
              <span>Accounts</span>
            </button>
            <button
              onClick={() => setActiveTab('email')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-base text-gray-300 hover:bg-ferrari-red/10 hover:text-white group ${
                activeTab === 'email' ? 'bg-ferrari-red/10 text-white' : ''
              }`}
            >
              <Mail className="w-5 h-5" />
              <span>Email</span>
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-base text-gray-300 hover:bg-ferrari-red/10 hover:text-white group ${
                activeTab === 'documents' ? 'bg-ferrari-red/10 text-white' : ''
              }`}
            >
              <FileText className="w-5 h-5" />
              <span>Documents</span>
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-base text-gray-300 hover:bg-ferrari-red/10 hover:text-white group ${
                activeTab === 'chat' ? 'bg-ferrari-red/10 text-white' : ''
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              <span>Chat</span>
            </button>
            <button
              onClick={() => setActiveTab('conversations')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-base text-gray-300 hover:bg-ferrari-red/10 hover:text-white group ${
                activeTab === 'conversations' ? 'bg-ferrari-red/10 text-white' : ''
              }`}
            >
              <Calendar className="w-5 h-5" />
              <span>Conversations</span>
            </button>
            <button
              onClick={() => setActiveTab('canvas')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-base text-gray-300 hover:bg-ferrari-red/10 hover:text-white group ${
                activeTab === 'canvas' ? 'bg-ferrari-red/10 text-white' : ''
              }`}
            >
              <Pencil className="w-5 h-5" />
              <span>Canvas</span>
            </button>
          </div>
        </div>
      </div>

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
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">Financial Management</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsCodeLlamaOpen(!isCodeLlamaOpen)}
                  className="px-4 py-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    <span>Code Assistant</span>
                  </div>
                </button>
                <button
                  onClick={() => setIsOllamaOpen(!isOllamaOpen)}
                  className="px-4 py-2 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4" />
                    <span>Ollama3</span>
                  </div>
                </button>
                <button
                  onClick={() => setIsGemmaOpen(!isGemmaOpen)}
                  className="px-4 py-2 rounded-lg bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4" />
                    <span>Gemma</span>
                  </div>
                </button>
                <button
                  onClick={() => setIsClaudeOpen(!isClaudeOpen)}
                  className="px-4 py-2 rounded-lg bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4" />
                    <span>Claude</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Error message display */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg mb-4 flex items-center">
                <div className="mr-2">⚠️</div>
                <div>{error}</div>
              </div>
            )}

            {activeTab === 'overview' && <OverviewSection />}
            {activeTab === 'accounts' && <AccountsSection />}
            {activeTab === 'email' && <EmailSection />}
            {activeTab === 'documents' && <DocumentSection />}
            {activeTab === 'chat' && (
              <div className="h-[600px]">
                <DirectChat assistant="jbot" />
              </div>
            )}
            {activeTab === 'conversations' && (
              <div className="h-full bg-[#0a0b0f] rounded-lg p-6">
                <ConversationsSection
                  conversations={conversations}
                  setConversations={setConversations}
                  documents={documents}
                />
              </div>
            )}
            {activeTab === 'canvas' && <CanvasSection />}
          </div>
        </div>
      )}

      <CodeLlamaWidget 
        isOpen={isCodeLlamaOpen}
        onClose={() => setIsCodeLlamaOpen(false)}
        zIndex={activeChat === 'codellama' ? 50 : 40}
        onFocus={() => handleChatFocus('codellama')}
      />
      {isOllamaOpen && (
        <div 
          className={`fixed right-4 bottom-32 w-[600px] h-[700px] bg-[#0a0b0f] border border-green-500/20 rounded-lg shadow-xl flex flex-col`}
          style={{ zIndex: activeChat === 'ollama' ? 50 : 40 }}
          onClick={() => handleChatFocus('ollama')}
        >
          <div className="flex justify-between items-center p-3 border-b border-green-500/20 bg-green-500/10">
            <h3 className="text-sm font-medium text-green-400">Ollama3 Assistant</h3>
            <button onClick={() => setIsOllamaOpen(false)} className="p-1 hover:bg-green-500/20 rounded">
              <X className="w-4 h-4 text-green-400" />
            </button>
          </div>
          <div className="flex-1 relative">
            <div className="absolute inset-0 bottom-16 overflow-y-auto">
              <DirectChat assistant="ollama" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-[#0a0b0f] border-t border-green-500/20">
              <div className="p-3">
                <input type="text" placeholder="Type your message..." className="w-full bg-[#1a1b1f] text-white rounded px-3 py-2" />
              </div>
            </div>
          </div>
        </div>
      )}
      {isGemmaOpen && (
        <div 
          className={`fixed right-4 bottom-32 w-[600px] h-[700px] bg-[#0a0b0f] border border-purple-500/20 rounded-lg shadow-xl flex flex-col`}
          style={{ zIndex: activeChat === 'gemma' ? 50 : 40 }}
          onClick={() => handleChatFocus('gemma')}
        >
          <div className="flex justify-between items-center p-3 border-b border-purple-500/20 bg-purple-500/10">
            <h3 className="text-sm font-medium text-purple-400">Gemma Assistant</h3>
            <button onClick={() => setIsGemmaOpen(false)} className="p-1 hover:bg-purple-500/20 rounded">
              <X className="w-4 h-4 text-purple-400" />
            </button>
          </div>
          <div className="flex-1 relative">
            <div className="absolute inset-0 bottom-16 overflow-y-auto">
              <DirectChat assistant="gemma" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-[#0a0b0f] border-t border-purple-500/20">
              <div className="p-3">
                <input type="text" placeholder="Type your message..." className="w-full bg-[#1a1b1f] text-white rounded px-3 py-2" />
              </div>
            </div>
          </div>
        </div>
      )}
      {isClaudeOpen && (
        <div 
          className={`fixed right-4 bottom-32 w-[600px] h-[700px] bg-[#0a0b0f] border border-yellow-500/20 rounded-lg shadow-xl flex flex-col`}
          style={{ zIndex: activeChat === 'claude' ? 50 : 40 }}
          onClick={() => handleChatFocus('claude')}
        >
          <div className="flex justify-between items-center p-3 border-b border-yellow-500/20 bg-yellow-500/10">
            <h3 className="text-sm font-medium text-yellow-400">Claude Assistant</h3>
            <button onClick={() => setIsClaudeOpen(false)} className="p-1 hover:bg-yellow-500/20 rounded">
              <X className="w-4 h-4 text-yellow-400" />
            </button>
          </div>
          <div className="flex-1 relative">
            <div className="absolute inset-0 bottom-16 overflow-y-auto">
              <DirectChat assistant="claude" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-[#0a0b0f] border-t border-yellow-500/20">
              <div className="p-3">
                <input type="text" placeholder="Type your message..." className="w-full bg-[#1a1b1f] text-white rounded px-3 py-2" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialDashboard;