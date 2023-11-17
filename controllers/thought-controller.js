const { Thought, User } = require('../models/index');

const thoughtController = {

//GET all thoughts
  getAllThoughts(req, res) {
    Thought.find({})
      .populate({
        path: "reactions",
        select: "__v",
      })
      .select("-__v")
      .sort({ _id: -1 })
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },
//GET thought by id
  getThoughtByID({params}, res) {
        Thought.findOne({_id: params.id})
                .select('-__v')
                .then(dbThoughtData => {
                    if(!dbThoughtData) {
                        res.status(404).json({message: 'No thought found with this id!'});
                        return;
                    }
                    res.json(dbThoughtData);
                })
                .catch(err => res.status(400).json(err));
  },
//POST thought
  addThought({ params, body }, res) {
    console.log(body);
    Thought.create(body)
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: params.userId },
          { $push: { thoughts: _id } },
          { new: true }
        );
      })
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: "No user found with this id"});
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.json(err));
  },
//PUT update thought
updateThought({params, body}, res) {
  console.log(params);
  Thought.findOneAndUpdate({ _id: params.id}, body, { new: true, runValidators: true })
  .then(dbThoughtData => {
      if (!dbThoughtData) {
          res.status(404).json({message: 'No thought found with this id!'});
          return;
      }
      res.json(dbThoughtData);
  })
  .catch(err => res.status(400).json(err));
},
//DELETE thought
removeThought({params}, res) {
  Thought.findOneAndDelete({ _id: params.id})
  .then(dbThoughtData => {
      if(!dbThoughtData) {
          res.status(404).json({message: 'No thought found with this id!'});
          return;
      }
      res.json(dbThoughtData);
  })
  .catch(err => res.status(400).json(err));
},


//**Reactions are in thoughts**

//POST reaction
  addReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $push: { reactions: body } },
      { new: true, runValidators: true }
    )
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          return res
            .status(404)
            .json({ message: "No thought found with this id" });
        }
        res.json(dbThoughtData);
      })
      .catch((err) => res.json(err));
  },
//DELETE reaction
    removeReaction({ params }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { reactionId: params.reactionId } } },
      { new: true, runValidators: true }
    )
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          return res
            .status(404)
            .json({ message: "No thought found with this id!" });
        }
        res.json(dbThoughtData);
      })
      .catch((err) => res.json(err));
  },
};

module.exports = thoughtController;