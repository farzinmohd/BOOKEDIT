import crypto from "crypto";


const generateReferralCode = (user) => {
    return (
      user.toUpperCase().substring(0, 5) +
      crypto.randomInt(10000, 99999).toString()
    );
  };

  export { generateReferralCode }