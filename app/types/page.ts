export interface Page<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    number: number; // 현재 페이지
    size: number;   // 페이지 당 아이템 수
    first: boolean;
    last: boolean;
    empty: boolean;
}