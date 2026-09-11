import User from "../Schema/userSchema.js";

class UserServices {
    async registerUser(data) {
        return await User.create(data);
    }
    async getUserByField(field, value) {
        return await User.findOne({
            [field]: value,
            isDeleted: false
        });
    }
    async updateUser(id, data) {
        return await User.findByIdAndUpdate(
            id,
            data,
            { new: true }
        );
    }
    async allUsersEmail() {
        return await User.find({ isDeleted: false }, "email");
    }
}

export default new UserServices();