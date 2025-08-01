
import admin from "firebase-admin"
import { fileURLToPath } from "url"
import { dirname } from "path"
import fs from "fs"
// import second from '../Config/E-book Firebase Admin SDK (1).json'

const __filename = fileURLToPath(import.meta.url)
// const __dirname = dirname(__filename)

const serviceAccountPath = new URL(
  "../Config/E-book Firebase Admin SDK (1).json",
  import.meta.url,
)

let firebaseApp
try {
  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"))
  firebaseApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  })
} catch (error) {
  console.error("Error initializing Firebase Admin:", error)
  process.exit(1) // Exit with error code
}

export default firebaseApp



// import admin from 'firebase-admin';
// import serviceAccount from './E-book Firebase Admin SDK (1)';

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// export default admin;

// import admin from 'firebase-admin';
// import serviceAccount from './E-book Firebase Admin SDK (1).json' assert { type: 'json' };;

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// export default admin;








// import admin from 'firebase-admin';
// import path from 'path';  // For ES modules

// // import serviceAccount from 'path/to/serviceAccountKey.json';
// import serviceAccount from './serviceAccountKey.json'; // Adjust path as needed


// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// export default admin;


// import admin from "firebase-admin"
// import { fileURLToPath } from "url"
// import { dirname } from "path"
// import fs from "fs"

// const __filename = fileURLToPath(import.meta.url)
// const __dirname = dirname(__filename)

// const serviceAccountPath = new URL(
//   "../config/Frame Up Service Account.json",
//   import.meta.url,
// )

// let firebaseApp
// try {
//   const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"))
//   firebaseApp = admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//   })
// } catch (error) {
//   console.error("Error initializing Firebase Admin:", error)
//   process.exit(1) // Exit with error code
// }

// export default firebaseApp


