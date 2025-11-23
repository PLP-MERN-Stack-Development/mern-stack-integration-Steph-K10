require('dotenv').config();

console.log('=== ENVIRONMENT CHECK ===');
console.log('Working directory:', process.cwd());
console.log('RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);
console.log('RESEND_API_KEY length:', process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.length : 0);
console.log('First few chars:', process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.substring(0, 5) + '...' : 'N/A');
console.log('All env vars starting with RESEND:');
Object.keys(process.env).forEach(key => {
  if (key.includes('RESEND')) {
    console.log(`  ${key}: ${process.env[key] ? '***' + process.env[key].slice(-4) : 'NOT SET'}`);
  }
});