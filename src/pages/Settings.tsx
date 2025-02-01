import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';

interface AffiliateSettings {
  company_name: string;
  logo_url: string;
  postback_url: string;
  api_key: string;
}

export default function Settings() {
  const { user } = useAuth();
  const [settings, setSettings] = React.useState<AffiliateSettings>({
    company_name: '',
    logo_url: '',
    postback_url: '',
    api_key: '',
  });
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('affiliate_settings')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setSettings(data);
      } else {
        const { data: newSettings, error: createError } = await supabase
          .from('affiliate_settings')
          .insert({
            id: user.id,
            company_name: '',
            logo_url: '',
            postback_url: '',
          })
          .select('*')
          .single();

        if (createError) throw createError;
        if (newSettings) setSettings(newSettings);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user?.id) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('affiliate_settings')
        .update({
          company_name: settings.company_name,
          logo_url: settings.logo_url,
          postback_url: settings.postback_url,
        })
        .eq('id', user.id);

      if (error) throw error;
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Company Name
              </label>
              <input
                type="text"
                value={settings.company_name}
                onChange={(e) => setSettings({ ...settings, company_name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Logo URL
              </label>
              <input
                type="url"
                value={settings.logo_url}
                onChange={(e) => setSettings({ ...settings, logo_url: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                placeholder="https://example.com/logo.png"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Postback URL
              </label>
              <input
                type="url"
                value={settings.postback_url}
                onChange={(e) => setSettings({ ...settings, postback_url: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                placeholder="https://your-domain.com/postback"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                API Key
              </label>
              <input
                type="text"
                readOnly
                value={settings.api_key}
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm sm:text-sm"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}