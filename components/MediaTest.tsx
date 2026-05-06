import React, { useState, useRef, useEffect } from 'react';
import { Camera, CheckCircle, XCircle, RefreshCw, AlertTriangle, Play } from 'lucide-react';

interface MediaTestProps {
  onComplete: (success: boolean) => void;
}

const MediaTest: React.FC<MediaTestProps> = ({ onComplete }) => {
  const [step, setStep] = useState<'intro' | 'camera' | 'complete'>('intro');
  const [cameraStatus, setCameraStatus] = useState<'pending' | 'testing' | 'success' | 'failed'>('pending');
  const [testing, setTesting] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const testCamera = async () => {
    setStep('camera');
    setTesting(true);
    setCameraStatus('testing');
    
    try {
      console.log('Requesting camera access...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640, min: 320 }, 
          height: { ideal: 480, min: 240 },
          facingMode: 'user'
        }, 
        audio: false 
      });
      
      console.log('Camera access granted');
      streamRef.current = stream;
      setCameraStream(stream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        try {
          await videoRef.current.play();
          console.log('Video playing successfully');
        } catch (playError) {
          console.warn('Video play failed:', playError);
        }
      }
      
      setCameraStatus('success');
      setTesting(false);
      
      // Auto-complete after 2 seconds
      setTimeout(() => {
        setStep('complete');
      }, 2000);
      
    } catch (error) {
      console.error('Camera test failed:', error);
      setCameraStatus('failed');
      setTesting(false);
    }
  };

  const cleanup = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      streamRef.current = null;
    }
    setCameraStream(null);
  };

  useEffect(() => {
    return cleanup;
  }, []);

  const handleComplete = () => {
    cleanup();
    onComplete(cameraStatus === 'success');
  };

  const handleRetry = () => {
    cleanup();
    setCameraStatus('pending');
    setStep('intro');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="text-emerald-500" size={20} />;
      case 'failed': return <XCircle className="text-red-500" size={20} />;
      case 'testing': return <RefreshCw className="text-blue-500 animate-spin" size={20} />;
      default: return <div className="w-5 h-5 bg-gray-300 rounded-full" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100 dark:border-slate-700">
        <div className="p-6 border-b border-gray-100 dark:border-slate-800">
          <h2 className="text-xl font-bold text-indigo-900 dark:text-white text-center">
            {step === 'intro' && 'Camera Permission Setup'}
            {step === 'camera' && 'Camera Access Test'}
            {step === 'complete' && 'Setup Complete'}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-1">
            {step === 'intro' && 'We need to test your camera for exam monitoring'}
            {step === 'camera' && 'Testing camera access...'}
            {step === 'complete' && 'Camera configured successfully'}
          </p>
        </div>
        
        <div className="p-6 space-y-4">
          {step === 'intro' && (
            <>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl">
                  <Camera size={24} className="text-blue-600" />
                  <div>
                    <p className="font-semibold text-indigo-900 dark:text-white">Camera Access</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Required for exam monitoring and integrity</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 rounded-xl p-4">
                <p className="text-amber-700 dark:text-amber-400 text-sm font-semibold mb-2">📋 What to expect:</p>
                <ul className="text-amber-600 dark:text-amber-500 text-xs space-y-1">
                  <li>• Your browser will ask for camera permission</li>
                  <li>• Click "Allow" when prompted</li>
                  <li>• We'll test the camera briefly</li>
                  <li>• Camera will be active during the exam</li>
                </ul>
              </div>
            </>
          )}

          {(step === 'camera' || step === 'complete') && (
            <>
              {/* Camera Test Status */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-xl">
                <div className="flex items-center gap-3">
                  <Camera size={20} className="text-gray-600 dark:text-gray-400" />
                  <div>
                    <p className="font-semibold text-indigo-900 dark:text-white">Camera Access</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {cameraStatus === 'testing' && 'Testing camera...'}
                      {cameraStatus === 'success' && 'Camera working properly'}
                      {cameraStatus === 'failed' && 'Camera access denied'}
                      {cameraStatus === 'pending' && 'Waiting to test'}
                    </p>
                  </div>
                </div>
                {getStatusIcon(cameraStatus)}
              </div>

              {/* Camera Preview */}
              {cameraStatus === 'success' && cameraStream && (
                <div className="relative w-full h-32 bg-gray-100 dark:bg-slate-800 rounded-xl overflow-hidden">
                  <video 
                    ref={videoRef}
                    autoPlay 
                    muted 
                    playsInline 
                    className="w-full h-full object-cover scale-x-[-1]"
                  />
                  <div className="absolute top-2 left-2 bg-emerald-500/90 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    Camera Active
                  </div>
                </div>
              )}
            </>
          )}

          {/* Error Messages */}
          {cameraStatus === 'failed' && (
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-xl p-4">
              <p className="text-red-700 dark:text-red-400 text-sm font-semibold">❌ Camera Access Required</p>
              <p className="text-red-600 dark:text-red-500 text-xs mt-1">
                Camera access is mandatory for exam integrity. Please click "Allow" when your browser asks for camera permission.
              </p>
            </div>
          )}

          {step === 'complete' && cameraStatus === 'success' && (
            <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 rounded-xl p-4">
              <p className="text-emerald-700 dark:text-emerald-400 text-sm font-semibold">✅ Ready for Exam</p>
              <p className="text-emerald-600 dark:text-emerald-500 text-xs mt-1">
                Camera is configured and ready. You can now start your exam safely.
              </p>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-100 dark:border-slate-800">
          <div className="flex gap-3">
            <button 
              onClick={() => { cleanup(); onComplete(false); }}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            
            {step === 'intro' && (
              <button 
                onClick={testCamera}
                disabled={testing}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-primary text-white hover:opacity-90 transition disabled:opacity-60"
              >
                <Play size={16} />
                Start Setup
              </button>
            )}
            
            {cameraStatus === 'failed' && (
              <button 
                onClick={handleRetry}
                disabled={testing}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold bg-blue-500 text-white hover:opacity-90 transition disabled:opacity-60"
              >
                Try Again
              </button>
            )}
            
            {step === 'complete' && cameraStatus === 'success' && (
              <button 
                onClick={handleComplete}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold bg-primary text-white hover:opacity-90 transition"
              >
                Start Exam
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaTest;