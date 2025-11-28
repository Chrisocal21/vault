// Debug endpoint to check environment variables (REMOVE IN PRODUCTION!)
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const debugInfo = {
    hasAdminUsername: !!process.env.ADMIN_USERNAME,
    hasAdminPassword: !!process.env.ADMIN_PASSWORD,
    usernameLength: process.env.ADMIN_USERNAME?.length || 0,
    passwordLength: process.env.ADMIN_PASSWORD?.length || 0,
    // Show first/last char only for security
    usernameHint: process.env.ADMIN_USERNAME ? 
      `${process.env.ADMIN_USERNAME[0]}...${process.env.ADMIN_USERNAME[process.env.ADMIN_USERNAME.length-1]}` : 
      'NOT SET',
    allEnvKeys: Object.keys(process.env).filter(k => k.includes('ADMIN') || k.includes('JWT'))
  };
  
  return res.status(200).json(debugInfo);
}
