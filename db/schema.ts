import {
  boolean,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const leads = mysqlTable("leads", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  businessName: varchar("business_name", { length: 255 }),
  status: mysqlEnum("status", ["new", "quoted", "won", "lost"])
    .notNull()
    .default("new"),
  intakeData: json("intake_data"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

export const estimates = mysqlTable("estimates", {
  id: int("id").autoincrement().primaryKey(),
  leadId: int("lead_id")
    .notNull()
    .references(() => leads.id, { onDelete: "cascade" }),
  tier: mysqlEnum("tier", [
    "landing_page",
    "business_website",
    "dynamic_website",
    "hourly",
  ]).notNull(),
  status: mysqlEnum("status", [
    "draft",
    "sent",
    "accepted",
    "declined",
    "expired",
  ])
    .notNull()
    .default("draft"),
  totalPrice: int("total_price").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

export const estimateItems = mysqlTable("estimate_items", {
  id: int("id").autoincrement().primaryKey(),
  estimateId: int("estimate_id")
    .notNull()
    .references(() => estimates.id, { onDelete: "cascade" }),
  label: varchar("label", { length: 255 }).notNull(),
  price: int("price").notNull(),
  quantity: int("quantity").notNull().default(1),
});

export const projects = mysqlTable("projects", {
  id: int("id").autoincrement().primaryKey(),
  leadId: int("lead_id")
    .notNull()
    .references(() => leads.id, { onDelete: "cascade" }),
  status: mysqlEnum("status", [
    "discovery",
    "design",
    "build",
    "launch",
    "support",
  ])
    .notNull()
    .default("discovery"),
  timeline: varchar("timeline", { length: 255 }),
  revisionRounds: int("revision_rounds").notNull().default(2),
  reworkRate: int("rework_rate").notNull().default(75),
  depositPercent: int("deposit_percent").notNull().default(50),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

export const projectTasks = mysqlTable("project_tasks", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  label: varchar("label", { length: 255 }).notNull(),
  stage: mysqlEnum("stage", [
    "discovery",
    "design",
    "build",
    "launch",
    "support",
  ]).notNull(),
  done: boolean("done").notNull().default(false),
  sortOrder: int("sort_order").notNull().default(0),
  isCustom: boolean("is_custom").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const leadFieldChanges = mysqlTable("lead_field_changes", {
  id: int("id").autoincrement().primaryKey(),
  leadId: int("lead_id")
    .notNull()
    .references(() => leads.id, { onDelete: "cascade" }),
  fieldLabel: varchar("field_label", { length: 255 }).notNull(),
  oldValue: text("old_value").notNull(),
  newValue: text("new_value").notNull(),
  note: text("note"),
  changedAt: timestamp("changed_at").notNull().defaultNow(),
});
