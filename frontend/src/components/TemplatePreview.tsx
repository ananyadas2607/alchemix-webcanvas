import { useEffect, useRef } from 'react';

interface TemplatePreviewProps {
  html: string;
  css: string;
}

export default function TemplatePreview({ html, css }: TemplatePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      
      if (doc) {
        doc.open();
        doc.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <style>${css}</style>
            </head>
            <body>${html}</body>
          </html>
        `);
        doc.close();
      }
    }
  }, [html, css]);

  return (
    <iframe
      ref={iframeRef}
      className="w-full h-[600px] border-0 rounded-lg bg-white"
      title="Template Preview"
    />
  );
} 