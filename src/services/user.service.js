const httpStatus = require('http-status');
const {
    UserModel,
} = require('../models');
const ApiError = require('../utils/apiError');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
    if (await UserModel.isEmailTaken(userBody.email)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Username already taken');
    }
    const user = await UserModel.create(userBody);
    return user;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => UserModel.findById(id);

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>} 
 */
const getUserByEmail = async email => UserModel.findOne({
    email
}).populate({
    path: 'store',
    component: 'Store',
    select: 'displayName address'
});

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
    const user = await getUserById(userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    if (updateBody.email && (await UserModel.isEmailTaken(updateBody.email, userId))) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Username already taken');
    }
    Object.assign(user, updateBody);
    await user.save();
    return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await UserModel.remove();
  return user;
};

module.exports = {
    createUser,
    getUserById,
    updateUserById,
    getUserByEmail,
    deleteUserById
  };