export interface User {
    userId: string;
    
    // TODO username:string
    nickname: string;
    profileImageUrl:string;
    isFollowing: boolean;
}

export interface UserListProps {
    users: User[];
    isLoading: boolean;
}

