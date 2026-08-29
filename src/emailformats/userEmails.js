
export const welcomeEmail = (user, password) => {
    const passwordText = password
        ? `

Your Password: ${password}

Use this password to log in. For your security, please change it after your first login.
`
        : "";

    const passwordHtml = password
        ? `
            <!-- Password -->
            <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="
                    margin-top: 24px;
                    background-color: #f8fafc;
                    border: 1px solid #e5e7eb;
                    border-radius: 8px;
                "
            >
                <tr>
                    <td style="padding: 18px;">

                        <p style="
                            margin: 0 0 8px;
                            font-size: 13px;
                            font-weight: 600;
                            color: #111827;
                        ">
                            Temporary Password
                        </p>

                        <div style="
                            padding: 12px;
                            background-color: #ffffff;
                            border: 1px solid #d1d5db;
                            border-radius: 6px;
                            font-family: monospace;
                            font-size: 16px;
                            font-weight: 600;
                            color: #111827;
                            text-align: center;
                        ">
                            ${password}
                        </div>

                        <p style="
                            margin: 10px 0 0;
                            font-size: 12px;
                            line-height: 1.5;
                            color: #6b7280;
                        ">
                            Use this password to log in to your account.
                            Please change it after your first login.
                        </p>

                    </td>
                </tr>
            </table>
        `
        : "";

    return {
        subject: "Welcome! Your Account Has Been Created",

        text: `
Hello ${user.name},

Welcome to our platform!

Your account has been successfully created.

Account Details
Name: ${user.name}
Email: ${user.email}
Phone: ${user.phone}
${passwordText}

You can now log in using your email address and password.

For your security, please change your temporary password after your first login.

Best regards,
The Team
        `.trim(),

        html: `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome</title>
</head>

<body style="
    margin: 0;
    padding: 0;
    background-color: #f4f6f8;
    font-family: Arial, Helvetica, sans-serif;
">

<table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
        <td align="center" style="padding: 40px 15px;">

            <!-- Main Card -->
            <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="
                    max-width: 550px;
                    background-color: #ffffff;
                    border-radius: 12px;
                    overflow: hidden;
                    border: 1px solid #e5e7eb;
                "
            >

                <!-- Header -->
                <tr>
                    <td style="
                        padding: 35px 30px;
                        text-align: center;
                        background-color: #111827;
                    ">

                        <div style="
                            width: 50px;
                            height: 50px;
                            line-height: 50px;
                            margin: 0 auto 15px;
                            border-radius: 50%;
                            background-color: #ffffff;
                            font-size: 24px;
                        ">
                            ✓
                        </div>

                        <h1 style="
                            margin: 0;
                            color: #ffffff;
                            font-size: 25px;
                            font-weight: 600;
                        ">
                            Welcome!
                        </h1>

                        <p style="
                            margin: 8px 0 0;
                            color: #d1d5db;
                            font-size: 14px;
                        ">
                            Your account is ready to use
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
                            Hello <strong>${user.name}</strong>,
                        </p>

                        <p style="
                            margin: 0 0 25px;
                            font-size: 15px;
                            line-height: 1.7;
                            color: #4b5563;
                        ">
                            Thank you for registering with us.
                            Your account has been successfully created.
                        </p>

                        <!-- Account Details -->
                        <p style="
                            margin: 0 0 10px;
                            font-size: 13px;
                            font-weight: 600;
                            color: #111827;
                        ">
                            Account Details
                        </p>

                        <table
                            width="100%"
                            cellpadding="0"
                            cellspacing="0"
                            border="0"
                            style="
                                background-color: #f9fafb;
                                border: 1px solid #e5e7eb;
                                border-radius: 8px;
                            "
                        >

                            <tr>
                                <td style="
                                    padding: 12px;
                                    font-size: 13px;
                                    color: #6b7280;
                                ">
                                    Name
                                </td>

                                <td style="
                                    padding: 12px;
                                    text-align: right;
                                    font-size: 13px;
                                    font-weight: 600;
                                    color: #111827;
                                ">
                                    ${user.name}
                                </td>
                            </tr>

                            <tr>
                                <td style="
                                    padding: 12px;
                                    font-size: 13px;
                                    color: #6b7280;
                                ">
                                    Email
                                </td>

                                <td style="
                                    padding: 12px;
                                    text-align: right;
                                    font-size: 13px;
                                    font-weight: 600;
                                    color: #111827;
                                ">
                                    ${user.email}
                                </td>
                            </tr>

                            <tr>
                                <td style="
                                    padding: 12px;
                                    font-size: 13px;
                                    color: #6b7280;
                                ">
                                    Phone
                                </td>

                                <td style="
                                    padding: 12px;
                                    text-align: right;
                                    font-size: 13px;
                                    font-weight: 600;
                                    color: #111827;
                                ">
                                    ${user.phone}
                                </td>
                            </tr>

                        </table>

                        ${passwordHtml}

                        <!-- Next Steps -->
                        <div style="
                            margin-top: 28px;
                            padding-top: 22px;
                            border-top: 1px solid #e5e7eb;
                        ">

                            <p style="
                                margin: 0 0 8px;
                                font-size: 14px;
                                font-weight: 600;
                                color: #111827;
                            ">
                                What's next?
                            </p>

                            <p style="
                                margin: 0;
                                font-size: 13px;
                                line-height: 1.6;
                                color: #6b7280;
                            ">
                                Log in using your email address and password.
                                Once you're logged in, you can update your
                                password from your account settings.
                            </p>

                        </div>

                    </td>
                </tr>

                <!-- Footer -->
                <tr>
                    <td style="
                        padding: 22px 30px;
                        text-align: center;
                        background-color: #f9fafb;
                        border-top: 1px solid #e5e7eb;
                    ">

                        <p style="
                            margin: 0;
                            font-size: 13px;
                            color: #374151;
                        ">
                            Best regards,
                        </p>

                        <p style="
                            margin: 5px 0 0;
                            font-size: 14px;
                            font-weight: 600;
                            color: #111827;
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





export const updateEmail = (user) => {
    return {
        subject: "Your Account Has Been Updated",

        text: `
            Hello ${user.name},

            Your account has been successfully updated.

            If you made this change, no further action is required.

            If you did not make this change, please contact our support team immediately.

            Best regards,
            The Team
                    `.trim(),

        html: `
            <!DOCTYPE html>
            <html lang="en">

            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">

                <title>Account Updated</title>
            </head>

            <body style="
                    margin: 0;
                    padding: 0;
                    background-color: #f4f6f8;
                    font-family: Arial, Helvetica, sans-serif;
                ">

                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                            <td align="center" style="padding: 40px 15px;">

                <!-- Main Card -->
                <table
                    width="100%"
                    cellpadding="0"
                    cellspacing="0"
                    border="0"
                    style="
                        max-width: 550px;
                        background-color: #ffffff;
                        border-radius: 12px;
                        overflow: hidden;
                        box-shadow: 0 4px 15px rgba(0,0,0,0.06);
                    "
                >

                    <!-- Header -->
                    <tr>
                        <td style="
                            padding: 30px;
                            text-align: center;
                            background-color: #111827;
                        ">

                            <div style="
                                width: 50px;
                                height: 50px;
                                line-height: 50px;
                                margin: 0 auto 15px;
                                border-radius: 50%;
                                background-color: #ffffff;
                                font-size: 24px;
                            ">
                                ✓
                            </div>

                            <h1 style="
                                margin: 0;
                                color: #ffffff;
                                font-size: 24px;
                                font-weight: 600;
                            ">
                                Account Updated
                            </h1>

                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 35px 35px 25px;">

                            <p style="
                                margin: 0 0 15px;
                                font-size: 16px;
                                color: #111827;
                            ">
                                Hello <strong>${user.name}</strong>,
                            </p>

                            <p style="
                                margin: 0 0 25px;
                                font-size: 15px;
                                line-height: 1.7;
                                color: #4b5563;
                            ">
                                Your account information has been successfully
                                updated.
                            </p>

                            <!-- Success Box -->
                            <table
                                width="100%"
                                cellpadding="0"
                                cellspacing="0"
                                border="0"
                                style="
                                    background-color: #f0fdf4;
                                    border: 1px solid #bbf7d0;
                                    border-radius: 8px;
                                "
                            >
                                <tr>
                                    <td style="padding: 18px;">

                                        <p style="
                                            margin: 0;
                                            font-size: 14px;
                                            line-height: 1.6;
                                            color: #166534;
                                        ">
                                            <strong>✓ Update successful</strong>
                                            <br>
                                            Your account changes have been saved
                                            successfully.
                                        </p>

                                    </td>
                                </tr>
                            </table>

                            <!-- Security Notice -->
                            <div style="
                                margin-top: 25px;
                                padding-top: 20px;
                                border-top: 1px solid #e5e7eb;
                            ">

                                <p style="
                                    margin: 0 0 8px;
                                    font-size: 14px;
                                    font-weight: 600;
                                    color: #111827;
                                ">
                                    Didn't make this change?
                                </p>

                                <p style="
                                    margin: 0;
                                    font-size: 13px;
                                    line-height: 1.6;
                                    color: #6b7280;
                                ">
                                    If you did not update your account, please
                                    contact our support team immediately to
                                    protect your account.
                                </p>

                            </div>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="
                            padding: 20px 35px;
                            background-color: #f9fafb;
                            border-top: 1px solid #e5e7eb;
                            text-align: center;
                        ">

                            <p style="
                                margin: 0 0 6px;
                                font-size: 13px;
                                color: #374151;
                            ">
                                Best regards,
                            </p>

                            <p style="
                                margin: 0;
                                font-size: 14px;
                                font-weight: 600;
                                color: #111827;
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


