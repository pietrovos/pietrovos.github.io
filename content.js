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
      images: [
        { src: "assets/projects/supportlens-draft.webp", alt: "A reply drafted from the help articles, with numbered citations to each source passage" },
        { src: "assets/projects/supportlens-inbox.webp", alt: "The ticket inbox, most urgent tickets first" }
      ],
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
      images: [
        { src: "assets/projects/fulfillops-dashboard.webp", alt: "The warehouse dashboard: stock exceptions, order pipeline, stock levels and recent activity" },
        { src: "assets/projects/fulfillops-stock-exception.webp", alt: "An order held as a stock exception because only 4 of the 12 units ordered are available" }
      ],
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
      images: [
        { src: "assets/projects/scopeflow-project.webp", alt: "A client project with milestones, budget, approved changes and proposed scope changes" },
        { src: "assets/projects/scopeflow-conflict.webp", alt: "The conflict view shown when someone else revised a proposal first, comparing their revision with your draft" }
      ],
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
      images: [
        { src: "assets/projects/jobpilot-detail.webp", alt: "A saved job posting with its description and sections for details, notes, files, emails, interviews and history" }
      ],
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
      images: [
        { src: "assets/projects/scheduler-degree-map.webp", alt: "The degree map built from a student's audit, grouping requirements still to meet by year" },
        { src: "assets/projects/scheduler-timetable.webp", alt: "One of the generated conflict-free timetables, with elective options alongside" }
      ],
      points: [
        "Carleton students plan each term by hand, cross-checking their degree audit, prerequisites and the timetable to find courses they can take without a clash.",
        "Smart Scheduler reads a student's degree audit and shows which courses they've completed and which they still need. It then works out which remaining courses the student has the prerequisites for, lets them pick from those, and generates all possible conflict-free timetables for that selection. Students can also block off times they don't want any classes, and the generated timetables work around them, flagging any course that can't fit.",
        "Instead of typing in their history, students upload the degree audit Carleton Central already produces, as HTML or PDF. The parser pulls out completed courses, grades and the requirements still open, and any course they can't take yet is listed with the reason.",
        "Course titles, credits and descriptions are fetched from Carleton's online course calendar, and prerequisite rules are parsed into trees in PostgreSQL, so nested AND/OR conditions, minimum grades and year standing can all be checked.",
        "Timetables are found with a backtracking search that adds one course's sections at a time and abandons any partial timetable the moment something clashes. Sections that meet at the same times count as one option, so each timetable shown is actually different."
      ]
    },
    {
      id: "drones",
      name: "Firefighting Drone Swarm",
      kind: "Real-time control-system simulation",
      stack: ["Java", "UDP", "Maven", "JUnit", "Swing"],
      url: "https://github.com/pietrovos/firefighting-drone-simulator",
      images: [
        { src: "assets/projects/drones-dashboard.webp", alt: "The mission-control dashboard: the response map with fires and drones, and the fleet's state, water, battery and fuel" }
      ],
      points: [
        "When fires break out across a region, a fleet of firefighting drones needs one coordinator deciding which drone goes where, and that plan has to keep working when a drone breaks down or its messages get lost.",
        "The simulator runs three programs that talk over UDP, a network protocol that doesn't guarantee messages arrive. One reads fire reports from a scenario file, a scheduler assigns drones to each fire, and the drones fly out, drop water and report back their position, water, battery and fuel.",
        "Drones can be made to fail mid-mission by getting stuck, dropping or garbling messages, or jamming their water nozzle. The scheduler notices a drone that has gone silent for too long, takes its fire back and sends another drone. A nozzle stuck closed can't release water, so that fire goes to another drone while this one resets; a nozzle stuck open can't hold water at all, so that drone is shut down for the rest of the simulation.",
        "Each drone carries 15 litres, but a medium fire needs 20 and a large fire needs 30, so sending one drone per fire left both waiting for a second trip while most of the fleet sat idle. The scheduler now sends enough drones at once to cover the water a fire still needs, which cut the average time to put a fire out by 40% on a 50-fire, 20-drone scenario.",
        "A live dashboard shows the map, each drone's state and supplies, active missions and fault countdowns, and one launcher starts the whole demo with as many drones as you ask for."
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
    { id: "flyers", org: "Kanata Flyers", title: "Flyer Carrier and Delivery Assistant", when: "Summers 2015 – 2026", where: "Kanata, ON",
      points: ["Delivered my own flyer routes in Bridlewood for this FlyerForce branch, averaging close to 500 flyers.", "Helped my dad, an area manager, truck flyer bundles to carriers all over Kanata.", "Took on more of the trucking during university when his back started giving him trouble."] },
    { id: "ubreakifix", org: "uBreakiFix", title: "Electronics Repair Technician", when: "June 2020 – September 2021", where: "Kanata, ON",
      points: ["Diagnosed and repaired hardware, software and connectivity faults.", "Tested every repair before returning devices to customers.", "Managed parts inventory and processed warranty repairs."] },
    { id: "carleton", org: "Carleton University", title: "Bachelor of Software Engineering", when: "Graduated July 2026", where: "Ottawa, ON",
      points: ["Capstone: Smart Scheduler, a course-planning app with prerequisite trees.", "Real-time and distributed systems: the firefighting drone swarm."] },
    { id: "next", org: "The Next Chapter", title: "Software Engineer", when: "Now", where: "Open to roles",
      points: ["Looking for full-stack or backend roles.", "Find me under Contact."] }
  ]
};
