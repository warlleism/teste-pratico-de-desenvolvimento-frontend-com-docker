export const getAuthTokenFromCookie = (): string | undefined => {
    const authToken = document.cookie.split('; ').find(row => row.startsWith('authToken='));
    return authToken;
}
