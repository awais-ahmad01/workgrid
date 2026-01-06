
import { query } from '../lib/db.js'
import { hashPassword, comparePassword } from "../utils/token.js";
import { signToken } from "../utils/jwt.js";
import { v4 as uuid } from "uuid";
import { sendInviteEmail, sendVerificationEmail } from "../utils/mailer.js";

export async function signupAdmin(req, res) {
  const { companyName, fullName, email, password } = req.body;

  console.log("data:", companyName, fullName, email, password)

  if (!companyName || !email || !password || !fullName) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const passwordHash = await hashPassword(password);

  try {
    // 1️⃣ Create user (NOT verified yet)
    const userRes = await query(
      `INSERT INTO users (email, full_name, password_hash, is_verified)
       VALUES ($1, $2, $3, false)
       RETURNING id`,
      [email, fullName, passwordHash]
    );

    const userId = userRes.rows[0].id;

    // 2️⃣ Create organization
    const orgRes = await query(
      `INSERT INTO organizations (name, created_by)
       VALUES ($1, $2)
       RETURNING id`,
      [companyName, userId]
    );

    const orgId = orgRes.rows[0].id;

    // 3️⃣ Create org membership
    await query(
      `INSERT INTO organization_members
       (organization_id, user_id, role, status)
       VALUES ($1, $2, 'SUPER_ADMIN', 'invited')`,
      [orgId, userId]
    );

    // 4️⃣ Create email verification token
    const verificationToken = uuid();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    await query(
      `INSERT INTO email_verification_tokens
       (user_id, token, expires_at)
       VALUES ($1, $2, $3)`,
      [userId, verificationToken, expiresAt]
    );

    // 5️⃣ Send verification email
    const verifyLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    await sendVerificationEmail(email, verifyLink);

    res.status(201).json({
      message: "Account created. Please verify your email to activate workspace.",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}





export async function verifyEmail(req, res) {
  const { token } = req.params;

  console.log("token:", token);

  try {
    const tokenRes = await query(
      `SELECT * FROM email_verification_tokens
       WHERE token = $1 AND expires_at > now()`,
      [token]
    );

    if (!tokenRes.rows.length) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const { user_id } = tokenRes.rows[0];

    // 1️⃣ Mark user verified
    await query(
      `UPDATE users
       SET is_verified = true
       WHERE id = $1`,
      [user_id]
    );

    // 2️⃣ Activate organization membership
    await query(
      `UPDATE organization_members
       SET status = 'active'
       WHERE user_id = $1`,
      [user_id]
    );

    // 3️⃣ Delete token
    await query(
      `DELETE FROM email_verification_tokens
       WHERE token = $1`,
      [token]
    );

    res.json({ message: "Email verified successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}





export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const userRes = await query(
      `SELECT u.id, u.password_hash, u.is_verified,
              om.organization_id, om.role
       FROM users u
       JOIN organization_members om ON om.user_id = u.id
       WHERE u.email = $1 AND om.status = 'active'`,
      [email]
    );

    if (!userRes.rows.length) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const user = userRes.rows[0];

    if (!user.is_verified) {
      return res.status(403).json({
        message: "Please verify your email before logging in",
      });
    }

    const isValid = await comparePassword(password, user.password_hash);

    if (!isValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = signToken({
      userId: user.id,
      orgId: user.organization_id,
      role: user.role,
    });

    return res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({
      message: "Internal server error during login",
    });
  }
}



export async function sendInvite(req, res) {
  try {
    const { email, role } = req.body;
    console.log("invite data:", email, role);
    const { orgId, role: requesterRole } = req.user;

    if (!email || !role) {
      return res.status(400).json({
        message: "Email and role are required",
      });
    }

    if (!["SUPER_ADMIN", "ADMIN"].includes(requesterRole)) {
      return res.status(403).json({
        message: "You are not authorized to send invites",
      });
    }

    // Check if email already exists in users table
    const existingUser = await query(
      `SELECT u.id, u.email, om.organization_id, om.status
       FROM users u
       LEFT JOIN organization_members om ON om.user_id = u.id
       WHERE u.email = $1`,
      [email]
    );

    if (existingUser.rows.length > 0) {
      const user = existingUser.rows[0];
      // Check if user is already in this organization
      if (user.organization_id === orgId) {
        return res.status(400).json({
          message: "This email is already a member of your organization",
        });
      }
      // User exists but in different organization
      return res.status(400).json({
        message: "This email is already registered with another organization",
      });
    }

    // Check if there's already a pending invite for this email in this organization
    const existingInvite = await query(
      `SELECT id, email, status, created_at
       FROM organization_invites
       WHERE organization_id = $1 AND email = $2 AND status = 'pending'`,
      [orgId, email]
    );

    if (existingInvite.rows.length > 0) {
      return res.status(400).json({
        message: "An invitation has already been sent to this email address",
      });
    }

    const token = uuid();

    await query(
      `INSERT INTO organization_invites
       (organization_id, email, role, token)
       VALUES ($1, $2, $3, $4)`,
      [orgId, email, role, token]
    );

    const orgRes = await query(
      `SELECT name FROM organizations WHERE id = $1`,
      [orgId]
    );

    const inviteLink = `${process.env.FRONTEND_URL}/join-workspace?token=${token}`;

    await sendInviteEmail(email, inviteLink, orgRes.rows[0].name);

    return res.status(200).json({
      message: "Invitation email sent successfully",
    });
  } catch (err) {
    console.error("SEND INVITE ERROR:", err);
    
    // Handle unique constraint violations (if any)
    if (err.code === '23505') { // PostgreSQL unique violation
      return res.status(400).json({
        message: "An invitation has already been sent to this email address",
      });
    }
    
    return res.status(500).json({
      message: "Failed to send invitation. Please try again later.",
    });
  }
}




export async function verifyInvite(req, res) {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({
        message: "Invite token is required",
      });
    }

    const inviteRes = await query(
      `SELECT oi.email, oi.role, o.name AS organization
       FROM organization_invites oi
       JOIN organizations o ON o.id = oi.organization_id
       WHERE oi.token = $1
       AND oi.status = 'pending'
       AND (oi.expires_at IS NULL OR oi.expires_at > now())`,
      [token]
    );

    if (!inviteRes.rows.length) {
      return res.status(400).json({
        message: "Invalid or expired invitation link",
      });
    }

    return res.status(200).json({
      message: "Invitation verified",
      data: inviteRes.rows[0],
    });
  } catch (err) {
    console.error("VERIFY INVITE ERROR:", err);
    return res.status(500).json({
      message: "Failed to verify invitation",
    });
  }
}



export async function signupViaInvite(req, res) {
  try {
    const { token, fullName, password } = req.body;

    if (!token || !fullName || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const inviteRes = await query(
      `SELECT * FROM organization_invites
       WHERE token = $1
       AND status = 'pending'
       AND (expires_at IS NULL OR expires_at > now())`,
      [token]
    );

    if (!inviteRes.rows.length) {
      return res.status(400).json({
        message: "Invalid or expired invitation",
      });
    }

    const invite = inviteRes.rows[0];

    const passwordHash = await hashPassword(password);

    const userRes = await query(
      `INSERT INTO users (email, full_name, password_hash, is_verified)
       VALUES ($1, $2, $3, true)
       RETURNING id`,
      [invite.email, fullName, passwordHash]
    );

    const userId = userRes.rows[0].id;

    await query(
      `INSERT INTO organization_members
       (organization_id, user_id, role, status)
       VALUES ($1, $2, $3, 'active')`,
      [invite.organization_id, userId, invite.role]
    );

    await query(
      `UPDATE organization_invites
       SET status = 'accepted'
       WHERE id = $1`,
      [invite.id]
    );

    const jwtToken = signToken({
      userId,
      orgId: invite.organization_id,
      role: invite.role,
    });

    return res.status(201).json({
      message: "Account created successfully",
      token: jwtToken,
    });
  } catch (err) {
    console.error("SIGNUP VIA INVITE ERROR:", err);
    return res.status(500).json({
      message: "Failed to complete signup",
    });
  }
}



// LOGOUT
