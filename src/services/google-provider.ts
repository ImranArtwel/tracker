import { GoogleAuthProvider } from "firebase/auth";

export const provider = new GoogleAuthProvider();

// signInWithPopup(auth, provider)
//   .then((result) => {
//     // This gives you a Google Access Token. You can use it to access Google APIs.
//     const credential = GoogleAuthProvider.credentialFromResult(result);
//     const token = credential?.accessToken;

//     // The signed-in user info.
//     const user = result.user;
//     console.log("User signed in:", user);
//     console.log("Access Token:", token);
//   })
//   .catch((error) => {
//     // Handle Errors here.
//     const errorCode = error.code;
//     const errorMessage = error.message;
//     // The email of the user's account used.
//     const email = error.customData?.email;
//     // The AuthCredential type that was used.
//     const credential = GoogleAuthProvider.credentialFromError(error);

//     console.error("Error signing in with Google:", {
//       errorCode,
//       errorMessage,
//       email,
//       credential,
//     });
//   });
