import { NextRequest, NextResponse } from 'next/server';
import { processEmailWithPhotos, extractEmailAddress } from '@/lib/email-handler';
import { EmailWebhookPayload, EmailAttachment } from '@/types';

// This endpoint will receive webhook calls from your email service
// You'll need to configure your email service (like Mailgun, SendGrid, etc.) to call this endpoint

export async function POST(request: NextRequest) {
  try {
    console.log('Email webhook received');

    // Get the request body
    const body = await request.text();
    let emailData: EmailWebhookPayload;

    // Try to parse as JSON first (for most email services)
    try {
      emailData = JSON.parse(body);
    } catch {
      // If JSON parsing fails, this might be form data
      // You may need to adjust this based on your email service's format
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!emailData.from || !emailData.to || !emailData.attachments) {
      console.log('Missing required email fields');
      return NextResponse.json(
        { error: 'Missing required email fields' },
        { status: 400 }
      );
    }

    // Extract clean email address from the 'from' field
    const fromEmail = extractEmailAddress(emailData.from);
    console.log(`Processing email from: ${fromEmail}`);

    // Check if email was sent to the correct address
    const targetEmail = 'jeffhovingaphotos@gmail.com';
    const isCorrectRecipient = emailData.to.some(recipient => 
      recipient.toLowerCase().includes(targetEmail.toLowerCase())
    );

    if (!isCorrectRecipient) {
      console.log(`Email not sent to target address: ${targetEmail}`);
      return NextResponse.json(
        { message: 'Email not for photo upload address' },
        { status: 200 }
      );
    }

    // Convert attachment data if needed
    const attachments: EmailAttachment[] = emailData.attachments.map(att => ({
      filename: att.filename,
      contentType: att.contentType,
      size: att.size,
      content: Buffer.isBuffer(att.content) 
        ? att.content 
        : Buffer.from(att.content, 'base64')
    }));

    // Process the email and attachments
    const results = await processEmailWithPhotos(
      fromEmail,
      emailData.subject || '',
      attachments
    );

    // Log results
    const successCount = results.filter(r => r.success).length;
    const errorCount = results.filter(r => !r.success).length;

    console.log(`Email processing completed: ${successCount} success, ${errorCount} errors`);

    // Return response
    return NextResponse.json({
      message: 'Email processed',
      results: results,
      summary: {
        total: results.length,
        success: successCount,
        errors: errorCount
      }
    });

  } catch (error) {
    console.error('Error processing email webhook:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Handle GET requests for testing
export async function GET() {
  return NextResponse.json({
    message: 'Email webhook endpoint is running',
    supportedMethods: ['POST'],
    targetEmail: 'jeffhovingaphotos@gmail.com'
  });
}