const KEY = 'tkn_gzap';

export const signOut = () => {
  window.location.href = '/';
  sessionStorage.removeItem(KEY);
};
