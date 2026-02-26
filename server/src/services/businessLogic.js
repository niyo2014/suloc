
/**
 * SULOC Business Logic Services
 */

/**
 * Generate a secure verification code (MTC-style)
 * Format: 8-12 characters, alphanumeric, uppercase
 */
export const generateVerificationCode = (length = 10) => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Avoid O, 0, I, 1 for clarity
    let code = '';
    for (let i = 0; i < length; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
};

/**
 * Corridor Intelligence Logic
 * Determines the primary corridor and port based on destination
 */
export const getCorridorAdvice = (destination) => {
    const northernCorridorDestinations = ['Uganda', 'Rwanda', 'South Sudan', 'Eastern DRC'];
    const centralCorridorDestinations = ['Burundi', 'Tanzania', 'Zambia', 'Malawi'];

    if (northernCorridorDestinations.some(d => destination.includes(d))) {
        return {
            corridor: 'Northern Corridor',
            primaryPort: 'Mombasa',
            estimatedDays: 14,
            complexity: 'Moderate'
        };
    }

    if (centralCorridorDestinations.some(d => destination.includes(d))) {
        return {
            corridor: 'Central Corridor',
            primaryPort: 'Dar es Salaam',
            estimatedDays: 10,
            complexity: 'Low'
        };
    }

    return {
        corridor: 'Custom Route',
        primaryPort: 'Depends on Cargo',
        estimatedDays: 'TBD',
        complexity: 'High'
    };
};
