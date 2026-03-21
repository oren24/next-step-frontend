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

Data structure is ready for backend integration:
- JobApplication type with comprehensive fields
- Company information integration
- Tag-based categorization system

> Note: Data resets on refresh because there is no API/storage layer connected yet.

## ⚡ Performance Notes

- Route pages are loaded with `React.lazy` + `Suspense` via `src/routes/AppRoutes.jsx` to reduce initial bundle cost.
- Excel export is loaded on demand from `src/components/layout/ViewToggleBar.jsx` so `exceljs` is not part of the initial page payload.

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

### Creating a PR
When submitting a pull request:
1. Create a feature branch from the appropriate base
2. Make your changes with clear commit messages
3. Include a detailed PR description
4. Test thoroughly before submitting
5. Request review from team members

## 📝 Development Guidelines

- Follow the existing code structure and naming conventions
- Use MUI components for UI consistency
- Write clear, descriptive commit messages
- Test features in both light and dark modes
- Ensure responsive design for mobile devices
- Document complex logic with comments

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add YourFeature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💼 Authors

- [Oren Drori](https://github.com/oren24)
- [Rima Rabinovich Brikman](https://github.com/RimaRabinovich)

---

**Last Updated**: March 2026
**Version**: 1.0.0-beta
