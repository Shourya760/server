import UserServices from "../Services/user.services.js";
import { encryptPassword, comparePassword } from "../utils/encryptions.js";
import { generatePassword, generateToken } from "../utils/generation.js";
import { isValidIndianPhone, isValidEmail } from "../utils/validations.js";
import { sendEmail } from "../utils/sendemail.js";
import { welcomeEmail, updateEmail } from "../emailformats/userEmails.js";
import { uploadToCloudinary } from "../utils/cloudinaryTask.js";


export const register_user = async (req, res) => {
    try {
        const { name, email, phone, gender, age } = req.body;

        // Basic validation
        if (
            !name?.trim() ||
            !email?.trim() ||
            !phone?.toString().trim() ||
            !gender?.toString().trim() ||
            age === undefined ||
            age === null ||
            age === ""
        ) {
            return res.status(400).json({
                success: false,
                message: "ALL FIELDS REQUIRED",
            });
        }

        // Normalize input
        const normalizedEmail = email.trim().toLowerCase();
        const normalizedPhone = phone.toString().trim();
        const normalizedGender = gender.toString().trim().toLowerCase();

        // Email validation
        if (!isValidEmail(normalizedEmail)) {
            return res.status(400).json({
                success: false,
                message: "INVALID EMAIL FORMAT",
            });
        }

        // Phone validation
        if (!isValidIndianPhone(normalizedPhone)) {
            return res.status(400).json({
                success: false,
                message: "PHONE NUMBER IS NOT VALID",
            });
        }

        // Gender validation
        const allowedGenders = ["male", "female", "other", "prefer_not"];

        if (!allowedGenders.includes(normalizedGender)) {
            return res.status(400).json({
                success: false,
                message: "GENDER MUST BE 'male', 'female', 'other', OR 'prefer_not'",
            });
        }

        // Age validation
        const numericAge = Number(age);

        if (
            !Number.isInteger(numericAge) ||
            numericAge < 1 ||
            numericAge > 120
        ) {
            return res.status(400).json({
                success: false,
                message: "AGE MUST BE A VALID NUMBER BETWEEN 1 AND 120",
            });
        }

        // Check existing email
        const existingEmail = await UserServices.getUserByField(
            "email",
            normalizedEmail
        );

        if (existingEmail) {
            return res.status(400).json({
                success: false,
                message: "EMAIL ALREADY EXISTS",
            });
        }

        // Profile image validation
        if (req.file) {
            const MAX_FILE_SIZE = 5 * 1024 * 1024;
            if (req.file.size > MAX_FILE_SIZE) {
                return res.status(400).json({
                    success: false,
                    message: "PROFILE IMAGE MUST BE LESS THAN 5 MB",
                });
            }
            const allowedMimeTypes = [
                "image/jpeg",
                "image/png",
                "image/jpg",
            ];
            if (!allowedMimeTypes.includes(req.file.mimetype)) {
                return res.status(400).json({
                    success: false,
                    message: "PROFILE IMAGE MUST BE JPEG OR PNG",
                });
            }
        }

        // Generate password
        const password = generatePassword();
        const encryptedPassword = await encryptPassword(password);

        // Upload profile image
        let profileUrl = null;

        if (req.file) {
            const uploadedFile = await uploadToCloudinary(req.file.buffer, "users");

            profileUrl =
                uploadedFile?.secure_url ||
                uploadedFile?.url ||
                null;

            if (!profileUrl) {
                return res.status(500).json({
                    success: false,
                    message: "PROFILE IMAGE UPLOAD FAILED",
                });
            }
        }

        // Create user
        const data = {
            name: name.trim(),
            email: normalizedEmail,
            phone: normalizedPhone,
            gender: normalizedGender,
            age: numericAge,
            password: encryptedPassword,
            profile: profileUrl,
        };

        const user = await UserServices.registerUser(data);

        if (!user) {
            return res.status(500).json({
                success: false,
                message: "USER REGISTRATION FAILED",
            });
        }

        // Send welcome email
        try {
            const emailInfo = welcomeEmail(user, password);

            await sendEmail({
                to: user.email,
                subject: emailInfo.subject,
                text: emailInfo.text,
                html: emailInfo.html,
            });
            console.log("Password sent to Email ✅")
        } catch (emailError) {

            // Registration should still succeed if email fails.

            console.error(
                "Welcome Email Error =>",
                emailError?.message || emailError
            );
        }


        // Success response
        console.log("User Registered ✅");

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                gender: user.gender,
                age: user.age,
                profile: user.profile,
                temporaryPassword: password,
            },
        });
    } catch (error) {
        console.error(
            "Register User Error =>",
            error?.message || error
        );

        return res.status(500).json({
            success: false,
            message: "ERROR WHILE CREATING USER",
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

        const normalizedEmail = email.trim().toLowerCase();

        // Email format check
        if (!isValidEmail(normalizedEmail)) {
            return res.status(400).json({
                success: false,
                message: "INVALID EMAIL FORMAT"
            });
        }

        // Email check
        const existing_email = await UserServices.getUserByField("email", normalizedEmail);
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

        const userData = {
            id: existing_email._id,
            name: existing_email.name,
            email: existing_email.email,
            phone: existing_email.phone,
            gender: existing_email.gender,
            profile: existing_email.profile,
        };

        return res.status(200).json({
            success: true,
            status: true,
            message: "LOGIN SUCCESSFUL",
            token: token,
            data: {
                token: token,
                user: userData,
            },
            user: userData,
        });

    } catch (error) {
        console.error("Login Error =>", error?.message || error);
        return res.status(500).json({
            success: false,
            message: "ERROR WHILE LOGGING IN"
        });
    }
};

export const get_user = async (req, res) => {
    try {
        const user_id = req.curr_user.id;

        console.log(user_id)

        // Get user
        const user = await UserServices.getUserById(user_id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "USER NOT FOUND"
            });
        }

        user.password = undefined;
        // user.id = undefined;

        return res.status(200).json({
            success: true,
            message: "USER FETCHED SUCCESSFULLY",
            data: user
        });

    } catch (error) {
        console.error("Get User Error =>", error?.message || error);
        return res.status(500).json({
            success: false,
            message: "ERROR WHILE GETTING USER"
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
            bio,
        } = req.body;

        // Check if user exists
        const user = await UserServices.getUserByField("_id", user_id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "USER NOT FOUND"
            });
        }

        const data = {};

        // Name check if provided
        if (name !== undefined) {
            const trimmedName = name.toString().trim();
            if (!trimmedName) {
                return res.status(400).json({
                    success: false,
                    message: "NAME CANNOT BE EMPTY"
                });
            }
            data.name = trimmedName;
        }

        // Phone check if provided
        if (phone !== undefined) {
            const normalizedPhone = phone.toString().trim();
            if (!isValidIndianPhone(normalizedPhone)) {
                return res.status(400).json({
                    success: false,
                    message: "PHONE NUMBER IS NOT VALID"
                });
            }
            data.phone = normalizedPhone;
        }

        // Gender check if provided
        if (gender !== undefined) {
            const normalizedGender = gender.toString().trim().toLowerCase();
            const allowedGenders = ["male", "female", "other"];
            if (!allowedGenders.includes(normalizedGender)) {
                return res.status(400).json({
                    success: false,
                    message: "GENDER MUST BE 'male', 'female' or 'other'"
                });
            }
            data.gender = normalizedGender;
        }

        // Age check if provided
        if (age !== undefined && age !== null && age !== "") {
            const numericAge = Number(age);
            if (!Number.isInteger(numericAge) || numericAge < 1 || numericAge > 120) {
                return res.status(400).json({
                    success: false,
                    message: "AGE MUST BE A VALID NUMBER BETWEEN 1 AND 120"
                });
            }
            data.age = numericAge;
        }

        // Bio check if provided
        if (bio !== undefined) {
            data.bio = bio.toString().trim();
        }

        // Profile image validation & upload
        if (req.file) {
            const MAX_FILE_SIZE = 5 * 1024 * 1024;

            if (req.file.size > MAX_FILE_SIZE) {
                return res.status(400).json({
                    success: false,
                    message: "PROFILE IMAGE MUST BE LESS THAN 5 MB",
                });
            }
            const allowedMimeTypes = [
                "image/jpeg",
                "image/png",
                "image/jpg",
                "image/webp",
            ];
            if (!allowedMimeTypes.includes(req.file.mimetype)) {
                return res.status(400).json({
                    success: false,
                    message: "PROFILE IMAGE MUST BE JPEG, PNG, OR WEBP",
                });
            }

            const uploadedFile = await uploadToCloudinary(req.file.buffer, "users");
            const profileUrl = uploadedFile?.secure_url || uploadedFile?.url;
            if (!profileUrl) {
                return res.status(500).json({
                    success: false,
                    message: "PROFILE IMAGE UPLOAD FAILED",
                });
            }
            data.profile = profileUrl;
        }

        // Update user
        const updated_user = await UserServices.updateUser(
            user_id,
            data
        );

        if (!updated_user) {
            return res.status(404).json({
                success: false,
                message: "USER NOT FOUND"
            });
        }

        // Remove password from response
        updated_user.password = undefined;

        try {
            const emailInfo = updateEmail(updated_user);
            sendEmail({
                to: updated_user.email,
                subject: emailInfo.subject,
                text: emailInfo.text,
                html: emailInfo.html,
            }).catch((error) => {
                console.error("Error in Email =>", error.message || error);
            });
        } catch (error) {
            console.error("Error generating update email =>", error.message || error);
        }

        console.log("User Updated Successfully ✅");

        return res.status(200).json({
            success: true,
            message: "User Updated successfully",
            data: updated_user
        });

    } catch (error) {
        console.error("Update User Error =>", error?.message || error);
        return res.status(500).json({
            success: false,
            message: "ERROR WHILE UPDATING USER"
        });
    }
};








