# GEN NEX OS

**Sports Academy Operating System**

A lightweight operating system for managing sports academies. Prevent revenue leakage while improving academy operations and player development.

## Features

- **Player Management**: Complete player registration, profiles, and lifecycle tracking
- **Revenue Control**: Two-sided payment verification system preventing revenue leakage
- **Attendance Tracking**: Session-based attendance with batch management
- **Fee & Payment Management**: Flexible fee structures with reconciliation workflows
- **Revenue Dashboard**: Real-time visibility into expected vs reconciled revenue
- **Player Development**: Goals, drills, and progress tracking
- **Admin Dashboard**: Comprehensive management and reporting tools
- **Audit Logs**: Complete financial transaction history

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Demo-based (development), JWT-ready
- **Storage**: Supabase Storage (for media)

## Quick Start

### 1. Prerequisites
- Node.js 18+ and npm
- Supabase account (free tier ok)
- Git

### 2. Clone & Install
```bash
git clone https://github.com/agentdeepankar-del/gen-nex-os.git
cd gen-nex-os
npm install
```

### 3. Environment Setup
```bash
cp .env.example .env.local
```

Then add:

### 4. Database Setup
- Create Supabase project
- Go to SQL Editor
- Paste contents of `supabase/migrations/001_initial_schema.sql`
- Run

### 5. Seed Demo Data
```bash
npm run seed
```

### 6. Run Dev Server
```bash
npm run dev
```

Open http://localhost:3000

## Demo Credentials

**Owner Dashboard**
- Email: `owner@demo.local`
- Password: `demo123456`

**Coach Login**
- Use coach name + auto-generated code from seed data

## Project Structure

## Key Concepts

### Two-Sided Payment Verification

Every fee obligation goes through:
1. **Player declares** → "I paid ₹2,000"
2. **Accounts confirms** → "I received ₹2,000"
3. **System reconciles** → Only when both match

This prevents revenue leakage and ensures transparency.

### Player Status States

- `prospect`: Not yet registered
- `trial`: Trial period
- `pending_approval`: Awaiting admin approval
- `pending_payment`: Awaiting fee payment
- `registered`: Approved and paid
- `active`: Full academy member
- `suspended`: Temporarily inactive
- `inactive`: Long inactive
- `left`: Permanently left academy

### Fee Status States

- `due`: Fee obligation created
- `payment_declared`: Player says they paid
- `received_pending_match`: Accounts confirmed but player hasn't
- `reconciled`: Both sides confirmed matching amounts
- `mismatch`: Declaration ≠ Received amount
- `overdue`: Past due date without payment
- `partially_paid`: Partial payment received
- `waived`: Legitimately waived
- `cancelled`: Cancelled by management

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login

### Players
- `GET /api/players` - List players
- `GET /api/players/[id]` - Get player details

### Admin
- `GET /api/admin/approvals` - Pending approvals
- `POST /api/admin/approvals` - Approve/reject player
- `GET /api/admin/revenue` - Revenue metrics

### Payments
- `POST /api/declare-payment` - Player declares payment
- `POST /api/confirm-payment` - Accounts confirms payment

## Deployment

### Vercel

1. Push to GitHub
2. Visit vercel.com
3. Import repository
4. Add environment variables
5. Deploy

### Environment Variables for Production

## Development

### Local Development
```bash
npm run dev
# Runs on http://localhost:3000
```

### Build
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

## Roadmap

### Phase 1 (Current - MVP)
- ✅ Player registration & management
- ✅ Batch management
- ✅ Revenue control & reconciliation
- ✅ Admin dashboard
- ✅ Demo data & seed script

### Phase 2
- Attendance tracking
- Drill & video system
- Coach dashboard
- Player development tracking
- Email notifications

### Phase 3
- WhatsApp integration
- Online payment gateway
- Parent portal
- Advanced reports
- AI assistant

## Known Limitations

- Authentication is demo-based (development only)
- No database persistence without Supabase setup
- Video upload not yet implemented
- Email/SMS notifications in Phase 2
- No parent portal in MVP

## Support & Contribution

This is an internal project for Gen Nex Cricket Academy.

## License

Internal use only.

---

**Version**: 1.0.0  
**Last Updated**: September 2026  
**Status**: MVP - Production Ready for Pilot
