import { atom } from 'recoil';

type AuthModalState = {
  isOpen: boolean;
  type: 'login' | 'register' | 'forgotPassword';
};

const initalAuthModalState: AuthModalState = {
  isOpen: false,
  type: 'login',
};

// eslint-disable-next-line import/prefer-default-export
export const authModalState = atom<AuthModalState>({
  key: 'authModalState',
  default: initalAuthModalState,
});
