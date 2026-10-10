// Portfolio content shared by every theme. Edit this file to change what all themes show;
// each theme adds its own flavour (lore, card art, map positions) in its own files.
window.CONTENT = {
  person: {
    name: "Pietro Adamvoski",
    title: "Software Engineer",
    email: "pietrovos@gmail.com",
    github: "https://github.com/pietrovos",
    linkedin: "https://www.linkedin.com/in/pietroadamvoski/",
    resume: "assets/Pietro_Adamvoski_Resume.pdf",
  },

  projects: [
    {
      id: "supportlens",
      name: "SupportLens",
      kind: "AI helpdesk with cited drafts",
      stack: ["Python", "FastAPI", "React", "PostgreSQL", "pgvector", "Celery", "S3", "Claude API"],
      url: "https://github.com/pietrovos/knowledge-base-helpdesk",
      points: [
        "Some of a company's help docs are restricted to certain staff, like billing procedures. An AI writing a reply could pull from a page the person isn't allowed to see, and if the reply doesn't say where its answer came from, nobody can check it.",
        "I built a helpdesk where an AI model drafts ticket replies from a knowledge base, with each claim linking to the passage it came from. The model sits behind a provider interface (Claude by default), so a different one can be plugged in.",
        "The permission check is built into the database search itself, so it only looks through documents the person is allowed to read. Checking permissions after the search would mean one missed check could expose restricted text.",
        "In an offline run of my 35-question eval set it made the right answer-or-refuse call on 28 of 35 and refused 6 of 8 questions it shouldn't answer. Deleting the permission filter breaks 10 of 12 retrieval tests."
      ]
    },
    {
      id: "fulfillops",
      name: "FulfillOps",
      kind: "Order and inventory operations console",
      stack: ["Java 21", "Spring Boot", "PostgreSQL", "Angular", "Testcontainers", "Terraform"],
      url: "https://github.com/pietrovos/order-fulfillment-system",
      points: [
        "When two reps order the last units of a product at the same moment, a simple stock check can confirm both orders. A carrier request that times out and gets retried can also ship the same parcel twice.",
        "I built an order and inventory console in Spring Boot and Angular with stock reservations, an order state machine and a stock ledger that a Postgres trigger keeps append-only.",
        "Two orders arriving at once could both see one unit left, a classic race condition. I replaced that read-then-write logic with one conditional UPDATE backed by a CHECK constraint, and gave each carrier booking a unique request ID, saved before the first try, so a retried request gets back the original booking instead of creating a second one.",
        "To prove the fix works, I put the old read-then-write version back on purpose and ran a test 50 times where two orders for 7 units hit a product with 10 in stock at the same moment. The old version let both orders through in 48 of 50 runs. The backend has 176 tests that run against a real PostgreSQL database, started fresh in a throwaway Docker container (Testcontainers) for each run."
      ]
    },
    {
      id: "scopeflow",
      name: "ScopeFlow",
      kind: "Multi-tenant SaaS for agency scope changes",
      stack: ["TypeScript", "Next.js", "NestJS", "PostgreSQL"],
      url: "https://github.com/pietrovos/agency-project-management",
      points: [
        "Agencies lose money when a project slowly grows beyond what was agreed (scope creep) and nobody can prove which version of a change the client approved. Two people editing the same proposal can also overwrite each other's work.",
        "I built a multi-tenant SaaS in Next.js and NestJS, where many agencies share one app but each one's data stays private. Proposals are saved as immutable revisions and an approval is tied to the exact revision the client saw. If two people edit the same proposal, the second save is blocked and shows both versions side by side, much like a merge conflict in Git, so nobody's changes get silently overwritten.",
        "Instead of trusting every piece of code to only ask for the right agency's data, the database itself enforces it with PostgreSQL row-level security, so one forgotten check can't expose another agency's projects.",
        "To test it, I sent requests to 21 parts of the app using another agency's IDs. With row-level security switched off, 9 of the 21 leaked or changed that agency's data; with it switched on, none did."
      ]
    },
    {
      id: "jobpilot",
      name: "JobPilot",
      kind: "Job application tracker",
      stack: ["TypeScript", "Next.js", "React", "Prisma", "SQLite"],
      url: "https://github.com/pietrovos/jobpilot",
      points: [
        "During my own job search, applications, notes, interviews and resumes ended up spread across a spreadsheet and folders, and copying each posting in by hand was slow.",
        "I built a self-hosted tracker in Next.js, Prisma and SQLite with a Save to JobPilot bookmark button. Clicking it on a job posting reads the page already open in your browser and fills in the company, role, location and description. It works on LinkedIn, Indeed, Workday, Greenhouse, Lever, Ashby, Workable, SmartRecruiters and most company career pages, plus Canadian government job sites like Job Bank, GC Jobs, the City of Ottawa, Canada Post, the Bank of Canada and CSE.",
        "Each application keeps its status history, notes in folders, interview rounds, emails and offer details together. A document library stores each resume once so it can be attached to many applications.",
        "The dashboard shows applications as detailed cards, a compact list, or a board with a column per status, where dragging a card changes its status. Search, filters and grouping by the day you applied make any application quick to find."
      ]
    },
    {
      id: "scheduler",
      name: "Smart Scheduler",
      kind: "Carleton engineering capstone",
      stack: ["TypeScript", "PostgreSQL", "Prisma", "Express", "React"],
      url: "https://github.com/SafiullahRattar/capstone-scheduler",
      points: [
        "Carleton students plan each term by hand, cross-checking their degree audit, prerequisites and the timetable to find courses they can take without a clash.",
        "Smart Scheduler reads a student's degree audit and shows which courses they've completed and which they still need. The student picks from the courses they have the prerequisites for, and it generates all possible conflict-free timetables for that selection.",
        "Prerequisite rules are stored as trees in PostgreSQL, so nested AND/OR conditions, minimum grades and year standing can all be checked.",
        "Courses a student can't take yet are listed with the reason, such as a missing prerequisite or a term the course isn't offered in."
      ]
    },
    {
      id: "drones",
      name: "Firefighting Drone Swarm",
      kind: "Real-time control-system simulation",
      stack: ["Java", "UDP", "Maven", "JUnit", "Swing"],
      url: "https://github.com/pietrovos/firefighting-drone-simulator",
      points: [
        "Co-developed a distributed Java/UDP simulation; built the initial Scheduler and Fire Incident subsystems.",
        "Completed fault recovery and reassignment for stuck, communication and nozzle faults, with JUnit coverage.",
        "Built the live Swing dashboard and the configurable 20-drone demo with incident, telemetry, fault and metrics views."
      ]
    }
  ],

  // level = how central the skill is to my work (1–3). Groups: Language, Web, Data, Craft.
  // The Balatro theme uses the first 12, in this order.
  skills: [
    { name: "TypeScript", level: 3, group: "Language", desc: "My main language: Next.js and React frontends, NestJS and Express APIs, and Prisma for data access." },
    { name: "Java", level: 3, group: "Language", desc: "Java 21 services built around correctness (atomic stock reservations, an order state machine, an append-only ledger) and a UDP drone-swarm simulation with a Swing dashboard." },
    { name: "PostgreSQL", level: 3, group: "Data", desc: "Where I put the rules that must hold: constraints, row locks, row-level security for tenants, append-only triggers, full-text search and pgvector." },
    { name: "Testing", level: 3, group: "Craft", desc: "JUnit 5, Testcontainers, pytest, Vitest and Playwright, including tests that race real requests to prove nothing is sold or booked twice." },
    { name: "Spring Boot", level: 2, group: "Web", desc: "Spring Security with JWT, Data JPA, Flyway migrations and Spring Modulith boundaries." },
    { name: "Node.js / NestJS", level: 2, group: "Web", desc: "NestJS and Express APIs with Zod validation, guards, Socket.IO for live updates and idempotent Stripe webhooks." },
    { name: "React / Next.js", level: 2, group: "Web", desc: "App Router and server components, TanStack Query and Tailwind; Angular with signals on FulfillOps." },
    { name: "Python / FastAPI", level: 2, group: "Language", desc: "FastAPI and SQLAlchemy services, Celery ingestion pipelines and evaluation suites." },
    { name: "Auth & Access Control", level: 2, group: "Craft", desc: "Keycloak and OIDC, JWT, roles checked on the server, and Postgres row-level security so tenant isolation holds on every query." },
    { name: "LLM Integration", level: 2, group: "Data", desc: "Grounded drafting with the Claude API: permission-filtered hybrid search, verified citations, evals, and a circuit breaker for provider outages." },
    { name: "Docker, CI & AWS", level: 2, group: "Craft", desc: "Docker Compose stacks, GitHub Actions pipelines, and AWS ECS deployments defined in Terraform and the AWS CDK." },
    { name: "Background Jobs", level: 1, group: "Data", desc: "Celery on Redis with exponential backoff and idempotent re-processing, plus a Postgres transactional outbox for Java jobs." },
    { name: "C / C++", level: 1, group: "Language", desc: "Operating-systems work: Unix processes coordinated with System V shared memory and semaphores, plus CPU scheduler and interrupt-handling simulators." },
    { name: "Machine Learning", level: 1, group: "Data", desc: "PyTorch feedforward networks for network intrusion classification, MDP value iteration and tabular Q-learning for CPU frequency scaling, and A* search over weighted grids." }
  ],

  // Oldest first.
  experience: [
    { id: "ubreakifix", org: "uBreakiFix", title: "Electronics Repair Technician", when: "June 2020 – September 2021", where: "Kanata, ON",
      points: ["Diagnosed and repaired hardware, software and connectivity faults.", "Tested every repair before returning devices to customers.", "Managed parts inventory and processed warranty repairs."] },
    { id: "carleton", org: "Carleton University", title: "Bachelor of Software Engineering", when: "Graduated July 2026", where: "Ottawa, ON",
      points: ["Capstone: Smart Scheduler, a course-planning app with prerequisite trees.", "Real-time and distributed systems: the firefighting drone swarm."] },
    { id: "next", org: "The Next Chapter", title: "Software Engineer", when: "Now", where: "Open to roles",
      points: ["Looking for full-stack or backend roles.", "Find me under Contact."] }
  ]
};
