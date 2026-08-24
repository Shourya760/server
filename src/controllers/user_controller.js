
export const create_user = () => {
    try {

    } catch (error) {
        return res.status(400).json({
            success: flase,
            message: "ERROR WHILE CREATING USER=> " + error
        })
    }
}