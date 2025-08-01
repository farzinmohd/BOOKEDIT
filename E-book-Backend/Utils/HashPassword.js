import bcrypt from "bcryptjs";


/*
hashing password from password
*/

const HashPassword = async (password) => {
    try {
      return await bcrypt.hash(password, 10);
    } catch (error) {
      console.log(error, "password hash error");
    }
  };
  
  export { HashPassword }