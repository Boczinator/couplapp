export type User = {
    id: number;
    name: string;
    email: string;
    password: string;
};

export type CreateUserDto = Omit<User, 'id'>;

export type UpdateUserDto = Partial<CreateUserDto>;