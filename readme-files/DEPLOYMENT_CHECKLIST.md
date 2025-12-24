# Production Deployment Checklist

Complete this checklist before deploying to production.

## Pre-Deployment Testing

### Backend Testing
- [ ] Backend runs locally without errors
  ```bash
  cd backend && npm run dev
  ```
- [ ] MongoDB connection successful
- [ ] Can create user via signup endpoint
  ```bash
  curl -X POST http://localhost:5000/api/auth/signup ...
  ```
- [ ] Can login and get JWT token
- [ ] Can access protected endpoints with token
- [ ] Token refresh works
- [ ] CORS errors don't appear in browser console
- [ ] All environment variables are set in `.env`

### Frontend Testing
- [ ] Frontend runs locally without errors
  ```bash
  npm run dev
  ```
- [ ] Login page loads
- [ ] Can create account and redirect to dashboard
- [ ] Dashboard loads with real user data
- [ ] Can logout
- [ ] Can login again with same credentials
- [ ] Data persists across sessions
- [ ] No CORS errors in console
- [ ] No 401 errors for authenticated requests

### Cross-Device Testing
- [ ] Create account on Device A
- [ ] Login on Device B with same credentials
- [ ] Verify same user data appears on Device B
- [ ] Make changes on Device B
- [ ] Verify changes appear on Device A (after refresh)

## Backend Deployment Preparation

### Environment Variables
- [ ] Create strong `JWT_SECRET` (32+ chars)
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- [ ] Create strong `JWT_REFRESH_SECRET` (32+ chars)
- [ ] Set `MONGODB_URI` to production cluster
- [ ] Set `FRONTEND_URL` to production frontend URL
- [ ] Set `OPENAI_API_KEY` if using AI features
- [ ] Set `NODE_ENV=production`
- [ ] Set `PORT` (usually 3000 or 5000)

### MongoDB Setup
- [ ] Create MongoDB Atlas production cluster
- [ ] Create database user with strong password
- [ ] Whitelist all backend server IPs
- [ ] Create database and collections
- [ ] Enable automated backups
- [ ] Test connection from backend server

### Code Preparation
- [ ] Remove all `console.log` statements (or use logger)
- [ ] Add error handling for all API calls
- [ ] Implement rate limiting
- [ ] Add request logging
- [ ] Add database transaction support
- [ ] Test all edge cases
- [ ] Run security audit
  ```bash
  npm audit
  npm audit fix
  ```

### Hosting Selection (Choose One)

#### Render.com (Recommended for Beginners)
- [ ] Create Render account
- [ ] Connect GitHub repository
- [ ] Create new Web Service
- [ ] Set build command: `npm install`
- [ ] Set start command: `npm start`
- [ ] Add environment variables in Render dashboard
- [ ] Deploy
- [ ] Test endpoints

#### Railway.app
- [ ] Create Railway account
- [ ] Connect GitHub repository
- [ ] Create new project
- [ ] Add service from repo
- [ ] Set environment variables
- [ ] Deploy
- [ ] Test endpoints

#### Azure App Service
- [ ] Create Azure account
- [ ] Create App Service (Linux, Node.js)
- [ ] Configure deployment (GitHub Actions)
- [ ] Add environment variables
- [ ] Deploy
- [ ] Test endpoints

### Backend Deployment Checklist
- [ ] Code pushed to GitHub
- [ ] All tests passing
- [ ] Environment variables set in hosting platform
- [ ] Database connection working
- [ ] API endpoints responding
- [ ] Error handling working
- [ ] Logging functional
- [ ] CORS properly configured
- [ ] Security headers present
- [ ] Rate limiting active

## Frontend Deployment Preparation

### Environment Variables
- [ ] `VITE_API_URL` set to production backend URL
  ```
  Example: https://your-backend.onrender.com/api
  ```
- [ ] All API calls use correct base URL
- [ ] No hardcoded localhost URLs

### Code Preparation
- [ ] Build runs without errors
  ```bash
  npm run build
  ```
- [ ] No console errors in build output
- [ ] All pages accessible after build
- [ ] All API calls point to production backend
- [ ] Error handling for failed API calls
- [ ] Loading states implemented
- [ ] Empty states implemented
- [ ] Mobile responsiveness checked

### Hosting Selection (Choose One)

#### Netlify (Recommended)
- [ ] Create Netlify account
- [ ] Connect GitHub repository
- [ ] Set build command: `npm run build`
- [ ] Set publish directory: `dist`
- [ ] Add environment variable: `VITE_API_URL`
- [ ] Deploy
- [ ] Test frontend

#### Vercel
- [ ] Create Vercel account
- [ ] Import GitHub repository
- [ ] Set environment variables
- [ ] Deploy
- [ ] Test frontend

#### GitHub Pages
- [ ] Install gh-pages
- [ ] Configure vite.config.js for GitHub Pages
- [ ] Deploy
- [ ] Test frontend

### Frontend Deployment Checklist
- [ ] Code pushed to GitHub
- [ ] Build runs successfully
- [ ] Environment variables set
- [ ] API URL configured correctly
- [ ] Frontend accessible via domain
- [ ] Login page loads
- [ ] Authentication works
- [ ] Dashboard loads with data
- [ ] All pages functional
- [ ] Mobile view works

## Post-Deployment Testing

### User Flow Testing
- [ ] Visit production frontend URL
- [ ] Create new account
- [ ] Verify email (if implemented)
- [ ] Login with new account
- [ ] Dashboard loads with correct data
- [ ] Can perform all actions
- [ ] Logout works
- [ ] Can login again

### API Testing
- [ ] Test signup endpoint
- [ ] Test login endpoint
- [ ] Test protected endpoint
- [ ] Test token refresh
- [ ] Test logout endpoint
- [ ] Verify error responses
- [ ] Check response times
- [ ] Verify data accuracy

### Cross-Environment Testing
- [ ] Same user on different browsers
- [ ] Same user on different devices
- [ ] Same user in private browsing
- [ ] Different users in same browser
- [ ] Rapid successive logins
- [ ] Long session (> 15 min)
- [ ] Session after backend restart

### Security Testing
- [ ] Can't access protected routes without token
- [ ] Invalid token rejected
- [ ] Expired token handled gracefully
- [ ] CORS properly restricts requests
- [ ] Passwords never logged
- [ ] Tokens never logged
- [ ] XSS protection working
- [ ] CSRF protection (if applicable)

### Performance Testing
- [ ] Dashboard loads in < 2 seconds
- [ ] API responses < 500ms
- [ ] No memory leaks after extended use
- [ ] Handle 100 concurrent users
- [ ] Database queries optimized
- [ ] Large datasets handled efficiently

### Monitoring & Logging
- [ ] Error logging configured
- [ ] Database monitoring active
- [ ] API monitoring setup
- [ ] Uptime monitoring enabled
- [ ] Alerts configured
- [ ] Regular backups automated
- [ ] Logs retention policy set

## Post-Deployment Monitoring

### First Week
- [ ] Monitor error logs daily
- [ ] Check database performance
- [ ] Monitor API response times
- [ ] Check user signup rate
- [ ] Monitor server resource usage
- [ ] Review user feedback

### Ongoing
- [ ] Weekly security audits
- [ ] Monthly performance reviews
- [ ] Regular backup verification
- [ ] Database optimization
- [ ] Dependency updates (security patches)
- [ ] SSL certificate renewal (30 days before expiry)

## Rollback Plan

If deployment fails:
1. Identify the issue
2. Fix in development
3. Test thoroughly
4. Redeploy
5. Monitor closely

**Keep previous version running** until confident new version is stable.

## Documentation Updates

- [ ] Update README with production URL
- [ ] Document production environment
- [ ] Create deployment runbook
- [ ] Document database backup procedure
- [ ] Document password reset procedure
- [ ] Document emergency contact procedures

## Team Communication

- [ ] Notify team of deployment
- [ ] Share production URLs
- [ ] Share monitoring/alert dashboards
- [ ] Document incident response procedures
- [ ] Schedule post-launch review meeting

## Success Criteria

✅ All tests passing  
✅ All checklist items completed  
✅ No critical errors in logs  
✅ Sub-500ms API response times  
✅ User authentication working  
✅ Data persisting correctly  
✅ No security vulnerabilities  
✅ Monitoring & alerts active  

---

## Deployment Summary

| Component | Status | URL |
|-----------|--------|-----|
| Backend Server | [ ] Deployed | https://your-backend.com |
| Frontend App | [ ] Deployed | https://your-frontend.com |
| MongoDB | [ ] Configured | Atlas Production |
| Domain | [ ] Configured | your-domain.com |
| SSL/TLS | [ ] Configured | ✅ HTTPS |
| Monitoring | [ ] Active | Dashboard URL |

---

## Emergency Contacts

- **Backend Issues:** 
- **Database Issues:** 
- **Frontend Issues:** 
- **Security Issues:** 

---

## Sign-off

- [ ] QA Tester: _________________ Date: _______
- [ ] Backend Lead: _________________ Date: _______
- [ ] Frontend Lead: _________________ Date: _______
- [ ] DevOps Lead: _________________ Date: _______
- [ ] Project Manager: _________________ Date: _______

**Deployment Approved:** ☐ Yes ☐ No

---

## Notes

```
[Use this space for deployment notes, issues encountered, and solutions]

```

---

## Version History

| Version | Date | Changes | Deployed By |
|---------|------|---------|-------------|
| 1.0 | | Initial deployment | |
| | | | |
| | | | |

---

## Resources

- Render Deployment: https://render.com/docs/deploy-node-express-app
- Netlify Deployment: https://docs.netlify.com/
- MongoDB Atlas: https://docs.mongodb.com/atlas/
- GitHub: https://docs.github.com/

---

**Good luck with your deployment! 🚀**
