import React, { useState, useEffect } from 'react';
import { Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface BrowserInfo {
  userAgent: string;
  mediaDevicesSupported: boolean;
  getUserMediaSupported: boolean;
  getDisplayMediaSupported: boolean;
  permissionsAPISupported: boolean;
  isSecureContext: boolean;
}

const MediaDebug: React.FC = () => {
  const [browserInfo, setBrowserInfo] = useState<BrowserInfo | null>(null);
  const [cameraPermission, setCameraPermission] = useState<string>('unknown');
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    const checkBrowserCapabilities = async () => {
      const info: BrowserInfo = {
        userAgent: navigator.userAgent,
        mediaDevicesSupported: !!navigator.mediaDevices,
        getUserMediaSupported: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
        getDisplayMediaSupported: !!(navigator.mediaDevices && (navigator.mediaDevices as any).getDisplayMedia),
        permissionsAPISupported: !!navigator.permissions,
        isSecureContext: window.isSecureContext,
      };

      setBrowserInfo(info);

      // Check camera permission if supported
      if (navigator.permissions) {
        try {
          const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
          setCameraPermission(permission.state);
          
          permission.addEventListener('change', () => {
            setCameraPermission(permission.state);
          });
        } catch (error) {
          setCameraPermission('error');
        }
      }
    };

    checkBrowserCapabilities();
  }, []);

  const getStatusIcon = (status: boolean | string) => {
    if (typeof status === 'boolean') {
      return status ? <CheckCircle className="text-emerald-500" size={16} /> : <XCircle className="text-red-500" size={16} />;
    }
    
    switch (status) {
      case 'granted': return <CheckCircle className="text-emerald-500" size={16} />;
      case 'denied': return <XCircle className="text-red-500" size={16} />;
      case 'prompt': return <AlertTriangle className="text-amber-500" size={16} />;
      default: return <Info className="text-gray-500" size={16} />;
    }
  };

  if (!showDebug) {
    return (
      <button
        onClick={() => setShowDebug(true)}
        className="fixed bottom-4 left-4 z-50 bg-gray-800 text-white px-3 py-2 rounded-lg text-xs font-mono hover:bg-gray-700 transition"
      >
        Debug Info
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-2xl w-80 max-h-96 overflow-y-auto">
      <div className="p-4 border-b border-gray-100 dark:border-slate-700 flex items-center justify-between">
        <h3 className="font-bold text-sm text-indigo-900 dark:text-white">Browser Debug Info</h3>
        <button
          onClick={() => setShowDebug(false)}
          className="text-gray-400 hover:text-gray-600 text-sm"
        >
          ✕
        </button>
      </div>
      
      <div className="p-4 space-y-3">
        {browserInfo && (
          <>
            <div className="space-y-2">
              <h4 className="font-semibold text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider">Media API Support</h4>
              
              <div className="flex items-center justify-between text-sm">
                <span>MediaDevices API</span>
                {getStatusIcon(browserInfo.mediaDevicesSupported)}
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span>getUserMedia</span>
                {getStatusIcon(browserInfo.getUserMediaSupported)}
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span>getDisplayMedia</span>
                {getStatusIcon(browserInfo.getDisplayMediaSupported)}
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span>Secure Context (HTTPS)</span>
                {getStatusIcon(browserInfo.isSecureContext)}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider">Permissions</h4>
              
              <div className="flex items-center justify-between text-sm">
                <span>Camera Permission</span>
                <div className="flex items-center gap-1">
                  {getStatusIcon(cameraPermission)}
                  <span className="text-xs text-gray-500 capitalize">{cameraPermission}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider">Browser Info</h4>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-mono break-all">
                {browserInfo.userAgent}
              </div>
            </div>

            {(!browserInfo.isSecureContext || !browserInfo.getUserMediaSupported) && (
              <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-lg p-3">
                <p className="text-red-700 dark:text-red-400 text-xs font-semibold">⚠️ Compatibility Issues Detected</p>
                {!browserInfo.isSecureContext && (
                  <p className="text-red-600 dark:text-red-500 text-xs mt-1">
                    • Camera requires HTTPS connection
                  </p>
                )}
                {!browserInfo.getUserMediaSupported && (
                  <p className="text-red-600 dark:text-red-500 text-xs mt-1">
                    • Browser doesn't support camera access
                  </p>
                )}
              </div>
            )}

            {cameraPermission === 'denied' && (
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 rounded-lg p-3">
                <p className="text-amber-700 dark:text-amber-400 text-xs font-semibold">🔒 Camera Access Blocked</p>
                <p className="text-amber-600 dark:text-amber-500 text-xs mt-1">
                  Click the camera icon in your browser's address bar to allow access.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MediaDebug;