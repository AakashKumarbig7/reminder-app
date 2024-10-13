/** @type {import('next').NextConfig} */
const nextConfig = {
    images:
    {
        remotePatterns:[
            {
                protocol:"https",
                hostname:"localhost",
                pathname:"/images/**"
            }
        ]
    }
};

export default nextConfig;
