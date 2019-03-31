import firebase from '../Utils/FirebaseUtils';

class FbFlashCardUsuarioService {
  constructor() {
    this.ref = firebase.firestore().collection('flasCardUsuario');
  }

  async save(payload) {
    const result = await this.ref.add(payload);
    return result;
  }

  async update(word) {
    try {
      const doacaoDoc = await this.ref.doc(word.id);
      await doacaoDoc.update(word);
    } catch (err) {
      throw err;
    }
  }

  async load(id) {
    try {
      return await this.ref.doc(id).get();
    } catch (err) {
      throw err;
    }
  }

  async delete(word) {
    try {
      const doacaoDoc = await this.ref.doc(word.id);
      await doacaoDoc.delete();
    } catch (err) {
      throw err;
    }
  }

  async fetchAll() {
    try {
      const result = [];

      await this.ref.get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
          result.push({ id: doc.id, ...doc.data() });
        });
      });
      return result;
    } catch (err) {
      throw new Error('Erro ao obter lista de pets.');
    }
  }

  async fetchByUser({ user }) {
    if (!user) {
      throw new Error('usuário não pode ser nulo.');
    }
    const result = [];
    try {
      if (user.uid) {
        await this.ref
          .where('user', '==', user.uid)
          .get()
          .then(querySnapshot => {
            querySnapshot.forEach(doc => {
              result.push({ id: doc.id, ...doc.data() });
            });
          });
      }
    } catch (err) {
      console.log({ err });
      throw new Error('Erro ao obter lista de pets.');
    }
    return result;
  }
}
export default new FbFlashCardUsuarioService();
