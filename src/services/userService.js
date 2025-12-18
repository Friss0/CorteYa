import { db } from '../lib/firebase';
import {
    ref,
    set,
    update,
    remove,
    onValue,
    get,
} from 'firebase/database';

// New Collection Name as requested
const COLLECTION_NAME = 'barbershops';

export const userService = {
    // Subscribe to real-time user updates (fetching from barbershops)
    subscribeToUsers: (callback) => {
        const usersRef = ref(db, COLLECTION_NAME);

        return onValue(usersRef, (snapshot) => {
            const data = snapshot.val();
            if (!data) {
                callback([]);
                return;
            }

            // Convert object to array
            // keys are '01', '02' or '1', '2' etc.
            const users = Object.keys(data).map(key => {
                const shop = data[key];
                return {
                    id: key,
                    ...shop,
                    // Map legacy/new fields to AdminTable expected fields
                    businessName: shop.name || shop.businessName || 'Sin Nombre',
                    location: shop.address || shop.location || '',
                    ownerName: shop.ownerName || 'Propietario', // Default placeholder
                    email: shop.email || 'Sin Email', // Default placeholder
                    status: shop.status || 'active', // Default to active
                    role: shop.role || 'business',
                    subscriptionPlan: shop.subscriptionPlan || 'premium', // Default plan
                    registrationDate: shop.createdAt || shop.updatedAt || new Date().toISOString(),
                    lastActivity: shop.updatedAt || new Date().toISOString()
                };
            });

            // Sort desc by registrationDate
            users.sort((a, b) => {
                const dateA = new Date(a.registrationDate || 0);
                const dateB = new Date(b.registrationDate || 0);
                return dateB - dateA;
            });

            callback(users);
        }, (error) => {
            console.error("Error subscribing to users (RTDB):", error);
        });
    },

    // Create a new user with Sequential ID (e.g. '5' -> '6')
    createUser: async (userData) => {
        console.log("Creating user in Barbershops...", userData);

        const timestamp = new Date().toISOString();
        const usersRef = ref(db, COLLECTION_NAME);

        try {
            // 1. Fetch existing keys to determine next ID
            const snapshot = await get(usersRef);
            let nextId = "1"; // Default start (was 01)

            if (snapshot.exists()) {
                const data = snapshot.val();
                const keys = Object.keys(data);

                // Find max numeric ID
                const maxId = keys.reduce((max, key) => {
                    const num = parseInt(key, 10);
                    return !isNaN(num) && num > max ? num : max;
                }, 0);

                // Increment (No Padding)
                nextId = String(maxId + 1);
            }

            console.log("Generated New Barbershop ID:", nextId);

            // 2. Save data to barbershops/{nextId}
            const newRef = ref(db, `${COLLECTION_NAME}/${nextId}`);

            // Generate random stats
            const randomRating = (Math.random() * (5.0 - 0.1) + 0.1).toFixed(1); // 0.1 to 5.0
            const randomReviews = Math.floor(Math.random() * 1000) + 1; // 1 to 1000

            await set(newRef, {
                ...userData,
                // Ensure coordinates are stored as numbers for Mobile App
                lat: userData.lat ? parseFloat(userData.lat) : null,
                lng: userData.lng ? parseFloat(userData.lng) : null,
                rating: randomRating, // Stored as String
                reviews: String(randomReviews), // Stored as String
                createdAt: timestamp,
                updatedAt: timestamp,
                status: userData.status || 'active'
            });

            console.log("User created successfully at:", `${COLLECTION_NAME}/${nextId}`);
            return nextId;

        } catch (error) {
            console.error("Error creating user (RTDB):", error);
            throw error;
        }
    },

    // Update an existing user
    updateUser: async (id, data) => {
        try {
            const userRef = ref(db, `${COLLECTION_NAME}/${id}`);
            const timestamp = new Date().toISOString();

            await update(userRef, {
                ...data,
                updatedAt: timestamp
            });
        } catch (error) {
            console.error("Error updating user:", error);
            throw error;
        }
    },

    // Delete a user
    deleteUser: async (userId) => {
        try {
            const userRef = ref(db, `${COLLECTION_NAME}/${userId}`);
            await remove(userRef);
        } catch (error) {
            console.error("Error deleting user:", error);
            throw error;
        }
    },

    // Bulk update status
    bulkUpdateStatus: async (userIds, status) => {
        try {
            const updates = {};
            const timestamp = new Date().toISOString();

            userIds.forEach(id => {
                updates[`${COLLECTION_NAME}/${id}/status`] = status;
                updates[`${COLLECTION_NAME}/${id}/updatedAt`] = timestamp;
            });

            await update(ref(db), updates);
        } catch (error) {
            console.error("Error bulk updating users:", error);
            throw error;
        }
    },

    // Bulk delete users
    bulkDelete: async (userIds) => {
        try {
            const updates = {};
            userIds.forEach(id => {
                updates[`${COLLECTION_NAME}/${id}`] = null;
            });

            await update(ref(db), updates);
        } catch (error) {
            console.error("Error bulk deleting users:", error);
            throw error;
        }
    }
};
