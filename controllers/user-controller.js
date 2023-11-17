const { User, Thought } = require('../models');
const mongoose = require('mongoose');

const userController = {

//GET all users
  getAllUsers(req, res) {
    User.find({})
      .populate([
        {
          path: "thoughts",
          select: "-__v",
        },
        {
          path: "friends",
          select: "-__v"
        }
      ])
      .select("-__v")
      .sort({ _id: -1 })
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },
//GET user by id
    getUserByID({ params }, res) {
    User.findOne({ _id: params.id })
      .populate([
        {
          path: "thoughts",
          select: "-__v",
        },
        {
          path: "friends",
          select: "-__v",
        }
      ])
      .select("-__v")
      .then((dbUserData) => {
        // if no user is found, send 404
        if (!dbUserData) {
          res.status(404).json({ message: "No user found with this id" });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },
//POST a new user
    createNewUser({ body }, res) {
    User.create(body)
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => res.status(400).json(err));
  },

//PUT update user by ID
  updateUser({ params, body }, res) {
    User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: "No user found with this id" });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.status(400).json(err));
  },
//DELETE user by ID
  deleteUser({ params }, res) {
    User.findOneAndDelete({ _id: params.id })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: "No user found with this id" });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.status(400).json(err));
  },

 // POST to add a new friend to a user's friend list
    addFriend({ params }, res) {
    User.updateMany(
      { _id:(params.id)}, 
      { $push: {friends:(params.friendId)}},
      { new: true, runValidators: true}
    )
        .populate({
            path: 'friends',
            select: '_id'
        })
        .select('-__v')
        .then(dbUserData => {
            // console.log('db user data print')
            console.log(dbUserData);
            if(!dbUserData) {
                res.status(404).json({ message: 'No user found with this id!'})
                return;
            }
            // res.json(dbUserData)
            User.findOne({ _id: params.id })
                .then(user => {
                    res.json(user);
                })
        })
        .catch(err => {
            res.status(400).json(err)
        })
   },

// DELETE to remove a friend from a user's friend list
  deleteFriend({ params }, res) {
    User.findByIdAndUpdate(
      { _id: params.id}, 
      { $pull: {friends: params.friendId}},
      { new: true, runValidators: true}
  )
      .populate({
          path: 'friends',
          select: '_id'
      })
      .select('-__v')
      .then(dbUserData => {
          if(!dbUserData) {
              res.status(404).json({ message: 'No user found with this id!'})
              return;
          }
          res.json(dbUserData)
      })
      .catch(err => {
          res.status(400).json(err)
      })
    }
};

module.exports = userController;