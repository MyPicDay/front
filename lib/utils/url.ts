export const getServerURL = () => {
    return process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:8080/api';
}; 