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
        "Support docs often include restricted pages like billing runbooks, and an AI reply that quotes one to an agent without access is a leak. A reply with no sources also can't be checked.",
        "I built a helpdesk where Claude drafts ticket replies from a knowledge base, with each claim linking to the passage it came from. Uploads go through a Celery pipeline that chunks, embeds and versions each document.",
        "The hard part was keeping restricted text out of the prompt. I put the permission filter inside the hybrid search SQL (pgvector plus Postgres full-text, fused with RRF), so it runs before ranking and restricted chunks never reach the app.",
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
        "The hardest part was the race on the last unit. I replaced read-then-write logic with one conditional UPDATE backed by a CHECK constraint, and saved each carrier booking's idempotency key before the first attempt so retries return the original booking.",
        "Swapping my guarded reservation for a check-then-act version failed 48 of 50 concurrent races in my mutation check. The backend has 176 tests that run against real PostgreSQL in Testcontainers."
      ]
    },
    {
      id: "scopeflow",
      name: "ScopeFlow",
      kind: "Multi-tenant SaaS for agency scope changes",
      stack: ["TypeScript", "Next.js", "NestJS", "PostgreSQL"],
      url: "https://github.com/pietrovos/agency-project-management",
      points: [
        "Agencies lose money on scope creep when nobody can prove which version of a change the client approved, or when two people editing the same proposal overwrite each other.",
        "I built a multi-tenant SaaS in Next.js and NestJS where proposals are saved as immutable revisions and an approval is tied to the exact revision the client saw. A stale edit gets a 409 and a field-by-field conflict view.",
        "The hard part was tenant isolation. I enforced it in Postgres with row-level security set per transaction, so a query that forgets its org filter still can't read another org's rows.",
        "My isolation test reads the route list from the running app, sends another org's IDs to 33 of its 39 endpoints, and compares hashes of that org's rows before and after."
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
        "I built a self-hosted tracker in Next.js, Prisma and SQLite. Pasting a posting link fills in the company, role, salary and description from Greenhouse, Lever, SmartRecruiters, Workable or Workday.",
        "The hard part was the importer, since it fetches whatever URL gets pasted. It only allows public HTTPS pages, checks each redirect, rejects private addresses and pins the resolved IP before reading the page.",
        "I wrote 53 backend tests on throwaway SQLite databases, covering ownership triggers and moving a guest's work into a new account, and tested the job-site parsers against 6 recorded API responses."
      ]
    },
    {
      id: "scheduler",
      name: "Smart Scheduler",
      kind: "Carleton engineering capstone",
      stack: ["TypeScript", "PostgreSQL", "Prisma", "Express", "React"],
      url: "https://github.com/pietrovos/carleton-smart-scheduler",
      points: [
        "Carleton students plan each term by hand, checking their degree audit, course prerequisites and the timetable to find courses they can take without a clash.",
        "In a four-person capstone group, I designed the PostgreSQL schema and Prisma models for a planner that reads a student's audit and builds conflict-free timetables.",
        "The hard part was storing prerequisite rules with nested AND/OR conditions, minimum grades and year standing. I modeled them as trees of nodes and helped write the recursive checker that tells a student which requirement is missing.",
        "The database holds prerequisite trees for 322 of 348 courses. Our 107 unit tests include parsing 16 simulated audits and comparing each one with the student history it was generated from."
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
