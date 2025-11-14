import createHttp from "./BaseService";

const httpPublic = createHttp(false);

/**
 * Registers a new user (public endpoint).
 * Validates required fields and ensures data is properly formatted.
 *
 * @param {Object} user - User registration data
 * @param {string} user.name - User's name
 * @param {string} user.email - User's email
 * @param {string} user.password - User's password
 * @param {string} user.gender - User's gender
 * @param {number} [user.weight] - User's weight in kg (optional)
 * @param {number} [user.height] - User's height in cm (optional)
 * @param {string} user.objetive - User's objective
 * @param {string} user.ability - User's cooking ability level
 * @param {string} user.typeDiet - User's diet type
 * @param {string} user.alergic - User's allergies
 * @returns {Promise<void>} Resolves when user is created
 */
export const createUser = (user) => {
  if (!user?.email || !user?.password) {
    return Promise.reject(new Error("Email and password are required"));
  }

  // Log request data in development for debugging
  if (import.meta.env.DEV) {
    console.log("[UserService] Registering user with data:", {
      ...user,
      password: user.password ? "***" : undefined,
    });
  }

  return httpPublic.post("/register", user);
};

/**
 * Authenticates a user and returns a JWT token (public endpoint).
 *
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.email - User's email
 * @param {string} credentials.password - User's password
 * @returns {Promise<string>} JWT token
 */
export const loginService = (credentials) => {
  if (!credentials?.email || !credentials?.password) {
    return Promise.reject(new Error("Email and password are required"));
  }
  return httpPublic.post("/login", credentials);
};


