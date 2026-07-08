const AdminAuth = {
  _ready: false,
  _hadUser: false,

  init() {
    if (!initFirebase()) return false;

    auth.onAuthStateChanged((user) => {
      this._ready = true;
      const onLoginPage = window.location.pathname.includes("login.html");

      if (user && onLoginPage) {
        window.location.replace("dashboard.html");
        return;
      }

      if (user) {
        this._hadUser = true;
        return;
      }

      // Only redirect to login after user was logged in and signed out
      if (!onLoginPage && this._hadUser && !window.__loginInProgress) {
        window.location.replace("login.html");
      }
    });

    return true;
  },

  async requireUser() {
    if (!auth) return null;

    if (typeof auth.authStateReady === "function") {
      await auth.authStateReady();
    } else {
      await new Promise((resolve) => {
        const unsub = auth.onAuthStateChanged(() => {
          unsub();
          resolve();
        });
      });
    }

    this._ready = true;
    const user = auth.currentUser;
    const onLoginPage = window.location.pathname.includes("login.html");

    if (user) {
      this._hadUser = true;
      return user;
    }

    if (!onLoginPage && !window.__loginInProgress) {
      window.location.replace("login.html");
    }

    return null;
  },

  whenReady() {
    return this.requireUser();
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
