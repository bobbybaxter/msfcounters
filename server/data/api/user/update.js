module.exports = async function updateUser({
  id, username, email, patreonId, patronStatus,
}, firebaseDb) {
  firebaseDb.ref(`users/${id}`).update({
    username,
    email,
    patreonId,
    patronStatus,
  });

  return 'ok';
};
