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
  PlusCircle, Sparkles, Zap, Moon, Sun, ArrowLeft, X, Menu
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

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
  authToken: string;
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

const EmailInterface: React.FC<EmailInterfaceProps> = ({ username, authToken, onLogout }) => {
  const [currentFolder, setCurrentFolder] = useState('inbox');
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [emails, setEmails] = useState<Email[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [chatHistory, setChatHistory] = useState<string[]>([]);
  const [mobileView, setMobileView] = useState<'sidebar' | 'list' | 'viewer'>('list');
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [isReadingMode, setIsReadingMode] = useState(false);
  const [isFullscreenReading, setIsFullscreenReading] = useState(false);
  const [theme, setTheme] = useState('default');

  const isMobile = useIsMobile();

  // Set auth token when component mounts
  useEffect(() => {
    if (authToken) {
      import('@/services/api').then(({ qemailApi }) => {
        qemailApi.setToken(authToken);
      }).catch((error) => {
        console.error('Failed to set auth token:', error);
      });
    }
  }, [authToken]);

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
        console.log('Loading emails from folder:', currentFolder)
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
        console.error('Failed to load emails:', e)
        const errorMessage = e.message || 'Failed to load emails from server'
        toast.error(`Failed to load emails: ${errorMessage}`)
      }
    }
    loadFolder()
  }, [currentFolder]);

  const handleFolderChange = (folder: string) => {
    setCurrentFolder(folder);
    setSelectedEmail(null);
    toast.info(`Switched to ${folder} folder`);
    
    // On mobile, close sidebar and go to list view
    if (isMobile) {
      setShowMobileSidebar(false);
      setMobileView('list');
    }
  };

  const handleBackToList = () => {
    setMobileView('list');
    setSelectedEmail(null);
    // Disable fullscreen reading mode when going back to list
    setIsFullscreenReading(false);
  };

  const toggleMobileSidebar = () => {
    setShowMobileSidebar(!showMobileSidebar);
  };

  const handleEmailSelect = async (email: Email) => {
    setSelectedEmail(email);
    
    // On mobile, switch to viewer view after selecting an email
    if (isMobile) {
      setMobileView('viewer');
      // Enable fullscreen reading mode for better reading experience
      setIsFullscreenReading(true);
    }
    
    // Mark email as read if it's unread
    if (!email.isRead) {
      try {
        const { qemailApi } = await import('@/services/api')
        await qemailApi.markEmailAsRead(email.id)
        
        // Update the email in the list to mark as read
        setEmails(prevEmails => 
          prevEmails.map(e => 
            e.id === email.id ? { ...e, isRead: true } : e
          )
        )
        setUnreadCount(prev => Math.max(0, prev - 1))
      } catch (error) {
        console.error('Failed to mark email as read:', error)
      }
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
    <div className={`h-screen flex overflow-hidden bg-gradient-background relative ${isReadingMode ? 'reading-mode' : ''}`}>
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
        {/* Top Toolbar - Hidden in fullscreen reading mode on mobile */}
        <div className={`h-16 glass-surface border-b border-primary/20 flex items-center px-4 md:px-6 space-x-2 md:space-x-4 ${isMobile && isFullscreenReading ? 'hidden' : ''}`}>
          {/* Mobile Menu Button */}
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={toggleMobileSidebar} className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          )}
          
          {/* Mobile Back Button (when in viewer) */}
          {isMobile && mobileView === 'viewer' && (
            <Button variant="ghost" size="icon" onClick={handleBackToList} className="md:hidden">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center animate-pulse-glow">
              <Mail className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              QSSN Email
            </h1>
          </div>

          <div className={`flex-1 max-w-md relative ${isReadingMode ? 'hidden md:block' : ''}`}>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search emails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 glass-surface border-primary/20 focus:border-primary focus:shadow-glow text-sm md:text-base"
            />
          </div>

          {/* Reading Mode Controls */}
          {isReadingMode && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground hidden sm:inline">Reading Mode</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={exitReadingMode}
                className="glass-hover"
              >
                <X className="w-4 h-4" />
                Exit
              </Button>
            </div>
          )}

          <div className={`flex items-center space-x-1 md:space-x-2 ${isReadingMode ? 'hidden md:flex' : ''}`}>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setShowAdvancedSearch(true)}
              className="glass-hover hidden sm:inline-flex"
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
              className="glass-hover hidden md:inline-flex"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div className={`flex-1 flex overflow-hidden ${isReadingMode && isMobile ? 'hidden' : ''}`}>
          {/* Email List - Hidden on mobile when viewer is active */}
          <div className={`${isMobile ? (mobileView === 'list' ? 'flex' : 'hidden') : 'flex'} w-full md:w-96 glass-surface md:border-r border-primary/20`}>
            <EmailList3D
              emails={filteredEmails}
              selectedEmail={selectedEmail}
              onEmailSelect={handleEmailSelect}
              currentFolder={currentFolder}
            />
          </div>

          {/* Email Viewer - Hidden on mobile when list is active */}
          <div className={`${isMobile ? (mobileView === 'viewer' ? 'flex' : 'hidden') : 'flex'} flex-1 ${isReadingMode ? 'w-full' : ''}`}>
            <EmailViewer3D
              email={selectedEmail}
              isFullscreen={isMobile && isFullscreenReading}
              onToggleFullscreen={() => setIsFullscreenReading(!isFullscreenReading)}
              onReply={() => toast.info('Reply functionality would open here')}
              onForward={() => toast.info('Forward functionality would open here')}
              onStar={async () => {
                if (selectedEmail) {
                  try {
                    const { qemailApi } = await import('@/services/api')
                    await qemailApi.toggleEmailStar(selectedEmail.id)
                    toast.success(selectedEmail.isStarred ? 'Email unstarred!' : 'Email starred!')
                    // Refresh the email list to reflect the change
                    const serverEmails = await qemailApi.listEmails(currentFolder)
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
                      // Update selected email if it still exists
                      const updatedEmail = normalized.find(e => e.id === selectedEmail.id)
                      if (updatedEmail) {
                        setSelectedEmail(updatedEmail)
                      }
                    }
                  } catch (error) {
                    console.error('Failed to toggle star:', error)
                    toast.error('Failed to toggle star')
                  }
                }
              }}
              onArchive={async () => {
                if (selectedEmail) {
                  try {
                    const { qemailApi } = await import('@/services/api')
                    await qemailApi.toggleEmailArchive(selectedEmail.id)
                    toast.success('Email archived!')
                    // Remove from current list and select next email
                    const updatedEmails = emails.filter(e => e.id !== selectedEmail.id)
                    setEmails(updatedEmails)
                    setUnreadCount(updatedEmails.filter(e => !e.isRead).length)
                    setSelectedEmail(updatedEmails.length > 0 ? updatedEmails[0] : null)
                  } catch (error) {
                    console.error('Failed to archive email:', error)
                    toast.error('Failed to archive email')
                  }
                }
              }}
              onDelete={async () => {
                if (selectedEmail) {
                  try {
                    const { qemailApi } = await import('@/services/api')
                    await qemailApi.deleteEmail(selectedEmail.id)
                    toast.success('Email deleted!')
                    // Remove from current list and select next email
                    const updatedEmails = emails.filter(e => e.id !== selectedEmail.id)
                    setEmails(updatedEmails)
                    setUnreadCount(updatedEmails.filter(e => !e.isRead).length)
                    setSelectedEmail(updatedEmails.length > 0 ? updatedEmails[0] : null)
                  } catch (error) {
                    console.error('Failed to delete email:', error)
                    toast.error('Failed to delete email')
                  }
                }
              }}
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