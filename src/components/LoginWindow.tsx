import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Eye, EyeOff, Mail, Lock, User, Sparkles } from 'lucide-react';
import ParticleSystem from './3D/ParticleSystem';
import HolographicCard from './3D/HolographicCard';
import NeuralNetwork3D from './3D/NeuralNetwork3D';
import CautionDialog3D from './CautionDialog3D';
import qssnLogo from '@/assets/qssn-logo.jpg';
import holographicBg from '@/assets/holographic-bg.jpg';

interface LoginWindowProps {
  onLogin: (username: string, token: string) => void;
}

const LoginWindow: React.FC<LoginWindowProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const [recoveryType, setRecoveryType] = useState<'password' | 'email'>('password');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryUsername, setRecoveryUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetUsername, setResetUsername] = useState('');
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [otpFromServer, setOtpFromServer] = useState('');
  const [otpExpiresAt, setOtpExpiresAt] = useState('');
  const [showCautionDialog, setShowCautionDialog] = useState(false);
  const [registeredQssnEmail, setRegisteredQssnEmail] = useState('');
  const [registeredUsername, setRegisteredUsername] = useState('');
  const [registeredToken, setRegisteredToken] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeToTerms && !isRecoveryMode) {
      toast.error('Please agree to the Terms of Use');
      return;
    }

    setIsLoading(true);
    
    try {
      const { qemailApi } = await import('@/services/api')
      
      if (isRecoveryMode) {
        if (recoveryType === 'email') {
          // QSSN Email Recovery - make actual API call
          console.log('=== QSSN EMAIL RECOVERY STARTED ===')
          console.log('Recovery username:', recoveryUsername)
          console.log('Recovery password:', password)
          
          try {
            const response = await qemailApi.recoverEmail(recoveryUsername, password)
            console.log('Email recovery successful:', response)
            toast.success(`Your QSSN email is: ${response.email}`);
          } catch (error: any) {
            console.error('Email recovery error:', error);
            console.error('Error message:', error.message);
            toast.error(`Email recovery failed: ${error.message}`);
            return; // Don't exit recovery mode on error
          }
        } else {
          // Password Recovery with OTP
          if (!otpStep) {
            // Step 1: Request OTP
            console.log('=== PASSWORD RESET REQUEST STARTED ===')
            console.log('Reset username:', recoveryUsername)
            console.log('Recovery email:', recoveryEmail)
            
            try {
              const response = await qemailApi.requestPasswordReset(recoveryUsername, recoveryEmail)
              console.log('Password reset request successful:', response)
              
              // Store the OTP from server response for display
              if (response.otp) {
                setOtpFromServer(response.otp);
                setOtpExpiresAt(response.expires_at);
                setShowOtpDialog(true);
                setResetUsername(recoveryUsername);
                toast.success('OTP generated! Please copy the code from the dialog.');
              } else {
                // Fallback if OTP is not in response
                setResetUsername(recoveryUsername);
                setOtpStep(true);
                toast.success('OTP sent to your registered email!');
              }
              return;
            } catch (error: any) {
              console.error('Password reset request error:', error);
              toast.error(`Password reset request failed: ${error.message}`);
              return;
            }
          } else {
            // Step 2: Reset password with OTP
            console.log('=== PASSWORD RESET WITH OTP STARTED ===')
            console.log('Reset username:', resetUsername)
            console.log('OTP code:', otpCode)
            
            if (newPassword !== confirmPassword) {
              toast.error('Passwords do not match!');
              return;
            }
            
            if (newPassword.length < 6) {
              toast.error('Password must be at least 6 characters long!');
              return;
            }
            
            try {
              const response = await qemailApi.resetPassword(resetUsername, otpCode, newPassword)
              console.log('Password reset successful:', response)
              toast.success('Password reset successful! Please login with your new password.');
              
              // Reset all recovery states and return to login
              setIsRecoveryMode(false);
              setOtpStep(false);
              setOtpCode('');
              setNewPassword('');
              setConfirmPassword('');
              setResetUsername('');
              setRecoveryUsername('');
              setRecoveryEmail('');
              setIsLogin(true);
              return;
            } catch (error: any) {
              console.error('Password reset error:', error);
              toast.error(`Password reset failed: ${error.message}`);
              return;
            }
          }
        }
        setIsRecoveryMode(false);
        return;
      }
      
      if (isLogin) {
        const resp = await qemailApi.login(username, password)
        toast.success('Login successful!')
        onLogin(username, resp.token)
      } else {
        console.log('Attempting registration with username:', username);
        const resp = await qemailApi.register({ username, password })
        console.log('Registration successful:', resp);
        // Generate QSSN email for display
        const qssnEmail = `${username}@gss-tec.qssn`
        setRegisteredQssnEmail(qssnEmail)
        setRegisteredUsername(username)
        setRegisteredToken(resp.token) // Store the token for later use
        setShowCautionDialog(true)
      }
    } catch (error: any) {
      let errorMessage = 'Authentication failed. Please try again.';
      
      if (isRecoveryMode && recoveryType === 'email') {
        if (error?.message?.includes('username')) {
          errorMessage = 'Invalid username. Please check your username and try again.';
        } else if (error?.message?.includes('password')) {
          errorMessage = 'Invalid password. Please check your password and try again.';
        } else if (error?.message?.includes('not found')) {
          errorMessage = 'User not found. Please check your username and try again.';
        } else if (error?.message?.includes('Email recovery failed')) {
          errorMessage = 'Email recovery failed. Please check your credentials and try again.';
        } else {
          errorMessage = error?.message || 'Email recovery failed. Please try again.';
        }
      } else {
        errorMessage = error?.message || 'Authentication failed. Please try again.';
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setIsRecoveryMode(false);
    setUsername('');
    setPassword('');
    setRecoveryEmail('');
    setRecoveryUsername('');
    setOtpStep(false);
    setOtpCode('');
    setNewPassword('');
    setConfirmPassword('');
    setResetUsername('');
    setShowOtpDialog(false);
    setOtpFromServer('');
    setOtpExpiresAt('');
  };

  const enterRecoveryMode = (type: 'password' | 'email') => {
    setRecoveryType(type);
    setIsRecoveryMode(true);
  };

  const exitRecoveryMode = () => {
    setIsRecoveryMode(false);
    setRecoveryEmail('');
    setRecoveryUsername('');
    setOtpStep(false);
    setOtpCode('');
    setNewPassword('');
    setConfirmPassword('');
    setResetUsername('');
    setShowOtpDialog(false);
    setOtpFromServer('');
    setOtpExpiresAt('');
  };

  const copyOtpAndProceed = async () => {
    try {
      await navigator.clipboard.writeText(otpFromServer);
      toast.success('OTP copied to clipboard!');
    } catch (err) {
      console.warn('Failed to copy OTP to clipboard:', err);
      toast.info('Please manually copy the OTP code');
    }
    
    // Set the OTP in the input field and proceed to next step
    setOtpCode(otpFromServer);
    setShowOtpDialog(false);
    setOtpStep(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Holographic Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{ backgroundImage: `url(${holographicBg})` }}
      />
      
      {/* Particle System */}
      <ParticleSystem count={30} className="opacity-70" />

      {/* 3D Neural Network Animation */}
      <div className="absolute inset-0 z-0">
        <NeuralNetwork3D />
      </div>

      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-background">
        <div className="absolute inset-0 opacity-20">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-gradient-primary opacity-30 animate-floating"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 120 + 60}px`,
                height: `${Math.random() * 120 + 60}px`,
                animationDelay: `${Math.random() * 6}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="flex max-w-6xl w-full relative z-10 gap-8 login-container">
        {/* Login/Register Card */}
        <HolographicCard className="w-full max-w-md animate-slide-in-3d login-form-card neural-glow" intensity={1.2}>
          <CardHeader className="text-center space-y-4 login-header">
            {/* App Icon */}
            <div className="flex items-center justify-center mb-4">
              <img 
                src="/qemail.ico" 
                alt="QSSN Email Icon" 
                className="w-24 h-24 animate-pulse-glow object-contain drop-shadow-lg"
              />
            </div>
            {/* Welcome Text */}
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent text-center leading-tight mb-4 drop-shadow-lg animate-pulse-glow">
              WELCOME TO QUANTUM SECURE SOCIAL NETWORK EMAIL SYSTEM (QSSN-ES)
            </h1>
            <CardTitle className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              QSSN-ES
            </CardTitle>
            <CardDescription className="text-lg text-primary-glow">
              Secure Email System
            </CardDescription>
            <p className="text-sm text-muted-foreground">
              Managed by GSS-TEC Global Servers
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-6 login-form">
              {isRecoveryMode ? (
                // Recovery Mode UI
                <div className="space-y-4">
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-semibold text-primary">
                      {recoveryType === 'password' ? 'Password Recovery' : 'QSSN Email Recovery'}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      {recoveryType === 'password' 
                        ? (otpStep ? 'Enter the OTP and your new password' : 'Enter your email or username to recover your password')
                        : 'Enter your username and password to recover your QSSN email address'
                      }
                    </p>
                  </div>

                  {recoveryType === 'password' ? (
                    <>
                      {!otpStep && (
                        <>
                          <div className="relative group">
                            <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input
                              type="text"
                              placeholder="Username or Email"
                              value={recoveryUsername}
                              onChange={(e) => setRecoveryUsername(e.target.value)}
                              className="pl-10 glass-surface border-primary/20 focus:border-primary focus:shadow-glow login-input"
                              required
                            />
                          </div>
                          <div className="relative group">
                            <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground group-focus-within:text-secondary transition-colors" />
                            <Input
                              type="email"
                              placeholder="Recovery Email"
                              value={recoveryEmail}
                              onChange={(e) => setRecoveryEmail(e.target.value)}
                              className="pl-10 glass-surface border-secondary/20 focus:border-secondary focus:shadow-glow login-input"
                              required
                            />
                          </div>
                        </>
                      )}
                      {otpStep && (
                        <>
                          <div className="relative group">
                            <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input
                              type="text"
                              placeholder="Enter OTP Code"
                              value={otpCode}
                              onChange={(e) => setOtpCode(e.target.value)}
                              className="pl-10 glass-surface border-primary/20 focus:border-primary focus:shadow-glow login-input"
                              required
                            />
                          </div>
                          <div className="relative group">
                            <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                            <Input
                              type="password"
                              placeholder="New Password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              className="pl-10 glass-surface border-accent/20 focus:border-accent focus:shadow-glow login-input"
                              required
                            />
                          </div>
                          <div className="relative group">
                            <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                            <Input
                              type="password"
                              placeholder="Confirm New Password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              className="pl-10 glass-surface border-accent/20 focus:border-accent focus:shadow-glow login-input"
                              required
                            />
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="relative group">
                        <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                          type="text"
                          placeholder="Username"
                          value={recoveryUsername}
                          onChange={(e) => setRecoveryUsername(e.target.value)}
                          className="pl-10 glass-surface border-primary/20 focus:border-primary focus:shadow-glow"
                          required
                        />
                      </div>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 pr-12 glass-surface border-accent/20 focus:border-accent focus:shadow-glow"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-muted-foreground hover:text-accent transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full glass-surface bg-gradient-primary hover:shadow-hover transform hover:scale-105 transition-all duration-300 login-button"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    ) : (
                      recoveryType === 'password' ? (otpStep ? 'Reset Password' : 'Send OTP') : 'Recover QSSN Email'
                    )}
                  </Button>

                  <div className="text-center space-y-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={exitRecoveryMode}
                      className="text-primary hover:text-primary-glow hover:bg-primary/10 login-button"
                    >
                      Back to Login
                    </Button>
                  </div>
                </div>
              ) : (
                // Login/Register Mode UI
                <div className="space-y-4">
                  <div className="relative group">
                    <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      type="text"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10 glass-surface border-primary/20 focus:border-primary focus:shadow-glow login-input"
                      required
                    />
                  </div>



                  <div className="relative group">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-12 glass-surface border-accent/20 focus:border-accent focus:shadow-glow login-input"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-accent transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {isLogin && (
                    <div className="flex justify-between text-sm recovery-buttons">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => enterRecoveryMode('password')}
                        className="text-primary hover:text-primary-glow hover:bg-primary/10 p-0 h-auto login-button"
                      >
                        Forgot Password?
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => enterRecoveryMode('email')}
                        className="text-secondary hover:text-accent hover:bg-secondary/10 p-0 h-auto login-button"
                      >
                        Recover QSSN Email
                      </Button>
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={agreeToTerms}
                      onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                      className="border-primary data-[state=checked]:bg-primary login-checkbox"
                    />
                    <label htmlFor="terms" className="text-sm text-muted-foreground login-terms-label">
                      I agree to the Terms of Use
                    </label>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full glass-surface bg-gradient-primary hover:shadow-hover transform hover:scale-105 transition-all duration-300 login-button"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    ) : (
                      isLogin ? 'Login' : 'Register'
                    )}
                  </Button>

                  <div className="text-center space-y-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={toggleMode}
                      className="text-primary hover:text-primary-glow hover:bg-primary/10 login-button"
                    >
                      {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </CardContent>
        </HolographicCard>

        {/* Terms of Use Panel */}
        <HolographicCard className="w-full max-w-lg animate-slide-in-3d neural-glow" style={{ animationDelay: '0.2s' }} intensity={0.8}>
          <CardHeader>
            <CardTitle className="text-xl bg-gradient-secondary bg-clip-text text-transparent">
              Terms of Use
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
            <div className="text-sm text-muted-foreground space-y-3">
              <p className="font-semibold text-foreground">Terms of Use for QSSN-ES</p>
              <p>By registering and using the QSSN-ES software, you agree to abide by these Terms of Use:</p>
              <ul className="list-decimal list-inside space-y-2">
                <li>No unlawful, abusive, or harmful activities.</li>
                <li>Respect other users.</li>
                <li>Use common sense.</li>
                <li>Do not send illegal content.</li>
                <li>Your data is handled per our Privacy Policy.</li>
                <li>You are responsible for your content.</li>
                <li>Do not send harmful content.</li>
                <li>You will not use QSSN-ES for illegal or unauthorized purposes.</li>
                <li>QSSN-ES uses encryption, but no system is 100% secure.</li>
                <li>Accounts may be suspended for violations.</li>
                <li>QSSN-ES is not responsible for any content or data.</li>
                <li>Terms may change.</li>
                <li>QSSN-ES is provided 'as is' without warranties.</li>
                <li>QSSN-ES is not liable for any damages.</li>
                <li>Gaston Software Solutions Tec reserves the right to modify or terminate the service at any time.</li>
              </ul>
            </div>
          </CardContent>
        </HolographicCard>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: hsl(var(--muted));
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(var(--primary));
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--primary-glow));
        }
        
        @keyframes slide-in-3d {
          0% {
            transform: perspective(1000px) rotateX(-15deg) translateY(-50px) scale(0.9);
            opacity: 0;
          }
          100% {
            transform: perspective(1000px) rotateX(0deg) translateY(0) scale(1);
            opacity: 1;
          }
        }
        
        .animate-slide-in-3d {
          animation: slide-in-3d 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>

      {/* OTP Dialog */}
      {showOtpDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-primary/30 rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center">
                <Mail className="w-12 h-12 text-primary" />
              </div>
              
              <h3 className="text-xl font-bold text-primary">Password Reset OTP</h3>
              
              <p className="text-sm text-muted-foreground">
                Copy this OTP code and paste it in the next step:
              </p>
              
              <div className="bg-slate-800/50 border border-primary/20 rounded-lg p-4">
                <div className="text-2xl font-mono font-bold text-primary text-center tracking-wider">
                  {otpFromServer}
                </div>
                {otpExpiresAt && (
                  <div className="text-xs text-muted-foreground text-center mt-2">
                    Expires: {new Date(otpExpiresAt).toLocaleTimeString()}
                  </div>
                )}
              </div>
              
              <div className="flex gap-3">
                <Button
                  onClick={copyOtpAndProceed}
                  className="flex-1 glass-surface bg-gradient-primary hover:shadow-hover"
                >
                  Copy & Continue
                </Button>
                <Button
                  onClick={() => setShowOtpDialog(false)}
                  variant="outline"
                  className="flex-1 border-primary/20 text-muted-foreground hover:text-primary"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Caution Dialog - Shows after successful registration */}
      <CautionDialog3D
        isOpen={showCautionDialog}
        onClose={() => {
          setShowCautionDialog(false);
          // Proceed with login after user acknowledges the caution
          onLogin(registeredUsername, registeredToken);
        }}
        qssnEmail={registeredQssnEmail}
        username={registeredUsername}
      />
    </div>
  );
}

export default LoginWindow;