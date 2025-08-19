import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Contact form validation schema
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Please enter a valid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message must be less than 1000 characters'),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate the request body
    const body = await request.json();
    const validationResult = contactSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { 
          message: 'Validation failed', 
          errors: validationResult.error.errors 
        }, 
        { status: 400 }
      );
    }

    const { name, email, message } = validationResult.data;

    // Rate limiting check (basic implementation)
    const clientIP = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitKey = `contact:${clientIP}`;
    
    // In production, you'd use Redis or a similar service for rate limiting
    // For now, we'll implement a basic check
    const now = Date.now();
    const lastSubmission = await getLastSubmissionTime(clientIP);
    
    if (lastSubmission && (now - lastSubmission) < 60000) { // 1 minute cooldown
      return NextResponse.json(
        { message: 'Please wait a moment before sending another message' },
        { status: 429 }
      );
    }

    // Store submission time for rate limiting
    await storeSubmissionTime(clientIP, now);

    // Log the contact form submission
    console.log('Contact form submission:', {
      name,
      email,
      message: message.substring(0, 100) + (message.length > 100 ? '...' : ''),
      timestamp: new Date().toISOString(),
      ip: clientIP,
    });

    // In production, you would:
    // 1. Send an email notification to your team
    // 2. Store the message in a database
    // 3. Send a confirmation email to the user
    // 4. Integrate with your CRM system

    // For now, we'll simulate sending an email
    await sendContactNotification(name, email, message);

    // Return success response
    return NextResponse.json(
      { 
        message: 'Message sent successfully',
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    
    return NextResponse.json(
      { message: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}

// Helper function to get last submission time (placeholder for production)
async function getLastSubmissionTime(clientIP: string): Promise<number | null> {
  // In production, this would query Redis or a database
  // For now, return null to allow all submissions
  return null;
}

// Helper function to store submission time (placeholder for production)
async function storeSubmissionTime(clientIP: string, timestamp: number): Promise<void> {
  // In production, this would store in Redis or a database
  // For now, do nothing
}

// Helper function to send contact notification (placeholder for production)
async function sendContactNotification(name: string, email: string, message: string): Promise<void> {
  // In production, this would:
  // 1. Use a service like SendGrid, Mailgun, or AWS SES
  // 2. Send to your team's email
  // 3. Send a confirmation to the user
  
  // Example with SendGrid (uncomment and configure for production):
  /*
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  
  const msg = {
    to: 'team@slate360.com',
    from: 'noreply@slate360.com',
    subject: `New Contact Form Submission from ${name}`,
    text: `
      Name: ${name}
      Email: ${email}
      Message: ${message}
    `,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `,
  };
  
  await sgMail.send(msg);
  */
  
  // For now, just log the notification
  console.log('Contact notification would be sent:', { name, email, message });
}
