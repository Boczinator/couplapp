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

export const userRelations = relations(users, ({ many }) => ({
	profiles: many(profiles),
}))

export const profilesRelations = relations(profiles, ({ one }) => ({
	user: one(users, {
		fields: [profiles.userId],
		references: [users.id],
	}),
}))

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

export const postsRelations = relations(posts, ({ one, many }) => ({
	author: one(profiles, {
		fields: [posts.profileId],
		references: [profiles.id],
	}),
	receiver: one(profiles, {
		fields: [posts.receiverId],
		references: [profiles.id],
	}),
	likes: many(likes),
}))

export const feedActivities = pgTable('feed_activities', {
	id: uuid('id').primaryKey().unique().defaultRandom(),
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

export const messages = pgTable('messages', {
	id: uuid().primaryKey().defaultRandom().notNull(),
	senderId: uuid('sender_id')
		.notNull()
		.references(() => profiles.id, { onDelete: 'cascade' }),
	conversationId: uuid('conversation_id').references(() => conversations.id, {
		onDelete: 'cascade',
	}),
	content: text('content'),
	isRead: boolean('is_read').default(false),
	readAt: timestamp('read_at'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const conversations = pgTable('conversations', {
	id: uuid('id').primaryKey().defaultRandom().notNull(),
	title: text('title'),
	isGroupChat: boolean('is_group_chat').default(false).notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow(),
})

export const participants = pgTable(
	'participants',
	{
		conversationId: uuid('conversation_id')
			.notNull()
			.references(() => conversations.id, {
				onDelete: 'cascade',
			}),
		profileId: uuid('profile_id')
			.notNull()
			.references(() => profiles.id, {
				onDelete: 'cascade',
			}),
		joinedAt: timestamp().defaultNow(),
	},
	(table) => [primaryKey({ columns: [table.conversationId, table.profileId] })],
)

export const likes = pgTable(
	'likes',
	{
		profileId: uuid('profile_id')
			.notNull()
			.references(() => profiles.id, { onDelete: 'cascade' }),
		postId: uuid('post_id')
			.notNull()
			.references(() => posts.id, { onDelete: 'cascade' }),
	},
	(table) => [primaryKey({ columns: [table.profileId, table.postId] })],
)

export const likesRelations = relations(likes, ({ one }) => ({
	profile: one(profiles, {
		fields: [likes.profileId],
		references: [profiles.id],
	}),
	post: one(posts, {
		fields: [likes.postId],
		references: [posts.id],
	}),
}))

export const conversationsRelations = relations(conversations, ({ many }) => ({
	participants: many(participants),
	messages: many(messages),
}))

export const participantsRelations = relations(participants, ({ one }) => ({
	conversation: one(conversations, {
		fields: [participants.conversationId],
		references: [conversations.id],
	}),
	profile: one(profiles, {
		fields: [participants.profileId],
		references: [profiles.id],
	}),
}))

export const messagesRelations = relations(messages, ({ one }) => ({
	conversation: one(conversations, {
		fields: [messages.conversationId],
		references: [conversations.id],
	}),
	sender: one(profiles, {
		fields: [messages.senderId],
		references: [profiles.id],
	}),
}))

export type User = typeof users.$inferSelect
export type Profile = typeof profiles.$inferSelect
export type Friendships = typeof friendships.$inferSelect
export type Posts = typeof posts.$inferSelect
