import { Router } from "express";
import { db, complaintsTable } from "@workspace/db";
import { eq, desc, count, and, ilike, or, sql } from "drizzle-orm";

const router = Router();

function requireAuth(req: any, res: any, next: any) {
  if (!req.session?.admin) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  next();
}

function serializeComplaint(c: any) {
  return {
    ...c,
    createdAt: c.createdAt instanceof Date ? c.createdAt.toISOString() : c.createdAt,
    updatedAt: c.updatedAt instanceof Date ? c.updatedAt.toISOString() : c.updatedAt,
  };
}

// GET /complaints/stats — must come before /:id
router.get("/complaints/stats", requireAuth, async (req, res) => {
  try {
    const [total] = await db.select({ count: count() }).from(complaintsTable);
    const [pending] = await db.select({ count: count() }).from(complaintsTable).where(eq(complaintsTable.status, "pending"));
    const [inReview] = await db.select({ count: count() }).from(complaintsTable).where(eq(complaintsTable.status, "in_review"));
    const [resolved] = await db.select({ count: count() }).from(complaintsTable).where(eq(complaintsTable.status, "resolved"));
    const [rejected] = await db.select({ count: count() }).from(complaintsTable).where(eq(complaintsTable.status, "rejected"));
    const [highPriority] = await db.select({ count: count() }).from(complaintsTable).where(
      or(eq(complaintsTable.priority, "high"), eq(complaintsTable.priority, "urgent"))
    );
    const [recentCount] = await db.select({ count: count() }).from(complaintsTable).where(
      sql`created_at >= NOW() - INTERVAL '7 days'`
    );

    const byCategoryRaw = await db
      .select({ category: complaintsTable.category, count: count() })
      .from(complaintsTable)
      .groupBy(complaintsTable.category);

    res.json({
      total: total.count,
      pending: pending.count,
      inReview: inReview.count,
      resolved: resolved.count,
      rejected: rejected.count,
      highPriority: highPriority.count,
      recentCount: recentCount.count,
      byCategory: byCategoryRaw.map((r) => ({ category: r.category, count: r.count })),
    });
  } catch (err) {
    req.log.error({ err }, "Error fetching complaint stats");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /complaints
router.get("/complaints", requireAuth, async (req, res) => {
  try {
    const { status, category, priority, search } = req.query as Record<string, string | undefined>;

    const conditions = [];
    if (status) conditions.push(eq(complaintsTable.status, status));
    if (category) conditions.push(eq(complaintsTable.category, category));
    if (priority) conditions.push(eq(complaintsTable.priority, priority));
    if (search) {
      conditions.push(
        or(
          ilike(complaintsTable.title, `%${search}%`),
          ilike(complaintsTable.citizenName, `%${search}%`),
          ilike(complaintsTable.description, `%${search}%`)
        )
      );
    }

    const rows = await db
      .select()
      .from(complaintsTable)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(complaintsTable.createdAt));

    res.json(rows.map(serializeComplaint));
  } catch (err) {
    req.log.error({ err }, "Error listing complaints");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /complaints
router.post("/complaints", async (req, res) => {
  try {
    const { title, description, category, priority, citizenName, citizenEmail, citizenPhone, location } = req.body;

    if (!title || !description || !category || !citizenName) {
      res.status(400).json({ error: "title, description, category, and citizenName are required" });
      return;
    }

    const [row] = await db
      .insert(complaintsTable)
      .values({
        title,
        description,
        category,
        status: "pending",
        priority: priority ?? "medium",
        citizenName,
        citizenEmail: citizenEmail ?? null,
        citizenPhone: citizenPhone ?? null,
        location: location ?? null,
      })
      .returning();

    res.status(201).json(serializeComplaint(row));
  } catch (err) {
    req.log.error({ err }, "Error creating complaint");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /complaints/:id
router.get("/complaints/:id", requireAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }

    const [row] = await db.select().from(complaintsTable).where(eq(complaintsTable.id, id));
    if (!row) { res.status(404).json({ error: "Complaint not found" }); return; }

    res.json(serializeComplaint(row));
  } catch (err) {
    req.log.error({ err }, "Error fetching complaint");
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /complaints/:id
router.patch("/complaints/:id", requireAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }

    const { status, priority, adminNotes, title, description } = req.body;
    const updates: Record<string, any> = {};
    if (status !== undefined) updates.status = status;
    if (priority !== undefined) updates.priority = priority;
    if (adminNotes !== undefined) updates.adminNotes = adminNotes;
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;

    const [row] = await db
      .update(complaintsTable)
      .set(updates)
      .where(eq(complaintsTable.id, id))
      .returning();

    if (!row) { res.status(404).json({ error: "Complaint not found" }); return; }

    res.json(serializeComplaint(row));
  } catch (err) {
    req.log.error({ err }, "Error updating complaint");
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /complaints/:id
router.delete("/complaints/:id", requireAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }

    await db.delete(complaintsTable).where(eq(complaintsTable.id, id));
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Error deleting complaint");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
