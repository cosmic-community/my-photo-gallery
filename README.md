# My Photo Gallery

A Next.js photo gallery application powered by Cosmic CMS with email-to-photo functionality.

## Features

- 📸 **Photo Gallery**: Beautiful responsive photo grid with detailed views
- 💬 **Comments System**: Visitors can comment on photos with moderation
- 📧 **Email to Photo**: Automatically add photos by sending emails with attachments
- 🎨 **Admin Dashboard**: Manage photos and moderate comments
- ⚡ **Performance**: Optimized images with imgix integration
- 📱 **Responsive**: Works great on all device sizes

## Email to Photo Feature

Send photos directly to your gallery by emailing them to: `jeffhovingaphotos@gmail.com`

### How it works:
1. Send an email with photo attachments to the configured email address
2. The subject line becomes the photo caption
3. Photos are automatically uploaded and published to your gallery
4. Supported formats: JPEG, PNG, GIF, WebP (up to 10MB each)

### Setting up Email Integration:

1. **Configure your email service** (Mailgun, SendGrid, etc.) to forward emails to your webhook endpoint:
   ```
   https://your-domain.com/api/email-webhook
   ```

2. **Add environment variables**:
   ```bash
   COSMIC_BUCKET_SLUG=your-bucket-slug
   COSMIC_READ_KEY=your-read-key
   COSMIC_WRITE_KEY=your-write-key
   ```

3. **Test the integration** by sending an email with photo attachments

## Getting Started

### Prerequisites

- Node.js 18+ 
- Bun package manager
- Cosmic CMS account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/cosmic-community/my-photo-gallery.git
   cd my-photo-gallery
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Fill in your Cosmic CMS credentials.

4. Run the development server:
   ```bash
   bun dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

Deploy to Vercel, Netlify, or your preferred hosting platform. Make sure to:

1. Set up your environment variables in the hosting platform
2. Configure your email service to send webhooks to your deployed URL
3. Test the email-to-photo functionality in production

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **CMS**: Cosmic CMS
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Image Optimization**: imgix
- **Email Processing**: Custom webhook handler

## Project Structure

```
├── app/
│   ├── api/email-webhook/     # Email webhook endpoint
│   ├── admin/                 # Admin dashboard
│   ├── photos/[slug]/         # Individual photo pages
│   └── page.tsx               # Homepage
├── components/                # Reusable UI components
├── lib/
│   ├── cosmic.ts             # Cosmic CMS integration
│   └── email-handler.ts      # Email processing logic
└── types.ts                  # TypeScript type definitions
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) file for details.