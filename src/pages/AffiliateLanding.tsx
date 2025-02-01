import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';

const AffiliateLanding: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [zipCode, setZipCode] = useState('');
  const [affiliateLogo, setAffiliateLogo] = useState<string | null>(null);
  const affiliateName = searchParams.get('name');
  const condition = searchParams.get('condition');

  useEffect(() => {
    const fetchAffiliateLogo = async () => {
      if (!affiliateName) return;
      
      try {
        const { data, error } = await supabase
          .from('affiliate_settings')
          .select('logo_url')
          .eq('company_name', affiliateName)
          .single();

        if (error) throw error;
        
        if (data) {
          setAffiliateLogo(data.logo_url);
        }
      } catch (error) {
        console.error('Error fetching affiliate logo:', error);
        toast.error('Failed to load affiliate branding');
      }
    };

    fetchAffiliateLogo();
  }, [affiliateName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!affiliateName || !zipCode) return;

    const signupUrl = new URL('https://app.healthmatch.io/signup');
    
    // Add required parameters
    signupUrl.searchParams.set('cid', '363');
    signupUrl.searchParams.set('c', 'US');
    signupUrl.searchParams.set('m', 'affiliates');
    signupUrl.searchParams.set('s', affiliateName);
    signupUrl.searchParams.set('sub', zipCode);
    
    // Pass through all existing query parameters except 'name'
    searchParams.forEach((value, key) => {
      if (key !== 'name') {
        signupUrl.searchParams.set(key, value);
      }
    });

    window.location.href = signupUrl.toString();
  };

  if (!affiliateName) {
    return <div>Invalid affiliate page</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {affiliateLogo && (
        <img 
          src={affiliateLogo} 
          alt={`${affiliateName} logo`} 
          className="max-w-xs mb-8"
        />
      )}
      
      <div className="text-xl font-semibold mb-6 text-center">
        {condition && `Interested in ${condition} trials?`}
      </div>
      
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="mb-4">
          <input
            type="text"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            placeholder="Enter ZIP Code"
            pattern="[0-9]{5}"
            maxLength={5}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AffiliateLanding;
