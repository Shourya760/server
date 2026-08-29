import UserServices from "../Services/user.services.js";
import { encryptPassword, comparePassword } from "../utils/encryptions.js";
import { generatePassword, generateToken } from "../utils/generation.js";
import { isValidIndianPhone } from "../utils/validations.js";
import { sendEmail } from "../utils/sendemail.js";
import { welcomeEmail, updateEmail } from "../emailformats/userEmails.js";
import { uploadToCloudinary } from "../utils/cloudinaryTask.js";

export const register_user = async (req, res) => {
    try {
        const { name, email, phone, gender, age, dob } = req.body;

        // All fields required
        if (!name || !email || !phone || !gender || !age || !dob) {
            return res.status(400).json({
                success: false,
                message: "ALL FIELDS REQUIRED"
            });
        }

        // Email check
        const existing_email = await UserServices.getUserByField("email", email)
        if (existing_email) {
            return res.status(400).json({
                success: false,
                message: "EMAIL ALREADY EXISTS"
            });
        };

        // Phone check
        const phone_check = isValidIndianPhone(phone);
        if (!phone_check) {
            return res.status(400).json({
                success: false,
                message: "PHONE NUMBER IS NOT VALID"
            });
        };

        // Random password generation and encryption
        const password = generatePassword();
        const encrypted_password = await encryptPassword(password);

        // upload profile picture if provided
        let profile_url = "";
        if (req.file) {
            const uploadedFile = await uploadToCloudinary(req.file.buffer);
            profile_url = uploadedFile.secure_url || uploadedFile.url;
        }

        const data = {
            name,
            email,
            phone,
            gender,
            age,
            dob,
            password: encrypted_password,
            profile: profile_url
        };

        // Email Services
        const user = await UserServices.registerUser(data);

        if (user) {
            try {
                const email_info = welcomeEmail(user, password);
                await sendEmail({
                    to: user.email,
                    subject: email_info.subject,
                    text: email_info.text,
                    html: email_info.html,
                });
            } catch (error) {
                console.error("Error in Email =>", error.message || error);
            }

            return res.status(201).json({
                success: true,
                message: "User registered successfully",
                data: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                },
            });
        }


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "ERROR WHILE CREATING USER => " + error
        });
    }
};

export const login_user = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "ALL FIELD REQUIRED"
            });
        }

        // Email check
        const existing_email = await UserServices.getUserByField("email", email);
        if (!existing_email) {
            return res.status(400).json({
                success: false,
                message: "INCORRECT EMAIL"
            });
        }

        // Password check
        const password_check = await comparePassword(password, existing_email.password);
        if (!password_check) {
            return res.status(400).json({
                success: false,
                message: "INCORRECT PASSWORD",

            });
        }

        // Generate Token
        const token = generateToken({
            id: existing_email._id,
            email: existing_email.email,
            name: existing_email.name
        });

        return res.status(200).json({
            success: true,
            message: "LOGIN SUCCESSGULL",
            token: token,
            data: "Welcome " + existing_email.name
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "ERROR WHILE LOG IN  => " + error
        })
    }
};

export const get_user = async (req, res) => {
    try {
        const user_id = req.curr_user.id;

        console.log(user_id)

        // Get user
        const user = await UserServices.getUserByField("_id", user_id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "USER NOT FOUND"
            });
        }

        user.password = undefined;

        return res.status(200).json({
            success: true,
            message: "USER FETCHED SUCCESSFULLY",
            data: user
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "ERROR WHILE GETTING USER => " + error.message
        });
    }
};

export const update_user = async (req, res) => {
    try {
        const user_id = req.curr_user.id;
        const {
            name,
            phone,
            gender,
            age,
            dob,
        } = req.body;

        // Check if user exists
        const user = await UserServices.getUserByField("_id", user_id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "USER NOT FOUND"
            });
        }

        // upload profile picture if provided
        let profile_url = "";
        if (req.file) {
            const uploadedFile = await uploadToCloudinary(req.file.buffer);
            profile_url = uploadedFile.secure_url || uploadedFile.url;
        }

        // Data to update
        const data = {
            name,
            phone,
            gender,
            age,
            dob,
            profile: profile_url
        };

        // Remove undefined fields
        Object.keys(data).forEach((key) => {
            if (data[key] === undefined) {
                delete data[key];
            }
        });

        // Update user
        const updated_user = await UserServices.updateUser(
            user_id,
            data
        );

        // Remove password from response
        updated_user.password = undefined;

        if (user) {
            try {
                const emailInfo = updateEmail(updated_user);

                await sendEmail({
                    to: updated_user.email,
                    subject: emailInfo.subject,
                    text: emailInfo.text,
                    html: emailInfo.html,
                });
            } catch (error) {
                console.error("Error in Email =>", error.message || error);
            }

            return res.status(201).json({
                success: true,
                message: "User registered successfully",
                data: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                },
            });
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "ERROR WHILE UPDATING USER => " + error
        });
    }
};







