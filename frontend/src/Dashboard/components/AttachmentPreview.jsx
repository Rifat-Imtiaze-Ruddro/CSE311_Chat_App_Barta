import React from 'react';
import { FileText, Image, Video, Music, File } from 'lucide-react';

const AttachmentPreview = ({ attachment, type }) => {
  const getIcon = () => {
    if (attachment.mime_type.startsWith('image/')) return <Image className="w-5 h-5" />;
    if (attachment.mime_type.startsWith('video/')) return <Video className="w-5 h-5" />;
    if (attachment.mime_type.startsWith('audio/')) return <Music className="w-5 h-5" />;
    if (attachment.mime_type === 'text/plain') return <FileText className="w-5 h-5" />;
    return <File className="w-5 h-5" />;
  };

  const getSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className={`p-2 rounded-lg ${type === 'sent' ? 'bg-primary-focus' : 'bg-gray-200'}`}>
      {attachment.mime_type.startsWith('image/') ? (
        <div className="max-w-xs">
          <img 
            src={`http://localhost/barta/uploads/${attachment.file_path}`} 
            alt="Attachment" 
            className="rounded-md max-h-48 object-contain"
          />
        </div>
      ) : (
        <a 
          href={`http://localhost/barta/uploads/${attachment.file_path}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2"
        >
          {getIcon()}
          <div>
            <p className="text-sm font-medium">{attachment.original_name}</p>
            <p className="text-xs opacity-70">{getSize(attachment.file_size)}</p>
          </div>
        </a>
      )}
    </div>
  );
};

export default AttachmentPreview;