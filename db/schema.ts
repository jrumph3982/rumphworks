import {
  int,
  json,
  mysqlEnum,
  mysqlTable,
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
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});
