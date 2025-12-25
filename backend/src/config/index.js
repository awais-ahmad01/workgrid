import dotenv from "dotenv";
dotenv.config();

const required = ["SUPABASE_CONNECTION_STRING", "BETTER_AUTH_SECRET","BETTER_AUTH_URL", "PORT","SUPABASE_URL","SUPABASE_SERVICE_ROLE_KEY"];

required.forEach((key) => {
  if (!process.env[key]) {
    console.error(`❌ Missing environment variable: ${key}`);
    process.exit(1);
  }
});

export const PORT = process.env.PORT;
export const SUPABASE_CONNECTION_STRING = process.env.SUPABASE_CONNECTION_STRING;
export const BETTER_AUTH_SECRET = process.env.BETTER_AUTH_SECRET;
export const BETTER_AUTH_URL = process.env.BETTER_AUTH_URL;
export const NODE_ENV = process.env.NODE_ENV || "development";
export const SUPABASE_URL = process.env.SUPABASE_URL;
export const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Log to verify (remove in production)
console.log('🔧 Config loaded:');
console.log('  PORT:', PORT);
console.log('  BETTER_AUTH_URL:', BETTER_AUTH_URL);
console.log('  EMAIL_FROM:', process.env.EMAIL_FROM);
console.log('  EMAIL_PASS:', process.env.EMAIL_PASS ? '***' : 'NOT SET');
console.log('');
