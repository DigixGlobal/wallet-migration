import lightwallet from 'eth-lightwallet';

export const GOT_KEYSTORES = 'GOT_KEYSTORES';
export const UNLOCKED_ACCOUNT = 'UNLOCKED_ACCOUNT';
export const UNLOCKING_ACCOUNT = 'UNLOCKING_ACCOUNT';
export const UNLOCK_FAILED = 'UNLOCK_FAILED';

export function getKeystores() {
  return (dispatch) => {
    const wallets = JSON.parse(localStorage.getItem('digixWallets') || '[]');
    const keystores = wallets.map(key => ({ keystore: JSON.parse(localStorage.getItem(`digixKeyStore-${key}`)), key }));
    dispatch({ type: GOT_KEYSTORES, keystores });
  };
}
export function unlockKeystore(keystore, password) {
  return (dispatch) => {
    dispatch({ type: UNLOCKING_ACCOUNT, key: keystore.key });
    return new Promise((resolve, reject) => {
      const serializedKs = JSON.stringify(keystore.keystore);
      try {
        return resolve(lightwallet.keystore.deserialize(serializedKs));
      } catch (err) {
        try {
          lightwallet.upgrade.upgradeOldSerialized(serializedKs, password, (err2, res) => {
            if (err2) { return reject(err2); }
            return resolve(lightwallet.keystore.deserialize(res));
          });
        } catch (err3) {
          return reject(err3);
        }
      }
    })
    .then((ks) => {
      console.log('returning deserialized', ks);
      return new Promise((resolve) => {
        lightwallet.keystore.deriveKeyFromPassword(password, (err, pwDerivedKey) => {
          if (err) { throw err; }
          resolve(pwDerivedKey);
        });
      }).then((pwDerivedKey) => ({ keystore: ks, pwDerivedKey }));
    }).then((payload) => {
      return dispatch({ type: UNLOCKED_ACCOUNT, ...payload, key: keystore.key });
    })
    .catch((error) => dispatch({ type: UNLOCK_FAILED, keystore, error: error.message, key: keystore.key }));
  };
}
