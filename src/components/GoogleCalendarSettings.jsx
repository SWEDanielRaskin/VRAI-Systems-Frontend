import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  CheckCircle, 
  AlertCircle, 
  ExternalLink, 
  RefreshCw,
  Unlink,
  Settings
} from 'lucide-react';
import {
  initiateGoogleOAuth,
  getGoogleOAuthStatus,
  disconnectGoogleOAuth,
  listCalendars,
  selectCalendar,
  getSelectedCalendar
} from '../services/api';

const GoogleCalendarSettings = () => {
  const [oauthStatus, setOauthStatus] = useState({ connected: false, loading: true });
  const [calendars, setCalendars] = useState([]);
  const [selectedCalendar, setSelectedCalendar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCalendarSelection, setShowCalendarSelection] = useState(false);

  useEffect(() => {
    checkOAuthStatus();
  }, []);

  const checkOAuthStatus = async () => {
    try {
      setOauthStatus({ connected: false, loading: true });
      const status = await getGoogleOAuthStatus();
      setOauthStatus({ connected: status.connected, loading: false });
      
      if (status.connected) {
        // If connected, also get selected calendar
        await getSelectedCalendarData();
      }
    } catch (error) {
      console.error('Failed to check OAuth status:', error);
      setOauthStatus({ connected: false, loading: false });
    }
  };

  const getSelectedCalendarData = async () => {
    try {
      const response = await getSelectedCalendar();
      if (response.selected) {
        setSelectedCalendar(response.calendar);
      }
    } catch (error) {
      console.error('Failed to get selected calendar:', error);
    }
  };

  const handleConnect = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await initiateGoogleOAuth();
      
      // Open OAuth URL in a new popup window
      const popup = window.open(
        response.authorization_url,
        'google-oauth',
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
      console.error('Failed to initiate Google OAuth:', error);
      setError('Failed to connect to Google Calendar. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      setLoading(true);
      setError('');
      
      await disconnectGoogleOAuth();
      setOauthStatus({ connected: false, loading: false });
      setSelectedCalendar(null);
      setShowCalendarSelection(false);
      
    } catch (error) {
      console.error('Failed to disconnect Google OAuth:', error);
      setError('Failed to disconnect. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCalendar = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await listCalendars();
      setCalendars(response.calendars);
      setShowCalendarSelection(true);
      
    } catch (error) {
      console.error('Failed to fetch calendars:', error);
      setError('Failed to fetch calendars. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCalendarChoice = async (calendar) => {
    try {
      setLoading(true);
      setError('');
      
      await selectCalendar({
        calendar_id: calendar.id,
        calendar_name: calendar.summary,
        calendar_summary: calendar.description
      });
      
      setSelectedCalendar({
        calendar_id: calendar.id,
        calendar_name: calendar.summary,
        calendar_summary: calendar.description
      });
      setShowCalendarSelection(false);
      
    } catch (error) {
      console.error('Failed to select calendar:', error);
      setError('Failed to select calendar. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (oauthStatus.loading) {
    return (
      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <Calendar className="h-6 w-6 text-primary-600" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Google Calendar</h2>
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
        <Calendar className="h-6 w-6 text-primary-600" />
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Google Calendar</h2>
          <p className="text-sm text-gray-600">
            Connect your Google Calendar to automatically book appointments
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
              <span>Connect Google Calendar</span>
            </button>
          </div>
          
          <div className="text-sm text-gray-500 bg-blue-50 p-3 rounded-lg">
            <p className="font-medium text-blue-800 mb-1">What happens when you connect:</p>
            <ul className="space-y-1 text-blue-700">
              <li>• You'll be redirected to Google to grant calendar access</li>
              <li>• You can choose which calendar to use for appointments</li>
              <li>• The AI will automatically create appointments in your calendar</li>
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
              <span className="text-green-800 font-medium">Connected to Google Calendar</span>
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

          {/* Calendar Selection */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900">Selected Calendar</h3>
              <button
                onClick={handleSelectCalendar}
                disabled={loading}
                className="btn-secondary text-sm flex items-center space-x-2"
              >
                {loading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Settings className="h-4 w-4" />
                )}
                <span>Change</span>
              </button>
            </div>
            
            {selectedCalendar ? (
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="h-4 w-4 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">{selectedCalendar.calendar_name}</p>
                  {selectedCalendar.calendar_summary && (
                    <p className="text-sm text-gray-600">{selectedCalendar.calendar_summary}</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 text-sm">No calendar selected</p>
                <button
                  onClick={handleSelectCalendar}
                  className="btn-primary text-sm mt-2"
                >
                  Select Calendar
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Calendar Selection Modal */}
      {showCalendarSelection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Select Calendar for Appointments
              </h3>
              
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {calendars.map((calendar) => (
                  <button
                    key={calendar.id}
                    onClick={() => handleCalendarChoice(calendar)}
                    disabled={loading}
                    className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">{calendar.summary}</p>
                        {calendar.description && (
                          <p className="text-sm text-gray-600">{calendar.description}</p>
                        )}
                        {calendar.primary && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            Primary
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowCalendarSelection(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default GoogleCalendarSettings;