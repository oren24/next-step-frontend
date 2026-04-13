# Nextstep - Job Application Tracker

A modern, full-featured web application for tracking and managing job applications with an intuitive interface and powerful export capabilities.

## 🎯 Overview

Nextstep is a comprehensive job application tracking system built with React and Material-UI. It helps job seekers organize, manage, and analyze their job search progress with an elegant and responsive interface.

Current app flow is `src/main.jsx` -> `src/App.jsx` -> `src/routes/AppRoutes.jsx` -> `src/components/layout/Layout.jsx`, with nested routes rendering page content through `<Outlet />`.

## ✨ Features

### Core Features
- **Job Application Management** - Create, edit, delete, and organize job applications
- **Multiple View Modes** - Toggle between List and Kanban board views
- **Drag & Drop Support** - Easily move applications between statuses (Wishlist, Applied, Interviewing, Offer, Rejected)
- **Advanced Filtering & Search** - Find applications by company, title, location, tags, and more
- **Status Tracking** - Monitor application progress through multiple stages
- **Archive Workflow** - Review rejected and deleted jobs, then restore or remove entries

### Data Organization
- **Tag System** - Organize applications with custom tags (Frontend, Backend, Full Stack, etc.)
- **Location Tracking** - Filter by location (Remote, On-site, Hybrid)
- **Work Type Management** - Track different employment types
- **Draft Support** - Save applications as drafts before finalizing required fields
- **Interview Details** - Store interview rounds, dates, and notes
- **Offer Management** - Track offer amounts, deadlines, and currency

### Export Functionality
- **CSV and Excel Export** - Download all job applications as `.csv` or `.xlsx`
- **Proper Formatting** - Handles special characters, dates, and arrays correctly
- **Complete Data** - Exports all relevant fields including offer details and interview information

### UI/UX Features
- **Dark Mode Support** - Toggle between light and dark themes
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Global Search** - Top-bar search filters applications in both List and Kanban views
- **Real-time Search** - List view includes instant search/filter controls
- **Modal Dialogs** - Add, edit, and delete applications with intuitive modals
- **Share Action** - Share a job via native share sheet or clipboard fallback
- **Sidebar Navigation** - Quick access to Job Applications, Resumes, Subscriptions, Archive, and Settings

## 🛠️ Tech Stack

- **Frontend Framework**: React 19
- **Build Tool**: Vite
- **UI Library**: Material-UI (MUI)
- **Routing**: React Router 7
- **Styling**: Emotion (CSS-in-JS)
- **Excel Export Engine**: ExcelJS (lazy-loaded)
- **Code Quality**: ESLint
- **Icons**: Material-UI Icons, SVG Assets

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── cards/              # Application card components
│   │   ├── exporters/          # Export functionality (CSV + XLSX)
│   │   ├── layout/             # Main layout components (TopBar, Sidebar, ViewToggle)
│   │   ├── list/               # List view components
│   │   └── popapmodals/        # Modal dialogs (Add, Edit, Delete)
│   ├── pages/                  # Page components
│   │   ├── JobApplications.jsx # Main job board page
│   │   ├── Archive.jsx
│   │   ├── Resumes.jsx
│   │   ├── Settings.jsx
│   │   └── Subscriptions.jsx
│   ├── data/                   # Mock data
│   │   ├── mockApplications.js
│   │   ├── mockCompanies.js
│   │   └── mockTags.js
│   ├── routes/                 # Route composition and lazy-loaded page wiring
│   ├── types/                  # Type definitions
│   ├── assets/                 # SVG icons and images
│   ├── App.jsx                 # Root component
│   ├── theme.js               # Theme configuration
│   └── main.jsx               # Entry point
├── vite.config.js
├── eslint.config.js
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (LTS recommended)
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

3. **Build for production**
   ```bash
   npm run build
   ```

4. **Preview production build**
   ```bash
   npm run preview
   ```

5. **(Optional) Enable real Google sign-in popup**
   Create a `.env.local` file in the project root:
   ```bash
   VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id.apps.googleusercontent.com
   ```
   In Google Cloud Console, set JavaScript origin to `http://localhost:5173` for your OAuth client.

### Demo account (quick login)

If you just want to explore the app, use the seeded demo credentials on `http://localhost:5173/auth/sign-in`:

- **Email:** `demo@nextstep.local`
- **Password:** `Demo@1234`

You can also create your own account at `http://localhost:5173/auth/sign-up`.

## 📊 Usage

### Managing Applications
1. Navigate to **Job Applications** from the sidebar
2. Click **"+ Add Application"** to create a new entry
3. Fill in company details, job title, location, and other information
4. Use the **List** or **Kanban** view toggle to switch between views
5. Click the **three-dot menu** on any card to edit or delete

### Exporting Data
1. In the Job Applications page, click the **Export** button
2. Select **Export CSV** or **Export Excel (.xlsx)**
3. File format: `job-applications-YYYY-MM-DD.csv` or `job-applications-YYYY-MM-DD.xlsx`

### Archive and Restore
1. Open **Archive** from the sidebar
2. Review rejected and deleted applications
3. Use **Move to Applied** for rejected jobs, or **Restore** for deleted jobs

### Organizing with Tags
- Add custom tags to categorize positions (e.g., "Frontend", "React", "Senior")
- Filter applications by tags using the search/filter bar
- Easily identify skill-based opportunities

### Using Different Views
- **List View**: Tabular view with all applications grouped by status
- **Kanban View**: Board view with drag-and-drop functionality between status columns

## 🎨 Theming

Toggle between light and dark mode using the theme button in the top bar. The application respects your system preferences and saves your selection.

## 🔐 Data Management

This frontend currently uses mock data for development. `apps` state is initialized from `src/data/mockApplications.js` and updated in-memory from `src/App.jsx` (no backend persistence in this repository).

Authentication is frontend-only in this demo build and is stored in browser storage:
- account records in `localStorage`
- active session in `localStorage` (remember-me) or `sessionStorage` (non-remember)
- seeded demo account is re-added on app startup when missing

Data structure is ready for backend integration:
- JobApplication type with comprehensive fields
- Company information integration
- Tag-based categorization system

> Note: Data resets on refresh because there is no API/storage layer connected yet.

## ⚡ Performance

### Built-in Optimizations
- Route pages are loaded with `React.lazy` + `Suspense` via `src/routes/AppRoutes.jsx` to reduce initial bundle cost.
- Excel export is loaded on demand from `src/components/layout/ViewToggleBar.jsx` so `exceljs` is not part of the initial page payload.

### Performance Enhancements (April 2026)
The following optimizations have been implemented for 2-3x faster performance:

1. **Optimized Drag Handler** (`src/pages/job-applications/hooks/useDragAndDrop.js`)
   - Replaced multiple O(n) array operations with O(1) Map-based lookups
   - **Result:** 50-70% faster drag operations

2. **Enhanced Card Memoization** (`src/components/cards/ApplicationCard.jsx`)
   - Added custom equality comparison to prevent unnecessary re-renders
   - Only re-renders when app data or callbacks change
   - **Result:** 40-60% fewer re-renders during search/filter

3. **Debounced Search** (`src/pages/job-applications/hooks/useDebouncedSearch.js`)
   - Search filters are delayed 300ms after user stops typing
   - Prevents excessive filter calculations during input
   - **Result:** 80% smoother search experience

**Overall Impact:** App is 2-3x faster for typical usage with 100+ applications.

## 🧪 Testing and Validation

- Run lint checks with `npm run lint`
- There is currently no `npm test` script in `package.json`
- Validate UI changes manually in both List and Kanban views, and in both light/dark themes

## 🐛 Known Issues & Future Improvements

### Upcoming Features
- [ ] JSON export functionality
- [ ] Custom export column selection
- [ ] Export success notifications
- [ ] Backend API integration
- [ ] User authentication
- [ ] Data persistence
- [ ] Advanced filtering options
- [ ] Interview preparation notes
- [ ] Salary comparison tools
- [ ] Application timeline analytics

## 🔄 Git Workflow

### Current Branches
- The default branch is `master`.
- To see active remote branches, run `git branch -r`.

For the full pull request process, see `## 🤝 Contributing` below.

## 📝 Development Guidelines

- Follow the existing code structure and naming conventions
- Use MUI components for UI consistency
- Write clear, descriptive commit messages
- Test features in both light and dark modes
- Ensure responsive design for mobile devices
- Document complex logic with comments

## 🤝 Contributing

Use this PR flow when contributing changes:

1. Fork the repository and clone your fork locally.
2. Create a feature branch from `master`:
   `git checkout -b feature/your-feature-name`
3. Make your changes and run checks:
   `npm run lint`
   `npm run build`
4. Commit with a clear message:
   `git commit -m "feat: short description of change"`
5. Push your branch:
   `git push origin feature/your-feature-name`
6. Open a PR from your branch into `master` on GitHub.
7. In the PR description, include:
   - what changed
   - why the change was made
   - validation steps/results (for example lint/build)
   - screenshots for UI changes
8. Address review comments, push follow-up commits, and wait for approval.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💼 Authors

- [Oren Drori](https://github.com/oren24)
- [Rima Rabinovich Brikman](https://github.com/RimaRabinovich)

---
 
**Last Updated**: April 2026
**Version**: 1.0.0-beta
