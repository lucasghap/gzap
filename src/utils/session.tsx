const KEY = 'tkn_gzap';

export const signOut = () => {
  window.location.href = '/';
  localStorage.removeItem(KEY);
};
