import sleep from 'celia/sleep';
import {
  LOGIN_UPDATE_STATE,
  LOGIN_UPDATE_FIELDS,
  LOGIN_DIRECTLY,
  LOGIN_SUCCESS
} from '../constants/dispatch-types';

export default {
  state: {
    disabledUsername: true,
    disabledPassword: true,
    isLogging: false,
    passwordStatus: '',
    password: '',
    fields: {
      username: '',
      password: ''
    }
  },
  mutations: {
    [LOGIN_UPDATE_FIELDS](state, content) {
      Object.assign(state.fields, content);
    },
    [LOGIN_UPDATE_STATE](state, content) {
      Object.assign(state, content);
    },
    [LOGIN_SUCCESS](state) {
      let now = Date.now();
      const session = Math.random().toString(36).slice(2) + now.toString(36);
      now = new Date(now + 30 * 60 * 1000);
      document.cookie = `TMD_SESSIONID=${session};expires=${now.toUTCString()}`;

      state.isLogging = false;
    }
  },
  actions: {
    async [LOGIN_DIRECTLY]({ getState, dispatch }) {
      // 按钮上出现loading
      dispatch(LOGIN_UPDATE_STATE, { isLogging: true });

      const { username, password } = getState().login.fields;
      if (username === 'admin' && password === 'admin') {
        await sleep(2000);
        dispatch(LOGIN_SUCCESS);
        return { code: 200 };
      } else {
        dispatch(LOGIN_UPDATE_STATE, { isLogging: false });
        return Promise.reject({ code: 401, message: '用户名或者密码错误' });
      }
    }
  }
};
