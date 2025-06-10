import xs, { app as ke, ipcMain as J, BrowserWindow as ht } from "electron";
import { fileURLToPath as vs } from "node:url";
import me from "node:path";
import xe from "util";
import G from "path";
import Te from "fs";
import Xe from "crypto";
import Sa from "os";
import re, { Readable as bs } from "stream";
import Ra from "http";
import Aa from "https";
import En, { fileURLToPath as gs } from "url";
import ys from "assert";
import Ta from "tty";
import fe from "zlib";
import { EventEmitter as ws } from "events";
import Es, { spawn as za } from "child_process";
import { Worker as ks } from "worker_threads";
import _s from "net";
function Ze(n) {
  return n && n.__esModule && Object.prototype.hasOwnProperty.call(n, "default") ? n.default : n;
}
var Pe = {}, Fn, Ba;
function Ss() {
  return Ba || (Ba = 1, Fn = (n) => function() {
    const e = arguments.length, i = new Array(e);
    for (let a = 0; a < e; a += 1)
      i[a] = arguments[a];
    return new Promise((a, t) => {
      i.push((o, s) => {
        o ? t(o) : a(s);
      }), n.apply(null, i);
    });
  }), Fn;
}
var Ln, $a;
function oe() {
  if ($a) return Ln;
  $a = 1;
  const n = Te, e = Ss(), i = (o) => [
    typeof n[o] == "function",
    !o.match(/Sync$/),
    !o.match(/^[A-Z]/),
    !o.match(/^create/),
    !o.match(/^(un)?watch/)
  ].every(Boolean), a = (o) => {
    const s = n[o];
    return e(s);
  };
  return Ln = (() => {
    const o = {};
    return Object.keys(n).forEach((s) => {
      i(s) ? s === "exists" ? o.exists = () => {
        throw new Error("fs.exists() is deprecated");
      } : o[s] = a(s) : o[s] = n[s];
    }), o;
  })(), Ln;
}
var qe = {}, Dn, Ma;
function ie() {
  if (Ma) return Dn;
  Ma = 1;
  const n = (p) => {
    const l = (u) => ["a", "e", "i", "o", "u"].indexOf(u[0]) !== -1 ? `an ${u}` : `a ${u}`;
    return p.map(l).join(" or ");
  }, e = (p) => /array of /.test(p), i = (p) => p.split(" of ")[1], a = (p) => e(p) ? a(i(p)) : [
    "string",
    "number",
    "boolean",
    "array",
    "object",
    "buffer",
    "null",
    "undefined",
    "function"
  ].some((l) => l === p), t = (p) => p === null ? "null" : Array.isArray(p) ? "array" : Buffer.isBuffer(p) ? "buffer" : typeof p, o = (p, l, u) => u.indexOf(p) === l, s = (p) => {
    let l = t(p), u;
    return l === "array" && (u = p.map((m) => t(m)).filter(o), l += ` of ${u.join(", ")}`), l;
  }, x = (p, l) => {
    const u = i(l);
    return t(p) !== "array" ? !1 : p.every((m) => t(m) === u);
  }, d = (p, l, u, m) => {
    if (!m.some((c) => {
      if (!a(c))
        throw new Error(`Unknown type "${c}"`);
      return e(c) ? x(u, c) : c === t(u);
    }))
      throw new Error(
        `Argument "${l}" passed to ${p} must be ${n(
          m
        )}. Received ${s(u)}`
      );
  };
  return Dn = {
    argument: d,
    options: (p, l, u, m) => {
      u !== void 0 && (d(p, l, u, ["object"]), Object.keys(u).forEach((r) => {
        const c = `${l}.${r}`;
        if (m[r] !== void 0)
          d(p, c, u[r], m[r]);
        else
          throw new Error(
            `Unknown argument "${c}" passed to ${p}`
          );
      }));
    }
  }, Dn;
}
var ve = {}, Nn = {}, Ha;
function ja() {
  return Ha || (Ha = 1, Nn.normalizeFileMode = (n) => {
    let e;
    return typeof n == "number" ? e = n.toString(8) : e = n, e.substring(e.length - 3);
  }), Nn;
}
var Fe = {}, Va;
function Ca() {
  if (Va) return Fe;
  Va = 1;
  const n = oe(), e = ie(), i = (o, s) => {
    const x = `${o}([path])`;
    e.argument(x, "path", s, ["string", "undefined"]);
  }, a = (o) => {
    n.rmSync(o, {
      recursive: !0,
      force: !0,
      maxRetries: 3
    });
  }, t = (o) => n.rm(o, {
    recursive: !0,
    force: !0,
    maxRetries: 3
  });
  return Fe.validateInput = i, Fe.sync = a, Fe.async = t, Fe;
}
var Wa;
function je() {
  if (Wa) return ve;
  Wa = 1;
  const n = G, e = oe(), i = ja(), a = ie(), t = Ca(), o = (v, y, w) => {
    const C = `${v}(path, [criteria])`;
    a.argument(C, "path", y, ["string"]), a.options(C, "criteria", w, {
      empty: ["boolean"],
      mode: ["string", "number"]
    });
  }, s = (v) => {
    const y = v || {};
    return typeof y.empty != "boolean" && (y.empty = !1), y.mode !== void 0 && (y.mode = i.normalizeFileMode(y.mode)), y;
  }, x = (v) => new Error(
    `Path ${v} exists but is not a directory. Halting jetpack.dir() call for safety reasons.`
  ), d = (v) => {
    let y;
    try {
      y = e.statSync(v);
    } catch (w) {
      if (w.code !== "ENOENT")
        throw w;
    }
    if (y && !y.isDirectory())
      throw x(v);
    return y;
  }, f = (v, y) => {
    const w = y || {};
    try {
      e.mkdirSync(v, w.mode);
    } catch (C) {
      if (C.code === "ENOENT")
        f(n.dirname(v), w), e.mkdirSync(v, w.mode);
      else if (C.code !== "EEXIST") throw C;
    }
  }, p = (v, y, w) => {
    const C = () => {
      const F = i.normalizeFileMode(y.mode);
      w.mode !== void 0 && w.mode !== F && e.chmodSync(v, w.mode);
    }, S = () => {
      w.empty && e.readdirSync(v).forEach((R) => {
        t.sync(n.resolve(v, R));
      });
    };
    C(), S();
  }, l = (v, y) => {
    const w = s(y), C = d(v);
    C ? p(v, C, w) : f(v, w);
  }, u = (v) => new Promise((y, w) => {
    e.stat(v).then((C) => {
      C.isDirectory() ? y(C) : w(x(v));
    }).catch((C) => {
      C.code === "ENOENT" ? y(void 0) : w(C);
    });
  }), m = (v) => new Promise((y, w) => {
    e.readdir(v).then((C) => {
      const S = (F) => {
        if (F === C.length)
          y();
        else {
          const R = n.resolve(v, C[F]);
          t.async(R).then(() => {
            S(F + 1);
          });
        }
      };
      S(0);
    }).catch(w);
  }), r = (v, y, w) => new Promise((C, S) => {
    const F = () => {
      const T = i.normalizeFileMode(y.mode);
      return w.mode !== void 0 && w.mode !== T ? e.chmod(v, w.mode) : Promise.resolve();
    }, R = () => w.empty ? m(v) : Promise.resolve();
    F().then(R).then(C, S);
  }), c = (v, y) => {
    const w = y || {};
    return new Promise((C, S) => {
      e.mkdir(v, w.mode).then(C).catch((F) => {
        F.code === "ENOENT" ? c(n.dirname(v), w).then(() => e.mkdir(v, w.mode)).then(C).catch((R) => {
          R.code === "EEXIST" ? C() : S(R);
        }) : F.code === "EEXIST" ? C() : S(F);
      });
    });
  }, h = (v, y) => new Promise((w, C) => {
    const S = s(y);
    u(v).then((F) => F !== void 0 ? r(
      v,
      F,
      S
    ) : c(v, S)).then(w, C);
  });
  return ve.validateInput = o, ve.sync = l, ve.createSync = f, ve.async = h, ve.createAsync = c, ve;
}
var Ka;
function kn() {
  if (Ka) return qe;
  Ka = 1;
  const n = G, e = oe(), i = ie(), a = je(), t = (m, r, c, h) => {
    const v = `${m}(path, data, [options])`;
    i.argument(v, "path", r, ["string"]), i.argument(v, "data", c, [
      "string",
      "buffer",
      "object",
      "array"
    ]), i.options(v, "options", h, {
      mode: ["string", "number"],
      atomic: ["boolean"],
      jsonIndent: ["number"]
    });
  }, o = ".__new__", s = (m, r) => {
    let c = r;
    return typeof c != "number" && (c = 2), typeof m == "object" && !Buffer.isBuffer(m) && m !== null ? JSON.stringify(m, null, c) : m;
  }, x = (m, r, c) => {
    try {
      e.writeFileSync(m, r, c);
    } catch (h) {
      if (h.code === "ENOENT")
        a.createSync(n.dirname(m)), e.writeFileSync(m, r, c);
      else
        throw h;
    }
  }, d = (m, r, c) => {
    x(m + o, r, c), e.renameSync(m + o, m);
  }, f = (m, r, c) => {
    const h = c || {}, v = s(r, h.jsonIndent);
    let y = x;
    h.atomic && (y = d), y(m, v, { mode: h.mode });
  }, p = (m, r, c) => new Promise((h, v) => {
    e.writeFile(m, r, c).then(h).catch((y) => {
      y.code === "ENOENT" ? a.createAsync(n.dirname(m)).then(() => e.writeFile(m, r, c)).then(h, v) : v(y);
    });
  }), l = (m, r, c) => new Promise((h, v) => {
    p(m + o, r, c).then(() => e.rename(m + o, m)).then(h, v);
  }), u = (m, r, c) => {
    const h = c || {}, v = s(r, h.jsonIndent);
    let y = p;
    return h.atomic && (y = l), y(m, v, { mode: h.mode });
  };
  return qe.validateInput = t, qe.sync = f, qe.async = u, qe;
}
var Ja;
function Rs() {
  if (Ja) return Pe;
  Ja = 1;
  const n = oe(), e = kn(), i = ie(), a = (s, x, d, f) => {
    const p = `${s}(path, data, [options])`;
    i.argument(p, "path", x, ["string"]), i.argument(p, "data", d, ["string", "buffer"]), i.options(p, "options", f, {
      mode: ["string", "number"]
    });
  }, t = (s, x, d) => {
    try {
      n.appendFileSync(s, x, d);
    } catch (f) {
      if (f.code === "ENOENT")
        e.sync(s, x, d);
      else
        throw f;
    }
  }, o = (s, x, d) => new Promise((f, p) => {
    n.appendFile(s, x, d).then(f).catch((l) => {
      l.code === "ENOENT" ? e.async(s, x, d).then(f, p) : p(l);
    });
  });
  return Pe.validateInput = a, Pe.sync = t, Pe.async = o, Pe;
}
var Le = {}, Ga;
function As() {
  if (Ga) return Le;
  Ga = 1;
  const n = oe(), e = ja(), i = ie(), a = kn(), t = (c, h, v) => {
    const y = `${c}(path, [criteria])`;
    i.argument(y, "path", h, ["string"]), i.options(y, "criteria", v, {
      content: ["string", "buffer", "object", "array"],
      jsonIndent: ["number"],
      mode: ["string", "number"]
    });
  }, o = (c) => {
    const h = c || {};
    return h.mode !== void 0 && (h.mode = e.normalizeFileMode(h.mode)), h;
  }, s = (c) => new Error(
    `Path ${c} exists but is not a file. Halting jetpack.file() call for safety reasons.`
  ), x = (c) => {
    let h;
    try {
      h = n.statSync(c);
    } catch (v) {
      if (v.code !== "ENOENT")
        throw v;
    }
    if (h && !h.isFile())
      throw s(c);
    return h;
  }, d = (c, h, v) => {
    const y = e.normalizeFileMode(h.mode), w = () => v.content !== void 0 ? (a.sync(c, v.content, {
      mode: y,
      jsonIndent: v.jsonIndent
    }), !0) : !1, C = () => {
      v.mode !== void 0 && v.mode !== y && n.chmodSync(c, v.mode);
    };
    w() || C();
  }, f = (c, h) => {
    let v = "";
    h.content !== void 0 && (v = h.content), a.sync(c, v, {
      mode: h.mode,
      jsonIndent: h.jsonIndent
    });
  }, p = (c, h) => {
    const v = o(h), y = x(c);
    y !== void 0 ? d(c, y, v) : f(c, v);
  }, l = (c) => new Promise((h, v) => {
    n.stat(c).then((y) => {
      y.isFile() ? h(y) : v(s(c));
    }).catch((y) => {
      y.code === "ENOENT" ? h(void 0) : v(y);
    });
  }), u = (c, h, v) => {
    const y = e.normalizeFileMode(h.mode), w = () => new Promise((S, F) => {
      v.content !== void 0 ? a.async(c, v.content, {
        mode: y,
        jsonIndent: v.jsonIndent
      }).then(() => {
        S(!0);
      }).catch(F) : S(!1);
    }), C = () => {
      if (v.mode !== void 0 && v.mode !== y)
        return n.chmod(c, v.mode);
    };
    return w().then((S) => {
      if (!S)
        return C();
    });
  }, m = (c, h) => {
    let v = "";
    return h.content !== void 0 && (v = h.content), a.async(c, v, {
      mode: h.mode,
      jsonIndent: h.jsonIndent
    });
  }, r = (c, h) => new Promise((v, y) => {
    const w = o(h);
    l(c).then((C) => C !== void 0 ? u(c, C, w) : m(c, w)).then(v, y);
  });
  return Le.validateInput = t, Le.sync = p, Le.async = r, Le;
}
var De = {}, tn = {}, be = {}, Ya;
function Qe() {
  if (Ya) return be;
  Ya = 1;
  const n = Xe, e = G, i = oe(), a = ie(), t = ["md5", "sha1", "sha256", "sha512"], o = ["report", "follow"], s = (r, c, h) => {
    const v = `${r}(path, [options])`;
    if (a.argument(v, "path", c, ["string"]), a.options(v, "options", h, {
      checksum: ["string"],
      mode: ["boolean"],
      times: ["boolean"],
      absolutePath: ["boolean"],
      symlinks: ["string"]
    }), h && h.checksum !== void 0 && t.indexOf(h.checksum) === -1)
      throw new Error(
        `Argument "options.checksum" passed to ${v} must have one of values: ${t.join(
          ", "
        )}`
      );
    if (h && h.symlinks !== void 0 && o.indexOf(h.symlinks) === -1)
      throw new Error(
        `Argument "options.symlinks" passed to ${v} must have one of values: ${o.join(
          ", "
        )}`
      );
  }, x = (r, c, h) => {
    const v = {};
    return v.name = e.basename(r), h.isFile() ? (v.type = "file", v.size = h.size) : h.isDirectory() ? v.type = "dir" : h.isSymbolicLink() ? v.type = "symlink" : v.type = "other", c.mode && (v.mode = h.mode), c.times && (v.accessTime = h.atime, v.modifyTime = h.mtime, v.changeTime = h.ctime, v.birthTime = h.birthtime), c.absolutePath && (v.absolutePath = r), v;
  }, d = (r, c) => {
    const h = n.createHash(c), v = i.readFileSync(r);
    return h.update(v), h.digest("hex");
  }, f = (r, c, h) => {
    c.type === "file" && h.checksum ? c[h.checksum] = d(r, h.checksum) : c.type === "symlink" && (c.pointsAt = i.readlinkSync(r));
  }, p = (r, c) => {
    let h = i.lstatSync, v;
    const y = c || {};
    y.symlinks === "follow" && (h = i.statSync);
    try {
      v = h(r);
    } catch (C) {
      if (C.code === "ENOENT")
        return;
      throw C;
    }
    const w = x(r, y, v);
    return f(r, w, y), w;
  }, l = (r, c) => new Promise((h, v) => {
    const y = n.createHash(c), w = i.createReadStream(r);
    w.on("data", (C) => {
      y.update(C);
    }), w.on("end", () => {
      h(y.digest("hex"));
    }), w.on("error", v);
  }), u = (r, c, h) => c.type === "file" && h.checksum ? l(r, h.checksum).then((v) => (c[h.checksum] = v, c)) : c.type === "symlink" ? i.readlink(r).then((v) => (c.pointsAt = v, c)) : Promise.resolve(c), m = (r, c) => new Promise((h, v) => {
    let y = i.lstat;
    const w = c || {};
    w.symlinks === "follow" && (y = i.stat), y(r).then((C) => {
      const S = x(r, w, C);
      u(r, S, w).then(h, v);
    }).catch((C) => {
      C.code === "ENOENT" ? h(void 0) : v(C);
    });
  });
  return be.supportedChecksumAlgorithms = t, be.symlinkOptions = o, be.validateInput = s, be.sync = p, be.async = m, be;
}
var Ne = {}, Xa;
function Oa() {
  if (Xa) return Ne;
  Xa = 1;
  const n = oe(), e = ie(), i = (o, s) => {
    const x = `${o}(path)`;
    e.argument(x, "path", s, ["string", "undefined"]);
  }, a = (o) => {
    try {
      return n.readdirSync(o);
    } catch (s) {
      if (s.code === "ENOENT")
        return;
      throw s;
    }
  }, t = (o) => new Promise((s, x) => {
    n.readdir(o).then((d) => {
      s(d);
    }).catch((d) => {
      d.code === "ENOENT" ? s(void 0) : x(d);
    });
  });
  return Ne.validateInput = i, Ne.sync = a, Ne.async = t, Ne;
}
var Za;
function Pa() {
  if (Za) return tn;
  Za = 1;
  const n = Te, e = G, i = Qe();
  Oa();
  const a = (x) => x.isDirectory() ? "dir" : x.isFile() ? "file" : x.isSymbolicLink() ? "symlink" : "other", t = (x, d, f) => {
    d.maxLevelsDeep === void 0 && (d.maxLevelsDeep = 1 / 0);
    const p = d.inspectOptions !== void 0;
    d.symlinks && (d.inspectOptions === void 0 ? d.inspectOptions = { symlinks: d.symlinks } : d.inspectOptions.symlinks = d.symlinks);
    const l = (m, r) => {
      n.readdirSync(m, { withFileTypes: !0 }).forEach((c) => {
        const h = typeof c == "string";
        let v;
        h ? v = e.join(m, c) : v = e.join(m, c.name);
        let y;
        if (p)
          y = i.sync(v, d.inspectOptions);
        else if (h) {
          const w = i.sync(
            v,
            d.inspectOptions
          );
          y = { name: w.name, type: w.type };
        } else {
          const w = a(c);
          if (w === "symlink" && d.symlinks === "follow") {
            const C = n.statSync(v);
            y = { name: c.name, type: a(C) };
          } else
            y = { name: c.name, type: w };
        }
        y !== void 0 && (f(v, y), y.type === "dir" && r < d.maxLevelsDeep && l(v, r + 1));
      });
    }, u = i.sync(x, d.inspectOptions);
    u ? (p ? f(x, u) : f(x, { name: u.name, type: u.type }), u.type === "dir" && l(x, 1)) : f(x, void 0);
  }, o = 5, s = (x, d, f, p) => {
    d.maxLevelsDeep === void 0 && (d.maxLevelsDeep = 1 / 0);
    const l = d.inspectOptions !== void 0;
    d.symlinks && (d.inspectOptions === void 0 ? d.inspectOptions = { symlinks: d.symlinks } : d.inspectOptions.symlinks = d.symlinks);
    const u = [];
    let m = 0;
    const r = () => {
      if (u.length === 0 && m === 0)
        p();
      else if (u.length > 0 && m < o) {
        const y = u.pop();
        m += 1, y();
      }
    }, c = (y) => {
      u.push(y), r();
    }, h = () => {
      m -= 1, r();
    }, v = (y, w) => {
      const C = (S, F) => {
        F.type === "dir" && w < d.maxLevelsDeep && v(S, w + 1);
      };
      c(() => {
        n.readdir(y, { withFileTypes: !0 }, (S, F) => {
          S ? p(S) : (F.forEach((R) => {
            const T = typeof R == "string";
            let P;
            if (T ? P = e.join(y, R) : P = e.join(y, R.name), l || T)
              c(() => {
                i.async(P, d.inspectOptions).then((O) => {
                  O !== void 0 && (l ? f(P, O) : f(P, {
                    name: O.name,
                    type: O.type
                  }), C(P, O)), h();
                }).catch((O) => {
                  p(O);
                });
              });
            else {
              const O = a(R);
              if (O === "symlink" && d.symlinks === "follow")
                c(() => {
                  n.stat(P, (b, g) => {
                    if (b)
                      p(b);
                    else {
                      const k = {
                        name: R.name,
                        type: a(g)
                      };
                      f(P, k), C(P, k), h();
                    }
                  });
                });
              else {
                const b = { name: R.name, type: O };
                f(P, b), C(P, b);
              }
            }
          }), h());
        });
      });
    };
    i.async(x, d.inspectOptions).then((y) => {
      y ? (l ? f(x, y) : f(x, { name: y.name, type: y.type }), y.type === "dir" ? v(x, 1) : p()) : (f(x, void 0), p());
    }).catch((y) => {
      p(y);
    });
  };
  return tn.sync = t, tn.async = s, tn;
}
var In = {}, Un, Qa;
function Ts() {
  return Qa || (Qa = 1, Un = typeof process == "object" && process && process.platform === "win32" ? { sep: "\\" } : { sep: "/" }), Un;
}
var zn, ei;
function js() {
  if (ei) return zn;
  ei = 1, zn = n;
  function n(a, t, o) {
    a instanceof RegExp && (a = e(a, o)), t instanceof RegExp && (t = e(t, o));
    var s = i(a, t, o);
    return s && {
      start: s[0],
      end: s[1],
      pre: o.slice(0, s[0]),
      body: o.slice(s[0] + a.length, s[1]),
      post: o.slice(s[1] + t.length)
    };
  }
  function e(a, t) {
    var o = t.match(a);
    return o ? o[0] : null;
  }
  n.range = i;
  function i(a, t, o) {
    var s, x, d, f, p, l = o.indexOf(a), u = o.indexOf(t, l + 1), m = l;
    if (l >= 0 && u > 0) {
      if (a === t)
        return [l, u];
      for (s = [], d = o.length; m >= 0 && !p; )
        m == l ? (s.push(m), l = o.indexOf(a, m + 1)) : s.length == 1 ? p = [s.pop(), u] : (x = s.pop(), x < d && (d = x, f = u), u = o.indexOf(t, m + 1)), m = l < u && l >= 0 ? l : u;
      s.length && (p = [d, f]);
    }
    return p;
  }
  return zn;
}
var Bn, ni;
function Cs() {
  if (ni) return Bn;
  ni = 1;
  var n = js();
  Bn = p;
  var e = "\0SLASH" + Math.random() + "\0", i = "\0OPEN" + Math.random() + "\0", a = "\0CLOSE" + Math.random() + "\0", t = "\0COMMA" + Math.random() + "\0", o = "\0PERIOD" + Math.random() + "\0";
  function s(h) {
    return parseInt(h, 10) == h ? parseInt(h, 10) : h.charCodeAt(0);
  }
  function x(h) {
    return h.split("\\\\").join(e).split("\\{").join(i).split("\\}").join(a).split("\\,").join(t).split("\\.").join(o);
  }
  function d(h) {
    return h.split(e).join("\\").split(i).join("{").split(a).join("}").split(t).join(",").split(o).join(".");
  }
  function f(h) {
    if (!h)
      return [""];
    var v = [], y = n("{", "}", h);
    if (!y)
      return h.split(",");
    var w = y.pre, C = y.body, S = y.post, F = w.split(",");
    F[F.length - 1] += "{" + C + "}";
    var R = f(S);
    return S.length && (F[F.length - 1] += R.shift(), F.push.apply(F, R)), v.push.apply(v, F), v;
  }
  function p(h) {
    return h ? (h.substr(0, 2) === "{}" && (h = "\\{\\}" + h.substr(2)), c(x(h), !0).map(d)) : [];
  }
  function l(h) {
    return "{" + h + "}";
  }
  function u(h) {
    return /^-?0\d/.test(h);
  }
  function m(h, v) {
    return h <= v;
  }
  function r(h, v) {
    return h >= v;
  }
  function c(h, v) {
    var y = [], w = n("{", "}", h);
    if (!w) return [h];
    var C = w.pre, S = w.post.length ? c(w.post, !1) : [""];
    if (/\$$/.test(w.pre))
      for (var F = 0; F < S.length; F++) {
        var R = C + "{" + w.body + "}" + S[F];
        y.push(R);
      }
    else {
      var T = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(w.body), P = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(w.body), O = T || P, b = w.body.indexOf(",") >= 0;
      if (!O && !b)
        return w.post.match(/,.*\}/) ? (h = w.pre + "{" + w.body + a + w.post, c(h)) : [h];
      var g;
      if (O)
        g = w.body.split(/\.\./);
      else if (g = f(w.body), g.length === 1 && (g = c(g[0], !1).map(l), g.length === 1))
        return S.map(function($) {
          return w.pre + g[0] + $;
        });
      var k;
      if (O) {
        var q = s(g[0]), L = s(g[1]), E = Math.max(g[0].length, g[1].length), A = g.length == 3 ? Math.abs(s(g[2])) : 1, j = m, D = L < q;
        D && (A *= -1, j = r);
        var U = g.some(u);
        k = [];
        for (var N = q; j(N, L); N += A) {
          var z;
          if (P)
            z = String.fromCharCode(N), z === "\\" && (z = "");
          else if (z = String(N), U) {
            var W = E - z.length;
            if (W > 0) {
              var Y = new Array(W + 1).join("0");
              N < 0 ? z = "-" + Y + z.slice(1) : z = Y + z;
            }
          }
          k.push(z);
        }
      } else {
        k = [];
        for (var B = 0; B < g.length; B++)
          k.push.apply(k, c(g[B], !1));
      }
      for (var B = 0; B < k.length; B++)
        for (var F = 0; F < S.length; F++) {
          var R = C + k[B] + S[F];
          (!v || O || R) && y.push(R);
        }
    }
    return y;
  }
  return Bn;
}
var sn, ai;
function Os() {
  if (ai) return sn;
  ai = 1;
  const n = sn = (R, T, P = {}) => (h(T), !P.nocomment && T.charAt(0) === "#" ? !1 : new F(T, P).match(R));
  sn = n;
  const e = Ts();
  n.sep = e.sep;
  const i = Symbol("globstar **");
  n.GLOBSTAR = i;
  const a = Cs(), t = {
    "!": { open: "(?:(?!(?:", close: "))[^/]*?)" },
    "?": { open: "(?:", close: ")?" },
    "+": { open: "(?:", close: ")+" },
    "*": { open: "(?:", close: ")*" },
    "@": { open: "(?:", close: ")" }
  }, o = "[^/]", s = o + "*?", x = "(?:(?!(?:\\/|^)(?:\\.{1,2})($|\\/)).)*?", d = "(?:(?!(?:\\/|^)\\.).)*?", f = (R) => R.split("").reduce((T, P) => (T[P] = !0, T), {}), p = f("().*{}+?[]^$\\!"), l = f("[.("), u = /\/+/;
  n.filter = (R, T = {}) => (P, O, b) => n(P, R, T);
  const m = (R, T = {}) => {
    const P = {};
    return Object.keys(R).forEach((O) => P[O] = R[O]), Object.keys(T).forEach((O) => P[O] = T[O]), P;
  };
  n.defaults = (R) => {
    if (!R || typeof R != "object" || !Object.keys(R).length)
      return n;
    const T = n, P = (O, b, g) => T(O, b, m(R, g));
    return P.Minimatch = class extends T.Minimatch {
      constructor(b, g) {
        super(b, m(R, g));
      }
    }, P.Minimatch.defaults = (O) => T.defaults(m(R, O)).Minimatch, P.filter = (O, b) => T.filter(O, m(R, b)), P.defaults = (O) => T.defaults(m(R, O)), P.makeRe = (O, b) => T.makeRe(O, m(R, b)), P.braceExpand = (O, b) => T.braceExpand(O, m(R, b)), P.match = (O, b, g) => T.match(O, b, m(R, g)), P;
  }, n.braceExpand = (R, T) => r(R, T);
  const r = (R, T = {}) => (h(R), T.nobrace || !/\{(?:(?!\{).)*\}/.test(R) ? [R] : a(R)), c = 1024 * 64, h = (R) => {
    if (typeof R != "string")
      throw new TypeError("invalid pattern");
    if (R.length > c)
      throw new TypeError("pattern is too long");
  }, v = Symbol("subparse");
  n.makeRe = (R, T) => new F(R, T || {}).makeRe(), n.match = (R, T, P = {}) => {
    const O = new F(T, P);
    return R = R.filter((b) => O.match(b)), O.options.nonull && !R.length && R.push(T), R;
  };
  const y = (R) => R.replace(/\\(.)/g, "$1"), w = (R) => R.replace(/\\([^-\]])/g, "$1"), C = (R) => R.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), S = (R) => R.replace(/[[\]\\]/g, "\\$&");
  class F {
    constructor(T, P) {
      h(T), P || (P = {}), this.options = P, this.set = [], this.pattern = T, this.windowsPathsNoEscape = !!P.windowsPathsNoEscape || P.allowWindowsEscape === !1, this.windowsPathsNoEscape && (this.pattern = this.pattern.replace(/\\/g, "/")), this.regexp = null, this.negate = !1, this.comment = !1, this.empty = !1, this.partial = !!P.partial, this.make();
    }
    debug() {
    }
    make() {
      const T = this.pattern, P = this.options;
      if (!P.nocomment && T.charAt(0) === "#") {
        this.comment = !0;
        return;
      }
      if (!T) {
        this.empty = !0;
        return;
      }
      this.parseNegate();
      let O = this.globSet = this.braceExpand();
      P.debug && (this.debug = (...b) => console.error(...b)), this.debug(this.pattern, O), O = this.globParts = O.map((b) => b.split(u)), this.debug(this.pattern, O), O = O.map((b, g, k) => b.map(this.parse, this)), this.debug(this.pattern, O), O = O.filter((b) => b.indexOf(!1) === -1), this.debug(this.pattern, O), this.set = O;
    }
    parseNegate() {
      if (this.options.nonegate) return;
      const T = this.pattern;
      let P = !1, O = 0;
      for (let b = 0; b < T.length && T.charAt(b) === "!"; b++)
        P = !P, O++;
      O && (this.pattern = T.slice(O)), this.negate = P;
    }
    // set partial to true to test if, for example,
    // "/a/b" matches the start of "/*/b/*/d"
    // Partial means, if you run out of file before you run
    // out of pattern, then that's fine, as long as all
    // the parts match.
    matchOne(T, P, O) {
      var b = this.options;
      this.debug(
        "matchOne",
        { this: this, file: T, pattern: P }
      ), this.debug("matchOne", T.length, P.length);
      for (var g = 0, k = 0, q = T.length, L = P.length; g < q && k < L; g++, k++) {
        this.debug("matchOne loop");
        var E = P[k], A = T[g];
        if (this.debug(P, E, A), E === !1) return !1;
        if (E === i) {
          this.debug("GLOBSTAR", [P, E, A]);
          var j = g, D = k + 1;
          if (D === L) {
            for (this.debug("** at the end"); g < q; g++)
              if (T[g] === "." || T[g] === ".." || !b.dot && T[g].charAt(0) === ".") return !1;
            return !0;
          }
          for (; j < q; ) {
            var U = T[j];
            if (this.debug(`
globstar while`, T, j, P, D, U), this.matchOne(T.slice(j), P.slice(D), O))
              return this.debug("globstar found match!", j, q, U), !0;
            if (U === "." || U === ".." || !b.dot && U.charAt(0) === ".") {
              this.debug("dot detected!", T, j, P, D);
              break;
            }
            this.debug("globstar swallow a segment, and continue"), j++;
          }
          return !!(O && (this.debug(`
>>> no match, partial?`, T, j, P, D), j === q));
        }
        var N;
        if (typeof E == "string" ? (N = A === E, this.debug("string match", E, A, N)) : (N = A.match(E), this.debug("pattern match", E, A, N)), !N) return !1;
      }
      if (g === q && k === L)
        return !0;
      if (g === q)
        return O;
      if (k === L)
        return g === q - 1 && T[g] === "";
      throw new Error("wtf?");
    }
    braceExpand() {
      return r(this.pattern, this.options);
    }
    parse(T, P) {
      h(T);
      const O = this.options;
      if (T === "**")
        if (O.noglobstar)
          T = "*";
        else
          return i;
      if (T === "") return "";
      let b = "", g = !1, k = !1;
      const q = [], L = [];
      let E, A = !1, j = -1, D = -1, U, N, z, W = T.charAt(0) === ".", Y = O.dot || W;
      const B = () => W ? "" : Y ? "(?!(?:^|\\/)\\.{1,2}(?:$|\\/))" : "(?!\\.)", $ = (K) => K.charAt(0) === "." ? "" : O.dot ? "(?!(?:^|\\/)\\.{1,2}(?:$|\\/))" : "(?!\\.)", Q = () => {
        if (E) {
          switch (E) {
            case "*":
              b += s, g = !0;
              break;
            case "?":
              b += o, g = !0;
              break;
            default:
              b += "\\" + E;
              break;
          }
          this.debug("clearStateChar %j %j", E, b), E = !1;
        }
      };
      for (let K = 0, V; K < T.length && (V = T.charAt(K)); K++) {
        if (this.debug("%s	%s %s %j", T, K, b, V), k) {
          if (V === "/")
            return !1;
          p[V] && (b += "\\"), b += V, k = !1;
          continue;
        }
        switch (V) {
          /* istanbul ignore next */
          case "/":
            return !1;
          case "\\":
            if (A && T.charAt(K + 1) === "-") {
              b += V;
              continue;
            }
            Q(), k = !0;
            continue;
          // the various stateChar values
          // for the "extglob" stuff.
          case "?":
          case "*":
          case "+":
          case "@":
          case "!":
            if (this.debug("%s	%s %s %j <-- stateChar", T, K, b, V), A) {
              this.debug("  in class"), V === "!" && K === D + 1 && (V = "^"), b += V;
              continue;
            }
            this.debug("call clearStateChar %j", E), Q(), E = V, O.noext && Q();
            continue;
          case "(": {
            if (A) {
              b += "(";
              continue;
            }
            if (!E) {
              b += "\\(";
              continue;
            }
            const ee = {
              type: E,
              start: K - 1,
              reStart: b.length,
              open: t[E].open,
              close: t[E].close
            };
            this.debug(this.pattern, "	", ee), q.push(ee), b += ee.open, ee.start === 0 && ee.type !== "!" && (W = !0, b += $(T.slice(K + 1))), this.debug("plType %j %j", E, b), E = !1;
            continue;
          }
          case ")": {
            const ee = q[q.length - 1];
            if (A || !ee) {
              b += "\\)";
              continue;
            }
            q.pop(), Q(), g = !0, N = ee, b += N.close, N.type === "!" && L.push(Object.assign(N, { reEnd: b.length }));
            continue;
          }
          case "|": {
            const ee = q[q.length - 1];
            if (A || !ee) {
              b += "\\|";
              continue;
            }
            Q(), b += "|", ee.start === 0 && ee.type !== "!" && (W = !0, b += $(T.slice(K + 1)));
            continue;
          }
          // these are mostly the same in regexp and glob
          case "[":
            if (Q(), A) {
              b += "\\" + V;
              continue;
            }
            A = !0, D = K, j = b.length, b += V;
            continue;
          case "]":
            if (K === D + 1 || !A) {
              b += "\\" + V;
              continue;
            }
            U = T.substring(D + 1, K);
            try {
              RegExp("[" + S(w(U)) + "]"), b += V;
            } catch {
              b = b.substring(0, j) + "(?:$.)";
            }
            g = !0, A = !1;
            continue;
          default:
            Q(), p[V] && !(V === "^" && A) && (b += "\\"), b += V;
            break;
        }
      }
      for (A && (U = T.slice(D + 1), z = this.parse(U, v), b = b.substring(0, j) + "\\[" + z[0], g = g || z[1]), N = q.pop(); N; N = q.pop()) {
        let K;
        K = b.slice(N.reStart + N.open.length), this.debug("setting tail", b, N), K = K.replace(/((?:\\{2}){0,64})(\\?)\|/g, (ee, an, de) => (de || (de = "\\"), an + an + de + "|")), this.debug(`tail=%j
   %s`, K, K, N, b);
        const V = N.type === "*" ? s : N.type === "?" ? o : "\\" + N.type;
        g = !0, b = b.slice(0, N.reStart) + V + "\\(" + K;
      }
      Q(), k && (b += "\\\\");
      const X = l[b.charAt(0)];
      for (let K = L.length - 1; K > -1; K--) {
        const V = L[K], ee = b.slice(0, V.reStart), an = b.slice(V.reStart, V.reEnd - 8);
        let de = b.slice(V.reEnd);
        const ds = b.slice(V.reEnd - 8, V.reEnd) + de, ms = ee.split(")").length, fs = ee.split("(").length - ms;
        let qn = de;
        for (let Ua = 0; Ua < fs; Ua++)
          qn = qn.replace(/\)[+*?]?/, "");
        de = qn;
        const hs = de === "" && P !== v ? "(?:$|\\/)" : "";
        b = ee + an + de + hs + ds;
      }
      if (b !== "" && g && (b = "(?=.)" + b), X && (b = B() + b), P === v)
        return [b, g];
      if (O.nocase && !g && (g = T.toUpperCase() !== T.toLowerCase()), !g)
        return y(T);
      const us = O.nocase ? "i" : "";
      try {
        return Object.assign(new RegExp("^" + b + "$", us), {
          _glob: T,
          _src: b
        });
      } catch {
        return new RegExp("$.");
      }
    }
    makeRe() {
      if (this.regexp || this.regexp === !1) return this.regexp;
      const T = this.set;
      if (!T.length)
        return this.regexp = !1, this.regexp;
      const P = this.options, O = P.noglobstar ? s : P.dot ? x : d, b = P.nocase ? "i" : "";
      let g = T.map((k) => (k = k.map(
        (q) => typeof q == "string" ? C(q) : q === i ? i : q._src
      ).reduce((q, L) => (q[q.length - 1] === i && L === i || q.push(L), q), []), k.forEach((q, L) => {
        q !== i || k[L - 1] === i || (L === 0 ? k.length > 1 ? k[L + 1] = "(?:\\/|" + O + "\\/)?" + k[L + 1] : k[L] = O : L === k.length - 1 ? k[L - 1] += "(?:\\/|" + O + ")?" : (k[L - 1] += "(?:\\/|\\/" + O + "\\/)" + k[L + 1], k[L + 1] = i));
      }), k.filter((q) => q !== i).join("/"))).join("|");
      g = "^(?:" + g + ")$", this.negate && (g = "^(?!" + g + ").*$");
      try {
        this.regexp = new RegExp(g, b);
      } catch {
        this.regexp = !1;
      }
      return this.regexp;
    }
    match(T, P = this.partial) {
      if (this.debug("match", T, this.pattern), this.comment) return !1;
      if (this.empty) return T === "";
      if (T === "/" && P) return !0;
      const O = this.options;
      e.sep !== "/" && (T = T.split(e.sep).join("/")), T = T.split(u), this.debug(this.pattern, "split", T);
      const b = this.set;
      this.debug(this.pattern, "set", b);
      let g;
      for (let k = T.length - 1; k >= 0 && (g = T[k], !g); k--)
        ;
      for (let k = 0; k < b.length; k++) {
        const q = b[k];
        let L = T;
        if (O.matchBase && q.length === 1 && (L = [g]), this.matchOne(L, q, P))
          return O.flipNegate ? !0 : !this.negate;
      }
      return O.flipNegate ? !1 : this.negate;
    }
    static defaults(T) {
      return n.defaults(T).Minimatch;
    }
  }
  return n.Minimatch = F, sn;
}
var ii;
function xt() {
  if (ii) return In;
  ii = 1;
  const n = Os().Minimatch, e = (i, a) => {
    const t = a.indexOf("/") !== -1, o = /^!?\//.test(a), s = /^!/.test(a);
    let x;
    if (!o && t) {
      const d = a.replace(/^!/, "").replace(/^\.\//, "");
      return /\/$/.test(i) ? x = "" : x = "/", s ? `!${i}${x}${d}` : `${i}${x}${d}`;
    }
    return a;
  };
  return In.create = (i, a, t) => {
    let o;
    typeof a == "string" ? o = [a] : o = a;
    const s = o.map((d) => e(i, d)).map((d) => new n(d, {
      matchBase: !0,
      nocomment: !0,
      nocase: t || !1,
      dot: !0,
      windowsPathsNoEscape: !0
    }));
    return (d) => {
      let f = "matching", p = !1, l, u;
      for (u = 0; u < s.length; u += 1) {
        if (l = s[u], l.negate && (f = "negation", u === 0 && (p = !0)), f === "negation" && p && !l.match(d))
          return !1;
        f === "matching" && !p && (p = l.match(d));
      }
      return p;
    };
  }, In;
}
var ti;
function Ps() {
  if (ti) return De;
  ti = 1;
  const n = G, e = Pa(), i = Qe(), a = xt(), t = ie(), o = (r, c, h) => {
    const v = `${r}([path], options)`;
    t.argument(v, "path", c, ["string"]), t.options(v, "options", h, {
      matching: ["string", "array of string"],
      filter: ["function"],
      files: ["boolean"],
      directories: ["boolean"],
      recursive: ["boolean"],
      ignoreCase: ["boolean"]
    });
  }, s = (r) => {
    const c = r || {};
    return c.matching === void 0 && (c.matching = "*"), c.files === void 0 && (c.files = !0), c.ignoreCase === void 0 && (c.ignoreCase = !1), c.directories === void 0 && (c.directories = !1), c.recursive === void 0 && (c.recursive = !0), c;
  }, x = (r, c) => r.map((h) => n.relative(c, h)), d = (r) => {
    const c = new Error(`Path you want to find stuff in doesn't exist ${r}`);
    return c.code = "ENOENT", c;
  }, f = (r) => {
    const c = new Error(
      `Path you want to find stuff in must be a directory ${r}`
    );
    return c.code = "ENOTDIR", c;
  }, p = (r, c) => {
    const h = [], v = a.create(
      r,
      c.matching,
      c.ignoreCase
    );
    let y = 1 / 0;
    return c.recursive === !1 && (y = 1), e.sync(
      r,
      {
        maxLevelsDeep: y,
        symlinks: "follow",
        inspectOptions: { times: !0, absolutePath: !0 }
      },
      (w, C) => {
        C && w !== r && v(w) && (C.type === "file" && c.files === !0 || C.type === "dir" && c.directories === !0) && (c.filter ? c.filter(C) && h.push(w) : h.push(w));
      }
    ), h.sort(), x(h, c.cwd);
  }, l = (r, c) => {
    const h = i.sync(r, { symlinks: "follow" });
    if (h === void 0)
      throw d(r);
    if (h.type !== "dir")
      throw f(r);
    return p(r, s(c));
  }, u = (r, c) => new Promise((h, v) => {
    const y = [], w = a.create(
      r,
      c.matching,
      c.ignoreCase
    );
    let C = 1 / 0;
    c.recursive === !1 && (C = 1);
    let S = 0, F = !1;
    const R = () => {
      F && S === 0 && (y.sort(), h(x(y, c.cwd)));
    };
    e.async(
      r,
      {
        maxLevelsDeep: C,
        symlinks: "follow",
        inspectOptions: { times: !0, absolutePath: !0 }
      },
      (T, P) => {
        if (P && T !== r && w(T) && (P.type === "file" && c.files === !0 || P.type === "dir" && c.directories === !0))
          if (c.filter) {
            const b = c.filter(P);
            typeof b.then == "function" ? (S += 1, b.then((k) => {
              k && y.push(T), S -= 1, R();
            }).catch((k) => {
              v(k);
            })) : b && y.push(T);
          } else
            y.push(T);
      },
      (T) => {
        T ? v(T) : (F = !0, R());
      }
    );
  }), m = (r, c) => i.async(r, { symlinks: "follow" }).then((h) => {
    if (h === void 0)
      throw d(r);
    if (h.type !== "dir")
      throw f(r);
    return u(r, s(c));
  });
  return De.validateInput = o, De.sync = l, De.async = m, De;
}
var Ie = {}, si;
function qs() {
  if (si) return Ie;
  si = 1;
  const n = Xe, e = G, i = Qe();
  Oa();
  const a = ie(), t = Pa(), o = (u, m, r) => {
    const c = `${u}(path, [options])`;
    if (a.argument(c, "path", m, ["string"]), a.options(c, "options", r, {
      checksum: ["string"],
      relativePath: ["boolean"],
      times: ["boolean"],
      symlinks: ["string"]
    }), r && r.checksum !== void 0 && i.supportedChecksumAlgorithms.indexOf(r.checksum) === -1)
      throw new Error(
        `Argument "options.checksum" passed to ${c} must have one of values: ${i.supportedChecksumAlgorithms.join(
          ", "
        )}`
      );
    if (r && r.symlinks !== void 0 && i.symlinkOptions.indexOf(r.symlinks) === -1)
      throw new Error(
        `Argument "options.symlinks" passed to ${c} must have one of values: ${i.symlinkOptions.join(
          ", "
        )}`
      );
  }, s = (u, m) => u === void 0 ? "." : u.relativePath + "/" + m.name, x = (u, m) => {
    const r = n.createHash(m);
    return u.forEach((c) => {
      r.update(c.name + c[m]);
    }), r.digest("hex");
  }, d = (u, m, r) => {
    r.relativePath && (m.relativePath = s(u, m)), m.type === "dir" && (m.children.forEach((c) => {
      d(m, c, r);
    }), m.size = 0, m.children.sort((c, h) => c.type === "dir" && h.type === "file" ? -1 : c.type === "file" && h.type === "dir" ? 1 : c.name.localeCompare(h.name)), m.children.forEach((c) => {
      m.size += c.size || 0;
    }), r.checksum && (m[r.checksum] = x(
      m.children,
      r.checksum
    )));
  }, f = (u, m, r) => {
    const c = m[0];
    if (m.length > 1) {
      const h = u.children.find((v) => v.name === c);
      return f(h, m.slice(1));
    }
    return u;
  }, p = (u, m) => {
    const r = m || {};
    let c;
    return t.sync(u, { inspectOptions: r }, (h, v) => {
      if (v) {
        v.type === "dir" && (v.children = []);
        const y = e.relative(u, h);
        y === "" ? c = v : f(
          c,
          y.split(e.sep)
        ).children.push(v);
      }
    }), c && d(void 0, c, r), c;
  }, l = (u, m) => {
    const r = m || {};
    let c;
    return new Promise((h, v) => {
      t.async(
        u,
        { inspectOptions: r },
        (y, w) => {
          if (w) {
            w.type === "dir" && (w.children = []);
            const C = e.relative(u, y);
            C === "" ? c = w : f(
              c,
              C.split(e.sep)
            ).children.push(w);
          }
        },
        (y) => {
          y ? v(y) : (c && d(void 0, c, r), h(c));
        }
      );
    });
  };
  return Ie.validateInput = o, Ie.sync = p, Ie.async = l, Ie;
}
var Ue = {}, ze = {}, oi;
function qa() {
  if (oi) return ze;
  oi = 1;
  const n = oe(), e = ie(), i = (o, s) => {
    const x = `${o}(path)`;
    e.argument(x, "path", s, ["string"]);
  }, a = (o) => {
    try {
      const s = n.statSync(o);
      return s.isDirectory() ? "dir" : s.isFile() ? "file" : "other";
    } catch (s) {
      if (s.code !== "ENOENT")
        throw s;
    }
    return !1;
  }, t = (o) => new Promise((s, x) => {
    n.stat(o).then((d) => {
      d.isDirectory() ? s("dir") : d.isFile() ? s("file") : s("other");
    }).catch((d) => {
      d.code === "ENOENT" ? s(!1) : x(d);
    });
  });
  return ze.validateInput = i, ze.sync = a, ze.async = t, ze;
}
var ri;
function vt() {
  if (ri) return Ue;
  ri = 1;
  const n = G, e = oe(), i = je(), a = qa(), t = Qe(), o = kn(), s = xt(), x = ja(), d = Pa(), f = ie(), p = (g, k, q, L) => {
    const E = `${g}(from, to, [options])`;
    f.argument(E, "from", k, ["string"]), f.argument(E, "to", q, ["string"]), f.options(E, "options", L, {
      overwrite: ["boolean", "function"],
      matching: ["string", "array of string"],
      ignoreCase: ["boolean"]
    });
  }, l = (g, k) => {
    const q = g || {}, L = {};
    return q.ignoreCase === void 0 && (q.ignoreCase = !1), L.overwrite = q.overwrite, q.matching ? L.allowedToCopy = s.create(
      k,
      q.matching,
      q.ignoreCase
    ) : L.allowedToCopy = () => !0, L;
  }, u = (g) => {
    const k = new Error(`Path to copy doesn't exist ${g}`);
    return k.code = "ENOENT", k;
  }, m = (g) => {
    const k = new Error(`Destination path already exists ${g}`);
    return k.code = "EEXIST", k;
  }, r = {
    mode: !0,
    symlinks: "report",
    times: !0,
    absolutePath: !0
  }, c = (g) => typeof g.opts.overwrite != "function" && g.opts.overwrite !== !0, h = (g, k, q) => {
    if (!a.sync(g))
      throw u(g);
    if (a.sync(k) && !q.overwrite)
      throw m(k);
  }, v = (g) => {
    if (typeof g.opts.overwrite == "function") {
      const k = t.sync(g.destPath, r);
      return g.opts.overwrite(g.srcInspectData, k);
    }
    return g.opts.overwrite === !0;
  }, y = (g, k, q, L) => {
    const E = e.readFileSync(g);
    try {
      e.writeFileSync(k, E, { mode: q, flag: "wx" });
    } catch (A) {
      if (A.code === "ENOENT")
        o.sync(k, E, { mode: q });
      else if (A.code === "EEXIST") {
        if (v(L))
          e.writeFileSync(k, E, { mode: q });
        else if (c(L))
          throw m(L.destPath);
      } else
        throw A;
    }
  }, w = (g, k) => {
    const q = e.readlinkSync(g);
    try {
      e.symlinkSync(q, k);
    } catch (L) {
      if (L.code === "EEXIST")
        e.unlinkSync(k), e.symlinkSync(q, k);
      else
        throw L;
    }
  }, C = (g, k, q, L) => {
    const E = { destPath: q, srcInspectData: k, opts: L }, A = x.normalizeFileMode(k.mode);
    k.type === "dir" ? i.createSync(q, { mode: A }) : k.type === "file" ? y(g, q, A, E) : k.type === "symlink" && w(g, q);
  }, S = (g, k, q) => {
    const L = l(q, g);
    h(g, k, L), d.sync(g, { inspectOptions: r }, (E, A) => {
      const j = n.relative(g, E), D = n.resolve(k, j);
      L.allowedToCopy(E, D, A) && C(E, A, D, L);
    });
  }, F = (g, k, q) => a.async(g).then((L) => {
    if (L)
      return a.async(k);
    throw u(g);
  }).then((L) => {
    if (L && !q.overwrite)
      throw m(k);
  }), R = (g) => new Promise((k, q) => {
    typeof g.opts.overwrite == "function" ? t.async(g.destPath, r).then((L) => {
      k(
        g.opts.overwrite(g.srcInspectData, L)
      );
    }).catch(q) : k(g.opts.overwrite === !0);
  }), T = (g, k, q, L, E) => new Promise((A, j) => {
    const D = E || {};
    let U = "wx";
    D.overwrite && (U = "w");
    const N = e.createReadStream(g), z = e.createWriteStream(k, { mode: q, flags: U });
    N.on("error", j), z.on("error", (W) => {
      N.resume(), W.code === "ENOENT" ? i.createAsync(n.dirname(k)).then(() => {
        T(g, k, q, L).then(
          A,
          j
        );
      }).catch(j) : W.code === "EEXIST" ? R(L).then((Y) => {
        Y ? T(g, k, q, L, {
          overwrite: !0
        }).then(A, j) : c(L) ? j(m(k)) : A();
      }).catch(j) : j(W);
    }), z.on("finish", A), N.pipe(z);
  }), P = (g, k) => e.readlink(g).then((q) => new Promise((L, E) => {
    e.symlink(q, k).then(L).catch((A) => {
      A.code === "EEXIST" ? e.unlink(k).then(() => e.symlink(q, k)).then(L, E) : E(A);
    });
  })), O = (g, k, q, L) => {
    const E = { destPath: q, srcInspectData: k, opts: L }, A = x.normalizeFileMode(k.mode);
    return k.type === "dir" ? i.createAsync(q, { mode: A }) : k.type === "file" ? T(g, q, A, E) : k.type === "symlink" ? P(g, q) : Promise.resolve();
  }, b = (g, k, q) => new Promise((L, E) => {
    const A = l(q, g);
    F(g, k, A).then(() => {
      let j = !1, D = 0;
      d.async(
        g,
        { inspectOptions: r },
        (U, N) => {
          if (N) {
            const z = n.relative(g, U), W = n.resolve(k, z);
            A.allowedToCopy(U, N, W) && (D += 1, O(U, N, W, A).then(() => {
              D -= 1, j && D === 0 && L();
            }).catch(E));
          }
        },
        (U) => {
          U ? E(U) : (j = !0, j && D === 0 && L());
        }
      );
    }).catch(E);
  });
  return Ue.validateInput = p, Ue.sync = S, Ue.async = b, Ue;
}
var Be = {}, ci;
function bt() {
  if (ci) return Be;
  ci = 1;
  const n = G, e = oe(), i = ie(), a = vt(), t = je(), o = qa(), s = Ca(), x = (r, c, h, v) => {
    const y = `${r}(from, to, [options])`;
    i.argument(y, "from", c, ["string"]), i.argument(y, "to", h, ["string"]), i.options(y, "options", v, {
      overwrite: ["boolean"]
    });
  }, d = (r) => r || {}, f = (r) => {
    const c = new Error(`Destination path already exists ${r}`);
    return c.code = "EEXIST", c;
  }, p = (r) => {
    const c = new Error(`Path to move doesn't exist ${r}`);
    return c.code = "ENOENT", c;
  }, l = (r, c, h) => {
    const v = d(h);
    if (o.sync(c) !== !1 && v.overwrite !== !0)
      throw f(c);
    try {
      e.renameSync(r, c);
    } catch (y) {
      if (y.code === "EISDIR" || y.code === "EPERM")
        s.sync(c), e.renameSync(r, c);
      else if (y.code === "EXDEV")
        a.sync(r, c, { overwrite: !0 }), s.sync(r);
      else if (y.code === "ENOENT") {
        if (!o.sync(r))
          throw p(r);
        t.createSync(n.dirname(c)), e.renameSync(r, c);
      } else
        throw y;
    }
  }, u = (r) => new Promise((c, h) => {
    const v = n.dirname(r);
    o.async(v).then((y) => {
      y ? h() : t.createAsync(v).then(c, h);
    }).catch(h);
  }), m = (r, c, h) => {
    const v = d(h);
    return new Promise((y, w) => {
      o.async(c).then((C) => {
        C !== !1 && v.overwrite !== !0 ? w(f(c)) : e.rename(r, c).then(y).catch((S) => {
          S.code === "EISDIR" || S.code === "EPERM" ? s.async(c).then(() => e.rename(r, c)).then(y, w) : S.code === "EXDEV" ? a.async(r, c, { overwrite: !0 }).then(() => s.async(r)).then(y, w) : S.code === "ENOENT" ? o.async(r).then((F) => {
            F ? u(c).then(() => e.rename(r, c)).then(y, w) : w(p(r));
          }).catch(w) : w(S);
        });
      });
    });
  };
  return Be.validateInput = x, Be.sync = l, Be.async = m, Be;
}
var $e = {}, pi;
function Fs() {
  if (pi) return $e;
  pi = 1;
  const n = oe(), e = ie(), i = ["utf8", "buffer", "json", "jsonWithDates"], a = (d, f, p) => {
    const l = `${d}(path, returnAs)`;
    if (e.argument(l, "path", f, ["string"]), e.argument(l, "returnAs", p, [
      "string",
      "undefined"
    ]), p && i.indexOf(p) === -1)
      throw new Error(
        `Argument "returnAs" passed to ${l} must have one of values: ${i.join(
          ", "
        )}`
      );
  }, t = (d, f) => typeof f == "string" && /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/.exec(f) ? new Date(f) : f, o = (d, f) => {
    const p = new Error(
      `JSON parsing failed while reading ${d} [${f}]`
    );
    return p.originalError = f, p;
  }, s = (d, f) => {
    const p = f || "utf8";
    let l, u = "utf8";
    p === "buffer" && (u = null);
    try {
      l = n.readFileSync(d, { encoding: u });
    } catch (m) {
      if (m.code === "ENOENT")
        return;
      throw m;
    }
    try {
      p === "json" ? l = JSON.parse(l) : p === "jsonWithDates" && (l = JSON.parse(l, t));
    } catch (m) {
      throw o(d, m);
    }
    return l;
  }, x = (d, f) => new Promise((p, l) => {
    const u = f || "utf8";
    let m = "utf8";
    u === "buffer" && (m = null), n.readFile(d, { encoding: m }).then((r) => {
      try {
        p(u === "json" ? JSON.parse(r) : u === "jsonWithDates" ? JSON.parse(r, t) : r);
      } catch (c) {
        l(o(d, c));
      }
    }).catch((r) => {
      r.code === "ENOENT" ? p(void 0) : l(r);
    });
  });
  return $e.validateInput = a, $e.sync = s, $e.async = x, $e;
}
var Me = {}, li;
function Ls() {
  if (li) return Me;
  li = 1;
  const n = G, e = bt(), i = ie(), a = (s, x, d, f) => {
    const p = `${s}(path, newName, [options])`;
    if (i.argument(p, "path", x, ["string"]), i.argument(p, "newName", d, ["string"]), i.options(p, "options", f, {
      overwrite: ["boolean"]
    }), n.basename(d) !== d)
      throw new Error(
        `Argument "newName" passed to ${p} should be a filename, not a path. Received "${d}"`
      );
  }, t = (s, x, d) => {
    const f = n.join(n.dirname(s), x);
    e.sync(s, f, d);
  }, o = (s, x, d) => {
    const f = n.join(n.dirname(s), x);
    return e.async(s, f, d);
  };
  return Me.validateInput = a, Me.sync = t, Me.async = o, Me;
}
var He = {}, ui;
function Ds() {
  if (ui) return He;
  ui = 1;
  const n = G, e = oe(), i = ie(), a = je(), t = (x, d, f) => {
    const p = `${x}(symlinkValue, path)`;
    i.argument(p, "symlinkValue", d, ["string"]), i.argument(p, "path", f, ["string"]);
  }, o = (x, d) => {
    try {
      e.symlinkSync(x, d);
    } catch (f) {
      if (f.code === "ENOENT")
        a.createSync(n.dirname(d)), e.symlinkSync(x, d);
      else
        throw f;
    }
  }, s = (x, d) => new Promise((f, p) => {
    e.symlink(x, d).then(f).catch((l) => {
      l.code === "ENOENT" ? a.createAsync(n.dirname(d)).then(() => e.symlink(x, d)).then(f, p) : p(l);
    });
  });
  return He.validateInput = t, He.sync = o, He.async = s, He;
}
var on = {}, di;
function Ns() {
  if (di) return on;
  di = 1;
  const n = Te;
  return on.createWriteStream = n.createWriteStream, on.createReadStream = n.createReadStream, on;
}
var Ve = {}, mi;
function Is() {
  if (mi) return Ve;
  mi = 1;
  const n = G, e = Sa, i = Xe, a = je(), t = oe(), o = ie(), s = (l, u) => {
    const m = `${l}([options])`;
    o.options(m, "options", u, {
      prefix: ["string"],
      basePath: ["string"]
    });
  }, x = (l, u) => {
    l = l || {};
    const m = {};
    return typeof l.prefix != "string" ? m.prefix = "" : m.prefix = l.prefix, typeof l.basePath == "string" ? m.basePath = n.resolve(u, l.basePath) : m.basePath = e.tmpdir(), m;
  }, d = 32, f = (l, u) => {
    const m = x(u, l), r = i.randomBytes(d / 2).toString("hex"), c = n.join(
      m.basePath,
      m.prefix + r
    );
    try {
      t.mkdirSync(c);
    } catch (h) {
      if (h.code === "ENOENT")
        a.sync(c);
      else
        throw h;
    }
    return c;
  }, p = (l, u) => new Promise((m, r) => {
    const c = x(u, l);
    i.randomBytes(d / 2, (h, v) => {
      if (h)
        r(h);
      else {
        const y = v.toString("hex"), w = n.join(
          c.basePath,
          c.prefix + y
        );
        t.mkdir(w, (C) => {
          C ? C.code === "ENOENT" ? a.async(w).then(() => {
            m(w);
          }, r) : r(C) : m(w);
        });
      }
    });
  });
  return Ve.validateInput = s, Ve.sync = f, Ve.async = p, Ve;
}
var $n, fi;
function Us() {
  if (fi) return $n;
  fi = 1;
  const n = xe, e = G, i = Rs(), a = je(), t = As(), o = Ps(), s = Qe(), x = qs(), d = vt(), f = qa(), p = Oa(), l = bt(), u = Fs(), m = Ca(), r = Ls(), c = Ds(), h = Ns(), v = Is(), y = kn(), w = (C) => {
    const S = () => C || process.cwd(), F = function() {
      if (arguments.length === 0)
        return S();
      const b = Array.prototype.slice.call(arguments), g = [S()].concat(b);
      return w(e.resolve.apply(null, g));
    }, R = (b) => e.resolve(S(), b), T = function() {
      return Array.prototype.unshift.call(arguments, S()), e.resolve.apply(null, arguments);
    }, P = (b) => {
      const g = b || {};
      return g.cwd = S(), g;
    }, O = {
      cwd: F,
      path: T,
      append: (b, g, k) => {
        i.validateInput("append", b, g, k), i.sync(R(b), g, k);
      },
      appendAsync: (b, g, k) => (i.validateInput("appendAsync", b, g, k), i.async(R(b), g, k)),
      copy: (b, g, k) => {
        d.validateInput("copy", b, g, k), d.sync(R(b), R(g), k);
      },
      copyAsync: (b, g, k) => (d.validateInput("copyAsync", b, g, k), d.async(R(b), R(g), k)),
      createWriteStream: (b, g) => h.createWriteStream(R(b), g),
      createReadStream: (b, g) => h.createReadStream(R(b), g),
      dir: (b, g) => {
        a.validateInput("dir", b, g);
        const k = R(b);
        return a.sync(k, g), F(k);
      },
      dirAsync: (b, g) => (a.validateInput("dirAsync", b, g), new Promise((k, q) => {
        const L = R(b);
        a.async(L, g).then(() => {
          k(F(L));
        }, q);
      })),
      exists: (b) => (f.validateInput("exists", b), f.sync(R(b))),
      existsAsync: (b) => (f.validateInput("existsAsync", b), f.async(R(b))),
      file: (b, g) => (t.validateInput("file", b, g), t.sync(R(b), g), O),
      fileAsync: (b, g) => (t.validateInput("fileAsync", b, g), new Promise((k, q) => {
        t.async(R(b), g).then(() => {
          k(O);
        }, q);
      })),
      find: (b, g) => (typeof g > "u" && typeof b == "object" && (g = b, b = "."), o.validateInput("find", b, g), o.sync(R(b), P(g))),
      findAsync: (b, g) => (typeof g > "u" && typeof b == "object" && (g = b, b = "."), o.validateInput("findAsync", b, g), o.async(R(b), P(g))),
      inspect: (b, g) => (s.validateInput("inspect", b, g), s.sync(R(b), g)),
      inspectAsync: (b, g) => (s.validateInput("inspectAsync", b, g), s.async(R(b), g)),
      inspectTree: (b, g) => (x.validateInput("inspectTree", b, g), x.sync(R(b), g)),
      inspectTreeAsync: (b, g) => (x.validateInput("inspectTreeAsync", b, g), x.async(R(b), g)),
      list: (b) => (p.validateInput("list", b), p.sync(R(b || "."))),
      listAsync: (b) => (p.validateInput("listAsync", b), p.async(R(b || "."))),
      move: (b, g, k) => {
        l.validateInput("move", b, g, k), l.sync(R(b), R(g), k);
      },
      moveAsync: (b, g, k) => (l.validateInput("moveAsync", b, g, k), l.async(R(b), R(g), k)),
      read: (b, g) => (u.validateInput("read", b, g), u.sync(R(b), g)),
      readAsync: (b, g) => (u.validateInput("readAsync", b, g), u.async(R(b), g)),
      remove: (b) => {
        m.validateInput("remove", b), m.sync(R(b || "."));
      },
      removeAsync: (b) => (m.validateInput("removeAsync", b), m.async(R(b || "."))),
      rename: (b, g, k) => {
        r.validateInput("rename", b, g, k), r.sync(R(b), g, k);
      },
      renameAsync: (b, g, k) => (r.validateInput("renameAsync", b, g, k), r.async(R(b), g, k)),
      symlink: (b, g) => {
        c.validateInput("symlink", b, g), c.sync(b, R(g));
      },
      symlinkAsync: (b, g) => (c.validateInput("symlinkAsync", b, g), c.async(b, R(g))),
      tmpDir: (b) => {
        v.validateInput("tmpDir", b);
        const g = v.sync(S(), b);
        return F(g);
      },
      tmpDirAsync: (b) => (v.validateInput("tmpDirAsync", b), new Promise((g, k) => {
        v.async(S(), b).then((q) => {
          g(F(q));
        }, k);
      })),
      write: (b, g, k) => {
        y.validateInput("write", b, g, k), y.sync(R(b), g, k);
      },
      writeAsync: (b, g, k) => (y.validateInput("writeAsync", b, g, k), y.async(R(b), g, k))
    };
    return n.inspect.custom !== void 0 && (O[n.inspect.custom] = () => `[fs-jetpack CWD: ${S()}]`), O;
  };
  return $n = w, $n;
}
var Mn, hi;
function zs() {
  return hi || (hi = 1, Mn = Us()()), Mn;
}
var M = zs();
const Ce = ke.getPath("sessionData"), Bs = G.join(Ce, "Playlists"), ae = G.join(Bs, "meta.json"), _n = (n) => G.join(Ce, `Playlists/${n}`), _e = (n, e) => G.join(Ce, `Playlists/${n}/user/${e}.json`), gt = (n) => G.join(Ce, `Playlists/${n}/vod.json`), yt = (n) => G.join(Ce, `Playlists/${n}/series.json`), wt = (n) => G.join(Ce, `Playlists/${n}/live.json`);
async function ce() {
  const n = await M.readAsync(ae, "json");
  if (!n) {
    const e = { currentPlaylist: { name: "", profile: "" }, playlists: [] };
    return await M.writeAsync(ae, e), e;
  }
  return n;
}
function Et(n, e) {
  return function() {
    return n.apply(e, arguments);
  };
}
const { toString: $s } = Object.prototype, { getPrototypeOf: Fa } = Object, { iterator: Sn, toStringTag: kt } = Symbol, Rn = /* @__PURE__ */ ((n) => (e) => {
  const i = $s.call(e);
  return n[i] || (n[i] = i.slice(8, -1).toLowerCase());
})(/* @__PURE__ */ Object.create(null)), pe = (n) => (n = n.toLowerCase(), (e) => Rn(e) === n), An = (n) => (e) => typeof e === n, { isArray: Oe } = Array, Ge = An("undefined");
function Ms(n) {
  return n !== null && !Ge(n) && n.constructor !== null && !Ge(n.constructor) && se(n.constructor.isBuffer) && n.constructor.isBuffer(n);
}
const _t = pe("ArrayBuffer");
function Hs(n) {
  let e;
  return typeof ArrayBuffer < "u" && ArrayBuffer.isView ? e = ArrayBuffer.isView(n) : e = n && n.buffer && _t(n.buffer), e;
}
const Vs = An("string"), se = An("function"), St = An("number"), Tn = (n) => n !== null && typeof n == "object", Ws = (n) => n === !0 || n === !1, hn = (n) => {
  if (Rn(n) !== "object")
    return !1;
  const e = Fa(n);
  return (e === null || e === Object.prototype || Object.getPrototypeOf(e) === null) && !(kt in n) && !(Sn in n);
}, Ks = pe("Date"), Js = pe("File"), Gs = pe("Blob"), Ys = pe("FileList"), Xs = (n) => Tn(n) && se(n.pipe), Zs = (n) => {
  let e;
  return n && (typeof FormData == "function" && n instanceof FormData || se(n.append) && ((e = Rn(n)) === "formdata" || // detect form-data instance
  e === "object" && se(n.toString) && n.toString() === "[object FormData]"));
}, Qs = pe("URLSearchParams"), [eo, no, ao, io] = ["ReadableStream", "Request", "Response", "Headers"].map(pe), to = (n) => n.trim ? n.trim() : n.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
function en(n, e, { allOwnKeys: i = !1 } = {}) {
  if (n === null || typeof n > "u")
    return;
  let a, t;
  if (typeof n != "object" && (n = [n]), Oe(n))
    for (a = 0, t = n.length; a < t; a++)
      e.call(null, n[a], a, n);
  else {
    const o = i ? Object.getOwnPropertyNames(n) : Object.keys(n), s = o.length;
    let x;
    for (a = 0; a < s; a++)
      x = o[a], e.call(null, n[x], x, n);
  }
}
function Rt(n, e) {
  e = e.toLowerCase();
  const i = Object.keys(n);
  let a = i.length, t;
  for (; a-- > 0; )
    if (t = i[a], e === t.toLowerCase())
      return t;
  return null;
}
const ye = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : global, At = (n) => !Ge(n) && n !== ye;
function ba() {
  const { caseless: n } = At(this) && this || {}, e = {}, i = (a, t) => {
    const o = n && Rt(e, t) || t;
    hn(e[o]) && hn(a) ? e[o] = ba(e[o], a) : hn(a) ? e[o] = ba({}, a) : Oe(a) ? e[o] = a.slice() : e[o] = a;
  };
  for (let a = 0, t = arguments.length; a < t; a++)
    arguments[a] && en(arguments[a], i);
  return e;
}
const so = (n, e, i, { allOwnKeys: a } = {}) => (en(e, (t, o) => {
  i && se(t) ? n[o] = Et(t, i) : n[o] = t;
}, { allOwnKeys: a }), n), oo = (n) => (n.charCodeAt(0) === 65279 && (n = n.slice(1)), n), ro = (n, e, i, a) => {
  n.prototype = Object.create(e.prototype, a), n.prototype.constructor = n, Object.defineProperty(n, "super", {
    value: e.prototype
  }), i && Object.assign(n.prototype, i);
}, co = (n, e, i, a) => {
  let t, o, s;
  const x = {};
  if (e = e || {}, n == null) return e;
  do {
    for (t = Object.getOwnPropertyNames(n), o = t.length; o-- > 0; )
      s = t[o], (!a || a(s, n, e)) && !x[s] && (e[s] = n[s], x[s] = !0);
    n = i !== !1 && Fa(n);
  } while (n && (!i || i(n, e)) && n !== Object.prototype);
  return e;
}, po = (n, e, i) => {
  n = String(n), (i === void 0 || i > n.length) && (i = n.length), i -= e.length;
  const a = n.indexOf(e, i);
  return a !== -1 && a === i;
}, lo = (n) => {
  if (!n) return null;
  if (Oe(n)) return n;
  let e = n.length;
  if (!St(e)) return null;
  const i = new Array(e);
  for (; e-- > 0; )
    i[e] = n[e];
  return i;
}, uo = /* @__PURE__ */ ((n) => (e) => n && e instanceof n)(typeof Uint8Array < "u" && Fa(Uint8Array)), mo = (n, e) => {
  const a = (n && n[Sn]).call(n);
  let t;
  for (; (t = a.next()) && !t.done; ) {
    const o = t.value;
    e.call(n, o[0], o[1]);
  }
}, fo = (n, e) => {
  let i;
  const a = [];
  for (; (i = n.exec(e)) !== null; )
    a.push(i);
  return a;
}, ho = pe("HTMLFormElement"), xo = (n) => n.toLowerCase().replace(
  /[-_\s]([a-z\d])(\w*)/g,
  function(i, a, t) {
    return a.toUpperCase() + t;
  }
), xi = (({ hasOwnProperty: n }) => (e, i) => n.call(e, i))(Object.prototype), vo = pe("RegExp"), Tt = (n, e) => {
  const i = Object.getOwnPropertyDescriptors(n), a = {};
  en(i, (t, o) => {
    let s;
    (s = e(t, o, n)) !== !1 && (a[o] = s || t);
  }), Object.defineProperties(n, a);
}, bo = (n) => {
  Tt(n, (e, i) => {
    if (se(n) && ["arguments", "caller", "callee"].indexOf(i) !== -1)
      return !1;
    const a = n[i];
    if (se(a)) {
      if (e.enumerable = !1, "writable" in e) {
        e.writable = !1;
        return;
      }
      e.set || (e.set = () => {
        throw Error("Can not rewrite read-only method '" + i + "'");
      });
    }
  });
}, go = (n, e) => {
  const i = {}, a = (t) => {
    t.forEach((o) => {
      i[o] = !0;
    });
  };
  return Oe(n) ? a(n) : a(String(n).split(e)), i;
}, yo = () => {
}, wo = (n, e) => n != null && Number.isFinite(n = +n) ? n : e;
function Eo(n) {
  return !!(n && se(n.append) && n[kt] === "FormData" && n[Sn]);
}
const ko = (n) => {
  const e = new Array(10), i = (a, t) => {
    if (Tn(a)) {
      if (e.indexOf(a) >= 0)
        return;
      if (!("toJSON" in a)) {
        e[t] = a;
        const o = Oe(a) ? [] : {};
        return en(a, (s, x) => {
          const d = i(s, t + 1);
          !Ge(d) && (o[x] = d);
        }), e[t] = void 0, o;
      }
    }
    return a;
  };
  return i(n, 0);
}, _o = pe("AsyncFunction"), So = (n) => n && (Tn(n) || se(n)) && se(n.then) && se(n.catch), jt = ((n, e) => n ? setImmediate : e ? ((i, a) => (ye.addEventListener("message", ({ source: t, data: o }) => {
  t === ye && o === i && a.length && a.shift()();
}, !1), (t) => {
  a.push(t), ye.postMessage(i, "*");
}))(`axios@${Math.random()}`, []) : (i) => setTimeout(i))(
  typeof setImmediate == "function",
  se(ye.postMessage)
), Ro = typeof queueMicrotask < "u" ? queueMicrotask.bind(ye) : typeof process < "u" && process.nextTick || jt, Ao = (n) => n != null && se(n[Sn]), _ = {
  isArray: Oe,
  isArrayBuffer: _t,
  isBuffer: Ms,
  isFormData: Zs,
  isArrayBufferView: Hs,
  isString: Vs,
  isNumber: St,
  isBoolean: Ws,
  isObject: Tn,
  isPlainObject: hn,
  isReadableStream: eo,
  isRequest: no,
  isResponse: ao,
  isHeaders: io,
  isUndefined: Ge,
  isDate: Ks,
  isFile: Js,
  isBlob: Gs,
  isRegExp: vo,
  isFunction: se,
  isStream: Xs,
  isURLSearchParams: Qs,
  isTypedArray: uo,
  isFileList: Ys,
  forEach: en,
  merge: ba,
  extend: so,
  trim: to,
  stripBOM: oo,
  inherits: ro,
  toFlatObject: co,
  kindOf: Rn,
  kindOfTest: pe,
  endsWith: po,
  toArray: lo,
  forEachEntry: mo,
  matchAll: fo,
  isHTMLForm: ho,
  hasOwnProperty: xi,
  hasOwnProp: xi,
  // an alias to avoid ESLint no-prototype-builtins detection
  reduceDescriptors: Tt,
  freezeMethods: bo,
  toObjectSet: go,
  toCamelCase: xo,
  noop: yo,
  toFiniteNumber: wo,
  findKey: Rt,
  global: ye,
  isContextDefined: At,
  isSpecCompliantForm: Eo,
  toJSONObject: ko,
  isAsyncFn: _o,
  isThenable: So,
  setImmediate: jt,
  asap: Ro,
  isIterable: Ao
};
function I(n, e, i, a, t) {
  Error.call(this), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack, this.message = n, this.name = "AxiosError", e && (this.code = e), i && (this.config = i), a && (this.request = a), t && (this.response = t, this.status = t.status ? t.status : null);
}
_.inherits(I, Error, {
  toJSON: function() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: _.toJSONObject(this.config),
      code: this.code,
      status: this.status
    };
  }
});
const Ct = I.prototype, Ot = {};
[
  "ERR_BAD_OPTION_VALUE",
  "ERR_BAD_OPTION",
  "ECONNABORTED",
  "ETIMEDOUT",
  "ERR_NETWORK",
  "ERR_FR_TOO_MANY_REDIRECTS",
  "ERR_DEPRECATED",
  "ERR_BAD_RESPONSE",
  "ERR_BAD_REQUEST",
  "ERR_CANCELED",
  "ERR_NOT_SUPPORT",
  "ERR_INVALID_URL"
  // eslint-disable-next-line func-names
].forEach((n) => {
  Ot[n] = { value: n };
});
Object.defineProperties(I, Ot);
Object.defineProperty(Ct, "isAxiosError", { value: !0 });
I.from = (n, e, i, a, t, o) => {
  const s = Object.create(Ct);
  return _.toFlatObject(n, s, function(d) {
    return d !== Error.prototype;
  }, (x) => x !== "isAxiosError"), I.call(s, n.message, e, i, a, t), s.cause = n, s.name = n.name, o && Object.assign(s, o), s;
};
var Hn, vi;
function To() {
  if (vi) return Hn;
  vi = 1;
  var n = re.Stream, e = xe;
  Hn = i;
  function i() {
    this.source = null, this.dataSize = 0, this.maxDataSize = 1024 * 1024, this.pauseStream = !0, this._maxDataSizeExceeded = !1, this._released = !1, this._bufferedEvents = [];
  }
  return e.inherits(i, n), i.create = function(a, t) {
    var o = new this();
    t = t || {};
    for (var s in t)
      o[s] = t[s];
    o.source = a;
    var x = a.emit;
    return a.emit = function() {
      return o._handleEmit(arguments), x.apply(a, arguments);
    }, a.on("error", function() {
    }), o.pauseStream && a.pause(), o;
  }, Object.defineProperty(i.prototype, "readable", {
    configurable: !0,
    enumerable: !0,
    get: function() {
      return this.source.readable;
    }
  }), i.prototype.setEncoding = function() {
    return this.source.setEncoding.apply(this.source, arguments);
  }, i.prototype.resume = function() {
    this._released || this.release(), this.source.resume();
  }, i.prototype.pause = function() {
    this.source.pause();
  }, i.prototype.release = function() {
    this._released = !0, this._bufferedEvents.forEach((function(a) {
      this.emit.apply(this, a);
    }).bind(this)), this._bufferedEvents = [];
  }, i.prototype.pipe = function() {
    var a = n.prototype.pipe.apply(this, arguments);
    return this.resume(), a;
  }, i.prototype._handleEmit = function(a) {
    if (this._released) {
      this.emit.apply(this, a);
      return;
    }
    a[0] === "data" && (this.dataSize += a[1].length, this._checkIfMaxDataSizeExceeded()), this._bufferedEvents.push(a);
  }, i.prototype._checkIfMaxDataSizeExceeded = function() {
    if (!this._maxDataSizeExceeded && !(this.dataSize <= this.maxDataSize)) {
      this._maxDataSizeExceeded = !0;
      var a = "DelayedStream#maxDataSize of " + this.maxDataSize + " bytes exceeded.";
      this.emit("error", new Error(a));
    }
  }, Hn;
}
var Vn, bi;
function jo() {
  if (bi) return Vn;
  bi = 1;
  var n = xe, e = re.Stream, i = To();
  Vn = a;
  function a() {
    this.writable = !1, this.readable = !0, this.dataSize = 0, this.maxDataSize = 2 * 1024 * 1024, this.pauseStreams = !0, this._released = !1, this._streams = [], this._currentStream = null, this._insideLoop = !1, this._pendingNext = !1;
  }
  return n.inherits(a, e), a.create = function(t) {
    var o = new this();
    t = t || {};
    for (var s in t)
      o[s] = t[s];
    return o;
  }, a.isStreamLike = function(t) {
    return typeof t != "function" && typeof t != "string" && typeof t != "boolean" && typeof t != "number" && !Buffer.isBuffer(t);
  }, a.prototype.append = function(t) {
    var o = a.isStreamLike(t);
    if (o) {
      if (!(t instanceof i)) {
        var s = i.create(t, {
          maxDataSize: 1 / 0,
          pauseStream: this.pauseStreams
        });
        t.on("data", this._checkDataSize.bind(this)), t = s;
      }
      this._handleErrors(t), this.pauseStreams && t.pause();
    }
    return this._streams.push(t), this;
  }, a.prototype.pipe = function(t, o) {
    return e.prototype.pipe.call(this, t, o), this.resume(), t;
  }, a.prototype._getNext = function() {
    if (this._currentStream = null, this._insideLoop) {
      this._pendingNext = !0;
      return;
    }
    this._insideLoop = !0;
    try {
      do
        this._pendingNext = !1, this._realGetNext();
      while (this._pendingNext);
    } finally {
      this._insideLoop = !1;
    }
  }, a.prototype._realGetNext = function() {
    var t = this._streams.shift();
    if (typeof t > "u") {
      this.end();
      return;
    }
    if (typeof t != "function") {
      this._pipeNext(t);
      return;
    }
    var o = t;
    o((function(s) {
      var x = a.isStreamLike(s);
      x && (s.on("data", this._checkDataSize.bind(this)), this._handleErrors(s)), this._pipeNext(s);
    }).bind(this));
  }, a.prototype._pipeNext = function(t) {
    this._currentStream = t;
    var o = a.isStreamLike(t);
    if (o) {
      t.on("end", this._getNext.bind(this)), t.pipe(this, { end: !1 });
      return;
    }
    var s = t;
    this.write(s), this._getNext();
  }, a.prototype._handleErrors = function(t) {
    var o = this;
    t.on("error", function(s) {
      o._emitError(s);
    });
  }, a.prototype.write = function(t) {
    this.emit("data", t);
  }, a.prototype.pause = function() {
    this.pauseStreams && (this.pauseStreams && this._currentStream && typeof this._currentStream.pause == "function" && this._currentStream.pause(), this.emit("pause"));
  }, a.prototype.resume = function() {
    this._released || (this._released = !0, this.writable = !0, this._getNext()), this.pauseStreams && this._currentStream && typeof this._currentStream.resume == "function" && this._currentStream.resume(), this.emit("resume");
  }, a.prototype.end = function() {
    this._reset(), this.emit("end");
  }, a.prototype.destroy = function() {
    this._reset(), this.emit("close");
  }, a.prototype._reset = function() {
    this.writable = !1, this._streams = [], this._currentStream = null;
  }, a.prototype._checkDataSize = function() {
    if (this._updateDataSize(), !(this.dataSize <= this.maxDataSize)) {
      var t = "DelayedStream#maxDataSize of " + this.maxDataSize + " bytes exceeded.";
      this._emitError(new Error(t));
    }
  }, a.prototype._updateDataSize = function() {
    this.dataSize = 0;
    var t = this;
    this._streams.forEach(function(o) {
      o.dataSize && (t.dataSize += o.dataSize);
    }), this._currentStream && this._currentStream.dataSize && (this.dataSize += this._currentStream.dataSize);
  }, a.prototype._emitError = function(t) {
    this._reset(), this.emit("error", t);
  }, Vn;
}
var Wn = {};
const Co = {
  "application/1d-interleaved-parityfec": { source: "iana" },
  "application/3gpdash-qoe-report+xml": { source: "iana", charset: "UTF-8", compressible: !0 },
  "application/3gpp-ims+xml": { source: "iana", compressible: !0 },
  "application/3gpphal+json": { source: "iana", compressible: !0 },
  "application/3gpphalforms+json": { source: "iana", compressible: !0 },
  "application/a2l": { source: "iana" },
  "application/ace+cbor": { source: "iana" },
  "application/activemessage": { source: "iana" },
  "application/activity+json": { source: "iana", compressible: !0 },
  "application/alto-costmap+json": { source: "iana", compressible: !0 },
  "application/alto-costmapfilter+json": { source: "iana", compressible: !0 },
  "application/alto-directory+json": { source: "iana", compressible: !0 },
  "application/alto-endpointcost+json": { source: "iana", compressible: !0 },
  "application/alto-endpointcostparams+json": { source: "iana", compressible: !0 },
  "application/alto-endpointprop+json": { source: "iana", compressible: !0 },
  "application/alto-endpointpropparams+json": { source: "iana", compressible: !0 },
  "application/alto-error+json": { source: "iana", compressible: !0 },
  "application/alto-networkmap+json": { source: "iana", compressible: !0 },
  "application/alto-networkmapfilter+json": { source: "iana", compressible: !0 },
  "application/alto-updatestreamcontrol+json": { source: "iana", compressible: !0 },
  "application/alto-updatestreamparams+json": { source: "iana", compressible: !0 },
  "application/aml": { source: "iana" },
  "application/andrew-inset": { source: "iana", extensions: ["ez"] },
  "application/applefile": { source: "iana" },
  "application/applixware": { source: "apache", extensions: ["aw"] },
  "application/at+jwt": { source: "iana" },
  "application/atf": { source: "iana" },
  "application/atfx": { source: "iana" },
  "application/atom+xml": { source: "iana", compressible: !0, extensions: ["atom"] },
  "application/atomcat+xml": { source: "iana", compressible: !0, extensions: ["atomcat"] },
  "application/atomdeleted+xml": { source: "iana", compressible: !0, extensions: ["atomdeleted"] },
  "application/atomicmail": { source: "iana" },
  "application/atomsvc+xml": { source: "iana", compressible: !0, extensions: ["atomsvc"] },
  "application/atsc-dwd+xml": { source: "iana", compressible: !0, extensions: ["dwd"] },
  "application/atsc-dynamic-event-message": { source: "iana" },
  "application/atsc-held+xml": { source: "iana", compressible: !0, extensions: ["held"] },
  "application/atsc-rdt+json": { source: "iana", compressible: !0 },
  "application/atsc-rsat+xml": { source: "iana", compressible: !0, extensions: ["rsat"] },
  "application/atxml": { source: "iana" },
  "application/auth-policy+xml": { source: "iana", compressible: !0 },
  "application/bacnet-xdd+zip": { source: "iana", compressible: !1 },
  "application/batch-smtp": { source: "iana" },
  "application/bdoc": { compressible: !1, extensions: ["bdoc"] },
  "application/beep+xml": { source: "iana", charset: "UTF-8", compressible: !0 },
  "application/calendar+json": { source: "iana", compressible: !0 },
  "application/calendar+xml": { source: "iana", compressible: !0, extensions: ["xcs"] },
  "application/call-completion": { source: "iana" },
  "application/cals-1840": { source: "iana" },
  "application/captive+json": { source: "iana", compressible: !0 },
  "application/cbor": { source: "iana" },
  "application/cbor-seq": { source: "iana" },
  "application/cccex": { source: "iana" },
  "application/ccmp+xml": { source: "iana", compressible: !0 },
  "application/ccxml+xml": { source: "iana", compressible: !0, extensions: ["ccxml"] },
  "application/cdfx+xml": { source: "iana", compressible: !0, extensions: ["cdfx"] },
  "application/cdmi-capability": { source: "iana", extensions: ["cdmia"] },
  "application/cdmi-container": { source: "iana", extensions: ["cdmic"] },
  "application/cdmi-domain": { source: "iana", extensions: ["cdmid"] },
  "application/cdmi-object": { source: "iana", extensions: ["cdmio"] },
  "application/cdmi-queue": { source: "iana", extensions: ["cdmiq"] },
  "application/cdni": { source: "iana" },
  "application/cea": { source: "iana" },
  "application/cea-2018+xml": { source: "iana", compressible: !0 },
  "application/cellml+xml": { source: "iana", compressible: !0 },
  "application/cfw": { source: "iana" },
  "application/city+json": { source: "iana", compressible: !0 },
  "application/clr": { source: "iana" },
  "application/clue+xml": { source: "iana", compressible: !0 },
  "application/clue_info+xml": { source: "iana", compressible: !0 },
  "application/cms": { source: "iana" },
  "application/cnrp+xml": { source: "iana", compressible: !0 },
  "application/coap-group+json": { source: "iana", compressible: !0 },
  "application/coap-payload": { source: "iana" },
  "application/commonground": { source: "iana" },
  "application/conference-info+xml": { source: "iana", compressible: !0 },
  "application/cose": { source: "iana" },
  "application/cose-key": { source: "iana" },
  "application/cose-key-set": { source: "iana" },
  "application/cpl+xml": { source: "iana", compressible: !0, extensions: ["cpl"] },
  "application/csrattrs": { source: "iana" },
  "application/csta+xml": { source: "iana", compressible: !0 },
  "application/cstadata+xml": { source: "iana", compressible: !0 },
  "application/csvm+json": { source: "iana", compressible: !0 },
  "application/cu-seeme": { source: "apache", extensions: ["cu"] },
  "application/cwt": { source: "iana" },
  "application/cybercash": { source: "iana" },
  "application/dart": { compressible: !0 },
  "application/dash+xml": { source: "iana", compressible: !0, extensions: ["mpd"] },
  "application/dash-patch+xml": { source: "iana", compressible: !0, extensions: ["mpp"] },
  "application/dashdelta": { source: "iana" },
  "application/davmount+xml": { source: "iana", compressible: !0, extensions: ["davmount"] },
  "application/dca-rft": { source: "iana" },
  "application/dcd": { source: "iana" },
  "application/dec-dx": { source: "iana" },
  "application/dialog-info+xml": { source: "iana", compressible: !0 },
  "application/dicom": { source: "iana" },
  "application/dicom+json": { source: "iana", compressible: !0 },
  "application/dicom+xml": { source: "iana", compressible: !0 },
  "application/dii": { source: "iana" },
  "application/dit": { source: "iana" },
  "application/dns": { source: "iana" },
  "application/dns+json": { source: "iana", compressible: !0 },
  "application/dns-message": { source: "iana" },
  "application/docbook+xml": { source: "apache", compressible: !0, extensions: ["dbk"] },
  "application/dots+cbor": { source: "iana" },
  "application/dskpp+xml": { source: "iana", compressible: !0 },
  "application/dssc+der": { source: "iana", extensions: ["dssc"] },
  "application/dssc+xml": { source: "iana", compressible: !0, extensions: ["xdssc"] },
  "application/dvcs": { source: "iana" },
  "application/ecmascript": { source: "iana", compressible: !0, extensions: ["es", "ecma"] },
  "application/edi-consent": { source: "iana" },
  "application/edi-x12": { source: "iana", compressible: !1 },
  "application/edifact": { source: "iana", compressible: !1 },
  "application/efi": { source: "iana" },
  "application/elm+json": { source: "iana", charset: "UTF-8", compressible: !0 },
  "application/elm+xml": { source: "iana", compressible: !0 },
  "application/emergencycalldata.cap+xml": { source: "iana", charset: "UTF-8", compressible: !0 },
  "application/emergencycalldata.comment+xml": { source: "iana", compressible: !0 },
  "application/emergencycalldata.control+xml": { source: "iana", compressible: !0 },
  "application/emergencycalldata.deviceinfo+xml": { source: "iana", compressible: !0 },
  "application/emergencycalldata.ecall.msd": { source: "iana" },
  "application/emergencycalldata.providerinfo+xml": { source: "iana", compressible: !0 },
  "application/emergencycalldata.serviceinfo+xml": { source: "iana", compressible: !0 },
  "application/emergencycalldata.subscriberinfo+xml": { source: "iana", compressible: !0 },
  "application/emergencycalldata.veds+xml": { source: "iana", compressible: !0 },
  "application/emma+xml": { source: "iana", compressible: !0, extensions: ["emma"] },
  "application/emotionml+xml": { source: "iana", compressible: !0, extensions: ["emotionml"] },
  "application/encaprtp": { source: "iana" },
  "application/epp+xml": { source: "iana", compressible: !0 },
  "application/epub+zip": { source: "iana", compressible: !1, extensions: ["epub"] },
  "application/eshop": { source: "iana" },
  "application/exi": { source: "iana", extensions: ["exi"] },
  "application/expect-ct-report+json": { source: "iana", compressible: !0 },
  "application/express": { source: "iana", extensions: ["exp"] },
  "application/fastinfoset": { source: "iana" },
  "application/fastsoap": { source: "iana" },
  "application/fdt+xml": { source: "iana", compressible: !0, extensions: ["fdt"] },
  "application/fhir+json": { source: "iana", charset: "UTF-8", compressible: !0 },
  "application/fhir+xml": { source: "iana", charset: "UTF-8", compressible: !0 },
  "application/fido.trusted-apps+json": { compressible: !0 },
  "application/fits": { source: "iana" },
  "application/flexfec": { source: "iana" },
  "application/font-sfnt": { source: "iana" },
  "application/font-tdpfr": { source: "iana", extensions: ["pfr"] },
  "application/font-woff": { source: "iana", compressible: !1 },
  "application/framework-attributes+xml": { source: "iana", compressible: !0 },
  "application/geo+json": { source: "iana", compressible: !0, extensions: ["geojson"] },
  "application/geo+json-seq": { source: "iana" },
  "application/geopackage+sqlite3": { source: "iana" },
  "application/geoxacml+xml": { source: "iana", compressible: !0 },
  "application/gltf-buffer": { source: "iana" },
  "application/gml+xml": { source: "iana", compressible: !0, extensions: ["gml"] },
  "application/gpx+xml": { source: "apache", compressible: !0, extensions: ["gpx"] },
  "application/gxf": { source: "apache", extensions: ["gxf"] },
  "application/gzip": { source: "iana", compressible: !1, extensions: ["gz"] },
  "application/h224": { source: "iana" },
  "application/held+xml": { source: "iana", compressible: !0 },
  "application/hjson": { extensions: ["hjson"] },
  "application/http": { source: "iana" },
  "application/hyperstudio": { source: "iana", extensions: ["stk"] },
  "application/ibe-key-request+xml": { source: "iana", compressible: !0 },
  "application/ibe-pkg-reply+xml": { source: "iana", compressible: !0 },
  "application/ibe-pp-data": { source: "iana" },
  "application/iges": { source: "iana" },
  "application/im-iscomposing+xml": { source: "iana", charset: "UTF-8", compressible: !0 },
  "application/index": { source: "iana" },
  "application/index.cmd": { source: "iana" },
  "application/index.obj": { source: "iana" },
  "application/index.response": { source: "iana" },
  "application/index.vnd": { source: "iana" },
  "application/inkml+xml": { source: "iana", compressible: !0, extensions: ["ink", "inkml"] },
  "application/iotp": { source: "iana" },
  "application/ipfix": { source: "iana", extensions: ["ipfix"] },
  "application/ipp": { source: "iana" },
  "application/isup": { source: "iana" },
  "application/its+xml": { source: "iana", compressible: !0, extensions: ["its"] },
  "application/java-archive": { source: "apache", compressible: !1, extensions: ["jar", "war", "ear"] },
  "application/java-serialized-object": { source: "apache", compressible: !1, extensions: ["ser"] },
  "application/java-vm": { source: "apache", compressible: !1, extensions: ["class"] },
  "application/javascript": { source: "iana", charset: "UTF-8", compressible: !0, extensions: ["js", "mjs"] },
  "application/jf2feed+json": { source: "iana", compressible: !0 },
  "application/jose": { source: "iana" },
  "application/jose+json": { source: "iana", compressible: !0 },
  "application/jrd+json": { source: "iana", compressible: !0 },
  "application/jscalendar+json": { source: "iana", compressible: !0 },
  "application/json": { source: "iana", charset: "UTF-8", compressible: !0, extensions: ["json", "map"] },
  "application/json-patch+json": { source: "iana", compressible: !0 },
  "application/json-seq": { source: "iana" },
  "application/json5": { extensions: ["json5"] },
  "application/jsonml+json": { source: "apache", compressible: !0, extensions: ["jsonml"] },
  "application/jwk+json": { source: "iana", compressible: !0 },
  "application/jwk-set+json": { source: "iana", compressible: !0 },
  "application/jwt": { source: "iana" },
  "application/kpml-request+xml": { source: "iana", compressible: !0 },
  "application/kpml-response+xml": { source: "iana", compressible: !0 },
  "application/ld+json": { source: "iana", compressible: !0, extensions: ["jsonld"] },
  "application/lgr+xml": { source: "iana", compressible: !0, extensions: ["lgr"] },
  "application/link-format": { source: "iana" },
  "application/load-control+xml": { source: "iana", compressible: !0 },
  "application/lost+xml": { source: "iana", compressible: !0, extensions: ["lostxml"] },
  "application/lostsync+xml": { source: "iana", compressible: !0 },
  "application/lpf+zip": { source: "iana", compressible: !1 },
  "application/lxf": { source: "iana" },
  "application/mac-binhex40": { source: "iana", extensions: ["hqx"] },
  "application/mac-compactpro": { source: "apache", extensions: ["cpt"] },
  "application/macwriteii": { source: "iana" },
  "application/mads+xml": { source: "iana", compressible: !0, extensions: ["mads"] },
  "application/manifest+json": { source: "iana", charset: "UTF-8", compressible: !0, extensions: ["webmanifest"] },
  "application/marc": { source: "iana", extensions: ["mrc"] },
  "application/marcxml+xml": { source: "iana", compressible: !0, extensions: ["mrcx"] },
  "application/mathematica": { source: "iana", extensions: ["ma", "nb", "mb"] },
  "application/mathml+xml": { source: "iana", compressible: !0, extensions: ["mathml"] },
  "application/mathml-content+xml": { source: "iana", compressible: !0 },
  "application/mathml-presentation+xml": { source: "iana", compressible: !0 },
  "application/mbms-associated-procedure-description+xml": { source: "iana", compressible: !0 },
  "application/mbms-deregister+xml": { source: "iana", compressible: !0 },
  "application/mbms-envelope+xml": { source: "iana", compressible: !0 },
  "application/mbms-msk+xml": { source: "iana", compressible: !0 },
  "application/mbms-msk-response+xml": { source: "iana", compressible: !0 },
  "application/mbms-protection-description+xml": { source: "iana", compressible: !0 },
  "application/mbms-reception-report+xml": { source: "iana", compressible: !0 },
  "application/mbms-register+xml": { source: "iana", compressible: !0 },
  "application/mbms-register-response+xml": { source: "iana", compressible: !0 },
  "application/mbms-schedule+xml": { source: "iana", compressible: !0 },
  "application/mbms-user-service-description+xml": { source: "iana", compressible: !0 },
  "application/mbox": { source: "iana", extensions: ["mbox"] },
  "application/media-policy-dataset+xml": { source: "iana", compressible: !0, extensions: ["mpf"] },
  "application/media_control+xml": { source: "iana", compressible: !0 },
  "application/mediaservercontrol+xml": { source: "iana", compressible: !0, extensions: ["mscml"] },
  "application/merge-patch+json": { source: "iana", compressible: !0 },
  "application/metalink+xml": { source: "apache", compressible: !0, extensions: ["metalink"] },
  "application/metalink4+xml": { source: "iana", compressible: !0, extensions: ["meta4"] },
  "application/mets+xml": { source: "iana", compressible: !0, extensions: ["mets"] },
  "application/mf4": { source: "iana" },
  "application/mikey": { source: "iana" },
  "application/mipc": { source: "iana" },
  "application/missing-blocks+cbor-seq": { source: "iana" },
  "application/mmt-aei+xml": { source: "iana", compressible: !0, extensions: ["maei"] },
  "application/mmt-usd+xml": { source: "iana", compressible: !0, extensions: ["musd"] },
  "application/mods+xml": { source: "iana", compressible: !0, extensions: ["mods"] },
  "application/moss-keys": { source: "iana" },
  "application/moss-signature": { source: "iana" },
  "application/mosskey-data": { source: "iana" },
  "application/mosskey-request": { source: "iana" },
  "application/mp21": { source: "iana", extensions: ["m21", "mp21"] },
  "application/mp4": { source: "iana", extensions: ["mp4s", "m4p"] },
  "application/mpeg4-generic": { source: "iana" },
  "application/mpeg4-iod": { source: "iana" },
  "application/mpeg4-iod-xmt": { source: "iana" },
  "application/mrb-consumer+xml": { source: "iana", compressible: !0 },
  "application/mrb-publish+xml": { source: "iana", compressible: !0 },
  "application/msc-ivr+xml": { source: "iana", charset: "UTF-8", compressible: !0 },
  "application/msc-mixer+xml": { source: "iana", charset: "UTF-8", compressible: !0 },
  "application/msword": { source: "iana", compressible: !1, extensions: ["doc", "dot"] },
  "application/mud+json": { source: "iana", compressible: !0 },
  "application/multipart-core": { source: "iana" },
  "application/mxf": { source: "iana", extensions: ["mxf"] },
  "application/n-quads": { source: "iana", extensions: ["nq"] },
  "application/n-triples": { source: "iana", extensions: ["nt"] },
  "application/nasdata": { source: "iana" },
  "application/news-checkgroups": { source: "iana", charset: "US-ASCII" },
  "application/news-groupinfo": { source: "iana", charset: "US-ASCII" },
  "application/news-transmission": { source: "iana" },
  "application/nlsml+xml": { source: "iana", compressible: !0 },
  "application/node": { source: "iana", extensions: ["cjs"] },
  "application/nss": { source: "iana" },
  "application/oauth-authz-req+jwt": { source: "iana" },
  "application/oblivious-dns-message": { source: "iana" },
  "application/ocsp-request": { source: "iana" },
  "application/ocsp-response": { source: "iana" },
  "application/octet-stream": { source: "iana", compressible: !1, extensions: ["bin", "dms", "lrf", "mar", "so", "dist", "distz", "pkg", "bpk", "dump", "elc", "deploy", "exe", "dll", "deb", "dmg", "iso", "img", "msi", "msp", "msm", "buffer"] },
  "application/oda": { source: "iana", extensions: ["oda"] },
  "application/odm+xml": { source: "iana", compressible: !0 },
  "application/odx": { source: "iana" },
  "application/oebps-package+xml": { source: "iana", compressible: !0, extensions: ["opf"] },
  "application/ogg": { source: "iana", compressible: !1, extensions: ["ogx"] },
  "application/omdoc+xml": { source: "apache", compressible: !0, extensions: ["omdoc"] },
  "application/onenote": { source: "apache", extensions: ["onetoc", "onetoc2", "onetmp", "onepkg"] },
  "application/opc-nodeset+xml": { source: "iana", compressible: !0 },
  "application/oscore": { source: "iana" },
  "application/oxps": { source: "iana", extensions: ["oxps"] },
  "application/p21": { source: "iana" },
  "application/p21+zip": { source: "iana", compressible: !1 },
  "application/p2p-overlay+xml": { source: "iana", compressible: !0, extensions: ["relo"] },
  "application/parityfec": { source: "iana" },
  "application/passport": { source: "iana" },
  "application/patch-ops-error+xml": { source: "iana", compressible: !0, extensions: ["xer"] },
  "application/pdf": { source: "iana", compressible: !1, extensions: ["pdf"] },
  "application/pdx": { source: "iana" },
  "application/pem-certificate-chain": { source: "iana" },
  "application/pgp-encrypted": { source: "iana", compressible: !1, extensions: ["pgp"] },
  "application/pgp-keys": { source: "iana", extensions: ["asc"] },
  "application/pgp-signature": { source: "iana", extensions: ["asc", "sig"] },
  "application/pics-rules": { source: "apache", extensions: ["prf"] },
  "application/pidf+xml": { source: "iana", charset: "UTF-8", compressible: !0 },
  "application/pidf-diff+xml": { source: "iana", charset: "UTF-8", compressible: !0 },
  "application/pkcs10": { source: "iana", extensions: ["p10"] },
  "application/pkcs12": { source: "iana" },
  "application/pkcs7-mime": { source: "iana", extensions: ["p7m", "p7c"] },
  "application/pkcs7-signature": { source: "iana", extensions: ["p7s"] },
  "application/pkcs8": { source: "iana", extensions: ["p8"] },
  "application/pkcs8-encrypted": { source: "iana" },
  "application/pkix-attr-cert": { source: "iana", extensions: ["ac"] },
  "application/pkix-cert": { source: "iana", extensions: ["cer"] },
  "application/pkix-crl": { source: "iana", extensions: ["crl"] },
  "application/pkix-pkipath": { source: "iana", extensions: ["pkipath"] },
  "application/pkixcmp": { source: "iana", extensions: ["pki"] },
  "application/pls+xml": { source: "iana", compressible: !0, extensions: ["pls"] },
  "application/poc-settings+xml": { source: "iana", charset: "UTF-8", compressible: !0 },
  "application/postscript": { source: "iana", compressible: !0, extensions: ["ai", "eps", "ps"] },
  "application/ppsp-tracker+json": { source: "iana", compressible: !0 },
  "application/problem+json": { source: "iana", compressible: !0 },
  "application/problem+xml": { source: "iana", compressible: !0 },
  "application/provenance+xml": { source: "iana", compressible: !0, extensions: ["provx"] },
  "application/prs.alvestrand.titrax-sheet": { source: "iana" },
  "application/prs.cww": { source: "iana", extensions: ["cww"] },
  "application/prs.cyn": { source: "iana", charset: "7-BIT" },
  "application/prs.hpub+zip": { source: "iana", compressible: !1 },
  "application/prs.nprend": { source: "iana" },
  "application/prs.plucker": { source: "iana" },
  "application/prs.rdf-xml-crypt": { source: "iana" },
  "application/prs.xsf+xml": { source: "iana", compressible: !0 },
  "application/pskc+xml": { source: "iana", compressible: !0, extensions: ["pskcxml"] },
  "application/pvd+json": { source: "iana", compressible: !0 },
  "application/qsig": { source: "iana" },
  "application/raml+yaml": { compressible: !0, extensions: ["raml"] },
  "application/raptorfec": { source: "iana" },
  "application/rdap+json": { source: "iana", compressible: !0 },
  "application/rdf+xml": { source: "iana", compressible: !0, extensions: ["rdf", "owl"] },
  "application/reginfo+xml": { source: "iana", compressible: !0, extensions: ["rif"] },
  "application/relax-ng-compact-syntax": { source: "iana", extensions: ["rnc"] },
  "application/remote-printing": { source: "iana" },
  "application/reputon+json": { source: "iana", compressible: !0 },
  "application/resource-lists+xml": { source: "iana", compressible: !0, extensions: ["rl"] },
  "application/resource-lists-diff+xml": { source: "iana", compressible: !0, extensions: ["rld"] },
  "application/rfc+xml": { source: "iana", compressible: !0 },
  "application/riscos": { source: "iana" },
  "application/rlmi+xml": { source: "iana", compressible: !0 },
  "application/rls-services+xml": { source: "iana", compressible: !0, extensions: ["rs"] },
  "application/route-apd+xml": { source: "iana", compressible: !0, extensions: ["rapd"] },
  "application/route-s-tsid+xml": { source: "iana", compressible: !0, extensions: ["sls"] },
  "application/route-usd+xml": { source: "iana", compressible: !0, extensions: ["rusd"] },
  "application/rpki-ghostbusters": { source: "iana", extensions: ["gbr"] },
  "application/rpki-manifest": { source: "iana", extensions: ["mft"] },
  "application/rpki-publication": { source: "iana" },
  "application/rpki-roa": { source: "iana", extensions: ["roa"] },
  "application/rpki-updown": { source: "iana" },
  "application/rsd+xml": { source: "apache", compressible: !0, extensions: ["rsd"] },
  "application/rss+xml": { source: "apache", compressible: !0, extensions: ["rss"] },
  "application/rtf": { source: "iana", compressible: !0, extensions: ["rtf"] },
  "application/rtploopback": { source: "iana" },
  "application/rtx": { source: "iana" },
  "application/samlassertion+xml": { source: "iana", compressible: !0 },
  "application/samlmetadata+xml": { source: "iana", compressible: !0 },
  "application/sarif+json": { source: "iana", compressible: !0 },
  "application/sarif-external-properties+json": { source: "iana", compressible: !0 },
  "application/sbe": { source: "iana" },
  "application/sbml+xml": { source: "iana", compressible: !0, extensions: ["sbml"] },
  "application/scaip+xml": { source: "iana", compressible: !0 },
  "application/scim+json": { source: "iana", compressible: !0 },
  "application/scvp-cv-request": { source: "iana", extensions: ["scq"] },
  "application/scvp-cv-response": { source: "iana", extensions: ["scs"] },
  "application/scvp-vp-request": { source: "iana", extensions: ["spq"] },
  "application/scvp-vp-response": { source: "iana", extensions: ["spp"] },
  "application/sdp": { source: "iana", extensions: ["sdp"] },
  "application/secevent+jwt": { source: "iana" },
  "application/senml+cbor": { source: "iana" },
  "application/senml+json": { source: "iana", compressible: !0 },
  "application/senml+xml": { source: "iana", compressible: !0, extensions: ["senmlx"] },
  "application/senml-etch+cbor": { source: "iana" },
  "application/senml-etch+json": { source: "iana", compressible: !0 },
  "application/senml-exi": { source: "iana" },
  "application/sensml+cbor": { source: "iana" },
  "application/sensml+json": { source: "iana", compressible: !0 },
  "application/sensml+xml": { source: "iana", compressible: !0, extensions: ["sensmlx"] },
  "application/sensml-exi": { source: "iana" },
  "application/sep+xml": { source: "iana", compressible: !0 },
  "application/sep-exi": { source: "iana" },
  "application/session-info": { source: "iana" },
  "application/set-payment": { source: "iana" },
  "application/set-payment-initiation": { source: "iana", extensions: ["setpay"] },
  "application/set-registration": { source: "iana" },
  "application/set-registration-initiation": { source: "iana", extensions: ["setreg"] },
  "application/sgml": { source: "iana" },
  "application/sgml-open-catalog": { source: "iana" },
  "application/shf+xml": { source: "iana", compressible: !0, extensions: ["shf"] },
  "application/sieve": { source: "iana", extensions: ["siv", "sieve"] },
  "application/simple-filter+xml": { source: "iana", compressible: !0 },
  "application/simple-message-summary": { source: "iana" },
  "application/simplesymbolcontainer": { source: "iana" },
  "application/sipc": { source: "iana" },
  "application/slate": { source: "iana" },
  "application/smil": { source: "iana" },
  "application/smil+xml": { source: "iana", compressible: !0, extensions: ["smi", "smil"] },
  "application/smpte336m": { source: "iana" },
  "application/soap+fastinfoset": { source: "iana" },
  "application/soap+xml": { source: "iana", compressible: !0 },
  "application/sparql-query": { source: "iana", extensions: ["rq"] },
  "application/sparql-results+xml": { source: "iana", compressible: !0, extensions: ["srx"] },
  "application/spdx+json": { source: "iana", compressible: !0 },
  "application/spirits-event+xml": { source: "iana", compressible: !0 },
  "application/sql": { source: "iana" },
  "application/srgs": { source: "iana", extensions: ["gram"] },
  "application/srgs+xml": { source: "iana", compressible: !0, extensions: ["grxml"] },
  "application/sru+xml": { source: "iana", compressible: !0, extensions: ["sru"] },
  "application/ssdl+xml": { source: "apache", compressible: !0, extensions: ["ssdl"] },
  "application/ssml+xml": { source: "iana", compressible: !0, extensions: ["ssml"] },
  "application/stix+json": { source: "iana", compressible: !0 },
  "application/swid+xml": { source: "iana", compressible: !0, extensions: ["swidtag"] },
  "application/tamp-apex-update": { source: "iana" },
  "application/tamp-apex-update-confirm": { source: "iana" },
  "application/tamp-community-update": { source: "iana" },
  "application/tamp-community-update-confirm": { source: "iana" },
  "application/tamp-error": { source: "iana" },
  "application/tamp-sequence-adjust": { source: "iana" },
  "application/tamp-sequence-adjust-confirm": { source: "iana" },
  "application/tamp-status-query": { source: "iana" },
  "application/tamp-status-response": { source: "iana" },
  "application/tamp-update": { source: "iana" },
  "application/tamp-update-confirm": { source: "iana" },
  "application/tar": { compressible: !0 },
  "application/taxii+json": { source: "iana", compressible: !0 },
  "application/td+json": { source: "iana", compressible: !0 },
  "application/tei+xml": { source: "iana", compressible: !0, extensions: ["tei", "teicorpus"] },
  "application/tetra_isi": { source: "iana" },
  "application/thraud+xml": { source: "iana", compressible: !0, extensions: ["tfi"] },
  "application/timestamp-query": { source: "iana" },
  "application/timestamp-reply": { source: "iana" },
  "application/timestamped-data": { source: "iana", extensions: ["tsd"] },
  "application/tlsrpt+gzip": { source: "iana" },
  "application/tlsrpt+json": { source: "iana", compressible: !0 },
  "application/tnauthlist": { source: "iana" },
  "application/token-introspection+jwt": { source: "iana" },
  "application/toml": { compressible: !0, extensions: ["toml"] },
  "application/trickle-ice-sdpfrag": { source: "iana" },
  "application/trig": { source: "iana", extensions: ["trig"] },
  "application/ttml+xml": { source: "iana", compressible: !0, extensions: ["ttml"] },
  "application/tve-trigger": { source: "iana" },
  "application/tzif": { source: "iana" },
  "application/tzif-leap": { source: "iana" },
  "application/ubjson": { compressible: !1, extensions: ["ubj"] },
  "application/ulpfec": { source: "iana" },
  "application/urc-grpsheet+xml": { source: "iana", compressible: !0 },
  "application/urc-ressheet+xml": { source: "iana", compressible: !0, extensions: ["rsheet"] },
  "application/urc-targetdesc+xml": { source: "iana", compressible: !0, extensions: ["td"] },
  "application/urc-uisocketdesc+xml": { source: "iana", compressible: !0 },
  "application/vcard+json": { source: "iana", compressible: !0 },
  "application/vcard+xml": { source: "iana", compressible: !0 },
  "application/vemmi": { source: "iana" },
  "application/vividence.scriptfile": { source: "apache" },
  "application/vnd.1000minds.decision-model+xml": { source: "iana", compressible: !0, extensions: ["1km"] },
  "application/vnd.3gpp-prose+xml": { source: "iana", compressible: !0 },
  "application/vnd.3gpp-prose-pc3ch+xml": { source: "iana", compressible: !0 },
  "application/vnd.3gpp-v2x-local-service-information": { source: "iana" },
  "application/vnd.3gpp.5gnas": { source: "iana" },
  "application/vnd.3gpp.access-transfer-events+xml": { source: "iana", compressible: !0 },
  "application/vnd.3gpp.bsf+xml": { source: "iana", compressible: !0 },
  "application/vnd.3gpp.gmop+xml": { source: "iana", compressible: !0 },
  "application/vnd.3gpp.gtpc": { source: "iana" },
  "application/vnd.3gpp.interworking-data": { source: "iana" },
  "application/vnd.3gpp.lpp": { source: "iana" },
  "application/vnd.3gpp.mc-signalling-ear": { source: "iana" },
  "application/vnd.3gpp.mcdata-affiliation-command+xml": { source: "iana", compressible: !0 },
  "application/vnd.3gpp.mcdata-info+xml": { source: "iana", compressible: !0 },
  "application/vnd.3gpp.mcdata-payload": { source: "iana" },
  "application/vnd.3gpp.mcdata-service-config+xml": { source: "iana", compressible: !0 },
  "application/vnd.3gpp.mcdata-signalling": { source: "iana" },
  "application/vnd.3gpp.mcdata-ue-config+xml": { source: "iana", compressible: !0 },
  "application/vnd.3gpp.mcdata-user-profile+xml": { source: "iana", compressible: !0 },
  "application/vnd.3gpp.mcptt-affiliation-command+xml": { source: "iana", compressible: !0 },
  "application/vnd.3gpp.mcptt-floor-request+xml": { source: "iana", compressible: !0 },
  "application/vnd.3gpp.mcptt-info+xml": { source: "iana", compressible: !0 },
  "application/vnd.3gpp.mcptt-location-info+xml": { source: "iana", compressible: !0 },
  "application/vnd.3gpp.mcptt-mbms-usage-info+xml": { source: "iana", compressible: !0 },
  "application/vnd.3gpp.mcptt-service-config+xml": { source: "iana", compressible: !0 },
  "application/vnd.3gpp.mcptt-signed+xml": { source: "iana", compressible: !0 },
  "application/vnd.3gpp.mcptt-ue-config+xml": { source: "iana", compressible: !0 },
  "application/vnd.3gpp.mcptt-ue-init-config+xml": { source: "iana", compressible: !0 },
  "application/vnd.3gpp.mcptt-user-profile+xml": { source: "iana", compressible: !0 },
  "application/vnd.3gpp.mcvideo-affiliation-command+xml": { source: "iana", compressible: !0 },
  "application/vnd.3gpp.mcvideo-affiliation-info+xml": { source: "iana", compressible: !0 },
  "application/vnd.3gpp.mcvideo-info+xml": { source: "iana", compressible: !0 },
  "application/vnd.3gpp.mcvideo-location-info+xml": { source: "iana", compressible: !0 },
  "application/vnd.3gpp.mcvideo-mbms-usage-info+xml": { source: "iana", compressible: !0 },
  "application/vnd.3gpp.mcvideo-service-config+xml": { source: "iana", compressible: !0 },
  "application/vnd.3gpp.mcvideo-transmission-request+xml": { source: "iana", compressible: !0 },
  "application/vnd.3gpp.mcvideo-ue-config+xml": { source: "iana", compressible: !0 },
  "application/vnd.3gpp.mcvideo-user-profile+xml": { source: "iana", compressible: !0 },
  "application/vnd.3gpp.mid-call+xml": { source: "iana", compressible: !0 },
  "application/vnd.3gpp.ngap": { source: "iana" },
  "application/vnd.3gpp.pfcp": { source: "iana" },
  "application/vnd.3gpp.pic-bw-large": { source: "iana", extensions: ["plb"] },
  "application/vnd.3gpp.pic-bw-small": { source: "iana", extensions: ["psb"] },
  "application/vnd.3gpp.pic-bw-var": { source: "iana", extensions: ["pvb"] },
  "application/vnd.3gpp.s1ap": { source: "iana" },
  "application/vnd.3gpp.sms": { source: "iana" },
  "application/vnd.3gpp.sms+xml": { source: "iana", compressible: !0 },
  "application/vnd.3gpp.srvcc-ext+xml": { source: "iana", compressible: !0 },
  "application/vnd.3gpp.srvcc-info+xml": { source: "iana", compressible: !0 },
  "application/vnd.3gpp.state-and-event-info+xml": { source: "iana", compressible: !0 },
  "application/vnd.3gpp.ussd+xml": { source: "iana", compressible: !0 },
  "application/vnd.3gpp2.bcmcsinfo+xml": { source: "iana", compressible: !0 },
  "application/vnd.3gpp2.sms": { source: "iana" },
  "application/vnd.3gpp2.tcap": { source: "iana", extensions: ["tcap"] },
  "application/vnd.3lightssoftware.imagescal": { source: "iana" },
  "application/vnd.3m.post-it-notes": { source: "iana", extensions: ["pwn"] },
  "application/vnd.accpac.simply.aso": { source: "iana", extensions: ["aso"] },
  "application/vnd.accpac.simply.imp": { source: "iana", extensions: ["imp"] },
  "application/vnd.acucobol": { source: "iana", extensions: ["acu"] },
  "application/vnd.acucorp": { source: "iana", extensions: ["atc", "acutc"] },
  "application/vnd.adobe.air-application-installer-package+zip": { source: "apache", compressible: !1, extensions: ["air"] },
  "application/vnd.adobe.flash.movie": { source: "iana" },
  "application/vnd.adobe.formscentral.fcdt": { source: "iana", extensions: ["fcdt"] },
  "application/vnd.adobe.fxp": { source: "iana", extensions: ["fxp", "fxpl"] },
  "application/vnd.adobe.partial-upload": { source: "iana" },
  "application/vnd.adobe.xdp+xml": { source: "iana", compressible: !0, extensions: ["xdp"] },
  "application/vnd.adobe.xfdf": { source: "iana", extensions: ["xfdf"] },
  "application/vnd.aether.imp": { source: "iana" },
  "application/vnd.afpc.afplinedata": { source: "iana" },
  "application/vnd.afpc.afplinedata-pagedef": { source: "iana" },
  "application/vnd.afpc.cmoca-cmresource": { source: "iana" },
  "application/vnd.afpc.foca-charset": { source: "iana" },
  "application/vnd.afpc.foca-codedfont": { source: "iana" },
  "application/vnd.afpc.foca-codepage": { source: "iana" },
  "application/vnd.afpc.modca": { source: "iana" },
  "application/vnd.afpc.modca-cmtable": { source: "iana" },
  "application/vnd.afpc.modca-formdef": { source: "iana" },
  "application/vnd.afpc.modca-mediummap": { source: "iana" },
  "application/vnd.afpc.modca-objectcontainer": { source: "iana" },
  "application/vnd.afpc.modca-overlay": { source: "iana" },
  "application/vnd.afpc.modca-pagesegment": { source: "iana" },
  "application/vnd.age": { source: "iana", extensions: ["age"] },
  "application/vnd.ah-barcode": { source: "iana" },
  "application/vnd.ahead.space": { source: "iana", extensions: ["ahead"] },
  "application/vnd.airzip.filesecure.azf": { source: "iana", extensions: ["azf"] },
  "application/vnd.airzip.filesecure.azs": { source: "iana", extensions: ["azs"] },
  "application/vnd.amadeus+json": { source: "iana", compressible: !0 },
  "application/vnd.amazon.ebook": { source: "apache", extensions: ["azw"] },
  "application/vnd.amazon.mobi8-ebook": { source: "iana" },
  "application/vnd.americandynamics.acc": { source: "iana", extensions: ["acc"] },
  "application/vnd.amiga.ami": { source: "iana", extensions: ["ami"] },
  "application/vnd.amundsen.maze+xml": { source: "iana", compressible: !0 },
  "application/vnd.android.ota": { source: "iana" },
  "application/vnd.android.package-archive": { source: "apache", compressible: !1, extensions: ["apk"] },
  "application/vnd.anki": { source: "iana" },
  "application/vnd.anser-web-certificate-issue-initiation": { source: "iana", extensions: ["cii"] },
  "application/vnd.anser-web-funds-transfer-initiation": { source: "apache", extensions: ["fti"] },
  "application/vnd.antix.game-component": { source: "iana", extensions: ["atx"] },
  "application/vnd.apache.arrow.file": { source: "iana" },
  "application/vnd.apache.arrow.stream": { source: "iana" },
  "application/vnd.apache.thrift.binary": { source: "iana" },
  "application/vnd.apache.thrift.compact": { source: "iana" },
  "application/vnd.apache.thrift.json": { source: "iana" },
  "application/vnd.api+json": { source: "iana", compressible: !0 },
  "application/vnd.aplextor.warrp+json": { source: "iana", compressible: !0 },
  "application/vnd.apothekende.reservation+json": { source: "iana", compressible: !0 },
  "application/vnd.apple.installer+xml": { source: "iana", compressible: !0, extensions: ["mpkg"] },
  "application/vnd.apple.keynote": { source: "iana", extensions: ["key"] },
  "application/vnd.apple.mpegurl": { source: "iana", extensions: ["m3u8"] },
  "application/vnd.apple.numbers": { source: "iana", extensions: ["numbers"] },
  "application/vnd.apple.pages": { source: "iana", extensions: ["pages"] },
  "application/vnd.apple.pkpass": { compressible: !1, extensions: ["pkpass"] },
  "application/vnd.arastra.swi": { source: "iana" },
  "application/vnd.aristanetworks.swi": { source: "iana", extensions: ["swi"] },
  "application/vnd.artisan+json": { source: "iana", compressible: !0 },
  "application/vnd.artsquare": { source: "iana" },
  "application/vnd.astraea-software.iota": { source: "iana", extensions: ["iota"] },
  "application/vnd.audiograph": { source: "iana", extensions: ["aep"] },
  "application/vnd.autopackage": { source: "iana" },
  "application/vnd.avalon+json": { source: "iana", compressible: !0 },
  "application/vnd.avistar+xml": { source: "iana", compressible: !0 },
  "application/vnd.balsamiq.bmml+xml": { source: "iana", compressible: !0, extensions: ["bmml"] },
  "application/vnd.balsamiq.bmpr": { source: "iana" },
  "application/vnd.banana-accounting": { source: "iana" },
  "application/vnd.bbf.usp.error": { source: "iana" },
  "application/vnd.bbf.usp.msg": { source: "iana" },
  "application/vnd.bbf.usp.msg+json": { source: "iana", compressible: !0 },
  "application/vnd.bekitzur-stech+json": { source: "iana", compressible: !0 },
  "application/vnd.bint.med-content": { source: "iana" },
  "application/vnd.biopax.rdf+xml": { source: "iana", compressible: !0 },
  "application/vnd.blink-idb-value-wrapper": { source: "iana" },
  "application/vnd.blueice.multipass": { source: "iana", extensions: ["mpm"] },
  "application/vnd.bluetooth.ep.oob": { source: "iana" },
  "application/vnd.bluetooth.le.oob": { source: "iana" },
  "application/vnd.bmi": { source: "iana", extensions: ["bmi"] },
  "application/vnd.bpf": { source: "iana" },
  "application/vnd.bpf3": { source: "iana" },
  "application/vnd.businessobjects": { source: "iana", extensions: ["rep"] },
  "application/vnd.byu.uapi+json": { source: "iana", compressible: !0 },
  "application/vnd.cab-jscript": { source: "iana" },
  "application/vnd.canon-cpdl": { source: "iana" },
  "application/vnd.canon-lips": { source: "iana" },
  "application/vnd.capasystems-pg+json": { source: "iana", compressible: !0 },
  "application/vnd.cendio.thinlinc.clientconf": { source: "iana" },
  "application/vnd.century-systems.tcp_stream": { source: "iana" },
  "application/vnd.chemdraw+xml": { source: "iana", compressible: !0, extensions: ["cdxml"] },
  "application/vnd.chess-pgn": { source: "iana" },
  "application/vnd.chipnuts.karaoke-mmd": { source: "iana", extensions: ["mmd"] },
  "application/vnd.ciedi": { source: "iana" },
  "application/vnd.cinderella": { source: "iana", extensions: ["cdy"] },
  "application/vnd.cirpack.isdn-ext": { source: "iana" },
  "application/vnd.citationstyles.style+xml": { source: "iana", compressible: !0, extensions: ["csl"] },
  "application/vnd.claymore": { source: "iana", extensions: ["cla"] },
  "application/vnd.cloanto.rp9": { source: "iana", extensions: ["rp9"] },
  "application/vnd.clonk.c4group": { source: "iana", extensions: ["c4g", "c4d", "c4f", "c4p", "c4u"] },
  "application/vnd.cluetrust.cartomobile-config": { source: "iana", extensions: ["c11amc"] },
  "application/vnd.cluetrust.cartomobile-config-pkg": { source: "iana", extensions: ["c11amz"] },
  "application/vnd.coffeescript": { source: "iana" },
  "application/vnd.collabio.xodocuments.document": { source: "iana" },
  "application/vnd.collabio.xodocuments.document-template": { source: "iana" },
  "application/vnd.collabio.xodocuments.presentation": { source: "iana" },
  "application/vnd.collabio.xodocuments.presentation-template": { source: "iana" },
  "application/vnd.collabio.xodocuments.spreadsheet": { source: "iana" },
  "application/vnd.collabio.xodocuments.spreadsheet-template": { source: "iana" },
  "application/vnd.collection+json": { source: "iana", compressible: !0 },
  "application/vnd.collection.doc+json": { source: "iana", compressible: !0 },
  "application/vnd.collection.next+json": { source: "iana", compressible: !0 },
  "application/vnd.comicbook+zip": { source: "iana", compressible: !1 },
  "application/vnd.comicbook-rar": { source: "iana" },
  "application/vnd.commerce-battelle": { source: "iana" },
  "application/vnd.commonspace": { source: "iana", extensions: ["csp"] },
  "application/vnd.contact.cmsg": { source: "iana", extensions: ["cdbcmsg"] },
  "application/vnd.coreos.ignition+json": { source: "iana", compressible: !0 },
  "application/vnd.cosmocaller": { source: "iana", extensions: ["cmc"] },
  "application/vnd.crick.clicker": { source: "iana", extensions: ["clkx"] },
  "application/vnd.crick.clicker.keyboard": { source: "iana", extensions: ["clkk"] },
  "application/vnd.crick.clicker.palette": { source: "iana", extensions: ["clkp"] },
  "application/vnd.crick.clicker.template": { source: "iana", extensions: ["clkt"] },
  "application/vnd.crick.clicker.wordbank": { source: "iana", extensions: ["clkw"] },
  "application/vnd.criticaltools.wbs+xml": { source: "iana", compressible: !0, extensions: ["wbs"] },
  "application/vnd.cryptii.pipe+json": { source: "iana", compressible: !0 },
  "application/vnd.crypto-shade-file": { source: "iana" },
  "application/vnd.cryptomator.encrypted": { source: "iana" },
  "application/vnd.cryptomator.vault": { source: "iana" },
  "application/vnd.ctc-posml": { source: "iana", extensions: ["pml"] },
  "application/vnd.ctct.ws+xml": { source: "iana", compressible: !0 },
  "application/vnd.cups-pdf": { source: "iana" },
  "application/vnd.cups-postscript": { source: "iana" },
  "application/vnd.cups-ppd": { source: "iana", extensions: ["ppd"] },
  "application/vnd.cups-raster": { source: "iana" },
  "application/vnd.cups-raw": { source: "iana" },
  "application/vnd.curl": { source: "iana" },
  "application/vnd.curl.car": { source: "apache", extensions: ["car"] },
  "application/vnd.curl.pcurl": { source: "apache", extensions: ["pcurl"] },
  "application/vnd.cyan.dean.root+xml": { source: "iana", compressible: !0 },
  "application/vnd.cybank": { source: "iana" },
  "application/vnd.cyclonedx+json": { source: "iana", compressible: !0 },
  "application/vnd.cyclonedx+xml": { source: "iana", compressible: !0 },
  "application/vnd.d2l.coursepackage1p0+zip": { source: "iana", compressible: !1 },
  "application/vnd.d3m-dataset": { source: "iana" },
  "application/vnd.d3m-problem": { source: "iana" },
  "application/vnd.dart": { source: "iana", compressible: !0, extensions: ["dart"] },
  "application/vnd.data-vision.rdz": { source: "iana", extensions: ["rdz"] },
  "application/vnd.datapackage+json": { source: "iana", compressible: !0 },
  "application/vnd.dataresource+json": { source: "iana", compressible: !0 },
  "application/vnd.dbf": { source: "iana", extensions: ["dbf"] },
  "application/vnd.debian.binary-package": { source: "iana" },
  "application/vnd.dece.data": { source: "iana", extensions: ["uvf", "uvvf", "uvd", "uvvd"] },
  "application/vnd.dece.ttml+xml": { source: "iana", compressible: !0, extensions: ["uvt", "uvvt"] },
  "application/vnd.dece.unspecified": { source: "iana", extensions: ["uvx", "uvvx"] },
  "application/vnd.dece.zip": { source: "iana", extensions: ["uvz", "uvvz"] },
  "application/vnd.denovo.fcselayout-link": { source: "iana", extensions: ["fe_launch"] },
  "application/vnd.desmume.movie": { source: "iana" },
  "application/vnd.dir-bi.plate-dl-nosuffix": { source: "iana" },
  "application/vnd.dm.delegation+xml": { source: "iana", compressible: !0 },
  "application/vnd.dna": { source: "iana", extensions: ["dna"] },
  "application/vnd.document+json": { source: "iana", compressible: !0 },
  "application/vnd.dolby.mlp": { source: "apache", extensions: ["mlp"] },
  "application/vnd.dolby.mobile.1": { source: "iana" },
  "application/vnd.dolby.mobile.2": { source: "iana" },
  "application/vnd.doremir.scorecloud-binary-document": { source: "iana" },
  "application/vnd.dpgraph": { source: "iana", extensions: ["dpg"] },
  "application/vnd.dreamfactory": { source: "iana", extensions: ["dfac"] },
  "application/vnd.drive+json": { source: "iana", compressible: !0 },
  "application/vnd.ds-keypoint": { source: "apache", extensions: ["kpxx"] },
  "application/vnd.dtg.local": { source: "iana" },
  "application/vnd.dtg.local.flash": { source: "iana" },
  "application/vnd.dtg.local.html": { source: "iana" },
  "application/vnd.dvb.ait": { source: "iana", extensions: ["ait"] },
  "application/vnd.dvb.dvbisl+xml": { source: "iana", compressible: !0 },
  "application/vnd.dvb.dvbj": { source: "iana" },
  "application/vnd.dvb.esgcontainer": { source: "iana" },
  "application/vnd.dvb.ipdcdftnotifaccess": { source: "iana" },
  "application/vnd.dvb.ipdcesgaccess": { source: "iana" },
  "application/vnd.dvb.ipdcesgaccess2": { source: "iana" },
  "application/vnd.dvb.ipdcesgpdd": { source: "iana" },
  "application/vnd.dvb.ipdcroaming": { source: "iana" },
  "application/vnd.dvb.iptv.alfec-base": { source: "iana" },
  "application/vnd.dvb.iptv.alfec-enhancement": { source: "iana" },
  "application/vnd.dvb.notif-aggregate-root+xml": { source: "iana", compressible: !0 },
  "application/vnd.dvb.notif-container+xml": { source: "iana", compressible: !0 },
  "application/vnd.dvb.notif-generic+xml": { source: "iana", compressible: !0 },
  "application/vnd.dvb.notif-ia-msglist+xml": { source: "iana", compressible: !0 },
  "application/vnd.dvb.notif-ia-registration-request+xml": { source: "iana", compressible: !0 },
  "application/vnd.dvb.notif-ia-registration-response+xml": { source: "iana", compressible: !0 },
  "application/vnd.dvb.notif-init+xml": { source: "iana", compressible: !0 },
  "application/vnd.dvb.pfr": { source: "iana" },
  "application/vnd.dvb.service": { source: "iana", extensions: ["svc"] },
  "application/vnd.dxr": { source: "iana" },
  "application/vnd.dynageo": { source: "iana", extensions: ["geo"] },
  "application/vnd.dzr": { source: "iana" },
  "application/vnd.easykaraoke.cdgdownload": { source: "iana" },
  "application/vnd.ecdis-update": { source: "iana" },
  "application/vnd.ecip.rlp": { source: "iana" },
  "application/vnd.eclipse.ditto+json": { source: "iana", compressible: !0 },
  "application/vnd.ecowin.chart": { source: "iana", extensions: ["mag"] },
  "application/vnd.ecowin.filerequest": { source: "iana" },
  "application/vnd.ecowin.fileupdate": { source: "iana" },
  "application/vnd.ecowin.series": { source: "iana" },
  "application/vnd.ecowin.seriesrequest": { source: "iana" },
  "application/vnd.ecowin.seriesupdate": { source: "iana" },
  "application/vnd.efi.img": { source: "iana" },
  "application/vnd.efi.iso": { source: "iana" },
  "application/vnd.emclient.accessrequest+xml": { source: "iana", compressible: !0 },
  "application/vnd.enliven": { source: "iana", extensions: ["nml"] },
  "application/vnd.enphase.envoy": { source: "iana" },
  "application/vnd.eprints.data+xml": { source: "iana", compressible: !0 },
  "application/vnd.epson.esf": { source: "iana", extensions: ["esf"] },
  "application/vnd.epson.msf": { source: "iana", extensions: ["msf"] },
  "application/vnd.epson.quickanime": { source: "iana", extensions: ["qam"] },
  "application/vnd.epson.salt": { source: "iana", extensions: ["slt"] },
  "application/vnd.epson.ssf": { source: "iana", extensions: ["ssf"] },
  "application/vnd.ericsson.quickcall": { source: "iana" },
  "application/vnd.espass-espass+zip": { source: "iana", compressible: !1 },
  "application/vnd.eszigno3+xml": { source: "iana", compressible: !0, extensions: ["es3", "et3"] },
  "application/vnd.etsi.aoc+xml": { source: "iana", compressible: !0 },
  "application/vnd.etsi.asic-e+zip": { source: "iana", compressible: !1 },
  "application/vnd.etsi.asic-s+zip": { source: "iana", compressible: !1 },
  "application/vnd.etsi.cug+xml": { source: "iana", compressible: !0 },
  "application/vnd.etsi.iptvcommand+xml": { source: "iana", compressible: !0 },
  "application/vnd.etsi.iptvdiscovery+xml": { source: "iana", compressible: !0 },
  "application/vnd.etsi.iptvprofile+xml": { source: "iana", compressible: !0 },
  "application/vnd.etsi.iptvsad-bc+xml": { source: "iana", compressible: !0 },
  "application/vnd.etsi.iptvsad-cod+xml": { source: "iana", compressible: !0 },
  "application/vnd.etsi.iptvsad-npvr+xml": { source: "iana", compressible: !0 },
  "application/vnd.etsi.iptvservice+xml": { source: "iana", compressible: !0 },
  "application/vnd.etsi.iptvsync+xml": { source: "iana", compressible: !0 },
  "application/vnd.etsi.iptvueprofile+xml": { source: "iana", compressible: !0 },
  "application/vnd.etsi.mcid+xml": { source: "iana", compressible: !0 },
  "application/vnd.etsi.mheg5": { source: "iana" },
  "application/vnd.etsi.overload-control-policy-dataset+xml": { source: "iana", compressible: !0 },
  "application/vnd.etsi.pstn+xml": { source: "iana", compressible: !0 },
  "application/vnd.etsi.sci+xml": { source: "iana", compressible: !0 },
  "application/vnd.etsi.simservs+xml": { source: "iana", compressible: !0 },
  "application/vnd.etsi.timestamp-token": { source: "iana" },
  "application/vnd.etsi.tsl+xml": { source: "iana", compressible: !0 },
  "application/vnd.etsi.tsl.der": { source: "iana" },
  "application/vnd.eu.kasparian.car+json": { source: "iana", compressible: !0 },
  "application/vnd.eudora.data": { source: "iana" },
  "application/vnd.evolv.ecig.profile": { source: "iana" },
  "application/vnd.evolv.ecig.settings": { source: "iana" },
  "application/vnd.evolv.ecig.theme": { source: "iana" },
  "application/vnd.exstream-empower+zip": { source: "iana", compressible: !1 },
  "application/vnd.exstream-package": { source: "iana" },
  "application/vnd.ezpix-album": { source: "iana", extensions: ["ez2"] },
  "application/vnd.ezpix-package": { source: "iana", extensions: ["ez3"] },
  "application/vnd.f-secure.mobile": { source: "iana" },
  "application/vnd.familysearch.gedcom+zip": { source: "iana", compressible: !1 },
  "application/vnd.fastcopy-disk-image": { source: "iana" },
  "application/vnd.fdf": { source: "iana", extensions: ["fdf"] },
  "application/vnd.fdsn.mseed": { source: "iana", extensions: ["mseed"] },
  "application/vnd.fdsn.seed": { source: "iana", extensions: ["seed", "dataless"] },
  "application/vnd.ffsns": { source: "iana" },
  "application/vnd.ficlab.flb+zip": { source: "iana", compressible: !1 },
  "application/vnd.filmit.zfc": { source: "iana" },
  "application/vnd.fints": { source: "iana" },
  "application/vnd.firemonkeys.cloudcell": { source: "iana" },
  "application/vnd.flographit": { source: "iana", extensions: ["gph"] },
  "application/vnd.fluxtime.clip": { source: "iana", extensions: ["ftc"] },
  "application/vnd.font-fontforge-sfd": { source: "iana" },
  "application/vnd.framemaker": { source: "iana", extensions: ["fm", "frame", "maker", "book"] },
  "application/vnd.frogans.fnc": { source: "iana", extensions: ["fnc"] },
  "application/vnd.frogans.ltf": { source: "iana", extensions: ["ltf"] },
  "application/vnd.fsc.weblaunch": { source: "iana", extensions: ["fsc"] },
  "application/vnd.fujifilm.fb.docuworks": { source: "iana" },
  "application/vnd.fujifilm.fb.docuworks.binder": { source: "iana" },
  "application/vnd.fujifilm.fb.docuworks.container": { source: "iana" },
  "application/vnd.fujifilm.fb.jfi+xml": { source: "iana", compressible: !0 },
  "application/vnd.fujitsu.oasys": { source: "iana", extensions: ["oas"] },
  "application/vnd.fujitsu.oasys2": { source: "iana", extensions: ["oa2"] },
  "application/vnd.fujitsu.oasys3": { source: "iana", extensions: ["oa3"] },
  "application/vnd.fujitsu.oasysgp": { source: "iana", extensions: ["fg5"] },
  "application/vnd.fujitsu.oasysprs": { source: "iana", extensions: ["bh2"] },
  "application/vnd.fujixerox.art-ex": { source: "iana" },
  "application/vnd.fujixerox.art4": { source: "iana" },
  "application/vnd.fujixerox.ddd": { source: "iana", extensions: ["ddd"] },
  "application/vnd.fujixerox.docuworks": { source: "iana", extensions: ["xdw"] },
  "application/vnd.fujixerox.docuworks.binder": { source: "iana", extensions: ["xbd"] },
  "application/vnd.fujixerox.docuworks.container": { source: "iana" },
  "application/vnd.fujixerox.hbpl": { source: "iana" },
  "application/vnd.fut-misnet": { source: "iana" },
  "application/vnd.futoin+cbor": { source: "iana" },
  "application/vnd.futoin+json": { source: "iana", compressible: !0 },
  "application/vnd.fuzzysheet": { source: "iana", extensions: ["fzs"] },
  "application/vnd.genomatix.tuxedo": { source: "iana", extensions: ["txd"] },
  "application/vnd.gentics.grd+json": { source: "iana", compressible: !0 },
  "application/vnd.geo+json": { source: "iana", compressible: !0 },
  "application/vnd.geocube+xml": { source: "iana", compressible: !0 },
  "application/vnd.geogebra.file": { source: "iana", extensions: ["ggb"] },
  "application/vnd.geogebra.slides": { source: "iana" },
  "application/vnd.geogebra.tool": { source: "iana", extensions: ["ggt"] },
  "application/vnd.geometry-explorer": { source: "iana", extensions: ["gex", "gre"] },
  "application/vnd.geonext": { source: "iana", extensions: ["gxt"] },
  "application/vnd.geoplan": { source: "iana", extensions: ["g2w"] },
  "application/vnd.geospace": { source: "iana", extensions: ["g3w"] },
  "application/vnd.gerber": { source: "iana" },
  "application/vnd.globalplatform.card-content-mgt": { source: "iana" },
  "application/vnd.globalplatform.card-content-mgt-response": { source: "iana" },
  "application/vnd.gmx": { source: "iana", extensions: ["gmx"] },
  "application/vnd.google-apps.document": { compressible: !1, extensions: ["gdoc"] },
  "application/vnd.google-apps.presentation": { compressible: !1, extensions: ["gslides"] },
  "application/vnd.google-apps.spreadsheet": { compressible: !1, extensions: ["gsheet"] },
  "application/vnd.google-earth.kml+xml": { source: "iana", compressible: !0, extensions: ["kml"] },
  "application/vnd.google-earth.kmz": { source: "iana", compressible: !1, extensions: ["kmz"] },
  "application/vnd.gov.sk.e-form+xml": { source: "iana", compressible: !0 },
  "application/vnd.gov.sk.e-form+zip": { source: "iana", compressible: !1 },
  "application/vnd.gov.sk.xmldatacontainer+xml": { source: "iana", compressible: !0 },
  "application/vnd.grafeq": { source: "iana", extensions: ["gqf", "gqs"] },
  "application/vnd.gridmp": { source: "iana" },
  "application/vnd.groove-account": { source: "iana", extensions: ["gac"] },
  "application/vnd.groove-help": { source: "iana", extensions: ["ghf"] },
  "application/vnd.groove-identity-message": { source: "iana", extensions: ["gim"] },
  "application/vnd.groove-injector": { source: "iana", extensions: ["grv"] },
  "application/vnd.groove-tool-message": { source: "iana", extensions: ["gtm"] },
  "application/vnd.groove-tool-template": { source: "iana", extensions: ["tpl"] },
  "application/vnd.groove-vcard": { source: "iana", extensions: ["vcg"] },
  "application/vnd.hal+json": { source: "iana", compressible: !0 },
  "application/vnd.hal+xml": { source: "iana", compressible: !0, extensions: ["hal"] },
  "application/vnd.handheld-entertainment+xml": { source: "iana", compressible: !0, extensions: ["zmm"] },
  "application/vnd.hbci": { source: "iana", extensions: ["hbci"] },
  "application/vnd.hc+json": { source: "iana", compressible: !0 },
  "application/vnd.hcl-bireports": { source: "iana" },
  "application/vnd.hdt": { source: "iana" },
  "application/vnd.heroku+json": { source: "iana", compressible: !0 },
  "application/vnd.hhe.lesson-player": { source: "iana", extensions: ["les"] },
  "application/vnd.hl7cda+xml": { source: "iana", charset: "UTF-8", compressible: !0 },
  "application/vnd.hl7v2+xml": { source: "iana", charset: "UTF-8", compressible: !0 },
  "application/vnd.hp-hpgl": { source: "iana", extensions: ["hpgl"] },
  "application/vnd.hp-hpid": { source: "iana", extensions: ["hpid"] },
  "application/vnd.hp-hps": { source: "iana", extensions: ["hps"] },
  "application/vnd.hp-jlyt": { source: "iana", extensions: ["jlt"] },
  "application/vnd.hp-pcl": { source: "iana", extensions: ["pcl"] },
  "application/vnd.hp-pclxl": { source: "iana", extensions: ["pclxl"] },
  "application/vnd.httphone": { source: "iana" },
  "application/vnd.hydrostatix.sof-data": { source: "iana", extensions: ["sfd-hdstx"] },
  "application/vnd.hyper+json": { source: "iana", compressible: !0 },
  "application/vnd.hyper-item+json": { source: "iana", compressible: !0 },
  "application/vnd.hyperdrive+json": { source: "iana", compressible: !0 },
  "application/vnd.hzn-3d-crossword": { source: "iana" },
  "application/vnd.ibm.afplinedata": { source: "iana" },
  "application/vnd.ibm.electronic-media": { source: "iana" },
  "application/vnd.ibm.minipay": { source: "iana", extensions: ["mpy"] },
  "application/vnd.ibm.modcap": { source: "iana", extensions: ["afp", "listafp", "list3820"] },
  "application/vnd.ibm.rights-management": { source: "iana", extensions: ["irm"] },
  "application/vnd.ibm.secure-container": { source: "iana", extensions: ["sc"] },
  "application/vnd.iccprofile": { source: "iana", extensions: ["icc", "icm"] },
  "application/vnd.ieee.1905": { source: "iana" },
  "application/vnd.igloader": { source: "iana", extensions: ["igl"] },
  "application/vnd.imagemeter.folder+zip": { source: "iana", compressible: !1 },
  "application/vnd.imagemeter.image+zip": { source: "iana", compressible: !1 },
  "application/vnd.immervision-ivp": { source: "iana", extensions: ["ivp"] },
  "application/vnd.immervision-ivu": { source: "iana", extensions: ["ivu"] },
  "application/vnd.ims.imsccv1p1": { source: "iana" },
  "application/vnd.ims.imsccv1p2": { source: "iana" },
  "application/vnd.ims.imsccv1p3": { source: "iana" },
  "application/vnd.ims.lis.v2.result+json": { source: "iana", compressible: !0 },
  "application/vnd.ims.lti.v2.toolconsumerprofile+json": { source: "iana", compressible: !0 },
  "application/vnd.ims.lti.v2.toolproxy+json": { source: "iana", compressible: !0 },
  "application/vnd.ims.lti.v2.toolproxy.id+json": { source: "iana", compressible: !0 },
  "application/vnd.ims.lti.v2.toolsettings+json": { source: "iana", compressible: !0 },
  "application/vnd.ims.lti.v2.toolsettings.simple+json": { source: "iana", compressible: !0 },
  "application/vnd.informedcontrol.rms+xml": { source: "iana", compressible: !0 },
  "application/vnd.informix-visionary": { source: "iana" },
  "application/vnd.infotech.project": { source: "iana" },
  "application/vnd.infotech.project+xml": { source: "iana", compressible: !0 },
  "application/vnd.innopath.wamp.notification": { source: "iana" },
  "application/vnd.insors.igm": { source: "iana", extensions: ["igm"] },
  "application/vnd.intercon.formnet": { source: "iana", extensions: ["xpw", "xpx"] },
  "application/vnd.intergeo": { source: "iana", extensions: ["i2g"] },
  "application/vnd.intertrust.digibox": { source: "iana" },
  "application/vnd.intertrust.nncp": { source: "iana" },
  "application/vnd.intu.qbo": { source: "iana", extensions: ["qbo"] },
  "application/vnd.intu.qfx": { source: "iana", extensions: ["qfx"] },
  "application/vnd.iptc.g2.catalogitem+xml": { source: "iana", compressible: !0 },
  "application/vnd.iptc.g2.conceptitem+xml": { source: "iana", compressible: !0 },
  "application/vnd.iptc.g2.knowledgeitem+xml": { source: "iana", compressible: !0 },
  "application/vnd.iptc.g2.newsitem+xml": { source: "iana", compressible: !0 },
  "application/vnd.iptc.g2.newsmessage+xml": { source: "iana", compressible: !0 },
  "application/vnd.iptc.g2.packageitem+xml": { source: "iana", compressible: !0 },
  "application/vnd.iptc.g2.planningitem+xml": { source: "iana", compressible: !0 },
  "application/vnd.ipunplugged.rcprofile": { source: "iana", extensions: ["rcprofile"] },
  "application/vnd.irepository.package+xml": { source: "iana", compressible: !0, extensions: ["irp"] },
  "application/vnd.is-xpr": { source: "iana", extensions: ["xpr"] },
  "application/vnd.isac.fcs": { source: "iana", extensions: ["fcs"] },
  "application/vnd.iso11783-10+zip": { source: "iana", compressible: !1 },
  "application/vnd.jam": { source: "iana", extensions: ["jam"] },
  "application/vnd.japannet-directory-service": { source: "iana" },
  "application/vnd.japannet-jpnstore-wakeup": { source: "iana" },
  "application/vnd.japannet-payment-wakeup": { source: "iana" },
  "application/vnd.japannet-registration": { source: "iana" },
  "application/vnd.japannet-registration-wakeup": { source: "iana" },
  "application/vnd.japannet-setstore-wakeup": { source: "iana" },
  "application/vnd.japannet-verification": { source: "iana" },
  "application/vnd.japannet-verification-wakeup": { source: "iana" },
  "application/vnd.jcp.javame.midlet-rms": { source: "iana", extensions: ["rms"] },
  "application/vnd.jisp": { source: "iana", extensions: ["jisp"] },
  "application/vnd.joost.joda-archive": { source: "iana", extensions: ["joda"] },
  "application/vnd.jsk.isdn-ngn": { source: "iana" },
  "application/vnd.kahootz": { source: "iana", extensions: ["ktz", "ktr"] },
  "application/vnd.kde.karbon": { source: "iana", extensions: ["karbon"] },
  "application/vnd.kde.kchart": { source: "iana", extensions: ["chrt"] },
  "application/vnd.kde.kformula": { source: "iana", extensions: ["kfo"] },
  "application/vnd.kde.kivio": { source: "iana", extensions: ["flw"] },
  "application/vnd.kde.kontour": { source: "iana", extensions: ["kon"] },
  "application/vnd.kde.kpresenter": { source: "iana", extensions: ["kpr", "kpt"] },
  "application/vnd.kde.kspread": { source: "iana", extensions: ["ksp"] },
  "application/vnd.kde.kword": { source: "iana", extensions: ["kwd", "kwt"] },
  "application/vnd.kenameaapp": { source: "iana", extensions: ["htke"] },
  "application/vnd.kidspiration": { source: "iana", extensions: ["kia"] },
  "application/vnd.kinar": { source: "iana", extensions: ["kne", "knp"] },
  "application/vnd.koan": { source: "iana", extensions: ["skp", "skd", "skt", "skm"] },
  "application/vnd.kodak-descriptor": { source: "iana", extensions: ["sse"] },
  "application/vnd.las": { source: "iana" },
  "application/vnd.las.las+json": { source: "iana", compressible: !0 },
  "application/vnd.las.las+xml": { source: "iana", compressible: !0, extensions: ["lasxml"] },
  "application/vnd.laszip": { source: "iana" },
  "application/vnd.leap+json": { source: "iana", compressible: !0 },
  "application/vnd.liberty-request+xml": { source: "iana", compressible: !0 },
  "application/vnd.llamagraphics.life-balance.desktop": { source: "iana", extensions: ["lbd"] },
  "application/vnd.llamagraphics.life-balance.exchange+xml": { source: "iana", compressible: !0, extensions: ["lbe"] },
  "application/vnd.logipipe.circuit+zip": { source: "iana", compressible: !1 },
  "application/vnd.loom": { source: "iana" },
  "application/vnd.lotus-1-2-3": { source: "iana", extensions: ["123"] },
  "application/vnd.lotus-approach": { source: "iana", extensions: ["apr"] },
  "application/vnd.lotus-freelance": { source: "iana", extensions: ["pre"] },
  "application/vnd.lotus-notes": { source: "iana", extensions: ["nsf"] },
  "application/vnd.lotus-organizer": { source: "iana", extensions: ["org"] },
  "application/vnd.lotus-screencam": { source: "iana", extensions: ["scm"] },
  "application/vnd.lotus-wordpro": { source: "iana", extensions: ["lwp"] },
  "application/vnd.macports.portpkg": { source: "iana", extensions: ["portpkg"] },
  "application/vnd.mapbox-vector-tile": { source: "iana", extensions: ["mvt"] },
  "application/vnd.marlin.drm.actiontoken+xml": { source: "iana", compressible: !0 },
  "application/vnd.marlin.drm.conftoken+xml": { source: "iana", compressible: !0 },
  "application/vnd.marlin.drm.license+xml": { source: "iana", compressible: !0 },
  "application/vnd.marlin.drm.mdcf": { source: "iana" },
  "application/vnd.mason+json": { source: "iana", compressible: !0 },
  "application/vnd.maxar.archive.3tz+zip": { source: "iana", compressible: !1 },
  "application/vnd.maxmind.maxmind-db": { source: "iana" },
  "application/vnd.mcd": { source: "iana", extensions: ["mcd"] },
  "application/vnd.medcalcdata": { source: "iana", extensions: ["mc1"] },
  "application/vnd.mediastation.cdkey": { source: "iana", extensions: ["cdkey"] },
  "application/vnd.meridian-slingshot": { source: "iana" },
  "application/vnd.mfer": { source: "iana", extensions: ["mwf"] },
  "application/vnd.mfmp": { source: "iana", extensions: ["mfm"] },
  "application/vnd.micro+json": { source: "iana", compressible: !0 },
  "application/vnd.micrografx.flo": { source: "iana", extensions: ["flo"] },
  "application/vnd.micrografx.igx": { source: "iana", extensions: ["igx"] },
  "application/vnd.microsoft.portable-executable": { source: "iana" },
  "application/vnd.microsoft.windows.thumbnail-cache": { source: "iana" },
  "application/vnd.miele+json": { source: "iana", compressible: !0 },
  "application/vnd.mif": { source: "iana", extensions: ["mif"] },
  "application/vnd.minisoft-hp3000-save": { source: "iana" },
  "application/vnd.mitsubishi.misty-guard.trustweb": { source: "iana" },
  "application/vnd.mobius.daf": { source: "iana", extensions: ["daf"] },
  "application/vnd.mobius.dis": { source: "iana", extensions: ["dis"] },
  "application/vnd.mobius.mbk": { source: "iana", extensions: ["mbk"] },
  "application/vnd.mobius.mqy": { source: "iana", extensions: ["mqy"] },
  "application/vnd.mobius.msl": { source: "iana", extensions: ["msl"] },
  "application/vnd.mobius.plc": { source: "iana", extensions: ["plc"] },
  "application/vnd.mobius.txf": { source: "iana", extensions: ["txf"] },
  "application/vnd.mophun.application": { source: "iana", extensions: ["mpn"] },
  "application/vnd.mophun.certificate": { source: "iana", extensions: ["mpc"] },
  "application/vnd.motorola.flexsuite": { source: "iana" },
  "application/vnd.motorola.flexsuite.adsi": { source: "iana" },
  "application/vnd.motorola.flexsuite.fis": { source: "iana" },
  "application/vnd.motorola.flexsuite.gotap": { source: "iana" },
  "application/vnd.motorola.flexsuite.kmr": { source: "iana" },
  "application/vnd.motorola.flexsuite.ttc": { source: "iana" },
  "application/vnd.motorola.flexsuite.wem": { source: "iana" },
  "application/vnd.motorola.iprm": { source: "iana" },
  "application/vnd.mozilla.xul+xml": { source: "iana", compressible: !0, extensions: ["xul"] },
  "application/vnd.ms-3mfdocument": { source: "iana" },
  "application/vnd.ms-artgalry": { source: "iana", extensions: ["cil"] },
  "application/vnd.ms-asf": { source: "iana" },
  "application/vnd.ms-cab-compressed": { source: "iana", extensions: ["cab"] },
  "application/vnd.ms-color.iccprofile": { source: "apache" },
  "application/vnd.ms-excel": { source: "iana", compressible: !1, extensions: ["xls", "xlm", "xla", "xlc", "xlt", "xlw"] },
  "application/vnd.ms-excel.addin.macroenabled.12": { source: "iana", extensions: ["xlam"] },
  "application/vnd.ms-excel.sheet.binary.macroenabled.12": { source: "iana", extensions: ["xlsb"] },
  "application/vnd.ms-excel.sheet.macroenabled.12": { source: "iana", extensions: ["xlsm"] },
  "application/vnd.ms-excel.template.macroenabled.12": { source: "iana", extensions: ["xltm"] },
  "application/vnd.ms-fontobject": { source: "iana", compressible: !0, extensions: ["eot"] },
  "application/vnd.ms-htmlhelp": { source: "iana", extensions: ["chm"] },
  "application/vnd.ms-ims": { source: "iana", extensions: ["ims"] },
  "application/vnd.ms-lrm": { source: "iana", extensions: ["lrm"] },
  "application/vnd.ms-office.activex+xml": { source: "iana", compressible: !0 },
  "application/vnd.ms-officetheme": { source: "iana", extensions: ["thmx"] },
  "application/vnd.ms-opentype": { source: "apache", compressible: !0 },
  "application/vnd.ms-outlook": { compressible: !1, extensions: ["msg"] },
  "application/vnd.ms-package.obfuscated-opentype": { source: "apache" },
  "application/vnd.ms-pki.seccat": { source: "apache", extensions: ["cat"] },
  "application/vnd.ms-pki.stl": { source: "apache", extensions: ["stl"] },
  "application/vnd.ms-playready.initiator+xml": { source: "iana", compressible: !0 },
  "application/vnd.ms-powerpoint": { source: "iana", compressible: !1, extensions: ["ppt", "pps", "pot"] },
  "application/vnd.ms-powerpoint.addin.macroenabled.12": { source: "iana", extensions: ["ppam"] },
  "application/vnd.ms-powerpoint.presentation.macroenabled.12": { source: "iana", extensions: ["pptm"] },
  "application/vnd.ms-powerpoint.slide.macroenabled.12": { source: "iana", extensions: ["sldm"] },
  "application/vnd.ms-powerpoint.slideshow.macroenabled.12": { source: "iana", extensions: ["ppsm"] },
  "application/vnd.ms-powerpoint.template.macroenabled.12": { source: "iana", extensions: ["potm"] },
  "application/vnd.ms-printdevicecapabilities+xml": { source: "iana", compressible: !0 },
  "application/vnd.ms-printing.printticket+xml": { source: "apache", compressible: !0 },
  "application/vnd.ms-printschematicket+xml": { source: "iana", compressible: !0 },
  "application/vnd.ms-project": { source: "iana", extensions: ["mpp", "mpt"] },
  "application/vnd.ms-tnef": { source: "iana" },
  "application/vnd.ms-windows.devicepairing": { source: "iana" },
  "application/vnd.ms-windows.nwprinting.oob": { source: "iana" },
  "application/vnd.ms-windows.printerpairing": { source: "iana" },
  "application/vnd.ms-windows.wsd.oob": { source: "iana" },
  "application/vnd.ms-wmdrm.lic-chlg-req": { source: "iana" },
  "application/vnd.ms-wmdrm.lic-resp": { source: "iana" },
  "application/vnd.ms-wmdrm.meter-chlg-req": { source: "iana" },
  "application/vnd.ms-wmdrm.meter-resp": { source: "iana" },
  "application/vnd.ms-word.document.macroenabled.12": { source: "iana", extensions: ["docm"] },
  "application/vnd.ms-word.template.macroenabled.12": { source: "iana", extensions: ["dotm"] },
  "application/vnd.ms-works": { source: "iana", extensions: ["wps", "wks", "wcm", "wdb"] },
  "application/vnd.ms-wpl": { source: "iana", extensions: ["wpl"] },
  "application/vnd.ms-xpsdocument": { source: "iana", compressible: !1, extensions: ["xps"] },
  "application/vnd.msa-disk-image": { source: "iana" },
  "application/vnd.mseq": { source: "iana", extensions: ["mseq"] },
  "application/vnd.msign": { source: "iana" },
  "application/vnd.multiad.creator": { source: "iana" },
  "application/vnd.multiad.creator.cif": { source: "iana" },
  "application/vnd.music-niff": { source: "iana" },
  "application/vnd.musician": { source: "iana", extensions: ["mus"] },
  "application/vnd.muvee.style": { source: "iana", extensions: ["msty"] },
  "application/vnd.mynfc": { source: "iana", extensions: ["taglet"] },
  "application/vnd.nacamar.ybrid+json": { source: "iana", compressible: !0 },
  "application/vnd.ncd.control": { source: "iana" },
  "application/vnd.ncd.reference": { source: "iana" },
  "application/vnd.nearst.inv+json": { source: "iana", compressible: !0 },
  "application/vnd.nebumind.line": { source: "iana" },
  "application/vnd.nervana": { source: "iana" },
  "application/vnd.netfpx": { source: "iana" },
  "application/vnd.neurolanguage.nlu": { source: "iana", extensions: ["nlu"] },
  "application/vnd.nimn": { source: "iana" },
  "application/vnd.nintendo.nitro.rom": { source: "iana" },
  "application/vnd.nintendo.snes.rom": { source: "iana" },
  "application/vnd.nitf": { source: "iana", extensions: ["ntf", "nitf"] },
  "application/vnd.noblenet-directory": { source: "iana", extensions: ["nnd"] },
  "application/vnd.noblenet-sealer": { source: "iana", extensions: ["nns"] },
  "application/vnd.noblenet-web": { source: "iana", extensions: ["nnw"] },
  "application/vnd.nokia.catalogs": { source: "iana" },
  "application/vnd.nokia.conml+wbxml": { source: "iana" },
  "application/vnd.nokia.conml+xml": { source: "iana", compressible: !0 },
  "application/vnd.nokia.iptv.config+xml": { source: "iana", compressible: !0 },
  "application/vnd.nokia.isds-radio-presets": { source: "iana" },
  "application/vnd.nokia.landmark+wbxml": { source: "iana" },
  "application/vnd.nokia.landmark+xml": { source: "iana", compressible: !0 },
  "application/vnd.nokia.landmarkcollection+xml": { source: "iana", compressible: !0 },
  "application/vnd.nokia.n-gage.ac+xml": { source: "iana", compressible: !0, extensions: ["ac"] },
  "application/vnd.nokia.n-gage.data": { source: "iana", extensions: ["ngdat"] },
  "application/vnd.nokia.n-gage.symbian.install": { source: "iana", extensions: ["n-gage"] },
  "application/vnd.nokia.ncd": { source: "iana" },
  "application/vnd.nokia.pcd+wbxml": { source: "iana" },
  "application/vnd.nokia.pcd+xml": { source: "iana", compressible: !0 },
  "application/vnd.nokia.radio-preset": { source: "iana", extensions: ["rpst"] },
  "application/vnd.nokia.radio-presets": { source: "iana", extensions: ["rpss"] },
  "application/vnd.novadigm.edm": { source: "iana", extensions: ["edm"] },
  "application/vnd.novadigm.edx": { source: "iana", extensions: ["edx"] },
  "application/vnd.novadigm.ext": { source: "iana", extensions: ["ext"] },
  "application/vnd.ntt-local.content-share": { source: "iana" },
  "application/vnd.ntt-local.file-transfer": { source: "iana" },
  "application/vnd.ntt-local.ogw_remote-access": { source: "iana" },
  "application/vnd.ntt-local.sip-ta_remote": { source: "iana" },
  "application/vnd.ntt-local.sip-ta_tcp_stream": { source: "iana" },
  "application/vnd.oasis.opendocument.chart": { source: "iana", extensions: ["odc"] },
  "application/vnd.oasis.opendocument.chart-template": { source: "iana", extensions: ["otc"] },
  "application/vnd.oasis.opendocument.database": { source: "iana", extensions: ["odb"] },
  "application/vnd.oasis.opendocument.formula": { source: "iana", extensions: ["odf"] },
  "application/vnd.oasis.opendocument.formula-template": { source: "iana", extensions: ["odft"] },
  "application/vnd.oasis.opendocument.graphics": { source: "iana", compressible: !1, extensions: ["odg"] },
  "application/vnd.oasis.opendocument.graphics-template": { source: "iana", extensions: ["otg"] },
  "application/vnd.oasis.opendocument.image": { source: "iana", extensions: ["odi"] },
  "application/vnd.oasis.opendocument.image-template": { source: "iana", extensions: ["oti"] },
  "application/vnd.oasis.opendocument.presentation": { source: "iana", compressible: !1, extensions: ["odp"] },
  "application/vnd.oasis.opendocument.presentation-template": { source: "iana", extensions: ["otp"] },
  "application/vnd.oasis.opendocument.spreadsheet": { source: "iana", compressible: !1, extensions: ["ods"] },
  "application/vnd.oasis.opendocument.spreadsheet-template": { source: "iana", extensions: ["ots"] },
  "application/vnd.oasis.opendocument.text": { source: "iana", compressible: !1, extensions: ["odt"] },
  "application/vnd.oasis.opendocument.text-master": { source: "iana", extensions: ["odm"] },
  "application/vnd.oasis.opendocument.text-template": { source: "iana", extensions: ["ott"] },
  "application/vnd.oasis.opendocument.text-web": { source: "iana", extensions: ["oth"] },
  "application/vnd.obn": { source: "iana" },
  "application/vnd.ocf+cbor": { source: "iana" },
  "application/vnd.oci.image.manifest.v1+json": { source: "iana", compressible: !0 },
  "application/vnd.oftn.l10n+json": { source: "iana", compressible: !0 },
  "application/vnd.oipf.contentaccessdownload+xml": { source: "iana", compressible: !0 },
  "application/vnd.oipf.contentaccessstreaming+xml": { source: "iana", compressible: !0 },
  "application/vnd.oipf.cspg-hexbinary": { source: "iana" },
  "application/vnd.oipf.dae.svg+xml": { source: "iana", compressible: !0 },
  "application/vnd.oipf.dae.xhtml+xml": { source: "iana", compressible: !0 },
  "application/vnd.oipf.mippvcontrolmessage+xml": { source: "iana", compressible: !0 },
  "application/vnd.oipf.pae.gem": { source: "iana" },
  "application/vnd.oipf.spdiscovery+xml": { source: "iana", compressible: !0 },
  "application/vnd.oipf.spdlist+xml": { source: "iana", compressible: !0 },
  "application/vnd.oipf.ueprofile+xml": { source: "iana", compressible: !0 },
  "application/vnd.oipf.userprofile+xml": { source: "iana", compressible: !0 },
  "application/vnd.olpc-sugar": { source: "iana", extensions: ["xo"] },
  "application/vnd.oma-scws-config": { source: "iana" },
  "application/vnd.oma-scws-http-request": { source: "iana" },
  "application/vnd.oma-scws-http-response": { source: "iana" },
  "application/vnd.oma.bcast.associated-procedure-parameter+xml": { source: "iana", compressible: !0 },
  "application/vnd.oma.bcast.drm-trigger+xml": { source: "iana", compressible: !0 },
  "application/vnd.oma.bcast.imd+xml": { source: "iana", compressible: !0 },
  "application/vnd.oma.bcast.ltkm": { source: "iana" },
  "application/vnd.oma.bcast.notification+xml": { source: "iana", compressible: !0 },
  "application/vnd.oma.bcast.provisioningtrigger": { source: "iana" },
  "application/vnd.oma.bcast.sgboot": { source: "iana" },
  "application/vnd.oma.bcast.sgdd+xml": { source: "iana", compressible: !0 },
  "application/vnd.oma.bcast.sgdu": { source: "iana" },
  "application/vnd.oma.bcast.simple-symbol-container": { source: "iana" },
  "application/vnd.oma.bcast.smartcard-trigger+xml": { source: "iana", compressible: !0 },
  "application/vnd.oma.bcast.sprov+xml": { source: "iana", compressible: !0 },
  "application/vnd.oma.bcast.stkm": { source: "iana" },
  "application/vnd.oma.cab-address-book+xml": { source: "iana", compressible: !0 },
  "application/vnd.oma.cab-feature-handler+xml": { source: "iana", compressible: !0 },
  "application/vnd.oma.cab-pcc+xml": { source: "iana", compressible: !0 },
  "application/vnd.oma.cab-subs-invite+xml": { source: "iana", compressible: !0 },
  "application/vnd.oma.cab-user-prefs+xml": { source: "iana", compressible: !0 },
  "application/vnd.oma.dcd": { source: "iana" },
  "application/vnd.oma.dcdc": { source: "iana" },
  "application/vnd.oma.dd2+xml": { source: "iana", compressible: !0, extensions: ["dd2"] },
  "application/vnd.oma.drm.risd+xml": { source: "iana", compressible: !0 },
  "application/vnd.oma.group-usage-list+xml": { source: "iana", compressible: !0 },
  "application/vnd.oma.lwm2m+cbor": { source: "iana" },
  "application/vnd.oma.lwm2m+json": { source: "iana", compressible: !0 },
  "application/vnd.oma.lwm2m+tlv": { source: "iana" },
  "application/vnd.oma.pal+xml": { source: "iana", compressible: !0 },
  "application/vnd.oma.poc.detailed-progress-report+xml": { source: "iana", compressible: !0 },
  "application/vnd.oma.poc.final-report+xml": { source: "iana", compressible: !0 },
  "application/vnd.oma.poc.groups+xml": { source: "iana", compressible: !0 },
  "application/vnd.oma.poc.invocation-descriptor+xml": { source: "iana", compressible: !0 },
  "application/vnd.oma.poc.optimized-progress-report+xml": { source: "iana", compressible: !0 },
  "application/vnd.oma.push": { source: "iana" },
  "application/vnd.oma.scidm.messages+xml": { source: "iana", compressible: !0 },
  "application/vnd.oma.xcap-directory+xml": { source: "iana", compressible: !0 },
  "application/vnd.omads-email+xml": { source: "iana", charset: "UTF-8", compressible: !0 },
  "application/vnd.omads-file+xml": { source: "iana", charset: "UTF-8", compressible: !0 },
  "application/vnd.omads-folder+xml": { source: "iana", charset: "UTF-8", compressible: !0 },
  "application/vnd.omaloc-supl-init": { source: "iana" },
  "application/vnd.onepager": { source: "iana" },
  "application/vnd.onepagertamp": { source: "iana" },
  "application/vnd.onepagertamx": { source: "iana" },
  "application/vnd.onepagertat": { source: "iana" },
  "application/vnd.onepagertatp": { source: "iana" },
  "application/vnd.onepagertatx": { source: "iana" },
  "application/vnd.openblox.game+xml": { source: "iana", compressible: !0, extensions: ["obgx"] },
  "application/vnd.openblox.game-binary": { source: "iana" },
  "application/vnd.openeye.oeb": { source: "iana" },
  "application/vnd.openofficeorg.extension": { source: "apache", extensions: ["oxt"] },
  "application/vnd.openstreetmap.data+xml": { source: "iana", compressible: !0, extensions: ["osm"] },
  "application/vnd.opentimestamps.ots": { source: "iana" },
  "application/vnd.openxmlformats-officedocument.custom-properties+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.customxmlproperties+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.drawing+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.drawingml.chart+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.drawingml.chartshapes+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.drawingml.diagramcolors+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.drawingml.diagramdata+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.drawingml.diagramlayout+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.drawingml.diagramstyle+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.extended-properties+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.presentationml.commentauthors+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.presentationml.comments+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.presentationml.handoutmaster+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.presentationml.notesmaster+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.presentationml.notesslide+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": { source: "iana", compressible: !1, extensions: ["pptx"] },
  "application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.presentationml.presprops+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.presentationml.slide": { source: "iana", extensions: ["sldx"] },
  "application/vnd.openxmlformats-officedocument.presentationml.slide+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.presentationml.slidelayout+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.presentationml.slidemaster+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.presentationml.slideshow": { source: "iana", extensions: ["ppsx"] },
  "application/vnd.openxmlformats-officedocument.presentationml.slideshow.main+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.presentationml.slideupdateinfo+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.presentationml.tablestyles+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.presentationml.tags+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.presentationml.template": { source: "iana", extensions: ["potx"] },
  "application/vnd.openxmlformats-officedocument.presentationml.template.main+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.presentationml.viewprops+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.calcchain+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.chartsheet+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.connections+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.dialogsheet+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.externallink+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcachedefinition+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcacherecords+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.pivottable+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.querytable+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.revisionheaders+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.revisionlog+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sharedstrings+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": { source: "iana", compressible: !1, extensions: ["xlsx"] },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheetmetadata+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.tablesinglecells+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.template": { source: "iana", extensions: ["xltx"] },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.template.main+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.usernames+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.volatiledependencies+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.theme+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.themeoverride+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.vmldrawing": { source: "iana" },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.comments+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": { source: "iana", compressible: !1, extensions: ["docx"] },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document.glossary+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.endnotes+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.fonttable+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.footnotes+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.template": { source: "iana", extensions: ["dotx"] },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.template.main+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.websettings+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-package.core-properties+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-package.digital-signature-xmlsignature+xml": { source: "iana", compressible: !0 },
  "application/vnd.openxmlformats-package.relationships+xml": { source: "iana", compressible: !0 },
  "application/vnd.oracle.resource+json": { source: "iana", compressible: !0 },
  "application/vnd.orange.indata": { source: "iana" },
  "application/vnd.osa.netdeploy": { source: "iana" },
  "application/vnd.osgeo.mapguide.package": { source: "iana", extensions: ["mgp"] },
  "application/vnd.osgi.bundle": { source: "iana" },
  "application/vnd.osgi.dp": { source: "iana", extensions: ["dp"] },
  "application/vnd.osgi.subsystem": { source: "iana", extensions: ["esa"] },
  "application/vnd.otps.ct-kip+xml": { source: "iana", compressible: !0 },
  "application/vnd.oxli.countgraph": { source: "iana" },
  "application/vnd.pagerduty+json": { source: "iana", compressible: !0 },
  "application/vnd.palm": { source: "iana", extensions: ["pdb", "pqa", "oprc"] },
  "application/vnd.panoply": { source: "iana" },
  "application/vnd.paos.xml": { source: "iana" },
  "application/vnd.patentdive": { source: "iana" },
  "application/vnd.patientecommsdoc": { source: "iana" },
  "application/vnd.pawaafile": { source: "iana", extensions: ["paw"] },
  "application/vnd.pcos": { source: "iana" },
  "application/vnd.pg.format": { source: "iana", extensions: ["str"] },
  "application/vnd.pg.osasli": { source: "iana", extensions: ["ei6"] },
  "application/vnd.piaccess.application-licence": { source: "iana" },
  "application/vnd.picsel": { source: "iana", extensions: ["efif"] },
  "application/vnd.pmi.widget": { source: "iana", extensions: ["wg"] },
  "application/vnd.poc.group-advertisement+xml": { source: "iana", compressible: !0 },
  "application/vnd.pocketlearn": { source: "iana", extensions: ["plf"] },
  "application/vnd.powerbuilder6": { source: "iana", extensions: ["pbd"] },
  "application/vnd.powerbuilder6-s": { source: "iana" },
  "application/vnd.powerbuilder7": { source: "iana" },
  "application/vnd.powerbuilder7-s": { source: "iana" },
  "application/vnd.powerbuilder75": { source: "iana" },
  "application/vnd.powerbuilder75-s": { source: "iana" },
  "application/vnd.preminet": { source: "iana" },
  "application/vnd.previewsystems.box": { source: "iana", extensions: ["box"] },
  "application/vnd.proteus.magazine": { source: "iana", extensions: ["mgz"] },
  "application/vnd.psfs": { source: "iana" },
  "application/vnd.publishare-delta-tree": { source: "iana", extensions: ["qps"] },
  "application/vnd.pvi.ptid1": { source: "iana", extensions: ["ptid"] },
  "application/vnd.pwg-multiplexed": { source: "iana" },
  "application/vnd.pwg-xhtml-print+xml": { source: "iana", compressible: !0 },
  "application/vnd.qualcomm.brew-app-res": { source: "iana" },
  "application/vnd.quarantainenet": { source: "iana" },
  "application/vnd.quark.quarkxpress": { source: "iana", extensions: ["qxd", "qxt", "qwd", "qwt", "qxl", "qxb"] },
  "application/vnd.quobject-quoxdocument": { source: "iana" },
  "application/vnd.radisys.moml+xml": { source: "iana", compressible: !0 },
  "application/vnd.radisys.msml+xml": { source: "iana", compressible: !0 },
  "application/vnd.radisys.msml-audit+xml": { source: "iana", compressible: !0 },
  "application/vnd.radisys.msml-audit-conf+xml": { source: "iana", compressible: !0 },
  "application/vnd.radisys.msml-audit-conn+xml": { source: "iana", compressible: !0 },
  "application/vnd.radisys.msml-audit-dialog+xml": { source: "iana", compressible: !0 },
  "application/vnd.radisys.msml-audit-stream+xml": { source: "iana", compressible: !0 },
  "application/vnd.radisys.msml-conf+xml": { source: "iana", compressible: !0 },
  "application/vnd.radisys.msml-dialog+xml": { source: "iana", compressible: !0 },
  "application/vnd.radisys.msml-dialog-base+xml": { source: "iana", compressible: !0 },
  "application/vnd.radisys.msml-dialog-fax-detect+xml": { source: "iana", compressible: !0 },
  "application/vnd.radisys.msml-dialog-fax-sendrecv+xml": { source: "iana", compressible: !0 },
  "application/vnd.radisys.msml-dialog-group+xml": { source: "iana", compressible: !0 },
  "application/vnd.radisys.msml-dialog-speech+xml": { source: "iana", compressible: !0 },
  "application/vnd.radisys.msml-dialog-transform+xml": { source: "iana", compressible: !0 },
  "application/vnd.rainstor.data": { source: "iana" },
  "application/vnd.rapid": { source: "iana" },
  "application/vnd.rar": { source: "iana", extensions: ["rar"] },
  "application/vnd.realvnc.bed": { source: "iana", extensions: ["bed"] },
  "application/vnd.recordare.musicxml": { source: "iana", extensions: ["mxl"] },
  "application/vnd.recordare.musicxml+xml": { source: "iana", compressible: !0, extensions: ["musicxml"] },
  "application/vnd.renlearn.rlprint": { source: "iana" },
  "application/vnd.resilient.logic": { source: "iana" },
  "application/vnd.restful+json": { source: "iana", compressible: !0 },
  "application/vnd.rig.cryptonote": { source: "iana", extensions: ["cryptonote"] },
  "application/vnd.rim.cod": { source: "apache", extensions: ["cod"] },
  "application/vnd.rn-realmedia": { source: "apache", extensions: ["rm"] },
  "application/vnd.rn-realmedia-vbr": { source: "apache", extensions: ["rmvb"] },
  "application/vnd.route66.link66+xml": { source: "iana", compressible: !0, extensions: ["link66"] },
  "application/vnd.rs-274x": { source: "iana" },
  "application/vnd.ruckus.download": { source: "iana" },
  "application/vnd.s3sms": { source: "iana" },
  "application/vnd.sailingtracker.track": { source: "iana", extensions: ["st"] },
  "application/vnd.sar": { source: "iana" },
  "application/vnd.sbm.cid": { source: "iana" },
  "application/vnd.sbm.mid2": { source: "iana" },
  "application/vnd.scribus": { source: "iana" },
  "application/vnd.sealed.3df": { source: "iana" },
  "application/vnd.sealed.csf": { source: "iana" },
  "application/vnd.sealed.doc": { source: "iana" },
  "application/vnd.sealed.eml": { source: "iana" },
  "application/vnd.sealed.mht": { source: "iana" },
  "application/vnd.sealed.net": { source: "iana" },
  "application/vnd.sealed.ppt": { source: "iana" },
  "application/vnd.sealed.tiff": { source: "iana" },
  "application/vnd.sealed.xls": { source: "iana" },
  "application/vnd.sealedmedia.softseal.html": { source: "iana" },
  "application/vnd.sealedmedia.softseal.pdf": { source: "iana" },
  "application/vnd.seemail": { source: "iana", extensions: ["see"] },
  "application/vnd.seis+json": { source: "iana", compressible: !0 },
  "application/vnd.sema": { source: "iana", extensions: ["sema"] },
  "application/vnd.semd": { source: "iana", extensions: ["semd"] },
  "application/vnd.semf": { source: "iana", extensions: ["semf"] },
  "application/vnd.shade-save-file": { source: "iana" },
  "application/vnd.shana.informed.formdata": { source: "iana", extensions: ["ifm"] },
  "application/vnd.shana.informed.formtemplate": { source: "iana", extensions: ["itp"] },
  "application/vnd.shana.informed.interchange": { source: "iana", extensions: ["iif"] },
  "application/vnd.shana.informed.package": { source: "iana", extensions: ["ipk"] },
  "application/vnd.shootproof+json": { source: "iana", compressible: !0 },
  "application/vnd.shopkick+json": { source: "iana", compressible: !0 },
  "application/vnd.shp": { source: "iana" },
  "application/vnd.shx": { source: "iana" },
  "application/vnd.sigrok.session": { source: "iana" },
  "application/vnd.simtech-mindmapper": { source: "iana", extensions: ["twd", "twds"] },
  "application/vnd.siren+json": { source: "iana", compressible: !0 },
  "application/vnd.smaf": { source: "iana", extensions: ["mmf"] },
  "application/vnd.smart.notebook": { source: "iana" },
  "application/vnd.smart.teacher": { source: "iana", extensions: ["teacher"] },
  "application/vnd.snesdev-page-table": { source: "iana" },
  "application/vnd.software602.filler.form+xml": { source: "iana", compressible: !0, extensions: ["fo"] },
  "application/vnd.software602.filler.form-xml-zip": { source: "iana" },
  "application/vnd.solent.sdkm+xml": { source: "iana", compressible: !0, extensions: ["sdkm", "sdkd"] },
  "application/vnd.spotfire.dxp": { source: "iana", extensions: ["dxp"] },
  "application/vnd.spotfire.sfs": { source: "iana", extensions: ["sfs"] },
  "application/vnd.sqlite3": { source: "iana" },
  "application/vnd.sss-cod": { source: "iana" },
  "application/vnd.sss-dtf": { source: "iana" },
  "application/vnd.sss-ntf": { source: "iana" },
  "application/vnd.stardivision.calc": { source: "apache", extensions: ["sdc"] },
  "application/vnd.stardivision.draw": { source: "apache", extensions: ["sda"] },
  "application/vnd.stardivision.impress": { source: "apache", extensions: ["sdd"] },
  "application/vnd.stardivision.math": { source: "apache", extensions: ["smf"] },
  "application/vnd.stardivision.writer": { source: "apache", extensions: ["sdw", "vor"] },
  "application/vnd.stardivision.writer-global": { source: "apache", extensions: ["sgl"] },
  "application/vnd.stepmania.package": { source: "iana", extensions: ["smzip"] },
  "application/vnd.stepmania.stepchart": { source: "iana", extensions: ["sm"] },
  "application/vnd.street-stream": { source: "iana" },
  "application/vnd.sun.wadl+xml": { source: "iana", compressible: !0, extensions: ["wadl"] },
  "application/vnd.sun.xml.calc": { source: "apache", extensions: ["sxc"] },
  "application/vnd.sun.xml.calc.template": { source: "apache", extensions: ["stc"] },
  "application/vnd.sun.xml.draw": { source: "apache", extensions: ["sxd"] },
  "application/vnd.sun.xml.draw.template": { source: "apache", extensions: ["std"] },
  "application/vnd.sun.xml.impress": { source: "apache", extensions: ["sxi"] },
  "application/vnd.sun.xml.impress.template": { source: "apache", extensions: ["sti"] },
  "application/vnd.sun.xml.math": { source: "apache", extensions: ["sxm"] },
  "application/vnd.sun.xml.writer": { source: "apache", extensions: ["sxw"] },
  "application/vnd.sun.xml.writer.global": { source: "apache", extensions: ["sxg"] },
  "application/vnd.sun.xml.writer.template": { source: "apache", extensions: ["stw"] },
  "application/vnd.sus-calendar": { source: "iana", extensions: ["sus", "susp"] },
  "application/vnd.svd": { source: "iana", extensions: ["svd"] },
  "application/vnd.swiftview-ics": { source: "iana" },
  "application/vnd.sycle+xml": { source: "iana", compressible: !0 },
  "application/vnd.syft+json": { source: "iana", compressible: !0 },
  "application/vnd.symbian.install": { source: "apache", extensions: ["sis", "sisx"] },
  "application/vnd.syncml+xml": { source: "iana", charset: "UTF-8", compressible: !0, extensions: ["xsm"] },
  "application/vnd.syncml.dm+wbxml": { source: "iana", charset: "UTF-8", extensions: ["bdm"] },
  "application/vnd.syncml.dm+xml": { source: "iana", charset: "UTF-8", compressible: !0, extensions: ["xdm"] },
  "application/vnd.syncml.dm.notification": { source: "iana" },
  "application/vnd.syncml.dmddf+wbxml": { source: "iana" },
  "application/vnd.syncml.dmddf+xml": { source: "iana", charset: "UTF-8", compressible: !0, extensions: ["ddf"] },
  "application/vnd.syncml.dmtnds+wbxml": { source: "iana" },
  "application/vnd.syncml.dmtnds+xml": { source: "iana", charset: "UTF-8", compressible: !0 },
  "application/vnd.syncml.ds.notification": { source: "iana" },
  "application/vnd.tableschema+json": { source: "iana", compressible: !0 },
  "application/vnd.tao.intent-module-archive": { source: "iana", extensions: ["tao"] },
  "application/vnd.tcpdump.pcap": { source: "iana", extensions: ["pcap", "cap", "dmp"] },
  "application/vnd.think-cell.ppttc+json": { source: "iana", compressible: !0 },
  "application/vnd.tmd.mediaflex.api+xml": { source: "iana", compressible: !0 },
  "application/vnd.tml": { source: "iana" },
  "application/vnd.tmobile-livetv": { source: "iana", extensions: ["tmo"] },
  "application/vnd.tri.onesource": { source: "iana" },
  "application/vnd.trid.tpt": { source: "iana", extensions: ["tpt"] },
  "application/vnd.triscape.mxs": { source: "iana", extensions: ["mxs"] },
  "application/vnd.trueapp": { source: "iana", extensions: ["tra"] },
  "application/vnd.truedoc": { source: "iana" },
  "application/vnd.ubisoft.webplayer": { source: "iana" },
  "application/vnd.ufdl": { source: "iana", extensions: ["ufd", "ufdl"] },
  "application/vnd.uiq.theme": { source: "iana", extensions: ["utz"] },
  "application/vnd.umajin": { source: "iana", extensions: ["umj"] },
  "application/vnd.unity": { source: "iana", extensions: ["unityweb"] },
  "application/vnd.uoml+xml": { source: "iana", compressible: !0, extensions: ["uoml"] },
  "application/vnd.uplanet.alert": { source: "iana" },
  "application/vnd.uplanet.alert-wbxml": { source: "iana" },
  "application/vnd.uplanet.bearer-choice": { source: "iana" },
  "application/vnd.uplanet.bearer-choice-wbxml": { source: "iana" },
  "application/vnd.uplanet.cacheop": { source: "iana" },
  "application/vnd.uplanet.cacheop-wbxml": { source: "iana" },
  "application/vnd.uplanet.channel": { source: "iana" },
  "application/vnd.uplanet.channel-wbxml": { source: "iana" },
  "application/vnd.uplanet.list": { source: "iana" },
  "application/vnd.uplanet.list-wbxml": { source: "iana" },
  "application/vnd.uplanet.listcmd": { source: "iana" },
  "application/vnd.uplanet.listcmd-wbxml": { source: "iana" },
  "application/vnd.uplanet.signal": { source: "iana" },
  "application/vnd.uri-map": { source: "iana" },
  "application/vnd.valve.source.material": { source: "iana" },
  "application/vnd.vcx": { source: "iana", extensions: ["vcx"] },
  "application/vnd.vd-study": { source: "iana" },
  "application/vnd.vectorworks": { source: "iana" },
  "application/vnd.vel+json": { source: "iana", compressible: !0 },
  "application/vnd.verimatrix.vcas": { source: "iana" },
  "application/vnd.veritone.aion+json": { source: "iana", compressible: !0 },
  "application/vnd.veryant.thin": { source: "iana" },
  "application/vnd.ves.encrypted": { source: "iana" },
  "application/vnd.vidsoft.vidconference": { source: "iana" },
  "application/vnd.visio": { source: "iana", extensions: ["vsd", "vst", "vss", "vsw"] },
  "application/vnd.visionary": { source: "iana", extensions: ["vis"] },
  "application/vnd.vividence.scriptfile": { source: "iana" },
  "application/vnd.vsf": { source: "iana", extensions: ["vsf"] },
  "application/vnd.wap.sic": { source: "iana" },
  "application/vnd.wap.slc": { source: "iana" },
  "application/vnd.wap.wbxml": { source: "iana", charset: "UTF-8", extensions: ["wbxml"] },
  "application/vnd.wap.wmlc": { source: "iana", extensions: ["wmlc"] },
  "application/vnd.wap.wmlscriptc": { source: "iana", extensions: ["wmlsc"] },
  "application/vnd.webturbo": { source: "iana", extensions: ["wtb"] },
  "application/vnd.wfa.dpp": { source: "iana" },
  "application/vnd.wfa.p2p": { source: "iana" },
  "application/vnd.wfa.wsc": { source: "iana" },
  "application/vnd.windows.devicepairing": { source: "iana" },
  "application/vnd.wmc": { source: "iana" },
  "application/vnd.wmf.bootstrap": { source: "iana" },
  "application/vnd.wolfram.mathematica": { source: "iana" },
  "application/vnd.wolfram.mathematica.package": { source: "iana" },
  "application/vnd.wolfram.player": { source: "iana", extensions: ["nbp"] },
  "application/vnd.wordperfect": { source: "iana", extensions: ["wpd"] },
  "application/vnd.wqd": { source: "iana", extensions: ["wqd"] },
  "application/vnd.wrq-hp3000-labelled": { source: "iana" },
  "application/vnd.wt.stf": { source: "iana", extensions: ["stf"] },
  "application/vnd.wv.csp+wbxml": { source: "iana" },
  "application/vnd.wv.csp+xml": { source: "iana", compressible: !0 },
  "application/vnd.wv.ssp+xml": { source: "iana", compressible: !0 },
  "application/vnd.xacml+json": { source: "iana", compressible: !0 },
  "application/vnd.xara": { source: "iana", extensions: ["xar"] },
  "application/vnd.xfdl": { source: "iana", extensions: ["xfdl"] },
  "application/vnd.xfdl.webform": { source: "iana" },
  "application/vnd.xmi+xml": { source: "iana", compressible: !0 },
  "application/vnd.xmpie.cpkg": { source: "iana" },
  "application/vnd.xmpie.dpkg": { source: "iana" },
  "application/vnd.xmpie.plan": { source: "iana" },
  "application/vnd.xmpie.ppkg": { source: "iana" },
  "application/vnd.xmpie.xlim": { source: "iana" },
  "application/vnd.yamaha.hv-dic": { source: "iana", extensions: ["hvd"] },
  "application/vnd.yamaha.hv-script": { source: "iana", extensions: ["hvs"] },
  "application/vnd.yamaha.hv-voice": { source: "iana", extensions: ["hvp"] },
  "application/vnd.yamaha.openscoreformat": { source: "iana", extensions: ["osf"] },
  "application/vnd.yamaha.openscoreformat.osfpvg+xml": { source: "iana", compressible: !0, extensions: ["osfpvg"] },
  "application/vnd.yamaha.remote-setup": { source: "iana" },
  "application/vnd.yamaha.smaf-audio": { source: "iana", extensions: ["saf"] },
  "application/vnd.yamaha.smaf-phrase": { source: "iana", extensions: ["spf"] },
  "application/vnd.yamaha.through-ngn": { source: "iana" },
  "application/vnd.yamaha.tunnel-udpencap": { source: "iana" },
  "application/vnd.yaoweme": { source: "iana" },
  "application/vnd.yellowriver-custom-menu": { source: "iana", extensions: ["cmp"] },
  "application/vnd.youtube.yt": { source: "iana" },
  "application/vnd.zul": { source: "iana", extensions: ["zir", "zirz"] },
  "application/vnd.zzazz.deck+xml": { source: "iana", compressible: !0, extensions: ["zaz"] },
  "application/voicexml+xml": { source: "iana", compressible: !0, extensions: ["vxml"] },
  "application/voucher-cms+json": { source: "iana", compressible: !0 },
  "application/vq-rtcpxr": { source: "iana" },
  "application/wasm": { source: "iana", compressible: !0, extensions: ["wasm"] },
  "application/watcherinfo+xml": { source: "iana", compressible: !0, extensions: ["wif"] },
  "application/webpush-options+json": { source: "iana", compressible: !0 },
  "application/whoispp-query": { source: "iana" },
  "application/whoispp-response": { source: "iana" },
  "application/widget": { source: "iana", extensions: ["wgt"] },
  "application/winhlp": { source: "apache", extensions: ["hlp"] },
  "application/wita": { source: "iana" },
  "application/wordperfect5.1": { source: "iana" },
  "application/wsdl+xml": { source: "iana", compressible: !0, extensions: ["wsdl"] },
  "application/wspolicy+xml": { source: "iana", compressible: !0, extensions: ["wspolicy"] },
  "application/x-7z-compressed": { source: "apache", compressible: !1, extensions: ["7z"] },
  "application/x-abiword": { source: "apache", extensions: ["abw"] },
  "application/x-ace-compressed": { source: "apache", extensions: ["ace"] },
  "application/x-amf": { source: "apache" },
  "application/x-apple-diskimage": { source: "apache", extensions: ["dmg"] },
  "application/x-arj": { compressible: !1, extensions: ["arj"] },
  "application/x-authorware-bin": { source: "apache", extensions: ["aab", "x32", "u32", "vox"] },
  "application/x-authorware-map": { source: "apache", extensions: ["aam"] },
  "application/x-authorware-seg": { source: "apache", extensions: ["aas"] },
  "application/x-bcpio": { source: "apache", extensions: ["bcpio"] },
  "application/x-bdoc": { compressible: !1, extensions: ["bdoc"] },
  "application/x-bittorrent": { source: "apache", extensions: ["torrent"] },
  "application/x-blorb": { source: "apache", extensions: ["blb", "blorb"] },
  "application/x-bzip": { source: "apache", compressible: !1, extensions: ["bz"] },
  "application/x-bzip2": { source: "apache", compressible: !1, extensions: ["bz2", "boz"] },
  "application/x-cbr": { source: "apache", extensions: ["cbr", "cba", "cbt", "cbz", "cb7"] },
  "application/x-cdlink": { source: "apache", extensions: ["vcd"] },
  "application/x-cfs-compressed": { source: "apache", extensions: ["cfs"] },
  "application/x-chat": { source: "apache", extensions: ["chat"] },
  "application/x-chess-pgn": { source: "apache", extensions: ["pgn"] },
  "application/x-chrome-extension": { extensions: ["crx"] },
  "application/x-cocoa": { source: "nginx", extensions: ["cco"] },
  "application/x-compress": { source: "apache" },
  "application/x-conference": { source: "apache", extensions: ["nsc"] },
  "application/x-cpio": { source: "apache", extensions: ["cpio"] },
  "application/x-csh": { source: "apache", extensions: ["csh"] },
  "application/x-deb": { compressible: !1 },
  "application/x-debian-package": { source: "apache", extensions: ["deb", "udeb"] },
  "application/x-dgc-compressed": { source: "apache", extensions: ["dgc"] },
  "application/x-director": { source: "apache", extensions: ["dir", "dcr", "dxr", "cst", "cct", "cxt", "w3d", "fgd", "swa"] },
  "application/x-doom": { source: "apache", extensions: ["wad"] },
  "application/x-dtbncx+xml": { source: "apache", compressible: !0, extensions: ["ncx"] },
  "application/x-dtbook+xml": { source: "apache", compressible: !0, extensions: ["dtb"] },
  "application/x-dtbresource+xml": { source: "apache", compressible: !0, extensions: ["res"] },
  "application/x-dvi": { source: "apache", compressible: !1, extensions: ["dvi"] },
  "application/x-envoy": { source: "apache", extensions: ["evy"] },
  "application/x-eva": { source: "apache", extensions: ["eva"] },
  "application/x-font-bdf": { source: "apache", extensions: ["bdf"] },
  "application/x-font-dos": { source: "apache" },
  "application/x-font-framemaker": { source: "apache" },
  "application/x-font-ghostscript": { source: "apache", extensions: ["gsf"] },
  "application/x-font-libgrx": { source: "apache" },
  "application/x-font-linux-psf": { source: "apache", extensions: ["psf"] },
  "application/x-font-pcf": { source: "apache", extensions: ["pcf"] },
  "application/x-font-snf": { source: "apache", extensions: ["snf"] },
  "application/x-font-speedo": { source: "apache" },
  "application/x-font-sunos-news": { source: "apache" },
  "application/x-font-type1": { source: "apache", extensions: ["pfa", "pfb", "pfm", "afm"] },
  "application/x-font-vfont": { source: "apache" },
  "application/x-freearc": { source: "apache", extensions: ["arc"] },
  "application/x-futuresplash": { source: "apache", extensions: ["spl"] },
  "application/x-gca-compressed": { source: "apache", extensions: ["gca"] },
  "application/x-glulx": { source: "apache", extensions: ["ulx"] },
  "application/x-gnumeric": { source: "apache", extensions: ["gnumeric"] },
  "application/x-gramps-xml": { source: "apache", extensions: ["gramps"] },
  "application/x-gtar": { source: "apache", extensions: ["gtar"] },
  "application/x-gzip": { source: "apache" },
  "application/x-hdf": { source: "apache", extensions: ["hdf"] },
  "application/x-httpd-php": { compressible: !0, extensions: ["php"] },
  "application/x-install-instructions": { source: "apache", extensions: ["install"] },
  "application/x-iso9660-image": { source: "apache", extensions: ["iso"] },
  "application/x-iwork-keynote-sffkey": { extensions: ["key"] },
  "application/x-iwork-numbers-sffnumbers": { extensions: ["numbers"] },
  "application/x-iwork-pages-sffpages": { extensions: ["pages"] },
  "application/x-java-archive-diff": { source: "nginx", extensions: ["jardiff"] },
  "application/x-java-jnlp-file": { source: "apache", compressible: !1, extensions: ["jnlp"] },
  "application/x-javascript": { compressible: !0 },
  "application/x-keepass2": { extensions: ["kdbx"] },
  "application/x-latex": { source: "apache", compressible: !1, extensions: ["latex"] },
  "application/x-lua-bytecode": { extensions: ["luac"] },
  "application/x-lzh-compressed": { source: "apache", extensions: ["lzh", "lha"] },
  "application/x-makeself": { source: "nginx", extensions: ["run"] },
  "application/x-mie": { source: "apache", extensions: ["mie"] },
  "application/x-mobipocket-ebook": { source: "apache", extensions: ["prc", "mobi"] },
  "application/x-mpegurl": { compressible: !1 },
  "application/x-ms-application": { source: "apache", extensions: ["application"] },
  "application/x-ms-shortcut": { source: "apache", extensions: ["lnk"] },
  "application/x-ms-wmd": { source: "apache", extensions: ["wmd"] },
  "application/x-ms-wmz": { source: "apache", extensions: ["wmz"] },
  "application/x-ms-xbap": { source: "apache", extensions: ["xbap"] },
  "application/x-msaccess": { source: "apache", extensions: ["mdb"] },
  "application/x-msbinder": { source: "apache", extensions: ["obd"] },
  "application/x-mscardfile": { source: "apache", extensions: ["crd"] },
  "application/x-msclip": { source: "apache", extensions: ["clp"] },
  "application/x-msdos-program": { extensions: ["exe"] },
  "application/x-msdownload": { source: "apache", extensions: ["exe", "dll", "com", "bat", "msi"] },
  "application/x-msmediaview": { source: "apache", extensions: ["mvb", "m13", "m14"] },
  "application/x-msmetafile": { source: "apache", extensions: ["wmf", "wmz", "emf", "emz"] },
  "application/x-msmoney": { source: "apache", extensions: ["mny"] },
  "application/x-mspublisher": { source: "apache", extensions: ["pub"] },
  "application/x-msschedule": { source: "apache", extensions: ["scd"] },
  "application/x-msterminal": { source: "apache", extensions: ["trm"] },
  "application/x-mswrite": { source: "apache", extensions: ["wri"] },
  "application/x-netcdf": { source: "apache", extensions: ["nc", "cdf"] },
  "application/x-ns-proxy-autoconfig": { compressible: !0, extensions: ["pac"] },
  "application/x-nzb": { source: "apache", extensions: ["nzb"] },
  "application/x-perl": { source: "nginx", extensions: ["pl", "pm"] },
  "application/x-pilot": { source: "nginx", extensions: ["prc", "pdb"] },
  "application/x-pkcs12": { source: "apache", compressible: !1, extensions: ["p12", "pfx"] },
  "application/x-pkcs7-certificates": { source: "apache", extensions: ["p7b", "spc"] },
  "application/x-pkcs7-certreqresp": { source: "apache", extensions: ["p7r"] },
  "application/x-pki-message": { source: "iana" },
  "application/x-rar-compressed": { source: "apache", compressible: !1, extensions: ["rar"] },
  "application/x-redhat-package-manager": { source: "nginx", extensions: ["rpm"] },
  "application/x-research-info-systems": { source: "apache", extensions: ["ris"] },
  "application/x-sea": { source: "nginx", extensions: ["sea"] },
  "application/x-sh": { source: "apache", compressible: !0, extensions: ["sh"] },
  "application/x-shar": { source: "apache", extensions: ["shar"] },
  "application/x-shockwave-flash": { source: "apache", compressible: !1, extensions: ["swf"] },
  "application/x-silverlight-app": { source: "apache", extensions: ["xap"] },
  "application/x-sql": { source: "apache", extensions: ["sql"] },
  "application/x-stuffit": { source: "apache", compressible: !1, extensions: ["sit"] },
  "application/x-stuffitx": { source: "apache", extensions: ["sitx"] },
  "application/x-subrip": { source: "apache", extensions: ["srt"] },
  "application/x-sv4cpio": { source: "apache", extensions: ["sv4cpio"] },
  "application/x-sv4crc": { source: "apache", extensions: ["sv4crc"] },
  "application/x-t3vm-image": { source: "apache", extensions: ["t3"] },
  "application/x-tads": { source: "apache", extensions: ["gam"] },
  "application/x-tar": { source: "apache", compressible: !0, extensions: ["tar"] },
  "application/x-tcl": { source: "apache", extensions: ["tcl", "tk"] },
  "application/x-tex": { source: "apache", extensions: ["tex"] },
  "application/x-tex-tfm": { source: "apache", extensions: ["tfm"] },
  "application/x-texinfo": { source: "apache", extensions: ["texinfo", "texi"] },
  "application/x-tgif": { source: "apache", extensions: ["obj"] },
  "application/x-ustar": { source: "apache", extensions: ["ustar"] },
  "application/x-virtualbox-hdd": { compressible: !0, extensions: ["hdd"] },
  "application/x-virtualbox-ova": { compressible: !0, extensions: ["ova"] },
  "application/x-virtualbox-ovf": { compressible: !0, extensions: ["ovf"] },
  "application/x-virtualbox-vbox": { compressible: !0, extensions: ["vbox"] },
  "application/x-virtualbox-vbox-extpack": { compressible: !1, extensions: ["vbox-extpack"] },
  "application/x-virtualbox-vdi": { compressible: !0, extensions: ["vdi"] },
  "application/x-virtualbox-vhd": { compressible: !0, extensions: ["vhd"] },
  "application/x-virtualbox-vmdk": { compressible: !0, extensions: ["vmdk"] },
  "application/x-wais-source": { source: "apache", extensions: ["src"] },
  "application/x-web-app-manifest+json": { compressible: !0, extensions: ["webapp"] },
  "application/x-www-form-urlencoded": { source: "iana", compressible: !0 },
  "application/x-x509-ca-cert": { source: "iana", extensions: ["der", "crt", "pem"] },
  "application/x-x509-ca-ra-cert": { source: "iana" },
  "application/x-x509-next-ca-cert": { source: "iana" },
  "application/x-xfig": { source: "apache", extensions: ["fig"] },
  "application/x-xliff+xml": { source: "apache", compressible: !0, extensions: ["xlf"] },
  "application/x-xpinstall": { source: "apache", compressible: !1, extensions: ["xpi"] },
  "application/x-xz": { source: "apache", extensions: ["xz"] },
  "application/x-zmachine": { source: "apache", extensions: ["z1", "z2", "z3", "z4", "z5", "z6", "z7", "z8"] },
  "application/x400-bp": { source: "iana" },
  "application/xacml+xml": { source: "iana", compressible: !0 },
  "application/xaml+xml": { source: "apache", compressible: !0, extensions: ["xaml"] },
  "application/xcap-att+xml": { source: "iana", compressible: !0, extensions: ["xav"] },
  "application/xcap-caps+xml": { source: "iana", compressible: !0, extensions: ["xca"] },
  "application/xcap-diff+xml": { source: "iana", compressible: !0, extensions: ["xdf"] },
  "application/xcap-el+xml": { source: "iana", compressible: !0, extensions: ["xel"] },
  "application/xcap-error+xml": { source: "iana", compressible: !0 },
  "application/xcap-ns+xml": { source: "iana", compressible: !0, extensions: ["xns"] },
  "application/xcon-conference-info+xml": { source: "iana", compressible: !0 },
  "application/xcon-conference-info-diff+xml": { source: "iana", compressible: !0 },
  "application/xenc+xml": { source: "iana", compressible: !0, extensions: ["xenc"] },
  "application/xhtml+xml": { source: "iana", compressible: !0, extensions: ["xhtml", "xht"] },
  "application/xhtml-voice+xml": { source: "apache", compressible: !0 },
  "application/xliff+xml": { source: "iana", compressible: !0, extensions: ["xlf"] },
  "application/xml": { source: "iana", compressible: !0, extensions: ["xml", "xsl", "xsd", "rng"] },
  "application/xml-dtd": { source: "iana", compressible: !0, extensions: ["dtd"] },
  "application/xml-external-parsed-entity": { source: "iana" },
  "application/xml-patch+xml": { source: "iana", compressible: !0 },
  "application/xmpp+xml": { source: "iana", compressible: !0 },
  "application/xop+xml": { source: "iana", compressible: !0, extensions: ["xop"] },
  "application/xproc+xml": { source: "apache", compressible: !0, extensions: ["xpl"] },
  "application/xslt+xml": { source: "iana", compressible: !0, extensions: ["xsl", "xslt"] },
  "application/xspf+xml": { source: "apache", compressible: !0, extensions: ["xspf"] },
  "application/xv+xml": { source: "iana", compressible: !0, extensions: ["mxml", "xhvml", "xvml", "xvm"] },
  "application/yang": { source: "iana", extensions: ["yang"] },
  "application/yang-data+json": { source: "iana", compressible: !0 },
  "application/yang-data+xml": { source: "iana", compressible: !0 },
  "application/yang-patch+json": { source: "iana", compressible: !0 },
  "application/yang-patch+xml": { source: "iana", compressible: !0 },
  "application/yin+xml": { source: "iana", compressible: !0, extensions: ["yin"] },
  "application/zip": { source: "iana", compressible: !1, extensions: ["zip"] },
  "application/zlib": { source: "iana" },
  "application/zstd": { source: "iana" },
  "audio/1d-interleaved-parityfec": { source: "iana" },
  "audio/32kadpcm": { source: "iana" },
  "audio/3gpp": { source: "iana", compressible: !1, extensions: ["3gpp"] },
  "audio/3gpp2": { source: "iana" },
  "audio/aac": { source: "iana" },
  "audio/ac3": { source: "iana" },
  "audio/adpcm": { source: "apache", extensions: ["adp"] },
  "audio/amr": { source: "iana", extensions: ["amr"] },
  "audio/amr-wb": { source: "iana" },
  "audio/amr-wb+": { source: "iana" },
  "audio/aptx": { source: "iana" },
  "audio/asc": { source: "iana" },
  "audio/atrac-advanced-lossless": { source: "iana" },
  "audio/atrac-x": { source: "iana" },
  "audio/atrac3": { source: "iana" },
  "audio/basic": { source: "iana", compressible: !1, extensions: ["au", "snd"] },
  "audio/bv16": { source: "iana" },
  "audio/bv32": { source: "iana" },
  "audio/clearmode": { source: "iana" },
  "audio/cn": { source: "iana" },
  "audio/dat12": { source: "iana" },
  "audio/dls": { source: "iana" },
  "audio/dsr-es201108": { source: "iana" },
  "audio/dsr-es202050": { source: "iana" },
  "audio/dsr-es202211": { source: "iana" },
  "audio/dsr-es202212": { source: "iana" },
  "audio/dv": { source: "iana" },
  "audio/dvi4": { source: "iana" },
  "audio/eac3": { source: "iana" },
  "audio/encaprtp": { source: "iana" },
  "audio/evrc": { source: "iana" },
  "audio/evrc-qcp": { source: "iana" },
  "audio/evrc0": { source: "iana" },
  "audio/evrc1": { source: "iana" },
  "audio/evrcb": { source: "iana" },
  "audio/evrcb0": { source: "iana" },
  "audio/evrcb1": { source: "iana" },
  "audio/evrcnw": { source: "iana" },
  "audio/evrcnw0": { source: "iana" },
  "audio/evrcnw1": { source: "iana" },
  "audio/evrcwb": { source: "iana" },
  "audio/evrcwb0": { source: "iana" },
  "audio/evrcwb1": { source: "iana" },
  "audio/evs": { source: "iana" },
  "audio/flexfec": { source: "iana" },
  "audio/fwdred": { source: "iana" },
  "audio/g711-0": { source: "iana" },
  "audio/g719": { source: "iana" },
  "audio/g722": { source: "iana" },
  "audio/g7221": { source: "iana" },
  "audio/g723": { source: "iana" },
  "audio/g726-16": { source: "iana" },
  "audio/g726-24": { source: "iana" },
  "audio/g726-32": { source: "iana" },
  "audio/g726-40": { source: "iana" },
  "audio/g728": { source: "iana" },
  "audio/g729": { source: "iana" },
  "audio/g7291": { source: "iana" },
  "audio/g729d": { source: "iana" },
  "audio/g729e": { source: "iana" },
  "audio/gsm": { source: "iana" },
  "audio/gsm-efr": { source: "iana" },
  "audio/gsm-hr-08": { source: "iana" },
  "audio/ilbc": { source: "iana" },
  "audio/ip-mr_v2.5": { source: "iana" },
  "audio/isac": { source: "apache" },
  "audio/l16": { source: "iana" },
  "audio/l20": { source: "iana" },
  "audio/l24": { source: "iana", compressible: !1 },
  "audio/l8": { source: "iana" },
  "audio/lpc": { source: "iana" },
  "audio/melp": { source: "iana" },
  "audio/melp1200": { source: "iana" },
  "audio/melp2400": { source: "iana" },
  "audio/melp600": { source: "iana" },
  "audio/mhas": { source: "iana" },
  "audio/midi": { source: "apache", extensions: ["mid", "midi", "kar", "rmi"] },
  "audio/mobile-xmf": { source: "iana", extensions: ["mxmf"] },
  "audio/mp3": { compressible: !1, extensions: ["mp3"] },
  "audio/mp4": { source: "iana", compressible: !1, extensions: ["m4a", "mp4a"] },
  "audio/mp4a-latm": { source: "iana" },
  "audio/mpa": { source: "iana" },
  "audio/mpa-robust": { source: "iana" },
  "audio/mpeg": { source: "iana", compressible: !1, extensions: ["mpga", "mp2", "mp2a", "mp3", "m2a", "m3a"] },
  "audio/mpeg4-generic": { source: "iana" },
  "audio/musepack": { source: "apache" },
  "audio/ogg": { source: "iana", compressible: !1, extensions: ["oga", "ogg", "spx", "opus"] },
  "audio/opus": { source: "iana" },
  "audio/parityfec": { source: "iana" },
  "audio/pcma": { source: "iana" },
  "audio/pcma-wb": { source: "iana" },
  "audio/pcmu": { source: "iana" },
  "audio/pcmu-wb": { source: "iana" },
  "audio/prs.sid": { source: "iana" },
  "audio/qcelp": { source: "iana" },
  "audio/raptorfec": { source: "iana" },
  "audio/red": { source: "iana" },
  "audio/rtp-enc-aescm128": { source: "iana" },
  "audio/rtp-midi": { source: "iana" },
  "audio/rtploopback": { source: "iana" },
  "audio/rtx": { source: "iana" },
  "audio/s3m": { source: "apache", extensions: ["s3m"] },
  "audio/scip": { source: "iana" },
  "audio/silk": { source: "apache", extensions: ["sil"] },
  "audio/smv": { source: "iana" },
  "audio/smv-qcp": { source: "iana" },
  "audio/smv0": { source: "iana" },
  "audio/sofa": { source: "iana" },
  "audio/sp-midi": { source: "iana" },
  "audio/speex": { source: "iana" },
  "audio/t140c": { source: "iana" },
  "audio/t38": { source: "iana" },
  "audio/telephone-event": { source: "iana" },
  "audio/tetra_acelp": { source: "iana" },
  "audio/tetra_acelp_bb": { source: "iana" },
  "audio/tone": { source: "iana" },
  "audio/tsvcis": { source: "iana" },
  "audio/uemclip": { source: "iana" },
  "audio/ulpfec": { source: "iana" },
  "audio/usac": { source: "iana" },
  "audio/vdvi": { source: "iana" },
  "audio/vmr-wb": { source: "iana" },
  "audio/vnd.3gpp.iufp": { source: "iana" },
  "audio/vnd.4sb": { source: "iana" },
  "audio/vnd.audiokoz": { source: "iana" },
  "audio/vnd.celp": { source: "iana" },
  "audio/vnd.cisco.nse": { source: "iana" },
  "audio/vnd.cmles.radio-events": { source: "iana" },
  "audio/vnd.cns.anp1": { source: "iana" },
  "audio/vnd.cns.inf1": { source: "iana" },
  "audio/vnd.dece.audio": { source: "iana", extensions: ["uva", "uvva"] },
  "audio/vnd.digital-winds": { source: "iana", extensions: ["eol"] },
  "audio/vnd.dlna.adts": { source: "iana" },
  "audio/vnd.dolby.heaac.1": { source: "iana" },
  "audio/vnd.dolby.heaac.2": { source: "iana" },
  "audio/vnd.dolby.mlp": { source: "iana" },
  "audio/vnd.dolby.mps": { source: "iana" },
  "audio/vnd.dolby.pl2": { source: "iana" },
  "audio/vnd.dolby.pl2x": { source: "iana" },
  "audio/vnd.dolby.pl2z": { source: "iana" },
  "audio/vnd.dolby.pulse.1": { source: "iana" },
  "audio/vnd.dra": { source: "iana", extensions: ["dra"] },
  "audio/vnd.dts": { source: "iana", extensions: ["dts"] },
  "audio/vnd.dts.hd": { source: "iana", extensions: ["dtshd"] },
  "audio/vnd.dts.uhd": { source: "iana" },
  "audio/vnd.dvb.file": { source: "iana" },
  "audio/vnd.everad.plj": { source: "iana" },
  "audio/vnd.hns.audio": { source: "iana" },
  "audio/vnd.lucent.voice": { source: "iana", extensions: ["lvp"] },
  "audio/vnd.ms-playready.media.pya": { source: "iana", extensions: ["pya"] },
  "audio/vnd.nokia.mobile-xmf": { source: "iana" },
  "audio/vnd.nortel.vbk": { source: "iana" },
  "audio/vnd.nuera.ecelp4800": { source: "iana", extensions: ["ecelp4800"] },
  "audio/vnd.nuera.ecelp7470": { source: "iana", extensions: ["ecelp7470"] },
  "audio/vnd.nuera.ecelp9600": { source: "iana", extensions: ["ecelp9600"] },
  "audio/vnd.octel.sbc": { source: "iana" },
  "audio/vnd.presonus.multitrack": { source: "iana" },
  "audio/vnd.qcelp": { source: "iana" },
  "audio/vnd.rhetorex.32kadpcm": { source: "iana" },
  "audio/vnd.rip": { source: "iana", extensions: ["rip"] },
  "audio/vnd.rn-realaudio": { compressible: !1 },
  "audio/vnd.sealedmedia.softseal.mpeg": { source: "iana" },
  "audio/vnd.vmx.cvsd": { source: "iana" },
  "audio/vnd.wave": { compressible: !1 },
  "audio/vorbis": { source: "iana", compressible: !1 },
  "audio/vorbis-config": { source: "iana" },
  "audio/wav": { compressible: !1, extensions: ["wav"] },
  "audio/wave": { compressible: !1, extensions: ["wav"] },
  "audio/webm": { source: "apache", compressible: !1, extensions: ["weba"] },
  "audio/x-aac": { source: "apache", compressible: !1, extensions: ["aac"] },
  "audio/x-aiff": { source: "apache", extensions: ["aif", "aiff", "aifc"] },
  "audio/x-caf": { source: "apache", compressible: !1, extensions: ["caf"] },
  "audio/x-flac": { source: "apache", extensions: ["flac"] },
  "audio/x-m4a": { source: "nginx", extensions: ["m4a"] },
  "audio/x-matroska": { source: "apache", extensions: ["mka"] },
  "audio/x-mpegurl": { source: "apache", extensions: ["m3u"] },
  "audio/x-ms-wax": { source: "apache", extensions: ["wax"] },
  "audio/x-ms-wma": { source: "apache", extensions: ["wma"] },
  "audio/x-pn-realaudio": { source: "apache", extensions: ["ram", "ra"] },
  "audio/x-pn-realaudio-plugin": { source: "apache", extensions: ["rmp"] },
  "audio/x-realaudio": { source: "nginx", extensions: ["ra"] },
  "audio/x-tta": { source: "apache" },
  "audio/x-wav": { source: "apache", extensions: ["wav"] },
  "audio/xm": { source: "apache", extensions: ["xm"] },
  "chemical/x-cdx": { source: "apache", extensions: ["cdx"] },
  "chemical/x-cif": { source: "apache", extensions: ["cif"] },
  "chemical/x-cmdf": { source: "apache", extensions: ["cmdf"] },
  "chemical/x-cml": { source: "apache", extensions: ["cml"] },
  "chemical/x-csml": { source: "apache", extensions: ["csml"] },
  "chemical/x-pdb": { source: "apache" },
  "chemical/x-xyz": { source: "apache", extensions: ["xyz"] },
  "font/collection": { source: "iana", extensions: ["ttc"] },
  "font/otf": { source: "iana", compressible: !0, extensions: ["otf"] },
  "font/sfnt": { source: "iana" },
  "font/ttf": { source: "iana", compressible: !0, extensions: ["ttf"] },
  "font/woff": { source: "iana", extensions: ["woff"] },
  "font/woff2": { source: "iana", extensions: ["woff2"] },
  "image/aces": { source: "iana", extensions: ["exr"] },
  "image/apng": { compressible: !1, extensions: ["apng"] },
  "image/avci": { source: "iana", extensions: ["avci"] },
  "image/avcs": { source: "iana", extensions: ["avcs"] },
  "image/avif": { source: "iana", compressible: !1, extensions: ["avif"] },
  "image/bmp": { source: "iana", compressible: !0, extensions: ["bmp"] },
  "image/cgm": { source: "iana", extensions: ["cgm"] },
  "image/dicom-rle": { source: "iana", extensions: ["drle"] },
  "image/emf": { source: "iana", extensions: ["emf"] },
  "image/fits": { source: "iana", extensions: ["fits"] },
  "image/g3fax": { source: "iana", extensions: ["g3"] },
  "image/gif": { source: "iana", compressible: !1, extensions: ["gif"] },
  "image/heic": { source: "iana", extensions: ["heic"] },
  "image/heic-sequence": { source: "iana", extensions: ["heics"] },
  "image/heif": { source: "iana", extensions: ["heif"] },
  "image/heif-sequence": { source: "iana", extensions: ["heifs"] },
  "image/hej2k": { source: "iana", extensions: ["hej2"] },
  "image/hsj2": { source: "iana", extensions: ["hsj2"] },
  "image/ief": { source: "iana", extensions: ["ief"] },
  "image/jls": { source: "iana", extensions: ["jls"] },
  "image/jp2": { source: "iana", compressible: !1, extensions: ["jp2", "jpg2"] },
  "image/jpeg": { source: "iana", compressible: !1, extensions: ["jpeg", "jpg", "jpe"] },
  "image/jph": { source: "iana", extensions: ["jph"] },
  "image/jphc": { source: "iana", extensions: ["jhc"] },
  "image/jpm": { source: "iana", compressible: !1, extensions: ["jpm"] },
  "image/jpx": { source: "iana", compressible: !1, extensions: ["jpx", "jpf"] },
  "image/jxr": { source: "iana", extensions: ["jxr"] },
  "image/jxra": { source: "iana", extensions: ["jxra"] },
  "image/jxrs": { source: "iana", extensions: ["jxrs"] },
  "image/jxs": { source: "iana", extensions: ["jxs"] },
  "image/jxsc": { source: "iana", extensions: ["jxsc"] },
  "image/jxsi": { source: "iana", extensions: ["jxsi"] },
  "image/jxss": { source: "iana", extensions: ["jxss"] },
  "image/ktx": { source: "iana", extensions: ["ktx"] },
  "image/ktx2": { source: "iana", extensions: ["ktx2"] },
  "image/naplps": { source: "iana" },
  "image/pjpeg": { compressible: !1 },
  "image/png": { source: "iana", compressible: !1, extensions: ["png"] },
  "image/prs.btif": { source: "iana", extensions: ["btif"] },
  "image/prs.pti": { source: "iana", extensions: ["pti"] },
  "image/pwg-raster": { source: "iana" },
  "image/sgi": { source: "apache", extensions: ["sgi"] },
  "image/svg+xml": { source: "iana", compressible: !0, extensions: ["svg", "svgz"] },
  "image/t38": { source: "iana", extensions: ["t38"] },
  "image/tiff": { source: "iana", compressible: !1, extensions: ["tif", "tiff"] },
  "image/tiff-fx": { source: "iana", extensions: ["tfx"] },
  "image/vnd.adobe.photoshop": { source: "iana", compressible: !0, extensions: ["psd"] },
  "image/vnd.airzip.accelerator.azv": { source: "iana", extensions: ["azv"] },
  "image/vnd.cns.inf2": { source: "iana" },
  "image/vnd.dece.graphic": { source: "iana", extensions: ["uvi", "uvvi", "uvg", "uvvg"] },
  "image/vnd.djvu": { source: "iana", extensions: ["djvu", "djv"] },
  "image/vnd.dvb.subtitle": { source: "iana", extensions: ["sub"] },
  "image/vnd.dwg": { source: "iana", extensions: ["dwg"] },
  "image/vnd.dxf": { source: "iana", extensions: ["dxf"] },
  "image/vnd.fastbidsheet": { source: "iana", extensions: ["fbs"] },
  "image/vnd.fpx": { source: "iana", extensions: ["fpx"] },
  "image/vnd.fst": { source: "iana", extensions: ["fst"] },
  "image/vnd.fujixerox.edmics-mmr": { source: "iana", extensions: ["mmr"] },
  "image/vnd.fujixerox.edmics-rlc": { source: "iana", extensions: ["rlc"] },
  "image/vnd.globalgraphics.pgb": { source: "iana" },
  "image/vnd.microsoft.icon": { source: "iana", compressible: !0, extensions: ["ico"] },
  "image/vnd.mix": { source: "iana" },
  "image/vnd.mozilla.apng": { source: "iana" },
  "image/vnd.ms-dds": { compressible: !0, extensions: ["dds"] },
  "image/vnd.ms-modi": { source: "iana", extensions: ["mdi"] },
  "image/vnd.ms-photo": { source: "apache", extensions: ["wdp"] },
  "image/vnd.net-fpx": { source: "iana", extensions: ["npx"] },
  "image/vnd.pco.b16": { source: "iana", extensions: ["b16"] },
  "image/vnd.radiance": { source: "iana" },
  "image/vnd.sealed.png": { source: "iana" },
  "image/vnd.sealedmedia.softseal.gif": { source: "iana" },
  "image/vnd.sealedmedia.softseal.jpg": { source: "iana" },
  "image/vnd.svf": { source: "iana" },
  "image/vnd.tencent.tap": { source: "iana", extensions: ["tap"] },
  "image/vnd.valve.source.texture": { source: "iana", extensions: ["vtf"] },
  "image/vnd.wap.wbmp": { source: "iana", extensions: ["wbmp"] },
  "image/vnd.xiff": { source: "iana", extensions: ["xif"] },
  "image/vnd.zbrush.pcx": { source: "iana", extensions: ["pcx"] },
  "image/webp": { source: "apache", extensions: ["webp"] },
  "image/wmf": { source: "iana", extensions: ["wmf"] },
  "image/x-3ds": { source: "apache", extensions: ["3ds"] },
  "image/x-cmu-raster": { source: "apache", extensions: ["ras"] },
  "image/x-cmx": { source: "apache", extensions: ["cmx"] },
  "image/x-freehand": { source: "apache", extensions: ["fh", "fhc", "fh4", "fh5", "fh7"] },
  "image/x-icon": { source: "apache", compressible: !0, extensions: ["ico"] },
  "image/x-jng": { source: "nginx", extensions: ["jng"] },
  "image/x-mrsid-image": { source: "apache", extensions: ["sid"] },
  "image/x-ms-bmp": { source: "nginx", compressible: !0, extensions: ["bmp"] },
  "image/x-pcx": { source: "apache", extensions: ["pcx"] },
  "image/x-pict": { source: "apache", extensions: ["pic", "pct"] },
  "image/x-portable-anymap": { source: "apache", extensions: ["pnm"] },
  "image/x-portable-bitmap": { source: "apache", extensions: ["pbm"] },
  "image/x-portable-graymap": { source: "apache", extensions: ["pgm"] },
  "image/x-portable-pixmap": { source: "apache", extensions: ["ppm"] },
  "image/x-rgb": { source: "apache", extensions: ["rgb"] },
  "image/x-tga": { source: "apache", extensions: ["tga"] },
  "image/x-xbitmap": { source: "apache", extensions: ["xbm"] },
  "image/x-xcf": { compressible: !1 },
  "image/x-xpixmap": { source: "apache", extensions: ["xpm"] },
  "image/x-xwindowdump": { source: "apache", extensions: ["xwd"] },
  "message/cpim": { source: "iana" },
  "message/delivery-status": { source: "iana" },
  "message/disposition-notification": { source: "iana", extensions: ["disposition-notification"] },
  "message/external-body": { source: "iana" },
  "message/feedback-report": { source: "iana" },
  "message/global": { source: "iana", extensions: ["u8msg"] },
  "message/global-delivery-status": { source: "iana", extensions: ["u8dsn"] },
  "message/global-disposition-notification": { source: "iana", extensions: ["u8mdn"] },
  "message/global-headers": { source: "iana", extensions: ["u8hdr"] },
  "message/http": { source: "iana", compressible: !1 },
  "message/imdn+xml": { source: "iana", compressible: !0 },
  "message/news": { source: "iana" },
  "message/partial": { source: "iana", compressible: !1 },
  "message/rfc822": { source: "iana", compressible: !0, extensions: ["eml", "mime"] },
  "message/s-http": { source: "iana" },
  "message/sip": { source: "iana" },
  "message/sipfrag": { source: "iana" },
  "message/tracking-status": { source: "iana" },
  "message/vnd.si.simp": { source: "iana" },
  "message/vnd.wfa.wsc": { source: "iana", extensions: ["wsc"] },
  "model/3mf": { source: "iana", extensions: ["3mf"] },
  "model/e57": { source: "iana" },
  "model/gltf+json": { source: "iana", compressible: !0, extensions: ["gltf"] },
  "model/gltf-binary": { source: "iana", compressible: !0, extensions: ["glb"] },
  "model/iges": { source: "iana", compressible: !1, extensions: ["igs", "iges"] },
  "model/mesh": { source: "iana", compressible: !1, extensions: ["msh", "mesh", "silo"] },
  "model/mtl": { source: "iana", extensions: ["mtl"] },
  "model/obj": { source: "iana", extensions: ["obj"] },
  "model/step": { source: "iana" },
  "model/step+xml": { source: "iana", compressible: !0, extensions: ["stpx"] },
  "model/step+zip": { source: "iana", compressible: !1, extensions: ["stpz"] },
  "model/step-xml+zip": { source: "iana", compressible: !1, extensions: ["stpxz"] },
  "model/stl": { source: "iana", extensions: ["stl"] },
  "model/vnd.collada+xml": { source: "iana", compressible: !0, extensions: ["dae"] },
  "model/vnd.dwf": { source: "iana", extensions: ["dwf"] },
  "model/vnd.flatland.3dml": { source: "iana" },
  "model/vnd.gdl": { source: "iana", extensions: ["gdl"] },
  "model/vnd.gs-gdl": { source: "apache" },
  "model/vnd.gs.gdl": { source: "iana" },
  "model/vnd.gtw": { source: "iana", extensions: ["gtw"] },
  "model/vnd.moml+xml": { source: "iana", compressible: !0 },
  "model/vnd.mts": { source: "iana", extensions: ["mts"] },
  "model/vnd.opengex": { source: "iana", extensions: ["ogex"] },
  "model/vnd.parasolid.transmit.binary": { source: "iana", extensions: ["x_b"] },
  "model/vnd.parasolid.transmit.text": { source: "iana", extensions: ["x_t"] },
  "model/vnd.pytha.pyox": { source: "iana" },
  "model/vnd.rosette.annotated-data-model": { source: "iana" },
  "model/vnd.sap.vds": { source: "iana", extensions: ["vds"] },
  "model/vnd.usdz+zip": { source: "iana", compressible: !1, extensions: ["usdz"] },
  "model/vnd.valve.source.compiled-map": { source: "iana", extensions: ["bsp"] },
  "model/vnd.vtu": { source: "iana", extensions: ["vtu"] },
  "model/vrml": { source: "iana", compressible: !1, extensions: ["wrl", "vrml"] },
  "model/x3d+binary": { source: "apache", compressible: !1, extensions: ["x3db", "x3dbz"] },
  "model/x3d+fastinfoset": { source: "iana", extensions: ["x3db"] },
  "model/x3d+vrml": { source: "apache", compressible: !1, extensions: ["x3dv", "x3dvz"] },
  "model/x3d+xml": { source: "iana", compressible: !0, extensions: ["x3d", "x3dz"] },
  "model/x3d-vrml": { source: "iana", extensions: ["x3dv"] },
  "multipart/alternative": { source: "iana", compressible: !1 },
  "multipart/appledouble": { source: "iana" },
  "multipart/byteranges": { source: "iana" },
  "multipart/digest": { source: "iana" },
  "multipart/encrypted": { source: "iana", compressible: !1 },
  "multipart/form-data": { source: "iana", compressible: !1 },
  "multipart/header-set": { source: "iana" },
  "multipart/mixed": { source: "iana" },
  "multipart/multilingual": { source: "iana" },
  "multipart/parallel": { source: "iana" },
  "multipart/related": { source: "iana", compressible: !1 },
  "multipart/report": { source: "iana" },
  "multipart/signed": { source: "iana", compressible: !1 },
  "multipart/vnd.bint.med-plus": { source: "iana" },
  "multipart/voice-message": { source: "iana" },
  "multipart/x-mixed-replace": { source: "iana" },
  "text/1d-interleaved-parityfec": { source: "iana" },
  "text/cache-manifest": { source: "iana", compressible: !0, extensions: ["appcache", "manifest"] },
  "text/calendar": { source: "iana", extensions: ["ics", "ifb"] },
  "text/calender": { compressible: !0 },
  "text/cmd": { compressible: !0 },
  "text/coffeescript": { extensions: ["coffee", "litcoffee"] },
  "text/cql": { source: "iana" },
  "text/cql-expression": { source: "iana" },
  "text/cql-identifier": { source: "iana" },
  "text/css": { source: "iana", charset: "UTF-8", compressible: !0, extensions: ["css"] },
  "text/csv": { source: "iana", compressible: !0, extensions: ["csv"] },
  "text/csv-schema": { source: "iana" },
  "text/directory": { source: "iana" },
  "text/dns": { source: "iana" },
  "text/ecmascript": { source: "iana" },
  "text/encaprtp": { source: "iana" },
  "text/enriched": { source: "iana" },
  "text/fhirpath": { source: "iana" },
  "text/flexfec": { source: "iana" },
  "text/fwdred": { source: "iana" },
  "text/gff3": { source: "iana" },
  "text/grammar-ref-list": { source: "iana" },
  "text/html": { source: "iana", compressible: !0, extensions: ["html", "htm", "shtml"] },
  "text/jade": { extensions: ["jade"] },
  "text/javascript": { source: "iana", compressible: !0 },
  "text/jcr-cnd": { source: "iana" },
  "text/jsx": { compressible: !0, extensions: ["jsx"] },
  "text/less": { compressible: !0, extensions: ["less"] },
  "text/markdown": { source: "iana", compressible: !0, extensions: ["markdown", "md"] },
  "text/mathml": { source: "nginx", extensions: ["mml"] },
  "text/mdx": { compressible: !0, extensions: ["mdx"] },
  "text/mizar": { source: "iana" },
  "text/n3": { source: "iana", charset: "UTF-8", compressible: !0, extensions: ["n3"] },
  "text/parameters": { source: "iana", charset: "UTF-8" },
  "text/parityfec": { source: "iana" },
  "text/plain": { source: "iana", compressible: !0, extensions: ["txt", "text", "conf", "def", "list", "log", "in", "ini"] },
  "text/provenance-notation": { source: "iana", charset: "UTF-8" },
  "text/prs.fallenstein.rst": { source: "iana" },
  "text/prs.lines.tag": { source: "iana", extensions: ["dsc"] },
  "text/prs.prop.logic": { source: "iana" },
  "text/raptorfec": { source: "iana" },
  "text/red": { source: "iana" },
  "text/rfc822-headers": { source: "iana" },
  "text/richtext": { source: "iana", compressible: !0, extensions: ["rtx"] },
  "text/rtf": { source: "iana", compressible: !0, extensions: ["rtf"] },
  "text/rtp-enc-aescm128": { source: "iana" },
  "text/rtploopback": { source: "iana" },
  "text/rtx": { source: "iana" },
  "text/sgml": { source: "iana", extensions: ["sgml", "sgm"] },
  "text/shaclc": { source: "iana" },
  "text/shex": { source: "iana", extensions: ["shex"] },
  "text/slim": { extensions: ["slim", "slm"] },
  "text/spdx": { source: "iana", extensions: ["spdx"] },
  "text/strings": { source: "iana" },
  "text/stylus": { extensions: ["stylus", "styl"] },
  "text/t140": { source: "iana" },
  "text/tab-separated-values": { source: "iana", compressible: !0, extensions: ["tsv"] },
  "text/troff": { source: "iana", extensions: ["t", "tr", "roff", "man", "me", "ms"] },
  "text/turtle": { source: "iana", charset: "UTF-8", extensions: ["ttl"] },
  "text/ulpfec": { source: "iana" },
  "text/uri-list": { source: "iana", compressible: !0, extensions: ["uri", "uris", "urls"] },
  "text/vcard": { source: "iana", compressible: !0, extensions: ["vcard"] },
  "text/vnd.a": { source: "iana" },
  "text/vnd.abc": { source: "iana" },
  "text/vnd.ascii-art": { source: "iana" },
  "text/vnd.curl": { source: "iana", extensions: ["curl"] },
  "text/vnd.curl.dcurl": { source: "apache", extensions: ["dcurl"] },
  "text/vnd.curl.mcurl": { source: "apache", extensions: ["mcurl"] },
  "text/vnd.curl.scurl": { source: "apache", extensions: ["scurl"] },
  "text/vnd.debian.copyright": { source: "iana", charset: "UTF-8" },
  "text/vnd.dmclientscript": { source: "iana" },
  "text/vnd.dvb.subtitle": { source: "iana", extensions: ["sub"] },
  "text/vnd.esmertec.theme-descriptor": { source: "iana", charset: "UTF-8" },
  "text/vnd.familysearch.gedcom": { source: "iana", extensions: ["ged"] },
  "text/vnd.ficlab.flt": { source: "iana" },
  "text/vnd.fly": { source: "iana", extensions: ["fly"] },
  "text/vnd.fmi.flexstor": { source: "iana", extensions: ["flx"] },
  "text/vnd.gml": { source: "iana" },
  "text/vnd.graphviz": { source: "iana", extensions: ["gv"] },
  "text/vnd.hans": { source: "iana" },
  "text/vnd.hgl": { source: "iana" },
  "text/vnd.in3d.3dml": { source: "iana", extensions: ["3dml"] },
  "text/vnd.in3d.spot": { source: "iana", extensions: ["spot"] },
  "text/vnd.iptc.newsml": { source: "iana" },
  "text/vnd.iptc.nitf": { source: "iana" },
  "text/vnd.latex-z": { source: "iana" },
  "text/vnd.motorola.reflex": { source: "iana" },
  "text/vnd.ms-mediapackage": { source: "iana" },
  "text/vnd.net2phone.commcenter.command": { source: "iana" },
  "text/vnd.radisys.msml-basic-layout": { source: "iana" },
  "text/vnd.senx.warpscript": { source: "iana" },
  "text/vnd.si.uricatalogue": { source: "iana" },
  "text/vnd.sosi": { source: "iana" },
  "text/vnd.sun.j2me.app-descriptor": { source: "iana", charset: "UTF-8", extensions: ["jad"] },
  "text/vnd.trolltech.linguist": { source: "iana", charset: "UTF-8" },
  "text/vnd.wap.si": { source: "iana" },
  "text/vnd.wap.sl": { source: "iana" },
  "text/vnd.wap.wml": { source: "iana", extensions: ["wml"] },
  "text/vnd.wap.wmlscript": { source: "iana", extensions: ["wmls"] },
  "text/vtt": { source: "iana", charset: "UTF-8", compressible: !0, extensions: ["vtt"] },
  "text/x-asm": { source: "apache", extensions: ["s", "asm"] },
  "text/x-c": { source: "apache", extensions: ["c", "cc", "cxx", "cpp", "h", "hh", "dic"] },
  "text/x-component": { source: "nginx", extensions: ["htc"] },
  "text/x-fortran": { source: "apache", extensions: ["f", "for", "f77", "f90"] },
  "text/x-gwt-rpc": { compressible: !0 },
  "text/x-handlebars-template": { extensions: ["hbs"] },
  "text/x-java-source": { source: "apache", extensions: ["java"] },
  "text/x-jquery-tmpl": { compressible: !0 },
  "text/x-lua": { extensions: ["lua"] },
  "text/x-markdown": { compressible: !0, extensions: ["mkd"] },
  "text/x-nfo": { source: "apache", extensions: ["nfo"] },
  "text/x-opml": { source: "apache", extensions: ["opml"] },
  "text/x-org": { compressible: !0, extensions: ["org"] },
  "text/x-pascal": { source: "apache", extensions: ["p", "pas"] },
  "text/x-processing": { compressible: !0, extensions: ["pde"] },
  "text/x-sass": { extensions: ["sass"] },
  "text/x-scss": { extensions: ["scss"] },
  "text/x-setext": { source: "apache", extensions: ["etx"] },
  "text/x-sfv": { source: "apache", extensions: ["sfv"] },
  "text/x-suse-ymp": { compressible: !0, extensions: ["ymp"] },
  "text/x-uuencode": { source: "apache", extensions: ["uu"] },
  "text/x-vcalendar": { source: "apache", extensions: ["vcs"] },
  "text/x-vcard": { source: "apache", extensions: ["vcf"] },
  "text/xml": { source: "iana", compressible: !0, extensions: ["xml"] },
  "text/xml-external-parsed-entity": { source: "iana" },
  "text/yaml": { compressible: !0, extensions: ["yaml", "yml"] },
  "video/1d-interleaved-parityfec": { source: "iana" },
  "video/3gpp": { source: "iana", extensions: ["3gp", "3gpp"] },
  "video/3gpp-tt": { source: "iana" },
  "video/3gpp2": { source: "iana", extensions: ["3g2"] },
  "video/av1": { source: "iana" },
  "video/bmpeg": { source: "iana" },
  "video/bt656": { source: "iana" },
  "video/celb": { source: "iana" },
  "video/dv": { source: "iana" },
  "video/encaprtp": { source: "iana" },
  "video/ffv1": { source: "iana" },
  "video/flexfec": { source: "iana" },
  "video/h261": { source: "iana", extensions: ["h261"] },
  "video/h263": { source: "iana", extensions: ["h263"] },
  "video/h263-1998": { source: "iana" },
  "video/h263-2000": { source: "iana" },
  "video/h264": { source: "iana", extensions: ["h264"] },
  "video/h264-rcdo": { source: "iana" },
  "video/h264-svc": { source: "iana" },
  "video/h265": { source: "iana" },
  "video/iso.segment": { source: "iana", extensions: ["m4s"] },
  "video/jpeg": { source: "iana", extensions: ["jpgv"] },
  "video/jpeg2000": { source: "iana" },
  "video/jpm": { source: "apache", extensions: ["jpm", "jpgm"] },
  "video/jxsv": { source: "iana" },
  "video/mj2": { source: "iana", extensions: ["mj2", "mjp2"] },
  "video/mp1s": { source: "iana" },
  "video/mp2p": { source: "iana" },
  "video/mp2t": { source: "iana", extensions: ["ts"] },
  "video/mp4": { source: "iana", compressible: !1, extensions: ["mp4", "mp4v", "mpg4"] },
  "video/mp4v-es": { source: "iana" },
  "video/mpeg": { source: "iana", compressible: !1, extensions: ["mpeg", "mpg", "mpe", "m1v", "m2v"] },
  "video/mpeg4-generic": { source: "iana" },
  "video/mpv": { source: "iana" },
  "video/nv": { source: "iana" },
  "video/ogg": { source: "iana", compressible: !1, extensions: ["ogv"] },
  "video/parityfec": { source: "iana" },
  "video/pointer": { source: "iana" },
  "video/quicktime": { source: "iana", compressible: !1, extensions: ["qt", "mov"] },
  "video/raptorfec": { source: "iana" },
  "video/raw": { source: "iana" },
  "video/rtp-enc-aescm128": { source: "iana" },
  "video/rtploopback": { source: "iana" },
  "video/rtx": { source: "iana" },
  "video/scip": { source: "iana" },
  "video/smpte291": { source: "iana" },
  "video/smpte292m": { source: "iana" },
  "video/ulpfec": { source: "iana" },
  "video/vc1": { source: "iana" },
  "video/vc2": { source: "iana" },
  "video/vnd.cctv": { source: "iana" },
  "video/vnd.dece.hd": { source: "iana", extensions: ["uvh", "uvvh"] },
  "video/vnd.dece.mobile": { source: "iana", extensions: ["uvm", "uvvm"] },
  "video/vnd.dece.mp4": { source: "iana" },
  "video/vnd.dece.pd": { source: "iana", extensions: ["uvp", "uvvp"] },
  "video/vnd.dece.sd": { source: "iana", extensions: ["uvs", "uvvs"] },
  "video/vnd.dece.video": { source: "iana", extensions: ["uvv", "uvvv"] },
  "video/vnd.directv.mpeg": { source: "iana" },
  "video/vnd.directv.mpeg-tts": { source: "iana" },
  "video/vnd.dlna.mpeg-tts": { source: "iana" },
  "video/vnd.dvb.file": { source: "iana", extensions: ["dvb"] },
  "video/vnd.fvt": { source: "iana", extensions: ["fvt"] },
  "video/vnd.hns.video": { source: "iana" },
  "video/vnd.iptvforum.1dparityfec-1010": { source: "iana" },
  "video/vnd.iptvforum.1dparityfec-2005": { source: "iana" },
  "video/vnd.iptvforum.2dparityfec-1010": { source: "iana" },
  "video/vnd.iptvforum.2dparityfec-2005": { source: "iana" },
  "video/vnd.iptvforum.ttsavc": { source: "iana" },
  "video/vnd.iptvforum.ttsmpeg2": { source: "iana" },
  "video/vnd.motorola.video": { source: "iana" },
  "video/vnd.motorola.videop": { source: "iana" },
  "video/vnd.mpegurl": { source: "iana", extensions: ["mxu", "m4u"] },
  "video/vnd.ms-playready.media.pyv": { source: "iana", extensions: ["pyv"] },
  "video/vnd.nokia.interleaved-multimedia": { source: "iana" },
  "video/vnd.nokia.mp4vr": { source: "iana" },
  "video/vnd.nokia.videovoip": { source: "iana" },
  "video/vnd.objectvideo": { source: "iana" },
  "video/vnd.radgamettools.bink": { source: "iana" },
  "video/vnd.radgamettools.smacker": { source: "iana" },
  "video/vnd.sealed.mpeg1": { source: "iana" },
  "video/vnd.sealed.mpeg4": { source: "iana" },
  "video/vnd.sealed.swf": { source: "iana" },
  "video/vnd.sealedmedia.softseal.mov": { source: "iana" },
  "video/vnd.uvvu.mp4": { source: "iana", extensions: ["uvu", "uvvu"] },
  "video/vnd.vivo": { source: "iana", extensions: ["viv"] },
  "video/vnd.youtube.yt": { source: "iana" },
  "video/vp8": { source: "iana" },
  "video/vp9": { source: "iana" },
  "video/webm": { source: "apache", compressible: !1, extensions: ["webm"] },
  "video/x-f4v": { source: "apache", extensions: ["f4v"] },
  "video/x-fli": { source: "apache", extensions: ["fli"] },
  "video/x-flv": { source: "apache", compressible: !1, extensions: ["flv"] },
  "video/x-m4v": { source: "apache", extensions: ["m4v"] },
  "video/x-matroska": { source: "apache", compressible: !1, extensions: ["mkv", "mk3d", "mks"] },
  "video/x-mng": { source: "apache", extensions: ["mng"] },
  "video/x-ms-asf": { source: "apache", extensions: ["asf", "asx"] },
  "video/x-ms-vob": { source: "apache", extensions: ["vob"] },
  "video/x-ms-wm": { source: "apache", extensions: ["wm"] },
  "video/x-ms-wmv": { source: "apache", compressible: !1, extensions: ["wmv"] },
  "video/x-ms-wmx": { source: "apache", extensions: ["wmx"] },
  "video/x-ms-wvx": { source: "apache", extensions: ["wvx"] },
  "video/x-msvideo": { source: "apache", extensions: ["avi"] },
  "video/x-sgi-movie": { source: "apache", extensions: ["movie"] },
  "video/x-smv": { source: "apache", extensions: ["smv"] },
  "x-conference/x-cooltalk": { source: "apache", extensions: ["ice"] },
  "x-shader/x-fragment": { compressible: !0 },
  "x-shader/x-vertex": { compressible: !0 }
};
/*!
 * mime-db
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2015-2022 Douglas Christopher Wilson
 * MIT Licensed
 */
var Kn, gi;
function Oo() {
  return gi || (gi = 1, Kn = Co), Kn;
}
/*!
 * mime-types
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */
var yi;
function Po() {
  return yi || (yi = 1, function(n) {
    var e = Oo(), i = G.extname, a = /^\s*([^;\s]*)(?:;|\s|$)/, t = /^text\//i;
    n.charset = o, n.charsets = { lookup: o }, n.contentType = s, n.extension = x, n.extensions = /* @__PURE__ */ Object.create(null), n.lookup = d, n.types = /* @__PURE__ */ Object.create(null), f(n.extensions, n.types);
    function o(p) {
      if (!p || typeof p != "string")
        return !1;
      var l = a.exec(p), u = l && e[l[1].toLowerCase()];
      return u && u.charset ? u.charset : l && t.test(l[1]) ? "UTF-8" : !1;
    }
    function s(p) {
      if (!p || typeof p != "string")
        return !1;
      var l = p.indexOf("/") === -1 ? n.lookup(p) : p;
      if (!l)
        return !1;
      if (l.indexOf("charset") === -1) {
        var u = n.charset(l);
        u && (l += "; charset=" + u.toLowerCase());
      }
      return l;
    }
    function x(p) {
      if (!p || typeof p != "string")
        return !1;
      var l = a.exec(p), u = l && n.extensions[l[1].toLowerCase()];
      return !u || !u.length ? !1 : u[0];
    }
    function d(p) {
      if (!p || typeof p != "string")
        return !1;
      var l = i("x." + p).toLowerCase().substr(1);
      return l && n.types[l] || !1;
    }
    function f(p, l) {
      var u = ["nginx", "apache", void 0, "iana"];
      Object.keys(e).forEach(function(r) {
        var c = e[r], h = c.extensions;
        if (!(!h || !h.length)) {
          p[r] = h;
          for (var v = 0; v < h.length; v++) {
            var y = h[v];
            if (l[y]) {
              var w = u.indexOf(e[l[y]].source), C = u.indexOf(c.source);
              if (l[y] !== "application/octet-stream" && (w > C || w === C && l[y].substr(0, 12) === "application/"))
                continue;
            }
            l[y] = r;
          }
        }
      });
    }
  }(Wn)), Wn;
}
var Jn, wi;
function qo() {
  if (wi) return Jn;
  wi = 1, Jn = n;
  function n(e) {
    var i = typeof setImmediate == "function" ? setImmediate : typeof process == "object" && typeof process.nextTick == "function" ? process.nextTick : null;
    i ? i(e) : setTimeout(e, 0);
  }
  return Jn;
}
var Gn, Ei;
function Pt() {
  if (Ei) return Gn;
  Ei = 1;
  var n = qo();
  Gn = e;
  function e(i) {
    var a = !1;
    return n(function() {
      a = !0;
    }), function(o, s) {
      a ? i(o, s) : n(function() {
        i(o, s);
      });
    };
  }
  return Gn;
}
var Yn, ki;
function qt() {
  if (ki) return Yn;
  ki = 1, Yn = n;
  function n(i) {
    Object.keys(i.jobs).forEach(e.bind(i)), i.jobs = {};
  }
  function e(i) {
    typeof this.jobs[i] == "function" && this.jobs[i]();
  }
  return Yn;
}
var Xn, _i;
function Ft() {
  if (_i) return Xn;
  _i = 1;
  var n = Pt(), e = qt();
  Xn = i;
  function i(t, o, s, x) {
    var d = s.keyedList ? s.keyedList[s.index] : s.index;
    s.jobs[d] = a(o, d, t[d], function(f, p) {
      d in s.jobs && (delete s.jobs[d], f ? e(s) : s.results[d] = p, x(f, s.results));
    });
  }
  function a(t, o, s, x) {
    var d;
    return t.length == 2 ? d = t(s, n(x)) : d = t(s, o, n(x)), d;
  }
  return Xn;
}
var Zn, Si;
function Lt() {
  if (Si) return Zn;
  Si = 1, Zn = n;
  function n(e, i) {
    var a = !Array.isArray(e), t = {
      index: 0,
      keyedList: a || i ? Object.keys(e) : null,
      jobs: {},
      results: a ? {} : [],
      size: a ? Object.keys(e).length : e.length
    };
    return i && t.keyedList.sort(a ? i : function(o, s) {
      return i(e[o], e[s]);
    }), t;
  }
  return Zn;
}
var Qn, Ri;
function Dt() {
  if (Ri) return Qn;
  Ri = 1;
  var n = qt(), e = Pt();
  Qn = i;
  function i(a) {
    Object.keys(this.jobs).length && (this.index = this.size, n(this), e(a)(null, this.results));
  }
  return Qn;
}
var ea, Ai;
function Fo() {
  if (Ai) return ea;
  Ai = 1;
  var n = Ft(), e = Lt(), i = Dt();
  ea = a;
  function a(t, o, s) {
    for (var x = e(t); x.index < (x.keyedList || t).length; )
      n(t, o, x, function(d, f) {
        if (d) {
          s(d, f);
          return;
        }
        if (Object.keys(x.jobs).length === 0) {
          s(null, x.results);
          return;
        }
      }), x.index++;
    return i.bind(x, s);
  }
  return ea;
}
var We = { exports: {} }, Ti;
function Nt() {
  if (Ti) return We.exports;
  Ti = 1;
  var n = Ft(), e = Lt(), i = Dt();
  We.exports = a, We.exports.ascending = t, We.exports.descending = o;
  function a(s, x, d, f) {
    var p = e(s, d);
    return n(s, x, p, function l(u, m) {
      if (u) {
        f(u, m);
        return;
      }
      if (p.index++, p.index < (p.keyedList || s).length) {
        n(s, x, p, l);
        return;
      }
      f(null, p.results);
    }), i.bind(p, f);
  }
  function t(s, x) {
    return s < x ? -1 : s > x ? 1 : 0;
  }
  function o(s, x) {
    return -1 * t(s, x);
  }
  return We.exports;
}
var na, ji;
function Lo() {
  if (ji) return na;
  ji = 1;
  var n = Nt();
  na = e;
  function e(i, a, t) {
    return n(i, a, null, t);
  }
  return na;
}
var aa, Ci;
function Do() {
  return Ci || (Ci = 1, aa = {
    parallel: Fo(),
    serial: Lo(),
    serialOrdered: Nt()
  }), aa;
}
var ia, Oi;
function No() {
  return Oi || (Oi = 1, ia = function(n, e) {
    return Object.keys(e).forEach(function(i) {
      n[i] = n[i] || e[i];
    }), n;
  }), ia;
}
var ta, Pi;
function Io() {
  if (Pi) return ta;
  Pi = 1;
  var n = jo(), e = xe, i = G, a = Ra, t = Aa, o = En.parse, s = Te, x = re.Stream, d = Po(), f = Do(), p = No();
  ta = l, e.inherits(l, n);
  function l(u) {
    if (!(this instanceof l))
      return new l(u);
    this._overheadLength = 0, this._valueLength = 0, this._valuesToMeasure = [], n.call(this), u = u || {};
    for (var m in u)
      this[m] = u[m];
  }
  return l.LINE_BREAK = `\r
`, l.DEFAULT_CONTENT_TYPE = "application/octet-stream", l.prototype.append = function(u, m, r) {
    r = r || {}, typeof r == "string" && (r = { filename: r });
    var c = n.prototype.append.bind(this);
    if (typeof m == "number" && (m = "" + m), Array.isArray(m)) {
      this._error(new Error("Arrays are not supported."));
      return;
    }
    var h = this._multiPartHeader(u, m, r), v = this._multiPartFooter();
    c(h), c(m), c(v), this._trackLength(h, m, r);
  }, l.prototype._trackLength = function(u, m, r) {
    var c = 0;
    r.knownLength != null ? c += +r.knownLength : Buffer.isBuffer(m) ? c = m.length : typeof m == "string" && (c = Buffer.byteLength(m)), this._valueLength += c, this._overheadLength += Buffer.byteLength(u) + l.LINE_BREAK.length, !(!m || !m.path && !(m.readable && m.hasOwnProperty("httpVersion")) && !(m instanceof x)) && (r.knownLength || this._valuesToMeasure.push(m));
  }, l.prototype._lengthRetriever = function(u, m) {
    u.hasOwnProperty("fd") ? u.end != null && u.end != 1 / 0 && u.start != null ? m(null, u.end + 1 - (u.start ? u.start : 0)) : s.stat(u.path, function(r, c) {
      var h;
      if (r) {
        m(r);
        return;
      }
      h = c.size - (u.start ? u.start : 0), m(null, h);
    }) : u.hasOwnProperty("httpVersion") ? m(null, +u.headers["content-length"]) : u.hasOwnProperty("httpModule") ? (u.on("response", function(r) {
      u.pause(), m(null, +r.headers["content-length"]);
    }), u.resume()) : m("Unknown stream");
  }, l.prototype._multiPartHeader = function(u, m, r) {
    if (typeof r.header == "string")
      return r.header;
    var c = this._getContentDisposition(m, r), h = this._getContentType(m, r), v = "", y = {
      // add custom disposition as third element or keep it two elements if not
      "Content-Disposition": ["form-data", 'name="' + u + '"'].concat(c || []),
      // if no content type. allow it to be empty array
      "Content-Type": [].concat(h || [])
    };
    typeof r.header == "object" && p(y, r.header);
    var w;
    for (var C in y)
      y.hasOwnProperty(C) && (w = y[C], w != null && (Array.isArray(w) || (w = [w]), w.length && (v += C + ": " + w.join("; ") + l.LINE_BREAK)));
    return "--" + this.getBoundary() + l.LINE_BREAK + v + l.LINE_BREAK;
  }, l.prototype._getContentDisposition = function(u, m) {
    var r, c;
    return typeof m.filepath == "string" ? r = i.normalize(m.filepath).replace(/\\/g, "/") : m.filename || u.name || u.path ? r = i.basename(m.filename || u.name || u.path) : u.readable && u.hasOwnProperty("httpVersion") && (r = i.basename(u.client._httpMessage.path || "")), r && (c = 'filename="' + r + '"'), c;
  }, l.prototype._getContentType = function(u, m) {
    var r = m.contentType;
    return !r && u.name && (r = d.lookup(u.name)), !r && u.path && (r = d.lookup(u.path)), !r && u.readable && u.hasOwnProperty("httpVersion") && (r = u.headers["content-type"]), !r && (m.filepath || m.filename) && (r = d.lookup(m.filepath || m.filename)), !r && typeof u == "object" && (r = l.DEFAULT_CONTENT_TYPE), r;
  }, l.prototype._multiPartFooter = function() {
    return (function(u) {
      var m = l.LINE_BREAK, r = this._streams.length === 0;
      r && (m += this._lastBoundary()), u(m);
    }).bind(this);
  }, l.prototype._lastBoundary = function() {
    return "--" + this.getBoundary() + "--" + l.LINE_BREAK;
  }, l.prototype.getHeaders = function(u) {
    var m, r = {
      "content-type": "multipart/form-data; boundary=" + this.getBoundary()
    };
    for (m in u)
      u.hasOwnProperty(m) && (r[m.toLowerCase()] = u[m]);
    return r;
  }, l.prototype.setBoundary = function(u) {
    this._boundary = u;
  }, l.prototype.getBoundary = function() {
    return this._boundary || this._generateBoundary(), this._boundary;
  }, l.prototype.getBuffer = function() {
    for (var u = new Buffer.alloc(0), m = this.getBoundary(), r = 0, c = this._streams.length; r < c; r++)
      typeof this._streams[r] != "function" && (Buffer.isBuffer(this._streams[r]) ? u = Buffer.concat([u, this._streams[r]]) : u = Buffer.concat([u, Buffer.from(this._streams[r])]), (typeof this._streams[r] != "string" || this._streams[r].substring(2, m.length + 2) !== m) && (u = Buffer.concat([u, Buffer.from(l.LINE_BREAK)])));
    return Buffer.concat([u, Buffer.from(this._lastBoundary())]);
  }, l.prototype._generateBoundary = function() {
    for (var u = "--------------------------", m = 0; m < 24; m++)
      u += Math.floor(Math.random() * 10).toString(16);
    this._boundary = u;
  }, l.prototype.getLengthSync = function() {
    var u = this._overheadLength + this._valueLength;
    return this._streams.length && (u += this._lastBoundary().length), this.hasKnownLength() || this._error(new Error("Cannot calculate proper length in synchronous way.")), u;
  }, l.prototype.hasKnownLength = function() {
    var u = !0;
    return this._valuesToMeasure.length && (u = !1), u;
  }, l.prototype.getLength = function(u) {
    var m = this._overheadLength + this._valueLength;
    if (this._streams.length && (m += this._lastBoundary().length), !this._valuesToMeasure.length) {
      process.nextTick(u.bind(this, null, m));
      return;
    }
    f.parallel(this._valuesToMeasure, this._lengthRetriever, function(r, c) {
      if (r) {
        u(r);
        return;
      }
      c.forEach(function(h) {
        m += h;
      }), u(null, m);
    });
  }, l.prototype.submit = function(u, m) {
    var r, c, h = { method: "post" };
    return typeof u == "string" ? (u = o(u), c = p({
      port: u.port,
      path: u.pathname,
      host: u.hostname,
      protocol: u.protocol
    }, h)) : (c = p(u, h), c.port || (c.port = c.protocol == "https:" ? 443 : 80)), c.headers = this.getHeaders(u.headers), c.protocol == "https:" ? r = t.request(c) : r = a.request(c), this.getLength((function(v, y) {
      if (v && v !== "Unknown stream") {
        this._error(v);
        return;
      }
      if (y && r.setHeader("Content-Length", y), this.pipe(r), m) {
        var w, C = function(S, F) {
          return r.removeListener("error", C), r.removeListener("response", w), m.call(this, S, F);
        };
        w = C.bind(this, null), r.on("error", C), r.on("response", w);
      }
    }).bind(this)), r;
  }, l.prototype._error = function(u) {
    this.error || (this.error = u, this.pause(), this.emit("error", u));
  }, l.prototype.toString = function() {
    return "[object FormData]";
  }, ta;
}
var Uo = Io();
const It = /* @__PURE__ */ Ze(Uo);
function ga(n) {
  return _.isPlainObject(n) || _.isArray(n);
}
function Ut(n) {
  return _.endsWith(n, "[]") ? n.slice(0, -2) : n;
}
function qi(n, e, i) {
  return n ? n.concat(e).map(function(t, o) {
    return t = Ut(t), !i && o ? "[" + t + "]" : t;
  }).join(i ? "." : "") : e;
}
function zo(n) {
  return _.isArray(n) && !n.some(ga);
}
const Bo = _.toFlatObject(_, {}, null, function(e) {
  return /^is[A-Z]/.test(e);
});
function jn(n, e, i) {
  if (!_.isObject(n))
    throw new TypeError("target must be an object");
  e = e || new (It || FormData)(), i = _.toFlatObject(i, {
    metaTokens: !0,
    dots: !1,
    indexes: !1
  }, !1, function(c, h) {
    return !_.isUndefined(h[c]);
  });
  const a = i.metaTokens, t = i.visitor || p, o = i.dots, s = i.indexes, d = (i.Blob || typeof Blob < "u" && Blob) && _.isSpecCompliantForm(e);
  if (!_.isFunction(t))
    throw new TypeError("visitor must be a function");
  function f(r) {
    if (r === null) return "";
    if (_.isDate(r))
      return r.toISOString();
    if (!d && _.isBlob(r))
      throw new I("Blob is not supported. Use a Buffer instead.");
    return _.isArrayBuffer(r) || _.isTypedArray(r) ? d && typeof Blob == "function" ? new Blob([r]) : Buffer.from(r) : r;
  }
  function p(r, c, h) {
    let v = r;
    if (r && !h && typeof r == "object") {
      if (_.endsWith(c, "{}"))
        c = a ? c : c.slice(0, -2), r = JSON.stringify(r);
      else if (_.isArray(r) && zo(r) || (_.isFileList(r) || _.endsWith(c, "[]")) && (v = _.toArray(r)))
        return c = Ut(c), v.forEach(function(w, C) {
          !(_.isUndefined(w) || w === null) && e.append(
            // eslint-disable-next-line no-nested-ternary
            s === !0 ? qi([c], C, o) : s === null ? c : c + "[]",
            f(w)
          );
        }), !1;
    }
    return ga(r) ? !0 : (e.append(qi(h, c, o), f(r)), !1);
  }
  const l = [], u = Object.assign(Bo, {
    defaultVisitor: p,
    convertValue: f,
    isVisitable: ga
  });
  function m(r, c) {
    if (!_.isUndefined(r)) {
      if (l.indexOf(r) !== -1)
        throw Error("Circular reference detected in " + c.join("."));
      l.push(r), _.forEach(r, function(v, y) {
        (!(_.isUndefined(v) || v === null) && t.call(
          e,
          v,
          _.isString(y) ? y.trim() : y,
          c,
          u
        )) === !0 && m(v, c ? c.concat(y) : [y]);
      }), l.pop();
    }
  }
  if (!_.isObject(n))
    throw new TypeError("data must be an object");
  return m(n), e;
}
function Fi(n) {
  const e = {
    "!": "%21",
    "'": "%27",
    "(": "%28",
    ")": "%29",
    "~": "%7E",
    "%20": "+",
    "%00": "\0"
  };
  return encodeURIComponent(n).replace(/[!'()~]|%20|%00/g, function(a) {
    return e[a];
  });
}
function zt(n, e) {
  this._pairs = [], n && jn(n, this, e);
}
const Bt = zt.prototype;
Bt.append = function(e, i) {
  this._pairs.push([e, i]);
};
Bt.toString = function(e) {
  const i = e ? function(a) {
    return e.call(this, a, Fi);
  } : Fi;
  return this._pairs.map(function(t) {
    return i(t[0]) + "=" + i(t[1]);
  }, "").join("&");
};
function $o(n) {
  return encodeURIComponent(n).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
}
function La(n, e, i) {
  if (!e)
    return n;
  const a = i && i.encode || $o;
  _.isFunction(i) && (i = {
    serialize: i
  });
  const t = i && i.serialize;
  let o;
  if (t ? o = t(e, i) : o = _.isURLSearchParams(e) ? e.toString() : new zt(e, i).toString(a), o) {
    const s = n.indexOf("#");
    s !== -1 && (n = n.slice(0, s)), n += (n.indexOf("?") === -1 ? "?" : "&") + o;
  }
  return n;
}
class Li {
  constructor() {
    this.handlers = [];
  }
  /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   *
   * @return {Number} An ID used to remove interceptor later
   */
  use(e, i, a) {
    return this.handlers.push({
      fulfilled: e,
      rejected: i,
      synchronous: a ? a.synchronous : !1,
      runWhen: a ? a.runWhen : null
    }), this.handlers.length - 1;
  }
  /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   *
   * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
   */
  eject(e) {
    this.handlers[e] && (this.handlers[e] = null);
  }
  /**
   * Clear all interceptors from the stack
   *
   * @returns {void}
   */
  clear() {
    this.handlers && (this.handlers = []);
  }
  /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   *
   * @returns {void}
   */
  forEach(e) {
    _.forEach(this.handlers, function(a) {
      a !== null && e(a);
    });
  }
}
const Da = {
  silentJSONParsing: !0,
  forcedJSONParsing: !0,
  clarifyTimeoutError: !1
}, Mo = En.URLSearchParams, sa = "abcdefghijklmnopqrstuvwxyz", Di = "0123456789", $t = {
  DIGIT: Di,
  ALPHA: sa,
  ALPHA_DIGIT: sa + sa.toUpperCase() + Di
}, Ho = (n = 16, e = $t.ALPHA_DIGIT) => {
  let i = "";
  const { length: a } = e, t = new Uint32Array(n);
  Xe.randomFillSync(t);
  for (let o = 0; o < n; o++)
    i += e[t[o] % a];
  return i;
}, Vo = {
  isNode: !0,
  classes: {
    URLSearchParams: Mo,
    FormData: It,
    Blob: typeof Blob < "u" && Blob || null
  },
  ALPHABET: $t,
  generateString: Ho,
  protocols: ["http", "https", "file", "data"]
}, Na = typeof window < "u" && typeof document < "u", ya = typeof navigator == "object" && navigator || void 0, Wo = Na && (!ya || ["ReactNative", "NativeScript", "NS"].indexOf(ya.product) < 0), Ko = typeof WorkerGlobalScope < "u" && // eslint-disable-next-line no-undef
self instanceof WorkerGlobalScope && typeof self.importScripts == "function", Jo = Na && window.location.href || "http://localhost", Go = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  hasBrowserEnv: Na,
  hasStandardBrowserEnv: Wo,
  hasStandardBrowserWebWorkerEnv: Ko,
  navigator: ya,
  origin: Jo
}, Symbol.toStringTag, { value: "Module" })), Z = {
  ...Go,
  ...Vo
};
function Yo(n, e) {
  return jn(n, new Z.classes.URLSearchParams(), Object.assign({
    visitor: function(i, a, t, o) {
      return Z.isNode && _.isBuffer(i) ? (this.append(a, i.toString("base64")), !1) : o.defaultVisitor.apply(this, arguments);
    }
  }, e));
}
function Xo(n) {
  return _.matchAll(/\w+|\[(\w*)]/g, n).map((e) => e[0] === "[]" ? "" : e[1] || e[0]);
}
function Zo(n) {
  const e = {}, i = Object.keys(n);
  let a;
  const t = i.length;
  let o;
  for (a = 0; a < t; a++)
    o = i[a], e[o] = n[o];
  return e;
}
function Mt(n) {
  function e(i, a, t, o) {
    let s = i[o++];
    if (s === "__proto__") return !0;
    const x = Number.isFinite(+s), d = o >= i.length;
    return s = !s && _.isArray(t) ? t.length : s, d ? (_.hasOwnProp(t, s) ? t[s] = [t[s], a] : t[s] = a, !x) : ((!t[s] || !_.isObject(t[s])) && (t[s] = []), e(i, a, t[s], o) && _.isArray(t[s]) && (t[s] = Zo(t[s])), !x);
  }
  if (_.isFormData(n) && _.isFunction(n.entries)) {
    const i = {};
    return _.forEachEntry(n, (a, t) => {
      e(Xo(a), t, i, 0);
    }), i;
  }
  return null;
}
function Qo(n, e, i) {
  if (_.isString(n))
    try {
      return (e || JSON.parse)(n), _.trim(n);
    } catch (a) {
      if (a.name !== "SyntaxError")
        throw a;
    }
  return (i || JSON.stringify)(n);
}
const nn = {
  transitional: Da,
  adapter: ["xhr", "http", "fetch"],
  transformRequest: [function(e, i) {
    const a = i.getContentType() || "", t = a.indexOf("application/json") > -1, o = _.isObject(e);
    if (o && _.isHTMLForm(e) && (e = new FormData(e)), _.isFormData(e))
      return t ? JSON.stringify(Mt(e)) : e;
    if (_.isArrayBuffer(e) || _.isBuffer(e) || _.isStream(e) || _.isFile(e) || _.isBlob(e) || _.isReadableStream(e))
      return e;
    if (_.isArrayBufferView(e))
      return e.buffer;
    if (_.isURLSearchParams(e))
      return i.setContentType("application/x-www-form-urlencoded;charset=utf-8", !1), e.toString();
    let x;
    if (o) {
      if (a.indexOf("application/x-www-form-urlencoded") > -1)
        return Yo(e, this.formSerializer).toString();
      if ((x = _.isFileList(e)) || a.indexOf("multipart/form-data") > -1) {
        const d = this.env && this.env.FormData;
        return jn(
          x ? { "files[]": e } : e,
          d && new d(),
          this.formSerializer
        );
      }
    }
    return o || t ? (i.setContentType("application/json", !1), Qo(e)) : e;
  }],
  transformResponse: [function(e) {
    const i = this.transitional || nn.transitional, a = i && i.forcedJSONParsing, t = this.responseType === "json";
    if (_.isResponse(e) || _.isReadableStream(e))
      return e;
    if (e && _.isString(e) && (a && !this.responseType || t)) {
      const s = !(i && i.silentJSONParsing) && t;
      try {
        return JSON.parse(e);
      } catch (x) {
        if (s)
          throw x.name === "SyntaxError" ? I.from(x, I.ERR_BAD_RESPONSE, this, null, this.response) : x;
      }
    }
    return e;
  }],
  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  maxContentLength: -1,
  maxBodyLength: -1,
  env: {
    FormData: Z.classes.FormData,
    Blob: Z.classes.Blob
  },
  validateStatus: function(e) {
    return e >= 200 && e < 300;
  },
  headers: {
    common: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": void 0
    }
  }
};
_.forEach(["delete", "get", "head", "post", "put", "patch"], (n) => {
  nn.headers[n] = {};
});
const er = _.toObjectSet([
  "age",
  "authorization",
  "content-length",
  "content-type",
  "etag",
  "expires",
  "from",
  "host",
  "if-modified-since",
  "if-unmodified-since",
  "last-modified",
  "location",
  "max-forwards",
  "proxy-authorization",
  "referer",
  "retry-after",
  "user-agent"
]), nr = (n) => {
  const e = {};
  let i, a, t;
  return n && n.split(`
`).forEach(function(s) {
    t = s.indexOf(":"), i = s.substring(0, t).trim().toLowerCase(), a = s.substring(t + 1).trim(), !(!i || e[i] && er[i]) && (i === "set-cookie" ? e[i] ? e[i].push(a) : e[i] = [a] : e[i] = e[i] ? e[i] + ", " + a : a);
  }), e;
}, Ni = Symbol("internals");
function Ke(n) {
  return n && String(n).trim().toLowerCase();
}
function xn(n) {
  return n === !1 || n == null ? n : _.isArray(n) ? n.map(xn) : String(n);
}
function ar(n) {
  const e = /* @__PURE__ */ Object.create(null), i = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let a;
  for (; a = i.exec(n); )
    e[a[1]] = a[2];
  return e;
}
const ir = (n) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(n.trim());
function oa(n, e, i, a, t) {
  if (_.isFunction(a))
    return a.call(this, e, i);
  if (t && (e = i), !!_.isString(e)) {
    if (_.isString(a))
      return e.indexOf(a) !== -1;
    if (_.isRegExp(a))
      return a.test(e);
  }
}
function tr(n) {
  return n.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (e, i, a) => i.toUpperCase() + a);
}
function sr(n, e) {
  const i = _.toCamelCase(" " + e);
  ["get", "set", "has"].forEach((a) => {
    Object.defineProperty(n, a + i, {
      value: function(t, o, s) {
        return this[a].call(this, e, t, o, s);
      },
      configurable: !0
    });
  });
}
let ne = class {
  constructor(e) {
    e && this.set(e);
  }
  set(e, i, a) {
    const t = this;
    function o(x, d, f) {
      const p = Ke(d);
      if (!p)
        throw new Error("header name must be a non-empty string");
      const l = _.findKey(t, p);
      (!l || t[l] === void 0 || f === !0 || f === void 0 && t[l] !== !1) && (t[l || d] = xn(x));
    }
    const s = (x, d) => _.forEach(x, (f, p) => o(f, p, d));
    if (_.isPlainObject(e) || e instanceof this.constructor)
      s(e, i);
    else if (_.isString(e) && (e = e.trim()) && !ir(e))
      s(nr(e), i);
    else if (_.isObject(e) && _.isIterable(e)) {
      let x = {}, d, f;
      for (const p of e) {
        if (!_.isArray(p))
          throw TypeError("Object iterator must return a key-value pair");
        x[f = p[0]] = (d = x[f]) ? _.isArray(d) ? [...d, p[1]] : [d, p[1]] : p[1];
      }
      s(x, i);
    } else
      e != null && o(i, e, a);
    return this;
  }
  get(e, i) {
    if (e = Ke(e), e) {
      const a = _.findKey(this, e);
      if (a) {
        const t = this[a];
        if (!i)
          return t;
        if (i === !0)
          return ar(t);
        if (_.isFunction(i))
          return i.call(this, t, a);
        if (_.isRegExp(i))
          return i.exec(t);
        throw new TypeError("parser must be boolean|regexp|function");
      }
    }
  }
  has(e, i) {
    if (e = Ke(e), e) {
      const a = _.findKey(this, e);
      return !!(a && this[a] !== void 0 && (!i || oa(this, this[a], a, i)));
    }
    return !1;
  }
  delete(e, i) {
    const a = this;
    let t = !1;
    function o(s) {
      if (s = Ke(s), s) {
        const x = _.findKey(a, s);
        x && (!i || oa(a, a[x], x, i)) && (delete a[x], t = !0);
      }
    }
    return _.isArray(e) ? e.forEach(o) : o(e), t;
  }
  clear(e) {
    const i = Object.keys(this);
    let a = i.length, t = !1;
    for (; a--; ) {
      const o = i[a];
      (!e || oa(this, this[o], o, e, !0)) && (delete this[o], t = !0);
    }
    return t;
  }
  normalize(e) {
    const i = this, a = {};
    return _.forEach(this, (t, o) => {
      const s = _.findKey(a, o);
      if (s) {
        i[s] = xn(t), delete i[o];
        return;
      }
      const x = e ? tr(o) : String(o).trim();
      x !== o && delete i[o], i[x] = xn(t), a[x] = !0;
    }), this;
  }
  concat(...e) {
    return this.constructor.concat(this, ...e);
  }
  toJSON(e) {
    const i = /* @__PURE__ */ Object.create(null);
    return _.forEach(this, (a, t) => {
      a != null && a !== !1 && (i[t] = e && _.isArray(a) ? a.join(", ") : a);
    }), i;
  }
  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]();
  }
  toString() {
    return Object.entries(this.toJSON()).map(([e, i]) => e + ": " + i).join(`
`);
  }
  getSetCookie() {
    return this.get("set-cookie") || [];
  }
  get [Symbol.toStringTag]() {
    return "AxiosHeaders";
  }
  static from(e) {
    return e instanceof this ? e : new this(e);
  }
  static concat(e, ...i) {
    const a = new this(e);
    return i.forEach((t) => a.set(t)), a;
  }
  static accessor(e) {
    const a = (this[Ni] = this[Ni] = {
      accessors: {}
    }).accessors, t = this.prototype;
    function o(s) {
      const x = Ke(s);
      a[x] || (sr(t, s), a[x] = !0);
    }
    return _.isArray(e) ? e.forEach(o) : o(e), this;
  }
};
ne.accessor(["Content-Type", "Content-Length", "Accept", "Accept-Encoding", "User-Agent", "Authorization"]);
_.reduceDescriptors(ne.prototype, ({ value: n }, e) => {
  let i = e[0].toUpperCase() + e.slice(1);
  return {
    get: () => n,
    set(a) {
      this[i] = a;
    }
  };
});
_.freezeMethods(ne);
function ra(n, e) {
  const i = this || nn, a = e || i, t = ne.from(a.headers);
  let o = a.data;
  return _.forEach(n, function(x) {
    o = x.call(i, o, t.normalize(), e ? e.status : void 0);
  }), t.normalize(), o;
}
function Ht(n) {
  return !!(n && n.__CANCEL__);
}
function he(n, e, i) {
  I.call(this, n ?? "canceled", I.ERR_CANCELED, e, i), this.name = "CanceledError";
}
_.inherits(he, I, {
  __CANCEL__: !0
});
function Re(n, e, i) {
  const a = i.config.validateStatus;
  !i.status || !a || a(i.status) ? n(i) : e(new I(
    "Request failed with status code " + i.status,
    [I.ERR_BAD_REQUEST, I.ERR_BAD_RESPONSE][Math.floor(i.status / 100) - 4],
    i.config,
    i.request,
    i
  ));
}
function or(n) {
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(n);
}
function rr(n, e) {
  return e ? n.replace(/\/?\/$/, "") + "/" + e.replace(/^\/+/, "") : n;
}
function Ia(n, e, i) {
  let a = !or(e);
  return n && (a || i == !1) ? rr(n, e) : e;
}
var ca = {}, Ii;
function cr() {
  if (Ii) return ca;
  Ii = 1;
  var n = En.parse, e = {
    ftp: 21,
    gopher: 70,
    http: 80,
    https: 443,
    ws: 80,
    wss: 443
  }, i = String.prototype.endsWith || function(s) {
    return s.length <= this.length && this.indexOf(s, this.length - s.length) !== -1;
  };
  function a(s) {
    var x = typeof s == "string" ? n(s) : s || {}, d = x.protocol, f = x.host, p = x.port;
    if (typeof f != "string" || !f || typeof d != "string" || (d = d.split(":", 1)[0], f = f.replace(/:\d*$/, ""), p = parseInt(p) || e[d] || 0, !t(f, p)))
      return "";
    var l = o("npm_config_" + d + "_proxy") || o(d + "_proxy") || o("npm_config_proxy") || o("all_proxy");
    return l && l.indexOf("://") === -1 && (l = d + "://" + l), l;
  }
  function t(s, x) {
    var d = (o("npm_config_no_proxy") || o("no_proxy")).toLowerCase();
    return d ? d === "*" ? !1 : d.split(/[,\s]/).every(function(f) {
      if (!f)
        return !0;
      var p = f.match(/^(.+):(\d+)$/), l = p ? p[1] : f, u = p ? parseInt(p[2]) : 0;
      return u && u !== x ? !0 : /^[.*]/.test(l) ? (l.charAt(0) === "*" && (l = l.slice(1)), !i.call(s, l)) : s !== l;
    }) : !0;
  }
  function o(s) {
    return process.env[s.toLowerCase()] || process.env[s.toUpperCase()] || "";
  }
  return ca.getProxyForUrl = a, ca;
}
var pr = cr();
const lr = /* @__PURE__ */ Ze(pr);
var rn = { exports: {} }, cn = { exports: {} }, pn = { exports: {} }, pa, Ui;
function ur() {
  if (Ui) return pa;
  Ui = 1;
  var n = 1e3, e = n * 60, i = e * 60, a = i * 24, t = a * 7, o = a * 365.25;
  pa = function(p, l) {
    l = l || {};
    var u = typeof p;
    if (u === "string" && p.length > 0)
      return s(p);
    if (u === "number" && isFinite(p))
      return l.long ? d(p) : x(p);
    throw new Error(
      "val is not a non-empty string or a valid number. val=" + JSON.stringify(p)
    );
  };
  function s(p) {
    if (p = String(p), !(p.length > 100)) {
      var l = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        p
      );
      if (l) {
        var u = parseFloat(l[1]), m = (l[2] || "ms").toLowerCase();
        switch (m) {
          case "years":
          case "year":
          case "yrs":
          case "yr":
          case "y":
            return u * o;
          case "weeks":
          case "week":
          case "w":
            return u * t;
          case "days":
          case "day":
          case "d":
            return u * a;
          case "hours":
          case "hour":
          case "hrs":
          case "hr":
          case "h":
            return u * i;
          case "minutes":
          case "minute":
          case "mins":
          case "min":
          case "m":
            return u * e;
          case "seconds":
          case "second":
          case "secs":
          case "sec":
          case "s":
            return u * n;
          case "milliseconds":
          case "millisecond":
          case "msecs":
          case "msec":
          case "ms":
            return u;
          default:
            return;
        }
      }
    }
  }
  function x(p) {
    var l = Math.abs(p);
    return l >= a ? Math.round(p / a) + "d" : l >= i ? Math.round(p / i) + "h" : l >= e ? Math.round(p / e) + "m" : l >= n ? Math.round(p / n) + "s" : p + "ms";
  }
  function d(p) {
    var l = Math.abs(p);
    return l >= a ? f(p, l, a, "day") : l >= i ? f(p, l, i, "hour") : l >= e ? f(p, l, e, "minute") : l >= n ? f(p, l, n, "second") : p + " ms";
  }
  function f(p, l, u, m) {
    var r = l >= u * 1.5;
    return Math.round(p / u) + " " + m + (r ? "s" : "");
  }
  return pa;
}
var la, zi;
function Vt() {
  if (zi) return la;
  zi = 1;
  function n(e) {
    a.debug = a, a.default = a, a.coerce = f, a.disable = s, a.enable = o, a.enabled = x, a.humanize = ur(), a.destroy = p, Object.keys(e).forEach((l) => {
      a[l] = e[l];
    }), a.names = [], a.skips = [], a.formatters = {};
    function i(l) {
      let u = 0;
      for (let m = 0; m < l.length; m++)
        u = (u << 5) - u + l.charCodeAt(m), u |= 0;
      return a.colors[Math.abs(u) % a.colors.length];
    }
    a.selectColor = i;
    function a(l) {
      let u, m = null, r, c;
      function h(...v) {
        if (!h.enabled)
          return;
        const y = h, w = Number(/* @__PURE__ */ new Date()), C = w - (u || w);
        y.diff = C, y.prev = u, y.curr = w, u = w, v[0] = a.coerce(v[0]), typeof v[0] != "string" && v.unshift("%O");
        let S = 0;
        v[0] = v[0].replace(/%([a-zA-Z%])/g, (R, T) => {
          if (R === "%%")
            return "%";
          S++;
          const P = a.formatters[T];
          if (typeof P == "function") {
            const O = v[S];
            R = P.call(y, O), v.splice(S, 1), S--;
          }
          return R;
        }), a.formatArgs.call(y, v), (y.log || a.log).apply(y, v);
      }
      return h.namespace = l, h.useColors = a.useColors(), h.color = a.selectColor(l), h.extend = t, h.destroy = a.destroy, Object.defineProperty(h, "enabled", {
        enumerable: !0,
        configurable: !1,
        get: () => m !== null ? m : (r !== a.namespaces && (r = a.namespaces, c = a.enabled(l)), c),
        set: (v) => {
          m = v;
        }
      }), typeof a.init == "function" && a.init(h), h;
    }
    function t(l, u) {
      const m = a(this.namespace + (typeof u > "u" ? ":" : u) + l);
      return m.log = this.log, m;
    }
    function o(l) {
      a.save(l), a.namespaces = l, a.names = [], a.skips = [];
      let u;
      const m = (typeof l == "string" ? l : "").split(/[\s,]+/), r = m.length;
      for (u = 0; u < r; u++)
        m[u] && (l = m[u].replace(/\*/g, ".*?"), l[0] === "-" ? a.skips.push(new RegExp("^" + l.slice(1) + "$")) : a.names.push(new RegExp("^" + l + "$")));
    }
    function s() {
      const l = [
        ...a.names.map(d),
        ...a.skips.map(d).map((u) => "-" + u)
      ].join(",");
      return a.enable(""), l;
    }
    function x(l) {
      if (l[l.length - 1] === "*")
        return !0;
      let u, m;
      for (u = 0, m = a.skips.length; u < m; u++)
        if (a.skips[u].test(l))
          return !1;
      for (u = 0, m = a.names.length; u < m; u++)
        if (a.names[u].test(l))
          return !0;
      return !1;
    }
    function d(l) {
      return l.toString().substring(2, l.toString().length - 2).replace(/\.\*\?$/, "*");
    }
    function f(l) {
      return l instanceof Error ? l.stack || l.message : l;
    }
    function p() {
      console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
    }
    return a.enable(a.load()), a;
  }
  return la = n, la;
}
var Bi;
function dr() {
  return Bi || (Bi = 1, function(n, e) {
    e.formatArgs = a, e.save = t, e.load = o, e.useColors = i, e.storage = s(), e.destroy = /* @__PURE__ */ (() => {
      let d = !1;
      return () => {
        d || (d = !0, console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."));
      };
    })(), e.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function i() {
      if (typeof window < "u" && window.process && (window.process.type === "renderer" || window.process.__nwjs))
        return !0;
      if (typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))
        return !1;
      let d;
      return typeof document < "u" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window < "u" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator < "u" && navigator.userAgent && (d = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(d[1], 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function a(d) {
      if (d[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + d[0] + (this.useColors ? "%c " : " ") + "+" + n.exports.humanize(this.diff), !this.useColors)
        return;
      const f = "color: " + this.color;
      d.splice(1, 0, f, "color: inherit");
      let p = 0, l = 0;
      d[0].replace(/%[a-zA-Z%]/g, (u) => {
        u !== "%%" && (p++, u === "%c" && (l = p));
      }), d.splice(l, 0, f);
    }
    e.log = console.debug || console.log || (() => {
    });
    function t(d) {
      try {
        d ? e.storage.setItem("debug", d) : e.storage.removeItem("debug");
      } catch {
      }
    }
    function o() {
      let d;
      try {
        d = e.storage.getItem("debug");
      } catch {
      }
      return !d && typeof process < "u" && "env" in process && (d = process.env.DEBUG), d;
    }
    function s() {
      try {
        return localStorage;
      } catch {
      }
    }
    n.exports = Vt()(e);
    const { formatters: x } = n.exports;
    x.j = function(d) {
      try {
        return JSON.stringify(d);
      } catch (f) {
        return "[UnexpectedJSONParseError]: " + f.message;
      }
    };
  }(pn, pn.exports)), pn.exports;
}
var ln = { exports: {} }, ua, $i;
function mr() {
  return $i || ($i = 1, ua = (n, e = process.argv) => {
    const i = n.startsWith("-") ? "" : n.length === 1 ? "-" : "--", a = e.indexOf(i + n), t = e.indexOf("--");
    return a !== -1 && (t === -1 || a < t);
  }), ua;
}
var da, Mi;
function fr() {
  if (Mi) return da;
  Mi = 1;
  const n = Sa, e = Ta, i = mr(), { env: a } = process;
  let t;
  i("no-color") || i("no-colors") || i("color=false") || i("color=never") ? t = 0 : (i("color") || i("colors") || i("color=true") || i("color=always")) && (t = 1), "FORCE_COLOR" in a && (a.FORCE_COLOR === "true" ? t = 1 : a.FORCE_COLOR === "false" ? t = 0 : t = a.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(a.FORCE_COLOR, 10), 3));
  function o(d) {
    return d === 0 ? !1 : {
      level: d,
      hasBasic: !0,
      has256: d >= 2,
      has16m: d >= 3
    };
  }
  function s(d, f) {
    if (t === 0)
      return 0;
    if (i("color=16m") || i("color=full") || i("color=truecolor"))
      return 3;
    if (i("color=256"))
      return 2;
    if (d && !f && t === void 0)
      return 0;
    const p = t || 0;
    if (a.TERM === "dumb")
      return p;
    if (process.platform === "win32") {
      const l = n.release().split(".");
      return Number(l[0]) >= 10 && Number(l[2]) >= 10586 ? Number(l[2]) >= 14931 ? 3 : 2 : 1;
    }
    if ("CI" in a)
      return ["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((l) => l in a) || a.CI_NAME === "codeship" ? 1 : p;
    if ("TEAMCITY_VERSION" in a)
      return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(a.TEAMCITY_VERSION) ? 1 : 0;
    if (a.COLORTERM === "truecolor")
      return 3;
    if ("TERM_PROGRAM" in a) {
      const l = parseInt((a.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
      switch (a.TERM_PROGRAM) {
        case "iTerm.app":
          return l >= 3 ? 3 : 2;
        case "Apple_Terminal":
          return 2;
      }
    }
    return /-256(color)?$/i.test(a.TERM) ? 2 : /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(a.TERM) || "COLORTERM" in a ? 1 : p;
  }
  function x(d) {
    const f = s(d, d && d.isTTY);
    return o(f);
  }
  return da = {
    supportsColor: x,
    stdout: o(s(!0, e.isatty(1))),
    stderr: o(s(!0, e.isatty(2)))
  }, da;
}
var Hi;
function hr() {
  return Hi || (Hi = 1, function(n, e) {
    const i = Ta, a = xe;
    e.init = p, e.log = x, e.formatArgs = o, e.save = d, e.load = f, e.useColors = t, e.destroy = a.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    ), e.colors = [6, 2, 3, 4, 5, 1];
    try {
      const u = fr();
      u && (u.stderr || u).level >= 2 && (e.colors = [
        20,
        21,
        26,
        27,
        32,
        33,
        38,
        39,
        40,
        41,
        42,
        43,
        44,
        45,
        56,
        57,
        62,
        63,
        68,
        69,
        74,
        75,
        76,
        77,
        78,
        79,
        80,
        81,
        92,
        93,
        98,
        99,
        112,
        113,
        128,
        129,
        134,
        135,
        148,
        149,
        160,
        161,
        162,
        163,
        164,
        165,
        166,
        167,
        168,
        169,
        170,
        171,
        172,
        173,
        178,
        179,
        184,
        185,
        196,
        197,
        198,
        199,
        200,
        201,
        202,
        203,
        204,
        205,
        206,
        207,
        208,
        209,
        214,
        215,
        220,
        221
      ]);
    } catch {
    }
    e.inspectOpts = Object.keys(process.env).filter((u) => /^debug_/i.test(u)).reduce((u, m) => {
      const r = m.substring(6).toLowerCase().replace(/_([a-z])/g, (h, v) => v.toUpperCase());
      let c = process.env[m];
      return /^(yes|on|true|enabled)$/i.test(c) ? c = !0 : /^(no|off|false|disabled)$/i.test(c) ? c = !1 : c === "null" ? c = null : c = Number(c), u[r] = c, u;
    }, {});
    function t() {
      return "colors" in e.inspectOpts ? !!e.inspectOpts.colors : i.isatty(process.stderr.fd);
    }
    function o(u) {
      const { namespace: m, useColors: r } = this;
      if (r) {
        const c = this.color, h = "\x1B[3" + (c < 8 ? c : "8;5;" + c), v = `  ${h};1m${m} \x1B[0m`;
        u[0] = v + u[0].split(`
`).join(`
` + v), u.push(h + "m+" + n.exports.humanize(this.diff) + "\x1B[0m");
      } else
        u[0] = s() + m + " " + u[0];
    }
    function s() {
      return e.inspectOpts.hideDate ? "" : (/* @__PURE__ */ new Date()).toISOString() + " ";
    }
    function x(...u) {
      return process.stderr.write(a.formatWithOptions(e.inspectOpts, ...u) + `
`);
    }
    function d(u) {
      u ? process.env.DEBUG = u : delete process.env.DEBUG;
    }
    function f() {
      return process.env.DEBUG;
    }
    function p(u) {
      u.inspectOpts = {};
      const m = Object.keys(e.inspectOpts);
      for (let r = 0; r < m.length; r++)
        u.inspectOpts[m[r]] = e.inspectOpts[m[r]];
    }
    n.exports = Vt()(e);
    const { formatters: l } = n.exports;
    l.o = function(u) {
      return this.inspectOpts.colors = this.useColors, a.inspect(u, this.inspectOpts).split(`
`).map((m) => m.trim()).join(" ");
    }, l.O = function(u) {
      return this.inspectOpts.colors = this.useColors, a.inspect(u, this.inspectOpts);
    };
  }(ln, ln.exports)), ln.exports;
}
var Vi;
function xr() {
  return Vi || (Vi = 1, typeof process > "u" || process.type === "renderer" || process.browser === !0 || process.__nwjs ? cn.exports = dr() : cn.exports = hr()), cn.exports;
}
var ma, Wi;
function vr() {
  if (Wi) return ma;
  Wi = 1;
  var n;
  return ma = function() {
    if (!n) {
      try {
        n = xr()("follow-redirects");
      } catch {
      }
      typeof n != "function" && (n = function() {
      });
    }
    n.apply(null, arguments);
  }, ma;
}
var Ki;
function br() {
  if (Ki) return rn.exports;
  Ki = 1;
  var n = En, e = n.URL, i = Ra, a = Aa, t = re.Writable, o = ys, s = vr();
  (function() {
    var A = typeof process < "u", j = typeof window < "u" && typeof document < "u", D = k(Error.captureStackTrace);
    !A && (j || !D) && console.warn("The follow-redirects package should be excluded from browser builds.");
  })();
  var x = !1;
  try {
    o(new e(""));
  } catch (E) {
    x = E.code === "ERR_INVALID_URL";
  }
  var d = [
    "auth",
    "host",
    "hostname",
    "href",
    "path",
    "pathname",
    "port",
    "protocol",
    "query",
    "search",
    "hash"
  ], f = ["abort", "aborted", "connect", "error", "socket", "timeout"], p = /* @__PURE__ */ Object.create(null);
  f.forEach(function(E) {
    p[E] = function(A, j, D) {
      this._redirectable.emit(E, A, j, D);
    };
  });
  var l = P(
    "ERR_INVALID_URL",
    "Invalid URL",
    TypeError
  ), u = P(
    "ERR_FR_REDIRECTION_FAILURE",
    "Redirected request failed"
  ), m = P(
    "ERR_FR_TOO_MANY_REDIRECTS",
    "Maximum number of redirects exceeded",
    u
  ), r = P(
    "ERR_FR_MAX_BODY_LENGTH_EXCEEDED",
    "Request body larger than maxBodyLength limit"
  ), c = P(
    "ERR_STREAM_WRITE_AFTER_END",
    "write after end"
  ), h = t.prototype.destroy || w;
  function v(E, A) {
    t.call(this), this._sanitizeOptions(E), this._options = E, this._ended = !1, this._ending = !1, this._redirectCount = 0, this._redirects = [], this._requestBodyLength = 0, this._requestBodyBuffers = [], A && this.on("response", A);
    var j = this;
    this._onNativeResponse = function(D) {
      try {
        j._processResponse(D);
      } catch (U) {
        j.emit("error", U instanceof u ? U : new u({ cause: U }));
      }
    }, this._performRequest();
  }
  v.prototype = Object.create(t.prototype), v.prototype.abort = function() {
    O(this._currentRequest), this._currentRequest.abort(), this.emit("abort");
  }, v.prototype.destroy = function(E) {
    return O(this._currentRequest, E), h.call(this, E), this;
  }, v.prototype.write = function(E, A, j) {
    if (this._ending)
      throw new c();
    if (!g(E) && !q(E))
      throw new TypeError("data should be a string, Buffer or Uint8Array");
    if (k(A) && (j = A, A = null), E.length === 0) {
      j && j();
      return;
    }
    this._requestBodyLength + E.length <= this._options.maxBodyLength ? (this._requestBodyLength += E.length, this._requestBodyBuffers.push({ data: E, encoding: A }), this._currentRequest.write(E, A, j)) : (this.emit("error", new r()), this.abort());
  }, v.prototype.end = function(E, A, j) {
    if (k(E) ? (j = E, E = A = null) : k(A) && (j = A, A = null), !E)
      this._ended = this._ending = !0, this._currentRequest.end(null, null, j);
    else {
      var D = this, U = this._currentRequest;
      this.write(E, A, function() {
        D._ended = !0, U.end(null, null, j);
      }), this._ending = !0;
    }
  }, v.prototype.setHeader = function(E, A) {
    this._options.headers[E] = A, this._currentRequest.setHeader(E, A);
  }, v.prototype.removeHeader = function(E) {
    delete this._options.headers[E], this._currentRequest.removeHeader(E);
  }, v.prototype.setTimeout = function(E, A) {
    var j = this;
    function D(z) {
      z.setTimeout(E), z.removeListener("timeout", z.destroy), z.addListener("timeout", z.destroy);
    }
    function U(z) {
      j._timeout && clearTimeout(j._timeout), j._timeout = setTimeout(function() {
        j.emit("timeout"), N();
      }, E), D(z);
    }
    function N() {
      j._timeout && (clearTimeout(j._timeout), j._timeout = null), j.removeListener("abort", N), j.removeListener("error", N), j.removeListener("response", N), j.removeListener("close", N), A && j.removeListener("timeout", A), j.socket || j._currentRequest.removeListener("socket", U);
    }
    return A && this.on("timeout", A), this.socket ? U(this.socket) : this._currentRequest.once("socket", U), this.on("socket", D), this.on("abort", N), this.on("error", N), this.on("response", N), this.on("close", N), this;
  }, [
    "flushHeaders",
    "getHeader",
    "setNoDelay",
    "setSocketKeepAlive"
  ].forEach(function(E) {
    v.prototype[E] = function(A, j) {
      return this._currentRequest[E](A, j);
    };
  }), ["aborted", "connection", "socket"].forEach(function(E) {
    Object.defineProperty(v.prototype, E, {
      get: function() {
        return this._currentRequest[E];
      }
    });
  }), v.prototype._sanitizeOptions = function(E) {
    if (E.headers || (E.headers = {}), E.host && (E.hostname || (E.hostname = E.host), delete E.host), !E.pathname && E.path) {
      var A = E.path.indexOf("?");
      A < 0 ? E.pathname = E.path : (E.pathname = E.path.substring(0, A), E.search = E.path.substring(A));
    }
  }, v.prototype._performRequest = function() {
    var E = this._options.protocol, A = this._options.nativeProtocols[E];
    if (!A)
      throw new TypeError("Unsupported protocol " + E);
    if (this._options.agents) {
      var j = E.slice(0, -1);
      this._options.agent = this._options.agents[j];
    }
    var D = this._currentRequest = A.request(this._options, this._onNativeResponse);
    D._redirectable = this;
    for (var U of f)
      D.on(U, p[U]);
    if (this._currentUrl = /^\//.test(this._options.path) ? n.format(this._options) : (
      // When making a request to a proxy, […]
      // a client MUST send the target URI in absolute-form […].
      this._options.path
    ), this._isRedirect) {
      var N = 0, z = this, W = this._requestBodyBuffers;
      (function Y(B) {
        if (D === z._currentRequest)
          if (B)
            z.emit("error", B);
          else if (N < W.length) {
            var $ = W[N++];
            D.finished || D.write($.data, $.encoding, Y);
          } else z._ended && D.end();
      })();
    }
  }, v.prototype._processResponse = function(E) {
    var A = E.statusCode;
    this._options.trackRedirects && this._redirects.push({
      url: this._currentUrl,
      headers: E.headers,
      statusCode: A
    });
    var j = E.headers.location;
    if (!j || this._options.followRedirects === !1 || A < 300 || A >= 400) {
      E.responseUrl = this._currentUrl, E.redirects = this._redirects, this.emit("response", E), this._requestBodyBuffers = [];
      return;
    }
    if (O(this._currentRequest), E.destroy(), ++this._redirectCount > this._options.maxRedirects)
      throw new m();
    var D, U = this._options.beforeRedirect;
    U && (D = Object.assign({
      // The Host header was set by nativeProtocol.request
      Host: E.req.getHeader("host")
    }, this._options.headers));
    var N = this._options.method;
    ((A === 301 || A === 302) && this._options.method === "POST" || // RFC7231§6.4.4: The 303 (See Other) status code indicates that
    // the server is redirecting the user agent to a different resource […]
    // A user agent can perform a retrieval request targeting that URI
    // (a GET or HEAD request if using HTTP) […]
    A === 303 && !/^(?:GET|HEAD)$/.test(this._options.method)) && (this._options.method = "GET", this._requestBodyBuffers = [], T(/^content-/i, this._options.headers));
    var z = T(/^host$/i, this._options.headers), W = C(this._currentUrl), Y = z || W.host, B = /^\w+:/.test(j) ? this._currentUrl : n.format(Object.assign(W, { host: Y })), $ = S(j, B);
    if (s("redirecting to", $.href), this._isRedirect = !0, R($, this._options), ($.protocol !== W.protocol && $.protocol !== "https:" || $.host !== Y && !b($.host, Y)) && T(/^(?:(?:proxy-)?authorization|cookie)$/i, this._options.headers), k(U)) {
      var Q = {
        headers: E.headers,
        statusCode: A
      }, X = {
        url: B,
        method: N,
        headers: D
      };
      U(this._options, Q, X), this._sanitizeOptions(this._options);
    }
    this._performRequest();
  };
  function y(E) {
    var A = {
      maxRedirects: 21,
      maxBodyLength: 10485760
    }, j = {};
    return Object.keys(E).forEach(function(D) {
      var U = D + ":", N = j[U] = E[D], z = A[D] = Object.create(N);
      function W(B, $, Q) {
        return L(B) ? B = R(B) : g(B) ? B = R(C(B)) : (Q = $, $ = F(B), B = { protocol: U }), k($) && (Q = $, $ = null), $ = Object.assign({
          maxRedirects: A.maxRedirects,
          maxBodyLength: A.maxBodyLength
        }, B, $), $.nativeProtocols = j, !g($.host) && !g($.hostname) && ($.hostname = "::1"), o.equal($.protocol, U, "protocol mismatch"), s("options", $), new v($, Q);
      }
      function Y(B, $, Q) {
        var X = z.request(B, $, Q);
        return X.end(), X;
      }
      Object.defineProperties(z, {
        request: { value: W, configurable: !0, enumerable: !0, writable: !0 },
        get: { value: Y, configurable: !0, enumerable: !0, writable: !0 }
      });
    }), A;
  }
  function w() {
  }
  function C(E) {
    var A;
    if (x)
      A = new e(E);
    else if (A = F(n.parse(E)), !g(A.protocol))
      throw new l({ input: E });
    return A;
  }
  function S(E, A) {
    return x ? new e(E, A) : C(n.resolve(A, E));
  }
  function F(E) {
    if (/^\[/.test(E.hostname) && !/^\[[:0-9a-f]+\]$/i.test(E.hostname))
      throw new l({ input: E.href || E });
    if (/^\[/.test(E.host) && !/^\[[:0-9a-f]+\](:\d+)?$/i.test(E.host))
      throw new l({ input: E.href || E });
    return E;
  }
  function R(E, A) {
    var j = A || {};
    for (var D of d)
      j[D] = E[D];
    return j.hostname.startsWith("[") && (j.hostname = j.hostname.slice(1, -1)), j.port !== "" && (j.port = Number(j.port)), j.path = j.search ? j.pathname + j.search : j.pathname, j;
  }
  function T(E, A) {
    var j;
    for (var D in A)
      E.test(D) && (j = A[D], delete A[D]);
    return j === null || typeof j > "u" ? void 0 : String(j).trim();
  }
  function P(E, A, j) {
    function D(U) {
      k(Error.captureStackTrace) && Error.captureStackTrace(this, this.constructor), Object.assign(this, U || {}), this.code = E, this.message = this.cause ? A + ": " + this.cause.message : A;
    }
    return D.prototype = new (j || Error)(), Object.defineProperties(D.prototype, {
      constructor: {
        value: D,
        enumerable: !1
      },
      name: {
        value: "Error [" + E + "]",
        enumerable: !1
      }
    }), D;
  }
  function O(E, A) {
    for (var j of f)
      E.removeListener(j, p[j]);
    E.on("error", w), E.destroy(A);
  }
  function b(E, A) {
    o(g(E) && g(A));
    var j = E.length - A.length - 1;
    return j > 0 && E[j] === "." && E.endsWith(A);
  }
  function g(E) {
    return typeof E == "string" || E instanceof String;
  }
  function k(E) {
    return typeof E == "function";
  }
  function q(E) {
    return typeof E == "object" && "length" in E;
  }
  function L(E) {
    return e && E instanceof e;
  }
  return rn.exports = y({ http: i, https: a }), rn.exports.wrap = y, rn.exports;
}
var gr = br();
const yr = /* @__PURE__ */ Ze(gr), bn = "1.9.0";
function Wt(n) {
  const e = /^([-+\w]{1,25})(:?\/\/|:)/.exec(n);
  return e && e[1] || "";
}
const wr = /^(?:([^;]+);)?(?:[^;]+;)?(base64|),([\s\S]*)$/;
function Er(n, e, i) {
  const a = i && i.Blob || Z.classes.Blob, t = Wt(n);
  if (e === void 0 && a && (e = !0), t === "data") {
    n = t.length ? n.slice(t.length + 1) : n;
    const o = wr.exec(n);
    if (!o)
      throw new I("Invalid URL", I.ERR_INVALID_URL);
    const s = o[1], x = o[2], d = o[3], f = Buffer.from(decodeURIComponent(d), x ? "base64" : "utf8");
    if (e) {
      if (!a)
        throw new I("Blob is not supported", I.ERR_NOT_SUPPORT);
      return new a([f], { type: s });
    }
    return f;
  }
  throw new I("Unsupported protocol " + t, I.ERR_NOT_SUPPORT);
}
const fa = Symbol("internals");
class Ji extends re.Transform {
  constructor(e) {
    e = _.toFlatObject(e, {
      maxRate: 0,
      chunkSize: 64 * 1024,
      minChunkSize: 100,
      timeWindow: 500,
      ticksRate: 2,
      samplesCount: 15
    }, null, (a, t) => !_.isUndefined(t[a])), super({
      readableHighWaterMark: e.chunkSize
    });
    const i = this[fa] = {
      timeWindow: e.timeWindow,
      chunkSize: e.chunkSize,
      maxRate: e.maxRate,
      minChunkSize: e.minChunkSize,
      bytesSeen: 0,
      isCaptured: !1,
      notifiedBytesLoaded: 0,
      ts: Date.now(),
      bytes: 0,
      onReadCallback: null
    };
    this.on("newListener", (a) => {
      a === "progress" && (i.isCaptured || (i.isCaptured = !0));
    });
  }
  _read(e) {
    const i = this[fa];
    return i.onReadCallback && i.onReadCallback(), super._read(e);
  }
  _transform(e, i, a) {
    const t = this[fa], o = t.maxRate, s = this.readableHighWaterMark, x = t.timeWindow, d = 1e3 / x, f = o / d, p = t.minChunkSize !== !1 ? Math.max(t.minChunkSize, f * 0.01) : 0, l = (m, r) => {
      const c = Buffer.byteLength(m);
      t.bytesSeen += c, t.bytes += c, t.isCaptured && this.emit("progress", t.bytesSeen), this.push(m) ? process.nextTick(r) : t.onReadCallback = () => {
        t.onReadCallback = null, process.nextTick(r);
      };
    }, u = (m, r) => {
      const c = Buffer.byteLength(m);
      let h = null, v = s, y, w = 0;
      if (o) {
        const C = Date.now();
        (!t.ts || (w = C - t.ts) >= x) && (t.ts = C, y = f - t.bytes, t.bytes = y < 0 ? -y : 0, w = 0), y = f - t.bytes;
      }
      if (o) {
        if (y <= 0)
          return setTimeout(() => {
            r(null, m);
          }, x - w);
        y < v && (v = y);
      }
      v && c > v && c - v > p && (h = m.subarray(v), m = m.subarray(0, v)), l(m, h ? () => {
        process.nextTick(r, null, h);
      } : r);
    };
    u(e, function m(r, c) {
      if (r)
        return a(r);
      c ? u(c, m) : a(null);
    });
  }
}
const { asyncIterator: Gi } = Symbol, Kt = async function* (n) {
  n.stream ? yield* n.stream() : n.arrayBuffer ? yield await n.arrayBuffer() : n[Gi] ? yield* n[Gi]() : yield n;
}, kr = Z.ALPHABET.ALPHA_DIGIT + "-_", Ye = typeof TextEncoder == "function" ? new TextEncoder() : new xe.TextEncoder(), we = `\r
`, _r = Ye.encode(we), Sr = 2;
class Rr {
  constructor(e, i) {
    const { escapeName: a } = this.constructor, t = _.isString(i);
    let o = `Content-Disposition: form-data; name="${a(e)}"${!t && i.name ? `; filename="${a(i.name)}"` : ""}${we}`;
    t ? i = Ye.encode(String(i).replace(/\r?\n|\r\n?/g, we)) : o += `Content-Type: ${i.type || "application/octet-stream"}${we}`, this.headers = Ye.encode(o + we), this.contentLength = t ? i.byteLength : i.size, this.size = this.headers.byteLength + this.contentLength + Sr, this.name = e, this.value = i;
  }
  async *encode() {
    yield this.headers;
    const { value: e } = this;
    _.isTypedArray(e) ? yield e : yield* Kt(e), yield _r;
  }
  static escapeName(e) {
    return String(e).replace(/[\r\n"]/g, (i) => ({
      "\r": "%0D",
      "\n": "%0A",
      '"': "%22"
    })[i]);
  }
}
const Ar = (n, e, i) => {
  const {
    tag: a = "form-data-boundary",
    size: t = 25,
    boundary: o = a + "-" + Z.generateString(t, kr)
  } = i || {};
  if (!_.isFormData(n))
    throw TypeError("FormData instance required");
  if (o.length < 1 || o.length > 70)
    throw Error("boundary must be 10-70 characters long");
  const s = Ye.encode("--" + o + we), x = Ye.encode("--" + o + "--" + we);
  let d = x.byteLength;
  const f = Array.from(n.entries()).map(([l, u]) => {
    const m = new Rr(l, u);
    return d += m.size, m;
  });
  d += s.byteLength * f.length, d = _.toFiniteNumber(d);
  const p = {
    "Content-Type": `multipart/form-data; boundary=${o}`
  };
  return Number.isFinite(d) && (p["Content-Length"] = d), e && e(p), bs.from(async function* () {
    for (const l of f)
      yield s, yield* l.encode();
    yield x;
  }());
};
class Tr extends re.Transform {
  __transform(e, i, a) {
    this.push(e), a();
  }
  _transform(e, i, a) {
    if (e.length !== 0 && (this._transform = this.__transform, e[0] !== 120)) {
      const t = Buffer.alloc(2);
      t[0] = 120, t[1] = 156, this.push(t, i);
    }
    this.__transform(e, i, a);
  }
}
const jr = (n, e) => _.isAsyncFn(n) ? function(...i) {
  const a = i.pop();
  n.apply(this, i).then((t) => {
    try {
      e ? a(null, ...e(t)) : a(null, t);
    } catch (o) {
      a(o);
    }
  }, a);
} : n;
function Cr(n, e) {
  n = n || 10;
  const i = new Array(n), a = new Array(n);
  let t = 0, o = 0, s;
  return e = e !== void 0 ? e : 1e3, function(d) {
    const f = Date.now(), p = a[o];
    s || (s = f), i[t] = d, a[t] = f;
    let l = o, u = 0;
    for (; l !== t; )
      u += i[l++], l = l % n;
    if (t = (t + 1) % n, t === o && (o = (o + 1) % n), f - s < e)
      return;
    const m = p && f - p;
    return m ? Math.round(u * 1e3 / m) : void 0;
  };
}
function Or(n, e) {
  let i = 0, a = 1e3 / e, t, o;
  const s = (f, p = Date.now()) => {
    i = p, t = null, o && (clearTimeout(o), o = null), n.apply(null, f);
  };
  return [(...f) => {
    const p = Date.now(), l = p - i;
    l >= a ? s(f, p) : (t = f, o || (o = setTimeout(() => {
      o = null, s(t);
    }, a - l)));
  }, () => t && s(t)];
}
const Ae = (n, e, i = 3) => {
  let a = 0;
  const t = Cr(50, 250);
  return Or((o) => {
    const s = o.loaded, x = o.lengthComputable ? o.total : void 0, d = s - a, f = t(d), p = s <= x;
    a = s;
    const l = {
      loaded: s,
      total: x,
      progress: x ? s / x : void 0,
      bytes: d,
      rate: f || void 0,
      estimated: f && x && p ? (x - s) / f : void 0,
      event: o,
      lengthComputable: x != null,
      [e ? "download" : "upload"]: !0
    };
    n(l);
  }, i);
}, gn = (n, e) => {
  const i = n != null;
  return [(a) => e[0]({
    lengthComputable: i,
    total: n,
    loaded: a
  }), e[1]];
}, yn = (n) => (...e) => _.asap(() => n(...e)), Yi = {
  flush: fe.constants.Z_SYNC_FLUSH,
  finishFlush: fe.constants.Z_SYNC_FLUSH
}, Pr = {
  flush: fe.constants.BROTLI_OPERATION_FLUSH,
  finishFlush: fe.constants.BROTLI_OPERATION_FLUSH
}, Xi = _.isFunction(fe.createBrotliDecompress), { http: qr, https: Fr } = yr, Lr = /https:?/, Zi = Z.protocols.map((n) => n + ":"), Qi = (n, [e, i]) => (n.on("end", i).on("error", i), e);
function Dr(n, e) {
  n.beforeRedirects.proxy && n.beforeRedirects.proxy(n), n.beforeRedirects.config && n.beforeRedirects.config(n, e);
}
function Jt(n, e, i) {
  let a = e;
  if (!a && a !== !1) {
    const t = lr.getProxyForUrl(i);
    t && (a = new URL(t));
  }
  if (a) {
    if (a.username && (a.auth = (a.username || "") + ":" + (a.password || "")), a.auth) {
      (a.auth.username || a.auth.password) && (a.auth = (a.auth.username || "") + ":" + (a.auth.password || ""));
      const o = Buffer.from(a.auth, "utf8").toString("base64");
      n.headers["Proxy-Authorization"] = "Basic " + o;
    }
    n.headers.host = n.hostname + (n.port ? ":" + n.port : "");
    const t = a.hostname || a.host;
    n.hostname = t, n.host = t, n.port = a.port, n.path = i, a.protocol && (n.protocol = a.protocol.includes(":") ? a.protocol : `${a.protocol}:`);
  }
  n.beforeRedirects.proxy = function(o) {
    Jt(o, e, o.href);
  };
}
const Nr = typeof process < "u" && _.kindOf(process) === "process", Ir = (n) => new Promise((e, i) => {
  let a, t;
  const o = (d, f) => {
    t || (t = !0, a && a(d, f));
  }, s = (d) => {
    o(d), e(d);
  }, x = (d) => {
    o(d, !0), i(d);
  };
  n(s, x, (d) => a = d).catch(x);
}), Ur = ({ address: n, family: e }) => {
  if (!_.isString(n))
    throw TypeError("address must be a string");
  return {
    address: n,
    family: e || (n.indexOf(".") < 0 ? 6 : 4)
  };
}, et = (n, e) => Ur(_.isObject(n) ? n : { address: n, family: e }), zr = Nr && function(e) {
  return Ir(async function(a, t, o) {
    let { data: s, lookup: x, family: d } = e;
    const { responseType: f, responseEncoding: p } = e, l = e.method.toUpperCase();
    let u, m = !1, r;
    if (x) {
      const A = jr(x, (j) => _.isArray(j) ? j : [j]);
      x = (j, D, U) => {
        A(j, D, (N, z, W) => {
          if (N)
            return U(N);
          const Y = _.isArray(z) ? z.map((B) => et(B)) : [et(z, W)];
          D.all ? U(N, Y) : U(N, Y[0].address, Y[0].family);
        });
      };
    }
    const c = new ws(), h = () => {
      e.cancelToken && e.cancelToken.unsubscribe(v), e.signal && e.signal.removeEventListener("abort", v), c.removeAllListeners();
    };
    o((A, j) => {
      u = !0, j && (m = !0, h());
    });
    function v(A) {
      c.emit("abort", !A || A.type ? new he(null, e, r) : A);
    }
    c.once("abort", t), (e.cancelToken || e.signal) && (e.cancelToken && e.cancelToken.subscribe(v), e.signal && (e.signal.aborted ? v() : e.signal.addEventListener("abort", v)));
    const y = Ia(e.baseURL, e.url, e.allowAbsoluteUrls), w = new URL(y, Z.hasBrowserEnv ? Z.origin : void 0), C = w.protocol || Zi[0];
    if (C === "data:") {
      let A;
      if (l !== "GET")
        return Re(a, t, {
          status: 405,
          statusText: "method not allowed",
          headers: {},
          config: e
        });
      try {
        A = Er(e.url, f === "blob", {
          Blob: e.env && e.env.Blob
        });
      } catch (j) {
        throw I.from(j, I.ERR_BAD_REQUEST, e);
      }
      return f === "text" ? (A = A.toString(p), (!p || p === "utf8") && (A = _.stripBOM(A))) : f === "stream" && (A = re.Readable.from(A)), Re(a, t, {
        data: A,
        status: 200,
        statusText: "OK",
        headers: new ne(),
        config: e
      });
    }
    if (Zi.indexOf(C) === -1)
      return t(new I(
        "Unsupported protocol " + C,
        I.ERR_BAD_REQUEST,
        e
      ));
    const S = ne.from(e.headers).normalize();
    S.set("User-Agent", "axios/" + bn, !1);
    const { onUploadProgress: F, onDownloadProgress: R } = e, T = e.maxRate;
    let P, O;
    if (_.isSpecCompliantForm(s)) {
      const A = S.getContentType(/boundary=([-_\w\d]{10,70})/i);
      s = Ar(s, (j) => {
        S.set(j);
      }, {
        tag: `axios-${bn}-boundary`,
        boundary: A && A[1] || void 0
      });
    } else if (_.isFormData(s) && _.isFunction(s.getHeaders)) {
      if (S.set(s.getHeaders()), !S.hasContentLength())
        try {
          const A = await xe.promisify(s.getLength).call(s);
          Number.isFinite(A) && A >= 0 && S.setContentLength(A);
        } catch {
        }
    } else if (_.isBlob(s) || _.isFile(s))
      s.size && S.setContentType(s.type || "application/octet-stream"), S.setContentLength(s.size || 0), s = re.Readable.from(Kt(s));
    else if (s && !_.isStream(s)) {
      if (!Buffer.isBuffer(s)) if (_.isArrayBuffer(s))
        s = Buffer.from(new Uint8Array(s));
      else if (_.isString(s))
        s = Buffer.from(s, "utf-8");
      else
        return t(new I(
          "Data after transformation must be a string, an ArrayBuffer, a Buffer, or a Stream",
          I.ERR_BAD_REQUEST,
          e
        ));
      if (S.setContentLength(s.length, !1), e.maxBodyLength > -1 && s.length > e.maxBodyLength)
        return t(new I(
          "Request body larger than maxBodyLength limit",
          I.ERR_BAD_REQUEST,
          e
        ));
    }
    const b = _.toFiniteNumber(S.getContentLength());
    _.isArray(T) ? (P = T[0], O = T[1]) : P = O = T, s && (F || P) && (_.isStream(s) || (s = re.Readable.from(s, { objectMode: !1 })), s = re.pipeline([s, new Ji({
      maxRate: _.toFiniteNumber(P)
    })], _.noop), F && s.on("progress", Qi(
      s,
      gn(
        b,
        Ae(yn(F), !1, 3)
      )
    )));
    let g;
    if (e.auth) {
      const A = e.auth.username || "", j = e.auth.password || "";
      g = A + ":" + j;
    }
    if (!g && w.username) {
      const A = w.username, j = w.password;
      g = A + ":" + j;
    }
    g && S.delete("authorization");
    let k;
    try {
      k = La(
        w.pathname + w.search,
        e.params,
        e.paramsSerializer
      ).replace(/^\?/, "");
    } catch (A) {
      const j = new Error(A.message);
      return j.config = e, j.url = e.url, j.exists = !0, t(j);
    }
    S.set(
      "Accept-Encoding",
      "gzip, compress, deflate" + (Xi ? ", br" : ""),
      !1
    );
    const q = {
      path: k,
      method: l,
      headers: S.toJSON(),
      agents: { http: e.httpAgent, https: e.httpsAgent },
      auth: g,
      protocol: C,
      family: d,
      beforeRedirect: Dr,
      beforeRedirects: {}
    };
    !_.isUndefined(x) && (q.lookup = x), e.socketPath ? q.socketPath = e.socketPath : (q.hostname = w.hostname.startsWith("[") ? w.hostname.slice(1, -1) : w.hostname, q.port = w.port, Jt(q, e.proxy, C + "//" + w.hostname + (w.port ? ":" + w.port : "") + q.path));
    let L;
    const E = Lr.test(q.protocol);
    if (q.agent = E ? e.httpsAgent : e.httpAgent, e.transport ? L = e.transport : e.maxRedirects === 0 ? L = E ? Aa : Ra : (e.maxRedirects && (q.maxRedirects = e.maxRedirects), e.beforeRedirect && (q.beforeRedirects.config = e.beforeRedirect), L = E ? Fr : qr), e.maxBodyLength > -1 ? q.maxBodyLength = e.maxBodyLength : q.maxBodyLength = 1 / 0, e.insecureHTTPParser && (q.insecureHTTPParser = e.insecureHTTPParser), r = L.request(q, function(j) {
      if (r.destroyed) return;
      const D = [j], U = +j.headers["content-length"];
      if (R || O) {
        const B = new Ji({
          maxRate: _.toFiniteNumber(O)
        });
        R && B.on("progress", Qi(
          B,
          gn(
            U,
            Ae(yn(R), !0, 3)
          )
        )), D.push(B);
      }
      let N = j;
      const z = j.req || r;
      if (e.decompress !== !1 && j.headers["content-encoding"])
        switch ((l === "HEAD" || j.statusCode === 204) && delete j.headers["content-encoding"], (j.headers["content-encoding"] || "").toLowerCase()) {
          /*eslint default-case:0*/
          case "gzip":
          case "x-gzip":
          case "compress":
          case "x-compress":
            D.push(fe.createUnzip(Yi)), delete j.headers["content-encoding"];
            break;
          case "deflate":
            D.push(new Tr()), D.push(fe.createUnzip(Yi)), delete j.headers["content-encoding"];
            break;
          case "br":
            Xi && (D.push(fe.createBrotliDecompress(Pr)), delete j.headers["content-encoding"]);
        }
      N = D.length > 1 ? re.pipeline(D, _.noop) : D[0];
      const W = re.finished(N, () => {
        W(), h();
      }), Y = {
        status: j.statusCode,
        statusText: j.statusMessage,
        headers: new ne(j.headers),
        config: e,
        request: z
      };
      if (f === "stream")
        Y.data = N, Re(a, t, Y);
      else {
        const B = [];
        let $ = 0;
        N.on("data", function(X) {
          B.push(X), $ += X.length, e.maxContentLength > -1 && $ > e.maxContentLength && (m = !0, N.destroy(), t(new I(
            "maxContentLength size of " + e.maxContentLength + " exceeded",
            I.ERR_BAD_RESPONSE,
            e,
            z
          )));
        }), N.on("aborted", function() {
          if (m)
            return;
          const X = new I(
            "stream has been aborted",
            I.ERR_BAD_RESPONSE,
            e,
            z
          );
          N.destroy(X), t(X);
        }), N.on("error", function(X) {
          r.destroyed || t(I.from(X, null, e, z));
        }), N.on("end", function() {
          try {
            let X = B.length === 1 ? B[0] : Buffer.concat(B);
            f !== "arraybuffer" && (X = X.toString(p), (!p || p === "utf8") && (X = _.stripBOM(X))), Y.data = X;
          } catch (X) {
            return t(I.from(X, null, e, Y.request, Y));
          }
          Re(a, t, Y);
        });
      }
      c.once("abort", (B) => {
        N.destroyed || (N.emit("error", B), N.destroy());
      });
    }), c.once("abort", (A) => {
      t(A), r.destroy(A);
    }), r.on("error", function(j) {
      t(I.from(j, null, e, r));
    }), r.on("socket", function(j) {
      j.setKeepAlive(!0, 1e3 * 60);
    }), e.timeout) {
      const A = parseInt(e.timeout, 10);
      if (Number.isNaN(A)) {
        t(new I(
          "error trying to parse `config.timeout` to int",
          I.ERR_BAD_OPTION_VALUE,
          e,
          r
        ));
        return;
      }
      r.setTimeout(A, function() {
        if (u) return;
        let D = e.timeout ? "timeout of " + e.timeout + "ms exceeded" : "timeout exceeded";
        const U = e.transitional || Da;
        e.timeoutErrorMessage && (D = e.timeoutErrorMessage), t(new I(
          D,
          U.clarifyTimeoutError ? I.ETIMEDOUT : I.ECONNABORTED,
          e,
          r
        )), v();
      });
    }
    if (_.isStream(s)) {
      let A = !1, j = !1;
      s.on("end", () => {
        A = !0;
      }), s.once("error", (D) => {
        j = !0, r.destroy(D);
      }), s.on("close", () => {
        !A && !j && v(new he("Request stream has been aborted", e, r));
      }), s.pipe(r);
    } else
      r.end(s);
  });
}, Br = Z.hasStandardBrowserEnv ? /* @__PURE__ */ ((n, e) => (i) => (i = new URL(i, Z.origin), n.protocol === i.protocol && n.host === i.host && (e || n.port === i.port)))(
  new URL(Z.origin),
  Z.navigator && /(msie|trident)/i.test(Z.navigator.userAgent)
) : () => !0, $r = Z.hasStandardBrowserEnv ? (
  // Standard browser envs support document.cookie
  {
    write(n, e, i, a, t, o) {
      const s = [n + "=" + encodeURIComponent(e)];
      _.isNumber(i) && s.push("expires=" + new Date(i).toGMTString()), _.isString(a) && s.push("path=" + a), _.isString(t) && s.push("domain=" + t), o === !0 && s.push("secure"), document.cookie = s.join("; ");
    },
    read(n) {
      const e = document.cookie.match(new RegExp("(^|;\\s*)(" + n + ")=([^;]*)"));
      return e ? decodeURIComponent(e[3]) : null;
    },
    remove(n) {
      this.write(n, "", Date.now() - 864e5);
    }
  }
) : (
  // Non-standard browser env (web workers, react-native) lack needed support.
  {
    write() {
    },
    read() {
      return null;
    },
    remove() {
    }
  }
), nt = (n) => n instanceof ne ? { ...n } : n;
function Se(n, e) {
  e = e || {};
  const i = {};
  function a(f, p, l, u) {
    return _.isPlainObject(f) && _.isPlainObject(p) ? _.merge.call({ caseless: u }, f, p) : _.isPlainObject(p) ? _.merge({}, p) : _.isArray(p) ? p.slice() : p;
  }
  function t(f, p, l, u) {
    if (_.isUndefined(p)) {
      if (!_.isUndefined(f))
        return a(void 0, f, l, u);
    } else return a(f, p, l, u);
  }
  function o(f, p) {
    if (!_.isUndefined(p))
      return a(void 0, p);
  }
  function s(f, p) {
    if (_.isUndefined(p)) {
      if (!_.isUndefined(f))
        return a(void 0, f);
    } else return a(void 0, p);
  }
  function x(f, p, l) {
    if (l in e)
      return a(f, p);
    if (l in n)
      return a(void 0, f);
  }
  const d = {
    url: o,
    method: o,
    data: o,
    baseURL: s,
    transformRequest: s,
    transformResponse: s,
    paramsSerializer: s,
    timeout: s,
    timeoutMessage: s,
    withCredentials: s,
    withXSRFToken: s,
    adapter: s,
    responseType: s,
    xsrfCookieName: s,
    xsrfHeaderName: s,
    onUploadProgress: s,
    onDownloadProgress: s,
    decompress: s,
    maxContentLength: s,
    maxBodyLength: s,
    beforeRedirect: s,
    transport: s,
    httpAgent: s,
    httpsAgent: s,
    cancelToken: s,
    socketPath: s,
    responseEncoding: s,
    validateStatus: x,
    headers: (f, p, l) => t(nt(f), nt(p), l, !0)
  };
  return _.forEach(Object.keys(Object.assign({}, n, e)), function(p) {
    const l = d[p] || t, u = l(n[p], e[p], p);
    _.isUndefined(u) && l !== x || (i[p] = u);
  }), i;
}
const Gt = (n) => {
  const e = Se({}, n);
  let { data: i, withXSRFToken: a, xsrfHeaderName: t, xsrfCookieName: o, headers: s, auth: x } = e;
  e.headers = s = ne.from(s), e.url = La(Ia(e.baseURL, e.url, e.allowAbsoluteUrls), n.params, n.paramsSerializer), x && s.set(
    "Authorization",
    "Basic " + btoa((x.username || "") + ":" + (x.password ? unescape(encodeURIComponent(x.password)) : ""))
  );
  let d;
  if (_.isFormData(i)) {
    if (Z.hasStandardBrowserEnv || Z.hasStandardBrowserWebWorkerEnv)
      s.setContentType(void 0);
    else if ((d = s.getContentType()) !== !1) {
      const [f, ...p] = d ? d.split(";").map((l) => l.trim()).filter(Boolean) : [];
      s.setContentType([f || "multipart/form-data", ...p].join("; "));
    }
  }
  if (Z.hasStandardBrowserEnv && (a && _.isFunction(a) && (a = a(e)), a || a !== !1 && Br(e.url))) {
    const f = t && o && $r.read(o);
    f && s.set(t, f);
  }
  return e;
}, Mr = typeof XMLHttpRequest < "u", Hr = Mr && function(n) {
  return new Promise(function(i, a) {
    const t = Gt(n);
    let o = t.data;
    const s = ne.from(t.headers).normalize();
    let { responseType: x, onUploadProgress: d, onDownloadProgress: f } = t, p, l, u, m, r;
    function c() {
      m && m(), r && r(), t.cancelToken && t.cancelToken.unsubscribe(p), t.signal && t.signal.removeEventListener("abort", p);
    }
    let h = new XMLHttpRequest();
    h.open(t.method.toUpperCase(), t.url, !0), h.timeout = t.timeout;
    function v() {
      if (!h)
        return;
      const w = ne.from(
        "getAllResponseHeaders" in h && h.getAllResponseHeaders()
      ), S = {
        data: !x || x === "text" || x === "json" ? h.responseText : h.response,
        status: h.status,
        statusText: h.statusText,
        headers: w,
        config: n,
        request: h
      };
      Re(function(R) {
        i(R), c();
      }, function(R) {
        a(R), c();
      }, S), h = null;
    }
    "onloadend" in h ? h.onloadend = v : h.onreadystatechange = function() {
      !h || h.readyState !== 4 || h.status === 0 && !(h.responseURL && h.responseURL.indexOf("file:") === 0) || setTimeout(v);
    }, h.onabort = function() {
      h && (a(new I("Request aborted", I.ECONNABORTED, n, h)), h = null);
    }, h.onerror = function() {
      a(new I("Network Error", I.ERR_NETWORK, n, h)), h = null;
    }, h.ontimeout = function() {
      let C = t.timeout ? "timeout of " + t.timeout + "ms exceeded" : "timeout exceeded";
      const S = t.transitional || Da;
      t.timeoutErrorMessage && (C = t.timeoutErrorMessage), a(new I(
        C,
        S.clarifyTimeoutError ? I.ETIMEDOUT : I.ECONNABORTED,
        n,
        h
      )), h = null;
    }, o === void 0 && s.setContentType(null), "setRequestHeader" in h && _.forEach(s.toJSON(), function(C, S) {
      h.setRequestHeader(S, C);
    }), _.isUndefined(t.withCredentials) || (h.withCredentials = !!t.withCredentials), x && x !== "json" && (h.responseType = t.responseType), f && ([u, r] = Ae(f, !0), h.addEventListener("progress", u)), d && h.upload && ([l, m] = Ae(d), h.upload.addEventListener("progress", l), h.upload.addEventListener("loadend", m)), (t.cancelToken || t.signal) && (p = (w) => {
      h && (a(!w || w.type ? new he(null, n, h) : w), h.abort(), h = null);
    }, t.cancelToken && t.cancelToken.subscribe(p), t.signal && (t.signal.aborted ? p() : t.signal.addEventListener("abort", p)));
    const y = Wt(t.url);
    if (y && Z.protocols.indexOf(y) === -1) {
      a(new I("Unsupported protocol " + y + ":", I.ERR_BAD_REQUEST, n));
      return;
    }
    h.send(o || null);
  });
}, Vr = (n, e) => {
  const { length: i } = n = n ? n.filter(Boolean) : [];
  if (e || i) {
    let a = new AbortController(), t;
    const o = function(f) {
      if (!t) {
        t = !0, x();
        const p = f instanceof Error ? f : this.reason;
        a.abort(p instanceof I ? p : new he(p instanceof Error ? p.message : p));
      }
    };
    let s = e && setTimeout(() => {
      s = null, o(new I(`timeout ${e} of ms exceeded`, I.ETIMEDOUT));
    }, e);
    const x = () => {
      n && (s && clearTimeout(s), s = null, n.forEach((f) => {
        f.unsubscribe ? f.unsubscribe(o) : f.removeEventListener("abort", o);
      }), n = null);
    };
    n.forEach((f) => f.addEventListener("abort", o));
    const { signal: d } = a;
    return d.unsubscribe = () => _.asap(x), d;
  }
}, Wr = function* (n, e) {
  let i = n.byteLength;
  if (i < e) {
    yield n;
    return;
  }
  let a = 0, t;
  for (; a < i; )
    t = a + e, yield n.slice(a, t), a = t;
}, Kr = async function* (n, e) {
  for await (const i of Jr(n))
    yield* Wr(i, e);
}, Jr = async function* (n) {
  if (n[Symbol.asyncIterator]) {
    yield* n;
    return;
  }
  const e = n.getReader();
  try {
    for (; ; ) {
      const { done: i, value: a } = await e.read();
      if (i)
        break;
      yield a;
    }
  } finally {
    await e.cancel();
  }
}, at = (n, e, i, a) => {
  const t = Kr(n, e);
  let o = 0, s, x = (d) => {
    s || (s = !0, a && a(d));
  };
  return new ReadableStream({
    async pull(d) {
      try {
        const { done: f, value: p } = await t.next();
        if (f) {
          x(), d.close();
          return;
        }
        let l = p.byteLength;
        if (i) {
          let u = o += l;
          i(u);
        }
        d.enqueue(new Uint8Array(p));
      } catch (f) {
        throw x(f), f;
      }
    },
    cancel(d) {
      return x(d), t.return();
    }
  }, {
    highWaterMark: 2
  });
}, Cn = typeof fetch == "function" && typeof Request == "function" && typeof Response == "function", Yt = Cn && typeof ReadableStream == "function", Gr = Cn && (typeof TextEncoder == "function" ? /* @__PURE__ */ ((n) => (e) => n.encode(e))(new TextEncoder()) : async (n) => new Uint8Array(await new Response(n).arrayBuffer())), Xt = (n, ...e) => {
  try {
    return !!n(...e);
  } catch {
    return !1;
  }
}, Yr = Yt && Xt(() => {
  let n = !1;
  const e = new Request(Z.origin, {
    body: new ReadableStream(),
    method: "POST",
    get duplex() {
      return n = !0, "half";
    }
  }).headers.has("Content-Type");
  return n && !e;
}), it = 64 * 1024, wa = Yt && Xt(() => _.isReadableStream(new Response("").body)), wn = {
  stream: wa && ((n) => n.body)
};
Cn && ((n) => {
  ["text", "arrayBuffer", "blob", "formData", "stream"].forEach((e) => {
    !wn[e] && (wn[e] = _.isFunction(n[e]) ? (i) => i[e]() : (i, a) => {
      throw new I(`Response type '${e}' is not supported`, I.ERR_NOT_SUPPORT, a);
    });
  });
})(new Response());
const Xr = async (n) => {
  if (n == null)
    return 0;
  if (_.isBlob(n))
    return n.size;
  if (_.isSpecCompliantForm(n))
    return (await new Request(Z.origin, {
      method: "POST",
      body: n
    }).arrayBuffer()).byteLength;
  if (_.isArrayBufferView(n) || _.isArrayBuffer(n))
    return n.byteLength;
  if (_.isURLSearchParams(n) && (n = n + ""), _.isString(n))
    return (await Gr(n)).byteLength;
}, Zr = async (n, e) => {
  const i = _.toFiniteNumber(n.getContentLength());
  return i ?? Xr(e);
}, Qr = Cn && (async (n) => {
  let {
    url: e,
    method: i,
    data: a,
    signal: t,
    cancelToken: o,
    timeout: s,
    onDownloadProgress: x,
    onUploadProgress: d,
    responseType: f,
    headers: p,
    withCredentials: l = "same-origin",
    fetchOptions: u
  } = Gt(n);
  f = f ? (f + "").toLowerCase() : "text";
  let m = Vr([t, o && o.toAbortSignal()], s), r;
  const c = m && m.unsubscribe && (() => {
    m.unsubscribe();
  });
  let h;
  try {
    if (d && Yr && i !== "get" && i !== "head" && (h = await Zr(p, a)) !== 0) {
      let S = new Request(e, {
        method: "POST",
        body: a,
        duplex: "half"
      }), F;
      if (_.isFormData(a) && (F = S.headers.get("content-type")) && p.setContentType(F), S.body) {
        const [R, T] = gn(
          h,
          Ae(yn(d))
        );
        a = at(S.body, it, R, T);
      }
    }
    _.isString(l) || (l = l ? "include" : "omit");
    const v = "credentials" in Request.prototype;
    r = new Request(e, {
      ...u,
      signal: m,
      method: i.toUpperCase(),
      headers: p.normalize().toJSON(),
      body: a,
      duplex: "half",
      credentials: v ? l : void 0
    });
    let y = await fetch(r);
    const w = wa && (f === "stream" || f === "response");
    if (wa && (x || w && c)) {
      const S = {};
      ["status", "statusText", "headers"].forEach((P) => {
        S[P] = y[P];
      });
      const F = _.toFiniteNumber(y.headers.get("content-length")), [R, T] = x && gn(
        F,
        Ae(yn(x), !0)
      ) || [];
      y = new Response(
        at(y.body, it, R, () => {
          T && T(), c && c();
        }),
        S
      );
    }
    f = f || "text";
    let C = await wn[_.findKey(wn, f) || "text"](y, n);
    return !w && c && c(), await new Promise((S, F) => {
      Re(S, F, {
        data: C,
        headers: ne.from(y.headers),
        status: y.status,
        statusText: y.statusText,
        config: n,
        request: r
      });
    });
  } catch (v) {
    throw c && c(), v && v.name === "TypeError" && /Load failed|fetch/i.test(v.message) ? Object.assign(
      new I("Network Error", I.ERR_NETWORK, n, r),
      {
        cause: v.cause || v
      }
    ) : I.from(v, v && v.code, n, r);
  }
}), Ea = {
  http: zr,
  xhr: Hr,
  fetch: Qr
};
_.forEach(Ea, (n, e) => {
  if (n) {
    try {
      Object.defineProperty(n, "name", { value: e });
    } catch {
    }
    Object.defineProperty(n, "adapterName", { value: e });
  }
});
const tt = (n) => `- ${n}`, ec = (n) => _.isFunction(n) || n === null || n === !1, Zt = {
  getAdapter: (n) => {
    n = _.isArray(n) ? n : [n];
    const { length: e } = n;
    let i, a;
    const t = {};
    for (let o = 0; o < e; o++) {
      i = n[o];
      let s;
      if (a = i, !ec(i) && (a = Ea[(s = String(i)).toLowerCase()], a === void 0))
        throw new I(`Unknown adapter '${s}'`);
      if (a)
        break;
      t[s || "#" + o] = a;
    }
    if (!a) {
      const o = Object.entries(t).map(
        ([x, d]) => `adapter ${x} ` + (d === !1 ? "is not supported by the environment" : "is not available in the build")
      );
      let s = e ? o.length > 1 ? `since :
` + o.map(tt).join(`
`) : " " + tt(o[0]) : "as no adapter specified";
      throw new I(
        "There is no suitable adapter to dispatch the request " + s,
        "ERR_NOT_SUPPORT"
      );
    }
    return a;
  },
  adapters: Ea
};
function ha(n) {
  if (n.cancelToken && n.cancelToken.throwIfRequested(), n.signal && n.signal.aborted)
    throw new he(null, n);
}
function st(n) {
  return ha(n), n.headers = ne.from(n.headers), n.data = ra.call(
    n,
    n.transformRequest
  ), ["post", "put", "patch"].indexOf(n.method) !== -1 && n.headers.setContentType("application/x-www-form-urlencoded", !1), Zt.getAdapter(n.adapter || nn.adapter)(n).then(function(a) {
    return ha(n), a.data = ra.call(
      n,
      n.transformResponse,
      a
    ), a.headers = ne.from(a.headers), a;
  }, function(a) {
    return Ht(a) || (ha(n), a && a.response && (a.response.data = ra.call(
      n,
      n.transformResponse,
      a.response
    ), a.response.headers = ne.from(a.response.headers))), Promise.reject(a);
  });
}
const On = {};
["object", "boolean", "number", "function", "string", "symbol"].forEach((n, e) => {
  On[n] = function(a) {
    return typeof a === n || "a" + (e < 1 ? "n " : " ") + n;
  };
});
const ot = {};
On.transitional = function(e, i, a) {
  function t(o, s) {
    return "[Axios v" + bn + "] Transitional option '" + o + "'" + s + (a ? ". " + a : "");
  }
  return (o, s, x) => {
    if (e === !1)
      throw new I(
        t(s, " has been removed" + (i ? " in " + i : "")),
        I.ERR_DEPRECATED
      );
    return i && !ot[s] && (ot[s] = !0, console.warn(
      t(
        s,
        " has been deprecated since v" + i + " and will be removed in the near future"
      )
    )), e ? e(o, s, x) : !0;
  };
};
On.spelling = function(e) {
  return (i, a) => (console.warn(`${a} is likely a misspelling of ${e}`), !0);
};
function nc(n, e, i) {
  if (typeof n != "object")
    throw new I("options must be an object", I.ERR_BAD_OPTION_VALUE);
  const a = Object.keys(n);
  let t = a.length;
  for (; t-- > 0; ) {
    const o = a[t], s = e[o];
    if (s) {
      const x = n[o], d = x === void 0 || s(x, o, n);
      if (d !== !0)
        throw new I("option " + o + " must be " + d, I.ERR_BAD_OPTION_VALUE);
      continue;
    }
    if (i !== !0)
      throw new I("Unknown option " + o, I.ERR_BAD_OPTION);
  }
}
const vn = {
  assertOptions: nc,
  validators: On
}, le = vn.validators;
let Ee = class {
  constructor(e) {
    this.defaults = e || {}, this.interceptors = {
      request: new Li(),
      response: new Li()
    };
  }
  /**
   * Dispatch a request
   *
   * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
   * @param {?Object} config
   *
   * @returns {Promise} The Promise to be fulfilled
   */
  async request(e, i) {
    try {
      return await this._request(e, i);
    } catch (a) {
      if (a instanceof Error) {
        let t = {};
        Error.captureStackTrace ? Error.captureStackTrace(t) : t = new Error();
        const o = t.stack ? t.stack.replace(/^.+\n/, "") : "";
        try {
          a.stack ? o && !String(a.stack).endsWith(o.replace(/^.+\n.+\n/, "")) && (a.stack += `
` + o) : a.stack = o;
        } catch {
        }
      }
      throw a;
    }
  }
  _request(e, i) {
    typeof e == "string" ? (i = i || {}, i.url = e) : i = e || {}, i = Se(this.defaults, i);
    const { transitional: a, paramsSerializer: t, headers: o } = i;
    a !== void 0 && vn.assertOptions(a, {
      silentJSONParsing: le.transitional(le.boolean),
      forcedJSONParsing: le.transitional(le.boolean),
      clarifyTimeoutError: le.transitional(le.boolean)
    }, !1), t != null && (_.isFunction(t) ? i.paramsSerializer = {
      serialize: t
    } : vn.assertOptions(t, {
      encode: le.function,
      serialize: le.function
    }, !0)), i.allowAbsoluteUrls !== void 0 || (this.defaults.allowAbsoluteUrls !== void 0 ? i.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls : i.allowAbsoluteUrls = !0), vn.assertOptions(i, {
      baseUrl: le.spelling("baseURL"),
      withXsrfToken: le.spelling("withXSRFToken")
    }, !0), i.method = (i.method || this.defaults.method || "get").toLowerCase();
    let s = o && _.merge(
      o.common,
      o[i.method]
    );
    o && _.forEach(
      ["delete", "get", "head", "post", "put", "patch", "common"],
      (r) => {
        delete o[r];
      }
    ), i.headers = ne.concat(s, o);
    const x = [];
    let d = !0;
    this.interceptors.request.forEach(function(c) {
      typeof c.runWhen == "function" && c.runWhen(i) === !1 || (d = d && c.synchronous, x.unshift(c.fulfilled, c.rejected));
    });
    const f = [];
    this.interceptors.response.forEach(function(c) {
      f.push(c.fulfilled, c.rejected);
    });
    let p, l = 0, u;
    if (!d) {
      const r = [st.bind(this), void 0];
      for (r.unshift.apply(r, x), r.push.apply(r, f), u = r.length, p = Promise.resolve(i); l < u; )
        p = p.then(r[l++], r[l++]);
      return p;
    }
    u = x.length;
    let m = i;
    for (l = 0; l < u; ) {
      const r = x[l++], c = x[l++];
      try {
        m = r(m);
      } catch (h) {
        c.call(this, h);
        break;
      }
    }
    try {
      p = st.call(this, m);
    } catch (r) {
      return Promise.reject(r);
    }
    for (l = 0, u = f.length; l < u; )
      p = p.then(f[l++], f[l++]);
    return p;
  }
  getUri(e) {
    e = Se(this.defaults, e);
    const i = Ia(e.baseURL, e.url, e.allowAbsoluteUrls);
    return La(i, e.params, e.paramsSerializer);
  }
};
_.forEach(["delete", "get", "head", "options"], function(e) {
  Ee.prototype[e] = function(i, a) {
    return this.request(Se(a || {}, {
      method: e,
      url: i,
      data: (a || {}).data
    }));
  };
});
_.forEach(["post", "put", "patch"], function(e) {
  function i(a) {
    return function(o, s, x) {
      return this.request(Se(x || {}, {
        method: e,
        headers: a ? {
          "Content-Type": "multipart/form-data"
        } : {},
        url: o,
        data: s
      }));
    };
  }
  Ee.prototype[e] = i(), Ee.prototype[e + "Form"] = i(!0);
});
let ac = class Qt {
  constructor(e) {
    if (typeof e != "function")
      throw new TypeError("executor must be a function.");
    let i;
    this.promise = new Promise(function(o) {
      i = o;
    });
    const a = this;
    this.promise.then((t) => {
      if (!a._listeners) return;
      let o = a._listeners.length;
      for (; o-- > 0; )
        a._listeners[o](t);
      a._listeners = null;
    }), this.promise.then = (t) => {
      let o;
      const s = new Promise((x) => {
        a.subscribe(x), o = x;
      }).then(t);
      return s.cancel = function() {
        a.unsubscribe(o);
      }, s;
    }, e(function(o, s, x) {
      a.reason || (a.reason = new he(o, s, x), i(a.reason));
    });
  }
  /**
   * Throws a `CanceledError` if cancellation has been requested.
   */
  throwIfRequested() {
    if (this.reason)
      throw this.reason;
  }
  /**
   * Subscribe to the cancel signal
   */
  subscribe(e) {
    if (this.reason) {
      e(this.reason);
      return;
    }
    this._listeners ? this._listeners.push(e) : this._listeners = [e];
  }
  /**
   * Unsubscribe from the cancel signal
   */
  unsubscribe(e) {
    if (!this._listeners)
      return;
    const i = this._listeners.indexOf(e);
    i !== -1 && this._listeners.splice(i, 1);
  }
  toAbortSignal() {
    const e = new AbortController(), i = (a) => {
      e.abort(a);
    };
    return this.subscribe(i), e.signal.unsubscribe = () => this.unsubscribe(i), e.signal;
  }
  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  static source() {
    let e;
    return {
      token: new Qt(function(t) {
        e = t;
      }),
      cancel: e
    };
  }
};
function ic(n) {
  return function(i) {
    return n.apply(null, i);
  };
}
function tc(n) {
  return _.isObject(n) && n.isAxiosError === !0;
}
const ka = {
  Continue: 100,
  SwitchingProtocols: 101,
  Processing: 102,
  EarlyHints: 103,
  Ok: 200,
  Created: 201,
  Accepted: 202,
  NonAuthoritativeInformation: 203,
  NoContent: 204,
  ResetContent: 205,
  PartialContent: 206,
  MultiStatus: 207,
  AlreadyReported: 208,
  ImUsed: 226,
  MultipleChoices: 300,
  MovedPermanently: 301,
  Found: 302,
  SeeOther: 303,
  NotModified: 304,
  UseProxy: 305,
  Unused: 306,
  TemporaryRedirect: 307,
  PermanentRedirect: 308,
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthenticationRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  LengthRequired: 411,
  PreconditionFailed: 412,
  PayloadTooLarge: 413,
  UriTooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfiable: 416,
  ExpectationFailed: 417,
  ImATeapot: 418,
  MisdirectedRequest: 421,
  UnprocessableEntity: 422,
  Locked: 423,
  FailedDependency: 424,
  TooEarly: 425,
  UpgradeRequired: 426,
  PreconditionRequired: 428,
  TooManyRequests: 429,
  RequestHeaderFieldsTooLarge: 431,
  UnavailableForLegalReasons: 451,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  HttpVersionNotSupported: 505,
  VariantAlsoNegotiates: 506,
  InsufficientStorage: 507,
  LoopDetected: 508,
  NotExtended: 510,
  NetworkAuthenticationRequired: 511
};
Object.entries(ka).forEach(([n, e]) => {
  ka[e] = n;
});
function es(n) {
  const e = new Ee(n), i = Et(Ee.prototype.request, e);
  return _.extend(i, Ee.prototype, e, { allOwnKeys: !0 }), _.extend(i, e, null, { allOwnKeys: !0 }), i.create = function(t) {
    return es(Se(n, t));
  }, i;
}
const H = es(nn);
H.Axios = Ee;
H.CanceledError = he;
H.CancelToken = ac;
H.isCancel = Ht;
H.VERSION = bn;
H.toFormData = jn;
H.AxiosError = I;
H.Cancel = H.CanceledError;
H.all = function(e) {
  return Promise.all(e);
};
H.spread = ic;
H.isAxiosError = tc;
H.mergeConfig = Se;
H.AxiosHeaders = ne;
H.formToJSON = (n) => Mt(_.isHTMLForm(n) ? new FormData(n) : n);
H.getAdapter = Zt.getAdapter;
H.HttpStatusCode = ka;
H.default = H;
const {
  Axios: rp,
  AxiosError: cp,
  CanceledError: pp,
  isCancel: lp,
  CancelToken: up,
  VERSION: dp,
  all: mp,
  Cancel: fp,
  isAxiosError: hp,
  spread: xp,
  toFormData: vp,
  AxiosHeaders: bp,
  HttpStatusCode: gp,
  formToJSON: yp,
  getAdapter: wp,
  mergeConfig: Ep
} = H;
async function Pn(n) {
  const i = (await ce()).playlists.find((s) => s.name === n);
  if (!i) return !1;
  const { url: a, username: t, password: o } = i;
  return {
    getAuthenticateUrl: `${a}/player_api.php?username=${t}&password=${o}`,
    getAllVodUrl: `${a}/player_api.php?username=${t}&password=${o}&action=get_vod_streams`,
    getAllVodCategoriesUrl: `${a}/player_api.php?username=${t}&password=${o}&action=get_vod_categories`,
    getVodStreamUrl: `${a}/movie/${t}/${o}/`,
    getVodInfoUrl: `${a}/player_api.php?username=${t}&password=${o}&action=get_vod_info&vod_id=`,
    getAllSeriesUrl: `${a}/player_api.php?username=${t}&password=${o}&action=get_series`,
    getAllSeriesCategoriesUrl: `${a}/player_api.php?username=${t}&password=${o}&action=get_series_categories`,
    getSeriesInfoUrl: `${a}/player_api.php?username=${t}&password=${o}&action=get_series_info&series_id=`,
    getSeriesStreamUrl: `${a}/series/${t}/${o}/`,
    getAllLiveUrl: `${a}/player_api.php?username=${t}&password=${o}&action=get_live_streams`,
    getAllLiveCategoriesUrl: `${a}/player_api.php?username=${t}&password=${o}&action=get_live_categories`,
    getLiveStreamUrl: `${a}/live/${t}/${o}/`,
    getLiveEpgUrl: `${a}/player_api.php?username=${t}&password=${o}&action=get_short_epg&limit=20&stream_id=`
  };
}
async function ns(n) {
  const e = await Pn(n);
  if (!e) return;
  const i = await H.get(e.getAllVodUrl), a = await H.get(e.getAllVodCategoriesUrl);
  if (i.status !== 200 || a.status !== 200 || !Array.isArray(i.data) || !Array.isArray(a.data) || i.data.length === 0 || a.data.length === 0) return;
  const t = { playlist: i.data, categories: a.data };
  return await M.writeAsync(gt(n), t), t;
}
async function as(n) {
  const e = await Pn(n);
  if (!e) return;
  const i = await H.get(e.getAllSeriesUrl), a = await H.get(e.getAllSeriesCategoriesUrl);
  if (i.status !== 200 || a.status !== 200 || !Array.isArray(i.data) || !Array.isArray(a.data) || i.data.length === 0 || a.data.length === 0) return;
  const t = { playlist: i.data, categories: a.data };
  return await M.writeAsync(yt(n), t), t;
}
async function is(n) {
  const e = await Pn(n);
  if (!e) return;
  const i = await H.get(e.getAllLiveUrl), a = await H.get(e.getAllLiveCategoriesUrl);
  if (i.status !== 200 || a.status !== 200 || !Array.isArray(i.data) || !Array.isArray(a.data) || i.data.length === 0 || a.data.length === 0) return;
  const t = { playlist: i.data, categories: a.data };
  return await M.writeAsync(wt(n), t), t;
}
async function ts(n) {
  try {
    const e = await H.get(n);
    return e.status !== 200 ? { status: !1, message: e.statusText } : e.data.user_info.status === "Expired" ? { status: !1, message: "Access denied, account expired." } : { status: !0, message: "Validated" };
  } catch (e) {
    if (e instanceof Error)
      return { status: !1, message: e.message };
  }
}
async function sc(n) {
  const e = await M.readAsync(ae, "json");
  if (e.playlists) {
    for (const i of e.playlists)
      if (i.name == n.name) return !1;
    e.playlists.push(n);
  } else
    e.playlists = [n];
  return e.currentPlaylist = {
    name: n.name,
    profile: "Default"
  }, await M.writeAsync(ae, e);
}
async function ss(n) {
  const e = gt(n);
  return await M.readAsync(e, "json");
}
async function oc(n) {
  return await M.readAsync(yt(n), "json");
}
async function rc(n) {
  return await M.readAsync(wt(n), "json");
}
async function cc(n) {
  return (await M.readAsync(ae, "json")).playlists.find((i) => i.name == n);
}
async function pc(n) {
  if (!n) return;
  const e = await H.get(n);
  if (!(!e.data || e.status !== 200))
    return e.data;
}
async function lc(n) {
  if (!n) return;
  const e = await H.get(n);
  if (!(!e.data || e.status !== 200))
    return e.data;
}
async function uc(n) {
  const { currentPlaylist: e } = await ce(), i = _e(e.name, n);
  let a = await M.readAsync(_e(e.name, n), "json");
  return a || (a = { vod: [], series: [], live: [] }, await M.writeAsync(i, a)), a;
}
async function dc(n) {
  const { currentPlaylist: e } = await ce(), i = _e(e.name, e.profile);
  return await M.writeAsync(i, n), n;
}
async function mc(n) {
  const e = await M.readAsync(ae, "json"), i = e.playlists.find((a) => a.name == n);
  return i ? (e.currentPlaylist = {
    name: n,
    profile: i.profiles[0]
  }, await M.writeAsync(ae, e), !0) : !1;
}
async function os(n) {
  const e = await M.readAsync(ae, "json"), i = e.playlists.map((a) => (a.name == n && (a.updatedAt = /* @__PURE__ */ new Date()), a));
  return e.playlists = i, await M.writeAsync(ae, e);
}
async function fc(n) {
  const e = await ce(), i = _e(e.currentPlaylist.name, n), a = e.playlists.find((x) => x.name === e.currentPlaylist.name);
  if (a == null ? void 0 : a.profiles.find((x) => x === n)) return !1;
  const o = e.playlists.map((x) => (x.name === e.currentPlaylist.name && x.profiles.push(n), x));
  e.playlists = o, await M.writeAsync(ae, e);
  let s = await M.readAsync(_e(e.currentPlaylist.name, n), "json");
  return s ? !1 : (s = { vod: [], series: [], live: [] }, await M.writeAsync(i, s), !0);
}
async function hc(n) {
  const e = await M.readAsync(ae, "json");
  return e.currentPlaylist.profile = n, await M.writeAsync(ae, e), !0;
}
async function xc({ profile: n, newName: e }) {
  const i = await ce(), a = _e(i.currentPlaylist.name, n);
  i.currentPlaylist.profile = e;
  const t = i.playlists.map((o) => {
    if (o.name === i.currentPlaylist.name) {
      const s = o.profiles.filter((x) => x !== n);
      s.push(e), o.profiles = s;
    }
    return o;
  });
  return i.playlists = t, await M.writeAsync(ae, i), await M.renameAsync(a, `${e}.json`);
}
async function vc(n) {
  const e = await ce();
  let i = [];
  const a = e.playlists.map((o) => {
    if (o.name === e.currentPlaylist.name) {
      const s = o.profiles.filter((x) => x !== n);
      o.profiles = s, i = s;
    }
    return o;
  });
  e.currentPlaylist.profile = i[0], e.playlists = a, await M.writeAsync(ae, e);
  const t = _e(e.currentPlaylist.name, n);
  await M.removeAsync(t);
}
async function bc(n) {
  const e = await ce();
  if (e.playlists) {
    const i = e.playlists.filter((a) => a.name !== n);
    e.playlists = i;
  }
  return e.playlists.length === 0 ? e.currentPlaylist = {
    name: "",
    profile: ""
  } : e.currentPlaylist = {
    name: e.playlists[0].name,
    profile: "Default"
  }, await M.removeAsync(_n(n)), await M.writeAsync(ae, e), e;
}
function gc({ path: n, startTime: e }, i) {
  let a;
  const t = [
    "--extraintf",
    "http",
    "--http-host",
    "127.0.0.1",
    "--http-port",
    "9090",
    "--http-password",
    "joi",
    "--fullscreen",
    "--start-time",
    e.toString(),
    n
  ];
  return process.platform === "win32" ? a = za("C:/Program Files (x86)/VideoLAN/VLC/vlc.exe", t) : a = za("vlc", t), a.setMaxListeners(2), a.stderr.on("data", (o) => {
    const s = o.toString();
    s.includes("access stream error") && (a.kill(), i.webContents.send("vlc-status", { running: !1, error: s }));
  }), a.on("close", () => {
    i.webContents.send("vlc-status", { running: !1 });
  }), a.pid;
}
async function yc() {
  return (await H.get("http://127.0.0.1:9090/requests/status.json", {
    auth: {
      username: "",
      password: "joi"
    },
    timeout: 500
  })).data;
}
async function wc({ playlistName: n, newPlaylistInfo: e }) {
  const i = await M.readAsync(ae, "json"), a = i.playlists.map((t) => t.name === n ? { ...e, profiles: t.profiles } : t);
  return i.currentPlaylist = { name: e.name, profile: "Default" }, i.playlists = a, await M.renameAsync(_n(n), e.name), await M.writeAsync(ae, i);
}
async function Ec() {
  const n = await ce(), e = n.currentPlaylist.name;
  if (!n.playlists.find((d) => d.name === e)) return Je(!1, "Error: playlist info");
  const a = await Pn(e);
  if (!a) return Je(!1, "Error: urls");
  const t = await ts(a.getAuthenticateUrl);
  if (!t || !t.status) return Je(!1, t == null ? void 0 : t.message);
  const o = await ns(e), s = await as(e), x = await is(e);
  return await os(e), !o || !s || !x ? Je(!1, "Playlist cannot be added/updated") : Je(!0, {
    updatedVod: o,
    updatedSeries: s,
    updatedLive: x
  });
}
function Je(n, e) {
  return {
    isSuccess: n,
    data: e
  };
}
async function kc() {
  const e = (await ce()).currentPlaylist.name;
  return await M.readAsync(G.join(_n(e), "trending.json"), "json") || [];
}
const _c = gs(import.meta.url), Sc = G.dirname(_c);
let ge = null;
async function rt(n, e) {
  return ge || (ge = (async () => {
    const a = (await ce()).currentPlaylist.name, t = await ss(a);
    if (n)
      return new Promise((o, s) => {
        const x = new ks(
          G.resolve(Sc, "./fetchTmdbTrending.worker.js"),
          { workerData: { apiKey: n, vodPlaylist: t } }
        );
        x.on("message", async (d) => {
          ge = null, d.isSuccess ? (await M.writeAsync(G.join(_n(a), "trending.json"), d.tmdbData), e.webContents.send("trending", { isSuccess: !0, data: d.result }), o(d.isSuccess), x.terminate()) : s(d.error);
        }), x.on("error", (d) => {
          ge = null, s(d);
        }), x.on("exit", (d) => {
          ge = null, d !== 0 && s(new Error(`Worker stopped with exit code ${d}`));
        });
      });
  })(), ge);
}
function Rc(n) {
  const e = process.env.VITE_TMDB_API_KEY;
  J.handle("get-metadata", ce), J.handle("authenticate-user", async (i, a) => await ts(a)), J.handle("fetch-tmdb-trending", async (i) => await rt(e, n)), J.handle("get-local-tmdb-trending", async (i) => await kc()), J.handle("update-current-playlist", async (i) => {
    const a = await Ec();
    return a.isSuccess && await rt(e, n), a;
  }), J.handle("update-vod", async (i, a) => await ns(a)), J.handle("update-series", async (i, a) => await as(a)), J.handle("update-live", async (i, a) => await is(a)), J.handle("add-playlist-to-meta", async (i, a) => await sc(a)), J.handle("edit-playlist-info", async (i, a) => await wc(a)), J.handle("remove-playlist", async (i, a) => await bc(a)), J.handle("get-local-vod-playlist", async (i, a) => await ss(a)), J.handle("get-local-series-playlist", async (i, a) => await oc(a)), J.handle("get-local-live-playlist", async (i, a) => await rc(a)), J.handle("get-playlist-info", async (i, a) => await cc(a)), J.handle("get-vod-info", async (i, a) => await pc(a)), J.handle("get-serie-info", async (i, a) => await lc(a)), J.handle("get-user-data", async (i, a) => await uc(a)), J.handle("update-user-data", async (i, a) => await dc(a)), J.handle("change-current-playlist", async (i, a) => await mc(a)), J.handle("updated-at-playlist", async (i, a) => await os(a)), J.handle("create-profile", async (i, a) => await fc(a)), J.handle("switch-profile", async (i, a) => await hc(a)), J.handle("rename-profile", async (i, a) => await xc(a)), J.handle("remove-profile", async (i, a) => await vc(a)), J.handle("launch-vlc", async (i, a) => gc(a, n)), J.handle("get-vlc-state", async (i) => await yc());
}
var un = { exports: {} }, dn = { exports: {} }, mn = { exports: {} }, xa, ct;
function Ac() {
  if (ct) return xa;
  ct = 1;
  var n = 1e3, e = n * 60, i = e * 60, a = i * 24, t = a * 365.25;
  xa = function(f, p) {
    p = p || {};
    var l = typeof f;
    if (l === "string" && f.length > 0)
      return o(f);
    if (l === "number" && isNaN(f) === !1)
      return p.long ? x(f) : s(f);
    throw new Error(
      "val is not a non-empty string or a valid number. val=" + JSON.stringify(f)
    );
  };
  function o(f) {
    if (f = String(f), !(f.length > 100)) {
      var p = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
        f
      );
      if (p) {
        var l = parseFloat(p[1]), u = (p[2] || "ms").toLowerCase();
        switch (u) {
          case "years":
          case "year":
          case "yrs":
          case "yr":
          case "y":
            return l * t;
          case "days":
          case "day":
          case "d":
            return l * a;
          case "hours":
          case "hour":
          case "hrs":
          case "hr":
          case "h":
            return l * i;
          case "minutes":
          case "minute":
          case "mins":
          case "min":
          case "m":
            return l * e;
          case "seconds":
          case "second":
          case "secs":
          case "sec":
          case "s":
            return l * n;
          case "milliseconds":
          case "millisecond":
          case "msecs":
          case "msec":
          case "ms":
            return l;
          default:
            return;
        }
      }
    }
  }
  function s(f) {
    return f >= a ? Math.round(f / a) + "d" : f >= i ? Math.round(f / i) + "h" : f >= e ? Math.round(f / e) + "m" : f >= n ? Math.round(f / n) + "s" : f + "ms";
  }
  function x(f) {
    return d(f, a, "day") || d(f, i, "hour") || d(f, e, "minute") || d(f, n, "second") || f + " ms";
  }
  function d(f, p, l) {
    if (!(f < p))
      return f < p * 1.5 ? Math.floor(f / p) + " " + l : Math.ceil(f / p) + " " + l + "s";
  }
  return xa;
}
var pt;
function rs() {
  return pt || (pt = 1, function(n, e) {
    e = n.exports = t.debug = t.default = t, e.coerce = d, e.disable = s, e.enable = o, e.enabled = x, e.humanize = Ac(), e.names = [], e.skips = [], e.formatters = {};
    var i;
    function a(f) {
      var p = 0, l;
      for (l in f)
        p = (p << 5) - p + f.charCodeAt(l), p |= 0;
      return e.colors[Math.abs(p) % e.colors.length];
    }
    function t(f) {
      function p() {
        if (p.enabled) {
          var l = p, u = +/* @__PURE__ */ new Date(), m = u - (i || u);
          l.diff = m, l.prev = i, l.curr = u, i = u;
          for (var r = new Array(arguments.length), c = 0; c < r.length; c++)
            r[c] = arguments[c];
          r[0] = e.coerce(r[0]), typeof r[0] != "string" && r.unshift("%O");
          var h = 0;
          r[0] = r[0].replace(/%([a-zA-Z%])/g, function(y, w) {
            if (y === "%%") return y;
            h++;
            var C = e.formatters[w];
            if (typeof C == "function") {
              var S = r[h];
              y = C.call(l, S), r.splice(h, 1), h--;
            }
            return y;
          }), e.formatArgs.call(l, r);
          var v = p.log || e.log || console.log.bind(console);
          v.apply(l, r);
        }
      }
      return p.namespace = f, p.enabled = e.enabled(f), p.useColors = e.useColors(), p.color = a(f), typeof e.init == "function" && e.init(p), p;
    }
    function o(f) {
      e.save(f), e.names = [], e.skips = [];
      for (var p = (typeof f == "string" ? f : "").split(/[\s,]+/), l = p.length, u = 0; u < l; u++)
        p[u] && (f = p[u].replace(/\*/g, ".*?"), f[0] === "-" ? e.skips.push(new RegExp("^" + f.substr(1) + "$")) : e.names.push(new RegExp("^" + f + "$")));
    }
    function s() {
      e.enable("");
    }
    function x(f) {
      var p, l;
      for (p = 0, l = e.skips.length; p < l; p++)
        if (e.skips[p].test(f))
          return !1;
      for (p = 0, l = e.names.length; p < l; p++)
        if (e.names[p].test(f))
          return !0;
      return !1;
    }
    function d(f) {
      return f instanceof Error ? f.stack || f.message : f;
    }
  }(mn, mn.exports)), mn.exports;
}
var lt;
function Tc() {
  return lt || (lt = 1, function(n, e) {
    e = n.exports = rs(), e.log = t, e.formatArgs = a, e.save = o, e.load = s, e.useColors = i, e.storage = typeof chrome < "u" && typeof chrome.storage < "u" ? chrome.storage.local : x(), e.colors = [
      "lightseagreen",
      "forestgreen",
      "goldenrod",
      "dodgerblue",
      "darkorchid",
      "crimson"
    ];
    function i() {
      return typeof window < "u" && window.process && window.process.type === "renderer" ? !0 : typeof document < "u" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // is firebug? http://stackoverflow.com/a/398120/376773
      typeof window < "u" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || // double check webkit in userAgent just in case we are in a worker
      typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    e.formatters.j = function(d) {
      try {
        return JSON.stringify(d);
      } catch (f) {
        return "[UnexpectedJSONParseError]: " + f.message;
      }
    };
    function a(d) {
      var f = this.useColors;
      if (d[0] = (f ? "%c" : "") + this.namespace + (f ? " %c" : " ") + d[0] + (f ? "%c " : " ") + "+" + e.humanize(this.diff), !!f) {
        var p = "color: " + this.color;
        d.splice(1, 0, p, "color: inherit");
        var l = 0, u = 0;
        d[0].replace(/%[a-zA-Z%]/g, function(m) {
          m !== "%%" && (l++, m === "%c" && (u = l));
        }), d.splice(u, 0, p);
      }
    }
    function t() {
      return typeof console == "object" && console.log && Function.prototype.apply.call(console.log, console, arguments);
    }
    function o(d) {
      try {
        d == null ? e.storage.removeItem("debug") : e.storage.debug = d;
      } catch {
      }
    }
    function s() {
      var d;
      try {
        d = e.storage.debug;
      } catch {
      }
      return !d && typeof process < "u" && "env" in process && (d = process.env.DEBUG), d;
    }
    e.enable(s());
    function x() {
      try {
        return window.localStorage;
      } catch {
      }
    }
  }(dn, dn.exports)), dn.exports;
}
var fn = { exports: {} }, ut;
function jc() {
  return ut || (ut = 1, function(n, e) {
    var i = Ta, a = xe;
    e = n.exports = rs(), e.init = u, e.log = d, e.formatArgs = x, e.save = f, e.load = p, e.useColors = s, e.colors = [6, 2, 3, 4, 5, 1], e.inspectOpts = Object.keys(process.env).filter(function(m) {
      return /^debug_/i.test(m);
    }).reduce(function(m, r) {
      var c = r.substring(6).toLowerCase().replace(/_([a-z])/g, function(v, y) {
        return y.toUpperCase();
      }), h = process.env[r];
      return /^(yes|on|true|enabled)$/i.test(h) ? h = !0 : /^(no|off|false|disabled)$/i.test(h) ? h = !1 : h === "null" ? h = null : h = Number(h), m[c] = h, m;
    }, {});
    var t = parseInt(process.env.DEBUG_FD, 10) || 2;
    t !== 1 && t !== 2 && a.deprecate(function() {
    }, "except for stderr(2) and stdout(1), any other usage of DEBUG_FD is deprecated. Override debug.log if you want to use a different log function (https://git.io/debug_fd)")();
    var o = t === 1 ? process.stdout : t === 2 ? process.stderr : l(t);
    function s() {
      return "colors" in e.inspectOpts ? !!e.inspectOpts.colors : i.isatty(t);
    }
    e.formatters.o = function(m) {
      return this.inspectOpts.colors = this.useColors, a.inspect(m, this.inspectOpts).split(`
`).map(function(r) {
        return r.trim();
      }).join(" ");
    }, e.formatters.O = function(m) {
      return this.inspectOpts.colors = this.useColors, a.inspect(m, this.inspectOpts);
    };
    function x(m) {
      var r = this.namespace, c = this.useColors;
      if (c) {
        var h = this.color, v = "  \x1B[3" + h + ";1m" + r + " \x1B[0m";
        m[0] = v + m[0].split(`
`).join(`
` + v), m.push("\x1B[3" + h + "m+" + e.humanize(this.diff) + "\x1B[0m");
      } else
        m[0] = (/* @__PURE__ */ new Date()).toUTCString() + " " + r + " " + m[0];
    }
    function d() {
      return o.write(a.format.apply(a, arguments) + `
`);
    }
    function f(m) {
      m == null ? delete process.env.DEBUG : process.env.DEBUG = m;
    }
    function p() {
      return process.env.DEBUG;
    }
    function l(m) {
      var r, c = process.binding("tty_wrap");
      switch (c.guessHandleType(m)) {
        case "TTY":
          r = new i.WriteStream(m), r._type = "tty", r._handle && r._handle.unref && r._handle.unref();
          break;
        case "FILE":
          var h = Te;
          r = new h.SyncWriteStream(m, { autoClose: !1 }), r._type = "fs";
          break;
        case "PIPE":
        case "TCP":
          var v = _s;
          r = new v.Socket({
            fd: m,
            readable: !1,
            writable: !0
          }), r.readable = !1, r.read = null, r._type = "pipe", r._handle && r._handle.unref && r._handle.unref();
          break;
        default:
          throw new Error("Implement me. Unknown stream file type!");
      }
      return r.fd = m, r._isStdio = !0, r;
    }
    function u(m) {
      m.inspectOpts = {};
      for (var r = Object.keys(e.inspectOpts), c = 0; c < r.length; c++)
        m.inspectOpts[r[c]] = e.inspectOpts[r[c]];
    }
    e.enable(p());
  }(fn, fn.exports)), fn.exports;
}
var dt;
function Cc() {
  return dt || (dt = 1, typeof process < "u" && process.type === "renderer" ? un.exports = Tc() : un.exports = jc()), un.exports;
}
var va, mt;
function Oc() {
  if (mt) return va;
  mt = 1;
  var n = G, e = Es.spawn, i = Cc()("electron-squirrel-startup"), a = xs.app, t = function(s, x) {
    var d = n.resolve(n.dirname(process.execPath), "..", "Update.exe");
    i("Spawning `%s` with args `%s`", d, s), e(d, s, {
      detached: !0
    }).on("close", x);
  }, o = function() {
    if (process.platform === "win32") {
      var s = process.argv[1];
      i("processing squirrel command `%s`", s);
      var x = n.basename(process.execPath);
      if (s === "--squirrel-install" || s === "--squirrel-updated")
        return t(["--createShortcut=" + x], a.quit), !0;
      if (s === "--squirrel-uninstall")
        return t(["--removeShortcut=" + x], a.quit), !0;
      if (s === "--squirrel-obsolete")
        return a.quit(), !0;
    }
    return !1;
  };
  return va = o(), va;
}
var Pc = Oc();
const qc = /* @__PURE__ */ Ze(Pc);
var ue = { exports: {} };
const Fc = "16.5.0", Lc = {
  version: Fc
};
var ft;
function Dc() {
  if (ft) return ue.exports;
  ft = 1;
  const n = Te, e = G, i = Sa, a = Xe, o = Lc.version, s = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg;
  function x(S) {
    const F = {};
    let R = S.toString();
    R = R.replace(/\r\n?/mg, `
`);
    let T;
    for (; (T = s.exec(R)) != null; ) {
      const P = T[1];
      let O = T[2] || "";
      O = O.trim();
      const b = O[0];
      O = O.replace(/^(['"`])([\s\S]*)\1$/mg, "$2"), b === '"' && (O = O.replace(/\\n/g, `
`), O = O.replace(/\\r/g, "\r")), F[P] = O;
    }
    return F;
  }
  function d(S) {
    const F = m(S), R = C.configDotenv({ path: F });
    if (!R.parsed) {
      const b = new Error(`MISSING_DATA: Cannot parse ${F} for an unknown reason`);
      throw b.code = "MISSING_DATA", b;
    }
    const T = l(S).split(","), P = T.length;
    let O;
    for (let b = 0; b < P; b++)
      try {
        const g = T[b].trim(), k = u(R, g);
        O = C.decrypt(k.ciphertext, k.key);
        break;
      } catch (g) {
        if (b + 1 >= P)
          throw g;
      }
    return C.parse(O);
  }
  function f(S) {
    console.log(`[dotenv@${o}][WARN] ${S}`);
  }
  function p(S) {
    console.log(`[dotenv@${o}][DEBUG] ${S}`);
  }
  function l(S) {
    return S && S.DOTENV_KEY && S.DOTENV_KEY.length > 0 ? S.DOTENV_KEY : process.env.DOTENV_KEY && process.env.DOTENV_KEY.length > 0 ? process.env.DOTENV_KEY : "";
  }
  function u(S, F) {
    let R;
    try {
      R = new URL(F);
    } catch (g) {
      if (g.code === "ERR_INVALID_URL") {
        const k = new Error("INVALID_DOTENV_KEY: Wrong format. Must be in valid uri format like dotenv://:key_1234@dotenvx.com/vault/.env.vault?environment=development");
        throw k.code = "INVALID_DOTENV_KEY", k;
      }
      throw g;
    }
    const T = R.password;
    if (!T) {
      const g = new Error("INVALID_DOTENV_KEY: Missing key part");
      throw g.code = "INVALID_DOTENV_KEY", g;
    }
    const P = R.searchParams.get("environment");
    if (!P) {
      const g = new Error("INVALID_DOTENV_KEY: Missing environment part");
      throw g.code = "INVALID_DOTENV_KEY", g;
    }
    const O = `DOTENV_VAULT_${P.toUpperCase()}`, b = S.parsed[O];
    if (!b) {
      const g = new Error(`NOT_FOUND_DOTENV_ENVIRONMENT: Cannot locate environment ${O} in your .env.vault file.`);
      throw g.code = "NOT_FOUND_DOTENV_ENVIRONMENT", g;
    }
    return { ciphertext: b, key: T };
  }
  function m(S) {
    let F = null;
    if (S && S.path && S.path.length > 0)
      if (Array.isArray(S.path))
        for (const R of S.path)
          n.existsSync(R) && (F = R.endsWith(".vault") ? R : `${R}.vault`);
      else
        F = S.path.endsWith(".vault") ? S.path : `${S.path}.vault`;
    else
      F = e.resolve(process.cwd(), ".env.vault");
    return n.existsSync(F) ? F : null;
  }
  function r(S) {
    return S[0] === "~" ? e.join(i.homedir(), S.slice(1)) : S;
  }
  function c(S) {
    !!(S && S.debug) && p("Loading env from encrypted .env.vault");
    const R = C._parseVault(S);
    let T = process.env;
    return S && S.processEnv != null && (T = S.processEnv), C.populate(T, R, S), { parsed: R };
  }
  function h(S) {
    const F = e.resolve(process.cwd(), ".env");
    let R = "utf8";
    const T = !!(S && S.debug);
    S && S.encoding ? R = S.encoding : T && p("No encoding is specified. UTF-8 is used by default");
    let P = [F];
    if (S && S.path)
      if (!Array.isArray(S.path))
        P = [r(S.path)];
      else {
        P = [];
        for (const k of S.path)
          P.push(r(k));
      }
    let O;
    const b = {};
    for (const k of P)
      try {
        const q = C.parse(n.readFileSync(k, { encoding: R }));
        C.populate(b, q, S);
      } catch (q) {
        T && p(`Failed to load ${k} ${q.message}`), O = q;
      }
    let g = process.env;
    return S && S.processEnv != null && (g = S.processEnv), C.populate(g, b, S), O ? { parsed: b, error: O } : { parsed: b };
  }
  function v(S) {
    if (l(S).length === 0)
      return C.configDotenv(S);
    const F = m(S);
    return F ? C._configVault(S) : (f(`You set DOTENV_KEY but you are missing a .env.vault file at ${F}. Did you forget to build it?`), C.configDotenv(S));
  }
  function y(S, F) {
    const R = Buffer.from(F.slice(-64), "hex");
    let T = Buffer.from(S, "base64");
    const P = T.subarray(0, 12), O = T.subarray(-16);
    T = T.subarray(12, -16);
    try {
      const b = a.createDecipheriv("aes-256-gcm", R, P);
      return b.setAuthTag(O), `${b.update(T)}${b.final()}`;
    } catch (b) {
      const g = b instanceof RangeError, k = b.message === "Invalid key length", q = b.message === "Unsupported state or unable to authenticate data";
      if (g || k) {
        const L = new Error("INVALID_DOTENV_KEY: It must be 64 characters long (or more)");
        throw L.code = "INVALID_DOTENV_KEY", L;
      } else if (q) {
        const L = new Error("DECRYPTION_FAILED: Please check your DOTENV_KEY");
        throw L.code = "DECRYPTION_FAILED", L;
      } else
        throw b;
    }
  }
  function w(S, F, R = {}) {
    const T = !!(R && R.debug), P = !!(R && R.override);
    if (typeof F != "object") {
      const O = new Error("OBJECT_REQUIRED: Please check the processEnv argument being passed to populate");
      throw O.code = "OBJECT_REQUIRED", O;
    }
    for (const O of Object.keys(F))
      Object.prototype.hasOwnProperty.call(S, O) ? (P === !0 && (S[O] = F[O]), T && p(P === !0 ? `"${O}" is already defined and WAS overwritten` : `"${O}" is already defined and was NOT overwritten`)) : S[O] = F[O];
  }
  const C = {
    configDotenv: h,
    _configVault: c,
    _parseVault: d,
    config: v,
    decrypt: y,
    parse: x,
    populate: w
  };
  return ue.exports.configDotenv = C.configDotenv, ue.exports._configVault = C._configVault, ue.exports._parseVault = C._parseVault, ue.exports.config = C.config, ue.exports.decrypt = C.decrypt, ue.exports.parse = C.parse, ue.exports.populate = C.populate, ue.exports = C, ue.exports;
}
var Nc = Dc();
const Ic = /* @__PURE__ */ Ze(Nc);
Ic.config();
const cs = me.dirname(vs(import.meta.url));
process.env.APP_ROOT = me.join(cs, "..");
const _a = process.env.VITE_DEV_SERVER_URL, kp = me.join(process.env.APP_ROOT, "dist-electron"), ps = me.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = _a ? me.join(process.env.APP_ROOT, "public") : ps;
let te;
ke.commandLine.appendSwitch("gtk-version", "3");
qc && ke.quit();
function ls() {
  te = new ht({
    icon: me.join(process.env.VITE_PUBLIC, "icons/icon.png"),
    webPreferences: {
      preload: me.join(cs, "preload.mjs"),
      nodeIntegration: !1,
      // nodeIntegrationInWorker: true,
      contextIsolation: !0,
      webSecurity: !1,
      spellcheck: !1
    }
  }), te.menuBarVisible = !1, te.webContents.on("did-finish-load", () => {
    te == null || te.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), _a ? te.loadURL(_a) : te.loadFile(me.join(ps, "index.html")), te.once("ready-to-show", () => {
    te == null || te.maximize();
  });
}
ke.on("window-all-closed", () => {
  process.platform !== "darwin" && (ke.quit(), te = null);
});
ke.on("activate", () => {
  ht.getAllWindows().length === 0 && ls();
});
ke.whenReady().then(() => {
  ls(), Rc(te);
});
export {
  kp as MAIN_DIST,
  ps as RENDERER_DIST,
  _a as VITE_DEV_SERVER_URL
};
