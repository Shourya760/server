export const commentEmail = (article, commenter, comment) => {
    return {
        subject: `${commenter.name} commented on your article`,

        text: `
                Hello ${article.createdBy.name},

                ${commenter.name} commented on your article "${article.title}".

                Comment:
                "${comment}"

                Log in to your account to view the comment and respond.

                Best regards,
                The Team
                        `.trim(),

        html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>New Comment</title>
                </head>

                <body style="
                    margin: 0;
                    padding: 0;
                    background: #f4f6f8;
                    font-family: Arial, Helvetica, sans-serif;
                ">

    <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
            <td align="center" style="padding: 40px 15px;">

                <!-- Main Container -->
                <table
                    width="100%"
                    cellpadding="0"
                    cellspacing="0"
                    border="0"
                    style="
                        max-width: 550px;
                        background: #fff;
                        border: 1px solid #e5e7eb;
                        border-radius: 12px;
                    "
                >

                    <!-- Header -->
                    <tr>
                        <td style="
                            padding: 35px 30px;
                            text-align: center;
                            background: #111827;
                        ">

                            <div style="
                                width: 50px;
                                height: 50px;
                                line-height: 50px;
                                margin: auto;
                                border-radius: 50%;
                                background: #fff;
                                font-size: 24px;
                            ">
                                💬
                            </div>

                            <h1 style="
                                margin: 15px 0 0;
                                color: #fff;
                                font-size: 25px;
                            ">
                                New Comment
                            </h1>

                            <p style="
                                margin: 8px 0 0;
                                color: #d1d5db;
                                font-size: 14px;
                            ">
                                Someone commented on your article
                            </p>

                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 32px 30px;">

                            <p style="
                                margin: 0 0 12px;
                                font-size: 16px;
                                color: #111827;
                            ">
                                Hello <strong>${article.createdBy.name}</strong>,
                            </p>

                            <p style="
                                margin: 0 0 25px;
                                font-size: 15px;
                                line-height: 1.7;
                                color: #4b5563;
                            ">
                                <strong>${commenter.name}</strong> has commented
                                on your article.
                            </p>

                            <!-- Article -->
                            <p style="
                                margin: 0 0 10px;
                                font-size: 13px;
                                font-weight: 600;
                            ">
                                Article
                            </p>

                            <div style="
                                padding: 15px;
                                background: #f9fafb;
                                border: 1px solid #e5e7eb;
                                border-radius: 8px;
                            ">
                                <p style="
                                    margin: 0;
                                    font-size: 16px;
                                    font-weight: 600;
                                    color: #111827;
                                ">
                                    ${article.title}
                                </p>
                            </div>

                            <!-- Comment -->
                            <p style="
                                margin: 25px 0 10px;
                                font-size: 13px;
                                font-weight: 600;
                            ">
                                Comment
                            </p>

                            <div style="
                                padding: 18px;
                                background: #f8fafc;
                                border-left: 4px solid #111827;
                                border-radius: 6px;
                            ">
                                <p style="
                                    margin: 0;
                                    font-size: 15px;
                                    line-height: 1.6;
                                    color: #374151;
                                ">
                                    "${comment}"
                                </p>
                            </div>

                            <!-- Action -->
                            <div style="
                                margin-top: 28px;
                                padding-top: 22px;
                                border-top: 1px solid #e5e7eb;
                            ">

                                <p style="
                                    margin: 0;
                                    font-size: 13px;
                                    line-height: 1.6;
                                    color: #6b7280;
                                ">
                                    Log in to your account to view the comment
                                    and reply to ${commenter.name}.
                                </p>

                            </div>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="
                            padding: 22px 30px;
                            text-align: center;
                            background: #f9fafb;
                            border-top: 1px solid #e5e7eb;
                        ">

                            <p style="
                                margin: 0;
                                color: #374151;
                            ">
                                Best regards,
                            </p>

                            <p style="
                                margin: 5px 0 0;
                                font-weight: 600;
                            ">
                                The Team
                            </p>

                            <p style="
                                margin: 15px 0 0;
                                font-size: 11px;
                                color: #9ca3af;
                            ">
                                This is an automated email. Please do not reply.
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
    };
};