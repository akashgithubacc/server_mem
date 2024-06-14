import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js";
import express from "express";

const router = express.Router();

export const getPosts = async (req, res) => {
  const { page } = req.query;
  try {
    const LIMIT = 8;
    const startIndex = (Number(page) - 1) * LIMIT;
    const total = await PostMessage.countDocuments({});

    const posts = await PostMessage.find()
      .sort({ _id: -1 })
      .limit(LIMIT)
      .skip(startIndex);

    //console.log("posts");

    res.status(200).json({
      data: posts,
      currentPage: Number(page),
      numberOfPages: Math.ceil(total / LIMIT),
    });
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

//Difference Between query and params
//Query => /posts?page=1  means page =1
//Params => /posts/123    means id =1

export const getPostsBySearch = async (req, res) => {
  const { searchQuery, tags } = req.query;

  const newTags = tags;

  try {
    const title = new RegExp(searchQuery, "i"); // "i" stands for ignore the casing of the searchQuery
    // RegExp is used to convert it into a regualr expresion
    //so it is easier for mongodb to understand it

    const tagsArray = newTags.split(",");

    const posts = await PostMessage.find({
      $or: [{ tags: { $in: newTags.split(",") } }, { title }],
    });

    res.json({ data: posts });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getPost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await PostMessage.findById(id);

    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createPost = async (req, res) => {
  //This createPost will take input when the form is submitted
  //on the front end and its body contains the required
  //post to be created.
  //So in post = request's body is stored.
  //newPost arranges them or writes in the schema of PostMessage

  const post = req.body;
  const newPost = new PostMessage(post);

  try {
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  const { id: _id } = req.params;
  const post = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("No posts with that id");

  // Here we are grabbing the id of the post to be edited.
  // First we are checking that the post id exists in the mongoose
  // database.

  // then by PostMessage.findByIdAndUpdate() we update the post
  // in the mongoDb database. PostMessage is the Mongodb database created
  // using mongoose.

  const updatedPost = await PostMessage.findByIdAndUpdate(
    _id,
    { ...post, _id },
    { new: true }
  );

  res.json(updatedPost);
};

export const deletePost = async (req, res) => {
  const { id: _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("No posts with that id");

  await PostMessage.findByIdAndRemove(_id);

  res.json({ message: "Post deleted successfully" });
};

export const likePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No posts with that id");

  const post = await PostMessage.findById(id);

  const updatedPost = await PostMessage.findByIdAndUpdate(
    id,
    { likeCount: post.likeCount + 1 },
    { new: true }
  );

  res.json(updatedPost);
};

export default router;
