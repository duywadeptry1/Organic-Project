import nodemailer from 'nodemailer';

/**
 * Dispatches an automated payout notification email to admin (1904duy@gmail.com)
 * when a farm/brand submits a withdrawal request.
 */
export const sendWithdrawalNotificationEmail = async ({
  withdrawal,
  wallet,
  farmUser,
}) => {
  const recipient = '1904duy@gmail.com';
  const brand = withdrawal.brand || 'Farm Partner';
  const amount = Number(withdrawal.amount || 0).toFixed(2);
  const bankInfo = withdrawal.bankInfo || {};
  const currentBalance = Number(wallet?.balance || 0).toFixed(2);
  const totalEarned = Number(wallet?.totalEarned || 0).toFixed(2);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; padding: 24px; margin: 0; }
          .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
          .header { background: #15803d; color: #ffffff; padding: 24px; text-align: center; }
          .header h1 { margin: 0; font-size: 20px; font-weight: 800; }
          .header p { margin: 6px 0 0; font-size: 13px; opacity: 0.9; }
          .body { padding: 24px; }
          .highlight { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 18px; text-align: center; margin-bottom: 24px; }
          .amount { font-size: 32px; font-weight: 900; color: #166534; margin: 6px 0; }
          .meta-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px; }
          .meta-table td { padding: 10px 12px; border-bottom: 1px solid #f1f5f9; }
          .meta-table td:first-child { color: #64748b; font-weight: 600; width: 40%; }
          .meta-table td:last-child { color: #0f172a; font-weight: 700; }
          .instructions { background: #fffbeb; border: 1px solid #fef3c7; border-radius: 10px; padding: 14px; font-size: 13px; color: #92400e; margin-bottom: 20px; line-height: 1.5; }
          .btn { display: block; text-align: center; background: #15803d; color: #ffffff !important; padding: 14px 20px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 14px; }
          .footer { text-align: center; padding: 16px; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <h1>Organi Farm Payout Notification</h1>
            <p>New withdrawal payout request submitted</p>
          </div>
          <div class="body">
            <div class="highlight">
              <span style="font-size: 12px; font-weight: bold; text-transform: uppercase; color: #15803d; letter-spacing: 0.5px;">Requested Payout Amount</span>
              <div class="amount">$${amount} USD</div>
              <span style="font-size: 12px; color: #475569;">Brand: <strong>${brand}</strong></span>
            </div>

            <table class="meta-table">
              <tr>
                <td>Farm / Brand Name</td>
                <td>${brand}</td>
              </tr>
              <tr>
                <td>Contact Email</td>
                <td>${farmUser?.email || 'N/A'}</td>
              </tr>
              <tr>
                <td>Bank Name</td>
                <td>${bankInfo.bankName || 'Not specified'}</td>
              </tr>
              <tr>
                <td>Account Number</td>
                <td style="font-family: monospace; font-size: 15px; color: #0f172a;">${bankInfo.accountNumber || 'Not specified'}</td>
              </tr>
              <tr>
                <td>Account Holder Name</td>
                <td>${bankInfo.accountName || 'Not specified'}</td>
              </tr>
              ${bankInfo.routingNumber ? `
              <tr>
                <td>Routing / SWIFT Code</td>
                <td>${bankInfo.routingNumber}</td>
              </tr>` : ''}
              ${bankInfo.note ? `
              <tr>
                <td>Farm Note</td>
                <td>${bankInfo.note}</td>
              </tr>` : ''}
              <tr>
                <td>Remaining Wallet Balance</td>
                <td>$${currentBalance} USD</td>
              </tr>
              <tr>
                <td>Lifetime Farm Earnings</td>
                <td>$${totalEarned} USD</td>
              </tr>
              <tr>
                <td>Request Date & Time</td>
                <td>${new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' })}</td>
              </tr>
            </table>

            <div class="instructions">
              <strong>Admin Action Required:</strong><br/>
              1. Transfer the requested <strong>$${amount}</strong> to the farm's bank account specified above.<br/>
              2. Open the Organi Admin Portal to verify and click <strong>"Confirm Money Sent / Mark Paid"</strong>.
            </div>

            <a href="http://localhost:3000/admin/withdrawals" class="btn">
              Open Admin Withdrawals Portal &rarr;
            </a>
          </div>
          <div class="footer">
            Organi Store Automated System &bull; Direct notice dispatched to ${recipient}
          </div>
        </div>
      </body>
    </html>
  `;

  const subject = `[Organi Farm Payout] Withdrawal Request: $${amount} from ${brand}`;

  // Check if real SMTP transport credentials are provided in environment
  const smtpHost = process.env.EMAIL_HOST;
  const smtpUser = process.env.EMAIL_USER;
  const smtpPass = process.env.EMAIL_PASS;

  if (smtpHost && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(process.env.EMAIL_PORT) || 587,
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const info = await transporter.sendMail({
        from: `"Organi Platform" <${smtpUser}>`,
        to: recipient,
        subject,
        html: htmlContent,
      });

      console.log(`✅ [Email] Real payout alert successfully sent to ${recipient} (Message ID: ${info.messageId})`);
      return { success: true, mode: 'SMTP_SENT', recipient, messageId: info.messageId };
    } catch (err) {
      console.error(`⚠️ [Email] SMTP send failed (${err.message}). Logging payout request details below:`);
    }
  }

  // Fallback: development log mode (always logs complete alert clearly)
  console.log(`\n=============================================================`);
  console.log(`📧 [EMAIL NOTIFICATION DISPATCHED TO: ${recipient}]`);
  console.log(`📌 SUBJECT: ${subject}`);
  console.log(`🏢 FARM BRAND: ${brand} (${farmUser?.email || 'N/A'})`);
  console.log(`💵 WITHDRAWAL AMOUNT: $${amount}`);
  console.log(`🏦 BANK: ${bankInfo.bankName} | ACC: ${bankInfo.accountNumber} | HOLDER: ${bankInfo.accountName}`);
  console.log(`📊 REMAINING BALANCE: $${currentBalance} | LIFETIME EARNED: $${totalEarned}`);
  console.log(`🔗 ADMIN PORTAL: http://localhost:3000/admin/withdrawals`);
  console.log(`=============================================================\n`);

  return { success: true, mode: 'LOGGED_DEV', recipient };
};

export default { sendWithdrawalNotificationEmail };
