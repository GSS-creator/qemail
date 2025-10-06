import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  X, Send, Paperclip, Smile, Bold, Italic, 
  Underline, Link, Image, Palette, Clock,
  User, Mail, FileText, Zap, Sparkles
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ComposeDialog3DProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (emailData: any) => void;
}

interface Attachment {
  id: string;
  name: string;
  size: string;
  type: string;
}

const ComposeDialog3D: React.FC<ComposeDialog3DProps> = ({
  isOpen,
  onClose,
  onSend
}) => {
  const [to, setTo] = useState('');
  const [cc, setCc] = useState('');
  const [bcc, setBcc] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<'low' | 'normal' | 'high' | 'urgent'>('normal');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!to.trim() || !subject.trim()) {
      return;
    }

    setIsSending(true);

    // Simulate sending delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const emailData = {
      to: to.split(',').map(email => email.trim()),
      cc: cc.split(',').map(email => email.trim()).filter(Boolean),
      bcc: bcc.split(',').map(email => email.trim()).filter(Boolean),
      subject,
      content,
      priority,
      attachments
    };

    onSend(emailData);
    
    // Reset form
    setTo('');
    setCc('');
    setBcc('');
    setSubject('');
    setContent('');
    setPriority('normal');
    setAttachments([]);
    setShowCc(false);
    setShowBcc(false);
    setIsSending(false);
  };

  const handleAttachment = () => {
    // Simulate file selection
    const newAttachment: Attachment = {
      id: Date.now().toString(),
      name: 'document.pdf',
      size: '2.4 MB',
      type: 'application/pdf'
    };
    setAttachments([...attachments, newAttachment]);
  };

  const removeAttachment = (id: string) => {
    setAttachments(attachments.filter(att => att.id !== id));
  };

  const getPriorityColor = (priorityLevel: string) => {
    switch (priorityLevel) {
      case 'urgent': return 'danger';
      case 'high': return 'warning';
      case 'normal': return 'info';
      case 'low': return 'muted';
      default: return 'info';
    }
  };



  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="compose-dialog-content glass-surface border-primary/20 animate-slide-in-3d overflow-hidden">
        <DialogHeader className="border-b border-primary/20 pb-4">
          <DialogTitle className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center animate-pulse-glow">
              <Mail className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl bg-gradient-primary bg-clip-text text-transparent">
              Compose Email
            </span>
            <Sparkles className="w-5 h-5 text-accent animate-rotate-y" />
          </DialogTitle>
        </DialogHeader>

        <div className="compose-layout">
          {/* Main Compose Area */}
          <div className="compose-main-area">
          {/* Recipients */}
          <div className="space-y-4">
            <div className="compose-recipients-row">
              <Label className="compose-label">To:</Label>
              <div className="compose-input-wrapper">
                <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Enter recipient email addresses (comma separated)"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="compose-input"
                />
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCc(!showCc)}
                  className={`glass-hover ${showCc ? 'text-secondary' : 'text-muted-foreground'}`}
                >
                  Cc
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowBcc(!showBcc)}
                  className={`glass-hover ${showBcc ? 'text-accent' : 'text-muted-foreground'}`}
                >
                  Bcc
                </Button>
              </div>
            </div>

            {showCc && (
              <div className="compose-recipients-row animate-slide-in-3d">
                <Label className="compose-label">Cc:</Label>
                <Input
                  placeholder="Carbon copy recipients"
                  value={cc}
                  onChange={(e) => setCc(e.target.value)}
                  className="flex-1 glass-surface border-secondary/20 focus:border-secondary focus:shadow-glow"
                />
              </div>
            )}

            {showBcc && (
              <div className="compose-recipients-row animate-slide-in-3d">
                <Label className="compose-label">Bcc:</Label>
                <Input
                  placeholder="Blind carbon copy recipients"
                  value={bcc}
                  onChange={(e) => setBcc(e.target.value)}
                  className="flex-1 glass-surface border-accent/20 focus:border-accent focus:shadow-glow"
                />
              </div>
            )}
          </div>

          {/* Subject & Priority */}
          <div className="compose-subject-row">
            <Label className="compose-label">Subject:</Label>
            <div className="compose-input-wrapper">
              <FileText className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Email subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="pl-10 pr-32 glass-surface border-primary/20 focus:border-primary focus:shadow-glow"
              />
              <div className="absolute right-2 top-2">
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className={`
                    px-3 py-1 rounded-md text-xs font-medium border glass-surface
                    bg-status-${getPriorityColor(priority)}/20 
                    text-status-${getPriorityColor(priority)}
                    border-status-${getPriorityColor(priority)}/30
                  `}
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>
          </div>

          {/* Formatting Toolbar */}
          <div className="compose-toolbar">
            <div className="compose-toolbar-group">
              <Button variant="ghost" size="icon" className="glass-hover w-8 h-8">
                <Bold className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="glass-hover w-8 h-8">
                <Italic className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="glass-hover w-8 h-8">
                <Underline className="w-4 h-4" />
              </Button>
              <div className="w-px h-6 bg-border mx-2" />
              <Button variant="ghost" size="icon" className="glass-hover w-8 h-8">
                <Link className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="glass-hover w-8 h-8">
                <Image className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="glass-hover w-8 h-8">
                <Smile className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" className="glass-hover w-8 h-8">
                <Palette className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="glass-hover w-8 h-8"
                onClick={handleAttachment}
              >
                <Paperclip className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Message Content */}
          <div className="space-y-2">
            <Label className="font-medium">Message:</Label>
            <Textarea
              placeholder="Write your message here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="compose-textarea glass-surface border-primary/20 focus:border-primary focus:shadow-glow"
            />
          </div>

          {/* Attachments */}
          {attachments.length > 0 && (
            <Card className="glass-surface border-accent/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center space-x-2">
                  <Paperclip className="w-4 h-4" />
                  <span>Attachments ({attachments.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center justify-between p-2 glass-surface rounded border border-accent/10"
                  >
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-accent" />
                      <span className="text-sm font-medium">{attachment.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {attachment.size}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeAttachment(attachment.id)}
                      className="w-6 h-6 text-danger hover:text-danger hover:bg-danger/10"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
          </div>
        </div>

        {/* Actions */}
        <div className="compose-actions">
          <div className="compose-actions-left">
            <Clock className="w-4 h-4" />
            <span>Auto-save enabled</span>
          </div>
          
          <div className="compose-actions-right">
            <Button
              variant="outline"
              onClick={onClose}
              className="glass-hover border-muted/20"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSend}
              disabled={!to.trim() || !subject.trim() || isSending}
              className="glass-surface bg-gradient-primary hover:shadow-hover transform hover:scale-105 transition-all duration-300 group"
            >
              {isSending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2 group-hover:animate-bounce-3d" />
                  Send Email
                  <Zap className="w-4 h-4 ml-2 animate-pulse" />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ComposeDialog3D;