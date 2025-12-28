//yacine
const express = require('express');
const {
  addPost,
  browsePosts,
  addComment,
  likePost,
  unlikePost,
  getPostById,
  getCommentsByPostId,
  updateTravellerProfile,
  reportPost
} = require('../controllers/postController');
const router = express.Router();
router.use(express.json());
router.use(express.json({ limit: '50mb' }))
router.post('/travellers/:travellerId/update', async (req, res) => {
  try {
    const travellerId = req.params.travellerId;
    const updateData = req.body;
    const result = await updateTravellerProfile(travellerId, updateData);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
router.post('/posts/:postId/report', async (req, res) => {
  try {
    const postId = parseInt(req.params.postId);
    const reportData = { ...req.body, post_id: postId };
    const result = await reportPost(reportData);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});
router.post('/posts', async (req, res) => {
  try {
    const postData = req.body;
    const images = req.files ? req.files.map(file => ({
      name: file.originalname,
      content: file.buffer,
      mimeType: file.mimetype
    })) : [];
    const newPost = await addPost(postData, images);
    res.status(201).json({ success: true, data: newPost });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
router.get('/posts/:postId/comments', async (req, res) => {
  try {
    const postId = parseInt(req.params.postId);
    const result = await getCommentsByPostId(postId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
router.get('/posts', async (req, res) => {
  try {
    const pageSize = parseInt(req.query.pageSize) || 10;
    const pageNum = parseInt(req.query.pageNum) || 1;
    const travellerId = req.query.travellerId ? String(req.query.travellerId) : null;
    const result = await browsePosts(pageSize, pageNum, travellerId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
router.post('/posts/:postId/comments', async (req, res) => {
  try {
    const postId = parseInt(req.params.postId);
    const commentData = { ...req.body, postId };
    const newComment = await addComment(commentData);
    res.status(201).json({ success: true, data: newComment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
router.post('/posts/:postId/like', async (req, res) => {
  try {
    const postId = parseInt(req.params.postId);
    const { travellerId } = req.body;
    const result = await likePost(travellerId, postId);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});
router.post('/posts/:postId/unlike', async (req, res) => {
  try {
    const postId = parseInt(req.params.postId);
    const { travellerId } = req.body;
    const result = await unlikePost(travellerId, postId);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});
router.get('/posts/:postId', async (req, res) => {
  try {
    const postId = parseInt(req.params.postId);
    const post = await getPostById(postId);
    res.status(200).json({ success: true, data: post });
  } catch (error) {
    if (error.message === 'Post not found') {
      return res.status(404).json({ success: false, error: error.message });
    }
    res.status(500).json({ success: false, error: error.message });
  }
});
module.exports = router;