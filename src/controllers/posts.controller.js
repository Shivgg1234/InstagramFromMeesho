const postsService = require("../services/posts.service");
async function create(req, res) {
  const { imageUrl, caption, location } = req.body;
  if (!imageUrl) {
    return res.status(400).json({ error: "imageUrl is required" });
  }
  const post = await postsService.createPost({ imageUrl, caption, location });
  res.status(201).json(post);
}
async function list(req, res){
  const posts = await postsService.listPosts();
  res.json(posts);
}
async function getOne(req, res){
  const post = await postsService.getPostById(Number(req.params.id));
  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }
  res.json(post);
}
async function update(req, res){
  const data = {};
  const { caption, location } = req.body;
  if (caption !== undefined){
    data.caption = caption
  };
  if (location !== undefined) {
    data.location = location
  };
  try{
    const post = await postsService.updatePost(Number(req.params.id), data);
    res.json(post);
  }catch (error){
    if (error.code === "P2025"){
      return res.status(404).json({ error: "Post not found" });
    }
    throw error;
  }
}
async function remove(req, res){
  try{
    await postsService.deletePost(Number(req.params.id));
    res.status(204).send();
  }catch (error){
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Post not found" });
    }
    throw error;
  }
}
module.exports = { create, list, getOne, update, remove };
