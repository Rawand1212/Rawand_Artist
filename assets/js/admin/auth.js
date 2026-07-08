const AdminAuth = {
  _ready: false,

  init() {
    if (!initFirebase()) return false;

    auth.authStateReady().then(() => {
      this._ready = true;
      this._handleAuthState(auth.currentUser);
    });

    auth.onAuthStateChanged((user) => {
      if (!this._ready) return;
      this._handleAuthState(user);
    });

    return true;
  },

  _handleAuthState(user) {
    const isLoginPage = window.location.pathname.includes("login.html");

    if (user && isLoginPage) {
      window.location.replace("dashboard.html");
    } else if (!user && !isLoginPage) {
      window.location.replace("login.html");
    }
  },

  whenReady() {
    if (!auth) return Promise.resolve(null);
    return auth.authStateReady().then(() => {
      this._ready = true;
      return auth.currentUser;
    });
  },

  async login(email, password) {
    if (!auth) throw { code: "auth/not-initialized", message: "Firebase Auth failed to load. Please refresh the page." };
    return auth.signInWithEmailAndPassword(email.trim(), password);
  },

  async logout() {
    if (auth) await auth.signOut();
    window.location.href = "login.html";
  },

  getUser() {
    return auth?.currentUser;
  }
};
