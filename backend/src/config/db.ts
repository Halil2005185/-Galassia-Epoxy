import mongoose from "mongoose";

// Defense-in-depth against NoSQL operator injection: strips any top-level
// `$`-prefixed keys from query filters built from user input (Joi already
// rejects non-string/object-shaped values before they reach a query, but
// this is a second layer that costs nothing).
mongoose.set("sanitizeFilter", true);

const connectDB = async () => {
    try {
        const mongoUrl = process.env.MONGO_URL;
        if (!mongoUrl) {
            throw new Error("MONGO_URL is not defined in the environment variables.");
        }
        await mongoose.connect(mongoUrl);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}

export default connectDB;