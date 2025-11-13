import createHttp from "./BaseService";

const http = createHttp(true);

/**
 * Updates user information (requires authentication).
 *
 * @param {string} id - User ID
 * @param {Object} userData - Updated user data
 * @returns {Promise<Object>} Updated user object
 */
export const editUser = (id, userData) => {
  if (!id) {
    return Promise.reject(new Error("User ID is required"));
  }
  return http.put(`/edit/${id}`, userData);
};

/**
 * Deletes a user account (requires authentication).
 *
 * @param {string} id - User ID
 * @returns {Promise<void>} Resolves when user is deleted
 */
export const deleteUser = (id) => {
  if (!id) {
    return Promise.reject(new Error("User ID is required"));
  }
  return http.delete(`/user/${id}`);
};

/**
 * Uploads a user avatar image (requires authentication).
 *
 * @param {FormData} formData - FormData containing the image file
 * @returns {Promise<Object>} Upload response with image URL
 */
export const uploadAvatarService = (formData) => {
  if (!formData || !(formData instanceof FormData)) {
    return Promise.reject(new Error("FormData with image file is required"));
  }
  return http.post("/user/upload-avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
