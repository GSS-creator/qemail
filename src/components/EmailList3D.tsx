import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Star, Paperclip, AlertTriangle, Clock, 
  CheckCircle2, Circle, Zap 
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

interface EmailList3DProps {
  emails: Email[];
  selectedEmail: Email | null;
  onEmailSelect: (email: Email) => void;
  currentFolder: string;
}

const EmailList3D: React.FC<EmailList3DProps> = ({
  emails,
  selectedEmail,
  onEmailSelect,
  currentFolder
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-danger';
      case 'high': return 'text-warning';
      case 'normal': return 'text-info';
      case 'low': return 'text-muted-foreground';
      default: return 'text-info';
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
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getPreviewText = (content: string) => {
    const text = content.replace(/<[^>]*>/g, '');
    return text.length > 100 ? text.substring(0, 100) + '...' : text;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-primary/20">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold capitalize bg-gradient-primary bg-clip-text text-transparent">
            {currentFolder}
          </h2>
          <Badge variant="secondary" className="bg-primary/20 text-primary animate-pulse">
            {emails.length}
          </Badge>
        </div>
      </div>

      {/* Email List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {emails.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4 animate-pulse-glow">
              <Circle className="w-8 h-8 text-white" />
            </div>
            <p className="text-lg font-medium text-muted-foreground">No emails found</p>
            <p className="text-sm text-muted-foreground mt-2">
              Your {currentFolder} folder is empty
            </p>
          </div>
        ) : (
          emails.map((email, index) => {
            const isSelected = selectedEmail?.id === email.id;
            const PriorityIcon = getPriorityIcon(email.priority);
            
            return (
              <Card
                key={email.id}
                className={`
                  email-item-3d glass-hover cursor-pointer transition-all duration-300 p-4
                  animate-slide-in-3d group relative overflow-hidden
                  ${isSelected 
                    ? 'glass-surface bg-gradient-primary shadow-glow border-primary' 
                    : `glass-surface border-primary/10 hover:border-primary/30 ${!email.isRead ? 'border-accent/30' : ''}`
                  }
                `}
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => onEmailSelect(email)}
              >
                <div className="flex items-start space-x-3">
                  {/* Read Status & Priority */}
                  <div className="flex flex-col items-center space-y-1 mt-1">
                    <div className={`
                      w-2 h-2 rounded-full transition-all duration-300
                      ${!email.isRead 
                        ? 'bg-accent animate-pulse-glow' 
                        : 'bg-muted-foreground/30'
                      }
                    `} />
                    <PriorityIcon className={`w-3 h-3 ${getPriorityColor(email.priority)}`} />
                  </div>

                  {/* Email Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2 min-w-0">
                        <span className={`
                          font-medium truncate transition-colors duration-300
                          ${isSelected ? 'text-white' : 'text-foreground group-hover:text-primary'}
                          ${!email.isRead ? 'font-semibold' : ''}
                        `}>
                          {email.from}
                        </span>
                        {email.isStarred && (
                          <Star className="w-4 h-4 text-warning fill-current animate-pulse" />
                        )}
                      </div>
                      <span className={`
                        text-xs transition-colors duration-300 whitespace-nowrap ml-2
                        ${isSelected ? 'text-white/70' : 'text-muted-foreground'}
                      `}>
                        {formatDate(email.date)}
                      </span>
                    </div>

                    <h3 className={`
                      text-sm font-medium mb-2 line-clamp-1 transition-colors duration-300
                      ${isSelected ? 'text-white' : 'text-foreground group-hover:text-primary'}
                      ${!email.isRead ? 'font-semibold' : ''}
                    `}>
                      {email.subject}
                    </h3>

                    <p className={`
                      text-xs line-clamp-2 transition-colors duration-300
                      ${isSelected ? 'text-white/70' : 'text-muted-foreground'}
                    `}>
                      {getPreviewText(email.content)}
                    </p>

                    {/* Labels */}
                    {email.labels.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {email.labels.map(label => (
                          <Badge
                            key={label}
                            variant="secondary"
                            className={`
                              text-xs px-2 py-0 transition-all duration-300
                              ${isSelected 
                                ? 'bg-white/20 text-white' 
                                : 'bg-accent/20 text-accent group-hover:bg-accent/30'
                              }
                            `}
                          >
                            {label}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Hover effect overlay */}
                <div className={`
                  absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 
                  transition-opacity duration-300 pointer-events-none
                  ${isSelected ? 'opacity-10' : ''}
                `} />

                {/* Selection indicator */}
                {isSelected && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-white animate-pulse-glow" />
                )}
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default EmailList3D;