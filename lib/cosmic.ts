import { createBucketClient } from '@cosmicjs/sdk';
import { Photo, Comment, CosmicResponse, ModerationStatus } from '@/types';

export const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
  apiEnvironment: "staging"
});

// Helper function for error handling
function hasStatus(error: unknown): error is { status: number } {
  return typeof error === 'object' && error !== null && 'status' in error;
}

// Get all photos sorted by upload date
export async function getPhotos(): Promise<Photo[]> {
  try {
    const response = await cosmic.objects
      .find({
        type: 'photos'
      })
      .props(['id', 'title', 'slug', 'metadata'])
      .sort('-metadata.upload_date')
      .limit(50);
    
    return response.objects as Photo[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    console.error('Error fetching photos:', error);
    throw new Error('Failed to fetch photos');
  }
}

// Get a single photo by slug
export async function getPhotoBySlug(slug: string): Promise<Photo | null> {
  try {
    const response = await cosmic.objects
      .findOne({
        type: 'photos',
        slug
      })
      .props(['id', 'title', 'slug', 'metadata']);
    
    return response.object as Photo;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    console.error('Error fetching photo:', error);
    throw new Error('Failed to fetch photo');
  }
}

// Get featured photo (most recent with featured flag or just most recent)
export async function getFeaturedPhoto(): Promise<Photo | null> {
  try {
    // First try to get a photo marked as featured
    const featuredResponse = await cosmic.objects
      .find({
        type: 'photos',
        'metadata.featured': true
      })
      .props(['id', 'title', 'slug', 'metadata'])
      .sort('-metadata.upload_date')
      .limit(1);
    
    if (featuredResponse.objects.length > 0) {
      return featuredResponse.objects[0] as Photo;
    }
    
    // If no featured photo, get the most recent one
    const recentResponse = await cosmic.objects
      .find({
        type: 'photos'
      })
      .props(['id', 'title', 'slug', 'metadata'])
      .sort('-metadata.upload_date')
      .limit(1);
    
    return recentResponse.objects.length > 0 ? recentResponse.objects[0] as Photo : null;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    console.error('Error fetching featured photo:', error);
    throw new Error('Failed to fetch featured photo');
  }
}

// Get approved comments for a photo
export async function getApprovedComments(photoId: string): Promise<Comment[]> {
  try {
    const response = await cosmic.objects
      .find({
        type: 'comments',
        'metadata.photo': photoId,
        'metadata.moderation_status': 'approved'
      })
      .props(['id', 'title', 'slug', 'metadata'])
      .sort('-metadata.comment_date')
      .depth(1);
    
    return response.objects as Comment[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    console.error('Error fetching comments:', error);
    throw new Error('Failed to fetch comments');
  }
}

// Get all comments for admin (including pending)
export async function getAllComments(): Promise<Comment[]> {
  try {
    const response = await cosmic.objects
      .find({
        type: 'comments'
      })
      .props(['id', 'title', 'slug', 'metadata'])
      .sort('-metadata.comment_date')
      .depth(1);
    
    return response.objects as Comment[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    console.error('Error fetching all comments:', error);
    throw new Error('Failed to fetch all comments');
  }
}

// Get pending comments for moderation
export async function getPendingComments(): Promise<Comment[]> {
  try {
    const response = await cosmic.objects
      .find({
        type: 'comments',
        'metadata.moderation_status': 'pending'
      })
      .props(['id', 'title', 'slug', 'metadata'])
      .sort('-metadata.comment_date')
      .depth(1);
    
    return response.objects as Comment[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    console.error('Error fetching pending comments:', error);
    throw new Error('Failed to fetch pending comments');
  }
}

// Create a new comment
export async function createComment(data: {
  commenter_name: string;
  comment_text: string;
  photo_id: string;
  commenter_email?: string;
}): Promise<Comment> {
  try {
    const response = await cosmic.objects.insertOne({
      type: 'comments',
      title: `Comment by ${data.commenter_name}`,
      metadata: {
        commenter_name: data.commenter_name,
        comment_text: data.comment_text,
        photo: data.photo_id,
        moderation_status: 'pending',
        comment_date: new Date().toISOString().split('T')[0],
        commenter_email: data.commenter_email || ''
      }
    });
    
    return response.object as Comment;
  } catch (error) {
    console.error('Error creating comment:', error);
    throw new Error('Failed to create comment');
  }
}

// Update comment moderation status
export async function updateCommentStatus(commentId: string, status: ModerationStatus): Promise<Comment> {
  try {
    const response = await cosmic.objects.updateOne(commentId, {
      metadata: {
        moderation_status: status
      }
    });
    
    return response.object as Comment;
  } catch (error) {
    console.error('Error updating comment status:', error);
    throw new Error('Failed to update comment status');
  }
}

// Delete a photo
export async function deletePhoto(photoId: string): Promise<void> {
  try {
    await cosmic.objects.deleteOne(photoId);
  } catch (error) {
    console.error('Error deleting photo:', error);
    throw new Error('Failed to delete photo');
  }
}

// Delete a comment
export async function deleteComment(commentId: string): Promise<void> {
  try {
    await cosmic.objects.deleteOne(commentId);
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw new Error('Failed to delete comment');
  }
}

// Create a new photo (used by email handler)
export async function createPhoto(data: {
  title: string;
  slug: string;
  caption: string;
  photo: { url: string; imgix_url: string };
  email_source?: string;
  featured?: boolean;
}): Promise<Photo> {
  try {
    const response = await cosmic.objects.insertOne({
      type: 'photos',
      title: data.title,
      slug: data.slug,
      status: 'published',
      metadata: {
        caption: data.caption,
        photo: data.photo,
        upload_date: new Date().toISOString().split('T')[0],
        featured: data.featured || false,
        email_source: data.email_source || ''
      }
    });
    
    return response.object as Photo;
  } catch (error) {
    console.error('Error creating photo:', error);
    throw new Error('Failed to create photo');
  }
}