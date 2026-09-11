export const welcomeEmail = (user, password) => {
    const userPassword =
        password ||
        (user?.password && !user.password.startsWith("$2")
            ? user.password
            : "");

    return {
        subject: "Welcome — Your Account Is Ready",

        text: `
Hello ${user.name},

Welcome! Your account has been successfully created.

Name: ${user.name}
Email: ${user.email}
Phone: ${user.phone || "N/A"}
${userPassword ? `Temporary Password: ${userPassword}` : ""}

Please change your temporary password after your first login.

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
                    style="max-width:560px;background:#fffdfb;border-radius:18px;
                    overflow:hidden;box-shadow:0 8px 30px rgba(80,50,100,.08);">

                    <!-- Header -->
                    <tr>
                        <td style="padding:38px 30px;text-align:center;
                            background:linear-gradient(135deg,#eee5f8,#d8c3ee);">

                            <div style="font-size:28px;">✦</div>

                            <h1 style="margin:10px 0 6px;font-family:Georgia,serif;
                                font-size:28px;color:#30253a;">
                                Welcome, ${user.name}
                            </h1>

                            <p style="margin:0;color:#62546d;font-size:14px;">
                                Your account is ready
                            </p>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding:35px 30px;">

                            <p style="font-size:16px;line-height:1.7;margin:0 0 24px;">
                                We're glad to have you here. Your account has been
                                created successfully.
                            </p>

                            <h2 style="font-family:Georgia,serif;font-size:19px;
                                margin:0 0 12px;color:#4b3657;">
                                Your details
                            </h2>

                            <table width="100%" cellpadding="0" cellspacing="0"
                                style="background:#f7f2fa;border-radius:12px;">
                                <tr>
                                    <td style="padding:12px 15px;color:#766a7d;">Name</td>
                                    <td align="right" style="padding:12px 15px;font-weight:bold;">
                                        ${user.name}
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:12px 15px;color:#766a7d;">Email</td>
                                    <td align="right" style="padding:12px 15px;font-weight:bold;">
                                        ${user.email}
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:12px 15px;color:#766a7d;">Phone</td>
                                    <td align="right" style="padding:12px 15px;font-weight:bold;">
                                        ${user.phone || "N/A"}
                                    </td>
                                </tr>
                            </table>

                            ${userPassword
                ? `
                                <div style="margin-top:22px;padding:18px;
                                    background:#f4edf9;border-radius:12px;">
                                    <p style="margin:0 0 8px;font-weight:bold;color:#4b3657;">
                                        Temporary password
                                    </p>
                                    <div style="padding:12px;background:#fff;border-radius:8px;
                                        text-align:center;font-family:monospace;font-size:16px;">
                                        ${userPassword}
                                    </div>
                                    <p style="margin:9px 0 0;font-size:12px;color:#766a7d;">
                                        Please change this after your first login.
                                    </p>
                                </div>
                                `
                : ""
            }

                            <p style="margin:28px 0 0;font-size:14px;
                                line-height:1.7;color:#6f6675;">
                                You can now log in using your email address and password.
                                Take a moment to explore and make this space your own.
                            </p>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding:22px 30px;text-align:center;
                            background:#faf7fb;border-top:1px solid #eee6f2;">

                            <p style="margin:0;font-family:Georgia,serif;
                                color:#4b3657;">
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
    };
};


export const updateEmail = (user) => ({
    subject: "Your Account Has Been Updated",

    text: `
Hello ${user.name},

Your account has been successfully updated.

If you made this change, no further action is required.
If you did not make this change, please contact our support team immediately.

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
                    style="max-width:560px;background:#fffdfb;border-radius:18px;
                    overflow:hidden;box-shadow:0 8px 30px rgba(80,50,100,.08);">

                    <!-- Header -->
                    <tr>
                        <td style="padding:38px 30px;text-align:center;
                            background:linear-gradient(135deg,#eee5f8,#d8c3ee);">

                            <div style="font-size:28px;">✓</div>

                            <h1 style="margin:10px 0 6px;font-family:Georgia,serif;
                                font-size:27px;color:#30253a;">
                                Account Updated
                            </h1>

                            <p style="margin:0;color:#62546d;font-size:14px;">
                                Your changes have been saved
                            </p>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding:35px 30px;">

                            <p style="font-size:16px;line-height:1.7;margin:0 0 22px;">
                                Hello <strong>${user.name}</strong>,
                            </p>

                            <p style="font-size:15px;line-height:1.7;
                                color:#625a68;margin:0 0 22px;">
                                Your account information has been successfully updated.
                                If you made this change, no further action is required.
                            </p>

                            <!-- Success -->
                            <div style="padding:16px 18px;background:#f4edf9;
                                border:1px solid #e5d8ef;border-radius:12px;">

                                <p style="margin:0;font-size:14px;line-height:1.6;
                                    color:#594265;">
                                    <strong>✓ Update successful</strong><br>
                                    Your account changes have been saved successfully.
                                </p>
                            </div>

                            <!-- Security -->
                            <div style="margin-top:25px;padding-top:20px;
                                border-top:1px solid #eee6f2;">

                                <p style="margin:0 0 7px;font-size:14px;
                                    font-weight:bold;color:#4b3657;">
                                    Didn't make this change?
                                </p>

                                <p style="margin:0;font-size:13px;line-height:1.6;
                                    color:#766a7d;">
                                    Please contact our support team immediately
                                    to help protect your account.
                                </p>
                            </div>

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




