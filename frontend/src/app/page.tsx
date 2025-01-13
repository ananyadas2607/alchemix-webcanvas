'use client';
import { useState } from 'react';
import TemplatePreview from '@/components/TemplatePreview';

interface TemplateResponse {
  html: string;
  css: string;
}

export default function TemplatePage() {
  const [activeTab, setActiveTab] = useState('text');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [template, setTemplate] = useState<TemplateResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateTemplate = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/generate-template`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate template');
      }

      const data = await response.json();
      setTemplate(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error generating template:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1C1F26] text-white p-8">
      {/* Header with System Mode */}
      <div className="flex justify-between items-center mb-16">
        <h1 className="text-5xl font-bold">Create Your Website Template</h1>
        <div className="flex items-center gap-2 text-gray-300">
          <span>System mode</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center gap-4 mb-12">
        <button
          onClick={() => setActiveTab('text')}
          className={`px-8 py-3 rounded-full text-lg transition-all ${
            activeTab === 'text'
              ? 'bg-purple-600 text-white'
              : 'bg-[#2A2E37] text-gray-300 hover:bg-[#31353F]'
          }`}
        >
          Describe in Text
        </button>
        <button
          onClick={() => setActiveTab('draw')}
          className={`px-8 py-3 rounded-full text-lg transition-all ${
            activeTab === 'draw'
              ? 'bg-purple-600 text-white'
              : 'bg-[#2A2E37] text-gray-300 hover:bg-[#31353F]'
          }`}
        >
          Draw Layout
        </button>
      </div>

      {/* Main Form */}
      <div className="max-w-4xl mx-auto bg-[#2A2E37] rounded-2xl p-8">
        <label className="block text-xl text-gray-200 mb-4">
          Template Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your website template here... (e.g., 'I want a modern landing page with a hero section, feature grid, and contact form')"
          className="w-full h-48 px-4 py-3 rounded-lg bg-[#1C1F26] text-gray-300 placeholder-gray-500 border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all resize-none"
        />
        
        {error && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
            {error}
          </div>
        )}

        <button 
          onClick={generateTemplate}
          disabled={loading || !description.trim()}
          className={`w-full mt-6 py-4 bg-purple-600 text-white rounded-lg text-lg font-medium 
            ${loading || !description.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-700'} 
            transition-colors`}
        >
          {loading ? 'Generating...' : 'Generate Template'}
        </button>

        {/* Preview Section */}
        {template && (
          <div className="mt-8">
            <h2 className="text-xl text-gray-200 mb-4">Preview</h2>
            <TemplatePreview html={template.html} css={template.css} />
            
            {/* Code Display */}
            <div className="mt-8 space-y-4">
              <div>
                <h3 className="text-lg text-gray-200 mb-2">HTML</h3>
                <pre className="bg-[#1C1F26] p-4 rounded-lg overflow-x-auto">
                  <code>{template.html}</code>
                </pre>
              </div>
              <div>
                <h3 className="text-lg text-gray-200 mb-2">CSS</h3>
                <pre className="bg-[#1C1F26] p-4 rounded-lg overflow-x-auto">
                  <code>{template.css}</code>
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}