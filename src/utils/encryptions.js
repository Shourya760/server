import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export const encryptPassword = async (password) => {
    try {
        return await bcrypt.hash(password, SALT_ROUNDS);
    } catch (error) {
        throw new Error("Error while encrypting password: " + error.message);
    }
};

export const comparePassword = async (password, hashedPassword) => {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
        throw new Error("Error while comparing password: " + error.message);
    }
};