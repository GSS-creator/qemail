import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Search, Filter, Calendar as CalendarIcon, User, 
  Tag, Paperclip, Star, Archive, Trash2, 
  ChevronDown, X, Plus, Zap, Sparkles
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import HolographicCard from '@/components/3D/HolographicCard';
import FloatingIcon from '@/components/3D/FloatingIcon';
import { format } from 'date-fns';

interface AdvancedSearch3DProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (criteria: SearchCriteria) => void;
}

interface SearchCriteria {
  query: string;
  from: string;
  to: string;
  subject: string;
  hasAttachment: boolean;
  isStarred: boolean;
  isRead: boolean;
  labels: string[];
  folder: string;
  dateFrom?: Date;
  dateTo?: Date;
  priority: string;
  size: string;
}

const AdvancedSearch3D: React.FC<AdvancedSearch3DProps> = ({
  isOpen,
  onClose,
  onSearch
}) => {
  const [criteria, setCriteria] = useState<SearchCriteria>({
    query: '',
    from: '',
    to: '',
    subject: '',
    hasAttachment: false,
    isStarred: false,
    isRead: false,
    labels: [],
    folder: 'all',
    priority: 'any',
    size: 'any'
  });

  const [savedSearches, setSavedSearches] = useState([
    { id: '1', name: 'Unread Important', query: 'is:unread label:important' },
    { id: '2', name: 'This Week Attachments', query: 'has:attachment newer_than:7d' },
    { id: '3', name: 'From Boss', query: 'from:boss@company.com' }
  ]);

  const availableLabels = [
    'Important', 'Work', 'Personal', 'Urgent', 'Travel', 
    'Finance', 'Projects', 'Meetings', 'Follow-up', 'Archive'
  ];

  const handleLabelToggle = (label: string) => {
    setCriteria(prev => ({
      ...prev,
      labels: prev.labels.includes(label) 
        ? prev.labels.filter(l => l !== label)
        : [...prev.labels, label]
    }));
  };

  const handleSearch = () => {
    onSearch(criteria);
    onClose();
  };

  const clearCriteria = () => {
    setCriteria({
      query: '',
      from: '',
      to: '',
      subject: '',
      hasAttachment: false,
      isStarred: false,
      isRead: false,
      labels: [],
      folder: 'all',
      priority: 'any',
      size: 'any'
    });
  };

  const loadSavedSearch = (search: any) => {
    // Parse saved search query and populate criteria
    setCriteria(prev => ({ ...prev, query: search.query }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] glass-surface border-primary/20 animate-slide-in-3d overflow-hidden">
        <DialogHeader className="border-b border-primary/20 pb-4">
          <DialogTitle className="flex items-center space-x-3">
            <FloatingIcon Icon={Search} className="text-accent" />
            <span className="text-xl bg-gradient-primary bg-clip-text text-transparent">
              Advanced Email Search
            </span>
            <Sparkles className="w-5 h-5 text-primary animate-rotate-y" />
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-[70vh] overflow-y-auto space-y-6 p-1">
          {/* Quick Search Bar */}
          <HolographicCard className="p-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Enter search terms or advanced query..."
                  value={criteria.query}
                  onChange={(e) => setCriteria({...criteria, query: e.target.value})}
                  className="pl-12 text-lg glass-surface border-primary/20 focus:border-primary focus:shadow-glow"
                />
              </div>
              <Button 
                onClick={handleSearch}
                className="bg-gradient-primary hover:shadow-hover px-8"
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </HolographicCard>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Search Filters */}
            <HolographicCard className="p-6">
              <CardHeader className="p-0 pb-4">
                <CardTitle className="flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-primary" />
                  <span>Search Filters</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-4">
                {/* Email Fields */}
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>From</span>
                    </Label>
                    <Input
                      placeholder="sender@example.com"
                      value={criteria.from}
                      onChange={(e) => setCriteria({...criteria, from: e.target.value})}
                      className="glass-surface border-primary/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>To</span>
                    </Label>
                    <Input
                      placeholder="recipient@example.com"
                      value={criteria.to}
                      onChange={(e) => setCriteria({...criteria, to: e.target.value})}
                      className="glass-surface border-primary/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Subject</Label>
                    <Input
                      placeholder="Email subject contains..."
                      value={criteria.subject}
                      onChange={(e) => setCriteria({...criteria, subject: e.target.value})}
                      className="glass-surface border-primary/20"
                    />
                  </div>
                </div>

                {/* Date Range */}
                <div className="space-y-3">
                  <Label className="flex items-center space-x-2">
                    <CalendarIcon className="w-4 h-4" />
                    <span>Date Range</span>
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="glass-surface border-primary/20">
                          <CalendarIcon className="w-4 h-4 mr-2" />
                          {criteria.dateFrom ? format(criteria.dateFrom, 'PPP') : 'From date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 glass-surface" align="start">
                        <Calendar
                          mode="single"
                          selected={criteria.dateFrom}
                          onSelect={(date) => setCriteria({...criteria, dateFrom: date})}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="glass-surface border-primary/20">
                          <CalendarIcon className="w-4 h-4 mr-2" />
                          {criteria.dateTo ? format(criteria.dateTo, 'PPP') : 'To date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 glass-surface" align="start">
                        <Calendar
                          mode="single"
                          selected={criteria.dateTo}
                          onSelect={(date) => setCriteria({...criteria, dateTo: date})}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Folder & Priority */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Folder</Label>
                    <Select value={criteria.folder} onValueChange={(value) => setCriteria({...criteria, folder: value})}>
                      <SelectTrigger className="glass-surface border-primary/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Folders</SelectItem>
                        <SelectItem value="inbox">Inbox</SelectItem>
                        <SelectItem value="sent">Sent</SelectItem>
                        <SelectItem value="drafts">Drafts</SelectItem>
                        <SelectItem value="starred">Starred</SelectItem>
                        <SelectItem value="spam">Spam</SelectItem>
                        <SelectItem value="trash">Trash</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select value={criteria.priority} onValueChange={(value) => setCriteria({...criteria, priority: value})}>
                      <SelectTrigger className="glass-surface border-primary/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any Priority</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Boolean Filters */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center space-x-2">
                      <Paperclip className="w-4 h-4" />
                      <span>Has Attachments</span>
                    </Label>
                    <Switch
                      checked={criteria.hasAttachment}
                      onCheckedChange={(checked) => setCriteria({...criteria, hasAttachment: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="flex items-center space-x-2">
                      <Star className="w-4 h-4" />
                      <span>Starred Only</span>
                    </Label>
                    <Switch
                      checked={criteria.isStarred}
                      onCheckedChange={(checked) => setCriteria({...criteria, isStarred: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Read Status</Label>
                    <Select value={criteria.isRead ? 'read' : 'unread'} onValueChange={(value) => setCriteria({...criteria, isRead: value === 'read'})}>
                      <SelectTrigger className="w-32 glass-surface border-primary/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any</SelectItem>
                        <SelectItem value="read">Read</SelectItem>
                        <SelectItem value="unread">Unread</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </HolographicCard>

            {/* Labels & Saved Searches */}
            <div className="space-y-6">
              {/* Labels */}
              <HolographicCard className="p-6">
                <CardHeader className="p-0 pb-4">
                  <CardTitle className="flex items-center space-x-2">
                    <Tag className="w-5 h-5 text-primary" />
                    <span>Labels</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="flex flex-wrap gap-2">
                    {availableLabels.map((label) => (
                      <Badge
                        key={label}
                        variant={criteria.labels.includes(label) ? "default" : "outline"}
                        className={`cursor-pointer transition-all duration-200 ${
                          criteria.labels.includes(label) 
                            ? 'bg-gradient-primary text-white shadow-glow' 
                            : 'glass-hover'
                        }`}
                        onClick={() => handleLabelToggle(label)}
                      >
                        {label}
                        {criteria.labels.includes(label) && (
                          <X className="w-3 h-3 ml-1" />
                        )}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </HolographicCard>

              {/* Saved Searches */}
              <HolographicCard className="p-6">
                <CardHeader className="p-0 pb-4">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Archive className="w-5 h-5 text-primary" />
                      <span>Saved Searches</span>
                    </div>
                    <Button size="sm" variant="ghost" className="glass-hover">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-2">
                  {savedSearches.map((search) => (
                    <Card
                      key={search.id}
                      className="cursor-pointer glass-surface hover:shadow-hover transition-all duration-200"
                      onClick={() => loadSavedSearch(search)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-sm">{search.name}</h4>
                            <p className="text-xs text-muted-foreground">{search.query}</p>
                          </div>
                          <Button size="icon" variant="ghost" className="w-6 h-6">
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </HolographicCard>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-primary/20">
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={clearCriteria} className="glass-hover">
              <X className="w-4 h-4 mr-2" />
              Clear All
            </Button>
            <Button variant="outline" className="glass-hover">
              <Archive className="w-4 h-4 mr-2" />
              Save Search
            </Button>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={onClose} className="glass-hover">
              Cancel
            </Button>
            <Button 
              onClick={handleSearch}
              className="bg-gradient-primary hover:shadow-hover transform hover:scale-105 transition-all duration-300"
            >
              <Search className="w-4 h-4 mr-2" />
              Search Emails
              <Zap className="w-4 h-4 ml-2 animate-pulse" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdvancedSearch3D;