const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

exports.sendWeeklyReport = async (to, name, stats) => {
  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:auto;">
      <h2 style="color:#2563eb;">ResumeIQ Weekly Report 📊</h2>
      <p>Hi ${name},</p>
      <p>Here's your weekly resume performance summary:</p>
      <ul>
        <li><strong>Best ATS Score:</strong> ${stats.bestScore}/100</li>
        <li><strong>Total Scans:</strong> ${stats.totalScans}</li>
        <li><strong>Top Missing Keyword:</strong> ${stats.topMissingKeyword || 'N/A'}</li>
      </ul>
      <p>Keep improving your resume for better ATS compatibility!</p>
      <a href="${process.env.CLIENT_URL}" style="background:#2563eb;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;">Open ResumeIQ</a>
    </div>
  `;
  await transporter.sendMail({
    from: `"ResumeIQ" <${process.env.EMAIL_USER}>`,
    to, subject: 'Your Weekly ResumeIQ Report', html,
  });
};
