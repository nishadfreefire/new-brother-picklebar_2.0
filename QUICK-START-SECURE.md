# 🚀 Quick Start Guide - Secure Version

## Installation & Setup

### 1. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 2. Configure Environment
```bash
# Copy environment template
cp .env.example .env

# Generate secrets (run twice for two different secrets)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Edit .env and set:
JWT_SECRET="[paste first generated secret]"
SESSION_SECRET="[paste second generated secret]"
NODE_ENV="development"
APP_URL="http://localhost:3000"
PORT=3000
```

### 3. Start Development Server
```bash
npm run dev
```

Server will start at `http://localhost:3000`

---

## 🔐 Admin Access

### Default Credentials
⚠️ **IMPORTANT:** Change immediately after first login!
- **Admin PIN:** `1234` (from `data/store.json` → settings.adminPin)

### Login Process
1. Go to `http://localhost:3000/admin` or `http://localhost:3000#admin`
2. Enter PIN
3. JWT token will be stored in cookie
4. Token valid for 2 hours

### Change Admin PIN
Via Admin Panel Settings or directly edit `data/store.json`:
```json
{
  "settings": {
    "adminPin": "YOUR_NEW_PIN_HERE"
  }
}
```

---

## 🔒 Security Features

### Enabled by Default:
✅ JWT Authentication (2h expiry)  
✅ Rate Limiting (5 login attempts / 15 min)  
✅ Input Validation & XSS Protection  
✅ CSRF Protection via Sessions  
✅ Security Headers (Helmet)  
✅ CORS Protection  
✅ Server-Side Price Validation  
✅ Race Condition Prevention  
✅ Request Timeouts  
✅ File Access Protection  

---

## 📡 API Authentication

### Public Endpoints (No Auth):
- `GET /api/products`
- `GET /api/settings` (PIN hidden)
- `GET /api/reviews`
- `GET /api/coupons` (active only)
- `POST /api/coupons/validate`
- `POST /api/orders`
- `GET /api/orders/track/:query`

### Protected Endpoints (Admin Auth Required):
- `POST /PUT /DELETE /api/products`
- `PATCH /DELETE /api/orders`
- `POST /DELETE /api/coupons`
- `POST /DELETE /api/reviews`
- `PUT /api/settings`
- `GET /api/stats`

### Using Protected Endpoints:

```javascript
// 1. Login first
const loginResponse = await fetch('/api/admin/verify', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ pin: '1234' })
});

const { token } = await loginResponse.json();

// 2. Use token in subsequent requests
const response = await fetch('/api/products', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}` // Include token
  },
  body: JSON.stringify(productData)
});
```

---

## 🧪 Testing

### Test Authentication:
```bash
# Wrong PIN (should fail)
curl -X POST http://localhost:3000/api/admin/verify \
  -H "Content-Type: application/json" \
  -d '{"pin":"wrong"}'

# Correct PIN (should succeed)
curl -X POST http://localhost:3000/api/admin/verify \
  -H "Content-Type: application/json" \
  -d '{"pin":"1234"}'
```

### Test Rate Limiting:
```bash
# Try 6 times (6th should be blocked)
for i in {1..6}; do
  echo "Attempt $i"
  curl -X POST http://localhost:3000/api/admin/verify \
    -H "Content-Type: application/json" \
    -d '{"pin":"wrong"}'
  echo ""
done
```

### Test Protected Endpoint:
```bash
# Without auth (should fail with 401)
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Test"}'

# With auth (replace TOKEN)
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"name":"Test Product", ...}'
```

---

## 🏗️ Build for Production

### 1. Set Production Environment:
```bash
# In .env file:
NODE_ENV="production"
JWT_SECRET="[strong-random-secret]"
SESSION_SECRET="[strong-random-secret]"
APP_URL="https://yourdomain.com"
```

### 2. Build:
```bash
npm run build
```

### 3. Run Production Server:
```bash
# Simple
npm run start

# Or with PM2 (recommended)
npm install -g pm2
pm2 start dist/server.cjs --name "picklebar"
pm2 save
pm2 startup
```

### 4. Configure Nginx (if using):
```nginx
server {
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 5. Enable SSL (Certbot):
```bash
sudo certbot --nginx -d yourdomain.com
```

---

## 🔧 Troubleshooting

### Issue: "Authentication required" on admin routes
**Solution:** Token expired or missing. Login again.

### Issue: "Too many requests"
**Solution:** Rate limit hit. Wait 15 minutes or restart server in dev.

### Issue: CORS error
**Solution:** Check APP_URL in .env matches your frontend origin.

### Issue: "Invalid admin credentials"
**Solution:** 
1. Check PIN in `data/store.json`
2. Ensure not locked out (wait 15 min)
3. Check server logs

### Issue: TypeScript errors
**Solution:** 
```bash
npm run lint
# Fix any type errors shown
```

---

## 📊 Monitoring

### Check Server Status:
```bash
# Health check
curl http://localhost:3000/api/health

# Should return:
# {"status":"ok","time":"2026-09-22T...","env":"development"}
```

### View Logs:
```bash
# If using PM2:
pm2 logs picklebar

# If using npm run start:
# Check console output
```

---

## 🛠️ Development Workflow

### Making Changes:

1. **Edit Code**
   ```bash
   # Edit files in src/ or server.ts
   ```

2. **Lint & Check**
   ```bash
   npm run lint
   ```

3. **Test Locally**
   ```bash
   npm run dev
   # Test in browser
   ```

4. **Build & Deploy**
   ```bash
   npm run build
   npm run start
   ```

### Adding New Protected Route:

```typescript
// In server.ts

// 1. Define route handler
app.post('/api/my-route', async (req, res) => {
  // Your logic here
});

// 2. Add auth middleware (if admin only)
app.use('/api/my-route', verifyAdminToken);
```

---

## 📚 Documentation Files

- `README.md` - Original project documentation
- `SECURITY.md` - Comprehensive security guide
- `SECURITY-FIXES-APPLIED.md` - What was fixed
- `RE-AUDIT-REPORT.md` - Post-fix security audit
- `QUICK-START-SECURE.md` - This file

---

## 🆘 Support

### Security Issues:
- Review `SECURITY.md`
- Check server logs
- Verify environment variables
- Test with curl commands above

### Bug Reports:
- Include error message
- Include request details
- Include server logs
- Include environment (dev/prod)

---

## ✅ Pre-Deployment Checklist

Before going live:

- [ ] Change admin PIN from default
- [ ] Generate strong JWT_SECRET
- [ ] Generate strong SESSION_SECRET
- [ ] Set NODE_ENV=production
- [ ] Set production APP_URL
- [ ] Enable HTTPS/SSL
- [ ] Configure firewall
- [ ] Set up monitoring
- [ ] Test all API endpoints
- [ ] Test authentication flow
- [ ] Test rate limiting
- [ ] Run `npm audit`
- [ ] Backup `data/store.json`

---

## 🎯 Quick Commands Reference

```bash
# Install
npm install --legacy-peer-deps

# Development
npm run dev

# Build
npm run build

# Production
npm run start

# Lint
npm run lint

# Security Audit
npm audit

# Generate Secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# PM2 Commands
pm2 start dist/server.cjs --name picklebar
pm2 logs picklebar
pm2 restart picklebar
pm2 stop picklebar
pm2 delete picklebar
```

---

**Last Updated:** September 22, 2026  
**Version:** 1.0 (Secure)
