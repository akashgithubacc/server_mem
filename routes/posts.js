import express from "express";
import {
  getPosts,
  createPost,
  updatePost,
  getPost,
  deletePost,
  likePost,
  getPostsBySearch,
} from "../controllers/posts.js";

const router = express.Router();

router.get("/", getPosts);
router.get("/search", getPostsBySearch);
router.get("/:id", getPost);
router.post("/", createPost);
//.patch is used to update the existing documents
//"/:id"  here id is dynamic
router.patch("/:id", updatePost);
router.delete("/:id", deletePost);
router.patch("/:id/likePost", likePost);

export default router;
