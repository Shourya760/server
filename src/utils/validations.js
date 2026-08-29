export const isValidIndianPhone = (phone) => {

    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
};