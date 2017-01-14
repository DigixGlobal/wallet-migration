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
export function importKeystores(files) {
  return (dispatch) => {
    return Promise.all(files.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsText(file, 'UTF-8');
        reader.onload = () => {
          try {
            const keystore = JSON.parse(reader.result);
            resolve({
              keystore,
              key: `${keystore.addresses[0]}${new Date().getTime()}`,
            });
          } catch (e2) { reject(e2); }
        };
      });
    })).then((keystores) => {
      dispatch({ type: GOT_KEYSTORES, keystores });
    }).catch(() => {
      alert("Couldn't read files");
    });
  };
}
export function importMnemonic(mnemonic, password = '') {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      return lightwallet.keystore.createVault({
        password,
        seedPhrase: mnemonic,
      }, (err, ks) => {
        if (err) { return reject(err); }
        return ks.keyFromPassword(password, (err2, pwDerivedKey) => {
          if (err2) { return reject(err2); }
          ks.generateNewAddress(pwDerivedKey, 1);
          ks.addresses = ks.getAddresses();
          dispatch({
            type: GOT_KEYSTORES,
            keystores: [{
              keystore: ks,
              unlocked: ks,
              pwDerivedKey,
              key: `${ks.addresses[0]}${new Date().getTime()}`,
            }],
          });
          return resolve();
        });
      });
    });
  };
}
export function unlockKeystore(keystore, password) {
  return (dispatch) => {
    dispatch({ type: UNLOCKING_ACCOUNT, key: keystore.key });
    return new Promise((resolve, reject) => {
      const serializedKs = JSON.stringify(keystore.keystore);
      try {
        return lightwallet.upgrade.upgradeOldSerialized(serializedKs, password, (err2, res) => {
          if (err2) { return reject(err2); }
          return resolve(lightwallet.keystore.deserialize(res));
        });
      } catch (err3) {
        return reject(err3);
      }
    })
    .then((ks) => {
      return new Promise((resolve) => {
        ks.keyFromPassword(password, (err, pwDerivedKey) => {
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
