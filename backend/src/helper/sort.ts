export const sortUuids = (uuid1: string, uuid2: string) =>
	uuid1 < uuid2 ? [uuid1, uuid2] : [uuid2, uuid1]
