import { JWTPayload, UserToken } from '@/models/token.model';
import { userTokenAtom } from '@/store/user';
import axios from 'axios';
import { Buffer } from 'buffer';
import { env } from './env';
import { store } from './jotai';
import { queryClient } from './query-client';

class Session {
  setToken = (token: UserToken) => {
    store.set(userTokenAtom, token);
  };

  clear = async () => {
    store.set(userTokenAtom, null);
    await queryClient.clear();
  };

  getToken = async () => {
    const token = await store.get(userTokenAtom);
    if (token) {
      try {
        const payload = this.decodeToken(token.accessToken);
        if (payload) {
          if (payload.exp <= Date.now() / 1000) {
            try {
              const newToken = await axios
                .post<{ access: string; refresh: string }>(
                  `${env.get('API_ENDPOINT')}/api/token/refresh/`,
                  {
                    refresh: token.refreshToken,
                  },
                )
                .then((res) => res.data);
              await this.setToken({
                accessToken: newToken.access,
                refreshToken: newToken.refresh,
              });
              return newToken.access;
            } catch (err) {
              console.log('Token refresh', err);
              await this.clear();
              return null;
            }
          }
        }
      } catch (err) {
        console.log('Token parse', err);
        await this.clear();
        return null;
      }
    }
    return token?.accessToken || null;
  };

  decodeToken = (token: string): JWTPayload | null => {
    try {
      if (token) {
        return JSON.parse(
          Buffer.from(token.split('.')[1], 'base64').toString(),
        );
      }
    } catch (err) {
      console.log('Token parse', err);
    }
    return null;
  };
}

const session = new Session();

// session.clear(); // Make sure to comment this before committing

export default session;
