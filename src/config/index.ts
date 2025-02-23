// ADD NEW FILE: src/config/index.ts
const config: Record<string, { siteUrl: string; redirectUrls?: { emailVerification: string; successCheckout: string; } }> = {
    development: {
      siteUrl: 'http://localhost:3000',
      redirectUrls: {
        emailVerification: 'http://localhost:3000/auth/verify',
        successCheckout: 'http://localhost:3000/success',
        // Add other URLs here
      }
    },
    production: {
      siteUrl: 'https://babygpt.netlify.app',
      redirectUrls: {
        emailVerification: 'https://babygpt.netlify.app/verify',
        successCheckout: 'https://babygpt.netlify.app/success',
      }
    }
  }
  
  export default config[process.env.NODE_ENV || 'development'];