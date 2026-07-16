import { varchar } from 'drizzle-orm/pg-core'
import { boolean } from 'drizzle-orm/pg-core'
import { integer } from 'drizzle-orm/pg-core'
import { timestamp } from 'drizzle-orm/pg-core'
import { text } from 'drizzle-orm/pg-core'
import { pgTable, uuid } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
	id: uuid('id').defaultRandom().primaryKey(),
	firstName: varchar('first_name', { length: 255 }).notNull(),
	lastName: varchar('last_name', { length: 255 }).notNull(),
	email: text('email').notNull().unique(),
	password: text('password').notNull(),
	refreshToken: text('refresh_token'),
	isVerified: boolean('is_verified').default(false),
	optInToken: text('opt_in_token'),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const profiles = pgTable('profiles', {
	id: uuid('id').defaultRandom().primaryKey(),
	userId: uuid('user_id').references(() => users.id, {
		onDelete: 'cascade',
	}),
	picture: text('picture'),
	bannerPicture: text('banner'),
	bio: text('bio'),
	location: text('location'),
	isPrivate: boolean('is_private'),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export type User = typeof users.$inferSelect
