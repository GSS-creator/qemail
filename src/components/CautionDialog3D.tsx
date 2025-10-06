import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Mail, Shield, Info } from 'lucide-react';

interface CautionDialog3DProps {
  isOpen: boolean;
  onClose: () => void;
  qssnEmail: string;
  username: string;
}

const CautionDialog3D: React.FC<CautionDialog3DProps> = ({ isOpen, onClose, qssnEmail, username }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-red-500/30 rounded-lg p-6 max-w-4xl w-full mx-4 shadow-2xl animate-slide-in-3d max-h-[90vh] overflow-auto custom-scrollbar">
        <Card className="bg-transparent border-0 shadow-none">
          <CardHeader className="text-center space-y-4 sticky top-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 backdrop-blur-sm z-10 pb-4 border-b border-red-500/30">
            <div className="flex items-center justify-center mb-4">
              <div className="relative">
                <Shield className="w-16 h-16 text-red-500 animate-pulse" />
                <AlertTriangle className="w-8 h-8 text-yellow-400 absolute -top-2 -right-2 animate-bounce" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent">
              ⚠️ IMPORTANT SECURITY NOTICE ⚠️
            </CardTitle>
            <CardDescription className="text-lg text-yellow-300 font-semibold">
              Your QSSN Email Account Has Been Created
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6 max-h-[60vh] overflow-auto custom-scrollbar">
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Info className="w-6 h-6 text-red-400 mt-1 flex-shrink-0" />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-red-300">Your QSSN Email Address:</h3>
                  <p className="text-xl font-mono text-yellow-300 bg-slate-800/50 px-3 py-2 rounded border border-yellow-500/30">
                    {qssnEmail}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-6 h-6 text-yellow-400 mt-1 flex-shrink-0" />
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-yellow-300">⚠️ CRITICAL SECURITY REMINDERS:</h3>
                  <ul className="text-sm text-yellow-200 space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="text-yellow-400">•</span>
                      <span><strong>Never share your password</strong> with anyone - GSS-TEC will never ask for it</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-yellow-400">•</span>
                      <span><strong>Your QSSN email is quantum-encrypted</strong> - keep your credentials secure</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-yellow-400">•</span>
                      <span><strong>Report suspicious activity</strong> immediately to security@gss-tec.qssn</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="yellow-400">•</span>
                      <span><strong>Use strong, unique passwords</strong> and enable 2FA when available</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Mail className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-blue-300">Welcome to QSSN-ES!</h3>
                  <p className="text-sm text-blue-200">
                    Your account <strong>{username}</strong> is now ready. You can start sending and receiving 
                    quantum-secure emails immediately. Remember to check your inbox for important system notifications.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4 min-w-[400px]">
              <div className="flex items-start space-x-3">
                <Shield className="w-6 h-6 text-purple-400 mt-1 flex-shrink-0" />
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-purple-300">🔐 Additional Security Guidelines:</h3>
                  <ul className="text-sm text-purple-200 space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="text-purple-400">•</span>
                      <span>Regularly update your password every 90 days</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-purple-400">•</span>
                      <span>Enable email notifications for login attempts</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-purple-400">•</span>
                      <span>Avoid accessing from public or shared computers</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-purple-400">•</span>
                      <span>Be cautious of phishing attempts</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Info className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-green-300">📧 Email Features & Tips:</h3>
                  <ul className="text-sm text-green-200 space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="text-green-400">•</span>
                      <span>End-to-end quantum encryption enabled</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-green-400">•</span>
                      <span>Maximum attachment size: 25MB per email</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-green-400">•</span>
                      <span>Storage quota: 10GB for free accounts</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-green-400">•</span>
                      <span>Use folders and labels to organize emails</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button 
                onClick={onClose}
                className="w-full glass-surface bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 hover:shadow-hover transform hover:scale-105 transition-all duration-300 text-white font-semibold py-3"
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>I Understand - Continue to QSSN Email</span>
                </span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CautionDialog3D;

<style>{`
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(15, 23, 42, 0.5);
    border-radius: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(239, 68, 68, 0.6);
    border-radius: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(239, 68, 68, 0.8);
  }
  .custom-scrollbar::-webkit-scrollbar-corner {
    background: transparent;
  }
`}</style>