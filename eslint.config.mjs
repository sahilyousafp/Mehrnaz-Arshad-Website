import nextConfig from "eslint-config-next";

const config = [...nextConfig, { ignores: ["public/**"] }];

export default config;
