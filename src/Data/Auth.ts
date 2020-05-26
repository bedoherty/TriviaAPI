import * as jwt from "express-jwt";
import * as jwksRsa from "jwks-rsa";

// Our Auth0 Configurations
const  authConfig = {
    domain: "bedoherty.auth0.com",
    audience: "https://triviasloots.com"
}

// Our middleware for validating bearer tokens
export const checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`
    }),
    audience: authConfig.audience,
    issuer: `https://${authConfig.domain}/`,
    algorithm: ["RS256"]
});