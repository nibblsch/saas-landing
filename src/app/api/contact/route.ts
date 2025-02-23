import { NextResponse } from 'next/server'
//import nodemailer from 'nodemailer' //Never used
import { google } from 'googleapis';  // ✅ Ensure google is imported

export async function POST(req: Request) {
  try {
    const { email, message, to } = await req.json()

    // Configure OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.REDIRECT_URI
    )
    
    // Set credentials
    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN
    })

    // Create Gmail API client
    const gmail = google.gmail({
      version: 'v1',
      auth: oauth2Client
    })

    // Create email content
    const emailContent = `From: ${process.env.EMAIL_USER}
    To: ${to}
    Subject: New BabyGPT Contact Form Submission
    Content-Type: text/html; charset=utf-8

    <h2>New Contact Form Submission</h2>
    <p><strong>From:</strong> ${email}</p>
    <p><strong>Message:</strong></p>
    <p>${message}</p>`

    // Encode the email
    const encodedEmail = Buffer.from(emailContent)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')

    // Send email
    await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedEmail
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Email error:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}