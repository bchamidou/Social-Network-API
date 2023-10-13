const { Thought, User } = require('../models/index'); // Import Thought and User models

const thoughtController = { // Define thoughtController object that contains various contorllers functions

 // Get all thoughts function
 async getAllThoughts(req, res){
    try{
        const thought = await Thought
        .find()
        .populate({
            path: 'reactions',
            select:'-__v'
        })
        .select('-__v');

    if(!thought.length){
        return res.status(404).json({message: "Not thoughts created"})
    }

    res.json(thought)
    return;
    }
    catch(err){
        res.status(500).json(err);
    }
 },
 // Get one specific thought and reaction function
 async getThoughtByID({params}, res) {
    try{
        const thought = await Thought
        .findOne({_id: params.thoughtId})
        .populate({
            path:'reactions',
            select:'-__v'
        })
        .select('-__v');

    if(!thought){
        return res.status(404).json({message: "This thought couldn't be found"})
    }

    res.json(thought)
    return;
    }

    catch(err){
        res.status(404).json({message: "This thought couldn't be found"})
    }
 },

// Add thought function
async addThought ({body}, res){ 
    try {
        const {_id} = await Thought.create(body) //Creates a new thought using the Thought.create method and the request body. the _id property of the created thought is destructured and stored in the _id variable

        if(!_id) {
            return res.status(500).json({message: "Thought creation was unsuccessful"})
        }

        const user = await User.findOneAndUpdate( // Find the user with the specified body.userId and update their thoughts array by pushing the _id of the newly created thought
            {_id: body.userId}, //_id is a special property in MongoDB - Get the "userId" provided in the req body
            {$push: {thoughts: _id}},
            {new: true, runValidators: true} // The updated user is returned and any validation rules are run
        )

        if(!user){
            return res.status(404).message({message: "A user with that ID could not be found"})
        }

        res.json(user) // If both the thought creation and user update are successful, a response is sent with the updated user object
        return;
    }

    catch(err) {
        res.status(500).json({message: "Something went wrong with the server", error : err})
    }
},

 // Update a specific thought function
 async updateThought({params, body}, res){
    try{
        const thought = await Thought.findByIdAndUpdate(
            {_id: params.thoughtId},
            body,
            {new: true, runValidators: true}
        )

        if(!thought){
            return res.status(404).json({message: "This thought couldn't be found" })
        }

        res.json(thought)
        return;
    }
    catch(err){
        res.status(500).json(err);
    }
 },
 
  // Remove thought function
  async removeThought({params}, res) {
    try{
        const deletedThought = await Thought.findOneAndDelete({_id: params.thoughtId})
        if(!deletedThought){
            return res.status(404).json({message: "A comment with this id could not be found"})
        }

        res.json(deletedThought)
        return;
    }
    catch(err){
        res.status(500).json(err)
    }
},

 // Add Reaction function
 async addReaction({params, body}, res) {
    try{
        const reaction = await Thought.findOneAndUpdate(
            {_id: params.thoughtId},
            {$push: {reactions: body}},
            {new: true, runValidators: true}
        )

        if(!reaction){
            return res.status(404).json({message: "This thought couldn't be found"})
        }

        res.json(reaction)
        return;
    }
    catch(err){
        res.status(500).json(err)
    }
 },

// Remove a reaction function
async removeReaction({ params, query}, res){
    try {
        const thought = await Thought.findByIdAndUpdate(
            {_id: params.thoughtId},
            {$pull: {reactions: {reactionId: query.reactionId}}},
            {new: true}
        )

        if(!thought){
            return res.status(404).json({message: "This thought couldn't be found"})
        }

        res.json(thought)
        return;
    }

    catch(err){
        res.status(500).json({message:"Something went wrong with the server", error : err})
    }
}

}

module.exports = thoughtController;