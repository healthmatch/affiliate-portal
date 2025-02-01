import { useEffect } from 'react';

export default function Reporting() {
  useEffect(() => {
    const metabaseUrl = 'https://sponsor-reporting.healthmatch.io';
    const dashboardId = 595;
    const apiKey = 'mb_7z9XrxT8qAUncyz+I0FpAJEG4SZZU5kJH/CFmujYXFI=';

    const iframe = document.getElementById('metabase-frame') as HTMLIFrameElement;
    if (iframe) {
      // Metabase expects the token as a signed JWT parameter
      const url = `${metabaseUrl}/embed/dashboard/${dashboardId}`;
      iframe.src = `${url}?token=${apiKey}`;
    }
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Reporting</h1>
      <div className="w-full h-[800px] bg-white rounded-lg shadow-lg">
        <iframe
          id="metabase-frame"
          className="w-full h-full border-0 rounded-lg"
          allowTransparency
          frameBorder="0"
          title="Metabase Dashboard"
        />
      </div>
    </div>
  );
}