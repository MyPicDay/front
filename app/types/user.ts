export interface User {
    userId: string;
    // TODO username:string
    nickname: string;
    profileImageUrl:string;
}

export interface UserListProps {
    users: User[];
    isLoading: boolean;
}

