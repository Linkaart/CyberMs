let accessToken: string | null = null;

const tokenService = {
  getToken() {
    return accessToken;
  },
  setToken(token: string) {
    accessToken = token;
  },
  clearToken() {
    accessToken = null;
  },
};

export default tokenService;
