import getCurrentUser from './getCurrentUser';

export default function checkAccess(passedUserId) {
    const { userId, isAdmin } = getCurrentUser();
    return { authorized: userId === passedUserId || isAdmin, currentUserId: userId };
}