const usersService=require("../services/users.service");
async function create(req, res) {
  const { username, email, fullname, bio } = req.body;
  if (!username || !email || !fullname) {
    return res.status(400).json({ error: "username, email and fullname are required" });
  }
  try {
    const user = await usersService.createUser({ username, email, fullname, bio });
    return res.status(201).json(user);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ error: "username or email already taken" });
    }
    throw error;
  }
}
async function list(req, res){
  const users = await usersService.listUsers();
  res.json(users);
}
async function getOne(req, res){
  const user = await usersService.getUserById(Number(req.params.id));
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json(user);
}
async function update(req, res){
  const data = {};
  const { fullname, bio, isPrivate } = req.body;
  if (fullname !== undefined) data.fullname = fullname;
  if (bio !== undefined) data.bio = bio;
  if (isPrivate !== undefined) data.isPrivate = isPrivate;
  try {
    const user = await usersService.updateUser(Number(req.params.id), data);
    res.json(user);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "User not found" });
    }
    throw error;
  }
}
async function remove(req, res){
  try {
    await usersService.deleteUser(Number(req.params.id));
    res.status(204).send();
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "User not found" });
    }
    throw error;
  }
}
module.exports = { create, list, getOne, update, remove };
