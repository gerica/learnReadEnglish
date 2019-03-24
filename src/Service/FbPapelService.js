import firebase from '../Utils/FirebaseUtils';

class FbPapelService {
  constructor() {
    this.ref = firebase.firestore().collection('usuarioPapel');
  }

  async save(payload) {
    try {
      const docUser = await this.ref.add(payload);
      const getUser = await docUser.get();
      return { ...getUser.data() };
    } catch (error) {
      throw error;
    }
  }

  async delete(payload) {
    try {
      await this.ref.doc(payload.idDoc).delete();
    } catch (error) {
      throw error;
    }
  }

  async update({
    user: {
      userCustom: { idDoc }
    },
    dados
  }) {
    try {
      await this.ref.doc(idDoc).update(dados);
    } catch (error) {
      throw error;
    }
  }

  async getByIdUser(user) {
    try {
      const fbUserPapel = await this.ref
        .where('user', '==', user.id || user.uid)
        .get();
      const result = [];
      fbUserPapel.forEach(doc => {
        result.push({ idDoc: doc.id, ...doc.data() });
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  async load({ id }) {
    try {
      const doc = await this.ref.doc(id).get();
      // var query = citiesRef.where("state", "==", "CA");
      if (doc.exists) {
        return { idDoc: doc.id, ...doc.data() };
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  async fetchAll() {
    const result = [];
    await this.ref.get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        result.push({ id: doc.id, ...doc.data() });
      });
    });
    return result;
  }
}

export default new FbPapelService();
