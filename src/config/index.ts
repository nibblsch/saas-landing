// ADD NEW FILE: src/config/index.ts
const config = {
    development: {
      siteUrl: 'http://localhost:3000',
      redirectUrls: {
        emailVerification: 'http://localhost:3000/auth/verify',
        successCheckout: 'http://localhost:3000/success',
        // Add other URLs here
      }
    },
    production: {
      siteUrl: 'https://yourdomain.com',
      redirectUrls: {
        emailVerification: 'https://yourdomain.com/auth/verify',
        successCheckout: 'https://yourdomain.com/success',
      }
    }
  }
  
  export default config[process.env.NODE_ENV || 'development']