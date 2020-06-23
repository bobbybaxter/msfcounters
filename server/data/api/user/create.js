module.exports = async function createUser(user, firebaseDb) {
  firebaseDb.ref(`users/${user.id}`).set({
    email: user.email,
    username: '',
    patreonId: '',
    patronStatus: '',
  });
  return user;
};
