/*
 * Mode démo de Yoga (NumDev).
 * L’API Spring Boot du projet est simulée dans le navigateur : comptes,
 * séances et participations restent dans le localStorage du visiteur. Toutes
 * les données de départ sont fictives. L’application appelle l’API avec des
 * chemins relatifs (api/session, api/auth/login…), que ce script intercepte.
 */
(function () {
  'use strict';

  var API_PATH = /(?:^|\/)api\/((?:auth|session|teacher|user)(?:\/[^?#]*)?)(?:[?#].*)?$/;
  var STORE_KEY = 'yoga_demo_store_v1';
  var BANNER_KEY = 'yoga_demo_banner';
  var ROOT = new URL('./', document.currentScript.src).href;
  var RESPONSE_DELAY = 150;
  var ACCOUNTS = {
    admin: { email: 'yoga@studio.com', password: 'test!1234' },
    member: { email: 'demo@yoga.fr', password: 'Demo1234' }
  };
  var STATUS_TEXT = { 200: 'OK', 400: 'Bad Request', 401: 'Unauthorized', 404: 'Not Found' };

  var nativeOpen = XMLHttpRequest.prototype.open;
  var nativeSend = XMLHttpRequest.prototype.send;
  var nativeSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
  var store = null;

  /* ---------- Outils ---------- */

  function readStore() {
    try {
      var raw = window.localStorage.getItem(STORE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  }

  function saveStore() {
    try {
      window.localStorage.setItem(STORE_KEY, JSON.stringify(store));
    } catch (error) {
      /* Stockage plein ou bloqué : les données restent en mémoire pour la session. */
    }
  }

  function sha256(text) {
    if (window.crypto && window.crypto.subtle && window.TextEncoder) {
      return window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)).then(function (buffer) {
        return Array.prototype.map.call(new Uint8Array(buffer), function (byte) {
          return ('0' + byte.toString(16)).slice(-2);
        }).join('');
      });
    }
    return Promise.resolve('plain:' + text);
  }

  function parse(body) {
    try { return JSON.parse(body); } catch (error) { return {}; }
  }

  function reply(status, payload) {
    return { status: status, payload: payload };
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function userFromRequest(headers) {
    var auth = headers.Authorization || headers.authorization || '';
    var match = /^Bearer demo\.([^.]+)\./.exec(auth);
    if (!match) {
      return null;
    }
    try {
      var email = window.atob(match[1]);
      return store.users.filter(function (user) { return user.email === email; })[0] || null;
    } catch (error) {
      return null;
    }
  }

  function publicUser(user) {
    return { id: user.id, email: user.email, lastName: user.lastName, firstName: user.firstName, admin: user.admin, createdAt: user.createdAt, updatedAt: user.updatedAt };
  }

  /* ---------- Données de départ ---------- */

  function seedStore(hashes) {
    var created = '2026-01-12T09:00:00.000';
    var users = [
      { id: 1, email: ACCOUNTS.admin.email, firstName: 'Admin', lastName: 'Yoga', admin: true, passwordHash: hashes.admin, createdAt: created, updatedAt: created },
      { id: 2, email: ACCOUNTS.member.email, firstName: 'Alex', lastName: 'Démo', admin: false, passwordHash: hashes.member, createdAt: created, updatedAt: created },
      { id: 3, email: 'lea.martin@yoga.fr', firstName: 'Léa', lastName: 'Martin', admin: false, passwordHash: hashes.member, createdAt: created, updatedAt: created },
      { id: 4, email: 'noah.bernard@yoga.fr', firstName: 'Noah', lastName: 'Bernard', admin: false, passwordHash: hashes.member, createdAt: created, updatedAt: created }
    ];
    var teachers = [
      { id: 1, firstName: 'Camille', lastName: 'Laurent', createdAt: created, updatedAt: created },
      { id: 2, firstName: 'Hugo', lastName: 'Marchand', createdAt: created, updatedAt: created }
    ];
    var sessions = [
      { id: 1, name: 'Yoga du matin', description: 'Un enchaînement doux pour réveiller le corps et bien démarrer la journée : salutations au soleil, mobilité des épaules et du dos, respiration.', date: '2026-12-05T08:30:00.000+00:00', teacher_id: 1, users: [2, 3], createdAt: created, updatedAt: created },
      { id: 2, name: 'Vinyasa énergie', description: 'Une séance dynamique qui relie le souffle au mouvement, pour travailler la force et l’endurance. Niveau intermédiaire.', date: '2026-12-08T18:30:00.000+00:00', teacher_id: 2, users: [4], createdAt: created, updatedAt: created },
      { id: 3, name: 'Yin et étirements', description: 'Des postures tenues longtemps pour relâcher les tensions profondes, avec un temps de relaxation en fin de séance.', date: '2026-12-12T19:00:00.000+00:00', teacher_id: 1, users: [], createdAt: created, updatedAt: created },
      { id: 4, name: 'Méditation guidée', description: 'Trente minutes pour poser l’attention sur la respiration, apaiser les pensées et terminer la semaine plus sereinement.', date: '2026-12-18T12:15:00.000+00:00', teacher_id: 2, users: [2], createdAt: created, updatedAt: created },
      { id: 5, name: 'Yoga prénatal', description: 'Des postures sûres et des exercices de respiration adaptés aux futures mamans, dans une ambiance bienveillante.', date: '2027-01-09T10:00:00.000+00:00', teacher_id: 1, users: [3], createdAt: created, updatedAt: created }
    ];
    return { users: users, teachers: teachers, sessions: sessions };
  }

  function ensureStore() {
    if (store) {
      return Promise.resolve(store);
    }
    store = readStore();
    if (store) {
      return Promise.resolve(store);
    }
    return Promise.all([sha256(ACCOUNTS.admin.password), sha256(ACCOUNTS.member.password)]).then(function (hashes) {
      store = seedStore({ admin: hashes[0], member: hashes[1] });
      saveStore();
      return store;
    });
  }

  /* ---------- Routes de l’API ---------- */

  function login(data) {
    var email = String(data.email || '').trim().toLowerCase();
    var user = store.users.filter(function (item) { return item.email.toLowerCase() === email; })[0];
    if (!user) {
      return Promise.resolve(reply(401, { message: 'Bad credentials' }));
    }
    return sha256(String(data.password || '')).then(function (hash) {
      if (hash !== user.passwordHash) {
        return reply(401, { message: 'Bad credentials' });
      }
      return reply(200, {
        token: 'demo.' + window.btoa(user.email) + '.' + Date.now().toString(36), type: 'Bearer', id: user.id,
        username: user.email, firstName: user.firstName, lastName: user.lastName, admin: user.admin
      });
    });
  }

  function register(data) {
    var email = String(data.email || '').trim();
    if (!email || !data.firstName || !data.lastName || !data.password) {
      return Promise.resolve(reply(400, { message: 'Error: invalid registration' }));
    }
    if (store.users.some(function (item) { return item.email.toLowerCase() === email.toLowerCase(); })) {
      return Promise.resolve(reply(400, { message: 'Error: Email is already taken!' }));
    }
    return sha256(String(data.password)).then(function (hash) {
      var stamp = nowIso();
      store.users.push({ id: store.users.reduce(function (max, item) { return Math.max(max, item.id); }, 0) + 1, email: email, firstName: data.firstName, lastName: data.lastName, admin: false, passwordHash: hash, createdAt: stamp, updatedAt: stamp });
      saveStore();
      return reply(200, { message: 'User registered successfully!' });
    });
  }

  function handleSession(method, parts, body) {
    var data = parse(body);
    var id = parts[1];
    if (!id) {
      if (method === 'GET') {
        return reply(200, store.sessions);
      }
      if (method === 'POST') {
        if (!data.name || !data.date || !data.teacher_id || !data.description) {
          return reply(400, { message: 'Invalid session' });
        }
        var stamp = nowIso();
        var session = { id: store.sessions.reduce(function (max, item) { return Math.max(max, item.id); }, 0) + 1, name: data.name, description: data.description, date: data.date, teacher_id: Number(data.teacher_id), users: [], createdAt: stamp, updatedAt: stamp };
        store.sessions.push(session);
        saveStore();
        return reply(200, session);
      }
    }
    if (!/^\d+$/.test(id)) {
      return reply(400, null);
    }
    var target = store.sessions.filter(function (item) { return String(item.id) === id; })[0];
    if (!target) {
      return reply(404, null);
    }
    if (parts[2] === 'participate') {
      var userId = parts[3];
      if (!/^\d+$/.test(userId || '')) {
        return reply(400, null);
      }
      var uid = Number(userId);
      if (method === 'POST') {
        if (target.users.indexOf(uid) >= 0) {
          return reply(400, null);
        }
        target.users.push(uid);
        saveStore();
        return reply(200, null);
      }
      if (method === 'DELETE') {
        if (target.users.indexOf(uid) < 0) {
          return reply(400, null);
        }
        target.users = target.users.filter(function (item) { return item !== uid; });
        saveStore();
        return reply(200, null);
      }
    }
    if (method === 'GET') {
      return reply(200, target);
    }
    if (method === 'PUT') {
      ['name', 'description', 'date', 'teacher_id'].forEach(function (key) {
        if (data[key] !== undefined) { target[key] = key === 'teacher_id' ? Number(data[key]) : data[key]; }
      });
      target.updatedAt = nowIso();
      saveStore();
      return reply(200, target);
    }
    if (method === 'DELETE') {
      store.sessions = store.sessions.filter(function (item) { return item.id !== target.id; });
      saveStore();
      return reply(200, null);
    }
    return reply(404, null);
  }

  function handleOther(method, parts, user) {
    var id = parts[1];
    if (parts[0] === 'teacher') {
      if (!id) {
        return reply(200, store.teachers);
      }
      if (!/^\d+$/.test(id)) {
        return reply(400, null);
      }
      var teacher = store.teachers.filter(function (item) { return String(item.id) === id; })[0];
      return teacher ? reply(200, teacher) : reply(404, null);
    }
    if (parts[0] === 'user' && id) {
      if (!/^\d+$/.test(id)) {
        return reply(400, null);
      }
      var target = store.users.filter(function (item) { return String(item.id) === id; })[0];
      if (!target) {
        return reply(404, null);
      }
      if (method === 'GET') {
        return reply(200, publicUser(target));
      }
      if (method === 'DELETE') {
        if (target.id !== user.id) {
          return reply(401, null);
        }
        store.users = store.users.filter(function (item) { return item.id !== target.id; });
        store.sessions.forEach(function (session) { session.users = session.users.filter(function (uid) { return uid !== target.id; }); });
        saveStore();
        return reply(200, null);
      }
    }
    return reply(404, null);
  }

  function route(method, path, body, headers) {
    var parts = path.split('/').filter(Boolean);
    return ensureStore().then(function () {
      if (parts[0] === 'auth' && parts[1] === 'login' && method === 'POST') {
        return login(parse(body));
      }
      if (parts[0] === 'auth' && parts[1] === 'register' && method === 'POST') {
        return register(parse(body));
      }
      var user = userFromRequest(headers);
      if (!user) {
        return reply(401, { message: 'Unauthorized' });
      }
      return parts[0] === 'session' ? handleSession(method, parts, body) : handleOther(method, parts, user);
    });
  }

  /* ---------- Interception de XMLHttpRequest (Angular HttpClient) ---------- */

  function finish(xhr, url, result) {
    var empty = result.payload === null || result.payload === undefined;
    var text = empty ? '' : JSON.stringify(result.payload);
    var fields = {
      readyState: 4,
      status: result.status,
      statusText: STATUS_TEXT[result.status] || '',
      responseURL: url,
      responseText: text,
      response: xhr.responseType === 'json' ? (empty ? null : JSON.parse(text)) : text
    };
    Object.keys(fields).forEach(function (key) {
      Object.defineProperty(xhr, key, { value: fields[key], configurable: true });
    });
    xhr.getAllResponseHeaders = function () { return empty ? '' : 'content-type: application/json\r\n'; };
    xhr.getResponseHeader = function (name) { return !empty && /^content-type$/i.test(name) ? 'application/json' : null; };
    xhr.dispatchEvent(new Event('readystatechange'));
    xhr.dispatchEvent(new ProgressEvent('load'));
    xhr.dispatchEvent(new ProgressEvent('loadend'));
  }

  XMLHttpRequest.prototype.open = function (method, url) {
    var match = API_PATH.exec(String(url));
    this.__demo = match ? { method: String(method).toUpperCase(), url: String(url), path: match[1], headers: {} } : null;
    if (this.__demo) {
      return nativeOpen.call(this, method, window.location.href);
    }
    return nativeOpen.apply(this, arguments);
  };

  XMLHttpRequest.prototype.setRequestHeader = function (name, value) {
    if (this.__demo) {
      this.__demo.headers[name] = value;
    }
    return nativeSetRequestHeader.apply(this, arguments);
  };

  XMLHttpRequest.prototype.send = function (body) {
    var demo = this.__demo;
    if (!demo) {
      return nativeSend.apply(this, arguments);
    }
    var xhr = this;
    route(demo.method, demo.path, body, demo.headers)
      .catch(function () { return reply(500, { message: 'Erreur de la démo' }); })
      .then(function (result) {
        window.setTimeout(function () { finish(xhr, demo.url, result); }, RESPONSE_DELAY);
      });
  };

  /* ---------- Bandeau d’information ---------- */

  function showBanner() {
    try {
      if (window.sessionStorage.getItem(BANNER_KEY) === 'closed') {
        return;
      }
    } catch (error) { /* sessionStorage indisponible */ }
    var banner = document.createElement('div');
    banner.setAttribute('role', 'note');
    banner.style.cssText = 'position:fixed;left:12px;bottom:12px;z-index:99999;max-width:340px;padding:10px 12px;' +
      'border-radius:10px;background:#1f2933;color:#fff;font:13px/1.45 Arial,sans-serif;box-shadow:0 4px 14px rgba(0,0,0,.35)';
    banner.innerHTML = '<strong>Version de démonstration</strong> : l’API est simulée dans votre navigateur ' +
      '(les données restent sur votre appareil). Toutes les données sont fictives.<br>' +
      'Administrateur : <code style="color:#9fe0c2">' + ACCOUNTS.admin.email + '</code> / <code style="color:#9fe0c2">' + ACCOUNTS.admin.password + '</code><br>' +
      'Participant : <code style="color:#9fe0c2">' + ACCOUNTS.member.email + '</code> / <code style="color:#9fe0c2">' + ACCOUNTS.member.password + '</code><br>' +
      '<a href="#" data-reset style="color:#9fe0c2">Réinitialiser la démo</a> · <a href="#" data-close style="color:#9fe0c2">Fermer</a>';
    banner.querySelector('[data-close]').addEventListener('click', function (event) {
      event.preventDefault();
      try { window.sessionStorage.setItem(BANNER_KEY, 'closed'); } catch (error) { /* ignoré */ }
      banner.remove();
    });
    banner.querySelector('[data-reset]').addEventListener('click', function (event) {
      event.preventDefault();
      try { window.localStorage.removeItem(STORE_KEY); } catch (error) { /* ignoré */ }
      window.location.href = ROOT;
    });
    document.body.appendChild(banner);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', showBanner);
  } else {
    showBanner();
  }
})();
