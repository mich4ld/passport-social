### Untested and not ready to use module - in early stage of development!

## Google strategy for Passport.js
Easy to use Google strategy. It's just **Sign In With Google** implementation (https://developers.google.com/identity/gsi/web/guides/verify-google-id-token).

### Options
- `clientID` (required) - required for idToken verification.

- `csrfCheck` (optional) - strategy will validate `g_csrf_token`. **False** by default.

### Important things
1. Use HTTPS
2. Never include your secrets directly in your code base - use environment variables instead.
