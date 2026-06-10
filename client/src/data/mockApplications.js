/**
 * @typedef {import('../types/Types.js').JobApplication} JobApplication
 * @typedef {import('../types/Types.js').WorkType} WorkType
 * @typedef {import('../types/Types.js').JobStatus} JobStatus
 */

/**
 * @type {JobApplication[]}
 * Mock job applications in various statuses
 */
export const mockApplications = [
  {
    id: "1",
    companyName: "TechNova",
    jobTitle: "Frontend Developer",
    location: "Tel Aviv, Israel",
    workType: "Hybrid",
    status: "Rejected",
    tags: ["React", "JavaScript"],
    createdAt: "2025-01-01T10:00:00.000Z",
    updatedAt: "2025-01-20T10:00:00.000Z",
    notes: "Nice company",
    appliedDate: "2025-01-05T10:00:00.000Z",
    platform: "LinkedIn",
    nextInterviewDate: "2025-01-10T10:00:00.000Z",
    round: "HR",
    answerDeadline: "2025-01-25T23:59:59.000Z",
    offerAmount: 28000
  },
  {
    id: "2",
    companyName: "Google",
    jobTitle: "Software Engineer",
    workType: "Remote",
    status: "Interviewing",
    tags: ["Backend"],
    createdAt: "2025-02-01T09:00:00.000Z",
    updatedAt: "2025-02-10T12:00:00.000Z",
    appliedDate: "2025-02-02T10:00:00.000Z",
    platform: "Referral",
    nextInterviewDate: "2025-02-15T14:00:00.000Z",
    round: "Technical Interview"
  },
  {
    id: "30",
    companyName: "Meta",
    jobTitle: "Fullstack Developer",
    location: "Haifa, Israel",
    workType: "Hybrid",
    status: "Offer",
    tags: ["Node.js", "React"],
    createdAt: "2025-03-01T08:00:00.000Z",
    updatedAt: "2025-03-15T08:00:00.000Z",
    appliedDate: "2025-03-02T09:00:00.000Z",
    platform: "Website",
    nextInterviewDate: "2025-03-10T11:00:00.000Z",
    round: "Final",
    answerDeadline: "2025-03-25T23:59:59.000Z",
    offerAmount: 35000,
    startingDate: "2025-04-01"
  },
  {
    id: "4",
    companyName: "Amazon",
    jobTitle: "Backend Developer",
    location: "Tel Aviv, Israel",
    workType: "On site",
    status: "Applied",
    tags: ["Java", "AWS"],
    createdAt: "2025-02-20T10:00:00.000Z",
    updatedAt: "2025-02-20T10:00:00.000Z",
    appliedDate: "2025-02-20T10:00:00.000Z",
    platform: "Website"
  },
  {
    id: "5",
    companyName: "StartupX",
    jobTitle: "Frontend Developer",
    workType: "Remote",
    status: "Wishlist",
    tags: ["Vue"],
    createdAt: "2025-04-01T10:00:00.000Z",
    updatedAt: "2025-04-01T10:00:00.000Z"
  },
  {
    id: "60",
    companyName: "Apple",
    jobTitle: "iOS Developer",
    location: "Herzliya, Israel",
    workType: "On site",
    status: "Interviewing",
    tags: ["Swift"],
    createdAt: "2025-01-12T00:00:00.000Z",
    updatedAt: "2025-01-18T00:00:00.000Z",
    appliedDate: "2025-01-13T00:00:00.000Z",
    platform: "Recruiter",
    nextInterviewDate: "2025-01-22T00:00:00.000Z",
    round: "Technical"
  },
  {
    id: "7",
    companyName: "Microsoft",
    jobTitle: "Cloud Engineer",
    workType: "Hybrid",
    status: "Offer",
    tags: ["Azure"],
    createdAt: "2025-02-10T00:00:00.000Z",
    updatedAt: "2025-02-28T00:00:00.000Z",
    appliedDate: "2025-02-11T00:00:00.000Z",
    platform: "Referral",
    answerDeadline: "2025-03-05T00:00:00.000Z",
    offerAmount: 40000
  },
  {
    id: "85",
    companyName: "Wix",
    jobTitle: "Frontend Engineer",
    location: "Tel Aviv",
    workType: "Hybrid",
    status: "Rejected",
    tags: ["React"],
    createdAt: "2025-01-05T00:00:00.000Z",
    updatedAt: "2025-01-25T00:00:00.000Z",
    appliedDate: "2025-01-06T00:00:00.000Z",
    platform: "Website"
  },
  {
    id: "9",
    companyName: "Intel",
    jobTitle: "Embedded Engineer",
    location: "Haifa",
    workType: "On site",
    status: "Interviewing",
    tags: ["C", "Hardware"],
    createdAt: "2025-02-01T00:00:00.000Z",
    updatedAt: "2025-02-10T00:00:00.000Z",
    appliedDate: "2025-02-02T00:00:00.000Z",
    platform: "Friend",
    nextInterviewDate: "2025-02-20T00:00:00.000Z",
    round: "Technical"
  },
  {
    id: "10",
    companyName: "Nvidia",
    jobTitle: "GPU Engineer",
    workType: "On site",
    status: "Applied",
    tags: ["CUDA"],
    createdAt: "2025-03-01T00:00:00.000Z",
    updatedAt: "2025-03-01T00:00:00.000Z",
    appliedDate: "2025-03-01T00:00:00.000Z",
    platform: "Website"
  },
  {
    id: "11",
    companyName: "Monday",
    jobTitle: "Fullstack Developer",
    workType: "Hybrid",
    status: "Wishlist",
    tags: ["React", "Node"],
    createdAt: "2025-04-02T00:00:00.000Z",
    updatedAt: "2025-04-02T00:00:00.000Z"
  },
  {
    id: "122",
    companyName: "Salesforce",
    jobTitle: "Backend Engineer",
    workType: "Remote",
    status: "Offer",
    tags: ["Java"],
    createdAt: "2025-01-10T00:00:00.000Z",
    updatedAt: "2025-01-30T00:00:00.000Z",
    appliedDate: "2025-01-11T00:00:00.000Z",
    platform: "LinkedIn",
    answerDeadline: "2025-02-10T00:00:00.000Z",
    offerAmount: 37000
  },
  {
    id: "13",
    companyName: "Oracle",
    jobTitle: "Database Engineer",
    status: "Rejected",
    workType: "On site",
    createdAt: "2025-02-05T00:00:00.000Z",
    updatedAt: "2025-02-20T00:00:00.000Z",
    appliedDate: "2025-02-06T00:00:00.000Z"
  },
  {
    id: "14",
    companyName: "Stripe",
    jobTitle: "Backend Developer",
    status: "Interviewing",
    workType: "Remote",
    createdAt: "2025-03-01T00:00:00.000Z",
    updatedAt: "2025-03-10T00:00:00.000Z",
    appliedDate: "2025-03-02T00:00:00.000Z",
    nextInterviewDate: "2025-03-15T00:00:00.000Z",
    round: "System Design"
  },
  {
    id: "15",
    companyName: "Spotify",
    jobTitle: "Data Engineer",
    status: "Applied",
    workType: "Remote",
    createdAt: "2025-02-01T00:00:00.000Z",
    updatedAt: "2025-02-01T00:00:00.000Z",
    appliedDate: "2025-02-01T00:00:00.000Z"
  },
  {
    id: "16",
    companyName: "Airbnb",
    jobTitle: "Frontend Engineer",
    status: "Wishlist",
    workType: "Remote",
    createdAt: "2025-04-03T00:00:00.000Z",
    updatedAt: "2025-04-03T00:00:00.000Z"
  },
  {
    id: "17",
    companyName: "Dropbox",
    jobTitle: "Fullstack Engineer",
    status: "Interviewing",
    workType: "Remote",
    createdAt: "2025-01-15T00:00:00.000Z",
    updatedAt: "2025-01-25T00:00:00.000Z",
    appliedDate: "2025-01-16T00:00:00.000Z",
    nextInterviewDate: "2025-01-28T00:00:00.000Z",
    round: "Technical"
  },
  {
    id: "52",
    companyName: "Uber",
    jobTitle: "Backend Engineer",
    status: "Offer",
    workType: "Hybrid",
    createdAt: "2025-02-10T00:00:00.000Z",
    updatedAt: "2025-02-20T00:00:00.000Z",
    appliedDate: "2025-02-11T00:00:00.000Z",
    answerDeadline: "2025-03-01T00:00:00.000Z",
    offerAmount: 36000
  },
  {
    id: "18",
    companyName: "Lyft",
    jobTitle: "Mobile Developer",
    status: "Rejected",
    workType: "Remote",
    createdAt: "2025-03-05T00:00:00.000Z",
    updatedAt: "2025-03-15T00:00:00.000Z",
    appliedDate: "2025-03-06T00:00:00.000Z"
  },
  {
    id: "87",
    companyName: "Fiverr",
    jobTitle: "Frontend Developer",
    status: "Applied",
    workType: "Hybrid",
    createdAt: "2025-04-01T00:00:00.000Z",
    updatedAt: "2025-04-01T00:00:00.000Z",
    appliedDate: "2025-04-01T00:00:00.000Z",
    platform: "Website"
  }
];
