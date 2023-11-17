const router = require('express').Router();
const {
    getAllThoughts,
    getThoughtByID,
    addThought,
    updateThought,
    removeThought,
    addReaction,
    removeReaction,
    
} = require('../../controllers/thought-controller');

// /api/thought
router.route('/').get(getAllThoughts);
// /api/thought/:id
router.route('/:id').get(getThoughtByID).put(updateThought).delete(removeThought);
// /api/thought/:userId
router.route('/:userId').post(addThought);
// /api/thought/:thoughtId/reaction'
router.route('/:thoughtId/reaction').post(addReaction);
// /api/thought/:thoughtId/reactions/:reactionsId
router.route('/:thoughtId/reactions/:reactionsId').delete(removeReaction);

module.exports = router;