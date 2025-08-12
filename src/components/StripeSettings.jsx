import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  CheckCircle, 
  AlertCircle, 
  ExternalLink, 
  RefreshCw,
  Unlink,
  DollarSign,
  Building
} from 'lucide-react';
import {
  initiateStripeOAuth,
  getStripeOAuthStatus,
  disconnectStripeOAuth
} from '../services/api';

const StripeSettings = () => {
  const [oauthStatus, setOauthStatus] = useState({ connected: false, loading: true });
  const [stripeAccount, setStripeAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    checkOAuthStatus();
  }, []);

  const checkOAuthStatus = async () => {
    try {
      setOauthStatus({ connected: false, loading: true });
      const status = await getStripeOAuthStatus();
      setOauthStatus({ connected: status.connected, loading: false });
      
      if (status.connected) {
        setStripeAccount({
          account_id: status.account_id,
          account_name: status.account_name,
          account_email: status.account_email,
          charges_enabled: status.charges_enabled,
          payouts_enabled: status.payouts_enabled
        });
      }
    } catch (error) {
      console.error('Failed to check Stripe OAuth status:', error);
      setOauthStatus({ connected: false, loading: false });
    }
  };

  const handleConnect = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await initiateStripeOAuth();
      
      // Open OAuth URL in a new popup window
      const popup = window.open(
        response.authorization_url,
        'stripe-oauth',
        'width=500,height=600,scrollbars=yes,resizable=yes'
      );

      // Poll for popup closure
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          // Check if OAuth was successful
          setTimeout(() => {
            checkOAuthStatus();
          }, 1000);
        }
      }, 1000);

    } catch (error) {
      console.error('Failed to initiate Stripe OAuth:', error);
      setError('Failed to connect to Stripe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      setLoading(true);
      setError('');
      
      await disconnectStripeOAuth();
      setOauthStatus({ connected: false, loading: false });
      setStripeAccount(null);
      
    } catch (error) {
      console.error('Failed to disconnect Stripe OAuth:', error);
      setError('Failed to disconnect. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (oauthStatus.loading) {
    return (
      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <CreditCard className="h-6 w-6 text-primary-600" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Stripe Payments</h2>
            <p className="text-sm text-gray-600">Loading connection status...</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="h-6 w-6 text-gray-400 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center space-x-3 mb-6">
        <CreditCard className="h-6 w-6 text-primary-600" />
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Stripe Payments</h2>
          <p className="text-sm text-gray-600">
            Connect your Stripe account to accept payment deposits
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <span className="text-sm text-red-800">{error}</span>
          </div>
        </div>
      )}

      {!oauthStatus.connected ? (
        // Not connected state
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
              <span className="text-gray-600">Not connected</span>
            </div>
            <button
              onClick={handleConnect}
              disabled={loading}
              className="btn-primary flex items-center space-x-2"
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <ExternalLink className="h-4 w-4" />
              )}
              <span>Connect Stripe</span>
            </button>
          </div>
          
          <div className="text-sm text-gray-500 bg-blue-50 p-3 rounded-lg">
            <p className="font-medium text-blue-800 mb-1">What happens when you connect:</p>
            <ul className="space-y-1 text-blue-700">
              <li>• You'll be redirected to Stripe to grant payment access</li>
              <li>• Customers can pay deposits directly to your Stripe account</li>
              <li>• All payment processing fees go through your Stripe account</li>
              <li>• You maintain full control over your payment data</li>
              <li>• You can disconnect at any time</li>
            </ul>
          </div>
        </div>
      ) : (
        // Connected state
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-green-800 font-medium">Connected to Stripe</span>
            </div>
            <button
              onClick={handleDisconnect}
              disabled={loading}
              className="text-red-600 hover:text-red-700 flex items-center space-x-2 text-sm"
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Unlink className="h-4 w-4" />
              )}
              <span>Disconnect</span>
            </button>
          </div>

          {/* Account Information */}
          {stripeAccount && (
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3">Account Information</h3>
              
              <div className="space-y-3">
                {/* Account ID */}
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Building className="h-4 w-4 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Account ID</p>
                    <p className="text-sm text-gray-600 font-mono">{stripeAccount.account_id}</p>
                  </div>
                </div>

                {/* Account Name/Email */}
                {(stripeAccount.account_name || stripeAccount.account_email) && (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Building className="h-4 w-4 text-gray-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {stripeAccount.account_name || 'Account'}
                      </p>
                      {stripeAccount.account_email && (
                        <p className="text-sm text-gray-600">{stripeAccount.account_email}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Account Status */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <DollarSign className="h-4 w-4 text-gray-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Charges</p>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        stripeAccount.charges_enabled 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {stripeAccount.charges_enabled ? 'Enabled' : 'Pending'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <DollarSign className="h-4 w-4 text-gray-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Payouts</p>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        stripeAccount.payouts_enabled 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {stripeAccount.payouts_enabled ? 'Enabled' : 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {(!stripeAccount.charges_enabled || !stripeAccount.payouts_enabled) && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">Account Setup Incomplete</p>
                      <p className="text-sm text-yellow-700">
                        Complete your Stripe account setup to enable all payment features.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StripeSettings;