import { createSelector } from 'reselect';

const storeLocal = state => state.flashCard;

const selectorLoading = () =>
  createSelector(
    storeLocal,
    store => store.loading
  );
const selectorError = () =>
  createSelector(
    storeLocal,
    store => store.error
  );
const selectorMessage = () =>
  createSelector(
    storeLocal,
    store => store.message
  );
const selectorListFlasCard = () =>
  createSelector(
    storeLocal,
    store => store.listFlasCard
  );
const selectorSelectedCard = () =>
  createSelector(
    storeLocal,
    store => store.selectedCard
  );
const selectorShowAnswer = () =>
  createSelector(
    storeLocal,
    store => store.showAnswer
  );

export {
  selectorLoading,
  selectorError,
  selectorMessage,
  selectorListFlasCard,
  selectorSelectedCard,
  selectorShowAnswer
};
