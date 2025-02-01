import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Copy } from 'lucide-react';
import toast from 'react-hot-toast';

const CONDITIONS = ['vaccine', 'COPD'];

export default function LandingPages() {
  const { user } = useAuth();
  const [companyName, setCompanyName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const baseUrl = window.location.origin;

  useEffect(() => {
    const fetchCompanyName = async () => {
      if (!user?.id) return;

      try {
        const { data, error } = await supabase
          .from('affiliate_settings')
          .select('company_name')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        
        if (data?.company_name) {
          setCompanyName(data.company_name);
        }
      } catch (error) {
        console.error('Error fetching company name:', error);
        toast.error('Failed to load company information');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyName();
  }, [user?.id]);

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('URL copied to clipboard');
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error('Failed to copy URL');
    }
  };

  const getLandingPageUrl = (condition: string) => {
    const url = new URL(`${baseUrl}/affiliate-landing`);
    url.searchParams.set('name', companyName);
    url.searchParams.set('condition', condition);
    return url.toString();
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!companyName) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Landing Pages</h1>
        <p className="text-red-600">Please set your company name in Settings first.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Landing Pages</h1>
      
      <div className="space-y-6">
        {CONDITIONS.map((condition) => (
          <div key={condition} className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-2 capitalize">{condition} Landing Page</h2>
            <div className="flex items-center gap-4 mt-4">
              <input
                type="text"
                readOnly
                value={getLandingPageUrl(condition)}
                className="flex-1 p-2 bg-gray-50 border rounded-md text-sm"
              />
              <button
                onClick={() => copyToClipboard(getLandingPageUrl(condition))}
                className="p-2 text-gray-600 hover:text-gray-900"
                title="Copy URL"
              >
                <Copy className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
