### Untested and not ready to use module - in early stage of development!

## Facebook strategy for Passport.js
Simple to use Facebook strategy. Made with backend APIs in mind.

### Options
- `appSecret` (optional) - if provided, strategy will send request with `appsecret_proof` parameter. Enable `Require App Secret` in `Advanced Settings` if you want restrict your Graph API calls (more info: https://developers.facebook.com/docs/graph-api/securing-requests%20/). </br>

![image](https://user-images.githubusercontent.com/43048524/170886074-c8001fe9-974c-4abf-9d51-83a5f5e5aea6.png)


- `apiVersion` (default: `v14.0`) - you can provide specific Graph API version. Strategy is tested by default on `v14.0`.
