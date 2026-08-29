import nodemailer from "nodemailer";

const createTransporter = () => {
    return nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        },
    });
};

export const sendEmail = async ({ to, subject, text, html }) => {
    if (!process.env.EMAIL || !process.env.PASSWORD) {
        throw new Error("Email service is not configured. Set EMAIL and PASSWORD in .env.");
    }
    if (!to || !subject) {
        throw new Error("Email recipient and subject are required.");
    }

    const transporter = createTransporter();

    return transporter.sendMail({
        from: process.env.EMAIL_FROM || process.env.EMAIL,
        to,
        subject,
        text,
        html,
    });
};

export default sendEmail;







