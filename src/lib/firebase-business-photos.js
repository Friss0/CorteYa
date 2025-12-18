import { storage, db } from './firebase';
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { ref as dbRef, get, update, set } from 'firebase/database';

/**
 * Firebase Business Photos & Data Service
 * Handles uploading photos AND persisting business profile data to Realtime Database.
 */
export const FirebaseBusinessPhotosService = {

  // --- REALTIME DATABASE METHODS ---

  /**
   * Get business data including photos, hours, services, etc.
   * Maps DB structure (barbershops/{uid}) to UI structure.
   */
  async getBusinessWithPhotos(businessId, userId) {
    try {
      // Note: In new structure, userId (UID) IS the identifier in 'barbershops'
      const uid = userId;
      const businessRef = dbRef(db, `barbershops/${uid}`);
      const snapshot = await get(businessRef);

      if (!snapshot.exists()) {
        return { data: null, error: null }; // No data yet
      }

      const dbData = snapshot.val();

      // MAPPING DB -> UI
      const uiData = {
        businessName: dbData.name || '',
        address: dbData.address || '',
        city: dbData.city || 'Buenos Aires', // Default if missing
        province: dbData.province || 'buenosaires',
        phone: dbData.phone || '', // Need to ensure phone is stored
        email: dbData.email || '',
        description: dbData.description || '',
        website: dbData.website || '',

        // Images
        profilePhotoUrl: dbData.image || null,
        coverPhotoUrl: dbData.heroImage || null,

        // Hours: DB 'hours' -> UI 'openingHours'
        // DB format: { mon: {open, close}, ... }
        // UI format: { monday: {open, close, closed}, ... }
        openingHours: this.mapHoursDbToUi(dbData.hours),

        // Services: DB 'services' object -> UI 'businessServices' array
        servicesDict: dbData.services || {}, // Keep raw for reference if needed

        // Staff: DB 'professionals' object -> UI 'barbers' array
        barbersDict: dbData.professionals || {}
      };

      return { data: uiData, error: null };
    } catch (error) {
      console.error("Error getting business data:", error);
      return { data: null, error };
    }
  },

  /**
   * Update business info (text, hours, services, etc)
   */
  async updateBusinessInfo(businessId, userId, uiData) {
    try {
      const uid = userId;
      const businessRef = dbRef(db, `barbershops/${uid}`);

      // MAPPING UI -> DB
      const dbUpdate = {
        name: uiData.businessName,
        address: uiData.address,
        city: uiData.city,
        province: uiData.province,
        phone: uiData.phone,
        email: uiData.email,
        description: uiData.description,
        website: uiData.website,
        updatedAt: Date.now(),

        // Hours
        hours: this.mapHoursUiToDb(uiData.openingHours),

        // We don't overwrite images here unless passed, handled by photo upload usually. 
        // But if uiData has them, sync them.
        ...(uiData.profilePhotoUrl ? { image: uiData.profilePhotoUrl } : {}),
        ...(uiData.coverPhotoUrl ? { heroImage: uiData.coverPhotoUrl } : {}),
      };

      // Handle Services & Professionals if passed separately or need conversion
      // The Component passes 'businessData' which might not contain the arrays if they are separate states.
      // We'll need to handle that in the Component or expect them in 'uiData'.
      // Assumption: uiData contains everything needed for the main update.

      await update(businessRef, dbUpdate);
      return { data: { success: true }, error: null };

    } catch (error) {
      console.error("Error updating business info:", error);
      return { data: null, error };
    }
  },

  /**
   * Create new business
   */
  async createBusiness(userId, uiData) {
    // Same as update for RTDB (set/update)
    return this.updateBusinessInfo(null, userId, uiData);
  },

  /**
   * Save Services (Array -> DB Object)
   */
  async saveServices(userId, servicesArray) {
    const uid = userId;
    const servicesRef = dbRef(db, `barbershops/${uid}/services`);

    // Convert Array to Object map
    const servicesObj = {};
    servicesArray.forEach((svc, index) => {
      // Use existing ID or generate one (s1, s2...)
      const key = svc.id && String(svc.id).startsWith('s') ? svc.id : `s${index + 1}_${Date.now()}`;
      servicesObj[key] = {
        id: key,
        title: svc.name,
        price: Number(svc.price),
        duration: Number(svc.duration),
        description: svc.description || ''
      };
    });

    await set(servicesRef, servicesObj);
  },

  /**
   * Save Professionals (Array -> DB Object)
   */
  async saveBarbers(userId, barbersArray) {
    const uid = userId;
    const prosRef = dbRef(db, `barbershops/${uid}/professionals`);

    // Convert Array to Object map
    const prosObj = {};
    barbersArray.forEach((barber, index) => {
      const key = barber.id && String(barber.id).startsWith('p') ? barber.id : `p${index + 1}_${Date.now()}`;
      prosObj[key] = {
        id: key,
        name: barber.name,
        avatar: barber.profilePhoto || '', // Map UI profilePhoto -> DB avatar
        specialties: barber.specialties || [],
        rating: 5.0 // Default
      };
    });

    await set(prosRef, prosObj);
  },

  // --- STORAGE METHODS (Original) ---

  async uploadPhoto(fileOrBase64, businessId, photoType, userId) {
    try {
      if (!['profile', 'cover'].includes(photoType)) throw new Error('Invalid photo type');

      let imageUrl = fileOrBase64;

      // If it's a File object (legacy path), we'd need to convert, but we expect Base64 string now.
      // However, if logic still passes File, we should handle error or convert.
      // For now, assuming input is the Data URL string.

      // Validate it's a string
      if (typeof fileOrBase64 !== 'string') {
        // If it's a file, try to identify or throw. 
        // Ideally, the component sends the string.
        console.warn("Expected Base64 string, got object. Validation might need update.");
      }

      console.log(`Saving ${photoType} photo as Base64 for ${userId}...`);

      // Directly update the DB record
      const dbKey = photoType === 'profile' ? 'image' : 'heroImage';
      await update(dbRef(db, `barbershops/${userId}`), {
        [dbKey]: imageUrl,
        updatedAt: Date.now()
      });

      return { data: { downloadURL: imageUrl }, error: null };
    } catch (error) {
      console.error('Save error:', error);
      return { error: { message: error.message } };
    }
  },

  async deletePhoto(photoUrl, businessId, photoType, userId) {
    // In this simplified version, we just nullify the DB field. 
    // Deleting from Storage by URL requires parsing the ref, which is complex.
    // We will just remove the reference from DB.
    try {
      const dbKey = photoType === 'profile' ? 'image' : 'heroImage';
      await update(dbRef(db, `barbershops/${userId}`), {
        [dbKey]: null,
        updatedAt: Date.now()
      });
      return { data: { success: true }, error: null };
    } catch (error) {
      return { error };
    }
  },

  // --- HELPERS ---

  mapHoursDbToUi(dbHours) {
    if (!dbHours) return null; // Let UI set default

    const dayMap = { mon: 'monday', tue: 'tuesday', wed: 'wednesday', thu: 'thursday', fri: 'friday', sat: 'saturday', sun: 'sunday' };
    const uiHours = {};

    Object.keys(dayMap).forEach(dbKey => {
      const uiKey = dayMap[dbKey];
      if (dbHours[dbKey]) {
        uiHours[uiKey] = {
          open: dbHours[dbKey].open,
          close: dbHours[dbKey].close,
          closed: false
        };
      } else {
        uiHours[uiKey] = { open: '09:00', close: '20:00', closed: true };
      }
    });
    return uiHours;
  },

  mapHoursUiToDb(uiHours) {
    if (!uiHours) return {};
    const dayMapReverse = { monday: 'mon', tuesday: 'tue', wednesday: 'wed', thursday: 'thu', friday: 'fri', saturday: 'sat', sunday: 'sun' };
    const dbHours = {};

    Object.keys(uiHours).forEach(uiKey => {
      const dayData = uiHours[uiKey];
      if (!dayData.closed) {
        const dbKey = dayMapReverse[uiKey];
        if (dbKey) {
          dbHours[dbKey] = {
            open: dayData.open,
            close: dayData.close
          };
        }
      }
    });
    return dbHours;
  }
};

export default FirebaseBusinessPhotosService;