import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Preferences() {
    const [preferences, setPreferences] = useState({
        notifications: {
          emailNotifications: true,
          pushNotifications: false,
          renewalReminders: true,
          weeklyReports: false,
          reminderDays: 7
        },
        display: {
          darkMode: false,
          currency: 'USD',
          dateFormat: 'MM/DD/YYYY',
          language: 'en'
        },
        privacy: {
          dataSharing: false,
          analyticsTracking: true,
          marketingEmails: false
        },
        subscriptions: {
          defaultCategory: '',
          autoSync: true,
          duplicateDetection: true,
          trialReminders: true
        }
      });
      
      
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeSection, setActiveSection] = useState('notifications');

  const navigate = useNavigate();

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://127.0.0.1:5000/users/preferences', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.preferences) {
          setPreferences(data.preferences);
        }
      }
    } catch (err) {
      console.error('Error fetching preferences:', err);
      // Continue with default preferences if fetch fails
    }
  };

  const handlePreferenceChange = (section, key, value) => {
    setPreferences(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
    if (error) setError('');
  };

  const savePreferences = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://127.0.0.1:5000/users/preferences', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ preferences })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Preferences saved successfully!');
        // Apply theme changes immediately
        if (preferences.display.darkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } else {
        setError(data.message || 'Failed to save preferences');
      }
    } catch (err) {
      console.error('Error saving preferences:', err);
      setError('Network error while saving preferences');
    } finally {
      setLoading(false);
    }
  };

  const resetToDefaults = () => {
    if (confirm('Are you sure you want to reset all preferences to default values?')) {
      setPreferences({
        notifications: {
          emailNotifications: true,
          pushNotifications: false,
          renewalReminders: true,
          weeklyReports: false,
          reminderDays: 7
        },
        display: {
          darkMode: false,
          currency: 'USD',
          dateFormat: 'MM/DD/YYYY',
          language: 'en'
        },
        privacy: {
          dataSharing: false,
          analyticsTracking: true,
          marketingEmails: false
        },
        subscriptions: {
          defaultCategory: '',
          autoSync: true,
          duplicateDetection: true,
          trialReminders: true
        }
      });
      setSuccess('Preferences reset to defaults');
    }
  };

  const currencies = [
    { value: 'USD', label: 'USD ($)' },
    { value: 'EUR', label: 'EUR (€)' },
    { value: 'GBP', label: 'GBP (£)' },
    { value: 'INR', label: 'INR (₹)' },
    { value: 'CAD', label: 'CAD ($)' },
    { value: 'AUD', label: 'AUD ($)' }
  ];

  const dateFormats = [
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' }
  ];

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' }
  ];

  const categories = [
    'Entertainment', 'Music', 'Productivity', 'Design', 
    'Cloud', 'Gaming', 'News', 'Health', 'Education', 'Other'
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Preferences</h1>
            <p className="text-gray-600">Customize your subscription management experience</p>
          </div>

          <div className="flex">
            {/* Sidebar Navigation */}
            <div className="w-64 border-r border-gray-200">
              <nav className="p-4 space-y-1">
                {[
                  { id: 'notifications', label: 'Notifications', icon: '🔔' },
                  { id: 'display', label: 'Display', icon: '🎨' },
                  { id: 'privacy', label: 'Privacy', icon: '🔐' },
                  { id: 'subscriptions', label: 'Subscriptions', icon: '📋' }
                ].map(({ id, label, icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveSection(id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left ${
                      activeSection === id
                        ? 'bg-indigo-50 text-indigo-700 border-r-2 border-indigo-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-lg">{icon}</span>
                    <span className="font-medium">{label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md mb-6">
                  {success}
                </div>
              )}

              {/* Notifications Section */}
              {activeSection === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Settings</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Email Notifications</label>
                          <p className="text-sm text-gray-500">Receive notifications via email</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={preferences.notifications.emailNotifications}
                          onChange={(e) => handlePreferenceChange('notifications', 'emailNotifications', e.target.checked)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Push Notifications</label>
                          <p className="text-sm text-gray-500">Receive push notifications in browser</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={preferences.notifications.pushNotifications}
                          onChange={(e) => handlePreferenceChange('notifications', 'pushNotifications', e.target.checked)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Renewal Reminders</label>
                          <p className="text-sm text-gray-500">Get notified before subscriptions renew</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={preferences.notifications.renewalReminders}
                          onChange={(e) => handlePreferenceChange('notifications', 'renewalReminders', e.target.checked)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Weekly Reports</label>
                          <p className="text-sm text-gray-500">Receive weekly spending summaries</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={preferences.notifications.weeklyReports}
                          onChange={(e) => handlePreferenceChange('notifications', 'weeklyReports', e.target.checked)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Reminder Days Before Renewal
                        </label>
                        <select
                          value={preferences.notifications.reminderDays}
                          onChange={(e) => handlePreferenceChange('notifications', 'reminderDays', parseInt(e.target.value))}
                          className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value={1}>1 day</option>
                          <option value={3}>3 days</option>
                          <option value={7}>7 days</option>
                          <option value={14}>14 days</option>
                          <option value={30}>30 days</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Display Section */}
              {activeSection === 'display' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Display Settings</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Dark Mode</label>
                          <p className="text-sm text-gray-500">Use dark theme across the app</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={preferences.display.darkMode}
                          onChange={(e) => handlePreferenceChange('display', 'darkMode', e.target.checked)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                        <select
                          value={preferences.display.currency}
                          onChange={(e) => handlePreferenceChange('display', 'currency', e.target.value)}
                          className="w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          {currencies.map(currency => (
                            <option key={currency.value} value={currency.value}>
                              {currency.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
                        <select
                          value={preferences.display.dateFormat}
                          onChange={(e) => handlePreferenceChange('display', 'dateFormat', e.target.value)}
                          className="w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          {dateFormats.map(format => (
                            <option key={format.value} value={format.value}>
                              {format.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                        <select
                          value={preferences.display.language}
                          onChange={(e) => handlePreferenceChange('display', 'language', e.target.value)}
                          className="w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          {languages.map(lang => (
                            <option key={lang.value} value={lang.value}>
                              {lang.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy Section */}
              {activeSection === 'privacy' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Privacy Settings</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Data Sharing</label>
                          <p className="text-sm text-gray-500">Allow anonymous data sharing for app improvement</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={preferences.privacy.dataSharing}
                          onChange={(e) => handlePreferenceChange('privacy', 'dataSharing', e.target.checked)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Analytics Tracking</label>
                          <p className="text-sm text-gray-500">Help improve the app with usage analytics</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={preferences.privacy.analyticsTracking}
                          onChange={(e) => handlePreferenceChange('privacy', 'analyticsTracking', e.target.checked)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Marketing Emails</label>
                          <p className="text-sm text-gray-500">Receive promotional emails and updates</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={preferences.privacy.marketingEmails}
                          onChange={(e) => handlePreferenceChange('privacy', 'marketingEmails', e.target.checked)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Subscriptions Section */}
              {activeSection === 'subscriptions' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Subscription Settings</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Default Category
                        </label>
                        <select
                          value={preferences.subscriptions.defaultCategory}
                          onChange={(e) => handlePreferenceChange('subscriptions', 'defaultCategory', e.target.value)}
                          className="w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="">No default</option>
                          {categories.map(category => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Auto Sync</label>
                          <p className="text-sm text-gray-500">Automatically sync with connected accounts</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={preferences.subscriptions.autoSync}
                          onChange={(e) => handlePreferenceChange('subscriptions', 'autoSync', e.target.checked)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Duplicate Detection</label>
                          <p className="text-sm text-gray-500">Alert when potential duplicate subscriptions are found</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={preferences.subscriptions.duplicateDetection}
                          onChange={(e) => handlePreferenceChange('subscriptions', 'duplicateDetection', e.target.checked)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Trial Reminders</label>
                          <p className="text-sm text-gray-500">Get notified when free trials are about to end</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={preferences.subscriptions.trialReminders}
                          onChange={(e) => handlePreferenceChange('subscriptions', 'trialReminders', e.target.checked)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                <button
                  onClick={resetToDefaults}
                  className="text-gray-600 hover:text-gray-800 font-medium"
                >
                  Reset to Defaults
                </button>
                <div className="space-x-3">
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={savePreferences}
                    disabled={loading}
                    className={`px-6 py-2 rounded-md font-semibold ${
                      loading
                        ? 'bg-gray-400 cursor-not-allowed text-white'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                  >
                    {loading ? 'Saving...' : 'Save Preferences'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Preferences;
