// The agency's published vacancies, as data. Edit this list to change what
// `npm run seed:jobs` publishes (or use the Create Vacancy screen in the app).
// These are real postings for the live site, not mock data.
//
// Closing dates are set relative to the day the seed runs.

type Posting = {
  title: string;
  department: string;
  numPositions: number;
  requiredSkills: string;
  description: string;
  closesInDays: number;
};

export const POSTINGS: Posting[] = [
  {
    title: "Senior Frontend Developer",
    department: "Engineering",
    numPositions: 2,
    requiredSkills: "React, TypeScript, Tailwind CSS, REST APIs, Accessibility, Git",
    description:
      "Build and maintain the web applications our clients rely on every day. You will turn designs into fast, accessible interfaces, review code, and mentor junior developers.",
    closesInDays: 45,
  },
  {
    title: "Backend Engineer (Node.js)",
    department: "Engineering",
    numPositions: 2,
    requiredSkills: "Node.js, TypeScript, PostgreSQL, REST API design, Docker, Testing",
    description:
      "Design and ship reliable APIs and background services. You will own features end to end, from database schema to deployment, and keep the platform secure and observable.",
    closesInDays: 45,
  },
  {
    title: "UI/UX Designer",
    department: "Design",
    numPositions: 1,
    requiredSkills: "Figma, User research, Design systems, Prototyping, Accessibility",
    description:
      "Shape clear, humane product experiences. You will run research, design flows and components, and work closely with engineers so what ships matches what was designed.",
    closesInDays: 50,
  },
  {
    title: "Accountant",
    department: "Finance",
    numPositions: 1,
    requiredSkills: "Bookkeeping, Bank reconciliation, IFRS, Excel, Tax compliance",
    description:
      "Keep our books accurate and audit-ready. You will manage payables and receivables, prepare monthly reconciliations and reports, and support statutory filings.",
    closesInDays: 40,
  },
  {
    title: "Marketing Executive",
    department: "Marketing",
    numPositions: 1,
    requiredSkills: "Content writing, Social media, Email campaigns, Analytics, Event coordination",
    description:
      "Grow awareness of our services through clear content and well-run campaigns. You will plan and publish across channels, track results, and coordinate events with partners.",
    closesInDays: 40,
  },
  {
    title: "Customer Support Lead",
    department: "Customer Support",
    numPositions: 1,
    requiredSkills: "Team leadership, Escalation handling, Ticketing tools, Clear writing, Empathy",
    description:
      "Lead a small support team and set the standard for how we help customers. You will coach the team, handle escalations, and turn recurring issues into product and process fixes.",
    closesInDays: 35,
  },
];
