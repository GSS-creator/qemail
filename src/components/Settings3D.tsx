import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Settings, User, Palette, Server, Shield, Bell, 
  Signature, Globe, Database, Key, Eye, EyeOff,
  Save, RefreshCw, Trash2, Download, Upload, Zap
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import HolographicCard from '@/components/3D/HolographicCard';
import FloatingIcon from '@/components/3D/FloatingIcon';

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
  const [profile, setProfile] = useState({
    username: 'user@qssn.email',
    displayName: 'QSSN User',
    signature: 'Sent from QSSN Email - Quantum Secure Communications',
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

  const [serverSettings, setServerSettings] = useState({
    smtpServer: 'smtp.qssn.email',
    smtpPort: '587',
    imapServer: 'imap.qssn.email',
    imapPort: '993',
    encryption: 'TLS',
    authentication: 'OAuth2'
  });

  const [showPassword, setShowPassword] = useState(false);

  const themes = [
    { id: 'default', name: 'Default', preview: 'bg-gradient-to-r from-blue-800 to-indigo-900' },
    { id: 'dark', name: 'Dark', preview: 'bg-gradient-to-r from-gray-800 to-gray-900' },
    { id: 'light', name: 'Light', preview: 'bg-gradient-to-r from-gray-100 to-blue-100' },
    { id: 'quantum', name: 'Quantum', preview: 'bg-gradient-to-r from-indigo-900 to-purple-900' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] glass-surface border-primary/20 animate-slide-in-3d overflow-hidden" style={{background: 'var(--card-bg)', color: 'var(--text-primary)'}}>
        <DialogHeader className="border-b border-primary/20 pb-4">
          <DialogTitle className="flex items-center space-x-3">
            <FloatingIcon Icon={Settings} className="text-accent" />
            <span className="text-xl bg-gradient-primary bg-clip-text text-transparent">
              QSSN Email Settings
            </span>
            <Zap className="w-5 h-5 text-primary animate-pulse" />
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid grid-cols-5 glass-surface">
            <TabsTrigger value="profile" className="glass-hover">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="appearance" className="glass-hover">
              <Palette className="w-4 h-4 mr-2" />
              Themes
            </TabsTrigger>
            <TabsTrigger value="email" className="glass-hover">
              <Bell className="w-4 h-4 mr-2" />
              Email
            </TabsTrigger>
            <TabsTrigger value="server" className="glass-hover">
              <Server className="w-4 h-4 mr-2" />
              Server
            </TabsTrigger>
            <TabsTrigger value="security" className="glass-hover">
              <Shield className="w-4 h-4 mr-2" />
              Security
            </TabsTrigger>
          </TabsList>

          <div className="mt-6 max-h-[60vh] overflow-y-auto">
            {/* Profile Settings */}
            <TabsContent value="profile" className="space-y-6">
              <HolographicCard className="p-6">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-primary" />
                    <span>Profile Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Username</Label>
                      <Input
                        value={profile.username}
                        onChange={(e) => setProfile({...profile, username: e.target.value})}
                        className="glass-surface border-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Display Name</Label>
                      <Input
                        value={profile.displayName}
                        onChange={(e) => setProfile({...profile, displayName: e.target.value})}
                        className="glass-surface border-primary/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Timezone</Label>
                      <Select value={profile.timezone} onValueChange={(value) => setProfile({...profile, timezone: value})}>
                        <SelectTrigger className="glass-surface border-primary/20">
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
                      <Label>Language</Label>
                      <Select value={profile.language} onValueChange={(value) => setProfile({...profile, language: value})}>
                        <SelectTrigger className="glass-surface border-primary/20">
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
                    <Label className="flex items-center space-x-2">
                      <Signature className="w-4 h-4" />
                      <span>Email Signature</span>
                    </Label>
                    <Textarea
                      value={profile.signature}
                      onChange={(e) => setProfile({...profile, signature: e.target.value})}
                      className="glass-surface border-primary/20"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </HolographicCard>
            </TabsContent>

            {/* Theme Settings */}
            <TabsContent value="appearance" className="space-y-6">
              <HolographicCard className="p-6">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Palette className="w-5 h-5 text-primary" />
                    <span>Holographic Themes</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
                        <CardContent className="p-4 text-center">
                          <div className={`w-full h-16 rounded-lg mb-3 ${theme.preview} animate-pulse-glow`} />
                          <h3 className="font-medium">{theme.name}</h3>
                          {currentTheme === theme.id && (
                            <Badge className="mt-2 bg-primary">Active</Badge>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </HolographicCard>
            </TabsContent>

            {/* Email Settings */}
            <TabsContent value="email" className="space-y-6">
              <HolographicCard className="p-6">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="w-5 h-5 text-primary" />
                    <span>Email Preferences</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Auto-Reply</Label>
                        <Switch
                          checked={emailSettings.autoReply}
                          onCheckedChange={(checked) => setEmailSettings({...emailSettings, autoReply: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Read Receipts</Label>
                        <Switch
                          checked={emailSettings.readReceipts}
                          onCheckedChange={(checked) => setEmailSettings({...emailSettings, readReceipts: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Quantum Encryption</Label>
                        <Switch
                          checked={emailSettings.encryption}
                          onCheckedChange={(checked) => setEmailSettings({...emailSettings, encryption: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Spam Filter</Label>
                        <Switch
                          checked={emailSettings.spamFilter}
                          onCheckedChange={(checked) => setEmailSettings({...emailSettings, spamFilter: checked})}
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Notifications</Label>
                        <Switch
                          checked={emailSettings.notifications}
                          onCheckedChange={(checked) => setEmailSettings({...emailSettings, notifications: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Sound Alerts</Label>
                        <Switch
                          checked={emailSettings.soundAlerts}
                          onCheckedChange={(checked) => setEmailSettings({...emailSettings, soundAlerts: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Desktop Notifications</Label>
                        <Switch
                          checked={emailSettings.desktopNotifications}
                          onCheckedChange={(checked) => setEmailSettings({...emailSettings, desktopNotifications: checked})}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </HolographicCard>
            </TabsContent>

            {/* Server Settings */}
            <TabsContent value="server" className="space-y-6">
              <HolographicCard className="p-6">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Server className="w-5 h-5 text-primary" />
                    <span>Server Configuration</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>SMTP Server</Label>
                      <Input
                        value={serverSettings.smtpServer}
                        onChange={(e) => setServerSettings({...serverSettings, smtpServer: e.target.value})}
                        className="glass-surface border-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>SMTP Port</Label>
                      <Input
                        value={serverSettings.smtpPort}
                        onChange={(e) => setServerSettings({...serverSettings, smtpPort: e.target.value})}
                        className="glass-surface border-primary/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>IMAP Server</Label>
                      <Input
                        value={serverSettings.imapServer}
                        onChange={(e) => setServerSettings({...serverSettings, imapServer: e.target.value})}
                        className="glass-surface border-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>IMAP Port</Label>
                      <Input
                        value={serverSettings.imapPort}
                        onChange={(e) => setServerSettings({...serverSettings, imapPort: e.target.value})}
                        className="glass-surface border-primary/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Encryption Method</Label>
                      <Select value={serverSettings.encryption} onValueChange={(value) => setServerSettings({...serverSettings, encryption: value})}>
                        <SelectTrigger className="glass-surface border-primary/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="TLS">TLS</SelectItem>
                          <SelectItem value="SSL">SSL</SelectItem>
                          <SelectItem value="STARTTLS">STARTTLS</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Authentication</Label>
                      <Select value={serverSettings.authentication} onValueChange={(value) => setServerSettings({...serverSettings, authentication: value})}>
                        <SelectTrigger className="glass-surface border-primary/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="OAuth2">OAuth 2.0</SelectItem>
                          <SelectItem value="Password">Password</SelectItem>
                          <SelectItem value="XOAUTH2">XOAUTH2</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </HolographicCard>
            </TabsContent>

            {/* Security Settings */}
            <TabsContent value="security" className="space-y-6">
              <HolographicCard className="p-6">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-primary" />
                    <span>Quantum Security</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Change Password</Label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="New password"
                          className="glass-surface border-primary/20 pr-10"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-2 h-6 w-6"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 glass-surface rounded-lg">
                        <div>
                          <h4 className="font-medium">Two-Factor Authentication</h4>
                          <p className="text-sm text-muted-foreground">Enhanced security for your account</p>
                        </div>
                        <Button className="bg-gradient-primary">Enable 2FA</Button>
                      </div>

                      <div className="flex items-center justify-between p-4 glass-surface rounded-lg">
                        <div>
                          <h4 className="font-medium">Quantum Key Exchange</h4>
                          <p className="text-sm text-muted-foreground">Ultimate encryption protection</p>
                        </div>
                        <Badge className="bg-green-500">Active</Badge>
                      </div>

                      <div className="flex items-center justify-between p-4 glass-surface rounded-lg">
                        <div>
                          <h4 className="font-medium">Session Timeout</h4>
                          <p className="text-sm text-muted-foreground">Auto-logout after inactivity</p>
                        </div>
                        <Select defaultValue="30">
                          <SelectTrigger className="w-24 glass-surface">
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
            </TabsContent>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-primary/20 mt-6">
            <div className="flex items-center space-x-2">
              <Button variant="outline" className="glass-hover">
                <Download className="w-4 h-4 mr-2" />
                Export Settings
              </Button>
              <Button variant="outline" className="glass-hover">
                <Upload className="w-4 h-4 mr-2" />
                Import Settings
              </Button>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={onClose} className="glass-hover">
                Cancel
              </Button>
              <Button className="bg-gradient-primary hover:shadow-hover">
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </Button>
            </div>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default Settings3D;