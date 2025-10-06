import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Inbox, Send, FileText, Trash2, Archive, Star, 
  Shield, AlertTriangle, Folder, Sparkles 
} from 'lucide-react';

interface FolderList3DProps {
  currentFolder: string;
  onFolderChange: (folder: string) => void;
  unreadCount: number;
}

interface FolderItem {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  count?: number;
  color: string;
}

const FolderList3D: React.FC<FolderList3DProps> = ({ 
  currentFolder, 
  onFolderChange, 
  unreadCount 
}) => {
  const folders: FolderItem[] = [
    { 
      id: 'inbox', 
      name: 'Inbox', 
      icon: Inbox, 
      count: unreadCount,
      color: 'primary'
    },
    { 
      id: 'sent', 
      name: 'Sent', 
      icon: Send,
      color: 'secondary'
    },
    { 
      id: 'drafts', 
      name: 'Drafts', 
      icon: FileText,
      color: 'accent'
    },
    { 
      id: 'starred', 
      name: 'Starred', 
      icon: Star,
      color: 'warning'
    },
    { 
      id: 'trash', 
      name: 'Trash', 
      icon: Trash2,
      color: 'danger'
    },
  ];

  return (
    <div className="p-4 space-y-2">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Folders
        </h3>
        <Sparkles className="w-4 h-4 text-primary animate-pulse" />
      </div>
      
      {folders.map((folder, index) => {
        const Icon = folder.icon;
        const isActive = currentFolder === folder.id;
        
        return (
          <Button
            key={folder.id}
            variant={isActive ? "default" : "ghost"}
            onClick={() => onFolderChange(folder.id)}
            className={`
              w-full justify-start folder-3d glass-hover group relative overflow-hidden
              ${isActive ? 'glass-surface bg-gradient-primary shadow-glow' : 'hover:bg-primary/10'}
              animate-slide-in-3d
            `}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-3">
                <div className={`
                  relative p-1 rounded-lg transition-all duration-300
                  ${isActive ? 'bg-white/20' : 'group-hover:bg-primary/20'}
                `}>
                  <Icon className={`
                    w-4 h-4 transition-all duration-300
                    ${isActive ? 'text-white animate-bounce-3d' : `text-${folder.color} group-hover:scale-110`}
                  `} />
                  {isActive && (
                    <div className="absolute inset-0 bg-white/10 rounded-lg animate-pulse-glow" />
                  )}
                </div>
                <span className={`
                  font-medium transition-all duration-300
                  ${isActive ? 'text-white' : 'text-foreground group-hover:text-primary'}
                `}>
                  {folder.name}
                </span>
              </div>
              
              {folder.count && folder.count > 0 && (
                <Badge 
                  variant="secondary" 
                  className={`
                    min-w-[20px] h-5 text-xs animate-pulse-glow
                    ${isActive ? 'bg-white/20 text-white' : 'bg-primary/20 text-primary'}
                  `}
                >
                  {folder.count}
                </Badge>
              )}
            </div>
            
            {/* Hover effect overlay */}
            <div className={`
              absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 
              transition-opacity duration-300 pointer-events-none
              ${isActive ? 'opacity-20' : ''}
            `} />
          </Button>
        );
      })}
      
      {/* Custom Labels Section - These will filter existing emails rather than call API */}
      <div className="pt-4 border-t border-primary/20">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Labels
          </h3>
          <Button variant="ghost" size="sm" className="p-1 h-6 w-6 glass-hover">
            <Folder className="w-3 h-3" />
          </Button>
        </div>
        
        {['Work', 'Personal', 'Important'].map((label, index) => (
          <Button
            key={label}
            variant={currentFolder === label.toLowerCase() ? "default" : "ghost"}
            onClick={() => onFolderChange(label.toLowerCase())}
            className={`
              w-full justify-start glass-hover group animate-slide-in-3d
              ${currentFolder === label.toLowerCase() ? 'glass-surface bg-gradient-primary shadow-glow' : 'hover:bg-primary/10'}
            `}
            style={{ animationDelay: `${(folders.length + index) * 0.1}s` }}
          >
            <div className={`
              w-3 h-3 rounded-full mr-3 group-hover:animate-pulse
              ${currentFolder === label.toLowerCase() ? 'bg-white/20' : 'bg-accent'}
            `} />
            <span className={`
              font-medium transition-all duration-300
              ${currentFolder === label.toLowerCase() ? 'text-white' : 'text-foreground group-hover:text-primary'}
            `}>
              {label}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default FolderList3D;