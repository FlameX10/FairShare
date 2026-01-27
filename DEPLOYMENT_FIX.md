# Deployment Fix Guide

## Changes Made

### 1. **Backend CORS Configuration** (`Backend/server.js`)
- ✅ Added dynamic CORS origin support
- ✅ Now supports custom frontend URLs via environment variable
- ✅ Added localhost ports for development (3000, 3002, 5173)
- ✅ Will automatically use `FRONTEND_URL` from .env if set

**What this fixes:** Requests from your deployed frontend were being blocked by CORS

### 2. **Backend Environment Variables** (`Backend/.env`)
- ✅ Added `FRONTEND_URL=https://splitoo.netlify.app`
- ✅ Added missing `JWT_EXPIRES=7d`

**Update this with:** Your actual deployed frontend URL on your hosting platform (Render/Heroku)

### 3. **Enhanced Error Logging** (`Frontend/src/pages/Register.jsx`)
- ✅ Now logs exact API URL being called
- ✅ Logs full error details: status, response data, request config
- ✅ Shows error code and message for easier debugging

### 4. **Login Error Logging** (`Frontend/src/context/AuthContext.jsx`)
- ✅ Added detailed logging for login attempts
- ✅ Logs API URL and email being used
- ✅ Full error response details captured

## How to Debug

### Step 1: Check Backend is Running
Open browser and visit your backend URL:
```
https://fairshare-twto.onrender.com/health
```
Should return:
```json
{"status":"OK","message":"Backend is running"}
```

### Step 2: Check Browser Console
1. Go to deployed site: `https://splitoo.netlify.app`
2. Open DevTools: Press `F12`
3. Go to **Console** tab
4. Try to register/login
5. Look for `[REGISTER]` or `[LOGIN]` logs
6. Check for red error messages

### Step 3: Check Network Tab
1. In DevTools, go to **Network** tab
2. Try to register
3. Look for request to `/api/auth/register`
4. Check:
   - Response status (should be 2xx for success)
   - Response body (has error message?)
   - CORS headers (if request is blocked)

### Step 4: Environment Variables Checklist
Make sure on your **Render/Heroku/Railway Dashboard**:
- [ ] `MONGO_URI` is set correctly
- [ ] `JWT_SECRET` is set
- [ ] `FRONTEND_URL` is set to your deployed frontend URL
- [ ] `EMAILJS_SERVICE_ID` is set
- [ ] `EMAILJS_TEMPLATE_ID` is set
- [ ] All email credentials are correct

### Step 5: Frontend .env Check
Verify `Frontend/.env` has:
```
VITE_API_URL=https://fairshare-twto.onrender.com
```
If you changed backend URL, update this too!

## Common Issues & Solutions

### Issue: "Backend unreachable" Error
**Cause:** Backend not running or API URL is wrong
**Solution:** 
- Check if `/health` endpoint works
- Verify `VITE_API_URL` in Frontend/.env matches your backend URL
- Check if backend is deployed and running

### Issue: CORS Error in Console
**Cause:** Frontend URL not in CORS allowed origins
**Solution:**
- Make sure `FRONTEND_URL` is set in backend .env
- Restart backend after updating .env
- Check Backend/server.js has your frontend URL

### Issue: Registration succeeds but OTP doesn't arrive
**Cause:** Email credentials not working
**Solution:**
- Verify `EMAILJS_*` environment variables on backend
- Check EMAILJS account credentials
- Verify email is whitelisted in EMAILJS

### Issue: Login fails with 401/403 errors
**Cause:** JWT or database issue
**Solution:**
- Check `JWT_SECRET` matches between frontend and backend
- Verify MongoDB connection string is correct
- Check user exists in database

## Testing Locally First

Before deploying, test locally:

1. **Backend:**
   ```bash
   cd Backend
   npm install
   npm run dev
   ```

2. **Frontend:**
   ```bash
   cd Frontend
   npm install
   npm run dev
   ```

3. **Test in browser:**
   - Register a user
   - Check console logs `[REGISTER]`
   - Verify OTP email received
   - Login and verify dashboard loads

## Deploying Changes

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Fix: CORS and deployment logging"
   git push
   ```

2. **Render/Heroku will auto-redeploy**

3. **After deployment:**
   - Clear browser cache: Ctrl+Shift+Delete
   - Revisit your site
   - Check console for any errors
   - Test registration flow

## Getting More Help

If still having issues, check:
1. Browser DevTools Console (F12)
2. Backend logs on Render/Heroku dashboard
3. MongoDB connection status
4. Email service credentials
