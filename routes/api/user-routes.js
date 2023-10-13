const router = require('express').Router();
const {
    getAllUsers,
    getUserByID,
    createNewUser,
    updateUser,
    deleteUser,
    addFriend,
    deleteFriend,
} = require('../../controllers/user-controller');

// /api/user
router.route('/').get(getAllUsers).post(createNewUser);
// /api/user/:id
router.route('/:id').get(getUserByID).put(updateUser).delete(deleteUser);
// /api/user/:id/friend/:friendId'
router.route('/:id/friend/:friendId').post(addFriend).delete(deleteFriend);

module.exports = router;