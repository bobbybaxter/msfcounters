module.exports = (app) => async function updateUser(req, res) {
  const { id } = req.params;
  const {
    username, email, patreonId, patronStatus,
  } = req.body;

  const payload = {
    id,
    username,
    email,
    patreonId,
    patronStatus,
  };

  const user = await app.data.user.update(payload, app.firebaseDb);
  res.send(user);
};
