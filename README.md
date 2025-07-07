# My Photo Gallery

A personal photo showcase website similar to Instagram, designed for individual use. This application displays photos in a beautiful grid layout with the most recent photo featured prominently at the top. Photos can be uploaded via email, and visitors can leave comments that go through moderation.

![Featured Photo](https://imgix.cosmicjs.com/06354850-5b4d-11f0-a051-23c10f41277a-photo-1507525428034-b723cf961d3e-1751904678919.jpg?w=800&h=400&fit=crop&auto=format,compress)

## Features

- **Photo Grid Layout**: Display photos in a responsive grid with the most recent photo featured prominently
- **Email-to-Post**: Upload photos by emailing them to a specific email address
- **Individual Photo Pages**: Click on any photo to view it full-size with caption and date
- **Comment System**: Visitors can leave comments on photos with name and comment text
- **Comment Moderation**: All comments go into moderation for admin approval
- **Admin Dashboard**: Manage comments (approve/reject) and delete photos
- **Mobile Responsive**: Optimized for both mobile and desktop viewing
- **Photo Optimization**: Automatic image optimization using imgix
- **Date Sorting**: Photos and comments are sorted by date (most recent first)

## Clone this Bucket

Want to create your own version of this project with all the content and structure? Clone this Cosmic bucket to get started instantly:

[![Clone this Bucket](https://img.shields.io/badge/Clone%20this%20Bucket-4F46E5?style=for-the-badge&logo=cosmic&logoColor=white)](https://app.cosmic-staging.com/projects/new?clone_bucket=my-photos-production)

## Prompts

This application was built using the following prompts to generate the content structure and code:

### Content Model Prompt

> "Build a personal photo showcase website similar to Instagram, but just for me.
> 
> The site should display the most recent photo at the top, larger than the others. Below that, show a grid of past photos, ordered by date (most recent first).
> 
> Each photo should include a caption and upload date, visible both under the thumbnail and on the individual photo page when clicked.
> 
> I want to upload photos by emailing them to a specific email address—when an email with a photo attachment is received, it should automatically post the image on the site as the newest photo with the email subject as the caption and the timestamp as the date.
> 
> Visitors should be able to leave comments under each photo by entering their name and comment.
> 
> All comments must go into moderation—I, as the admin, want to approve them manually before they appear live on the site.
> 
> Include admin functionality to manage comments and optionally delete photos.
> 
> Keep the design simple and photo-focused, optimized for mobile and desktop."

### Code Generation Prompt

> "Build a personal photo showcase website similar to Instagram, but just for me.
> 
> The site should display the most recent photo at the top, larger than the others. Below that, show a grid of past photos, ordered by date (most recent first).
> 
> Each photo should include a caption and upload date, visible both under the thumbnail and on the individual photo page when clicked.
> 
> I want to upload photos by emailing them to a specific email address—when an email with a photo attachment is received, it should automatically post the image on the site as the newest photo with the email subject as the caption and the timestamp as the date.
> 
> Visitors should be able to leave comments under each photo by entering their name and comment.
> 
> All comments must go into moderation—I, as the admin, want to approve them manually before they appear live on the site.
> 
> Include admin functionality to manage comments and optionally delete photos.
> 
> Keep the design simple and photo-focused, optimized for mobile and desktop."

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

## Technologies Used

- [Next.js 15](https://nextjs.org/) - React framework with App Router
- [React](https://reactjs.org/) - JavaScript library for building user interfaces
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Cosmic](https://www.cosmicjs.com) - Headless CMS for content management
- [Cosmic SDK](https://www.cosmicjs.com/docs) - JavaScript SDK for Cosmic API

## Getting Started

### Prerequisites

- Node.js 18+ or Bun runtime
- A Cosmic account and bucket

### Installation

1. Clone this repository
2. Install dependencies:

```bash
bun install
```

3. Create a `.env.local` file with your Cosmic credentials:

```env
COSMIC_BUCKET_SLUG=your-bucket-slug
COSMIC_READ_KEY=your-read-key
COSMIC_WRITE_KEY=your-write-key
```

4. Run the development server:

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Cosmic SDK Examples

### Fetching Photos

```typescript
import { cosmic } from '@/lib/cosmic'

// Get all photos sorted by upload date
const photos = await cosmic.objects
  .find({
    type: 'photos'
  })
  .props(['id', 'title', 'slug', 'metadata'])
  .sort('-metadata.upload_date')
  .limit(20)

// Get a single photo with comments
const photo = await cosmic.objects
  .findOne({
    type: 'photos',
    slug: 'photo-slug'
  })
  .depth(1)
```

### Managing Comments

```typescript
// Get pending comments for moderation
const pendingComments = await cosmic.objects
  .find({
    type: 'comments',
    'metadata.moderation_status': 'pending'
  })
  .depth(1)

// Approve a comment
await cosmic.objects.updateOne('comment-id', {
  metadata: {
    moderation_status: 'approved'
  }
})
```

## Cosmic CMS Integration

This application is built with [Cosmic](https://www.cosmicjs.com), a headless CMS that provides:

- **Content Management**: Easy photo and comment management through the Cosmic dashboard
- **API-First**: RESTful API for all content operations
- **Media Management**: Built-in image optimization and CDN delivery
- **Flexible Schema**: Customizable content models for photos and comments
- **Real-time Updates**: Content changes reflect immediately on the website

For more information on using Cosmic, visit the [Cosmic documentation](https://www.cosmicjs.com/docs).

## Deployment Options

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Add environment variables in the Vercel dashboard
3. Deploy automatically on every push

### Netlify

1. Connect your repository to Netlify
2. Add environment variables in the Netlify dashboard
3. Set build command to `bun run build`
4. Set publish directory to `.next`

### Environment Variables

For production deployment, set these environment variables in your hosting platform:

- `COSMIC_BUCKET_SLUG` - Your Cosmic bucket slug
- `COSMIC_READ_KEY` - Your Cosmic read key
- `COSMIC_WRITE_KEY` - Your Cosmic write key

<!-- README_END -->