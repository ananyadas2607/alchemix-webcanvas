import { useState } from 'react';
import axios from 'axios';

interface TemplateRequest {
  description: string;
  image_keywords?: string[];
}

interface ImageCredit {
  name: string;
  link: string;
}

interface Image {
  id: string;
  url: string;
  credit: ImageCredit;
}

interface TemplateResponse {
  code: string;
  images: Image[];
}

export default function TemplateGenerator() {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [template, setTemplate] = useState<TemplateResponse | null>(null);

  const handleGenerateTemplate = async () => {
    try {
      setLoading(true);
      const request: TemplateRequest = {
        description,
        image_keywords: ['modern', 'website', 'minimal']
      };

      const response = await axios.post<TemplateResponse>(
        'http://localhost:8000/api/generate-template',
        request
      );

      setTemplate(response.data);
    } catch (error) {
      console.error('Error generating template:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe your website..."
      />
      <button
        onClick={handleGenerateTemplate}
        disabled={loading || !description}
      >
        {loading ? 'Generating...' : 'Generate Template'}
      </button>

      {template && (
        <div>
          <h2>Generated Template:</h2>
          <div dangerouslySetInnerHTML={{ __html: template.code }} />
          <h3>Images:</h3>
          <div className="images-grid">
            {template.images.map((image) => (
              <div key={image.id}>
                <img src={image.url} alt="" />
                <p>
                  Credit:{' '}
                  <a href={image.credit.link} target="_blank" rel="noopener noreferrer">
                    {image.credit.name}
                  </a>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 