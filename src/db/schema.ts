import { pgTable, uuid, varchar, text, timestamp } from 'drizzle-orm/pg-core';

export const samples = pgTable('samples', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
    prompt: text('prompt').notNull(),
    url: text('url'),
    type: varchar('type', { length: 50 }).$type<'synth' | 'drum' | 'loop' | 'fx' | 'vocal'>().default('loop'),
    theme: varchar('theme', { length: 100 }),
    duration: varchar('duration', { length: 20 }),
    tags: text('tags').array(),
    createdAt: timestamp('created_at').defaultNow(),
});

export const schedules = pgTable('schedules', {
    id: uuid('id').primaryKey().defaultRandom(),
    title: varchar('title', { length: 255 }).notNull(),
    startTime: timestamp('start_time').notNull(),
    endTime: timestamp('end_time'),
    platformId: uuid('platform_id').references(() => platforms.id),
    status: varchar('status', { length: 50 }).default('scheduled'),
    contentRef: text('content_ref'),
});

export const platforms = pgTable('platforms', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
    status: varchar('status', { length: 50 }).notNull().default('disconnected'),
    token: text('token'),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const assets = pgTable('assets', {
    id: uuid('id').primaryKey().defaultRandom(),
    type: varchar('type', { length: 20 }).notNull(), // 'image' | 'video'
    prompt: text('prompt').notNull(),
    url: text('url').notNull(),
    status: varchar('status', { length: 20 }).notNull().default('ready'),
    createdAt: timestamp('created_at').defaultNow(),
});
