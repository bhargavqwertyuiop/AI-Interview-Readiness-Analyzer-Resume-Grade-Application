# Setup Guide - Interview Readiness Analyzer

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables (Optional)

Create a `.env` file in the root directory:

```env
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

**Getting an OpenAI API Key:**
1. Visit https://platform.openai.com
2. Sign up or log in
3. Navigate to API Keys section
4. Click "Create new secret key"
5. Copy the key and paste it in your `.env` file

**Note:** The application works without the API key, but AI question generation will be disabled.

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Features Overview

### Core Features (No Setup Required)

- ✅ Role selection and roadmaps
- ✅ Topic tracking with confidence levels
- ✅ Interview readiness score calculation
- ✅ Question bank (manual entry)
- ✅ Mock interview planner
- ✅ Analytics dashboard
- ✅ PDF report export

### AI Features (Requires API Key)

- 🤖 AI-powered question generation
  - Generate questions per topic
  - Select difficulty and count
  - Preview and select before saving

## Troubleshooting

### AI Generation Not Working

1. **Check API Key:**
   - Ensure `.env` file exists in project root
   - Verify `VITE_OPENAI_API_KEY` is set correctly
   - Restart dev server after adding/changing `.env`

2. **Check API Key Validity:**
   - Verify key is active at https://platform.openai.com
   - Ensure you have credits in your OpenAI account

3. **Check Browser Console:**
   - Open browser DevTools (F12)
   - Check Console tab for error messages
   - Check Network tab for API call failures

### Common Issues

**Issue:** "OpenAI API key is required" error
- **Solution:** Add `VITE_OPENAI_API_KEY` to `.env` file and restart server

**Issue:** API calls failing with 401/403
- **Solution:** Check that your API key is valid and has credits

**Issue:** Questions not generating
- **Solution:** Check internet connection and OpenAI API status

**Issue:** Duplicate questions being added
- **Solution:** The app automatically detects duplicates, but if you see them, they might have slight variations. You can manually delete duplicates.

## Production Deployment

### Environment Variables

For production deployment (Netlify, Vercel, etc.):

1. **Netlify:**
   - Go to Site settings → Environment variables
   - Add `VITE_OPENAI_API_KEY` with your key value

2. **Vercel:**
   - Go to Project settings → Environment Variables
   - Add `VITE_OPENAI_API_KEY` with your key value

3. **Azure Static Web Apps:**
   - Go to Configuration → Application settings
   - Add `VITE_OPENAI_API_KEY` with your key value

**Important:** Never commit your `.env` file to version control!

## Cost Considerations

- AI question generation uses GPT-3.5-turbo (cost-efficient)
- Typical cost: ~$0.002 per generation (5 questions)
- Monitor usage at https://platform.openai.com/usage
- Set usage limits in OpenAI dashboard if needed

## Support

For issues or questions:
1. Check the README.md for detailed documentation
2. Review error messages in browser console
3. Verify environment variables are set correctly
4. Check OpenAI API status at https://status.openai.com

