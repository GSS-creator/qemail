import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Reply, Forward, Star, Archive, Trash2, MoreHorizontal,
  Clock, User, Mail, Tag, AlertTriangle, Zap, Circle,
  Download, Flag, Shield, Maximize2, X, Sparkles
} from 'lucide-react';

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

interface EmailViewDialog3DProps {
  isOpen: boolean;
  onClose: () => void;
  email: Email | null;
  onReply: () => void;
  onForward: () => void;
  onStar: () => void;
  onArchive: () => void;
  onDelete: () => void;
}

const EmailViewDialog3D: React.FC<EmailViewDialog3DProps> = ({
  isOpen,
  onClose,
  email,
  onReply,
  onForward,
  onStar,
  onArchive,
  onDelete
}) => {
  const [showTapIndicator, setShowTapIndicator] = useState(false);

  useEffect(() => {
    if (showTapIndicator) {
      const timer = setTimeout(() => setShowTapIndicator(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showTapIndicator]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-500';
      case 'high': return 'text-orange-500';
      case 'normal': return 'text-blue-500';
      case 'low': return 'text-gray-500';
      default: return 'text-blue-500';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return <AlertTriangle className="w-3 h-3 text-red-500" />;
      case 'high': return <Zap className="w-3 h-3 text-orange-500" />;
      case 'normal': return <Circle className="w-3 h-3 text-blue-500" />;
      case 'low': return <Circle className="w-3 h-3 text-gray-500" />;
      default: return <Circle className="w-3 h-3 text-blue-500" />;
    }
  };

  if (!email) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="email-view-dialog-content overflow-auto">
        <DialogHeader className="email-view-header p-4 border-b border-primary/20 flex flex-row items-center justify-between flex-shrink-0">
          <DialogTitle className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center animate-pulse-glow">
              <Mail className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl bg-gradient-primary bg-clip-text text-transparent">
              Email Details
            </span>
            <Sparkles className="w-5 h-5 text-accent animate-rotate-y" />
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="glass-hover"
          >
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>

        {/* Toolbar */}
        <div className="email-view-toolbar flex items-center justify-between p-4 border-b border-primary/20 bg-surface/30 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onReply}
              className="glass-hover"
            >
              <Reply className="w-4 h-4 mr-1" />
              Reply
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onForward}
              className="glass-hover"
            >
              <Forward className="w-4 h-4 mr-1" />
              Forward
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onStar}
              className={`glass-hover ${email.isStarred ? 'text-yellow-500' : ''}`}
            >
              <Star className={`w-4 h-4 mr-1 ${email.isStarred ? 'fill-current' : ''}`} />
              {email.isStarred ? 'Unstar' : 'Star'}
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onArchive}
              className="glass-hover"
            >
              <Archive className="w-4 h-4 mr-1" />
              Archive
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="glass-hover text-red-500 hover:text-red-400"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>

        {/* Email Header */}
        <div className="p-4 border-b border-primary/20 bg-surface/20 flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-foreground mb-2">
                {email.subject}
              </h2>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>{email.from}</span>
                  <span className="text-xs">&lt;{email.fromEmail}&gt;</span>
                </div>
                <div className="flex items-center space-x-1">
                  {getPriorityIcon(email.priority)}
                  <span className="capitalize">{email.priority}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{formatDate(email.date)}</span>
                {!email.isRead && (
                  <Badge variant="secondary" className="bg-accent/20 text-accent">
                    Unread
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Email Body - Now part of main scroll area */}
        <div className="p-4 space-y-4">
          {/* Labels */}
          {email.labels.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {email.labels.map((label, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {label}
                </Badge>
              ))}
            </div>
          )}

          {/* Email Content - Scrollable Container */}
          <div className="email-content-scroll-container overflow-auto max-h-96 border border-primary/20 rounded-lg bg-surface/20 p-4">
            <div 
              className="email-body-content prose prose-invert max-w-none glass-surface mobile-email-body"
              style={{ maxWidth: '100%', overflowWrap: 'break-word' }}
              dangerouslySetInnerHTML={{ 
                __html: email.content || '<p>No content available</p>' 
              }}
            />
          </div>
        </div>

        {/* Tap indicator for mobile */}
        {showTapIndicator && (
          <div className="fullscreen-tap-indicator show" />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EmailViewDialog3D;