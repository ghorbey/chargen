import getCurrentUser from './getCurrentUser';

export default function checkAccess(passedUserId) {
    const { userId, isAdmin, IsPnj } = getCurrentUser();
    return { authorized: userId === passedUserId || isAdmin || IsPnj, currentUserId: userId };
}