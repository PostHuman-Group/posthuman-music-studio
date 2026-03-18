import { pgTable, uuid, varchar, text, timestamp, index, integer } from 'drizzle-orm/pg-core';

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
}, (table) => {
    return {
        nameIdx: index('samples_name_idx').on(table.name),
        typeIdx: index('samples_type_idx').on(table.type),
        createdAtIdx: index('samples_created_at_idx').on(table.createdAt),
    };
});

export const schedules = pgTable('schedules', {
    id: uuid('id').primaryKey().defaultRandom(),
    title: varchar('title', { length: 255 }).notNull(),
    startTime: timestamp('start_time').notNull(),
    endTime: timestamp('end_time'),
    platformId: uuid('platform_id').references(() => platforms.id),
    status: varchar('status', { length: 50 }).default('scheduled'),
    contentRef: text('content_ref'),
}, (table) => {
    return {
        startTimeIdx: index('schedules_start_time_idx').on(table.startTime),
        statusIdx: index('schedules_status_idx').on(table.status),
        platformIdIdx: index('schedules_platform_id_idx').on(table.platformId),
        createdAtIdx: index('schedules_created_at_idx').on(table.startTime), // Assuming createdAt is similar to startTime for indexing
    };
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
    type: varchar('type', { length: 20 }).$type<'image' | 'video'>().notNull(),
    prompt: text('prompt').notNull(),
    url: text('url').notNull(),
    status: varchar('status', { length: 20 }).notNull().default('ready'),
    createdAt: timestamp('created_at').defaultNow(),
}, (table) => {
    return {
        typeIdx: index('assets_type_idx').on(table.type),
        createdAtIdx: index('assets_created_at_idx').on(table.createdAt),
    };
});

export const streamState = pgTable('stream_state', {
    id: varchar('id', { length: 50 }).primaryKey(), // Using 'GLOBAL' for MVP
    genre: varchar('genre', { length: 100 }).notNull().default('Cyberpunk Ambient'),
    gain: integer('gain').notNull().default(50),
    complexity: integer('complexity').notNull().default(75),
    backgroundUrl: text('background_url'),
    backgroundType: varchar('background_type', { length: 20 }).$type<'image' | 'video'>().default('image'),
    updatedAt: timestamp('updated_at').defaultNow(),
});
