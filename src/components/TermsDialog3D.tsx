import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  FileText, Shield, Globe, Eye, Lock, 
  CheckCircle, AlertCircle, Zap, Sparkles
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import HolographicCard from '@/components/3D/HolographicCard';
import FloatingIcon from '@/components/3D/FloatingIcon';

interface TermsDialog3DProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

const TermsDialog3D: React.FC<TermsDialog3DProps> = ({
  isOpen,
  onClose,
  onAccept
}) => {
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [acceptSecurity, setAcceptSecurity] = useState(false);

  const canProceed = acceptTerms && acceptPrivacy && acceptSecurity;

  const handleAccept = () => {
    if (canProceed) {
      onAccept();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] glass-surface border-primary/20 animate-slide-in-3d overflow-hidden">
        <DialogHeader className="border-b border-primary/20 pb-4">
          <DialogTitle className="flex items-center space-x-3">
            <FloatingIcon Icon={FileText} className="text-accent" />
            <span className="text-xl bg-gradient-primary bg-clip-text text-transparent">
              QSSN Email Terms & Conditions
            </span>
            <Sparkles className="w-5 h-5 text-primary animate-rotate-y" />
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] p-1">
          <div className="space-y-6">
            {/* Terms of Service */}
            <HolographicCard className="p-6">
              <CardHeader className="p-0 pb-4">
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <span>Terms of Service</span>
                  <Badge className="bg-gradient-primary">Version 2.1</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-4 text-sm">
                <div className="space-y-3">
                  <h4 className="font-semibold text-primary">1. Quantum Secure Communication Service</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    QSSN (Quantum Secure Social Network) Email provides advanced quantum-encrypted email communication services. 
                    By using this service, you agree to maintain the security and confidentiality of your quantum encryption keys.
                  </p>
                  
                  <h4 className="font-semibold text-primary">2. User Responsibilities</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Maintain the security of your account credentials</li>
                    <li>Use the service in compliance with local and international laws</li>
                    <li>Report any security vulnerabilities or suspicious activities</li>
                    <li>Respect the privacy and rights of other users</li>
                  </ul>

                  <h4 className="font-semibold text-primary">3. Quantum Encryption Technology</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    Our quantum encryption ensures that your communications remain secure against current and future computing threats. 
                    The quantum key distribution protocol guarantees mathematically proven security for all transmissions.
                  </p>

                  <h4 className="font-semibold text-primary">4. Service Availability</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    We strive to maintain 99.9% uptime for our quantum secure email services. Scheduled maintenance will be 
                    announced 48 hours in advance through our secure notification system.
                  </p>
                </div>
              </CardContent>
            </HolographicCard>

            {/* Privacy Policy */}
            <HolographicCard className="p-6">
              <CardHeader className="p-0 pb-4">
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="w-5 h-5 text-secondary" />
                  <span>Privacy Policy</span>
                  <Badge variant="secondary">GDPR Compliant</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-4 text-sm">
                <div className="space-y-3">
                  <h4 className="font-semibold text-secondary">Data Collection and Usage</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    QSSN Email collects minimal data necessary for service operation. We employ zero-knowledge architecture 
                    where even we cannot access your encrypted communications.
                  </p>
                  
                  <h4 className="font-semibold text-secondary">Information We Collect:</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Account registration information (username, encrypted authentication)</li>
                    <li>Connection metadata (anonymized IP addresses, connection timestamps)</li>
                    <li>Service usage statistics (aggregated and anonymized)</li>
                    <li>Technical logs (error reports, performance metrics)</li>
                  </ul>

                  <h4 className="font-semibold text-secondary">Data Protection</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    All user data is encrypted using quantum-resistant algorithms. Personal information is stored in 
                    geographically distributed secure data centers with military-grade physical security.
                  </p>

                  <h4 className="font-semibold text-secondary">Your Rights</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    You have the right to access, modify, or delete your personal data at any time. You can also 
                    request a complete data export or account termination through the secure settings panel.
                  </p>
                </div>
              </CardContent>
            </HolographicCard>

            {/* Security Policy */}
            <HolographicCard className="p-6">
              <CardHeader className="p-0 pb-4">
                <CardTitle className="flex items-center space-x-2">
                  <Lock className="w-5 h-5 text-accent" />
                  <span>Security Policy</span>
                  <Badge variant="outline" className="border-accent text-accent">Quantum Protected</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-4 text-sm">
                <div className="space-y-3">
                  <h4 className="font-semibold text-accent">Quantum Encryption Standards</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    QSSN implements post-quantum cryptographic standards including lattice-based encryption, 
                    quantum key distribution (QKD), and multi-layer security protocols.
                  </p>
                  
                  <h4 className="font-semibold text-accent">Security Measures:</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>End-to-end quantum encryption for all communications</li>
                    <li>Multi-factor authentication with quantum random key generation</li>
                    <li>Regular security audits by certified quantum security experts</li>
                    <li>Real-time threat detection and automated response systems</li>
                    <li>Secure key escrow with quantum-safe backup protocols</li>
                  </ul>

                  <h4 className="font-semibold text-accent">Incident Response</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    In the unlikely event of a security incident, our quantum security team will immediately 
                    isolate affected systems, notify users within 1 hour, and provide detailed incident reports.
                  </p>

                  <h4 className="font-semibold text-accent">Compliance & Certifications</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    QSSN Email is compliant with international security standards including ISO 27001, 
                    SOC 2 Type II, and emerging quantum security frameworks.
                  </p>
                </div>
              </CardContent>
            </HolographicCard>

            {/* Agreement Checkboxes */}
            <HolographicCard className="p-6">
              <CardHeader className="p-0 pb-4">
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Agreement Confirmation</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 glass-surface rounded-lg">
                    <Checkbox
                      id="terms"
                      checked={acceptTerms}
                      onCheckedChange={(checked) => setAcceptTerms(checked === true)}
                      className="border-primary"
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      I have read and agree to the Terms of Service
                    </label>
                    {acceptTerms && <CheckCircle className="w-4 h-4 text-green-500 animate-pulse" />}
                  </div>

                  <div className="flex items-center space-x-3 p-4 glass-surface rounded-lg">
                    <Checkbox
                      id="privacy"
                      checked={acceptPrivacy}
                      onCheckedChange={(checked) => setAcceptPrivacy(checked === true)}
                      className="border-secondary"
                    />
                    <label
                      htmlFor="privacy"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      I acknowledge and accept the Privacy Policy
                    </label>
                    {acceptPrivacy && <CheckCircle className="w-4 h-4 text-green-500 animate-pulse" />}
                  </div>

                  <div className="flex items-center space-x-3 p-4 glass-surface rounded-lg">
                    <Checkbox
                      id="security"
                      checked={acceptSecurity}
                      onCheckedChange={(checked) => setAcceptSecurity(checked === true)}
                      className="border-accent"
                    />
                    <label
                      htmlFor="security"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      I understand and accept the Security Policy and quantum encryption protocols
                    </label>
                    {acceptSecurity && <CheckCircle className="w-4 h-4 text-green-500 animate-pulse" />}
                  </div>
                </div>

                {!canProceed && (
                  <div className="flex items-center space-x-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-yellow-600">
                      Please accept all terms and policies to continue using QSSN Email
                    </span>
                  </div>
                )}
              </CardContent>
            </HolographicCard>
          </div>
        </ScrollArea>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-primary/20">
          <div className="text-xs text-muted-foreground">
            Last updated: September 2024 | Quantum Security Protocol v2.1
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={onClose} className="glass-hover">
              Cancel
            </Button>
            <Button 
              onClick={handleAccept}
              disabled={!canProceed}
              className={`transition-all duration-300 ${
                canProceed 
                  ? 'bg-gradient-primary hover:shadow-hover transform hover:scale-105' 
                  : 'opacity-50 cursor-not-allowed'
              }`}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Accept & Continue
              {canProceed && <Zap className="w-4 h-4 ml-2 animate-pulse" />}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TermsDialog3D;