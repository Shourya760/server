
export const commentEmail = (article, commenter, comment) => ({
    subject: `${commenter.name} commented on your article`,

    text: `
Hello ${article.createdBy.name},

${commenter.name} commented on your article "${article.title}".

    Comment:
"${comment}"

Log in to your account to view the comment and respond.

    Warmly,
    The Team
        `.trim(),

    html: `
        < !DOCTYPE html >
            <html>
                <head>
                    <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        </head>

                        <body style="margin:0;background:#f8f5fa;font-family:Arial,sans-serif;color:#29252f;">
                            <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 15px;">
                                <tr>
                                    <td align="center">

                                        <table width="100%" cellpadding="0" cellspacing="0"
                                            style="max-width:560px;background:#fffdfb;border-radius:18px;
                    overflow:hidden;box-shadow:0 8px 30px rgba(80,50,100,.08);">

                                            <!-- Header -->
                                            <tr>
                                                <td style="padding:38px 30px;text-align:center;
                            background:linear-gradient(135deg,#eee5f8,#d8c3ee);">

                                                    <div style="font-size:28px;">✦</div>

                                                    <h1 style="margin:10px 0 6px;font-family:Georgia,serif;
                                font-size:27px;color:#30253a;">
                                                        New Comment
                                                    </h1>

                                                    <p style="margin:0;color:#62546d;font-size:14px;">
                                                        Someone joined the conversation
                                                    </p>
                                                </td>
                                            </tr>

                                            <!-- Content -->
                                            <tr>
                                                <td style="padding:35px 30px;">

                                                    <p style="margin:0 0 20px;font-size:16px;line-height:1.7;">
                                                        Hello <strong>${article.createdBy.name}</strong>,
                                                    </p>

                                                    <p style="margin:0 0 22px;font-size:15px;line-height:1.7;
                                color:#625a68;">
                                                        <strong>${commenter.name}</strong> left a comment
                                                        on your article:
                                                    </p>

                                                    <!-- Article -->
                                                    <div style="padding:16px 18px;background:#f7f2fa;
                                border-radius:12px;margin-bottom:22px;">

                                                        <p style="margin:0 0 5px;font-size:11px;
                                    text-transform:uppercase;letter-spacing:.5px;
                                    color:#8a7893;">
                                                            Your article
                                                        </p>

                                                        <p style="margin:0;font-family:Georgia,serif;
                                    font-size:18px;line-height:1.4;color:#4b3657;">
                                                            ${article.title}
                                                        </p>
                                                    </div>

                                                    <!-- Comment -->
                                                    <div style="padding:20px;background:#faf7fb;
                                border-left:3px solid #9b72b5;border-radius:10px;">

                                                        <p style="margin:0;font-family:Georgia,serif;
                                    font-size:16px;line-height:1.7;color:#4b3d50;">
                                                            “${comment}”
                                                        </p>

                                                        <p style="margin:12px 0 0;font-size:12px;color:#8a7d8f;">
                                                            — ${commenter.name}
                                                        </p>
                                                    </div>

                                                    <p style="margin:25px 0 0;font-size:14px;line-height:1.7;
                                color:#766a7d;">
                                                        Log in to your account to view the conversation
                                                        and respond.
                                                    </p>

                                                </td>
                                            </tr>

                                            <!-- Footer -->
                                            <tr>
                                                <td style="padding:22px 30px;text-align:center;
                            background:#faf7fb;border-top:1px solid #eee6f2;">

                                                    <p style="margin:0;font-family:Georgia,serif;color:#4b3657;">
                                                        Warmly,<br>
                                                            <strong>The Team</strong>
                                                    </p>

                                                    <p style="margin:12px 0 0;font-size:11px;color:#aaa1ad;">
                                                        This is an automated email.
                                                    </p>
                                                </td>
                                            </tr>

                                        </table>

                                    </td>
                                </tr>
                            </table>
                        </body>
                    </html>
                    `.trim()
});

