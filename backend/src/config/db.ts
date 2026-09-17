import mongoose from "mongoose";


const connectDB = async () => {
    try{
        const mongoUrl = process.env.MONGO_URL;
        if (!mongoUrl) {
            throw new Error("MONGO_URL is not defined in the environment variables.");
        }
        await mongoose.connect(mongoUrl).then(() => {
            console.log("Connected to MongoDB");
        }).catch((error) => {
            console.error("Error connecting to MongoDB:", error);
            process.exit(1);
        })
    }catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}

export default connectDB;