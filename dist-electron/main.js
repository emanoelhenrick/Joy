var $_ = Object.defineProperty;
var j_ = (i, e, t) => e in i ? $_(i, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : i[e] = t;
var Zt = (i, e, t) => j_(i, typeof e != "symbol" ? e + "" : e, t);
import D_, { app as ti, ipcMain as be, BrowserWindow as Ld } from "electron";
import { fileURLToPath as N_ } from "node:url";
import pt from "node:path";
import Lt, { TextEncoder as B_ } from "util";
import Re from "path";
import Gi from "fs";
import Ec from "crypto";
import Fd from "os";
import _n, { Readable as U_ } from "stream";
import Rc from "http";
import Sc from "https";
import Ls from "url";
import z_ from "assert";
import kc from "tty";
import dt from "zlib";
import { EventEmitter as H_ } from "events";
import G_, { spawn as W_ } from "child_process";
import K_ from "net";
var On = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Ac(i) {
  return i && i.__esModule && Object.prototype.hasOwnProperty.call(i, "default") ? i.default : i;
}
function J_(i) {
  if (i.__esModule) return i;
  var e = i.default;
  if (typeof e == "function") {
    var t = function s() {
      return this instanceof s ? Reflect.construct(e, arguments, this.constructor) : e.apply(this, arguments);
    };
    t.prototype = e.prototype;
  } else t = {};
  return Object.defineProperty(t, "__esModule", { value: !0 }), Object.keys(i).forEach(function(s) {
    var o = Object.getOwnPropertyDescriptor(i, s);
    Object.defineProperty(t, s, o.get ? o : {
      enumerable: !0,
      get: function() {
        return i[s];
      }
    });
  }), t;
}
var Fs = {}, V_ = (i) => function() {
  const e = arguments.length, t = new Array(e);
  for (let s = 0; s < e; s += 1)
    t[s] = arguments[s];
  return new Promise((s, o) => {
    t.push((c, l) => {
      c ? o(c) : s(l);
    }), i.apply(null, t);
  });
};
const gs = Gi, X_ = V_, Y_ = (i) => [
  typeof gs[i] == "function",
  !i.match(/Sync$/),
  !i.match(/^[A-Z]/),
  !i.match(/^create/),
  !i.match(/^(un)?watch/)
].every(Boolean), Z_ = (i) => {
  const e = gs[i];
  return X_(e);
}, Q_ = () => {
  const i = {};
  return Object.keys(gs).forEach((e) => {
    Y_(e) ? e === "exists" ? i.exists = () => {
      throw new Error("fs.exists() is deprecated");
    } : i[e] = Z_(e) : i[e] = gs[e];
  }), i;
};
var pn = Q_(), Ft = {};
const e0 = (i) => {
  const e = (t) => ["a", "e", "i", "o", "u"].indexOf(t[0]) !== -1 ? `an ${t}` : `a ${t}`;
  return i.map(e).join(" or ");
}, qd = (i) => /array of /.test(i), $d = (i) => i.split(" of ")[1], jd = (i) => qd(i) ? jd($d(i)) : [
  "string",
  "number",
  "boolean",
  "array",
  "object",
  "buffer",
  "null",
  "undefined",
  "function"
].some((e) => e === i), ji = (i) => i === null ? "null" : Array.isArray(i) ? "array" : Buffer.isBuffer(i) ? "buffer" : typeof i, n0 = (i, e, t) => t.indexOf(i) === e, t0 = (i) => {
  let e = ji(i), t;
  return e === "array" && (t = i.map((s) => ji(s)).filter(n0), e += ` of ${t.join(", ")}`), e;
}, i0 = (i, e) => {
  const t = $d(e);
  return ji(i) !== "array" ? !1 : i.every((s) => ji(s) === t);
}, Yo = (i, e, t, s) => {
  if (!s.some((c) => {
    if (!jd(c))
      throw new Error(`Unknown type "${c}"`);
    return qd(c) ? i0(t, c) : c === ji(t);
  }))
    throw new Error(
      `Argument "${e}" passed to ${i} must be ${e0(
        s
      )}. Received ${t0(t)}`
    );
}, a0 = (i, e, t, s) => {
  t !== void 0 && (Yo(i, e, t, ["object"]), Object.keys(t).forEach((o) => {
    const c = `${e}.${o}`;
    if (s[o] !== void 0)
      Yo(i, c, t[o], s[o]);
    else
      throw new Error(
        `Unknown argument "${c}" passed to ${i}`
      );
  }));
};
var Ue = {
  argument: Yo,
  options: a0
}, In = {}, qs = {};
qs.normalizeFileMode = (i) => {
  let e;
  return typeof i == "number" ? e = i.toString(8) : e = i, e.substring(e.length - 3);
};
var si = {};
const Dd = pn, s0 = Ue, r0 = (i, e) => {
  const t = `${i}([path])`;
  s0.argument(t, "path", e, ["string", "undefined"]);
}, o0 = (i) => {
  Dd.rmSync(i, {
    recursive: !0,
    force: !0,
    maxRetries: 3
  });
}, c0 = (i) => Dd.rm(i, {
  recursive: !0,
  force: !0,
  maxRetries: 3
});
si.validateInput = r0;
si.sync = o0;
si.async = c0;
const $s = Re, Nn = pn, Tc = qs, Mp = Ue, Nd = si, u0 = (i, e, t) => {
  const s = `${i}(path, [criteria])`;
  Mp.argument(s, "path", e, ["string"]), Mp.options(s, "criteria", t, {
    empty: ["boolean"],
    mode: ["string", "number"]
  });
}, Bd = (i) => {
  const e = i || {};
  return typeof e.empty != "boolean" && (e.empty = !1), e.mode !== void 0 && (e.mode = Tc.normalizeFileMode(e.mode)), e;
}, Ud = (i) => new Error(
  `Path ${i} exists but is not a directory. Halting jetpack.dir() call for safety reasons.`
), l0 = (i) => {
  let e;
  try {
    e = Nn.statSync(i);
  } catch (t) {
    if (t.code !== "ENOENT")
      throw t;
  }
  if (e && !e.isDirectory())
    throw Ud(i);
  return e;
}, Cc = (i, e) => {
  const t = e || {};
  try {
    Nn.mkdirSync(i, t.mode);
  } catch (s) {
    if (s.code === "ENOENT")
      Cc($s.dirname(i), t), Nn.mkdirSync(i, t.mode);
    else if (s.code !== "EEXIST") throw s;
  }
}, p0 = (i, e, t) => {
  const s = () => {
    const c = Tc.normalizeFileMode(e.mode);
    t.mode !== void 0 && t.mode !== c && Nn.chmodSync(i, t.mode);
  }, o = () => {
    t.empty && Nn.readdirSync(i).forEach((l) => {
      Nd.sync($s.resolve(i, l));
    });
  };
  s(), o();
}, d0 = (i, e) => {
  const t = Bd(e), s = l0(i);
  s ? p0(i, s, t) : Cc(i, t);
}, f0 = (i) => new Promise((e, t) => {
  Nn.stat(i).then((s) => {
    s.isDirectory() ? e(s) : t(Ud(i));
  }).catch((s) => {
    s.code === "ENOENT" ? e(void 0) : t(s);
  });
}), m0 = (i) => new Promise((e, t) => {
  Nn.readdir(i).then((s) => {
    const o = (c) => {
      if (c === s.length)
        e();
      else {
        const l = $s.resolve(i, s[c]);
        Nd.async(l).then(() => {
          o(c + 1);
        });
      }
    };
    o(0);
  }).catch(t);
}), h0 = (i, e, t) => new Promise((s, o) => {
  const c = () => {
    const p = Tc.normalizeFileMode(e.mode);
    return t.mode !== void 0 && t.mode !== p ? Nn.chmod(i, t.mode) : Promise.resolve();
  }, l = () => t.empty ? m0(i) : Promise.resolve();
  c().then(l).then(s, o);
}), Oc = (i, e) => {
  const t = e || {};
  return new Promise((s, o) => {
    Nn.mkdir(i, t.mode).then(s).catch((c) => {
      c.code === "ENOENT" ? Oc($s.dirname(i), t).then(() => Nn.mkdir(i, t.mode)).then(s).catch((l) => {
        l.code === "EEXIST" ? s() : o(l);
      }) : c.code === "EEXIST" ? s() : o(c);
    });
  });
}, v0 = (i, e) => new Promise((t, s) => {
  const o = Bd(e);
  f0(i).then((c) => c !== void 0 ? h0(
    i,
    c,
    o
  ) : Oc(i, o)).then(t, s);
});
In.validateInput = u0;
In.sync = d0;
In.createSync = Cc;
In.async = v0;
In.createAsync = Oc;
const zd = Re, ii = pn, Ao = Ue, Hd = In, x0 = (i, e, t, s) => {
  const o = `${i}(path, data, [options])`;
  Ao.argument(o, "path", e, ["string"]), Ao.argument(o, "data", t, [
    "string",
    "buffer",
    "object",
    "array"
  ]), Ao.options(o, "options", s, {
    mode: ["string", "number"],
    atomic: ["boolean"],
    jsonIndent: ["number"]
  });
}, bs = ".__new__", Gd = (i, e) => {
  let t = e;
  return typeof t != "number" && (t = 2), typeof i == "object" && !Buffer.isBuffer(i) && i !== null ? JSON.stringify(i, null, t) : i;
}, Wd = (i, e, t) => {
  try {
    ii.writeFileSync(i, e, t);
  } catch (s) {
    if (s.code === "ENOENT")
      Hd.createSync(zd.dirname(i)), ii.writeFileSync(i, e, t);
    else
      throw s;
  }
}, g0 = (i, e, t) => {
  Wd(i + bs, e, t), ii.renameSync(i + bs, i);
}, b0 = (i, e, t) => {
  const s = t || {}, o = Gd(e, s.jsonIndent);
  let c = Wd;
  s.atomic && (c = g0), c(i, o, { mode: s.mode });
}, Kd = (i, e, t) => new Promise((s, o) => {
  ii.writeFile(i, e, t).then(s).catch((c) => {
    c.code === "ENOENT" ? Hd.createAsync(zd.dirname(i)).then(() => ii.writeFile(i, e, t)).then(s, o) : o(c);
  });
}), y0 = (i, e, t) => new Promise((s, o) => {
  Kd(i + bs, e, t).then(() => ii.rename(i + bs, i)).then(s, o);
}), w0 = (i, e, t) => {
  const s = t || {}, o = Gd(e, s.jsonIndent);
  let c = Kd;
  return s.atomic && (c = y0), c(i, o, { mode: s.mode });
};
Ft.validateInput = x0;
Ft.sync = b0;
Ft.async = w0;
const Jd = pn, Vd = Ft, To = Ue, _0 = (i, e, t, s) => {
  const o = `${i}(path, data, [options])`;
  To.argument(o, "path", e, ["string"]), To.argument(o, "data", t, ["string", "buffer"]), To.options(o, "options", s, {
    mode: ["string", "number"]
  });
}, E0 = (i, e, t) => {
  try {
    Jd.appendFileSync(i, e, t);
  } catch (s) {
    if (s.code === "ENOENT")
      Vd.sync(i, e, t);
    else
      throw s;
  }
}, R0 = (i, e, t) => new Promise((s, o) => {
  Jd.appendFile(i, e, t).then(s).catch((c) => {
    c.code === "ENOENT" ? Vd.async(i, e, t).then(s, o) : o(c);
  });
});
Fs.validateInput = _0;
Fs.sync = E0;
Fs.async = R0;
var js = {};
const Ds = pn, Ic = qs, Pp = Ue, Ns = Ft, S0 = (i, e, t) => {
  const s = `${i}(path, [criteria])`;
  Pp.argument(s, "path", e, ["string"]), Pp.options(s, "criteria", t, {
    content: ["string", "buffer", "object", "array"],
    jsonIndent: ["number"],
    mode: ["string", "number"]
  });
}, Xd = (i) => {
  const e = i || {};
  return e.mode !== void 0 && (e.mode = Ic.normalizeFileMode(e.mode)), e;
}, Yd = (i) => new Error(
  `Path ${i} exists but is not a file. Halting jetpack.file() call for safety reasons.`
), k0 = (i) => {
  let e;
  try {
    e = Ds.statSync(i);
  } catch (t) {
    if (t.code !== "ENOENT")
      throw t;
  }
  if (e && !e.isFile())
    throw Yd(i);
  return e;
}, A0 = (i, e, t) => {
  const s = Ic.normalizeFileMode(e.mode), o = () => t.content !== void 0 ? (Ns.sync(i, t.content, {
    mode: s,
    jsonIndent: t.jsonIndent
  }), !0) : !1, c = () => {
    t.mode !== void 0 && t.mode !== s && Ds.chmodSync(i, t.mode);
  };
  o() || c();
}, T0 = (i, e) => {
  let t = "";
  e.content !== void 0 && (t = e.content), Ns.sync(i, t, {
    mode: e.mode,
    jsonIndent: e.jsonIndent
  });
}, C0 = (i, e) => {
  const t = Xd(e), s = k0(i);
  s !== void 0 ? A0(i, s, t) : T0(i, t);
}, O0 = (i) => new Promise((e, t) => {
  Ds.stat(i).then((s) => {
    s.isFile() ? e(s) : t(Yd(i));
  }).catch((s) => {
    s.code === "ENOENT" ? e(void 0) : t(s);
  });
}), I0 = (i, e, t) => {
  const s = Ic.normalizeFileMode(e.mode), o = () => new Promise((l, p) => {
    t.content !== void 0 ? Ns.async(i, t.content, {
      mode: s,
      jsonIndent: t.jsonIndent
    }).then(() => {
      l(!0);
    }).catch(p) : l(!1);
  }), c = () => {
    if (t.mode !== void 0 && t.mode !== s)
      return Ds.chmod(i, t.mode);
  };
  return o().then((l) => {
    if (!l)
      return c();
  });
}, M0 = (i, e) => {
  let t = "";
  return e.content !== void 0 && (t = e.content), Ns.async(i, t, {
    mode: e.mode,
    jsonIndent: e.jsonIndent
  });
}, P0 = (i, e) => new Promise((t, s) => {
  const o = Xd(e);
  O0(i).then((c) => c !== void 0 ? I0(i, c, o) : M0(i, o)).then(t, s);
});
js.validateInput = S0;
js.sync = C0;
js.async = P0;
var Bs = {}, Wi = {}, Bn = {};
const Zd = Ec, L0 = Re, ft = pn, Lp = Ue, Zo = ["md5", "sha1", "sha256", "sha512"], Qo = ["report", "follow"], F0 = (i, e, t) => {
  const s = `${i}(path, [options])`;
  if (Lp.argument(s, "path", e, ["string"]), Lp.options(s, "options", t, {
    checksum: ["string"],
    mode: ["boolean"],
    times: ["boolean"],
    absolutePath: ["boolean"],
    symlinks: ["string"]
  }), t && t.checksum !== void 0 && Zo.indexOf(t.checksum) === -1)
    throw new Error(
      `Argument "options.checksum" passed to ${s} must have one of values: ${Zo.join(
        ", "
      )}`
    );
  if (t && t.symlinks !== void 0 && Qo.indexOf(t.symlinks) === -1)
    throw new Error(
      `Argument "options.symlinks" passed to ${s} must have one of values: ${Qo.join(
        ", "
      )}`
    );
}, Qd = (i, e, t) => {
  const s = {};
  return s.name = L0.basename(i), t.isFile() ? (s.type = "file", s.size = t.size) : t.isDirectory() ? s.type = "dir" : t.isSymbolicLink() ? s.type = "symlink" : s.type = "other", e.mode && (s.mode = t.mode), e.times && (s.accessTime = t.atime, s.modifyTime = t.mtime, s.changeTime = t.ctime, s.birthTime = t.birthtime), e.absolutePath && (s.absolutePath = i), s;
}, q0 = (i, e) => {
  const t = Zd.createHash(e), s = ft.readFileSync(i);
  return t.update(s), t.digest("hex");
}, $0 = (i, e, t) => {
  e.type === "file" && t.checksum ? e[t.checksum] = q0(i, t.checksum) : e.type === "symlink" && (e.pointsAt = ft.readlinkSync(i));
}, j0 = (i, e) => {
  let t = ft.lstatSync, s;
  const o = e || {};
  o.symlinks === "follow" && (t = ft.statSync);
  try {
    s = t(i);
  } catch (l) {
    if (l.code === "ENOENT")
      return;
    throw l;
  }
  const c = Qd(i, o, s);
  return $0(i, c, o), c;
}, D0 = (i, e) => new Promise((t, s) => {
  const o = Zd.createHash(e), c = ft.createReadStream(i);
  c.on("data", (l) => {
    o.update(l);
  }), c.on("end", () => {
    t(o.digest("hex"));
  }), c.on("error", s);
}), N0 = (i, e, t) => e.type === "file" && t.checksum ? D0(i, t.checksum).then((s) => (e[t.checksum] = s, e)) : e.type === "symlink" ? ft.readlink(i).then((s) => (e.pointsAt = s, e)) : Promise.resolve(e), B0 = (i, e) => new Promise((t, s) => {
  let o = ft.lstat;
  const c = e || {};
  c.symlinks === "follow" && (o = ft.stat), o(i).then((l) => {
    const p = Qd(i, c, l);
    N0(i, p, c).then(t, s);
  }).catch((l) => {
    l.code === "ENOENT" ? t(void 0) : s(l);
  });
});
Bn.supportedChecksumAlgorithms = Zo;
Bn.symlinkOptions = Qo;
Bn.validateInput = F0;
Bn.sync = j0;
Bn.async = B0;
var Us = {};
const ef = pn, U0 = Ue, z0 = (i, e) => {
  const t = `${i}(path)`;
  U0.argument(t, "path", e, ["string", "undefined"]);
}, H0 = (i) => {
  try {
    return ef.readdirSync(i);
  } catch (e) {
    if (e.code === "ENOENT")
      return;
    throw e;
  }
}, G0 = (i) => new Promise((e, t) => {
  ef.readdir(i).then((s) => {
    e(s);
  }).catch((s) => {
    s.code === "ENOENT" ? e(void 0) : t(s);
  });
});
Us.validateInput = z0;
Us.sync = H0;
Us.async = G0;
const ys = Gi, ws = Re, $i = Bn, _s = (i) => i.isDirectory() ? "dir" : i.isFile() ? "file" : i.isSymbolicLink() ? "symlink" : "other", W0 = (i, e, t) => {
  e.maxLevelsDeep === void 0 && (e.maxLevelsDeep = 1 / 0);
  const s = e.inspectOptions !== void 0;
  e.symlinks && (e.inspectOptions === void 0 ? e.inspectOptions = { symlinks: e.symlinks } : e.inspectOptions.symlinks = e.symlinks);
  const o = (l, p) => {
    ys.readdirSync(l, { withFileTypes: !0 }).forEach((f) => {
      const m = typeof f == "string";
      let h;
      m ? h = ws.join(l, f) : h = ws.join(l, f.name);
      let g;
      if (s)
        g = $i.sync(h, e.inspectOptions);
      else if (m) {
        const y = $i.sync(
          h,
          e.inspectOptions
        );
        g = { name: y.name, type: y.type };
      } else {
        const y = _s(f);
        if (y === "symlink" && e.symlinks === "follow") {
          const S = ys.statSync(h);
          g = { name: f.name, type: _s(S) };
        } else
          g = { name: f.name, type: y };
      }
      g !== void 0 && (t(h, g), g.type === "dir" && p < e.maxLevelsDeep && o(h, p + 1));
    });
  }, c = $i.sync(i, e.inspectOptions);
  c ? (s ? t(i, c) : t(i, { name: c.name, type: c.type }), c.type === "dir" && o(i, 1)) : t(i, void 0);
}, K0 = 5, J0 = (i, e, t, s) => {
  e.maxLevelsDeep === void 0 && (e.maxLevelsDeep = 1 / 0);
  const o = e.inspectOptions !== void 0;
  e.symlinks && (e.inspectOptions === void 0 ? e.inspectOptions = { symlinks: e.symlinks } : e.inspectOptions.symlinks = e.symlinks);
  const c = [];
  let l = 0;
  const p = () => {
    if (c.length === 0 && l === 0)
      s();
    else if (c.length > 0 && l < K0) {
      const g = c.pop();
      l += 1, g();
    }
  }, f = (g) => {
    c.push(g), p();
  }, m = () => {
    l -= 1, p();
  }, h = (g, y) => {
    const S = (_, O) => {
      O.type === "dir" && y < e.maxLevelsDeep && h(_, y + 1);
    };
    f(() => {
      ys.readdir(g, { withFileTypes: !0 }, (_, O) => {
        _ ? s(_) : (O.forEach((C) => {
          const F = typeof C == "string";
          let $;
          if (F ? $ = ws.join(g, C) : $ = ws.join(g, C.name), o || F)
            f(() => {
              $i.async($, e.inspectOptions).then((q) => {
                q !== void 0 && (o ? t($, q) : t($, {
                  name: q.name,
                  type: q.type
                }), S($, q)), m();
              }).catch((q) => {
                s(q);
              });
            });
          else {
            const q = _s(C);
            if (q === "symlink" && e.symlinks === "follow")
              f(() => {
                ys.stat($, (G, z) => {
                  if (G)
                    s(G);
                  else {
                    const te = {
                      name: C.name,
                      type: _s(z)
                    };
                    t($, te), S($, te), m();
                  }
                });
              });
            else {
              const G = { name: C.name, type: q };
              t($, G), S($, G);
            }
          }
        }), m());
      });
    });
  };
  $i.async(i, e.inspectOptions).then((g) => {
    g ? (o ? t(i, g) : t(i, { name: g.name, type: g.type }), g.type === "dir" ? h(i, 1) : s()) : (t(i, void 0), s());
  }).catch((g) => {
    s(g);
  });
};
Wi.sync = W0;
Wi.async = J0;
var Mc = {};
const V0 = typeof process == "object" && process && process.platform === "win32";
var X0 = V0 ? { sep: "\\" } : { sep: "/" }, Y0 = nf;
function nf(i, e, t) {
  i instanceof RegExp && (i = Fp(i, t)), e instanceof RegExp && (e = Fp(e, t));
  var s = tf(i, e, t);
  return s && {
    start: s[0],
    end: s[1],
    pre: t.slice(0, s[0]),
    body: t.slice(s[0] + i.length, s[1]),
    post: t.slice(s[1] + e.length)
  };
}
function Fp(i, e) {
  var t = e.match(i);
  return t ? t[0] : null;
}
nf.range = tf;
function tf(i, e, t) {
  var s, o, c, l, p, f = t.indexOf(i), m = t.indexOf(e, f + 1), h = f;
  if (f >= 0 && m > 0) {
    if (i === e)
      return [f, m];
    for (s = [], c = t.length; h >= 0 && !p; )
      h == f ? (s.push(h), f = t.indexOf(i, h + 1)) : s.length == 1 ? p = [s.pop(), m] : (o = s.pop(), o < c && (c = o, l = m), m = t.indexOf(e, h + 1)), h = f < m && f >= 0 ? f : m;
    s.length && (p = [c, l]);
  }
  return p;
}
var af = Y0, Z0 = n1, sf = "\0SLASH" + Math.random() + "\0", rf = "\0OPEN" + Math.random() + "\0", Pc = "\0CLOSE" + Math.random() + "\0", of = "\0COMMA" + Math.random() + "\0", cf = "\0PERIOD" + Math.random() + "\0";
function Co(i) {
  return parseInt(i, 10) == i ? parseInt(i, 10) : i.charCodeAt(0);
}
function Q0(i) {
  return i.split("\\\\").join(sf).split("\\{").join(rf).split("\\}").join(Pc).split("\\,").join(of).split("\\.").join(cf);
}
function e1(i) {
  return i.split(sf).join("\\").split(rf).join("{").split(Pc).join("}").split(of).join(",").split(cf).join(".");
}
function uf(i) {
  if (!i)
    return [""];
  var e = [], t = af("{", "}", i);
  if (!t)
    return i.split(",");
  var s = t.pre, o = t.body, c = t.post, l = s.split(",");
  l[l.length - 1] += "{" + o + "}";
  var p = uf(c);
  return c.length && (l[l.length - 1] += p.shift(), l.push.apply(l, p)), e.push.apply(e, l), e;
}
function n1(i) {
  return i ? (i.substr(0, 2) === "{}" && (i = "\\{\\}" + i.substr(2)), qi(Q0(i), !0).map(e1)) : [];
}
function t1(i) {
  return "{" + i + "}";
}
function i1(i) {
  return /^-?0\d/.test(i);
}
function a1(i, e) {
  return i <= e;
}
function s1(i, e) {
  return i >= e;
}
function qi(i, e) {
  var t = [], s = af("{", "}", i);
  if (!s) return [i];
  var o = s.pre, c = s.post.length ? qi(s.post, !1) : [""];
  if (/\$$/.test(s.pre))
    for (var l = 0; l < c.length; l++) {
      var p = o + "{" + s.body + "}" + c[l];
      t.push(p);
    }
  else {
    var f = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(s.body), m = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(s.body), h = f || m, g = s.body.indexOf(",") >= 0;
    if (!h && !g)
      return s.post.match(/,.*\}/) ? (i = s.pre + "{" + s.body + Pc + s.post, qi(i)) : [i];
    var y;
    if (h)
      y = s.body.split(/\.\./);
    else if (y = uf(s.body), y.length === 1 && (y = qi(y[0], !1).map(t1), y.length === 1))
      return c.map(function(Ie) {
        return s.pre + y[0] + Ie;
      });
    var S;
    if (h) {
      var _ = Co(y[0]), O = Co(y[1]), C = Math.max(y[0].length, y[1].length), F = y.length == 3 ? Math.abs(Co(y[2])) : 1, $ = a1, q = O < _;
      q && (F *= -1, $ = s1);
      var G = y.some(i1);
      S = [];
      for (var z = _; $(z, O); z += F) {
        var te;
        if (m)
          te = String.fromCharCode(z), te === "\\" && (te = "");
        else if (te = String(z), G) {
          var D = C - te.length;
          if (D > 0) {
            var H = new Array(D + 1).join("0");
            z < 0 ? te = "-" + H + te.slice(1) : te = H + te;
          }
        }
        S.push(te);
      }
    } else {
      S = [];
      for (var V = 0; V < y.length; V++)
        S.push.apply(S, qi(y[V], !1));
    }
    for (var V = 0; V < S.length; V++)
      for (var l = 0; l < c.length; l++) {
        var p = o + S[V] + c[l];
        (!e || h || p) && t.push(p);
      }
  }
  return t;
}
const un = lf = (i, e, t = {}) => (Es(e), !t.nocomment && e.charAt(0) === "#" ? !1 : new zs(e, t).match(i));
var lf = un;
const ec = X0;
un.sep = ec.sep;
const Cn = Symbol("globstar **");
un.GLOBSTAR = Cn;
const r1 = Z0, qp = {
  "!": { open: "(?:(?!(?:", close: "))[^/]*?)" },
  "?": { open: "(?:", close: ")?" },
  "+": { open: "(?:", close: ")+" },
  "*": { open: "(?:", close: ")*" },
  "@": { open: "(?:", close: ")" }
}, nc = "[^/]", Oo = nc + "*?", o1 = "(?:(?!(?:\\/|^)(?:\\.{1,2})($|\\/)).)*?", c1 = "(?:(?!(?:\\/|^)\\.).)*?", pf = (i) => i.split("").reduce((e, t) => (e[t] = !0, e), {}), $p = pf("().*{}+?[]^$\\!"), u1 = pf("[.("), jp = /\/+/;
un.filter = (i, e = {}) => (t, s, o) => un(t, i, e);
const ct = (i, e = {}) => {
  const t = {};
  return Object.keys(i).forEach((s) => t[s] = i[s]), Object.keys(e).forEach((s) => t[s] = e[s]), t;
};
un.defaults = (i) => {
  if (!i || typeof i != "object" || !Object.keys(i).length)
    return un;
  const e = un, t = (s, o, c) => e(s, o, ct(i, c));
  return t.Minimatch = class extends e.Minimatch {
    constructor(o, c) {
      super(o, ct(i, c));
    }
  }, t.Minimatch.defaults = (s) => e.defaults(ct(i, s)).Minimatch, t.filter = (s, o) => e.filter(s, ct(i, o)), t.defaults = (s) => e.defaults(ct(i, s)), t.makeRe = (s, o) => e.makeRe(s, ct(i, o)), t.braceExpand = (s, o) => e.braceExpand(s, ct(i, o)), t.match = (s, o, c) => e.match(s, o, ct(i, c)), t;
};
un.braceExpand = (i, e) => df(i, e);
const df = (i, e = {}) => (Es(i), e.nobrace || !/\{(?:(?!\{).)*\}/.test(i) ? [i] : r1(i)), l1 = 1024 * 64, Es = (i) => {
  if (typeof i != "string")
    throw new TypeError("invalid pattern");
  if (i.length > l1)
    throw new TypeError("pattern is too long");
}, Io = Symbol("subparse");
un.makeRe = (i, e) => new zs(i, e || {}).makeRe();
un.match = (i, e, t = {}) => {
  const s = new zs(e, t);
  return i = i.filter((o) => s.match(o)), s.options.nonull && !i.length && i.push(e), i;
};
const p1 = (i) => i.replace(/\\(.)/g, "$1"), d1 = (i) => i.replace(/\\([^-\]])/g, "$1"), f1 = (i) => i.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), m1 = (i) => i.replace(/[[\]\\]/g, "\\$&");
let zs = class {
  constructor(e, t) {
    Es(e), t || (t = {}), this.options = t, this.set = [], this.pattern = e, this.windowsPathsNoEscape = !!t.windowsPathsNoEscape || t.allowWindowsEscape === !1, this.windowsPathsNoEscape && (this.pattern = this.pattern.replace(/\\/g, "/")), this.regexp = null, this.negate = !1, this.comment = !1, this.empty = !1, this.partial = !!t.partial, this.make();
  }
  debug() {
  }
  make() {
    const e = this.pattern, t = this.options;
    if (!t.nocomment && e.charAt(0) === "#") {
      this.comment = !0;
      return;
    }
    if (!e) {
      this.empty = !0;
      return;
    }
    this.parseNegate();
    let s = this.globSet = this.braceExpand();
    t.debug && (this.debug = (...o) => console.error(...o)), this.debug(this.pattern, s), s = this.globParts = s.map((o) => o.split(jp)), this.debug(this.pattern, s), s = s.map((o, c, l) => o.map(this.parse, this)), this.debug(this.pattern, s), s = s.filter((o) => o.indexOf(!1) === -1), this.debug(this.pattern, s), this.set = s;
  }
  parseNegate() {
    if (this.options.nonegate) return;
    const e = this.pattern;
    let t = !1, s = 0;
    for (let o = 0; o < e.length && e.charAt(o) === "!"; o++)
      t = !t, s++;
    s && (this.pattern = e.slice(s)), this.negate = t;
  }
  // set partial to true to test if, for example,
  // "/a/b" matches the start of "/*/b/*/d"
  // Partial means, if you run out of file before you run
  // out of pattern, then that's fine, as long as all
  // the parts match.
  matchOne(e, t, s) {
    var o = this.options;
    this.debug(
      "matchOne",
      { this: this, file: e, pattern: t }
    ), this.debug("matchOne", e.length, t.length);
    for (var c = 0, l = 0, p = e.length, f = t.length; c < p && l < f; c++, l++) {
      this.debug("matchOne loop");
      var m = t[l], h = e[c];
      if (this.debug(t, m, h), m === !1) return !1;
      if (m === Cn) {
        this.debug("GLOBSTAR", [t, m, h]);
        var g = c, y = l + 1;
        if (y === f) {
          for (this.debug("** at the end"); c < p; c++)
            if (e[c] === "." || e[c] === ".." || !o.dot && e[c].charAt(0) === ".") return !1;
          return !0;
        }
        for (; g < p; ) {
          var S = e[g];
          if (this.debug(`
globstar while`, e, g, t, y, S), this.matchOne(e.slice(g), t.slice(y), s))
            return this.debug("globstar found match!", g, p, S), !0;
          if (S === "." || S === ".." || !o.dot && S.charAt(0) === ".") {
            this.debug("dot detected!", e, g, t, y);
            break;
          }
          this.debug("globstar swallow a segment, and continue"), g++;
        }
        return !!(s && (this.debug(`
>>> no match, partial?`, e, g, t, y), g === p));
      }
      var _;
      if (typeof m == "string" ? (_ = h === m, this.debug("string match", m, h, _)) : (_ = h.match(m), this.debug("pattern match", m, h, _)), !_) return !1;
    }
    if (c === p && l === f)
      return !0;
    if (c === p)
      return s;
    if (l === f)
      return c === p - 1 && e[c] === "";
    throw new Error("wtf?");
  }
  braceExpand() {
    return df(this.pattern, this.options);
  }
  parse(e, t) {
    Es(e);
    const s = this.options;
    if (e === "**")
      if (s.noglobstar)
        e = "*";
      else
        return Cn;
    if (e === "") return "";
    let o = "", c = !1, l = !1;
    const p = [], f = [];
    let m, h = !1, g = -1, y = -1, S, _, O, C = e.charAt(0) === ".", F = s.dot || C;
    const $ = () => C ? "" : F ? "(?!(?:^|\\/)\\.{1,2}(?:$|\\/))" : "(?!\\.)", q = (D) => D.charAt(0) === "." ? "" : s.dot ? "(?!(?:^|\\/)\\.{1,2}(?:$|\\/))" : "(?!\\.)", G = () => {
      if (m) {
        switch (m) {
          case "*":
            o += Oo, c = !0;
            break;
          case "?":
            o += nc, c = !0;
            break;
          default:
            o += "\\" + m;
            break;
        }
        this.debug("clearStateChar %j %j", m, o), m = !1;
      }
    };
    for (let D = 0, H; D < e.length && (H = e.charAt(D)); D++) {
      if (this.debug("%s	%s %s %j", e, D, o, H), l) {
        if (H === "/")
          return !1;
        $p[H] && (o += "\\"), o += H, l = !1;
        continue;
      }
      switch (H) {
        case "/":
          return !1;
        case "\\":
          if (h && e.charAt(D + 1) === "-") {
            o += H;
            continue;
          }
          G(), l = !0;
          continue;
        case "?":
        case "*":
        case "+":
        case "@":
        case "!":
          if (this.debug("%s	%s %s %j <-- stateChar", e, D, o, H), h) {
            this.debug("  in class"), H === "!" && D === y + 1 && (H = "^"), o += H;
            continue;
          }
          this.debug("call clearStateChar %j", m), G(), m = H, s.noext && G();
          continue;
        case "(": {
          if (h) {
            o += "(";
            continue;
          }
          if (!m) {
            o += "\\(";
            continue;
          }
          const V = {
            type: m,
            start: D - 1,
            reStart: o.length,
            open: qp[m].open,
            close: qp[m].close
          };
          this.debug(this.pattern, "	", V), p.push(V), o += V.open, V.start === 0 && V.type !== "!" && (C = !0, o += q(e.slice(D + 1))), this.debug("plType %j %j", m, o), m = !1;
          continue;
        }
        case ")": {
          const V = p[p.length - 1];
          if (h || !V) {
            o += "\\)";
            continue;
          }
          p.pop(), G(), c = !0, _ = V, o += _.close, _.type === "!" && f.push(Object.assign(_, { reEnd: o.length }));
          continue;
        }
        case "|": {
          const V = p[p.length - 1];
          if (h || !V) {
            o += "\\|";
            continue;
          }
          G(), o += "|", V.start === 0 && V.type !== "!" && (C = !0, o += q(e.slice(D + 1)));
          continue;
        }
        case "[":
          if (G(), h) {
            o += "\\" + H;
            continue;
          }
          h = !0, y = D, g = o.length, o += H;
          continue;
        case "]":
          if (D === y + 1 || !h) {
            o += "\\" + H;
            continue;
          }
          S = e.substring(y + 1, D);
          try {
            RegExp("[" + m1(d1(S)) + "]"), o += H;
          } catch {
            o = o.substring(0, g) + "(?:$.)";
          }
          c = !0, h = !1;
          continue;
        default:
          G(), $p[H] && !(H === "^" && h) && (o += "\\"), o += H;
          break;
      }
    }
    for (h && (S = e.slice(y + 1), O = this.parse(S, Io), o = o.substring(0, g) + "\\[" + O[0], c = c || O[1]), _ = p.pop(); _; _ = p.pop()) {
      let D;
      D = o.slice(_.reStart + _.open.length), this.debug("setting tail", o, _), D = D.replace(/((?:\\{2}){0,64})(\\?)\|/g, (V, Ie, Fe) => (Fe || (Fe = "\\"), Ie + Ie + Fe + "|")), this.debug(`tail=%j
   %s`, D, D, _, o);
      const H = _.type === "*" ? Oo : _.type === "?" ? nc : "\\" + _.type;
      c = !0, o = o.slice(0, _.reStart) + H + "\\(" + D;
    }
    G(), l && (o += "\\\\");
    const z = u1[o.charAt(0)];
    for (let D = f.length - 1; D > -1; D--) {
      const H = f[D], V = o.slice(0, H.reStart), Ie = o.slice(H.reStart, H.reEnd - 8);
      let Fe = o.slice(H.reEnd);
      const De = o.slice(H.reEnd - 8, H.reEnd) + Fe, vt = V.split(")").length, ue = V.split("(").length - vt;
      let ze = Fe;
      for (let W = 0; W < ue; W++)
        ze = ze.replace(/\)[+*?]?/, "");
      Fe = ze;
      const Ln = Fe === "" && t !== Io ? "(?:$|\\/)" : "";
      o = V + Ie + Fe + Ln + De;
    }
    if (o !== "" && c && (o = "(?=.)" + o), z && (o = $() + o), t === Io)
      return [o, c];
    if (s.nocase && !c && (c = e.toUpperCase() !== e.toLowerCase()), !c)
      return p1(e);
    const te = s.nocase ? "i" : "";
    try {
      return Object.assign(new RegExp("^" + o + "$", te), {
        _glob: e,
        _src: o
      });
    } catch {
      return new RegExp("$.");
    }
  }
  makeRe() {
    if (this.regexp || this.regexp === !1) return this.regexp;
    const e = this.set;
    if (!e.length)
      return this.regexp = !1, this.regexp;
    const t = this.options, s = t.noglobstar ? Oo : t.dot ? o1 : c1, o = t.nocase ? "i" : "";
    let c = e.map((l) => (l = l.map(
      (p) => typeof p == "string" ? f1(p) : p === Cn ? Cn : p._src
    ).reduce((p, f) => (p[p.length - 1] === Cn && f === Cn || p.push(f), p), []), l.forEach((p, f) => {
      p !== Cn || l[f - 1] === Cn || (f === 0 ? l.length > 1 ? l[f + 1] = "(?:\\/|" + s + "\\/)?" + l[f + 1] : l[f] = s : f === l.length - 1 ? l[f - 1] += "(?:\\/|" + s + ")?" : (l[f - 1] += "(?:\\/|\\/" + s + "\\/)" + l[f + 1], l[f + 1] = Cn));
    }), l.filter((p) => p !== Cn).join("/"))).join("|");
    c = "^(?:" + c + ")$", this.negate && (c = "^(?!" + c + ").*$");
    try {
      this.regexp = new RegExp(c, o);
    } catch {
      this.regexp = !1;
    }
    return this.regexp;
  }
  match(e, t = this.partial) {
    if (this.debug("match", e, this.pattern), this.comment) return !1;
    if (this.empty) return e === "";
    if (e === "/" && t) return !0;
    const s = this.options;
    ec.sep !== "/" && (e = e.split(ec.sep).join("/")), e = e.split(jp), this.debug(this.pattern, "split", e);
    const o = this.set;
    this.debug(this.pattern, "set", o);
    let c;
    for (let l = e.length - 1; l >= 0 && (c = e[l], !c); l--)
      ;
    for (let l = 0; l < o.length; l++) {
      const p = o[l];
      let f = e;
      if (s.matchBase && p.length === 1 && (f = [c]), this.matchOne(f, p, t))
        return s.flipNegate ? !0 : !this.negate;
    }
    return s.flipNegate ? !1 : this.negate;
  }
  static defaults(e) {
    return un.defaults(e).Minimatch;
  }
};
un.Minimatch = zs;
const h1 = lf.Minimatch, v1 = (i, e) => {
  const t = e.indexOf("/") !== -1, s = /^!?\//.test(e), o = /^!/.test(e);
  let c;
  if (!s && t) {
    const l = e.replace(/^!/, "").replace(/^\.\//, "");
    return /\/$/.test(i) ? c = "" : c = "/", o ? `!${i}${c}${l}` : `${i}${c}${l}`;
  }
  return e;
};
Mc.create = (i, e, t) => {
  let s;
  typeof e == "string" ? s = [e] : s = e;
  const o = s.map((l) => v1(i, l)).map((l) => new h1(l, {
    matchBase: !0,
    nocomment: !0,
    nocase: t || !1,
    dot: !0,
    windowsPathsNoEscape: !0
  }));
  return (l) => {
    let p = "matching", f = !1, m, h;
    for (h = 0; h < o.length; h += 1) {
      if (m = o[h], m.negate && (p = "negation", h === 0 && (f = !0)), p === "negation" && f && !m.match(l))
        return !1;
      p === "matching" && !f && (f = m.match(l));
    }
    return f;
  };
};
const x1 = Re, ff = Wi, mf = Bn, hf = Mc, Dp = Ue, g1 = (i, e, t) => {
  const s = `${i}([path], options)`;
  Dp.argument(s, "path", e, ["string"]), Dp.options(s, "options", t, {
    matching: ["string", "array of string"],
    filter: ["function"],
    files: ["boolean"],
    directories: ["boolean"],
    recursive: ["boolean"],
    ignoreCase: ["boolean"]
  });
}, vf = (i) => {
  const e = i || {};
  return e.matching === void 0 && (e.matching = "*"), e.files === void 0 && (e.files = !0), e.ignoreCase === void 0 && (e.ignoreCase = !1), e.directories === void 0 && (e.directories = !1), e.recursive === void 0 && (e.recursive = !0), e;
}, xf = (i, e) => i.map((t) => x1.relative(e, t)), gf = (i) => {
  const e = new Error(`Path you want to find stuff in doesn't exist ${i}`);
  return e.code = "ENOENT", e;
}, bf = (i) => {
  const e = new Error(
    `Path you want to find stuff in must be a directory ${i}`
  );
  return e.code = "ENOTDIR", e;
}, b1 = (i, e) => {
  const t = [], s = hf.create(
    i,
    e.matching,
    e.ignoreCase
  );
  let o = 1 / 0;
  return e.recursive === !1 && (o = 1), ff.sync(
    i,
    {
      maxLevelsDeep: o,
      symlinks: "follow",
      inspectOptions: { times: !0, absolutePath: !0 }
    },
    (c, l) => {
      l && c !== i && s(c) && (l.type === "file" && e.files === !0 || l.type === "dir" && e.directories === !0) && (e.filter ? e.filter(l) && t.push(c) : t.push(c));
    }
  ), t.sort(), xf(t, e.cwd);
}, y1 = (i, e) => {
  const t = mf.sync(i, { symlinks: "follow" });
  if (t === void 0)
    throw gf(i);
  if (t.type !== "dir")
    throw bf(i);
  return b1(i, vf(e));
}, w1 = (i, e) => new Promise((t, s) => {
  const o = [], c = hf.create(
    i,
    e.matching,
    e.ignoreCase
  );
  let l = 1 / 0;
  e.recursive === !1 && (l = 1);
  let p = 0, f = !1;
  const m = () => {
    f && p === 0 && (o.sort(), t(xf(o, e.cwd)));
  };
  ff.async(
    i,
    {
      maxLevelsDeep: l,
      symlinks: "follow",
      inspectOptions: { times: !0, absolutePath: !0 }
    },
    (h, g) => {
      if (g && h !== i && c(h) && (g.type === "file" && e.files === !0 || g.type === "dir" && e.directories === !0))
        if (e.filter) {
          const S = e.filter(g);
          typeof S.then == "function" ? (p += 1, S.then((O) => {
            O && o.push(h), p -= 1, m();
          }).catch((O) => {
            s(O);
          })) : S && o.push(h);
        } else
          o.push(h);
    },
    (h) => {
      h ? s(h) : (f = !0, m());
    }
  );
}), _1 = (i, e) => mf.async(i, { symlinks: "follow" }).then((t) => {
  if (t === void 0)
    throw gf(i);
  if (t.type !== "dir")
    throw bf(i);
  return w1(i, vf(e));
});
Bs.validateInput = g1;
Bs.sync = y1;
Bs.async = _1;
var Hs = {};
const E1 = Ec, Rs = Re, Wa = Bn, Np = Ue, yf = Wi, R1 = (i, e, t) => {
  const s = `${i}(path, [options])`;
  if (Np.argument(s, "path", e, ["string"]), Np.options(s, "options", t, {
    checksum: ["string"],
    relativePath: ["boolean"],
    times: ["boolean"],
    symlinks: ["string"]
  }), t && t.checksum !== void 0 && Wa.supportedChecksumAlgorithms.indexOf(t.checksum) === -1)
    throw new Error(
      `Argument "options.checksum" passed to ${s} must have one of values: ${Wa.supportedChecksumAlgorithms.join(
        ", "
      )}`
    );
  if (t && t.symlinks !== void 0 && Wa.symlinkOptions.indexOf(t.symlinks) === -1)
    throw new Error(
      `Argument "options.symlinks" passed to ${s} must have one of values: ${Wa.symlinkOptions.join(
        ", "
      )}`
    );
}, S1 = (i, e) => i === void 0 ? "." : i.relativePath + "/" + e.name, k1 = (i, e) => {
  const t = E1.createHash(e);
  return i.forEach((s) => {
    t.update(s.name + s[e]);
  }), t.digest("hex");
}, Lc = (i, e, t) => {
  t.relativePath && (e.relativePath = S1(i, e)), e.type === "dir" && (e.children.forEach((s) => {
    Lc(e, s, t);
  }), e.size = 0, e.children.sort((s, o) => s.type === "dir" && o.type === "file" ? -1 : s.type === "file" && o.type === "dir" ? 1 : s.name.localeCompare(o.name)), e.children.forEach((s) => {
    e.size += s.size || 0;
  }), t.checksum && (e[t.checksum] = k1(
    e.children,
    t.checksum
  )));
}, Fc = (i, e, t) => {
  const s = e[0];
  if (e.length > 1) {
    const o = i.children.find((c) => c.name === s);
    return Fc(o, e.slice(1));
  }
  return i;
}, A1 = (i, e) => {
  const t = e || {};
  let s;
  return yf.sync(i, { inspectOptions: t }, (o, c) => {
    if (c) {
      c.type === "dir" && (c.children = []);
      const l = Rs.relative(i, o);
      l === "" ? s = c : Fc(
        s,
        l.split(Rs.sep)
      ).children.push(c);
    }
  }), s && Lc(void 0, s, t), s;
}, T1 = (i, e) => {
  const t = e || {};
  let s;
  return new Promise((o, c) => {
    yf.async(
      i,
      { inspectOptions: t },
      (l, p) => {
        if (p) {
          p.type === "dir" && (p.children = []);
          const f = Rs.relative(i, l);
          f === "" ? s = p : Fc(
            s,
            f.split(Rs.sep)
          ).children.push(p);
        }
      },
      (l) => {
        l ? c(l) : (s && Lc(void 0, s, t), o(s));
      }
    );
  });
};
Hs.validateInput = R1;
Hs.sync = A1;
Hs.async = T1;
var Ki = {}, ri = {};
const wf = pn, C1 = Ue, O1 = (i, e) => {
  const t = `${i}(path)`;
  C1.argument(t, "path", e, ["string"]);
}, I1 = (i) => {
  try {
    const e = wf.statSync(i);
    return e.isDirectory() ? "dir" : e.isFile() ? "file" : "other";
  } catch (e) {
    if (e.code !== "ENOENT")
      throw e;
  }
  return !1;
}, M1 = (i) => new Promise((e, t) => {
  wf.stat(i).then((s) => {
    s.isDirectory() ? e("dir") : s.isFile() ? e("file") : e("other");
  }).catch((s) => {
    s.code === "ENOENT" ? e(!1) : t(s);
  });
});
ri.validateInput = O1;
ri.sync = I1;
ri.async = M1;
const Di = Re, cn = pn, qc = In, Ss = ri, _f = Bn, P1 = Ft, L1 = Mc, Ef = qs, Rf = Wi, Mo = Ue, F1 = (i, e, t, s) => {
  const o = `${i}(from, to, [options])`;
  Mo.argument(o, "from", e, ["string"]), Mo.argument(o, "to", t, ["string"]), Mo.options(o, "options", s, {
    overwrite: ["boolean", "function"],
    matching: ["string", "array of string"],
    ignoreCase: ["boolean"]
  });
}, Sf = (i, e) => {
  const t = i || {}, s = {};
  return t.ignoreCase === void 0 && (t.ignoreCase = !1), s.overwrite = t.overwrite, t.matching ? s.allowedToCopy = L1.create(
    e,
    t.matching,
    t.ignoreCase
  ) : s.allowedToCopy = () => !0, s;
}, kf = (i) => {
  const e = new Error(`Path to copy doesn't exist ${i}`);
  return e.code = "ENOENT", e;
}, Gs = (i) => {
  const e = new Error(`Destination path already exists ${i}`);
  return e.code = "EEXIST", e;
}, Ws = {
  mode: !0,
  symlinks: "report",
  times: !0,
  absolutePath: !0
}, Af = (i) => typeof i.opts.overwrite != "function" && i.opts.overwrite !== !0, q1 = (i, e, t) => {
  if (!Ss.sync(i))
    throw kf(i);
  if (Ss.sync(e) && !t.overwrite)
    throw Gs(e);
}, $1 = (i) => {
  if (typeof i.opts.overwrite == "function") {
    const e = _f.sync(i.destPath, Ws);
    return i.opts.overwrite(i.srcInspectData, e);
  }
  return i.opts.overwrite === !0;
}, j1 = (i, e, t, s) => {
  const o = cn.readFileSync(i);
  try {
    cn.writeFileSync(e, o, { mode: t, flag: "wx" });
  } catch (c) {
    if (c.code === "ENOENT")
      P1.sync(e, o, { mode: t });
    else if (c.code === "EEXIST") {
      if ($1(s))
        cn.writeFileSync(e, o, { mode: t });
      else if (Af(s))
        throw Gs(s.destPath);
    } else
      throw c;
  }
}, D1 = (i, e) => {
  const t = cn.readlinkSync(i);
  try {
    cn.symlinkSync(t, e);
  } catch (s) {
    if (s.code === "EEXIST")
      cn.unlinkSync(e), cn.symlinkSync(t, e);
    else
      throw s;
  }
}, N1 = (i, e, t, s) => {
  const o = { srcPath: i, destPath: t, srcInspectData: e, opts: s }, c = Ef.normalizeFileMode(e.mode);
  e.type === "dir" ? qc.createSync(t, { mode: c }) : e.type === "file" ? j1(i, t, c, o) : e.type === "symlink" && D1(i, t);
}, B1 = (i, e, t) => {
  const s = Sf(t, i);
  q1(i, e, s), Rf.sync(i, { inspectOptions: Ws }, (o, c) => {
    const l = Di.relative(i, o), p = Di.resolve(e, l);
    s.allowedToCopy(o, p, c) && N1(o, c, p, s);
  });
}, U1 = (i, e, t) => Ss.async(i).then((s) => {
  if (s)
    return Ss.async(e);
  throw kf(i);
}).then((s) => {
  if (s && !t.overwrite)
    throw Gs(e);
}), z1 = (i) => new Promise((e, t) => {
  typeof i.opts.overwrite == "function" ? _f.async(i.destPath, Ws).then((s) => {
    e(
      i.opts.overwrite(i.srcInspectData, s)
    );
  }).catch(t) : e(i.opts.overwrite === !0);
}), tc = (i, e, t, s, o) => new Promise((c, l) => {
  const p = o || {};
  let f = "wx";
  p.overwrite && (f = "w");
  const m = cn.createReadStream(i), h = cn.createWriteStream(e, { mode: t, flags: f });
  m.on("error", l), h.on("error", (g) => {
    m.resume(), g.code === "ENOENT" ? qc.createAsync(Di.dirname(e)).then(() => {
      tc(i, e, t, s).then(
        c,
        l
      );
    }).catch(l) : g.code === "EEXIST" ? z1(s).then((y) => {
      y ? tc(i, e, t, s, {
        overwrite: !0
      }).then(c, l) : Af(s) ? l(Gs(e)) : c();
    }).catch(l) : l(g);
  }), h.on("finish", c), m.pipe(h);
}), H1 = (i, e) => cn.readlink(i).then((t) => new Promise((s, o) => {
  cn.symlink(t, e).then(s).catch((c) => {
    c.code === "EEXIST" ? cn.unlink(e).then(() => cn.symlink(t, e)).then(s, o) : o(c);
  });
})), G1 = (i, e, t, s) => {
  const o = { srcPath: i, destPath: t, srcInspectData: e, opts: s }, c = Ef.normalizeFileMode(e.mode);
  return e.type === "dir" ? qc.createAsync(t, { mode: c }) : e.type === "file" ? tc(i, t, c, o) : e.type === "symlink" ? H1(i, t) : Promise.resolve();
}, W1 = (i, e, t) => new Promise((s, o) => {
  const c = Sf(t, i);
  U1(i, e, c).then(() => {
    let l = !1, p = 0;
    Rf.async(
      i,
      { inspectOptions: Ws },
      (f, m) => {
        if (m) {
          const h = Di.relative(i, f), g = Di.resolve(e, h);
          c.allowedToCopy(f, m, g) && (p += 1, G1(f, m, g, c).then(() => {
            p -= 1, l && p === 0 && s();
          }).catch(o));
        }
      },
      (f) => {
        f ? o(f) : (l = !0, l && p === 0 && s());
      }
    );
  }).catch(o);
});
Ki.validateInput = F1;
Ki.sync = B1;
Ki.async = W1;
var Ji = {};
const Tf = Re, ni = pn, Po = Ue, Cf = Ki, Of = In, Ni = ri, ks = si, K1 = (i, e, t, s) => {
  const o = `${i}(from, to, [options])`;
  Po.argument(o, "from", e, ["string"]), Po.argument(o, "to", t, ["string"]), Po.options(o, "options", s, {
    overwrite: ["boolean"]
  });
}, If = (i) => i || {}, Mf = (i) => {
  const e = new Error(`Destination path already exists ${i}`);
  return e.code = "EEXIST", e;
}, Pf = (i) => {
  const e = new Error(`Path to move doesn't exist ${i}`);
  return e.code = "ENOENT", e;
}, J1 = (i, e, t) => {
  const s = If(t);
  if (Ni.sync(e) !== !1 && s.overwrite !== !0)
    throw Mf(e);
  try {
    ni.renameSync(i, e);
  } catch (o) {
    if (o.code === "EISDIR" || o.code === "EPERM")
      ks.sync(e), ni.renameSync(i, e);
    else if (o.code === "EXDEV")
      Cf.sync(i, e, { overwrite: !0 }), ks.sync(i);
    else if (o.code === "ENOENT") {
      if (!Ni.sync(i))
        throw Pf(i);
      Of.createSync(Tf.dirname(e)), ni.renameSync(i, e);
    } else
      throw o;
  }
}, V1 = (i) => new Promise((e, t) => {
  const s = Tf.dirname(i);
  Ni.async(s).then((o) => {
    o ? t() : Of.createAsync(s).then(e, t);
  }).catch(t);
}), X1 = (i, e, t) => {
  const s = If(t);
  return new Promise((o, c) => {
    Ni.async(e).then((l) => {
      l !== !1 && s.overwrite !== !0 ? c(Mf(e)) : ni.rename(i, e).then(o).catch((p) => {
        p.code === "EISDIR" || p.code === "EPERM" ? ks.async(e).then(() => ni.rename(i, e)).then(o, c) : p.code === "EXDEV" ? Cf.async(i, e, { overwrite: !0 }).then(() => ks.async(i)).then(o, c) : p.code === "ENOENT" ? Ni.async(i).then((f) => {
          f ? V1(e).then(() => ni.rename(i, e)).then(o, c) : c(Pf(i));
        }).catch(c) : c(p);
      });
    });
  });
};
Ji.validateInput = K1;
Ji.sync = J1;
Ji.async = X1;
var Ks = {};
const Lf = pn, Bp = Ue, Up = ["utf8", "buffer", "json", "jsonWithDates"], Y1 = (i, e, t) => {
  const s = `${i}(path, returnAs)`;
  if (Bp.argument(s, "path", e, ["string"]), Bp.argument(s, "returnAs", t, [
    "string",
    "undefined"
  ]), t && Up.indexOf(t) === -1)
    throw new Error(
      `Argument "returnAs" passed to ${s} must have one of values: ${Up.join(
        ", "
      )}`
    );
}, Ff = (i, e) => typeof e == "string" && /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/.exec(e) ? new Date(e) : e, qf = (i, e) => {
  const t = new Error(
    `JSON parsing failed while reading ${i} [${e}]`
  );
  return t.originalError = e, t;
}, Z1 = (i, e) => {
  const t = e || "utf8";
  let s, o = "utf8";
  t === "buffer" && (o = null);
  try {
    s = Lf.readFileSync(i, { encoding: o });
  } catch (c) {
    if (c.code === "ENOENT")
      return;
    throw c;
  }
  try {
    t === "json" ? s = JSON.parse(s) : t === "jsonWithDates" && (s = JSON.parse(s, Ff));
  } catch (c) {
    throw qf(i, c);
  }
  return s;
}, Q1 = (i, e) => new Promise((t, s) => {
  const o = e || "utf8";
  let c = "utf8";
  o === "buffer" && (c = null), Lf.readFile(i, { encoding: c }).then((l) => {
    try {
      t(o === "json" ? JSON.parse(l) : o === "jsonWithDates" ? JSON.parse(l, Ff) : l);
    } catch (p) {
      s(qf(i, p));
    }
  }).catch((l) => {
    l.code === "ENOENT" ? t(void 0) : s(l);
  });
});
Ks.validateInput = Y1;
Ks.sync = Z1;
Ks.async = Q1;
var Js = {};
const Bi = Re, $f = Ji, Lo = Ue, eE = (i, e, t, s) => {
  const o = `${i}(path, newName, [options])`;
  if (Lo.argument(o, "path", e, ["string"]), Lo.argument(o, "newName", t, ["string"]), Lo.options(o, "options", s, {
    overwrite: ["boolean"]
  }), Bi.basename(t) !== t)
    throw new Error(
      `Argument "newName" passed to ${o} should be a filename, not a path. Received "${t}"`
    );
}, nE = (i, e, t) => {
  const s = Bi.join(Bi.dirname(i), e);
  $f.sync(i, s, t);
}, tE = (i, e, t) => {
  const s = Bi.join(Bi.dirname(i), e);
  return $f.async(i, s, t);
};
Js.validateInput = eE;
Js.sync = nE;
Js.async = tE;
var Vs = {};
const jf = Re, As = pn, zp = Ue, Df = In, iE = (i, e, t) => {
  const s = `${i}(symlinkValue, path)`;
  zp.argument(s, "symlinkValue", e, ["string"]), zp.argument(s, "path", t, ["string"]);
}, aE = (i, e) => {
  try {
    As.symlinkSync(i, e);
  } catch (t) {
    if (t.code === "ENOENT")
      Df.createSync(jf.dirname(e)), As.symlinkSync(i, e);
    else
      throw t;
  }
}, sE = (i, e) => new Promise((t, s) => {
  As.symlink(i, e).then(t).catch((o) => {
    o.code === "ENOENT" ? Df.createAsync(jf.dirname(e)).then(() => As.symlink(i, e)).then(t, s) : s(o);
  });
});
Vs.validateInput = iE;
Vs.sync = aE;
Vs.async = sE;
var $c = {};
const Nf = Gi;
$c.createWriteStream = Nf.createWriteStream;
$c.createReadStream = Nf.createReadStream;
var Xs = {};
const jc = Re, rE = Fd, Bf = Ec, Uf = In, zf = pn, oE = Ue, cE = (i, e) => {
  const t = `${i}([options])`;
  oE.options(t, "options", e, {
    prefix: ["string"],
    basePath: ["string"]
  });
}, Hf = (i, e) => {
  i = i || {};
  const t = {};
  return typeof i.prefix != "string" ? t.prefix = "" : t.prefix = i.prefix, typeof i.basePath == "string" ? t.basePath = jc.resolve(e, i.basePath) : t.basePath = rE.tmpdir(), t;
}, Gf = 32, uE = (i, e) => {
  const t = Hf(e, i), s = Bf.randomBytes(Gf / 2).toString("hex"), o = jc.join(
    t.basePath,
    t.prefix + s
  );
  try {
    zf.mkdirSync(o);
  } catch (c) {
    if (c.code === "ENOENT")
      Uf.sync(o);
    else
      throw c;
  }
  return o;
}, lE = (i, e) => new Promise((t, s) => {
  const o = Hf(e, i);
  Bf.randomBytes(Gf / 2, (c, l) => {
    if (c)
      s(c);
    else {
      const p = l.toString("hex"), f = jc.join(
        o.basePath,
        o.prefix + p
      );
      zf.mkdir(f, (m) => {
        m ? m.code === "ENOENT" ? Uf.async(f).then(() => {
          t(f);
        }, s) : s(m) : t(f);
      });
    }
  });
});
Xs.validateInput = cE;
Xs.sync = uE;
Xs.async = lE;
const Hp = Lt, Fo = Re, Ka = Fs, Ja = In, Va = js, Xa = Bs, Ya = Bn, Za = Hs, Qa = Ki, es = ri, ns = Us, ts = Ji, is = Ks, as = si, ss = Js, rs = Vs, Gp = $c, os = Xs, cs = Ft, Wf = (i) => {
  const e = () => i || process.cwd(), t = function() {
    if (arguments.length === 0)
      return e();
    const p = Array.prototype.slice.call(arguments), f = [e()].concat(p);
    return Wf(Fo.resolve.apply(null, f));
  }, s = (p) => Fo.resolve(e(), p), o = function() {
    return Array.prototype.unshift.call(arguments, e()), Fo.resolve.apply(null, arguments);
  }, c = (p) => {
    const f = p || {};
    return f.cwd = e(), f;
  }, l = {
    cwd: t,
    path: o,
    append: (p, f, m) => {
      Ka.validateInput("append", p, f, m), Ka.sync(s(p), f, m);
    },
    appendAsync: (p, f, m) => (Ka.validateInput("appendAsync", p, f, m), Ka.async(s(p), f, m)),
    copy: (p, f, m) => {
      Qa.validateInput("copy", p, f, m), Qa.sync(s(p), s(f), m);
    },
    copyAsync: (p, f, m) => (Qa.validateInput("copyAsync", p, f, m), Qa.async(s(p), s(f), m)),
    createWriteStream: (p, f) => Gp.createWriteStream(s(p), f),
    createReadStream: (p, f) => Gp.createReadStream(s(p), f),
    dir: (p, f) => {
      Ja.validateInput("dir", p, f);
      const m = s(p);
      return Ja.sync(m, f), t(m);
    },
    dirAsync: (p, f) => (Ja.validateInput("dirAsync", p, f), new Promise((m, h) => {
      const g = s(p);
      Ja.async(g, f).then(() => {
        m(t(g));
      }, h);
    })),
    exists: (p) => (es.validateInput("exists", p), es.sync(s(p))),
    existsAsync: (p) => (es.validateInput("existsAsync", p), es.async(s(p))),
    file: (p, f) => (Va.validateInput("file", p, f), Va.sync(s(p), f), l),
    fileAsync: (p, f) => (Va.validateInput("fileAsync", p, f), new Promise((m, h) => {
      Va.async(s(p), f).then(() => {
        m(l);
      }, h);
    })),
    find: (p, f) => (typeof f > "u" && typeof p == "object" && (f = p, p = "."), Xa.validateInput("find", p, f), Xa.sync(s(p), c(f))),
    findAsync: (p, f) => (typeof f > "u" && typeof p == "object" && (f = p, p = "."), Xa.validateInput("findAsync", p, f), Xa.async(s(p), c(f))),
    inspect: (p, f) => (Ya.validateInput("inspect", p, f), Ya.sync(s(p), f)),
    inspectAsync: (p, f) => (Ya.validateInput("inspectAsync", p, f), Ya.async(s(p), f)),
    inspectTree: (p, f) => (Za.validateInput("inspectTree", p, f), Za.sync(s(p), f)),
    inspectTreeAsync: (p, f) => (Za.validateInput("inspectTreeAsync", p, f), Za.async(s(p), f)),
    list: (p) => (ns.validateInput("list", p), ns.sync(s(p || "."))),
    listAsync: (p) => (ns.validateInput("listAsync", p), ns.async(s(p || "."))),
    move: (p, f, m) => {
      ts.validateInput("move", p, f, m), ts.sync(s(p), s(f), m);
    },
    moveAsync: (p, f, m) => (ts.validateInput("moveAsync", p, f, m), ts.async(s(p), s(f), m)),
    read: (p, f) => (is.validateInput("read", p, f), is.sync(s(p), f)),
    readAsync: (p, f) => (is.validateInput("readAsync", p, f), is.async(s(p), f)),
    remove: (p) => {
      as.validateInput("remove", p), as.sync(s(p || "."));
    },
    removeAsync: (p) => (as.validateInput("removeAsync", p), as.async(s(p || "."))),
    rename: (p, f, m) => {
      ss.validateInput("rename", p, f, m), ss.sync(s(p), f, m);
    },
    renameAsync: (p, f, m) => (ss.validateInput("renameAsync", p, f, m), ss.async(s(p), f, m)),
    symlink: (p, f) => {
      rs.validateInput("symlink", p, f), rs.sync(p, s(f));
    },
    symlinkAsync: (p, f) => (rs.validateInput("symlinkAsync", p, f), rs.async(p, s(f))),
    tmpDir: (p) => {
      os.validateInput("tmpDir", p);
      const f = os.sync(e(), p);
      return t(f);
    },
    tmpDirAsync: (p) => (os.validateInput("tmpDirAsync", p), new Promise((f, m) => {
      os.async(e(), p).then((h) => {
        f(t(h));
      }, m);
    })),
    write: (p, f, m) => {
      cs.validateInput("write", p, f, m), cs.sync(s(p), f, m);
    },
    writeAsync: (p, f, m) => (cs.validateInput("writeAsync", p, f, m), cs.async(s(p), f, m))
  };
  return Hp.inspect.custom !== void 0 && (l[Hp.inspect.custom] = () => `[fs-jetpack CWD: ${e()}]`), l;
};
var pE = Wf;
const dE = pE;
var me = dE();
const oi = ti.getPath("sessionData"), fE = Re.join(oi, "Playlists"), Ke = Re.join(fE, "meta.json"), mE = (i) => Re.join(oi, `Playlists/${i}`), It = (i, e) => Re.join(oi, `Playlists/${i}/user/${e}.json`), Kf = (i) => Re.join(oi, `Playlists/${i}/vod.json`), Jf = (i) => Re.join(oi, `Playlists/${i}/series.json`), Vf = (i) => Re.join(oi, `Playlists/${i}/live.json`);
async function qt() {
  const i = await me.readAsync(Ke, "json");
  if (!i) {
    const e = { currentPlaylist: { name: "", profile: "" }, playlists: [] };
    return await me.writeAsync(Ke, e), e;
  }
  return i;
}
function Xf(i, e) {
  return function() {
    return i.apply(e, arguments);
  };
}
const { toString: hE } = Object.prototype, { getPrototypeOf: Dc } = Object, Ys = /* @__PURE__ */ ((i) => (e) => {
  const t = hE.call(e);
  return i[t] || (i[t] = t.slice(8, -1).toLowerCase());
})(/* @__PURE__ */ Object.create(null)), Mn = (i) => (i = i.toLowerCase(), (e) => Ys(e) === i), Zs = (i) => (e) => typeof e === i, { isArray: ci } = Array, Ui = Zs("undefined");
function vE(i) {
  return i !== null && !Ui(i) && i.constructor !== null && !Ui(i.constructor) && ln(i.constructor.isBuffer) && i.constructor.isBuffer(i);
}
const Yf = Mn("ArrayBuffer");
function xE(i) {
  let e;
  return typeof ArrayBuffer < "u" && ArrayBuffer.isView ? e = ArrayBuffer.isView(i) : e = i && i.buffer && Yf(i.buffer), e;
}
const gE = Zs("string"), ln = Zs("function"), Zf = Zs("number"), Qs = (i) => i !== null && typeof i == "object", bE = (i) => i === !0 || i === !1, vs = (i) => {
  if (Ys(i) !== "object")
    return !1;
  const e = Dc(i);
  return (e === null || e === Object.prototype || Object.getPrototypeOf(e) === null) && !(Symbol.toStringTag in i) && !(Symbol.iterator in i);
}, yE = Mn("Date"), wE = Mn("File"), _E = Mn("Blob"), EE = Mn("FileList"), RE = (i) => Qs(i) && ln(i.pipe), SE = (i) => {
  let e;
  return i && (typeof FormData == "function" && i instanceof FormData || ln(i.append) && ((e = Ys(i)) === "formdata" || // detect form-data instance
  e === "object" && ln(i.toString) && i.toString() === "[object FormData]"));
}, kE = Mn("URLSearchParams"), [AE, TE, CE, OE] = ["ReadableStream", "Request", "Response", "Headers"].map(Mn), IE = (i) => i.trim ? i.trim() : i.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
function Vi(i, e, { allOwnKeys: t = !1 } = {}) {
  if (i === null || typeof i > "u")
    return;
  let s, o;
  if (typeof i != "object" && (i = [i]), ci(i))
    for (s = 0, o = i.length; s < o; s++)
      e.call(null, i[s], s, i);
  else {
    const c = t ? Object.getOwnPropertyNames(i) : Object.keys(i), l = c.length;
    let p;
    for (s = 0; s < l; s++)
      p = c[s], e.call(null, i[p], p, i);
  }
}
function Qf(i, e) {
  e = e.toLowerCase();
  const t = Object.keys(i);
  let s = t.length, o;
  for (; s-- > 0; )
    if (o = t[s], e === o.toLowerCase())
      return o;
  return null;
}
const Tt = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : global, em = (i) => !Ui(i) && i !== Tt;
function ic() {
  const { caseless: i } = em(this) && this || {}, e = {}, t = (s, o) => {
    const c = i && Qf(e, o) || o;
    vs(e[c]) && vs(s) ? e[c] = ic(e[c], s) : vs(s) ? e[c] = ic({}, s) : ci(s) ? e[c] = s.slice() : e[c] = s;
  };
  for (let s = 0, o = arguments.length; s < o; s++)
    arguments[s] && Vi(arguments[s], t);
  return e;
}
const ME = (i, e, t, { allOwnKeys: s } = {}) => (Vi(e, (o, c) => {
  t && ln(o) ? i[c] = Xf(o, t) : i[c] = o;
}, { allOwnKeys: s }), i), PE = (i) => (i.charCodeAt(0) === 65279 && (i = i.slice(1)), i), LE = (i, e, t, s) => {
  i.prototype = Object.create(e.prototype, s), i.prototype.constructor = i, Object.defineProperty(i, "super", {
    value: e.prototype
  }), t && Object.assign(i.prototype, t);
}, FE = (i, e, t, s) => {
  let o, c, l;
  const p = {};
  if (e = e || {}, i == null) return e;
  do {
    for (o = Object.getOwnPropertyNames(i), c = o.length; c-- > 0; )
      l = o[c], (!s || s(l, i, e)) && !p[l] && (e[l] = i[l], p[l] = !0);
    i = t !== !1 && Dc(i);
  } while (i && (!t || t(i, e)) && i !== Object.prototype);
  return e;
}, qE = (i, e, t) => {
  i = String(i), (t === void 0 || t > i.length) && (t = i.length), t -= e.length;
  const s = i.indexOf(e, t);
  return s !== -1 && s === t;
}, $E = (i) => {
  if (!i) return null;
  if (ci(i)) return i;
  let e = i.length;
  if (!Zf(e)) return null;
  const t = new Array(e);
  for (; e-- > 0; )
    t[e] = i[e];
  return t;
}, jE = /* @__PURE__ */ ((i) => (e) => i && e instanceof i)(typeof Uint8Array < "u" && Dc(Uint8Array)), DE = (i, e) => {
  const s = (i && i[Symbol.iterator]).call(i);
  let o;
  for (; (o = s.next()) && !o.done; ) {
    const c = o.value;
    e.call(i, c[0], c[1]);
  }
}, NE = (i, e) => {
  let t;
  const s = [];
  for (; (t = i.exec(e)) !== null; )
    s.push(t);
  return s;
}, BE = Mn("HTMLFormElement"), UE = (i) => i.toLowerCase().replace(
  /[-_\s]([a-z\d])(\w*)/g,
  function(t, s, o) {
    return s.toUpperCase() + o;
  }
), Wp = (({ hasOwnProperty: i }) => (e, t) => i.call(e, t))(Object.prototype), zE = Mn("RegExp"), nm = (i, e) => {
  const t = Object.getOwnPropertyDescriptors(i), s = {};
  Vi(t, (o, c) => {
    let l;
    (l = e(o, c, i)) !== !1 && (s[c] = l || o);
  }), Object.defineProperties(i, s);
}, HE = (i) => {
  nm(i, (e, t) => {
    if (ln(i) && ["arguments", "caller", "callee"].indexOf(t) !== -1)
      return !1;
    const s = i[t];
    if (ln(s)) {
      if (e.enumerable = !1, "writable" in e) {
        e.writable = !1;
        return;
      }
      e.set || (e.set = () => {
        throw Error("Can not rewrite read-only method '" + t + "'");
      });
    }
  });
}, GE = (i, e) => {
  const t = {}, s = (o) => {
    o.forEach((c) => {
      t[c] = !0;
    });
  };
  return ci(i) ? s(i) : s(String(i).split(e)), t;
}, WE = () => {
}, KE = (i, e) => i != null && Number.isFinite(i = +i) ? i : e, qo = "abcdefghijklmnopqrstuvwxyz", Kp = "0123456789", tm = {
  DIGIT: Kp,
  ALPHA: qo,
  ALPHA_DIGIT: qo + qo.toUpperCase() + Kp
}, JE = (i = 16, e = tm.ALPHA_DIGIT) => {
  let t = "";
  const { length: s } = e;
  for (; i--; )
    t += e[Math.random() * s | 0];
  return t;
};
function VE(i) {
  return !!(i && ln(i.append) && i[Symbol.toStringTag] === "FormData" && i[Symbol.iterator]);
}
const XE = (i) => {
  const e = new Array(10), t = (s, o) => {
    if (Qs(s)) {
      if (e.indexOf(s) >= 0)
        return;
      if (!("toJSON" in s)) {
        e[o] = s;
        const c = ci(s) ? [] : {};
        return Vi(s, (l, p) => {
          const f = t(l, o + 1);
          !Ui(f) && (c[p] = f);
        }), e[o] = void 0, c;
      }
    }
    return s;
  };
  return t(i, 0);
}, YE = Mn("AsyncFunction"), ZE = (i) => i && (Qs(i) || ln(i)) && ln(i.then) && ln(i.catch), im = ((i, e) => i ? setImmediate : e ? ((t, s) => (Tt.addEventListener("message", ({ source: o, data: c }) => {
  o === Tt && c === t && s.length && s.shift()();
}, !1), (o) => {
  s.push(o), Tt.postMessage(t, "*");
}))(`axios@${Math.random()}`, []) : (t) => setTimeout(t))(
  typeof setImmediate == "function",
  ln(Tt.postMessage)
), QE = typeof queueMicrotask < "u" ? queueMicrotask.bind(Tt) : typeof process < "u" && process.nextTick || im, k = {
  isArray: ci,
  isArrayBuffer: Yf,
  isBuffer: vE,
  isFormData: SE,
  isArrayBufferView: xE,
  isString: gE,
  isNumber: Zf,
  isBoolean: bE,
  isObject: Qs,
  isPlainObject: vs,
  isReadableStream: AE,
  isRequest: TE,
  isResponse: CE,
  isHeaders: OE,
  isUndefined: Ui,
  isDate: yE,
  isFile: wE,
  isBlob: _E,
  isRegExp: zE,
  isFunction: ln,
  isStream: RE,
  isURLSearchParams: kE,
  isTypedArray: jE,
  isFileList: EE,
  forEach: Vi,
  merge: ic,
  extend: ME,
  trim: IE,
  stripBOM: PE,
  inherits: LE,
  toFlatObject: FE,
  kindOf: Ys,
  kindOfTest: Mn,
  endsWith: qE,
  toArray: $E,
  forEachEntry: DE,
  matchAll: NE,
  isHTMLForm: BE,
  hasOwnProperty: Wp,
  hasOwnProp: Wp,
  // an alias to avoid ESLint no-prototype-builtins detection
  reduceDescriptors: nm,
  freezeMethods: HE,
  toObjectSet: GE,
  toCamelCase: UE,
  noop: WE,
  toFiniteNumber: KE,
  findKey: Qf,
  global: Tt,
  isContextDefined: em,
  ALPHABET: tm,
  generateString: JE,
  isSpecCompliantForm: VE,
  toJSONObject: XE,
  isAsyncFn: YE,
  isThenable: ZE,
  setImmediate: im,
  asap: QE
};
function N(i, e, t, s, o) {
  Error.call(this), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack, this.message = i, this.name = "AxiosError", e && (this.code = e), t && (this.config = t), s && (this.request = s), o && (this.response = o, this.status = o.status ? o.status : null);
}
k.inherits(N, Error, {
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
      config: k.toJSONObject(this.config),
      code: this.code,
      status: this.status
    };
  }
});
const am = N.prototype, sm = {};
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
].forEach((i) => {
  sm[i] = { value: i };
});
Object.defineProperties(N, sm);
Object.defineProperty(am, "isAxiosError", { value: !0 });
N.from = (i, e, t, s, o, c) => {
  const l = Object.create(am);
  return k.toFlatObject(i, l, function(f) {
    return f !== Error.prototype;
  }, (p) => p !== "isAxiosError"), N.call(l, i.message, e, t, s, o), l.cause = i, l.name = i.name, c && Object.assign(l, c), l;
};
var rm = _n.Stream, eR = Lt, nR = Pn;
function Pn() {
  this.source = null, this.dataSize = 0, this.maxDataSize = 1024 * 1024, this.pauseStream = !0, this._maxDataSizeExceeded = !1, this._released = !1, this._bufferedEvents = [];
}
eR.inherits(Pn, rm);
Pn.create = function(i, e) {
  var t = new this();
  e = e || {};
  for (var s in e)
    t[s] = e[s];
  t.source = i;
  var o = i.emit;
  return i.emit = function() {
    return t._handleEmit(arguments), o.apply(i, arguments);
  }, i.on("error", function() {
  }), t.pauseStream && i.pause(), t;
};
Object.defineProperty(Pn.prototype, "readable", {
  configurable: !0,
  enumerable: !0,
  get: function() {
    return this.source.readable;
  }
});
Pn.prototype.setEncoding = function() {
  return this.source.setEncoding.apply(this.source, arguments);
};
Pn.prototype.resume = function() {
  this._released || this.release(), this.source.resume();
};
Pn.prototype.pause = function() {
  this.source.pause();
};
Pn.prototype.release = function() {
  this._released = !0, this._bufferedEvents.forEach((function(i) {
    this.emit.apply(this, i);
  }).bind(this)), this._bufferedEvents = [];
};
Pn.prototype.pipe = function() {
  var i = rm.prototype.pipe.apply(this, arguments);
  return this.resume(), i;
};
Pn.prototype._handleEmit = function(i) {
  if (this._released) {
    this.emit.apply(this, i);
    return;
  }
  i[0] === "data" && (this.dataSize += i[1].length, this._checkIfMaxDataSizeExceeded()), this._bufferedEvents.push(i);
};
Pn.prototype._checkIfMaxDataSizeExceeded = function() {
  if (!this._maxDataSizeExceeded && !(this.dataSize <= this.maxDataSize)) {
    this._maxDataSizeExceeded = !0;
    var i = "DelayedStream#maxDataSize of " + this.maxDataSize + " bytes exceeded.";
    this.emit("error", new Error(i));
  }
};
var tR = Lt, om = _n.Stream, Jp = nR, iR = Ee;
function Ee() {
  this.writable = !1, this.readable = !0, this.dataSize = 0, this.maxDataSize = 2 * 1024 * 1024, this.pauseStreams = !0, this._released = !1, this._streams = [], this._currentStream = null, this._insideLoop = !1, this._pendingNext = !1;
}
tR.inherits(Ee, om);
Ee.create = function(i) {
  var e = new this();
  i = i || {};
  for (var t in i)
    e[t] = i[t];
  return e;
};
Ee.isStreamLike = function(i) {
  return typeof i != "function" && typeof i != "string" && typeof i != "boolean" && typeof i != "number" && !Buffer.isBuffer(i);
};
Ee.prototype.append = function(i) {
  var e = Ee.isStreamLike(i);
  if (e) {
    if (!(i instanceof Jp)) {
      var t = Jp.create(i, {
        maxDataSize: 1 / 0,
        pauseStream: this.pauseStreams
      });
      i.on("data", this._checkDataSize.bind(this)), i = t;
    }
    this._handleErrors(i), this.pauseStreams && i.pause();
  }
  return this._streams.push(i), this;
};
Ee.prototype.pipe = function(i, e) {
  return om.prototype.pipe.call(this, i, e), this.resume(), i;
};
Ee.prototype._getNext = function() {
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
};
Ee.prototype._realGetNext = function() {
  var i = this._streams.shift();
  if (typeof i > "u") {
    this.end();
    return;
  }
  if (typeof i != "function") {
    this._pipeNext(i);
    return;
  }
  var e = i;
  e((function(t) {
    var s = Ee.isStreamLike(t);
    s && (t.on("data", this._checkDataSize.bind(this)), this._handleErrors(t)), this._pipeNext(t);
  }).bind(this));
};
Ee.prototype._pipeNext = function(i) {
  this._currentStream = i;
  var e = Ee.isStreamLike(i);
  if (e) {
    i.on("end", this._getNext.bind(this)), i.pipe(this, { end: !1 });
    return;
  }
  var t = i;
  this.write(t), this._getNext();
};
Ee.prototype._handleErrors = function(i) {
  var e = this;
  i.on("error", function(t) {
    e._emitError(t);
  });
};
Ee.prototype.write = function(i) {
  this.emit("data", i);
};
Ee.prototype.pause = function() {
  this.pauseStreams && (this.pauseStreams && this._currentStream && typeof this._currentStream.pause == "function" && this._currentStream.pause(), this.emit("pause"));
};
Ee.prototype.resume = function() {
  this._released || (this._released = !0, this.writable = !0, this._getNext()), this.pauseStreams && this._currentStream && typeof this._currentStream.resume == "function" && this._currentStream.resume(), this.emit("resume");
};
Ee.prototype.end = function() {
  this._reset(), this.emit("end");
};
Ee.prototype.destroy = function() {
  this._reset(), this.emit("close");
};
Ee.prototype._reset = function() {
  this.writable = !1, this._streams = [], this._currentStream = null;
};
Ee.prototype._checkDataSize = function() {
  if (this._updateDataSize(), !(this.dataSize <= this.maxDataSize)) {
    var i = "DelayedStream#maxDataSize of " + this.maxDataSize + " bytes exceeded.";
    this._emitError(new Error(i));
  }
};
Ee.prototype._updateDataSize = function() {
  this.dataSize = 0;
  var i = this;
  this._streams.forEach(function(e) {
    e.dataSize && (i.dataSize += e.dataSize);
  }), this._currentStream && this._currentStream.dataSize && (this.dataSize += this._currentStream.dataSize);
};
Ee.prototype._emitError = function(i) {
  this._reset(), this.emit("error", i);
};
var cm = {};
const aR = {
  "application/1d-interleaved-parityfec": {
    source: "iana"
  },
  "application/3gpdash-qoe-report+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0
  },
  "application/3gpp-ims+xml": {
    source: "iana",
    compressible: !0
  },
  "application/3gpphal+json": {
    source: "iana",
    compressible: !0
  },
  "application/3gpphalforms+json": {
    source: "iana",
    compressible: !0
  },
  "application/a2l": {
    source: "iana"
  },
  "application/ace+cbor": {
    source: "iana"
  },
  "application/activemessage": {
    source: "iana"
  },
  "application/activity+json": {
    source: "iana",
    compressible: !0
  },
  "application/alto-costmap+json": {
    source: "iana",
    compressible: !0
  },
  "application/alto-costmapfilter+json": {
    source: "iana",
    compressible: !0
  },
  "application/alto-directory+json": {
    source: "iana",
    compressible: !0
  },
  "application/alto-endpointcost+json": {
    source: "iana",
    compressible: !0
  },
  "application/alto-endpointcostparams+json": {
    source: "iana",
    compressible: !0
  },
  "application/alto-endpointprop+json": {
    source: "iana",
    compressible: !0
  },
  "application/alto-endpointpropparams+json": {
    source: "iana",
    compressible: !0
  },
  "application/alto-error+json": {
    source: "iana",
    compressible: !0
  },
  "application/alto-networkmap+json": {
    source: "iana",
    compressible: !0
  },
  "application/alto-networkmapfilter+json": {
    source: "iana",
    compressible: !0
  },
  "application/alto-updatestreamcontrol+json": {
    source: "iana",
    compressible: !0
  },
  "application/alto-updatestreamparams+json": {
    source: "iana",
    compressible: !0
  },
  "application/aml": {
    source: "iana"
  },
  "application/andrew-inset": {
    source: "iana",
    extensions: [
      "ez"
    ]
  },
  "application/applefile": {
    source: "iana"
  },
  "application/applixware": {
    source: "apache",
    extensions: [
      "aw"
    ]
  },
  "application/at+jwt": {
    source: "iana"
  },
  "application/atf": {
    source: "iana"
  },
  "application/atfx": {
    source: "iana"
  },
  "application/atom+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "atom"
    ]
  },
  "application/atomcat+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "atomcat"
    ]
  },
  "application/atomdeleted+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "atomdeleted"
    ]
  },
  "application/atomicmail": {
    source: "iana"
  },
  "application/atomsvc+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "atomsvc"
    ]
  },
  "application/atsc-dwd+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "dwd"
    ]
  },
  "application/atsc-dynamic-event-message": {
    source: "iana"
  },
  "application/atsc-held+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "held"
    ]
  },
  "application/atsc-rdt+json": {
    source: "iana",
    compressible: !0
  },
  "application/atsc-rsat+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "rsat"
    ]
  },
  "application/atxml": {
    source: "iana"
  },
  "application/auth-policy+xml": {
    source: "iana",
    compressible: !0
  },
  "application/bacnet-xdd+zip": {
    source: "iana",
    compressible: !1
  },
  "application/batch-smtp": {
    source: "iana"
  },
  "application/bdoc": {
    compressible: !1,
    extensions: [
      "bdoc"
    ]
  },
  "application/beep+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0
  },
  "application/calendar+json": {
    source: "iana",
    compressible: !0
  },
  "application/calendar+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "xcs"
    ]
  },
  "application/call-completion": {
    source: "iana"
  },
  "application/cals-1840": {
    source: "iana"
  },
  "application/captive+json": {
    source: "iana",
    compressible: !0
  },
  "application/cbor": {
    source: "iana"
  },
  "application/cbor-seq": {
    source: "iana"
  },
  "application/cccex": {
    source: "iana"
  },
  "application/ccmp+xml": {
    source: "iana",
    compressible: !0
  },
  "application/ccxml+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "ccxml"
    ]
  },
  "application/cdfx+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "cdfx"
    ]
  },
  "application/cdmi-capability": {
    source: "iana",
    extensions: [
      "cdmia"
    ]
  },
  "application/cdmi-container": {
    source: "iana",
    extensions: [
      "cdmic"
    ]
  },
  "application/cdmi-domain": {
    source: "iana",
    extensions: [
      "cdmid"
    ]
  },
  "application/cdmi-object": {
    source: "iana",
    extensions: [
      "cdmio"
    ]
  },
  "application/cdmi-queue": {
    source: "iana",
    extensions: [
      "cdmiq"
    ]
  },
  "application/cdni": {
    source: "iana"
  },
  "application/cea": {
    source: "iana"
  },
  "application/cea-2018+xml": {
    source: "iana",
    compressible: !0
  },
  "application/cellml+xml": {
    source: "iana",
    compressible: !0
  },
  "application/cfw": {
    source: "iana"
  },
  "application/city+json": {
    source: "iana",
    compressible: !0
  },
  "application/clr": {
    source: "iana"
  },
  "application/clue+xml": {
    source: "iana",
    compressible: !0
  },
  "application/clue_info+xml": {
    source: "iana",
    compressible: !0
  },
  "application/cms": {
    source: "iana"
  },
  "application/cnrp+xml": {
    source: "iana",
    compressible: !0
  },
  "application/coap-group+json": {
    source: "iana",
    compressible: !0
  },
  "application/coap-payload": {
    source: "iana"
  },
  "application/commonground": {
    source: "iana"
  },
  "application/conference-info+xml": {
    source: "iana",
    compressible: !0
  },
  "application/cose": {
    source: "iana"
  },
  "application/cose-key": {
    source: "iana"
  },
  "application/cose-key-set": {
    source: "iana"
  },
  "application/cpl+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "cpl"
    ]
  },
  "application/csrattrs": {
    source: "iana"
  },
  "application/csta+xml": {
    source: "iana",
    compressible: !0
  },
  "application/cstadata+xml": {
    source: "iana",
    compressible: !0
  },
  "application/csvm+json": {
    source: "iana",
    compressible: !0
  },
  "application/cu-seeme": {
    source: "apache",
    extensions: [
      "cu"
    ]
  },
  "application/cwt": {
    source: "iana"
  },
  "application/cybercash": {
    source: "iana"
  },
  "application/dart": {
    compressible: !0
  },
  "application/dash+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "mpd"
    ]
  },
  "application/dash-patch+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "mpp"
    ]
  },
  "application/dashdelta": {
    source: "iana"
  },
  "application/davmount+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "davmount"
    ]
  },
  "application/dca-rft": {
    source: "iana"
  },
  "application/dcd": {
    source: "iana"
  },
  "application/dec-dx": {
    source: "iana"
  },
  "application/dialog-info+xml": {
    source: "iana",
    compressible: !0
  },
  "application/dicom": {
    source: "iana"
  },
  "application/dicom+json": {
    source: "iana",
    compressible: !0
  },
  "application/dicom+xml": {
    source: "iana",
    compressible: !0
  },
  "application/dii": {
    source: "iana"
  },
  "application/dit": {
    source: "iana"
  },
  "application/dns": {
    source: "iana"
  },
  "application/dns+json": {
    source: "iana",
    compressible: !0
  },
  "application/dns-message": {
    source: "iana"
  },
  "application/docbook+xml": {
    source: "apache",
    compressible: !0,
    extensions: [
      "dbk"
    ]
  },
  "application/dots+cbor": {
    source: "iana"
  },
  "application/dskpp+xml": {
    source: "iana",
    compressible: !0
  },
  "application/dssc+der": {
    source: "iana",
    extensions: [
      "dssc"
    ]
  },
  "application/dssc+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "xdssc"
    ]
  },
  "application/dvcs": {
    source: "iana"
  },
  "application/ecmascript": {
    source: "iana",
    compressible: !0,
    extensions: [
      "es",
      "ecma"
    ]
  },
  "application/edi-consent": {
    source: "iana"
  },
  "application/edi-x12": {
    source: "iana",
    compressible: !1
  },
  "application/edifact": {
    source: "iana",
    compressible: !1
  },
  "application/efi": {
    source: "iana"
  },
  "application/elm+json": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0
  },
  "application/elm+xml": {
    source: "iana",
    compressible: !0
  },
  "application/emergencycalldata.cap+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0
  },
  "application/emergencycalldata.comment+xml": {
    source: "iana",
    compressible: !0
  },
  "application/emergencycalldata.control+xml": {
    source: "iana",
    compressible: !0
  },
  "application/emergencycalldata.deviceinfo+xml": {
    source: "iana",
    compressible: !0
  },
  "application/emergencycalldata.ecall.msd": {
    source: "iana"
  },
  "application/emergencycalldata.providerinfo+xml": {
    source: "iana",
    compressible: !0
  },
  "application/emergencycalldata.serviceinfo+xml": {
    source: "iana",
    compressible: !0
  },
  "application/emergencycalldata.subscriberinfo+xml": {
    source: "iana",
    compressible: !0
  },
  "application/emergencycalldata.veds+xml": {
    source: "iana",
    compressible: !0
  },
  "application/emma+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "emma"
    ]
  },
  "application/emotionml+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "emotionml"
    ]
  },
  "application/encaprtp": {
    source: "iana"
  },
  "application/epp+xml": {
    source: "iana",
    compressible: !0
  },
  "application/epub+zip": {
    source: "iana",
    compressible: !1,
    extensions: [
      "epub"
    ]
  },
  "application/eshop": {
    source: "iana"
  },
  "application/exi": {
    source: "iana",
    extensions: [
      "exi"
    ]
  },
  "application/expect-ct-report+json": {
    source: "iana",
    compressible: !0
  },
  "application/express": {
    source: "iana",
    extensions: [
      "exp"
    ]
  },
  "application/fastinfoset": {
    source: "iana"
  },
  "application/fastsoap": {
    source: "iana"
  },
  "application/fdt+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "fdt"
    ]
  },
  "application/fhir+json": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0
  },
  "application/fhir+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0
  },
  "application/fido.trusted-apps+json": {
    compressible: !0
  },
  "application/fits": {
    source: "iana"
  },
  "application/flexfec": {
    source: "iana"
  },
  "application/font-sfnt": {
    source: "iana"
  },
  "application/font-tdpfr": {
    source: "iana",
    extensions: [
      "pfr"
    ]
  },
  "application/font-woff": {
    source: "iana",
    compressible: !1
  },
  "application/framework-attributes+xml": {
    source: "iana",
    compressible: !0
  },
  "application/geo+json": {
    source: "iana",
    compressible: !0,
    extensions: [
      "geojson"
    ]
  },
  "application/geo+json-seq": {
    source: "iana"
  },
  "application/geopackage+sqlite3": {
    source: "iana"
  },
  "application/geoxacml+xml": {
    source: "iana",
    compressible: !0
  },
  "application/gltf-buffer": {
    source: "iana"
  },
  "application/gml+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "gml"
    ]
  },
  "application/gpx+xml": {
    source: "apache",
    compressible: !0,
    extensions: [
      "gpx"
    ]
  },
  "application/gxf": {
    source: "apache",
    extensions: [
      "gxf"
    ]
  },
  "application/gzip": {
    source: "iana",
    compressible: !1,
    extensions: [
      "gz"
    ]
  },
  "application/h224": {
    source: "iana"
  },
  "application/held+xml": {
    source: "iana",
    compressible: !0
  },
  "application/hjson": {
    extensions: [
      "hjson"
    ]
  },
  "application/http": {
    source: "iana"
  },
  "application/hyperstudio": {
    source: "iana",
    extensions: [
      "stk"
    ]
  },
  "application/ibe-key-request+xml": {
    source: "iana",
    compressible: !0
  },
  "application/ibe-pkg-reply+xml": {
    source: "iana",
    compressible: !0
  },
  "application/ibe-pp-data": {
    source: "iana"
  },
  "application/iges": {
    source: "iana"
  },
  "application/im-iscomposing+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0
  },
  "application/index": {
    source: "iana"
  },
  "application/index.cmd": {
    source: "iana"
  },
  "application/index.obj": {
    source: "iana"
  },
  "application/index.response": {
    source: "iana"
  },
  "application/index.vnd": {
    source: "iana"
  },
  "application/inkml+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "ink",
      "inkml"
    ]
  },
  "application/iotp": {
    source: "iana"
  },
  "application/ipfix": {
    source: "iana",
    extensions: [
      "ipfix"
    ]
  },
  "application/ipp": {
    source: "iana"
  },
  "application/isup": {
    source: "iana"
  },
  "application/its+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "its"
    ]
  },
  "application/java-archive": {
    source: "apache",
    compressible: !1,
    extensions: [
      "jar",
      "war",
      "ear"
    ]
  },
  "application/java-serialized-object": {
    source: "apache",
    compressible: !1,
    extensions: [
      "ser"
    ]
  },
  "application/java-vm": {
    source: "apache",
    compressible: !1,
    extensions: [
      "class"
    ]
  },
  "application/javascript": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0,
    extensions: [
      "js",
      "mjs"
    ]
  },
  "application/jf2feed+json": {
    source: "iana",
    compressible: !0
  },
  "application/jose": {
    source: "iana"
  },
  "application/jose+json": {
    source: "iana",
    compressible: !0
  },
  "application/jrd+json": {
    source: "iana",
    compressible: !0
  },
  "application/jscalendar+json": {
    source: "iana",
    compressible: !0
  },
  "application/json": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0,
    extensions: [
      "json",
      "map"
    ]
  },
  "application/json-patch+json": {
    source: "iana",
    compressible: !0
  },
  "application/json-seq": {
    source: "iana"
  },
  "application/json5": {
    extensions: [
      "json5"
    ]
  },
  "application/jsonml+json": {
    source: "apache",
    compressible: !0,
    extensions: [
      "jsonml"
    ]
  },
  "application/jwk+json": {
    source: "iana",
    compressible: !0
  },
  "application/jwk-set+json": {
    source: "iana",
    compressible: !0
  },
  "application/jwt": {
    source: "iana"
  },
  "application/kpml-request+xml": {
    source: "iana",
    compressible: !0
  },
  "application/kpml-response+xml": {
    source: "iana",
    compressible: !0
  },
  "application/ld+json": {
    source: "iana",
    compressible: !0,
    extensions: [
      "jsonld"
    ]
  },
  "application/lgr+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "lgr"
    ]
  },
  "application/link-format": {
    source: "iana"
  },
  "application/load-control+xml": {
    source: "iana",
    compressible: !0
  },
  "application/lost+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "lostxml"
    ]
  },
  "application/lostsync+xml": {
    source: "iana",
    compressible: !0
  },
  "application/lpf+zip": {
    source: "iana",
    compressible: !1
  },
  "application/lxf": {
    source: "iana"
  },
  "application/mac-binhex40": {
    source: "iana",
    extensions: [
      "hqx"
    ]
  },
  "application/mac-compactpro": {
    source: "apache",
    extensions: [
      "cpt"
    ]
  },
  "application/macwriteii": {
    source: "iana"
  },
  "application/mads+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "mads"
    ]
  },
  "application/manifest+json": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0,
    extensions: [
      "webmanifest"
    ]
  },
  "application/marc": {
    source: "iana",
    extensions: [
      "mrc"
    ]
  },
  "application/marcxml+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "mrcx"
    ]
  },
  "application/mathematica": {
    source: "iana",
    extensions: [
      "ma",
      "nb",
      "mb"
    ]
  },
  "application/mathml+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "mathml"
    ]
  },
  "application/mathml-content+xml": {
    source: "iana",
    compressible: !0
  },
  "application/mathml-presentation+xml": {
    source: "iana",
    compressible: !0
  },
  "application/mbms-associated-procedure-description+xml": {
    source: "iana",
    compressible: !0
  },
  "application/mbms-deregister+xml": {
    source: "iana",
    compressible: !0
  },
  "application/mbms-envelope+xml": {
    source: "iana",
    compressible: !0
  },
  "application/mbms-msk+xml": {
    source: "iana",
    compressible: !0
  },
  "application/mbms-msk-response+xml": {
    source: "iana",
    compressible: !0
  },
  "application/mbms-protection-description+xml": {
    source: "iana",
    compressible: !0
  },
  "application/mbms-reception-report+xml": {
    source: "iana",
    compressible: !0
  },
  "application/mbms-register+xml": {
    source: "iana",
    compressible: !0
  },
  "application/mbms-register-response+xml": {
    source: "iana",
    compressible: !0
  },
  "application/mbms-schedule+xml": {
    source: "iana",
    compressible: !0
  },
  "application/mbms-user-service-description+xml": {
    source: "iana",
    compressible: !0
  },
  "application/mbox": {
    source: "iana",
    extensions: [
      "mbox"
    ]
  },
  "application/media-policy-dataset+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "mpf"
    ]
  },
  "application/media_control+xml": {
    source: "iana",
    compressible: !0
  },
  "application/mediaservercontrol+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "mscml"
    ]
  },
  "application/merge-patch+json": {
    source: "iana",
    compressible: !0
  },
  "application/metalink+xml": {
    source: "apache",
    compressible: !0,
    extensions: [
      "metalink"
    ]
  },
  "application/metalink4+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "meta4"
    ]
  },
  "application/mets+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "mets"
    ]
  },
  "application/mf4": {
    source: "iana"
  },
  "application/mikey": {
    source: "iana"
  },
  "application/mipc": {
    source: "iana"
  },
  "application/missing-blocks+cbor-seq": {
    source: "iana"
  },
  "application/mmt-aei+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "maei"
    ]
  },
  "application/mmt-usd+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "musd"
    ]
  },
  "application/mods+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "mods"
    ]
  },
  "application/moss-keys": {
    source: "iana"
  },
  "application/moss-signature": {
    source: "iana"
  },
  "application/mosskey-data": {
    source: "iana"
  },
  "application/mosskey-request": {
    source: "iana"
  },
  "application/mp21": {
    source: "iana",
    extensions: [
      "m21",
      "mp21"
    ]
  },
  "application/mp4": {
    source: "iana",
    extensions: [
      "mp4s",
      "m4p"
    ]
  },
  "application/mpeg4-generic": {
    source: "iana"
  },
  "application/mpeg4-iod": {
    source: "iana"
  },
  "application/mpeg4-iod-xmt": {
    source: "iana"
  },
  "application/mrb-consumer+xml": {
    source: "iana",
    compressible: !0
  },
  "application/mrb-publish+xml": {
    source: "iana",
    compressible: !0
  },
  "application/msc-ivr+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0
  },
  "application/msc-mixer+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0
  },
  "application/msword": {
    source: "iana",
    compressible: !1,
    extensions: [
      "doc",
      "dot"
    ]
  },
  "application/mud+json": {
    source: "iana",
    compressible: !0
  },
  "application/multipart-core": {
    source: "iana"
  },
  "application/mxf": {
    source: "iana",
    extensions: [
      "mxf"
    ]
  },
  "application/n-quads": {
    source: "iana",
    extensions: [
      "nq"
    ]
  },
  "application/n-triples": {
    source: "iana",
    extensions: [
      "nt"
    ]
  },
  "application/nasdata": {
    source: "iana"
  },
  "application/news-checkgroups": {
    source: "iana",
    charset: "US-ASCII"
  },
  "application/news-groupinfo": {
    source: "iana",
    charset: "US-ASCII"
  },
  "application/news-transmission": {
    source: "iana"
  },
  "application/nlsml+xml": {
    source: "iana",
    compressible: !0
  },
  "application/node": {
    source: "iana",
    extensions: [
      "cjs"
    ]
  },
  "application/nss": {
    source: "iana"
  },
  "application/oauth-authz-req+jwt": {
    source: "iana"
  },
  "application/oblivious-dns-message": {
    source: "iana"
  },
  "application/ocsp-request": {
    source: "iana"
  },
  "application/ocsp-response": {
    source: "iana"
  },
  "application/octet-stream": {
    source: "iana",
    compressible: !1,
    extensions: [
      "bin",
      "dms",
      "lrf",
      "mar",
      "so",
      "dist",
      "distz",
      "pkg",
      "bpk",
      "dump",
      "elc",
      "deploy",
      "exe",
      "dll",
      "deb",
      "dmg",
      "iso",
      "img",
      "msi",
      "msp",
      "msm",
      "buffer"
    ]
  },
  "application/oda": {
    source: "iana",
    extensions: [
      "oda"
    ]
  },
  "application/odm+xml": {
    source: "iana",
    compressible: !0
  },
  "application/odx": {
    source: "iana"
  },
  "application/oebps-package+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "opf"
    ]
  },
  "application/ogg": {
    source: "iana",
    compressible: !1,
    extensions: [
      "ogx"
    ]
  },
  "application/omdoc+xml": {
    source: "apache",
    compressible: !0,
    extensions: [
      "omdoc"
    ]
  },
  "application/onenote": {
    source: "apache",
    extensions: [
      "onetoc",
      "onetoc2",
      "onetmp",
      "onepkg"
    ]
  },
  "application/opc-nodeset+xml": {
    source: "iana",
    compressible: !0
  },
  "application/oscore": {
    source: "iana"
  },
  "application/oxps": {
    source: "iana",
    extensions: [
      "oxps"
    ]
  },
  "application/p21": {
    source: "iana"
  },
  "application/p21+zip": {
    source: "iana",
    compressible: !1
  },
  "application/p2p-overlay+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "relo"
    ]
  },
  "application/parityfec": {
    source: "iana"
  },
  "application/passport": {
    source: "iana"
  },
  "application/patch-ops-error+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "xer"
    ]
  },
  "application/pdf": {
    source: "iana",
    compressible: !1,
    extensions: [
      "pdf"
    ]
  },
  "application/pdx": {
    source: "iana"
  },
  "application/pem-certificate-chain": {
    source: "iana"
  },
  "application/pgp-encrypted": {
    source: "iana",
    compressible: !1,
    extensions: [
      "pgp"
    ]
  },
  "application/pgp-keys": {
    source: "iana",
    extensions: [
      "asc"
    ]
  },
  "application/pgp-signature": {
    source: "iana",
    extensions: [
      "asc",
      "sig"
    ]
  },
  "application/pics-rules": {
    source: "apache",
    extensions: [
      "prf"
    ]
  },
  "application/pidf+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0
  },
  "application/pidf-diff+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0
  },
  "application/pkcs10": {
    source: "iana",
    extensions: [
      "p10"
    ]
  },
  "application/pkcs12": {
    source: "iana"
  },
  "application/pkcs7-mime": {
    source: "iana",
    extensions: [
      "p7m",
      "p7c"
    ]
  },
  "application/pkcs7-signature": {
    source: "iana",
    extensions: [
      "p7s"
    ]
  },
  "application/pkcs8": {
    source: "iana",
    extensions: [
      "p8"
    ]
  },
  "application/pkcs8-encrypted": {
    source: "iana"
  },
  "application/pkix-attr-cert": {
    source: "iana",
    extensions: [
      "ac"
    ]
  },
  "application/pkix-cert": {
    source: "iana",
    extensions: [
      "cer"
    ]
  },
  "application/pkix-crl": {
    source: "iana",
    extensions: [
      "crl"
    ]
  },
  "application/pkix-pkipath": {
    source: "iana",
    extensions: [
      "pkipath"
    ]
  },
  "application/pkixcmp": {
    source: "iana",
    extensions: [
      "pki"
    ]
  },
  "application/pls+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "pls"
    ]
  },
  "application/poc-settings+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0
  },
  "application/postscript": {
    source: "iana",
    compressible: !0,
    extensions: [
      "ai",
      "eps",
      "ps"
    ]
  },
  "application/ppsp-tracker+json": {
    source: "iana",
    compressible: !0
  },
  "application/problem+json": {
    source: "iana",
    compressible: !0
  },
  "application/problem+xml": {
    source: "iana",
    compressible: !0
  },
  "application/provenance+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "provx"
    ]
  },
  "application/prs.alvestrand.titrax-sheet": {
    source: "iana"
  },
  "application/prs.cww": {
    source: "iana",
    extensions: [
      "cww"
    ]
  },
  "application/prs.cyn": {
    source: "iana",
    charset: "7-BIT"
  },
  "application/prs.hpub+zip": {
    source: "iana",
    compressible: !1
  },
  "application/prs.nprend": {
    source: "iana"
  },
  "application/prs.plucker": {
    source: "iana"
  },
  "application/prs.rdf-xml-crypt": {
    source: "iana"
  },
  "application/prs.xsf+xml": {
    source: "iana",
    compressible: !0
  },
  "application/pskc+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "pskcxml"
    ]
  },
  "application/pvd+json": {
    source: "iana",
    compressible: !0
  },
  "application/qsig": {
    source: "iana"
  },
  "application/raml+yaml": {
    compressible: !0,
    extensions: [
      "raml"
    ]
  },
  "application/raptorfec": {
    source: "iana"
  },
  "application/rdap+json": {
    source: "iana",
    compressible: !0
  },
  "application/rdf+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "rdf",
      "owl"
    ]
  },
  "application/reginfo+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "rif"
    ]
  },
  "application/relax-ng-compact-syntax": {
    source: "iana",
    extensions: [
      "rnc"
    ]
  },
  "application/remote-printing": {
    source: "iana"
  },
  "application/reputon+json": {
    source: "iana",
    compressible: !0
  },
  "application/resource-lists+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "rl"
    ]
  },
  "application/resource-lists-diff+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "rld"
    ]
  },
  "application/rfc+xml": {
    source: "iana",
    compressible: !0
  },
  "application/riscos": {
    source: "iana"
  },
  "application/rlmi+xml": {
    source: "iana",
    compressible: !0
  },
  "application/rls-services+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "rs"
    ]
  },
  "application/route-apd+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "rapd"
    ]
  },
  "application/route-s-tsid+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "sls"
    ]
  },
  "application/route-usd+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "rusd"
    ]
  },
  "application/rpki-ghostbusters": {
    source: "iana",
    extensions: [
      "gbr"
    ]
  },
  "application/rpki-manifest": {
    source: "iana",
    extensions: [
      "mft"
    ]
  },
  "application/rpki-publication": {
    source: "iana"
  },
  "application/rpki-roa": {
    source: "iana",
    extensions: [
      "roa"
    ]
  },
  "application/rpki-updown": {
    source: "iana"
  },
  "application/rsd+xml": {
    source: "apache",
    compressible: !0,
    extensions: [
      "rsd"
    ]
  },
  "application/rss+xml": {
    source: "apache",
    compressible: !0,
    extensions: [
      "rss"
    ]
  },
  "application/rtf": {
    source: "iana",
    compressible: !0,
    extensions: [
      "rtf"
    ]
  },
  "application/rtploopback": {
    source: "iana"
  },
  "application/rtx": {
    source: "iana"
  },
  "application/samlassertion+xml": {
    source: "iana",
    compressible: !0
  },
  "application/samlmetadata+xml": {
    source: "iana",
    compressible: !0
  },
  "application/sarif+json": {
    source: "iana",
    compressible: !0
  },
  "application/sarif-external-properties+json": {
    source: "iana",
    compressible: !0
  },
  "application/sbe": {
    source: "iana"
  },
  "application/sbml+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "sbml"
    ]
  },
  "application/scaip+xml": {
    source: "iana",
    compressible: !0
  },
  "application/scim+json": {
    source: "iana",
    compressible: !0
  },
  "application/scvp-cv-request": {
    source: "iana",
    extensions: [
      "scq"
    ]
  },
  "application/scvp-cv-response": {
    source: "iana",
    extensions: [
      "scs"
    ]
  },
  "application/scvp-vp-request": {
    source: "iana",
    extensions: [
      "spq"
    ]
  },
  "application/scvp-vp-response": {
    source: "iana",
    extensions: [
      "spp"
    ]
  },
  "application/sdp": {
    source: "iana",
    extensions: [
      "sdp"
    ]
  },
  "application/secevent+jwt": {
    source: "iana"
  },
  "application/senml+cbor": {
    source: "iana"
  },
  "application/senml+json": {
    source: "iana",
    compressible: !0
  },
  "application/senml+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "senmlx"
    ]
  },
  "application/senml-etch+cbor": {
    source: "iana"
  },
  "application/senml-etch+json": {
    source: "iana",
    compressible: !0
  },
  "application/senml-exi": {
    source: "iana"
  },
  "application/sensml+cbor": {
    source: "iana"
  },
  "application/sensml+json": {
    source: "iana",
    compressible: !0
  },
  "application/sensml+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "sensmlx"
    ]
  },
  "application/sensml-exi": {
    source: "iana"
  },
  "application/sep+xml": {
    source: "iana",
    compressible: !0
  },
  "application/sep-exi": {
    source: "iana"
  },
  "application/session-info": {
    source: "iana"
  },
  "application/set-payment": {
    source: "iana"
  },
  "application/set-payment-initiation": {
    source: "iana",
    extensions: [
      "setpay"
    ]
  },
  "application/set-registration": {
    source: "iana"
  },
  "application/set-registration-initiation": {
    source: "iana",
    extensions: [
      "setreg"
    ]
  },
  "application/sgml": {
    source: "iana"
  },
  "application/sgml-open-catalog": {
    source: "iana"
  },
  "application/shf+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "shf"
    ]
  },
  "application/sieve": {
    source: "iana",
    extensions: [
      "siv",
      "sieve"
    ]
  },
  "application/simple-filter+xml": {
    source: "iana",
    compressible: !0
  },
  "application/simple-message-summary": {
    source: "iana"
  },
  "application/simplesymbolcontainer": {
    source: "iana"
  },
  "application/sipc": {
    source: "iana"
  },
  "application/slate": {
    source: "iana"
  },
  "application/smil": {
    source: "iana"
  },
  "application/smil+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "smi",
      "smil"
    ]
  },
  "application/smpte336m": {
    source: "iana"
  },
  "application/soap+fastinfoset": {
    source: "iana"
  },
  "application/soap+xml": {
    source: "iana",
    compressible: !0
  },
  "application/sparql-query": {
    source: "iana",
    extensions: [
      "rq"
    ]
  },
  "application/sparql-results+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "srx"
    ]
  },
  "application/spdx+json": {
    source: "iana",
    compressible: !0
  },
  "application/spirits-event+xml": {
    source: "iana",
    compressible: !0
  },
  "application/sql": {
    source: "iana"
  },
  "application/srgs": {
    source: "iana",
    extensions: [
      "gram"
    ]
  },
  "application/srgs+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "grxml"
    ]
  },
  "application/sru+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "sru"
    ]
  },
  "application/ssdl+xml": {
    source: "apache",
    compressible: !0,
    extensions: [
      "ssdl"
    ]
  },
  "application/ssml+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "ssml"
    ]
  },
  "application/stix+json": {
    source: "iana",
    compressible: !0
  },
  "application/swid+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "swidtag"
    ]
  },
  "application/tamp-apex-update": {
    source: "iana"
  },
  "application/tamp-apex-update-confirm": {
    source: "iana"
  },
  "application/tamp-community-update": {
    source: "iana"
  },
  "application/tamp-community-update-confirm": {
    source: "iana"
  },
  "application/tamp-error": {
    source: "iana"
  },
  "application/tamp-sequence-adjust": {
    source: "iana"
  },
  "application/tamp-sequence-adjust-confirm": {
    source: "iana"
  },
  "application/tamp-status-query": {
    source: "iana"
  },
  "application/tamp-status-response": {
    source: "iana"
  },
  "application/tamp-update": {
    source: "iana"
  },
  "application/tamp-update-confirm": {
    source: "iana"
  },
  "application/tar": {
    compressible: !0
  },
  "application/taxii+json": {
    source: "iana",
    compressible: !0
  },
  "application/td+json": {
    source: "iana",
    compressible: !0
  },
  "application/tei+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "tei",
      "teicorpus"
    ]
  },
  "application/tetra_isi": {
    source: "iana"
  },
  "application/thraud+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "tfi"
    ]
  },
  "application/timestamp-query": {
    source: "iana"
  },
  "application/timestamp-reply": {
    source: "iana"
  },
  "application/timestamped-data": {
    source: "iana",
    extensions: [
      "tsd"
    ]
  },
  "application/tlsrpt+gzip": {
    source: "iana"
  },
  "application/tlsrpt+json": {
    source: "iana",
    compressible: !0
  },
  "application/tnauthlist": {
    source: "iana"
  },
  "application/token-introspection+jwt": {
    source: "iana"
  },
  "application/toml": {
    compressible: !0,
    extensions: [
      "toml"
    ]
  },
  "application/trickle-ice-sdpfrag": {
    source: "iana"
  },
  "application/trig": {
    source: "iana",
    extensions: [
      "trig"
    ]
  },
  "application/ttml+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "ttml"
    ]
  },
  "application/tve-trigger": {
    source: "iana"
  },
  "application/tzif": {
    source: "iana"
  },
  "application/tzif-leap": {
    source: "iana"
  },
  "application/ubjson": {
    compressible: !1,
    extensions: [
      "ubj"
    ]
  },
  "application/ulpfec": {
    source: "iana"
  },
  "application/urc-grpsheet+xml": {
    source: "iana",
    compressible: !0
  },
  "application/urc-ressheet+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "rsheet"
    ]
  },
  "application/urc-targetdesc+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "td"
    ]
  },
  "application/urc-uisocketdesc+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vcard+json": {
    source: "iana",
    compressible: !0
  },
  "application/vcard+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vemmi": {
    source: "iana"
  },
  "application/vividence.scriptfile": {
    source: "apache"
  },
  "application/vnd.1000minds.decision-model+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "1km"
    ]
  },
  "application/vnd.3gpp-prose+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp-prose-pc3ch+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp-v2x-local-service-information": {
    source: "iana"
  },
  "application/vnd.3gpp.5gnas": {
    source: "iana"
  },
  "application/vnd.3gpp.access-transfer-events+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.bsf+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.gmop+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.gtpc": {
    source: "iana"
  },
  "application/vnd.3gpp.interworking-data": {
    source: "iana"
  },
  "application/vnd.3gpp.lpp": {
    source: "iana"
  },
  "application/vnd.3gpp.mc-signalling-ear": {
    source: "iana"
  },
  "application/vnd.3gpp.mcdata-affiliation-command+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.mcdata-info+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.mcdata-payload": {
    source: "iana"
  },
  "application/vnd.3gpp.mcdata-service-config+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.mcdata-signalling": {
    source: "iana"
  },
  "application/vnd.3gpp.mcdata-ue-config+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.mcdata-user-profile+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.mcptt-affiliation-command+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.mcptt-floor-request+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.mcptt-info+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.mcptt-location-info+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.mcptt-mbms-usage-info+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.mcptt-service-config+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.mcptt-signed+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.mcptt-ue-config+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.mcptt-ue-init-config+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.mcptt-user-profile+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.mcvideo-affiliation-command+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.mcvideo-affiliation-info+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.mcvideo-info+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.mcvideo-location-info+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.mcvideo-mbms-usage-info+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.mcvideo-service-config+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.mcvideo-transmission-request+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.mcvideo-ue-config+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.mcvideo-user-profile+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.mid-call+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.ngap": {
    source: "iana"
  },
  "application/vnd.3gpp.pfcp": {
    source: "iana"
  },
  "application/vnd.3gpp.pic-bw-large": {
    source: "iana",
    extensions: [
      "plb"
    ]
  },
  "application/vnd.3gpp.pic-bw-small": {
    source: "iana",
    extensions: [
      "psb"
    ]
  },
  "application/vnd.3gpp.pic-bw-var": {
    source: "iana",
    extensions: [
      "pvb"
    ]
  },
  "application/vnd.3gpp.s1ap": {
    source: "iana"
  },
  "application/vnd.3gpp.sms": {
    source: "iana"
  },
  "application/vnd.3gpp.sms+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.srvcc-ext+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.srvcc-info+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.state-and-event-info+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp.ussd+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp2.bcmcsinfo+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.3gpp2.sms": {
    source: "iana"
  },
  "application/vnd.3gpp2.tcap": {
    source: "iana",
    extensions: [
      "tcap"
    ]
  },
  "application/vnd.3lightssoftware.imagescal": {
    source: "iana"
  },
  "application/vnd.3m.post-it-notes": {
    source: "iana",
    extensions: [
      "pwn"
    ]
  },
  "application/vnd.accpac.simply.aso": {
    source: "iana",
    extensions: [
      "aso"
    ]
  },
  "application/vnd.accpac.simply.imp": {
    source: "iana",
    extensions: [
      "imp"
    ]
  },
  "application/vnd.acucobol": {
    source: "iana",
    extensions: [
      "acu"
    ]
  },
  "application/vnd.acucorp": {
    source: "iana",
    extensions: [
      "atc",
      "acutc"
    ]
  },
  "application/vnd.adobe.air-application-installer-package+zip": {
    source: "apache",
    compressible: !1,
    extensions: [
      "air"
    ]
  },
  "application/vnd.adobe.flash.movie": {
    source: "iana"
  },
  "application/vnd.adobe.formscentral.fcdt": {
    source: "iana",
    extensions: [
      "fcdt"
    ]
  },
  "application/vnd.adobe.fxp": {
    source: "iana",
    extensions: [
      "fxp",
      "fxpl"
    ]
  },
  "application/vnd.adobe.partial-upload": {
    source: "iana"
  },
  "application/vnd.adobe.xdp+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "xdp"
    ]
  },
  "application/vnd.adobe.xfdf": {
    source: "iana",
    extensions: [
      "xfdf"
    ]
  },
  "application/vnd.aether.imp": {
    source: "iana"
  },
  "application/vnd.afpc.afplinedata": {
    source: "iana"
  },
  "application/vnd.afpc.afplinedata-pagedef": {
    source: "iana"
  },
  "application/vnd.afpc.cmoca-cmresource": {
    source: "iana"
  },
  "application/vnd.afpc.foca-charset": {
    source: "iana"
  },
  "application/vnd.afpc.foca-codedfont": {
    source: "iana"
  },
  "application/vnd.afpc.foca-codepage": {
    source: "iana"
  },
  "application/vnd.afpc.modca": {
    source: "iana"
  },
  "application/vnd.afpc.modca-cmtable": {
    source: "iana"
  },
  "application/vnd.afpc.modca-formdef": {
    source: "iana"
  },
  "application/vnd.afpc.modca-mediummap": {
    source: "iana"
  },
  "application/vnd.afpc.modca-objectcontainer": {
    source: "iana"
  },
  "application/vnd.afpc.modca-overlay": {
    source: "iana"
  },
  "application/vnd.afpc.modca-pagesegment": {
    source: "iana"
  },
  "application/vnd.age": {
    source: "iana",
    extensions: [
      "age"
    ]
  },
  "application/vnd.ah-barcode": {
    source: "iana"
  },
  "application/vnd.ahead.space": {
    source: "iana",
    extensions: [
      "ahead"
    ]
  },
  "application/vnd.airzip.filesecure.azf": {
    source: "iana",
    extensions: [
      "azf"
    ]
  },
  "application/vnd.airzip.filesecure.azs": {
    source: "iana",
    extensions: [
      "azs"
    ]
  },
  "application/vnd.amadeus+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.amazon.ebook": {
    source: "apache",
    extensions: [
      "azw"
    ]
  },
  "application/vnd.amazon.mobi8-ebook": {
    source: "iana"
  },
  "application/vnd.americandynamics.acc": {
    source: "iana",
    extensions: [
      "acc"
    ]
  },
  "application/vnd.amiga.ami": {
    source: "iana",
    extensions: [
      "ami"
    ]
  },
  "application/vnd.amundsen.maze+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.android.ota": {
    source: "iana"
  },
  "application/vnd.android.package-archive": {
    source: "apache",
    compressible: !1,
    extensions: [
      "apk"
    ]
  },
  "application/vnd.anki": {
    source: "iana"
  },
  "application/vnd.anser-web-certificate-issue-initiation": {
    source: "iana",
    extensions: [
      "cii"
    ]
  },
  "application/vnd.anser-web-funds-transfer-initiation": {
    source: "apache",
    extensions: [
      "fti"
    ]
  },
  "application/vnd.antix.game-component": {
    source: "iana",
    extensions: [
      "atx"
    ]
  },
  "application/vnd.apache.arrow.file": {
    source: "iana"
  },
  "application/vnd.apache.arrow.stream": {
    source: "iana"
  },
  "application/vnd.apache.thrift.binary": {
    source: "iana"
  },
  "application/vnd.apache.thrift.compact": {
    source: "iana"
  },
  "application/vnd.apache.thrift.json": {
    source: "iana"
  },
  "application/vnd.api+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.aplextor.warrp+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.apothekende.reservation+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.apple.installer+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "mpkg"
    ]
  },
  "application/vnd.apple.keynote": {
    source: "iana",
    extensions: [
      "key"
    ]
  },
  "application/vnd.apple.mpegurl": {
    source: "iana",
    extensions: [
      "m3u8"
    ]
  },
  "application/vnd.apple.numbers": {
    source: "iana",
    extensions: [
      "numbers"
    ]
  },
  "application/vnd.apple.pages": {
    source: "iana",
    extensions: [
      "pages"
    ]
  },
  "application/vnd.apple.pkpass": {
    compressible: !1,
    extensions: [
      "pkpass"
    ]
  },
  "application/vnd.arastra.swi": {
    source: "iana"
  },
  "application/vnd.aristanetworks.swi": {
    source: "iana",
    extensions: [
      "swi"
    ]
  },
  "application/vnd.artisan+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.artsquare": {
    source: "iana"
  },
  "application/vnd.astraea-software.iota": {
    source: "iana",
    extensions: [
      "iota"
    ]
  },
  "application/vnd.audiograph": {
    source: "iana",
    extensions: [
      "aep"
    ]
  },
  "application/vnd.autopackage": {
    source: "iana"
  },
  "application/vnd.avalon+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.avistar+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.balsamiq.bmml+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "bmml"
    ]
  },
  "application/vnd.balsamiq.bmpr": {
    source: "iana"
  },
  "application/vnd.banana-accounting": {
    source: "iana"
  },
  "application/vnd.bbf.usp.error": {
    source: "iana"
  },
  "application/vnd.bbf.usp.msg": {
    source: "iana"
  },
  "application/vnd.bbf.usp.msg+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.bekitzur-stech+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.bint.med-content": {
    source: "iana"
  },
  "application/vnd.biopax.rdf+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.blink-idb-value-wrapper": {
    source: "iana"
  },
  "application/vnd.blueice.multipass": {
    source: "iana",
    extensions: [
      "mpm"
    ]
  },
  "application/vnd.bluetooth.ep.oob": {
    source: "iana"
  },
  "application/vnd.bluetooth.le.oob": {
    source: "iana"
  },
  "application/vnd.bmi": {
    source: "iana",
    extensions: [
      "bmi"
    ]
  },
  "application/vnd.bpf": {
    source: "iana"
  },
  "application/vnd.bpf3": {
    source: "iana"
  },
  "application/vnd.businessobjects": {
    source: "iana",
    extensions: [
      "rep"
    ]
  },
  "application/vnd.byu.uapi+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.cab-jscript": {
    source: "iana"
  },
  "application/vnd.canon-cpdl": {
    source: "iana"
  },
  "application/vnd.canon-lips": {
    source: "iana"
  },
  "application/vnd.capasystems-pg+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.cendio.thinlinc.clientconf": {
    source: "iana"
  },
  "application/vnd.century-systems.tcp_stream": {
    source: "iana"
  },
  "application/vnd.chemdraw+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "cdxml"
    ]
  },
  "application/vnd.chess-pgn": {
    source: "iana"
  },
  "application/vnd.chipnuts.karaoke-mmd": {
    source: "iana",
    extensions: [
      "mmd"
    ]
  },
  "application/vnd.ciedi": {
    source: "iana"
  },
  "application/vnd.cinderella": {
    source: "iana",
    extensions: [
      "cdy"
    ]
  },
  "application/vnd.cirpack.isdn-ext": {
    source: "iana"
  },
  "application/vnd.citationstyles.style+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "csl"
    ]
  },
  "application/vnd.claymore": {
    source: "iana",
    extensions: [
      "cla"
    ]
  },
  "application/vnd.cloanto.rp9": {
    source: "iana",
    extensions: [
      "rp9"
    ]
  },
  "application/vnd.clonk.c4group": {
    source: "iana",
    extensions: [
      "c4g",
      "c4d",
      "c4f",
      "c4p",
      "c4u"
    ]
  },
  "application/vnd.cluetrust.cartomobile-config": {
    source: "iana",
    extensions: [
      "c11amc"
    ]
  },
  "application/vnd.cluetrust.cartomobile-config-pkg": {
    source: "iana",
    extensions: [
      "c11amz"
    ]
  },
  "application/vnd.coffeescript": {
    source: "iana"
  },
  "application/vnd.collabio.xodocuments.document": {
    source: "iana"
  },
  "application/vnd.collabio.xodocuments.document-template": {
    source: "iana"
  },
  "application/vnd.collabio.xodocuments.presentation": {
    source: "iana"
  },
  "application/vnd.collabio.xodocuments.presentation-template": {
    source: "iana"
  },
  "application/vnd.collabio.xodocuments.spreadsheet": {
    source: "iana"
  },
  "application/vnd.collabio.xodocuments.spreadsheet-template": {
    source: "iana"
  },
  "application/vnd.collection+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.collection.doc+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.collection.next+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.comicbook+zip": {
    source: "iana",
    compressible: !1
  },
  "application/vnd.comicbook-rar": {
    source: "iana"
  },
  "application/vnd.commerce-battelle": {
    source: "iana"
  },
  "application/vnd.commonspace": {
    source: "iana",
    extensions: [
      "csp"
    ]
  },
  "application/vnd.contact.cmsg": {
    source: "iana",
    extensions: [
      "cdbcmsg"
    ]
  },
  "application/vnd.coreos.ignition+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.cosmocaller": {
    source: "iana",
    extensions: [
      "cmc"
    ]
  },
  "application/vnd.crick.clicker": {
    source: "iana",
    extensions: [
      "clkx"
    ]
  },
  "application/vnd.crick.clicker.keyboard": {
    source: "iana",
    extensions: [
      "clkk"
    ]
  },
  "application/vnd.crick.clicker.palette": {
    source: "iana",
    extensions: [
      "clkp"
    ]
  },
  "application/vnd.crick.clicker.template": {
    source: "iana",
    extensions: [
      "clkt"
    ]
  },
  "application/vnd.crick.clicker.wordbank": {
    source: "iana",
    extensions: [
      "clkw"
    ]
  },
  "application/vnd.criticaltools.wbs+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "wbs"
    ]
  },
  "application/vnd.cryptii.pipe+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.crypto-shade-file": {
    source: "iana"
  },
  "application/vnd.cryptomator.encrypted": {
    source: "iana"
  },
  "application/vnd.cryptomator.vault": {
    source: "iana"
  },
  "application/vnd.ctc-posml": {
    source: "iana",
    extensions: [
      "pml"
    ]
  },
  "application/vnd.ctct.ws+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.cups-pdf": {
    source: "iana"
  },
  "application/vnd.cups-postscript": {
    source: "iana"
  },
  "application/vnd.cups-ppd": {
    source: "iana",
    extensions: [
      "ppd"
    ]
  },
  "application/vnd.cups-raster": {
    source: "iana"
  },
  "application/vnd.cups-raw": {
    source: "iana"
  },
  "application/vnd.curl": {
    source: "iana"
  },
  "application/vnd.curl.car": {
    source: "apache",
    extensions: [
      "car"
    ]
  },
  "application/vnd.curl.pcurl": {
    source: "apache",
    extensions: [
      "pcurl"
    ]
  },
  "application/vnd.cyan.dean.root+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.cybank": {
    source: "iana"
  },
  "application/vnd.cyclonedx+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.cyclonedx+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.d2l.coursepackage1p0+zip": {
    source: "iana",
    compressible: !1
  },
  "application/vnd.d3m-dataset": {
    source: "iana"
  },
  "application/vnd.d3m-problem": {
    source: "iana"
  },
  "application/vnd.dart": {
    source: "iana",
    compressible: !0,
    extensions: [
      "dart"
    ]
  },
  "application/vnd.data-vision.rdz": {
    source: "iana",
    extensions: [
      "rdz"
    ]
  },
  "application/vnd.datapackage+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.dataresource+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.dbf": {
    source: "iana",
    extensions: [
      "dbf"
    ]
  },
  "application/vnd.debian.binary-package": {
    source: "iana"
  },
  "application/vnd.dece.data": {
    source: "iana",
    extensions: [
      "uvf",
      "uvvf",
      "uvd",
      "uvvd"
    ]
  },
  "application/vnd.dece.ttml+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "uvt",
      "uvvt"
    ]
  },
  "application/vnd.dece.unspecified": {
    source: "iana",
    extensions: [
      "uvx",
      "uvvx"
    ]
  },
  "application/vnd.dece.zip": {
    source: "iana",
    extensions: [
      "uvz",
      "uvvz"
    ]
  },
  "application/vnd.denovo.fcselayout-link": {
    source: "iana",
    extensions: [
      "fe_launch"
    ]
  },
  "application/vnd.desmume.movie": {
    source: "iana"
  },
  "application/vnd.dir-bi.plate-dl-nosuffix": {
    source: "iana"
  },
  "application/vnd.dm.delegation+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.dna": {
    source: "iana",
    extensions: [
      "dna"
    ]
  },
  "application/vnd.document+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.dolby.mlp": {
    source: "apache",
    extensions: [
      "mlp"
    ]
  },
  "application/vnd.dolby.mobile.1": {
    source: "iana"
  },
  "application/vnd.dolby.mobile.2": {
    source: "iana"
  },
  "application/vnd.doremir.scorecloud-binary-document": {
    source: "iana"
  },
  "application/vnd.dpgraph": {
    source: "iana",
    extensions: [
      "dpg"
    ]
  },
  "application/vnd.dreamfactory": {
    source: "iana",
    extensions: [
      "dfac"
    ]
  },
  "application/vnd.drive+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.ds-keypoint": {
    source: "apache",
    extensions: [
      "kpxx"
    ]
  },
  "application/vnd.dtg.local": {
    source: "iana"
  },
  "application/vnd.dtg.local.flash": {
    source: "iana"
  },
  "application/vnd.dtg.local.html": {
    source: "iana"
  },
  "application/vnd.dvb.ait": {
    source: "iana",
    extensions: [
      "ait"
    ]
  },
  "application/vnd.dvb.dvbisl+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.dvb.dvbj": {
    source: "iana"
  },
  "application/vnd.dvb.esgcontainer": {
    source: "iana"
  },
  "application/vnd.dvb.ipdcdftnotifaccess": {
    source: "iana"
  },
  "application/vnd.dvb.ipdcesgaccess": {
    source: "iana"
  },
  "application/vnd.dvb.ipdcesgaccess2": {
    source: "iana"
  },
  "application/vnd.dvb.ipdcesgpdd": {
    source: "iana"
  },
  "application/vnd.dvb.ipdcroaming": {
    source: "iana"
  },
  "application/vnd.dvb.iptv.alfec-base": {
    source: "iana"
  },
  "application/vnd.dvb.iptv.alfec-enhancement": {
    source: "iana"
  },
  "application/vnd.dvb.notif-aggregate-root+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.dvb.notif-container+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.dvb.notif-generic+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.dvb.notif-ia-msglist+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.dvb.notif-ia-registration-request+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.dvb.notif-ia-registration-response+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.dvb.notif-init+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.dvb.pfr": {
    source: "iana"
  },
  "application/vnd.dvb.service": {
    source: "iana",
    extensions: [
      "svc"
    ]
  },
  "application/vnd.dxr": {
    source: "iana"
  },
  "application/vnd.dynageo": {
    source: "iana",
    extensions: [
      "geo"
    ]
  },
  "application/vnd.dzr": {
    source: "iana"
  },
  "application/vnd.easykaraoke.cdgdownload": {
    source: "iana"
  },
  "application/vnd.ecdis-update": {
    source: "iana"
  },
  "application/vnd.ecip.rlp": {
    source: "iana"
  },
  "application/vnd.eclipse.ditto+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.ecowin.chart": {
    source: "iana",
    extensions: [
      "mag"
    ]
  },
  "application/vnd.ecowin.filerequest": {
    source: "iana"
  },
  "application/vnd.ecowin.fileupdate": {
    source: "iana"
  },
  "application/vnd.ecowin.series": {
    source: "iana"
  },
  "application/vnd.ecowin.seriesrequest": {
    source: "iana"
  },
  "application/vnd.ecowin.seriesupdate": {
    source: "iana"
  },
  "application/vnd.efi.img": {
    source: "iana"
  },
  "application/vnd.efi.iso": {
    source: "iana"
  },
  "application/vnd.emclient.accessrequest+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.enliven": {
    source: "iana",
    extensions: [
      "nml"
    ]
  },
  "application/vnd.enphase.envoy": {
    source: "iana"
  },
  "application/vnd.eprints.data+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.epson.esf": {
    source: "iana",
    extensions: [
      "esf"
    ]
  },
  "application/vnd.epson.msf": {
    source: "iana",
    extensions: [
      "msf"
    ]
  },
  "application/vnd.epson.quickanime": {
    source: "iana",
    extensions: [
      "qam"
    ]
  },
  "application/vnd.epson.salt": {
    source: "iana",
    extensions: [
      "slt"
    ]
  },
  "application/vnd.epson.ssf": {
    source: "iana",
    extensions: [
      "ssf"
    ]
  },
  "application/vnd.ericsson.quickcall": {
    source: "iana"
  },
  "application/vnd.espass-espass+zip": {
    source: "iana",
    compressible: !1
  },
  "application/vnd.eszigno3+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "es3",
      "et3"
    ]
  },
  "application/vnd.etsi.aoc+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.etsi.asic-e+zip": {
    source: "iana",
    compressible: !1
  },
  "application/vnd.etsi.asic-s+zip": {
    source: "iana",
    compressible: !1
  },
  "application/vnd.etsi.cug+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.etsi.iptvcommand+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.etsi.iptvdiscovery+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.etsi.iptvprofile+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.etsi.iptvsad-bc+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.etsi.iptvsad-cod+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.etsi.iptvsad-npvr+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.etsi.iptvservice+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.etsi.iptvsync+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.etsi.iptvueprofile+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.etsi.mcid+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.etsi.mheg5": {
    source: "iana"
  },
  "application/vnd.etsi.overload-control-policy-dataset+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.etsi.pstn+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.etsi.sci+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.etsi.simservs+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.etsi.timestamp-token": {
    source: "iana"
  },
  "application/vnd.etsi.tsl+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.etsi.tsl.der": {
    source: "iana"
  },
  "application/vnd.eu.kasparian.car+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.eudora.data": {
    source: "iana"
  },
  "application/vnd.evolv.ecig.profile": {
    source: "iana"
  },
  "application/vnd.evolv.ecig.settings": {
    source: "iana"
  },
  "application/vnd.evolv.ecig.theme": {
    source: "iana"
  },
  "application/vnd.exstream-empower+zip": {
    source: "iana",
    compressible: !1
  },
  "application/vnd.exstream-package": {
    source: "iana"
  },
  "application/vnd.ezpix-album": {
    source: "iana",
    extensions: [
      "ez2"
    ]
  },
  "application/vnd.ezpix-package": {
    source: "iana",
    extensions: [
      "ez3"
    ]
  },
  "application/vnd.f-secure.mobile": {
    source: "iana"
  },
  "application/vnd.familysearch.gedcom+zip": {
    source: "iana",
    compressible: !1
  },
  "application/vnd.fastcopy-disk-image": {
    source: "iana"
  },
  "application/vnd.fdf": {
    source: "iana",
    extensions: [
      "fdf"
    ]
  },
  "application/vnd.fdsn.mseed": {
    source: "iana",
    extensions: [
      "mseed"
    ]
  },
  "application/vnd.fdsn.seed": {
    source: "iana",
    extensions: [
      "seed",
      "dataless"
    ]
  },
  "application/vnd.ffsns": {
    source: "iana"
  },
  "application/vnd.ficlab.flb+zip": {
    source: "iana",
    compressible: !1
  },
  "application/vnd.filmit.zfc": {
    source: "iana"
  },
  "application/vnd.fints": {
    source: "iana"
  },
  "application/vnd.firemonkeys.cloudcell": {
    source: "iana"
  },
  "application/vnd.flographit": {
    source: "iana",
    extensions: [
      "gph"
    ]
  },
  "application/vnd.fluxtime.clip": {
    source: "iana",
    extensions: [
      "ftc"
    ]
  },
  "application/vnd.font-fontforge-sfd": {
    source: "iana"
  },
  "application/vnd.framemaker": {
    source: "iana",
    extensions: [
      "fm",
      "frame",
      "maker",
      "book"
    ]
  },
  "application/vnd.frogans.fnc": {
    source: "iana",
    extensions: [
      "fnc"
    ]
  },
  "application/vnd.frogans.ltf": {
    source: "iana",
    extensions: [
      "ltf"
    ]
  },
  "application/vnd.fsc.weblaunch": {
    source: "iana",
    extensions: [
      "fsc"
    ]
  },
  "application/vnd.fujifilm.fb.docuworks": {
    source: "iana"
  },
  "application/vnd.fujifilm.fb.docuworks.binder": {
    source: "iana"
  },
  "application/vnd.fujifilm.fb.docuworks.container": {
    source: "iana"
  },
  "application/vnd.fujifilm.fb.jfi+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.fujitsu.oasys": {
    source: "iana",
    extensions: [
      "oas"
    ]
  },
  "application/vnd.fujitsu.oasys2": {
    source: "iana",
    extensions: [
      "oa2"
    ]
  },
  "application/vnd.fujitsu.oasys3": {
    source: "iana",
    extensions: [
      "oa3"
    ]
  },
  "application/vnd.fujitsu.oasysgp": {
    source: "iana",
    extensions: [
      "fg5"
    ]
  },
  "application/vnd.fujitsu.oasysprs": {
    source: "iana",
    extensions: [
      "bh2"
    ]
  },
  "application/vnd.fujixerox.art-ex": {
    source: "iana"
  },
  "application/vnd.fujixerox.art4": {
    source: "iana"
  },
  "application/vnd.fujixerox.ddd": {
    source: "iana",
    extensions: [
      "ddd"
    ]
  },
  "application/vnd.fujixerox.docuworks": {
    source: "iana",
    extensions: [
      "xdw"
    ]
  },
  "application/vnd.fujixerox.docuworks.binder": {
    source: "iana",
    extensions: [
      "xbd"
    ]
  },
  "application/vnd.fujixerox.docuworks.container": {
    source: "iana"
  },
  "application/vnd.fujixerox.hbpl": {
    source: "iana"
  },
  "application/vnd.fut-misnet": {
    source: "iana"
  },
  "application/vnd.futoin+cbor": {
    source: "iana"
  },
  "application/vnd.futoin+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.fuzzysheet": {
    source: "iana",
    extensions: [
      "fzs"
    ]
  },
  "application/vnd.genomatix.tuxedo": {
    source: "iana",
    extensions: [
      "txd"
    ]
  },
  "application/vnd.gentics.grd+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.geo+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.geocube+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.geogebra.file": {
    source: "iana",
    extensions: [
      "ggb"
    ]
  },
  "application/vnd.geogebra.slides": {
    source: "iana"
  },
  "application/vnd.geogebra.tool": {
    source: "iana",
    extensions: [
      "ggt"
    ]
  },
  "application/vnd.geometry-explorer": {
    source: "iana",
    extensions: [
      "gex",
      "gre"
    ]
  },
  "application/vnd.geonext": {
    source: "iana",
    extensions: [
      "gxt"
    ]
  },
  "application/vnd.geoplan": {
    source: "iana",
    extensions: [
      "g2w"
    ]
  },
  "application/vnd.geospace": {
    source: "iana",
    extensions: [
      "g3w"
    ]
  },
  "application/vnd.gerber": {
    source: "iana"
  },
  "application/vnd.globalplatform.card-content-mgt": {
    source: "iana"
  },
  "application/vnd.globalplatform.card-content-mgt-response": {
    source: "iana"
  },
  "application/vnd.gmx": {
    source: "iana",
    extensions: [
      "gmx"
    ]
  },
  "application/vnd.google-apps.document": {
    compressible: !1,
    extensions: [
      "gdoc"
    ]
  },
  "application/vnd.google-apps.presentation": {
    compressible: !1,
    extensions: [
      "gslides"
    ]
  },
  "application/vnd.google-apps.spreadsheet": {
    compressible: !1,
    extensions: [
      "gsheet"
    ]
  },
  "application/vnd.google-earth.kml+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "kml"
    ]
  },
  "application/vnd.google-earth.kmz": {
    source: "iana",
    compressible: !1,
    extensions: [
      "kmz"
    ]
  },
  "application/vnd.gov.sk.e-form+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.gov.sk.e-form+zip": {
    source: "iana",
    compressible: !1
  },
  "application/vnd.gov.sk.xmldatacontainer+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.grafeq": {
    source: "iana",
    extensions: [
      "gqf",
      "gqs"
    ]
  },
  "application/vnd.gridmp": {
    source: "iana"
  },
  "application/vnd.groove-account": {
    source: "iana",
    extensions: [
      "gac"
    ]
  },
  "application/vnd.groove-help": {
    source: "iana",
    extensions: [
      "ghf"
    ]
  },
  "application/vnd.groove-identity-message": {
    source: "iana",
    extensions: [
      "gim"
    ]
  },
  "application/vnd.groove-injector": {
    source: "iana",
    extensions: [
      "grv"
    ]
  },
  "application/vnd.groove-tool-message": {
    source: "iana",
    extensions: [
      "gtm"
    ]
  },
  "application/vnd.groove-tool-template": {
    source: "iana",
    extensions: [
      "tpl"
    ]
  },
  "application/vnd.groove-vcard": {
    source: "iana",
    extensions: [
      "vcg"
    ]
  },
  "application/vnd.hal+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.hal+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "hal"
    ]
  },
  "application/vnd.handheld-entertainment+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "zmm"
    ]
  },
  "application/vnd.hbci": {
    source: "iana",
    extensions: [
      "hbci"
    ]
  },
  "application/vnd.hc+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.hcl-bireports": {
    source: "iana"
  },
  "application/vnd.hdt": {
    source: "iana"
  },
  "application/vnd.heroku+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.hhe.lesson-player": {
    source: "iana",
    extensions: [
      "les"
    ]
  },
  "application/vnd.hl7cda+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0
  },
  "application/vnd.hl7v2+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0
  },
  "application/vnd.hp-hpgl": {
    source: "iana",
    extensions: [
      "hpgl"
    ]
  },
  "application/vnd.hp-hpid": {
    source: "iana",
    extensions: [
      "hpid"
    ]
  },
  "application/vnd.hp-hps": {
    source: "iana",
    extensions: [
      "hps"
    ]
  },
  "application/vnd.hp-jlyt": {
    source: "iana",
    extensions: [
      "jlt"
    ]
  },
  "application/vnd.hp-pcl": {
    source: "iana",
    extensions: [
      "pcl"
    ]
  },
  "application/vnd.hp-pclxl": {
    source: "iana",
    extensions: [
      "pclxl"
    ]
  },
  "application/vnd.httphone": {
    source: "iana"
  },
  "application/vnd.hydrostatix.sof-data": {
    source: "iana",
    extensions: [
      "sfd-hdstx"
    ]
  },
  "application/vnd.hyper+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.hyper-item+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.hyperdrive+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.hzn-3d-crossword": {
    source: "iana"
  },
  "application/vnd.ibm.afplinedata": {
    source: "iana"
  },
  "application/vnd.ibm.electronic-media": {
    source: "iana"
  },
  "application/vnd.ibm.minipay": {
    source: "iana",
    extensions: [
      "mpy"
    ]
  },
  "application/vnd.ibm.modcap": {
    source: "iana",
    extensions: [
      "afp",
      "listafp",
      "list3820"
    ]
  },
  "application/vnd.ibm.rights-management": {
    source: "iana",
    extensions: [
      "irm"
    ]
  },
  "application/vnd.ibm.secure-container": {
    source: "iana",
    extensions: [
      "sc"
    ]
  },
  "application/vnd.iccprofile": {
    source: "iana",
    extensions: [
      "icc",
      "icm"
    ]
  },
  "application/vnd.ieee.1905": {
    source: "iana"
  },
  "application/vnd.igloader": {
    source: "iana",
    extensions: [
      "igl"
    ]
  },
  "application/vnd.imagemeter.folder+zip": {
    source: "iana",
    compressible: !1
  },
  "application/vnd.imagemeter.image+zip": {
    source: "iana",
    compressible: !1
  },
  "application/vnd.immervision-ivp": {
    source: "iana",
    extensions: [
      "ivp"
    ]
  },
  "application/vnd.immervision-ivu": {
    source: "iana",
    extensions: [
      "ivu"
    ]
  },
  "application/vnd.ims.imsccv1p1": {
    source: "iana"
  },
  "application/vnd.ims.imsccv1p2": {
    source: "iana"
  },
  "application/vnd.ims.imsccv1p3": {
    source: "iana"
  },
  "application/vnd.ims.lis.v2.result+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.ims.lti.v2.toolconsumerprofile+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.ims.lti.v2.toolproxy+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.ims.lti.v2.toolproxy.id+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.ims.lti.v2.toolsettings+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.ims.lti.v2.toolsettings.simple+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.informedcontrol.rms+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.informix-visionary": {
    source: "iana"
  },
  "application/vnd.infotech.project": {
    source: "iana"
  },
  "application/vnd.infotech.project+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.innopath.wamp.notification": {
    source: "iana"
  },
  "application/vnd.insors.igm": {
    source: "iana",
    extensions: [
      "igm"
    ]
  },
  "application/vnd.intercon.formnet": {
    source: "iana",
    extensions: [
      "xpw",
      "xpx"
    ]
  },
  "application/vnd.intergeo": {
    source: "iana",
    extensions: [
      "i2g"
    ]
  },
  "application/vnd.intertrust.digibox": {
    source: "iana"
  },
  "application/vnd.intertrust.nncp": {
    source: "iana"
  },
  "application/vnd.intu.qbo": {
    source: "iana",
    extensions: [
      "qbo"
    ]
  },
  "application/vnd.intu.qfx": {
    source: "iana",
    extensions: [
      "qfx"
    ]
  },
  "application/vnd.iptc.g2.catalogitem+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.iptc.g2.conceptitem+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.iptc.g2.knowledgeitem+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.iptc.g2.newsitem+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.iptc.g2.newsmessage+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.iptc.g2.packageitem+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.iptc.g2.planningitem+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.ipunplugged.rcprofile": {
    source: "iana",
    extensions: [
      "rcprofile"
    ]
  },
  "application/vnd.irepository.package+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "irp"
    ]
  },
  "application/vnd.is-xpr": {
    source: "iana",
    extensions: [
      "xpr"
    ]
  },
  "application/vnd.isac.fcs": {
    source: "iana",
    extensions: [
      "fcs"
    ]
  },
  "application/vnd.iso11783-10+zip": {
    source: "iana",
    compressible: !1
  },
  "application/vnd.jam": {
    source: "iana",
    extensions: [
      "jam"
    ]
  },
  "application/vnd.japannet-directory-service": {
    source: "iana"
  },
  "application/vnd.japannet-jpnstore-wakeup": {
    source: "iana"
  },
  "application/vnd.japannet-payment-wakeup": {
    source: "iana"
  },
  "application/vnd.japannet-registration": {
    source: "iana"
  },
  "application/vnd.japannet-registration-wakeup": {
    source: "iana"
  },
  "application/vnd.japannet-setstore-wakeup": {
    source: "iana"
  },
  "application/vnd.japannet-verification": {
    source: "iana"
  },
  "application/vnd.japannet-verification-wakeup": {
    source: "iana"
  },
  "application/vnd.jcp.javame.midlet-rms": {
    source: "iana",
    extensions: [
      "rms"
    ]
  },
  "application/vnd.jisp": {
    source: "iana",
    extensions: [
      "jisp"
    ]
  },
  "application/vnd.joost.joda-archive": {
    source: "iana",
    extensions: [
      "joda"
    ]
  },
  "application/vnd.jsk.isdn-ngn": {
    source: "iana"
  },
  "application/vnd.kahootz": {
    source: "iana",
    extensions: [
      "ktz",
      "ktr"
    ]
  },
  "application/vnd.kde.karbon": {
    source: "iana",
    extensions: [
      "karbon"
    ]
  },
  "application/vnd.kde.kchart": {
    source: "iana",
    extensions: [
      "chrt"
    ]
  },
  "application/vnd.kde.kformula": {
    source: "iana",
    extensions: [
      "kfo"
    ]
  },
  "application/vnd.kde.kivio": {
    source: "iana",
    extensions: [
      "flw"
    ]
  },
  "application/vnd.kde.kontour": {
    source: "iana",
    extensions: [
      "kon"
    ]
  },
  "application/vnd.kde.kpresenter": {
    source: "iana",
    extensions: [
      "kpr",
      "kpt"
    ]
  },
  "application/vnd.kde.kspread": {
    source: "iana",
    extensions: [
      "ksp"
    ]
  },
  "application/vnd.kde.kword": {
    source: "iana",
    extensions: [
      "kwd",
      "kwt"
    ]
  },
  "application/vnd.kenameaapp": {
    source: "iana",
    extensions: [
      "htke"
    ]
  },
  "application/vnd.kidspiration": {
    source: "iana",
    extensions: [
      "kia"
    ]
  },
  "application/vnd.kinar": {
    source: "iana",
    extensions: [
      "kne",
      "knp"
    ]
  },
  "application/vnd.koan": {
    source: "iana",
    extensions: [
      "skp",
      "skd",
      "skt",
      "skm"
    ]
  },
  "application/vnd.kodak-descriptor": {
    source: "iana",
    extensions: [
      "sse"
    ]
  },
  "application/vnd.las": {
    source: "iana"
  },
  "application/vnd.las.las+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.las.las+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "lasxml"
    ]
  },
  "application/vnd.laszip": {
    source: "iana"
  },
  "application/vnd.leap+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.liberty-request+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.llamagraphics.life-balance.desktop": {
    source: "iana",
    extensions: [
      "lbd"
    ]
  },
  "application/vnd.llamagraphics.life-balance.exchange+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "lbe"
    ]
  },
  "application/vnd.logipipe.circuit+zip": {
    source: "iana",
    compressible: !1
  },
  "application/vnd.loom": {
    source: "iana"
  },
  "application/vnd.lotus-1-2-3": {
    source: "iana",
    extensions: [
      "123"
    ]
  },
  "application/vnd.lotus-approach": {
    source: "iana",
    extensions: [
      "apr"
    ]
  },
  "application/vnd.lotus-freelance": {
    source: "iana",
    extensions: [
      "pre"
    ]
  },
  "application/vnd.lotus-notes": {
    source: "iana",
    extensions: [
      "nsf"
    ]
  },
  "application/vnd.lotus-organizer": {
    source: "iana",
    extensions: [
      "org"
    ]
  },
  "application/vnd.lotus-screencam": {
    source: "iana",
    extensions: [
      "scm"
    ]
  },
  "application/vnd.lotus-wordpro": {
    source: "iana",
    extensions: [
      "lwp"
    ]
  },
  "application/vnd.macports.portpkg": {
    source: "iana",
    extensions: [
      "portpkg"
    ]
  },
  "application/vnd.mapbox-vector-tile": {
    source: "iana",
    extensions: [
      "mvt"
    ]
  },
  "application/vnd.marlin.drm.actiontoken+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.marlin.drm.conftoken+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.marlin.drm.license+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.marlin.drm.mdcf": {
    source: "iana"
  },
  "application/vnd.mason+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.maxar.archive.3tz+zip": {
    source: "iana",
    compressible: !1
  },
  "application/vnd.maxmind.maxmind-db": {
    source: "iana"
  },
  "application/vnd.mcd": {
    source: "iana",
    extensions: [
      "mcd"
    ]
  },
  "application/vnd.medcalcdata": {
    source: "iana",
    extensions: [
      "mc1"
    ]
  },
  "application/vnd.mediastation.cdkey": {
    source: "iana",
    extensions: [
      "cdkey"
    ]
  },
  "application/vnd.meridian-slingshot": {
    source: "iana"
  },
  "application/vnd.mfer": {
    source: "iana",
    extensions: [
      "mwf"
    ]
  },
  "application/vnd.mfmp": {
    source: "iana",
    extensions: [
      "mfm"
    ]
  },
  "application/vnd.micro+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.micrografx.flo": {
    source: "iana",
    extensions: [
      "flo"
    ]
  },
  "application/vnd.micrografx.igx": {
    source: "iana",
    extensions: [
      "igx"
    ]
  },
  "application/vnd.microsoft.portable-executable": {
    source: "iana"
  },
  "application/vnd.microsoft.windows.thumbnail-cache": {
    source: "iana"
  },
  "application/vnd.miele+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.mif": {
    source: "iana",
    extensions: [
      "mif"
    ]
  },
  "application/vnd.minisoft-hp3000-save": {
    source: "iana"
  },
  "application/vnd.mitsubishi.misty-guard.trustweb": {
    source: "iana"
  },
  "application/vnd.mobius.daf": {
    source: "iana",
    extensions: [
      "daf"
    ]
  },
  "application/vnd.mobius.dis": {
    source: "iana",
    extensions: [
      "dis"
    ]
  },
  "application/vnd.mobius.mbk": {
    source: "iana",
    extensions: [
      "mbk"
    ]
  },
  "application/vnd.mobius.mqy": {
    source: "iana",
    extensions: [
      "mqy"
    ]
  },
  "application/vnd.mobius.msl": {
    source: "iana",
    extensions: [
      "msl"
    ]
  },
  "application/vnd.mobius.plc": {
    source: "iana",
    extensions: [
      "plc"
    ]
  },
  "application/vnd.mobius.txf": {
    source: "iana",
    extensions: [
      "txf"
    ]
  },
  "application/vnd.mophun.application": {
    source: "iana",
    extensions: [
      "mpn"
    ]
  },
  "application/vnd.mophun.certificate": {
    source: "iana",
    extensions: [
      "mpc"
    ]
  },
  "application/vnd.motorola.flexsuite": {
    source: "iana"
  },
  "application/vnd.motorola.flexsuite.adsi": {
    source: "iana"
  },
  "application/vnd.motorola.flexsuite.fis": {
    source: "iana"
  },
  "application/vnd.motorola.flexsuite.gotap": {
    source: "iana"
  },
  "application/vnd.motorola.flexsuite.kmr": {
    source: "iana"
  },
  "application/vnd.motorola.flexsuite.ttc": {
    source: "iana"
  },
  "application/vnd.motorola.flexsuite.wem": {
    source: "iana"
  },
  "application/vnd.motorola.iprm": {
    source: "iana"
  },
  "application/vnd.mozilla.xul+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "xul"
    ]
  },
  "application/vnd.ms-3mfdocument": {
    source: "iana"
  },
  "application/vnd.ms-artgalry": {
    source: "iana",
    extensions: [
      "cil"
    ]
  },
  "application/vnd.ms-asf": {
    source: "iana"
  },
  "application/vnd.ms-cab-compressed": {
    source: "iana",
    extensions: [
      "cab"
    ]
  },
  "application/vnd.ms-color.iccprofile": {
    source: "apache"
  },
  "application/vnd.ms-excel": {
    source: "iana",
    compressible: !1,
    extensions: [
      "xls",
      "xlm",
      "xla",
      "xlc",
      "xlt",
      "xlw"
    ]
  },
  "application/vnd.ms-excel.addin.macroenabled.12": {
    source: "iana",
    extensions: [
      "xlam"
    ]
  },
  "application/vnd.ms-excel.sheet.binary.macroenabled.12": {
    source: "iana",
    extensions: [
      "xlsb"
    ]
  },
  "application/vnd.ms-excel.sheet.macroenabled.12": {
    source: "iana",
    extensions: [
      "xlsm"
    ]
  },
  "application/vnd.ms-excel.template.macroenabled.12": {
    source: "iana",
    extensions: [
      "xltm"
    ]
  },
  "application/vnd.ms-fontobject": {
    source: "iana",
    compressible: !0,
    extensions: [
      "eot"
    ]
  },
  "application/vnd.ms-htmlhelp": {
    source: "iana",
    extensions: [
      "chm"
    ]
  },
  "application/vnd.ms-ims": {
    source: "iana",
    extensions: [
      "ims"
    ]
  },
  "application/vnd.ms-lrm": {
    source: "iana",
    extensions: [
      "lrm"
    ]
  },
  "application/vnd.ms-office.activex+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.ms-officetheme": {
    source: "iana",
    extensions: [
      "thmx"
    ]
  },
  "application/vnd.ms-opentype": {
    source: "apache",
    compressible: !0
  },
  "application/vnd.ms-outlook": {
    compressible: !1,
    extensions: [
      "msg"
    ]
  },
  "application/vnd.ms-package.obfuscated-opentype": {
    source: "apache"
  },
  "application/vnd.ms-pki.seccat": {
    source: "apache",
    extensions: [
      "cat"
    ]
  },
  "application/vnd.ms-pki.stl": {
    source: "apache",
    extensions: [
      "stl"
    ]
  },
  "application/vnd.ms-playready.initiator+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.ms-powerpoint": {
    source: "iana",
    compressible: !1,
    extensions: [
      "ppt",
      "pps",
      "pot"
    ]
  },
  "application/vnd.ms-powerpoint.addin.macroenabled.12": {
    source: "iana",
    extensions: [
      "ppam"
    ]
  },
  "application/vnd.ms-powerpoint.presentation.macroenabled.12": {
    source: "iana",
    extensions: [
      "pptm"
    ]
  },
  "application/vnd.ms-powerpoint.slide.macroenabled.12": {
    source: "iana",
    extensions: [
      "sldm"
    ]
  },
  "application/vnd.ms-powerpoint.slideshow.macroenabled.12": {
    source: "iana",
    extensions: [
      "ppsm"
    ]
  },
  "application/vnd.ms-powerpoint.template.macroenabled.12": {
    source: "iana",
    extensions: [
      "potm"
    ]
  },
  "application/vnd.ms-printdevicecapabilities+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.ms-printing.printticket+xml": {
    source: "apache",
    compressible: !0
  },
  "application/vnd.ms-printschematicket+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.ms-project": {
    source: "iana",
    extensions: [
      "mpp",
      "mpt"
    ]
  },
  "application/vnd.ms-tnef": {
    source: "iana"
  },
  "application/vnd.ms-windows.devicepairing": {
    source: "iana"
  },
  "application/vnd.ms-windows.nwprinting.oob": {
    source: "iana"
  },
  "application/vnd.ms-windows.printerpairing": {
    source: "iana"
  },
  "application/vnd.ms-windows.wsd.oob": {
    source: "iana"
  },
  "application/vnd.ms-wmdrm.lic-chlg-req": {
    source: "iana"
  },
  "application/vnd.ms-wmdrm.lic-resp": {
    source: "iana"
  },
  "application/vnd.ms-wmdrm.meter-chlg-req": {
    source: "iana"
  },
  "application/vnd.ms-wmdrm.meter-resp": {
    source: "iana"
  },
  "application/vnd.ms-word.document.macroenabled.12": {
    source: "iana",
    extensions: [
      "docm"
    ]
  },
  "application/vnd.ms-word.template.macroenabled.12": {
    source: "iana",
    extensions: [
      "dotm"
    ]
  },
  "application/vnd.ms-works": {
    source: "iana",
    extensions: [
      "wps",
      "wks",
      "wcm",
      "wdb"
    ]
  },
  "application/vnd.ms-wpl": {
    source: "iana",
    extensions: [
      "wpl"
    ]
  },
  "application/vnd.ms-xpsdocument": {
    source: "iana",
    compressible: !1,
    extensions: [
      "xps"
    ]
  },
  "application/vnd.msa-disk-image": {
    source: "iana"
  },
  "application/vnd.mseq": {
    source: "iana",
    extensions: [
      "mseq"
    ]
  },
  "application/vnd.msign": {
    source: "iana"
  },
  "application/vnd.multiad.creator": {
    source: "iana"
  },
  "application/vnd.multiad.creator.cif": {
    source: "iana"
  },
  "application/vnd.music-niff": {
    source: "iana"
  },
  "application/vnd.musician": {
    source: "iana",
    extensions: [
      "mus"
    ]
  },
  "application/vnd.muvee.style": {
    source: "iana",
    extensions: [
      "msty"
    ]
  },
  "application/vnd.mynfc": {
    source: "iana",
    extensions: [
      "taglet"
    ]
  },
  "application/vnd.nacamar.ybrid+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.ncd.control": {
    source: "iana"
  },
  "application/vnd.ncd.reference": {
    source: "iana"
  },
  "application/vnd.nearst.inv+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.nebumind.line": {
    source: "iana"
  },
  "application/vnd.nervana": {
    source: "iana"
  },
  "application/vnd.netfpx": {
    source: "iana"
  },
  "application/vnd.neurolanguage.nlu": {
    source: "iana",
    extensions: [
      "nlu"
    ]
  },
  "application/vnd.nimn": {
    source: "iana"
  },
  "application/vnd.nintendo.nitro.rom": {
    source: "iana"
  },
  "application/vnd.nintendo.snes.rom": {
    source: "iana"
  },
  "application/vnd.nitf": {
    source: "iana",
    extensions: [
      "ntf",
      "nitf"
    ]
  },
  "application/vnd.noblenet-directory": {
    source: "iana",
    extensions: [
      "nnd"
    ]
  },
  "application/vnd.noblenet-sealer": {
    source: "iana",
    extensions: [
      "nns"
    ]
  },
  "application/vnd.noblenet-web": {
    source: "iana",
    extensions: [
      "nnw"
    ]
  },
  "application/vnd.nokia.catalogs": {
    source: "iana"
  },
  "application/vnd.nokia.conml+wbxml": {
    source: "iana"
  },
  "application/vnd.nokia.conml+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.nokia.iptv.config+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.nokia.isds-radio-presets": {
    source: "iana"
  },
  "application/vnd.nokia.landmark+wbxml": {
    source: "iana"
  },
  "application/vnd.nokia.landmark+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.nokia.landmarkcollection+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.nokia.n-gage.ac+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "ac"
    ]
  },
  "application/vnd.nokia.n-gage.data": {
    source: "iana",
    extensions: [
      "ngdat"
    ]
  },
  "application/vnd.nokia.n-gage.symbian.install": {
    source: "iana",
    extensions: [
      "n-gage"
    ]
  },
  "application/vnd.nokia.ncd": {
    source: "iana"
  },
  "application/vnd.nokia.pcd+wbxml": {
    source: "iana"
  },
  "application/vnd.nokia.pcd+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.nokia.radio-preset": {
    source: "iana",
    extensions: [
      "rpst"
    ]
  },
  "application/vnd.nokia.radio-presets": {
    source: "iana",
    extensions: [
      "rpss"
    ]
  },
  "application/vnd.novadigm.edm": {
    source: "iana",
    extensions: [
      "edm"
    ]
  },
  "application/vnd.novadigm.edx": {
    source: "iana",
    extensions: [
      "edx"
    ]
  },
  "application/vnd.novadigm.ext": {
    source: "iana",
    extensions: [
      "ext"
    ]
  },
  "application/vnd.ntt-local.content-share": {
    source: "iana"
  },
  "application/vnd.ntt-local.file-transfer": {
    source: "iana"
  },
  "application/vnd.ntt-local.ogw_remote-access": {
    source: "iana"
  },
  "application/vnd.ntt-local.sip-ta_remote": {
    source: "iana"
  },
  "application/vnd.ntt-local.sip-ta_tcp_stream": {
    source: "iana"
  },
  "application/vnd.oasis.opendocument.chart": {
    source: "iana",
    extensions: [
      "odc"
    ]
  },
  "application/vnd.oasis.opendocument.chart-template": {
    source: "iana",
    extensions: [
      "otc"
    ]
  },
  "application/vnd.oasis.opendocument.database": {
    source: "iana",
    extensions: [
      "odb"
    ]
  },
  "application/vnd.oasis.opendocument.formula": {
    source: "iana",
    extensions: [
      "odf"
    ]
  },
  "application/vnd.oasis.opendocument.formula-template": {
    source: "iana",
    extensions: [
      "odft"
    ]
  },
  "application/vnd.oasis.opendocument.graphics": {
    source: "iana",
    compressible: !1,
    extensions: [
      "odg"
    ]
  },
  "application/vnd.oasis.opendocument.graphics-template": {
    source: "iana",
    extensions: [
      "otg"
    ]
  },
  "application/vnd.oasis.opendocument.image": {
    source: "iana",
    extensions: [
      "odi"
    ]
  },
  "application/vnd.oasis.opendocument.image-template": {
    source: "iana",
    extensions: [
      "oti"
    ]
  },
  "application/vnd.oasis.opendocument.presentation": {
    source: "iana",
    compressible: !1,
    extensions: [
      "odp"
    ]
  },
  "application/vnd.oasis.opendocument.presentation-template": {
    source: "iana",
    extensions: [
      "otp"
    ]
  },
  "application/vnd.oasis.opendocument.spreadsheet": {
    source: "iana",
    compressible: !1,
    extensions: [
      "ods"
    ]
  },
  "application/vnd.oasis.opendocument.spreadsheet-template": {
    source: "iana",
    extensions: [
      "ots"
    ]
  },
  "application/vnd.oasis.opendocument.text": {
    source: "iana",
    compressible: !1,
    extensions: [
      "odt"
    ]
  },
  "application/vnd.oasis.opendocument.text-master": {
    source: "iana",
    extensions: [
      "odm"
    ]
  },
  "application/vnd.oasis.opendocument.text-template": {
    source: "iana",
    extensions: [
      "ott"
    ]
  },
  "application/vnd.oasis.opendocument.text-web": {
    source: "iana",
    extensions: [
      "oth"
    ]
  },
  "application/vnd.obn": {
    source: "iana"
  },
  "application/vnd.ocf+cbor": {
    source: "iana"
  },
  "application/vnd.oci.image.manifest.v1+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oftn.l10n+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oipf.contentaccessdownload+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oipf.contentaccessstreaming+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oipf.cspg-hexbinary": {
    source: "iana"
  },
  "application/vnd.oipf.dae.svg+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oipf.dae.xhtml+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oipf.mippvcontrolmessage+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oipf.pae.gem": {
    source: "iana"
  },
  "application/vnd.oipf.spdiscovery+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oipf.spdlist+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oipf.ueprofile+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oipf.userprofile+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.olpc-sugar": {
    source: "iana",
    extensions: [
      "xo"
    ]
  },
  "application/vnd.oma-scws-config": {
    source: "iana"
  },
  "application/vnd.oma-scws-http-request": {
    source: "iana"
  },
  "application/vnd.oma-scws-http-response": {
    source: "iana"
  },
  "application/vnd.oma.bcast.associated-procedure-parameter+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oma.bcast.drm-trigger+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oma.bcast.imd+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oma.bcast.ltkm": {
    source: "iana"
  },
  "application/vnd.oma.bcast.notification+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oma.bcast.provisioningtrigger": {
    source: "iana"
  },
  "application/vnd.oma.bcast.sgboot": {
    source: "iana"
  },
  "application/vnd.oma.bcast.sgdd+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oma.bcast.sgdu": {
    source: "iana"
  },
  "application/vnd.oma.bcast.simple-symbol-container": {
    source: "iana"
  },
  "application/vnd.oma.bcast.smartcard-trigger+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oma.bcast.sprov+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oma.bcast.stkm": {
    source: "iana"
  },
  "application/vnd.oma.cab-address-book+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oma.cab-feature-handler+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oma.cab-pcc+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oma.cab-subs-invite+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oma.cab-user-prefs+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oma.dcd": {
    source: "iana"
  },
  "application/vnd.oma.dcdc": {
    source: "iana"
  },
  "application/vnd.oma.dd2+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "dd2"
    ]
  },
  "application/vnd.oma.drm.risd+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oma.group-usage-list+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oma.lwm2m+cbor": {
    source: "iana"
  },
  "application/vnd.oma.lwm2m+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oma.lwm2m+tlv": {
    source: "iana"
  },
  "application/vnd.oma.pal+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oma.poc.detailed-progress-report+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oma.poc.final-report+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oma.poc.groups+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oma.poc.invocation-descriptor+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oma.poc.optimized-progress-report+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oma.push": {
    source: "iana"
  },
  "application/vnd.oma.scidm.messages+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oma.xcap-directory+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.omads-email+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0
  },
  "application/vnd.omads-file+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0
  },
  "application/vnd.omads-folder+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0
  },
  "application/vnd.omaloc-supl-init": {
    source: "iana"
  },
  "application/vnd.onepager": {
    source: "iana"
  },
  "application/vnd.onepagertamp": {
    source: "iana"
  },
  "application/vnd.onepagertamx": {
    source: "iana"
  },
  "application/vnd.onepagertat": {
    source: "iana"
  },
  "application/vnd.onepagertatp": {
    source: "iana"
  },
  "application/vnd.onepagertatx": {
    source: "iana"
  },
  "application/vnd.openblox.game+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "obgx"
    ]
  },
  "application/vnd.openblox.game-binary": {
    source: "iana"
  },
  "application/vnd.openeye.oeb": {
    source: "iana"
  },
  "application/vnd.openofficeorg.extension": {
    source: "apache",
    extensions: [
      "oxt"
    ]
  },
  "application/vnd.openstreetmap.data+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "osm"
    ]
  },
  "application/vnd.opentimestamps.ots": {
    source: "iana"
  },
  "application/vnd.openxmlformats-officedocument.custom-properties+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.customxmlproperties+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.drawing+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.drawingml.chart+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.drawingml.chartshapes+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.drawingml.diagramcolors+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.drawingml.diagramdata+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.drawingml.diagramlayout+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.drawingml.diagramstyle+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.extended-properties+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.presentationml.commentauthors+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.presentationml.comments+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.presentationml.handoutmaster+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.presentationml.notesmaster+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.presentationml.notesslide+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": {
    source: "iana",
    compressible: !1,
    extensions: [
      "pptx"
    ]
  },
  "application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.presentationml.presprops+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.presentationml.slide": {
    source: "iana",
    extensions: [
      "sldx"
    ]
  },
  "application/vnd.openxmlformats-officedocument.presentationml.slide+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.presentationml.slidelayout+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.presentationml.slidemaster+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.presentationml.slideshow": {
    source: "iana",
    extensions: [
      "ppsx"
    ]
  },
  "application/vnd.openxmlformats-officedocument.presentationml.slideshow.main+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.presentationml.slideupdateinfo+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.presentationml.tablestyles+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.presentationml.tags+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.presentationml.template": {
    source: "iana",
    extensions: [
      "potx"
    ]
  },
  "application/vnd.openxmlformats-officedocument.presentationml.template.main+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.presentationml.viewprops+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.calcchain+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.chartsheet+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.connections+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.dialogsheet+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.externallink+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcachedefinition+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcacherecords+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.pivottable+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.querytable+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.revisionheaders+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.revisionlog+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sharedstrings+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
    source: "iana",
    compressible: !1,
    extensions: [
      "xlsx"
    ]
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheetmetadata+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.tablesinglecells+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.template": {
    source: "iana",
    extensions: [
      "xltx"
    ]
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.template.main+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.usernames+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.volatiledependencies+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.theme+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.themeoverride+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.vmldrawing": {
    source: "iana"
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.comments+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
    source: "iana",
    compressible: !1,
    extensions: [
      "docx"
    ]
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document.glossary+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.endnotes+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.fonttable+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.footnotes+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.template": {
    source: "iana",
    extensions: [
      "dotx"
    ]
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.template.main+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.websettings+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-package.core-properties+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-package.digital-signature-xmlsignature+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.openxmlformats-package.relationships+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oracle.resource+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.orange.indata": {
    source: "iana"
  },
  "application/vnd.osa.netdeploy": {
    source: "iana"
  },
  "application/vnd.osgeo.mapguide.package": {
    source: "iana",
    extensions: [
      "mgp"
    ]
  },
  "application/vnd.osgi.bundle": {
    source: "iana"
  },
  "application/vnd.osgi.dp": {
    source: "iana",
    extensions: [
      "dp"
    ]
  },
  "application/vnd.osgi.subsystem": {
    source: "iana",
    extensions: [
      "esa"
    ]
  },
  "application/vnd.otps.ct-kip+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.oxli.countgraph": {
    source: "iana"
  },
  "application/vnd.pagerduty+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.palm": {
    source: "iana",
    extensions: [
      "pdb",
      "pqa",
      "oprc"
    ]
  },
  "application/vnd.panoply": {
    source: "iana"
  },
  "application/vnd.paos.xml": {
    source: "iana"
  },
  "application/vnd.patentdive": {
    source: "iana"
  },
  "application/vnd.patientecommsdoc": {
    source: "iana"
  },
  "application/vnd.pawaafile": {
    source: "iana",
    extensions: [
      "paw"
    ]
  },
  "application/vnd.pcos": {
    source: "iana"
  },
  "application/vnd.pg.format": {
    source: "iana",
    extensions: [
      "str"
    ]
  },
  "application/vnd.pg.osasli": {
    source: "iana",
    extensions: [
      "ei6"
    ]
  },
  "application/vnd.piaccess.application-licence": {
    source: "iana"
  },
  "application/vnd.picsel": {
    source: "iana",
    extensions: [
      "efif"
    ]
  },
  "application/vnd.pmi.widget": {
    source: "iana",
    extensions: [
      "wg"
    ]
  },
  "application/vnd.poc.group-advertisement+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.pocketlearn": {
    source: "iana",
    extensions: [
      "plf"
    ]
  },
  "application/vnd.powerbuilder6": {
    source: "iana",
    extensions: [
      "pbd"
    ]
  },
  "application/vnd.powerbuilder6-s": {
    source: "iana"
  },
  "application/vnd.powerbuilder7": {
    source: "iana"
  },
  "application/vnd.powerbuilder7-s": {
    source: "iana"
  },
  "application/vnd.powerbuilder75": {
    source: "iana"
  },
  "application/vnd.powerbuilder75-s": {
    source: "iana"
  },
  "application/vnd.preminet": {
    source: "iana"
  },
  "application/vnd.previewsystems.box": {
    source: "iana",
    extensions: [
      "box"
    ]
  },
  "application/vnd.proteus.magazine": {
    source: "iana",
    extensions: [
      "mgz"
    ]
  },
  "application/vnd.psfs": {
    source: "iana"
  },
  "application/vnd.publishare-delta-tree": {
    source: "iana",
    extensions: [
      "qps"
    ]
  },
  "application/vnd.pvi.ptid1": {
    source: "iana",
    extensions: [
      "ptid"
    ]
  },
  "application/vnd.pwg-multiplexed": {
    source: "iana"
  },
  "application/vnd.pwg-xhtml-print+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.qualcomm.brew-app-res": {
    source: "iana"
  },
  "application/vnd.quarantainenet": {
    source: "iana"
  },
  "application/vnd.quark.quarkxpress": {
    source: "iana",
    extensions: [
      "qxd",
      "qxt",
      "qwd",
      "qwt",
      "qxl",
      "qxb"
    ]
  },
  "application/vnd.quobject-quoxdocument": {
    source: "iana"
  },
  "application/vnd.radisys.moml+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.radisys.msml+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.radisys.msml-audit+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.radisys.msml-audit-conf+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.radisys.msml-audit-conn+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.radisys.msml-audit-dialog+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.radisys.msml-audit-stream+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.radisys.msml-conf+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.radisys.msml-dialog+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.radisys.msml-dialog-base+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.radisys.msml-dialog-fax-detect+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.radisys.msml-dialog-fax-sendrecv+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.radisys.msml-dialog-group+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.radisys.msml-dialog-speech+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.radisys.msml-dialog-transform+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.rainstor.data": {
    source: "iana"
  },
  "application/vnd.rapid": {
    source: "iana"
  },
  "application/vnd.rar": {
    source: "iana",
    extensions: [
      "rar"
    ]
  },
  "application/vnd.realvnc.bed": {
    source: "iana",
    extensions: [
      "bed"
    ]
  },
  "application/vnd.recordare.musicxml": {
    source: "iana",
    extensions: [
      "mxl"
    ]
  },
  "application/vnd.recordare.musicxml+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "musicxml"
    ]
  },
  "application/vnd.renlearn.rlprint": {
    source: "iana"
  },
  "application/vnd.resilient.logic": {
    source: "iana"
  },
  "application/vnd.restful+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.rig.cryptonote": {
    source: "iana",
    extensions: [
      "cryptonote"
    ]
  },
  "application/vnd.rim.cod": {
    source: "apache",
    extensions: [
      "cod"
    ]
  },
  "application/vnd.rn-realmedia": {
    source: "apache",
    extensions: [
      "rm"
    ]
  },
  "application/vnd.rn-realmedia-vbr": {
    source: "apache",
    extensions: [
      "rmvb"
    ]
  },
  "application/vnd.route66.link66+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "link66"
    ]
  },
  "application/vnd.rs-274x": {
    source: "iana"
  },
  "application/vnd.ruckus.download": {
    source: "iana"
  },
  "application/vnd.s3sms": {
    source: "iana"
  },
  "application/vnd.sailingtracker.track": {
    source: "iana",
    extensions: [
      "st"
    ]
  },
  "application/vnd.sar": {
    source: "iana"
  },
  "application/vnd.sbm.cid": {
    source: "iana"
  },
  "application/vnd.sbm.mid2": {
    source: "iana"
  },
  "application/vnd.scribus": {
    source: "iana"
  },
  "application/vnd.sealed.3df": {
    source: "iana"
  },
  "application/vnd.sealed.csf": {
    source: "iana"
  },
  "application/vnd.sealed.doc": {
    source: "iana"
  },
  "application/vnd.sealed.eml": {
    source: "iana"
  },
  "application/vnd.sealed.mht": {
    source: "iana"
  },
  "application/vnd.sealed.net": {
    source: "iana"
  },
  "application/vnd.sealed.ppt": {
    source: "iana"
  },
  "application/vnd.sealed.tiff": {
    source: "iana"
  },
  "application/vnd.sealed.xls": {
    source: "iana"
  },
  "application/vnd.sealedmedia.softseal.html": {
    source: "iana"
  },
  "application/vnd.sealedmedia.softseal.pdf": {
    source: "iana"
  },
  "application/vnd.seemail": {
    source: "iana",
    extensions: [
      "see"
    ]
  },
  "application/vnd.seis+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.sema": {
    source: "iana",
    extensions: [
      "sema"
    ]
  },
  "application/vnd.semd": {
    source: "iana",
    extensions: [
      "semd"
    ]
  },
  "application/vnd.semf": {
    source: "iana",
    extensions: [
      "semf"
    ]
  },
  "application/vnd.shade-save-file": {
    source: "iana"
  },
  "application/vnd.shana.informed.formdata": {
    source: "iana",
    extensions: [
      "ifm"
    ]
  },
  "application/vnd.shana.informed.formtemplate": {
    source: "iana",
    extensions: [
      "itp"
    ]
  },
  "application/vnd.shana.informed.interchange": {
    source: "iana",
    extensions: [
      "iif"
    ]
  },
  "application/vnd.shana.informed.package": {
    source: "iana",
    extensions: [
      "ipk"
    ]
  },
  "application/vnd.shootproof+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.shopkick+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.shp": {
    source: "iana"
  },
  "application/vnd.shx": {
    source: "iana"
  },
  "application/vnd.sigrok.session": {
    source: "iana"
  },
  "application/vnd.simtech-mindmapper": {
    source: "iana",
    extensions: [
      "twd",
      "twds"
    ]
  },
  "application/vnd.siren+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.smaf": {
    source: "iana",
    extensions: [
      "mmf"
    ]
  },
  "application/vnd.smart.notebook": {
    source: "iana"
  },
  "application/vnd.smart.teacher": {
    source: "iana",
    extensions: [
      "teacher"
    ]
  },
  "application/vnd.snesdev-page-table": {
    source: "iana"
  },
  "application/vnd.software602.filler.form+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "fo"
    ]
  },
  "application/vnd.software602.filler.form-xml-zip": {
    source: "iana"
  },
  "application/vnd.solent.sdkm+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "sdkm",
      "sdkd"
    ]
  },
  "application/vnd.spotfire.dxp": {
    source: "iana",
    extensions: [
      "dxp"
    ]
  },
  "application/vnd.spotfire.sfs": {
    source: "iana",
    extensions: [
      "sfs"
    ]
  },
  "application/vnd.sqlite3": {
    source: "iana"
  },
  "application/vnd.sss-cod": {
    source: "iana"
  },
  "application/vnd.sss-dtf": {
    source: "iana"
  },
  "application/vnd.sss-ntf": {
    source: "iana"
  },
  "application/vnd.stardivision.calc": {
    source: "apache",
    extensions: [
      "sdc"
    ]
  },
  "application/vnd.stardivision.draw": {
    source: "apache",
    extensions: [
      "sda"
    ]
  },
  "application/vnd.stardivision.impress": {
    source: "apache",
    extensions: [
      "sdd"
    ]
  },
  "application/vnd.stardivision.math": {
    source: "apache",
    extensions: [
      "smf"
    ]
  },
  "application/vnd.stardivision.writer": {
    source: "apache",
    extensions: [
      "sdw",
      "vor"
    ]
  },
  "application/vnd.stardivision.writer-global": {
    source: "apache",
    extensions: [
      "sgl"
    ]
  },
  "application/vnd.stepmania.package": {
    source: "iana",
    extensions: [
      "smzip"
    ]
  },
  "application/vnd.stepmania.stepchart": {
    source: "iana",
    extensions: [
      "sm"
    ]
  },
  "application/vnd.street-stream": {
    source: "iana"
  },
  "application/vnd.sun.wadl+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "wadl"
    ]
  },
  "application/vnd.sun.xml.calc": {
    source: "apache",
    extensions: [
      "sxc"
    ]
  },
  "application/vnd.sun.xml.calc.template": {
    source: "apache",
    extensions: [
      "stc"
    ]
  },
  "application/vnd.sun.xml.draw": {
    source: "apache",
    extensions: [
      "sxd"
    ]
  },
  "application/vnd.sun.xml.draw.template": {
    source: "apache",
    extensions: [
      "std"
    ]
  },
  "application/vnd.sun.xml.impress": {
    source: "apache",
    extensions: [
      "sxi"
    ]
  },
  "application/vnd.sun.xml.impress.template": {
    source: "apache",
    extensions: [
      "sti"
    ]
  },
  "application/vnd.sun.xml.math": {
    source: "apache",
    extensions: [
      "sxm"
    ]
  },
  "application/vnd.sun.xml.writer": {
    source: "apache",
    extensions: [
      "sxw"
    ]
  },
  "application/vnd.sun.xml.writer.global": {
    source: "apache",
    extensions: [
      "sxg"
    ]
  },
  "application/vnd.sun.xml.writer.template": {
    source: "apache",
    extensions: [
      "stw"
    ]
  },
  "application/vnd.sus-calendar": {
    source: "iana",
    extensions: [
      "sus",
      "susp"
    ]
  },
  "application/vnd.svd": {
    source: "iana",
    extensions: [
      "svd"
    ]
  },
  "application/vnd.swiftview-ics": {
    source: "iana"
  },
  "application/vnd.sycle+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.syft+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.symbian.install": {
    source: "apache",
    extensions: [
      "sis",
      "sisx"
    ]
  },
  "application/vnd.syncml+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0,
    extensions: [
      "xsm"
    ]
  },
  "application/vnd.syncml.dm+wbxml": {
    source: "iana",
    charset: "UTF-8",
    extensions: [
      "bdm"
    ]
  },
  "application/vnd.syncml.dm+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0,
    extensions: [
      "xdm"
    ]
  },
  "application/vnd.syncml.dm.notification": {
    source: "iana"
  },
  "application/vnd.syncml.dmddf+wbxml": {
    source: "iana"
  },
  "application/vnd.syncml.dmddf+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0,
    extensions: [
      "ddf"
    ]
  },
  "application/vnd.syncml.dmtnds+wbxml": {
    source: "iana"
  },
  "application/vnd.syncml.dmtnds+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0
  },
  "application/vnd.syncml.ds.notification": {
    source: "iana"
  },
  "application/vnd.tableschema+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.tao.intent-module-archive": {
    source: "iana",
    extensions: [
      "tao"
    ]
  },
  "application/vnd.tcpdump.pcap": {
    source: "iana",
    extensions: [
      "pcap",
      "cap",
      "dmp"
    ]
  },
  "application/vnd.think-cell.ppttc+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.tmd.mediaflex.api+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.tml": {
    source: "iana"
  },
  "application/vnd.tmobile-livetv": {
    source: "iana",
    extensions: [
      "tmo"
    ]
  },
  "application/vnd.tri.onesource": {
    source: "iana"
  },
  "application/vnd.trid.tpt": {
    source: "iana",
    extensions: [
      "tpt"
    ]
  },
  "application/vnd.triscape.mxs": {
    source: "iana",
    extensions: [
      "mxs"
    ]
  },
  "application/vnd.trueapp": {
    source: "iana",
    extensions: [
      "tra"
    ]
  },
  "application/vnd.truedoc": {
    source: "iana"
  },
  "application/vnd.ubisoft.webplayer": {
    source: "iana"
  },
  "application/vnd.ufdl": {
    source: "iana",
    extensions: [
      "ufd",
      "ufdl"
    ]
  },
  "application/vnd.uiq.theme": {
    source: "iana",
    extensions: [
      "utz"
    ]
  },
  "application/vnd.umajin": {
    source: "iana",
    extensions: [
      "umj"
    ]
  },
  "application/vnd.unity": {
    source: "iana",
    extensions: [
      "unityweb"
    ]
  },
  "application/vnd.uoml+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "uoml"
    ]
  },
  "application/vnd.uplanet.alert": {
    source: "iana"
  },
  "application/vnd.uplanet.alert-wbxml": {
    source: "iana"
  },
  "application/vnd.uplanet.bearer-choice": {
    source: "iana"
  },
  "application/vnd.uplanet.bearer-choice-wbxml": {
    source: "iana"
  },
  "application/vnd.uplanet.cacheop": {
    source: "iana"
  },
  "application/vnd.uplanet.cacheop-wbxml": {
    source: "iana"
  },
  "application/vnd.uplanet.channel": {
    source: "iana"
  },
  "application/vnd.uplanet.channel-wbxml": {
    source: "iana"
  },
  "application/vnd.uplanet.list": {
    source: "iana"
  },
  "application/vnd.uplanet.list-wbxml": {
    source: "iana"
  },
  "application/vnd.uplanet.listcmd": {
    source: "iana"
  },
  "application/vnd.uplanet.listcmd-wbxml": {
    source: "iana"
  },
  "application/vnd.uplanet.signal": {
    source: "iana"
  },
  "application/vnd.uri-map": {
    source: "iana"
  },
  "application/vnd.valve.source.material": {
    source: "iana"
  },
  "application/vnd.vcx": {
    source: "iana",
    extensions: [
      "vcx"
    ]
  },
  "application/vnd.vd-study": {
    source: "iana"
  },
  "application/vnd.vectorworks": {
    source: "iana"
  },
  "application/vnd.vel+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.verimatrix.vcas": {
    source: "iana"
  },
  "application/vnd.veritone.aion+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.veryant.thin": {
    source: "iana"
  },
  "application/vnd.ves.encrypted": {
    source: "iana"
  },
  "application/vnd.vidsoft.vidconference": {
    source: "iana"
  },
  "application/vnd.visio": {
    source: "iana",
    extensions: [
      "vsd",
      "vst",
      "vss",
      "vsw"
    ]
  },
  "application/vnd.visionary": {
    source: "iana",
    extensions: [
      "vis"
    ]
  },
  "application/vnd.vividence.scriptfile": {
    source: "iana"
  },
  "application/vnd.vsf": {
    source: "iana",
    extensions: [
      "vsf"
    ]
  },
  "application/vnd.wap.sic": {
    source: "iana"
  },
  "application/vnd.wap.slc": {
    source: "iana"
  },
  "application/vnd.wap.wbxml": {
    source: "iana",
    charset: "UTF-8",
    extensions: [
      "wbxml"
    ]
  },
  "application/vnd.wap.wmlc": {
    source: "iana",
    extensions: [
      "wmlc"
    ]
  },
  "application/vnd.wap.wmlscriptc": {
    source: "iana",
    extensions: [
      "wmlsc"
    ]
  },
  "application/vnd.webturbo": {
    source: "iana",
    extensions: [
      "wtb"
    ]
  },
  "application/vnd.wfa.dpp": {
    source: "iana"
  },
  "application/vnd.wfa.p2p": {
    source: "iana"
  },
  "application/vnd.wfa.wsc": {
    source: "iana"
  },
  "application/vnd.windows.devicepairing": {
    source: "iana"
  },
  "application/vnd.wmc": {
    source: "iana"
  },
  "application/vnd.wmf.bootstrap": {
    source: "iana"
  },
  "application/vnd.wolfram.mathematica": {
    source: "iana"
  },
  "application/vnd.wolfram.mathematica.package": {
    source: "iana"
  },
  "application/vnd.wolfram.player": {
    source: "iana",
    extensions: [
      "nbp"
    ]
  },
  "application/vnd.wordperfect": {
    source: "iana",
    extensions: [
      "wpd"
    ]
  },
  "application/vnd.wqd": {
    source: "iana",
    extensions: [
      "wqd"
    ]
  },
  "application/vnd.wrq-hp3000-labelled": {
    source: "iana"
  },
  "application/vnd.wt.stf": {
    source: "iana",
    extensions: [
      "stf"
    ]
  },
  "application/vnd.wv.csp+wbxml": {
    source: "iana"
  },
  "application/vnd.wv.csp+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.wv.ssp+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.xacml+json": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.xara": {
    source: "iana",
    extensions: [
      "xar"
    ]
  },
  "application/vnd.xfdl": {
    source: "iana",
    extensions: [
      "xfdl"
    ]
  },
  "application/vnd.xfdl.webform": {
    source: "iana"
  },
  "application/vnd.xmi+xml": {
    source: "iana",
    compressible: !0
  },
  "application/vnd.xmpie.cpkg": {
    source: "iana"
  },
  "application/vnd.xmpie.dpkg": {
    source: "iana"
  },
  "application/vnd.xmpie.plan": {
    source: "iana"
  },
  "application/vnd.xmpie.ppkg": {
    source: "iana"
  },
  "application/vnd.xmpie.xlim": {
    source: "iana"
  },
  "application/vnd.yamaha.hv-dic": {
    source: "iana",
    extensions: [
      "hvd"
    ]
  },
  "application/vnd.yamaha.hv-script": {
    source: "iana",
    extensions: [
      "hvs"
    ]
  },
  "application/vnd.yamaha.hv-voice": {
    source: "iana",
    extensions: [
      "hvp"
    ]
  },
  "application/vnd.yamaha.openscoreformat": {
    source: "iana",
    extensions: [
      "osf"
    ]
  },
  "application/vnd.yamaha.openscoreformat.osfpvg+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "osfpvg"
    ]
  },
  "application/vnd.yamaha.remote-setup": {
    source: "iana"
  },
  "application/vnd.yamaha.smaf-audio": {
    source: "iana",
    extensions: [
      "saf"
    ]
  },
  "application/vnd.yamaha.smaf-phrase": {
    source: "iana",
    extensions: [
      "spf"
    ]
  },
  "application/vnd.yamaha.through-ngn": {
    source: "iana"
  },
  "application/vnd.yamaha.tunnel-udpencap": {
    source: "iana"
  },
  "application/vnd.yaoweme": {
    source: "iana"
  },
  "application/vnd.yellowriver-custom-menu": {
    source: "iana",
    extensions: [
      "cmp"
    ]
  },
  "application/vnd.youtube.yt": {
    source: "iana"
  },
  "application/vnd.zul": {
    source: "iana",
    extensions: [
      "zir",
      "zirz"
    ]
  },
  "application/vnd.zzazz.deck+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "zaz"
    ]
  },
  "application/voicexml+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "vxml"
    ]
  },
  "application/voucher-cms+json": {
    source: "iana",
    compressible: !0
  },
  "application/vq-rtcpxr": {
    source: "iana"
  },
  "application/wasm": {
    source: "iana",
    compressible: !0,
    extensions: [
      "wasm"
    ]
  },
  "application/watcherinfo+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "wif"
    ]
  },
  "application/webpush-options+json": {
    source: "iana",
    compressible: !0
  },
  "application/whoispp-query": {
    source: "iana"
  },
  "application/whoispp-response": {
    source: "iana"
  },
  "application/widget": {
    source: "iana",
    extensions: [
      "wgt"
    ]
  },
  "application/winhlp": {
    source: "apache",
    extensions: [
      "hlp"
    ]
  },
  "application/wita": {
    source: "iana"
  },
  "application/wordperfect5.1": {
    source: "iana"
  },
  "application/wsdl+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "wsdl"
    ]
  },
  "application/wspolicy+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "wspolicy"
    ]
  },
  "application/x-7z-compressed": {
    source: "apache",
    compressible: !1,
    extensions: [
      "7z"
    ]
  },
  "application/x-abiword": {
    source: "apache",
    extensions: [
      "abw"
    ]
  },
  "application/x-ace-compressed": {
    source: "apache",
    extensions: [
      "ace"
    ]
  },
  "application/x-amf": {
    source: "apache"
  },
  "application/x-apple-diskimage": {
    source: "apache",
    extensions: [
      "dmg"
    ]
  },
  "application/x-arj": {
    compressible: !1,
    extensions: [
      "arj"
    ]
  },
  "application/x-authorware-bin": {
    source: "apache",
    extensions: [
      "aab",
      "x32",
      "u32",
      "vox"
    ]
  },
  "application/x-authorware-map": {
    source: "apache",
    extensions: [
      "aam"
    ]
  },
  "application/x-authorware-seg": {
    source: "apache",
    extensions: [
      "aas"
    ]
  },
  "application/x-bcpio": {
    source: "apache",
    extensions: [
      "bcpio"
    ]
  },
  "application/x-bdoc": {
    compressible: !1,
    extensions: [
      "bdoc"
    ]
  },
  "application/x-bittorrent": {
    source: "apache",
    extensions: [
      "torrent"
    ]
  },
  "application/x-blorb": {
    source: "apache",
    extensions: [
      "blb",
      "blorb"
    ]
  },
  "application/x-bzip": {
    source: "apache",
    compressible: !1,
    extensions: [
      "bz"
    ]
  },
  "application/x-bzip2": {
    source: "apache",
    compressible: !1,
    extensions: [
      "bz2",
      "boz"
    ]
  },
  "application/x-cbr": {
    source: "apache",
    extensions: [
      "cbr",
      "cba",
      "cbt",
      "cbz",
      "cb7"
    ]
  },
  "application/x-cdlink": {
    source: "apache",
    extensions: [
      "vcd"
    ]
  },
  "application/x-cfs-compressed": {
    source: "apache",
    extensions: [
      "cfs"
    ]
  },
  "application/x-chat": {
    source: "apache",
    extensions: [
      "chat"
    ]
  },
  "application/x-chess-pgn": {
    source: "apache",
    extensions: [
      "pgn"
    ]
  },
  "application/x-chrome-extension": {
    extensions: [
      "crx"
    ]
  },
  "application/x-cocoa": {
    source: "nginx",
    extensions: [
      "cco"
    ]
  },
  "application/x-compress": {
    source: "apache"
  },
  "application/x-conference": {
    source: "apache",
    extensions: [
      "nsc"
    ]
  },
  "application/x-cpio": {
    source: "apache",
    extensions: [
      "cpio"
    ]
  },
  "application/x-csh": {
    source: "apache",
    extensions: [
      "csh"
    ]
  },
  "application/x-deb": {
    compressible: !1
  },
  "application/x-debian-package": {
    source: "apache",
    extensions: [
      "deb",
      "udeb"
    ]
  },
  "application/x-dgc-compressed": {
    source: "apache",
    extensions: [
      "dgc"
    ]
  },
  "application/x-director": {
    source: "apache",
    extensions: [
      "dir",
      "dcr",
      "dxr",
      "cst",
      "cct",
      "cxt",
      "w3d",
      "fgd",
      "swa"
    ]
  },
  "application/x-doom": {
    source: "apache",
    extensions: [
      "wad"
    ]
  },
  "application/x-dtbncx+xml": {
    source: "apache",
    compressible: !0,
    extensions: [
      "ncx"
    ]
  },
  "application/x-dtbook+xml": {
    source: "apache",
    compressible: !0,
    extensions: [
      "dtb"
    ]
  },
  "application/x-dtbresource+xml": {
    source: "apache",
    compressible: !0,
    extensions: [
      "res"
    ]
  },
  "application/x-dvi": {
    source: "apache",
    compressible: !1,
    extensions: [
      "dvi"
    ]
  },
  "application/x-envoy": {
    source: "apache",
    extensions: [
      "evy"
    ]
  },
  "application/x-eva": {
    source: "apache",
    extensions: [
      "eva"
    ]
  },
  "application/x-font-bdf": {
    source: "apache",
    extensions: [
      "bdf"
    ]
  },
  "application/x-font-dos": {
    source: "apache"
  },
  "application/x-font-framemaker": {
    source: "apache"
  },
  "application/x-font-ghostscript": {
    source: "apache",
    extensions: [
      "gsf"
    ]
  },
  "application/x-font-libgrx": {
    source: "apache"
  },
  "application/x-font-linux-psf": {
    source: "apache",
    extensions: [
      "psf"
    ]
  },
  "application/x-font-pcf": {
    source: "apache",
    extensions: [
      "pcf"
    ]
  },
  "application/x-font-snf": {
    source: "apache",
    extensions: [
      "snf"
    ]
  },
  "application/x-font-speedo": {
    source: "apache"
  },
  "application/x-font-sunos-news": {
    source: "apache"
  },
  "application/x-font-type1": {
    source: "apache",
    extensions: [
      "pfa",
      "pfb",
      "pfm",
      "afm"
    ]
  },
  "application/x-font-vfont": {
    source: "apache"
  },
  "application/x-freearc": {
    source: "apache",
    extensions: [
      "arc"
    ]
  },
  "application/x-futuresplash": {
    source: "apache",
    extensions: [
      "spl"
    ]
  },
  "application/x-gca-compressed": {
    source: "apache",
    extensions: [
      "gca"
    ]
  },
  "application/x-glulx": {
    source: "apache",
    extensions: [
      "ulx"
    ]
  },
  "application/x-gnumeric": {
    source: "apache",
    extensions: [
      "gnumeric"
    ]
  },
  "application/x-gramps-xml": {
    source: "apache",
    extensions: [
      "gramps"
    ]
  },
  "application/x-gtar": {
    source: "apache",
    extensions: [
      "gtar"
    ]
  },
  "application/x-gzip": {
    source: "apache"
  },
  "application/x-hdf": {
    source: "apache",
    extensions: [
      "hdf"
    ]
  },
  "application/x-httpd-php": {
    compressible: !0,
    extensions: [
      "php"
    ]
  },
  "application/x-install-instructions": {
    source: "apache",
    extensions: [
      "install"
    ]
  },
  "application/x-iso9660-image": {
    source: "apache",
    extensions: [
      "iso"
    ]
  },
  "application/x-iwork-keynote-sffkey": {
    extensions: [
      "key"
    ]
  },
  "application/x-iwork-numbers-sffnumbers": {
    extensions: [
      "numbers"
    ]
  },
  "application/x-iwork-pages-sffpages": {
    extensions: [
      "pages"
    ]
  },
  "application/x-java-archive-diff": {
    source: "nginx",
    extensions: [
      "jardiff"
    ]
  },
  "application/x-java-jnlp-file": {
    source: "apache",
    compressible: !1,
    extensions: [
      "jnlp"
    ]
  },
  "application/x-javascript": {
    compressible: !0
  },
  "application/x-keepass2": {
    extensions: [
      "kdbx"
    ]
  },
  "application/x-latex": {
    source: "apache",
    compressible: !1,
    extensions: [
      "latex"
    ]
  },
  "application/x-lua-bytecode": {
    extensions: [
      "luac"
    ]
  },
  "application/x-lzh-compressed": {
    source: "apache",
    extensions: [
      "lzh",
      "lha"
    ]
  },
  "application/x-makeself": {
    source: "nginx",
    extensions: [
      "run"
    ]
  },
  "application/x-mie": {
    source: "apache",
    extensions: [
      "mie"
    ]
  },
  "application/x-mobipocket-ebook": {
    source: "apache",
    extensions: [
      "prc",
      "mobi"
    ]
  },
  "application/x-mpegurl": {
    compressible: !1
  },
  "application/x-ms-application": {
    source: "apache",
    extensions: [
      "application"
    ]
  },
  "application/x-ms-shortcut": {
    source: "apache",
    extensions: [
      "lnk"
    ]
  },
  "application/x-ms-wmd": {
    source: "apache",
    extensions: [
      "wmd"
    ]
  },
  "application/x-ms-wmz": {
    source: "apache",
    extensions: [
      "wmz"
    ]
  },
  "application/x-ms-xbap": {
    source: "apache",
    extensions: [
      "xbap"
    ]
  },
  "application/x-msaccess": {
    source: "apache",
    extensions: [
      "mdb"
    ]
  },
  "application/x-msbinder": {
    source: "apache",
    extensions: [
      "obd"
    ]
  },
  "application/x-mscardfile": {
    source: "apache",
    extensions: [
      "crd"
    ]
  },
  "application/x-msclip": {
    source: "apache",
    extensions: [
      "clp"
    ]
  },
  "application/x-msdos-program": {
    extensions: [
      "exe"
    ]
  },
  "application/x-msdownload": {
    source: "apache",
    extensions: [
      "exe",
      "dll",
      "com",
      "bat",
      "msi"
    ]
  },
  "application/x-msmediaview": {
    source: "apache",
    extensions: [
      "mvb",
      "m13",
      "m14"
    ]
  },
  "application/x-msmetafile": {
    source: "apache",
    extensions: [
      "wmf",
      "wmz",
      "emf",
      "emz"
    ]
  },
  "application/x-msmoney": {
    source: "apache",
    extensions: [
      "mny"
    ]
  },
  "application/x-mspublisher": {
    source: "apache",
    extensions: [
      "pub"
    ]
  },
  "application/x-msschedule": {
    source: "apache",
    extensions: [
      "scd"
    ]
  },
  "application/x-msterminal": {
    source: "apache",
    extensions: [
      "trm"
    ]
  },
  "application/x-mswrite": {
    source: "apache",
    extensions: [
      "wri"
    ]
  },
  "application/x-netcdf": {
    source: "apache",
    extensions: [
      "nc",
      "cdf"
    ]
  },
  "application/x-ns-proxy-autoconfig": {
    compressible: !0,
    extensions: [
      "pac"
    ]
  },
  "application/x-nzb": {
    source: "apache",
    extensions: [
      "nzb"
    ]
  },
  "application/x-perl": {
    source: "nginx",
    extensions: [
      "pl",
      "pm"
    ]
  },
  "application/x-pilot": {
    source: "nginx",
    extensions: [
      "prc",
      "pdb"
    ]
  },
  "application/x-pkcs12": {
    source: "apache",
    compressible: !1,
    extensions: [
      "p12",
      "pfx"
    ]
  },
  "application/x-pkcs7-certificates": {
    source: "apache",
    extensions: [
      "p7b",
      "spc"
    ]
  },
  "application/x-pkcs7-certreqresp": {
    source: "apache",
    extensions: [
      "p7r"
    ]
  },
  "application/x-pki-message": {
    source: "iana"
  },
  "application/x-rar-compressed": {
    source: "apache",
    compressible: !1,
    extensions: [
      "rar"
    ]
  },
  "application/x-redhat-package-manager": {
    source: "nginx",
    extensions: [
      "rpm"
    ]
  },
  "application/x-research-info-systems": {
    source: "apache",
    extensions: [
      "ris"
    ]
  },
  "application/x-sea": {
    source: "nginx",
    extensions: [
      "sea"
    ]
  },
  "application/x-sh": {
    source: "apache",
    compressible: !0,
    extensions: [
      "sh"
    ]
  },
  "application/x-shar": {
    source: "apache",
    extensions: [
      "shar"
    ]
  },
  "application/x-shockwave-flash": {
    source: "apache",
    compressible: !1,
    extensions: [
      "swf"
    ]
  },
  "application/x-silverlight-app": {
    source: "apache",
    extensions: [
      "xap"
    ]
  },
  "application/x-sql": {
    source: "apache",
    extensions: [
      "sql"
    ]
  },
  "application/x-stuffit": {
    source: "apache",
    compressible: !1,
    extensions: [
      "sit"
    ]
  },
  "application/x-stuffitx": {
    source: "apache",
    extensions: [
      "sitx"
    ]
  },
  "application/x-subrip": {
    source: "apache",
    extensions: [
      "srt"
    ]
  },
  "application/x-sv4cpio": {
    source: "apache",
    extensions: [
      "sv4cpio"
    ]
  },
  "application/x-sv4crc": {
    source: "apache",
    extensions: [
      "sv4crc"
    ]
  },
  "application/x-t3vm-image": {
    source: "apache",
    extensions: [
      "t3"
    ]
  },
  "application/x-tads": {
    source: "apache",
    extensions: [
      "gam"
    ]
  },
  "application/x-tar": {
    source: "apache",
    compressible: !0,
    extensions: [
      "tar"
    ]
  },
  "application/x-tcl": {
    source: "apache",
    extensions: [
      "tcl",
      "tk"
    ]
  },
  "application/x-tex": {
    source: "apache",
    extensions: [
      "tex"
    ]
  },
  "application/x-tex-tfm": {
    source: "apache",
    extensions: [
      "tfm"
    ]
  },
  "application/x-texinfo": {
    source: "apache",
    extensions: [
      "texinfo",
      "texi"
    ]
  },
  "application/x-tgif": {
    source: "apache",
    extensions: [
      "obj"
    ]
  },
  "application/x-ustar": {
    source: "apache",
    extensions: [
      "ustar"
    ]
  },
  "application/x-virtualbox-hdd": {
    compressible: !0,
    extensions: [
      "hdd"
    ]
  },
  "application/x-virtualbox-ova": {
    compressible: !0,
    extensions: [
      "ova"
    ]
  },
  "application/x-virtualbox-ovf": {
    compressible: !0,
    extensions: [
      "ovf"
    ]
  },
  "application/x-virtualbox-vbox": {
    compressible: !0,
    extensions: [
      "vbox"
    ]
  },
  "application/x-virtualbox-vbox-extpack": {
    compressible: !1,
    extensions: [
      "vbox-extpack"
    ]
  },
  "application/x-virtualbox-vdi": {
    compressible: !0,
    extensions: [
      "vdi"
    ]
  },
  "application/x-virtualbox-vhd": {
    compressible: !0,
    extensions: [
      "vhd"
    ]
  },
  "application/x-virtualbox-vmdk": {
    compressible: !0,
    extensions: [
      "vmdk"
    ]
  },
  "application/x-wais-source": {
    source: "apache",
    extensions: [
      "src"
    ]
  },
  "application/x-web-app-manifest+json": {
    compressible: !0,
    extensions: [
      "webapp"
    ]
  },
  "application/x-www-form-urlencoded": {
    source: "iana",
    compressible: !0
  },
  "application/x-x509-ca-cert": {
    source: "iana",
    extensions: [
      "der",
      "crt",
      "pem"
    ]
  },
  "application/x-x509-ca-ra-cert": {
    source: "iana"
  },
  "application/x-x509-next-ca-cert": {
    source: "iana"
  },
  "application/x-xfig": {
    source: "apache",
    extensions: [
      "fig"
    ]
  },
  "application/x-xliff+xml": {
    source: "apache",
    compressible: !0,
    extensions: [
      "xlf"
    ]
  },
  "application/x-xpinstall": {
    source: "apache",
    compressible: !1,
    extensions: [
      "xpi"
    ]
  },
  "application/x-xz": {
    source: "apache",
    extensions: [
      "xz"
    ]
  },
  "application/x-zmachine": {
    source: "apache",
    extensions: [
      "z1",
      "z2",
      "z3",
      "z4",
      "z5",
      "z6",
      "z7",
      "z8"
    ]
  },
  "application/x400-bp": {
    source: "iana"
  },
  "application/xacml+xml": {
    source: "iana",
    compressible: !0
  },
  "application/xaml+xml": {
    source: "apache",
    compressible: !0,
    extensions: [
      "xaml"
    ]
  },
  "application/xcap-att+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "xav"
    ]
  },
  "application/xcap-caps+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "xca"
    ]
  },
  "application/xcap-diff+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "xdf"
    ]
  },
  "application/xcap-el+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "xel"
    ]
  },
  "application/xcap-error+xml": {
    source: "iana",
    compressible: !0
  },
  "application/xcap-ns+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "xns"
    ]
  },
  "application/xcon-conference-info+xml": {
    source: "iana",
    compressible: !0
  },
  "application/xcon-conference-info-diff+xml": {
    source: "iana",
    compressible: !0
  },
  "application/xenc+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "xenc"
    ]
  },
  "application/xhtml+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "xhtml",
      "xht"
    ]
  },
  "application/xhtml-voice+xml": {
    source: "apache",
    compressible: !0
  },
  "application/xliff+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "xlf"
    ]
  },
  "application/xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "xml",
      "xsl",
      "xsd",
      "rng"
    ]
  },
  "application/xml-dtd": {
    source: "iana",
    compressible: !0,
    extensions: [
      "dtd"
    ]
  },
  "application/xml-external-parsed-entity": {
    source: "iana"
  },
  "application/xml-patch+xml": {
    source: "iana",
    compressible: !0
  },
  "application/xmpp+xml": {
    source: "iana",
    compressible: !0
  },
  "application/xop+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "xop"
    ]
  },
  "application/xproc+xml": {
    source: "apache",
    compressible: !0,
    extensions: [
      "xpl"
    ]
  },
  "application/xslt+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "xsl",
      "xslt"
    ]
  },
  "application/xspf+xml": {
    source: "apache",
    compressible: !0,
    extensions: [
      "xspf"
    ]
  },
  "application/xv+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "mxml",
      "xhvml",
      "xvml",
      "xvm"
    ]
  },
  "application/yang": {
    source: "iana",
    extensions: [
      "yang"
    ]
  },
  "application/yang-data+json": {
    source: "iana",
    compressible: !0
  },
  "application/yang-data+xml": {
    source: "iana",
    compressible: !0
  },
  "application/yang-patch+json": {
    source: "iana",
    compressible: !0
  },
  "application/yang-patch+xml": {
    source: "iana",
    compressible: !0
  },
  "application/yin+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "yin"
    ]
  },
  "application/zip": {
    source: "iana",
    compressible: !1,
    extensions: [
      "zip"
    ]
  },
  "application/zlib": {
    source: "iana"
  },
  "application/zstd": {
    source: "iana"
  },
  "audio/1d-interleaved-parityfec": {
    source: "iana"
  },
  "audio/32kadpcm": {
    source: "iana"
  },
  "audio/3gpp": {
    source: "iana",
    compressible: !1,
    extensions: [
      "3gpp"
    ]
  },
  "audio/3gpp2": {
    source: "iana"
  },
  "audio/aac": {
    source: "iana"
  },
  "audio/ac3": {
    source: "iana"
  },
  "audio/adpcm": {
    source: "apache",
    extensions: [
      "adp"
    ]
  },
  "audio/amr": {
    source: "iana",
    extensions: [
      "amr"
    ]
  },
  "audio/amr-wb": {
    source: "iana"
  },
  "audio/amr-wb+": {
    source: "iana"
  },
  "audio/aptx": {
    source: "iana"
  },
  "audio/asc": {
    source: "iana"
  },
  "audio/atrac-advanced-lossless": {
    source: "iana"
  },
  "audio/atrac-x": {
    source: "iana"
  },
  "audio/atrac3": {
    source: "iana"
  },
  "audio/basic": {
    source: "iana",
    compressible: !1,
    extensions: [
      "au",
      "snd"
    ]
  },
  "audio/bv16": {
    source: "iana"
  },
  "audio/bv32": {
    source: "iana"
  },
  "audio/clearmode": {
    source: "iana"
  },
  "audio/cn": {
    source: "iana"
  },
  "audio/dat12": {
    source: "iana"
  },
  "audio/dls": {
    source: "iana"
  },
  "audio/dsr-es201108": {
    source: "iana"
  },
  "audio/dsr-es202050": {
    source: "iana"
  },
  "audio/dsr-es202211": {
    source: "iana"
  },
  "audio/dsr-es202212": {
    source: "iana"
  },
  "audio/dv": {
    source: "iana"
  },
  "audio/dvi4": {
    source: "iana"
  },
  "audio/eac3": {
    source: "iana"
  },
  "audio/encaprtp": {
    source: "iana"
  },
  "audio/evrc": {
    source: "iana"
  },
  "audio/evrc-qcp": {
    source: "iana"
  },
  "audio/evrc0": {
    source: "iana"
  },
  "audio/evrc1": {
    source: "iana"
  },
  "audio/evrcb": {
    source: "iana"
  },
  "audio/evrcb0": {
    source: "iana"
  },
  "audio/evrcb1": {
    source: "iana"
  },
  "audio/evrcnw": {
    source: "iana"
  },
  "audio/evrcnw0": {
    source: "iana"
  },
  "audio/evrcnw1": {
    source: "iana"
  },
  "audio/evrcwb": {
    source: "iana"
  },
  "audio/evrcwb0": {
    source: "iana"
  },
  "audio/evrcwb1": {
    source: "iana"
  },
  "audio/evs": {
    source: "iana"
  },
  "audio/flexfec": {
    source: "iana"
  },
  "audio/fwdred": {
    source: "iana"
  },
  "audio/g711-0": {
    source: "iana"
  },
  "audio/g719": {
    source: "iana"
  },
  "audio/g722": {
    source: "iana"
  },
  "audio/g7221": {
    source: "iana"
  },
  "audio/g723": {
    source: "iana"
  },
  "audio/g726-16": {
    source: "iana"
  },
  "audio/g726-24": {
    source: "iana"
  },
  "audio/g726-32": {
    source: "iana"
  },
  "audio/g726-40": {
    source: "iana"
  },
  "audio/g728": {
    source: "iana"
  },
  "audio/g729": {
    source: "iana"
  },
  "audio/g7291": {
    source: "iana"
  },
  "audio/g729d": {
    source: "iana"
  },
  "audio/g729e": {
    source: "iana"
  },
  "audio/gsm": {
    source: "iana"
  },
  "audio/gsm-efr": {
    source: "iana"
  },
  "audio/gsm-hr-08": {
    source: "iana"
  },
  "audio/ilbc": {
    source: "iana"
  },
  "audio/ip-mr_v2.5": {
    source: "iana"
  },
  "audio/isac": {
    source: "apache"
  },
  "audio/l16": {
    source: "iana"
  },
  "audio/l20": {
    source: "iana"
  },
  "audio/l24": {
    source: "iana",
    compressible: !1
  },
  "audio/l8": {
    source: "iana"
  },
  "audio/lpc": {
    source: "iana"
  },
  "audio/melp": {
    source: "iana"
  },
  "audio/melp1200": {
    source: "iana"
  },
  "audio/melp2400": {
    source: "iana"
  },
  "audio/melp600": {
    source: "iana"
  },
  "audio/mhas": {
    source: "iana"
  },
  "audio/midi": {
    source: "apache",
    extensions: [
      "mid",
      "midi",
      "kar",
      "rmi"
    ]
  },
  "audio/mobile-xmf": {
    source: "iana",
    extensions: [
      "mxmf"
    ]
  },
  "audio/mp3": {
    compressible: !1,
    extensions: [
      "mp3"
    ]
  },
  "audio/mp4": {
    source: "iana",
    compressible: !1,
    extensions: [
      "m4a",
      "mp4a"
    ]
  },
  "audio/mp4a-latm": {
    source: "iana"
  },
  "audio/mpa": {
    source: "iana"
  },
  "audio/mpa-robust": {
    source: "iana"
  },
  "audio/mpeg": {
    source: "iana",
    compressible: !1,
    extensions: [
      "mpga",
      "mp2",
      "mp2a",
      "mp3",
      "m2a",
      "m3a"
    ]
  },
  "audio/mpeg4-generic": {
    source: "iana"
  },
  "audio/musepack": {
    source: "apache"
  },
  "audio/ogg": {
    source: "iana",
    compressible: !1,
    extensions: [
      "oga",
      "ogg",
      "spx",
      "opus"
    ]
  },
  "audio/opus": {
    source: "iana"
  },
  "audio/parityfec": {
    source: "iana"
  },
  "audio/pcma": {
    source: "iana"
  },
  "audio/pcma-wb": {
    source: "iana"
  },
  "audio/pcmu": {
    source: "iana"
  },
  "audio/pcmu-wb": {
    source: "iana"
  },
  "audio/prs.sid": {
    source: "iana"
  },
  "audio/qcelp": {
    source: "iana"
  },
  "audio/raptorfec": {
    source: "iana"
  },
  "audio/red": {
    source: "iana"
  },
  "audio/rtp-enc-aescm128": {
    source: "iana"
  },
  "audio/rtp-midi": {
    source: "iana"
  },
  "audio/rtploopback": {
    source: "iana"
  },
  "audio/rtx": {
    source: "iana"
  },
  "audio/s3m": {
    source: "apache",
    extensions: [
      "s3m"
    ]
  },
  "audio/scip": {
    source: "iana"
  },
  "audio/silk": {
    source: "apache",
    extensions: [
      "sil"
    ]
  },
  "audio/smv": {
    source: "iana"
  },
  "audio/smv-qcp": {
    source: "iana"
  },
  "audio/smv0": {
    source: "iana"
  },
  "audio/sofa": {
    source: "iana"
  },
  "audio/sp-midi": {
    source: "iana"
  },
  "audio/speex": {
    source: "iana"
  },
  "audio/t140c": {
    source: "iana"
  },
  "audio/t38": {
    source: "iana"
  },
  "audio/telephone-event": {
    source: "iana"
  },
  "audio/tetra_acelp": {
    source: "iana"
  },
  "audio/tetra_acelp_bb": {
    source: "iana"
  },
  "audio/tone": {
    source: "iana"
  },
  "audio/tsvcis": {
    source: "iana"
  },
  "audio/uemclip": {
    source: "iana"
  },
  "audio/ulpfec": {
    source: "iana"
  },
  "audio/usac": {
    source: "iana"
  },
  "audio/vdvi": {
    source: "iana"
  },
  "audio/vmr-wb": {
    source: "iana"
  },
  "audio/vnd.3gpp.iufp": {
    source: "iana"
  },
  "audio/vnd.4sb": {
    source: "iana"
  },
  "audio/vnd.audiokoz": {
    source: "iana"
  },
  "audio/vnd.celp": {
    source: "iana"
  },
  "audio/vnd.cisco.nse": {
    source: "iana"
  },
  "audio/vnd.cmles.radio-events": {
    source: "iana"
  },
  "audio/vnd.cns.anp1": {
    source: "iana"
  },
  "audio/vnd.cns.inf1": {
    source: "iana"
  },
  "audio/vnd.dece.audio": {
    source: "iana",
    extensions: [
      "uva",
      "uvva"
    ]
  },
  "audio/vnd.digital-winds": {
    source: "iana",
    extensions: [
      "eol"
    ]
  },
  "audio/vnd.dlna.adts": {
    source: "iana"
  },
  "audio/vnd.dolby.heaac.1": {
    source: "iana"
  },
  "audio/vnd.dolby.heaac.2": {
    source: "iana"
  },
  "audio/vnd.dolby.mlp": {
    source: "iana"
  },
  "audio/vnd.dolby.mps": {
    source: "iana"
  },
  "audio/vnd.dolby.pl2": {
    source: "iana"
  },
  "audio/vnd.dolby.pl2x": {
    source: "iana"
  },
  "audio/vnd.dolby.pl2z": {
    source: "iana"
  },
  "audio/vnd.dolby.pulse.1": {
    source: "iana"
  },
  "audio/vnd.dra": {
    source: "iana",
    extensions: [
      "dra"
    ]
  },
  "audio/vnd.dts": {
    source: "iana",
    extensions: [
      "dts"
    ]
  },
  "audio/vnd.dts.hd": {
    source: "iana",
    extensions: [
      "dtshd"
    ]
  },
  "audio/vnd.dts.uhd": {
    source: "iana"
  },
  "audio/vnd.dvb.file": {
    source: "iana"
  },
  "audio/vnd.everad.plj": {
    source: "iana"
  },
  "audio/vnd.hns.audio": {
    source: "iana"
  },
  "audio/vnd.lucent.voice": {
    source: "iana",
    extensions: [
      "lvp"
    ]
  },
  "audio/vnd.ms-playready.media.pya": {
    source: "iana",
    extensions: [
      "pya"
    ]
  },
  "audio/vnd.nokia.mobile-xmf": {
    source: "iana"
  },
  "audio/vnd.nortel.vbk": {
    source: "iana"
  },
  "audio/vnd.nuera.ecelp4800": {
    source: "iana",
    extensions: [
      "ecelp4800"
    ]
  },
  "audio/vnd.nuera.ecelp7470": {
    source: "iana",
    extensions: [
      "ecelp7470"
    ]
  },
  "audio/vnd.nuera.ecelp9600": {
    source: "iana",
    extensions: [
      "ecelp9600"
    ]
  },
  "audio/vnd.octel.sbc": {
    source: "iana"
  },
  "audio/vnd.presonus.multitrack": {
    source: "iana"
  },
  "audio/vnd.qcelp": {
    source: "iana"
  },
  "audio/vnd.rhetorex.32kadpcm": {
    source: "iana"
  },
  "audio/vnd.rip": {
    source: "iana",
    extensions: [
      "rip"
    ]
  },
  "audio/vnd.rn-realaudio": {
    compressible: !1
  },
  "audio/vnd.sealedmedia.softseal.mpeg": {
    source: "iana"
  },
  "audio/vnd.vmx.cvsd": {
    source: "iana"
  },
  "audio/vnd.wave": {
    compressible: !1
  },
  "audio/vorbis": {
    source: "iana",
    compressible: !1
  },
  "audio/vorbis-config": {
    source: "iana"
  },
  "audio/wav": {
    compressible: !1,
    extensions: [
      "wav"
    ]
  },
  "audio/wave": {
    compressible: !1,
    extensions: [
      "wav"
    ]
  },
  "audio/webm": {
    source: "apache",
    compressible: !1,
    extensions: [
      "weba"
    ]
  },
  "audio/x-aac": {
    source: "apache",
    compressible: !1,
    extensions: [
      "aac"
    ]
  },
  "audio/x-aiff": {
    source: "apache",
    extensions: [
      "aif",
      "aiff",
      "aifc"
    ]
  },
  "audio/x-caf": {
    source: "apache",
    compressible: !1,
    extensions: [
      "caf"
    ]
  },
  "audio/x-flac": {
    source: "apache",
    extensions: [
      "flac"
    ]
  },
  "audio/x-m4a": {
    source: "nginx",
    extensions: [
      "m4a"
    ]
  },
  "audio/x-matroska": {
    source: "apache",
    extensions: [
      "mka"
    ]
  },
  "audio/x-mpegurl": {
    source: "apache",
    extensions: [
      "m3u"
    ]
  },
  "audio/x-ms-wax": {
    source: "apache",
    extensions: [
      "wax"
    ]
  },
  "audio/x-ms-wma": {
    source: "apache",
    extensions: [
      "wma"
    ]
  },
  "audio/x-pn-realaudio": {
    source: "apache",
    extensions: [
      "ram",
      "ra"
    ]
  },
  "audio/x-pn-realaudio-plugin": {
    source: "apache",
    extensions: [
      "rmp"
    ]
  },
  "audio/x-realaudio": {
    source: "nginx",
    extensions: [
      "ra"
    ]
  },
  "audio/x-tta": {
    source: "apache"
  },
  "audio/x-wav": {
    source: "apache",
    extensions: [
      "wav"
    ]
  },
  "audio/xm": {
    source: "apache",
    extensions: [
      "xm"
    ]
  },
  "chemical/x-cdx": {
    source: "apache",
    extensions: [
      "cdx"
    ]
  },
  "chemical/x-cif": {
    source: "apache",
    extensions: [
      "cif"
    ]
  },
  "chemical/x-cmdf": {
    source: "apache",
    extensions: [
      "cmdf"
    ]
  },
  "chemical/x-cml": {
    source: "apache",
    extensions: [
      "cml"
    ]
  },
  "chemical/x-csml": {
    source: "apache",
    extensions: [
      "csml"
    ]
  },
  "chemical/x-pdb": {
    source: "apache"
  },
  "chemical/x-xyz": {
    source: "apache",
    extensions: [
      "xyz"
    ]
  },
  "font/collection": {
    source: "iana",
    extensions: [
      "ttc"
    ]
  },
  "font/otf": {
    source: "iana",
    compressible: !0,
    extensions: [
      "otf"
    ]
  },
  "font/sfnt": {
    source: "iana"
  },
  "font/ttf": {
    source: "iana",
    compressible: !0,
    extensions: [
      "ttf"
    ]
  },
  "font/woff": {
    source: "iana",
    extensions: [
      "woff"
    ]
  },
  "font/woff2": {
    source: "iana",
    extensions: [
      "woff2"
    ]
  },
  "image/aces": {
    source: "iana",
    extensions: [
      "exr"
    ]
  },
  "image/apng": {
    compressible: !1,
    extensions: [
      "apng"
    ]
  },
  "image/avci": {
    source: "iana",
    extensions: [
      "avci"
    ]
  },
  "image/avcs": {
    source: "iana",
    extensions: [
      "avcs"
    ]
  },
  "image/avif": {
    source: "iana",
    compressible: !1,
    extensions: [
      "avif"
    ]
  },
  "image/bmp": {
    source: "iana",
    compressible: !0,
    extensions: [
      "bmp"
    ]
  },
  "image/cgm": {
    source: "iana",
    extensions: [
      "cgm"
    ]
  },
  "image/dicom-rle": {
    source: "iana",
    extensions: [
      "drle"
    ]
  },
  "image/emf": {
    source: "iana",
    extensions: [
      "emf"
    ]
  },
  "image/fits": {
    source: "iana",
    extensions: [
      "fits"
    ]
  },
  "image/g3fax": {
    source: "iana",
    extensions: [
      "g3"
    ]
  },
  "image/gif": {
    source: "iana",
    compressible: !1,
    extensions: [
      "gif"
    ]
  },
  "image/heic": {
    source: "iana",
    extensions: [
      "heic"
    ]
  },
  "image/heic-sequence": {
    source: "iana",
    extensions: [
      "heics"
    ]
  },
  "image/heif": {
    source: "iana",
    extensions: [
      "heif"
    ]
  },
  "image/heif-sequence": {
    source: "iana",
    extensions: [
      "heifs"
    ]
  },
  "image/hej2k": {
    source: "iana",
    extensions: [
      "hej2"
    ]
  },
  "image/hsj2": {
    source: "iana",
    extensions: [
      "hsj2"
    ]
  },
  "image/ief": {
    source: "iana",
    extensions: [
      "ief"
    ]
  },
  "image/jls": {
    source: "iana",
    extensions: [
      "jls"
    ]
  },
  "image/jp2": {
    source: "iana",
    compressible: !1,
    extensions: [
      "jp2",
      "jpg2"
    ]
  },
  "image/jpeg": {
    source: "iana",
    compressible: !1,
    extensions: [
      "jpeg",
      "jpg",
      "jpe"
    ]
  },
  "image/jph": {
    source: "iana",
    extensions: [
      "jph"
    ]
  },
  "image/jphc": {
    source: "iana",
    extensions: [
      "jhc"
    ]
  },
  "image/jpm": {
    source: "iana",
    compressible: !1,
    extensions: [
      "jpm"
    ]
  },
  "image/jpx": {
    source: "iana",
    compressible: !1,
    extensions: [
      "jpx",
      "jpf"
    ]
  },
  "image/jxr": {
    source: "iana",
    extensions: [
      "jxr"
    ]
  },
  "image/jxra": {
    source: "iana",
    extensions: [
      "jxra"
    ]
  },
  "image/jxrs": {
    source: "iana",
    extensions: [
      "jxrs"
    ]
  },
  "image/jxs": {
    source: "iana",
    extensions: [
      "jxs"
    ]
  },
  "image/jxsc": {
    source: "iana",
    extensions: [
      "jxsc"
    ]
  },
  "image/jxsi": {
    source: "iana",
    extensions: [
      "jxsi"
    ]
  },
  "image/jxss": {
    source: "iana",
    extensions: [
      "jxss"
    ]
  },
  "image/ktx": {
    source: "iana",
    extensions: [
      "ktx"
    ]
  },
  "image/ktx2": {
    source: "iana",
    extensions: [
      "ktx2"
    ]
  },
  "image/naplps": {
    source: "iana"
  },
  "image/pjpeg": {
    compressible: !1
  },
  "image/png": {
    source: "iana",
    compressible: !1,
    extensions: [
      "png"
    ]
  },
  "image/prs.btif": {
    source: "iana",
    extensions: [
      "btif"
    ]
  },
  "image/prs.pti": {
    source: "iana",
    extensions: [
      "pti"
    ]
  },
  "image/pwg-raster": {
    source: "iana"
  },
  "image/sgi": {
    source: "apache",
    extensions: [
      "sgi"
    ]
  },
  "image/svg+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "svg",
      "svgz"
    ]
  },
  "image/t38": {
    source: "iana",
    extensions: [
      "t38"
    ]
  },
  "image/tiff": {
    source: "iana",
    compressible: !1,
    extensions: [
      "tif",
      "tiff"
    ]
  },
  "image/tiff-fx": {
    source: "iana",
    extensions: [
      "tfx"
    ]
  },
  "image/vnd.adobe.photoshop": {
    source: "iana",
    compressible: !0,
    extensions: [
      "psd"
    ]
  },
  "image/vnd.airzip.accelerator.azv": {
    source: "iana",
    extensions: [
      "azv"
    ]
  },
  "image/vnd.cns.inf2": {
    source: "iana"
  },
  "image/vnd.dece.graphic": {
    source: "iana",
    extensions: [
      "uvi",
      "uvvi",
      "uvg",
      "uvvg"
    ]
  },
  "image/vnd.djvu": {
    source: "iana",
    extensions: [
      "djvu",
      "djv"
    ]
  },
  "image/vnd.dvb.subtitle": {
    source: "iana",
    extensions: [
      "sub"
    ]
  },
  "image/vnd.dwg": {
    source: "iana",
    extensions: [
      "dwg"
    ]
  },
  "image/vnd.dxf": {
    source: "iana",
    extensions: [
      "dxf"
    ]
  },
  "image/vnd.fastbidsheet": {
    source: "iana",
    extensions: [
      "fbs"
    ]
  },
  "image/vnd.fpx": {
    source: "iana",
    extensions: [
      "fpx"
    ]
  },
  "image/vnd.fst": {
    source: "iana",
    extensions: [
      "fst"
    ]
  },
  "image/vnd.fujixerox.edmics-mmr": {
    source: "iana",
    extensions: [
      "mmr"
    ]
  },
  "image/vnd.fujixerox.edmics-rlc": {
    source: "iana",
    extensions: [
      "rlc"
    ]
  },
  "image/vnd.globalgraphics.pgb": {
    source: "iana"
  },
  "image/vnd.microsoft.icon": {
    source: "iana",
    compressible: !0,
    extensions: [
      "ico"
    ]
  },
  "image/vnd.mix": {
    source: "iana"
  },
  "image/vnd.mozilla.apng": {
    source: "iana"
  },
  "image/vnd.ms-dds": {
    compressible: !0,
    extensions: [
      "dds"
    ]
  },
  "image/vnd.ms-modi": {
    source: "iana",
    extensions: [
      "mdi"
    ]
  },
  "image/vnd.ms-photo": {
    source: "apache",
    extensions: [
      "wdp"
    ]
  },
  "image/vnd.net-fpx": {
    source: "iana",
    extensions: [
      "npx"
    ]
  },
  "image/vnd.pco.b16": {
    source: "iana",
    extensions: [
      "b16"
    ]
  },
  "image/vnd.radiance": {
    source: "iana"
  },
  "image/vnd.sealed.png": {
    source: "iana"
  },
  "image/vnd.sealedmedia.softseal.gif": {
    source: "iana"
  },
  "image/vnd.sealedmedia.softseal.jpg": {
    source: "iana"
  },
  "image/vnd.svf": {
    source: "iana"
  },
  "image/vnd.tencent.tap": {
    source: "iana",
    extensions: [
      "tap"
    ]
  },
  "image/vnd.valve.source.texture": {
    source: "iana",
    extensions: [
      "vtf"
    ]
  },
  "image/vnd.wap.wbmp": {
    source: "iana",
    extensions: [
      "wbmp"
    ]
  },
  "image/vnd.xiff": {
    source: "iana",
    extensions: [
      "xif"
    ]
  },
  "image/vnd.zbrush.pcx": {
    source: "iana",
    extensions: [
      "pcx"
    ]
  },
  "image/webp": {
    source: "apache",
    extensions: [
      "webp"
    ]
  },
  "image/wmf": {
    source: "iana",
    extensions: [
      "wmf"
    ]
  },
  "image/x-3ds": {
    source: "apache",
    extensions: [
      "3ds"
    ]
  },
  "image/x-cmu-raster": {
    source: "apache",
    extensions: [
      "ras"
    ]
  },
  "image/x-cmx": {
    source: "apache",
    extensions: [
      "cmx"
    ]
  },
  "image/x-freehand": {
    source: "apache",
    extensions: [
      "fh",
      "fhc",
      "fh4",
      "fh5",
      "fh7"
    ]
  },
  "image/x-icon": {
    source: "apache",
    compressible: !0,
    extensions: [
      "ico"
    ]
  },
  "image/x-jng": {
    source: "nginx",
    extensions: [
      "jng"
    ]
  },
  "image/x-mrsid-image": {
    source: "apache",
    extensions: [
      "sid"
    ]
  },
  "image/x-ms-bmp": {
    source: "nginx",
    compressible: !0,
    extensions: [
      "bmp"
    ]
  },
  "image/x-pcx": {
    source: "apache",
    extensions: [
      "pcx"
    ]
  },
  "image/x-pict": {
    source: "apache",
    extensions: [
      "pic",
      "pct"
    ]
  },
  "image/x-portable-anymap": {
    source: "apache",
    extensions: [
      "pnm"
    ]
  },
  "image/x-portable-bitmap": {
    source: "apache",
    extensions: [
      "pbm"
    ]
  },
  "image/x-portable-graymap": {
    source: "apache",
    extensions: [
      "pgm"
    ]
  },
  "image/x-portable-pixmap": {
    source: "apache",
    extensions: [
      "ppm"
    ]
  },
  "image/x-rgb": {
    source: "apache",
    extensions: [
      "rgb"
    ]
  },
  "image/x-tga": {
    source: "apache",
    extensions: [
      "tga"
    ]
  },
  "image/x-xbitmap": {
    source: "apache",
    extensions: [
      "xbm"
    ]
  },
  "image/x-xcf": {
    compressible: !1
  },
  "image/x-xpixmap": {
    source: "apache",
    extensions: [
      "xpm"
    ]
  },
  "image/x-xwindowdump": {
    source: "apache",
    extensions: [
      "xwd"
    ]
  },
  "message/cpim": {
    source: "iana"
  },
  "message/delivery-status": {
    source: "iana"
  },
  "message/disposition-notification": {
    source: "iana",
    extensions: [
      "disposition-notification"
    ]
  },
  "message/external-body": {
    source: "iana"
  },
  "message/feedback-report": {
    source: "iana"
  },
  "message/global": {
    source: "iana",
    extensions: [
      "u8msg"
    ]
  },
  "message/global-delivery-status": {
    source: "iana",
    extensions: [
      "u8dsn"
    ]
  },
  "message/global-disposition-notification": {
    source: "iana",
    extensions: [
      "u8mdn"
    ]
  },
  "message/global-headers": {
    source: "iana",
    extensions: [
      "u8hdr"
    ]
  },
  "message/http": {
    source: "iana",
    compressible: !1
  },
  "message/imdn+xml": {
    source: "iana",
    compressible: !0
  },
  "message/news": {
    source: "iana"
  },
  "message/partial": {
    source: "iana",
    compressible: !1
  },
  "message/rfc822": {
    source: "iana",
    compressible: !0,
    extensions: [
      "eml",
      "mime"
    ]
  },
  "message/s-http": {
    source: "iana"
  },
  "message/sip": {
    source: "iana"
  },
  "message/sipfrag": {
    source: "iana"
  },
  "message/tracking-status": {
    source: "iana"
  },
  "message/vnd.si.simp": {
    source: "iana"
  },
  "message/vnd.wfa.wsc": {
    source: "iana",
    extensions: [
      "wsc"
    ]
  },
  "model/3mf": {
    source: "iana",
    extensions: [
      "3mf"
    ]
  },
  "model/e57": {
    source: "iana"
  },
  "model/gltf+json": {
    source: "iana",
    compressible: !0,
    extensions: [
      "gltf"
    ]
  },
  "model/gltf-binary": {
    source: "iana",
    compressible: !0,
    extensions: [
      "glb"
    ]
  },
  "model/iges": {
    source: "iana",
    compressible: !1,
    extensions: [
      "igs",
      "iges"
    ]
  },
  "model/mesh": {
    source: "iana",
    compressible: !1,
    extensions: [
      "msh",
      "mesh",
      "silo"
    ]
  },
  "model/mtl": {
    source: "iana",
    extensions: [
      "mtl"
    ]
  },
  "model/obj": {
    source: "iana",
    extensions: [
      "obj"
    ]
  },
  "model/step": {
    source: "iana"
  },
  "model/step+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "stpx"
    ]
  },
  "model/step+zip": {
    source: "iana",
    compressible: !1,
    extensions: [
      "stpz"
    ]
  },
  "model/step-xml+zip": {
    source: "iana",
    compressible: !1,
    extensions: [
      "stpxz"
    ]
  },
  "model/stl": {
    source: "iana",
    extensions: [
      "stl"
    ]
  },
  "model/vnd.collada+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "dae"
    ]
  },
  "model/vnd.dwf": {
    source: "iana",
    extensions: [
      "dwf"
    ]
  },
  "model/vnd.flatland.3dml": {
    source: "iana"
  },
  "model/vnd.gdl": {
    source: "iana",
    extensions: [
      "gdl"
    ]
  },
  "model/vnd.gs-gdl": {
    source: "apache"
  },
  "model/vnd.gs.gdl": {
    source: "iana"
  },
  "model/vnd.gtw": {
    source: "iana",
    extensions: [
      "gtw"
    ]
  },
  "model/vnd.moml+xml": {
    source: "iana",
    compressible: !0
  },
  "model/vnd.mts": {
    source: "iana",
    extensions: [
      "mts"
    ]
  },
  "model/vnd.opengex": {
    source: "iana",
    extensions: [
      "ogex"
    ]
  },
  "model/vnd.parasolid.transmit.binary": {
    source: "iana",
    extensions: [
      "x_b"
    ]
  },
  "model/vnd.parasolid.transmit.text": {
    source: "iana",
    extensions: [
      "x_t"
    ]
  },
  "model/vnd.pytha.pyox": {
    source: "iana"
  },
  "model/vnd.rosette.annotated-data-model": {
    source: "iana"
  },
  "model/vnd.sap.vds": {
    source: "iana",
    extensions: [
      "vds"
    ]
  },
  "model/vnd.usdz+zip": {
    source: "iana",
    compressible: !1,
    extensions: [
      "usdz"
    ]
  },
  "model/vnd.valve.source.compiled-map": {
    source: "iana",
    extensions: [
      "bsp"
    ]
  },
  "model/vnd.vtu": {
    source: "iana",
    extensions: [
      "vtu"
    ]
  },
  "model/vrml": {
    source: "iana",
    compressible: !1,
    extensions: [
      "wrl",
      "vrml"
    ]
  },
  "model/x3d+binary": {
    source: "apache",
    compressible: !1,
    extensions: [
      "x3db",
      "x3dbz"
    ]
  },
  "model/x3d+fastinfoset": {
    source: "iana",
    extensions: [
      "x3db"
    ]
  },
  "model/x3d+vrml": {
    source: "apache",
    compressible: !1,
    extensions: [
      "x3dv",
      "x3dvz"
    ]
  },
  "model/x3d+xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "x3d",
      "x3dz"
    ]
  },
  "model/x3d-vrml": {
    source: "iana",
    extensions: [
      "x3dv"
    ]
  },
  "multipart/alternative": {
    source: "iana",
    compressible: !1
  },
  "multipart/appledouble": {
    source: "iana"
  },
  "multipart/byteranges": {
    source: "iana"
  },
  "multipart/digest": {
    source: "iana"
  },
  "multipart/encrypted": {
    source: "iana",
    compressible: !1
  },
  "multipart/form-data": {
    source: "iana",
    compressible: !1
  },
  "multipart/header-set": {
    source: "iana"
  },
  "multipart/mixed": {
    source: "iana"
  },
  "multipart/multilingual": {
    source: "iana"
  },
  "multipart/parallel": {
    source: "iana"
  },
  "multipart/related": {
    source: "iana",
    compressible: !1
  },
  "multipart/report": {
    source: "iana"
  },
  "multipart/signed": {
    source: "iana",
    compressible: !1
  },
  "multipart/vnd.bint.med-plus": {
    source: "iana"
  },
  "multipart/voice-message": {
    source: "iana"
  },
  "multipart/x-mixed-replace": {
    source: "iana"
  },
  "text/1d-interleaved-parityfec": {
    source: "iana"
  },
  "text/cache-manifest": {
    source: "iana",
    compressible: !0,
    extensions: [
      "appcache",
      "manifest"
    ]
  },
  "text/calendar": {
    source: "iana",
    extensions: [
      "ics",
      "ifb"
    ]
  },
  "text/calender": {
    compressible: !0
  },
  "text/cmd": {
    compressible: !0
  },
  "text/coffeescript": {
    extensions: [
      "coffee",
      "litcoffee"
    ]
  },
  "text/cql": {
    source: "iana"
  },
  "text/cql-expression": {
    source: "iana"
  },
  "text/cql-identifier": {
    source: "iana"
  },
  "text/css": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0,
    extensions: [
      "css"
    ]
  },
  "text/csv": {
    source: "iana",
    compressible: !0,
    extensions: [
      "csv"
    ]
  },
  "text/csv-schema": {
    source: "iana"
  },
  "text/directory": {
    source: "iana"
  },
  "text/dns": {
    source: "iana"
  },
  "text/ecmascript": {
    source: "iana"
  },
  "text/encaprtp": {
    source: "iana"
  },
  "text/enriched": {
    source: "iana"
  },
  "text/fhirpath": {
    source: "iana"
  },
  "text/flexfec": {
    source: "iana"
  },
  "text/fwdred": {
    source: "iana"
  },
  "text/gff3": {
    source: "iana"
  },
  "text/grammar-ref-list": {
    source: "iana"
  },
  "text/html": {
    source: "iana",
    compressible: !0,
    extensions: [
      "html",
      "htm",
      "shtml"
    ]
  },
  "text/jade": {
    extensions: [
      "jade"
    ]
  },
  "text/javascript": {
    source: "iana",
    compressible: !0
  },
  "text/jcr-cnd": {
    source: "iana"
  },
  "text/jsx": {
    compressible: !0,
    extensions: [
      "jsx"
    ]
  },
  "text/less": {
    compressible: !0,
    extensions: [
      "less"
    ]
  },
  "text/markdown": {
    source: "iana",
    compressible: !0,
    extensions: [
      "markdown",
      "md"
    ]
  },
  "text/mathml": {
    source: "nginx",
    extensions: [
      "mml"
    ]
  },
  "text/mdx": {
    compressible: !0,
    extensions: [
      "mdx"
    ]
  },
  "text/mizar": {
    source: "iana"
  },
  "text/n3": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0,
    extensions: [
      "n3"
    ]
  },
  "text/parameters": {
    source: "iana",
    charset: "UTF-8"
  },
  "text/parityfec": {
    source: "iana"
  },
  "text/plain": {
    source: "iana",
    compressible: !0,
    extensions: [
      "txt",
      "text",
      "conf",
      "def",
      "list",
      "log",
      "in",
      "ini"
    ]
  },
  "text/provenance-notation": {
    source: "iana",
    charset: "UTF-8"
  },
  "text/prs.fallenstein.rst": {
    source: "iana"
  },
  "text/prs.lines.tag": {
    source: "iana",
    extensions: [
      "dsc"
    ]
  },
  "text/prs.prop.logic": {
    source: "iana"
  },
  "text/raptorfec": {
    source: "iana"
  },
  "text/red": {
    source: "iana"
  },
  "text/rfc822-headers": {
    source: "iana"
  },
  "text/richtext": {
    source: "iana",
    compressible: !0,
    extensions: [
      "rtx"
    ]
  },
  "text/rtf": {
    source: "iana",
    compressible: !0,
    extensions: [
      "rtf"
    ]
  },
  "text/rtp-enc-aescm128": {
    source: "iana"
  },
  "text/rtploopback": {
    source: "iana"
  },
  "text/rtx": {
    source: "iana"
  },
  "text/sgml": {
    source: "iana",
    extensions: [
      "sgml",
      "sgm"
    ]
  },
  "text/shaclc": {
    source: "iana"
  },
  "text/shex": {
    source: "iana",
    extensions: [
      "shex"
    ]
  },
  "text/slim": {
    extensions: [
      "slim",
      "slm"
    ]
  },
  "text/spdx": {
    source: "iana",
    extensions: [
      "spdx"
    ]
  },
  "text/strings": {
    source: "iana"
  },
  "text/stylus": {
    extensions: [
      "stylus",
      "styl"
    ]
  },
  "text/t140": {
    source: "iana"
  },
  "text/tab-separated-values": {
    source: "iana",
    compressible: !0,
    extensions: [
      "tsv"
    ]
  },
  "text/troff": {
    source: "iana",
    extensions: [
      "t",
      "tr",
      "roff",
      "man",
      "me",
      "ms"
    ]
  },
  "text/turtle": {
    source: "iana",
    charset: "UTF-8",
    extensions: [
      "ttl"
    ]
  },
  "text/ulpfec": {
    source: "iana"
  },
  "text/uri-list": {
    source: "iana",
    compressible: !0,
    extensions: [
      "uri",
      "uris",
      "urls"
    ]
  },
  "text/vcard": {
    source: "iana",
    compressible: !0,
    extensions: [
      "vcard"
    ]
  },
  "text/vnd.a": {
    source: "iana"
  },
  "text/vnd.abc": {
    source: "iana"
  },
  "text/vnd.ascii-art": {
    source: "iana"
  },
  "text/vnd.curl": {
    source: "iana",
    extensions: [
      "curl"
    ]
  },
  "text/vnd.curl.dcurl": {
    source: "apache",
    extensions: [
      "dcurl"
    ]
  },
  "text/vnd.curl.mcurl": {
    source: "apache",
    extensions: [
      "mcurl"
    ]
  },
  "text/vnd.curl.scurl": {
    source: "apache",
    extensions: [
      "scurl"
    ]
  },
  "text/vnd.debian.copyright": {
    source: "iana",
    charset: "UTF-8"
  },
  "text/vnd.dmclientscript": {
    source: "iana"
  },
  "text/vnd.dvb.subtitle": {
    source: "iana",
    extensions: [
      "sub"
    ]
  },
  "text/vnd.esmertec.theme-descriptor": {
    source: "iana",
    charset: "UTF-8"
  },
  "text/vnd.familysearch.gedcom": {
    source: "iana",
    extensions: [
      "ged"
    ]
  },
  "text/vnd.ficlab.flt": {
    source: "iana"
  },
  "text/vnd.fly": {
    source: "iana",
    extensions: [
      "fly"
    ]
  },
  "text/vnd.fmi.flexstor": {
    source: "iana",
    extensions: [
      "flx"
    ]
  },
  "text/vnd.gml": {
    source: "iana"
  },
  "text/vnd.graphviz": {
    source: "iana",
    extensions: [
      "gv"
    ]
  },
  "text/vnd.hans": {
    source: "iana"
  },
  "text/vnd.hgl": {
    source: "iana"
  },
  "text/vnd.in3d.3dml": {
    source: "iana",
    extensions: [
      "3dml"
    ]
  },
  "text/vnd.in3d.spot": {
    source: "iana",
    extensions: [
      "spot"
    ]
  },
  "text/vnd.iptc.newsml": {
    source: "iana"
  },
  "text/vnd.iptc.nitf": {
    source: "iana"
  },
  "text/vnd.latex-z": {
    source: "iana"
  },
  "text/vnd.motorola.reflex": {
    source: "iana"
  },
  "text/vnd.ms-mediapackage": {
    source: "iana"
  },
  "text/vnd.net2phone.commcenter.command": {
    source: "iana"
  },
  "text/vnd.radisys.msml-basic-layout": {
    source: "iana"
  },
  "text/vnd.senx.warpscript": {
    source: "iana"
  },
  "text/vnd.si.uricatalogue": {
    source: "iana"
  },
  "text/vnd.sosi": {
    source: "iana"
  },
  "text/vnd.sun.j2me.app-descriptor": {
    source: "iana",
    charset: "UTF-8",
    extensions: [
      "jad"
    ]
  },
  "text/vnd.trolltech.linguist": {
    source: "iana",
    charset: "UTF-8"
  },
  "text/vnd.wap.si": {
    source: "iana"
  },
  "text/vnd.wap.sl": {
    source: "iana"
  },
  "text/vnd.wap.wml": {
    source: "iana",
    extensions: [
      "wml"
    ]
  },
  "text/vnd.wap.wmlscript": {
    source: "iana",
    extensions: [
      "wmls"
    ]
  },
  "text/vtt": {
    source: "iana",
    charset: "UTF-8",
    compressible: !0,
    extensions: [
      "vtt"
    ]
  },
  "text/x-asm": {
    source: "apache",
    extensions: [
      "s",
      "asm"
    ]
  },
  "text/x-c": {
    source: "apache",
    extensions: [
      "c",
      "cc",
      "cxx",
      "cpp",
      "h",
      "hh",
      "dic"
    ]
  },
  "text/x-component": {
    source: "nginx",
    extensions: [
      "htc"
    ]
  },
  "text/x-fortran": {
    source: "apache",
    extensions: [
      "f",
      "for",
      "f77",
      "f90"
    ]
  },
  "text/x-gwt-rpc": {
    compressible: !0
  },
  "text/x-handlebars-template": {
    extensions: [
      "hbs"
    ]
  },
  "text/x-java-source": {
    source: "apache",
    extensions: [
      "java"
    ]
  },
  "text/x-jquery-tmpl": {
    compressible: !0
  },
  "text/x-lua": {
    extensions: [
      "lua"
    ]
  },
  "text/x-markdown": {
    compressible: !0,
    extensions: [
      "mkd"
    ]
  },
  "text/x-nfo": {
    source: "apache",
    extensions: [
      "nfo"
    ]
  },
  "text/x-opml": {
    source: "apache",
    extensions: [
      "opml"
    ]
  },
  "text/x-org": {
    compressible: !0,
    extensions: [
      "org"
    ]
  },
  "text/x-pascal": {
    source: "apache",
    extensions: [
      "p",
      "pas"
    ]
  },
  "text/x-processing": {
    compressible: !0,
    extensions: [
      "pde"
    ]
  },
  "text/x-sass": {
    extensions: [
      "sass"
    ]
  },
  "text/x-scss": {
    extensions: [
      "scss"
    ]
  },
  "text/x-setext": {
    source: "apache",
    extensions: [
      "etx"
    ]
  },
  "text/x-sfv": {
    source: "apache",
    extensions: [
      "sfv"
    ]
  },
  "text/x-suse-ymp": {
    compressible: !0,
    extensions: [
      "ymp"
    ]
  },
  "text/x-uuencode": {
    source: "apache",
    extensions: [
      "uu"
    ]
  },
  "text/x-vcalendar": {
    source: "apache",
    extensions: [
      "vcs"
    ]
  },
  "text/x-vcard": {
    source: "apache",
    extensions: [
      "vcf"
    ]
  },
  "text/xml": {
    source: "iana",
    compressible: !0,
    extensions: [
      "xml"
    ]
  },
  "text/xml-external-parsed-entity": {
    source: "iana"
  },
  "text/yaml": {
    compressible: !0,
    extensions: [
      "yaml",
      "yml"
    ]
  },
  "video/1d-interleaved-parityfec": {
    source: "iana"
  },
  "video/3gpp": {
    source: "iana",
    extensions: [
      "3gp",
      "3gpp"
    ]
  },
  "video/3gpp-tt": {
    source: "iana"
  },
  "video/3gpp2": {
    source: "iana",
    extensions: [
      "3g2"
    ]
  },
  "video/av1": {
    source: "iana"
  },
  "video/bmpeg": {
    source: "iana"
  },
  "video/bt656": {
    source: "iana"
  },
  "video/celb": {
    source: "iana"
  },
  "video/dv": {
    source: "iana"
  },
  "video/encaprtp": {
    source: "iana"
  },
  "video/ffv1": {
    source: "iana"
  },
  "video/flexfec": {
    source: "iana"
  },
  "video/h261": {
    source: "iana",
    extensions: [
      "h261"
    ]
  },
  "video/h263": {
    source: "iana",
    extensions: [
      "h263"
    ]
  },
  "video/h263-1998": {
    source: "iana"
  },
  "video/h263-2000": {
    source: "iana"
  },
  "video/h264": {
    source: "iana",
    extensions: [
      "h264"
    ]
  },
  "video/h264-rcdo": {
    source: "iana"
  },
  "video/h264-svc": {
    source: "iana"
  },
  "video/h265": {
    source: "iana"
  },
  "video/iso.segment": {
    source: "iana",
    extensions: [
      "m4s"
    ]
  },
  "video/jpeg": {
    source: "iana",
    extensions: [
      "jpgv"
    ]
  },
  "video/jpeg2000": {
    source: "iana"
  },
  "video/jpm": {
    source: "apache",
    extensions: [
      "jpm",
      "jpgm"
    ]
  },
  "video/jxsv": {
    source: "iana"
  },
  "video/mj2": {
    source: "iana",
    extensions: [
      "mj2",
      "mjp2"
    ]
  },
  "video/mp1s": {
    source: "iana"
  },
  "video/mp2p": {
    source: "iana"
  },
  "video/mp2t": {
    source: "iana",
    extensions: [
      "ts"
    ]
  },
  "video/mp4": {
    source: "iana",
    compressible: !1,
    extensions: [
      "mp4",
      "mp4v",
      "mpg4"
    ]
  },
  "video/mp4v-es": {
    source: "iana"
  },
  "video/mpeg": {
    source: "iana",
    compressible: !1,
    extensions: [
      "mpeg",
      "mpg",
      "mpe",
      "m1v",
      "m2v"
    ]
  },
  "video/mpeg4-generic": {
    source: "iana"
  },
  "video/mpv": {
    source: "iana"
  },
  "video/nv": {
    source: "iana"
  },
  "video/ogg": {
    source: "iana",
    compressible: !1,
    extensions: [
      "ogv"
    ]
  },
  "video/parityfec": {
    source: "iana"
  },
  "video/pointer": {
    source: "iana"
  },
  "video/quicktime": {
    source: "iana",
    compressible: !1,
    extensions: [
      "qt",
      "mov"
    ]
  },
  "video/raptorfec": {
    source: "iana"
  },
  "video/raw": {
    source: "iana"
  },
  "video/rtp-enc-aescm128": {
    source: "iana"
  },
  "video/rtploopback": {
    source: "iana"
  },
  "video/rtx": {
    source: "iana"
  },
  "video/scip": {
    source: "iana"
  },
  "video/smpte291": {
    source: "iana"
  },
  "video/smpte292m": {
    source: "iana"
  },
  "video/ulpfec": {
    source: "iana"
  },
  "video/vc1": {
    source: "iana"
  },
  "video/vc2": {
    source: "iana"
  },
  "video/vnd.cctv": {
    source: "iana"
  },
  "video/vnd.dece.hd": {
    source: "iana",
    extensions: [
      "uvh",
      "uvvh"
    ]
  },
  "video/vnd.dece.mobile": {
    source: "iana",
    extensions: [
      "uvm",
      "uvvm"
    ]
  },
  "video/vnd.dece.mp4": {
    source: "iana"
  },
  "video/vnd.dece.pd": {
    source: "iana",
    extensions: [
      "uvp",
      "uvvp"
    ]
  },
  "video/vnd.dece.sd": {
    source: "iana",
    extensions: [
      "uvs",
      "uvvs"
    ]
  },
  "video/vnd.dece.video": {
    source: "iana",
    extensions: [
      "uvv",
      "uvvv"
    ]
  },
  "video/vnd.directv.mpeg": {
    source: "iana"
  },
  "video/vnd.directv.mpeg-tts": {
    source: "iana"
  },
  "video/vnd.dlna.mpeg-tts": {
    source: "iana"
  },
  "video/vnd.dvb.file": {
    source: "iana",
    extensions: [
      "dvb"
    ]
  },
  "video/vnd.fvt": {
    source: "iana",
    extensions: [
      "fvt"
    ]
  },
  "video/vnd.hns.video": {
    source: "iana"
  },
  "video/vnd.iptvforum.1dparityfec-1010": {
    source: "iana"
  },
  "video/vnd.iptvforum.1dparityfec-2005": {
    source: "iana"
  },
  "video/vnd.iptvforum.2dparityfec-1010": {
    source: "iana"
  },
  "video/vnd.iptvforum.2dparityfec-2005": {
    source: "iana"
  },
  "video/vnd.iptvforum.ttsavc": {
    source: "iana"
  },
  "video/vnd.iptvforum.ttsmpeg2": {
    source: "iana"
  },
  "video/vnd.motorola.video": {
    source: "iana"
  },
  "video/vnd.motorola.videop": {
    source: "iana"
  },
  "video/vnd.mpegurl": {
    source: "iana",
    extensions: [
      "mxu",
      "m4u"
    ]
  },
  "video/vnd.ms-playready.media.pyv": {
    source: "iana",
    extensions: [
      "pyv"
    ]
  },
  "video/vnd.nokia.interleaved-multimedia": {
    source: "iana"
  },
  "video/vnd.nokia.mp4vr": {
    source: "iana"
  },
  "video/vnd.nokia.videovoip": {
    source: "iana"
  },
  "video/vnd.objectvideo": {
    source: "iana"
  },
  "video/vnd.radgamettools.bink": {
    source: "iana"
  },
  "video/vnd.radgamettools.smacker": {
    source: "iana"
  },
  "video/vnd.sealed.mpeg1": {
    source: "iana"
  },
  "video/vnd.sealed.mpeg4": {
    source: "iana"
  },
  "video/vnd.sealed.swf": {
    source: "iana"
  },
  "video/vnd.sealedmedia.softseal.mov": {
    source: "iana"
  },
  "video/vnd.uvvu.mp4": {
    source: "iana",
    extensions: [
      "uvu",
      "uvvu"
    ]
  },
  "video/vnd.vivo": {
    source: "iana",
    extensions: [
      "viv"
    ]
  },
  "video/vnd.youtube.yt": {
    source: "iana"
  },
  "video/vp8": {
    source: "iana"
  },
  "video/vp9": {
    source: "iana"
  },
  "video/webm": {
    source: "apache",
    compressible: !1,
    extensions: [
      "webm"
    ]
  },
  "video/x-f4v": {
    source: "apache",
    extensions: [
      "f4v"
    ]
  },
  "video/x-fli": {
    source: "apache",
    extensions: [
      "fli"
    ]
  },
  "video/x-flv": {
    source: "apache",
    compressible: !1,
    extensions: [
      "flv"
    ]
  },
  "video/x-m4v": {
    source: "apache",
    extensions: [
      "m4v"
    ]
  },
  "video/x-matroska": {
    source: "apache",
    compressible: !1,
    extensions: [
      "mkv",
      "mk3d",
      "mks"
    ]
  },
  "video/x-mng": {
    source: "apache",
    extensions: [
      "mng"
    ]
  },
  "video/x-ms-asf": {
    source: "apache",
    extensions: [
      "asf",
      "asx"
    ]
  },
  "video/x-ms-vob": {
    source: "apache",
    extensions: [
      "vob"
    ]
  },
  "video/x-ms-wm": {
    source: "apache",
    extensions: [
      "wm"
    ]
  },
  "video/x-ms-wmv": {
    source: "apache",
    compressible: !1,
    extensions: [
      "wmv"
    ]
  },
  "video/x-ms-wmx": {
    source: "apache",
    extensions: [
      "wmx"
    ]
  },
  "video/x-ms-wvx": {
    source: "apache",
    extensions: [
      "wvx"
    ]
  },
  "video/x-msvideo": {
    source: "apache",
    extensions: [
      "avi"
    ]
  },
  "video/x-sgi-movie": {
    source: "apache",
    extensions: [
      "movie"
    ]
  },
  "video/x-smv": {
    source: "apache",
    extensions: [
      "smv"
    ]
  },
  "x-conference/x-cooltalk": {
    source: "apache",
    extensions: [
      "ice"
    ]
  },
  "x-shader/x-fragment": {
    compressible: !0
  },
  "x-shader/x-vertex": {
    compressible: !0
  }
};
/*!
 * mime-db
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2015-2022 Douglas Christopher Wilson
 * MIT Licensed
 */
var sR = aR;
/*!
 * mime-types
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */
(function(i) {
  var e = sR, t = Re.extname, s = /^\s*([^;\s]*)(?:;|\s|$)/, o = /^text\//i;
  i.charset = c, i.charsets = { lookup: c }, i.contentType = l, i.extension = p, i.extensions = /* @__PURE__ */ Object.create(null), i.lookup = f, i.types = /* @__PURE__ */ Object.create(null), m(i.extensions, i.types);
  function c(h) {
    if (!h || typeof h != "string")
      return !1;
    var g = s.exec(h), y = g && e[g[1].toLowerCase()];
    return y && y.charset ? y.charset : g && o.test(g[1]) ? "UTF-8" : !1;
  }
  function l(h) {
    if (!h || typeof h != "string")
      return !1;
    var g = h.indexOf("/") === -1 ? i.lookup(h) : h;
    if (!g)
      return !1;
    if (g.indexOf("charset") === -1) {
      var y = i.charset(g);
      y && (g += "; charset=" + y.toLowerCase());
    }
    return g;
  }
  function p(h) {
    if (!h || typeof h != "string")
      return !1;
    var g = s.exec(h), y = g && i.extensions[g[1].toLowerCase()];
    return !y || !y.length ? !1 : y[0];
  }
  function f(h) {
    if (!h || typeof h != "string")
      return !1;
    var g = t("x." + h).toLowerCase().substr(1);
    return g && i.types[g] || !1;
  }
  function m(h, g) {
    var y = ["nginx", "apache", void 0, "iana"];
    Object.keys(e).forEach(function(_) {
      var O = e[_], C = O.extensions;
      if (!(!C || !C.length)) {
        h[_] = C;
        for (var F = 0; F < C.length; F++) {
          var $ = C[F];
          if (g[$]) {
            var q = y.indexOf(e[g[$]].source), G = y.indexOf(O.source);
            if (g[$] !== "application/octet-stream" && (q > G || q === G && g[$].substr(0, 12) === "application/"))
              continue;
          }
          g[$] = _;
        }
      }
    });
  }
})(cm);
var rR = oR;
function oR(i) {
  var e = typeof setImmediate == "function" ? setImmediate : typeof process == "object" && typeof process.nextTick == "function" ? process.nextTick : null;
  e ? e(i) : setTimeout(i, 0);
}
var Vp = rR, um = cR;
function cR(i) {
  var e = !1;
  return Vp(function() {
    e = !0;
  }), function(s, o) {
    e ? i(s, o) : Vp(function() {
      i(s, o);
    });
  };
}
var lm = uR;
function uR(i) {
  Object.keys(i.jobs).forEach(lR.bind(i)), i.jobs = {};
}
function lR(i) {
  typeof this.jobs[i] == "function" && this.jobs[i]();
}
var Xp = um, pR = lm, pm = dR;
function dR(i, e, t, s) {
  var o = t.keyedList ? t.keyedList[t.index] : t.index;
  t.jobs[o] = fR(e, o, i[o], function(c, l) {
    o in t.jobs && (delete t.jobs[o], c ? pR(t) : t.results[o] = l, s(c, t.results));
  });
}
function fR(i, e, t, s) {
  var o;
  return i.length == 2 ? o = i(t, Xp(s)) : o = i(t, e, Xp(s)), o;
}
var dm = mR;
function mR(i, e) {
  var t = !Array.isArray(i), s = {
    index: 0,
    keyedList: t || e ? Object.keys(i) : null,
    jobs: {},
    results: t ? {} : [],
    size: t ? Object.keys(i).length : i.length
  };
  return e && s.keyedList.sort(t ? e : function(o, c) {
    return e(i[o], i[c]);
  }), s;
}
var hR = lm, vR = um, fm = xR;
function xR(i) {
  Object.keys(this.jobs).length && (this.index = this.size, hR(this), vR(i)(null, this.results));
}
var gR = pm, bR = dm, yR = fm, wR = _R;
function _R(i, e, t) {
  for (var s = bR(i); s.index < (s.keyedList || i).length; )
    gR(i, e, s, function(o, c) {
      if (o) {
        t(o, c);
        return;
      }
      if (Object.keys(s.jobs).length === 0) {
        t(null, s.results);
        return;
      }
    }), s.index++;
  return yR.bind(s, t);
}
var er = { exports: {} }, Yp = pm, ER = dm, RR = fm;
er.exports = SR;
er.exports.ascending = mm;
er.exports.descending = kR;
function SR(i, e, t, s) {
  var o = ER(i, t);
  return Yp(i, e, o, function c(l, p) {
    if (l) {
      s(l, p);
      return;
    }
    if (o.index++, o.index < (o.keyedList || i).length) {
      Yp(i, e, o, c);
      return;
    }
    s(null, o.results);
  }), RR.bind(o, s);
}
function mm(i, e) {
  return i < e ? -1 : i > e ? 1 : 0;
}
function kR(i, e) {
  return -1 * mm(i, e);
}
var hm = er.exports, AR = hm, TR = CR;
function CR(i, e, t) {
  return AR(i, e, null, t);
}
var OR = {
  parallel: wR,
  serial: TR,
  serialOrdered: hm
}, IR = function(i, e) {
  return Object.keys(e).forEach(function(t) {
    i[t] = i[t] || e[t];
  }), i;
}, Nc = iR, MR = Lt, $o = Re, PR = Rc, LR = Sc, FR = Ls.parse, qR = Gi, $R = _n.Stream, jo = cm, jR = OR, ac = IR, DR = ce;
MR.inherits(ce, Nc);
function ce(i) {
  if (!(this instanceof ce))
    return new ce(i);
  this._overheadLength = 0, this._valueLength = 0, this._valuesToMeasure = [], Nc.call(this), i = i || {};
  for (var e in i)
    this[e] = i[e];
}
ce.LINE_BREAK = `\r
`;
ce.DEFAULT_CONTENT_TYPE = "application/octet-stream";
ce.prototype.append = function(i, e, t) {
  t = t || {}, typeof t == "string" && (t = { filename: t });
  var s = Nc.prototype.append.bind(this);
  if (typeof e == "number" && (e = "" + e), Array.isArray(e)) {
    this._error(new Error("Arrays are not supported."));
    return;
  }
  var o = this._multiPartHeader(i, e, t), c = this._multiPartFooter();
  s(o), s(e), s(c), this._trackLength(o, e, t);
};
ce.prototype._trackLength = function(i, e, t) {
  var s = 0;
  t.knownLength != null ? s += +t.knownLength : Buffer.isBuffer(e) ? s = e.length : typeof e == "string" && (s = Buffer.byteLength(e)), this._valueLength += s, this._overheadLength += Buffer.byteLength(i) + ce.LINE_BREAK.length, !(!e || !e.path && !(e.readable && e.hasOwnProperty("httpVersion")) && !(e instanceof $R)) && (t.knownLength || this._valuesToMeasure.push(e));
};
ce.prototype._lengthRetriever = function(i, e) {
  i.hasOwnProperty("fd") ? i.end != null && i.end != 1 / 0 && i.start != null ? e(null, i.end + 1 - (i.start ? i.start : 0)) : qR.stat(i.path, function(t, s) {
    var o;
    if (t) {
      e(t);
      return;
    }
    o = s.size - (i.start ? i.start : 0), e(null, o);
  }) : i.hasOwnProperty("httpVersion") ? e(null, +i.headers["content-length"]) : i.hasOwnProperty("httpModule") ? (i.on("response", function(t) {
    i.pause(), e(null, +t.headers["content-length"]);
  }), i.resume()) : e("Unknown stream");
};
ce.prototype._multiPartHeader = function(i, e, t) {
  if (typeof t.header == "string")
    return t.header;
  var s = this._getContentDisposition(e, t), o = this._getContentType(e, t), c = "", l = {
    // add custom disposition as third element or keep it two elements if not
    "Content-Disposition": ["form-data", 'name="' + i + '"'].concat(s || []),
    // if no content type. allow it to be empty array
    "Content-Type": [].concat(o || [])
  };
  typeof t.header == "object" && ac(l, t.header);
  var p;
  for (var f in l)
    l.hasOwnProperty(f) && (p = l[f], p != null && (Array.isArray(p) || (p = [p]), p.length && (c += f + ": " + p.join("; ") + ce.LINE_BREAK)));
  return "--" + this.getBoundary() + ce.LINE_BREAK + c + ce.LINE_BREAK;
};
ce.prototype._getContentDisposition = function(i, e) {
  var t, s;
  return typeof e.filepath == "string" ? t = $o.normalize(e.filepath).replace(/\\/g, "/") : e.filename || i.name || i.path ? t = $o.basename(e.filename || i.name || i.path) : i.readable && i.hasOwnProperty("httpVersion") && (t = $o.basename(i.client._httpMessage.path || "")), t && (s = 'filename="' + t + '"'), s;
};
ce.prototype._getContentType = function(i, e) {
  var t = e.contentType;
  return !t && i.name && (t = jo.lookup(i.name)), !t && i.path && (t = jo.lookup(i.path)), !t && i.readable && i.hasOwnProperty("httpVersion") && (t = i.headers["content-type"]), !t && (e.filepath || e.filename) && (t = jo.lookup(e.filepath || e.filename)), !t && typeof i == "object" && (t = ce.DEFAULT_CONTENT_TYPE), t;
};
ce.prototype._multiPartFooter = function() {
  return (function(i) {
    var e = ce.LINE_BREAK, t = this._streams.length === 0;
    t && (e += this._lastBoundary()), i(e);
  }).bind(this);
};
ce.prototype._lastBoundary = function() {
  return "--" + this.getBoundary() + "--" + ce.LINE_BREAK;
};
ce.prototype.getHeaders = function(i) {
  var e, t = {
    "content-type": "multipart/form-data; boundary=" + this.getBoundary()
  };
  for (e in i)
    i.hasOwnProperty(e) && (t[e.toLowerCase()] = i[e]);
  return t;
};
ce.prototype.setBoundary = function(i) {
  this._boundary = i;
};
ce.prototype.getBoundary = function() {
  return this._boundary || this._generateBoundary(), this._boundary;
};
ce.prototype.getBuffer = function() {
  for (var i = new Buffer.alloc(0), e = this.getBoundary(), t = 0, s = this._streams.length; t < s; t++)
    typeof this._streams[t] != "function" && (Buffer.isBuffer(this._streams[t]) ? i = Buffer.concat([i, this._streams[t]]) : i = Buffer.concat([i, Buffer.from(this._streams[t])]), (typeof this._streams[t] != "string" || this._streams[t].substring(2, e.length + 2) !== e) && (i = Buffer.concat([i, Buffer.from(ce.LINE_BREAK)])));
  return Buffer.concat([i, Buffer.from(this._lastBoundary())]);
};
ce.prototype._generateBoundary = function() {
  for (var i = "--------------------------", e = 0; e < 24; e++)
    i += Math.floor(Math.random() * 10).toString(16);
  this._boundary = i;
};
ce.prototype.getLengthSync = function() {
  var i = this._overheadLength + this._valueLength;
  return this._streams.length && (i += this._lastBoundary().length), this.hasKnownLength() || this._error(new Error("Cannot calculate proper length in synchronous way.")), i;
};
ce.prototype.hasKnownLength = function() {
  var i = !0;
  return this._valuesToMeasure.length && (i = !1), i;
};
ce.prototype.getLength = function(i) {
  var e = this._overheadLength + this._valueLength;
  if (this._streams.length && (e += this._lastBoundary().length), !this._valuesToMeasure.length) {
    process.nextTick(i.bind(this, null, e));
    return;
  }
  jR.parallel(this._valuesToMeasure, this._lengthRetriever, function(t, s) {
    if (t) {
      i(t);
      return;
    }
    s.forEach(function(o) {
      e += o;
    }), i(null, e);
  });
};
ce.prototype.submit = function(i, e) {
  var t, s, o = { method: "post" };
  return typeof i == "string" ? (i = FR(i), s = ac({
    port: i.port,
    path: i.pathname,
    host: i.hostname,
    protocol: i.protocol
  }, o)) : (s = ac(i, o), s.port || (s.port = s.protocol == "https:" ? 443 : 80)), s.headers = this.getHeaders(i.headers), s.protocol == "https:" ? t = LR.request(s) : t = PR.request(s), this.getLength((function(c, l) {
    if (c && c !== "Unknown stream") {
      this._error(c);
      return;
    }
    if (l && t.setHeader("Content-Length", l), this.pipe(t), e) {
      var p, f = function(m, h) {
        return t.removeListener("error", f), t.removeListener("response", p), e.call(this, m, h);
      };
      p = f.bind(this, null), t.on("error", f), t.on("response", p);
    }
  }).bind(this)), t;
};
ce.prototype._error = function(i) {
  this.error || (this.error = i, this.pause(), this.emit("error", i));
};
ce.prototype.toString = function() {
  return "[object FormData]";
};
const vm = /* @__PURE__ */ Ac(DR);
function sc(i) {
  return k.isPlainObject(i) || k.isArray(i);
}
function xm(i) {
  return k.endsWith(i, "[]") ? i.slice(0, -2) : i;
}
function Zp(i, e, t) {
  return i ? i.concat(e).map(function(o, c) {
    return o = xm(o), !t && c ? "[" + o + "]" : o;
  }).join(t ? "." : "") : e;
}
function NR(i) {
  return k.isArray(i) && !i.some(sc);
}
const BR = k.toFlatObject(k, {}, null, function(e) {
  return /^is[A-Z]/.test(e);
});
function nr(i, e, t) {
  if (!k.isObject(i))
    throw new TypeError("target must be an object");
  e = e || new (vm || FormData)(), t = k.toFlatObject(t, {
    metaTokens: !0,
    dots: !1,
    indexes: !1
  }, !1, function(O, C) {
    return !k.isUndefined(C[O]);
  });
  const s = t.metaTokens, o = t.visitor || h, c = t.dots, l = t.indexes, f = (t.Blob || typeof Blob < "u" && Blob) && k.isSpecCompliantForm(e);
  if (!k.isFunction(o))
    throw new TypeError("visitor must be a function");
  function m(_) {
    if (_ === null) return "";
    if (k.isDate(_))
      return _.toISOString();
    if (!f && k.isBlob(_))
      throw new N("Blob is not supported. Use a Buffer instead.");
    return k.isArrayBuffer(_) || k.isTypedArray(_) ? f && typeof Blob == "function" ? new Blob([_]) : Buffer.from(_) : _;
  }
  function h(_, O, C) {
    let F = _;
    if (_ && !C && typeof _ == "object") {
      if (k.endsWith(O, "{}"))
        O = s ? O : O.slice(0, -2), _ = JSON.stringify(_);
      else if (k.isArray(_) && NR(_) || (k.isFileList(_) || k.endsWith(O, "[]")) && (F = k.toArray(_)))
        return O = xm(O), F.forEach(function(q, G) {
          !(k.isUndefined(q) || q === null) && e.append(
            // eslint-disable-next-line no-nested-ternary
            l === !0 ? Zp([O], G, c) : l === null ? O : O + "[]",
            m(q)
          );
        }), !1;
    }
    return sc(_) ? !0 : (e.append(Zp(C, O, c), m(_)), !1);
  }
  const g = [], y = Object.assign(BR, {
    defaultVisitor: h,
    convertValue: m,
    isVisitable: sc
  });
  function S(_, O) {
    if (!k.isUndefined(_)) {
      if (g.indexOf(_) !== -1)
        throw Error("Circular reference detected in " + O.join("."));
      g.push(_), k.forEach(_, function(F, $) {
        (!(k.isUndefined(F) || F === null) && o.call(
          e,
          F,
          k.isString($) ? $.trim() : $,
          O,
          y
        )) === !0 && S(F, O ? O.concat($) : [$]);
      }), g.pop();
    }
  }
  if (!k.isObject(i))
    throw new TypeError("data must be an object");
  return S(i), e;
}
function Qp(i) {
  const e = {
    "!": "%21",
    "'": "%27",
    "(": "%28",
    ")": "%29",
    "~": "%7E",
    "%20": "+",
    "%00": "\0"
  };
  return encodeURIComponent(i).replace(/[!'()~]|%20|%00/g, function(s) {
    return e[s];
  });
}
function gm(i, e) {
  this._pairs = [], i && nr(i, this, e);
}
const bm = gm.prototype;
bm.append = function(e, t) {
  this._pairs.push([e, t]);
};
bm.toString = function(e) {
  const t = e ? function(s) {
    return e.call(this, s, Qp);
  } : Qp;
  return this._pairs.map(function(o) {
    return t(o[0]) + "=" + t(o[1]);
  }, "").join("&");
};
function UR(i) {
  return encodeURIComponent(i).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
}
function Bc(i, e, t) {
  if (!e)
    return i;
  const s = t && t.encode || UR, o = t && t.serialize;
  let c;
  if (o ? c = o(e, t) : c = k.isURLSearchParams(e) ? e.toString() : new gm(e, t).toString(s), c) {
    const l = i.indexOf("#");
    l !== -1 && (i = i.slice(0, l)), i += (i.indexOf("?") === -1 ? "?" : "&") + c;
  }
  return i;
}
class ed {
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
  use(e, t, s) {
    return this.handlers.push({
      fulfilled: e,
      rejected: t,
      synchronous: s ? s.synchronous : !1,
      runWhen: s ? s.runWhen : null
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
    k.forEach(this.handlers, function(s) {
      s !== null && e(s);
    });
  }
}
const Uc = {
  silentJSONParsing: !0,
  forcedJSONParsing: !0,
  clarifyTimeoutError: !1
}, zR = Ls.URLSearchParams, HR = {
  isNode: !0,
  classes: {
    URLSearchParams: zR,
    FormData: vm,
    Blob: typeof Blob < "u" && Blob || null
  },
  protocols: ["http", "https", "file", "data"]
}, zc = typeof window < "u" && typeof document < "u", rc = typeof navigator == "object" && navigator || void 0, GR = zc && (!rc || ["ReactNative", "NativeScript", "NS"].indexOf(rc.product) < 0), WR = typeof WorkerGlobalScope < "u" && // eslint-disable-next-line no-undef
self instanceof WorkerGlobalScope && typeof self.importScripts == "function", KR = zc && window.location.href || "http://localhost", JR = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  hasBrowserEnv: zc,
  hasStandardBrowserEnv: GR,
  hasStandardBrowserWebWorkerEnv: WR,
  navigator: rc,
  origin: KR
}, Symbol.toStringTag, { value: "Module" })), Le = {
  ...JR,
  ...HR
};
function VR(i, e) {
  return nr(i, new Le.classes.URLSearchParams(), Object.assign({
    visitor: function(t, s, o, c) {
      return Le.isNode && k.isBuffer(t) ? (this.append(s, t.toString("base64")), !1) : c.defaultVisitor.apply(this, arguments);
    }
  }, e));
}
function XR(i) {
  return k.matchAll(/\w+|\[(\w*)]/g, i).map((e) => e[0] === "[]" ? "" : e[1] || e[0]);
}
function YR(i) {
  const e = {}, t = Object.keys(i);
  let s;
  const o = t.length;
  let c;
  for (s = 0; s < o; s++)
    c = t[s], e[c] = i[c];
  return e;
}
function ym(i) {
  function e(t, s, o, c) {
    let l = t[c++];
    if (l === "__proto__") return !0;
    const p = Number.isFinite(+l), f = c >= t.length;
    return l = !l && k.isArray(o) ? o.length : l, f ? (k.hasOwnProp(o, l) ? o[l] = [o[l], s] : o[l] = s, !p) : ((!o[l] || !k.isObject(o[l])) && (o[l] = []), e(t, s, o[l], c) && k.isArray(o[l]) && (o[l] = YR(o[l])), !p);
  }
  if (k.isFormData(i) && k.isFunction(i.entries)) {
    const t = {};
    return k.forEachEntry(i, (s, o) => {
      e(XR(s), o, t, 0);
    }), t;
  }
  return null;
}
function ZR(i, e, t) {
  if (k.isString(i))
    try {
      return (e || JSON.parse)(i), k.trim(i);
    } catch (s) {
      if (s.name !== "SyntaxError")
        throw s;
    }
  return (0, JSON.stringify)(i);
}
const Xi = {
  transitional: Uc,
  adapter: ["xhr", "http", "fetch"],
  transformRequest: [function(e, t) {
    const s = t.getContentType() || "", o = s.indexOf("application/json") > -1, c = k.isObject(e);
    if (c && k.isHTMLForm(e) && (e = new FormData(e)), k.isFormData(e))
      return o ? JSON.stringify(ym(e)) : e;
    if (k.isArrayBuffer(e) || k.isBuffer(e) || k.isStream(e) || k.isFile(e) || k.isBlob(e) || k.isReadableStream(e))
      return e;
    if (k.isArrayBufferView(e))
      return e.buffer;
    if (k.isURLSearchParams(e))
      return t.setContentType("application/x-www-form-urlencoded;charset=utf-8", !1), e.toString();
    let p;
    if (c) {
      if (s.indexOf("application/x-www-form-urlencoded") > -1)
        return VR(e, this.formSerializer).toString();
      if ((p = k.isFileList(e)) || s.indexOf("multipart/form-data") > -1) {
        const f = this.env && this.env.FormData;
        return nr(
          p ? { "files[]": e } : e,
          f && new f(),
          this.formSerializer
        );
      }
    }
    return c || o ? (t.setContentType("application/json", !1), ZR(e)) : e;
  }],
  transformResponse: [function(e) {
    const t = this.transitional || Xi.transitional, s = t && t.forcedJSONParsing, o = this.responseType === "json";
    if (k.isResponse(e) || k.isReadableStream(e))
      return e;
    if (e && k.isString(e) && (s && !this.responseType || o)) {
      const l = !(t && t.silentJSONParsing) && o;
      try {
        return JSON.parse(e);
      } catch (p) {
        if (l)
          throw p.name === "SyntaxError" ? N.from(p, N.ERR_BAD_RESPONSE, this, null, this.response) : p;
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
    FormData: Le.classes.FormData,
    Blob: Le.classes.Blob
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
k.forEach(["delete", "get", "head", "post", "put", "patch"], (i) => {
  Xi.headers[i] = {};
});
const QR = k.toObjectSet([
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
]), eS = (i) => {
  const e = {};
  let t, s, o;
  return i && i.split(`
`).forEach(function(l) {
    o = l.indexOf(":"), t = l.substring(0, o).trim().toLowerCase(), s = l.substring(o + 1).trim(), !(!t || e[t] && QR[t]) && (t === "set-cookie" ? e[t] ? e[t].push(s) : e[t] = [s] : e[t] = e[t] ? e[t] + ", " + s : s);
  }), e;
}, nd = Symbol("internals");
function Pi(i) {
  return i && String(i).trim().toLowerCase();
}
function xs(i) {
  return i === !1 || i == null ? i : k.isArray(i) ? i.map(xs) : String(i);
}
function nS(i) {
  const e = /* @__PURE__ */ Object.create(null), t = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let s;
  for (; s = t.exec(i); )
    e[s[1]] = s[2];
  return e;
}
const tS = (i) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(i.trim());
function Do(i, e, t, s, o) {
  if (k.isFunction(s))
    return s.call(this, e, t);
  if (o && (e = t), !!k.isString(e)) {
    if (k.isString(s))
      return e.indexOf(s) !== -1;
    if (k.isRegExp(s))
      return s.test(e);
  }
}
function iS(i) {
  return i.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (e, t, s) => t.toUpperCase() + s);
}
function aS(i, e) {
  const t = k.toCamelCase(" " + e);
  ["get", "set", "has"].forEach((s) => {
    Object.defineProperty(i, s + t, {
      value: function(o, c, l) {
        return this[s].call(this, e, o, c, l);
      },
      configurable: !0
    });
  });
}
let je = class {
  constructor(e) {
    e && this.set(e);
  }
  set(e, t, s) {
    const o = this;
    function c(p, f, m) {
      const h = Pi(f);
      if (!h)
        throw new Error("header name must be a non-empty string");
      const g = k.findKey(o, h);
      (!g || o[g] === void 0 || m === !0 || m === void 0 && o[g] !== !1) && (o[g || f] = xs(p));
    }
    const l = (p, f) => k.forEach(p, (m, h) => c(m, h, f));
    if (k.isPlainObject(e) || e instanceof this.constructor)
      l(e, t);
    else if (k.isString(e) && (e = e.trim()) && !tS(e))
      l(eS(e), t);
    else if (k.isHeaders(e))
      for (const [p, f] of e.entries())
        c(f, p, s);
    else
      e != null && c(t, e, s);
    return this;
  }
  get(e, t) {
    if (e = Pi(e), e) {
      const s = k.findKey(this, e);
      if (s) {
        const o = this[s];
        if (!t)
          return o;
        if (t === !0)
          return nS(o);
        if (k.isFunction(t))
          return t.call(this, o, s);
        if (k.isRegExp(t))
          return t.exec(o);
        throw new TypeError("parser must be boolean|regexp|function");
      }
    }
  }
  has(e, t) {
    if (e = Pi(e), e) {
      const s = k.findKey(this, e);
      return !!(s && this[s] !== void 0 && (!t || Do(this, this[s], s, t)));
    }
    return !1;
  }
  delete(e, t) {
    const s = this;
    let o = !1;
    function c(l) {
      if (l = Pi(l), l) {
        const p = k.findKey(s, l);
        p && (!t || Do(s, s[p], p, t)) && (delete s[p], o = !0);
      }
    }
    return k.isArray(e) ? e.forEach(c) : c(e), o;
  }
  clear(e) {
    const t = Object.keys(this);
    let s = t.length, o = !1;
    for (; s--; ) {
      const c = t[s];
      (!e || Do(this, this[c], c, e, !0)) && (delete this[c], o = !0);
    }
    return o;
  }
  normalize(e) {
    const t = this, s = {};
    return k.forEach(this, (o, c) => {
      const l = k.findKey(s, c);
      if (l) {
        t[l] = xs(o), delete t[c];
        return;
      }
      const p = e ? iS(c) : String(c).trim();
      p !== c && delete t[c], t[p] = xs(o), s[p] = !0;
    }), this;
  }
  concat(...e) {
    return this.constructor.concat(this, ...e);
  }
  toJSON(e) {
    const t = /* @__PURE__ */ Object.create(null);
    return k.forEach(this, (s, o) => {
      s != null && s !== !1 && (t[o] = e && k.isArray(s) ? s.join(", ") : s);
    }), t;
  }
  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]();
  }
  toString() {
    return Object.entries(this.toJSON()).map(([e, t]) => e + ": " + t).join(`
`);
  }
  get [Symbol.toStringTag]() {
    return "AxiosHeaders";
  }
  static from(e) {
    return e instanceof this ? e : new this(e);
  }
  static concat(e, ...t) {
    const s = new this(e);
    return t.forEach((o) => s.set(o)), s;
  }
  static accessor(e) {
    const s = (this[nd] = this[nd] = {
      accessors: {}
    }).accessors, o = this.prototype;
    function c(l) {
      const p = Pi(l);
      s[p] || (aS(o, l), s[p] = !0);
    }
    return k.isArray(e) ? e.forEach(c) : c(e), this;
  }
};
je.accessor(["Content-Type", "Content-Length", "Accept", "Accept-Encoding", "User-Agent", "Authorization"]);
k.reduceDescriptors(je.prototype, ({ value: i }, e) => {
  let t = e[0].toUpperCase() + e.slice(1);
  return {
    get: () => i,
    set(s) {
      this[t] = s;
    }
  };
});
k.freezeMethods(je);
function No(i, e) {
  const t = this || Xi, s = e || t, o = je.from(s.headers);
  let c = s.data;
  return k.forEach(i, function(p) {
    c = p.call(t, c, o.normalize(), e ? e.status : void 0);
  }), o.normalize(), c;
}
function wm(i) {
  return !!(i && i.__CANCEL__);
}
function mt(i, e, t) {
  N.call(this, i ?? "canceled", N.ERR_CANCELED, e, t), this.name = "CanceledError";
}
k.inherits(mt, N, {
  __CANCEL__: !0
});
function Qt(i, e, t) {
  const s = t.config.validateStatus;
  !t.status || !s || s(t.status) ? i(t) : e(new N(
    "Request failed with status code " + t.status,
    [N.ERR_BAD_REQUEST, N.ERR_BAD_RESPONSE][Math.floor(t.status / 100) - 4],
    t.config,
    t.request,
    t
  ));
}
function sS(i) {
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(i);
}
function rS(i, e) {
  return e ? i.replace(/\/?\/$/, "") + "/" + e.replace(/^\/+/, "") : i;
}
function Hc(i, e) {
  return i && !sS(e) ? rS(i, e) : e;
}
var oS = Ls.parse, cS = {
  ftp: 21,
  gopher: 70,
  http: 80,
  https: 443,
  ws: 80,
  wss: 443
}, uS = String.prototype.endsWith || function(i) {
  return i.length <= this.length && this.indexOf(i, this.length - i.length) !== -1;
};
function lS(i) {
  var e = typeof i == "string" ? oS(i) : i || {}, t = e.protocol, s = e.host, o = e.port;
  if (typeof s != "string" || !s || typeof t != "string" || (t = t.split(":", 1)[0], s = s.replace(/:\d*$/, ""), o = parseInt(o) || cS[t] || 0, !pS(s, o)))
    return "";
  var c = ei("npm_config_" + t + "_proxy") || ei(t + "_proxy") || ei("npm_config_proxy") || ei("all_proxy");
  return c && c.indexOf("://") === -1 && (c = t + "://" + c), c;
}
function pS(i, e) {
  var t = (ei("npm_config_no_proxy") || ei("no_proxy")).toLowerCase();
  return t ? t === "*" ? !1 : t.split(/[,\s]/).every(function(s) {
    if (!s)
      return !0;
    var o = s.match(/^(.+):(\d+)$/), c = o ? o[1] : s, l = o ? parseInt(o[2]) : 0;
    return l && l !== e ? !0 : /^[.*]/.test(c) ? (c.charAt(0) === "*" && (c = c.slice(1)), !uS.call(i, c)) : i !== c;
  }) : !0;
}
function ei(i) {
  return process.env[i.toLowerCase()] || process.env[i.toUpperCase()] || "";
}
var dS = lS, Gc = { exports: {} }, us = { exports: {} }, ls = { exports: {} }, Bo, td;
function fS() {
  if (td) return Bo;
  td = 1;
  var i = 1e3, e = i * 60, t = e * 60, s = t * 24, o = s * 7, c = s * 365.25;
  Bo = function(h, g) {
    g = g || {};
    var y = typeof h;
    if (y === "string" && h.length > 0)
      return l(h);
    if (y === "number" && isFinite(h))
      return g.long ? f(h) : p(h);
    throw new Error(
      "val is not a non-empty string or a valid number. val=" + JSON.stringify(h)
    );
  };
  function l(h) {
    if (h = String(h), !(h.length > 100)) {
      var g = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        h
      );
      if (g) {
        var y = parseFloat(g[1]), S = (g[2] || "ms").toLowerCase();
        switch (S) {
          case "years":
          case "year":
          case "yrs":
          case "yr":
          case "y":
            return y * c;
          case "weeks":
          case "week":
          case "w":
            return y * o;
          case "days":
          case "day":
          case "d":
            return y * s;
          case "hours":
          case "hour":
          case "hrs":
          case "hr":
          case "h":
            return y * t;
          case "minutes":
          case "minute":
          case "mins":
          case "min":
          case "m":
            return y * e;
          case "seconds":
          case "second":
          case "secs":
          case "sec":
          case "s":
            return y * i;
          case "milliseconds":
          case "millisecond":
          case "msecs":
          case "msec":
          case "ms":
            return y;
          default:
            return;
        }
      }
    }
  }
  function p(h) {
    var g = Math.abs(h);
    return g >= s ? Math.round(h / s) + "d" : g >= t ? Math.round(h / t) + "h" : g >= e ? Math.round(h / e) + "m" : g >= i ? Math.round(h / i) + "s" : h + "ms";
  }
  function f(h) {
    var g = Math.abs(h);
    return g >= s ? m(h, g, s, "day") : g >= t ? m(h, g, t, "hour") : g >= e ? m(h, g, e, "minute") : g >= i ? m(h, g, i, "second") : h + " ms";
  }
  function m(h, g, y, S) {
    var _ = g >= y * 1.5;
    return Math.round(h / y) + " " + S + (_ ? "s" : "");
  }
  return Bo;
}
var Uo, id;
function _m() {
  if (id) return Uo;
  id = 1;
  function i(e) {
    s.debug = s, s.default = s, s.coerce = m, s.disable = l, s.enable = c, s.enabled = p, s.humanize = fS(), s.destroy = h, Object.keys(e).forEach((g) => {
      s[g] = e[g];
    }), s.names = [], s.skips = [], s.formatters = {};
    function t(g) {
      let y = 0;
      for (let S = 0; S < g.length; S++)
        y = (y << 5) - y + g.charCodeAt(S), y |= 0;
      return s.colors[Math.abs(y) % s.colors.length];
    }
    s.selectColor = t;
    function s(g) {
      let y, S = null, _, O;
      function C(...F) {
        if (!C.enabled)
          return;
        const $ = C, q = Number(/* @__PURE__ */ new Date()), G = q - (y || q);
        $.diff = G, $.prev = y, $.curr = q, y = q, F[0] = s.coerce(F[0]), typeof F[0] != "string" && F.unshift("%O");
        let z = 0;
        F[0] = F[0].replace(/%([a-zA-Z%])/g, (D, H) => {
          if (D === "%%")
            return "%";
          z++;
          const V = s.formatters[H];
          if (typeof V == "function") {
            const Ie = F[z];
            D = V.call($, Ie), F.splice(z, 1), z--;
          }
          return D;
        }), s.formatArgs.call($, F), ($.log || s.log).apply($, F);
      }
      return C.namespace = g, C.useColors = s.useColors(), C.color = s.selectColor(g), C.extend = o, C.destroy = s.destroy, Object.defineProperty(C, "enabled", {
        enumerable: !0,
        configurable: !1,
        get: () => S !== null ? S : (_ !== s.namespaces && (_ = s.namespaces, O = s.enabled(g)), O),
        set: (F) => {
          S = F;
        }
      }), typeof s.init == "function" && s.init(C), C;
    }
    function o(g, y) {
      const S = s(this.namespace + (typeof y > "u" ? ":" : y) + g);
      return S.log = this.log, S;
    }
    function c(g) {
      s.save(g), s.namespaces = g, s.names = [], s.skips = [];
      let y;
      const S = (typeof g == "string" ? g : "").split(/[\s,]+/), _ = S.length;
      for (y = 0; y < _; y++)
        S[y] && (g = S[y].replace(/\*/g, ".*?"), g[0] === "-" ? s.skips.push(new RegExp("^" + g.slice(1) + "$")) : s.names.push(new RegExp("^" + g + "$")));
    }
    function l() {
      const g = [
        ...s.names.map(f),
        ...s.skips.map(f).map((y) => "-" + y)
      ].join(",");
      return s.enable(""), g;
    }
    function p(g) {
      if (g[g.length - 1] === "*")
        return !0;
      let y, S;
      for (y = 0, S = s.skips.length; y < S; y++)
        if (s.skips[y].test(g))
          return !1;
      for (y = 0, S = s.names.length; y < S; y++)
        if (s.names[y].test(g))
          return !0;
      return !1;
    }
    function f(g) {
      return g.toString().substring(2, g.toString().length - 2).replace(/\.\*\?$/, "*");
    }
    function m(g) {
      return g instanceof Error ? g.stack || g.message : g;
    }
    function h() {
      console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
    }
    return s.enable(s.load()), s;
  }
  return Uo = i, Uo;
}
var ad;
function mS() {
  return ad || (ad = 1, function(i, e) {
    e.formatArgs = s, e.save = o, e.load = c, e.useColors = t, e.storage = l(), e.destroy = /* @__PURE__ */ (() => {
      let f = !1;
      return () => {
        f || (f = !0, console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."));
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
    function t() {
      if (typeof window < "u" && window.process && (window.process.type === "renderer" || window.process.__nwjs))
        return !0;
      if (typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))
        return !1;
      let f;
      return typeof document < "u" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window < "u" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator < "u" && navigator.userAgent && (f = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(f[1], 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function s(f) {
      if (f[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + f[0] + (this.useColors ? "%c " : " ") + "+" + i.exports.humanize(this.diff), !this.useColors)
        return;
      const m = "color: " + this.color;
      f.splice(1, 0, m, "color: inherit");
      let h = 0, g = 0;
      f[0].replace(/%[a-zA-Z%]/g, (y) => {
        y !== "%%" && (h++, y === "%c" && (g = h));
      }), f.splice(g, 0, m);
    }
    e.log = console.debug || console.log || (() => {
    });
    function o(f) {
      try {
        f ? e.storage.setItem("debug", f) : e.storage.removeItem("debug");
      } catch {
      }
    }
    function c() {
      let f;
      try {
        f = e.storage.getItem("debug");
      } catch {
      }
      return !f && typeof process < "u" && "env" in process && (f = process.env.DEBUG), f;
    }
    function l() {
      try {
        return localStorage;
      } catch {
      }
    }
    i.exports = _m()(e);
    const { formatters: p } = i.exports;
    p.j = function(f) {
      try {
        return JSON.stringify(f);
      } catch (m) {
        return "[UnexpectedJSONParseError]: " + m.message;
      }
    };
  }(ls, ls.exports)), ls.exports;
}
var ps = { exports: {} }, zo, sd;
function hS() {
  return sd || (sd = 1, zo = (i, e = process.argv) => {
    const t = i.startsWith("-") ? "" : i.length === 1 ? "-" : "--", s = e.indexOf(t + i), o = e.indexOf("--");
    return s !== -1 && (o === -1 || s < o);
  }), zo;
}
var Ho, rd;
function vS() {
  if (rd) return Ho;
  rd = 1;
  const i = Fd, e = kc, t = hS(), { env: s } = process;
  let o;
  t("no-color") || t("no-colors") || t("color=false") || t("color=never") ? o = 0 : (t("color") || t("colors") || t("color=true") || t("color=always")) && (o = 1), "FORCE_COLOR" in s && (s.FORCE_COLOR === "true" ? o = 1 : s.FORCE_COLOR === "false" ? o = 0 : o = s.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(s.FORCE_COLOR, 10), 3));
  function c(f) {
    return f === 0 ? !1 : {
      level: f,
      hasBasic: !0,
      has256: f >= 2,
      has16m: f >= 3
    };
  }
  function l(f, m) {
    if (o === 0)
      return 0;
    if (t("color=16m") || t("color=full") || t("color=truecolor"))
      return 3;
    if (t("color=256"))
      return 2;
    if (f && !m && o === void 0)
      return 0;
    const h = o || 0;
    if (s.TERM === "dumb")
      return h;
    if (process.platform === "win32") {
      const g = i.release().split(".");
      return Number(g[0]) >= 10 && Number(g[2]) >= 10586 ? Number(g[2]) >= 14931 ? 3 : 2 : 1;
    }
    if ("CI" in s)
      return ["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((g) => g in s) || s.CI_NAME === "codeship" ? 1 : h;
    if ("TEAMCITY_VERSION" in s)
      return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(s.TEAMCITY_VERSION) ? 1 : 0;
    if (s.COLORTERM === "truecolor")
      return 3;
    if ("TERM_PROGRAM" in s) {
      const g = parseInt((s.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
      switch (s.TERM_PROGRAM) {
        case "iTerm.app":
          return g >= 3 ? 3 : 2;
        case "Apple_Terminal":
          return 2;
      }
    }
    return /-256(color)?$/i.test(s.TERM) ? 2 : /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(s.TERM) || "COLORTERM" in s ? 1 : h;
  }
  function p(f) {
    const m = l(f, f && f.isTTY);
    return c(m);
  }
  return Ho = {
    supportsColor: p,
    stdout: c(l(!0, e.isatty(1))),
    stderr: c(l(!0, e.isatty(2)))
  }, Ho;
}
var od;
function xS() {
  return od || (od = 1, function(i, e) {
    const t = kc, s = Lt;
    e.init = h, e.log = p, e.formatArgs = c, e.save = f, e.load = m, e.useColors = o, e.destroy = s.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    ), e.colors = [6, 2, 3, 4, 5, 1];
    try {
      const y = vS();
      y && (y.stderr || y).level >= 2 && (e.colors = [
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
    e.inspectOpts = Object.keys(process.env).filter((y) => /^debug_/i.test(y)).reduce((y, S) => {
      const _ = S.substring(6).toLowerCase().replace(/_([a-z])/g, (C, F) => F.toUpperCase());
      let O = process.env[S];
      return /^(yes|on|true|enabled)$/i.test(O) ? O = !0 : /^(no|off|false|disabled)$/i.test(O) ? O = !1 : O === "null" ? O = null : O = Number(O), y[_] = O, y;
    }, {});
    function o() {
      return "colors" in e.inspectOpts ? !!e.inspectOpts.colors : t.isatty(process.stderr.fd);
    }
    function c(y) {
      const { namespace: S, useColors: _ } = this;
      if (_) {
        const O = this.color, C = "\x1B[3" + (O < 8 ? O : "8;5;" + O), F = `  ${C};1m${S} \x1B[0m`;
        y[0] = F + y[0].split(`
`).join(`
` + F), y.push(C + "m+" + i.exports.humanize(this.diff) + "\x1B[0m");
      } else
        y[0] = l() + S + " " + y[0];
    }
    function l() {
      return e.inspectOpts.hideDate ? "" : (/* @__PURE__ */ new Date()).toISOString() + " ";
    }
    function p(...y) {
      return process.stderr.write(s.formatWithOptions(e.inspectOpts, ...y) + `
`);
    }
    function f(y) {
      y ? process.env.DEBUG = y : delete process.env.DEBUG;
    }
    function m() {
      return process.env.DEBUG;
    }
    function h(y) {
      y.inspectOpts = {};
      const S = Object.keys(e.inspectOpts);
      for (let _ = 0; _ < S.length; _++)
        y.inspectOpts[S[_]] = e.inspectOpts[S[_]];
    }
    i.exports = _m()(e);
    const { formatters: g } = i.exports;
    g.o = function(y) {
      return this.inspectOpts.colors = this.useColors, s.inspect(y, this.inspectOpts).split(`
`).map((S) => S.trim()).join(" ");
    }, g.O = function(y) {
      return this.inspectOpts.colors = this.useColors, s.inspect(y, this.inspectOpts);
    };
  }(ps, ps.exports)), ps.exports;
}
var cd;
function gS() {
  return cd || (cd = 1, typeof process > "u" || process.type === "renderer" || process.browser === !0 || process.__nwjs ? us.exports = mS() : us.exports = xS()), us.exports;
}
var Li, bS = function() {
  if (!Li) {
    try {
      Li = gS()("follow-redirects");
    } catch {
    }
    typeof Li != "function" && (Li = function() {
    });
  }
  Li.apply(null, arguments);
}, Yi = Ls, zi = Yi.URL, yS = Rc, wS = Sc, Wc = _n.Writable, Kc = z_, Em = bS;
(function() {
  var e = typeof process < "u", t = typeof window < "u" && typeof document < "u", s = Mt(Error.captureStackTrace);
  !e && (t || !s) && console.warn("The follow-redirects package should be excluded from browser builds.");
})();
var Jc = !1;
try {
  Kc(new zi(""));
} catch (i) {
  Jc = i.code === "ERR_INVALID_URL";
}
var _S = [
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
], Vc = ["abort", "aborted", "connect", "error", "socket", "timeout"], Xc = /* @__PURE__ */ Object.create(null);
Vc.forEach(function(i) {
  Xc[i] = function(e, t, s) {
    this._redirectable.emit(i, e, t, s);
  };
});
var oc = Zi(
  "ERR_INVALID_URL",
  "Invalid URL",
  TypeError
), cc = Zi(
  "ERR_FR_REDIRECTION_FAILURE",
  "Redirected request failed"
), ES = Zi(
  "ERR_FR_TOO_MANY_REDIRECTS",
  "Maximum number of redirects exceeded",
  cc
), RS = Zi(
  "ERR_FR_MAX_BODY_LENGTH_EXCEEDED",
  "Request body larger than maxBodyLength limit"
), SS = Zi(
  "ERR_STREAM_WRITE_AFTER_END",
  "write after end"
), kS = Wc.prototype.destroy || Sm;
function Qe(i, e) {
  Wc.call(this), this._sanitizeOptions(i), this._options = i, this._ended = !1, this._ending = !1, this._redirectCount = 0, this._redirects = [], this._requestBodyLength = 0, this._requestBodyBuffers = [], e && this.on("response", e);
  var t = this;
  this._onNativeResponse = function(s) {
    try {
      t._processResponse(s);
    } catch (o) {
      t.emit("error", o instanceof cc ? o : new cc({ cause: o }));
    }
  }, this._performRequest();
}
Qe.prototype = Object.create(Wc.prototype);
Qe.prototype.abort = function() {
  Zc(this._currentRequest), this._currentRequest.abort(), this.emit("abort");
};
Qe.prototype.destroy = function(i) {
  return Zc(this._currentRequest, i), kS.call(this, i), this;
};
Qe.prototype.write = function(i, e, t) {
  if (this._ending)
    throw new SS();
  if (!Ct(i) && !CS(i))
    throw new TypeError("data should be a string, Buffer or Uint8Array");
  if (Mt(e) && (t = e, e = null), i.length === 0) {
    t && t();
    return;
  }
  this._requestBodyLength + i.length <= this._options.maxBodyLength ? (this._requestBodyLength += i.length, this._requestBodyBuffers.push({ data: i, encoding: e }), this._currentRequest.write(i, e, t)) : (this.emit("error", new RS()), this.abort());
};
Qe.prototype.end = function(i, e, t) {
  if (Mt(i) ? (t = i, i = e = null) : Mt(e) && (t = e, e = null), !i)
    this._ended = this._ending = !0, this._currentRequest.end(null, null, t);
  else {
    var s = this, o = this._currentRequest;
    this.write(i, e, function() {
      s._ended = !0, o.end(null, null, t);
    }), this._ending = !0;
  }
};
Qe.prototype.setHeader = function(i, e) {
  this._options.headers[i] = e, this._currentRequest.setHeader(i, e);
};
Qe.prototype.removeHeader = function(i) {
  delete this._options.headers[i], this._currentRequest.removeHeader(i);
};
Qe.prototype.setTimeout = function(i, e) {
  var t = this;
  function s(l) {
    l.setTimeout(i), l.removeListener("timeout", l.destroy), l.addListener("timeout", l.destroy);
  }
  function o(l) {
    t._timeout && clearTimeout(t._timeout), t._timeout = setTimeout(function() {
      t.emit("timeout"), c();
    }, i), s(l);
  }
  function c() {
    t._timeout && (clearTimeout(t._timeout), t._timeout = null), t.removeListener("abort", c), t.removeListener("error", c), t.removeListener("response", c), t.removeListener("close", c), e && t.removeListener("timeout", e), t.socket || t._currentRequest.removeListener("socket", o);
  }
  return e && this.on("timeout", e), this.socket ? o(this.socket) : this._currentRequest.once("socket", o), this.on("socket", s), this.on("abort", c), this.on("error", c), this.on("response", c), this.on("close", c), this;
};
[
  "flushHeaders",
  "getHeader",
  "setNoDelay",
  "setSocketKeepAlive"
].forEach(function(i) {
  Qe.prototype[i] = function(e, t) {
    return this._currentRequest[i](e, t);
  };
});
["aborted", "connection", "socket"].forEach(function(i) {
  Object.defineProperty(Qe.prototype, i, {
    get: function() {
      return this._currentRequest[i];
    }
  });
});
Qe.prototype._sanitizeOptions = function(i) {
  if (i.headers || (i.headers = {}), i.host && (i.hostname || (i.hostname = i.host), delete i.host), !i.pathname && i.path) {
    var e = i.path.indexOf("?");
    e < 0 ? i.pathname = i.path : (i.pathname = i.path.substring(0, e), i.search = i.path.substring(e));
  }
};
Qe.prototype._performRequest = function() {
  var i = this._options.protocol, e = this._options.nativeProtocols[i];
  if (!e)
    throw new TypeError("Unsupported protocol " + i);
  if (this._options.agents) {
    var t = i.slice(0, -1);
    this._options.agent = this._options.agents[t];
  }
  var s = this._currentRequest = e.request(this._options, this._onNativeResponse);
  s._redirectable = this;
  for (var o of Vc)
    s.on(o, Xc[o]);
  if (this._currentUrl = /^\//.test(this._options.path) ? Yi.format(this._options) : (
    // When making a request to a proxy, […]
    // a client MUST send the target URI in absolute-form […].
    this._options.path
  ), this._isRedirect) {
    var c = 0, l = this, p = this._requestBodyBuffers;
    (function f(m) {
      if (s === l._currentRequest)
        if (m)
          l.emit("error", m);
        else if (c < p.length) {
          var h = p[c++];
          s.finished || s.write(h.data, h.encoding, f);
        } else l._ended && s.end();
    })();
  }
};
Qe.prototype._processResponse = function(i) {
  var e = i.statusCode;
  this._options.trackRedirects && this._redirects.push({
    url: this._currentUrl,
    headers: i.headers,
    statusCode: e
  });
  var t = i.headers.location;
  if (!t || this._options.followRedirects === !1 || e < 300 || e >= 400) {
    i.responseUrl = this._currentUrl, i.redirects = this._redirects, this.emit("response", i), this._requestBodyBuffers = [];
    return;
  }
  if (Zc(this._currentRequest), i.destroy(), ++this._redirectCount > this._options.maxRedirects)
    throw new ES();
  var s, o = this._options.beforeRedirect;
  o && (s = Object.assign({
    // The Host header was set by nativeProtocol.request
    Host: i.req.getHeader("host")
  }, this._options.headers));
  var c = this._options.method;
  ((e === 301 || e === 302) && this._options.method === "POST" || // RFC7231§6.4.4: The 303 (See Other) status code indicates that
  // the server is redirecting the user agent to a different resource […]
  // A user agent can perform a retrieval request targeting that URI
  // (a GET or HEAD request if using HTTP) […]
  e === 303 && !/^(?:GET|HEAD)$/.test(this._options.method)) && (this._options.method = "GET", this._requestBodyBuffers = [], Go(/^content-/i, this._options.headers));
  var l = Go(/^host$/i, this._options.headers), p = Yc(this._currentUrl), f = l || p.host, m = /^\w+:/.test(t) ? this._currentUrl : Yi.format(Object.assign(p, { host: f })), h = AS(t, m);
  if (Em("redirecting to", h.href), this._isRedirect = !0, uc(h, this._options), (h.protocol !== p.protocol && h.protocol !== "https:" || h.host !== f && !TS(h.host, f)) && Go(/^(?:(?:proxy-)?authorization|cookie)$/i, this._options.headers), Mt(o)) {
    var g = {
      headers: i.headers,
      statusCode: e
    }, y = {
      url: m,
      method: c,
      headers: s
    };
    o(this._options, g, y), this._sanitizeOptions(this._options);
  }
  this._performRequest();
};
function Rm(i) {
  var e = {
    maxRedirects: 21,
    maxBodyLength: 10485760
  }, t = {};
  return Object.keys(i).forEach(function(s) {
    var o = s + ":", c = t[o] = i[s], l = e[s] = Object.create(c);
    function p(m, h, g) {
      return OS(m) ? m = uc(m) : Ct(m) ? m = uc(Yc(m)) : (g = h, h = km(m), m = { protocol: o }), Mt(h) && (g = h, h = null), h = Object.assign({
        maxRedirects: e.maxRedirects,
        maxBodyLength: e.maxBodyLength
      }, m, h), h.nativeProtocols = t, !Ct(h.host) && !Ct(h.hostname) && (h.hostname = "::1"), Kc.equal(h.protocol, o, "protocol mismatch"), Em("options", h), new Qe(h, g);
    }
    function f(m, h, g) {
      var y = l.request(m, h, g);
      return y.end(), y;
    }
    Object.defineProperties(l, {
      request: { value: p, configurable: !0, enumerable: !0, writable: !0 },
      get: { value: f, configurable: !0, enumerable: !0, writable: !0 }
    });
  }), e;
}
function Sm() {
}
function Yc(i) {
  var e;
  if (Jc)
    e = new zi(i);
  else if (e = km(Yi.parse(i)), !Ct(e.protocol))
    throw new oc({ input: i });
  return e;
}
function AS(i, e) {
  return Jc ? new zi(i, e) : Yc(Yi.resolve(e, i));
}
function km(i) {
  if (/^\[/.test(i.hostname) && !/^\[[:0-9a-f]+\]$/i.test(i.hostname))
    throw new oc({ input: i.href || i });
  if (/^\[/.test(i.host) && !/^\[[:0-9a-f]+\](:\d+)?$/i.test(i.host))
    throw new oc({ input: i.href || i });
  return i;
}
function uc(i, e) {
  var t = e || {};
  for (var s of _S)
    t[s] = i[s];
  return t.hostname.startsWith("[") && (t.hostname = t.hostname.slice(1, -1)), t.port !== "" && (t.port = Number(t.port)), t.path = t.search ? t.pathname + t.search : t.pathname, t;
}
function Go(i, e) {
  var t;
  for (var s in e)
    i.test(s) && (t = e[s], delete e[s]);
  return t === null || typeof t > "u" ? void 0 : String(t).trim();
}
function Zi(i, e, t) {
  function s(o) {
    Mt(Error.captureStackTrace) && Error.captureStackTrace(this, this.constructor), Object.assign(this, o || {}), this.code = i, this.message = this.cause ? e + ": " + this.cause.message : e;
  }
  return s.prototype = new (t || Error)(), Object.defineProperties(s.prototype, {
    constructor: {
      value: s,
      enumerable: !1
    },
    name: {
      value: "Error [" + i + "]",
      enumerable: !1
    }
  }), s;
}
function Zc(i, e) {
  for (var t of Vc)
    i.removeListener(t, Xc[t]);
  i.on("error", Sm), i.destroy(e);
}
function TS(i, e) {
  Kc(Ct(i) && Ct(e));
  var t = i.length - e.length - 1;
  return t > 0 && i[t] === "." && i.endsWith(e);
}
function Ct(i) {
  return typeof i == "string" || i instanceof String;
}
function Mt(i) {
  return typeof i == "function";
}
function CS(i) {
  return typeof i == "object" && "length" in i;
}
function OS(i) {
  return zi && i instanceof zi;
}
Gc.exports = Rm({ http: yS, https: wS });
Gc.exports.wrap = Rm;
var IS = Gc.exports;
const MS = /* @__PURE__ */ Ac(IS), Ts = "1.7.7";
function Am(i) {
  const e = /^([-+\w]{1,25})(:?\/\/|:)/.exec(i);
  return e && e[1] || "";
}
const PS = /^(?:([^;]+);)?(?:[^;]+;)?(base64|),([\s\S]*)$/;
function LS(i, e, t) {
  const s = t && t.Blob || Le.classes.Blob, o = Am(i);
  if (e === void 0 && s && (e = !0), o === "data") {
    i = o.length ? i.slice(o.length + 1) : i;
    const c = PS.exec(i);
    if (!c)
      throw new N("Invalid URL", N.ERR_INVALID_URL);
    const l = c[1], p = c[2], f = c[3], m = Buffer.from(decodeURIComponent(f), p ? "base64" : "utf8");
    if (e) {
      if (!s)
        throw new N("Blob is not supported", N.ERR_NOT_SUPPORT);
      return new s([m], { type: l });
    }
    return m;
  }
  throw new N("Unsupported protocol " + o, N.ERR_NOT_SUPPORT);
}
const Wo = Symbol("internals");
class ud extends _n.Transform {
  constructor(e) {
    e = k.toFlatObject(e, {
      maxRate: 0,
      chunkSize: 64 * 1024,
      minChunkSize: 100,
      timeWindow: 500,
      ticksRate: 2,
      samplesCount: 15
    }, null, (s, o) => !k.isUndefined(o[s])), super({
      readableHighWaterMark: e.chunkSize
    });
    const t = this[Wo] = {
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
    this.on("newListener", (s) => {
      s === "progress" && (t.isCaptured || (t.isCaptured = !0));
    });
  }
  _read(e) {
    const t = this[Wo];
    return t.onReadCallback && t.onReadCallback(), super._read(e);
  }
  _transform(e, t, s) {
    const o = this[Wo], c = o.maxRate, l = this.readableHighWaterMark, p = o.timeWindow, f = 1e3 / p, m = c / f, h = o.minChunkSize !== !1 ? Math.max(o.minChunkSize, m * 0.01) : 0, g = (S, _) => {
      const O = Buffer.byteLength(S);
      o.bytesSeen += O, o.bytes += O, o.isCaptured && this.emit("progress", o.bytesSeen), this.push(S) ? process.nextTick(_) : o.onReadCallback = () => {
        o.onReadCallback = null, process.nextTick(_);
      };
    }, y = (S, _) => {
      const O = Buffer.byteLength(S);
      let C = null, F = l, $, q = 0;
      if (c) {
        const G = Date.now();
        (!o.ts || (q = G - o.ts) >= p) && (o.ts = G, $ = m - o.bytes, o.bytes = $ < 0 ? -$ : 0, q = 0), $ = m - o.bytes;
      }
      if (c) {
        if ($ <= 0)
          return setTimeout(() => {
            _(null, S);
          }, p - q);
        $ < F && (F = $);
      }
      F && O > F && O - F > h && (C = S.subarray(F), S = S.subarray(0, F)), g(S, C ? () => {
        process.nextTick(_, null, C);
      } : _);
    };
    y(e, function S(_, O) {
      if (_)
        return s(_);
      O ? y(O, S) : s(null);
    });
  }
}
const { asyncIterator: ld } = Symbol, Tm = async function* (i) {
  i.stream ? yield* i.stream() : i.arrayBuffer ? yield await i.arrayBuffer() : i[ld] ? yield* i[ld]() : yield i;
}, FS = k.ALPHABET.ALPHA_DIGIT + "-_", Hi = new B_(), lt = `\r
`, qS = Hi.encode(lt), $S = 2;
class jS {
  constructor(e, t) {
    const { escapeName: s } = this.constructor, o = k.isString(t);
    let c = `Content-Disposition: form-data; name="${s(e)}"${!o && t.name ? `; filename="${s(t.name)}"` : ""}${lt}`;
    o ? t = Hi.encode(String(t).replace(/\r?\n|\r\n?/g, lt)) : c += `Content-Type: ${t.type || "application/octet-stream"}${lt}`, this.headers = Hi.encode(c + lt), this.contentLength = o ? t.byteLength : t.size, this.size = this.headers.byteLength + this.contentLength + $S, this.name = e, this.value = t;
  }
  async *encode() {
    yield this.headers;
    const { value: e } = this;
    k.isTypedArray(e) ? yield e : yield* Tm(e), yield qS;
  }
  static escapeName(e) {
    return String(e).replace(/[\r\n"]/g, (t) => ({
      "\r": "%0D",
      "\n": "%0A",
      '"': "%22"
    })[t]);
  }
}
const DS = (i, e, t) => {
  const {
    tag: s = "form-data-boundary",
    size: o = 25,
    boundary: c = s + "-" + k.generateString(o, FS)
  } = t || {};
  if (!k.isFormData(i))
    throw TypeError("FormData instance required");
  if (c.length < 1 || c.length > 70)
    throw Error("boundary must be 10-70 characters long");
  const l = Hi.encode("--" + c + lt), p = Hi.encode("--" + c + "--" + lt + lt);
  let f = p.byteLength;
  const m = Array.from(i.entries()).map(([g, y]) => {
    const S = new jS(g, y);
    return f += S.size, S;
  });
  f += l.byteLength * m.length, f = k.toFiniteNumber(f);
  const h = {
    "Content-Type": `multipart/form-data; boundary=${c}`
  };
  return Number.isFinite(f) && (h["Content-Length"] = f), e && e(h), U_.from(async function* () {
    for (const g of m)
      yield l, yield* g.encode();
    yield p;
  }());
};
class NS extends _n.Transform {
  __transform(e, t, s) {
    this.push(e), s();
  }
  _transform(e, t, s) {
    if (e.length !== 0 && (this._transform = this.__transform, e[0] !== 120)) {
      const o = Buffer.alloc(2);
      o[0] = 120, o[1] = 156, this.push(o, t);
    }
    this.__transform(e, t, s);
  }
}
const BS = (i, e) => k.isAsyncFn(i) ? function(...t) {
  const s = t.pop();
  i.apply(this, t).then((o) => {
    try {
      e ? s(null, ...e(o)) : s(null, o);
    } catch (c) {
      s(c);
    }
  }, s);
} : i;
function US(i, e) {
  i = i || 10;
  const t = new Array(i), s = new Array(i);
  let o = 0, c = 0, l;
  return e = e !== void 0 ? e : 1e3, function(f) {
    const m = Date.now(), h = s[c];
    l || (l = m), t[o] = f, s[o] = m;
    let g = c, y = 0;
    for (; g !== o; )
      y += t[g++], g = g % i;
    if (o = (o + 1) % i, o === c && (c = (c + 1) % i), m - l < e)
      return;
    const S = h && m - h;
    return S ? Math.round(y * 1e3 / S) : void 0;
  };
}
function zS(i, e) {
  let t = 0, s = 1e3 / e, o, c;
  const l = (m, h = Date.now()) => {
    t = h, o = null, c && (clearTimeout(c), c = null), i.apply(null, m);
  };
  return [(...m) => {
    const h = Date.now(), g = h - t;
    g >= s ? l(m, h) : (o = m, c || (c = setTimeout(() => {
      c = null, l(o);
    }, s - g)));
  }, () => o && l(o)];
}
const ai = (i, e, t = 3) => {
  let s = 0;
  const o = US(50, 250);
  return zS((c) => {
    const l = c.loaded, p = c.lengthComputable ? c.total : void 0, f = l - s, m = o(f), h = l <= p;
    s = l;
    const g = {
      loaded: l,
      total: p,
      progress: p ? l / p : void 0,
      bytes: f,
      rate: m || void 0,
      estimated: m && p && h ? (p - l) / m : void 0,
      event: c,
      lengthComputable: p != null,
      [e ? "download" : "upload"]: !0
    };
    i(g);
  }, t);
}, Cs = (i, e) => {
  const t = i != null;
  return [(s) => e[0]({
    lengthComputable: t,
    total: i,
    loaded: s
  }), e[1]];
}, Os = (i) => (...e) => k.asap(() => i(...e)), pd = {
  flush: dt.constants.Z_SYNC_FLUSH,
  finishFlush: dt.constants.Z_SYNC_FLUSH
}, HS = {
  flush: dt.constants.BROTLI_OPERATION_FLUSH,
  finishFlush: dt.constants.BROTLI_OPERATION_FLUSH
}, dd = k.isFunction(dt.createBrotliDecompress), { http: GS, https: WS } = MS, KS = /https:?/, fd = Le.protocols.map((i) => i + ":"), md = (i, [e, t]) => (i.on("end", t).on("error", t), e);
function JS(i, e) {
  i.beforeRedirects.proxy && i.beforeRedirects.proxy(i), i.beforeRedirects.config && i.beforeRedirects.config(i, e);
}
function Cm(i, e, t) {
  let s = e;
  if (!s && s !== !1) {
    const o = dS(t);
    o && (s = new URL(o));
  }
  if (s) {
    if (s.username && (s.auth = (s.username || "") + ":" + (s.password || "")), s.auth) {
      (s.auth.username || s.auth.password) && (s.auth = (s.auth.username || "") + ":" + (s.auth.password || ""));
      const c = Buffer.from(s.auth, "utf8").toString("base64");
      i.headers["Proxy-Authorization"] = "Basic " + c;
    }
    i.headers.host = i.hostname + (i.port ? ":" + i.port : "");
    const o = s.hostname || s.host;
    i.hostname = o, i.host = o, i.port = s.port, i.path = t, s.protocol && (i.protocol = s.protocol.includes(":") ? s.protocol : `${s.protocol}:`);
  }
  i.beforeRedirects.proxy = function(c) {
    Cm(c, e, c.href);
  };
}
const VS = typeof process < "u" && k.kindOf(process) === "process", XS = (i) => new Promise((e, t) => {
  let s, o;
  const c = (f, m) => {
    o || (o = !0, s && s(f, m));
  }, l = (f) => {
    c(f), e(f);
  }, p = (f) => {
    c(f, !0), t(f);
  };
  i(l, p, (f) => s = f).catch(p);
}), YS = ({ address: i, family: e }) => {
  if (!k.isString(i))
    throw TypeError("address must be a string");
  return {
    address: i,
    family: e || (i.indexOf(".") < 0 ? 6 : 4)
  };
}, hd = (i, e) => YS(k.isObject(i) ? i : { address: i, family: e }), ZS = VS && function(e) {
  return XS(async function(s, o, c) {
    let { data: l, lookup: p, family: f } = e;
    const { responseType: m, responseEncoding: h } = e, g = e.method.toUpperCase();
    let y, S = !1, _;
    if (p) {
      const W = BS(p, (K) => k.isArray(K) ? K : [K]);
      p = (K, Me, dn) => {
        W(K, Me, (he, Fn, li) => {
          if (he)
            return dn(he);
          const fn = k.isArray(Fn) ? Fn.map((Te) => hd(Te)) : [hd(Fn, li)];
          Me.all ? dn(he, fn) : dn(he, fn[0].address, fn[0].family);
        });
      };
    }
    const O = new H_(), C = () => {
      e.cancelToken && e.cancelToken.unsubscribe(F), e.signal && e.signal.removeEventListener("abort", F), O.removeAllListeners();
    };
    c((W, K) => {
      y = !0, K && (S = !0, C());
    });
    function F(W) {
      O.emit("abort", !W || W.type ? new mt(null, e, _) : W);
    }
    O.once("abort", o), (e.cancelToken || e.signal) && (e.cancelToken && e.cancelToken.subscribe(F), e.signal && (e.signal.aborted ? F() : e.signal.addEventListener("abort", F)));
    const $ = Hc(e.baseURL, e.url), q = new URL($, Le.hasBrowserEnv ? Le.origin : void 0), G = q.protocol || fd[0];
    if (G === "data:") {
      let W;
      if (g !== "GET")
        return Qt(s, o, {
          status: 405,
          statusText: "method not allowed",
          headers: {},
          config: e
        });
      try {
        W = LS(e.url, m === "blob", {
          Blob: e.env && e.env.Blob
        });
      } catch (K) {
        throw N.from(K, N.ERR_BAD_REQUEST, e);
      }
      return m === "text" ? (W = W.toString(h), (!h || h === "utf8") && (W = k.stripBOM(W))) : m === "stream" && (W = _n.Readable.from(W)), Qt(s, o, {
        data: W,
        status: 200,
        statusText: "OK",
        headers: new je(),
        config: e
      });
    }
    if (fd.indexOf(G) === -1)
      return o(new N(
        "Unsupported protocol " + G,
        N.ERR_BAD_REQUEST,
        e
      ));
    const z = je.from(e.headers).normalize();
    z.set("User-Agent", "axios/" + Ts, !1);
    const { onUploadProgress: te, onDownloadProgress: D } = e, H = e.maxRate;
    let V, Ie;
    if (k.isSpecCompliantForm(l)) {
      const W = z.getContentType(/boundary=([-_\w\d]{10,70})/i);
      l = DS(l, (K) => {
        z.set(K);
      }, {
        tag: `axios-${Ts}-boundary`,
        boundary: W && W[1] || void 0
      });
    } else if (k.isFormData(l) && k.isFunction(l.getHeaders)) {
      if (z.set(l.getHeaders()), !z.hasContentLength())
        try {
          const W = await Lt.promisify(l.getLength).call(l);
          Number.isFinite(W) && W >= 0 && z.setContentLength(W);
        } catch {
        }
    } else if (k.isBlob(l))
      l.size && z.setContentType(l.type || "application/octet-stream"), z.setContentLength(l.size || 0), l = _n.Readable.from(Tm(l));
    else if (l && !k.isStream(l)) {
      if (!Buffer.isBuffer(l)) if (k.isArrayBuffer(l))
        l = Buffer.from(new Uint8Array(l));
      else if (k.isString(l))
        l = Buffer.from(l, "utf-8");
      else
        return o(new N(
          "Data after transformation must be a string, an ArrayBuffer, a Buffer, or a Stream",
          N.ERR_BAD_REQUEST,
          e
        ));
      if (z.setContentLength(l.length, !1), e.maxBodyLength > -1 && l.length > e.maxBodyLength)
        return o(new N(
          "Request body larger than maxBodyLength limit",
          N.ERR_BAD_REQUEST,
          e
        ));
    }
    const Fe = k.toFiniteNumber(z.getContentLength());
    k.isArray(H) ? (V = H[0], Ie = H[1]) : V = Ie = H, l && (te || V) && (k.isStream(l) || (l = _n.Readable.from(l, { objectMode: !1 })), l = _n.pipeline([l, new ud({
      maxRate: k.toFiniteNumber(V)
    })], k.noop), te && l.on("progress", md(
      l,
      Cs(
        Fe,
        ai(Os(te), !1, 3)
      )
    )));
    let De;
    if (e.auth) {
      const W = e.auth.username || "", K = e.auth.password || "";
      De = W + ":" + K;
    }
    if (!De && q.username) {
      const W = q.username, K = q.password;
      De = W + ":" + K;
    }
    De && z.delete("authorization");
    let vt;
    try {
      vt = Bc(
        q.pathname + q.search,
        e.params,
        e.paramsSerializer
      ).replace(/^\?/, "");
    } catch (W) {
      const K = new Error(W.message);
      return K.config = e, K.url = e.url, K.exists = !0, o(K);
    }
    z.set(
      "Accept-Encoding",
      "gzip, compress, deflate" + (dd ? ", br" : ""),
      !1
    );
    const ue = {
      path: vt,
      method: g,
      headers: z.toJSON(),
      agents: { http: e.httpAgent, https: e.httpsAgent },
      auth: De,
      protocol: G,
      family: f,
      beforeRedirect: JS,
      beforeRedirects: {}
    };
    !k.isUndefined(p) && (ue.lookup = p), e.socketPath ? ue.socketPath = e.socketPath : (ue.hostname = q.hostname.startsWith("[") ? q.hostname.slice(1, -1) : q.hostname, ue.port = q.port, Cm(ue, e.proxy, G + "//" + q.hostname + (q.port ? ":" + q.port : "") + ue.path));
    let ze;
    const Ln = KS.test(ue.protocol);
    if (ue.agent = Ln ? e.httpsAgent : e.httpAgent, e.transport ? ze = e.transport : e.maxRedirects === 0 ? ze = Ln ? Sc : Rc : (e.maxRedirects && (ue.maxRedirects = e.maxRedirects), e.beforeRedirect && (ue.beforeRedirects.config = e.beforeRedirect), ze = Ln ? WS : GS), e.maxBodyLength > -1 ? ue.maxBodyLength = e.maxBodyLength : ue.maxBodyLength = 1 / 0, e.insecureHTTPParser && (ue.insecureHTTPParser = e.insecureHTTPParser), _ = ze.request(ue, function(K) {
      if (_.destroyed) return;
      const Me = [K], dn = +K.headers["content-length"];
      if (D || Ie) {
        const Te = new ud({
          maxRate: k.toFiniteNumber(Ie)
        });
        D && Te.on("progress", md(
          Te,
          Cs(
            dn,
            ai(Os(D), !0, 3)
          )
        )), Me.push(Te);
      }
      let he = K;
      const Fn = K.req || _;
      if (e.decompress !== !1 && K.headers["content-encoding"])
        switch ((g === "HEAD" || K.statusCode === 204) && delete K.headers["content-encoding"], (K.headers["content-encoding"] || "").toLowerCase()) {
          case "gzip":
          case "x-gzip":
          case "compress":
          case "x-compress":
            Me.push(dt.createUnzip(pd)), delete K.headers["content-encoding"];
            break;
          case "deflate":
            Me.push(new NS()), Me.push(dt.createUnzip(pd)), delete K.headers["content-encoding"];
            break;
          case "br":
            dd && (Me.push(dt.createBrotliDecompress(HS)), delete K.headers["content-encoding"]);
        }
      he = Me.length > 1 ? _n.pipeline(Me, k.noop) : Me[0];
      const li = _n.finished(he, () => {
        li(), C();
      }), fn = {
        status: K.statusCode,
        statusText: K.statusMessage,
        headers: new je(K.headers),
        config: e,
        request: Fn
      };
      if (m === "stream")
        fn.data = he, Qt(s, o, fn);
      else {
        const Te = [];
        let xt = 0;
        he.on("data", function(Se) {
          Te.push(Se), xt += Se.length, e.maxContentLength > -1 && xt > e.maxContentLength && (S = !0, he.destroy(), o(new N(
            "maxContentLength size of " + e.maxContentLength + " exceeded",
            N.ERR_BAD_RESPONSE,
            e,
            Fn
          )));
        }), he.on("aborted", function() {
          if (S)
            return;
          const Se = new N(
            "maxContentLength size of " + e.maxContentLength + " exceeded",
            N.ERR_BAD_RESPONSE,
            e,
            Fn
          );
          he.destroy(Se), o(Se);
        }), he.on("error", function(Se) {
          _.destroyed || o(N.from(Se, null, e, Fn));
        }), he.on("end", function() {
          try {
            let Se = Te.length === 1 ? Te[0] : Buffer.concat(Te);
            m !== "arraybuffer" && (Se = Se.toString(h), (!h || h === "utf8") && (Se = k.stripBOM(Se))), fn.data = Se;
          } catch (Se) {
            return o(N.from(Se, null, e, fn.request, fn));
          }
          Qt(s, o, fn);
        });
      }
      O.once("abort", (Te) => {
        he.destroyed || (he.emit("error", Te), he.destroy());
      });
    }), O.once("abort", (W) => {
      o(W), _.destroy(W);
    }), _.on("error", function(K) {
      o(N.from(K, null, e, _));
    }), _.on("socket", function(K) {
      K.setKeepAlive(!0, 1e3 * 60);
    }), e.timeout) {
      const W = parseInt(e.timeout, 10);
      if (Number.isNaN(W)) {
        o(new N(
          "error trying to parse `config.timeout` to int",
          N.ERR_BAD_OPTION_VALUE,
          e,
          _
        ));
        return;
      }
      _.setTimeout(W, function() {
        if (y) return;
        let Me = e.timeout ? "timeout of " + e.timeout + "ms exceeded" : "timeout exceeded";
        const dn = e.transitional || Uc;
        e.timeoutErrorMessage && (Me = e.timeoutErrorMessage), o(new N(
          Me,
          dn.clarifyTimeoutError ? N.ETIMEDOUT : N.ECONNABORTED,
          e,
          _
        )), F();
      });
    }
    if (k.isStream(l)) {
      let W = !1, K = !1;
      l.on("end", () => {
        W = !0;
      }), l.once("error", (Me) => {
        K = !0, _.destroy(Me);
      }), l.on("close", () => {
        !W && !K && F(new mt("Request stream has been aborted", e, _));
      }), l.pipe(_);
    } else
      _.end(l);
  });
}, QS = Le.hasStandardBrowserEnv ? (
  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
  function() {
    const e = Le.navigator && /(msie|trident)/i.test(Le.navigator.userAgent), t = document.createElement("a");
    let s;
    function o(c) {
      let l = c;
      return e && (t.setAttribute("href", l), l = t.href), t.setAttribute("href", l), {
        href: t.href,
        protocol: t.protocol ? t.protocol.replace(/:$/, "") : "",
        host: t.host,
        search: t.search ? t.search.replace(/^\?/, "") : "",
        hash: t.hash ? t.hash.replace(/^#/, "") : "",
        hostname: t.hostname,
        port: t.port,
        pathname: t.pathname.charAt(0) === "/" ? t.pathname : "/" + t.pathname
      };
    }
    return s = o(window.location.href), function(l) {
      const p = k.isString(l) ? o(l) : l;
      return p.protocol === s.protocol && p.host === s.host;
    };
  }()
) : (
  // Non standard browser envs (web workers, react-native) lack needed support.
  /* @__PURE__ */ function() {
    return function() {
      return !0;
    };
  }()
), ek = Le.hasStandardBrowserEnv ? (
  // Standard browser envs support document.cookie
  {
    write(i, e, t, s, o, c) {
      const l = [i + "=" + encodeURIComponent(e)];
      k.isNumber(t) && l.push("expires=" + new Date(t).toGMTString()), k.isString(s) && l.push("path=" + s), k.isString(o) && l.push("domain=" + o), c === !0 && l.push("secure"), document.cookie = l.join("; ");
    },
    read(i) {
      const e = document.cookie.match(new RegExp("(^|;\\s*)(" + i + ")=([^;]*)"));
      return e ? decodeURIComponent(e[3]) : null;
    },
    remove(i) {
      this.write(i, "", Date.now() - 864e5);
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
), vd = (i) => i instanceof je ? { ...i } : i;
function Pt(i, e) {
  e = e || {};
  const t = {};
  function s(m, h, g) {
    return k.isPlainObject(m) && k.isPlainObject(h) ? k.merge.call({ caseless: g }, m, h) : k.isPlainObject(h) ? k.merge({}, h) : k.isArray(h) ? h.slice() : h;
  }
  function o(m, h, g) {
    if (k.isUndefined(h)) {
      if (!k.isUndefined(m))
        return s(void 0, m, g);
    } else return s(m, h, g);
  }
  function c(m, h) {
    if (!k.isUndefined(h))
      return s(void 0, h);
  }
  function l(m, h) {
    if (k.isUndefined(h)) {
      if (!k.isUndefined(m))
        return s(void 0, m);
    } else return s(void 0, h);
  }
  function p(m, h, g) {
    if (g in e)
      return s(m, h);
    if (g in i)
      return s(void 0, m);
  }
  const f = {
    url: c,
    method: c,
    data: c,
    baseURL: l,
    transformRequest: l,
    transformResponse: l,
    paramsSerializer: l,
    timeout: l,
    timeoutMessage: l,
    withCredentials: l,
    withXSRFToken: l,
    adapter: l,
    responseType: l,
    xsrfCookieName: l,
    xsrfHeaderName: l,
    onUploadProgress: l,
    onDownloadProgress: l,
    decompress: l,
    maxContentLength: l,
    maxBodyLength: l,
    beforeRedirect: l,
    transport: l,
    httpAgent: l,
    httpsAgent: l,
    cancelToken: l,
    socketPath: l,
    responseEncoding: l,
    validateStatus: p,
    headers: (m, h) => o(vd(m), vd(h), !0)
  };
  return k.forEach(Object.keys(Object.assign({}, i, e)), function(h) {
    const g = f[h] || o, y = g(i[h], e[h], h);
    k.isUndefined(y) && g !== p || (t[h] = y);
  }), t;
}
const Om = (i) => {
  const e = Pt({}, i);
  let { data: t, withXSRFToken: s, xsrfHeaderName: o, xsrfCookieName: c, headers: l, auth: p } = e;
  e.headers = l = je.from(l), e.url = Bc(Hc(e.baseURL, e.url), i.params, i.paramsSerializer), p && l.set(
    "Authorization",
    "Basic " + btoa((p.username || "") + ":" + (p.password ? unescape(encodeURIComponent(p.password)) : ""))
  );
  let f;
  if (k.isFormData(t)) {
    if (Le.hasStandardBrowserEnv || Le.hasStandardBrowserWebWorkerEnv)
      l.setContentType(void 0);
    else if ((f = l.getContentType()) !== !1) {
      const [m, ...h] = f ? f.split(";").map((g) => g.trim()).filter(Boolean) : [];
      l.setContentType([m || "multipart/form-data", ...h].join("; "));
    }
  }
  if (Le.hasStandardBrowserEnv && (s && k.isFunction(s) && (s = s(e)), s || s !== !1 && QS(e.url))) {
    const m = o && c && ek.read(c);
    m && l.set(o, m);
  }
  return e;
}, nk = typeof XMLHttpRequest < "u", tk = nk && function(i) {
  return new Promise(function(t, s) {
    const o = Om(i);
    let c = o.data;
    const l = je.from(o.headers).normalize();
    let { responseType: p, onUploadProgress: f, onDownloadProgress: m } = o, h, g, y, S, _;
    function O() {
      S && S(), _ && _(), o.cancelToken && o.cancelToken.unsubscribe(h), o.signal && o.signal.removeEventListener("abort", h);
    }
    let C = new XMLHttpRequest();
    C.open(o.method.toUpperCase(), o.url, !0), C.timeout = o.timeout;
    function F() {
      if (!C)
        return;
      const q = je.from(
        "getAllResponseHeaders" in C && C.getAllResponseHeaders()
      ), z = {
        data: !p || p === "text" || p === "json" ? C.responseText : C.response,
        status: C.status,
        statusText: C.statusText,
        headers: q,
        config: i,
        request: C
      };
      Qt(function(D) {
        t(D), O();
      }, function(D) {
        s(D), O();
      }, z), C = null;
    }
    "onloadend" in C ? C.onloadend = F : C.onreadystatechange = function() {
      !C || C.readyState !== 4 || C.status === 0 && !(C.responseURL && C.responseURL.indexOf("file:") === 0) || setTimeout(F);
    }, C.onabort = function() {
      C && (s(new N("Request aborted", N.ECONNABORTED, i, C)), C = null);
    }, C.onerror = function() {
      s(new N("Network Error", N.ERR_NETWORK, i, C)), C = null;
    }, C.ontimeout = function() {
      let G = o.timeout ? "timeout of " + o.timeout + "ms exceeded" : "timeout exceeded";
      const z = o.transitional || Uc;
      o.timeoutErrorMessage && (G = o.timeoutErrorMessage), s(new N(
        G,
        z.clarifyTimeoutError ? N.ETIMEDOUT : N.ECONNABORTED,
        i,
        C
      )), C = null;
    }, c === void 0 && l.setContentType(null), "setRequestHeader" in C && k.forEach(l.toJSON(), function(G, z) {
      C.setRequestHeader(z, G);
    }), k.isUndefined(o.withCredentials) || (C.withCredentials = !!o.withCredentials), p && p !== "json" && (C.responseType = o.responseType), m && ([y, _] = ai(m, !0), C.addEventListener("progress", y)), f && C.upload && ([g, S] = ai(f), C.upload.addEventListener("progress", g), C.upload.addEventListener("loadend", S)), (o.cancelToken || o.signal) && (h = (q) => {
      C && (s(!q || q.type ? new mt(null, i, C) : q), C.abort(), C = null);
    }, o.cancelToken && o.cancelToken.subscribe(h), o.signal && (o.signal.aborted ? h() : o.signal.addEventListener("abort", h)));
    const $ = Am(o.url);
    if ($ && Le.protocols.indexOf($) === -1) {
      s(new N("Unsupported protocol " + $ + ":", N.ERR_BAD_REQUEST, i));
      return;
    }
    C.send(c || null);
  });
}, ik = (i, e) => {
  const { length: t } = i = i ? i.filter(Boolean) : [];
  if (e || t) {
    let s = new AbortController(), o;
    const c = function(m) {
      if (!o) {
        o = !0, p();
        const h = m instanceof Error ? m : this.reason;
        s.abort(h instanceof N ? h : new mt(h instanceof Error ? h.message : h));
      }
    };
    let l = e && setTimeout(() => {
      l = null, c(new N(`timeout ${e} of ms exceeded`, N.ETIMEDOUT));
    }, e);
    const p = () => {
      i && (l && clearTimeout(l), l = null, i.forEach((m) => {
        m.unsubscribe ? m.unsubscribe(c) : m.removeEventListener("abort", c);
      }), i = null);
    };
    i.forEach((m) => m.addEventListener("abort", c));
    const { signal: f } = s;
    return f.unsubscribe = () => k.asap(p), f;
  }
}, ak = function* (i, e) {
  let t = i.byteLength;
  if (t < e) {
    yield i;
    return;
  }
  let s = 0, o;
  for (; s < t; )
    o = s + e, yield i.slice(s, o), s = o;
}, sk = async function* (i, e) {
  for await (const t of rk(i))
    yield* ak(t, e);
}, rk = async function* (i) {
  if (i[Symbol.asyncIterator]) {
    yield* i;
    return;
  }
  const e = i.getReader();
  try {
    for (; ; ) {
      const { done: t, value: s } = await e.read();
      if (t)
        break;
      yield s;
    }
  } finally {
    await e.cancel();
  }
}, xd = (i, e, t, s) => {
  const o = sk(i, e);
  let c = 0, l, p = (f) => {
    l || (l = !0, s && s(f));
  };
  return new ReadableStream({
    async pull(f) {
      try {
        const { done: m, value: h } = await o.next();
        if (m) {
          p(), f.close();
          return;
        }
        let g = h.byteLength;
        if (t) {
          let y = c += g;
          t(y);
        }
        f.enqueue(new Uint8Array(h));
      } catch (m) {
        throw p(m), m;
      }
    },
    cancel(f) {
      return p(f), o.return();
    }
  }, {
    highWaterMark: 2
  });
}, tr = typeof fetch == "function" && typeof Request == "function" && typeof Response == "function", Im = tr && typeof ReadableStream == "function", ok = tr && (typeof TextEncoder == "function" ? /* @__PURE__ */ ((i) => (e) => i.encode(e))(new TextEncoder()) : async (i) => new Uint8Array(await new Response(i).arrayBuffer())), Mm = (i, ...e) => {
  try {
    return !!i(...e);
  } catch {
    return !1;
  }
}, ck = Im && Mm(() => {
  let i = !1;
  const e = new Request(Le.origin, {
    body: new ReadableStream(),
    method: "POST",
    get duplex() {
      return i = !0, "half";
    }
  }).headers.has("Content-Type");
  return i && !e;
}), gd = 64 * 1024, lc = Im && Mm(() => k.isReadableStream(new Response("").body)), Is = {
  stream: lc && ((i) => i.body)
};
tr && ((i) => {
  ["text", "arrayBuffer", "blob", "formData", "stream"].forEach((e) => {
    !Is[e] && (Is[e] = k.isFunction(i[e]) ? (t) => t[e]() : (t, s) => {
      throw new N(`Response type '${e}' is not supported`, N.ERR_NOT_SUPPORT, s);
    });
  });
})(new Response());
const uk = async (i) => {
  if (i == null)
    return 0;
  if (k.isBlob(i))
    return i.size;
  if (k.isSpecCompliantForm(i))
    return (await new Request(Le.origin, {
      method: "POST",
      body: i
    }).arrayBuffer()).byteLength;
  if (k.isArrayBufferView(i) || k.isArrayBuffer(i))
    return i.byteLength;
  if (k.isURLSearchParams(i) && (i = i + ""), k.isString(i))
    return (await ok(i)).byteLength;
}, lk = async (i, e) => {
  const t = k.toFiniteNumber(i.getContentLength());
  return t ?? uk(e);
}, pk = tr && (async (i) => {
  let {
    url: e,
    method: t,
    data: s,
    signal: o,
    cancelToken: c,
    timeout: l,
    onDownloadProgress: p,
    onUploadProgress: f,
    responseType: m,
    headers: h,
    withCredentials: g = "same-origin",
    fetchOptions: y
  } = Om(i);
  m = m ? (m + "").toLowerCase() : "text";
  let S = ik([o, c && c.toAbortSignal()], l), _;
  const O = S && S.unsubscribe && (() => {
    S.unsubscribe();
  });
  let C;
  try {
    if (f && ck && t !== "get" && t !== "head" && (C = await lk(h, s)) !== 0) {
      let z = new Request(e, {
        method: "POST",
        body: s,
        duplex: "half"
      }), te;
      if (k.isFormData(s) && (te = z.headers.get("content-type")) && h.setContentType(te), z.body) {
        const [D, H] = Cs(
          C,
          ai(Os(f))
        );
        s = xd(z.body, gd, D, H);
      }
    }
    k.isString(g) || (g = g ? "include" : "omit");
    const F = "credentials" in Request.prototype;
    _ = new Request(e, {
      ...y,
      signal: S,
      method: t.toUpperCase(),
      headers: h.normalize().toJSON(),
      body: s,
      duplex: "half",
      credentials: F ? g : void 0
    });
    let $ = await fetch(_);
    const q = lc && (m === "stream" || m === "response");
    if (lc && (p || q && O)) {
      const z = {};
      ["status", "statusText", "headers"].forEach((V) => {
        z[V] = $[V];
      });
      const te = k.toFiniteNumber($.headers.get("content-length")), [D, H] = p && Cs(
        te,
        ai(Os(p), !0)
      ) || [];
      $ = new Response(
        xd($.body, gd, D, () => {
          H && H(), O && O();
        }),
        z
      );
    }
    m = m || "text";
    let G = await Is[k.findKey(Is, m) || "text"]($, i);
    return !q && O && O(), await new Promise((z, te) => {
      Qt(z, te, {
        data: G,
        headers: je.from($.headers),
        status: $.status,
        statusText: $.statusText,
        config: i,
        request: _
      });
    });
  } catch (F) {
    throw O && O(), F && F.name === "TypeError" && /fetch/i.test(F.message) ? Object.assign(
      new N("Network Error", N.ERR_NETWORK, i, _),
      {
        cause: F.cause || F
      }
    ) : N.from(F, F && F.code, i, _);
  }
}), pc = {
  http: ZS,
  xhr: tk,
  fetch: pk
};
k.forEach(pc, (i, e) => {
  if (i) {
    try {
      Object.defineProperty(i, "name", { value: e });
    } catch {
    }
    Object.defineProperty(i, "adapterName", { value: e });
  }
});
const bd = (i) => `- ${i}`, dk = (i) => k.isFunction(i) || i === null || i === !1, Pm = {
  getAdapter: (i) => {
    i = k.isArray(i) ? i : [i];
    const { length: e } = i;
    let t, s;
    const o = {};
    for (let c = 0; c < e; c++) {
      t = i[c];
      let l;
      if (s = t, !dk(t) && (s = pc[(l = String(t)).toLowerCase()], s === void 0))
        throw new N(`Unknown adapter '${l}'`);
      if (s)
        break;
      o[l || "#" + c] = s;
    }
    if (!s) {
      const c = Object.entries(o).map(
        ([p, f]) => `adapter ${p} ` + (f === !1 ? "is not supported by the environment" : "is not available in the build")
      );
      let l = e ? c.length > 1 ? `since :
` + c.map(bd).join(`
`) : " " + bd(c[0]) : "as no adapter specified";
      throw new N(
        "There is no suitable adapter to dispatch the request " + l,
        "ERR_NOT_SUPPORT"
      );
    }
    return s;
  },
  adapters: pc
};
function Ko(i) {
  if (i.cancelToken && i.cancelToken.throwIfRequested(), i.signal && i.signal.aborted)
    throw new mt(null, i);
}
function yd(i) {
  return Ko(i), i.headers = je.from(i.headers), i.data = No.call(
    i,
    i.transformRequest
  ), ["post", "put", "patch"].indexOf(i.method) !== -1 && i.headers.setContentType("application/x-www-form-urlencoded", !1), Pm.getAdapter(i.adapter || Xi.adapter)(i).then(function(s) {
    return Ko(i), s.data = No.call(
      i,
      i.transformResponse,
      s
    ), s.headers = je.from(s.headers), s;
  }, function(s) {
    return wm(s) || (Ko(i), s && s.response && (s.response.data = No.call(
      i,
      i.transformResponse,
      s.response
    ), s.response.headers = je.from(s.response.headers))), Promise.reject(s);
  });
}
const Qc = {};
["object", "boolean", "number", "function", "string", "symbol"].forEach((i, e) => {
  Qc[i] = function(s) {
    return typeof s === i || "a" + (e < 1 ? "n " : " ") + i;
  };
});
const wd = {};
Qc.transitional = function(e, t, s) {
  function o(c, l) {
    return "[Axios v" + Ts + "] Transitional option '" + c + "'" + l + (s ? ". " + s : "");
  }
  return (c, l, p) => {
    if (e === !1)
      throw new N(
        o(l, " has been removed" + (t ? " in " + t : "")),
        N.ERR_DEPRECATED
      );
    return t && !wd[l] && (wd[l] = !0, console.warn(
      o(
        l,
        " has been deprecated since v" + t + " and will be removed in the near future"
      )
    )), e ? e(c, l, p) : !0;
  };
};
function fk(i, e, t) {
  if (typeof i != "object")
    throw new N("options must be an object", N.ERR_BAD_OPTION_VALUE);
  const s = Object.keys(i);
  let o = s.length;
  for (; o-- > 0; ) {
    const c = s[o], l = e[c];
    if (l) {
      const p = i[c], f = p === void 0 || l(p, c, i);
      if (f !== !0)
        throw new N("option " + c + " must be " + f, N.ERR_BAD_OPTION_VALUE);
      continue;
    }
    if (t !== !0)
      throw new N("Unknown option " + c, N.ERR_BAD_OPTION);
  }
}
const dc = {
  assertOptions: fk,
  validators: Qc
}, ut = dc.validators;
let Ot = class {
  constructor(e) {
    this.defaults = e, this.interceptors = {
      request: new ed(),
      response: new ed()
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
  async request(e, t) {
    try {
      return await this._request(e, t);
    } catch (s) {
      if (s instanceof Error) {
        let o;
        Error.captureStackTrace ? Error.captureStackTrace(o = {}) : o = new Error();
        const c = o.stack ? o.stack.replace(/^.+\n/, "") : "";
        try {
          s.stack ? c && !String(s.stack).endsWith(c.replace(/^.+\n.+\n/, "")) && (s.stack += `
` + c) : s.stack = c;
        } catch {
        }
      }
      throw s;
    }
  }
  _request(e, t) {
    typeof e == "string" ? (t = t || {}, t.url = e) : t = e || {}, t = Pt(this.defaults, t);
    const { transitional: s, paramsSerializer: o, headers: c } = t;
    s !== void 0 && dc.assertOptions(s, {
      silentJSONParsing: ut.transitional(ut.boolean),
      forcedJSONParsing: ut.transitional(ut.boolean),
      clarifyTimeoutError: ut.transitional(ut.boolean)
    }, !1), o != null && (k.isFunction(o) ? t.paramsSerializer = {
      serialize: o
    } : dc.assertOptions(o, {
      encode: ut.function,
      serialize: ut.function
    }, !0)), t.method = (t.method || this.defaults.method || "get").toLowerCase();
    let l = c && k.merge(
      c.common,
      c[t.method]
    );
    c && k.forEach(
      ["delete", "get", "head", "post", "put", "patch", "common"],
      (_) => {
        delete c[_];
      }
    ), t.headers = je.concat(l, c);
    const p = [];
    let f = !0;
    this.interceptors.request.forEach(function(O) {
      typeof O.runWhen == "function" && O.runWhen(t) === !1 || (f = f && O.synchronous, p.unshift(O.fulfilled, O.rejected));
    });
    const m = [];
    this.interceptors.response.forEach(function(O) {
      m.push(O.fulfilled, O.rejected);
    });
    let h, g = 0, y;
    if (!f) {
      const _ = [yd.bind(this), void 0];
      for (_.unshift.apply(_, p), _.push.apply(_, m), y = _.length, h = Promise.resolve(t); g < y; )
        h = h.then(_[g++], _[g++]);
      return h;
    }
    y = p.length;
    let S = t;
    for (g = 0; g < y; ) {
      const _ = p[g++], O = p[g++];
      try {
        S = _(S);
      } catch (C) {
        O.call(this, C);
        break;
      }
    }
    try {
      h = yd.call(this, S);
    } catch (_) {
      return Promise.reject(_);
    }
    for (g = 0, y = m.length; g < y; )
      h = h.then(m[g++], m[g++]);
    return h;
  }
  getUri(e) {
    e = Pt(this.defaults, e);
    const t = Hc(e.baseURL, e.url);
    return Bc(t, e.params, e.paramsSerializer);
  }
};
k.forEach(["delete", "get", "head", "options"], function(e) {
  Ot.prototype[e] = function(t, s) {
    return this.request(Pt(s || {}, {
      method: e,
      url: t,
      data: (s || {}).data
    }));
  };
});
k.forEach(["post", "put", "patch"], function(e) {
  function t(s) {
    return function(c, l, p) {
      return this.request(Pt(p || {}, {
        method: e,
        headers: s ? {
          "Content-Type": "multipart/form-data"
        } : {},
        url: c,
        data: l
      }));
    };
  }
  Ot.prototype[e] = t(), Ot.prototype[e + "Form"] = t(!0);
});
let mk = class Lm {
  constructor(e) {
    if (typeof e != "function")
      throw new TypeError("executor must be a function.");
    let t;
    this.promise = new Promise(function(c) {
      t = c;
    });
    const s = this;
    this.promise.then((o) => {
      if (!s._listeners) return;
      let c = s._listeners.length;
      for (; c-- > 0; )
        s._listeners[c](o);
      s._listeners = null;
    }), this.promise.then = (o) => {
      let c;
      const l = new Promise((p) => {
        s.subscribe(p), c = p;
      }).then(o);
      return l.cancel = function() {
        s.unsubscribe(c);
      }, l;
    }, e(function(c, l, p) {
      s.reason || (s.reason = new mt(c, l, p), t(s.reason));
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
    const t = this._listeners.indexOf(e);
    t !== -1 && this._listeners.splice(t, 1);
  }
  toAbortSignal() {
    const e = new AbortController(), t = (s) => {
      e.abort(s);
    };
    return this.subscribe(t), e.signal.unsubscribe = () => this.unsubscribe(t), e.signal;
  }
  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  static source() {
    let e;
    return {
      token: new Lm(function(o) {
        e = o;
      }),
      cancel: e
    };
  }
};
function hk(i) {
  return function(t) {
    return i.apply(null, t);
  };
}
function vk(i) {
  return k.isObject(i) && i.isAxiosError === !0;
}
const fc = {
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
Object.entries(fc).forEach(([i, e]) => {
  fc[e] = i;
});
function Fm(i) {
  const e = new Ot(i), t = Xf(Ot.prototype.request, e);
  return k.extend(t, Ot.prototype, e, { allOwnKeys: !0 }), k.extend(t, e, null, { allOwnKeys: !0 }), t.create = function(o) {
    return Fm(Pt(i, o));
  }, t;
}
const pe = Fm(Xi);
pe.Axios = Ot;
pe.CanceledError = mt;
pe.CancelToken = mk;
pe.isCancel = wm;
pe.VERSION = Ts;
pe.toFormData = nr;
pe.AxiosError = N;
pe.Cancel = pe.CanceledError;
pe.all = function(e) {
  return Promise.all(e);
};
pe.spread = hk;
pe.isAxiosError = vk;
pe.mergeConfig = Pt;
pe.AxiosHeaders = je;
pe.formToJSON = (i) => ym(k.isHTMLForm(i) ? new FormData(i) : i);
pe.getAdapter = Pm.getAdapter;
pe.HttpStatusCode = fc;
pe.default = pe;
const {
  Axios: xk,
  AxiosError: gk,
  CanceledError: bk,
  isCancel: yk,
  CancelToken: wk,
  VERSION: _k,
  all: Ek,
  Cancel: Rk,
  isAxiosError: Sk,
  spread: kk,
  toFormData: Ak,
  AxiosHeaders: Tk,
  HttpStatusCode: Ck,
  formToJSON: Ok,
  getAdapter: Ik,
  mergeConfig: Mk
} = pe, Pk = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Axios: xk,
  AxiosError: gk,
  AxiosHeaders: Tk,
  Cancel: Rk,
  CancelToken: wk,
  CanceledError: bk,
  HttpStatusCode: Ck,
  VERSION: _k,
  all: Ek,
  default: pe,
  formToJSON: Ok,
  getAdapter: Ik,
  isAxiosError: Sk,
  isCancel: yk,
  mergeConfig: Mk,
  spread: kk,
  toFormData: Ak
}, Symbol.toStringTag, { value: "Module" }));
async function Lk({ playlistUrl: i, categoriesUrl: e, name: t }) {
  const s = await pe.get(i), o = await pe.get(e);
  if (s.status !== 200 || o.status !== 200 || !Array.isArray(s.data) || !Array.isArray(o.data)) return;
  const c = { playlist: s.data, categories: o.data };
  return await me.writeAsync(Kf(t), c), c;
}
async function Fk({ playlistUrl: i, categoriesUrl: e, name: t }) {
  const s = await pe.get(i), o = await pe.get(e);
  if (s.status !== 200 || o.status !== 200 || !Array.isArray(s.data) || !Array.isArray(o.data)) return;
  const c = { playlist: s.data, categories: o.data };
  return await me.writeAsync(Jf(t), c), c;
}
async function qk({ playlistUrl: i, categoriesUrl: e, name: t }) {
  const s = await pe.get(i), o = await pe.get(e);
  if (s.status !== 200 || o.status !== 200 || !Array.isArray(s.data) || !Array.isArray(o.data)) return;
  const c = { playlist: s.data, categories: o.data };
  return await me.writeAsync(Vf(t), c), c;
}
async function $k(i) {
  const e = await pe.get(i);
  return !(e.status !== 200 || e.data.user_info.status === "Expired");
}
async function jk(i) {
  const e = await me.readAsync(Ke, "json");
  if (e.playlists) {
    for (const t of e.playlists)
      if (t.name == i.name) return !1;
    e.playlists.push(i);
  } else
    e.playlists = [i];
  return e.currentPlaylist = {
    name: i.name,
    profile: "Default"
  }, await me.writeAsync(Ke, e);
}
async function qm(i) {
  const e = Kf(i);
  return await me.readAsync(e, "json");
}
async function Dk(i) {
  return await me.readAsync(Jf(i), "json");
}
async function Nk(i) {
  return await me.readAsync(Vf(i), "json");
}
async function Bk(i) {
  return (await me.readAsync(Ke, "json")).playlists.find((t) => t.name == i);
}
async function Uk(i) {
  if (!i) return;
  const e = await pe.get(i);
  if (!(!e.data || e.status !== 200))
    return e.data;
}
async function zk(i) {
  if (!i) return;
  const e = await pe.get(i);
  if (!(!e.data || e.status !== 200))
    return e.data;
}
async function Hk(i) {
  const { currentPlaylist: e } = await qt(), t = It(e.name, i);
  let s = await me.readAsync(It(e.name, i), "json");
  return s || (s = { vod: [], series: [], live: [] }, await me.writeAsync(t, s)), s;
}
async function Gk(i) {
  const { currentPlaylist: e } = await qt(), t = It(e.name, e.profile);
  return await me.writeAsync(t, i), i;
}
async function Wk(i) {
  const e = await me.readAsync(Ke, "json"), t = e.playlists.find((s) => s.name == i);
  return t ? (e.currentPlaylist = {
    name: i,
    profile: t.profiles[0]
  }, await me.writeAsync(Ke, e), !0) : !1;
}
async function Kk(i) {
  const e = await me.readAsync(Ke, "json"), t = e.playlists.map((s) => (s.name == i && (s.updatedAt = /* @__PURE__ */ new Date()), s));
  return e.playlists = t, await me.writeAsync(Ke, e);
}
async function Jk(i) {
  const e = await qt(), t = It(e.currentPlaylist.name, i), s = e.playlists.find((p) => p.name === e.currentPlaylist.name);
  if (s == null ? void 0 : s.profiles.find((p) => p === i)) return !1;
  const c = e.playlists.map((p) => (p.name === e.currentPlaylist.name && p.profiles.push(i), p));
  e.playlists = c, await me.writeAsync(Ke, e);
  let l = await me.readAsync(It(e.currentPlaylist.name, i), "json");
  return l ? !1 : (l = { vod: [], series: [], live: [] }, await me.writeAsync(t, l), !0);
}
async function Vk(i) {
  const e = await me.readAsync(Ke, "json");
  return e.currentPlaylist.profile = i, await me.writeAsync(Ke, e), !0;
}
async function Xk({ profile: i, newName: e }) {
  const t = await qt(), s = It(t.currentPlaylist.name, i);
  t.currentPlaylist.profile = e;
  const o = t.playlists.map((c) => {
    if (c.name === t.currentPlaylist.name) {
      const l = c.profiles.filter((p) => p !== i);
      l.push(e), c.profiles = l;
    }
    return c;
  });
  return t.playlists = o, await me.writeAsync(Ke, t), await me.renameAsync(s, `${e}.json`);
}
async function Yk(i) {
  const e = await qt();
  let t = [];
  const s = e.playlists.map((c) => {
    if (c.name === e.currentPlaylist.name) {
      const l = c.profiles.filter((p) => p !== i);
      c.profiles = l, t = l;
    }
    return c;
  });
  e.currentPlaylist.profile = t[0], e.playlists = s, await me.writeAsync(Ke, e);
  const o = It(e.currentPlaylist.name, i);
  await me.removeAsync(o);
}
async function Zk(i) {
  const e = await qt();
  if (e.playlists) {
    const t = e.playlists.filter((s) => s.name !== i);
    e.playlists = t;
  }
  return e.playlists.length === 0 ? e.currentPlaylist = {
    name: "",
    profile: ""
  } : e.currentPlaylist = {
    name: e.playlists[0].name,
    profile: "Default"
  }, await me.removeAsync(mE(i)), await me.writeAsync(Ke, e), e;
}
function Zn(i) {
  return Array.isArray ? Array.isArray(i) : Dm(i) === "[object Array]";
}
const Qk = 1 / 0;
function eA(i) {
  if (typeof i == "string")
    return i;
  let e = i + "";
  return e == "0" && 1 / i == -Qk ? "-0" : e;
}
function nA(i) {
  return i == null ? "" : eA(i);
}
function Dn(i) {
  return typeof i == "string";
}
function $m(i) {
  return typeof i == "number";
}
function tA(i) {
  return i === !0 || i === !1 || iA(i) && Dm(i) == "[object Boolean]";
}
function jm(i) {
  return typeof i == "object";
}
function iA(i) {
  return jm(i) && i !== null;
}
function on(i) {
  return i != null;
}
function Jo(i) {
  return !i.trim().length;
}
function Dm(i) {
  return i == null ? i === void 0 ? "[object Undefined]" : "[object Null]" : Object.prototype.toString.call(i);
}
const aA = "Incorrect 'index' type", sA = (i) => `Invalid value for key ${i}`, rA = (i) => `Pattern length exceeds max of ${i}.`, oA = (i) => `Missing ${i} property in key`, cA = (i) => `Property 'weight' in key '${i}' must be a positive integer`, _d = Object.prototype.hasOwnProperty;
class uA {
  constructor(e) {
    this._keys = [], this._keyMap = {};
    let t = 0;
    e.forEach((s) => {
      let o = Nm(s);
      this._keys.push(o), this._keyMap[o.id] = o, t += o.weight;
    }), this._keys.forEach((s) => {
      s.weight /= t;
    });
  }
  get(e) {
    return this._keyMap[e];
  }
  keys() {
    return this._keys;
  }
  toJSON() {
    return JSON.stringify(this._keys);
  }
}
function Nm(i) {
  let e = null, t = null, s = null, o = 1, c = null;
  if (Dn(i) || Zn(i))
    s = i, e = Ed(i), t = mc(i);
  else {
    if (!_d.call(i, "name"))
      throw new Error(oA("name"));
    const l = i.name;
    if (s = l, _d.call(i, "weight") && (o = i.weight, o <= 0))
      throw new Error(cA(l));
    e = Ed(l), t = mc(l), c = i.getFn;
  }
  return { path: e, id: t, weight: o, src: s, getFn: c };
}
function Ed(i) {
  return Zn(i) ? i : i.split(".");
}
function mc(i) {
  return Zn(i) ? i.join(".") : i;
}
function lA(i, e) {
  let t = [], s = !1;
  const o = (c, l, p) => {
    if (on(c))
      if (!l[p])
        t.push(c);
      else {
        let f = l[p];
        const m = c[f];
        if (!on(m))
          return;
        if (p === l.length - 1 && (Dn(m) || $m(m) || tA(m)))
          t.push(nA(m));
        else if (Zn(m)) {
          s = !0;
          for (let h = 0, g = m.length; h < g; h += 1)
            o(m[h], l, p + 1);
        } else l.length && o(m, l, p + 1);
      }
  };
  return o(i, Dn(e) ? e.split(".") : e, 0), s ? t : t[0];
}
const pA = {
  // Whether the matches should be included in the result set. When `true`, each record in the result
  // set will include the indices of the matched characters.
  // These can consequently be used for highlighting purposes.
  includeMatches: !1,
  // When `true`, the matching function will continue to the end of a search pattern even if
  // a perfect match has already been located in the string.
  findAllMatches: !1,
  // Minimum number of characters that must be matched before a result is considered a match
  minMatchCharLength: 1
}, dA = {
  // When `true`, the algorithm continues searching to the end of the input even if a perfect
  // match is found before the end of the same input.
  isCaseSensitive: !1,
  // When true, the matching function will continue to the end of a search pattern even if
  includeScore: !1,
  // List of properties that will be searched. This also supports nested properties.
  keys: [],
  // Whether to sort the result list, by score
  shouldSort: !0,
  // Default sort function: sort by ascending score, ascending index
  sortFn: (i, e) => i.score === e.score ? i.idx < e.idx ? -1 : 1 : i.score < e.score ? -1 : 1
}, fA = {
  // Approximately where in the text is the pattern expected to be found?
  location: 0,
  // At what point does the match algorithm give up. A threshold of '0.0' requires a perfect match
  // (of both letters and location), a threshold of '1.0' would match anything.
  threshold: 0.6,
  // Determines how close the match must be to the fuzzy location (specified above).
  // An exact letter match which is 'distance' characters away from the fuzzy location
  // would score as a complete mismatch. A distance of '0' requires the match be at
  // the exact location specified, a threshold of '1000' would require a perfect match
  // to be within 800 characters of the fuzzy location to be found using a 0.8 threshold.
  distance: 100
}, mA = {
  // When `true`, it enables the use of unix-like search commands
  useExtendedSearch: !1,
  // The get function to use when fetching an object's properties.
  // The default will search nested paths *ie foo.bar.baz*
  getFn: lA,
  // When `true`, search will ignore `location` and `distance`, so it won't matter
  // where in the string the pattern appears.
  // More info: https://fusejs.io/concepts/scoring-theory.html#fuzziness-score
  ignoreLocation: !1,
  // When `true`, the calculation for the relevance score (used for sorting) will
  // ignore the field-length norm.
  // More info: https://fusejs.io/concepts/scoring-theory.html#field-length-norm
  ignoreFieldNorm: !1,
  // The weight to determine how much field length norm effects scoring.
  fieldNormWeight: 1
};
var Z = {
  ...dA,
  ...pA,
  ...fA,
  ...mA
};
const hA = /[^ ]+/g;
function vA(i = 1, e = 3) {
  const t = /* @__PURE__ */ new Map(), s = Math.pow(10, e);
  return {
    get(o) {
      const c = o.match(hA).length;
      if (t.has(c))
        return t.get(c);
      const l = 1 / Math.pow(c, 0.5 * i), p = parseFloat(Math.round(l * s) / s);
      return t.set(c, p), p;
    },
    clear() {
      t.clear();
    }
  };
}
class eu {
  constructor({
    getFn: e = Z.getFn,
    fieldNormWeight: t = Z.fieldNormWeight
  } = {}) {
    this.norm = vA(t, 3), this.getFn = e, this.isCreated = !1, this.setIndexRecords();
  }
  setSources(e = []) {
    this.docs = e;
  }
  setIndexRecords(e = []) {
    this.records = e;
  }
  setKeys(e = []) {
    this.keys = e, this._keysMap = {}, e.forEach((t, s) => {
      this._keysMap[t.id] = s;
    });
  }
  create() {
    this.isCreated || !this.docs.length || (this.isCreated = !0, Dn(this.docs[0]) ? this.docs.forEach((e, t) => {
      this._addString(e, t);
    }) : this.docs.forEach((e, t) => {
      this._addObject(e, t);
    }), this.norm.clear());
  }
  // Adds a doc to the end of the index
  add(e) {
    const t = this.size();
    Dn(e) ? this._addString(e, t) : this._addObject(e, t);
  }
  // Removes the doc at the specified index of the index
  removeAt(e) {
    this.records.splice(e, 1);
    for (let t = e, s = this.size(); t < s; t += 1)
      this.records[t].i -= 1;
  }
  getValueForItemAtKeyId(e, t) {
    return e[this._keysMap[t]];
  }
  size() {
    return this.records.length;
  }
  _addString(e, t) {
    if (!on(e) || Jo(e))
      return;
    let s = {
      v: e,
      i: t,
      n: this.norm.get(e)
    };
    this.records.push(s);
  }
  _addObject(e, t) {
    let s = { i: t, $: {} };
    this.keys.forEach((o, c) => {
      let l = o.getFn ? o.getFn(e) : this.getFn(e, o.path);
      if (on(l)) {
        if (Zn(l)) {
          let p = [];
          const f = [{ nestedArrIndex: -1, value: l }];
          for (; f.length; ) {
            const { nestedArrIndex: m, value: h } = f.pop();
            if (on(h))
              if (Dn(h) && !Jo(h)) {
                let g = {
                  v: h,
                  i: m,
                  n: this.norm.get(h)
                };
                p.push(g);
              } else Zn(h) && h.forEach((g, y) => {
                f.push({
                  nestedArrIndex: y,
                  value: g
                });
              });
          }
          s.$[c] = p;
        } else if (Dn(l) && !Jo(l)) {
          let p = {
            v: l,
            n: this.norm.get(l)
          };
          s.$[c] = p;
        }
      }
    }), this.records.push(s);
  }
  toJSON() {
    return {
      keys: this.keys,
      records: this.records
    };
  }
}
function Bm(i, e, { getFn: t = Z.getFn, fieldNormWeight: s = Z.fieldNormWeight } = {}) {
  const o = new eu({ getFn: t, fieldNormWeight: s });
  return o.setKeys(i.map(Nm)), o.setSources(e), o.create(), o;
}
function xA(i, { getFn: e = Z.getFn, fieldNormWeight: t = Z.fieldNormWeight } = {}) {
  const { keys: s, records: o } = i, c = new eu({ getFn: e, fieldNormWeight: t });
  return c.setKeys(s), c.setIndexRecords(o), c;
}
function ds(i, {
  errors: e = 0,
  currentLocation: t = 0,
  expectedLocation: s = 0,
  distance: o = Z.distance,
  ignoreLocation: c = Z.ignoreLocation
} = {}) {
  const l = e / i.length;
  if (c)
    return l;
  const p = Math.abs(s - t);
  return o ? l + p / o : p ? 1 : l;
}
function gA(i = [], e = Z.minMatchCharLength) {
  let t = [], s = -1, o = -1, c = 0;
  for (let l = i.length; c < l; c += 1) {
    let p = i[c];
    p && s === -1 ? s = c : !p && s !== -1 && (o = c - 1, o - s + 1 >= e && t.push([s, o]), s = -1);
  }
  return i[c - 1] && c - s >= e && t.push([s, c - 1]), t;
}
const At = 32;
function bA(i, e, t, {
  location: s = Z.location,
  distance: o = Z.distance,
  threshold: c = Z.threshold,
  findAllMatches: l = Z.findAllMatches,
  minMatchCharLength: p = Z.minMatchCharLength,
  includeMatches: f = Z.includeMatches,
  ignoreLocation: m = Z.ignoreLocation
} = {}) {
  if (e.length > At)
    throw new Error(rA(At));
  const h = e.length, g = i.length, y = Math.max(0, Math.min(s, g));
  let S = c, _ = y;
  const O = p > 1 || f, C = O ? Array(g) : [];
  let F;
  for (; (F = i.indexOf(e, _)) > -1; ) {
    let D = ds(e, {
      currentLocation: F,
      expectedLocation: y,
      distance: o,
      ignoreLocation: m
    });
    if (S = Math.min(D, S), _ = F + h, O) {
      let H = 0;
      for (; H < h; )
        C[F + H] = 1, H += 1;
    }
  }
  _ = -1;
  let $ = [], q = 1, G = h + g;
  const z = 1 << h - 1;
  for (let D = 0; D < h; D += 1) {
    let H = 0, V = G;
    for (; H < V; )
      ds(e, {
        errors: D,
        currentLocation: y + V,
        expectedLocation: y,
        distance: o,
        ignoreLocation: m
      }) <= S ? H = V : G = V, V = Math.floor((G - H) / 2 + H);
    G = V;
    let Ie = Math.max(1, y - V + 1), Fe = l ? g : Math.min(y + V, g) + h, De = Array(Fe + 2);
    De[Fe + 1] = (1 << D) - 1;
    for (let ue = Fe; ue >= Ie; ue -= 1) {
      let ze = ue - 1, Ln = t[i.charAt(ze)];
      if (O && (C[ze] = +!!Ln), De[ue] = (De[ue + 1] << 1 | 1) & Ln, D && (De[ue] |= ($[ue + 1] | $[ue]) << 1 | 1 | $[ue + 1]), De[ue] & z && (q = ds(e, {
        errors: D,
        currentLocation: ze,
        expectedLocation: y,
        distance: o,
        ignoreLocation: m
      }), q <= S)) {
        if (S = q, _ = ze, _ <= y)
          break;
        Ie = Math.max(1, 2 * y - _);
      }
    }
    if (ds(e, {
      errors: D + 1,
      currentLocation: y,
      expectedLocation: y,
      distance: o,
      ignoreLocation: m
    }) > S)
      break;
    $ = De;
  }
  const te = {
    isMatch: _ >= 0,
    // Count exact matches (those with a score of 0) to be "almost" exact
    score: Math.max(1e-3, q)
  };
  if (O) {
    const D = gA(C, p);
    D.length ? f && (te.indices = D) : te.isMatch = !1;
  }
  return te;
}
function yA(i) {
  let e = {};
  for (let t = 0, s = i.length; t < s; t += 1) {
    const o = i.charAt(t);
    e[o] = (e[o] || 0) | 1 << s - t - 1;
  }
  return e;
}
class Um {
  constructor(e, {
    location: t = Z.location,
    threshold: s = Z.threshold,
    distance: o = Z.distance,
    includeMatches: c = Z.includeMatches,
    findAllMatches: l = Z.findAllMatches,
    minMatchCharLength: p = Z.minMatchCharLength,
    isCaseSensitive: f = Z.isCaseSensitive,
    ignoreLocation: m = Z.ignoreLocation
  } = {}) {
    if (this.options = {
      location: t,
      threshold: s,
      distance: o,
      includeMatches: c,
      findAllMatches: l,
      minMatchCharLength: p,
      isCaseSensitive: f,
      ignoreLocation: m
    }, this.pattern = f ? e : e.toLowerCase(), this.chunks = [], !this.pattern.length)
      return;
    const h = (y, S) => {
      this.chunks.push({
        pattern: y,
        alphabet: yA(y),
        startIndex: S
      });
    }, g = this.pattern.length;
    if (g > At) {
      let y = 0;
      const S = g % At, _ = g - S;
      for (; y < _; )
        h(this.pattern.substr(y, At), y), y += At;
      if (S) {
        const O = g - At;
        h(this.pattern.substr(O), O);
      }
    } else
      h(this.pattern, 0);
  }
  searchIn(e) {
    const { isCaseSensitive: t, includeMatches: s } = this.options;
    if (t || (e = e.toLowerCase()), this.pattern === e) {
      let _ = {
        isMatch: !0,
        score: 0
      };
      return s && (_.indices = [[0, e.length - 1]]), _;
    }
    const {
      location: o,
      distance: c,
      threshold: l,
      findAllMatches: p,
      minMatchCharLength: f,
      ignoreLocation: m
    } = this.options;
    let h = [], g = 0, y = !1;
    this.chunks.forEach(({ pattern: _, alphabet: O, startIndex: C }) => {
      const { isMatch: F, score: $, indices: q } = bA(e, _, O, {
        location: o + C,
        distance: c,
        threshold: l,
        findAllMatches: p,
        minMatchCharLength: f,
        includeMatches: s,
        ignoreLocation: m
      });
      F && (y = !0), g += $, F && q && (h = [...h, ...q]);
    });
    let S = {
      isMatch: y,
      score: y ? g / this.chunks.length : 1
    };
    return y && s && (S.indices = h), S;
  }
}
class ht {
  constructor(e) {
    this.pattern = e;
  }
  static isMultiMatch(e) {
    return Rd(e, this.multiRegex);
  }
  static isSingleMatch(e) {
    return Rd(e, this.singleRegex);
  }
  search() {
  }
}
function Rd(i, e) {
  const t = i.match(e);
  return t ? t[1] : null;
}
class wA extends ht {
  constructor(e) {
    super(e);
  }
  static get type() {
    return "exact";
  }
  static get multiRegex() {
    return /^="(.*)"$/;
  }
  static get singleRegex() {
    return /^=(.*)$/;
  }
  search(e) {
    const t = e === this.pattern;
    return {
      isMatch: t,
      score: t ? 0 : 1,
      indices: [0, this.pattern.length - 1]
    };
  }
}
class _A extends ht {
  constructor(e) {
    super(e);
  }
  static get type() {
    return "inverse-exact";
  }
  static get multiRegex() {
    return /^!"(.*)"$/;
  }
  static get singleRegex() {
    return /^!(.*)$/;
  }
  search(e) {
    const s = e.indexOf(this.pattern) === -1;
    return {
      isMatch: s,
      score: s ? 0 : 1,
      indices: [0, e.length - 1]
    };
  }
}
class EA extends ht {
  constructor(e) {
    super(e);
  }
  static get type() {
    return "prefix-exact";
  }
  static get multiRegex() {
    return /^\^"(.*)"$/;
  }
  static get singleRegex() {
    return /^\^(.*)$/;
  }
  search(e) {
    const t = e.startsWith(this.pattern);
    return {
      isMatch: t,
      score: t ? 0 : 1,
      indices: [0, this.pattern.length - 1]
    };
  }
}
class RA extends ht {
  constructor(e) {
    super(e);
  }
  static get type() {
    return "inverse-prefix-exact";
  }
  static get multiRegex() {
    return /^!\^"(.*)"$/;
  }
  static get singleRegex() {
    return /^!\^(.*)$/;
  }
  search(e) {
    const t = !e.startsWith(this.pattern);
    return {
      isMatch: t,
      score: t ? 0 : 1,
      indices: [0, e.length - 1]
    };
  }
}
class SA extends ht {
  constructor(e) {
    super(e);
  }
  static get type() {
    return "suffix-exact";
  }
  static get multiRegex() {
    return /^"(.*)"\$$/;
  }
  static get singleRegex() {
    return /^(.*)\$$/;
  }
  search(e) {
    const t = e.endsWith(this.pattern);
    return {
      isMatch: t,
      score: t ? 0 : 1,
      indices: [e.length - this.pattern.length, e.length - 1]
    };
  }
}
class kA extends ht {
  constructor(e) {
    super(e);
  }
  static get type() {
    return "inverse-suffix-exact";
  }
  static get multiRegex() {
    return /^!"(.*)"\$$/;
  }
  static get singleRegex() {
    return /^!(.*)\$$/;
  }
  search(e) {
    const t = !e.endsWith(this.pattern);
    return {
      isMatch: t,
      score: t ? 0 : 1,
      indices: [0, e.length - 1]
    };
  }
}
class zm extends ht {
  constructor(e, {
    location: t = Z.location,
    threshold: s = Z.threshold,
    distance: o = Z.distance,
    includeMatches: c = Z.includeMatches,
    findAllMatches: l = Z.findAllMatches,
    minMatchCharLength: p = Z.minMatchCharLength,
    isCaseSensitive: f = Z.isCaseSensitive,
    ignoreLocation: m = Z.ignoreLocation
  } = {}) {
    super(e), this._bitapSearch = new Um(e, {
      location: t,
      threshold: s,
      distance: o,
      includeMatches: c,
      findAllMatches: l,
      minMatchCharLength: p,
      isCaseSensitive: f,
      ignoreLocation: m
    });
  }
  static get type() {
    return "fuzzy";
  }
  static get multiRegex() {
    return /^"(.*)"$/;
  }
  static get singleRegex() {
    return /^(.*)$/;
  }
  search(e) {
    return this._bitapSearch.searchIn(e);
  }
}
class Hm extends ht {
  constructor(e) {
    super(e);
  }
  static get type() {
    return "include";
  }
  static get multiRegex() {
    return /^'"(.*)"$/;
  }
  static get singleRegex() {
    return /^'(.*)$/;
  }
  search(e) {
    let t = 0, s;
    const o = [], c = this.pattern.length;
    for (; (s = e.indexOf(this.pattern, t)) > -1; )
      t = s + c, o.push([s, t - 1]);
    const l = !!o.length;
    return {
      isMatch: l,
      score: l ? 0 : 1,
      indices: o
    };
  }
}
const hc = [
  wA,
  Hm,
  EA,
  RA,
  kA,
  SA,
  _A,
  zm
], Sd = hc.length, AA = / +(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/, TA = "|";
function CA(i, e = {}) {
  return i.split(TA).map((t) => {
    let s = t.trim().split(AA).filter((c) => c && !!c.trim()), o = [];
    for (let c = 0, l = s.length; c < l; c += 1) {
      const p = s[c];
      let f = !1, m = -1;
      for (; !f && ++m < Sd; ) {
        const h = hc[m];
        let g = h.isMultiMatch(p);
        g && (o.push(new h(g, e)), f = !0);
      }
      if (!f)
        for (m = -1; ++m < Sd; ) {
          const h = hc[m];
          let g = h.isSingleMatch(p);
          if (g) {
            o.push(new h(g, e));
            break;
          }
        }
    }
    return o;
  });
}
const OA = /* @__PURE__ */ new Set([zm.type, Hm.type]);
class IA {
  constructor(e, {
    isCaseSensitive: t = Z.isCaseSensitive,
    includeMatches: s = Z.includeMatches,
    minMatchCharLength: o = Z.minMatchCharLength,
    ignoreLocation: c = Z.ignoreLocation,
    findAllMatches: l = Z.findAllMatches,
    location: p = Z.location,
    threshold: f = Z.threshold,
    distance: m = Z.distance
  } = {}) {
    this.query = null, this.options = {
      isCaseSensitive: t,
      includeMatches: s,
      minMatchCharLength: o,
      findAllMatches: l,
      ignoreLocation: c,
      location: p,
      threshold: f,
      distance: m
    }, this.pattern = t ? e : e.toLowerCase(), this.query = CA(this.pattern, this.options);
  }
  static condition(e, t) {
    return t.useExtendedSearch;
  }
  searchIn(e) {
    const t = this.query;
    if (!t)
      return {
        isMatch: !1,
        score: 1
      };
    const { includeMatches: s, isCaseSensitive: o } = this.options;
    e = o ? e : e.toLowerCase();
    let c = 0, l = [], p = 0;
    for (let f = 0, m = t.length; f < m; f += 1) {
      const h = t[f];
      l.length = 0, c = 0;
      for (let g = 0, y = h.length; g < y; g += 1) {
        const S = h[g], { isMatch: _, indices: O, score: C } = S.search(e);
        if (_) {
          if (c += 1, p += C, s) {
            const F = S.constructor.type;
            OA.has(F) ? l = [...l, ...O] : l.push(O);
          }
        } else {
          p = 0, c = 0, l.length = 0;
          break;
        }
      }
      if (c) {
        let g = {
          isMatch: !0,
          score: p / c
        };
        return s && (g.indices = l), g;
      }
    }
    return {
      isMatch: !1,
      score: 1
    };
  }
}
const vc = [];
function MA(...i) {
  vc.push(...i);
}
function xc(i, e) {
  for (let t = 0, s = vc.length; t < s; t += 1) {
    let o = vc[t];
    if (o.condition(i, e))
      return new o(i, e);
  }
  return new Um(i, e);
}
const Ms = {
  AND: "$and",
  OR: "$or"
}, gc = {
  PATH: "$path",
  PATTERN: "$val"
}, bc = (i) => !!(i[Ms.AND] || i[Ms.OR]), PA = (i) => !!i[gc.PATH], LA = (i) => !Zn(i) && jm(i) && !bc(i), kd = (i) => ({
  [Ms.AND]: Object.keys(i).map((e) => ({
    [e]: i[e]
  }))
});
function Gm(i, e, { auto: t = !0 } = {}) {
  const s = (o) => {
    let c = Object.keys(o);
    const l = PA(o);
    if (!l && c.length > 1 && !bc(o))
      return s(kd(o));
    if (LA(o)) {
      const f = l ? o[gc.PATH] : c[0], m = l ? o[gc.PATTERN] : o[f];
      if (!Dn(m))
        throw new Error(sA(f));
      const h = {
        keyId: mc(f),
        pattern: m
      };
      return t && (h.searcher = xc(m, e)), h;
    }
    let p = {
      children: [],
      operator: c[0]
    };
    return c.forEach((f) => {
      const m = o[f];
      Zn(m) && m.forEach((h) => {
        p.children.push(s(h));
      });
    }), p;
  };
  return bc(i) || (i = kd(i)), s(i);
}
function FA(i, { ignoreFieldNorm: e = Z.ignoreFieldNorm }) {
  i.forEach((t) => {
    let s = 1;
    t.matches.forEach(({ key: o, norm: c, score: l }) => {
      const p = o ? o.weight : null;
      s *= Math.pow(
        l === 0 && p ? Number.EPSILON : l,
        (p || 1) * (e ? 1 : c)
      );
    }), t.score = s;
  });
}
function qA(i, e) {
  const t = i.matches;
  e.matches = [], on(t) && t.forEach((s) => {
    if (!on(s.indices) || !s.indices.length)
      return;
    const { indices: o, value: c } = s;
    let l = {
      indices: o,
      value: c
    };
    s.key && (l.key = s.key.src), s.idx > -1 && (l.refIndex = s.idx), e.matches.push(l);
  });
}
function $A(i, e) {
  e.score = i.score;
}
function jA(i, e, {
  includeMatches: t = Z.includeMatches,
  includeScore: s = Z.includeScore
} = {}) {
  const o = [];
  return t && o.push(qA), s && o.push($A), i.map((c) => {
    const { idx: l } = c, p = {
      item: e[l],
      refIndex: l
    };
    return o.length && o.forEach((f) => {
      f(c, p);
    }), p;
  });
}
class ui {
  constructor(e, t = {}, s) {
    this.options = { ...Z, ...t }, this.options.useExtendedSearch, this._keyStore = new uA(this.options.keys), this.setCollection(e, s);
  }
  setCollection(e, t) {
    if (this._docs = e, t && !(t instanceof eu))
      throw new Error(aA);
    this._myIndex = t || Bm(this.options.keys, this._docs, {
      getFn: this.options.getFn,
      fieldNormWeight: this.options.fieldNormWeight
    });
  }
  add(e) {
    on(e) && (this._docs.push(e), this._myIndex.add(e));
  }
  remove(e = () => !1) {
    const t = [];
    for (let s = 0, o = this._docs.length; s < o; s += 1) {
      const c = this._docs[s];
      e(c, s) && (this.removeAt(s), s -= 1, o -= 1, t.push(c));
    }
    return t;
  }
  removeAt(e) {
    this._docs.splice(e, 1), this._myIndex.removeAt(e);
  }
  getIndex() {
    return this._myIndex;
  }
  search(e, { limit: t = -1 } = {}) {
    const {
      includeMatches: s,
      includeScore: o,
      shouldSort: c,
      sortFn: l,
      ignoreFieldNorm: p
    } = this.options;
    let f = Dn(e) ? Dn(this._docs[0]) ? this._searchStringList(e) : this._searchObjectList(e) : this._searchLogical(e);
    return FA(f, { ignoreFieldNorm: p }), c && f.sort(l), $m(t) && t > -1 && (f = f.slice(0, t)), jA(f, this._docs, {
      includeMatches: s,
      includeScore: o
    });
  }
  _searchStringList(e) {
    const t = xc(e, this.options), { records: s } = this._myIndex, o = [];
    return s.forEach(({ v: c, i: l, n: p }) => {
      if (!on(c))
        return;
      const { isMatch: f, score: m, indices: h } = t.searchIn(c);
      f && o.push({
        item: c,
        idx: l,
        matches: [{ score: m, value: c, norm: p, indices: h }]
      });
    }), o;
  }
  _searchLogical(e) {
    const t = Gm(e, this.options), s = (p, f, m) => {
      if (!p.children) {
        const { keyId: g, searcher: y } = p, S = this._findMatches({
          key: this._keyStore.get(g),
          value: this._myIndex.getValueForItemAtKeyId(f, g),
          searcher: y
        });
        return S && S.length ? [
          {
            idx: m,
            item: f,
            matches: S
          }
        ] : [];
      }
      const h = [];
      for (let g = 0, y = p.children.length; g < y; g += 1) {
        const S = p.children[g], _ = s(S, f, m);
        if (_.length)
          h.push(..._);
        else if (p.operator === Ms.AND)
          return [];
      }
      return h;
    }, o = this._myIndex.records, c = {}, l = [];
    return o.forEach(({ $: p, i: f }) => {
      if (on(p)) {
        let m = s(t, p, f);
        m.length && (c[f] || (c[f] = { idx: f, item: p, matches: [] }, l.push(c[f])), m.forEach(({ matches: h }) => {
          c[f].matches.push(...h);
        }));
      }
    }), l;
  }
  _searchObjectList(e) {
    const t = xc(e, this.options), { keys: s, records: o } = this._myIndex, c = [];
    return o.forEach(({ $: l, i: p }) => {
      if (!on(l))
        return;
      let f = [];
      s.forEach((m, h) => {
        f.push(
          ...this._findMatches({
            key: m,
            value: l[h],
            searcher: t
          })
        );
      }), f.length && c.push({
        idx: p,
        item: l,
        matches: f
      });
    }), c;
  }
  _findMatches({ key: e, value: t, searcher: s }) {
    if (!on(t))
      return [];
    let o = [];
    if (Zn(t))
      t.forEach(({ v: c, i: l, n: p }) => {
        if (!on(c))
          return;
        const { isMatch: f, score: m, indices: h } = s.searchIn(c);
        f && o.push({
          score: m,
          key: e,
          value: c,
          idx: l,
          norm: p,
          indices: h
        });
      });
    else {
      const { v: c, n: l } = t, { isMatch: p, score: f, indices: m } = s.searchIn(c);
      p && o.push({ score: f, key: e, value: c, norm: l, indices: m });
    }
    return o;
  }
}
ui.version = "7.0.0";
ui.createIndex = Bm;
ui.parseIndex = xA;
ui.config = Z;
ui.parseQuery = Gm;
MA(IA);
var Wm = {}, ir = {};
const DA = /* @__PURE__ */ J_(Pk);
var Ps = { exports: {} };
/**
 * @license
 * Lodash <https://lodash.com/>
 * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */
Ps.exports;
(function(i, e) {
  (function() {
    var t, s = "4.17.21", o = 200, c = "Unsupported core-js use. Try https://npms.io/search?q=ponyfill.", l = "Expected a function", p = "Invalid `variable` option passed into `_.template`", f = "__lodash_hash_undefined__", m = 500, h = "__lodash_placeholder__", g = 1, y = 2, S = 4, _ = 1, O = 2, C = 1, F = 2, $ = 4, q = 8, G = 16, z = 32, te = 64, D = 128, H = 256, V = 512, Ie = 30, Fe = "...", De = 800, vt = 16, ue = 1, ze = 2, Ln = 3, W = 1 / 0, K = 9007199254740991, Me = 17976931348623157e292, dn = NaN, he = 4294967295, Fn = he - 1, li = he >>> 1, fn = [
      ["ary", D],
      ["bind", C],
      ["bindKey", F],
      ["curry", q],
      ["curryRight", G],
      ["flip", V],
      ["partial", z],
      ["partialRight", te],
      ["rearg", H]
    ], Te = "[object Arguments]", xt = "[object Array]", pi = "[object AsyncFunction]", Se = "[object Boolean]", di = "[object Date]", Qm = "[object DOMException]", na = "[object Error]", ta = "[object Function]", nu = "[object GeneratorFunction]", En = "[object Map]", fi = "[object Number]", eh = "[object Null]", Un = "[object Object]", tu = "[object Promise]", nh = "[object Proxy]", mi = "[object RegExp]", Rn = "[object Set]", hi = "[object String]", ia = "[object Symbol]", th = "[object Undefined]", vi = "[object WeakMap]", ih = "[object WeakSet]", xi = "[object ArrayBuffer]", $t = "[object DataView]", sr = "[object Float32Array]", rr = "[object Float64Array]", or = "[object Int8Array]", cr = "[object Int16Array]", ur = "[object Int32Array]", lr = "[object Uint8Array]", pr = "[object Uint8ClampedArray]", dr = "[object Uint16Array]", fr = "[object Uint32Array]", ah = /\b__p \+= '';/g, sh = /\b(__p \+=) '' \+/g, rh = /(__e\(.*?\)|\b__t\)) \+\n'';/g, iu = /&(?:amp|lt|gt|quot|#39);/g, au = /[&<>"']/g, oh = RegExp(iu.source), ch = RegExp(au.source), uh = /<%-([\s\S]+?)%>/g, lh = /<%([\s\S]+?)%>/g, su = /<%=([\s\S]+?)%>/g, ph = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, dh = /^\w*$/, fh = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, mr = /[\\^$.*+?()[\]{}|]/g, mh = RegExp(mr.source), hr = /^\s+/, hh = /\s/, vh = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/, xh = /\{\n\/\* \[wrapped with (.+)\] \*/, gh = /,? & /, bh = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g, yh = /[()=,{}\[\]\/\s]/, wh = /\\(\\)?/g, _h = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g, ru = /\w*$/, Eh = /^[-+]0x[0-9a-f]+$/i, Rh = /^0b[01]+$/i, Sh = /^\[object .+?Constructor\]$/, kh = /^0o[0-7]+$/i, Ah = /^(?:0|[1-9]\d*)$/, Th = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g, aa = /($^)/, Ch = /['\n\r\u2028\u2029\\]/g, sa = "\\ud800-\\udfff", Oh = "\\u0300-\\u036f", Ih = "\\ufe20-\\ufe2f", Mh = "\\u20d0-\\u20ff", ou = Oh + Ih + Mh, cu = "\\u2700-\\u27bf", uu = "a-z\\xdf-\\xf6\\xf8-\\xff", Ph = "\\xac\\xb1\\xd7\\xf7", Lh = "\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf", Fh = "\\u2000-\\u206f", qh = " \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000", lu = "A-Z\\xc0-\\xd6\\xd8-\\xde", pu = "\\ufe0e\\ufe0f", du = Ph + Lh + Fh + qh, vr = "['’]", $h = "[" + sa + "]", fu = "[" + du + "]", ra = "[" + ou + "]", mu = "\\d+", jh = "[" + cu + "]", hu = "[" + uu + "]", vu = "[^" + sa + du + mu + cu + uu + lu + "]", xr = "\\ud83c[\\udffb-\\udfff]", Dh = "(?:" + ra + "|" + xr + ")", xu = "[^" + sa + "]", gr = "(?:\\ud83c[\\udde6-\\uddff]){2}", br = "[\\ud800-\\udbff][\\udc00-\\udfff]", jt = "[" + lu + "]", gu = "\\u200d", bu = "(?:" + hu + "|" + vu + ")", Nh = "(?:" + jt + "|" + vu + ")", yu = "(?:" + vr + "(?:d|ll|m|re|s|t|ve))?", wu = "(?:" + vr + "(?:D|LL|M|RE|S|T|VE))?", _u = Dh + "?", Eu = "[" + pu + "]?", Bh = "(?:" + gu + "(?:" + [xu, gr, br].join("|") + ")" + Eu + _u + ")*", Uh = "\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])", zh = "\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])", Ru = Eu + _u + Bh, Hh = "(?:" + [jh, gr, br].join("|") + ")" + Ru, Gh = "(?:" + [xu + ra + "?", ra, gr, br, $h].join("|") + ")", Wh = RegExp(vr, "g"), Kh = RegExp(ra, "g"), yr = RegExp(xr + "(?=" + xr + ")|" + Gh + Ru, "g"), Jh = RegExp([
      jt + "?" + hu + "+" + yu + "(?=" + [fu, jt, "$"].join("|") + ")",
      Nh + "+" + wu + "(?=" + [fu, jt + bu, "$"].join("|") + ")",
      jt + "?" + bu + "+" + yu,
      jt + "+" + wu,
      zh,
      Uh,
      mu,
      Hh
    ].join("|"), "g"), Vh = RegExp("[" + gu + sa + ou + pu + "]"), Xh = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/, Yh = [
      "Array",
      "Buffer",
      "DataView",
      "Date",
      "Error",
      "Float32Array",
      "Float64Array",
      "Function",
      "Int8Array",
      "Int16Array",
      "Int32Array",
      "Map",
      "Math",
      "Object",
      "Promise",
      "RegExp",
      "Set",
      "String",
      "Symbol",
      "TypeError",
      "Uint8Array",
      "Uint8ClampedArray",
      "Uint16Array",
      "Uint32Array",
      "WeakMap",
      "_",
      "clearTimeout",
      "isFinite",
      "parseInt",
      "setTimeout"
    ], Zh = -1, ge = {};
    ge[sr] = ge[rr] = ge[or] = ge[cr] = ge[ur] = ge[lr] = ge[pr] = ge[dr] = ge[fr] = !0, ge[Te] = ge[xt] = ge[xi] = ge[Se] = ge[$t] = ge[di] = ge[na] = ge[ta] = ge[En] = ge[fi] = ge[Un] = ge[mi] = ge[Rn] = ge[hi] = ge[vi] = !1;
    var xe = {};
    xe[Te] = xe[xt] = xe[xi] = xe[$t] = xe[Se] = xe[di] = xe[sr] = xe[rr] = xe[or] = xe[cr] = xe[ur] = xe[En] = xe[fi] = xe[Un] = xe[mi] = xe[Rn] = xe[hi] = xe[ia] = xe[lr] = xe[pr] = xe[dr] = xe[fr] = !0, xe[na] = xe[ta] = xe[vi] = !1;
    var Qh = {
      // Latin-1 Supplement block.
      À: "A",
      Á: "A",
      Â: "A",
      Ã: "A",
      Ä: "A",
      Å: "A",
      à: "a",
      á: "a",
      â: "a",
      ã: "a",
      ä: "a",
      å: "a",
      Ç: "C",
      ç: "c",
      Ð: "D",
      ð: "d",
      È: "E",
      É: "E",
      Ê: "E",
      Ë: "E",
      è: "e",
      é: "e",
      ê: "e",
      ë: "e",
      Ì: "I",
      Í: "I",
      Î: "I",
      Ï: "I",
      ì: "i",
      í: "i",
      î: "i",
      ï: "i",
      Ñ: "N",
      ñ: "n",
      Ò: "O",
      Ó: "O",
      Ô: "O",
      Õ: "O",
      Ö: "O",
      Ø: "O",
      ò: "o",
      ó: "o",
      ô: "o",
      õ: "o",
      ö: "o",
      ø: "o",
      Ù: "U",
      Ú: "U",
      Û: "U",
      Ü: "U",
      ù: "u",
      ú: "u",
      û: "u",
      ü: "u",
      Ý: "Y",
      ý: "y",
      ÿ: "y",
      Æ: "Ae",
      æ: "ae",
      Þ: "Th",
      þ: "th",
      ß: "ss",
      // Latin Extended-A block.
      Ā: "A",
      Ă: "A",
      Ą: "A",
      ā: "a",
      ă: "a",
      ą: "a",
      Ć: "C",
      Ĉ: "C",
      Ċ: "C",
      Č: "C",
      ć: "c",
      ĉ: "c",
      ċ: "c",
      č: "c",
      Ď: "D",
      Đ: "D",
      ď: "d",
      đ: "d",
      Ē: "E",
      Ĕ: "E",
      Ė: "E",
      Ę: "E",
      Ě: "E",
      ē: "e",
      ĕ: "e",
      ė: "e",
      ę: "e",
      ě: "e",
      Ĝ: "G",
      Ğ: "G",
      Ġ: "G",
      Ģ: "G",
      ĝ: "g",
      ğ: "g",
      ġ: "g",
      ģ: "g",
      Ĥ: "H",
      Ħ: "H",
      ĥ: "h",
      ħ: "h",
      Ĩ: "I",
      Ī: "I",
      Ĭ: "I",
      Į: "I",
      İ: "I",
      ĩ: "i",
      ī: "i",
      ĭ: "i",
      į: "i",
      ı: "i",
      Ĵ: "J",
      ĵ: "j",
      Ķ: "K",
      ķ: "k",
      ĸ: "k",
      Ĺ: "L",
      Ļ: "L",
      Ľ: "L",
      Ŀ: "L",
      Ł: "L",
      ĺ: "l",
      ļ: "l",
      ľ: "l",
      ŀ: "l",
      ł: "l",
      Ń: "N",
      Ņ: "N",
      Ň: "N",
      Ŋ: "N",
      ń: "n",
      ņ: "n",
      ň: "n",
      ŋ: "n",
      Ō: "O",
      Ŏ: "O",
      Ő: "O",
      ō: "o",
      ŏ: "o",
      ő: "o",
      Ŕ: "R",
      Ŗ: "R",
      Ř: "R",
      ŕ: "r",
      ŗ: "r",
      ř: "r",
      Ś: "S",
      Ŝ: "S",
      Ş: "S",
      Š: "S",
      ś: "s",
      ŝ: "s",
      ş: "s",
      š: "s",
      Ţ: "T",
      Ť: "T",
      Ŧ: "T",
      ţ: "t",
      ť: "t",
      ŧ: "t",
      Ũ: "U",
      Ū: "U",
      Ŭ: "U",
      Ů: "U",
      Ű: "U",
      Ų: "U",
      ũ: "u",
      ū: "u",
      ŭ: "u",
      ů: "u",
      ű: "u",
      ų: "u",
      Ŵ: "W",
      ŵ: "w",
      Ŷ: "Y",
      ŷ: "y",
      Ÿ: "Y",
      Ź: "Z",
      Ż: "Z",
      Ž: "Z",
      ź: "z",
      ż: "z",
      ž: "z",
      Ĳ: "IJ",
      ĳ: "ij",
      Œ: "Oe",
      œ: "oe",
      ŉ: "'n",
      ſ: "s"
    }, ev = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }, nv = {
      "&amp;": "&",
      "&lt;": "<",
      "&gt;": ">",
      "&quot;": '"',
      "&#39;": "'"
    }, tv = {
      "\\": "\\",
      "'": "'",
      "\n": "n",
      "\r": "r",
      "\u2028": "u2028",
      "\u2029": "u2029"
    }, iv = parseFloat, av = parseInt, Su = typeof On == "object" && On && On.Object === Object && On, sv = typeof self == "object" && self && self.Object === Object && self, qe = Su || sv || Function("return this")(), wr = e && !e.nodeType && e, gt = wr && !0 && i && !i.nodeType && i, ku = gt && gt.exports === wr, _r = ku && Su.process, mn = function() {
      try {
        var E = gt && gt.require && gt.require("util").types;
        return E || _r && _r.binding && _r.binding("util");
      } catch {
      }
    }(), Au = mn && mn.isArrayBuffer, Tu = mn && mn.isDate, Cu = mn && mn.isMap, Ou = mn && mn.isRegExp, Iu = mn && mn.isSet, Mu = mn && mn.isTypedArray;
    function en(E, I, A) {
      switch (A.length) {
        case 0:
          return E.call(I);
        case 1:
          return E.call(I, A[0]);
        case 2:
          return E.call(I, A[0], A[1]);
        case 3:
          return E.call(I, A[0], A[1], A[2]);
      }
      return E.apply(I, A);
    }
    function rv(E, I, A, B) {
      for (var Q = -1, le = E == null ? 0 : E.length; ++Q < le; ) {
        var Ce = E[Q];
        I(B, Ce, A(Ce), E);
      }
      return B;
    }
    function hn(E, I) {
      for (var A = -1, B = E == null ? 0 : E.length; ++A < B && I(E[A], A, E) !== !1; )
        ;
      return E;
    }
    function ov(E, I) {
      for (var A = E == null ? 0 : E.length; A-- && I(E[A], A, E) !== !1; )
        ;
      return E;
    }
    function Pu(E, I) {
      for (var A = -1, B = E == null ? 0 : E.length; ++A < B; )
        if (!I(E[A], A, E))
          return !1;
      return !0;
    }
    function Qn(E, I) {
      for (var A = -1, B = E == null ? 0 : E.length, Q = 0, le = []; ++A < B; ) {
        var Ce = E[A];
        I(Ce, A, E) && (le[Q++] = Ce);
      }
      return le;
    }
    function oa(E, I) {
      var A = E == null ? 0 : E.length;
      return !!A && Dt(E, I, 0) > -1;
    }
    function Er(E, I, A) {
      for (var B = -1, Q = E == null ? 0 : E.length; ++B < Q; )
        if (A(I, E[B]))
          return !0;
      return !1;
    }
    function ye(E, I) {
      for (var A = -1, B = E == null ? 0 : E.length, Q = Array(B); ++A < B; )
        Q[A] = I(E[A], A, E);
      return Q;
    }
    function et(E, I) {
      for (var A = -1, B = I.length, Q = E.length; ++A < B; )
        E[Q + A] = I[A];
      return E;
    }
    function Rr(E, I, A, B) {
      var Q = -1, le = E == null ? 0 : E.length;
      for (B && le && (A = E[++Q]); ++Q < le; )
        A = I(A, E[Q], Q, E);
      return A;
    }
    function cv(E, I, A, B) {
      var Q = E == null ? 0 : E.length;
      for (B && Q && (A = E[--Q]); Q--; )
        A = I(A, E[Q], Q, E);
      return A;
    }
    function Sr(E, I) {
      for (var A = -1, B = E == null ? 0 : E.length; ++A < B; )
        if (I(E[A], A, E))
          return !0;
      return !1;
    }
    var uv = kr("length");
    function lv(E) {
      return E.split("");
    }
    function pv(E) {
      return E.match(bh) || [];
    }
    function Lu(E, I, A) {
      var B;
      return A(E, function(Q, le, Ce) {
        if (I(Q, le, Ce))
          return B = le, !1;
      }), B;
    }
    function ca(E, I, A, B) {
      for (var Q = E.length, le = A + (B ? 1 : -1); B ? le-- : ++le < Q; )
        if (I(E[le], le, E))
          return le;
      return -1;
    }
    function Dt(E, I, A) {
      return I === I ? Ev(E, I, A) : ca(E, Fu, A);
    }
    function dv(E, I, A, B) {
      for (var Q = A - 1, le = E.length; ++Q < le; )
        if (B(E[Q], I))
          return Q;
      return -1;
    }
    function Fu(E) {
      return E !== E;
    }
    function qu(E, I) {
      var A = E == null ? 0 : E.length;
      return A ? Tr(E, I) / A : dn;
    }
    function kr(E) {
      return function(I) {
        return I == null ? t : I[E];
      };
    }
    function Ar(E) {
      return function(I) {
        return E == null ? t : E[I];
      };
    }
    function $u(E, I, A, B, Q) {
      return Q(E, function(le, Ce, ve) {
        A = B ? (B = !1, le) : I(A, le, Ce, ve);
      }), A;
    }
    function fv(E, I) {
      var A = E.length;
      for (E.sort(I); A--; )
        E[A] = E[A].value;
      return E;
    }
    function Tr(E, I) {
      for (var A, B = -1, Q = E.length; ++B < Q; ) {
        var le = I(E[B]);
        le !== t && (A = A === t ? le : A + le);
      }
      return A;
    }
    function Cr(E, I) {
      for (var A = -1, B = Array(E); ++A < E; )
        B[A] = I(A);
      return B;
    }
    function mv(E, I) {
      return ye(I, function(A) {
        return [A, E[A]];
      });
    }
    function ju(E) {
      return E && E.slice(0, Uu(E) + 1).replace(hr, "");
    }
    function nn(E) {
      return function(I) {
        return E(I);
      };
    }
    function Or(E, I) {
      return ye(I, function(A) {
        return E[A];
      });
    }
    function gi(E, I) {
      return E.has(I);
    }
    function Du(E, I) {
      for (var A = -1, B = E.length; ++A < B && Dt(I, E[A], 0) > -1; )
        ;
      return A;
    }
    function Nu(E, I) {
      for (var A = E.length; A-- && Dt(I, E[A], 0) > -1; )
        ;
      return A;
    }
    function hv(E, I) {
      for (var A = E.length, B = 0; A--; )
        E[A] === I && ++B;
      return B;
    }
    var vv = Ar(Qh), xv = Ar(ev);
    function gv(E) {
      return "\\" + tv[E];
    }
    function bv(E, I) {
      return E == null ? t : E[I];
    }
    function Nt(E) {
      return Vh.test(E);
    }
    function yv(E) {
      return Xh.test(E);
    }
    function wv(E) {
      for (var I, A = []; !(I = E.next()).done; )
        A.push(I.value);
      return A;
    }
    function Ir(E) {
      var I = -1, A = Array(E.size);
      return E.forEach(function(B, Q) {
        A[++I] = [Q, B];
      }), A;
    }
    function Bu(E, I) {
      return function(A) {
        return E(I(A));
      };
    }
    function nt(E, I) {
      for (var A = -1, B = E.length, Q = 0, le = []; ++A < B; ) {
        var Ce = E[A];
        (Ce === I || Ce === h) && (E[A] = h, le[Q++] = A);
      }
      return le;
    }
    function ua(E) {
      var I = -1, A = Array(E.size);
      return E.forEach(function(B) {
        A[++I] = B;
      }), A;
    }
    function _v(E) {
      var I = -1, A = Array(E.size);
      return E.forEach(function(B) {
        A[++I] = [B, B];
      }), A;
    }
    function Ev(E, I, A) {
      for (var B = A - 1, Q = E.length; ++B < Q; )
        if (E[B] === I)
          return B;
      return -1;
    }
    function Rv(E, I, A) {
      for (var B = A + 1; B--; )
        if (E[B] === I)
          return B;
      return B;
    }
    function Bt(E) {
      return Nt(E) ? kv(E) : uv(E);
    }
    function Sn(E) {
      return Nt(E) ? Av(E) : lv(E);
    }
    function Uu(E) {
      for (var I = E.length; I-- && hh.test(E.charAt(I)); )
        ;
      return I;
    }
    var Sv = Ar(nv);
    function kv(E) {
      for (var I = yr.lastIndex = 0; yr.test(E); )
        ++I;
      return I;
    }
    function Av(E) {
      return E.match(yr) || [];
    }
    function Tv(E) {
      return E.match(Jh) || [];
    }
    var Cv = function E(I) {
      I = I == null ? qe : Ut.defaults(qe.Object(), I, Ut.pick(qe, Yh));
      var A = I.Array, B = I.Date, Q = I.Error, le = I.Function, Ce = I.Math, ve = I.Object, Mr = I.RegExp, Ov = I.String, vn = I.TypeError, la = A.prototype, Iv = le.prototype, zt = ve.prototype, pa = I["__core-js_shared__"], da = Iv.toString, fe = zt.hasOwnProperty, Mv = 0, zu = function() {
        var n = /[^.]+$/.exec(pa && pa.keys && pa.keys.IE_PROTO || "");
        return n ? "Symbol(src)_1." + n : "";
      }(), fa = zt.toString, Pv = da.call(ve), Lv = qe._, Fv = Mr(
        "^" + da.call(fe).replace(mr, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
      ), ma = ku ? I.Buffer : t, tt = I.Symbol, ha = I.Uint8Array, Hu = ma ? ma.allocUnsafe : t, va = Bu(ve.getPrototypeOf, ve), Gu = ve.create, Wu = zt.propertyIsEnumerable, xa = la.splice, Ku = tt ? tt.isConcatSpreadable : t, bi = tt ? tt.iterator : t, bt = tt ? tt.toStringTag : t, ga = function() {
        try {
          var n = Rt(ve, "defineProperty");
          return n({}, "", {}), n;
        } catch {
        }
      }(), qv = I.clearTimeout !== qe.clearTimeout && I.clearTimeout, $v = B && B.now !== qe.Date.now && B.now, jv = I.setTimeout !== qe.setTimeout && I.setTimeout, ba = Ce.ceil, ya = Ce.floor, Pr = ve.getOwnPropertySymbols, Dv = ma ? ma.isBuffer : t, Ju = I.isFinite, Nv = la.join, Bv = Bu(ve.keys, ve), Oe = Ce.max, Ne = Ce.min, Uv = B.now, zv = I.parseInt, Vu = Ce.random, Hv = la.reverse, Lr = Rt(I, "DataView"), yi = Rt(I, "Map"), Fr = Rt(I, "Promise"), Ht = Rt(I, "Set"), wi = Rt(I, "WeakMap"), _i = Rt(ve, "create"), wa = wi && new wi(), Gt = {}, Gv = St(Lr), Wv = St(yi), Kv = St(Fr), Jv = St(Ht), Vv = St(wi), _a = tt ? tt.prototype : t, Ei = _a ? _a.valueOf : t, Xu = _a ? _a.toString : t;
      function v(n) {
        if (_e(n) && !ee(n) && !(n instanceof re)) {
          if (n instanceof xn)
            return n;
          if (fe.call(n, "__wrapped__"))
            return Yl(n);
        }
        return new xn(n);
      }
      var Wt = /* @__PURE__ */ function() {
        function n() {
        }
        return function(a) {
          if (!we(a))
            return {};
          if (Gu)
            return Gu(a);
          n.prototype = a;
          var r = new n();
          return n.prototype = t, r;
        };
      }();
      function Ea() {
      }
      function xn(n, a) {
        this.__wrapped__ = n, this.__actions__ = [], this.__chain__ = !!a, this.__index__ = 0, this.__values__ = t;
      }
      v.templateSettings = {
        /**
         * Used to detect `data` property values to be HTML-escaped.
         *
         * @memberOf _.templateSettings
         * @type {RegExp}
         */
        escape: uh,
        /**
         * Used to detect code to be evaluated.
         *
         * @memberOf _.templateSettings
         * @type {RegExp}
         */
        evaluate: lh,
        /**
         * Used to detect `data` property values to inject.
         *
         * @memberOf _.templateSettings
         * @type {RegExp}
         */
        interpolate: su,
        /**
         * Used to reference the data object in the template text.
         *
         * @memberOf _.templateSettings
         * @type {string}
         */
        variable: "",
        /**
         * Used to import variables into the compiled template.
         *
         * @memberOf _.templateSettings
         * @type {Object}
         */
        imports: {
          /**
           * A reference to the `lodash` function.
           *
           * @memberOf _.templateSettings.imports
           * @type {Function}
           */
          _: v
        }
      }, v.prototype = Ea.prototype, v.prototype.constructor = v, xn.prototype = Wt(Ea.prototype), xn.prototype.constructor = xn;
      function re(n) {
        this.__wrapped__ = n, this.__actions__ = [], this.__dir__ = 1, this.__filtered__ = !1, this.__iteratees__ = [], this.__takeCount__ = he, this.__views__ = [];
      }
      function Xv() {
        var n = new re(this.__wrapped__);
        return n.__actions__ = Je(this.__actions__), n.__dir__ = this.__dir__, n.__filtered__ = this.__filtered__, n.__iteratees__ = Je(this.__iteratees__), n.__takeCount__ = this.__takeCount__, n.__views__ = Je(this.__views__), n;
      }
      function Yv() {
        if (this.__filtered__) {
          var n = new re(this);
          n.__dir__ = -1, n.__filtered__ = !0;
        } else
          n = this.clone(), n.__dir__ *= -1;
        return n;
      }
      function Zv() {
        var n = this.__wrapped__.value(), a = this.__dir__, r = ee(n), u = a < 0, d = r ? n.length : 0, x = lg(0, d, this.__views__), b = x.start, w = x.end, R = w - b, M = u ? w : b - 1, P = this.__iteratees__, L = P.length, j = 0, U = Ne(R, this.__takeCount__);
        if (!r || !u && d == R && U == R)
          return yl(n, this.__actions__);
        var X = [];
        e:
          for (; R-- && j < U; ) {
            M += a;
            for (var ie = -1, Y = n[M]; ++ie < L; ) {
              var se = P[ie], oe = se.iteratee, sn = se.type, We = oe(Y);
              if (sn == ze)
                Y = We;
              else if (!We) {
                if (sn == ue)
                  continue e;
                break e;
              }
            }
            X[j++] = Y;
          }
        return X;
      }
      re.prototype = Wt(Ea.prototype), re.prototype.constructor = re;
      function yt(n) {
        var a = -1, r = n == null ? 0 : n.length;
        for (this.clear(); ++a < r; ) {
          var u = n[a];
          this.set(u[0], u[1]);
        }
      }
      function Qv() {
        this.__data__ = _i ? _i(null) : {}, this.size = 0;
      }
      function ex(n) {
        var a = this.has(n) && delete this.__data__[n];
        return this.size -= a ? 1 : 0, a;
      }
      function nx(n) {
        var a = this.__data__;
        if (_i) {
          var r = a[n];
          return r === f ? t : r;
        }
        return fe.call(a, n) ? a[n] : t;
      }
      function tx(n) {
        var a = this.__data__;
        return _i ? a[n] !== t : fe.call(a, n);
      }
      function ix(n, a) {
        var r = this.__data__;
        return this.size += this.has(n) ? 0 : 1, r[n] = _i && a === t ? f : a, this;
      }
      yt.prototype.clear = Qv, yt.prototype.delete = ex, yt.prototype.get = nx, yt.prototype.has = tx, yt.prototype.set = ix;
      function zn(n) {
        var a = -1, r = n == null ? 0 : n.length;
        for (this.clear(); ++a < r; ) {
          var u = n[a];
          this.set(u[0], u[1]);
        }
      }
      function ax() {
        this.__data__ = [], this.size = 0;
      }
      function sx(n) {
        var a = this.__data__, r = Ra(a, n);
        if (r < 0)
          return !1;
        var u = a.length - 1;
        return r == u ? a.pop() : xa.call(a, r, 1), --this.size, !0;
      }
      function rx(n) {
        var a = this.__data__, r = Ra(a, n);
        return r < 0 ? t : a[r][1];
      }
      function ox(n) {
        return Ra(this.__data__, n) > -1;
      }
      function cx(n, a) {
        var r = this.__data__, u = Ra(r, n);
        return u < 0 ? (++this.size, r.push([n, a])) : r[u][1] = a, this;
      }
      zn.prototype.clear = ax, zn.prototype.delete = sx, zn.prototype.get = rx, zn.prototype.has = ox, zn.prototype.set = cx;
      function Hn(n) {
        var a = -1, r = n == null ? 0 : n.length;
        for (this.clear(); ++a < r; ) {
          var u = n[a];
          this.set(u[0], u[1]);
        }
      }
      function ux() {
        this.size = 0, this.__data__ = {
          hash: new yt(),
          map: new (yi || zn)(),
          string: new yt()
        };
      }
      function lx(n) {
        var a = qa(this, n).delete(n);
        return this.size -= a ? 1 : 0, a;
      }
      function px(n) {
        return qa(this, n).get(n);
      }
      function dx(n) {
        return qa(this, n).has(n);
      }
      function fx(n, a) {
        var r = qa(this, n), u = r.size;
        return r.set(n, a), this.size += r.size == u ? 0 : 1, this;
      }
      Hn.prototype.clear = ux, Hn.prototype.delete = lx, Hn.prototype.get = px, Hn.prototype.has = dx, Hn.prototype.set = fx;
      function wt(n) {
        var a = -1, r = n == null ? 0 : n.length;
        for (this.__data__ = new Hn(); ++a < r; )
          this.add(n[a]);
      }
      function mx(n) {
        return this.__data__.set(n, f), this;
      }
      function hx(n) {
        return this.__data__.has(n);
      }
      wt.prototype.add = wt.prototype.push = mx, wt.prototype.has = hx;
      function kn(n) {
        var a = this.__data__ = new zn(n);
        this.size = a.size;
      }
      function vx() {
        this.__data__ = new zn(), this.size = 0;
      }
      function xx(n) {
        var a = this.__data__, r = a.delete(n);
        return this.size = a.size, r;
      }
      function gx(n) {
        return this.__data__.get(n);
      }
      function bx(n) {
        return this.__data__.has(n);
      }
      function yx(n, a) {
        var r = this.__data__;
        if (r instanceof zn) {
          var u = r.__data__;
          if (!yi || u.length < o - 1)
            return u.push([n, a]), this.size = ++r.size, this;
          r = this.__data__ = new Hn(u);
        }
        return r.set(n, a), this.size = r.size, this;
      }
      kn.prototype.clear = vx, kn.prototype.delete = xx, kn.prototype.get = gx, kn.prototype.has = bx, kn.prototype.set = yx;
      function Yu(n, a) {
        var r = ee(n), u = !r && kt(n), d = !r && !u && ot(n), x = !r && !u && !d && Xt(n), b = r || u || d || x, w = b ? Cr(n.length, Ov) : [], R = w.length;
        for (var M in n)
          (a || fe.call(n, M)) && !(b && // Safari 9 has enumerable `arguments.length` in strict mode.
          (M == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
          d && (M == "offset" || M == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
          x && (M == "buffer" || M == "byteLength" || M == "byteOffset") || // Skip index properties.
          Jn(M, R))) && w.push(M);
        return w;
      }
      function Zu(n) {
        var a = n.length;
        return a ? n[Wr(0, a - 1)] : t;
      }
      function wx(n, a) {
        return $a(Je(n), _t(a, 0, n.length));
      }
      function _x(n) {
        return $a(Je(n));
      }
      function qr(n, a, r) {
        (r !== t && !An(n[a], r) || r === t && !(a in n)) && Gn(n, a, r);
      }
      function Ri(n, a, r) {
        var u = n[a];
        (!(fe.call(n, a) && An(u, r)) || r === t && !(a in n)) && Gn(n, a, r);
      }
      function Ra(n, a) {
        for (var r = n.length; r--; )
          if (An(n[r][0], a))
            return r;
        return -1;
      }
      function Ex(n, a, r, u) {
        return it(n, function(d, x, b) {
          a(u, d, r(d), b);
        }), u;
      }
      function Qu(n, a) {
        return n && $n(a, Pe(a), n);
      }
      function Rx(n, a) {
        return n && $n(a, Xe(a), n);
      }
      function Gn(n, a, r) {
        a == "__proto__" && ga ? ga(n, a, {
          configurable: !0,
          enumerable: !0,
          value: r,
          writable: !0
        }) : n[a] = r;
      }
      function $r(n, a) {
        for (var r = -1, u = a.length, d = A(u), x = n == null; ++r < u; )
          d[r] = x ? t : go(n, a[r]);
        return d;
      }
      function _t(n, a, r) {
        return n === n && (r !== t && (n = n <= r ? n : r), a !== t && (n = n >= a ? n : a)), n;
      }
      function gn(n, a, r, u, d, x) {
        var b, w = a & g, R = a & y, M = a & S;
        if (r && (b = d ? r(n, u, d, x) : r(n)), b !== t)
          return b;
        if (!we(n))
          return n;
        var P = ee(n);
        if (P) {
          if (b = dg(n), !w)
            return Je(n, b);
        } else {
          var L = Be(n), j = L == ta || L == nu;
          if (ot(n))
            return El(n, w);
          if (L == Un || L == Te || j && !d) {
            if (b = R || j ? {} : Ul(n), !w)
              return R ? ng(n, Rx(b, n)) : eg(n, Qu(b, n));
          } else {
            if (!xe[L])
              return d ? n : {};
            b = fg(n, L, w);
          }
        }
        x || (x = new kn());
        var U = x.get(n);
        if (U)
          return U;
        x.set(n, b), xp(n) ? n.forEach(function(Y) {
          b.add(gn(Y, a, r, Y, n, x));
        }) : hp(n) && n.forEach(function(Y, se) {
          b.set(se, gn(Y, a, r, se, n, x));
        });
        var X = M ? R ? io : to : R ? Xe : Pe, ie = P ? t : X(n);
        return hn(ie || n, function(Y, se) {
          ie && (se = Y, Y = n[se]), Ri(b, se, gn(Y, a, r, se, n, x));
        }), b;
      }
      function Sx(n) {
        var a = Pe(n);
        return function(r) {
          return el(r, n, a);
        };
      }
      function el(n, a, r) {
        var u = r.length;
        if (n == null)
          return !u;
        for (n = ve(n); u--; ) {
          var d = r[u], x = a[d], b = n[d];
          if (b === t && !(d in n) || !x(b))
            return !1;
        }
        return !0;
      }
      function nl(n, a, r) {
        if (typeof n != "function")
          throw new vn(l);
        return Ii(function() {
          n.apply(t, r);
        }, a);
      }
      function Si(n, a, r, u) {
        var d = -1, x = oa, b = !0, w = n.length, R = [], M = a.length;
        if (!w)
          return R;
        r && (a = ye(a, nn(r))), u ? (x = Er, b = !1) : a.length >= o && (x = gi, b = !1, a = new wt(a));
        e:
          for (; ++d < w; ) {
            var P = n[d], L = r == null ? P : r(P);
            if (P = u || P !== 0 ? P : 0, b && L === L) {
              for (var j = M; j--; )
                if (a[j] === L)
                  continue e;
              R.push(P);
            } else x(a, L, u) || R.push(P);
          }
        return R;
      }
      var it = Tl(qn), tl = Tl(Dr, !0);
      function kx(n, a) {
        var r = !0;
        return it(n, function(u, d, x) {
          return r = !!a(u, d, x), r;
        }), r;
      }
      function Sa(n, a, r) {
        for (var u = -1, d = n.length; ++u < d; ) {
          var x = n[u], b = a(x);
          if (b != null && (w === t ? b === b && !an(b) : r(b, w)))
            var w = b, R = x;
        }
        return R;
      }
      function Ax(n, a, r, u) {
        var d = n.length;
        for (r = ne(r), r < 0 && (r = -r > d ? 0 : d + r), u = u === t || u > d ? d : ne(u), u < 0 && (u += d), u = r > u ? 0 : bp(u); r < u; )
          n[r++] = a;
        return n;
      }
      function il(n, a) {
        var r = [];
        return it(n, function(u, d, x) {
          a(u, d, x) && r.push(u);
        }), r;
      }
      function $e(n, a, r, u, d) {
        var x = -1, b = n.length;
        for (r || (r = hg), d || (d = []); ++x < b; ) {
          var w = n[x];
          a > 0 && r(w) ? a > 1 ? $e(w, a - 1, r, u, d) : et(d, w) : u || (d[d.length] = w);
        }
        return d;
      }
      var jr = Cl(), al = Cl(!0);
      function qn(n, a) {
        return n && jr(n, a, Pe);
      }
      function Dr(n, a) {
        return n && al(n, a, Pe);
      }
      function ka(n, a) {
        return Qn(a, function(r) {
          return Vn(n[r]);
        });
      }
      function Et(n, a) {
        a = st(a, n);
        for (var r = 0, u = a.length; n != null && r < u; )
          n = n[jn(a[r++])];
        return r && r == u ? n : t;
      }
      function sl(n, a, r) {
        var u = a(n);
        return ee(n) ? u : et(u, r(n));
      }
      function He(n) {
        return n == null ? n === t ? th : eh : bt && bt in ve(n) ? ug(n) : _g(n);
      }
      function Nr(n, a) {
        return n > a;
      }
      function Tx(n, a) {
        return n != null && fe.call(n, a);
      }
      function Cx(n, a) {
        return n != null && a in ve(n);
      }
      function Ox(n, a, r) {
        return n >= Ne(a, r) && n < Oe(a, r);
      }
      function Br(n, a, r) {
        for (var u = r ? Er : oa, d = n[0].length, x = n.length, b = x, w = A(x), R = 1 / 0, M = []; b--; ) {
          var P = n[b];
          b && a && (P = ye(P, nn(a))), R = Ne(P.length, R), w[b] = !r && (a || d >= 120 && P.length >= 120) ? new wt(b && P) : t;
        }
        P = n[0];
        var L = -1, j = w[0];
        e:
          for (; ++L < d && M.length < R; ) {
            var U = P[L], X = a ? a(U) : U;
            if (U = r || U !== 0 ? U : 0, !(j ? gi(j, X) : u(M, X, r))) {
              for (b = x; --b; ) {
                var ie = w[b];
                if (!(ie ? gi(ie, X) : u(n[b], X, r)))
                  continue e;
              }
              j && j.push(X), M.push(U);
            }
          }
        return M;
      }
      function Ix(n, a, r, u) {
        return qn(n, function(d, x, b) {
          a(u, r(d), x, b);
        }), u;
      }
      function ki(n, a, r) {
        a = st(a, n), n = Wl(n, a);
        var u = n == null ? n : n[jn(yn(a))];
        return u == null ? t : en(u, n, r);
      }
      function rl(n) {
        return _e(n) && He(n) == Te;
      }
      function Mx(n) {
        return _e(n) && He(n) == xi;
      }
      function Px(n) {
        return _e(n) && He(n) == di;
      }
      function Ai(n, a, r, u, d) {
        return n === a ? !0 : n == null || a == null || !_e(n) && !_e(a) ? n !== n && a !== a : Lx(n, a, r, u, Ai, d);
      }
      function Lx(n, a, r, u, d, x) {
        var b = ee(n), w = ee(a), R = b ? xt : Be(n), M = w ? xt : Be(a);
        R = R == Te ? Un : R, M = M == Te ? Un : M;
        var P = R == Un, L = M == Un, j = R == M;
        if (j && ot(n)) {
          if (!ot(a))
            return !1;
          b = !0, P = !1;
        }
        if (j && !P)
          return x || (x = new kn()), b || Xt(n) ? Dl(n, a, r, u, d, x) : og(n, a, R, r, u, d, x);
        if (!(r & _)) {
          var U = P && fe.call(n, "__wrapped__"), X = L && fe.call(a, "__wrapped__");
          if (U || X) {
            var ie = U ? n.value() : n, Y = X ? a.value() : a;
            return x || (x = new kn()), d(ie, Y, r, u, x);
          }
        }
        return j ? (x || (x = new kn()), cg(n, a, r, u, d, x)) : !1;
      }
      function Fx(n) {
        return _e(n) && Be(n) == En;
      }
      function Ur(n, a, r, u) {
        var d = r.length, x = d, b = !u;
        if (n == null)
          return !x;
        for (n = ve(n); d--; ) {
          var w = r[d];
          if (b && w[2] ? w[1] !== n[w[0]] : !(w[0] in n))
            return !1;
        }
        for (; ++d < x; ) {
          w = r[d];
          var R = w[0], M = n[R], P = w[1];
          if (b && w[2]) {
            if (M === t && !(R in n))
              return !1;
          } else {
            var L = new kn();
            if (u)
              var j = u(M, P, R, n, a, L);
            if (!(j === t ? Ai(P, M, _ | O, u, L) : j))
              return !1;
          }
        }
        return !0;
      }
      function ol(n) {
        if (!we(n) || xg(n))
          return !1;
        var a = Vn(n) ? Fv : Sh;
        return a.test(St(n));
      }
      function qx(n) {
        return _e(n) && He(n) == mi;
      }
      function $x(n) {
        return _e(n) && Be(n) == Rn;
      }
      function jx(n) {
        return _e(n) && za(n.length) && !!ge[He(n)];
      }
      function cl(n) {
        return typeof n == "function" ? n : n == null ? Ye : typeof n == "object" ? ee(n) ? pl(n[0], n[1]) : ll(n) : Op(n);
      }
      function zr(n) {
        if (!Oi(n))
          return Bv(n);
        var a = [];
        for (var r in ve(n))
          fe.call(n, r) && r != "constructor" && a.push(r);
        return a;
      }
      function Dx(n) {
        if (!we(n))
          return wg(n);
        var a = Oi(n), r = [];
        for (var u in n)
          u == "constructor" && (a || !fe.call(n, u)) || r.push(u);
        return r;
      }
      function Hr(n, a) {
        return n < a;
      }
      function ul(n, a) {
        var r = -1, u = Ve(n) ? A(n.length) : [];
        return it(n, function(d, x, b) {
          u[++r] = a(d, x, b);
        }), u;
      }
      function ll(n) {
        var a = so(n);
        return a.length == 1 && a[0][2] ? Hl(a[0][0], a[0][1]) : function(r) {
          return r === n || Ur(r, n, a);
        };
      }
      function pl(n, a) {
        return oo(n) && zl(a) ? Hl(jn(n), a) : function(r) {
          var u = go(r, n);
          return u === t && u === a ? bo(r, n) : Ai(a, u, _ | O);
        };
      }
      function Aa(n, a, r, u, d) {
        n !== a && jr(a, function(x, b) {
          if (d || (d = new kn()), we(x))
            Nx(n, a, b, r, Aa, u, d);
          else {
            var w = u ? u(uo(n, b), x, b + "", n, a, d) : t;
            w === t && (w = x), qr(n, b, w);
          }
        }, Xe);
      }
      function Nx(n, a, r, u, d, x, b) {
        var w = uo(n, r), R = uo(a, r), M = b.get(R);
        if (M) {
          qr(n, r, M);
          return;
        }
        var P = x ? x(w, R, r + "", n, a, b) : t, L = P === t;
        if (L) {
          var j = ee(R), U = !j && ot(R), X = !j && !U && Xt(R);
          P = R, j || U || X ? ee(w) ? P = w : ke(w) ? P = Je(w) : U ? (L = !1, P = El(R, !0)) : X ? (L = !1, P = Rl(R, !0)) : P = [] : Mi(R) || kt(R) ? (P = w, kt(w) ? P = yp(w) : (!we(w) || Vn(w)) && (P = Ul(R))) : L = !1;
        }
        L && (b.set(R, P), d(P, R, u, x, b), b.delete(R)), qr(n, r, P);
      }
      function dl(n, a) {
        var r = n.length;
        if (r)
          return a += a < 0 ? r : 0, Jn(a, r) ? n[a] : t;
      }
      function fl(n, a, r) {
        a.length ? a = ye(a, function(x) {
          return ee(x) ? function(b) {
            return Et(b, x.length === 1 ? x[0] : x);
          } : x;
        }) : a = [Ye];
        var u = -1;
        a = ye(a, nn(J()));
        var d = ul(n, function(x, b, w) {
          var R = ye(a, function(M) {
            return M(x);
          });
          return { criteria: R, index: ++u, value: x };
        });
        return fv(d, function(x, b) {
          return Qx(x, b, r);
        });
      }
      function Bx(n, a) {
        return ml(n, a, function(r, u) {
          return bo(n, u);
        });
      }
      function ml(n, a, r) {
        for (var u = -1, d = a.length, x = {}; ++u < d; ) {
          var b = a[u], w = Et(n, b);
          r(w, b) && Ti(x, st(b, n), w);
        }
        return x;
      }
      function Ux(n) {
        return function(a) {
          return Et(a, n);
        };
      }
      function Gr(n, a, r, u) {
        var d = u ? dv : Dt, x = -1, b = a.length, w = n;
        for (n === a && (a = Je(a)), r && (w = ye(n, nn(r))); ++x < b; )
          for (var R = 0, M = a[x], P = r ? r(M) : M; (R = d(w, P, R, u)) > -1; )
            w !== n && xa.call(w, R, 1), xa.call(n, R, 1);
        return n;
      }
      function hl(n, a) {
        for (var r = n ? a.length : 0, u = r - 1; r--; ) {
          var d = a[r];
          if (r == u || d !== x) {
            var x = d;
            Jn(d) ? xa.call(n, d, 1) : Vr(n, d);
          }
        }
        return n;
      }
      function Wr(n, a) {
        return n + ya(Vu() * (a - n + 1));
      }
      function zx(n, a, r, u) {
        for (var d = -1, x = Oe(ba((a - n) / (r || 1)), 0), b = A(x); x--; )
          b[u ? x : ++d] = n, n += r;
        return b;
      }
      function Kr(n, a) {
        var r = "";
        if (!n || a < 1 || a > K)
          return r;
        do
          a % 2 && (r += n), a = ya(a / 2), a && (n += n);
        while (a);
        return r;
      }
      function ae(n, a) {
        return lo(Gl(n, a, Ye), n + "");
      }
      function Hx(n) {
        return Zu(Yt(n));
      }
      function Gx(n, a) {
        var r = Yt(n);
        return $a(r, _t(a, 0, r.length));
      }
      function Ti(n, a, r, u) {
        if (!we(n))
          return n;
        a = st(a, n);
        for (var d = -1, x = a.length, b = x - 1, w = n; w != null && ++d < x; ) {
          var R = jn(a[d]), M = r;
          if (R === "__proto__" || R === "constructor" || R === "prototype")
            return n;
          if (d != b) {
            var P = w[R];
            M = u ? u(P, R, w) : t, M === t && (M = we(P) ? P : Jn(a[d + 1]) ? [] : {});
          }
          Ri(w, R, M), w = w[R];
        }
        return n;
      }
      var vl = wa ? function(n, a) {
        return wa.set(n, a), n;
      } : Ye, Wx = ga ? function(n, a) {
        return ga(n, "toString", {
          configurable: !0,
          enumerable: !1,
          value: wo(a),
          writable: !0
        });
      } : Ye;
      function Kx(n) {
        return $a(Yt(n));
      }
      function bn(n, a, r) {
        var u = -1, d = n.length;
        a < 0 && (a = -a > d ? 0 : d + a), r = r > d ? d : r, r < 0 && (r += d), d = a > r ? 0 : r - a >>> 0, a >>>= 0;
        for (var x = A(d); ++u < d; )
          x[u] = n[u + a];
        return x;
      }
      function Jx(n, a) {
        var r;
        return it(n, function(u, d, x) {
          return r = a(u, d, x), !r;
        }), !!r;
      }
      function Ta(n, a, r) {
        var u = 0, d = n == null ? u : n.length;
        if (typeof a == "number" && a === a && d <= li) {
          for (; u < d; ) {
            var x = u + d >>> 1, b = n[x];
            b !== null && !an(b) && (r ? b <= a : b < a) ? u = x + 1 : d = x;
          }
          return d;
        }
        return Jr(n, a, Ye, r);
      }
      function Jr(n, a, r, u) {
        var d = 0, x = n == null ? 0 : n.length;
        if (x === 0)
          return 0;
        a = r(a);
        for (var b = a !== a, w = a === null, R = an(a), M = a === t; d < x; ) {
          var P = ya((d + x) / 2), L = r(n[P]), j = L !== t, U = L === null, X = L === L, ie = an(L);
          if (b)
            var Y = u || X;
          else M ? Y = X && (u || j) : w ? Y = X && j && (u || !U) : R ? Y = X && j && !U && (u || !ie) : U || ie ? Y = !1 : Y = u ? L <= a : L < a;
          Y ? d = P + 1 : x = P;
        }
        return Ne(x, Fn);
      }
      function xl(n, a) {
        for (var r = -1, u = n.length, d = 0, x = []; ++r < u; ) {
          var b = n[r], w = a ? a(b) : b;
          if (!r || !An(w, R)) {
            var R = w;
            x[d++] = b === 0 ? 0 : b;
          }
        }
        return x;
      }
      function gl(n) {
        return typeof n == "number" ? n : an(n) ? dn : +n;
      }
      function tn(n) {
        if (typeof n == "string")
          return n;
        if (ee(n))
          return ye(n, tn) + "";
        if (an(n))
          return Xu ? Xu.call(n) : "";
        var a = n + "";
        return a == "0" && 1 / n == -W ? "-0" : a;
      }
      function at(n, a, r) {
        var u = -1, d = oa, x = n.length, b = !0, w = [], R = w;
        if (r)
          b = !1, d = Er;
        else if (x >= o) {
          var M = a ? null : sg(n);
          if (M)
            return ua(M);
          b = !1, d = gi, R = new wt();
        } else
          R = a ? [] : w;
        e:
          for (; ++u < x; ) {
            var P = n[u], L = a ? a(P) : P;
            if (P = r || P !== 0 ? P : 0, b && L === L) {
              for (var j = R.length; j--; )
                if (R[j] === L)
                  continue e;
              a && R.push(L), w.push(P);
            } else d(R, L, r) || (R !== w && R.push(L), w.push(P));
          }
        return w;
      }
      function Vr(n, a) {
        return a = st(a, n), n = Wl(n, a), n == null || delete n[jn(yn(a))];
      }
      function bl(n, a, r, u) {
        return Ti(n, a, r(Et(n, a)), u);
      }
      function Ca(n, a, r, u) {
        for (var d = n.length, x = u ? d : -1; (u ? x-- : ++x < d) && a(n[x], x, n); )
          ;
        return r ? bn(n, u ? 0 : x, u ? x + 1 : d) : bn(n, u ? x + 1 : 0, u ? d : x);
      }
      function yl(n, a) {
        var r = n;
        return r instanceof re && (r = r.value()), Rr(a, function(u, d) {
          return d.func.apply(d.thisArg, et([u], d.args));
        }, r);
      }
      function Xr(n, a, r) {
        var u = n.length;
        if (u < 2)
          return u ? at(n[0]) : [];
        for (var d = -1, x = A(u); ++d < u; )
          for (var b = n[d], w = -1; ++w < u; )
            w != d && (x[d] = Si(x[d] || b, n[w], a, r));
        return at($e(x, 1), a, r);
      }
      function wl(n, a, r) {
        for (var u = -1, d = n.length, x = a.length, b = {}; ++u < d; ) {
          var w = u < x ? a[u] : t;
          r(b, n[u], w);
        }
        return b;
      }
      function Yr(n) {
        return ke(n) ? n : [];
      }
      function Zr(n) {
        return typeof n == "function" ? n : Ye;
      }
      function st(n, a) {
        return ee(n) ? n : oo(n, a) ? [n] : Xl(de(n));
      }
      var Vx = ae;
      function rt(n, a, r) {
        var u = n.length;
        return r = r === t ? u : r, !a && r >= u ? n : bn(n, a, r);
      }
      var _l = qv || function(n) {
        return qe.clearTimeout(n);
      };
      function El(n, a) {
        if (a)
          return n.slice();
        var r = n.length, u = Hu ? Hu(r) : new n.constructor(r);
        return n.copy(u), u;
      }
      function Qr(n) {
        var a = new n.constructor(n.byteLength);
        return new ha(a).set(new ha(n)), a;
      }
      function Xx(n, a) {
        var r = a ? Qr(n.buffer) : n.buffer;
        return new n.constructor(r, n.byteOffset, n.byteLength);
      }
      function Yx(n) {
        var a = new n.constructor(n.source, ru.exec(n));
        return a.lastIndex = n.lastIndex, a;
      }
      function Zx(n) {
        return Ei ? ve(Ei.call(n)) : {};
      }
      function Rl(n, a) {
        var r = a ? Qr(n.buffer) : n.buffer;
        return new n.constructor(r, n.byteOffset, n.length);
      }
      function Sl(n, a) {
        if (n !== a) {
          var r = n !== t, u = n === null, d = n === n, x = an(n), b = a !== t, w = a === null, R = a === a, M = an(a);
          if (!w && !M && !x && n > a || x && b && R && !w && !M || u && b && R || !r && R || !d)
            return 1;
          if (!u && !x && !M && n < a || M && r && d && !u && !x || w && r && d || !b && d || !R)
            return -1;
        }
        return 0;
      }
      function Qx(n, a, r) {
        for (var u = -1, d = n.criteria, x = a.criteria, b = d.length, w = r.length; ++u < b; ) {
          var R = Sl(d[u], x[u]);
          if (R) {
            if (u >= w)
              return R;
            var M = r[u];
            return R * (M == "desc" ? -1 : 1);
          }
        }
        return n.index - a.index;
      }
      function kl(n, a, r, u) {
        for (var d = -1, x = n.length, b = r.length, w = -1, R = a.length, M = Oe(x - b, 0), P = A(R + M), L = !u; ++w < R; )
          P[w] = a[w];
        for (; ++d < b; )
          (L || d < x) && (P[r[d]] = n[d]);
        for (; M--; )
          P[w++] = n[d++];
        return P;
      }
      function Al(n, a, r, u) {
        for (var d = -1, x = n.length, b = -1, w = r.length, R = -1, M = a.length, P = Oe(x - w, 0), L = A(P + M), j = !u; ++d < P; )
          L[d] = n[d];
        for (var U = d; ++R < M; )
          L[U + R] = a[R];
        for (; ++b < w; )
          (j || d < x) && (L[U + r[b]] = n[d++]);
        return L;
      }
      function Je(n, a) {
        var r = -1, u = n.length;
        for (a || (a = A(u)); ++r < u; )
          a[r] = n[r];
        return a;
      }
      function $n(n, a, r, u) {
        var d = !r;
        r || (r = {});
        for (var x = -1, b = a.length; ++x < b; ) {
          var w = a[x], R = u ? u(r[w], n[w], w, r, n) : t;
          R === t && (R = n[w]), d ? Gn(r, w, R) : Ri(r, w, R);
        }
        return r;
      }
      function eg(n, a) {
        return $n(n, ro(n), a);
      }
      function ng(n, a) {
        return $n(n, Nl(n), a);
      }
      function Oa(n, a) {
        return function(r, u) {
          var d = ee(r) ? rv : Ex, x = a ? a() : {};
          return d(r, n, J(u, 2), x);
        };
      }
      function Kt(n) {
        return ae(function(a, r) {
          var u = -1, d = r.length, x = d > 1 ? r[d - 1] : t, b = d > 2 ? r[2] : t;
          for (x = n.length > 3 && typeof x == "function" ? (d--, x) : t, b && Ge(r[0], r[1], b) && (x = d < 3 ? t : x, d = 1), a = ve(a); ++u < d; ) {
            var w = r[u];
            w && n(a, w, u, x);
          }
          return a;
        });
      }
      function Tl(n, a) {
        return function(r, u) {
          if (r == null)
            return r;
          if (!Ve(r))
            return n(r, u);
          for (var d = r.length, x = a ? d : -1, b = ve(r); (a ? x-- : ++x < d) && u(b[x], x, b) !== !1; )
            ;
          return r;
        };
      }
      function Cl(n) {
        return function(a, r, u) {
          for (var d = -1, x = ve(a), b = u(a), w = b.length; w--; ) {
            var R = b[n ? w : ++d];
            if (r(x[R], R, x) === !1)
              break;
          }
          return a;
        };
      }
      function tg(n, a, r) {
        var u = a & C, d = Ci(n);
        function x() {
          var b = this && this !== qe && this instanceof x ? d : n;
          return b.apply(u ? r : this, arguments);
        }
        return x;
      }
      function Ol(n) {
        return function(a) {
          a = de(a);
          var r = Nt(a) ? Sn(a) : t, u = r ? r[0] : a.charAt(0), d = r ? rt(r, 1).join("") : a.slice(1);
          return u[n]() + d;
        };
      }
      function Jt(n) {
        return function(a) {
          return Rr(Tp(Ap(a).replace(Wh, "")), n, "");
        };
      }
      function Ci(n) {
        return function() {
          var a = arguments;
          switch (a.length) {
            case 0:
              return new n();
            case 1:
              return new n(a[0]);
            case 2:
              return new n(a[0], a[1]);
            case 3:
              return new n(a[0], a[1], a[2]);
            case 4:
              return new n(a[0], a[1], a[2], a[3]);
            case 5:
              return new n(a[0], a[1], a[2], a[3], a[4]);
            case 6:
              return new n(a[0], a[1], a[2], a[3], a[4], a[5]);
            case 7:
              return new n(a[0], a[1], a[2], a[3], a[4], a[5], a[6]);
          }
          var r = Wt(n.prototype), u = n.apply(r, a);
          return we(u) ? u : r;
        };
      }
      function ig(n, a, r) {
        var u = Ci(n);
        function d() {
          for (var x = arguments.length, b = A(x), w = x, R = Vt(d); w--; )
            b[w] = arguments[w];
          var M = x < 3 && b[0] !== R && b[x - 1] !== R ? [] : nt(b, R);
          if (x -= M.length, x < r)
            return Fl(
              n,
              a,
              Ia,
              d.placeholder,
              t,
              b,
              M,
              t,
              t,
              r - x
            );
          var P = this && this !== qe && this instanceof d ? u : n;
          return en(P, this, b);
        }
        return d;
      }
      function Il(n) {
        return function(a, r, u) {
          var d = ve(a);
          if (!Ve(a)) {
            var x = J(r, 3);
            a = Pe(a), r = function(w) {
              return x(d[w], w, d);
            };
          }
          var b = n(a, r, u);
          return b > -1 ? d[x ? a[b] : b] : t;
        };
      }
      function Ml(n) {
        return Kn(function(a) {
          var r = a.length, u = r, d = xn.prototype.thru;
          for (n && a.reverse(); u--; ) {
            var x = a[u];
            if (typeof x != "function")
              throw new vn(l);
            if (d && !b && Fa(x) == "wrapper")
              var b = new xn([], !0);
          }
          for (u = b ? u : r; ++u < r; ) {
            x = a[u];
            var w = Fa(x), R = w == "wrapper" ? ao(x) : t;
            R && co(R[0]) && R[1] == (D | q | z | H) && !R[4].length && R[9] == 1 ? b = b[Fa(R[0])].apply(b, R[3]) : b = x.length == 1 && co(x) ? b[w]() : b.thru(x);
          }
          return function() {
            var M = arguments, P = M[0];
            if (b && M.length == 1 && ee(P))
              return b.plant(P).value();
            for (var L = 0, j = r ? a[L].apply(this, M) : P; ++L < r; )
              j = a[L].call(this, j);
            return j;
          };
        });
      }
      function Ia(n, a, r, u, d, x, b, w, R, M) {
        var P = a & D, L = a & C, j = a & F, U = a & (q | G), X = a & V, ie = j ? t : Ci(n);
        function Y() {
          for (var se = arguments.length, oe = A(se), sn = se; sn--; )
            oe[sn] = arguments[sn];
          if (U)
            var We = Vt(Y), rn = hv(oe, We);
          if (u && (oe = kl(oe, u, d, U)), x && (oe = Al(oe, x, b, U)), se -= rn, U && se < M) {
            var Ae = nt(oe, We);
            return Fl(
              n,
              a,
              Ia,
              Y.placeholder,
              r,
              oe,
              Ae,
              w,
              R,
              M - se
            );
          }
          var Tn = L ? r : this, Yn = j ? Tn[n] : n;
          return se = oe.length, w ? oe = Eg(oe, w) : X && se > 1 && oe.reverse(), P && R < se && (oe.length = R), this && this !== qe && this instanceof Y && (Yn = ie || Ci(Yn)), Yn.apply(Tn, oe);
        }
        return Y;
      }
      function Pl(n, a) {
        return function(r, u) {
          return Ix(r, n, a(u), {});
        };
      }
      function Ma(n, a) {
        return function(r, u) {
          var d;
          if (r === t && u === t)
            return a;
          if (r !== t && (d = r), u !== t) {
            if (d === t)
              return u;
            typeof r == "string" || typeof u == "string" ? (r = tn(r), u = tn(u)) : (r = gl(r), u = gl(u)), d = n(r, u);
          }
          return d;
        };
      }
      function eo(n) {
        return Kn(function(a) {
          return a = ye(a, nn(J())), ae(function(r) {
            var u = this;
            return n(a, function(d) {
              return en(d, u, r);
            });
          });
        });
      }
      function Pa(n, a) {
        a = a === t ? " " : tn(a);
        var r = a.length;
        if (r < 2)
          return r ? Kr(a, n) : a;
        var u = Kr(a, ba(n / Bt(a)));
        return Nt(a) ? rt(Sn(u), 0, n).join("") : u.slice(0, n);
      }
      function ag(n, a, r, u) {
        var d = a & C, x = Ci(n);
        function b() {
          for (var w = -1, R = arguments.length, M = -1, P = u.length, L = A(P + R), j = this && this !== qe && this instanceof b ? x : n; ++M < P; )
            L[M] = u[M];
          for (; R--; )
            L[M++] = arguments[++w];
          return en(j, d ? r : this, L);
        }
        return b;
      }
      function Ll(n) {
        return function(a, r, u) {
          return u && typeof u != "number" && Ge(a, r, u) && (r = u = t), a = Xn(a), r === t ? (r = a, a = 0) : r = Xn(r), u = u === t ? a < r ? 1 : -1 : Xn(u), zx(a, r, u, n);
        };
      }
      function La(n) {
        return function(a, r) {
          return typeof a == "string" && typeof r == "string" || (a = wn(a), r = wn(r)), n(a, r);
        };
      }
      function Fl(n, a, r, u, d, x, b, w, R, M) {
        var P = a & q, L = P ? b : t, j = P ? t : b, U = P ? x : t, X = P ? t : x;
        a |= P ? z : te, a &= ~(P ? te : z), a & $ || (a &= ~(C | F));
        var ie = [
          n,
          a,
          d,
          U,
          L,
          X,
          j,
          w,
          R,
          M
        ], Y = r.apply(t, ie);
        return co(n) && Kl(Y, ie), Y.placeholder = u, Jl(Y, n, a);
      }
      function no(n) {
        var a = Ce[n];
        return function(r, u) {
          if (r = wn(r), u = u == null ? 0 : Ne(ne(u), 292), u && Ju(r)) {
            var d = (de(r) + "e").split("e"), x = a(d[0] + "e" + (+d[1] + u));
            return d = (de(x) + "e").split("e"), +(d[0] + "e" + (+d[1] - u));
          }
          return a(r);
        };
      }
      var sg = Ht && 1 / ua(new Ht([, -0]))[1] == W ? function(n) {
        return new Ht(n);
      } : Ro;
      function ql(n) {
        return function(a) {
          var r = Be(a);
          return r == En ? Ir(a) : r == Rn ? _v(a) : mv(a, n(a));
        };
      }
      function Wn(n, a, r, u, d, x, b, w) {
        var R = a & F;
        if (!R && typeof n != "function")
          throw new vn(l);
        var M = u ? u.length : 0;
        if (M || (a &= ~(z | te), u = d = t), b = b === t ? b : Oe(ne(b), 0), w = w === t ? w : ne(w), M -= d ? d.length : 0, a & te) {
          var P = u, L = d;
          u = d = t;
        }
        var j = R ? t : ao(n), U = [
          n,
          a,
          r,
          u,
          d,
          P,
          L,
          x,
          b,
          w
        ];
        if (j && yg(U, j), n = U[0], a = U[1], r = U[2], u = U[3], d = U[4], w = U[9] = U[9] === t ? R ? 0 : n.length : Oe(U[9] - M, 0), !w && a & (q | G) && (a &= ~(q | G)), !a || a == C)
          var X = tg(n, a, r);
        else a == q || a == G ? X = ig(n, a, w) : (a == z || a == (C | z)) && !d.length ? X = ag(n, a, r, u) : X = Ia.apply(t, U);
        var ie = j ? vl : Kl;
        return Jl(ie(X, U), n, a);
      }
      function $l(n, a, r, u) {
        return n === t || An(n, zt[r]) && !fe.call(u, r) ? a : n;
      }
      function jl(n, a, r, u, d, x) {
        return we(n) && we(a) && (x.set(a, n), Aa(n, a, t, jl, x), x.delete(a)), n;
      }
      function rg(n) {
        return Mi(n) ? t : n;
      }
      function Dl(n, a, r, u, d, x) {
        var b = r & _, w = n.length, R = a.length;
        if (w != R && !(b && R > w))
          return !1;
        var M = x.get(n), P = x.get(a);
        if (M && P)
          return M == a && P == n;
        var L = -1, j = !0, U = r & O ? new wt() : t;
        for (x.set(n, a), x.set(a, n); ++L < w; ) {
          var X = n[L], ie = a[L];
          if (u)
            var Y = b ? u(ie, X, L, a, n, x) : u(X, ie, L, n, a, x);
          if (Y !== t) {
            if (Y)
              continue;
            j = !1;
            break;
          }
          if (U) {
            if (!Sr(a, function(se, oe) {
              if (!gi(U, oe) && (X === se || d(X, se, r, u, x)))
                return U.push(oe);
            })) {
              j = !1;
              break;
            }
          } else if (!(X === ie || d(X, ie, r, u, x))) {
            j = !1;
            break;
          }
        }
        return x.delete(n), x.delete(a), j;
      }
      function og(n, a, r, u, d, x, b) {
        switch (r) {
          case $t:
            if (n.byteLength != a.byteLength || n.byteOffset != a.byteOffset)
              return !1;
            n = n.buffer, a = a.buffer;
          case xi:
            return !(n.byteLength != a.byteLength || !x(new ha(n), new ha(a)));
          case Se:
          case di:
          case fi:
            return An(+n, +a);
          case na:
            return n.name == a.name && n.message == a.message;
          case mi:
          case hi:
            return n == a + "";
          case En:
            var w = Ir;
          case Rn:
            var R = u & _;
            if (w || (w = ua), n.size != a.size && !R)
              return !1;
            var M = b.get(n);
            if (M)
              return M == a;
            u |= O, b.set(n, a);
            var P = Dl(w(n), w(a), u, d, x, b);
            return b.delete(n), P;
          case ia:
            if (Ei)
              return Ei.call(n) == Ei.call(a);
        }
        return !1;
      }
      function cg(n, a, r, u, d, x) {
        var b = r & _, w = to(n), R = w.length, M = to(a), P = M.length;
        if (R != P && !b)
          return !1;
        for (var L = R; L--; ) {
          var j = w[L];
          if (!(b ? j in a : fe.call(a, j)))
            return !1;
        }
        var U = x.get(n), X = x.get(a);
        if (U && X)
          return U == a && X == n;
        var ie = !0;
        x.set(n, a), x.set(a, n);
        for (var Y = b; ++L < R; ) {
          j = w[L];
          var se = n[j], oe = a[j];
          if (u)
            var sn = b ? u(oe, se, j, a, n, x) : u(se, oe, j, n, a, x);
          if (!(sn === t ? se === oe || d(se, oe, r, u, x) : sn)) {
            ie = !1;
            break;
          }
          Y || (Y = j == "constructor");
        }
        if (ie && !Y) {
          var We = n.constructor, rn = a.constructor;
          We != rn && "constructor" in n && "constructor" in a && !(typeof We == "function" && We instanceof We && typeof rn == "function" && rn instanceof rn) && (ie = !1);
        }
        return x.delete(n), x.delete(a), ie;
      }
      function Kn(n) {
        return lo(Gl(n, t, ep), n + "");
      }
      function to(n) {
        return sl(n, Pe, ro);
      }
      function io(n) {
        return sl(n, Xe, Nl);
      }
      var ao = wa ? function(n) {
        return wa.get(n);
      } : Ro;
      function Fa(n) {
        for (var a = n.name + "", r = Gt[a], u = fe.call(Gt, a) ? r.length : 0; u--; ) {
          var d = r[u], x = d.func;
          if (x == null || x == n)
            return d.name;
        }
        return a;
      }
      function Vt(n) {
        var a = fe.call(v, "placeholder") ? v : n;
        return a.placeholder;
      }
      function J() {
        var n = v.iteratee || _o;
        return n = n === _o ? cl : n, arguments.length ? n(arguments[0], arguments[1]) : n;
      }
      function qa(n, a) {
        var r = n.__data__;
        return vg(a) ? r[typeof a == "string" ? "string" : "hash"] : r.map;
      }
      function so(n) {
        for (var a = Pe(n), r = a.length; r--; ) {
          var u = a[r], d = n[u];
          a[r] = [u, d, zl(d)];
        }
        return a;
      }
      function Rt(n, a) {
        var r = bv(n, a);
        return ol(r) ? r : t;
      }
      function ug(n) {
        var a = fe.call(n, bt), r = n[bt];
        try {
          n[bt] = t;
          var u = !0;
        } catch {
        }
        var d = fa.call(n);
        return u && (a ? n[bt] = r : delete n[bt]), d;
      }
      var ro = Pr ? function(n) {
        return n == null ? [] : (n = ve(n), Qn(Pr(n), function(a) {
          return Wu.call(n, a);
        }));
      } : So, Nl = Pr ? function(n) {
        for (var a = []; n; )
          et(a, ro(n)), n = va(n);
        return a;
      } : So, Be = He;
      (Lr && Be(new Lr(new ArrayBuffer(1))) != $t || yi && Be(new yi()) != En || Fr && Be(Fr.resolve()) != tu || Ht && Be(new Ht()) != Rn || wi && Be(new wi()) != vi) && (Be = function(n) {
        var a = He(n), r = a == Un ? n.constructor : t, u = r ? St(r) : "";
        if (u)
          switch (u) {
            case Gv:
              return $t;
            case Wv:
              return En;
            case Kv:
              return tu;
            case Jv:
              return Rn;
            case Vv:
              return vi;
          }
        return a;
      });
      function lg(n, a, r) {
        for (var u = -1, d = r.length; ++u < d; ) {
          var x = r[u], b = x.size;
          switch (x.type) {
            case "drop":
              n += b;
              break;
            case "dropRight":
              a -= b;
              break;
            case "take":
              a = Ne(a, n + b);
              break;
            case "takeRight":
              n = Oe(n, a - b);
              break;
          }
        }
        return { start: n, end: a };
      }
      function pg(n) {
        var a = n.match(xh);
        return a ? a[1].split(gh) : [];
      }
      function Bl(n, a, r) {
        a = st(a, n);
        for (var u = -1, d = a.length, x = !1; ++u < d; ) {
          var b = jn(a[u]);
          if (!(x = n != null && r(n, b)))
            break;
          n = n[b];
        }
        return x || ++u != d ? x : (d = n == null ? 0 : n.length, !!d && za(d) && Jn(b, d) && (ee(n) || kt(n)));
      }
      function dg(n) {
        var a = n.length, r = new n.constructor(a);
        return a && typeof n[0] == "string" && fe.call(n, "index") && (r.index = n.index, r.input = n.input), r;
      }
      function Ul(n) {
        return typeof n.constructor == "function" && !Oi(n) ? Wt(va(n)) : {};
      }
      function fg(n, a, r) {
        var u = n.constructor;
        switch (a) {
          case xi:
            return Qr(n);
          case Se:
          case di:
            return new u(+n);
          case $t:
            return Xx(n, r);
          case sr:
          case rr:
          case or:
          case cr:
          case ur:
          case lr:
          case pr:
          case dr:
          case fr:
            return Rl(n, r);
          case En:
            return new u();
          case fi:
          case hi:
            return new u(n);
          case mi:
            return Yx(n);
          case Rn:
            return new u();
          case ia:
            return Zx(n);
        }
      }
      function mg(n, a) {
        var r = a.length;
        if (!r)
          return n;
        var u = r - 1;
        return a[u] = (r > 1 ? "& " : "") + a[u], a = a.join(r > 2 ? ", " : " "), n.replace(vh, `{
/* [wrapped with ` + a + `] */
`);
      }
      function hg(n) {
        return ee(n) || kt(n) || !!(Ku && n && n[Ku]);
      }
      function Jn(n, a) {
        var r = typeof n;
        return a = a ?? K, !!a && (r == "number" || r != "symbol" && Ah.test(n)) && n > -1 && n % 1 == 0 && n < a;
      }
      function Ge(n, a, r) {
        if (!we(r))
          return !1;
        var u = typeof a;
        return (u == "number" ? Ve(r) && Jn(a, r.length) : u == "string" && a in r) ? An(r[a], n) : !1;
      }
      function oo(n, a) {
        if (ee(n))
          return !1;
        var r = typeof n;
        return r == "number" || r == "symbol" || r == "boolean" || n == null || an(n) ? !0 : dh.test(n) || !ph.test(n) || a != null && n in ve(a);
      }
      function vg(n) {
        var a = typeof n;
        return a == "string" || a == "number" || a == "symbol" || a == "boolean" ? n !== "__proto__" : n === null;
      }
      function co(n) {
        var a = Fa(n), r = v[a];
        if (typeof r != "function" || !(a in re.prototype))
          return !1;
        if (n === r)
          return !0;
        var u = ao(r);
        return !!u && n === u[0];
      }
      function xg(n) {
        return !!zu && zu in n;
      }
      var gg = pa ? Vn : ko;
      function Oi(n) {
        var a = n && n.constructor, r = typeof a == "function" && a.prototype || zt;
        return n === r;
      }
      function zl(n) {
        return n === n && !we(n);
      }
      function Hl(n, a) {
        return function(r) {
          return r == null ? !1 : r[n] === a && (a !== t || n in ve(r));
        };
      }
      function bg(n) {
        var a = Ba(n, function(u) {
          return r.size === m && r.clear(), u;
        }), r = a.cache;
        return a;
      }
      function yg(n, a) {
        var r = n[1], u = a[1], d = r | u, x = d < (C | F | D), b = u == D && r == q || u == D && r == H && n[7].length <= a[8] || u == (D | H) && a[7].length <= a[8] && r == q;
        if (!(x || b))
          return n;
        u & C && (n[2] = a[2], d |= r & C ? 0 : $);
        var w = a[3];
        if (w) {
          var R = n[3];
          n[3] = R ? kl(R, w, a[4]) : w, n[4] = R ? nt(n[3], h) : a[4];
        }
        return w = a[5], w && (R = n[5], n[5] = R ? Al(R, w, a[6]) : w, n[6] = R ? nt(n[5], h) : a[6]), w = a[7], w && (n[7] = w), u & D && (n[8] = n[8] == null ? a[8] : Ne(n[8], a[8])), n[9] == null && (n[9] = a[9]), n[0] = a[0], n[1] = d, n;
      }
      function wg(n) {
        var a = [];
        if (n != null)
          for (var r in ve(n))
            a.push(r);
        return a;
      }
      function _g(n) {
        return fa.call(n);
      }
      function Gl(n, a, r) {
        return a = Oe(a === t ? n.length - 1 : a, 0), function() {
          for (var u = arguments, d = -1, x = Oe(u.length - a, 0), b = A(x); ++d < x; )
            b[d] = u[a + d];
          d = -1;
          for (var w = A(a + 1); ++d < a; )
            w[d] = u[d];
          return w[a] = r(b), en(n, this, w);
        };
      }
      function Wl(n, a) {
        return a.length < 2 ? n : Et(n, bn(a, 0, -1));
      }
      function Eg(n, a) {
        for (var r = n.length, u = Ne(a.length, r), d = Je(n); u--; ) {
          var x = a[u];
          n[u] = Jn(x, r) ? d[x] : t;
        }
        return n;
      }
      function uo(n, a) {
        if (!(a === "constructor" && typeof n[a] == "function") && a != "__proto__")
          return n[a];
      }
      var Kl = Vl(vl), Ii = jv || function(n, a) {
        return qe.setTimeout(n, a);
      }, lo = Vl(Wx);
      function Jl(n, a, r) {
        var u = a + "";
        return lo(n, mg(u, Rg(pg(u), r)));
      }
      function Vl(n) {
        var a = 0, r = 0;
        return function() {
          var u = Uv(), d = vt - (u - r);
          if (r = u, d > 0) {
            if (++a >= De)
              return arguments[0];
          } else
            a = 0;
          return n.apply(t, arguments);
        };
      }
      function $a(n, a) {
        var r = -1, u = n.length, d = u - 1;
        for (a = a === t ? u : a; ++r < a; ) {
          var x = Wr(r, d), b = n[x];
          n[x] = n[r], n[r] = b;
        }
        return n.length = a, n;
      }
      var Xl = bg(function(n) {
        var a = [];
        return n.charCodeAt(0) === 46 && a.push(""), n.replace(fh, function(r, u, d, x) {
          a.push(d ? x.replace(wh, "$1") : u || r);
        }), a;
      });
      function jn(n) {
        if (typeof n == "string" || an(n))
          return n;
        var a = n + "";
        return a == "0" && 1 / n == -W ? "-0" : a;
      }
      function St(n) {
        if (n != null) {
          try {
            return da.call(n);
          } catch {
          }
          try {
            return n + "";
          } catch {
          }
        }
        return "";
      }
      function Rg(n, a) {
        return hn(fn, function(r) {
          var u = "_." + r[0];
          a & r[1] && !oa(n, u) && n.push(u);
        }), n.sort();
      }
      function Yl(n) {
        if (n instanceof re)
          return n.clone();
        var a = new xn(n.__wrapped__, n.__chain__);
        return a.__actions__ = Je(n.__actions__), a.__index__ = n.__index__, a.__values__ = n.__values__, a;
      }
      function Sg(n, a, r) {
        (r ? Ge(n, a, r) : a === t) ? a = 1 : a = Oe(ne(a), 0);
        var u = n == null ? 0 : n.length;
        if (!u || a < 1)
          return [];
        for (var d = 0, x = 0, b = A(ba(u / a)); d < u; )
          b[x++] = bn(n, d, d += a);
        return b;
      }
      function kg(n) {
        for (var a = -1, r = n == null ? 0 : n.length, u = 0, d = []; ++a < r; ) {
          var x = n[a];
          x && (d[u++] = x);
        }
        return d;
      }
      function Ag() {
        var n = arguments.length;
        if (!n)
          return [];
        for (var a = A(n - 1), r = arguments[0], u = n; u--; )
          a[u - 1] = arguments[u];
        return et(ee(r) ? Je(r) : [r], $e(a, 1));
      }
      var Tg = ae(function(n, a) {
        return ke(n) ? Si(n, $e(a, 1, ke, !0)) : [];
      }), Cg = ae(function(n, a) {
        var r = yn(a);
        return ke(r) && (r = t), ke(n) ? Si(n, $e(a, 1, ke, !0), J(r, 2)) : [];
      }), Og = ae(function(n, a) {
        var r = yn(a);
        return ke(r) && (r = t), ke(n) ? Si(n, $e(a, 1, ke, !0), t, r) : [];
      });
      function Ig(n, a, r) {
        var u = n == null ? 0 : n.length;
        return u ? (a = r || a === t ? 1 : ne(a), bn(n, a < 0 ? 0 : a, u)) : [];
      }
      function Mg(n, a, r) {
        var u = n == null ? 0 : n.length;
        return u ? (a = r || a === t ? 1 : ne(a), a = u - a, bn(n, 0, a < 0 ? 0 : a)) : [];
      }
      function Pg(n, a) {
        return n && n.length ? Ca(n, J(a, 3), !0, !0) : [];
      }
      function Lg(n, a) {
        return n && n.length ? Ca(n, J(a, 3), !0) : [];
      }
      function Fg(n, a, r, u) {
        var d = n == null ? 0 : n.length;
        return d ? (r && typeof r != "number" && Ge(n, a, r) && (r = 0, u = d), Ax(n, a, r, u)) : [];
      }
      function Zl(n, a, r) {
        var u = n == null ? 0 : n.length;
        if (!u)
          return -1;
        var d = r == null ? 0 : ne(r);
        return d < 0 && (d = Oe(u + d, 0)), ca(n, J(a, 3), d);
      }
      function Ql(n, a, r) {
        var u = n == null ? 0 : n.length;
        if (!u)
          return -1;
        var d = u - 1;
        return r !== t && (d = ne(r), d = r < 0 ? Oe(u + d, 0) : Ne(d, u - 1)), ca(n, J(a, 3), d, !0);
      }
      function ep(n) {
        var a = n == null ? 0 : n.length;
        return a ? $e(n, 1) : [];
      }
      function qg(n) {
        var a = n == null ? 0 : n.length;
        return a ? $e(n, W) : [];
      }
      function $g(n, a) {
        var r = n == null ? 0 : n.length;
        return r ? (a = a === t ? 1 : ne(a), $e(n, a)) : [];
      }
      function jg(n) {
        for (var a = -1, r = n == null ? 0 : n.length, u = {}; ++a < r; ) {
          var d = n[a];
          u[d[0]] = d[1];
        }
        return u;
      }
      function np(n) {
        return n && n.length ? n[0] : t;
      }
      function Dg(n, a, r) {
        var u = n == null ? 0 : n.length;
        if (!u)
          return -1;
        var d = r == null ? 0 : ne(r);
        return d < 0 && (d = Oe(u + d, 0)), Dt(n, a, d);
      }
      function Ng(n) {
        var a = n == null ? 0 : n.length;
        return a ? bn(n, 0, -1) : [];
      }
      var Bg = ae(function(n) {
        var a = ye(n, Yr);
        return a.length && a[0] === n[0] ? Br(a) : [];
      }), Ug = ae(function(n) {
        var a = yn(n), r = ye(n, Yr);
        return a === yn(r) ? a = t : r.pop(), r.length && r[0] === n[0] ? Br(r, J(a, 2)) : [];
      }), zg = ae(function(n) {
        var a = yn(n), r = ye(n, Yr);
        return a = typeof a == "function" ? a : t, a && r.pop(), r.length && r[0] === n[0] ? Br(r, t, a) : [];
      });
      function Hg(n, a) {
        return n == null ? "" : Nv.call(n, a);
      }
      function yn(n) {
        var a = n == null ? 0 : n.length;
        return a ? n[a - 1] : t;
      }
      function Gg(n, a, r) {
        var u = n == null ? 0 : n.length;
        if (!u)
          return -1;
        var d = u;
        return r !== t && (d = ne(r), d = d < 0 ? Oe(u + d, 0) : Ne(d, u - 1)), a === a ? Rv(n, a, d) : ca(n, Fu, d, !0);
      }
      function Wg(n, a) {
        return n && n.length ? dl(n, ne(a)) : t;
      }
      var Kg = ae(tp);
      function tp(n, a) {
        return n && n.length && a && a.length ? Gr(n, a) : n;
      }
      function Jg(n, a, r) {
        return n && n.length && a && a.length ? Gr(n, a, J(r, 2)) : n;
      }
      function Vg(n, a, r) {
        return n && n.length && a && a.length ? Gr(n, a, t, r) : n;
      }
      var Xg = Kn(function(n, a) {
        var r = n == null ? 0 : n.length, u = $r(n, a);
        return hl(n, ye(a, function(d) {
          return Jn(d, r) ? +d : d;
        }).sort(Sl)), u;
      });
      function Yg(n, a) {
        var r = [];
        if (!(n && n.length))
          return r;
        var u = -1, d = [], x = n.length;
        for (a = J(a, 3); ++u < x; ) {
          var b = n[u];
          a(b, u, n) && (r.push(b), d.push(u));
        }
        return hl(n, d), r;
      }
      function po(n) {
        return n == null ? n : Hv.call(n);
      }
      function Zg(n, a, r) {
        var u = n == null ? 0 : n.length;
        return u ? (r && typeof r != "number" && Ge(n, a, r) ? (a = 0, r = u) : (a = a == null ? 0 : ne(a), r = r === t ? u : ne(r)), bn(n, a, r)) : [];
      }
      function Qg(n, a) {
        return Ta(n, a);
      }
      function eb(n, a, r) {
        return Jr(n, a, J(r, 2));
      }
      function nb(n, a) {
        var r = n == null ? 0 : n.length;
        if (r) {
          var u = Ta(n, a);
          if (u < r && An(n[u], a))
            return u;
        }
        return -1;
      }
      function tb(n, a) {
        return Ta(n, a, !0);
      }
      function ib(n, a, r) {
        return Jr(n, a, J(r, 2), !0);
      }
      function ab(n, a) {
        var r = n == null ? 0 : n.length;
        if (r) {
          var u = Ta(n, a, !0) - 1;
          if (An(n[u], a))
            return u;
        }
        return -1;
      }
      function sb(n) {
        return n && n.length ? xl(n) : [];
      }
      function rb(n, a) {
        return n && n.length ? xl(n, J(a, 2)) : [];
      }
      function ob(n) {
        var a = n == null ? 0 : n.length;
        return a ? bn(n, 1, a) : [];
      }
      function cb(n, a, r) {
        return n && n.length ? (a = r || a === t ? 1 : ne(a), bn(n, 0, a < 0 ? 0 : a)) : [];
      }
      function ub(n, a, r) {
        var u = n == null ? 0 : n.length;
        return u ? (a = r || a === t ? 1 : ne(a), a = u - a, bn(n, a < 0 ? 0 : a, u)) : [];
      }
      function lb(n, a) {
        return n && n.length ? Ca(n, J(a, 3), !1, !0) : [];
      }
      function pb(n, a) {
        return n && n.length ? Ca(n, J(a, 3)) : [];
      }
      var db = ae(function(n) {
        return at($e(n, 1, ke, !0));
      }), fb = ae(function(n) {
        var a = yn(n);
        return ke(a) && (a = t), at($e(n, 1, ke, !0), J(a, 2));
      }), mb = ae(function(n) {
        var a = yn(n);
        return a = typeof a == "function" ? a : t, at($e(n, 1, ke, !0), t, a);
      });
      function hb(n) {
        return n && n.length ? at(n) : [];
      }
      function vb(n, a) {
        return n && n.length ? at(n, J(a, 2)) : [];
      }
      function xb(n, a) {
        return a = typeof a == "function" ? a : t, n && n.length ? at(n, t, a) : [];
      }
      function fo(n) {
        if (!(n && n.length))
          return [];
        var a = 0;
        return n = Qn(n, function(r) {
          if (ke(r))
            return a = Oe(r.length, a), !0;
        }), Cr(a, function(r) {
          return ye(n, kr(r));
        });
      }
      function ip(n, a) {
        if (!(n && n.length))
          return [];
        var r = fo(n);
        return a == null ? r : ye(r, function(u) {
          return en(a, t, u);
        });
      }
      var gb = ae(function(n, a) {
        return ke(n) ? Si(n, a) : [];
      }), bb = ae(function(n) {
        return Xr(Qn(n, ke));
      }), yb = ae(function(n) {
        var a = yn(n);
        return ke(a) && (a = t), Xr(Qn(n, ke), J(a, 2));
      }), wb = ae(function(n) {
        var a = yn(n);
        return a = typeof a == "function" ? a : t, Xr(Qn(n, ke), t, a);
      }), _b = ae(fo);
      function Eb(n, a) {
        return wl(n || [], a || [], Ri);
      }
      function Rb(n, a) {
        return wl(n || [], a || [], Ti);
      }
      var Sb = ae(function(n) {
        var a = n.length, r = a > 1 ? n[a - 1] : t;
        return r = typeof r == "function" ? (n.pop(), r) : t, ip(n, r);
      });
      function ap(n) {
        var a = v(n);
        return a.__chain__ = !0, a;
      }
      function kb(n, a) {
        return a(n), n;
      }
      function ja(n, a) {
        return a(n);
      }
      var Ab = Kn(function(n) {
        var a = n.length, r = a ? n[0] : 0, u = this.__wrapped__, d = function(x) {
          return $r(x, n);
        };
        return a > 1 || this.__actions__.length || !(u instanceof re) || !Jn(r) ? this.thru(d) : (u = u.slice(r, +r + (a ? 1 : 0)), u.__actions__.push({
          func: ja,
          args: [d],
          thisArg: t
        }), new xn(u, this.__chain__).thru(function(x) {
          return a && !x.length && x.push(t), x;
        }));
      });
      function Tb() {
        return ap(this);
      }
      function Cb() {
        return new xn(this.value(), this.__chain__);
      }
      function Ob() {
        this.__values__ === t && (this.__values__ = gp(this.value()));
        var n = this.__index__ >= this.__values__.length, a = n ? t : this.__values__[this.__index__++];
        return { done: n, value: a };
      }
      function Ib() {
        return this;
      }
      function Mb(n) {
        for (var a, r = this; r instanceof Ea; ) {
          var u = Yl(r);
          u.__index__ = 0, u.__values__ = t, a ? d.__wrapped__ = u : a = u;
          var d = u;
          r = r.__wrapped__;
        }
        return d.__wrapped__ = n, a;
      }
      function Pb() {
        var n = this.__wrapped__;
        if (n instanceof re) {
          var a = n;
          return this.__actions__.length && (a = new re(this)), a = a.reverse(), a.__actions__.push({
            func: ja,
            args: [po],
            thisArg: t
          }), new xn(a, this.__chain__);
        }
        return this.thru(po);
      }
      function Lb() {
        return yl(this.__wrapped__, this.__actions__);
      }
      var Fb = Oa(function(n, a, r) {
        fe.call(n, r) ? ++n[r] : Gn(n, r, 1);
      });
      function qb(n, a, r) {
        var u = ee(n) ? Pu : kx;
        return r && Ge(n, a, r) && (a = t), u(n, J(a, 3));
      }
      function $b(n, a) {
        var r = ee(n) ? Qn : il;
        return r(n, J(a, 3));
      }
      var jb = Il(Zl), Db = Il(Ql);
      function Nb(n, a) {
        return $e(Da(n, a), 1);
      }
      function Bb(n, a) {
        return $e(Da(n, a), W);
      }
      function Ub(n, a, r) {
        return r = r === t ? 1 : ne(r), $e(Da(n, a), r);
      }
      function sp(n, a) {
        var r = ee(n) ? hn : it;
        return r(n, J(a, 3));
      }
      function rp(n, a) {
        var r = ee(n) ? ov : tl;
        return r(n, J(a, 3));
      }
      var zb = Oa(function(n, a, r) {
        fe.call(n, r) ? n[r].push(a) : Gn(n, r, [a]);
      });
      function Hb(n, a, r, u) {
        n = Ve(n) ? n : Yt(n), r = r && !u ? ne(r) : 0;
        var d = n.length;
        return r < 0 && (r = Oe(d + r, 0)), Ha(n) ? r <= d && n.indexOf(a, r) > -1 : !!d && Dt(n, a, r) > -1;
      }
      var Gb = ae(function(n, a, r) {
        var u = -1, d = typeof a == "function", x = Ve(n) ? A(n.length) : [];
        return it(n, function(b) {
          x[++u] = d ? en(a, b, r) : ki(b, a, r);
        }), x;
      }), Wb = Oa(function(n, a, r) {
        Gn(n, r, a);
      });
      function Da(n, a) {
        var r = ee(n) ? ye : ul;
        return r(n, J(a, 3));
      }
      function Kb(n, a, r, u) {
        return n == null ? [] : (ee(a) || (a = a == null ? [] : [a]), r = u ? t : r, ee(r) || (r = r == null ? [] : [r]), fl(n, a, r));
      }
      var Jb = Oa(function(n, a, r) {
        n[r ? 0 : 1].push(a);
      }, function() {
        return [[], []];
      });
      function Vb(n, a, r) {
        var u = ee(n) ? Rr : $u, d = arguments.length < 3;
        return u(n, J(a, 4), r, d, it);
      }
      function Xb(n, a, r) {
        var u = ee(n) ? cv : $u, d = arguments.length < 3;
        return u(n, J(a, 4), r, d, tl);
      }
      function Yb(n, a) {
        var r = ee(n) ? Qn : il;
        return r(n, Ua(J(a, 3)));
      }
      function Zb(n) {
        var a = ee(n) ? Zu : Hx;
        return a(n);
      }
      function Qb(n, a, r) {
        (r ? Ge(n, a, r) : a === t) ? a = 1 : a = ne(a);
        var u = ee(n) ? wx : Gx;
        return u(n, a);
      }
      function ey(n) {
        var a = ee(n) ? _x : Kx;
        return a(n);
      }
      function ny(n) {
        if (n == null)
          return 0;
        if (Ve(n))
          return Ha(n) ? Bt(n) : n.length;
        var a = Be(n);
        return a == En || a == Rn ? n.size : zr(n).length;
      }
      function ty(n, a, r) {
        var u = ee(n) ? Sr : Jx;
        return r && Ge(n, a, r) && (a = t), u(n, J(a, 3));
      }
      var iy = ae(function(n, a) {
        if (n == null)
          return [];
        var r = a.length;
        return r > 1 && Ge(n, a[0], a[1]) ? a = [] : r > 2 && Ge(a[0], a[1], a[2]) && (a = [a[0]]), fl(n, $e(a, 1), []);
      }), Na = $v || function() {
        return qe.Date.now();
      };
      function ay(n, a) {
        if (typeof a != "function")
          throw new vn(l);
        return n = ne(n), function() {
          if (--n < 1)
            return a.apply(this, arguments);
        };
      }
      function op(n, a, r) {
        return a = r ? t : a, a = n && a == null ? n.length : a, Wn(n, D, t, t, t, t, a);
      }
      function cp(n, a) {
        var r;
        if (typeof a != "function")
          throw new vn(l);
        return n = ne(n), function() {
          return --n > 0 && (r = a.apply(this, arguments)), n <= 1 && (a = t), r;
        };
      }
      var mo = ae(function(n, a, r) {
        var u = C;
        if (r.length) {
          var d = nt(r, Vt(mo));
          u |= z;
        }
        return Wn(n, u, a, r, d);
      }), up = ae(function(n, a, r) {
        var u = C | F;
        if (r.length) {
          var d = nt(r, Vt(up));
          u |= z;
        }
        return Wn(a, u, n, r, d);
      });
      function lp(n, a, r) {
        a = r ? t : a;
        var u = Wn(n, q, t, t, t, t, t, a);
        return u.placeholder = lp.placeholder, u;
      }
      function pp(n, a, r) {
        a = r ? t : a;
        var u = Wn(n, G, t, t, t, t, t, a);
        return u.placeholder = pp.placeholder, u;
      }
      function dp(n, a, r) {
        var u, d, x, b, w, R, M = 0, P = !1, L = !1, j = !0;
        if (typeof n != "function")
          throw new vn(l);
        a = wn(a) || 0, we(r) && (P = !!r.leading, L = "maxWait" in r, x = L ? Oe(wn(r.maxWait) || 0, a) : x, j = "trailing" in r ? !!r.trailing : j);
        function U(Ae) {
          var Tn = u, Yn = d;
          return u = d = t, M = Ae, b = n.apply(Yn, Tn), b;
        }
        function X(Ae) {
          return M = Ae, w = Ii(se, a), P ? U(Ae) : b;
        }
        function ie(Ae) {
          var Tn = Ae - R, Yn = Ae - M, Ip = a - Tn;
          return L ? Ne(Ip, x - Yn) : Ip;
        }
        function Y(Ae) {
          var Tn = Ae - R, Yn = Ae - M;
          return R === t || Tn >= a || Tn < 0 || L && Yn >= x;
        }
        function se() {
          var Ae = Na();
          if (Y(Ae))
            return oe(Ae);
          w = Ii(se, ie(Ae));
        }
        function oe(Ae) {
          return w = t, j && u ? U(Ae) : (u = d = t, b);
        }
        function sn() {
          w !== t && _l(w), M = 0, u = R = d = w = t;
        }
        function We() {
          return w === t ? b : oe(Na());
        }
        function rn() {
          var Ae = Na(), Tn = Y(Ae);
          if (u = arguments, d = this, R = Ae, Tn) {
            if (w === t)
              return X(R);
            if (L)
              return _l(w), w = Ii(se, a), U(R);
          }
          return w === t && (w = Ii(se, a)), b;
        }
        return rn.cancel = sn, rn.flush = We, rn;
      }
      var sy = ae(function(n, a) {
        return nl(n, 1, a);
      }), ry = ae(function(n, a, r) {
        return nl(n, wn(a) || 0, r);
      });
      function oy(n) {
        return Wn(n, V);
      }
      function Ba(n, a) {
        if (typeof n != "function" || a != null && typeof a != "function")
          throw new vn(l);
        var r = function() {
          var u = arguments, d = a ? a.apply(this, u) : u[0], x = r.cache;
          if (x.has(d))
            return x.get(d);
          var b = n.apply(this, u);
          return r.cache = x.set(d, b) || x, b;
        };
        return r.cache = new (Ba.Cache || Hn)(), r;
      }
      Ba.Cache = Hn;
      function Ua(n) {
        if (typeof n != "function")
          throw new vn(l);
        return function() {
          var a = arguments;
          switch (a.length) {
            case 0:
              return !n.call(this);
            case 1:
              return !n.call(this, a[0]);
            case 2:
              return !n.call(this, a[0], a[1]);
            case 3:
              return !n.call(this, a[0], a[1], a[2]);
          }
          return !n.apply(this, a);
        };
      }
      function cy(n) {
        return cp(2, n);
      }
      var uy = Vx(function(n, a) {
        a = a.length == 1 && ee(a[0]) ? ye(a[0], nn(J())) : ye($e(a, 1), nn(J()));
        var r = a.length;
        return ae(function(u) {
          for (var d = -1, x = Ne(u.length, r); ++d < x; )
            u[d] = a[d].call(this, u[d]);
          return en(n, this, u);
        });
      }), ho = ae(function(n, a) {
        var r = nt(a, Vt(ho));
        return Wn(n, z, t, a, r);
      }), fp = ae(function(n, a) {
        var r = nt(a, Vt(fp));
        return Wn(n, te, t, a, r);
      }), ly = Kn(function(n, a) {
        return Wn(n, H, t, t, t, a);
      });
      function py(n, a) {
        if (typeof n != "function")
          throw new vn(l);
        return a = a === t ? a : ne(a), ae(n, a);
      }
      function dy(n, a) {
        if (typeof n != "function")
          throw new vn(l);
        return a = a == null ? 0 : Oe(ne(a), 0), ae(function(r) {
          var u = r[a], d = rt(r, 0, a);
          return u && et(d, u), en(n, this, d);
        });
      }
      function fy(n, a, r) {
        var u = !0, d = !0;
        if (typeof n != "function")
          throw new vn(l);
        return we(r) && (u = "leading" in r ? !!r.leading : u, d = "trailing" in r ? !!r.trailing : d), dp(n, a, {
          leading: u,
          maxWait: a,
          trailing: d
        });
      }
      function my(n) {
        return op(n, 1);
      }
      function hy(n, a) {
        return ho(Zr(a), n);
      }
      function vy() {
        if (!arguments.length)
          return [];
        var n = arguments[0];
        return ee(n) ? n : [n];
      }
      function xy(n) {
        return gn(n, S);
      }
      function gy(n, a) {
        return a = typeof a == "function" ? a : t, gn(n, S, a);
      }
      function by(n) {
        return gn(n, g | S);
      }
      function yy(n, a) {
        return a = typeof a == "function" ? a : t, gn(n, g | S, a);
      }
      function wy(n, a) {
        return a == null || el(n, a, Pe(a));
      }
      function An(n, a) {
        return n === a || n !== n && a !== a;
      }
      var _y = La(Nr), Ey = La(function(n, a) {
        return n >= a;
      }), kt = rl(/* @__PURE__ */ function() {
        return arguments;
      }()) ? rl : function(n) {
        return _e(n) && fe.call(n, "callee") && !Wu.call(n, "callee");
      }, ee = A.isArray, Ry = Au ? nn(Au) : Mx;
      function Ve(n) {
        return n != null && za(n.length) && !Vn(n);
      }
      function ke(n) {
        return _e(n) && Ve(n);
      }
      function Sy(n) {
        return n === !0 || n === !1 || _e(n) && He(n) == Se;
      }
      var ot = Dv || ko, ky = Tu ? nn(Tu) : Px;
      function Ay(n) {
        return _e(n) && n.nodeType === 1 && !Mi(n);
      }
      function Ty(n) {
        if (n == null)
          return !0;
        if (Ve(n) && (ee(n) || typeof n == "string" || typeof n.splice == "function" || ot(n) || Xt(n) || kt(n)))
          return !n.length;
        var a = Be(n);
        if (a == En || a == Rn)
          return !n.size;
        if (Oi(n))
          return !zr(n).length;
        for (var r in n)
          if (fe.call(n, r))
            return !1;
        return !0;
      }
      function Cy(n, a) {
        return Ai(n, a);
      }
      function Oy(n, a, r) {
        r = typeof r == "function" ? r : t;
        var u = r ? r(n, a) : t;
        return u === t ? Ai(n, a, t, r) : !!u;
      }
      function vo(n) {
        if (!_e(n))
          return !1;
        var a = He(n);
        return a == na || a == Qm || typeof n.message == "string" && typeof n.name == "string" && !Mi(n);
      }
      function Iy(n) {
        return typeof n == "number" && Ju(n);
      }
      function Vn(n) {
        if (!we(n))
          return !1;
        var a = He(n);
        return a == ta || a == nu || a == pi || a == nh;
      }
      function mp(n) {
        return typeof n == "number" && n == ne(n);
      }
      function za(n) {
        return typeof n == "number" && n > -1 && n % 1 == 0 && n <= K;
      }
      function we(n) {
        var a = typeof n;
        return n != null && (a == "object" || a == "function");
      }
      function _e(n) {
        return n != null && typeof n == "object";
      }
      var hp = Cu ? nn(Cu) : Fx;
      function My(n, a) {
        return n === a || Ur(n, a, so(a));
      }
      function Py(n, a, r) {
        return r = typeof r == "function" ? r : t, Ur(n, a, so(a), r);
      }
      function Ly(n) {
        return vp(n) && n != +n;
      }
      function Fy(n) {
        if (gg(n))
          throw new Q(c);
        return ol(n);
      }
      function qy(n) {
        return n === null;
      }
      function $y(n) {
        return n == null;
      }
      function vp(n) {
        return typeof n == "number" || _e(n) && He(n) == fi;
      }
      function Mi(n) {
        if (!_e(n) || He(n) != Un)
          return !1;
        var a = va(n);
        if (a === null)
          return !0;
        var r = fe.call(a, "constructor") && a.constructor;
        return typeof r == "function" && r instanceof r && da.call(r) == Pv;
      }
      var xo = Ou ? nn(Ou) : qx;
      function jy(n) {
        return mp(n) && n >= -K && n <= K;
      }
      var xp = Iu ? nn(Iu) : $x;
      function Ha(n) {
        return typeof n == "string" || !ee(n) && _e(n) && He(n) == hi;
      }
      function an(n) {
        return typeof n == "symbol" || _e(n) && He(n) == ia;
      }
      var Xt = Mu ? nn(Mu) : jx;
      function Dy(n) {
        return n === t;
      }
      function Ny(n) {
        return _e(n) && Be(n) == vi;
      }
      function By(n) {
        return _e(n) && He(n) == ih;
      }
      var Uy = La(Hr), zy = La(function(n, a) {
        return n <= a;
      });
      function gp(n) {
        if (!n)
          return [];
        if (Ve(n))
          return Ha(n) ? Sn(n) : Je(n);
        if (bi && n[bi])
          return wv(n[bi]());
        var a = Be(n), r = a == En ? Ir : a == Rn ? ua : Yt;
        return r(n);
      }
      function Xn(n) {
        if (!n)
          return n === 0 ? n : 0;
        if (n = wn(n), n === W || n === -W) {
          var a = n < 0 ? -1 : 1;
          return a * Me;
        }
        return n === n ? n : 0;
      }
      function ne(n) {
        var a = Xn(n), r = a % 1;
        return a === a ? r ? a - r : a : 0;
      }
      function bp(n) {
        return n ? _t(ne(n), 0, he) : 0;
      }
      function wn(n) {
        if (typeof n == "number")
          return n;
        if (an(n))
          return dn;
        if (we(n)) {
          var a = typeof n.valueOf == "function" ? n.valueOf() : n;
          n = we(a) ? a + "" : a;
        }
        if (typeof n != "string")
          return n === 0 ? n : +n;
        n = ju(n);
        var r = Rh.test(n);
        return r || kh.test(n) ? av(n.slice(2), r ? 2 : 8) : Eh.test(n) ? dn : +n;
      }
      function yp(n) {
        return $n(n, Xe(n));
      }
      function Hy(n) {
        return n ? _t(ne(n), -K, K) : n === 0 ? n : 0;
      }
      function de(n) {
        return n == null ? "" : tn(n);
      }
      var Gy = Kt(function(n, a) {
        if (Oi(a) || Ve(a)) {
          $n(a, Pe(a), n);
          return;
        }
        for (var r in a)
          fe.call(a, r) && Ri(n, r, a[r]);
      }), wp = Kt(function(n, a) {
        $n(a, Xe(a), n);
      }), Ga = Kt(function(n, a, r, u) {
        $n(a, Xe(a), n, u);
      }), Wy = Kt(function(n, a, r, u) {
        $n(a, Pe(a), n, u);
      }), Ky = Kn($r);
      function Jy(n, a) {
        var r = Wt(n);
        return a == null ? r : Qu(r, a);
      }
      var Vy = ae(function(n, a) {
        n = ve(n);
        var r = -1, u = a.length, d = u > 2 ? a[2] : t;
        for (d && Ge(a[0], a[1], d) && (u = 1); ++r < u; )
          for (var x = a[r], b = Xe(x), w = -1, R = b.length; ++w < R; ) {
            var M = b[w], P = n[M];
            (P === t || An(P, zt[M]) && !fe.call(n, M)) && (n[M] = x[M]);
          }
        return n;
      }), Xy = ae(function(n) {
        return n.push(t, jl), en(_p, t, n);
      });
      function Yy(n, a) {
        return Lu(n, J(a, 3), qn);
      }
      function Zy(n, a) {
        return Lu(n, J(a, 3), Dr);
      }
      function Qy(n, a) {
        return n == null ? n : jr(n, J(a, 3), Xe);
      }
      function ew(n, a) {
        return n == null ? n : al(n, J(a, 3), Xe);
      }
      function nw(n, a) {
        return n && qn(n, J(a, 3));
      }
      function tw(n, a) {
        return n && Dr(n, J(a, 3));
      }
      function iw(n) {
        return n == null ? [] : ka(n, Pe(n));
      }
      function aw(n) {
        return n == null ? [] : ka(n, Xe(n));
      }
      function go(n, a, r) {
        var u = n == null ? t : Et(n, a);
        return u === t ? r : u;
      }
      function sw(n, a) {
        return n != null && Bl(n, a, Tx);
      }
      function bo(n, a) {
        return n != null && Bl(n, a, Cx);
      }
      var rw = Pl(function(n, a, r) {
        a != null && typeof a.toString != "function" && (a = fa.call(a)), n[a] = r;
      }, wo(Ye)), ow = Pl(function(n, a, r) {
        a != null && typeof a.toString != "function" && (a = fa.call(a)), fe.call(n, a) ? n[a].push(r) : n[a] = [r];
      }, J), cw = ae(ki);
      function Pe(n) {
        return Ve(n) ? Yu(n) : zr(n);
      }
      function Xe(n) {
        return Ve(n) ? Yu(n, !0) : Dx(n);
      }
      function uw(n, a) {
        var r = {};
        return a = J(a, 3), qn(n, function(u, d, x) {
          Gn(r, a(u, d, x), u);
        }), r;
      }
      function lw(n, a) {
        var r = {};
        return a = J(a, 3), qn(n, function(u, d, x) {
          Gn(r, d, a(u, d, x));
        }), r;
      }
      var pw = Kt(function(n, a, r) {
        Aa(n, a, r);
      }), _p = Kt(function(n, a, r, u) {
        Aa(n, a, r, u);
      }), dw = Kn(function(n, a) {
        var r = {};
        if (n == null)
          return r;
        var u = !1;
        a = ye(a, function(x) {
          return x = st(x, n), u || (u = x.length > 1), x;
        }), $n(n, io(n), r), u && (r = gn(r, g | y | S, rg));
        for (var d = a.length; d--; )
          Vr(r, a[d]);
        return r;
      });
      function fw(n, a) {
        return Ep(n, Ua(J(a)));
      }
      var mw = Kn(function(n, a) {
        return n == null ? {} : Bx(n, a);
      });
      function Ep(n, a) {
        if (n == null)
          return {};
        var r = ye(io(n), function(u) {
          return [u];
        });
        return a = J(a), ml(n, r, function(u, d) {
          return a(u, d[0]);
        });
      }
      function hw(n, a, r) {
        a = st(a, n);
        var u = -1, d = a.length;
        for (d || (d = 1, n = t); ++u < d; ) {
          var x = n == null ? t : n[jn(a[u])];
          x === t && (u = d, x = r), n = Vn(x) ? x.call(n) : x;
        }
        return n;
      }
      function vw(n, a, r) {
        return n == null ? n : Ti(n, a, r);
      }
      function xw(n, a, r, u) {
        return u = typeof u == "function" ? u : t, n == null ? n : Ti(n, a, r, u);
      }
      var Rp = ql(Pe), Sp = ql(Xe);
      function gw(n, a, r) {
        var u = ee(n), d = u || ot(n) || Xt(n);
        if (a = J(a, 4), r == null) {
          var x = n && n.constructor;
          d ? r = u ? new x() : [] : we(n) ? r = Vn(x) ? Wt(va(n)) : {} : r = {};
        }
        return (d ? hn : qn)(n, function(b, w, R) {
          return a(r, b, w, R);
        }), r;
      }
      function bw(n, a) {
        return n == null ? !0 : Vr(n, a);
      }
      function yw(n, a, r) {
        return n == null ? n : bl(n, a, Zr(r));
      }
      function ww(n, a, r, u) {
        return u = typeof u == "function" ? u : t, n == null ? n : bl(n, a, Zr(r), u);
      }
      function Yt(n) {
        return n == null ? [] : Or(n, Pe(n));
      }
      function _w(n) {
        return n == null ? [] : Or(n, Xe(n));
      }
      function Ew(n, a, r) {
        return r === t && (r = a, a = t), r !== t && (r = wn(r), r = r === r ? r : 0), a !== t && (a = wn(a), a = a === a ? a : 0), _t(wn(n), a, r);
      }
      function Rw(n, a, r) {
        return a = Xn(a), r === t ? (r = a, a = 0) : r = Xn(r), n = wn(n), Ox(n, a, r);
      }
      function Sw(n, a, r) {
        if (r && typeof r != "boolean" && Ge(n, a, r) && (a = r = t), r === t && (typeof a == "boolean" ? (r = a, a = t) : typeof n == "boolean" && (r = n, n = t)), n === t && a === t ? (n = 0, a = 1) : (n = Xn(n), a === t ? (a = n, n = 0) : a = Xn(a)), n > a) {
          var u = n;
          n = a, a = u;
        }
        if (r || n % 1 || a % 1) {
          var d = Vu();
          return Ne(n + d * (a - n + iv("1e-" + ((d + "").length - 1))), a);
        }
        return Wr(n, a);
      }
      var kw = Jt(function(n, a, r) {
        return a = a.toLowerCase(), n + (r ? kp(a) : a);
      });
      function kp(n) {
        return yo(de(n).toLowerCase());
      }
      function Ap(n) {
        return n = de(n), n && n.replace(Th, vv).replace(Kh, "");
      }
      function Aw(n, a, r) {
        n = de(n), a = tn(a);
        var u = n.length;
        r = r === t ? u : _t(ne(r), 0, u);
        var d = r;
        return r -= a.length, r >= 0 && n.slice(r, d) == a;
      }
      function Tw(n) {
        return n = de(n), n && ch.test(n) ? n.replace(au, xv) : n;
      }
      function Cw(n) {
        return n = de(n), n && mh.test(n) ? n.replace(mr, "\\$&") : n;
      }
      var Ow = Jt(function(n, a, r) {
        return n + (r ? "-" : "") + a.toLowerCase();
      }), Iw = Jt(function(n, a, r) {
        return n + (r ? " " : "") + a.toLowerCase();
      }), Mw = Ol("toLowerCase");
      function Pw(n, a, r) {
        n = de(n), a = ne(a);
        var u = a ? Bt(n) : 0;
        if (!a || u >= a)
          return n;
        var d = (a - u) / 2;
        return Pa(ya(d), r) + n + Pa(ba(d), r);
      }
      function Lw(n, a, r) {
        n = de(n), a = ne(a);
        var u = a ? Bt(n) : 0;
        return a && u < a ? n + Pa(a - u, r) : n;
      }
      function Fw(n, a, r) {
        n = de(n), a = ne(a);
        var u = a ? Bt(n) : 0;
        return a && u < a ? Pa(a - u, r) + n : n;
      }
      function qw(n, a, r) {
        return r || a == null ? a = 0 : a && (a = +a), zv(de(n).replace(hr, ""), a || 0);
      }
      function $w(n, a, r) {
        return (r ? Ge(n, a, r) : a === t) ? a = 1 : a = ne(a), Kr(de(n), a);
      }
      function jw() {
        var n = arguments, a = de(n[0]);
        return n.length < 3 ? a : a.replace(n[1], n[2]);
      }
      var Dw = Jt(function(n, a, r) {
        return n + (r ? "_" : "") + a.toLowerCase();
      });
      function Nw(n, a, r) {
        return r && typeof r != "number" && Ge(n, a, r) && (a = r = t), r = r === t ? he : r >>> 0, r ? (n = de(n), n && (typeof a == "string" || a != null && !xo(a)) && (a = tn(a), !a && Nt(n)) ? rt(Sn(n), 0, r) : n.split(a, r)) : [];
      }
      var Bw = Jt(function(n, a, r) {
        return n + (r ? " " : "") + yo(a);
      });
      function Uw(n, a, r) {
        return n = de(n), r = r == null ? 0 : _t(ne(r), 0, n.length), a = tn(a), n.slice(r, r + a.length) == a;
      }
      function zw(n, a, r) {
        var u = v.templateSettings;
        r && Ge(n, a, r) && (a = t), n = de(n), a = Ga({}, a, u, $l);
        var d = Ga({}, a.imports, u.imports, $l), x = Pe(d), b = Or(d, x), w, R, M = 0, P = a.interpolate || aa, L = "__p += '", j = Mr(
          (a.escape || aa).source + "|" + P.source + "|" + (P === su ? _h : aa).source + "|" + (a.evaluate || aa).source + "|$",
          "g"
        ), U = "//# sourceURL=" + (fe.call(a, "sourceURL") ? (a.sourceURL + "").replace(/\s/g, " ") : "lodash.templateSources[" + ++Zh + "]") + `
`;
        n.replace(j, function(Y, se, oe, sn, We, rn) {
          return oe || (oe = sn), L += n.slice(M, rn).replace(Ch, gv), se && (w = !0, L += `' +
__e(` + se + `) +
'`), We && (R = !0, L += `';
` + We + `;
__p += '`), oe && (L += `' +
((__t = (` + oe + `)) == null ? '' : __t) +
'`), M = rn + Y.length, Y;
        }), L += `';
`;
        var X = fe.call(a, "variable") && a.variable;
        if (!X)
          L = `with (obj) {
` + L + `
}
`;
        else if (yh.test(X))
          throw new Q(p);
        L = (R ? L.replace(ah, "") : L).replace(sh, "$1").replace(rh, "$1;"), L = "function(" + (X || "obj") + `) {
` + (X ? "" : `obj || (obj = {});
`) + "var __t, __p = ''" + (w ? ", __e = _.escape" : "") + (R ? `, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
` : `;
`) + L + `return __p
}`;
        var ie = Cp(function() {
          return le(x, U + "return " + L).apply(t, b);
        });
        if (ie.source = L, vo(ie))
          throw ie;
        return ie;
      }
      function Hw(n) {
        return de(n).toLowerCase();
      }
      function Gw(n) {
        return de(n).toUpperCase();
      }
      function Ww(n, a, r) {
        if (n = de(n), n && (r || a === t))
          return ju(n);
        if (!n || !(a = tn(a)))
          return n;
        var u = Sn(n), d = Sn(a), x = Du(u, d), b = Nu(u, d) + 1;
        return rt(u, x, b).join("");
      }
      function Kw(n, a, r) {
        if (n = de(n), n && (r || a === t))
          return n.slice(0, Uu(n) + 1);
        if (!n || !(a = tn(a)))
          return n;
        var u = Sn(n), d = Nu(u, Sn(a)) + 1;
        return rt(u, 0, d).join("");
      }
      function Jw(n, a, r) {
        if (n = de(n), n && (r || a === t))
          return n.replace(hr, "");
        if (!n || !(a = tn(a)))
          return n;
        var u = Sn(n), d = Du(u, Sn(a));
        return rt(u, d).join("");
      }
      function Vw(n, a) {
        var r = Ie, u = Fe;
        if (we(a)) {
          var d = "separator" in a ? a.separator : d;
          r = "length" in a ? ne(a.length) : r, u = "omission" in a ? tn(a.omission) : u;
        }
        n = de(n);
        var x = n.length;
        if (Nt(n)) {
          var b = Sn(n);
          x = b.length;
        }
        if (r >= x)
          return n;
        var w = r - Bt(u);
        if (w < 1)
          return u;
        var R = b ? rt(b, 0, w).join("") : n.slice(0, w);
        if (d === t)
          return R + u;
        if (b && (w += R.length - w), xo(d)) {
          if (n.slice(w).search(d)) {
            var M, P = R;
            for (d.global || (d = Mr(d.source, de(ru.exec(d)) + "g")), d.lastIndex = 0; M = d.exec(P); )
              var L = M.index;
            R = R.slice(0, L === t ? w : L);
          }
        } else if (n.indexOf(tn(d), w) != w) {
          var j = R.lastIndexOf(d);
          j > -1 && (R = R.slice(0, j));
        }
        return R + u;
      }
      function Xw(n) {
        return n = de(n), n && oh.test(n) ? n.replace(iu, Sv) : n;
      }
      var Yw = Jt(function(n, a, r) {
        return n + (r ? " " : "") + a.toUpperCase();
      }), yo = Ol("toUpperCase");
      function Tp(n, a, r) {
        return n = de(n), a = r ? t : a, a === t ? yv(n) ? Tv(n) : pv(n) : n.match(a) || [];
      }
      var Cp = ae(function(n, a) {
        try {
          return en(n, t, a);
        } catch (r) {
          return vo(r) ? r : new Q(r);
        }
      }), Zw = Kn(function(n, a) {
        return hn(a, function(r) {
          r = jn(r), Gn(n, r, mo(n[r], n));
        }), n;
      });
      function Qw(n) {
        var a = n == null ? 0 : n.length, r = J();
        return n = a ? ye(n, function(u) {
          if (typeof u[1] != "function")
            throw new vn(l);
          return [r(u[0]), u[1]];
        }) : [], ae(function(u) {
          for (var d = -1; ++d < a; ) {
            var x = n[d];
            if (en(x[0], this, u))
              return en(x[1], this, u);
          }
        });
      }
      function e_(n) {
        return Sx(gn(n, g));
      }
      function wo(n) {
        return function() {
          return n;
        };
      }
      function n_(n, a) {
        return n == null || n !== n ? a : n;
      }
      var t_ = Ml(), i_ = Ml(!0);
      function Ye(n) {
        return n;
      }
      function _o(n) {
        return cl(typeof n == "function" ? n : gn(n, g));
      }
      function a_(n) {
        return ll(gn(n, g));
      }
      function s_(n, a) {
        return pl(n, gn(a, g));
      }
      var r_ = ae(function(n, a) {
        return function(r) {
          return ki(r, n, a);
        };
      }), o_ = ae(function(n, a) {
        return function(r) {
          return ki(n, r, a);
        };
      });
      function Eo(n, a, r) {
        var u = Pe(a), d = ka(a, u);
        r == null && !(we(a) && (d.length || !u.length)) && (r = a, a = n, n = this, d = ka(a, Pe(a)));
        var x = !(we(r) && "chain" in r) || !!r.chain, b = Vn(n);
        return hn(d, function(w) {
          var R = a[w];
          n[w] = R, b && (n.prototype[w] = function() {
            var M = this.__chain__;
            if (x || M) {
              var P = n(this.__wrapped__), L = P.__actions__ = Je(this.__actions__);
              return L.push({ func: R, args: arguments, thisArg: n }), P.__chain__ = M, P;
            }
            return R.apply(n, et([this.value()], arguments));
          });
        }), n;
      }
      function c_() {
        return qe._ === this && (qe._ = Lv), this;
      }
      function Ro() {
      }
      function u_(n) {
        return n = ne(n), ae(function(a) {
          return dl(a, n);
        });
      }
      var l_ = eo(ye), p_ = eo(Pu), d_ = eo(Sr);
      function Op(n) {
        return oo(n) ? kr(jn(n)) : Ux(n);
      }
      function f_(n) {
        return function(a) {
          return n == null ? t : Et(n, a);
        };
      }
      var m_ = Ll(), h_ = Ll(!0);
      function So() {
        return [];
      }
      function ko() {
        return !1;
      }
      function v_() {
        return {};
      }
      function x_() {
        return "";
      }
      function g_() {
        return !0;
      }
      function b_(n, a) {
        if (n = ne(n), n < 1 || n > K)
          return [];
        var r = he, u = Ne(n, he);
        a = J(a), n -= he;
        for (var d = Cr(u, a); ++r < n; )
          a(r);
        return d;
      }
      function y_(n) {
        return ee(n) ? ye(n, jn) : an(n) ? [n] : Je(Xl(de(n)));
      }
      function w_(n) {
        var a = ++Mv;
        return de(n) + a;
      }
      var __ = Ma(function(n, a) {
        return n + a;
      }, 0), E_ = no("ceil"), R_ = Ma(function(n, a) {
        return n / a;
      }, 1), S_ = no("floor");
      function k_(n) {
        return n && n.length ? Sa(n, Ye, Nr) : t;
      }
      function A_(n, a) {
        return n && n.length ? Sa(n, J(a, 2), Nr) : t;
      }
      function T_(n) {
        return qu(n, Ye);
      }
      function C_(n, a) {
        return qu(n, J(a, 2));
      }
      function O_(n) {
        return n && n.length ? Sa(n, Ye, Hr) : t;
      }
      function I_(n, a) {
        return n && n.length ? Sa(n, J(a, 2), Hr) : t;
      }
      var M_ = Ma(function(n, a) {
        return n * a;
      }, 1), P_ = no("round"), L_ = Ma(function(n, a) {
        return n - a;
      }, 0);
      function F_(n) {
        return n && n.length ? Tr(n, Ye) : 0;
      }
      function q_(n, a) {
        return n && n.length ? Tr(n, J(a, 2)) : 0;
      }
      return v.after = ay, v.ary = op, v.assign = Gy, v.assignIn = wp, v.assignInWith = Ga, v.assignWith = Wy, v.at = Ky, v.before = cp, v.bind = mo, v.bindAll = Zw, v.bindKey = up, v.castArray = vy, v.chain = ap, v.chunk = Sg, v.compact = kg, v.concat = Ag, v.cond = Qw, v.conforms = e_, v.constant = wo, v.countBy = Fb, v.create = Jy, v.curry = lp, v.curryRight = pp, v.debounce = dp, v.defaults = Vy, v.defaultsDeep = Xy, v.defer = sy, v.delay = ry, v.difference = Tg, v.differenceBy = Cg, v.differenceWith = Og, v.drop = Ig, v.dropRight = Mg, v.dropRightWhile = Pg, v.dropWhile = Lg, v.fill = Fg, v.filter = $b, v.flatMap = Nb, v.flatMapDeep = Bb, v.flatMapDepth = Ub, v.flatten = ep, v.flattenDeep = qg, v.flattenDepth = $g, v.flip = oy, v.flow = t_, v.flowRight = i_, v.fromPairs = jg, v.functions = iw, v.functionsIn = aw, v.groupBy = zb, v.initial = Ng, v.intersection = Bg, v.intersectionBy = Ug, v.intersectionWith = zg, v.invert = rw, v.invertBy = ow, v.invokeMap = Gb, v.iteratee = _o, v.keyBy = Wb, v.keys = Pe, v.keysIn = Xe, v.map = Da, v.mapKeys = uw, v.mapValues = lw, v.matches = a_, v.matchesProperty = s_, v.memoize = Ba, v.merge = pw, v.mergeWith = _p, v.method = r_, v.methodOf = o_, v.mixin = Eo, v.negate = Ua, v.nthArg = u_, v.omit = dw, v.omitBy = fw, v.once = cy, v.orderBy = Kb, v.over = l_, v.overArgs = uy, v.overEvery = p_, v.overSome = d_, v.partial = ho, v.partialRight = fp, v.partition = Jb, v.pick = mw, v.pickBy = Ep, v.property = Op, v.propertyOf = f_, v.pull = Kg, v.pullAll = tp, v.pullAllBy = Jg, v.pullAllWith = Vg, v.pullAt = Xg, v.range = m_, v.rangeRight = h_, v.rearg = ly, v.reject = Yb, v.remove = Yg, v.rest = py, v.reverse = po, v.sampleSize = Qb, v.set = vw, v.setWith = xw, v.shuffle = ey, v.slice = Zg, v.sortBy = iy, v.sortedUniq = sb, v.sortedUniqBy = rb, v.split = Nw, v.spread = dy, v.tail = ob, v.take = cb, v.takeRight = ub, v.takeRightWhile = lb, v.takeWhile = pb, v.tap = kb, v.throttle = fy, v.thru = ja, v.toArray = gp, v.toPairs = Rp, v.toPairsIn = Sp, v.toPath = y_, v.toPlainObject = yp, v.transform = gw, v.unary = my, v.union = db, v.unionBy = fb, v.unionWith = mb, v.uniq = hb, v.uniqBy = vb, v.uniqWith = xb, v.unset = bw, v.unzip = fo, v.unzipWith = ip, v.update = yw, v.updateWith = ww, v.values = Yt, v.valuesIn = _w, v.without = gb, v.words = Tp, v.wrap = hy, v.xor = bb, v.xorBy = yb, v.xorWith = wb, v.zip = _b, v.zipObject = Eb, v.zipObjectDeep = Rb, v.zipWith = Sb, v.entries = Rp, v.entriesIn = Sp, v.extend = wp, v.extendWith = Ga, Eo(v, v), v.add = __, v.attempt = Cp, v.camelCase = kw, v.capitalize = kp, v.ceil = E_, v.clamp = Ew, v.clone = xy, v.cloneDeep = by, v.cloneDeepWith = yy, v.cloneWith = gy, v.conformsTo = wy, v.deburr = Ap, v.defaultTo = n_, v.divide = R_, v.endsWith = Aw, v.eq = An, v.escape = Tw, v.escapeRegExp = Cw, v.every = qb, v.find = jb, v.findIndex = Zl, v.findKey = Yy, v.findLast = Db, v.findLastIndex = Ql, v.findLastKey = Zy, v.floor = S_, v.forEach = sp, v.forEachRight = rp, v.forIn = Qy, v.forInRight = ew, v.forOwn = nw, v.forOwnRight = tw, v.get = go, v.gt = _y, v.gte = Ey, v.has = sw, v.hasIn = bo, v.head = np, v.identity = Ye, v.includes = Hb, v.indexOf = Dg, v.inRange = Rw, v.invoke = cw, v.isArguments = kt, v.isArray = ee, v.isArrayBuffer = Ry, v.isArrayLike = Ve, v.isArrayLikeObject = ke, v.isBoolean = Sy, v.isBuffer = ot, v.isDate = ky, v.isElement = Ay, v.isEmpty = Ty, v.isEqual = Cy, v.isEqualWith = Oy, v.isError = vo, v.isFinite = Iy, v.isFunction = Vn, v.isInteger = mp, v.isLength = za, v.isMap = hp, v.isMatch = My, v.isMatchWith = Py, v.isNaN = Ly, v.isNative = Fy, v.isNil = $y, v.isNull = qy, v.isNumber = vp, v.isObject = we, v.isObjectLike = _e, v.isPlainObject = Mi, v.isRegExp = xo, v.isSafeInteger = jy, v.isSet = xp, v.isString = Ha, v.isSymbol = an, v.isTypedArray = Xt, v.isUndefined = Dy, v.isWeakMap = Ny, v.isWeakSet = By, v.join = Hg, v.kebabCase = Ow, v.last = yn, v.lastIndexOf = Gg, v.lowerCase = Iw, v.lowerFirst = Mw, v.lt = Uy, v.lte = zy, v.max = k_, v.maxBy = A_, v.mean = T_, v.meanBy = C_, v.min = O_, v.minBy = I_, v.stubArray = So, v.stubFalse = ko, v.stubObject = v_, v.stubString = x_, v.stubTrue = g_, v.multiply = M_, v.nth = Wg, v.noConflict = c_, v.noop = Ro, v.now = Na, v.pad = Pw, v.padEnd = Lw, v.padStart = Fw, v.parseInt = qw, v.random = Sw, v.reduce = Vb, v.reduceRight = Xb, v.repeat = $w, v.replace = jw, v.result = hw, v.round = P_, v.runInContext = E, v.sample = Zb, v.size = ny, v.snakeCase = Dw, v.some = ty, v.sortedIndex = Qg, v.sortedIndexBy = eb, v.sortedIndexOf = nb, v.sortedLastIndex = tb, v.sortedLastIndexBy = ib, v.sortedLastIndexOf = ab, v.startCase = Bw, v.startsWith = Uw, v.subtract = L_, v.sum = F_, v.sumBy = q_, v.template = zw, v.times = b_, v.toFinite = Xn, v.toInteger = ne, v.toLength = bp, v.toLower = Hw, v.toNumber = wn, v.toSafeInteger = Hy, v.toString = de, v.toUpper = Gw, v.trim = Ww, v.trimEnd = Kw, v.trimStart = Jw, v.truncate = Vw, v.unescape = Xw, v.uniqueId = w_, v.upperCase = Yw, v.upperFirst = yo, v.each = sp, v.eachRight = rp, v.first = np, Eo(v, function() {
        var n = {};
        return qn(v, function(a, r) {
          fe.call(v.prototype, r) || (n[r] = a);
        }), n;
      }(), { chain: !1 }), v.VERSION = s, hn(["bind", "bindKey", "curry", "curryRight", "partial", "partialRight"], function(n) {
        v[n].placeholder = v;
      }), hn(["drop", "take"], function(n, a) {
        re.prototype[n] = function(r) {
          r = r === t ? 1 : Oe(ne(r), 0);
          var u = this.__filtered__ && !a ? new re(this) : this.clone();
          return u.__filtered__ ? u.__takeCount__ = Ne(r, u.__takeCount__) : u.__views__.push({
            size: Ne(r, he),
            type: n + (u.__dir__ < 0 ? "Right" : "")
          }), u;
        }, re.prototype[n + "Right"] = function(r) {
          return this.reverse()[n](r).reverse();
        };
      }), hn(["filter", "map", "takeWhile"], function(n, a) {
        var r = a + 1, u = r == ue || r == Ln;
        re.prototype[n] = function(d) {
          var x = this.clone();
          return x.__iteratees__.push({
            iteratee: J(d, 3),
            type: r
          }), x.__filtered__ = x.__filtered__ || u, x;
        };
      }), hn(["head", "last"], function(n, a) {
        var r = "take" + (a ? "Right" : "");
        re.prototype[n] = function() {
          return this[r](1).value()[0];
        };
      }), hn(["initial", "tail"], function(n, a) {
        var r = "drop" + (a ? "" : "Right");
        re.prototype[n] = function() {
          return this.__filtered__ ? new re(this) : this[r](1);
        };
      }), re.prototype.compact = function() {
        return this.filter(Ye);
      }, re.prototype.find = function(n) {
        return this.filter(n).head();
      }, re.prototype.findLast = function(n) {
        return this.reverse().find(n);
      }, re.prototype.invokeMap = ae(function(n, a) {
        return typeof n == "function" ? new re(this) : this.map(function(r) {
          return ki(r, n, a);
        });
      }), re.prototype.reject = function(n) {
        return this.filter(Ua(J(n)));
      }, re.prototype.slice = function(n, a) {
        n = ne(n);
        var r = this;
        return r.__filtered__ && (n > 0 || a < 0) ? new re(r) : (n < 0 ? r = r.takeRight(-n) : n && (r = r.drop(n)), a !== t && (a = ne(a), r = a < 0 ? r.dropRight(-a) : r.take(a - n)), r);
      }, re.prototype.takeRightWhile = function(n) {
        return this.reverse().takeWhile(n).reverse();
      }, re.prototype.toArray = function() {
        return this.take(he);
      }, qn(re.prototype, function(n, a) {
        var r = /^(?:filter|find|map|reject)|While$/.test(a), u = /^(?:head|last)$/.test(a), d = v[u ? "take" + (a == "last" ? "Right" : "") : a], x = u || /^find/.test(a);
        d && (v.prototype[a] = function() {
          var b = this.__wrapped__, w = u ? [1] : arguments, R = b instanceof re, M = w[0], P = R || ee(b), L = function(se) {
            var oe = d.apply(v, et([se], w));
            return u && j ? oe[0] : oe;
          };
          P && r && typeof M == "function" && M.length != 1 && (R = P = !1);
          var j = this.__chain__, U = !!this.__actions__.length, X = x && !j, ie = R && !U;
          if (!x && P) {
            b = ie ? b : new re(this);
            var Y = n.apply(b, w);
            return Y.__actions__.push({ func: ja, args: [L], thisArg: t }), new xn(Y, j);
          }
          return X && ie ? n.apply(this, w) : (Y = this.thru(L), X ? u ? Y.value()[0] : Y.value() : Y);
        });
      }), hn(["pop", "push", "shift", "sort", "splice", "unshift"], function(n) {
        var a = la[n], r = /^(?:push|sort|unshift)$/.test(n) ? "tap" : "thru", u = /^(?:pop|shift)$/.test(n);
        v.prototype[n] = function() {
          var d = arguments;
          if (u && !this.__chain__) {
            var x = this.value();
            return a.apply(ee(x) ? x : [], d);
          }
          return this[r](function(b) {
            return a.apply(ee(b) ? b : [], d);
          });
        };
      }), qn(re.prototype, function(n, a) {
        var r = v[a];
        if (r) {
          var u = r.name + "";
          fe.call(Gt, u) || (Gt[u] = []), Gt[u].push({ name: a, func: r });
        }
      }), Gt[Ia(t, F).name] = [{
        name: "wrapper",
        func: t
      }], re.prototype.clone = Xv, re.prototype.reverse = Yv, re.prototype.value = Zv, v.prototype.at = Ab, v.prototype.chain = Tb, v.prototype.commit = Cb, v.prototype.next = Ob, v.prototype.plant = Mb, v.prototype.reverse = Pb, v.prototype.toJSON = v.prototype.valueOf = v.prototype.value = Lb, v.prototype.first = v.prototype.head, bi && (v.prototype[bi] = Ib), v;
    }, Ut = Cv();
    gt ? ((gt.exports = Ut)._ = Ut, wr._ = Ut) : qe._ = Ut;
  }).call(On);
})(Ps, Ps.exports);
var NA = Ps.exports;
function Qi(i) {
  this.requestsPerSecond = i.requestsPerSecond, this.promiseImplementation = i.promiseImplementation || Promise, this.lastStartTime = 0, this.queued = [];
}
Qi.prototype.add = function(i, e) {
  var t = this, s = e || {};
  return new t.promiseImplementation(function(o, c) {
    t.queued.push({
      resolve: o,
      reject: c,
      promise: i,
      weight: s.weight || 1,
      signal: s.signal
    }), t.dequeue();
  });
};
Qi.prototype.addAll = function(i, e) {
  var t = i.map((function(s) {
    return this.add(s, e);
  }).bind(this));
  return Promise.all(t);
};
Qi.prototype.dequeue = function() {
  if (this.queued.length > 0) {
    var i = /* @__PURE__ */ new Date(), e = this.queued[0].weight, t = 1e3 / this.requestsPerSecond * e, s = i - this.lastStartTime;
    s >= t ? this._execute() : setTimeout((function() {
      this.dequeue();
    }).bind(this), t - s);
  }
};
Qi.prototype._execute = function() {
  this.lastStartTime = /* @__PURE__ */ new Date();
  var i = this.queued.shift(), e = i.signal && i.signal.aborted;
  e ? i.reject(new DOMException("", "AbortError")) : i.promise().then(function(t) {
    i.resolve(t);
  }).catch(function(t) {
    i.reject(t);
  });
};
var BA = Qi, ea = {};
Object.defineProperty(ea, "__esModule", { value: !0 });
ea.HttpMethod = void 0;
var Ad;
(function(i) {
  i.Get = "get", i.Post = "post", i.Put = "put", i.Delete = "delete";
})(Ad || (ea.HttpMethod = Ad = {}));
var Km = On && On.__importDefault || function(i) {
  return i && i.__esModule ? i : { default: i };
};
Object.defineProperty(ir, "__esModule", { value: !0 });
ir.MovieDb = void 0;
const UA = Km(DA), Fi = NA, zA = Km(BA), T = ea;
class HA {
  constructor(e, t = "https://api.themoviedb.org/3/", s = 50) {
    Zt(this, "apiKey");
    Zt(this, "token");
    Zt(this, "queue");
    Zt(this, "baseUrl");
    Zt(this, "sessionId");
    this.apiKey = e, this.baseUrl = t, this.queue = new zA.default({
      requestsPerSecond: s,
      promiseImplementation: Promise
    });
  }
  /**
   * Gets an api token using an api key
   *
   * @returns {Promise}
   */
  async requestToken() {
    return (!this.token || Date.now() > new Date(this.token.expires_at).getTime()) && (this.token = await this.makeRequest(T.HttpMethod.Get, "authentication/token/new")), this.token;
  }
  /**
   * Gets the session id
   */
  async retrieveSession() {
    const t = {
      request_token: (await this.requestToken()).request_token
    }, s = await this.makeRequest(T.HttpMethod.Get, "authentication/session/new", t);
    return this.sessionId = s.session_id, this.sessionId;
  }
  /**
   * Compiles the endpoint based on the params
   */
  getEndpoint(e, t = {}) {
    return Object.keys(t).reduce((s, o) => s.replace(`:${o}`, t[o]), e);
  }
  /**
   * Normalizes a request into a RequestParams object
   */
  normalizeParams(e, t = {}) {
    if ((0, Fi.isObject)(t))
      return t;
    const s = e.match(/:[a-z]*/g) || [];
    return s.length === 1 ? s.reduce((o, c) => (o[c.slice(1)] = t, o), {}) : {};
  }
  /**
   * Compiles the data/query data to send with the request
   */
  getParams(e, t = {}) {
    const s = (0, Fi.merge)({
      api_key: this.apiKey,
      ...this.sessionId && { session_id: this.sessionId }
    }, t);
    return e.includes(":id") && !s.id && this.sessionId && (s.id = "{account_id}"), s;
  }
  /**
   * Performs the request to the server
   */
  makeRequest(e, t, s = {}, o = {}) {
    const c = this.normalizeParams(t, s), l = this.getParams(t, c), p = [...t.match(/:[a-z]*/gi) ?? []].map((h) => h.slice(1)), f = (0, Fi.omit)(l, p), m = {
      method: e,
      url: this.baseUrl + this.getEndpoint(t, l),
      ...e === T.HttpMethod.Get && { params: f },
      ...e !== T.HttpMethod.Get && { data: f },
      ...o
    };
    return this.queue.add(async () => (await UA.default.request(m)).data);
  }
  parseSearchParams(e) {
    return (0, Fi.isString)(e) ? { query: e } : e;
  }
  configuration(e) {
    return this.makeRequest(T.HttpMethod.Get, "configuration", null, e);
  }
  countries(e) {
    return this.makeRequest(T.HttpMethod.Get, "configuration/countries", null, e);
  }
  jobs(e) {
    return this.makeRequest(T.HttpMethod.Get, "configuration/jobs", null, e);
  }
  languages(e) {
    return this.makeRequest(T.HttpMethod.Get, "configuration/languages", null, e);
  }
  primaryTranslations(e) {
    return this.makeRequest(T.HttpMethod.Get, "configuration/primary_translations", null, e);
  }
  timezones(e) {
    return this.makeRequest(T.HttpMethod.Get, "configuration/timezones", null, e);
  }
  find(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "find/:id", e, t);
  }
  searchCompany(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "search/company", this.parseSearchParams(e), t);
  }
  searchCollection(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "search/collection", this.parseSearchParams(e), t);
  }
  searchKeyword(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "search/keyword", this.parseSearchParams(e), t);
  }
  searchMovie(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "search/movie", this.parseSearchParams(e), t);
  }
  searchMulti(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "search/multi", this.parseSearchParams(e), t);
  }
  searchPerson(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "search/person", this.parseSearchParams(e), t);
  }
  searchTv(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "search/tv", this.parseSearchParams(e), t);
  }
  // Doesn't exist in documentation, may be deprecated
  searchList(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "search/list", e, t);
  }
  collectionInfo(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "collection/:id", e, t);
  }
  collectionImages(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "collection/:id/images", e, t);
  }
  collectionTranslations(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "collection/:id/translations", e, t);
  }
  discoverMovie(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "discover/movie", e, t);
  }
  discoverTv(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "discover/tv", e, t);
  }
  trending(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "trending/:media_type/:time_window", e, t);
  }
  movieInfo(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "movie/:id", e, t);
  }
  movieAccountStates(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "movie/:id/account_states", e, t);
  }
  movieAlternativeTitles(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "movie/:id/alternative_titles", e, t);
  }
  movieChanges(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "movie/:id/changes", e, t);
  }
  movieCredits(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "movie/:id/credits", e, t);
  }
  movieExternalIds(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "movie/:id/external_ids", e, t);
  }
  movieImages(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "movie/:id/images", e, t);
  }
  movieKeywords(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "movie/:id/keywords", e, t);
  }
  movieReleaseDates(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "movie/:id/release_dates", e, t);
  }
  movieVideos(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "movie/:id/videos", e, t);
  }
  movieWatchProviders(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "movie/:id/watch/providers", e, t);
  }
  movieWatchProviderList(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "watch/providers/movie", e, t);
  }
  movieTranslations(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "movie/:id/translations", e, t);
  }
  movieRecommendations(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "movie/:id/recommendations", e, t);
  }
  movieSimilar(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "movie/:id/similar", e, t);
  }
  movieReviews(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "movie/:id/reviews", e, t);
  }
  movieLists(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "movie/:id/lists", e, t);
  }
  movieRatingUpdate(e, t) {
    return this.makeRequest(T.HttpMethod.Post, "movie/:id/rating", e, t);
  }
  movieRatingDelete(e, t) {
    return this.makeRequest(T.HttpMethod.Delete, "movie/:id/rating", e, t);
  }
  movieLatest(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "movie/latest", (0, Fi.isString)(e) ? { language: e } : e, t);
  }
  movieNowPlaying(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "movie/now_playing", e, t);
  }
  moviePopular(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "movie/popular", e, t);
  }
  movieTopRated(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "movie/top_rated", e, t);
  }
  upcomingMovies(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "movie/upcoming", e, t);
  }
  tvInfo(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "tv/:id", e, t);
  }
  tvAccountStates(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "tv/:id/account_states", e, t);
  }
  tvAlternativeTitles(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "tv/:id/alternative_titles", e, t);
  }
  tvChanges(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "tv/:id/changes", e, t);
  }
  tvContentRatings(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "tv/:id/content_ratings", e, t);
  }
  tvCredits(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "tv/:id/credits", e, t);
  }
  tvAggregateCredits(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "tv/:id/aggregate_credits", e, t);
  }
  episodeGroups(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "tv/:id/episode_groups", e, t);
  }
  tvExternalIds(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "tv/:id/external_ids", e, t);
  }
  tvImages(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "tv/:id/images", e, t);
  }
  tvKeywords(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "tv/:id/keywords", e, t);
  }
  tvRecommendations(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "tv/:id/recommendations", e, t);
  }
  tvReviews(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "tv/:id/reviews", e, t);
  }
  tvScreenedTheatrically(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "tv/:id/screened_theatrically", e, t);
  }
  tvSimilar(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "tv/:id/similar", e, t);
  }
  tvTranslations(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "tv/:id/translations", e, t);
  }
  tvVideos(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "tv/:id/videos", e, t);
  }
  tvWatchProviders(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "tv/:id/watch/providers", e, t);
  }
  tvWatchProviderList(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "watch/providers/tv", e, t);
  }
  tvRatingUpdate(e, t) {
    return this.makeRequest(T.HttpMethod.Post, "tv/:id/rating", e, t);
  }
  tvRatingDelete(e, t) {
    return this.makeRequest(T.HttpMethod.Delete, "tv/:id/rating", e, t);
  }
  tvLatest(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "tv/latest", e, t);
  }
  tvAiringToday(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "tv/airing_today", e, t);
  }
  tvOnTheAir(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "tv/on_the_air", e, t);
  }
  tvPopular(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "tv/popular", e, t);
  }
  tvTopRated(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "tv/top_rated", e, t);
  }
  seasonInfo(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "tv/:id/season/:season_number", e, t);
  }
  seasonChanges(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "tv/season/:id/changes", e, t);
  }
  seasonAccountStates(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "tv/:id/season/:season_number/account_states", e, t);
  }
  seasonCredits(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "tv/:id/season/:season_number/credits", e, t);
  }
  seasonAggregateCredits(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "tv/:id/season/:season_number/aggregate_credits", e, t);
  }
  seasonExternalIds(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "tv/:id/season/:season_number/external_ids", e, t);
  }
  seasonImages(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "tv/:id/season/:season_number/images", e, t);
  }
  seasonVideos(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "tv/:id/season/:season_number/videos", e, t);
  }
  episodeInfo(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "tv/:id/season/:season_number/episode/:episode_number", e, t);
  }
  episodeChanges(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "tv/episode/:id/changes", e, t);
  }
  episodeAccountStates(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "tv/:id/season/:season_number/episode/:episode_number/account_states", e, t);
  }
  episodeCredits(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "tv/:id/season/:season_number/episode/:episode_number/credits", e, t);
  }
  episodeExternalIds(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "tv/:id/season/:season_number/episode/:episode_number/external_ids", e, t);
  }
  episodeImages(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "tv/:id/season/:season_number/episode/:episode_number/images", e, t);
  }
  episodeTranslations(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "tv/:id/season/:season_number/episode/:episode_number/translations", e, t);
  }
  episodeRatingUpdate(e, t) {
    return this.makeRequest(T.HttpMethod.Post, "tv/:id/season/:season_number/episode/:episode_number/rating", e, t);
  }
  episodeRatingDelete(e, t) {
    return this.makeRequest(T.HttpMethod.Delete, "tv/:id/season/:season_number/episode/:episode_number/rating", e, t);
  }
  episodeVideos(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "tv/:id/season/:season_number/episode/:episode_number/translations", e, t);
  }
  personInfo(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "person/:id", e, t);
  }
  personChanges(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "person/:id/changes", e, t);
  }
  personMovieCredits(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "person/:id/movie_credits", e, t);
  }
  personTvCredits(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "person/:id/tv_credits", e, t);
  }
  personCombinedCredits(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "person/:id/combined_credits", e, t);
  }
  personExternalIds(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "person/:id/external_ids", e, t);
  }
  personImages(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "person/:id/images", e, t);
  }
  personTaggedImages(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "person/:id/tagged_images", e, t);
  }
  personTranslations(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "person/:id/translations", e, t);
  }
  personLatest(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "person/latest", e, t);
  }
  personPopular(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "person/popular", e, t);
  }
  creditInfo(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "credit/:id", e, t);
  }
  listInfo(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "list/:id", e, t);
  }
  listStatus(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "list/:id/item_status", e, t);
  }
  createList(e, t) {
    return this.makeRequest(T.HttpMethod.Post, "list", e, t);
  }
  createListItem(e, t) {
    return this.makeRequest(T.HttpMethod.Post, "list/:id/add_item", e, t);
  }
  removeListItem(e, t) {
    return this.makeRequest(T.HttpMethod.Post, "list/:id/remove_item", e, t);
  }
  clearList(e, t) {
    return this.makeRequest(T.HttpMethod.Post, "list/:id/clear", e, t);
  }
  deleteList(e, t) {
    return this.makeRequest(T.HttpMethod.Delete, "list/:id", e, t);
  }
  genreMovieList(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "genre/movie/list", e, t);
  }
  genreTvList(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "genre/tv/list", e, t);
  }
  keywordInfo(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "keyword/:id", e, t);
  }
  keywordMovies(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "keyword/:id/movies", e, t);
  }
  companyInfo(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "company/:id", e, t);
  }
  companyAlternativeNames(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "company/:id/alternative_names", e, t);
  }
  companyImages(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "company/:id/images", e, t);
  }
  accountInfo(e) {
    return this.makeRequest(T.HttpMethod.Get, "account", null, e);
  }
  accountLists(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "account/:id/lists", e, t);
  }
  accountFavoriteMovies(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "account/:id/favorite/movies", e, t);
  }
  accountFavoriteTv(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "account/:id/favorite/tv", e, t);
  }
  accountFavoriteUpdate(e, t) {
    return this.makeRequest(T.HttpMethod.Post, "account/:id/favorite", e, t);
  }
  accountRatedMovies(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "account/:id/rated/movies", e, t);
  }
  accountRatedTv(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "account/:id/rated/tv", e, t);
  }
  accountRatedTvEpisodes(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "account/:id/rated/tv/episodes", e, t);
  }
  accountMovieWatchlist(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "account/:id/watchlist/movies", e, t);
  }
  accountTvWatchlist(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "account/:id/watchlist/tv", e, t);
  }
  accountWatchlistUpdate(e, t) {
    return this.makeRequest(T.HttpMethod.Post, "account/:id/watchlist", e, t);
  }
  changedMovies(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "movie/changes", e, t);
  }
  changedTvs(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "tv/changes", e, t);
  }
  changedPeople(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "person/changes", e, t);
  }
  movieCertifications(e) {
    return this.makeRequest(T.HttpMethod.Get, "certification/movie/list", null, e);
  }
  tvCertifications(e) {
    return this.makeRequest(T.HttpMethod.Get, "certification/tv/list", null, e);
  }
  networkInfo(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "network/:id", e, t);
  }
  networkAlternativeNames(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "network/:id/alternative_names", e, t);
  }
  networkImages(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "network/:id/images", e, t);
  }
  review(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "review/:id", e, t);
  }
  episodeGroup(e, t) {
    return this.makeRequest(T.HttpMethod.Get, "tv/episode_group/:id", e, t);
  }
}
ir.MovieDb = HA;
var ar = {};
Object.defineProperty(ar, "__esModule", { value: !0 });
ar.ExternalId = void 0;
var Td;
(function(i) {
  i.ImdbId = "imdb_id", i.Freebase_Mid = "freebase_mid", i.FreebaseId = "freebase_id", i.TvdbId = "tvdb_id", i.TvrageId = "tvrage_id", i.FacebookId = "facebook_id", i.TwitterId = "twitter_id", i.InstagramId = "instagram_id";
})(Td || (ar.ExternalId = Td = {}));
(function(i) {
  var e = On && On.__createBinding || (Object.create ? function(o, c, l, p) {
    p === void 0 && (p = l);
    var f = Object.getOwnPropertyDescriptor(c, l);
    (!f || ("get" in f ? !c.__esModule : f.writable || f.configurable)) && (f = { enumerable: !0, get: function() {
      return c[l];
    } }), Object.defineProperty(o, p, f);
  } : function(o, c, l, p) {
    p === void 0 && (p = l), o[p] = c[l];
  }), t = On && On.__exportStar || function(o, c) {
    for (var l in o) l !== "default" && !Object.prototype.hasOwnProperty.call(c, l) && e(c, o, l);
  };
  Object.defineProperty(i, "__esModule", { value: !0 }), i.MovieDb = void 0;
  var s = ir;
  Object.defineProperty(i, "MovieDb", { enumerable: !0, get: function() {
    return s.MovieDb;
  } }), t(ea, i), t(ar, i);
})(Wm);
async function GA({ apiKey: i, playlistName: e }) {
  const t = new Wm.MovieDb(i), o = (await t.moviePopular({ language: "pt" })).results, c = await qm(e);
  if (o.length === 0) return [];
  const l = new ui(c.playlist, {
    keys: ["name"],
    threshold: 0.2,
    minMatchCharLength: 2
  }), p = [];
  for (const f of o) {
    const m = f.title + f.release_date.split("-")[0], h = l.search(m).map((g) => g.item);
    if (h.length > 0) {
      const g = await t.movieImages({ id: f.id });
      p.push({ ...f, matches: h, images: g });
    }
  }
  return p;
}
function WA({ path: i, startTime: e }, t) {
  const s = W_("vlc", [
    "--extraintf",
    "http",
    "--http-host 127.0.0.1",
    "--http-port 9090",
    "--http-password joi",
    "--fullscreen",
    `--start-time=${e}`,
    "--qt-start-minimized",
    "--no-snapshot-preview",
    "--no-osd",
    i
  ], { shell: !0 });
  return s.setMaxListeners(2), s.stderr.on("data", (o) => {
    o.toString().includes("access stream error") && (s.kill(), t.webContents.send("vlc-status", { running: !1, error: o.toString() }));
  }), s.on("close", () => {
    t.webContents.send("vlc-status", { running: !1 });
  }), s.pid;
}
async function KA() {
  return (await pe.get("http://127.0.0.1:9090/requests/status.json", {
    auth: {
      username: "",
      password: "joi"
    },
    timeout: 500
  })).data;
}
function JA(i) {
  process.kill(i, "SIGINT");
}
function VA(i) {
  be.handle("get-metadata", qt), be.handle("authenticate-user", async (e, t) => await $k(t)), be.handle("fetch-tmdb-trending", async (e, t) => await GA(t)), be.handle("update-vod", async (e, t) => await Lk(t)), be.handle("update-series", async (e, t) => await Fk(t)), be.handle("update-live", async (e, t) => await qk(t)), be.handle("add-playlist-to-meta", async (e, t) => await jk(t)), be.handle("remove-playlist", async (e, t) => await Zk(t)), be.handle("get-local-vod-playlist", async (e, t) => await qm(t)), be.handle("get-local-series-playlist", async (e, t) => await Dk(t)), be.handle("get-local-live-playlist", async (e, t) => await Nk(t)), be.handle("get-playlist-info", async (e, t) => await Bk(t)), be.handle("get-vod-info", async (e, t) => await Uk(t)), be.handle("get-serie-info", async (e, t) => await zk(t)), be.handle("get-user-data", async (e, t) => await Hk(t)), be.handle("update-user-data", async (e, t) => await Gk(t)), be.handle("change-current-playlist", async (e, t) => await Wk(t)), be.handle("updated-at-playlist", async (e, t) => await Kk(t)), be.handle("create-profile", async (e, t) => await Jk(t)), be.handle("switch-profile", async (e, t) => await Vk(t)), be.handle("rename-profile", async (e, t) => await Xk(t)), be.handle("remove-profile", async (e, t) => await Yk(t)), be.handle("launch-vlc", async (e, t) => WA(t, i)), be.handle("get-vlc-state", async (e) => await KA()), be.handle("kill-process", async (e, t) => JA(t));
}
var yc = { exports: {} }, fs = { exports: {} }, ms = { exports: {} }, Vo, Cd;
function XA() {
  if (Cd) return Vo;
  Cd = 1;
  var i = 1e3, e = i * 60, t = e * 60, s = t * 24, o = s * 365.25;
  Vo = function(m, h) {
    h = h || {};
    var g = typeof m;
    if (g === "string" && m.length > 0)
      return c(m);
    if (g === "number" && isNaN(m) === !1)
      return h.long ? p(m) : l(m);
    throw new Error(
      "val is not a non-empty string or a valid number. val=" + JSON.stringify(m)
    );
  };
  function c(m) {
    if (m = String(m), !(m.length > 100)) {
      var h = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
        m
      );
      if (h) {
        var g = parseFloat(h[1]), y = (h[2] || "ms").toLowerCase();
        switch (y) {
          case "years":
          case "year":
          case "yrs":
          case "yr":
          case "y":
            return g * o;
          case "days":
          case "day":
          case "d":
            return g * s;
          case "hours":
          case "hour":
          case "hrs":
          case "hr":
          case "h":
            return g * t;
          case "minutes":
          case "minute":
          case "mins":
          case "min":
          case "m":
            return g * e;
          case "seconds":
          case "second":
          case "secs":
          case "sec":
          case "s":
            return g * i;
          case "milliseconds":
          case "millisecond":
          case "msecs":
          case "msec":
          case "ms":
            return g;
          default:
            return;
        }
      }
    }
  }
  function l(m) {
    return m >= s ? Math.round(m / s) + "d" : m >= t ? Math.round(m / t) + "h" : m >= e ? Math.round(m / e) + "m" : m >= i ? Math.round(m / i) + "s" : m + "ms";
  }
  function p(m) {
    return f(m, s, "day") || f(m, t, "hour") || f(m, e, "minute") || f(m, i, "second") || m + " ms";
  }
  function f(m, h, g) {
    if (!(m < h))
      return m < h * 1.5 ? Math.floor(m / h) + " " + g : Math.ceil(m / h) + " " + g + "s";
  }
  return Vo;
}
var Od;
function Jm() {
  return Od || (Od = 1, function(i, e) {
    e = i.exports = o.debug = o.default = o, e.coerce = f, e.disable = l, e.enable = c, e.enabled = p, e.humanize = XA(), e.names = [], e.skips = [], e.formatters = {};
    var t;
    function s(m) {
      var h = 0, g;
      for (g in m)
        h = (h << 5) - h + m.charCodeAt(g), h |= 0;
      return e.colors[Math.abs(h) % e.colors.length];
    }
    function o(m) {
      function h() {
        if (h.enabled) {
          var g = h, y = +/* @__PURE__ */ new Date(), S = y - (t || y);
          g.diff = S, g.prev = t, g.curr = y, t = y;
          for (var _ = new Array(arguments.length), O = 0; O < _.length; O++)
            _[O] = arguments[O];
          _[0] = e.coerce(_[0]), typeof _[0] != "string" && _.unshift("%O");
          var C = 0;
          _[0] = _[0].replace(/%([a-zA-Z%])/g, function($, q) {
            if ($ === "%%") return $;
            C++;
            var G = e.formatters[q];
            if (typeof G == "function") {
              var z = _[C];
              $ = G.call(g, z), _.splice(C, 1), C--;
            }
            return $;
          }), e.formatArgs.call(g, _);
          var F = h.log || e.log || console.log.bind(console);
          F.apply(g, _);
        }
      }
      return h.namespace = m, h.enabled = e.enabled(m), h.useColors = e.useColors(), h.color = s(m), typeof e.init == "function" && e.init(h), h;
    }
    function c(m) {
      e.save(m), e.names = [], e.skips = [];
      for (var h = (typeof m == "string" ? m : "").split(/[\s,]+/), g = h.length, y = 0; y < g; y++)
        h[y] && (m = h[y].replace(/\*/g, ".*?"), m[0] === "-" ? e.skips.push(new RegExp("^" + m.substr(1) + "$")) : e.names.push(new RegExp("^" + m + "$")));
    }
    function l() {
      e.enable("");
    }
    function p(m) {
      var h, g;
      for (h = 0, g = e.skips.length; h < g; h++)
        if (e.skips[h].test(m))
          return !1;
      for (h = 0, g = e.names.length; h < g; h++)
        if (e.names[h].test(m))
          return !0;
      return !1;
    }
    function f(m) {
      return m instanceof Error ? m.stack || m.message : m;
    }
  }(ms, ms.exports)), ms.exports;
}
var Id;
function YA() {
  return Id || (Id = 1, function(i, e) {
    e = i.exports = Jm(), e.log = o, e.formatArgs = s, e.save = c, e.load = l, e.useColors = t, e.storage = typeof chrome < "u" && typeof chrome.storage < "u" ? chrome.storage.local : p(), e.colors = [
      "lightseagreen",
      "forestgreen",
      "goldenrod",
      "dodgerblue",
      "darkorchid",
      "crimson"
    ];
    function t() {
      return typeof window < "u" && window.process && window.process.type === "renderer" ? !0 : typeof document < "u" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // is firebug? http://stackoverflow.com/a/398120/376773
      typeof window < "u" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || // double check webkit in userAgent just in case we are in a worker
      typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    e.formatters.j = function(f) {
      try {
        return JSON.stringify(f);
      } catch (m) {
        return "[UnexpectedJSONParseError]: " + m.message;
      }
    };
    function s(f) {
      var m = this.useColors;
      if (f[0] = (m ? "%c" : "") + this.namespace + (m ? " %c" : " ") + f[0] + (m ? "%c " : " ") + "+" + e.humanize(this.diff), !!m) {
        var h = "color: " + this.color;
        f.splice(1, 0, h, "color: inherit");
        var g = 0, y = 0;
        f[0].replace(/%[a-zA-Z%]/g, function(S) {
          S !== "%%" && (g++, S === "%c" && (y = g));
        }), f.splice(y, 0, h);
      }
    }
    function o() {
      return typeof console == "object" && console.log && Function.prototype.apply.call(console.log, console, arguments);
    }
    function c(f) {
      try {
        f == null ? e.storage.removeItem("debug") : e.storage.debug = f;
      } catch {
      }
    }
    function l() {
      var f;
      try {
        f = e.storage.debug;
      } catch {
      }
      return !f && typeof process < "u" && "env" in process && (f = process.env.DEBUG), f;
    }
    e.enable(l());
    function p() {
      try {
        return window.localStorage;
      } catch {
      }
    }
  }(fs, fs.exports)), fs.exports;
}
var hs = { exports: {} }, Md;
function ZA() {
  return Md || (Md = 1, function(i, e) {
    var t = kc, s = Lt;
    e = i.exports = Jm(), e.init = y, e.log = f, e.formatArgs = p, e.save = m, e.load = h, e.useColors = l, e.colors = [6, 2, 3, 4, 5, 1], e.inspectOpts = Object.keys(process.env).filter(function(S) {
      return /^debug_/i.test(S);
    }).reduce(function(S, _) {
      var O = _.substring(6).toLowerCase().replace(/_([a-z])/g, function(F, $) {
        return $.toUpperCase();
      }), C = process.env[_];
      return /^(yes|on|true|enabled)$/i.test(C) ? C = !0 : /^(no|off|false|disabled)$/i.test(C) ? C = !1 : C === "null" ? C = null : C = Number(C), S[O] = C, S;
    }, {});
    var o = parseInt(process.env.DEBUG_FD, 10) || 2;
    o !== 1 && o !== 2 && s.deprecate(function() {
    }, "except for stderr(2) and stdout(1), any other usage of DEBUG_FD is deprecated. Override debug.log if you want to use a different log function (https://git.io/debug_fd)")();
    var c = o === 1 ? process.stdout : o === 2 ? process.stderr : g(o);
    function l() {
      return "colors" in e.inspectOpts ? !!e.inspectOpts.colors : t.isatty(o);
    }
    e.formatters.o = function(S) {
      return this.inspectOpts.colors = this.useColors, s.inspect(S, this.inspectOpts).split(`
`).map(function(_) {
        return _.trim();
      }).join(" ");
    }, e.formatters.O = function(S) {
      return this.inspectOpts.colors = this.useColors, s.inspect(S, this.inspectOpts);
    };
    function p(S) {
      var _ = this.namespace, O = this.useColors;
      if (O) {
        var C = this.color, F = "  \x1B[3" + C + ";1m" + _ + " \x1B[0m";
        S[0] = F + S[0].split(`
`).join(`
` + F), S.push("\x1B[3" + C + "m+" + e.humanize(this.diff) + "\x1B[0m");
      } else
        S[0] = (/* @__PURE__ */ new Date()).toUTCString() + " " + _ + " " + S[0];
    }
    function f() {
      return c.write(s.format.apply(s, arguments) + `
`);
    }
    function m(S) {
      S == null ? delete process.env.DEBUG : process.env.DEBUG = S;
    }
    function h() {
      return process.env.DEBUG;
    }
    function g(S) {
      var _, O = process.binding("tty_wrap");
      switch (O.guessHandleType(S)) {
        case "TTY":
          _ = new t.WriteStream(S), _._type = "tty", _._handle && _._handle.unref && _._handle.unref();
          break;
        case "FILE":
          var C = Gi;
          _ = new C.SyncWriteStream(S, { autoClose: !1 }), _._type = "fs";
          break;
        case "PIPE":
        case "TCP":
          var F = K_;
          _ = new F.Socket({
            fd: S,
            readable: !1,
            writable: !0
          }), _.readable = !1, _.read = null, _._type = "pipe", _._handle && _._handle.unref && _._handle.unref();
          break;
        default:
          throw new Error("Implement me. Unknown stream file type!");
      }
      return _.fd = S, _._isStdio = !0, _;
    }
    function y(S) {
      S.inspectOpts = {};
      for (var _ = Object.keys(e.inspectOpts), O = 0; O < _.length; O++)
        S.inspectOpts[_[O]] = e.inspectOpts[_[O]];
    }
    e.enable(h());
  }(hs, hs.exports)), hs.exports;
}
typeof process < "u" && process.type === "renderer" ? yc.exports = YA() : yc.exports = ZA();
var QA = yc.exports, wc = Re, eT = G_.spawn, Vm = QA("electron-squirrel-startup"), Xo = D_.app, Pd = function(i, e) {
  var t = wc.resolve(wc.dirname(process.execPath), "..", "Update.exe");
  Vm("Spawning `%s` with args `%s`", t, i), eT(t, i, {
    detached: !0
  }).on("close", e);
}, nT = function() {
  if (process.platform === "win32") {
    var i = process.argv[1];
    Vm("processing squirrel command `%s`", i);
    var e = wc.basename(process.execPath);
    if (i === "--squirrel-install" || i === "--squirrel-updated")
      return Pd(["--createShortcut=" + e], Xo.quit), !0;
    if (i === "--squirrel-uninstall")
      return Pd(["--removeShortcut=" + e], Xo.quit), !0;
    if (i === "--squirrel-obsolete")
      return Xo.quit(), !0;
  }
  return !1;
}, tT = nT();
const iT = /* @__PURE__ */ Ac(tT), Xm = pt.dirname(N_(import.meta.url));
process.env.APP_ROOT = pt.join(Xm, "..");
const _c = process.env.VITE_DEV_SERVER_URL, AT = pt.join(process.env.APP_ROOT, "dist-electron"), Ym = pt.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = _c ? pt.join(process.env.APP_ROOT, "public") : Ym;
let Ze;
iT && ti.quit();
function Zm() {
  Ze = new Ld({
    icon: pt.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: pt.join(Xm, "preload.mjs"),
      nodeIntegration: !1,
      contextIsolation: !0,
      webSecurity: !1,
      spellcheck: !1
    }
  }), Ze.menuBarVisible = !1, Ze.webContents.on("did-finish-load", () => {
    Ze == null || Ze.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), _c ? Ze.loadURL(_c) : Ze.loadFile(pt.join(Ym, "index.html")), Ze.once("ready-to-show", () => {
    Ze == null || Ze.maximize();
  });
}
ti.on("window-all-closed", () => {
  process.platform !== "darwin" && (ti.quit(), Ze = null);
});
ti.on("activate", () => {
  Ld.getAllWindows().length === 0 && Zm();
});
ti.whenReady().then(() => {
  Zm(), VA(Ze);
});
export {
  AT as MAIN_DIST,
  Ym as RENDERER_DIST,
  _c as VITE_DEV_SERVER_URL
};
