import crypto from "node:crypto";
import { db, usersTable, schemesTable } from "@workspace/db";
import { count } from "drizzle-orm";

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + "civic-copilot-salt").digest("hex");
}

const demoUsers = [
  { name: "System Admin", email: "admin@civic.gov", role: "ADMIN" as const },
  { name: "Demo Student", email: "student@example.com", role: "STUDENT" as const },
  { name: "Demo Citizen", email: "citizen@example.com", role: "CITIZEN" as const },
];

const demoSchemes = [
  {
    name: "National Scholarship Portal",
    description: "Centralized platform for government scholarships for students.",
    category: "EDUCATION",
    eligibleRoles: "STUDENT",
    benefits: "Financial aid for tuition and living expenses.",
    howToApply: "Register at scholarships.gov.in with academic records.",
  },
  {
    name: "PM Awas Yojana",
    description: "Affordable housing scheme for urban and rural citizens.",
    category: "HOUSING",
    eligibleRoles: "CITIZEN",
    benefits: "Subsidy on home loans and affordable housing units.",
    howToApply: "Apply through the official PMAY portal with income proof.",
  },
  {
    name: "Ayushman Bharat",
    description: "Health insurance coverage for eligible families.",
    category: "HEALTH",
    eligibleRoles: "CITIZEN,STUDENT",
    benefits: "Up to ₹5 lakh per family per year for hospitalization.",
    howToApply: "Check eligibility on the Ayushman Bharat website.",
  },
];

async function seed() {
  const [{ value: userCount }] = await db.select({ value: count() }).from(usersTable);

  if (userCount === 0) {
    const passwordHash = hashPassword("admin123");
    await db.insert(usersTable).values(
      demoUsers.map((user) => ({
        ...user,
        passwordHash,
      })),
    );
    console.log("Seeded demo users (password: admin123)");
  } else {
    console.log("Users already exist, skipping user seed");
  }

  const [{ value: schemeCount }] = await db.select({ value: count() }).from(schemesTable);

  if (schemeCount === 0) {
    await db.insert(schemesTable).values(demoSchemes);
    console.log("Seeded demo schemes");
  } else {
    console.log("Schemes already exist, skipping scheme seed");
  }
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
