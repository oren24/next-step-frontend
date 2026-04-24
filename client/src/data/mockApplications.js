/**
 * @typedef {import('../types/Types.js').JobApplication} JobApplication
 * @typedef {import('../types/Types.js').WorkType} WorkType
 * @typedef {import('../types/Types.js').JobStatus} JobStatus
 */

import { mockCompanies } from './mockCompanies.js';

/**
 * @type {JobApplication[]}
 * Mock job applications in various statuses
 */
export const mockApplications = [
  {
    id: "ja1",
    companyName: "Google",
    companyLogo: mockCompanies[0].companyLogo,
    jobTitle: "Senior Frontend Engineer",
    jobUrl: "https://careers.google.com/jobs/senior-frontend",
    location: "Mountain View, CA",
    workType: "Remote",
    status: "Interviewing",
    tags: ["Frontend", "React", "Senior"],
    createdAt: "2025-12-15T10:30:00Z",
    updatedAt: "2026-01-20T14:45:00Z",
    appliedDate: "2025-12-15T10:30:00Z",
    platform: "LinkedIn",
    notes: "Strong technical interview, waiting for system design round",
    nextInterviewDate: "2026-02-10T15:00:00Z",
    round: "System Design Round"
  },
  {
    id: "ja2",
    companyName: "Meta",
    companyLogo: mockCompanies[1].companyLogo,
    jobTitle: "Full Stack Engineer",
    jobUrl: "https://www.metacareers.com/jobs/fullstack",
    location: "Tel Aviv, Israel",
    workType: "On site",
    status: "Applied",
    tags: ["Fullstack", "React", "Node.js"],
    createdAt: "2026-01-05T09:15:00Z",
    updatedAt: "2026-01-05T09:15:00Z",
    appliedDate: "2026-01-05T09:15:00Z",
    platform: "Company Website",
    notes: "Applied via careers portal, awaiting response"
  },
  {
    id: "ja3",
    companyName: "Wix",
    companyLogo: mockCompanies[2].companyLogo,
    jobTitle: "Backend Engineer",
    jobUrl: "https://www.wix.com/careers/backend",
    location: "Tel Aviv, Israel",
    workType: "Hybrid",
    status: "Offer",
    tags: ["Backend", "Node.js", "Mid-Level"],
    createdAt: "2025-11-20T11:00:00Z",
    updatedAt: "2026-01-25T16:30:00Z",
    appliedDate: "2025-11-20T11:00:00Z",
    platform: "LinkedIn",
    notes: "Offer received! Base salary 180K ILS",
    answerDeadline: "2026-02-08T23:59:59Z",
    offerAmount: 180000,
    offerCurrency: "ILS"
  },
  {
    id: "ja4",
    companyName: "Monday.com",
    companyLogo: mockCompanies[3].companyLogo,
    jobTitle: "React Developer",
    jobUrl: "https://jobs.monday.com/react-developer",
    location: "Tel Aviv, Israel",
    workType: "Hybrid",
    status: "Rejected",
    tags: ["Frontend", "React", "Junior"],
    createdAt: "2025-10-15T13:20:00Z",
    updatedAt: "2025-12-10T10:00:00Z",
    appliedDate: "2025-10-15T13:20:00Z",
    platform: "LinkedIn",
    notes: "Rejected after final interview round"
  },
  {
    id: "ja5",
    companyName: "Amazon",
    companyLogo: mockCompanies[5].companyLogo,
    jobTitle: "Solutions Architect",
    jobUrl: "https://amazon.jobs/solutions-architect",
    location: "Remote",
    workType: "Remote",
    status: "Wishlist",
    tags: ["Backend", "Corporate", "Senior"],
    createdAt: "2026-01-18T08:45:00Z",
    updatedAt: "2026-01-18T08:45:00Z",
    notes: "Interested but waiting for right moment to apply"
  },
  {
    id: "ja6",
    companyName: "Microsoft",
    companyLogo: mockCompanies[6].companyLogo,
    jobTitle: "Cloud Engineer",
    jobUrl: "https://careers.microsoft.com/cloud-engineer",
    location: "Remote",
    workType: "Remote",
    status: "Interviewing",
    tags: ["Backend", "Node.js", "Senior"],
    createdAt: "2025-12-01T10:00:00Z",
    updatedAt: "2026-01-28T12:30:00Z",
    appliedDate: "2025-12-01T10:00:00Z",
    platform: "Company Website",
    notes: "Passed initial screening, scheduled for technical interview",
    nextInterviewDate: "2026-02-05T14:00:00Z",
    round: "Technical Interview"
  },
  {
    id: "ja7",
    companyName: "Spotify",
    companyLogo: mockCompanies[7].companyLogo,
    jobTitle: "Frontend Engineer",
    jobUrl: "https://www.spotifyjobs.com/frontend",
    location: "Stockholm, Sweden",
    workType: "Hybrid",
    status: "Applied",
    tags: ["Frontend", "React", "Mid-Level"],
    createdAt: "2026-01-12T14:30:00Z",
    updatedAt: "2026-01-12T14:30:00Z",
    appliedDate: "2026-01-12T14:30:00Z",
    platform: "LinkedIn",
    notes: "Application sent, awaiting recruiter contact"
  },
  {
    id: "ja8",
    companyName: "TechNova",
    companyLogo: mockCompanies[4].companyLogo,
    jobTitle: "Junior Fullstack Developer",
    jobUrl: "https://technova.startup.com/jobs/fullstack",
    location: "Tel Aviv, Israel",
    workType: "On site",
    status: "Interviewing",
    tags: ["Fullstack", "React", "Startup", "Junior"],
    createdAt: "2025-12-20T09:00:00Z",
    updatedAt: "2026-01-22T11:15:00Z",
    appliedDate: "2025-12-20T09:00:00Z",
    platform: "AngelList",
    notes: "Startup culture interview passed, pending technical assessment",
    nextInterviewDate: "2026-02-06T10:00:00Z",
    round: "Coding Challenge"
  },
  {
    id: "ja9",
    companyName: "Airbnb",
    companyLogo: mockCompanies[8].companyLogo,
    jobTitle: "Senior Fullstack Engineer",
    jobUrl: "https://airbnb.com/careers/senior-fullstack",
    location: "Remote",
    workType: "Remote",
    status: "Wishlist",
    tags: ["Fullstack", "React", "Node.js", "Corporate", "Senior"],
    createdAt: "2026-01-25T16:00:00Z",
    updatedAt: "2026-01-25T16:00:00Z",
    notes: "Dream job, planning to apply next quarter"
  },
  {
    id: "ja10",
    companyName: "Stripe",
    companyLogo: mockCompanies[9].companyLogo,
    jobTitle: "Backend Engineer",
    jobUrl: "https://stripe.com/jobs/backend-engineer",
    location: "San Francisco, CA",
    workType: "Hybrid",
    status: "Rejected",
    tags: ["Backend", "Node.js", "Senior"],
    createdAt: "2025-11-10T10:30:00Z",
    updatedAt: "2025-12-30T09:00:00Z",
    appliedDate: "2025-11-10T10:30:00Z",
    platform: "LinkedIn",
    notes: "Did not advance past initial technical assessment"
  }
];
