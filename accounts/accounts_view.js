import { signInWithPopup, GoogleAuthProvider, signOut } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import { DB_HOST } from "../scripts/utils.js";


async function createACC_LOGIN_DB(idToken, uid, email, name, isUser) {

    try {
        const api_call = await fetch(DB_HOST + "/users/create/", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${idToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ uid, email, name, isUser })
        });

        if (!api_call.ok) {
            const problem = await api_call.text();
            console.error("API Error:", problem);

            return {
                error: "Failed to Create Account to DB "
            };
        }
        const responseData = await api_call.json();
        console.log("API Response:", responseData);

        return responseData;
    } catch (error) {
        console.error("Error:", error);
        return {error: error.message};  
   
    }
}

export async function loginWithGoogle(auth) {

    const provider = new GoogleAuthProvider();

    try {

        const result = await signInWithPopup(auth, provider);
        const idToken = await result.user.getIdToken();

        /*
        const firebase_call = await fetch(DB_HOST + "/users/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: idToken })
        });
        */

        const user_data = result.user;

        const acc_call = await createACC_LOGIN_DB(idToken, user_data.uid, user_data.email, user_data.displayName, true);
        if (acc_call.error) {
            throw new Error(acc_call.error);
        }

        console.log("Account created");

        return user_data;
    } catch (error) {
        console.error("Login error:", error.message);
        if (error.message.includes("Failed to Create Account to DB")) {
            await signOut(auth);
        }
        return { "error": error.message };
    }
}