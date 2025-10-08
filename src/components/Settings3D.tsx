import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Settings, User, Palette, Server, Shield, Bell, 
  Signature, Globe, Database, Key, Eye, EyeOff,
  Save, RefreshCw, Trash2, Download, Upload, Zap,
  XCircle, CheckCircle, ChevronRight, ChevronLeft, X
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import HolographicCard from '@/components/3D/HolographicCard';
import FloatingIcon from '@/components/3D/FloatingIcon';
import { toast } from 'sonner';
import { qemailApi } from '@/services/api';

interface Settings3DProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: string;
  onThemeChange: (theme: string) => void;
}

const Settings3D: React.FC<Settings3DProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onThemeChange
}) => {
  const [activeTab, setActiveTab] = useState<string>('list');
  const [selectedSection, setSelectedSection] = useState<string>('');

  const [profile, setProfile] = useState({
    username: 'user@qemail.email',
    displayName: 'Qemail User',
    signature: 'Sent from Qemail - Quantum Secure Communications',
    avatar: '',
    timezone: 'UTC+0',
    language: 'english'
  });

  const [emailSettings, setEmailSettings] = useState({
    autoReply: false,
    readReceipts: true,
    encryption: true,
    spamFilter: true,
    notifications: true,
    soundAlerts: false,
    desktopNotifications: true
  });

  const [secretCodeSettings, setSecretCodeSettings] = useState({
    currentSecretCode: '',
    newSecretCode: '',
    confirmSecretCode: '',
    isVerifying: false,
    isChanging: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentSecret, setShowCurrentSecret] = useState(false);
  const [showNewSecret, setShowNewSecret] = useState(false);
  const [showConfirmSecret, setShowConfirmSecret] = useState(false);

  const validateSecretCode = (code: string) => {
    if (code.length < 10) {
      return { isValid: false, message: 'Secret code must be at least 10 characters long' };
    }
    if (!/[A-Z]/.test(code)) {
      return { isValid: false, message: 'Secret code must contain at least one uppercase letter' };
    }
    if (!/[a-z]/.test(code)) {
      return { isValid: false, message: 'Secret code must contain at least one lowercase letter' };
    }
    if (!/\d/.test(code)) {
      return { isValid: false, message: 'Secret code must contain at least one number' };
    }
    return { isValid: true, message: 'Valid secret code' };
  };

  const handleVerifySecretCode = async () => {
    if (!secretCodeSettings.currentSecretCode) {
      toast.error('Please enter your current secret code');
      return;
    }

    setSecretCodeSettings(prev => ({ ...prev, isVerifying: true }));

    try {
      const currentUsername = localStorage.getItem('qos-username') || profile.username.split('@')[0];
      await qemailApi.verifySecretCode(currentUsername, secretCodeSettings.currentSecretCode);
      toast.success('Current secret code verified successfully');
      setSecretCodeSettings(prev => ({ ...prev, isVerifying: false }));
    } catch (error: any) {
      toast.error(`Verification failed: ${error.message}`);
      setSecretCodeSettings(prev => ({ ...prev, isVerifying: false }));
    }
  };

  const handleChangeSecretCode = async () => {
    if (!secretCodeSettings.currentSecretCode || !secretCodeSettings.newSecretCode || !secretCodeSettings.confirmSecretCode) {
      toast.error('Please fill in all fields');
      return;
    }

    if (secretCodeSettings.newSecretCode !== secretCodeSettings.confirmSecretCode) {
      toast.error('New secret codes do not match');
      return;
    }

    const validation = validateSecretCode(secretCodeSettings.newSecretCode);
    if (!validation.isValid) {
      toast.error(validation.message);
      return;
    }

    setSecretCodeSettings(prev => ({ ...prev, isChanging: true }));

    try {
      const changeResponse = await qemailApi.changeSecretCode(
        secretCodeSettings.currentSecretCode,
        secretCodeSettings.newSecretCode
      );

      if (!changeResponse.success) {
        toast.error(changeResponse.message || 'Failed to change secret code');
        setSecretCodeSettings(prev => ({ ...prev, isChanging: false }));
        return;
      }

      await sendSecurityNotification('Secret Code Changed', 'Your secret code has been successfully changed.');
      toast.success('Secret code changed successfully!');
      setSecretCodeSettings({
        currentSecretCode: '',
        newSecretCode: '',
        confirmSecretCode: '',
        isVerifying: false,
        isChanging: false
      });
    } catch (error: any) {
      toast.error(`Change failed: ${error.message}`);
      setSecretCodeSettings(prev => ({ ...prev, isChanging: false }));
    }
  };

  const sendSecurityNotification = async (subject: string, message: string) => {
    try {
      const currentUsername = localStorage.getItem('qos-username') || profile.username.split('@')[0];
      await qemailApi.sendSecurityNotification('secret_code_changed', subject, message);
      console.log('Security notification sent successfully');
    } catch (error) {
      console.error('Failed to send security notification:', error);
    }
  };

  const themes = [
    { id: 'default', name: 'Default', preview: 'bg-gradient-to-r from-blue-800 to-indigo-900' },
    { id: 'dark', name: 'Dark', preview: 'bg-gradient-to-r from-gray-800 to-gray-900' },
    { id: 'light', name: 'Light', preview: 'bg-gradient-to-r from-gray-100 to-blue-100' },
    { id: 'quantum', name: 'Quantum', preview: 'bg-gradient-to-r from-indigo-900 to-purple-900' }
  ];

  const settingsSections = [
    { id: 'profile', name: 'Profile', icon: User, description: 'Manage your personal information' },
    { id: 'appearance', name: 'Themes', icon: Palette, description: 'Customize the look and feel' },
    { id: 'email', name: 'Qemail', icon: Bell, description: 'Qemail preferences and settings' },
    { id: 'secret-code', name: 'Secret Code', icon: Key, description: 'Change your secret code' },
    { id: 'security', name: 'Security', icon: Shield, description: 'Security and privacy settings' }
  ];

  const handleSectionSelect = (sectionId: string) => {
    setSelectedSection(sectionId);
    setActiveTab(sectionId);
  };

  const handleBackToList = () => {
    setActiveTab('list');
    setSelectedSection('');
  };

  const handleClose = () => {
    setActiveTab('list');
    setSelectedSection('');
    onClose();
  };

  const NeuralNetworkBackground = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-20">
      {/* Neural network nodes */}
      <div className="absolute top-10 left-10 w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
      <div className="absolute top-20 right-20 w-3 h-3 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
      <div className="absolute bottom-20 left-20 w-3 h-3 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-10 right-10 w-3 h-3 bg-cyan-400 rounded-full animate-pulse" style={{animationDelay: '1.5s'}}></div>
      <div className="absolute top-1/2 left-1/4 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" style={{animationDelay: '0.7s'}}></div>
      
      {/* Neural network connections */}
      <div className="absolute top-12 left-12 w-20 h-20 border-t-2 border-r-2 border-blue-400/30 rounded-tr-lg"></div>
      <div className="absolute bottom-22 left-22 w-32 h-32 border-b-2 border-l-2 border-green-400/30 rounded-bl-lg"></div>
      <div className="absolute top-1/2 right-1/4 w-24 h-24 border-2 border-purple-400/20 rounded-full"></div>
      
      {/* Animated lines */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400/20 to-transparent animate-move-line"></div>
        <div className="absolute top-1/4 right-0 w-0.5 h-32 bg-gradient-to-b from-transparent via-purple-400/20 to-transparent animate-move-line-vertical" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-0 left-1/3 w-24 h-0.5 bg-gradient-to-r from-transparent via-green-400/20 to-transparent animate-move-line" style={{animationDelay: '2s'}}></div>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="
        max-w-6xl 
        max-h-[90vh] 
        glass-surface 
        border-primary/20 
        animate-slide-in-3d 
        overflow-hidden 
        w-[95vw] 
        h-[95vh]
        mx-auto
        my-auto
        fixed
        inset-0
        sm:max-w-6xl
        sm:max-h-[90vh]
        sm:rounded-lg
        sm:inset-auto
        sm:top-1/2
        sm:left-1/2
        sm:transform
        sm:-translate-x-1/2
        sm:-translate-y-1/2
      " style={{background: 'var(--card-bg)', color: 'var(--text-primary)'}}>
        {/* Close Button - Fixed positioning with high z-index */}
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground z-50">
          <X className="h-5 w-5 sm:h-6 sm:w-6 text-foreground" />
          <span className="sr-only">Close</span>
        </DialogClose>
        
        <NeuralNetworkBackground />
        
        <DialogHeader className="border-b border-primary/20 pb-4 px-6 pt-6 bg-gradient-to-r from-primary/5 to-transparent relative z-10">
          <DialogTitle className="flex items-center space-x-2 md:space-x-3">
            {activeTab !== 'list' && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleBackToList}
                className="mr-2 h-8 w-8"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            )}
            <FloatingIcon Icon={Settings} className="text-accent" />
            <span className="text-lg md:text-xl bg-gradient-primary bg-clip-text text-transparent">
              {activeTab === 'list' ? 'Qemail Settings' : settingsSections.find(s => s.id === activeTab)?.name}
            </span>
            <Zap className="w-4 h-4 md:w-5 md:h-5 text-primary animate-pulse" />
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden relative z-10 h-[calc(95vh-140px)] sm:h-[calc(90vh-140px)]">
          {/* List View */}
          {activeTab === 'list' && (
            <div className="p-4 sm:p-6 space-y-4 h-full overflow-y-auto">
              <div className="grid grid-cols-1 gap-3 sm:gap-4">
                {settingsSections.map((section) => (
                  <Card 
                    key={section.id}
                    className="cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-hover glass-surface border-primary/20"
                    onClick={() => handleSectionSelect(section.id)}
                  >
                    <CardContent className="p-3 sm:p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-3 sm:space-x-4">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <section.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground text-sm sm:text-base truncate">{section.name}</h3>
                          <p className="text-xs sm:text-sm text-muted-foreground truncate">{section.description}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground flex-shrink-0" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <div className="p-4 sm:p-6 h-full overflow-y-auto">
              <HolographicCard className="p-3 sm:p-4 md:p-6">
                <CardHeader className="px-0 pt-0 pb-4">
                  <CardTitle className="flex items-center space-x-2 text-base sm:text-lg md:text-xl">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    <span>Profile Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 px-0 pb-0">
                  <div className="grid grid-cols-1 gap-3 sm:gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm sm:text-base">Username</Label>
                      <Input
                        value={profile.username}
                        onChange={(e) => setProfile({...profile, username: e.target.value})}
                        className="glass-surface border-primary/20 text-sm sm:text-base"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm sm:text-base">Display Name</Label>
                      <Input
                        value={profile.displayName}
                        onChange={(e) => setProfile({...profile, displayName: e.target.value})}
                        className="glass-surface border-primary/20 text-sm sm:text-base"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm sm:text-base">Timezone</Label>
                      <Select value={profile.timezone} onValueChange={(value) => setProfile({...profile, timezone: value})}>
                        <SelectTrigger className="glass-surface border-primary/20 text-sm sm:text-base">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UTC+0">UTC+0 (London)</SelectItem>
                          <SelectItem value="UTC-5">UTC-5 (New York)</SelectItem>
                          <SelectItem value="UTC+1">UTC+1 (Paris)</SelectItem>
                          <SelectItem value="UTC+9">UTC+9 (Tokyo)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm sm:text-base">Language</Label>
                      <Select value={profile.language} onValueChange={(value) => setProfile({...profile, language: value})}>
                        <SelectTrigger className="glass-surface border-primary/20 text-sm sm:text-base">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="spanish">Español</SelectItem>
                          <SelectItem value="french">Français</SelectItem>
                          <SelectItem value="german">Deutsch</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center space-x-2 text-sm sm:text-base">
                      <Signature className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Email Signature</span>
                    </Label>
                    <Textarea
                      value={profile.signature}
                      onChange={(e) => setProfile({...profile, signature: e.target.value})}
                      className="glass-surface border-primary/20 text-sm sm:text-base"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </HolographicCard>
            </div>
          )}

          {/* Theme Settings */}
          {activeTab === 'appearance' && (
            <div className="p-4 sm:p-6 h-full overflow-y-auto">
              <HolographicCard className="p-3 sm:p-4 md:p-6">
                <CardHeader className="px-0 pt-0 pb-4">
                  <CardTitle className="flex items-center space-x-2 text-base sm:text-lg md:text-xl">
                    <Palette className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    <span>Holographic Themes</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-0 pb-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {themes.map((theme) => (
                      <Card
                        key={theme.id}
                        className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                          currentTheme === theme.id 
                            ? 'ring-2 ring-primary shadow-glow' 
                            : 'glass-surface hover:shadow-hover'
                        }`}
                        onClick={() => onThemeChange(theme.id)}
                      >
                        <CardContent className="p-3 sm:p-4 text-center">
                          <div className={`w-full h-12 sm:h-16 rounded-lg mb-2 sm:mb-3 ${theme.preview} animate-pulse-glow`} />
                          <h3 className="font-medium text-sm sm:text-base">{theme.name}</h3>
                          {currentTheme === theme.id && (
                            <Badge className="mt-1 sm:mt-2 bg-primary text-xs">Active</Badge>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </HolographicCard>
            </div>
          )}

          {/* Qemail Settings */}
          {activeTab === 'email' && (
            <div className="p-4 sm:p-6 h-full overflow-y-auto">
              <HolographicCard className="p-3 sm:p-4 md:p-6">
                <CardHeader className="px-0 pt-0 pb-4">
                  <CardTitle className="flex items-center space-x-2 text-base sm:text-lg md:text-xl">
                    <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    <span>Qemail Preferences</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 px-0 pb-0">
                  <div className="grid grid-cols-1 gap-4 sm:gap-6">
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm sm:text-base">Auto-Reply</Label>
                        <Switch
                          checked={emailSettings.autoReply}
                          onCheckedChange={(checked) => setEmailSettings({...emailSettings, autoReply: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm sm:text-base">Read Receipts</Label>
                        <Switch
                          checked={emailSettings.readReceipts}
                          onCheckedChange={(checked) => setEmailSettings({...emailSettings, readReceipts: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm sm:text-base">Quantum Encryption</Label>
                        <Switch
                          checked={emailSettings.encryption}
                          onCheckedChange={(checked) => setEmailSettings({...emailSettings, encryption: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm sm:text-base">Spam Filter</Label>
                        <Switch
                          checked={emailSettings.spamFilter}
                          onCheckedChange={(checked) => setEmailSettings({...emailSettings, spamFilter: checked})}
                        />
                      </div>
                    </div>
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm sm:text-base">Notifications</Label>
                        <Switch
                          checked={emailSettings.notifications}
                          onCheckedChange={(checked) => setEmailSettings({...emailSettings, notifications: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm sm:text-base">Sound Alerts</Label>
                        <Switch
                          checked={emailSettings.soundAlerts}
                          onCheckedChange={(checked) => setEmailSettings({...emailSettings, soundAlerts: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm sm:text-base">Desktop Notifications</Label>
                        <Switch
                          checked={emailSettings.desktopNotifications}
                          onCheckedChange={(checked) => setEmailSettings({...emailSettings, desktopNotifications: checked})}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </HolographicCard>
            </div>
          )}

          {/* Secret Code Tab */}
          {activeTab === 'secret-code' && (
            <div className="p-4 sm:p-6 h-full overflow-y-auto space-y-3 sm:space-y-4">
              <HolographicCard className="p-3 sm:p-4 md:p-6">
                <CardHeader className="px-0 pt-0 pb-4">
                  <CardTitle className="flex items-center space-x-2 text-base sm:text-lg md:text-xl">
                    <Key className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    <span>Change Secret Code</span>
                  </CardTitle>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Change your secret code for enhanced security. You'll receive an automatic notification email.
                  </p>
                </CardHeader>
                <CardContent className="space-y-4 px-0 pb-0">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm sm:text-base">Current Secret Code</Label>
                      <div className="relative">
                        <Input
                          type={showCurrentSecret ? "text" : "password"}
                          value={secretCodeSettings.currentSecretCode}
                          onChange={(e) => setSecretCodeSettings(prev => ({ ...prev, currentSecretCode: e.target.value }))}
                          className="glass-surface border-primary/20 pr-10 text-sm sm:text-base"
                          placeholder="Enter your current secret code"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-2 h-6 w-6"
                          onClick={() => setShowCurrentSecret(!showCurrentSecret)}
                        >
                          {showCurrentSecret ? <EyeOff className="w-3 h-3 sm:w-4 sm:h-4" /> : <Eye className="w-3 h-3 sm:w-4 sm:h-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm sm:text-base">New Secret Code</Label>
                      <div className="relative">
                        <Input
                          type={showNewSecret ? "text" : "password"}
                          value={secretCodeSettings.newSecretCode}
                          onChange={(e) => setSecretCodeSettings(prev => ({ ...prev, newSecretCode: e.target.value }))}
                          className="glass-surface border-primary/20 pr-10 text-sm sm:text-base"
                          placeholder="Enter your new secret code (min 10 chars)"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-2 h-6 w-6"
                          onClick={() => setShowNewSecret(!showNewSecret)}
                        >
                          {showNewSecret ? <EyeOff className="w-3 h-3 sm:w-4 sm:h-4" /> : <Eye className="w-3 h-3 sm:w-4 sm:h-4" />}
                        </Button>
                      </div>
                      {secretCodeSettings.newSecretCode && (
                        <div className="text-xs text-muted-foreground">
                          {validateSecretCode(secretCodeSettings.newSecretCode).message}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm sm:text-base">Confirm New Secret Code</Label>
                      <div className="relative">
                        <Input
                          type={showConfirmSecret ? "text" : "password"}
                          value={secretCodeSettings.confirmSecretCode}
                          onChange={(e) => setSecretCodeSettings(prev => ({ ...prev, confirmSecretCode: e.target.value }))}
                          className="glass-surface border-primary/20 pr-10 text-sm sm:text-base"
                          placeholder="Confirm your new secret code"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-2 h-6 w-6"
                          onClick={() => setShowConfirmSecret(!showConfirmSecret)}
                        >
                          {showConfirmSecret ? <EyeOff className="w-3 h-3 sm:w-4 sm:h-4" /> : <Eye className="w-3 h-3 sm:w-4 sm:h-4" />}
                        </Button>
                      </div>
                      {secretCodeSettings.confirmSecretCode && secretCodeSettings.newSecretCode !== secretCodeSettings.confirmSecretCode && (
                        <div className="text-xs text-red-500 flex items-center gap-1">
                          <XCircle className="h-3 w-3" />
                          Secret codes do not match
                        </div>
                      )}
                      {secretCodeSettings.confirmSecretCode && secretCodeSettings.newSecretCode === secretCodeSettings.confirmSecretCode && (
                        <div className="text-xs text-green-500 flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Secret codes match
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-3 sm:pt-4">
                    <Button 
                      variant="outline" 
                      className="glass-hover text-xs sm:text-sm"
                      onClick={() => setSecretCodeSettings({
                        currentSecretCode: '',
                        newSecretCode: '',
                        confirmSecretCode: '',
                        isVerifying: false,
                        isChanging: false
                      })}
                    >
                      Clear
                    </Button>
                    <Button 
                      className="bg-gradient-primary hover:shadow-hover text-xs sm:text-sm"
                      onClick={handleChangeSecretCode}
                      disabled={secretCodeSettings.isChanging || !secretCodeSettings.currentSecretCode || !secretCodeSettings.newSecretCode || !secretCodeSettings.confirmSecretCode}
                    >
                      <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      {secretCodeSettings.isChanging ? 'Changing...' : 'Change Secret Code'}
                    </Button>
                  </div>
                </CardContent>
              </HolographicCard>

              <HolographicCard className="p-3 sm:p-4 md:p-6">
                <CardHeader className="px-0 pt-0 pb-4">
                  <CardTitle className="text-sm sm:text-lg">Security Requirements</CardTitle>
                </CardHeader>
                <CardContent className="px-0 pb-0">
                  <div className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      {secretCodeSettings.newSecretCode.length >= 10 ? <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" /> : <XCircle className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />}
                      At least 10 characters long
                    </div>
                    <div className="flex items-center gap-2">
                      {/[A-Z]/.test(secretCodeSettings.newSecretCode) ? <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" /> : <XCircle className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />}
                      At least one uppercase letter
                    </div>
                    <div className="flex items-center gap-2">
                      {/[a-z]/.test(secretCodeSettings.newSecretCode) ? <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" /> : <XCircle className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />}
                      At least one lowercase letter
                    </div>
                    <div className="flex items-center gap-2">
                      {/\d/.test(secretCodeSettings.newSecretCode) ? <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" /> : <XCircle className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />}
                      At least one number
                    </div>
                  </div>
                </CardContent>
              </HolographicCard>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="p-4 sm:p-6 h-full overflow-y-auto">
              <HolographicCard className="p-3 sm:p-4 md:p-6">
                <CardHeader className="px-0 pt-0 pb-4">
                  <CardTitle className="flex items-center space-x-2 text-base sm:text-lg md:text-xl">
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    <span>Quantum Security</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 px-0 pb-0">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm sm:text-base">Change Password</Label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="New password"
                          className="glass-surface border-primary/20 pr-10 text-sm sm:text-base"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-2 h-6 w-6"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="w-3 h-3 sm:w-4 sm:h-4" /> : <Eye className="w-3 h-3 sm:w-4 sm:h-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 glass-surface rounded-lg gap-2 sm:gap-3">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm sm:text-base">Two-Factor Authentication</h4>
                          <p className="text-xs sm:text-sm text-muted-foreground">Enhanced security for your account</p>
                        </div>
                        <Button className="bg-gradient-primary whitespace-nowrap text-xs sm:text-sm">Enable 2FA</Button>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 glass-surface rounded-lg gap-2 sm:gap-3">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm sm:text-base">Quantum Key Exchange</h4>
                          <p className="text-xs sm:text-sm text-muted-foreground">Ultimate encryption protection</p>
                        </div>
                        <Badge className="bg-green-500 whitespace-nowrap text-xs">Active</Badge>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 glass-surface rounded-lg gap-2 sm:gap-3">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm sm:text-base">Session Timeout</h4>
                          <p className="text-xs sm:text-sm text-muted-foreground">Auto-logout after inactivity</p>
                        </div>
                        <Select defaultValue="30">
                          <SelectTrigger className="w-20 sm:w-24 glass-surface text-xs sm:text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="15">15 min</SelectItem>
                            <SelectItem value="30">30 min</SelectItem>
                            <SelectItem value="60">1 hour</SelectItem>
                            <SelectItem value="0">Never</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </HolographicCard>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 border-t border-primary/20 gap-3 sm:gap-4 relative z-10 bg-gradient-to-t from-primary/5 to-transparent">
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
            <Button variant="outline" className="glass-hover text-xs sm:text-sm">
              <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Export
            </Button>
            <Button variant="outline" className="glass-hover text-xs sm:text-sm">
              <Upload className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Import
            </Button>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-center sm:justify-end">
            <Button variant="outline" onClick={handleClose} className="glass-hover text-xs sm:text-sm">
              Cancel
            </Button>
            <Button className="bg-gradient-primary hover:shadow-hover text-xs sm:text-sm">
              <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Save Settings
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Settings3D;