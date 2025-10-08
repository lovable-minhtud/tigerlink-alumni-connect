# TigerLink Frontend - Setup & Testing Guide

## 🎯 Overview

TigerLink is a mentorship platform connecting DePauw University students with alumni for career guidance, resume reviews, and informational coffee chats.

## 🏗️ Architecture

### Tech Stack
- **React 18** + **TypeScript**
- **Vite** (Build tool)
- **React Router v6** (Routing)
- **React Hook Form** + **Zod** (Form validation)
- **React Query** (Server state management)
- **Axios** (HTTP client)
- **Tailwind CSS** (Styling)

### Authentication Strategy
- **Cookie-based authentication** using `JSESSIONID`
- Session managed by Spring backend
- All requests use `withCredentials: true`
- 401 responses trigger automatic logout and redirect

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Backend API running at `http://10.1.11.26:8080` (or update `.env.local`)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:8080`

## 📝 Environment Configuration

The `.env.local` file contains:

```
VITE_API_URL=http://10.1.11.26:8080
```

Update this URL to point to your backend server.

## 🔑 Key Features

### 1. User Registration & Login
- Email validation (must be @depauw.edu)
- Password validation (min 8 chars, letters + numbers)
- Role selection (STUDENT or ALUMNI)
- Automatic login after registration
- Session persistence via cookies

### 2. Profile Management
- **Students**: Graduation year, major, career interests, LinkedIn, resume URL
- **Alumni**: Graduation year, major, company, job title, expertise, mentorship types
- Unified `/profile` endpoint handles both creation and updates
- Graceful handling of 404 when profile doesn't exist yet

### 3. Match Requests (Students Only)
- Two types: Coffee Chat or Resume Review
- Message field with 20-500 character validation
- Role-guarded route (redirects non-students)

### 4. Dashboard
- Role-specific landing page
- Quick access to profile and match request features
- Clean navigation with logout functionality

## 📂 Project Structure

```
src/
├── app/
│   ├── providers/
│   │   ├── AuthProvider.tsx      # Auth context & session management
│   │   └── QueryProvider.tsx     # React Query configuration
│   └── router.tsx                 # Route guards (Protected/Public)
├── components/
│   ├── forms/
│   │   ├── FormField.tsx          # Reusable form field wrapper
│   │   └── MultiSelect.tsx        # Multi-checkbox component
│   └── ui/
│       ├── Spinner.tsx            # Loading spinner
│       └── [shadcn components]    # Button, Card, Input, etc.
├── hooks/
│   ├── useAuth.ts                 # Auth context hook
│   └── useRoleGuard.ts            # Role-based access control
├── lib/
│   ├── axios.ts                   # Axios instance with interceptors
│   └── zodSchemas.ts              # All Zod validation schemas
├── pages/
│   ├── Dashboard.tsx              # Post-login landing
│   ├── Login.tsx                  # Login form
│   ├── MatchRequest.tsx           # Student match request form
│   ├── Profile.tsx                # Unified profile create/edit
│   └── Register.tsx               # Registration form
└── services/
    ├── auth.api.ts                # Auth API calls
    ├── match.api.ts               # Match request API
    └── profile.api.ts             # Profile CRUD operations
```

## 🔒 API Integration

### Authentication Endpoints

#### Register
```typescript
POST /api/v1/auth/register
Content-Type: application/json

{
  "fullName": "Jane Doe",
  "email": "janedoe_2025@depauw.edu",
  "password_hash": "SecurePass123",
  "role": "STUDENT"
}
```

#### Login
```typescript
POST /api/v1/auth/login
Content-Type: application/x-www-form-urlencoded

email=janedoe_2025@depauw.edu&passwordHash=SecurePass123
```

**Important**: Login uses form-urlencoded, not JSON!

#### Get Current User
```typescript
GET /api/v1/auth/me

Response:
{
  "status": "OK",
  "code": 200,
  "data": {
    "userId": "...",
    "fullName": "Jane Doe",
    "email": "janedoe_2025@depauw.edu",
    "role": "STUDENT"
  }
}
```

### Profile Endpoints

#### Get Profile
```typescript
GET /api/v1/profile/me

Success: Returns profile data
404: No profile exists (handled gracefully, not an error!)
```

#### Create/Update Student Profile
```typescript
POST /api/v1/profile/student
Content-Type: application/json

{
  "gradYear": 2025,
  "major": "Computer Science",
  "aboutMe": "...",
  "careerInterest": ["Technology", "Software Engineering"],
  "linkedinProfile": "https://linkedin.com/in/...",
  "resumeUrl": "https://..."  // Optional
}
```

#### Create/Update Alumni Profile
```typescript
POST /api/v1/profile/alumni
Content-Type: application/json

{
  "gradYear": 2015,
  "major": "Economics",
  "aboutMe": "...",
  "currentCompany": "Goldman Sachs",
  "jobTitle": "Vice President",
  "fieldOfExpertise": ["Finance", "Investment Banking"],
  "willingnessToHelp": ["COFFEE_CHAT", "RESUME_REVIEW"],
  "linkedinProfile": "https://linkedin.com/in/..."
}
```

### Match Request Endpoint

```typescript
POST /api/v1/match-request
Content-Type: application/json

{
  "type": "COFFEE_CHAT",  // or "RESUME_REVIEW"
  "message": "I'm interested in learning more about..."
}
```

## 🧪 Testing Checklist

### 1. Registration Flow
- [ ] Register as STUDENT with valid @depauw.edu email
- [ ] Register as ALUMNI with valid @depauw.edu email
- [ ] Verify email validation (reject non-@depauw.edu)
- [ ] Verify password validation (8+ chars, letters + numbers)
- [ ] Confirm automatic login after registration
- [ ] Check redirect to `/dashboard` after registration

### 2. Login Flow
- [ ] Login with valid credentials
- [ ] Verify error message on invalid credentials
- [ ] Confirm redirect to `/dashboard` on success
- [ ] Verify session persists on page refresh
- [ ] Check that logged-in users can't access `/login` or `/register`

### 3. Profile Management
- [ ] Create student profile with all fields
- [ ] Create alumni profile with all fields
- [ ] Verify multi-select works for career interests / expertise
- [ ] Test LinkedIn URL validation
- [ ] Verify graceful handling when no profile exists (no errors)
- [ ] Update existing profile and verify changes persist
- [ ] Check that form pre-populates with existing data

### 4. Match Request (Students Only)
- [ ] Submit coffee chat request
- [ ] Submit resume review request
- [ ] Verify message length validation (20-500 chars)
- [ ] Confirm alumni users are redirected away from this page
- [ ] Check success message and redirect to dashboard

### 5. Navigation & Guards
- [ ] Verify unauthenticated users are redirected to `/login`
- [ ] Test logout functionality
- [ ] Confirm dashboard shows role-specific content
- [ ] Check all navigation links work correctly

### 6. Error Handling
- [ ] Test 401 response triggers logout and redirect
- [ ] Verify toast notifications appear for errors
- [ ] Check loading states display correctly
- [ ] Confirm validation errors show inline

## 🎨 Design System

The application uses a professional DePauw-themed design:

- **Primary Color**: Deep Blue (#1E3A8A) - Trust and education
- **Accent Color**: Tiger Gold (#F59E0B) - DePauw branding
- **Typography**: Clean, accessible fonts
- **Components**: Consistent shadcn/ui components with custom variants

All colors are defined using HSL values in `src/index.css` as semantic tokens.

## 🐛 Common Issues & Solutions

### Issue: 401 Unauthorized on every request
**Solution**: Ensure backend CORS is configured to allow credentials and the frontend API URL is correct.

### Issue: Profile returns 404
**This is normal!** The profile endpoint returns 404 when no profile exists yet. The frontend handles this gracefully and shows an empty form.

### Issue: Login redirects but user is null
**Solution**: Check that cookies are being set by the backend and that `withCredentials: true` is set in axios.

### Issue: Form validation not working
**Solution**: Verify Zod schemas match the backend expectations exactly.

## 📞 Support

For questions or issues, please contact the development team.

## 🔐 Security Notes

- Never log sensitive data (passwords, tokens) to console
- All forms use client-side validation with Zod
- Input sanitization prevents injection attacks
- Session cookies are HttpOnly (set by backend)
- CSRF protection handled by Spring Security

---

**Built with ❤️ for DePauw University**
