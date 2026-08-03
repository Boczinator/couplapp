import { relations } from 'drizzle-orm'
import { sql } from 'drizzle-orm'
import { varchar } from 'drizzle-orm/pg-core'
import { boolean } from 'drizzle-orm/pg-core'
import { primaryKey } from 'drizzle-orm/pg-core'
import { check } from 'drizzle-orm/pg-core'
import { pgEnum } from 'drizzle-orm/pg-core'
import { index } from 'drizzle-orm/pg-core'
import { timestamp } from 'drizzle-orm/pg-core'
import { text } from 'drizzle-orm/pg-core'
import { pgTable, uuid } from 'drizzle-orm/pg-core'

export const roleEnum = pgEnum('user_role', ['admin', 'user'])

export const users = pgTable('users', {
	id: uuid('id').defaultRandom().primaryKey().notNull(),
	firstName: varchar('first_name', { length: 255 }).notNull(),
	lastName: varchar('last_name', { length: 255 }).notNull(),
	email: text('email').notNull().unique(),
	password: text('password').notNull(),
	refreshToken: text('refresh_token'),
	isVerified: boolean('is_verified').default(false),
	optInToken: text('opt_in_token'),
	role: roleEnum('role').default('user').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const profiles = pgTable(
	'profiles',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		userId: uuid('user_id')
			.references(() => users.id, {
				onDelete: 'cascade',
			})
			.notNull(),
		name: text('name').notNull(),
		picture: text('picture'),
		bannerPicture: text('banner'),
		bio: text('bio'),
		location: text('location'),
		isPrivate: boolean('is_private'),
		createdAt: timestamp('created_at').notNull().defaultNow(),
		updatedAt: timestamp('updated_at').notNull().defaultNow(),
	},
	(table) => [
		index('name_search_index').using(
			'gin',
			sql`to_tsvector('english', ${table.name})`,
		),
	],
)

export const friendshipStatusEnum = pgEnum('friendship_status', [
	'pending',
	'accepted',
	'blocked',
])

export const friendships = pgTable(
	'friendships',
	{
		profileId1: uuid('profile_id_1')
			.notNull()
			.references(() => profiles.id, {
				onDelete: 'cascade',
			}),
		profileId2: uuid('profile_id_2')
			.notNull()
			.references(() => profiles.id, {
				onDelete: 'cascade',
			}),
		status: friendshipStatusEnum('status').notNull(),
		actionProfileId: uuid('action_profile_id')
			.notNull()
			.references(() => profiles.id, { onDelete: 'cascade' }),
	},
	(table) => [
		primaryKey({ columns: [table.profileId1, table.profileId2] }),
		check(
			'profile_order_check',
			sql`${table.profileId1} < ${table.profileId2}`,
		),
	],
)

export const friendshipsRelations = relations(friendships, ({ one }) => ({
	profile1: one(profiles, {
		fields: [friendships.profileId1],
		references: [profiles.id],
		relationName: 'profile1',
	}),
	profile2: one(profiles, {
		fields: [friendships.profileId2],
		references: [profiles.id],
		relationName: 'profile2',
	}),
}))

export const posts = pgTable('posts', {
	id: uuid('id').defaultRandom().primaryKey().notNull(),
	profileId: uuid('profile_id').references(() => profiles.id, {
		onDelete: 'cascade',
	}),
	receiverId: uuid('receiver_id').references(() => profiles.id, {
		onDelete: 'set null',
	}),
	text: text('text').notNull(),
	updatedAt: timestamp('updated_at'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const postsRelations = relations(posts, ({ one }) => ({
	author: one(profiles, {
		fields: [posts.profileId],
		references: [profiles.id],
	}),
	receiver: one(profiles, {
		fields: [posts.receiverId],
		references: [profiles.id],
	}),
}))

export const feedActivities = pgTable('feed_activities', {
	id: uuid('id').unique().defaultRandom(),
	profileId: uuid('profile_id').references(() => profiles.id, {
		onDelete: 'cascade',
	}),
	postId: uuid('post_id').references(() => posts.id, { onDelete: 'cascade' }),
	createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const feedActivitiesRelations = relations(feedActivities, ({ one }) => ({
	post: one(posts, {
		fields: [feedActivities.postId],
		references: [posts.id],
	}),
}))

export type User = typeof users.$inferSelect
export type Profile = typeof profiles.$inferSelect
export type Friendships = typeof friendships.$inferSelect
export type Posts = typeof posts.$inferSelect
