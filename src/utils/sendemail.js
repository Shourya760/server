import nodemailer from "nodemailer";

let transporter = null;

const getTransporter = () => {
    if (!transporter) {
        if (!process.env.EMAIL || !process.env.PASSWORD) {
            throw new Error("Email service is not configured. Set EMAIL and PASSWORD in .env.");
        }
        transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        });
    }
    return transporter;
};

export const sendEmail = async ({ to, subject, text, html }) => {
    if (!to || !subject) {
        throw new Error("Email recipient and subject are required.");
    }

    const emailTransporter = getTransporter();

    return emailTransporter.sendMail({
        from: process.env.EMAIL_FROM || process.env.EMAIL,
        to,
        subject,
        text,
        html,
    });
};

export default sendEmail;







