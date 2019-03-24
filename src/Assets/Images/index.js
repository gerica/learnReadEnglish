export const tipos = ['cao', 'gato'];

export const naoDefinidos = [
  // { name: 'dog_undefined.png', uri: require('./cachorro/dog_undefined.png') },
];

export function getNaoDefinido() {
  const index = Math.floor(Math.random() * 5);
  return naoDefinidos[index].uri;
}
