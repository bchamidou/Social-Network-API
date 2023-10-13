const { User, Thought} = require ('../models/index')

const userController = {

    // Get all Users function
    async getAllUsers(req, res) {
        try {
            const users = await User
            .find()
            .populate({
                path: "thoughts",
                select:"-__",
            })
            .populate({
                path: "friends",
                select:"-__v"
            })
            .select("-__v")

        if(!users.length){
            return res.status(404).json({message: "No users created yet"})
        }

        res.json(users)
        return;
        }
        catch(err){
            res.status(500).json(err)
        }
    },


    // Get a specific User function
    async getUserByID({params}, res) {
        try {
            const user = await User.findOne ({_id: params.id})
                                    .populate({
                                        path: "thoughts",
                                        select: "-__v",
                                    })
                                    .populate({
                                        path: "friends",
                                        select: "-__v",
                                    })
                                    .select("-__v")

            if(!user){
                return res.status(404).json({message:"A user with that ID could not be found"})
            }

            res.json(user)
            return;
        }
        catch(err){
            res.status(500).json(err)
        }
    },


    // Create a new User function
    async createNewUser({body}, res) {
        try{
            const user = await User.create(body)
            res.json(user)
            return;
        }
        catch(err){
            res.status(500).json(err)
        }
    },


    //  Update a specific User
    async updateUser({params, body}, res) {
        try{
            const user = await User.findOneAndUpdate(
                {_id: params.id},
                body,
                {new: true, runValidators: true})

            if(!user){
                return res.status(404).json({message: "A user with that ID could not be found"})
            }

            res.json(user)
            return;
        }

        catch(err){
            res.status(500).json(err)
        }
    },

    // Delete a specific User and user's thoughts
    async deleteUser({params}, res){
        try{
            const deleteUser = await User.findByIdAndDelete({_id: params.id})
            const deletedThoughts = await Thought.remove({
                _id: {
                    $in: deleteUser.thoughts
                }
            })

            res.json({deleteUser, deletedThoughts})
            return;
        }
        catch(err){
            res.status(404).json({message: "A user with that ID could not be found", error: err})
        }
    },

    
    // Add a Friend function
    async addFriend({ params }, res){
        try {
            const user = await User.findOneAndUpdate(
                {_id: params.id},
                {$push: {friends: params.friendId}},
                {new: true}
            )

            if(!user){
                return res.status(404).json({message: "A user with that ID could not be found"})
            }

            res.json(user)
            return;
        }
        catch(err){
            res.status(500).json(err)
        }
    },


    // Remove a Friend function
async deleteFriend({params}, res){
    try{
        const user = await User.findOneAndUpdate(
            {_id: params.id},
            {$pull: {friends: params.friendId}},
            {new: true}
        )
        if(!user){
            return res.status(500).json({message: "A user with that ID could not be found"})
        }

        res.json(user)
        return;
    }
    catch(err){
        res.status(500).json(err)
    }
}
};

module.exports = userController;