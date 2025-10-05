import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Bot, Brain, Lightbulb, Zap, Sparkles, 
  Users, MessageSquare, Clock, Target,
  ChevronDown, ChevronUp, Send, Wand2
} from 'lucide-react';

interface QAIAssistantProps {
  onSuggestion: (suggestion: EmailSuggestion) => void;
  chatHistory?: string[];
  context?: string;
}

interface EmailSuggestion {
  to?: string;
  subject?: string;
  content?: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  tone?: 'formal' | 'casual' | 'friendly' | 'professional';
}

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const QAIAssistant: React.FC<QAIAssistantProps> = ({ 
  onSuggestion, 
  chatHistory = [], 
  context = '' 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestions, setSuggestions] = useState<EmailSuggestion[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock email patterns and recipients database
  const commonRecipients = [
    { email: 'admin@qssn.org', name: 'QSSN Admin', department: 'Administration' },
    { email: 'security@qssn.org', name: 'Security Team', department: 'Security' },
    { email: 'support@qssn.org', name: 'Support Team', department: 'Support' },
    { email: 'team@qssn.org', name: 'Development Team', department: 'Engineering' }
  ];

  useEffect(() => {
    if (chatHistory.length > 0) {
      analyzeChatHistory();
    }
  }, [chatHistory]);

  const analyzeChatHistory = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const intelligentSuggestions: EmailSuggestion[] = [
      {
        to: 'admin@qssn.org',
        subject: 'Security Enhancement Request',
        content: `Dear QSSN Administration,

Following our recent discussions about system improvements, I would like to propose some security enhancements for our quantum email infrastructure.

Key areas for consideration:
• Quantum encryption protocol upgrades
• Multi-factor authentication implementation
• Advanced threat detection systems

I believe these improvements will significantly strengthen our secure communication capabilities.

Best regards,`,
        priority: 'high',
        tone: 'professional'
      },
      {
        to: 'support@qssn.org',
        subject: 'Technical Assistance Required',
        content: `Hello Support Team,

I need assistance with optimizing the email interface performance and implementing new features discussed in our recent conversations.

Could you please help with:
• 3D rendering optimization
• Database query performance
• User experience enhancements

Thank you for your continued support.

Best regards,`,
        priority: 'normal',
        tone: 'friendly'
      }
    ];

    setSuggestions(intelligentSuggestions);
    setIsAnalyzing(false);
  };

  const handleUserMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: userInput,
      sender: 'user',
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsProcessing(true);

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1000));

    const aiResponse = generateAIResponse(userInput);
    const aiMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      text: aiResponse.text,
      sender: 'ai',
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, aiMessage]);
    
    if (aiResponse.suggestion) {
      setSuggestions(prev => [...prev, aiResponse.suggestion!]);
    }
    
    setIsProcessing(false);
  };

  const generateAIResponse = (input: string): { text: string; suggestion?: EmailSuggestion } => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('meeting') || lowerInput.includes('schedule')) {
      return {
        text: "I can help you compose a meeting request email. Let me generate a professional template for you.",
        suggestion: {
          subject: 'Meeting Request - ' + new Date().toLocaleDateString(),
          content: `Dear Team,

I would like to schedule a meeting to discuss important matters.

Proposed details:
• Date: [Please specify]
• Time: [Please specify]
• Duration: [Please specify]
• Agenda: [Please specify]

Please let me know your availability.

Best regards,`,
          priority: 'normal',
          tone: 'professional'
        }
      };
    }
    
    if (lowerInput.includes('urgent') || lowerInput.includes('emergency')) {
      return {
        text: "I've detected urgency in your request. Let me create a high-priority email template for you.",
        suggestion: {
          subject: 'URGENT: Immediate Attention Required',
          content: `URGENT NOTICE

This message requires immediate attention regarding: [Please specify the urgent matter]

Action required:
• [Action item 1]
• [Action item 2]
• [Action item 3]

Please respond as soon as possible.

Thank you,`,
          priority: 'urgent',
          tone: 'professional'
        }
      };
    }

    if (lowerInput.includes('report') || lowerInput.includes('update')) {
      return {
        text: "I'll help you create a status report email. Here's a structured template based on your requirements.",
        suggestion: {
          subject: 'Status Report - ' + new Date().toLocaleDateString(),
          content: `Status Report

Project/Task: [Project name]

Progress Update:
• Completed: [List completed items]
• In Progress: [List ongoing items]
• Upcoming: [List planned items]

Challenges & Solutions:
• [Challenge 1 and proposed solution]
• [Challenge 2 and proposed solution]

Next Steps:
• [Next action items]

Please let me know if you need any additional information.

Best regards,`,
          priority: 'normal',
          tone: 'professional'
        }
      };
    }

    return {
      text: "I understand you need help with email composition. Based on your input, I can suggest relevant templates, recommend recipients from our QSSN network, and optimize the tone and priority. Please provide more specific details about what you'd like to communicate."
    };
  };

  const getToneColor = (tone: string) => {
    switch (tone) {
      case 'formal': return 'text-blue-400';
      case 'casual': return 'text-green-400';
      case 'friendly': return 'text-yellow-400';
      case 'professional': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'normal': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'low': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <Card className="glass-surface border-accent/20 bg-gradient-to-br from-accent/5 to-secondary/5">
      <CardHeader 
        className="cursor-pointer hover:bg-accent/5 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-accent to-secondary rounded-lg flex items-center justify-center animate-pulse-glow">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">
              Q-AI Assistant
            </span>
            {isAnalyzing && (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-accent" />
                <span className="text-sm text-muted-foreground">Analyzing...</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="border-accent/30 text-accent">
              {suggestions.length} suggestions
            </Badge>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </CardTitle>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="space-y-4 animate-slide-in-3d">
          {/* AI Chat Interface */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-accent" />
              <span className="font-medium text-sm">Chat with Q-AI</span>
            </div>
            
            {chatMessages.length > 0 && (
              <div className="max-h-32 overflow-y-auto space-y-2 p-3 glass-surface rounded border border-accent/10">
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`
                        max-w-[80%] p-2 rounded-lg text-sm
                        ${message.sender === 'user' 
                          ? 'bg-primary/20 text-primary' 
                          : 'bg-accent/20 text-accent flex items-start space-x-2'
                        }
                      `}
                    >
                      {message.sender === 'ai' && <Bot className="w-3 h-3 mt-0.5 flex-shrink-0" />}
                      <span>{message.text}</span>
                    </div>
                  </div>
                ))}
                {isProcessing && (
                  <div className="flex justify-start">
                    <div className="bg-accent/20 text-accent p-2 rounded-lg text-sm flex items-center space-x-2">
                      <Bot className="w-3 h-3" />
                      <div className="animate-spin rounded-full h-3 w-3 border-b border-accent" />
                      <span>Thinking...</span>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <div className="flex space-x-2">
              <Textarea
                placeholder="Ask Q-AI to help compose your email..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="flex-1 min-h-[80px] glass-surface border-accent/20 focus:border-accent"
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleUserMessage()}
              />
              <Button
                onClick={handleUserMessage}
                disabled={!userInput.trim() || isProcessing}
                className="glass-surface bg-gradient-to-r from-accent to-secondary hover:shadow-hover"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={analyzeChatHistory}
              className="glass-hover border-accent/20 text-accent"
              disabled={isAnalyzing}
            >
              <Lightbulb className="w-3 h-3 mr-2" />
              Smart Suggestions
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const suggestion = {
                  to: commonRecipients[0].email,
                  subject: 'Quick Communication',
                  content: 'Hello,\n\nI hope this message finds you well.\n\nBest regards,',
                  priority: 'normal' as const,
                  tone: 'professional' as const
                };
                onSuggestion(suggestion);
              }}
              className="glass-hover border-secondary/20 text-secondary"
            >
              <Zap className="w-3 h-3 mr-2" />
              Quick Template
            </Button>
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-accent animate-pulse" />
                <span className="font-medium text-sm">AI Suggestions</span>
              </div>
              
              {suggestions.map((suggestion, index) => (
                <Card key={index} className="glass-surface border-accent/10 hover:border-accent/20 transition-colors">
                  <CardContent className="p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Target className="w-3 h-3 text-accent" />
                        <span className="text-sm font-medium">Suggestion {index + 1}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getPriorityColor(suggestion.priority || 'normal')}`}
                        >
                          {suggestion.priority}
                        </Badge>
                        <Badge variant="outline" className={`text-xs ${getToneColor(suggestion.tone || 'professional')}`}>
                          {suggestion.tone}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div><strong>To:</strong> {suggestion.to}</div>
                      <div><strong>Subject:</strong> {suggestion.subject}</div>
                      <div><strong>Content:</strong> {suggestion.content?.substring(0, 100)}...</div>
                    </div>
                    
                    <Button
                      size="sm"
                      onClick={() => onSuggestion(suggestion)}
                      className="w-full glass-surface bg-gradient-to-r from-accent/20 to-secondary/20 hover:from-accent/30 hover:to-secondary/30 border border-accent/20"
                    >
                      <Wand2 className="w-3 h-3 mr-2" />
                      Apply Suggestion
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Recipient Recommendations */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-secondary" />
              <span className="font-medium text-sm">Common Recipients</span>
            </div>
            <div className="grid grid-cols-2 gap-1">
              {commonRecipients.map((recipient, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => onSuggestion({ to: recipient.email })}
                  className="justify-start text-xs glass-hover border-secondary/20"
                >
                  <div className="text-left">
                    <div className="font-medium">{recipient.name}</div>
                    <div className="text-muted-foreground">{recipient.department}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default QAIAssistant;