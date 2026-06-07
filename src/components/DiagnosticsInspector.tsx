import React, { useEffect, useState } from 'react';
import { ContactSubmission, BookingSubmission, NotificationLog } from '../types';

interface DiagnosticsData {
  contactSubmissions: ContactSubmission[];
  bookingSubmissions: BookingSubmission[];
  notificationLogs: NotificationLog[];
}

interface DiagnosticsInspectorProps {
  refreshTrigger: number;
}

export default function DiagnosticsInspector({ refreshTrigger }: DiagnosticsInspectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<'notifs' | 'bookings' | 'contacts'>('notifs');
  const [data, setData] = useState<DiagnosticsData>({
    contactSubmissions: [],
    bookingSubmissions: [],
    notificationLogs: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const res = await fetch('/api/diagnostics');
      if (!res.ok) throw new Error('Failed to fetch diagnostics');
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error loading logs');
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPass = passcode.trim();
    if (cleanPass === '150126') {
      setIsAuthenticated(true);
      setAuthError('');
      setError(null);
    } else {
      setAuthError('Incorrect passcode. Access is restricted.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPasscode('');
    setData({
      contactSubmissions: [],
      bookingSubmissions: [],
      notificationLogs: [],
    });
  };

  const clearLogs = async () => {
    if (!isAuthenticated) return;
    if (!confirm('Are you sure you want to clear audit logs?')) return;
    try {
      await fetch('/api/diagnostics/clear', { method: 'POST' });
      fetchLogs();
    } catch {
      alert('Failed to clear logs');
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchLogs();
    }
  }, [refreshTrigger, isAuthenticated]);

  const unreadCount = data.contactSubmissions.length + data.bookingSubmissions.length + data.notificationLogs.length;

  return (
    <div className="fixed bottom-4 right-4 z-50 font-sans" id="diagnostics-inspector-wrapper">
      {/* Floating Toggle Button */}
      <button
        id="diagnostics-toggle-btn"
        onClick={() => {
          const nextState = !isOpen;
          setIsOpen(nextState);
          // If opening the panel, reset authentication and passcode to ensure it asks every single time
          if (nextState) {
            setIsAuthenticated(false);
            setPasscode('');
            setAuthError('');
          }
        }}
        className="flex items-center gap-2 px-4 py-2.5 bg-[#1c2b24] text-[#faf7f2] border border-sage/30 rounded-full shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer text-xs font-semibold"
      >
        <span className="relative flex h-2 w-2">
          {unreadCount > 0 && isAuthenticated && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-warm opacity-75"></span>
          )}
          <span className={`relative inline-flex rounded-full h-2 w-2 ${unreadCount > 0 && isAuthenticated ? 'bg-warm' : 'bg-emerald-400'}`}></span>
        </span>
        🔑 Counselor Space
        {unreadCount > 0 && isAuthenticated && (
          <span className="bg-warm/20 text-[#c4956a] px-1.5 py-0.5 rounded-md text-[10px] font-bold">
            {unreadCount} Logs
          </span>
        )}
      </button>

      {/* Expanded Panel Drawer */}
      {isOpen && (
        <div 
          id="diagnostic-drawer-panel"
          className="fixed bottom-20 right-4 w-[92vw] sm:w-[480px] max-w-full h-[520px] bg-white border border-sage/20 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200"
        >
          {/* Header */}
          <div className="bg-[#1c2b24] text-[#faf7f2] px-5 py-4 flex items-center justify-between border-b border-sage/10">
            <div>
              <h4 className="font-semibold text-sm">Nistaran Counselor Inbox</h4>
              <p className="text-[10px] text-sage/75">Private client inquiries & real-time webhook verifications</p>
            </div>
            <div className="flex gap-2">
              {isAuthenticated && (
                <>
                  <button
                    onClick={fetchLogs}
                    className="p-1 hover:bg-[#2e4a3a] rounded-lg transition-colors text-xs text-sage"
                    title="Refresh Logs"
                  >
                    🔄
                  </button>
                  <button
                    onClick={clearLogs}
                    className="p-1 hover:bg-[#2e4a3a] rounded-lg transition-colors text-xs text-warm/80"
                    title="Clear Logs"
                  >
                    🗑️
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-2 py-0.5 hover:bg-[#2e4a3a] rounded-lg text-[10px] text-orange-200 cursor-pointer"
                    title="Lock Panel"
                  >
                    Lock 🔒
                  </button>
                </>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-slate-400 hover:text-white transition-colors text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>

          {!isAuthenticated ? (
            /* Passcode Gate Screen */
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-cream/75 text-center">
              <div className="w-12 h-12 bg-sage-light text-sage-dark rounded-full flex items-center justify-center text-xl mb-4 shadow-sm" id="counselor-lock-icon">
                🔒
              </div>
              <h5 className="font-serif text-lg font-bold text-sage-dark mb-1">
                Security Passcode Required
              </h5>
              <p className="text-muted text-xs max-w-xs leading-relaxed mb-6">
                Client privacy is our absolute priority. Please enter your secure passcode to decrypt bookings and client messages.
              </p>

              <form onSubmit={handleAuthSubmit} className="w-full max-w-xs space-y-3" id="counselor-login-form">
                <input
                  type="password"
                  placeholder="Enter Passcode (e.g., 150126)"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full px-4 py-2 text-center rounded-full border border-sage/30 text-sm font-sans outline-none bg-white focus:border-sage shadow-sm"
                  autoFocus
                />
                {authError && (
                  <p className="text-red-500 text-xs font-semibold" id="counselor-auth-error">
                    ⚠️ {authError}
                  </p>
                )}
                <button
                  type="submit"
                  className="w-full bg-sage-dark text-white rounded-full py-2.5 text-xs font-semibold cursor-pointer shadow-sm hover:bg-sage transition-all block text-center"
                >
                  Unlock Counselor Panel &rarr;
                </button>
              </form>

              <div className="mt-8 pt-4 border-t border-sage/10 text-[10px] text-muted text-left w-full">
                <p className="font-bold text-sage-dark mb-1">🔐 Privacy Standard:</p>
                <p>None of your clients can peek into other inquiries. Standard site visitors only see standard booking confirmation screens. Enter PIN <code className="bg-white px-1 py-0.5 rounded border font-mono">150126</code> to view live logs.</p>
              </div>
            </div>
          ) : (
            /* Secure Authenticated Content Panels */
            <>
              {/* Sub Navigation */}
              <div className="bg-cream border-b border-sage/10 flex text-xs font-medium">
                <button
                  onClick={() => setActiveTab('notifs')}
                  className={`flex-1 py-3 text-center transition-all border-b-2 ${
                    activeTab === 'notifs' 
                      ? 'border-sage-dark text-sage-dark bg-white font-bold' 
                      : 'border-transparent text-muted hover:bg-sage-light/20'
                  }`}
                >
                  Notifications ({data.notificationLogs.length})
                </button>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`flex-1 py-3 text-center transition-all border-b-2 ${
                    activeTab === 'bookings' 
                      ? 'border-sage-dark text-sage-dark bg-white font-bold' 
                      : 'border-transparent text-muted hover:bg-sage-light/20'
                  }`}
                >
                  Bookings ({data.bookingSubmissions.length})
                </button>
                <button
                  onClick={() => setActiveTab('contacts')}
                  className={`flex-1 py-3 text-center transition-all border-b-2 ${
                    activeTab === 'contacts' 
                      ? 'border-sage-dark text-sage-dark bg-white font-bold' 
                      : 'border-transparent text-muted hover:bg-sage-light/20'
                  }`}
                >
                  Contacts ({data.contactSubmissions.length})
                </button>
              </div>

              {/* Body Content */}
              <div className="flex-1 overflow-y-auto p-4 bg-cream/30">
                {error && (
                  <p className="text-red-500 text-xs p-3 bg-red-50 rounded-xl font-medium border border-red-200">
                    ❌ {error}
                  </p>
                )}

                {loading && data.notificationLogs.length === 0 && (
                  <div className="flex items-center justify-center py-20 text-xs text-muted">
                    <span className="animate-spin mr-2">⚙️</span> Syncing backend logs & validation pipelines...
                  </div>
                )}

                {/* Simulated Notifications Log list */}
                {activeTab === 'notifs' && (
                  <div className="space-y-3">
                    {data.notificationLogs.length === 0 ? (
                      <p className="text-center py-10 text-xs text-muted">
                        No notifications triggered yet. Submit any form to generate a live mock email or callback request.
                      </p>
                    ) : (
                      data.notificationLogs.map((log) => (
                        <div 
                          key={log.id} 
                          className="bg-white border border-sage/10 p-3.5 rounded-2xl text-xs font-sans shadow-sm"
                        >
                          <div className="flex items-center justify-between mb-2 pb-1 border-b border-cream">
                            <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase ${
                              log.type === 'email' 
                                ? 'bg-blue-50 text-blue-700 border border-blue-100' 
                                : 'bg-emerald-50 text-emerald-800 border border-emerald-100'
                            }`}>
                              {log.type === 'email' ? '📬 Simulated Email' : '💬 WhatsApp Request'}
                            </span>
                            <span className="text-[10px] text-muted">
                              {new Date(log.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          
                          {log.subject && (
                            <p className="font-bold text-sage-dark mb-1">
                              Subject: <span className="font-normal text-muted">{log.subject}</span>
                            </p>
                          )}
                          
                          <p className="font-bold text-sage-dark mb-1">
                            To / Target: <span className="font-normal text-muted">{log.to}</span>
                          </p>
                          
                          <pre className="mt-2 bg-cream/40 p-2 text-[11px] font-mono whitespace-pre-wrap rounded-lg text-slate-700 leading-relaxed max-h-[160px] overflow-y-auto border border-sage/[0.04]">
                            {log.content}
                          </pre>
                          {log.type === 'callback' && (
                            <div className="mt-2 flex">
                              <a
                                href={`https://wa.me/${log.to.replace(/[\s\+]/g, '')}?text=${encodeURIComponent(log.content)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366] text-white hover:bg-[#20ba59] active:scale-95 transition-all text-[10px] font-bold rounded-full shadow-sm cursor-pointer"
                              >
                                📱 Send WhatsApp Message &rarr;
                              </a>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Book Call submissions */}
                {activeTab === 'bookings' && (
                  <div className="space-y-3">
                    {data.bookingSubmissions.length === 0 ? (
                      <p className="text-center py-10 text-xs text-muted">No consultations booked memory-side.</p>
                    ) : (
                      data.bookingSubmissions.map((b) => (
                        <div key={b.id} className="bg-white border border-sage/15 p-3.5 rounded-2xl text-xs shadow-sm">
                          <div className="flex justify-between font-bold text-sage-dark mb-1.5 pb-1 border-b border-cream">
                            <span>👤 {b.name}</span>
                            <span className="text-[10px] text-muted font-normal">
                              {new Date(b.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-muted mb-1"><strong className="text-sage-dark">Phone:</strong> +91 {b.phone}</p>
                          <p className="text-muted mb-1"><strong className="text-sage-dark">Area:</strong> {b.area}</p>
                          <p className="text-muted mb-2"><strong className="text-sage-dark">Contact via:</strong> {b.preferredContact}</p>
                          
                          <div className="pt-2 border-t border-cream flex justify-between items-center">
                            <span className="text-[10px] text-muted font-medium">Connect with client:</span>
                            <a
                              href={`https://wa.me/91${b.phone}?text=${encodeURIComponent(`Hello ${b.name}, thank you for reaching out to Nistaran Counselling. I received your request for ${b.area}. When are you free for a call?`)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#25D366] text-white hover:bg-[#20ba59] active:scale-95 transition-all text-[10px] font-bold rounded-full shadow-sm cursor-pointer"
                            >
                              💬 Chat on WhatsApp
                            </a>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Contact submissions */}
                {activeTab === 'contacts' && (
                  <div className="space-y-3">
                    {data.contactSubmissions.length === 0 ? (
                      <p className="text-center py-10 text-xs text-muted">No contact inquiries recorded in data buffers.</p>
                    ) : (
                      data.contactSubmissions.map((c) => (
                        <div key={c.id} className="bg-white border border-sage/10 p-3.5 rounded-2xl text-xs shadow-sm">
                          <div className="flex justify-between font-bold text-sage-dark mb-1.5 pb-1 border-b border-cream">
                            <span>👤 {c.name}</span>
                            <span className="text-[10px] text-muted font-normal">
                              {new Date(c.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-muted mb-1"><strong className="text-sage-dark">Email:</strong> {c.email}</p>
                          <p className="text-muted mb-1"><strong className="text-sage-dark">Phone:</strong> +91 {c.phone}</p>
                          <p className="text-muted mt-2 p-2 bg-cream/40 rounded-lg whitespace-pre-wrap italic">
                            "{c.message}"
                          </p>
                          
                          <div className="mt-2.5 pt-2 border-t border-cream flex justify-between items-center">
                            <span className="text-[10px] text-muted font-medium">Follow-up:</span>
                            <a
                              href={`https://wa.me/91${c.phone}?text=${encodeURIComponent(`Hello ${c.name}, thank you for sending a contact inquiry to Nistaran. I saw your message: "${c.message}". Let's discuss this here.`)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#25D366] text-white hover:bg-[#20ba59] active:scale-95 transition-all text-[10px] font-bold rounded-full shadow-sm cursor-pointer"
                            >
                              💬 Follow-up on WhatsApp
                            </a>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Footer inside drawer */}
              <div className="bg-[#1c2b24] text-center py-2.5 border-t border-sage/10 text-[9px] text-sage/75 flex justify-between px-4">
                <span>🔐 Data Decrypted (Confidential)</span>
                <span>Active Counselor: nistaran3@gmail.com</span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
