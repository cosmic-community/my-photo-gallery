// Base Cosmic object interface
export interface CosmicObject {
  id: string;
  slug: string;
  title: string;
  content?: string;
  metadata: Record<string, any>;
  type_slug: string;
  created_at: string;
  modified_at: string;
  status?: string;
  published_at?: string;
  bucket?: string;
  created_by?: string;
  modified_by?: string;
  thumbnail?: string;
}

// Photo object type
export interface Photo extends CosmicObject {
  type_slug: 'photos';
  metadata: {
    caption: string;
    photo: {
      url: string;
      imgix_url: string;
    };
    upload_date: string;
    featured?: boolean;
    email_source?: string;
  };
}

// Comment object type
export interface Comment extends CosmicObject {
  type_slug: 'comments';
  metadata: {
    commenter_name: string;
    comment_text: string;
    photo: Photo;
    moderation_status: {
      key: ModerationStatus;
      value: string;
    };
    comment_date: string;
    commenter_email?: string;
  };
}

// Type literals for select-dropdown values
export type ModerationStatus = 'pending' | 'approved' | 'rejected';

// API response types
export interface CosmicResponse<T> {
  objects: T[];
  total: number;
  limit?: number;
  skip?: number;
}

// Type guards for runtime validation
export function isPhoto(obj: CosmicObject): obj is Photo {
  return obj.type_slug === 'photos';
}

export function isComment(obj: CosmicObject): obj is Comment {
  return obj.type_slug === 'comments';
}

// Utility types for common patterns
export type CreateCommentData = {
  commenter_name: string;
  comment_text: string;
  photo_id: string;
  commenter_email?: string;
};

export type UpdateCommentData = {
  moderation_status: ModerationStatus;
};

// Component prop types
export interface PhotoGridProps {
  photos: Photo[];
}

export interface PhotoCardProps {
  photo: Photo;
  featured?: boolean;
  showCaption?: boolean;
}

export interface CommentFormProps {
  photoId: string;
  onCommentSubmitted?: () => void;
}

export interface CommentListProps {
  comments: Comment[];
  showModeration?: boolean;
}

export interface AdminCommentCardProps {
  comment: Comment;
  onStatusChange: (commentId: string, status: ModerationStatus) => void;
}