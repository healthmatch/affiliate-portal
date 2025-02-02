

export default function ApiConfig() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">API Explorer</h1>
      <div className="w-full h-[calc(100vh-12rem)] rounded-lg overflow-hidden border border-gray-200">
        <iframe
          src="http://localhost:4000"
          className="w-full h-full"
          title="API Explorer"
          frameBorder="0"
        />
      </div>
    </div>
  );
}