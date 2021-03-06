const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const createToken = (user, secret, expiresIn) => {
  const { username, email } = user
  return jwt.sign({ username, email }, secret, { expiresIn });
}

module.exports = {
  Query: {
    getPosts: async (_, args, { Post }) => {
      return await Post.find({}).sort({createdDate: 'desc'}).populate({
        path: 'createdBy',
        model: 'User'
      })
    },
    getUserPosts: async (_, { userId }, { Post }) => {
      return await Post.find({
        createdBy: userId
      });
    },
    getPost: async (_, { postId }, { Post }) => {
      return await Post.findOne({_id: postId}).populate({
        path: 'messages.messageUser',
        model: 'User'
      })
    },
    getCurrentUser: async (_, args, { User, currentUser }) => {
      if (!currentUser) {
        return null
      }
      return await User.findOne({username: currentUser.username}).populate({
        path: 'favorites',
        model: 'Post'
      });
    },
    searchPosts: async (_, { searchTerm }, { Post }) => {
      if (searchTerm) {
        return await Post.find(
            //perform text search for a search value of 'searchTerm'
            {$text: {$search: searchTerm}},
            //Assign 'searchTerm' a textScore to provide best match
            {score: {$meta: 'textScore'}}
            //Sort results according to that textScore (as well as by likes in descending order)
        ).sort({
          score: {$meta: 'textScore'},
          likes: 'desc'
        }).limit(5)
      }
    },
    infiniteScrollPosts: async (_, { pageNum, pageSize }, { Post }) => {
      let posts;
      if (pageNum === 1) {
        posts = await Post.find({})
          .sort({ createdDate: "desc" })
          .populate({
            path: "createdBy",
            model: "User"
          })
          .limit(pageSize);
      } else {
        // If page number is greater than one, figure out how many documents to skip
        const skips = pageSize * (pageNum - 1);
        posts = await Post.find({})
          .sort({ createdDate: "desc" })
          .populate({
            path: "createdBy",
            model: "User"
          })
          .skip(skips)
          .limit(pageSize);
      }
      const totalDocs = await Post.countDocuments();
      const hasMore = totalDocs > pageSize * pageNum;
      return { posts, hasMore };
    }
  },
  Mutation: {
    addPost: async (
      _,
      { title, imageUrl, categories, description, creatorId },
      { Post }
    ) => {
      return await new Post({
        title,
        imageUrl,
        categories,
        description,
        createdBy: creatorId
      }).save();
    },
    deleteUserPost: async (_, { postId }, { Post }) => {
      return await Post.findOneAndRemove({_id: postId});
    },
    updateUserPost: async (_, { postId, userId, title, imageUrl, categories, description }, { Post }) => {
      return await Post.findOneAndUpdate(
          //Find post by postId and createdBy
          {_id: postId, createdBy: userId},
          {$set: {title, imageUrl, categories, description}},
          {new: true}
      );
    },
    addPostMessage: async (_, { messageBody, userId, postId }, { Post }) => {
      const newMessage = {
        messageBody,
        messageUser: userId,
      }
      const post = await Post.findOneAndUpdate(
        //find post by id
        { _id: postId },
        // prepend new message to beginning of messages array
        { $push: { messages: { $each: [newMessage], $position: 0 } } },
        //return fresh document update
        { new: true }
      ).populate({
        path: 'messages.messageUser',
        model: 'User'
      })
      return post.messages[0]
    },
    likePost: async (_, { postId, username }, { Post, User }) => {
      //Find Post, add 1 to it's likes field
      const post = await Post.findOneAndUpdate(
        { _id: postId },
        { $inc: { likes: 1 } },
        { new: true }
      );
      //Find User, add id of post to its favorites array (which will be populated as posts)
      const user = await User.findOneAndUpdate(
        { username },
        { $addToSet: { favorites: postId } },
        { new: true }
      ).populate({
        path: 'favorites',
        model: 'Post'
      })
      //Return only likes from 'post' and favorites from 'user'
      return { likes: post.likes, favorites: user.favorites }
    },
    unlikePost: async (_, { postId, username }, { Post, User }) => {
      //Find Post, add -1 to it's likes field
      const post = await Post.findOneAndUpdate(
        { _id: postId },
        { $inc: { likes: -1 } },
        { new: true }
      );
      //Find User, remove id of post from its favorites array (which will be populated as posts)
      const user = await User.findOneAndUpdate(
        { username },
        { $pull: { favorites: postId } },
        { new: true }
      ).populate({
        path: 'favorites',
        model: 'Post'
      })
      //Return only likes from 'post' and favorites from 'user'
      return { likes: post.likes, favorites: user.favorites }
    },
    signinUser: async (_, { username, password }, { User }) => {
      const user = await User.findOne({ username });
      if (!user) {
        throw new Error('User Not Found');
      }
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error('Invalid Password')
      }
      return { token: createToken(user, process.env.SECRET, '1hr') }
    },
    signupUser: async (_, { username, email, password }, { User }) => {
      const user = await User.findOne({ username });
      if (user) {
        throw new Error('User Already Exists')
      }
      const newUser = await new User({
        username,
        email,
        password
      }).save();
      return { token: createToken(newUser, process.env.SECRET, '1hr') }
    }
  }
}
