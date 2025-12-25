
import { resolveRole } from "../services/roleResolver.js";
import { errorResponse } from "../utils/responses.js";
import { auth } from "../lib/auth.js";

export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return errorResponse(res, 401, "UNAUTHORIZED", "Authentication required");
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return errorResponse(res, 401, "UNAUTHORIZED", "Authentication token missing");
    }

    console.log("🔐 Verifying token:", token);

    // METHOD 1: Try getSession (for session tokens)
    let session = null;
    
    try {
      session = await auth.api.getSession({
        headers: {
          authorization: `Bearer ${token}`,
          cookie: `better-auth.session_token=${token}` // Try as cookie too
        }
      });
    } catch (err) {
      console.log("⚠️ getSession failed, trying listSessions:", err.message);
    }

    console.log("🔐 Initial session data:", session ? "Found" : "Not found");

    // METHOD 2: If getSession fails, try fetching session from database directly
    if (!session || !session.user) {
      try {
        const sessionData = await auth.options.database.query(
          'SELECT * FROM session WHERE token = $1 AND "expiresAt" > NOW()',
          [token]
        );

        console.log("🔐 Database session query result rows:", sessionData);

        if (sessionData.rows.length > 0) {
          const sessionRow = sessionData.rows[0];
          
          // Fetch user data
          const userData = await auth.options.database.query(
            'SELECT * FROM "user" WHERE id = $1',
            [sessionRow.userId]
          );

          if (userData.rows.length > 0) {
            const user = userData.rows[0];
            session = {
              user: {
                id: user.id,
                name: user.name,
                email: user.email,
                emailVerified: user.emailVerified,
                role: user.role,
                metadata: user.metadata
              },
              session: sessionRow
            };
          }
        }
      } catch (dbErr) {
        console.error("❌ Database query failed:", dbErr);
      }
    }

    console.log("🔐 Session data:", session ? "Found" : "Not found");

    if (!session || !session.user) {
      return errorResponse(res, 401, "UNAUTHORIZED", "Invalid or expired session");
    }

   
    const role = resolveRole(session.user);
    session.user.role = role;

    console.log("✅ Authenticated user:", session.user.email, "Role:", session.user.role);

    req.user = {
      ...session.user,
      name: session.user.name || session.user.metadata?.name || "",
    };
    req.session = session.session;

    next();
  } catch (error) {
    console.error("❌ Auth middleware error:", error);
    return errorResponse(res, 500, "SERVER_ERROR", "Authentication failed");
  }
}

