import {
  GOT_KEYSTORES,
  UNLOCKING_ACCOUNT,
  UNLOCKED_ACCOUNT,
  UNLOCK_FAILED,
} from '../actions/keystore';

function updatedKeystore(state, key, update) {
  const keystores = state.keystores.map((oldKs) => {
    if (key !== oldKs.key) { return oldKs; }
    return { ...oldKs, ...update };
  });
  return { ...state, keystores };
}

export default function (state = {}, action) {
  switch (action.type) {
    case GOT_KEYSTORES:
      return { ...state, keystores: action.keystores, loaded: true };
    case UNLOCKING_ACCOUNT:
      return updatedKeystore(state, action.key, { unlocking: true });
    case UNLOCKED_ACCOUNT:
      console.log('action', action);
      return updatedKeystore(state, action.key, {
        unlocking: false,
        error: false,
        unlocked: action.keystore,
        pwDerivedKey: action.pwDerivedKey,
      });
    case UNLOCK_FAILED:
      return updatedKeystore(state, action.key, { unlocking: false, error: action.error });
    default:
      return state;
  }
}
