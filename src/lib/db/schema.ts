import { pgTable, serial, varchar, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core'

export const adminUsers = pgTable('admin_users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 100 }).unique().notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  // Profile fields
  displayName: varchar('display_name', { length: 150 }),
  avatarUrl: varchar('avatar_url', { length: 500 }),
  bio: text('bio'),
  phone: varchar('phone', { length: 50 }),
  location: varchar('location', { length: 255 }),
  title: varchar('title', { length: 255 }),
  tokenVersion: integer('token_version').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const adminDocuments = pgTable('admin_documents', {
  id: serial('id').primaryKey(),
  adminId: integer('admin_id').notNull().references(() => adminUsers.id, { onDelete: 'cascade' }),
  originalName: varchar('original_name', { length: 255 }).notNull(),
  storedName: varchar('stored_name', { length: 255 }).notNull(),
  mimeType: varchar('mime_type', { length: 100 }).notNull(),
  size: integer('size').notNull(),
  category: varchar('category', { length: 50 }).notNull().default('document'),
  description: text('description'),
  storageKey: varchar('storage_key', { length: 500 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  image: text('image').notNull(),
  tech: text('tech').array().notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  github: varchar('github', { length: 500 }).notNull(),
  demo: varchar('demo', { length: 500 }).notNull(),
  isVisible: boolean('is_visible').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const skills = pgTable('skills', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  level: integer('level').notNull().default(0),
  color: varchar('color', { length: 50 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const experience = pgTable('experience', {
  id: serial('id').primaryKey(),
  role: varchar('role', { length: 255 }).notNull(),
  company: varchar('company', { length: 255 }).notNull(),
  period: varchar('period', { length: 100 }).notNull(),
  description: text('description').notNull(),
  highlights: text('highlights').array().notNull(),
  tech: text('tech').array().notNull(),
  color: varchar('color', { length: 50 }).notNull(),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const testimonials = pgTable('testimonials', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  role: varchar('role', { length: 255 }).notNull(),
  company: varchar('company', { length: 255 }).notNull(),
  avatar: varchar('avatar', { length: 500 }).notNull(),
  content: text('content').notNull(),
  rating: integer('rating').default(5),
  color: varchar('color', { length: 50 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})
