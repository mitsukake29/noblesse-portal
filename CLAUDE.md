# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Noblesse Member Portal - A luxury web application with two main interfaces:
1. **Admin Dashboard**: For business operators to manage female member profiles with face-blurring image processing
2. **Member Portal**: Exclusive portal for premium Noblesse members to view profiles

## Technology Stack

- **Frontend**: React 18 + Vite + Material-UI (MUI)
- **Backend**: Node.js + Express
- **Image Processing**: Sharp + face-api.js (for face detection and blur)
- **Authentication**: JWT-based (simplified for PoC)
- **Styling**: MUI theming with luxury black × gold color scheme

## Development Commands

### Initial Setup
```bash
# Install all dependencies (root, backend, frontend)
npm run install-all

# Or install separately
npm install
cd backend && npm install
cd ../frontend && npm install
```

### Running the Application
```bash
# Run both backend and frontend concurrently (from root)
npm run dev

# Or run separately
npm run dev:backend   # Backend on port 5000
npm run dev:frontend  # Frontend on port 3000
```

### Building
```bash
npm run build  # Builds frontend for production
```

## Project Structure

```
/backend
├── server.js              # Express server setup
├── routes/
│   ├── auth.js           # Authentication endpoints
│   ├── members.js        # Member API (public view)
│   └── admin.js          # Admin API (CRUD operations)
├── utils/
│   └── faceDetection.js  # Face detection & blur logic
└── uploads/
    ├── original/         # Original uploaded images
    └── blurred/          # Face-blurred images

/frontend
├── src/
│   ├── main.jsx          # React entry point
│   ├── App.jsx           # Route configuration
│   ├── context/
│   │   └── AuthContext.jsx  # Authentication state management
│   ├── components/
│   │   ├── ProtectedRoute.jsx    # Route guard
│   │   ├── AdminMemberCard.jsx   # Admin member card
│   │   ├── MemberCard.jsx        # Public member card
│   │   └── UploadForm.jsx        # Image upload form
│   └── pages/
│       ├── LoginPage.jsx         # Member login
│       ├── AdminLoginPage.jsx    # Admin login
│       ├── MemberPortal.jsx      # Member portal layout
│       ├── MyPage.jsx            # Member profile page
│       ├── MemberListPage.jsx    # Female members list
│       ├── MemberDetailPage.jsx  # Member detail view
│       └── AdminDashboard.jsx    # Admin management
```

## Architecture Notes

### Authentication Flow
- JWT tokens stored in localStorage
- AuthContext provides global auth state
- ProtectedRoute component handles route protection
- Two separate login flows: member vs admin

### Image Processing Pipeline
1. Image uploaded via multipart/form-data
2. Saved to `uploads/original/`
3. Blur processing runs automatically:
   - **With face-api.js models**: Detected faces are blurred (15px blur on face regions)
   - **Without face-api.js models**: Full image blur using Sharp (10px blur)
4. Result saved to `uploads/blurred/`
5. Admin can toggle between original and blurred views in the dashboard

### API Endpoints

**Authentication**
- POST `/api/auth/login` - Member login
- POST `/api/auth/admin-login` - Admin login
- GET `/api/auth/me` - Get current user

**Members (Public)**
- GET `/api/members` - List all members (blurred images only)
  - Query params: `ageMin`, `ageMax`, `datingTypes[]`, `bustCups[]`, `freeword`
- GET `/api/members/:id` - Get single member detail

**Admin**
- GET `/api/admin/members` - List all members (both images)
  - Query params: `ageMin`, `ageMax`, `datingTypes[]`, `bustCups[]`, `freeword`
- GET `/api/admin/members/:id` - Get single member (admin view)
- POST `/api/admin/members` - Create member with photo upload
- PUT `/api/admin/members/:id` - Update member
- DELETE `/api/admin/members/:id` - Delete member

**Male Members (Admin)**
- GET `/api/male-members` - List all male members (passwords excluded from response)
- GET `/api/male-members/:id` - Get single male member
- POST `/api/male-members` - Create male member
- PUT `/api/male-members/:id` - Update male member (basic info only)
- DELETE `/api/male-members/:id` - Delete male member
- POST `/api/male-members/:id/change-password` - Change password (dedicated endpoint)
  - Validates password strength (8+ chars, uppercase, lowercase, number required)
  - Returns password strength: weak/medium/strong
  - Logs to audit trail
- POST `/api/male-members/validate-password` - Validate password in real-time
- GET `/api/male-members/audit/logs` - Get password change audit logs
  - Query params: `limit`, `memberId`

### Design System

**Updated Design System (2025-10-16)**

The application now features a modern, light-themed luxury design with Tiffany Blue accents.

**Color Palette**
- **Primary (Tiffany Blue)**: #0ABAB5
  - Light: #4DD4D0
  - Dark: #078A86
- **Secondary (Sophisticated Gray)**: #2C3E50
  - Light: #5D6D7E
  - Dark: #1C2833
- **Background**:
  - Default: #FAFAFA (very light gray)
  - Paper: #FFFFFF (pure white)
- **Text**:
  - Primary: #2C3E50 (dark gray)
  - Secondary: #5D6D7E (medium gray)
- **Divider**: rgba(10, 186, 181, 0.12)
- **Error**: #E74C3C
- **Success**: #27AE60

**Typography**
- **Font Family**: 'Noto Sans JP', 'Helvetica Neue', Arial, sans-serif
- **Headings**:
  - Font Weight: 700 (bold)
  - Letter Spacing: -0.01em (tight)
  - Color: Text Primary (#2C3E50)
- **Body Text**:
  - Line Height: 1.7 (readable)
  - Letter Spacing: 0.00938em
- **Buttons**:
  - Font Weight: 500 (medium)
  - Letter Spacing: 0.02em

**Spacing & Layout**
- Border Radius: 8px (soft corners), 12px (cards)
- Shadows: Soft, subtle shadows using rgba(0, 0, 0, 0.05-0.15)
- Card Hover Effect: Lift with Tiffany Blue shadow
- Transitions: All 0.3s cubic-bezier(0.4, 0, 0.2, 1)

**Component Styles**
- **Cards**: White background, 12px border radius, subtle borders and shadows
- **Buttons**: 8px border radius, hover effects with Tiffany Blue
- **TextFields**: 8px border radius, Tiffany Blue focus state
- **AppBar**: White background, thin bottom border
- **Tabs**: Tiffany Blue indicator, smooth transitions

**Design Principles**
1. **Light & Airy**: White/light gray backgrounds for an open, elegant feel
2. **Tiffany Blue Accents**: Used sparingly for primary actions and highlights
3. **Soft Shadows**: Gentle depth without heaviness
4. **Clean Typography**: Sans-serif for readability and modern appeal
5. **Consistent Spacing**: Adequate whitespace for luxury feel
6. **Responsive**: Mobile-first approach with adaptive layouts

## Test Accounts

**Member Login**
- Email: member@noblesse.com
- Password: noblesse123

**Member Login (Alternative)**
- Email: vip@noblesse.com
- Password: noblesse123

**Admin Login**
- Username: admin
- Password: admin123

## Recent Updates

### Design Refresh (2025-10-16 Latest)
Complete UI/UX redesign implementing a modern luxury aesthetic:
- **Theme Change**: Transitioned from dark luxury (black/gold) to light luxury (white/Tiffany Blue)
- **Updated Components**:
  - App.jsx: New MUI theme with light mode, Tiffany Blue primary color, improved shadows
  - All navigation headers (MemberPortal, AdminDashboard)
  - Member cards (MemberCard, AdminMemberCard) with clean white backgrounds
  - Search panel (MemberSearchPanel) with light styling
  - Login pages (LoginPage, AdminLoginPage) with gradient backgrounds
  - MyPage with refined paper components
  - All buttons unified with theme colors
- **Key Visual Changes**:
  - Backgrounds: Light gray to white gradient
  - Accent Color: Tiffany Blue (#0ABAB5) throughout
  - Typography: Switched to Noto Sans JP for better readability
  - Shadows: Soft, subtle depth effects
  - Borders: Thin, elegant dividers
  - Cards: Increased border radius (12px) for modern feel

### Feature Updates (2025-10-16)

### 1. Image Display Standardization
- **Admin Dashboard**: Female member photos now use the same aspect ratio (height: 450px) as Member Portal
- Consistent `object-fit: cover` and `object-position: center` across both interfaces
- Toggle button added to switch between original and blurred images in admin view

### 2. Password Management Enhancement
- **Dedicated Password Change Dialog**: Separate from member edit form
- **Password Validation**: Real-time validation with strength indicator (weak/medium/strong)
  - Requirements: 8+ characters, uppercase, lowercase, number
- **Audit Logging**: All password changes logged with timestamp, admin user, and target member
- **Security**: Passwords never displayed or returned in API responses
- **UI Components**:
  - `PasswordChangeDialog.jsx`: Modal for password changes
  - Password strength progress bar with color-coded feedback
  - Last update timestamp and updater displayed

### 3. Member Search Functionality
- **Search Panel Component** (`MemberSearchPanel.jsx`):
  - Age range filter (min/max)
  - Dating type multi-select (A, B1, B2, C, D)
  - Bust cup multi-select (A-G)
  - Freeword search (partial match in name, occupation, hobbies, introduction, foods, locations)
- **Search Persistence**: Filters saved to localStorage and restored on page reload
- **Available on Both Interfaces**:
  - Member Portal (`MemberListPage`)
  - Admin Dashboard (Female members tab)
- **Backend Implementation**: Query parameter filtering in both `/api/members` and `/api/admin/members`

## Important Notes

- This is a PoC (Proof of Concept) - authentication is simplified
- Data is stored in-memory (no persistent database)
- Face detection models need to be downloaded separately for full functionality
- Images are stored locally in filesystem
- CORS is enabled for development
- Image blur is applied automatically on upload (full image blur via Sharp if face-api.js models are not available)

## Face Detection Setup

For face detection to work, download models to `backend/models/`:
- ssdMobilenetv1 model files from @vladmandic/face-api

If models are missing, system falls back to full-image blur using Sharp (10px).
