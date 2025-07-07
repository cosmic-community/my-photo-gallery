export interface Photo {
  id: string;
  title: string;
  slug: string;
  metadata: {
    caption: string;
    photo: {
      url: string;
      imgix_url: string;
    };
    upload_date: string;
    featured: boolean;
    email_source?: string;
  };
}

export interface Comment {
  id: string;
  title: string;
  slug: string;
  metadata: {
    commenter_name: string;
    comment_text: string;
    photo: Photo;
    moderation_status: {
      key: string;
      value: string;
    };
    comment_date: string;
    commenter_email?: string;
  };
}

export type ModerationStatus = 'pending' | 'approved' | 'rejected';

export interface CosmicResponse<T> {
  objects: T[];
  total?: number;
}

// Email webhook types
export interface EmailAttachment {
  filename: string;
  contentType: string;
  size: number;
  content: Buffer;
}

export interface EmailWebhookPayload {
  from: string;
  to: string[];
  subject: string;
  text?: string;
  html?: string;
  attachments: EmailAttachment[];
  receivedAt: string;
}

export interface PhotoUploadResult {
  success: boolean;
  photoId?: string;
  error?: string;
}