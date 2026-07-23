import {
	BadRequestException,
	Inject,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { and, eq, ne, or } from 'drizzle-orm'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { DRIZZLE_PROVIDER } from 'src/database/database.provider'
import * as schema from 'src/db/schema'
import type { Friendships } from 'src/db/schema'
import { sortUuids } from 'src/helper/sort'

@Injectable()
export class FriendsService {
	constructor(
		@Inject(DRIZZLE_PROVIDER)
		private readonly db: NodePgDatabase<typeof schema>,
	) {}
	async changeStatus(
		currentProfileId: Friendships['profileId1'],
		requestedProfileId: Friendships['profileId2'],
		status: Friendships['status'],
	) {
		const [updatedFriendship] = await this.db
			.update(schema.friendships)
			.set({ status, actionProfileId: currentProfileId })
			.where(
				and(
					eq(schema.friendships.profileId1, currentProfileId),
					eq(schema.friendships.profileId2, requestedProfileId),
				),
			)
			.returning()

		if (!updatedFriendship) {
			throw new NotFoundException('No active relationship found to update')
		}

		return updatedFriendship
	}

	async sendRequest(
		senderId: Friendships['profileId1'],
		receiverId: Friendships['profileId2'],
	) {
		if (senderId === receiverId) {
			throw new BadRequestException('Cannot add yourself.')
		}

		// Sort because of primary key composition profile1 < profile2
		const [profile1Id, profile2Id] = sortUuids(senderId, receiverId)

		const existing = await this.db.query.friendships.findFirst({
			where: and(
				eq(schema.friendships.profileId1, profile1Id),
				eq(schema.friendships.profileId2, profile2Id),
			),
		})

		if (existing) {
			throw new BadRequestException('An active internaction already exists.')
		}

		return await this.db
			.insert(schema.friendships)
			.values({
				profileId1: profile1Id,
				profileId2: profile2Id,
				status: 'pending',
				actionProfileId: senderId,
			})
			.returning()
	}

	async acceptRequest(currentProfileId: string, requesterId: string) {
		const [profile1Id, profile2Id] = sortUuids(currentProfileId, requesterId)

		const [updatedRelation] = await this.db
			.update(schema.friendships)
			.set({
				status: 'accepted',
				actionProfileId: currentProfileId,
			})
			.where(
				and(
					eq(schema.friendships.profileId1, profile1Id),
					eq(schema.friendships.profileId2, profile2Id),
					eq(schema.friendships.status, 'pending'),
				),
			)
			.returning()

		console.log(updatedRelation)
		return updatedRelation
	}

	async removeConnection(currentProfileId: string, targetProfileId: string) {
		const [profileId1, profileId2] = sortUuids(
			currentProfileId,
			targetProfileId,
		)

		const [deletedRelation] = await this.db
			.delete(schema.friendships)
			.where(
				and(
					eq(schema.friendships.profileId1, profileId1),
					eq(schema.friendships.profileId2, profileId2),
				),
			)
			.returning()

		if (!deletedRelation) {
			throw new NotFoundException('No connection found to delete')
		}

		return {
			success: true,
			message: 'Connection removed successfully',
		}
	}

	async getStatus(currentProfileId: string, targetProfileId: string) {
		const [profileId1, profileId2] = sortUuids(
			currentProfileId,
			targetProfileId,
		)

		const relation = await this.db.query.friendships.findFirst({
			where: and(
				eq(schema.friendships.profileId1, profileId1),
				eq(schema.friendships.profileId2, profileId2),
			),
		})

		if (!relation) {
			return null
		}

		return relation
	}

	async getAllRequestsByProfileId(currentProfileId: string) {
		const relations = await this.db.query.friendships.findMany({
			where: and(
				or(
					eq(schema.friendships.profileId1, currentProfileId),
					eq(schema.friendships.profileId2, currentProfileId),
				),
				eq(schema.friendships.status, 'pending'),
				ne(schema.friendships.status, 'blocked'),
			),
			with: {
				profile1: true,
				profile2: true,
			},
		})

		return relations.map((relation) => {
			const isIncoming = relation.actionProfileId !== currentProfileId

			const targetProfile =
				relation.profileId1 === currentProfileId
					? relation.profile2
					: relation.profile1

			return {
				status: relation.status,
				direction: isIncoming ? 'INCOMING' : 'OUTGOING',
				profile: targetProfile,
			}
		})
	}

	async getAllFriends(activeProfileId: string) {
		const friendships = await this.db.query.friendships.findMany({
			where: and(
				or(
					eq(schema.friendships.profileId1, activeProfileId),
					eq(schema.friendships.profileId2, activeProfileId),
				),
				eq(schema.friendships.status, 'accepted'),
			),
			with: {
				profile1: true,
				profile2: true,
			},
		})

		return friendships.map((friendship) => {
			const friendProfile =
				friendship.profileId1 === activeProfileId
					? friendship.profile2
					: friendship.profile1

			return friendProfile
		})
	}
}
