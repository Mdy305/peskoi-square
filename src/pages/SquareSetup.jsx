import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { CheckCircle2, XCircle, AlertTriangle, Copy } from "lucide-react";

export default function SquareSetup() {
  const [copied, setCopied] = React.useState(false);

  const { data: verification, isLoading, error: queryError } = useQuery({
    queryKey: ['squareSetupVerification'],
    queryFn: async () => {
      const response = await base44.functions.invoke('verifySquareSandbox', {});
      return response.data;
    },
    retry: false
  });

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return <div className="min-h-screen bg-black" />;
  }

  const config = verification || {};
  const actualError = queryError?.response?.data?.error || queryError?.message;
  const appId = window.location.pathname.split('/')[2];
  const callbackUrl = config.redirect_uri || `https://app.base44.com/api/apps/${appId}/functions/squareOAuthCallback`;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-20">
        
        <p className="text-xs text-white/40 tracking-[0.15em] uppercase mb-12">Square Setup</p>

        <h1 className="text-2xl font-light mb-12">OAuth Configuration</h1>

        {/* Configuration Status */}
        <div className="space-y-4 mb-12">
          <div className="flex items-center gap-3 border-b border-white/[0.05] pb-4">
            {config.has_app_id ? (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500" />
            )}
            <div className="flex-1">
              <p className="text-sm text-white/80">Application ID</p>
              <p className="text-xs text-white/40">SQUARE_APPLICATION_ID secret</p>
            </div>
            <span className="text-xs text-white/40">
              {config.has_app_id ? 'Configured' : 'Missing'}
            </span>
          </div>

          <div className="flex items-center gap-3 border-b border-white/[0.05] pb-4">
            {config.has_app_secret ? (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500" />
            )}
            <div className="flex-1">
              <p className="text-sm text-white/80">Application Secret</p>
              <p className="text-xs text-white/40">SQUARE_APPLICATION_SECRET secret</p>
            </div>
            <span className="text-xs text-white/40">
              {config.has_app_secret ? 'Configured' : 'Missing'}
            </span>
          </div>

          <div className="flex items-center gap-3 border-b border-white/[0.05] pb-4">
            {config.has_redirect_uri ? (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500" />
            )}
            <div className="flex-1">
              <p className="text-sm text-white/80">Redirect URI</p>
              <p className="text-xs text-white/40">SQUARE_REDIRECT_URI secret</p>
            </div>
            <span className="text-xs text-white/40">
              {config.has_redirect_uri ? 'Configured' : 'Missing'}
            </span>
          </div>

          <div className="flex items-center gap-3 border-b border-white/[0.05] pb-4">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            <div className="flex-1">
              <p className="text-sm text-white/80">Environment</p>
              <p className="text-xs text-white/40">SQUARE_ENV (optional, defaults to production)</p>
            </div>
            <span className="text-xs text-white/40">
              {config.environment || 'production'}
            </span>
          </div>
        </div>

        {/* Redirect URI Setup */}
        <div className="bg-white/[0.03] p-6 border border-white/[0.08] mb-12">
          <p className="text-sm text-white/80 mb-4">Required Redirect URI</p>
          <p className="text-xs text-white/40 mb-4">
            Add this exact URL to your Square application settings:
          </p>
          <div className="relative">
            <pre className="bg-black p-4 border border-white/[0.08] text-xs text-white/60 overflow-x-auto">
              {callbackUrl}
            </pre>
            <button
              onClick={() => handleCopy(callbackUrl)}
              className="absolute top-2 right-2 p-2 hover:bg-white/10 transition-colors"
            >
              {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Setup Instructions */}
        <div className="space-y-8">
          <div>
            <p className="text-xs text-white/30 tracking-[0.15em] uppercase mb-4">Setup Steps</p>
            <ol className="space-y-4 text-sm text-white/60">
              <li>
                <span className="text-white/80">1. Create Square Application</span>
                <p className="text-xs text-white/40 mt-1 ml-4">
                  Go to{' '}
                  <a 
                    href="https://developer.squareup.com/apps" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="underline hover:text-white transition-colors"
                  >
                    Square Developer Dashboard
                  </a>
                  {' '}and create a new application
                </p>
              </li>
              <li>
                <span className="text-white/80">2. Configure OAuth</span>
                <p className="text-xs text-white/40 mt-1 ml-4">
                  In your Square app settings, add the redirect URI shown above
                </p>
              </li>
              <li>
                <span className="text-white/80">3. Copy Credentials</span>
                <p className="text-xs text-white/40 mt-1 ml-4">
                  Copy Application ID and Application Secret from Square dashboard
                </p>
              </li>
              <li>
                <span className="text-white/80">4. Set Secrets in Base44</span>
                <p className="text-xs text-white/40 mt-1 ml-4">
                  Go to Base44 Dashboard → Settings → Secrets and add:
                </p>
                <div className="ml-4 mt-2 space-y-1 text-xs text-white/40">
                  <div>• SQUARE_APPLICATION_ID</div>
                  <div>• SQUARE_APPLICATION_SECRET</div>
                  <div>• SQUARE_REDIRECT_URI (the URL above)</div>
                  <div>• SQUARE_ENV = "sandbox" (optional, for testing)</div>
                </div>
              </li>
              <li>
                <span className="text-white/80">5. Test Connection</span>
                <p className="text-xs text-white/40 mt-1 ml-4">
                  Return to ConnectSquare page and authorize your Square account
                </p>
              </li>
            </ol>
          </div>
        </div>

        {/* Errors */}
        {(actualError || (config.errors && config.errors.length > 0)) && (
          <div className="mt-12 bg-red-500/10 border border-red-500/20 p-6">
            <p className="text-sm text-red-400 mb-3">Configuration Errors:</p>
            <ul className="space-y-2 text-xs text-white/60">
              {actualError && <li>• {actualError}</li>}
              {config.errors?.map((error, idx) => (
                <li key={idx}>• {error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Documentation */}
        <div className="mt-12 bg-white/[0.03] p-6 border border-white/[0.08]">
          <p className="text-xs text-white/30 tracking-[0.15em] uppercase mb-4">Documentation</p>
          <div className="space-y-2 text-xs text-white/60">
            <a 
              href="https://developer.squareup.com/docs/oauth-api/overview" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block hover:text-white transition-colors"
            >
              → Square OAuth Documentation
            </a>
            <a 
              href="https://developer.squareup.com/docs/build-basics/access-tokens" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block hover:text-white transition-colors"
            >
              → Access Tokens Guide
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}