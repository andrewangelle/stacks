import { atom } from "recoil";
import { recoilPersist } from 'recoil-persist'

const { persistAtom } = recoilPersist()

export const signedInState = atom({
  key: 'isSignedIn',
  default: false
});

export type TokenType = {
  access_token: string;
  expires_at: string;
  expires_in: string;
  refresh_token: string;
  token_type: string;
  user: Record<'id', string>
};

export const tokenState = atom<TokenType | null>({
  key: 'token',
  default: null,
  effects_UNSTABLE: [persistAtom],
});
