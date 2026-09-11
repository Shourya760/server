import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                status: false,
                message: "Access Denied. No token provided."
            });
        }
        
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                status: false,
                message: "Access Denied. Malformed token."
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.curr_user = decoded;
        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            status: false,
            message: "Invalid or Expired Token"
        });
    }
};

