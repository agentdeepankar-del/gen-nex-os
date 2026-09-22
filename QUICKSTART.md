# GEN NEX OS - Quick Start (5 mins)

## Zero to Live in 5 Minutes

### Step 1: Push to GitHub (1 min)
```powershell
cd C:\dev\gen-nex-os
git add .
git commit -m "GEN NEX OS Phase 1"
git push origin main
```

### Step 2: Create Supabase Project (2 mins)
1. https://supabase.com → New Project
2. Name: `gen-nex-os` → Create
3. Wait 2 minutes for project to initialize
4. Go to Settings → API
5. Copy these 3 values:
   - Project URL
   - anon public key
   - service_role key

### Step 3: Deploy to Vercel (2 mins)
1. https://vercel.com/dashboard
2. "Add New" → "Project"
3. "Import Git Repository" → paste: `https://github.com/agentdeepankar-del/gen-nex-os`
4. Add 5 Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = [paste URL]
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = [paste anon key]
   - `SUPABASE_SERVICE_ROLE_KEY` = [paste service role key]
   - `NEXT_PUBLIC_DEMO_ACADEMY_ID` = `demo-academy-1`
   - `NEXT_PUBLIC_DEMO_BRANCH_ID` = `demo-branch-1`
5. Click "Deploy"
6. Wait ~5 mins for build

### Step 4: Setup Database (2 mins)
1. Supabase → SQL Editor → New Query
2. Open `/supabase/migrations/001_initial_schema.sql` from your repo
3. Copy all → Paste into editor → Run

### Step 5: Seed Data (1 min)
```powershell
cd C:\dev\gen-nex-os
npm install
npm run seed
```

### Step 6: Test (instant)
Go to your Vercel URL
- Email: `owner@demo.local`
- Password: `demo123456`

**Done! 🎉**

---

## What You Get

✅ Live sports academy OS
✅ Player management
✅ Revenue tracking
✅ Admin dashboard
✅ 100 demo players with realistic data
✅ Complete audit trail

## Demo Features

- Login → Dashboard (metrics)
- Players → Search, filter, view details
- Admin → Approve pending players
- Revenue → Real-time status

## Troubleshooting

| Problem | Solution |
|---------|----------|
| npm not found | Install Node.js from nodejs.org |
| Supabase connection error | Check URL/keys, no extra spaces |
| No data on dashboard | Run `npm run seed` locally |
| Deployment failed | Check Vercel build logs |

## Next: Deploy to Production

After testing, update in Vercel:
- Replace demo credentials with real auth
- Enable Supabase RLS
- Set up monitoring
- Share with Manish

---

**Docs**: See README.md and DEPLOYMENT.md for full details
