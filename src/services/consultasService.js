import { db } from '../lib/firebase';
import { ref, set, get } from 'firebase/database';

const COLLECTION_NAME = 'consultas';

export const consultasService = {
    // Create a new inquiry (consulta) with Sequential ID
    createConsulta: async (data) => {
        try {
            const consultasRef = ref(db, COLLECTION_NAME);
            const timestamp = new Date().toISOString();

            // 1. Fetch existing keys to determine next ID
            const snapshot = await get(consultasRef);
            let nextId = "1"; // Default start

            if (snapshot.exists()) {
                const existingData = snapshot.val();
                const keys = Object.keys(existingData);

                // Find max numeric ID
                const maxId = keys.reduce((max, key) => {
                    const num = parseInt(key, 10);
                    return !isNaN(num) && num > max ? num : max;
                }, 0);

                // Increment
                nextId = String(maxId + 1);
            }

            console.log("Generated New Consulta ID:", nextId);

            // 2. Save data to consultas/{nextId}
            const newConsultaRef = ref(db, `${COLLECTION_NAME}/${nextId}`);

            await set(newConsultaRef, {
                ...data,
                id: nextId, // Store ID inside document too
                createdAt: timestamp,
                status: 'pending' // pending, contacted, resolved
            });

            return nextId;
        } catch (error) {
            console.error("Error creating consulta:", error);
            throw error;
        }
    }
};
