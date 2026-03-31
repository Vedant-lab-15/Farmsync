import { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShieldCheck } from 'lucide-react';

interface OTPVerificationDialogProps {
  open: boolean;
  phoneNumber: string;
  onVerify: (code: string) => void;
  onCancel: () => void;
  onResend: () => void;
}

export const OTPVerificationDialog = ({
  open,
  phoneNumber,
  onVerify,
  onCancel,
  onResend,
}: OTPVerificationDialogProps) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendCooldown, setResendCooldown] = useState(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Start cooldown timer when dialog opens
  useEffect(() => {
    if (!open) return;
    setOtp(['', '', '', '', '', '']);
    setResendCooldown(30);
    const interval = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [open]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    // Auto-advance
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    pasted.split('').forEach((char, i) => { newOtp[i] = char; });
    setOtp(newOtp);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleResend = () => {
    if (resendCooldown > 0) return;
    setResendCooldown(30);
    onResend();
  };

  const code = otp.join('');

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onCancel(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-2">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <ShieldCheck className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <DialogTitle className="text-center">Verify Phone Number</DialogTitle>
          <DialogDescription className="text-center">
            Enter the 6-digit code sent to{' '}
            <span className="font-medium text-foreground">{phoneNumber}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center gap-2 py-4" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <Input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-11 h-12 text-center text-lg font-bold"
              autoFocus={index === 0}
            />
          ))}
        </div>

        <div className="text-center text-sm text-muted-foreground">
          Didn't receive the code?{' '}
          <button
            type="button"
            onClick={handleResend}
            disabled={resendCooldown > 0}
            className={`font-medium ${resendCooldown > 0 ? 'text-muted-foreground cursor-not-allowed' : 'text-green-600 hover:underline'}`}
          >
            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend'}
          </button>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={() => onVerify(code)}
            disabled={code.length < 6}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            Verify
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
