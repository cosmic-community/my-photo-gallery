import { cosmic } from './cosmic';
import { EmailAttachment, PhotoUploadResult } from '@/types';

// Allowed email addresses that can upload photos
const ALLOWED_EMAIL_ADDRESSES = [
  'jeffhovingaphotos@gmail.com', // Primary email address
  'jeffhovingaphotos@gail.com'   // Also allow the previous email for backwards compatibility
];

// Supported image types
const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/gif',
  'image/webp'
];

// Helper function to validate email address
export function isAllowedEmailAddress(emailAddress: string): boolean {
  return ALLOWED_EMAIL_ADDRESSES.some(allowed => 
    emailAddress.toLowerCase().includes(allowed.toLowerCase())
  );
}

// Helper function to validate image attachment
export function isValidImageAttachment(attachment: EmailAttachment): boolean {
  return SUPPORTED_IMAGE_TYPES.includes(attachment.contentType.toLowerCase()) &&
         attachment.size > 0 &&
         attachment.size < 10 * 1024 * 1024; // 10MB limit
}

// Helper function to generate a slug from filename
function generateSlugFromFilename(filename: string): string {
  return filename
    .toLowerCase()
    .replace(/\.[^/.]+$/, '') // Remove file extension
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
    .slice(0, 50); // Limit length
}

// Helper function to generate a title from filename and subject
function generateTitleFromEmail(filename: string, subject?: string): string {
  if (subject && subject.trim() && subject.toLowerCase() !== 'untitled') {
    return subject.trim();
  }
  
  // Generate title from filename
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
  return nameWithoutExt
    .replace(/[_-]/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase())
    .trim();
}

// Helper function to upload file to Cosmic
async function uploadFileToCosmicMedia(
  attachment: EmailAttachment
): Promise<{ url: string; imgix_url: string }> {
  try {
    // Create a File-like object from the buffer
    const file = new File([attachment.content], attachment.filename, {
      type: attachment.contentType
    });

    // Upload to Cosmic media library
    const response = await cosmic.media.insertOne({
      media: file,
      folder: 'email-uploads'
    });

    return {
      url: response.media.url,
      imgix_url: response.media.imgix_url
    };
  } catch (error) {
    console.error('Error uploading file to Cosmic:', error);
    throw new Error('Failed to upload image to media library');
  }
}

// Main function to process email and create photo
export async function processEmailWithPhotos(
  fromEmail: string,
  subject: string,
  attachments: EmailAttachment[]
): Promise<PhotoUploadResult[]> {
  const results: PhotoUploadResult[] = [];

  // Validate sender email
  if (!isAllowedEmailAddress(fromEmail)) {
    console.log(`Email from unauthorized address: ${fromEmail}`);
    return [{
      success: false,
      error: `Unauthorized email address: ${fromEmail}`
    }];
  }

  // Filter valid image attachments
  const imageAttachments = attachments.filter(isValidImageAttachment);

  if (imageAttachments.length === 0) {
    console.log('No valid image attachments found');
    return [{
      success: false,
      error: 'No valid image attachments found'
    }];
  }

  // Process each image attachment
  for (const attachment of imageAttachments) {
    try {
      console.log(`Processing attachment: ${attachment.filename}`);

      // Upload image to Cosmic media library
      const uploadedImage = await uploadFileToCosmicMedia(attachment);

      // Generate title and slug
      const title = generateTitleFromEmail(attachment.filename, subject);
      const baseSlug = generateSlugFromFilename(attachment.filename);
      
      // Create unique slug by appending timestamp if needed
      const timestamp = Date.now();
      const slug = `${baseSlug}-${timestamp}`;

      // Create photo object in Cosmic
      const photoResponse = await cosmic.objects.insertOne({
        type: 'photos',
        title: title,
        slug: slug,
        status: 'published',
        metadata: {
          caption: subject || `Photo uploaded via email: ${attachment.filename}`,
          photo: uploadedImage,
          upload_date: new Date().toISOString().split('T')[0],
          featured: false,
          email_source: fromEmail
        }
      });

      console.log(`Successfully created photo: ${photoResponse.object.id}`);

      results.push({
        success: true,
        photoId: photoResponse.object.id
      });

    } catch (error) {
      console.error(`Error processing attachment ${attachment.filename}:`, error);
      results.push({
        success: false,
        error: `Failed to process ${attachment.filename}: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  }

  return results;
}

// Helper function to extract email address from various formats
export function extractEmailAddress(emailString: string): string {
  // Handle formats like "Name <email@domain.com>" or just "email@domain.com"
  const emailMatch = emailString.match(/<([^>]+)>/) || emailString.match(/([^\s]+@[^\s]+)/);
  return emailMatch?.[1] ?? emailString;
}