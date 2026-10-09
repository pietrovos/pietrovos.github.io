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
        "Agents answer tickets with drafted replies that cite the knowledge base passages they came from.",
        "Hybrid search (pgvector + Postgres full-text, fused with RRF) applies permission filters inside the SQL, before ranking.",
        "Every citation is checked against the chunks actually retrieved; unknown IDs are stripped, weak evidence returns \"insufficient evidence\".",
        "Versioned ingestion pipeline with retries and idempotent re-processing, plus an eval suite for citation correctness and refusals."
      ]
    },
    {
      id: "fulfillops",
      name: "FulfillOps",
      kind: "Order and inventory operations console",
      stack: ["Java 21", "Spring Boot", "PostgreSQL", "Angular", "Testcontainers", "Terraform"],
      url: "https://github.com/pietrovos/order-fulfillment-system",
      points: [
        "Stock reservations that stay correct under concurrent load, so the last unit is never sold twice.",
        "An order state machine that refuses illegal transitions, and an append-only stock ledger for auditing.",
        "Carrier integration that never books the same parcel twice, even when the network loses the response.",
        "Tested with JUnit 5, Testcontainers, Vitest and Playwright; deployable to AWS ECS with Terraform."
      ]
    },
    {
      id: "scopeflow",
      name: "ScopeFlow",
      kind: "Multi-tenant SaaS for agency scope changes",
      stack: ["TypeScript", "Next.js", "NestJS", "PostgreSQL"],
      url: "https://github.com/pietrovos/agency-project-management",
      points: [
        "Agencies propose scope changes with price and schedule impact; clients approve one specific revision.",
        "Stale edits get a 409 and a diff instead of silently overwriting someone else's work.",
        "Append-only audit log and live comments and activity for everyone on the project.",
        "Client portal limited to the projects each client is assigned to."
      ]
    },
    {
      id: "jobpilot",
      name: "JobPilot",
      kind: "Job application tracker",
      stack: ["TypeScript", "Next.js", "React", "Prisma", "SQLite"],
      url: "https://github.com/pietrovos/jobpilot",
      points: [
        "Tracks applications, status changes, interviews, notes and private documents, with search, filtering and recovery of deleted entries.",
        "Password login with database-backed sessions; access checks keep users to their own records and attachments.",
        "Guests can work before signing up; a database transaction moves their data into the new account.",
        "Database integration tests and Playwright browser tests, run in GitHub Actions."
      ]
    },
    {
      id: "scheduler",
      name: "Smart Scheduler",
      kind: "Carleton engineering capstone",
      stack: ["TypeScript", "PostgreSQL", "Prisma", "Express", "React"],
      url: "https://github.com/pietrovos/carleton-smart-scheduler",
      points: [
        "Designed the relational schema and Prisma models for a four-person course-planning app: 348 courses, 322 parsed prerequisite trees.",
        "Stored prerequisite rules as trees supporting nested AND/OR conditions, minimum grades and year standing.",
        "Wrote the recursive checker that evaluates a student's record against those trees and reports unmet requirements."
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
    { name: "TypeScript", level: 3, group: "Language", desc: "My main language: Next.js and React frontends, NestJS and Express APIs." },
    { name: "Java", level: 3, group: "Language", desc: "Java 21 services built around correctness: atomic stock reservations, an order state machine and an append-only ledger." },
    { name: "PostgreSQL", level: 3, group: "Data", desc: "Where I put the rules that must hold: constraints, row locks, row-level security for tenants, append-only triggers, full-text search and pgvector." },
    { name: "Testing", level: 3, group: "Craft", desc: "JUnit 5, Testcontainers, pytest, Vitest and Playwright, including tests that race real requests to prove nothing is sold or booked twice." },
    { name: "Spring Boot", level: 2, group: "Web", desc: "Spring Security with JWT, Data JPA, Flyway migrations and Spring Modulith boundaries." },
    { name: "Node.js / NestJS", level: 2, group: "Web", desc: "NestJS and Express APIs with validation, guards, WebSockets, idempotent webhooks and background jobs." },
    { name: "React / Next.js", level: 2, group: "Web", desc: "App Router and server components, TanStack Query and Tailwind; Angular with signals on FulfillOps." },
    { name: "Python / FastAPI", level: 2, group: "Language", desc: "FastAPI and SQLAlchemy services, Celery ingestion pipelines and evaluation suites." },
    { name: "Auth & Access Control", level: 2, group: "Craft", desc: "Keycloak and OIDC, JWT, roles checked on the server, and Postgres row-level security so tenant isolation holds on every query." },
    { name: "LLM Integration", level: 2, group: "Data", desc: "Grounded drafting with the Claude API: permission-filtered hybrid search, verified citations, evals, and a circuit breaker for provider outages." },
    { name: "Docker, CI & AWS", level: 2, group: "Craft", desc: "Docker Compose stacks, GitHub Actions pipelines, and Terraform for AWS ECS." },
    { name: "Redis & Queues", level: 1, group: "Data", desc: "Celery on Redis with retries, exponential backoff, idempotent re-processing and a transactional outbox." }
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
