// utils/createAdmin.js
const User = require("../models/user");
const bcrypt = require("bcryptjs");

const createAdmin = async () => {
    const adminExists = await User.findOne({ email: "admin@example.com" });
    if (!adminExists) {
        const hashedPassword = await bcrypt.hash("Admin@123", 10);
        await new User({
            name: "Admin",
            email: "admin@example.com",
            password: hashedPassword,
            phone: "9999999999",
            address: "Admin HQ",
            userClass: "admin",
            role: "admin"
        }).save();
        console.log("✅ Default admin created.");
    }
};

module.exports = createAdmin;
