import path from "node:path";
import type { NextConfig } from "next";
const config: NextConfig={reactStrictMode:true,transpilePackages:["@bizoveya/agent-contract"],outputFileTracingRoot:path.resolve(process.cwd(),"../.."),poweredByHeader:false,async headers(){return [{source:"/(.*)",headers:[{key:"X-Content-Type-Options",value:"nosniff"},{key:"X-Frame-Options",value:"DENY"},{key:"Referrer-Policy",value:"no-referrer"},{key:"Cache-Control",value:"private, no-store"}]}];}};
export default config;
