import { Router } from "express";
import { db, schemesTable } from "@workspace/db";
import { eq, desc, ilike, or } from "drizzle-orm";

const router = Router();

function requireAuth(req: any, res: any, next: any) {
  if (!req.session?.admin) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  next();
}

function serializeScheme(s: any) {
  return {
    ...s,
    createdAt: s.createdAt instanceof Date ? s.createdAt.toISOString() : s.createdAt,
  };
}

// GET /schemes
router.get("/schemes", async (req, res) => {
  try {
    const { category, search } = req.query as Record<string, string | undefined>;

    let rows;
    if (category && search) {
      rows = await db
        .select()
        .from(schemesTable)
        .where(
          eq(schemesTable.category, category)
        )
        .orderBy(desc(schemesTable.createdAt));
    } else if (category) {
      rows = await db.select().from(schemesTable).where(eq(schemesTable.category, category)).orderBy(desc(schemesTable.createdAt));
    } else if (search) {
      rows = await db
        .select()
        .from(schemesTable)
        .where(
          or(
            ilike(schemesTable.title, `%${search}%`),
            ilike(schemesTable.description, `%${search}%`),
            ilike(schemesTable.ministry, `%${search}%`)
          )
        )
        .orderBy(desc(schemesTable.createdAt));
    } else {
      rows = await db.select().from(schemesTable).orderBy(desc(schemesTable.createdAt));
    }

    res.json(rows.map(serializeScheme));
  } catch (err) {
    req.log.error({ err }, "Error listing schemes");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /schemes
router.post("/schemes", requireAuth, async (req, res) => {
  try {
    const { title, description, category, eligibility, link, ministry, state, tags } = req.body;

    if (!title || !description || !category || !link) {
      res.status(400).json({ error: "title, description, category, and link are required" });
      return;
    }

    const [row] = await db
      .insert(schemesTable)
      .values({ title, description, category, eligibility: eligibility ?? null, link, ministry: ministry ?? null, state: state ?? null, tags: tags ?? null })
      .returning();

    res.status(201).json(serializeScheme(row));
  } catch (err) {
    req.log.error({ err }, "Error creating scheme");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /schemes/:id
router.get("/schemes/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }

    const [row] = await db.select().from(schemesTable).where(eq(schemesTable.id, id));
    if (!row) { res.status(404).json({ error: "Scheme not found" }); return; }

    res.json(serializeScheme(row));
  } catch (err) {
    req.log.error({ err }, "Error fetching scheme");
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /schemes/:id
router.patch("/schemes/:id", requireAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }

    const { title, description, category, eligibility, link, ministry, state, tags } = req.body;
    const updates: Record<string, any> = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (category !== undefined) updates.category = category;
    if (eligibility !== undefined) updates.eligibility = eligibility;
    if (link !== undefined) updates.link = link;
    if (ministry !== undefined) updates.ministry = ministry;
    if (state !== undefined) updates.state = state;
    if (tags !== undefined) updates.tags = tags;

    const [row] = await db.update(schemesTable).set(updates).where(eq(schemesTable.id, id)).returning();
    if (!row) { res.status(404).json({ error: "Scheme not found" }); return; }

    res.json(serializeScheme(row));
  } catch (err) {
    req.log.error({ err }, "Error updating scheme");
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /schemes/:id
router.delete("/schemes/:id", requireAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }

    await db.delete(schemesTable).where(eq(schemesTable.id, id));
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Error deleting scheme");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
