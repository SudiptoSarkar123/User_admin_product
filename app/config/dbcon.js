import mongoose from 'mongoose'

const dbcon = async ()=>{
    try {
        const dbconnection = await mongoose.connect(process.env.MONGO_URI)
        console.log("Database connected successfully ✔")
    } catch (error) {
        console.log("Failed to connected database ❎")
    }
}

export default dbcon 