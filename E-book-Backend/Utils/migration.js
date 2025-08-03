import mongoose from "mongoose";
import User from "../Models/userModel.js";
import connectDB from "../Config/dbConnection.js";

const migrateProfilePhotoUrl = async () => {
  try {
    await connectDB();
    
    // Update all users who don't have profilePhotoUrl field
    const result = await User.updateMany(
      { profilePhotoUrl: { $exists: false } },
      { $set: { profilePhotoUrl: '' } }
    );
    
    console.log(`Migration completed. Updated ${result.modifiedCount} users.`);
    
    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed.');
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

// Run migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateProfilePhotoUrl();
}

export default migrateProfilePhotoUrl; 