
export const newArticleEmail = (article) => ({
    subject: `New Article Published: ${article.title}`,

    text: `
Hello,

A new article has been published:

${article.title}

${article.shortDescription || "Take a moment to read our latest story and share your thoughts."}

${article.url ? `Read the article: ${article.url}` : ""}

Warmly,
The Team
    `.trim(),

    html: `
<!DOCTYPE html>
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
                        style="max-width:560px;background:#fffdfb;border-radius:18px;overflow:hidden;box-shadow:0 8px 30px rgba(80,50,100,.08);">

                        <tr>
                            <td style="padding:32px 30px;text-align:center;background:linear-gradient(135deg,#eee5f8,#d8c3ee);">
                                <div style="font-size:28px;">✦</div>
                                <h1 style="margin:10px 0 6px;font-family:Georgia,serif;font-size:27px;color:#30253a;">
                                    New Article
                                </h1>
                                <p style="margin:0;color:#62546d;font-size:14px;">
                                    A new story is waiting for you
                                </p>
                            </td>
                        </tr>

                        ${article.banner
            ? `
                                <tr>
                                    <td style="padding:0;">
                                        <img src="${article.banner}"
                                            alt="${article.title}"
                                            width="560"
                                            style="display:block;width:100%;height:260px;object-fit:cover;border:0;">
                                    </td>
                                </tr>
                            `
            : `
                                <tr>
                                    <td style="padding:0;height:260px;background:linear-gradient(135deg,#d8c3ee,#f4d9e8 55%,#f8d8b8);">
                                        <div style="height:260px;display:flex;align-items:center;justify-content:center;text-align:center;background:radial-gradient(circle at 20% 20%,rgba(255,255,255,.55),transparent 35%),radial-gradient(circle at 80% 80%,rgba(124,77,158,.18),transparent 40%);">
                                            <div style="padding:20px;color:#403047;">
                                                <div style="font-size:42px;line-height:1;margin-bottom:12px;">✦</div>
                                                <div style="font-family:Georgia,serif;font-size:24px;font-weight:bold;">A New Story Awaits</div>
                                                <div style="margin-top:8px;font-size:13px;color:#62546d;">Fresh ideas, thoughtfully shared</div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            `
        }

                        <tr>
                            <td style="padding:35px 30px;">
                                <p style="margin:0 0 18px;font-size:14px;color:#766a7d;">
                                    Hello,
                                </p>

                                <h2 style="margin:0 0 14px;font-family:Georgia,serif;font-size:25px;line-height:1.4;color:#403047;">
                                    ${article.title}
                                </h2>

                                ${article.shortDescription
            ? `
                                        <p style="margin:0;font-size:15px;line-height:1.8;color:#6b6170;">
                                            ${article.shortDescription}
                                        </p>
                                    `
            : `
                                        <p style="margin:0;font-size:15px;line-height:1.8;color:#6b6170;">
                                            Take a moment to read our latest story and share your thoughts.
                                        </p>
                                    `
        }
                            </td>
                        </tr>

                        ${article.url
            ? `
                                <tr>
                                    <td style="padding:0 30px 35px;">
                                        <a href="${article.url}"
                                            style="display:inline-block;padding:12px 22px;background:#7c4d9e;color:#fff;text-decoration:none;border-radius:999px;font-size:14px;font-weight:bold;">
                                            Read Article →
                                        </a>
                                    </td>
                                </tr>
                            `
            : ""
        }

                        <tr>
                            <td style="padding:22px 30px;text-align:center;background:#faf7fb;border-top:1px solid #eee6f2;">
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



