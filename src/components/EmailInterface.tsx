import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Mail, Search, Settings, LogOut, Star, Archive, Trash2, 
  Reply, Forward, MoreHorizontal, Filter, Bell, User, 
  Folders, Inbox, Send, FileText, Shield, Palette,
  PlusCircle, Sparkles, Zap, Moon, Sun
} from 'lucide-react';

// Theme styles
const themeStyles = `
/* Default theme (dark blue) */
:root {
  --bg-primary: linear-gradient(135deg, #0f172a, #1e293b);
  --bg-secondary: rgba(30, 41, 59, 0.8);
  --text-primary: #e2e8f0;
  --text-secondary: #94a3b8;
  --accent-color: #3b82f6;
  --accent-hover: #2563eb;
  --border-color: rgba(148, 163, 184, 0.2);
  --card-bg: rgba(30, 41, 59, 0.7);
  --sidebar-bg: rgba(15, 23, 42, 0.8);
}

/* Dark theme */
.theme-dark {
  --bg-primary: linear-gradient(135deg, #111111, #1a1a1a);
  --bg-secondary: rgba(26, 26, 26, 0.8);
  --text-primary: #f5f5f5;
  --text-secondary: #a0a0a0;
  --accent-color: #6366f1;
  --accent-hover: #4f46e5;
  --border-color: rgba(160, 160, 160, 0.2);
  --card-bg: rgba(26, 26, 26, 0.7);
  --sidebar-bg: rgba(17, 17, 17, 0.8);
}

/* Light theme */
.theme-light {
  --bg-primary: linear-gradient(135deg, #f8fafc, #e2e8f0);
  --bg-secondary: rgba(226, 232, 240, 0.8);
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --accent-color: #3b82f6;
  --accent-hover: #2563eb;
  --border-color: rgba(100, 116, 139, 0.2);
  --card-bg: rgba(255, 255, 255, 0.7);
  --sidebar-bg: rgba(248, 250, 252, 0.8);
}

/* Quantum theme */
.theme-quantum {
  --bg-primary: linear-gradient(135deg, #0f0f23, #1a1a3a);
  --bg-secondary: rgba(26, 26, 58, 0.8);
  --text-primary: #f0f0ff;
  --text-secondary: #a0a0d0;
  --accent-color: #8b5cf6;
  --accent-hover: #7c3aed;
  --border-color: rgba(160, 160, 208, 0.2);
  --card-bg: rgba(26, 26, 58, 0.7);
  --sidebar-bg: rgba(15, 15, 35, 0.8);
}
`;
import FolderList3D from './FolderList3D';
import EmailList3D from './EmailList3D';
import EmailViewer3D from './EmailViewer3D';
import ComposeDialog3D from './ComposeDialog3D';
import Settings3D from './Settings3D';
import AdvancedSearch3D from './AdvancedSearch3D';
import TermsDialog3D from './TermsDialog3D';

interface EmailInterfaceProps {
  username: string;
  onLogout: () => void;
}

interface Email {
  id: string;
  from: string;
  fromEmail: string;
  subject: string;
  content: string;
  date: string;
  isRead: boolean;
  isStarred: boolean;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  labels: string[];
}

const EmailInterface: React.FC<EmailInterfaceProps> = ({ username, onLogout }) => {
  const [currentFolder, setCurrentFolder] = useState('inbox');
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [emails, setEmails] = useState<Email[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [theme, setTheme] = useState('default');
  const [unreadCount, setUnreadCount] = useState(0);
  const [chatHistory, setChatHistory] = useState<string[]>([]);

  // Apply theme styles to document head and load saved theme
  useEffect(() => {
    // Create style element if it doesn't exist
    let styleElement = document.getElementById('theme-styles');
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = 'theme-styles';
      document.head.appendChild(styleElement);
    }
    styleElement.innerHTML = themeStyles;
    
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('qemail-theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.body.className = savedTheme === 'default' ? '' : `theme-${savedTheme}`;
    } else {
      // Apply initial theme
      document.body.className = theme === 'default' ? '' : `theme-${theme}`;
    }
    
    return () => {
      // Clean up on unmount
      if (styleElement) {
        document.head.removeChild(styleElement);
      }
    };
  }, []);

  // Load emails from server for current folder
  useEffect(() => {
    const loadFolder = async () => {
      try {
        const { qemailApi } = await import('@/services/api')
        const serverEmails = await qemailApi.listEmails(currentFolder)
        console.log('Server response:', serverEmails)
        
        // Handle both array format and object format responses
        const emailArray = Array.isArray(serverEmails) ? serverEmails : 
                          (serverEmails && typeof serverEmails === 'object' ? [serverEmails] : [])
        
        const normalized: Email[] = emailArray.map((e: any) => ({
          id: String(e.id),
          from: e.from || e.sender_name || 'Unknown',
          fromEmail: e.to || e.sender_email || 'unknown@gss-tec.qssn',
          subject: e.subject || '(no subject)',
          content: e.body || e.content || '',
          date: e.date || e.created_at || new Date().toISOString(),
          isRead: !!e.is_read,
          isStarred: !!e.is_starred,
          priority: e.priority || 'normal',
          labels: e.labels || []
        }))
        setEmails(normalized)
        setUnreadCount(normalized.filter(e => !e.isRead).length)
      } catch (e: any) {
        setEmails([])
        setUnreadCount(0)
        toast.error('Failed to load emails from server')
      }
    }
    loadFolder()
  }, [currentFolder]);

  const handleFolderChange = (folder: string) => {
    setCurrentFolder(folder);
    setSelectedEmail(null);
    toast.info(`Switched to ${folder} folder`);
  };

  const handleEmailSelect = (email: Email) => {
    setSelectedEmail(email);
    if (!email.isRead) {
      setEmails(prev => prev.map(e => 
        e.id === email.id ? { ...e, isRead: true } : e
      ));
      setUnreadCount(prev => prev - 1);
    }
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    document.body.className = newTheme === 'default' ? '' : `theme-${newTheme}`;
    localStorage.setItem('qemail-theme', newTheme);
    toast.success(`Theme changed to ${newTheme}`);
  };

  const filteredEmails = emails.filter(email => 
    email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen flex overflow-hidden bg-gradient-background relative">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 60 + 20}px`,
              height: `${Math.random() * 60 + 20}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
              background: 'var(--accent-color)',
              opacity: 0.3
            }}
          />
        ))}
      </div>

      {/* Left Sidebar */}
      <div className="w-80 glass-surface border-r border-primary/20 flex flex-col relative z-10">
        {/* Profile Section */}
        <div className="p-6 border-b border-primary/20">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center animate-pulse-glow">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-status-success rounded-full border-2 border-background animate-pulse" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">{username}</h3>
              <p className="text-sm text-muted-foreground">{username}@gss-tec.qssn</p>
            </div>
          </div>
        </div>

        {/* Compose Button */}
        <div className="p-4">
          <Button
            onClick={() => setIsComposeOpen(true)}
            className="w-full glass-surface bg-gradient-primary hover:shadow-hover transform hover:scale-105 transition-all duration-300 group"
          >
            <PlusCircle className="w-4 h-4 mr-2 group-hover:animate-rotate-y" />
            Compose
            <Sparkles className="w-4 h-4 ml-2 animate-pulse" />
          </Button>
        </div>

        {/* Folder List */}
        <div className="flex-1 overflow-y-auto">
          <FolderList3D
            currentFolder={currentFolder}
            onFolderChange={handleFolderChange}
            unreadCount={unreadCount}
          />
        </div>

        {/* Theme Selector */}
        <div className="p-4 border-t border-primary/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Theme</span>
            <Palette className="w-4 h-4 text-primary animate-rotate-y" />
          </div>
          <div className="flex space-x-2">
            {['default', 'blue', 'red'].map((themeOption) => (
              <Button
                key={themeOption}
                variant={theme === themeOption ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleThemeChange(themeOption)}
                className="flex-1 capitalize glass-hover"
              >
                {themeOption}
              </Button>
            ))}
          </div>
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t border-primary/20">
          <Button
            variant="outline"
            onClick={onLogout}
            className="w-full glass-surface border-danger/20 text-danger hover:bg-danger/10 hover:border-danger"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative z-10">
        {/* Top Toolbar */}
        <div className="h-16 glass-surface border-b border-primary/20 flex items-center px-6 space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center animate-pulse-glow">
              <Mail className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              QSSN Email
            </h1>
          </div>

          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search emails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 glass-surface border-primary/20 focus:border-primary focus:shadow-glow"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setShowAdvancedSearch(true)}
              className="glass-hover"
            >
              <Filter className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="glass-hover">
              <Bell className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setShowSettings(true)}
              className="glass-hover"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Email List */}
          <div className="w-96 glass-surface border-r border-primary/20">
            <EmailList3D
              emails={filteredEmails}
              selectedEmail={selectedEmail}
              onEmailSelect={handleEmailSelect}
              currentFolder={currentFolder}
            />
          </div>

          {/* Email Viewer */}
          <div className="flex-1">
            <EmailViewer3D
              email={selectedEmail}
              onReply={() => toast.info('Reply functionality would open here')}
              onForward={() => toast.info('Forward functionality would open here')}
              onStar={() => toast.success('Email starred!')}
              onArchive={() => toast.success('Email archived!')}
              onDelete={() => toast.success('Email deleted!')}
            />
          </div>
        </div>
      </div>

      {/* Compose Dialog */}
      <ComposeDialog3D
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
        chatHistory={chatHistory}
        onSend={async (emailData) => {
          try {
            const { qemailApi } = await import('@/services/api')
            // Convert array to string for single recipient, keep array for multiple
            const toField = Array.isArray(emailData.to) && emailData.to.length === 1 ? emailData.to[0] : emailData.to
            await qemailApi.sendEmail({ to: toField, subject: emailData.subject, content: emailData.content })
            toast.success('Email sent successfully!')
            setIsComposeOpen(false)
            setChatHistory(prev => [...prev, `Sent email: ${emailData.subject}`].slice(-10))
            // Refresh current folder after sending
            try {
              const serverEmails = await qemailApi.listEmails(currentFolder)
              // Ensure serverEmails is an array before calling map
              if (Array.isArray(serverEmails)) {
                const normalized: Email[] = serverEmails.map((e: any) => ({
                  id: String(e.id),
                  from: e.sender_name || e.from || 'Unknown',
                  fromEmail: e.sender_email || 'unknown@gss-tec.qssn',
                  subject: e.subject || '(no subject)',
                  content: e.content || '',
                  date: e.created_at || new Date().toISOString(),
                  isRead: !!e.is_read,
                  isStarred: !!e.is_starred,
                  priority: 'normal',
                  labels: []
                }))
                setEmails(normalized)
                setUnreadCount(normalized.filter(e => !e.isRead).length)
              } else {
                console.warn('listEmails did not return an array:', serverEmails)
                // Keep existing emails if refresh fails
              }
            } catch (refreshError) {
              console.warn('Failed to refresh emails after sending:', refreshError)
              // Keep existing emails if refresh fails
            }
          } catch (e: any) {
            toast.error(`Failed to send email: ${e?.message || 'Unknown error'}`)
          }
        }}
      />

      {/* Settings Dialog */}
      <Settings3D
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        currentTheme={theme}
        onThemeChange={handleThemeChange}
      />

      {/* Advanced Search Dialog */}
      <AdvancedSearch3D
        isOpen={showAdvancedSearch}
        onClose={() => setShowAdvancedSearch(false)}
        onSearch={(criteria) => {
          toast.success('Advanced search performed!');
          console.log('Search criteria:', criteria);
        }}
      />

      {/* Terms Dialog */}
      <TermsDialog3D
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
        onAccept={() => {
          toast.success('Terms and conditions accepted!');
        }}
      />
    </div>
  );
};

export default EmailInterface;