import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface SendReminderEmailParams {
  to: string;
  taskTitle: string;
  meetingTitle: string;
  deadline: Date | null;
  assigneeName: string;
}

export async function sendReminderEmail({
  to,
  taskTitle,
  meetingTitle,
  deadline,
  assigneeName,
}: SendReminderEmailParams): Promise<boolean> {
  try {
    const deadlineStr = deadline
      ? new Date(deadline).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : 'No deadline set';

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f3ff; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #6366f1, #818cf8); padding: 30px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 24px; }
          .content { padding: 30px; }
          .task-card { background: #f8fafc; border-left: 4px solid #6366f1; padding: 16px; margin: 16px 0; border-radius: 0 8px 8px 0; }
          .task-title { font-size: 18px; font-weight: 600; color: #1e1b4b; margin: 0 0 8px 0; }
          .task-meta { color: #6b7280; font-size: 14px; }
          .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
          .badge-high { background: #fef2f2; color: #dc2626; }
          .badge-medium { background: #fffbeb; color: #d97706; }
          .badge-low { background: #f0fdf4; color: #16a34a; }
          .cta-button { display: inline-block; background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 16px; }
          .footer { background: #f8fafc; padding: 20px; text-align: center; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>MeetFlow AI</h1>
          </div>
          <div class="content">
            <p>Hello ${assigneeName},</p>
            <p>This is a friendly reminder about an upcoming task from your meeting:</p>
            
            <div class="task-card">
              <p class="task-title">${taskTitle}</p>
              <p class="task-meta">
                <strong>Meeting:</strong> ${meetingTitle}<br>
                <strong>Deadline:</strong> ${deadlineStr}
              </p>
            </div>
            
            <p>Please update the task status once completed.</p>
            
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/tasks" class="cta-button">
              View Task
            </a>
          </div>
          <div class="footer">
            <p>This reminder was sent by MeetFlow AI</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"MeetFlow AI" <${process.env.SMTP_USER}>`,
      to,
      subject: `Reminder: ${taskTitle} due ${deadlineStr}`,
      html: htmlContent,
    });

    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}
