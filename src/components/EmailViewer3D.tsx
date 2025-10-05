import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Reply, Forward, Star, Archive, Trash2, MoreHorizontal,
  Clock, User, Mail, Tag, AlertTriangle, Zap, Circle,
  Download, Flag, Shield
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

interface EmailViewer3DProps {
  email: Email | null;
  onReply: () => void;
  onForward: () => void;
  onStar: () => void;
  onArchive: () => void;
  onDelete: () => void;
}

const EmailViewer3D: React.FC<EmailViewer3DProps> = ({
  email,
  onReply,
  onForward,
  onStar,
  onArchive,
  onDelete
}) => {
  if (!email) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-background relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-gradient-primary opacity-10 animate-floating"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 100 + 50}px`,
                height: `${Math.random() * 100 + 50}px`,
                animationDelay: `${Math.random() * 6}s`,
              }}
            />
          ))}
        </div>

        <div className="text-center relative z-10">
          <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center mb-6 animate-pulse-glow mx-auto">
            <Mail className="w-12 h-12 text-white animate-bounce-3d" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            Select an Email
          </h2>
          <p className="text-muted-foreground">
            Choose an email from the list to view its contents
          </p>
        </div>
      </div>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'danger';
      case 'high': return 'warning';
      case 'normal': return 'info';
      case 'low': return 'muted-foreground';
      default: return 'info';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return AlertTriangle;
      case 'high': return Zap;
      case 'normal': return Circle;
      case 'low': return Clock;
      default: return Circle;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const PriorityIcon = getPriorityIcon(email.priority);
  const priorityColor = getPriorityColor(email.priority);

  return (
    <div className="h-full flex flex-col bg-gradient-background relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 opacity-30">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-accent opacity-20 animate-floating"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 80 + 40}px`,
              height: `${Math.random() * 80 + 40}px`,
              animationDelay: `${Math.random() * 6}s`,
            }}
          />
        ))}
      </div>

      {/* Toolbar */}
      <div className="glass-surface border-b border-primary/20 p-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onReply}
              className="glass-hover border-primary/20 hover:border-primary"
            >
              <Reply className="w-4 h-4 mr-2" />
              Reply
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onForward}
              className="glass-hover border-secondary/20 hover:border-secondary"
            >
              <Forward className="w-4 h-4 mr-2" />
              Forward
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onStar}
              className={`glass-hover ${email.isStarred ? 'text-warning' : 'text-muted-foreground'}`}
            >
              <Star className={`w-4 h-4 ${email.isStarred ? 'fill-current' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onArchive}
              className="glass-hover text-info hover:text-info"
            >
              <Archive className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              className="glass-hover text-danger hover:text-danger"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="glass-hover">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Email Content */}
      <div className="flex-1 overflow-y-auto p-6 relative z-10">
        <Card className="glass-surface border-primary/20 animate-slide-in-3d">
          <CardHeader className="space-y-4">
            {/* Subject */}
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {email.subject}
              </h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <PriorityIcon className={`w-4 h-4 text-status-${priorityColor}`} />
                  <Badge
                    variant="secondary"
                    className={`bg-status-${priorityColor}/20 text-status-${priorityColor} capitalize`}
                  >
                    {email.priority} Priority
                  </Badge>
                </div>
                {email.labels.map(label => (
                  <Badge
                    key={label}
                    variant="outline"
                    className="border-accent/30 text-accent"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {label}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Sender Info */}
            <div className="flex items-center justify-between p-4 glass-surface rounded-lg border border-primary/10">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-secondary rounded-full flex items-center justify-center animate-pulse-glow">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{email.from}</h3>
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Mail className="w-3 h-3" />
                    <span>{email.fromEmail}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>{formatDate(email.date)}</span>
                </div>
                {!email.isRead && (
                  <Badge variant="secondary" className="mt-1 bg-accent/20 text-accent">
                    Unread
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {/* Email Body */}
            <div 
              className="prose prose-invert max-w-none glass-surface p-6 rounded-lg border border-primary/10"
              dangerouslySetInnerHTML={{ __html: email.content }}
            />

            {/* Security Info */}
            <div className="mt-6 p-4 glass-surface rounded-lg border border-success/20 bg-success/5">
              <div className="flex items-center space-x-2 text-status-success">
                <Shield className="w-4 h-4" />
                <span className="text-sm font-medium">
                  This email was verified and encrypted using QSSN security protocols
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmailViewer3D;