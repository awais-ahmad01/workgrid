
import { response } from "express";
import { auth } from "../lib/auth.js";
import { successResponse, errorResponse } from "../utils/responses.js";

// SIGNUP 
export async function signup(req, res) {
  try {
    const { name, email, password, role = "user", metadata = {} } = req.body;

   
    if (!name || !email || !password) {
      return errorResponse(res, 400, "VALIDATION_ERROR", "Name, email, and password are required");
    }

     console.log("📞 Calling auth.api.signUpEmail...");

    const user = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
        role,
        metadata: { ...metadata }, 
      },
    });


    console.log("📝 Signup result:", user);
    

    return successResponse(res, {
      message: "Signup successful! Please check your email to verify your account.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
      }
    }, 201);
  } catch (err) {
    console.error("Signup error:", err);
    
   
    if (err.message.includes("already exists")) {
      return errorResponse(res, 409, "CONFLICT", "Email already registered");
    }
    
    return errorResponse(res, 400, "SIGNUP_FAILED", err.message || "Signup failed");
  }
}

// LOGIN 
export async function login(req, res) {
  try {
    const { email, password } = req.body;
    

    if (!email || !password) {
      return errorResponse(res, 400, "VALIDATION_ERROR", "Email and password are required");
    }

    const result = await auth.api.signInEmail({
      body: { email, password }
    });

    console.log("📝 Login result:", JSON.stringify(result, null, 2));

    if (!result || !result.user) {
      return errorResponse(res, 401, "INVALID_CREDENTIALS", "Invalid email or password");
    }


    if (!result.user.emailVerified) {
      return errorResponse(res, 403, "EMAIL_NOT_VERIFIED", "Please verify your email before logging in");
    }

    const sessionToken = result.token || result.session?.token;
return successResponse(res, {
  token: sessionToken,
  user: {
    id: result.user.id,
    name: result.user.name,
    email: result.user.email,
    emailVerified: result.user.emailVerified,
    role: result.user.role,
  }
}, 200);
  } catch (err) {
    console.error("Login error:", err);
    return errorResponse(res, 401, "INVALID_CREDENTIALS", "Invalid email or password");
  }
}

// VERIFY EMAIL 
export async function verifyEmail(req, res) {
  try {
    console.log("📞 Calling auth.api.verifyEmail...");

    const { token } = req.query;



    if (!token) {
      return errorResponse(res, 400, "VALIDATION_ERROR", "Verification token is required");
    }

    await auth.api.verifyEmail({
      query: { token }
    });

    return successResponse(res, {
      message: "Email verified successfully. You can now log in."
    }, 200);
  } catch (err) {
    console.error("Email verification error:", err);
    
    if (err.message.includes("expired")) {
      return errorResponse(res, 400, "TOKEN_EXPIRED", "Verification token has expired");
    }
    
    return errorResponse(res, 400, "EMAIL_VERIFICATION_FAILED", err.message || "Email verification failed");
  }
}

// RESEND VERIFICATION EMAIL
export async function resendVerificationEmail(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return response(res, 400, "VALIDATION_ERROR", "Email is required");
    }

    await auth.api.sendVerificationEmail({
      body: { email }
    });

    return res.status(200).json({ 
      message: "Verification email sent. Please check your inbox." 
    });
  } catch (err) {
    console.error("Resend verification error:", err);
    return errorResponse(res, 400, "RESEND_VERIFICATION_FAILED", err.message || "Resend verification email failed");
  }
}

// LOGOUT
export async function logout(req, res) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return errorResponse(res, 400, "VALIDATION_ERROR", "No token provided");
    }

    await auth.api.signOut({
      headers: {
        authorization: `Bearer ${token}`
      }
    });

    return successResponse(res, { message: "Logout successful" }, 200);
  } catch (err) {
    console.error("Logout error:", err);
    return errorResponse(res, 500, "LOGOUT_FAILED", err.message || "Logout failed");
  }
}
