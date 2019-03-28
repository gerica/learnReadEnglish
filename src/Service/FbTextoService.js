
import firebase from '../Utils/FirebaseUtils';

class FbTextoService {
  constructor() {
    this.ref = firebase.firestore().collection('baseTexto');
  }

  async save(payload) {
    const result = await this.ref.add(payload);
    return result;
  }

  async updateInfo({ payload }) {
    try {
      const { doacao, status } = payload;

      const doacaoDoc = await this.ref.doc(doacao.id);
      await doacaoDoc.update({ status });
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

}
export default new FbTextoService();
