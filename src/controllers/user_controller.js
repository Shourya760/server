
export const create_user = (req, res) => {
    try {
        const { name, email, password, phone, address } = req.body ;

        if (!name || !email || !password || !phone || !address) {
            return res.status(400).json({
                success: false,
                message: "ALL FIELDS REQUIRED"
            });
        }

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            data: { name, email, phone, address }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "ERROR WHILE CREATING USER=> " + error.message
        });
    }
};