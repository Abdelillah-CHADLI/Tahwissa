// Utility function to get the current user type
export function getUserType(): 'agency' | 'guide' | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;

    try {
        const user = JSON.parse(userStr);
        return user.profileType || user.userType || null;
    } catch {
        return null;
    }
}

// Utility function to check if current user is a guide
export function isGuide(): boolean {
    return getUserType() === 'guide';
}

// Utility function to get context-aware text
export function getContextText(agencyText: string, guideText: string): string {
    return isGuide() ? guideText : agencyText;
}
