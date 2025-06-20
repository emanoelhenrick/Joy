import cr, { app as Ae, dialog as pr, ipcMain as O, BrowserWindow as Hi } from "electron";
import { fileURLToPath as lr } from "node:url";
import fe from "node:path";
import be from "util";
import * as ur from "path";
import F from "path";
import Ce from "fs";
import Oe from "crypto";
import xt from "os";
import Q, { Readable as dr } from "stream";
import vt from "http";
import bt from "https";
import Zn, { fileURLToPath as mr } from "url";
import fr from "assert";
import gt from "tty";
import he from "zlib";
import { EventEmitter as hr } from "events";
import xr, { spawn as vr } from "child_process";
import { Worker as br } from "worker_threads";
import gr from "net";
function Qn(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var ea = {}, yr = (e) => function() {
  const n = arguments.length, a = new Array(n);
  for (let t = 0; t < n; t += 1)
    a[t] = arguments[t];
  return new Promise((t, i) => {
    a.push((s, o) => {
      s ? i(s) : t(o);
    }), e.apply(null, a);
  });
};
const In = Ce, wr = yr, Er = (e) => [
  typeof In[e] == "function",
  !e.match(/Sync$/),
  !e.match(/^[A-Z]/),
  !e.match(/^create/),
  !e.match(/^(un)?watch/)
].every(Boolean), kr = (e) => {
  const n = In[e];
  return wr(n);
}, _r = () => {
  const e = {};
  return Object.keys(In).forEach((n) => {
    Er(n) ? n === "exists" ? e.exists = () => {
      throw new Error("fs.exists() is deprecated");
    } : e[n] = kr(n) : e[n] = In[n];
  }), e;
};
var X = _r(), $e = {};
const Sr = (e) => {
  const n = (a) => ["a", "e", "i", "o", "u"].indexOf(a[0]) !== -1 ? `an ${a}` : `a ${a}`;
  return e.map(n).join(" or ");
}, Vi = (e) => /array of /.test(e), Wi = (e) => e.split(" of ")[1], Ki = (e) => Vi(e) ? Ki(Wi(e)) : [
  "string",
  "number",
  "boolean",
  "array",
  "object",
  "buffer",
  "null",
  "undefined",
  "function"
].some((n) => n === e), Je = (e) => e === null ? "null" : Array.isArray(e) ? "array" : Buffer.isBuffer(e) ? "buffer" : typeof e, Ar = (e, n, a) => a.indexOf(e) === n, Tr = (e) => {
  let n = Je(e), a;
  return n === "array" && (a = e.map((t) => Je(t)).filter(Ar), n += ` of ${a.join(", ")}`), n;
}, Rr = (e, n) => {
  const a = Wi(n);
  return Je(e) !== "array" ? !1 : e.every((t) => Je(t) === a);
}, Ya = (e, n, a, t) => {
  if (!t.some((s) => {
    if (!Ki(s))
      throw new Error(`Unknown type "${s}"`);
    return Vi(s) ? Rr(a, s) : s === Je(a);
  }))
    throw new Error(
      `Argument "${n}" passed to ${e} must be ${Sr(
        t
      )}. Received ${Tr(a)}`
    );
}, jr = (e, n, a, t) => {
  a !== void 0 && (Ya(e, n, a, ["object"]), Object.keys(a).forEach((i) => {
    const s = `${n}.${i}`;
    if (t[i] !== void 0)
      Ya(e, s, a[i], t[i]);
    else
      throw new Error(
        `Unknown argument "${s}" passed to ${e}`
      );
  }));
};
var M = {
  argument: Ya,
  options: jr
}, te = {}, na = {};
na.normalizeFileMode = (e) => {
  let n;
  return typeof e == "number" ? n = e.toString(8) : n = e, n.substring(n.length - 3);
};
var Ue = {};
const Ji = X, Cr = M, Or = (e, n) => {
  const a = `${e}([path])`;
  Cr.argument(a, "path", n, ["string", "undefined"]);
}, $r = (e) => {
  Ji.rmSync(e, {
    recursive: !0,
    force: !0,
    maxRetries: 3
  });
}, Pr = (e) => Ji.rm(e, {
  recursive: !0,
  force: !0,
  maxRetries: 3
});
Ue.validateInput = Or;
Ue.sync = $r;
Ue.async = Pr;
const aa = F, ce = X, yt = na, Kt = M, Gi = Ue, Fr = (e, n, a) => {
  const t = `${e}(path, [criteria])`;
  Kt.argument(t, "path", n, ["string"]), Kt.options(t, "criteria", a, {
    empty: ["boolean"],
    mode: ["string", "number"]
  });
}, Yi = (e) => {
  const n = e || {};
  return typeof n.empty != "boolean" && (n.empty = !1), n.mode !== void 0 && (n.mode = yt.normalizeFileMode(n.mode)), n;
}, Xi = (e) => new Error(
  `Path ${e} exists but is not a directory. Halting jetpack.dir() call for safety reasons.`
), Lr = (e) => {
  let n;
  try {
    n = ce.statSync(e);
  } catch (a) {
    if (a.code !== "ENOENT")
      throw a;
  }
  if (n && !n.isDirectory())
    throw Xi(e);
  return n;
}, wt = (e, n) => {
  const a = n || {};
  try {
    ce.mkdirSync(e, a.mode);
  } catch (t) {
    if (t.code === "ENOENT")
      wt(aa.dirname(e), a), ce.mkdirSync(e, a.mode);
    else if (t.code !== "EEXIST") throw t;
  }
}, Nr = (e, n, a) => {
  const t = () => {
    const s = yt.normalizeFileMode(n.mode);
    a.mode !== void 0 && a.mode !== s && ce.chmodSync(e, a.mode);
  }, i = () => {
    a.empty && ce.readdirSync(e).forEach((o) => {
      Gi.sync(aa.resolve(e, o));
    });
  };
  t(), i();
}, Dr = (e, n) => {
  const a = Yi(n), t = Lr(e);
  t ? Nr(e, t, a) : wt(e, a);
}, Ir = (e) => new Promise((n, a) => {
  ce.stat(e).then((t) => {
    t.isDirectory() ? n(t) : a(Xi(e));
  }).catch((t) => {
    t.code === "ENOENT" ? n(void 0) : a(t);
  });
}), Ur = (e) => new Promise((n, a) => {
  ce.readdir(e).then((t) => {
    const i = (s) => {
      if (s === t.length)
        n();
      else {
        const o = aa.resolve(e, t[s]);
        Gi.async(o).then(() => {
          i(s + 1);
        });
      }
    };
    i(0);
  }).catch(a);
}), zr = (e, n, a) => new Promise((t, i) => {
  const s = () => {
    const r = yt.normalizeFileMode(n.mode);
    return a.mode !== void 0 && a.mode !== r ? ce.chmod(e, a.mode) : Promise.resolve();
  }, o = () => a.empty ? Ur(e) : Promise.resolve();
  s().then(o).then(t, i);
}), Et = (e, n) => {
  const a = n || {};
  return new Promise((t, i) => {
    ce.mkdir(e, a.mode).then(t).catch((s) => {
      s.code === "ENOENT" ? Et(aa.dirname(e), a).then(() => ce.mkdir(e, a.mode)).then(t).catch((o) => {
        o.code === "EEXIST" ? t() : i(o);
      }) : s.code === "EEXIST" ? t() : i(s);
    });
  });
}, Br = (e, n) => new Promise((a, t) => {
  const i = Yi(n);
  Ir(e).then((s) => s !== void 0 ? zr(
    e,
    s,
    i
  ) : Et(e, i)).then(a, t);
});
te.validateInput = Fr;
te.sync = Dr;
te.createSync = wt;
te.async = Br;
te.createAsync = Et;
const Zi = F, De = X, Ta = M, Qi = te, qr = (e, n, a, t) => {
  const i = `${e}(path, data, [options])`;
  Ta.argument(i, "path", n, ["string"]), Ta.argument(i, "data", a, [
    "string",
    "buffer",
    "object",
    "array"
  ]), Ta.options(i, "options", t, {
    mode: ["string", "number"],
    atomic: ["boolean"],
    jsonIndent: ["number"]
  });
}, Un = ".__new__", es = (e, n) => {
  let a = n;
  return typeof a != "number" && (a = 2), typeof e == "object" && !Buffer.isBuffer(e) && e !== null ? JSON.stringify(e, null, a) : e;
}, ns = (e, n, a) => {
  try {
    De.writeFileSync(e, n, a);
  } catch (t) {
    if (t.code === "ENOENT")
      Qi.createSync(Zi.dirname(e)), De.writeFileSync(e, n, a);
    else
      throw t;
  }
}, Mr = (e, n, a) => {
  ns(e + Un, n, a), De.renameSync(e + Un, e);
}, Hr = (e, n, a) => {
  const t = a || {}, i = es(n, t.jsonIndent);
  let s = ns;
  t.atomic && (s = Mr), s(e, i, { mode: t.mode });
}, as = (e, n, a) => new Promise((t, i) => {
  De.writeFile(e, n, a).then(t).catch((s) => {
    s.code === "ENOENT" ? Qi.createAsync(Zi.dirname(e)).then(() => De.writeFile(e, n, a)).then(t, i) : i(s);
  });
}), Vr = (e, n, a) => new Promise((t, i) => {
  as(e + Un, n, a).then(() => De.rename(e + Un, e)).then(t, i);
}), Wr = (e, n, a) => {
  const t = a || {}, i = es(n, t.jsonIndent);
  let s = as;
  return t.atomic && (s = Vr), s(e, i, { mode: t.mode });
};
$e.validateInput = qr;
$e.sync = Hr;
$e.async = Wr;
const ts = X, is = $e, Ra = M, Kr = (e, n, a, t) => {
  const i = `${e}(path, data, [options])`;
  Ra.argument(i, "path", n, ["string"]), Ra.argument(i, "data", a, ["string", "buffer"]), Ra.options(i, "options", t, {
    mode: ["string", "number"]
  });
}, Jr = (e, n, a) => {
  try {
    ts.appendFileSync(e, n, a);
  } catch (t) {
    if (t.code === "ENOENT")
      is.sync(e, n, a);
    else
      throw t;
  }
}, Gr = (e, n, a) => new Promise((t, i) => {
  ts.appendFile(e, n, a).then(t).catch((s) => {
    s.code === "ENOENT" ? is.async(e, n, a).then(t, i) : i(s);
  });
});
ea.validateInput = Kr;
ea.sync = Jr;
ea.async = Gr;
var ta = {};
const ia = X, kt = na, Jt = M, sa = $e, Yr = (e, n, a) => {
  const t = `${e}(path, [criteria])`;
  Jt.argument(t, "path", n, ["string"]), Jt.options(t, "criteria", a, {
    content: ["string", "buffer", "object", "array"],
    jsonIndent: ["number"],
    mode: ["string", "number"]
  });
}, ss = (e) => {
  const n = e || {};
  return n.mode !== void 0 && (n.mode = kt.normalizeFileMode(n.mode)), n;
}, os = (e) => new Error(
  `Path ${e} exists but is not a file. Halting jetpack.file() call for safety reasons.`
), Xr = (e) => {
  let n;
  try {
    n = ia.statSync(e);
  } catch (a) {
    if (a.code !== "ENOENT")
      throw a;
  }
  if (n && !n.isFile())
    throw os(e);
  return n;
}, Zr = (e, n, a) => {
  const t = kt.normalizeFileMode(n.mode), i = () => a.content !== void 0 ? (sa.sync(e, a.content, {
    mode: t,
    jsonIndent: a.jsonIndent
  }), !0) : !1, s = () => {
    a.mode !== void 0 && a.mode !== t && ia.chmodSync(e, a.mode);
  };
  i() || s();
}, Qr = (e, n) => {
  let a = "";
  n.content !== void 0 && (a = n.content), sa.sync(e, a, {
    mode: n.mode,
    jsonIndent: n.jsonIndent
  });
}, ec = (e, n) => {
  const a = ss(n), t = Xr(e);
  t !== void 0 ? Zr(e, t, a) : Qr(e, a);
}, nc = (e) => new Promise((n, a) => {
  ia.stat(e).then((t) => {
    t.isFile() ? n(t) : a(os(e));
  }).catch((t) => {
    t.code === "ENOENT" ? n(void 0) : a(t);
  });
}), ac = (e, n, a) => {
  const t = kt.normalizeFileMode(n.mode), i = () => new Promise((o, r) => {
    a.content !== void 0 ? sa.async(e, a.content, {
      mode: t,
      jsonIndent: a.jsonIndent
    }).then(() => {
      o(!0);
    }).catch(r) : o(!1);
  }), s = () => {
    if (a.mode !== void 0 && a.mode !== t)
      return ia.chmod(e, a.mode);
  };
  return i().then((o) => {
    if (!o)
      return s();
  });
}, tc = (e, n) => {
  let a = "";
  return n.content !== void 0 && (a = n.content), sa.async(e, a, {
    mode: n.mode,
    jsonIndent: n.jsonIndent
  });
}, ic = (e, n) => new Promise((a, t) => {
  const i = ss(n);
  nc(e).then((s) => s !== void 0 ? ac(e, s, i) : tc(e, i)).then(a, t);
});
ta.validateInput = Yr;
ta.sync = ec;
ta.async = ic;
var oa = {}, an = {}, pe = {};
const rs = Oe, sc = F, xe = X, Gt = M, Xa = ["md5", "sha1", "sha256", "sha512"], Za = ["report", "follow"], oc = (e, n, a) => {
  const t = `${e}(path, [options])`;
  if (Gt.argument(t, "path", n, ["string"]), Gt.options(t, "options", a, {
    checksum: ["string"],
    mode: ["boolean"],
    times: ["boolean"],
    absolutePath: ["boolean"],
    symlinks: ["string"]
  }), a && a.checksum !== void 0 && Xa.indexOf(a.checksum) === -1)
    throw new Error(
      `Argument "options.checksum" passed to ${t} must have one of values: ${Xa.join(
        ", "
      )}`
    );
  if (a && a.symlinks !== void 0 && Za.indexOf(a.symlinks) === -1)
    throw new Error(
      `Argument "options.symlinks" passed to ${t} must have one of values: ${Za.join(
        ", "
      )}`
    );
}, cs = (e, n, a) => {
  const t = {};
  return t.name = sc.basename(e), a.isFile() ? (t.type = "file", t.size = a.size) : a.isDirectory() ? t.type = "dir" : a.isSymbolicLink() ? t.type = "symlink" : t.type = "other", n.mode && (t.mode = a.mode), n.times && (t.accessTime = a.atime, t.modifyTime = a.mtime, t.changeTime = a.ctime, t.birthTime = a.birthtime), n.absolutePath && (t.absolutePath = e), t;
}, rc = (e, n) => {
  const a = rs.createHash(n), t = xe.readFileSync(e);
  return a.update(t), a.digest("hex");
}, cc = (e, n, a) => {
  n.type === "file" && a.checksum ? n[a.checksum] = rc(e, a.checksum) : n.type === "symlink" && (n.pointsAt = xe.readlinkSync(e));
}, pc = (e, n) => {
  let a = xe.lstatSync, t;
  const i = n || {};
  i.symlinks === "follow" && (a = xe.statSync);
  try {
    t = a(e);
  } catch (o) {
    if (o.code === "ENOENT")
      return;
    throw o;
  }
  const s = cs(e, i, t);
  return cc(e, s, i), s;
}, lc = (e, n) => new Promise((a, t) => {
  const i = rs.createHash(n), s = xe.createReadStream(e);
  s.on("data", (o) => {
    i.update(o);
  }), s.on("end", () => {
    a(i.digest("hex"));
  }), s.on("error", t);
}), uc = (e, n, a) => n.type === "file" && a.checksum ? lc(e, a.checksum).then((t) => (n[a.checksum] = t, n)) : n.type === "symlink" ? xe.readlink(e).then((t) => (n.pointsAt = t, n)) : Promise.resolve(n), dc = (e, n) => new Promise((a, t) => {
  let i = xe.lstat;
  const s = n || {};
  s.symlinks === "follow" && (i = xe.stat), i(e).then((o) => {
    const r = cs(e, s, o);
    uc(e, r, s).then(a, t);
  }).catch((o) => {
    o.code === "ENOENT" ? a(void 0) : t(o);
  });
});
pe.supportedChecksumAlgorithms = Xa;
pe.symlinkOptions = Za;
pe.validateInput = oc;
pe.sync = pc;
pe.async = dc;
var ra = {};
const ps = X, mc = M, fc = (e, n) => {
  const a = `${e}(path)`;
  mc.argument(a, "path", n, ["string", "undefined"]);
}, hc = (e) => {
  try {
    return ps.readdirSync(e);
  } catch (n) {
    if (n.code === "ENOENT")
      return;
    throw n;
  }
}, xc = (e) => new Promise((n, a) => {
  ps.readdir(e).then((t) => {
    n(t);
  }).catch((t) => {
    t.code === "ENOENT" ? n(void 0) : a(t);
  });
});
ra.validateInput = fc;
ra.sync = hc;
ra.async = xc;
const zn = Ce, Bn = F, Ke = pe, qn = (e) => e.isDirectory() ? "dir" : e.isFile() ? "file" : e.isSymbolicLink() ? "symlink" : "other", vc = (e, n, a) => {
  n.maxLevelsDeep === void 0 && (n.maxLevelsDeep = 1 / 0);
  const t = n.inspectOptions !== void 0;
  n.symlinks && (n.inspectOptions === void 0 ? n.inspectOptions = { symlinks: n.symlinks } : n.inspectOptions.symlinks = n.symlinks);
  const i = (o, r) => {
    zn.readdirSync(o, { withFileTypes: !0 }).forEach((c) => {
      const p = typeof c == "string";
      let l;
      p ? l = Bn.join(o, c) : l = Bn.join(o, c.name);
      let u;
      if (t)
        u = Ke.sync(l, n.inspectOptions);
      else if (p) {
        const d = Ke.sync(
          l,
          n.inspectOptions
        );
        u = { name: d.name, type: d.type };
      } else {
        const d = qn(c);
        if (d === "symlink" && n.symlinks === "follow") {
          const h = zn.statSync(l);
          u = { name: c.name, type: qn(h) };
        } else
          u = { name: c.name, type: d };
      }
      u !== void 0 && (a(l, u), u.type === "dir" && r < n.maxLevelsDeep && i(l, r + 1));
    });
  }, s = Ke.sync(e, n.inspectOptions);
  s ? (t ? a(e, s) : a(e, { name: s.name, type: s.type }), s.type === "dir" && i(e, 1)) : a(e, void 0);
}, bc = 5, gc = (e, n, a, t) => {
  n.maxLevelsDeep === void 0 && (n.maxLevelsDeep = 1 / 0);
  const i = n.inspectOptions !== void 0;
  n.symlinks && (n.inspectOptions === void 0 ? n.inspectOptions = { symlinks: n.symlinks } : n.inspectOptions.symlinks = n.symlinks);
  const s = [];
  let o = 0;
  const r = () => {
    if (s.length === 0 && o === 0)
      t();
    else if (s.length > 0 && o < bc) {
      const u = s.pop();
      o += 1, u();
    }
  }, c = (u) => {
    s.push(u), r();
  }, p = () => {
    o -= 1, r();
  }, l = (u, d) => {
    const h = (m, v) => {
      v.type === "dir" && d < n.maxLevelsDeep && l(m, d + 1);
    };
    c(() => {
      zn.readdir(u, { withFileTypes: !0 }, (m, v) => {
        m ? t(m) : (v.forEach((x) => {
          const b = typeof x == "string";
          let y;
          if (b ? y = Bn.join(u, x) : y = Bn.join(u, x.name), i || b)
            c(() => {
              Ke.async(y, n.inspectOptions).then((w) => {
                w !== void 0 && (i ? a(y, w) : a(y, {
                  name: w.name,
                  type: w.type
                }), h(y, w)), p();
              }).catch((w) => {
                t(w);
              });
            });
          else {
            const w = qn(x);
            if (w === "symlink" && n.symlinks === "follow")
              c(() => {
                zn.stat(y, (S, k) => {
                  if (S)
                    t(S);
                  else {
                    const P = {
                      name: x.name,
                      type: qn(k)
                    };
                    a(y, P), h(y, P), p();
                  }
                });
              });
            else {
              const S = { name: x.name, type: w };
              a(y, S), h(y, S);
            }
          }
        }), p());
      });
    });
  };
  Ke.async(e, n.inspectOptions).then((u) => {
    u ? (i ? a(e, u) : a(e, { name: u.name, type: u.type }), u.type === "dir" ? l(e, 1) : t()) : (a(e, void 0), t());
  }).catch((u) => {
    t(u);
  });
};
an.sync = vc;
an.async = gc;
var _t = {};
const yc = typeof process == "object" && process && process.platform === "win32";
var wc = yc ? { sep: "\\" } : { sep: "/" }, Ec = ls;
function ls(e, n, a) {
  e instanceof RegExp && (e = Yt(e, a)), n instanceof RegExp && (n = Yt(n, a));
  var t = us(e, n, a);
  return t && {
    start: t[0],
    end: t[1],
    pre: a.slice(0, t[0]),
    body: a.slice(t[0] + e.length, t[1]),
    post: a.slice(t[1] + n.length)
  };
}
function Yt(e, n) {
  var a = n.match(e);
  return a ? a[0] : null;
}
ls.range = us;
function us(e, n, a) {
  var t, i, s, o, r, c = a.indexOf(e), p = a.indexOf(n, c + 1), l = c;
  if (c >= 0 && p > 0) {
    if (e === n)
      return [c, p];
    for (t = [], s = a.length; l >= 0 && !r; )
      l == c ? (t.push(l), c = a.indexOf(e, l + 1)) : t.length == 1 ? r = [t.pop(), p] : (i = t.pop(), i < s && (s = i, o = p), p = a.indexOf(n, l + 1)), l = c < p && c >= 0 ? c : p;
    t.length && (r = [s, o]);
  }
  return r;
}
var ds = Ec, kc = Ac, ms = "\0SLASH" + Math.random() + "\0", fs = "\0OPEN" + Math.random() + "\0", St = "\0CLOSE" + Math.random() + "\0", hs = "\0COMMA" + Math.random() + "\0", xs = "\0PERIOD" + Math.random() + "\0";
function ja(e) {
  return parseInt(e, 10) == e ? parseInt(e, 10) : e.charCodeAt(0);
}
function _c(e) {
  return e.split("\\\\").join(ms).split("\\{").join(fs).split("\\}").join(St).split("\\,").join(hs).split("\\.").join(xs);
}
function Sc(e) {
  return e.split(ms).join("\\").split(fs).join("{").split(St).join("}").split(hs).join(",").split(xs).join(".");
}
function vs(e) {
  if (!e)
    return [""];
  var n = [], a = ds("{", "}", e);
  if (!a)
    return e.split(",");
  var t = a.pre, i = a.body, s = a.post, o = t.split(",");
  o[o.length - 1] += "{" + i + "}";
  var r = vs(s);
  return s.length && (o[o.length - 1] += r.shift(), o.push.apply(o, r)), n.push.apply(n, o), n;
}
function Ac(e) {
  return e ? (e.substr(0, 2) === "{}" && (e = "\\{\\}" + e.substr(2)), We(_c(e), !0).map(Sc)) : [];
}
function Tc(e) {
  return "{" + e + "}";
}
function Rc(e) {
  return /^-?0\d/.test(e);
}
function jc(e, n) {
  return e <= n;
}
function Cc(e, n) {
  return e >= n;
}
function We(e, n) {
  var a = [], t = ds("{", "}", e);
  if (!t) return [e];
  var i = t.pre, s = t.post.length ? We(t.post, !1) : [""];
  if (/\$$/.test(t.pre))
    for (var o = 0; o < s.length; o++) {
      var r = i + "{" + t.body + "}" + s[o];
      a.push(r);
    }
  else {
    var c = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(t.body), p = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(t.body), l = c || p, u = t.body.indexOf(",") >= 0;
    if (!l && !u)
      return t.post.match(/,.*\}/) ? (e = t.pre + "{" + t.body + St + t.post, We(e)) : [e];
    var d;
    if (l)
      d = t.body.split(/\.\./);
    else if (d = vs(t.body), d.length === 1 && (d = We(d[0], !1).map(Tc), d.length === 1))
      return s.map(function(J) {
        return t.pre + d[0] + J;
      });
    var h;
    if (l) {
      var m = ja(d[0]), v = ja(d[1]), x = Math.max(d[0].length, d[1].length), b = d.length == 3 ? Math.abs(ja(d[2])) : 1, y = jc, w = v < m;
      w && (b *= -1, y = Cc);
      var S = d.some(Rc);
      h = [];
      for (var k = m; y(k, v); k += b) {
        var P;
        if (p)
          P = String.fromCharCode(k), P === "\\" && (P = "");
        else if (P = String(k), S) {
          var E = x - P.length;
          if (E > 0) {
            var A = new Array(E + 1).join("0");
            k < 0 ? P = "-" + A + P.slice(1) : P = A + P;
          }
        }
        h.push(P);
      }
    } else {
      h = [];
      for (var R = 0; R < d.length; R++)
        h.push.apply(h, We(d[R], !1));
    }
    for (var R = 0; R < h.length; R++)
      for (var o = 0; o < s.length; o++) {
        var r = i + h[R] + s[o];
        (!n || l || r) && a.push(r);
      }
  }
  return a;
}
const Y = bs = (e, n, a = {}) => (Mn(n), !a.nocomment && n.charAt(0) === "#" ? !1 : new ca(n, a).match(e));
var bs = Y;
const Qa = wc;
Y.sep = Qa.sep;
const ae = Symbol("globstar **");
Y.GLOBSTAR = ae;
const Oc = kc, Xt = {
  "!": { open: "(?:(?!(?:", close: "))[^/]*?)" },
  "?": { open: "(?:", close: ")?" },
  "+": { open: "(?:", close: ")+" },
  "*": { open: "(?:", close: ")*" },
  "@": { open: "(?:", close: ")" }
}, et = "[^/]", Ca = et + "*?", $c = "(?:(?!(?:\\/|^)(?:\\.{1,2})($|\\/)).)*?", Pc = "(?:(?!(?:\\/|^)\\.).)*?", gs = (e) => e.split("").reduce((n, a) => (n[a] = !0, n), {}), Zt = gs("().*{}+?[]^$\\!"), Fc = gs("[.("), Qt = /\/+/;
Y.filter = (e, n = {}) => (a, t, i) => Y(a, e, n);
const me = (e, n = {}) => {
  const a = {};
  return Object.keys(e).forEach((t) => a[t] = e[t]), Object.keys(n).forEach((t) => a[t] = n[t]), a;
};
Y.defaults = (e) => {
  if (!e || typeof e != "object" || !Object.keys(e).length)
    return Y;
  const n = Y, a = (t, i, s) => n(t, i, me(e, s));
  return a.Minimatch = class extends n.Minimatch {
    constructor(i, s) {
      super(i, me(e, s));
    }
  }, a.Minimatch.defaults = (t) => n.defaults(me(e, t)).Minimatch, a.filter = (t, i) => n.filter(t, me(e, i)), a.defaults = (t) => n.defaults(me(e, t)), a.makeRe = (t, i) => n.makeRe(t, me(e, i)), a.braceExpand = (t, i) => n.braceExpand(t, me(e, i)), a.match = (t, i, s) => n.match(t, i, me(e, s)), a;
};
Y.braceExpand = (e, n) => ys(e, n);
const ys = (e, n = {}) => (Mn(e), n.nobrace || !/\{(?:(?!\{).)*\}/.test(e) ? [e] : Oc(e)), Lc = 1024 * 64, Mn = (e) => {
  if (typeof e != "string")
    throw new TypeError("invalid pattern");
  if (e.length > Lc)
    throw new TypeError("pattern is too long");
}, Oa = Symbol("subparse");
Y.makeRe = (e, n) => new ca(e, n || {}).makeRe();
Y.match = (e, n, a = {}) => {
  const t = new ca(n, a);
  return e = e.filter((i) => t.match(i)), t.options.nonull && !e.length && e.push(n), e;
};
const Nc = (e) => e.replace(/\\(.)/g, "$1"), Dc = (e) => e.replace(/\\([^-\]])/g, "$1"), Ic = (e) => e.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), Uc = (e) => e.replace(/[[\]\\]/g, "\\$&");
let ca = class {
  constructor(n, a) {
    Mn(n), a || (a = {}), this.options = a, this.set = [], this.pattern = n, this.windowsPathsNoEscape = !!a.windowsPathsNoEscape || a.allowWindowsEscape === !1, this.windowsPathsNoEscape && (this.pattern = this.pattern.replace(/\\/g, "/")), this.regexp = null, this.negate = !1, this.comment = !1, this.empty = !1, this.partial = !!a.partial, this.make();
  }
  debug() {
  }
  make() {
    const n = this.pattern, a = this.options;
    if (!a.nocomment && n.charAt(0) === "#") {
      this.comment = !0;
      return;
    }
    if (!n) {
      this.empty = !0;
      return;
    }
    this.parseNegate();
    let t = this.globSet = this.braceExpand();
    a.debug && (this.debug = (...i) => console.error(...i)), this.debug(this.pattern, t), t = this.globParts = t.map((i) => i.split(Qt)), this.debug(this.pattern, t), t = t.map((i, s, o) => i.map(this.parse, this)), this.debug(this.pattern, t), t = t.filter((i) => i.indexOf(!1) === -1), this.debug(this.pattern, t), this.set = t;
  }
  parseNegate() {
    if (this.options.nonegate) return;
    const n = this.pattern;
    let a = !1, t = 0;
    for (let i = 0; i < n.length && n.charAt(i) === "!"; i++)
      a = !a, t++;
    t && (this.pattern = n.slice(t)), this.negate = a;
  }
  // set partial to true to test if, for example,
  // "/a/b" matches the start of "/*/b/*/d"
  // Partial means, if you run out of file before you run
  // out of pattern, then that's fine, as long as all
  // the parts match.
  matchOne(n, a, t) {
    var i = this.options;
    this.debug(
      "matchOne",
      { this: this, file: n, pattern: a }
    ), this.debug("matchOne", n.length, a.length);
    for (var s = 0, o = 0, r = n.length, c = a.length; s < r && o < c; s++, o++) {
      this.debug("matchOne loop");
      var p = a[o], l = n[s];
      if (this.debug(a, p, l), p === !1) return !1;
      if (p === ae) {
        this.debug("GLOBSTAR", [a, p, l]);
        var u = s, d = o + 1;
        if (d === c) {
          for (this.debug("** at the end"); s < r; s++)
            if (n[s] === "." || n[s] === ".." || !i.dot && n[s].charAt(0) === ".") return !1;
          return !0;
        }
        for (; u < r; ) {
          var h = n[u];
          if (this.debug(`
globstar while`, n, u, a, d, h), this.matchOne(n.slice(u), a.slice(d), t))
            return this.debug("globstar found match!", u, r, h), !0;
          if (h === "." || h === ".." || !i.dot && h.charAt(0) === ".") {
            this.debug("dot detected!", n, u, a, d);
            break;
          }
          this.debug("globstar swallow a segment, and continue"), u++;
        }
        return !!(t && (this.debug(`
>>> no match, partial?`, n, u, a, d), u === r));
      }
      var m;
      if (typeof p == "string" ? (m = l === p, this.debug("string match", p, l, m)) : (m = l.match(p), this.debug("pattern match", p, l, m)), !m) return !1;
    }
    if (s === r && o === c)
      return !0;
    if (s === r)
      return t;
    if (o === c)
      return s === r - 1 && n[s] === "";
    throw new Error("wtf?");
  }
  braceExpand() {
    return ys(this.pattern, this.options);
  }
  parse(n, a) {
    Mn(n);
    const t = this.options;
    if (n === "**")
      if (t.noglobstar)
        n = "*";
      else
        return ae;
    if (n === "") return "";
    let i = "", s = !1, o = !1;
    const r = [], c = [];
    let p, l = !1, u = -1, d = -1, h, m, v, x = n.charAt(0) === ".", b = t.dot || x;
    const y = () => x ? "" : b ? "(?!(?:^|\\/)\\.{1,2}(?:$|\\/))" : "(?!\\.)", w = (E) => E.charAt(0) === "." ? "" : t.dot ? "(?!(?:^|\\/)\\.{1,2}(?:$|\\/))" : "(?!\\.)", S = () => {
      if (p) {
        switch (p) {
          case "*":
            i += Ca, s = !0;
            break;
          case "?":
            i += et, s = !0;
            break;
          default:
            i += "\\" + p;
            break;
        }
        this.debug("clearStateChar %j %j", p, i), p = !1;
      }
    };
    for (let E = 0, A; E < n.length && (A = n.charAt(E)); E++) {
      if (this.debug("%s	%s %s %j", n, E, i, A), o) {
        if (A === "/")
          return !1;
        Zt[A] && (i += "\\"), i += A, o = !1;
        continue;
      }
      switch (A) {
        case "/":
          return !1;
        case "\\":
          if (l && n.charAt(E + 1) === "-") {
            i += A;
            continue;
          }
          S(), o = !0;
          continue;
        case "?":
        case "*":
        case "+":
        case "@":
        case "!":
          if (this.debug("%s	%s %s %j <-- stateChar", n, E, i, A), l) {
            this.debug("  in class"), A === "!" && E === d + 1 && (A = "^"), i += A;
            continue;
          }
          this.debug("call clearStateChar %j", p), S(), p = A, t.noext && S();
          continue;
        case "(": {
          if (l) {
            i += "(";
            continue;
          }
          if (!p) {
            i += "\\(";
            continue;
          }
          const R = {
            type: p,
            start: E - 1,
            reStart: i.length,
            open: Xt[p].open,
            close: Xt[p].close
          };
          this.debug(this.pattern, "	", R), r.push(R), i += R.open, R.start === 0 && R.type !== "!" && (x = !0, i += w(n.slice(E + 1))), this.debug("plType %j %j", p, i), p = !1;
          continue;
        }
        case ")": {
          const R = r[r.length - 1];
          if (l || !R) {
            i += "\\)";
            continue;
          }
          r.pop(), S(), s = !0, m = R, i += m.close, m.type === "!" && c.push(Object.assign(m, { reEnd: i.length }));
          continue;
        }
        case "|": {
          const R = r[r.length - 1];
          if (l || !R) {
            i += "\\|";
            continue;
          }
          S(), i += "|", R.start === 0 && R.type !== "!" && (x = !0, i += w(n.slice(E + 1)));
          continue;
        }
        case "[":
          if (S(), l) {
            i += "\\" + A;
            continue;
          }
          l = !0, d = E, u = i.length, i += A;
          continue;
        case "]":
          if (E === d + 1 || !l) {
            i += "\\" + A;
            continue;
          }
          h = n.substring(d + 1, E);
          try {
            RegExp("[" + Uc(Dc(h)) + "]"), i += A;
          } catch {
            i = i.substring(0, u) + "(?:$.)";
          }
          s = !0, l = !1;
          continue;
        default:
          S(), Zt[A] && !(A === "^" && l) && (i += "\\"), i += A;
          break;
      }
    }
    for (l && (h = n.slice(d + 1), v = this.parse(h, Oa), i = i.substring(0, u) + "\\[" + v[0], s = s || v[1]), m = r.pop(); m; m = r.pop()) {
      let E;
      E = i.slice(m.reStart + m.open.length), this.debug("setting tail", i, m), E = E.replace(/((?:\\{2}){0,64})(\\?)\|/g, (R, J, ne) => (ne || (ne = "\\"), J + J + ne + "|")), this.debug(`tail=%j
   %s`, E, E, m, i);
      const A = m.type === "*" ? Ca : m.type === "?" ? et : "\\" + m.type;
      s = !0, i = i.slice(0, m.reStart) + A + "\\(" + E;
    }
    S(), o && (i += "\\\\");
    const k = Fc[i.charAt(0)];
    for (let E = c.length - 1; E > -1; E--) {
      const A = c[E], R = i.slice(0, A.reStart), J = i.slice(A.reStart, A.reEnd - 8);
      let ne = i.slice(A.reEnd);
      const ge = i.slice(A.reEnd - 8, A.reEnd) + ne, un = R.split(")").length, B = R.split("(").length - un;
      let ue = ne;
      for (let _ = 0; _ < B; _++)
        ue = ue.replace(/\)[+*?]?/, "");
      ne = ue;
      const qe = ne === "" && a !== Oa ? "(?:$|\\/)" : "";
      i = R + J + ne + qe + ge;
    }
    if (i !== "" && s && (i = "(?=.)" + i), k && (i = y() + i), a === Oa)
      return [i, s];
    if (t.nocase && !s && (s = n.toUpperCase() !== n.toLowerCase()), !s)
      return Nc(n);
    const P = t.nocase ? "i" : "";
    try {
      return Object.assign(new RegExp("^" + i + "$", P), {
        _glob: n,
        _src: i
      });
    } catch {
      return new RegExp("$.");
    }
  }
  makeRe() {
    if (this.regexp || this.regexp === !1) return this.regexp;
    const n = this.set;
    if (!n.length)
      return this.regexp = !1, this.regexp;
    const a = this.options, t = a.noglobstar ? Ca : a.dot ? $c : Pc, i = a.nocase ? "i" : "";
    let s = n.map((o) => (o = o.map(
      (r) => typeof r == "string" ? Ic(r) : r === ae ? ae : r._src
    ).reduce((r, c) => (r[r.length - 1] === ae && c === ae || r.push(c), r), []), o.forEach((r, c) => {
      r !== ae || o[c - 1] === ae || (c === 0 ? o.length > 1 ? o[c + 1] = "(?:\\/|" + t + "\\/)?" + o[c + 1] : o[c] = t : c === o.length - 1 ? o[c - 1] += "(?:\\/|" + t + ")?" : (o[c - 1] += "(?:\\/|\\/" + t + "\\/)" + o[c + 1], o[c + 1] = ae));
    }), o.filter((r) => r !== ae).join("/"))).join("|");
    s = "^(?:" + s + ")$", this.negate && (s = "^(?!" + s + ").*$");
    try {
      this.regexp = new RegExp(s, i);
    } catch {
      this.regexp = !1;
    }
    return this.regexp;
  }
  match(n, a = this.partial) {
    if (this.debug("match", n, this.pattern), this.comment) return !1;
    if (this.empty) return n === "";
    if (n === "/" && a) return !0;
    const t = this.options;
    Qa.sep !== "/" && (n = n.split(Qa.sep).join("/")), n = n.split(Qt), this.debug(this.pattern, "split", n);
    const i = this.set;
    this.debug(this.pattern, "set", i);
    let s;
    for (let o = n.length - 1; o >= 0 && (s = n[o], !s); o--)
      ;
    for (let o = 0; o < i.length; o++) {
      const r = i[o];
      let c = n;
      if (t.matchBase && r.length === 1 && (c = [s]), this.matchOne(c, r, a))
        return t.flipNegate ? !0 : !this.negate;
    }
    return t.flipNegate ? !1 : this.negate;
  }
  static defaults(n) {
    return Y.defaults(n).Minimatch;
  }
};
Y.Minimatch = ca;
const zc = bs.Minimatch, Bc = (e, n) => {
  const a = n.indexOf("/") !== -1, t = /^!?\//.test(n), i = /^!/.test(n);
  let s;
  if (!t && a) {
    const o = n.replace(/^!/, "").replace(/^\.\//, "");
    return /\/$/.test(e) ? s = "" : s = "/", i ? `!${e}${s}${o}` : `${e}${s}${o}`;
  }
  return n;
};
_t.create = (e, n, a) => {
  let t;
  typeof n == "string" ? t = [n] : t = n;
  const i = t.map((o) => Bc(e, o)).map((o) => new zc(o, {
    matchBase: !0,
    nocomment: !0,
    nocase: a || !1,
    dot: !0,
    windowsPathsNoEscape: !0
  }));
  return (o) => {
    let r = "matching", c = !1, p, l;
    for (l = 0; l < i.length; l += 1) {
      if (p = i[l], p.negate && (r = "negation", l === 0 && (c = !0)), r === "negation" && c && !p.match(o))
        return !1;
      r === "matching" && !c && (c = p.match(o));
    }
    return c;
  };
};
const qc = F, ws = an, Es = pe, ks = _t, ei = M, Mc = (e, n, a) => {
  const t = `${e}([path], options)`;
  ei.argument(t, "path", n, ["string"]), ei.options(t, "options", a, {
    matching: ["string", "array of string"],
    filter: ["function"],
    files: ["boolean"],
    directories: ["boolean"],
    recursive: ["boolean"],
    ignoreCase: ["boolean"]
  });
}, _s = (e) => {
  const n = e || {};
  return n.matching === void 0 && (n.matching = "*"), n.files === void 0 && (n.files = !0), n.ignoreCase === void 0 && (n.ignoreCase = !1), n.directories === void 0 && (n.directories = !1), n.recursive === void 0 && (n.recursive = !0), n;
}, Ss = (e, n) => e.map((a) => qc.relative(n, a)), As = (e) => {
  const n = new Error(`Path you want to find stuff in doesn't exist ${e}`);
  return n.code = "ENOENT", n;
}, Ts = (e) => {
  const n = new Error(
    `Path you want to find stuff in must be a directory ${e}`
  );
  return n.code = "ENOTDIR", n;
}, Hc = (e, n) => {
  const a = [], t = ks.create(
    e,
    n.matching,
    n.ignoreCase
  );
  let i = 1 / 0;
  return n.recursive === !1 && (i = 1), ws.sync(
    e,
    {
      maxLevelsDeep: i,
      symlinks: "follow",
      inspectOptions: { times: !0, absolutePath: !0 }
    },
    (s, o) => {
      o && s !== e && t(s) && (o.type === "file" && n.files === !0 || o.type === "dir" && n.directories === !0) && (n.filter ? n.filter(o) && a.push(s) : a.push(s));
    }
  ), a.sort(), Ss(a, n.cwd);
}, Vc = (e, n) => {
  const a = Es.sync(e, { symlinks: "follow" });
  if (a === void 0)
    throw As(e);
  if (a.type !== "dir")
    throw Ts(e);
  return Hc(e, _s(n));
}, Wc = (e, n) => new Promise((a, t) => {
  const i = [], s = ks.create(
    e,
    n.matching,
    n.ignoreCase
  );
  let o = 1 / 0;
  n.recursive === !1 && (o = 1);
  let r = 0, c = !1;
  const p = () => {
    c && r === 0 && (i.sort(), a(Ss(i, n.cwd)));
  };
  ws.async(
    e,
    {
      maxLevelsDeep: o,
      symlinks: "follow",
      inspectOptions: { times: !0, absolutePath: !0 }
    },
    (l, u) => {
      if (u && l !== e && s(l) && (u.type === "file" && n.files === !0 || u.type === "dir" && n.directories === !0))
        if (n.filter) {
          const h = n.filter(u);
          typeof h.then == "function" ? (r += 1, h.then((v) => {
            v && i.push(l), r -= 1, p();
          }).catch((v) => {
            t(v);
          })) : h && i.push(l);
        } else
          i.push(l);
    },
    (l) => {
      l ? t(l) : (c = !0, p());
    }
  );
}), Kc = (e, n) => Es.async(e, { symlinks: "follow" }).then((a) => {
  if (a === void 0)
    throw As(e);
  if (a.type !== "dir")
    throw Ts(e);
  return Wc(e, _s(n));
});
oa.validateInput = Mc;
oa.sync = Vc;
oa.async = Kc;
var pa = {};
const Jc = Oe, Hn = F, dn = pe, ni = M, Rs = an, Gc = (e, n, a) => {
  const t = `${e}(path, [options])`;
  if (ni.argument(t, "path", n, ["string"]), ni.options(t, "options", a, {
    checksum: ["string"],
    relativePath: ["boolean"],
    times: ["boolean"],
    symlinks: ["string"]
  }), a && a.checksum !== void 0 && dn.supportedChecksumAlgorithms.indexOf(a.checksum) === -1)
    throw new Error(
      `Argument "options.checksum" passed to ${t} must have one of values: ${dn.supportedChecksumAlgorithms.join(
        ", "
      )}`
    );
  if (a && a.symlinks !== void 0 && dn.symlinkOptions.indexOf(a.symlinks) === -1)
    throw new Error(
      `Argument "options.symlinks" passed to ${t} must have one of values: ${dn.symlinkOptions.join(
        ", "
      )}`
    );
}, Yc = (e, n) => e === void 0 ? "." : e.relativePath + "/" + n.name, Xc = (e, n) => {
  const a = Jc.createHash(n);
  return e.forEach((t) => {
    a.update(t.name + t[n]);
  }), a.digest("hex");
}, At = (e, n, a) => {
  a.relativePath && (n.relativePath = Yc(e, n)), n.type === "dir" && (n.children.forEach((t) => {
    At(n, t, a);
  }), n.size = 0, n.children.sort((t, i) => t.type === "dir" && i.type === "file" ? -1 : t.type === "file" && i.type === "dir" ? 1 : t.name.localeCompare(i.name)), n.children.forEach((t) => {
    n.size += t.size || 0;
  }), a.checksum && (n[a.checksum] = Xc(
    n.children,
    a.checksum
  )));
}, Tt = (e, n, a) => {
  const t = n[0];
  if (n.length > 1) {
    const i = e.children.find((s) => s.name === t);
    return Tt(i, n.slice(1));
  }
  return e;
}, Zc = (e, n) => {
  const a = n || {};
  let t;
  return Rs.sync(e, { inspectOptions: a }, (i, s) => {
    if (s) {
      s.type === "dir" && (s.children = []);
      const o = Hn.relative(e, i);
      o === "" ? t = s : Tt(
        t,
        o.split(Hn.sep)
      ).children.push(s);
    }
  }), t && At(void 0, t, a), t;
}, Qc = (e, n) => {
  const a = n || {};
  let t;
  return new Promise((i, s) => {
    Rs.async(
      e,
      { inspectOptions: a },
      (o, r) => {
        if (r) {
          r.type === "dir" && (r.children = []);
          const c = Hn.relative(e, o);
          c === "" ? t = r : Tt(
            t,
            c.split(Hn.sep)
          ).children.push(r);
        }
      },
      (o) => {
        o ? s(o) : (t && At(void 0, t, a), i(t));
      }
    );
  });
};
pa.validateInput = Gc;
pa.sync = Zc;
pa.async = Qc;
var tn = {}, ze = {};
const js = X, ep = M, np = (e, n) => {
  const a = `${e}(path)`;
  ep.argument(a, "path", n, ["string"]);
}, ap = (e) => {
  try {
    const n = js.statSync(e);
    return n.isDirectory() ? "dir" : n.isFile() ? "file" : "other";
  } catch (n) {
    if (n.code !== "ENOENT")
      throw n;
  }
  return !1;
}, tp = (e) => new Promise((n, a) => {
  js.stat(e).then((t) => {
    t.isDirectory() ? n("dir") : t.isFile() ? n("file") : n("other");
  }).catch((t) => {
    t.code === "ENOENT" ? n(!1) : a(t);
  });
});
ze.validateInput = np;
ze.sync = ap;
ze.async = tp;
const Ge = F, G = X, Rt = te, Vn = ze, Cs = pe, ip = $e, sp = _t, Os = na, $s = an, $a = M, op = (e, n, a, t) => {
  const i = `${e}(from, to, [options])`;
  $a.argument(i, "from", n, ["string"]), $a.argument(i, "to", a, ["string"]), $a.options(i, "options", t, {
    overwrite: ["boolean", "function"],
    matching: ["string", "array of string"],
    ignoreCase: ["boolean"]
  });
}, Ps = (e, n) => {
  const a = e || {}, t = {};
  return a.ignoreCase === void 0 && (a.ignoreCase = !1), t.overwrite = a.overwrite, a.matching ? t.allowedToCopy = sp.create(
    n,
    a.matching,
    a.ignoreCase
  ) : t.allowedToCopy = () => !0, t;
}, Fs = (e) => {
  const n = new Error(`Path to copy doesn't exist ${e}`);
  return n.code = "ENOENT", n;
}, la = (e) => {
  const n = new Error(`Destination path already exists ${e}`);
  return n.code = "EEXIST", n;
}, ua = {
  mode: !0,
  symlinks: "report",
  times: !0,
  absolutePath: !0
}, Ls = (e) => typeof e.opts.overwrite != "function" && e.opts.overwrite !== !0, rp = (e, n, a) => {
  if (!Vn.sync(e))
    throw Fs(e);
  if (Vn.sync(n) && !a.overwrite)
    throw la(n);
}, cp = (e) => {
  if (typeof e.opts.overwrite == "function") {
    const n = Cs.sync(e.destPath, ua);
    return e.opts.overwrite(e.srcInspectData, n);
  }
  return e.opts.overwrite === !0;
}, pp = (e, n, a, t) => {
  const i = G.readFileSync(e);
  try {
    G.writeFileSync(n, i, { mode: a, flag: "wx" });
  } catch (s) {
    if (s.code === "ENOENT")
      ip.sync(n, i, { mode: a });
    else if (s.code === "EEXIST") {
      if (cp(t))
        G.writeFileSync(n, i, { mode: a });
      else if (Ls(t))
        throw la(t.destPath);
    } else
      throw s;
  }
}, lp = (e, n) => {
  const a = G.readlinkSync(e);
  try {
    G.symlinkSync(a, n);
  } catch (t) {
    if (t.code === "EEXIST")
      G.unlinkSync(n), G.symlinkSync(a, n);
    else
      throw t;
  }
}, up = (e, n, a, t) => {
  const i = { destPath: a, srcInspectData: n, opts: t }, s = Os.normalizeFileMode(n.mode);
  n.type === "dir" ? Rt.createSync(a, { mode: s }) : n.type === "file" ? pp(e, a, s, i) : n.type === "symlink" && lp(e, a);
}, dp = (e, n, a) => {
  const t = Ps(a, e);
  rp(e, n, t), $s.sync(e, { inspectOptions: ua }, (i, s) => {
    const o = Ge.relative(e, i), r = Ge.resolve(n, o);
    t.allowedToCopy(i, r, s) && up(i, s, r, t);
  });
}, mp = (e, n, a) => Vn.async(e).then((t) => {
  if (t)
    return Vn.async(n);
  throw Fs(e);
}).then((t) => {
  if (t && !a.overwrite)
    throw la(n);
}), fp = (e) => new Promise((n, a) => {
  typeof e.opts.overwrite == "function" ? Cs.async(e.destPath, ua).then((t) => {
    n(
      e.opts.overwrite(e.srcInspectData, t)
    );
  }).catch(a) : n(e.opts.overwrite === !0);
}), nt = (e, n, a, t, i) => new Promise((s, o) => {
  const r = i || {};
  let c = "wx";
  r.overwrite && (c = "w");
  const p = G.createReadStream(e), l = G.createWriteStream(n, { mode: a, flags: c });
  p.on("error", o), l.on("error", (u) => {
    p.resume(), u.code === "ENOENT" ? Rt.createAsync(Ge.dirname(n)).then(() => {
      nt(e, n, a, t).then(
        s,
        o
      );
    }).catch(o) : u.code === "EEXIST" ? fp(t).then((d) => {
      d ? nt(e, n, a, t, {
        overwrite: !0
      }).then(s, o) : Ls(t) ? o(la(n)) : s();
    }).catch(o) : o(u);
  }), l.on("finish", s), p.pipe(l);
}), hp = (e, n) => G.readlink(e).then((a) => new Promise((t, i) => {
  G.symlink(a, n).then(t).catch((s) => {
    s.code === "EEXIST" ? G.unlink(n).then(() => G.symlink(a, n)).then(t, i) : i(s);
  });
})), xp = (e, n, a, t) => {
  const i = { destPath: a, srcInspectData: n, opts: t }, s = Os.normalizeFileMode(n.mode);
  return n.type === "dir" ? Rt.createAsync(a, { mode: s }) : n.type === "file" ? nt(e, a, s, i) : n.type === "symlink" ? hp(e, a) : Promise.resolve();
}, vp = (e, n, a) => new Promise((t, i) => {
  const s = Ps(a, e);
  mp(e, n, s).then(() => {
    let o = !1, r = 0;
    $s.async(
      e,
      { inspectOptions: ua },
      (c, p) => {
        if (p) {
          const l = Ge.relative(e, c), u = Ge.resolve(n, l);
          s.allowedToCopy(c, p, u) && (r += 1, xp(c, p, u, s).then(() => {
            r -= 1, o && r === 0 && t();
          }).catch(i));
        }
      },
      (c) => {
        c ? i(c) : (o = !0, o && r === 0 && t());
      }
    );
  }).catch(i);
});
tn.validateInput = op;
tn.sync = dp;
tn.async = vp;
var sn = {};
const Ns = F, Ne = X, Pa = M, Ds = tn, Is = te, Ye = ze, Wn = Ue, bp = (e, n, a, t) => {
  const i = `${e}(from, to, [options])`;
  Pa.argument(i, "from", n, ["string"]), Pa.argument(i, "to", a, ["string"]), Pa.options(i, "options", t, {
    overwrite: ["boolean"]
  });
}, Us = (e) => e || {}, zs = (e) => {
  const n = new Error(`Destination path already exists ${e}`);
  return n.code = "EEXIST", n;
}, Bs = (e) => {
  const n = new Error(`Path to move doesn't exist ${e}`);
  return n.code = "ENOENT", n;
}, gp = (e, n, a) => {
  const t = Us(a);
  if (Ye.sync(n) !== !1 && t.overwrite !== !0)
    throw zs(n);
  try {
    Ne.renameSync(e, n);
  } catch (i) {
    if (i.code === "EISDIR" || i.code === "EPERM")
      Wn.sync(n), Ne.renameSync(e, n);
    else if (i.code === "EXDEV")
      Ds.sync(e, n, { overwrite: !0 }), Wn.sync(e);
    else if (i.code === "ENOENT") {
      if (!Ye.sync(e))
        throw Bs(e);
      Is.createSync(Ns.dirname(n)), Ne.renameSync(e, n);
    } else
      throw i;
  }
}, yp = (e) => new Promise((n, a) => {
  const t = Ns.dirname(e);
  Ye.async(t).then((i) => {
    i ? a() : Is.createAsync(t).then(n, a);
  }).catch(a);
}), wp = (e, n, a) => {
  const t = Us(a);
  return new Promise((i, s) => {
    Ye.async(n).then((o) => {
      o !== !1 && t.overwrite !== !0 ? s(zs(n)) : Ne.rename(e, n).then(i).catch((r) => {
        r.code === "EISDIR" || r.code === "EPERM" ? Wn.async(n).then(() => Ne.rename(e, n)).then(i, s) : r.code === "EXDEV" ? Ds.async(e, n, { overwrite: !0 }).then(() => Wn.async(e)).then(i, s) : r.code === "ENOENT" ? Ye.async(e).then((c) => {
          c ? yp(n).then(() => Ne.rename(e, n)).then(i, s) : s(Bs(e));
        }).catch(s) : s(r);
      });
    });
  });
};
sn.validateInput = bp;
sn.sync = gp;
sn.async = wp;
var da = {};
const qs = X, ai = M, ti = ["utf8", "buffer", "json", "jsonWithDates"], Ep = (e, n, a) => {
  const t = `${e}(path, returnAs)`;
  if (ai.argument(t, "path", n, ["string"]), ai.argument(t, "returnAs", a, [
    "string",
    "undefined"
  ]), a && ti.indexOf(a) === -1)
    throw new Error(
      `Argument "returnAs" passed to ${t} must have one of values: ${ti.join(
        ", "
      )}`
    );
}, Ms = (e, n) => typeof n == "string" && /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/.exec(n) ? new Date(n) : n, Hs = (e, n) => {
  const a = new Error(
    `JSON parsing failed while reading ${e} [${n}]`
  );
  return a.originalError = n, a;
}, kp = (e, n) => {
  const a = n || "utf8";
  let t, i = "utf8";
  a === "buffer" && (i = null);
  try {
    t = qs.readFileSync(e, { encoding: i });
  } catch (s) {
    if (s.code === "ENOENT")
      return;
    throw s;
  }
  try {
    a === "json" ? t = JSON.parse(t) : a === "jsonWithDates" && (t = JSON.parse(t, Ms));
  } catch (s) {
    throw Hs(e, s);
  }
  return t;
}, _p = (e, n) => new Promise((a, t) => {
  const i = n || "utf8";
  let s = "utf8";
  i === "buffer" && (s = null), qs.readFile(e, { encoding: s }).then((o) => {
    try {
      a(i === "json" ? JSON.parse(o) : i === "jsonWithDates" ? JSON.parse(o, Ms) : o);
    } catch (r) {
      t(Hs(e, r));
    }
  }).catch((o) => {
    o.code === "ENOENT" ? a(void 0) : t(o);
  });
});
da.validateInput = Ep;
da.sync = kp;
da.async = _p;
var ma = {};
const Xe = F, Vs = sn, Fa = M, Sp = (e, n, a, t) => {
  const i = `${e}(path, newName, [options])`;
  if (Fa.argument(i, "path", n, ["string"]), Fa.argument(i, "newName", a, ["string"]), Fa.options(i, "options", t, {
    overwrite: ["boolean"]
  }), Xe.basename(a) !== a)
    throw new Error(
      `Argument "newName" passed to ${i} should be a filename, not a path. Received "${a}"`
    );
}, Ap = (e, n, a) => {
  const t = Xe.join(Xe.dirname(e), n);
  Vs.sync(e, t, a);
}, Tp = (e, n, a) => {
  const t = Xe.join(Xe.dirname(e), n);
  return Vs.async(e, t, a);
};
ma.validateInput = Sp;
ma.sync = Ap;
ma.async = Tp;
var fa = {};
const Ws = F, Kn = X, ii = M, Ks = te, Rp = (e, n, a) => {
  const t = `${e}(symlinkValue, path)`;
  ii.argument(t, "symlinkValue", n, ["string"]), ii.argument(t, "path", a, ["string"]);
}, jp = (e, n) => {
  try {
    Kn.symlinkSync(e, n);
  } catch (a) {
    if (a.code === "ENOENT")
      Ks.createSync(Ws.dirname(n)), Kn.symlinkSync(e, n);
    else
      throw a;
  }
}, Cp = (e, n) => new Promise((a, t) => {
  Kn.symlink(e, n).then(a).catch((i) => {
    i.code === "ENOENT" ? Ks.createAsync(Ws.dirname(n)).then(() => Kn.symlink(e, n)).then(a, t) : t(i);
  });
});
fa.validateInput = Rp;
fa.sync = jp;
fa.async = Cp;
var jt = {};
const Js = Ce;
jt.createWriteStream = Js.createWriteStream;
jt.createReadStream = Js.createReadStream;
var ha = {};
const Ct = F, Op = xt, Gs = Oe, Ys = te, Xs = X, $p = M, Pp = (e, n) => {
  const a = `${e}([options])`;
  $p.options(a, "options", n, {
    prefix: ["string"],
    basePath: ["string"]
  });
}, Zs = (e, n) => {
  e = e || {};
  const a = {};
  return typeof e.prefix != "string" ? a.prefix = "" : a.prefix = e.prefix, typeof e.basePath == "string" ? a.basePath = Ct.resolve(n, e.basePath) : a.basePath = Op.tmpdir(), a;
}, Qs = 32, Fp = (e, n) => {
  const a = Zs(n, e), t = Gs.randomBytes(Qs / 2).toString("hex"), i = Ct.join(
    a.basePath,
    a.prefix + t
  );
  try {
    Xs.mkdirSync(i);
  } catch (s) {
    if (s.code === "ENOENT")
      Ys.sync(i);
    else
      throw s;
  }
  return i;
}, Lp = (e, n) => new Promise((a, t) => {
  const i = Zs(n, e);
  Gs.randomBytes(Qs / 2, (s, o) => {
    if (s)
      t(s);
    else {
      const r = o.toString("hex"), c = Ct.join(
        i.basePath,
        i.prefix + r
      );
      Xs.mkdir(c, (p) => {
        p ? p.code === "ENOENT" ? Ys.async(c).then(() => {
          a(c);
        }, t) : t(p) : a(c);
      });
    }
  });
});
ha.validateInput = Pp;
ha.sync = Fp;
ha.async = Lp;
const si = be, La = F, mn = ea, fn = te, hn = ta, xn = oa, vn = pe, bn = pa, gn = tn, yn = ze, wn = ra, En = sn, kn = da, _n = Ue, Sn = ma, An = fa, oi = jt, Tn = ha, Rn = $e, eo = (e) => {
  const n = () => e || process.cwd(), a = function() {
    if (arguments.length === 0)
      return n();
    const r = Array.prototype.slice.call(arguments), c = [n()].concat(r);
    return eo(La.resolve.apply(null, c));
  }, t = (r) => La.resolve(n(), r), i = function() {
    return Array.prototype.unshift.call(arguments, n()), La.resolve.apply(null, arguments);
  }, s = (r) => {
    const c = r || {};
    return c.cwd = n(), c;
  }, o = {
    cwd: a,
    path: i,
    append: (r, c, p) => {
      mn.validateInput("append", r, c, p), mn.sync(t(r), c, p);
    },
    appendAsync: (r, c, p) => (mn.validateInput("appendAsync", r, c, p), mn.async(t(r), c, p)),
    copy: (r, c, p) => {
      gn.validateInput("copy", r, c, p), gn.sync(t(r), t(c), p);
    },
    copyAsync: (r, c, p) => (gn.validateInput("copyAsync", r, c, p), gn.async(t(r), t(c), p)),
    createWriteStream: (r, c) => oi.createWriteStream(t(r), c),
    createReadStream: (r, c) => oi.createReadStream(t(r), c),
    dir: (r, c) => {
      fn.validateInput("dir", r, c);
      const p = t(r);
      return fn.sync(p, c), a(p);
    },
    dirAsync: (r, c) => (fn.validateInput("dirAsync", r, c), new Promise((p, l) => {
      const u = t(r);
      fn.async(u, c).then(() => {
        p(a(u));
      }, l);
    })),
    exists: (r) => (yn.validateInput("exists", r), yn.sync(t(r))),
    existsAsync: (r) => (yn.validateInput("existsAsync", r), yn.async(t(r))),
    file: (r, c) => (hn.validateInput("file", r, c), hn.sync(t(r), c), o),
    fileAsync: (r, c) => (hn.validateInput("fileAsync", r, c), new Promise((p, l) => {
      hn.async(t(r), c).then(() => {
        p(o);
      }, l);
    })),
    find: (r, c) => (typeof c > "u" && typeof r == "object" && (c = r, r = "."), xn.validateInput("find", r, c), xn.sync(t(r), s(c))),
    findAsync: (r, c) => (typeof c > "u" && typeof r == "object" && (c = r, r = "."), xn.validateInput("findAsync", r, c), xn.async(t(r), s(c))),
    inspect: (r, c) => (vn.validateInput("inspect", r, c), vn.sync(t(r), c)),
    inspectAsync: (r, c) => (vn.validateInput("inspectAsync", r, c), vn.async(t(r), c)),
    inspectTree: (r, c) => (bn.validateInput("inspectTree", r, c), bn.sync(t(r), c)),
    inspectTreeAsync: (r, c) => (bn.validateInput("inspectTreeAsync", r, c), bn.async(t(r), c)),
    list: (r) => (wn.validateInput("list", r), wn.sync(t(r || "."))),
    listAsync: (r) => (wn.validateInput("listAsync", r), wn.async(t(r || "."))),
    move: (r, c, p) => {
      En.validateInput("move", r, c, p), En.sync(t(r), t(c), p);
    },
    moveAsync: (r, c, p) => (En.validateInput("moveAsync", r, c, p), En.async(t(r), t(c), p)),
    read: (r, c) => (kn.validateInput("read", r, c), kn.sync(t(r), c)),
    readAsync: (r, c) => (kn.validateInput("readAsync", r, c), kn.async(t(r), c)),
    remove: (r) => {
      _n.validateInput("remove", r), _n.sync(t(r || "."));
    },
    removeAsync: (r) => (_n.validateInput("removeAsync", r), _n.async(t(r || "."))),
    rename: (r, c, p) => {
      Sn.validateInput("rename", r, c, p), Sn.sync(t(r), c, p);
    },
    renameAsync: (r, c, p) => (Sn.validateInput("renameAsync", r, c, p), Sn.async(t(r), c, p)),
    symlink: (r, c) => {
      An.validateInput("symlink", r, c), An.sync(r, t(c));
    },
    symlinkAsync: (r, c) => (An.validateInput("symlinkAsync", r, c), An.async(r, t(c))),
    tmpDir: (r) => {
      Tn.validateInput("tmpDir", r);
      const c = Tn.sync(n(), r);
      return a(c);
    },
    tmpDirAsync: (r) => (Tn.validateInput("tmpDirAsync", r), new Promise((c, p) => {
      Tn.async(n(), r).then((l) => {
        c(a(l));
      }, p);
    })),
    write: (r, c, p) => {
      Rn.validateInput("write", r, c, p), Rn.sync(t(r), c, p);
    },
    writeAsync: (r, c, p) => (Rn.validateInput("writeAsync", r, c, p), Rn.async(t(r), c, p))
  };
  return si.inspect.custom !== void 0 && (o[si.inspect.custom] = () => `[fs-jetpack CWD: ${n()}]`), o;
};
var Np = eo;
const Dp = Np;
var j = Dp();
const Pe = Ae.getPath("sessionData"), Ip = F.join(Pe, "Playlists"), I = F.join(Ip, "meta.json"), xa = (e) => F.join(Pe, `Playlists/${e}`), no = () => F.join(Pe, "Playlists/Snapshots"), Te = (e, n) => F.join(Pe, `Playlists/${e}/user/${n}.json`), ao = (e) => F.join(Pe, `Playlists/${e}/vod.json`), to = (e) => F.join(Pe, `Playlists/${e}/series.json`), io = (e) => F.join(Pe, `Playlists/${e}/live.json`);
async function ee() {
  const e = await j.readAsync(I, "json");
  if (!e) {
    const n = { currentPlaylist: { name: "", profile: "" }, playlists: [], vlcPath: "" };
    return process.platform === "linux" && (n.vlcPath = "vlc"), await j.writeAsync(I, n), n;
  }
  return e;
}
function so(e, n) {
  return function() {
    return e.apply(n, arguments);
  };
}
const { toString: Up } = Object.prototype, { getPrototypeOf: Ot } = Object, { iterator: va, toStringTag: oo } = Symbol, ba = /* @__PURE__ */ ((e) => (n) => {
  const a = Up.call(n);
  return e[a] || (e[a] = a.slice(8, -1).toLowerCase());
})(/* @__PURE__ */ Object.create(null)), ie = (e) => (e = e.toLowerCase(), (n) => ba(n) === e), ga = (e) => (n) => typeof n === e, { isArray: Be } = Array, Ze = ga("undefined");
function zp(e) {
  return e !== null && !Ze(e) && e.constructor !== null && !Ze(e.constructor) && W(e.constructor.isBuffer) && e.constructor.isBuffer(e);
}
const ro = ie("ArrayBuffer");
function Bp(e) {
  let n;
  return typeof ArrayBuffer < "u" && ArrayBuffer.isView ? n = ArrayBuffer.isView(e) : n = e && e.buffer && ro(e.buffer), n;
}
const qp = ga("string"), W = ga("function"), co = ga("number"), ya = (e) => e !== null && typeof e == "object", Mp = (e) => e === !0 || e === !1, Ln = (e) => {
  if (ba(e) !== "object")
    return !1;
  const n = Ot(e);
  return (n === null || n === Object.prototype || Object.getPrototypeOf(n) === null) && !(oo in e) && !(va in e);
}, Hp = ie("Date"), Vp = ie("File"), Wp = ie("Blob"), Kp = ie("FileList"), Jp = (e) => ya(e) && W(e.pipe), Gp = (e) => {
  let n;
  return e && (typeof FormData == "function" && e instanceof FormData || W(e.append) && ((n = ba(e)) === "formdata" || // detect form-data instance
  n === "object" && W(e.toString) && e.toString() === "[object FormData]"));
}, Yp = ie("URLSearchParams"), [Xp, Zp, Qp, el] = ["ReadableStream", "Request", "Response", "Headers"].map(ie), nl = (e) => e.trim ? e.trim() : e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
function on(e, n, { allOwnKeys: a = !1 } = {}) {
  if (e === null || typeof e > "u")
    return;
  let t, i;
  if (typeof e != "object" && (e = [e]), Be(e))
    for (t = 0, i = e.length; t < i; t++)
      n.call(null, e[t], t, e);
  else {
    const s = a ? Object.getOwnPropertyNames(e) : Object.keys(e), o = s.length;
    let r;
    for (t = 0; t < o; t++)
      r = s[t], n.call(null, e[r], r, e);
  }
}
function po(e, n) {
  n = n.toLowerCase();
  const a = Object.keys(e);
  let t = a.length, i;
  for (; t-- > 0; )
    if (i = a[t], n === i.toLowerCase())
      return i;
  return null;
}
const Ee = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : global, lo = (e) => !Ze(e) && e !== Ee;
function at() {
  const { caseless: e } = lo(this) && this || {}, n = {}, a = (t, i) => {
    const s = e && po(n, i) || i;
    Ln(n[s]) && Ln(t) ? n[s] = at(n[s], t) : Ln(t) ? n[s] = at({}, t) : Be(t) ? n[s] = t.slice() : n[s] = t;
  };
  for (let t = 0, i = arguments.length; t < i; t++)
    arguments[t] && on(arguments[t], a);
  return n;
}
const al = (e, n, a, { allOwnKeys: t } = {}) => (on(n, (i, s) => {
  a && W(i) ? e[s] = so(i, a) : e[s] = i;
}, { allOwnKeys: t }), e), tl = (e) => (e.charCodeAt(0) === 65279 && (e = e.slice(1)), e), il = (e, n, a, t) => {
  e.prototype = Object.create(n.prototype, t), e.prototype.constructor = e, Object.defineProperty(e, "super", {
    value: n.prototype
  }), a && Object.assign(e.prototype, a);
}, sl = (e, n, a, t) => {
  let i, s, o;
  const r = {};
  if (n = n || {}, e == null) return n;
  do {
    for (i = Object.getOwnPropertyNames(e), s = i.length; s-- > 0; )
      o = i[s], (!t || t(o, e, n)) && !r[o] && (n[o] = e[o], r[o] = !0);
    e = a !== !1 && Ot(e);
  } while (e && (!a || a(e, n)) && e !== Object.prototype);
  return n;
}, ol = (e, n, a) => {
  e = String(e), (a === void 0 || a > e.length) && (a = e.length), a -= n.length;
  const t = e.indexOf(n, a);
  return t !== -1 && t === a;
}, rl = (e) => {
  if (!e) return null;
  if (Be(e)) return e;
  let n = e.length;
  if (!co(n)) return null;
  const a = new Array(n);
  for (; n-- > 0; )
    a[n] = e[n];
  return a;
}, cl = /* @__PURE__ */ ((e) => (n) => e && n instanceof e)(typeof Uint8Array < "u" && Ot(Uint8Array)), pl = (e, n) => {
  const t = (e && e[va]).call(e);
  let i;
  for (; (i = t.next()) && !i.done; ) {
    const s = i.value;
    n.call(e, s[0], s[1]);
  }
}, ll = (e, n) => {
  let a;
  const t = [];
  for (; (a = e.exec(n)) !== null; )
    t.push(a);
  return t;
}, ul = ie("HTMLFormElement"), dl = (e) => e.toLowerCase().replace(
  /[-_\s]([a-z\d])(\w*)/g,
  function(a, t, i) {
    return t.toUpperCase() + i;
  }
), ri = (({ hasOwnProperty: e }) => (n, a) => e.call(n, a))(Object.prototype), ml = ie("RegExp"), uo = (e, n) => {
  const a = Object.getOwnPropertyDescriptors(e), t = {};
  on(a, (i, s) => {
    let o;
    (o = n(i, s, e)) !== !1 && (t[s] = o || i);
  }), Object.defineProperties(e, t);
}, fl = (e) => {
  uo(e, (n, a) => {
    if (W(e) && ["arguments", "caller", "callee"].indexOf(a) !== -1)
      return !1;
    const t = e[a];
    if (W(t)) {
      if (n.enumerable = !1, "writable" in n) {
        n.writable = !1;
        return;
      }
      n.set || (n.set = () => {
        throw Error("Can not rewrite read-only method '" + a + "'");
      });
    }
  });
}, hl = (e, n) => {
  const a = {}, t = (i) => {
    i.forEach((s) => {
      a[s] = !0;
    });
  };
  return Be(e) ? t(e) : t(String(e).split(n)), a;
}, xl = () => {
}, vl = (e, n) => e != null && Number.isFinite(e = +e) ? e : n;
function bl(e) {
  return !!(e && W(e.append) && e[oo] === "FormData" && e[va]);
}
const gl = (e) => {
  const n = new Array(10), a = (t, i) => {
    if (ya(t)) {
      if (n.indexOf(t) >= 0)
        return;
      if (!("toJSON" in t)) {
        n[i] = t;
        const s = Be(t) ? [] : {};
        return on(t, (o, r) => {
          const c = a(o, i + 1);
          !Ze(c) && (s[r] = c);
        }), n[i] = void 0, s;
      }
    }
    return t;
  };
  return a(e, 0);
}, yl = ie("AsyncFunction"), wl = (e) => e && (ya(e) || W(e)) && W(e.then) && W(e.catch), mo = ((e, n) => e ? setImmediate : n ? ((a, t) => (Ee.addEventListener("message", ({ source: i, data: s }) => {
  i === Ee && s === a && t.length && t.shift()();
}, !1), (i) => {
  t.push(i), Ee.postMessage(a, "*");
}))(`axios@${Math.random()}`, []) : (a) => setTimeout(a))(
  typeof setImmediate == "function",
  W(Ee.postMessage)
), El = typeof queueMicrotask < "u" ? queueMicrotask.bind(Ee) : typeof process < "u" && process.nextTick || mo, kl = (e) => e != null && W(e[va]), f = {
  isArray: Be,
  isArrayBuffer: ro,
  isBuffer: zp,
  isFormData: Gp,
  isArrayBufferView: Bp,
  isString: qp,
  isNumber: co,
  isBoolean: Mp,
  isObject: ya,
  isPlainObject: Ln,
  isReadableStream: Xp,
  isRequest: Zp,
  isResponse: Qp,
  isHeaders: el,
  isUndefined: Ze,
  isDate: Hp,
  isFile: Vp,
  isBlob: Wp,
  isRegExp: ml,
  isFunction: W,
  isStream: Jp,
  isURLSearchParams: Yp,
  isTypedArray: cl,
  isFileList: Kp,
  forEach: on,
  merge: at,
  extend: al,
  trim: nl,
  stripBOM: tl,
  inherits: il,
  toFlatObject: sl,
  kindOf: ba,
  kindOfTest: ie,
  endsWith: ol,
  toArray: rl,
  forEachEntry: pl,
  matchAll: ll,
  isHTMLForm: ul,
  hasOwnProperty: ri,
  hasOwnProp: ri,
  // an alias to avoid ESLint no-prototype-builtins detection
  reduceDescriptors: uo,
  freezeMethods: fl,
  toObjectSet: hl,
  toCamelCase: dl,
  noop: xl,
  toFiniteNumber: vl,
  findKey: po,
  global: Ee,
  isContextDefined: lo,
  isSpecCompliantForm: bl,
  toJSONObject: gl,
  isAsyncFn: yl,
  isThenable: wl,
  setImmediate: mo,
  asap: El,
  isIterable: kl
};
function g(e, n, a, t, i) {
  Error.call(this), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack, this.message = e, this.name = "AxiosError", n && (this.code = n), a && (this.config = a), t && (this.request = t), i && (this.response = i, this.status = i.status ? i.status : null);
}
f.inherits(g, Error, {
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
      config: f.toJSONObject(this.config),
      code: this.code,
      status: this.status
    };
  }
});
const fo = g.prototype, ho = {};
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
].forEach((e) => {
  ho[e] = { value: e };
});
Object.defineProperties(g, ho);
Object.defineProperty(fo, "isAxiosError", { value: !0 });
g.from = (e, n, a, t, i, s) => {
  const o = Object.create(fo);
  return f.toFlatObject(e, o, function(c) {
    return c !== Error.prototype;
  }, (r) => r !== "isAxiosError"), g.call(o, e.message, n, a, t, i), o.cause = e, o.name = e.name, s && Object.assign(o, s), o;
};
var xo = Q.Stream, _l = be, Sl = se;
function se() {
  this.source = null, this.dataSize = 0, this.maxDataSize = 1024 * 1024, this.pauseStream = !0, this._maxDataSizeExceeded = !1, this._released = !1, this._bufferedEvents = [];
}
_l.inherits(se, xo);
se.create = function(e, n) {
  var a = new this();
  n = n || {};
  for (var t in n)
    a[t] = n[t];
  a.source = e;
  var i = e.emit;
  return e.emit = function() {
    return a._handleEmit(arguments), i.apply(e, arguments);
  }, e.on("error", function() {
  }), a.pauseStream && e.pause(), a;
};
Object.defineProperty(se.prototype, "readable", {
  configurable: !0,
  enumerable: !0,
  get: function() {
    return this.source.readable;
  }
});
se.prototype.setEncoding = function() {
  return this.source.setEncoding.apply(this.source, arguments);
};
se.prototype.resume = function() {
  this._released || this.release(), this.source.resume();
};
se.prototype.pause = function() {
  this.source.pause();
};
se.prototype.release = function() {
  this._released = !0, this._bufferedEvents.forEach((function(e) {
    this.emit.apply(this, e);
  }).bind(this)), this._bufferedEvents = [];
};
se.prototype.pipe = function() {
  var e = xo.prototype.pipe.apply(this, arguments);
  return this.resume(), e;
};
se.prototype._handleEmit = function(e) {
  if (this._released) {
    this.emit.apply(this, e);
    return;
  }
  e[0] === "data" && (this.dataSize += e[1].length, this._checkIfMaxDataSizeExceeded()), this._bufferedEvents.push(e);
};
se.prototype._checkIfMaxDataSizeExceeded = function() {
  if (!this._maxDataSizeExceeded && !(this.dataSize <= this.maxDataSize)) {
    this._maxDataSizeExceeded = !0;
    var e = "DelayedStream#maxDataSize of " + this.maxDataSize + " bytes exceeded.";
    this.emit("error", new Error(e));
  }
};
var Al = be, vo = Q.Stream, ci = Sl, Tl = N;
function N() {
  this.writable = !1, this.readable = !0, this.dataSize = 0, this.maxDataSize = 2 * 1024 * 1024, this.pauseStreams = !0, this._released = !1, this._streams = [], this._currentStream = null, this._insideLoop = !1, this._pendingNext = !1;
}
Al.inherits(N, vo);
N.create = function(e) {
  var n = new this();
  e = e || {};
  for (var a in e)
    n[a] = e[a];
  return n;
};
N.isStreamLike = function(e) {
  return typeof e != "function" && typeof e != "string" && typeof e != "boolean" && typeof e != "number" && !Buffer.isBuffer(e);
};
N.prototype.append = function(e) {
  var n = N.isStreamLike(e);
  if (n) {
    if (!(e instanceof ci)) {
      var a = ci.create(e, {
        maxDataSize: 1 / 0,
        pauseStream: this.pauseStreams
      });
      e.on("data", this._checkDataSize.bind(this)), e = a;
    }
    this._handleErrors(e), this.pauseStreams && e.pause();
  }
  return this._streams.push(e), this;
};
N.prototype.pipe = function(e, n) {
  return vo.prototype.pipe.call(this, e, n), this.resume(), e;
};
N.prototype._getNext = function() {
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
N.prototype._realGetNext = function() {
  var e = this._streams.shift();
  if (typeof e > "u") {
    this.end();
    return;
  }
  if (typeof e != "function") {
    this._pipeNext(e);
    return;
  }
  var n = e;
  n((function(a) {
    var t = N.isStreamLike(a);
    t && (a.on("data", this._checkDataSize.bind(this)), this._handleErrors(a)), this._pipeNext(a);
  }).bind(this));
};
N.prototype._pipeNext = function(e) {
  this._currentStream = e;
  var n = N.isStreamLike(e);
  if (n) {
    e.on("end", this._getNext.bind(this)), e.pipe(this, { end: !1 });
    return;
  }
  var a = e;
  this.write(a), this._getNext();
};
N.prototype._handleErrors = function(e) {
  var n = this;
  e.on("error", function(a) {
    n._emitError(a);
  });
};
N.prototype.write = function(e) {
  this.emit("data", e);
};
N.prototype.pause = function() {
  this.pauseStreams && (this.pauseStreams && this._currentStream && typeof this._currentStream.pause == "function" && this._currentStream.pause(), this.emit("pause"));
};
N.prototype.resume = function() {
  this._released || (this._released = !0, this.writable = !0, this._getNext()), this.pauseStreams && this._currentStream && typeof this._currentStream.resume == "function" && this._currentStream.resume(), this.emit("resume");
};
N.prototype.end = function() {
  this._reset(), this.emit("end");
};
N.prototype.destroy = function() {
  this._reset(), this.emit("close");
};
N.prototype._reset = function() {
  this.writable = !1, this._streams = [], this._currentStream = null;
};
N.prototype._checkDataSize = function() {
  if (this._updateDataSize(), !(this.dataSize <= this.maxDataSize)) {
    var e = "DelayedStream#maxDataSize of " + this.maxDataSize + " bytes exceeded.";
    this._emitError(new Error(e));
  }
};
N.prototype._updateDataSize = function() {
  this.dataSize = 0;
  var e = this;
  this._streams.forEach(function(n) {
    n.dataSize && (e.dataSize += n.dataSize);
  }), this._currentStream && this._currentStream.dataSize && (this.dataSize += this._currentStream.dataSize);
};
N.prototype._emitError = function(e) {
  this._reset(), this.emit("error", e);
};
var bo = {};
const Rl = {
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
var jl = Rl;
/*!
 * mime-types
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */
(function(e) {
  var n = jl, a = F.extname, t = /^\s*([^;\s]*)(?:;|\s|$)/, i = /^text\//i;
  e.charset = s, e.charsets = { lookup: s }, e.contentType = o, e.extension = r, e.extensions = /* @__PURE__ */ Object.create(null), e.lookup = c, e.types = /* @__PURE__ */ Object.create(null), p(e.extensions, e.types);
  function s(l) {
    if (!l || typeof l != "string")
      return !1;
    var u = t.exec(l), d = u && n[u[1].toLowerCase()];
    return d && d.charset ? d.charset : u && i.test(u[1]) ? "UTF-8" : !1;
  }
  function o(l) {
    if (!l || typeof l != "string")
      return !1;
    var u = l.indexOf("/") === -1 ? e.lookup(l) : l;
    if (!u)
      return !1;
    if (u.indexOf("charset") === -1) {
      var d = e.charset(u);
      d && (u += "; charset=" + d.toLowerCase());
    }
    return u;
  }
  function r(l) {
    if (!l || typeof l != "string")
      return !1;
    var u = t.exec(l), d = u && e.extensions[u[1].toLowerCase()];
    return !d || !d.length ? !1 : d[0];
  }
  function c(l) {
    if (!l || typeof l != "string")
      return !1;
    var u = a("x." + l).toLowerCase().substr(1);
    return u && e.types[u] || !1;
  }
  function p(l, u) {
    var d = ["nginx", "apache", void 0, "iana"];
    Object.keys(n).forEach(function(m) {
      var v = n[m], x = v.extensions;
      if (!(!x || !x.length)) {
        l[m] = x;
        for (var b = 0; b < x.length; b++) {
          var y = x[b];
          if (u[y]) {
            var w = d.indexOf(n[u[y]].source), S = d.indexOf(v.source);
            if (u[y] !== "application/octet-stream" && (w > S || w === S && u[y].substr(0, 12) === "application/"))
              continue;
          }
          u[y] = m;
        }
      }
    });
  }
})(bo);
var Cl = Ol;
function Ol(e) {
  var n = typeof setImmediate == "function" ? setImmediate : typeof process == "object" && typeof process.nextTick == "function" ? process.nextTick : null;
  n ? n(e) : setTimeout(e, 0);
}
var pi = Cl, go = $l;
function $l(e) {
  var n = !1;
  return pi(function() {
    n = !0;
  }), function(t, i) {
    n ? e(t, i) : pi(function() {
      e(t, i);
    });
  };
}
var yo = Pl;
function Pl(e) {
  Object.keys(e.jobs).forEach(Fl.bind(e)), e.jobs = {};
}
function Fl(e) {
  typeof this.jobs[e] == "function" && this.jobs[e]();
}
var li = go, Ll = yo, wo = Nl;
function Nl(e, n, a, t) {
  var i = a.keyedList ? a.keyedList[a.index] : a.index;
  a.jobs[i] = Dl(n, i, e[i], function(s, o) {
    i in a.jobs && (delete a.jobs[i], s ? Ll(a) : a.results[i] = o, t(s, a.results));
  });
}
function Dl(e, n, a, t) {
  var i;
  return e.length == 2 ? i = e(a, li(t)) : i = e(a, n, li(t)), i;
}
var Eo = Il;
function Il(e, n) {
  var a = !Array.isArray(e), t = {
    index: 0,
    keyedList: a || n ? Object.keys(e) : null,
    jobs: {},
    results: a ? {} : [],
    size: a ? Object.keys(e).length : e.length
  };
  return n && t.keyedList.sort(a ? n : function(i, s) {
    return n(e[i], e[s]);
  }), t;
}
var Ul = yo, zl = go, ko = Bl;
function Bl(e) {
  Object.keys(this.jobs).length && (this.index = this.size, Ul(this), zl(e)(null, this.results));
}
var ql = wo, Ml = Eo, Hl = ko, Vl = Wl;
function Wl(e, n, a) {
  for (var t = Ml(e); t.index < (t.keyedList || e).length; )
    ql(e, n, t, function(i, s) {
      if (i) {
        a(i, s);
        return;
      }
      if (Object.keys(t.jobs).length === 0) {
        a(null, t.results);
        return;
      }
    }), t.index++;
  return Hl.bind(t, a);
}
var wa = { exports: {} }, ui = wo, Kl = Eo, Jl = ko;
wa.exports = Gl;
wa.exports.ascending = _o;
wa.exports.descending = Yl;
function Gl(e, n, a, t) {
  var i = Kl(e, a);
  return ui(e, n, i, function s(o, r) {
    if (o) {
      t(o, r);
      return;
    }
    if (i.index++, i.index < (i.keyedList || e).length) {
      ui(e, n, i, s);
      return;
    }
    t(null, i.results);
  }), Jl.bind(i, t);
}
function _o(e, n) {
  return e < n ? -1 : e > n ? 1 : 0;
}
function Yl(e, n) {
  return -1 * _o(e, n);
}
var So = wa.exports, Xl = So, Zl = Ql;
function Ql(e, n, a) {
  return Xl(e, n, null, a);
}
var eu = {
  parallel: Vl,
  serial: Zl,
  serialOrdered: So
}, nu = function(e, n) {
  return Object.keys(n).forEach(function(a) {
    e[a] = e[a] || n[a];
  }), e;
}, $t = Tl, au = be, Na = F, tu = vt, iu = bt, su = Zn.parse, ou = Ce, ru = Q.Stream, Da = bo, cu = eu, tt = nu, pu = C;
au.inherits(C, $t);
function C(e) {
  if (!(this instanceof C))
    return new C(e);
  this._overheadLength = 0, this._valueLength = 0, this._valuesToMeasure = [], $t.call(this), e = e || {};
  for (var n in e)
    this[n] = e[n];
}
C.LINE_BREAK = `\r
`;
C.DEFAULT_CONTENT_TYPE = "application/octet-stream";
C.prototype.append = function(e, n, a) {
  a = a || {}, typeof a == "string" && (a = { filename: a });
  var t = $t.prototype.append.bind(this);
  if (typeof n == "number" && (n = "" + n), Array.isArray(n)) {
    this._error(new Error("Arrays are not supported."));
    return;
  }
  var i = this._multiPartHeader(e, n, a), s = this._multiPartFooter();
  t(i), t(n), t(s), this._trackLength(i, n, a);
};
C.prototype._trackLength = function(e, n, a) {
  var t = 0;
  a.knownLength != null ? t += +a.knownLength : Buffer.isBuffer(n) ? t = n.length : typeof n == "string" && (t = Buffer.byteLength(n)), this._valueLength += t, this._overheadLength += Buffer.byteLength(e) + C.LINE_BREAK.length, !(!n || !n.path && !(n.readable && n.hasOwnProperty("httpVersion")) && !(n instanceof ru)) && (a.knownLength || this._valuesToMeasure.push(n));
};
C.prototype._lengthRetriever = function(e, n) {
  e.hasOwnProperty("fd") ? e.end != null && e.end != 1 / 0 && e.start != null ? n(null, e.end + 1 - (e.start ? e.start : 0)) : ou.stat(e.path, function(a, t) {
    var i;
    if (a) {
      n(a);
      return;
    }
    i = t.size - (e.start ? e.start : 0), n(null, i);
  }) : e.hasOwnProperty("httpVersion") ? n(null, +e.headers["content-length"]) : e.hasOwnProperty("httpModule") ? (e.on("response", function(a) {
    e.pause(), n(null, +a.headers["content-length"]);
  }), e.resume()) : n("Unknown stream");
};
C.prototype._multiPartHeader = function(e, n, a) {
  if (typeof a.header == "string")
    return a.header;
  var t = this._getContentDisposition(n, a), i = this._getContentType(n, a), s = "", o = {
    // add custom disposition as third element or keep it two elements if not
    "Content-Disposition": ["form-data", 'name="' + e + '"'].concat(t || []),
    // if no content type. allow it to be empty array
    "Content-Type": [].concat(i || [])
  };
  typeof a.header == "object" && tt(o, a.header);
  var r;
  for (var c in o)
    o.hasOwnProperty(c) && (r = o[c], r != null && (Array.isArray(r) || (r = [r]), r.length && (s += c + ": " + r.join("; ") + C.LINE_BREAK)));
  return "--" + this.getBoundary() + C.LINE_BREAK + s + C.LINE_BREAK;
};
C.prototype._getContentDisposition = function(e, n) {
  var a, t;
  return typeof n.filepath == "string" ? a = Na.normalize(n.filepath).replace(/\\/g, "/") : n.filename || e.name || e.path ? a = Na.basename(n.filename || e.name || e.path) : e.readable && e.hasOwnProperty("httpVersion") && (a = Na.basename(e.client._httpMessage.path || "")), a && (t = 'filename="' + a + '"'), t;
};
C.prototype._getContentType = function(e, n) {
  var a = n.contentType;
  return !a && e.name && (a = Da.lookup(e.name)), !a && e.path && (a = Da.lookup(e.path)), !a && e.readable && e.hasOwnProperty("httpVersion") && (a = e.headers["content-type"]), !a && (n.filepath || n.filename) && (a = Da.lookup(n.filepath || n.filename)), !a && typeof e == "object" && (a = C.DEFAULT_CONTENT_TYPE), a;
};
C.prototype._multiPartFooter = function() {
  return (function(e) {
    var n = C.LINE_BREAK, a = this._streams.length === 0;
    a && (n += this._lastBoundary()), e(n);
  }).bind(this);
};
C.prototype._lastBoundary = function() {
  return "--" + this.getBoundary() + "--" + C.LINE_BREAK;
};
C.prototype.getHeaders = function(e) {
  var n, a = {
    "content-type": "multipart/form-data; boundary=" + this.getBoundary()
  };
  for (n in e)
    e.hasOwnProperty(n) && (a[n.toLowerCase()] = e[n]);
  return a;
};
C.prototype.setBoundary = function(e) {
  this._boundary = e;
};
C.prototype.getBoundary = function() {
  return this._boundary || this._generateBoundary(), this._boundary;
};
C.prototype.getBuffer = function() {
  for (var e = new Buffer.alloc(0), n = this.getBoundary(), a = 0, t = this._streams.length; a < t; a++)
    typeof this._streams[a] != "function" && (Buffer.isBuffer(this._streams[a]) ? e = Buffer.concat([e, this._streams[a]]) : e = Buffer.concat([e, Buffer.from(this._streams[a])]), (typeof this._streams[a] != "string" || this._streams[a].substring(2, n.length + 2) !== n) && (e = Buffer.concat([e, Buffer.from(C.LINE_BREAK)])));
  return Buffer.concat([e, Buffer.from(this._lastBoundary())]);
};
C.prototype._generateBoundary = function() {
  for (var e = "--------------------------", n = 0; n < 24; n++)
    e += Math.floor(Math.random() * 10).toString(16);
  this._boundary = e;
};
C.prototype.getLengthSync = function() {
  var e = this._overheadLength + this._valueLength;
  return this._streams.length && (e += this._lastBoundary().length), this.hasKnownLength() || this._error(new Error("Cannot calculate proper length in synchronous way.")), e;
};
C.prototype.hasKnownLength = function() {
  var e = !0;
  return this._valuesToMeasure.length && (e = !1), e;
};
C.prototype.getLength = function(e) {
  var n = this._overheadLength + this._valueLength;
  if (this._streams.length && (n += this._lastBoundary().length), !this._valuesToMeasure.length) {
    process.nextTick(e.bind(this, null, n));
    return;
  }
  cu.parallel(this._valuesToMeasure, this._lengthRetriever, function(a, t) {
    if (a) {
      e(a);
      return;
    }
    t.forEach(function(i) {
      n += i;
    }), e(null, n);
  });
};
C.prototype.submit = function(e, n) {
  var a, t, i = { method: "post" };
  return typeof e == "string" ? (e = su(e), t = tt({
    port: e.port,
    path: e.pathname,
    host: e.hostname,
    protocol: e.protocol
  }, i)) : (t = tt(e, i), t.port || (t.port = t.protocol == "https:" ? 443 : 80)), t.headers = this.getHeaders(e.headers), t.protocol == "https:" ? a = iu.request(t) : a = tu.request(t), this.getLength((function(s, o) {
    if (s && s !== "Unknown stream") {
      this._error(s);
      return;
    }
    if (o && a.setHeader("Content-Length", o), this.pipe(a), n) {
      var r, c = function(p, l) {
        return a.removeListener("error", c), a.removeListener("response", r), n.call(this, p, l);
      };
      r = c.bind(this, null), a.on("error", c), a.on("response", r);
    }
  }).bind(this)), a;
};
C.prototype._error = function(e) {
  this.error || (this.error = e, this.pause(), this.emit("error", e));
};
C.prototype.toString = function() {
  return "[object FormData]";
};
const Ao = /* @__PURE__ */ Qn(pu);
function it(e) {
  return f.isPlainObject(e) || f.isArray(e);
}
function To(e) {
  return f.endsWith(e, "[]") ? e.slice(0, -2) : e;
}
function di(e, n, a) {
  return e ? e.concat(n).map(function(i, s) {
    return i = To(i), !a && s ? "[" + i + "]" : i;
  }).join(a ? "." : "") : n;
}
function lu(e) {
  return f.isArray(e) && !e.some(it);
}
const uu = f.toFlatObject(f, {}, null, function(n) {
  return /^is[A-Z]/.test(n);
});
function Ea(e, n, a) {
  if (!f.isObject(e))
    throw new TypeError("target must be an object");
  n = n || new (Ao || FormData)(), a = f.toFlatObject(a, {
    metaTokens: !0,
    dots: !1,
    indexes: !1
  }, !1, function(v, x) {
    return !f.isUndefined(x[v]);
  });
  const t = a.metaTokens, i = a.visitor || l, s = a.dots, o = a.indexes, c = (a.Blob || typeof Blob < "u" && Blob) && f.isSpecCompliantForm(n);
  if (!f.isFunction(i))
    throw new TypeError("visitor must be a function");
  function p(m) {
    if (m === null) return "";
    if (f.isDate(m))
      return m.toISOString();
    if (!c && f.isBlob(m))
      throw new g("Blob is not supported. Use a Buffer instead.");
    return f.isArrayBuffer(m) || f.isTypedArray(m) ? c && typeof Blob == "function" ? new Blob([m]) : Buffer.from(m) : m;
  }
  function l(m, v, x) {
    let b = m;
    if (m && !x && typeof m == "object") {
      if (f.endsWith(v, "{}"))
        v = t ? v : v.slice(0, -2), m = JSON.stringify(m);
      else if (f.isArray(m) && lu(m) || (f.isFileList(m) || f.endsWith(v, "[]")) && (b = f.toArray(m)))
        return v = To(v), b.forEach(function(w, S) {
          !(f.isUndefined(w) || w === null) && n.append(
            // eslint-disable-next-line no-nested-ternary
            o === !0 ? di([v], S, s) : o === null ? v : v + "[]",
            p(w)
          );
        }), !1;
    }
    return it(m) ? !0 : (n.append(di(x, v, s), p(m)), !1);
  }
  const u = [], d = Object.assign(uu, {
    defaultVisitor: l,
    convertValue: p,
    isVisitable: it
  });
  function h(m, v) {
    if (!f.isUndefined(m)) {
      if (u.indexOf(m) !== -1)
        throw Error("Circular reference detected in " + v.join("."));
      u.push(m), f.forEach(m, function(b, y) {
        (!(f.isUndefined(b) || b === null) && i.call(
          n,
          b,
          f.isString(y) ? y.trim() : y,
          v,
          d
        )) === !0 && h(b, v ? v.concat(y) : [y]);
      }), u.pop();
    }
  }
  if (!f.isObject(e))
    throw new TypeError("data must be an object");
  return h(e), n;
}
function mi(e) {
  const n = {
    "!": "%21",
    "'": "%27",
    "(": "%28",
    ")": "%29",
    "~": "%7E",
    "%20": "+",
    "%00": "\0"
  };
  return encodeURIComponent(e).replace(/[!'()~]|%20|%00/g, function(t) {
    return n[t];
  });
}
function Ro(e, n) {
  this._pairs = [], e && Ea(e, this, n);
}
const jo = Ro.prototype;
jo.append = function(n, a) {
  this._pairs.push([n, a]);
};
jo.toString = function(n) {
  const a = n ? function(t) {
    return n.call(this, t, mi);
  } : mi;
  return this._pairs.map(function(i) {
    return a(i[0]) + "=" + a(i[1]);
  }, "").join("&");
};
function du(e) {
  return encodeURIComponent(e).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
}
function Pt(e, n, a) {
  if (!n)
    return e;
  const t = a && a.encode || du;
  f.isFunction(a) && (a = {
    serialize: a
  });
  const i = a && a.serialize;
  let s;
  if (i ? s = i(n, a) : s = f.isURLSearchParams(n) ? n.toString() : new Ro(n, a).toString(t), s) {
    const o = e.indexOf("#");
    o !== -1 && (e = e.slice(0, o)), e += (e.indexOf("?") === -1 ? "?" : "&") + s;
  }
  return e;
}
class fi {
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
  use(n, a, t) {
    return this.handlers.push({
      fulfilled: n,
      rejected: a,
      synchronous: t ? t.synchronous : !1,
      runWhen: t ? t.runWhen : null
    }), this.handlers.length - 1;
  }
  /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   *
   * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
   */
  eject(n) {
    this.handlers[n] && (this.handlers[n] = null);
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
  forEach(n) {
    f.forEach(this.handlers, function(t) {
      t !== null && n(t);
    });
  }
}
const Ft = {
  silentJSONParsing: !0,
  forcedJSONParsing: !0,
  clarifyTimeoutError: !1
}, mu = Zn.URLSearchParams, Ia = "abcdefghijklmnopqrstuvwxyz", hi = "0123456789", Co = {
  DIGIT: hi,
  ALPHA: Ia,
  ALPHA_DIGIT: Ia + Ia.toUpperCase() + hi
}, fu = (e = 16, n = Co.ALPHA_DIGIT) => {
  let a = "";
  const { length: t } = n, i = new Uint32Array(e);
  Oe.randomFillSync(i);
  for (let s = 0; s < e; s++)
    a += n[i[s] % t];
  return a;
}, hu = {
  isNode: !0,
  classes: {
    URLSearchParams: mu,
    FormData: Ao,
    Blob: typeof Blob < "u" && Blob || null
  },
  ALPHABET: Co,
  generateString: fu,
  protocols: ["http", "https", "file", "data"]
}, Lt = typeof window < "u" && typeof document < "u", st = typeof navigator == "object" && navigator || void 0, xu = Lt && (!st || ["ReactNative", "NativeScript", "NS"].indexOf(st.product) < 0), vu = typeof WorkerGlobalScope < "u" && // eslint-disable-next-line no-undef
self instanceof WorkerGlobalScope && typeof self.importScripts == "function", bu = Lt && window.location.href || "http://localhost", gu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  hasBrowserEnv: Lt,
  hasStandardBrowserEnv: xu,
  hasStandardBrowserWebWorkerEnv: vu,
  navigator: st,
  origin: bu
}, Symbol.toStringTag, { value: "Module" })), L = {
  ...gu,
  ...hu
};
function yu(e, n) {
  return Ea(e, new L.classes.URLSearchParams(), Object.assign({
    visitor: function(a, t, i, s) {
      return L.isNode && f.isBuffer(a) ? (this.append(t, a.toString("base64")), !1) : s.defaultVisitor.apply(this, arguments);
    }
  }, n));
}
function wu(e) {
  return f.matchAll(/\w+|\[(\w*)]/g, e).map((n) => n[0] === "[]" ? "" : n[1] || n[0]);
}
function Eu(e) {
  const n = {}, a = Object.keys(e);
  let t;
  const i = a.length;
  let s;
  for (t = 0; t < i; t++)
    s = a[t], n[s] = e[s];
  return n;
}
function Oo(e) {
  function n(a, t, i, s) {
    let o = a[s++];
    if (o === "__proto__") return !0;
    const r = Number.isFinite(+o), c = s >= a.length;
    return o = !o && f.isArray(i) ? i.length : o, c ? (f.hasOwnProp(i, o) ? i[o] = [i[o], t] : i[o] = t, !r) : ((!i[o] || !f.isObject(i[o])) && (i[o] = []), n(a, t, i[o], s) && f.isArray(i[o]) && (i[o] = Eu(i[o])), !r);
  }
  if (f.isFormData(e) && f.isFunction(e.entries)) {
    const a = {};
    return f.forEachEntry(e, (t, i) => {
      n(wu(t), i, a, 0);
    }), a;
  }
  return null;
}
function ku(e, n, a) {
  if (f.isString(e))
    try {
      return (n || JSON.parse)(e), f.trim(e);
    } catch (t) {
      if (t.name !== "SyntaxError")
        throw t;
    }
  return (a || JSON.stringify)(e);
}
const rn = {
  transitional: Ft,
  adapter: ["xhr", "http", "fetch"],
  transformRequest: [function(n, a) {
    const t = a.getContentType() || "", i = t.indexOf("application/json") > -1, s = f.isObject(n);
    if (s && f.isHTMLForm(n) && (n = new FormData(n)), f.isFormData(n))
      return i ? JSON.stringify(Oo(n)) : n;
    if (f.isArrayBuffer(n) || f.isBuffer(n) || f.isStream(n) || f.isFile(n) || f.isBlob(n) || f.isReadableStream(n))
      return n;
    if (f.isArrayBufferView(n))
      return n.buffer;
    if (f.isURLSearchParams(n))
      return a.setContentType("application/x-www-form-urlencoded;charset=utf-8", !1), n.toString();
    let r;
    if (s) {
      if (t.indexOf("application/x-www-form-urlencoded") > -1)
        return yu(n, this.formSerializer).toString();
      if ((r = f.isFileList(n)) || t.indexOf("multipart/form-data") > -1) {
        const c = this.env && this.env.FormData;
        return Ea(
          r ? { "files[]": n } : n,
          c && new c(),
          this.formSerializer
        );
      }
    }
    return s || i ? (a.setContentType("application/json", !1), ku(n)) : n;
  }],
  transformResponse: [function(n) {
    const a = this.transitional || rn.transitional, t = a && a.forcedJSONParsing, i = this.responseType === "json";
    if (f.isResponse(n) || f.isReadableStream(n))
      return n;
    if (n && f.isString(n) && (t && !this.responseType || i)) {
      const o = !(a && a.silentJSONParsing) && i;
      try {
        return JSON.parse(n);
      } catch (r) {
        if (o)
          throw r.name === "SyntaxError" ? g.from(r, g.ERR_BAD_RESPONSE, this, null, this.response) : r;
      }
    }
    return n;
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
    FormData: L.classes.FormData,
    Blob: L.classes.Blob
  },
  validateStatus: function(n) {
    return n >= 200 && n < 300;
  },
  headers: {
    common: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": void 0
    }
  }
};
f.forEach(["delete", "get", "head", "post", "put", "patch"], (e) => {
  rn.headers[e] = {};
});
const _u = f.toObjectSet([
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
]), Su = (e) => {
  const n = {};
  let a, t, i;
  return e && e.split(`
`).forEach(function(o) {
    i = o.indexOf(":"), a = o.substring(0, i).trim().toLowerCase(), t = o.substring(i + 1).trim(), !(!a || n[a] && _u[a]) && (a === "set-cookie" ? n[a] ? n[a].push(t) : n[a] = [t] : n[a] = n[a] ? n[a] + ", " + t : t);
  }), n;
}, xi = Symbol("internals");
function Me(e) {
  return e && String(e).trim().toLowerCase();
}
function Nn(e) {
  return e === !1 || e == null ? e : f.isArray(e) ? e.map(Nn) : String(e);
}
function Au(e) {
  const n = /* @__PURE__ */ Object.create(null), a = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let t;
  for (; t = a.exec(e); )
    n[t[1]] = t[2];
  return n;
}
const Tu = (e) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(e.trim());
function Ua(e, n, a, t, i) {
  if (f.isFunction(t))
    return t.call(this, n, a);
  if (i && (n = a), !!f.isString(n)) {
    if (f.isString(t))
      return n.indexOf(t) !== -1;
    if (f.isRegExp(t))
      return t.test(n);
  }
}
function Ru(e) {
  return e.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (n, a, t) => a.toUpperCase() + t);
}
function ju(e, n) {
  const a = f.toCamelCase(" " + n);
  ["get", "set", "has"].forEach((t) => {
    Object.defineProperty(e, t + a, {
      value: function(i, s, o) {
        return this[t].call(this, n, i, s, o);
      },
      configurable: !0
    });
  });
}
let z = class {
  constructor(n) {
    n && this.set(n);
  }
  set(n, a, t) {
    const i = this;
    function s(r, c, p) {
      const l = Me(c);
      if (!l)
        throw new Error("header name must be a non-empty string");
      const u = f.findKey(i, l);
      (!u || i[u] === void 0 || p === !0 || p === void 0 && i[u] !== !1) && (i[u || c] = Nn(r));
    }
    const o = (r, c) => f.forEach(r, (p, l) => s(p, l, c));
    if (f.isPlainObject(n) || n instanceof this.constructor)
      o(n, a);
    else if (f.isString(n) && (n = n.trim()) && !Tu(n))
      o(Su(n), a);
    else if (f.isObject(n) && f.isIterable(n)) {
      let r = {}, c, p;
      for (const l of n) {
        if (!f.isArray(l))
          throw TypeError("Object iterator must return a key-value pair");
        r[p = l[0]] = (c = r[p]) ? f.isArray(c) ? [...c, l[1]] : [c, l[1]] : l[1];
      }
      o(r, a);
    } else
      n != null && s(a, n, t);
    return this;
  }
  get(n, a) {
    if (n = Me(n), n) {
      const t = f.findKey(this, n);
      if (t) {
        const i = this[t];
        if (!a)
          return i;
        if (a === !0)
          return Au(i);
        if (f.isFunction(a))
          return a.call(this, i, t);
        if (f.isRegExp(a))
          return a.exec(i);
        throw new TypeError("parser must be boolean|regexp|function");
      }
    }
  }
  has(n, a) {
    if (n = Me(n), n) {
      const t = f.findKey(this, n);
      return !!(t && this[t] !== void 0 && (!a || Ua(this, this[t], t, a)));
    }
    return !1;
  }
  delete(n, a) {
    const t = this;
    let i = !1;
    function s(o) {
      if (o = Me(o), o) {
        const r = f.findKey(t, o);
        r && (!a || Ua(t, t[r], r, a)) && (delete t[r], i = !0);
      }
    }
    return f.isArray(n) ? n.forEach(s) : s(n), i;
  }
  clear(n) {
    const a = Object.keys(this);
    let t = a.length, i = !1;
    for (; t--; ) {
      const s = a[t];
      (!n || Ua(this, this[s], s, n, !0)) && (delete this[s], i = !0);
    }
    return i;
  }
  normalize(n) {
    const a = this, t = {};
    return f.forEach(this, (i, s) => {
      const o = f.findKey(t, s);
      if (o) {
        a[o] = Nn(i), delete a[s];
        return;
      }
      const r = n ? Ru(s) : String(s).trim();
      r !== s && delete a[s], a[r] = Nn(i), t[r] = !0;
    }), this;
  }
  concat(...n) {
    return this.constructor.concat(this, ...n);
  }
  toJSON(n) {
    const a = /* @__PURE__ */ Object.create(null);
    return f.forEach(this, (t, i) => {
      t != null && t !== !1 && (a[i] = n && f.isArray(t) ? t.join(", ") : t);
    }), a;
  }
  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]();
  }
  toString() {
    return Object.entries(this.toJSON()).map(([n, a]) => n + ": " + a).join(`
`);
  }
  getSetCookie() {
    return this.get("set-cookie") || [];
  }
  get [Symbol.toStringTag]() {
    return "AxiosHeaders";
  }
  static from(n) {
    return n instanceof this ? n : new this(n);
  }
  static concat(n, ...a) {
    const t = new this(n);
    return a.forEach((i) => t.set(i)), t;
  }
  static accessor(n) {
    const t = (this[xi] = this[xi] = {
      accessors: {}
    }).accessors, i = this.prototype;
    function s(o) {
      const r = Me(o);
      t[r] || (ju(i, o), t[r] = !0);
    }
    return f.isArray(n) ? n.forEach(s) : s(n), this;
  }
};
z.accessor(["Content-Type", "Content-Length", "Accept", "Accept-Encoding", "User-Agent", "Authorization"]);
f.reduceDescriptors(z.prototype, ({ value: e }, n) => {
  let a = n[0].toUpperCase() + n.slice(1);
  return {
    get: () => e,
    set(t) {
      this[a] = t;
    }
  };
});
f.freezeMethods(z);
function za(e, n) {
  const a = this || rn, t = n || a, i = z.from(t.headers);
  let s = t.data;
  return f.forEach(e, function(r) {
    s = r.call(a, s, i.normalize(), n ? n.status : void 0);
  }), i.normalize(), s;
}
function $o(e) {
  return !!(e && e.__CANCEL__);
}
function ve(e, n, a) {
  g.call(this, e ?? "canceled", g.ERR_CANCELED, n, a), this.name = "CanceledError";
}
f.inherits(ve, g, {
  __CANCEL__: !0
});
function Fe(e, n, a) {
  const t = a.config.validateStatus;
  !a.status || !t || t(a.status) ? e(a) : n(new g(
    "Request failed with status code " + a.status,
    [g.ERR_BAD_REQUEST, g.ERR_BAD_RESPONSE][Math.floor(a.status / 100) - 4],
    a.config,
    a.request,
    a
  ));
}
function Cu(e) {
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(e);
}
function Ou(e, n) {
  return n ? e.replace(/\/?\/$/, "") + "/" + n.replace(/^\/+/, "") : e;
}
function Nt(e, n, a) {
  let t = !Cu(n);
  return e && (t || a == !1) ? Ou(e, n) : n;
}
var Po = {}, $u = Zn.parse, Pu = {
  ftp: 21,
  gopher: 70,
  http: 80,
  https: 443,
  ws: 80,
  wss: 443
}, Fu = String.prototype.endsWith || function(e) {
  return e.length <= this.length && this.indexOf(e, this.length - e.length) !== -1;
};
function Lu(e) {
  var n = typeof e == "string" ? $u(e) : e || {}, a = n.protocol, t = n.host, i = n.port;
  if (typeof t != "string" || !t || typeof a != "string" || (a = a.split(":", 1)[0], t = t.replace(/:\d*$/, ""), i = parseInt(i) || Pu[a] || 0, !Nu(t, i)))
    return "";
  var s = Le("npm_config_" + a + "_proxy") || Le(a + "_proxy") || Le("npm_config_proxy") || Le("all_proxy");
  return s && s.indexOf("://") === -1 && (s = a + "://" + s), s;
}
function Nu(e, n) {
  var a = (Le("npm_config_no_proxy") || Le("no_proxy")).toLowerCase();
  return a ? a === "*" ? !1 : a.split(/[,\s]/).every(function(t) {
    if (!t)
      return !0;
    var i = t.match(/^(.+):(\d+)$/), s = i ? i[1] : t, o = i ? parseInt(i[2]) : 0;
    return o && o !== n ? !0 : /^[.*]/.test(s) ? (s.charAt(0) === "*" && (s = s.slice(1)), !Fu.call(e, s)) : e !== s;
  }) : !0;
}
function Le(e) {
  return process.env[e.toLowerCase()] || process.env[e.toUpperCase()] || "";
}
Po.getProxyForUrl = Lu;
var Dt = { exports: {} }, jn = { exports: {} }, Cn = { exports: {} }, Ba, vi;
function Du() {
  if (vi) return Ba;
  vi = 1;
  var e = 1e3, n = e * 60, a = n * 60, t = a * 24, i = t * 7, s = t * 365.25;
  Ba = function(l, u) {
    u = u || {};
    var d = typeof l;
    if (d === "string" && l.length > 0)
      return o(l);
    if (d === "number" && isFinite(l))
      return u.long ? c(l) : r(l);
    throw new Error(
      "val is not a non-empty string or a valid number. val=" + JSON.stringify(l)
    );
  };
  function o(l) {
    if (l = String(l), !(l.length > 100)) {
      var u = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        l
      );
      if (u) {
        var d = parseFloat(u[1]), h = (u[2] || "ms").toLowerCase();
        switch (h) {
          case "years":
          case "year":
          case "yrs":
          case "yr":
          case "y":
            return d * s;
          case "weeks":
          case "week":
          case "w":
            return d * i;
          case "days":
          case "day":
          case "d":
            return d * t;
          case "hours":
          case "hour":
          case "hrs":
          case "hr":
          case "h":
            return d * a;
          case "minutes":
          case "minute":
          case "mins":
          case "min":
          case "m":
            return d * n;
          case "seconds":
          case "second":
          case "secs":
          case "sec":
          case "s":
            return d * e;
          case "milliseconds":
          case "millisecond":
          case "msecs":
          case "msec":
          case "ms":
            return d;
          default:
            return;
        }
      }
    }
  }
  function r(l) {
    var u = Math.abs(l);
    return u >= t ? Math.round(l / t) + "d" : u >= a ? Math.round(l / a) + "h" : u >= n ? Math.round(l / n) + "m" : u >= e ? Math.round(l / e) + "s" : l + "ms";
  }
  function c(l) {
    var u = Math.abs(l);
    return u >= t ? p(l, u, t, "day") : u >= a ? p(l, u, a, "hour") : u >= n ? p(l, u, n, "minute") : u >= e ? p(l, u, e, "second") : l + " ms";
  }
  function p(l, u, d, h) {
    var m = u >= d * 1.5;
    return Math.round(l / d) + " " + h + (m ? "s" : "");
  }
  return Ba;
}
var qa, bi;
function Fo() {
  if (bi) return qa;
  bi = 1;
  function e(n) {
    t.debug = t, t.default = t, t.coerce = p, t.disable = o, t.enable = s, t.enabled = r, t.humanize = Du(), t.destroy = l, Object.keys(n).forEach((u) => {
      t[u] = n[u];
    }), t.names = [], t.skips = [], t.formatters = {};
    function a(u) {
      let d = 0;
      for (let h = 0; h < u.length; h++)
        d = (d << 5) - d + u.charCodeAt(h), d |= 0;
      return t.colors[Math.abs(d) % t.colors.length];
    }
    t.selectColor = a;
    function t(u) {
      let d, h = null, m, v;
      function x(...b) {
        if (!x.enabled)
          return;
        const y = x, w = Number(/* @__PURE__ */ new Date()), S = w - (d || w);
        y.diff = S, y.prev = d, y.curr = w, d = w, b[0] = t.coerce(b[0]), typeof b[0] != "string" && b.unshift("%O");
        let k = 0;
        b[0] = b[0].replace(/%([a-zA-Z%])/g, (E, A) => {
          if (E === "%%")
            return "%";
          k++;
          const R = t.formatters[A];
          if (typeof R == "function") {
            const J = b[k];
            E = R.call(y, J), b.splice(k, 1), k--;
          }
          return E;
        }), t.formatArgs.call(y, b), (y.log || t.log).apply(y, b);
      }
      return x.namespace = u, x.useColors = t.useColors(), x.color = t.selectColor(u), x.extend = i, x.destroy = t.destroy, Object.defineProperty(x, "enabled", {
        enumerable: !0,
        configurable: !1,
        get: () => h !== null ? h : (m !== t.namespaces && (m = t.namespaces, v = t.enabled(u)), v),
        set: (b) => {
          h = b;
        }
      }), typeof t.init == "function" && t.init(x), x;
    }
    function i(u, d) {
      const h = t(this.namespace + (typeof d > "u" ? ":" : d) + u);
      return h.log = this.log, h;
    }
    function s(u) {
      t.save(u), t.namespaces = u, t.names = [], t.skips = [];
      let d;
      const h = (typeof u == "string" ? u : "").split(/[\s,]+/), m = h.length;
      for (d = 0; d < m; d++)
        h[d] && (u = h[d].replace(/\*/g, ".*?"), u[0] === "-" ? t.skips.push(new RegExp("^" + u.slice(1) + "$")) : t.names.push(new RegExp("^" + u + "$")));
    }
    function o() {
      const u = [
        ...t.names.map(c),
        ...t.skips.map(c).map((d) => "-" + d)
      ].join(",");
      return t.enable(""), u;
    }
    function r(u) {
      if (u[u.length - 1] === "*")
        return !0;
      let d, h;
      for (d = 0, h = t.skips.length; d < h; d++)
        if (t.skips[d].test(u))
          return !1;
      for (d = 0, h = t.names.length; d < h; d++)
        if (t.names[d].test(u))
          return !0;
      return !1;
    }
    function c(u) {
      return u.toString().substring(2, u.toString().length - 2).replace(/\.\*\?$/, "*");
    }
    function p(u) {
      return u instanceof Error ? u.stack || u.message : u;
    }
    function l() {
      console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
    }
    return t.enable(t.load()), t;
  }
  return qa = e, qa;
}
var gi;
function Iu() {
  return gi || (gi = 1, function(e, n) {
    n.formatArgs = t, n.save = i, n.load = s, n.useColors = a, n.storage = o(), n.destroy = /* @__PURE__ */ (() => {
      let c = !1;
      return () => {
        c || (c = !0, console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."));
      };
    })(), n.colors = [
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
    function a() {
      if (typeof window < "u" && window.process && (window.process.type === "renderer" || window.process.__nwjs))
        return !0;
      if (typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))
        return !1;
      let c;
      return typeof document < "u" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window < "u" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator < "u" && navigator.userAgent && (c = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(c[1], 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function t(c) {
      if (c[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + c[0] + (this.useColors ? "%c " : " ") + "+" + e.exports.humanize(this.diff), !this.useColors)
        return;
      const p = "color: " + this.color;
      c.splice(1, 0, p, "color: inherit");
      let l = 0, u = 0;
      c[0].replace(/%[a-zA-Z%]/g, (d) => {
        d !== "%%" && (l++, d === "%c" && (u = l));
      }), c.splice(u, 0, p);
    }
    n.log = console.debug || console.log || (() => {
    });
    function i(c) {
      try {
        c ? n.storage.setItem("debug", c) : n.storage.removeItem("debug");
      } catch {
      }
    }
    function s() {
      let c;
      try {
        c = n.storage.getItem("debug");
      } catch {
      }
      return !c && typeof process < "u" && "env" in process && (c = process.env.DEBUG), c;
    }
    function o() {
      try {
        return localStorage;
      } catch {
      }
    }
    e.exports = Fo()(n);
    const { formatters: r } = e.exports;
    r.j = function(c) {
      try {
        return JSON.stringify(c);
      } catch (p) {
        return "[UnexpectedJSONParseError]: " + p.message;
      }
    };
  }(Cn, Cn.exports)), Cn.exports;
}
var On = { exports: {} }, Ma, yi;
function Uu() {
  return yi || (yi = 1, Ma = (e, n = process.argv) => {
    const a = e.startsWith("-") ? "" : e.length === 1 ? "-" : "--", t = n.indexOf(a + e), i = n.indexOf("--");
    return t !== -1 && (i === -1 || t < i);
  }), Ma;
}
var Ha, wi;
function zu() {
  if (wi) return Ha;
  wi = 1;
  const e = xt, n = gt, a = Uu(), { env: t } = process;
  let i;
  a("no-color") || a("no-colors") || a("color=false") || a("color=never") ? i = 0 : (a("color") || a("colors") || a("color=true") || a("color=always")) && (i = 1), "FORCE_COLOR" in t && (t.FORCE_COLOR === "true" ? i = 1 : t.FORCE_COLOR === "false" ? i = 0 : i = t.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(t.FORCE_COLOR, 10), 3));
  function s(c) {
    return c === 0 ? !1 : {
      level: c,
      hasBasic: !0,
      has256: c >= 2,
      has16m: c >= 3
    };
  }
  function o(c, p) {
    if (i === 0)
      return 0;
    if (a("color=16m") || a("color=full") || a("color=truecolor"))
      return 3;
    if (a("color=256"))
      return 2;
    if (c && !p && i === void 0)
      return 0;
    const l = i || 0;
    if (t.TERM === "dumb")
      return l;
    if (process.platform === "win32") {
      const u = e.release().split(".");
      return Number(u[0]) >= 10 && Number(u[2]) >= 10586 ? Number(u[2]) >= 14931 ? 3 : 2 : 1;
    }
    if ("CI" in t)
      return ["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((u) => u in t) || t.CI_NAME === "codeship" ? 1 : l;
    if ("TEAMCITY_VERSION" in t)
      return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(t.TEAMCITY_VERSION) ? 1 : 0;
    if (t.COLORTERM === "truecolor")
      return 3;
    if ("TERM_PROGRAM" in t) {
      const u = parseInt((t.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
      switch (t.TERM_PROGRAM) {
        case "iTerm.app":
          return u >= 3 ? 3 : 2;
        case "Apple_Terminal":
          return 2;
      }
    }
    return /-256(color)?$/i.test(t.TERM) ? 2 : /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(t.TERM) || "COLORTERM" in t ? 1 : l;
  }
  function r(c) {
    const p = o(c, c && c.isTTY);
    return s(p);
  }
  return Ha = {
    supportsColor: r,
    stdout: s(o(!0, n.isatty(1))),
    stderr: s(o(!0, n.isatty(2)))
  }, Ha;
}
var Ei;
function Bu() {
  return Ei || (Ei = 1, function(e, n) {
    const a = gt, t = be;
    n.init = l, n.log = r, n.formatArgs = s, n.save = c, n.load = p, n.useColors = i, n.destroy = t.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    ), n.colors = [6, 2, 3, 4, 5, 1];
    try {
      const d = zu();
      d && (d.stderr || d).level >= 2 && (n.colors = [
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
    n.inspectOpts = Object.keys(process.env).filter((d) => /^debug_/i.test(d)).reduce((d, h) => {
      const m = h.substring(6).toLowerCase().replace(/_([a-z])/g, (x, b) => b.toUpperCase());
      let v = process.env[h];
      return /^(yes|on|true|enabled)$/i.test(v) ? v = !0 : /^(no|off|false|disabled)$/i.test(v) ? v = !1 : v === "null" ? v = null : v = Number(v), d[m] = v, d;
    }, {});
    function i() {
      return "colors" in n.inspectOpts ? !!n.inspectOpts.colors : a.isatty(process.stderr.fd);
    }
    function s(d) {
      const { namespace: h, useColors: m } = this;
      if (m) {
        const v = this.color, x = "\x1B[3" + (v < 8 ? v : "8;5;" + v), b = `  ${x};1m${h} \x1B[0m`;
        d[0] = b + d[0].split(`
`).join(`
` + b), d.push(x + "m+" + e.exports.humanize(this.diff) + "\x1B[0m");
      } else
        d[0] = o() + h + " " + d[0];
    }
    function o() {
      return n.inspectOpts.hideDate ? "" : (/* @__PURE__ */ new Date()).toISOString() + " ";
    }
    function r(...d) {
      return process.stderr.write(t.formatWithOptions(n.inspectOpts, ...d) + `
`);
    }
    function c(d) {
      d ? process.env.DEBUG = d : delete process.env.DEBUG;
    }
    function p() {
      return process.env.DEBUG;
    }
    function l(d) {
      d.inspectOpts = {};
      const h = Object.keys(n.inspectOpts);
      for (let m = 0; m < h.length; m++)
        d.inspectOpts[h[m]] = n.inspectOpts[h[m]];
    }
    e.exports = Fo()(n);
    const { formatters: u } = e.exports;
    u.o = function(d) {
      return this.inspectOpts.colors = this.useColors, t.inspect(d, this.inspectOpts).split(`
`).map((h) => h.trim()).join(" ");
    }, u.O = function(d) {
      return this.inspectOpts.colors = this.useColors, t.inspect(d, this.inspectOpts);
    };
  }(On, On.exports)), On.exports;
}
var ki;
function qu() {
  return ki || (ki = 1, typeof process > "u" || process.type === "renderer" || process.browser === !0 || process.__nwjs ? jn.exports = Iu() : jn.exports = Bu()), jn.exports;
}
var He, Mu = function() {
  if (!He) {
    try {
      He = qu()("follow-redirects");
    } catch {
    }
    typeof He != "function" && (He = function() {
    });
  }
  He.apply(null, arguments);
}, cn = Zn, Qe = cn.URL, Hu = vt, Vu = bt, It = Q.Writable, Ut = fr, Lo = Mu;
(function() {
  var n = typeof process < "u", a = typeof window < "u" && typeof document < "u", t = Re(Error.captureStackTrace);
  !n && (a || !t) && console.warn("The follow-redirects package should be excluded from browser builds.");
})();
var zt = !1;
try {
  Ut(new Qe(""));
} catch (e) {
  zt = e.code === "ERR_INVALID_URL";
}
var Wu = [
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
], Bt = ["abort", "aborted", "connect", "error", "socket", "timeout"], qt = /* @__PURE__ */ Object.create(null);
Bt.forEach(function(e) {
  qt[e] = function(n, a, t) {
    this._redirectable.emit(e, n, a, t);
  };
});
var ot = pn(
  "ERR_INVALID_URL",
  "Invalid URL",
  TypeError
), rt = pn(
  "ERR_FR_REDIRECTION_FAILURE",
  "Redirected request failed"
), Ku = pn(
  "ERR_FR_TOO_MANY_REDIRECTS",
  "Maximum number of redirects exceeded",
  rt
), Ju = pn(
  "ERR_FR_MAX_BODY_LENGTH_EXCEEDED",
  "Request body larger than maxBodyLength limit"
), Gu = pn(
  "ERR_STREAM_WRITE_AFTER_END",
  "write after end"
), Yu = It.prototype.destroy || Do;
function K(e, n) {
  It.call(this), this._sanitizeOptions(e), this._options = e, this._ended = !1, this._ending = !1, this._redirectCount = 0, this._redirects = [], this._requestBodyLength = 0, this._requestBodyBuffers = [], n && this.on("response", n);
  var a = this;
  this._onNativeResponse = function(t) {
    try {
      a._processResponse(t);
    } catch (i) {
      a.emit("error", i instanceof rt ? i : new rt({ cause: i }));
    }
  }, this._performRequest();
}
K.prototype = Object.create(It.prototype);
K.prototype.abort = function() {
  Ht(this._currentRequest), this._currentRequest.abort(), this.emit("abort");
};
K.prototype.destroy = function(e) {
  return Ht(this._currentRequest, e), Yu.call(this, e), this;
};
K.prototype.write = function(e, n, a) {
  if (this._ending)
    throw new Gu();
  if (!_e(e) && !Qu(e))
    throw new TypeError("data should be a string, Buffer or Uint8Array");
  if (Re(n) && (a = n, n = null), e.length === 0) {
    a && a();
    return;
  }
  this._requestBodyLength + e.length <= this._options.maxBodyLength ? (this._requestBodyLength += e.length, this._requestBodyBuffers.push({ data: e, encoding: n }), this._currentRequest.write(e, n, a)) : (this.emit("error", new Ju()), this.abort());
};
K.prototype.end = function(e, n, a) {
  if (Re(e) ? (a = e, e = n = null) : Re(n) && (a = n, n = null), !e)
    this._ended = this._ending = !0, this._currentRequest.end(null, null, a);
  else {
    var t = this, i = this._currentRequest;
    this.write(e, n, function() {
      t._ended = !0, i.end(null, null, a);
    }), this._ending = !0;
  }
};
K.prototype.setHeader = function(e, n) {
  this._options.headers[e] = n, this._currentRequest.setHeader(e, n);
};
K.prototype.removeHeader = function(e) {
  delete this._options.headers[e], this._currentRequest.removeHeader(e);
};
K.prototype.setTimeout = function(e, n) {
  var a = this;
  function t(o) {
    o.setTimeout(e), o.removeListener("timeout", o.destroy), o.addListener("timeout", o.destroy);
  }
  function i(o) {
    a._timeout && clearTimeout(a._timeout), a._timeout = setTimeout(function() {
      a.emit("timeout"), s();
    }, e), t(o);
  }
  function s() {
    a._timeout && (clearTimeout(a._timeout), a._timeout = null), a.removeListener("abort", s), a.removeListener("error", s), a.removeListener("response", s), a.removeListener("close", s), n && a.removeListener("timeout", n), a.socket || a._currentRequest.removeListener("socket", i);
  }
  return n && this.on("timeout", n), this.socket ? i(this.socket) : this._currentRequest.once("socket", i), this.on("socket", t), this.on("abort", s), this.on("error", s), this.on("response", s), this.on("close", s), this;
};
[
  "flushHeaders",
  "getHeader",
  "setNoDelay",
  "setSocketKeepAlive"
].forEach(function(e) {
  K.prototype[e] = function(n, a) {
    return this._currentRequest[e](n, a);
  };
});
["aborted", "connection", "socket"].forEach(function(e) {
  Object.defineProperty(K.prototype, e, {
    get: function() {
      return this._currentRequest[e];
    }
  });
});
K.prototype._sanitizeOptions = function(e) {
  if (e.headers || (e.headers = {}), e.host && (e.hostname || (e.hostname = e.host), delete e.host), !e.pathname && e.path) {
    var n = e.path.indexOf("?");
    n < 0 ? e.pathname = e.path : (e.pathname = e.path.substring(0, n), e.search = e.path.substring(n));
  }
};
K.prototype._performRequest = function() {
  var e = this._options.protocol, n = this._options.nativeProtocols[e];
  if (!n)
    throw new TypeError("Unsupported protocol " + e);
  if (this._options.agents) {
    var a = e.slice(0, -1);
    this._options.agent = this._options.agents[a];
  }
  var t = this._currentRequest = n.request(this._options, this._onNativeResponse);
  t._redirectable = this;
  for (var i of Bt)
    t.on(i, qt[i]);
  if (this._currentUrl = /^\//.test(this._options.path) ? cn.format(this._options) : (
    // When making a request to a proxy, […]
    // a client MUST send the target URI in absolute-form […].
    this._options.path
  ), this._isRedirect) {
    var s = 0, o = this, r = this._requestBodyBuffers;
    (function c(p) {
      if (t === o._currentRequest)
        if (p)
          o.emit("error", p);
        else if (s < r.length) {
          var l = r[s++];
          t.finished || t.write(l.data, l.encoding, c);
        } else o._ended && t.end();
    })();
  }
};
K.prototype._processResponse = function(e) {
  var n = e.statusCode;
  this._options.trackRedirects && this._redirects.push({
    url: this._currentUrl,
    headers: e.headers,
    statusCode: n
  });
  var a = e.headers.location;
  if (!a || this._options.followRedirects === !1 || n < 300 || n >= 400) {
    e.responseUrl = this._currentUrl, e.redirects = this._redirects, this.emit("response", e), this._requestBodyBuffers = [];
    return;
  }
  if (Ht(this._currentRequest), e.destroy(), ++this._redirectCount > this._options.maxRedirects)
    throw new Ku();
  var t, i = this._options.beforeRedirect;
  i && (t = Object.assign({
    // The Host header was set by nativeProtocol.request
    Host: e.req.getHeader("host")
  }, this._options.headers));
  var s = this._options.method;
  ((n === 301 || n === 302) && this._options.method === "POST" || // RFC7231§6.4.4: The 303 (See Other) status code indicates that
  // the server is redirecting the user agent to a different resource […]
  // A user agent can perform a retrieval request targeting that URI
  // (a GET or HEAD request if using HTTP) […]
  n === 303 && !/^(?:GET|HEAD)$/.test(this._options.method)) && (this._options.method = "GET", this._requestBodyBuffers = [], Va(/^content-/i, this._options.headers));
  var o = Va(/^host$/i, this._options.headers), r = Mt(this._currentUrl), c = o || r.host, p = /^\w+:/.test(a) ? this._currentUrl : cn.format(Object.assign(r, { host: c })), l = Xu(a, p);
  if (Lo("redirecting to", l.href), this._isRedirect = !0, ct(l, this._options), (l.protocol !== r.protocol && l.protocol !== "https:" || l.host !== c && !Zu(l.host, c)) && Va(/^(?:(?:proxy-)?authorization|cookie)$/i, this._options.headers), Re(i)) {
    var u = {
      headers: e.headers,
      statusCode: n
    }, d = {
      url: p,
      method: s,
      headers: t
    };
    i(this._options, u, d), this._sanitizeOptions(this._options);
  }
  this._performRequest();
};
function No(e) {
  var n = {
    maxRedirects: 21,
    maxBodyLength: 10485760
  }, a = {};
  return Object.keys(e).forEach(function(t) {
    var i = t + ":", s = a[i] = e[t], o = n[t] = Object.create(s);
    function r(p, l, u) {
      return ed(p) ? p = ct(p) : _e(p) ? p = ct(Mt(p)) : (u = l, l = Io(p), p = { protocol: i }), Re(l) && (u = l, l = null), l = Object.assign({
        maxRedirects: n.maxRedirects,
        maxBodyLength: n.maxBodyLength
      }, p, l), l.nativeProtocols = a, !_e(l.host) && !_e(l.hostname) && (l.hostname = "::1"), Ut.equal(l.protocol, i, "protocol mismatch"), Lo("options", l), new K(l, u);
    }
    function c(p, l, u) {
      var d = o.request(p, l, u);
      return d.end(), d;
    }
    Object.defineProperties(o, {
      request: { value: r, configurable: !0, enumerable: !0, writable: !0 },
      get: { value: c, configurable: !0, enumerable: !0, writable: !0 }
    });
  }), n;
}
function Do() {
}
function Mt(e) {
  var n;
  if (zt)
    n = new Qe(e);
  else if (n = Io(cn.parse(e)), !_e(n.protocol))
    throw new ot({ input: e });
  return n;
}
function Xu(e, n) {
  return zt ? new Qe(e, n) : Mt(cn.resolve(n, e));
}
function Io(e) {
  if (/^\[/.test(e.hostname) && !/^\[[:0-9a-f]+\]$/i.test(e.hostname))
    throw new ot({ input: e.href || e });
  if (/^\[/.test(e.host) && !/^\[[:0-9a-f]+\](:\d+)?$/i.test(e.host))
    throw new ot({ input: e.href || e });
  return e;
}
function ct(e, n) {
  var a = n || {};
  for (var t of Wu)
    a[t] = e[t];
  return a.hostname.startsWith("[") && (a.hostname = a.hostname.slice(1, -1)), a.port !== "" && (a.port = Number(a.port)), a.path = a.search ? a.pathname + a.search : a.pathname, a;
}
function Va(e, n) {
  var a;
  for (var t in n)
    e.test(t) && (a = n[t], delete n[t]);
  return a === null || typeof a > "u" ? void 0 : String(a).trim();
}
function pn(e, n, a) {
  function t(i) {
    Re(Error.captureStackTrace) && Error.captureStackTrace(this, this.constructor), Object.assign(this, i || {}), this.code = e, this.message = this.cause ? n + ": " + this.cause.message : n;
  }
  return t.prototype = new (a || Error)(), Object.defineProperties(t.prototype, {
    constructor: {
      value: t,
      enumerable: !1
    },
    name: {
      value: "Error [" + e + "]",
      enumerable: !1
    }
  }), t;
}
function Ht(e, n) {
  for (var a of Bt)
    e.removeListener(a, qt[a]);
  e.on("error", Do), e.destroy(n);
}
function Zu(e, n) {
  Ut(_e(e) && _e(n));
  var a = e.length - n.length - 1;
  return a > 0 && e[a] === "." && e.endsWith(n);
}
function _e(e) {
  return typeof e == "string" || e instanceof String;
}
function Re(e) {
  return typeof e == "function";
}
function Qu(e) {
  return typeof e == "object" && "length" in e;
}
function ed(e) {
  return Qe && e instanceof Qe;
}
Dt.exports = No({ http: Hu, https: Vu });
Dt.exports.wrap = No;
var nd = Dt.exports;
const ad = /* @__PURE__ */ Qn(nd), Jn = "1.9.0";
function Uo(e) {
  const n = /^([-+\w]{1,25})(:?\/\/|:)/.exec(e);
  return n && n[1] || "";
}
const td = /^(?:([^;]+);)?(?:[^;]+;)?(base64|),([\s\S]*)$/;
function id(e, n, a) {
  const t = a && a.Blob || L.classes.Blob, i = Uo(e);
  if (n === void 0 && t && (n = !0), i === "data") {
    e = i.length ? e.slice(i.length + 1) : e;
    const s = td.exec(e);
    if (!s)
      throw new g("Invalid URL", g.ERR_INVALID_URL);
    const o = s[1], r = s[2], c = s[3], p = Buffer.from(decodeURIComponent(c), r ? "base64" : "utf8");
    if (n) {
      if (!t)
        throw new g("Blob is not supported", g.ERR_NOT_SUPPORT);
      return new t([p], { type: o });
    }
    return p;
  }
  throw new g("Unsupported protocol " + i, g.ERR_NOT_SUPPORT);
}
const Wa = Symbol("internals");
class _i extends Q.Transform {
  constructor(n) {
    n = f.toFlatObject(n, {
      maxRate: 0,
      chunkSize: 64 * 1024,
      minChunkSize: 100,
      timeWindow: 500,
      ticksRate: 2,
      samplesCount: 15
    }, null, (t, i) => !f.isUndefined(i[t])), super({
      readableHighWaterMark: n.chunkSize
    });
    const a = this[Wa] = {
      timeWindow: n.timeWindow,
      chunkSize: n.chunkSize,
      maxRate: n.maxRate,
      minChunkSize: n.minChunkSize,
      bytesSeen: 0,
      isCaptured: !1,
      notifiedBytesLoaded: 0,
      ts: Date.now(),
      bytes: 0,
      onReadCallback: null
    };
    this.on("newListener", (t) => {
      t === "progress" && (a.isCaptured || (a.isCaptured = !0));
    });
  }
  _read(n) {
    const a = this[Wa];
    return a.onReadCallback && a.onReadCallback(), super._read(n);
  }
  _transform(n, a, t) {
    const i = this[Wa], s = i.maxRate, o = this.readableHighWaterMark, r = i.timeWindow, c = 1e3 / r, p = s / c, l = i.minChunkSize !== !1 ? Math.max(i.minChunkSize, p * 0.01) : 0, u = (h, m) => {
      const v = Buffer.byteLength(h);
      i.bytesSeen += v, i.bytes += v, i.isCaptured && this.emit("progress", i.bytesSeen), this.push(h) ? process.nextTick(m) : i.onReadCallback = () => {
        i.onReadCallback = null, process.nextTick(m);
      };
    }, d = (h, m) => {
      const v = Buffer.byteLength(h);
      let x = null, b = o, y, w = 0;
      if (s) {
        const S = Date.now();
        (!i.ts || (w = S - i.ts) >= r) && (i.ts = S, y = p - i.bytes, i.bytes = y < 0 ? -y : 0, w = 0), y = p - i.bytes;
      }
      if (s) {
        if (y <= 0)
          return setTimeout(() => {
            m(null, h);
          }, r - w);
        y < b && (b = y);
      }
      b && v > b && v - b > l && (x = h.subarray(b), h = h.subarray(0, b)), u(h, x ? () => {
        process.nextTick(m, null, x);
      } : m);
    };
    d(n, function h(m, v) {
      if (m)
        return t(m);
      v ? d(v, h) : t(null);
    });
  }
}
const { asyncIterator: Si } = Symbol, zo = async function* (e) {
  e.stream ? yield* e.stream() : e.arrayBuffer ? yield await e.arrayBuffer() : e[Si] ? yield* e[Si]() : yield e;
}, sd = L.ALPHABET.ALPHA_DIGIT + "-_", en = typeof TextEncoder == "function" ? new TextEncoder() : new be.TextEncoder(), ke = `\r
`, od = en.encode(ke), rd = 2;
class cd {
  constructor(n, a) {
    const { escapeName: t } = this.constructor, i = f.isString(a);
    let s = `Content-Disposition: form-data; name="${t(n)}"${!i && a.name ? `; filename="${t(a.name)}"` : ""}${ke}`;
    i ? a = en.encode(String(a).replace(/\r?\n|\r\n?/g, ke)) : s += `Content-Type: ${a.type || "application/octet-stream"}${ke}`, this.headers = en.encode(s + ke), this.contentLength = i ? a.byteLength : a.size, this.size = this.headers.byteLength + this.contentLength + rd, this.name = n, this.value = a;
  }
  async *encode() {
    yield this.headers;
    const { value: n } = this;
    f.isTypedArray(n) ? yield n : yield* zo(n), yield od;
  }
  static escapeName(n) {
    return String(n).replace(/[\r\n"]/g, (a) => ({
      "\r": "%0D",
      "\n": "%0A",
      '"': "%22"
    })[a]);
  }
}
const pd = (e, n, a) => {
  const {
    tag: t = "form-data-boundary",
    size: i = 25,
    boundary: s = t + "-" + L.generateString(i, sd)
  } = a || {};
  if (!f.isFormData(e))
    throw TypeError("FormData instance required");
  if (s.length < 1 || s.length > 70)
    throw Error("boundary must be 10-70 characters long");
  const o = en.encode("--" + s + ke), r = en.encode("--" + s + "--" + ke);
  let c = r.byteLength;
  const p = Array.from(e.entries()).map(([u, d]) => {
    const h = new cd(u, d);
    return c += h.size, h;
  });
  c += o.byteLength * p.length, c = f.toFiniteNumber(c);
  const l = {
    "Content-Type": `multipart/form-data; boundary=${s}`
  };
  return Number.isFinite(c) && (l["Content-Length"] = c), n && n(l), dr.from(async function* () {
    for (const u of p)
      yield o, yield* u.encode();
    yield r;
  }());
};
class ld extends Q.Transform {
  __transform(n, a, t) {
    this.push(n), t();
  }
  _transform(n, a, t) {
    if (n.length !== 0 && (this._transform = this.__transform, n[0] !== 120)) {
      const i = Buffer.alloc(2);
      i[0] = 120, i[1] = 156, this.push(i, a);
    }
    this.__transform(n, a, t);
  }
}
const ud = (e, n) => f.isAsyncFn(e) ? function(...a) {
  const t = a.pop();
  e.apply(this, a).then((i) => {
    try {
      n ? t(null, ...n(i)) : t(null, i);
    } catch (s) {
      t(s);
    }
  }, t);
} : e;
function dd(e, n) {
  e = e || 10;
  const a = new Array(e), t = new Array(e);
  let i = 0, s = 0, o;
  return n = n !== void 0 ? n : 1e3, function(c) {
    const p = Date.now(), l = t[s];
    o || (o = p), a[i] = c, t[i] = p;
    let u = s, d = 0;
    for (; u !== i; )
      d += a[u++], u = u % e;
    if (i = (i + 1) % e, i === s && (s = (s + 1) % e), p - o < n)
      return;
    const h = l && p - l;
    return h ? Math.round(d * 1e3 / h) : void 0;
  };
}
function md(e, n) {
  let a = 0, t = 1e3 / n, i, s;
  const o = (p, l = Date.now()) => {
    a = l, i = null, s && (clearTimeout(s), s = null), e.apply(null, p);
  };
  return [(...p) => {
    const l = Date.now(), u = l - a;
    u >= t ? o(p, l) : (i = p, s || (s = setTimeout(() => {
      s = null, o(i);
    }, t - u)));
  }, () => i && o(i)];
}
const Ie = (e, n, a = 3) => {
  let t = 0;
  const i = dd(50, 250);
  return md((s) => {
    const o = s.loaded, r = s.lengthComputable ? s.total : void 0, c = o - t, p = i(c), l = o <= r;
    t = o;
    const u = {
      loaded: o,
      total: r,
      progress: r ? o / r : void 0,
      bytes: c,
      rate: p || void 0,
      estimated: p && r && l ? (r - o) / p : void 0,
      event: s,
      lengthComputable: r != null,
      [n ? "download" : "upload"]: !0
    };
    e(u);
  }, a);
}, Gn = (e, n) => {
  const a = e != null;
  return [(t) => n[0]({
    lengthComputable: a,
    total: e,
    loaded: t
  }), n[1]];
}, Yn = (e) => (...n) => f.asap(() => e(...n)), Ai = {
  flush: he.constants.Z_SYNC_FLUSH,
  finishFlush: he.constants.Z_SYNC_FLUSH
}, fd = {
  flush: he.constants.BROTLI_OPERATION_FLUSH,
  finishFlush: he.constants.BROTLI_OPERATION_FLUSH
}, Ti = f.isFunction(he.createBrotliDecompress), { http: hd, https: xd } = ad, vd = /https:?/, Ri = L.protocols.map((e) => e + ":"), ji = (e, [n, a]) => (e.on("end", a).on("error", a), n);
function bd(e, n) {
  e.beforeRedirects.proxy && e.beforeRedirects.proxy(e), e.beforeRedirects.config && e.beforeRedirects.config(e, n);
}
function Bo(e, n, a) {
  let t = n;
  if (!t && t !== !1) {
    const i = Po.getProxyForUrl(a);
    i && (t = new URL(i));
  }
  if (t) {
    if (t.username && (t.auth = (t.username || "") + ":" + (t.password || "")), t.auth) {
      (t.auth.username || t.auth.password) && (t.auth = (t.auth.username || "") + ":" + (t.auth.password || ""));
      const s = Buffer.from(t.auth, "utf8").toString("base64");
      e.headers["Proxy-Authorization"] = "Basic " + s;
    }
    e.headers.host = e.hostname + (e.port ? ":" + e.port : "");
    const i = t.hostname || t.host;
    e.hostname = i, e.host = i, e.port = t.port, e.path = a, t.protocol && (e.protocol = t.protocol.includes(":") ? t.protocol : `${t.protocol}:`);
  }
  e.beforeRedirects.proxy = function(s) {
    Bo(s, n, s.href);
  };
}
const gd = typeof process < "u" && f.kindOf(process) === "process", yd = (e) => new Promise((n, a) => {
  let t, i;
  const s = (c, p) => {
    i || (i = !0, t && t(c, p));
  }, o = (c) => {
    s(c), n(c);
  }, r = (c) => {
    s(c, !0), a(c);
  };
  e(o, r, (c) => t = c).catch(r);
}), wd = ({ address: e, family: n }) => {
  if (!f.isString(e))
    throw TypeError("address must be a string");
  return {
    address: e,
    family: n || (e.indexOf(".") < 0 ? 6 : 4)
  };
}, Ci = (e, n) => wd(f.isObject(e) ? e : { address: e, family: n }), Ed = gd && function(n) {
  return yd(async function(t, i, s) {
    let { data: o, lookup: r, family: c } = n;
    const { responseType: p, responseEncoding: l } = n, u = n.method.toUpperCase();
    let d, h = !1, m;
    if (r) {
      const _ = ud(r, (T) => f.isArray(T) ? T : [T]);
      r = (T, q, ye) => {
        _(T, q, (U, de, Sa) => {
          if (U)
            return ye(U);
          const oe = f.isArray(de) ? de.map((Z) => Ci(Z)) : [Ci(de, Sa)];
          q.all ? ye(U, oe) : ye(U, oe[0].address, oe[0].family);
        });
      };
    }
    const v = new hr(), x = () => {
      n.cancelToken && n.cancelToken.unsubscribe(b), n.signal && n.signal.removeEventListener("abort", b), v.removeAllListeners();
    };
    s((_, T) => {
      d = !0, T && (h = !0, x());
    });
    function b(_) {
      v.emit("abort", !_ || _.type ? new ve(null, n, m) : _);
    }
    v.once("abort", i), (n.cancelToken || n.signal) && (n.cancelToken && n.cancelToken.subscribe(b), n.signal && (n.signal.aborted ? b() : n.signal.addEventListener("abort", b)));
    const y = Nt(n.baseURL, n.url, n.allowAbsoluteUrls), w = new URL(y, L.hasBrowserEnv ? L.origin : void 0), S = w.protocol || Ri[0];
    if (S === "data:") {
      let _;
      if (u !== "GET")
        return Fe(t, i, {
          status: 405,
          statusText: "method not allowed",
          headers: {},
          config: n
        });
      try {
        _ = id(n.url, p === "blob", {
          Blob: n.env && n.env.Blob
        });
      } catch (T) {
        throw g.from(T, g.ERR_BAD_REQUEST, n);
      }
      return p === "text" ? (_ = _.toString(l), (!l || l === "utf8") && (_ = f.stripBOM(_))) : p === "stream" && (_ = Q.Readable.from(_)), Fe(t, i, {
        data: _,
        status: 200,
        statusText: "OK",
        headers: new z(),
        config: n
      });
    }
    if (Ri.indexOf(S) === -1)
      return i(new g(
        "Unsupported protocol " + S,
        g.ERR_BAD_REQUEST,
        n
      ));
    const k = z.from(n.headers).normalize();
    k.set("User-Agent", "axios/" + Jn, !1);
    const { onUploadProgress: P, onDownloadProgress: E } = n, A = n.maxRate;
    let R, J;
    if (f.isSpecCompliantForm(o)) {
      const _ = k.getContentType(/boundary=([-_\w\d]{10,70})/i);
      o = pd(o, (T) => {
        k.set(T);
      }, {
        tag: `axios-${Jn}-boundary`,
        boundary: _ && _[1] || void 0
      });
    } else if (f.isFormData(o) && f.isFunction(o.getHeaders)) {
      if (k.set(o.getHeaders()), !k.hasContentLength())
        try {
          const _ = await be.promisify(o.getLength).call(o);
          Number.isFinite(_) && _ >= 0 && k.setContentLength(_);
        } catch {
        }
    } else if (f.isBlob(o) || f.isFile(o))
      o.size && k.setContentType(o.type || "application/octet-stream"), k.setContentLength(o.size || 0), o = Q.Readable.from(zo(o));
    else if (o && !f.isStream(o)) {
      if (!Buffer.isBuffer(o)) if (f.isArrayBuffer(o))
        o = Buffer.from(new Uint8Array(o));
      else if (f.isString(o))
        o = Buffer.from(o, "utf-8");
      else
        return i(new g(
          "Data after transformation must be a string, an ArrayBuffer, a Buffer, or a Stream",
          g.ERR_BAD_REQUEST,
          n
        ));
      if (k.setContentLength(o.length, !1), n.maxBodyLength > -1 && o.length > n.maxBodyLength)
        return i(new g(
          "Request body larger than maxBodyLength limit",
          g.ERR_BAD_REQUEST,
          n
        ));
    }
    const ne = f.toFiniteNumber(k.getContentLength());
    f.isArray(A) ? (R = A[0], J = A[1]) : R = J = A, o && (P || R) && (f.isStream(o) || (o = Q.Readable.from(o, { objectMode: !1 })), o = Q.pipeline([o, new _i({
      maxRate: f.toFiniteNumber(R)
    })], f.noop), P && o.on("progress", ji(
      o,
      Gn(
        ne,
        Ie(Yn(P), !1, 3)
      )
    )));
    let ge;
    if (n.auth) {
      const _ = n.auth.username || "", T = n.auth.password || "";
      ge = _ + ":" + T;
    }
    if (!ge && w.username) {
      const _ = w.username, T = w.password;
      ge = _ + ":" + T;
    }
    ge && k.delete("authorization");
    let un;
    try {
      un = Pt(
        w.pathname + w.search,
        n.params,
        n.paramsSerializer
      ).replace(/^\?/, "");
    } catch (_) {
      const T = new Error(_.message);
      return T.config = n, T.url = n.url, T.exists = !0, i(T);
    }
    k.set(
      "Accept-Encoding",
      "gzip, compress, deflate" + (Ti ? ", br" : ""),
      !1
    );
    const B = {
      path: un,
      method: u,
      headers: k.toJSON(),
      agents: { http: n.httpAgent, https: n.httpsAgent },
      auth: ge,
      protocol: S,
      family: c,
      beforeRedirect: bd,
      beforeRedirects: {}
    };
    !f.isUndefined(r) && (B.lookup = r), n.socketPath ? B.socketPath = n.socketPath : (B.hostname = w.hostname.startsWith("[") ? w.hostname.slice(1, -1) : w.hostname, B.port = w.port, Bo(B, n.proxy, S + "//" + w.hostname + (w.port ? ":" + w.port : "") + B.path));
    let ue;
    const qe = vd.test(B.protocol);
    if (B.agent = qe ? n.httpsAgent : n.httpAgent, n.transport ? ue = n.transport : n.maxRedirects === 0 ? ue = qe ? bt : vt : (n.maxRedirects && (B.maxRedirects = n.maxRedirects), n.beforeRedirect && (B.beforeRedirects.config = n.beforeRedirect), ue = qe ? xd : hd), n.maxBodyLength > -1 ? B.maxBodyLength = n.maxBodyLength : B.maxBodyLength = 1 / 0, n.insecureHTTPParser && (B.insecureHTTPParser = n.insecureHTTPParser), m = ue.request(B, function(T) {
      if (m.destroyed) return;
      const q = [T], ye = +T.headers["content-length"];
      if (E || J) {
        const Z = new _i({
          maxRate: f.toFiniteNumber(J)
        });
        E && Z.on("progress", ji(
          Z,
          Gn(
            ye,
            Ie(Yn(E), !0, 3)
          )
        )), q.push(Z);
      }
      let U = T;
      const de = T.req || m;
      if (n.decompress !== !1 && T.headers["content-encoding"])
        switch ((u === "HEAD" || T.statusCode === 204) && delete T.headers["content-encoding"], (T.headers["content-encoding"] || "").toLowerCase()) {
          case "gzip":
          case "x-gzip":
          case "compress":
          case "x-compress":
            q.push(he.createUnzip(Ai)), delete T.headers["content-encoding"];
            break;
          case "deflate":
            q.push(new ld()), q.push(he.createUnzip(Ai)), delete T.headers["content-encoding"];
            break;
          case "br":
            Ti && (q.push(he.createBrotliDecompress(fd)), delete T.headers["content-encoding"]);
        }
      U = q.length > 1 ? Q.pipeline(q, f.noop) : q[0];
      const Sa = Q.finished(U, () => {
        Sa(), x();
      }), oe = {
        status: T.statusCode,
        statusText: T.statusMessage,
        headers: new z(T.headers),
        config: n,
        request: de
      };
      if (p === "stream")
        oe.data = U, Fe(t, i, oe);
      else {
        const Z = [];
        let Wt = 0;
        U.on("data", function(H) {
          Z.push(H), Wt += H.length, n.maxContentLength > -1 && Wt > n.maxContentLength && (h = !0, U.destroy(), i(new g(
            "maxContentLength size of " + n.maxContentLength + " exceeded",
            g.ERR_BAD_RESPONSE,
            n,
            de
          )));
        }), U.on("aborted", function() {
          if (h)
            return;
          const H = new g(
            "stream has been aborted",
            g.ERR_BAD_RESPONSE,
            n,
            de
          );
          U.destroy(H), i(H);
        }), U.on("error", function(H) {
          m.destroyed || i(g.from(H, null, n, de));
        }), U.on("end", function() {
          try {
            let H = Z.length === 1 ? Z[0] : Buffer.concat(Z);
            p !== "arraybuffer" && (H = H.toString(l), (!l || l === "utf8") && (H = f.stripBOM(H))), oe.data = H;
          } catch (H) {
            return i(g.from(H, null, n, oe.request, oe));
          }
          Fe(t, i, oe);
        });
      }
      v.once("abort", (Z) => {
        U.destroyed || (U.emit("error", Z), U.destroy());
      });
    }), v.once("abort", (_) => {
      i(_), m.destroy(_);
    }), m.on("error", function(T) {
      i(g.from(T, null, n, m));
    }), m.on("socket", function(T) {
      T.setKeepAlive(!0, 1e3 * 60);
    }), n.timeout) {
      const _ = parseInt(n.timeout, 10);
      if (Number.isNaN(_)) {
        i(new g(
          "error trying to parse `config.timeout` to int",
          g.ERR_BAD_OPTION_VALUE,
          n,
          m
        ));
        return;
      }
      m.setTimeout(_, function() {
        if (d) return;
        let q = n.timeout ? "timeout of " + n.timeout + "ms exceeded" : "timeout exceeded";
        const ye = n.transitional || Ft;
        n.timeoutErrorMessage && (q = n.timeoutErrorMessage), i(new g(
          q,
          ye.clarifyTimeoutError ? g.ETIMEDOUT : g.ECONNABORTED,
          n,
          m
        )), b();
      });
    }
    if (f.isStream(o)) {
      let _ = !1, T = !1;
      o.on("end", () => {
        _ = !0;
      }), o.once("error", (q) => {
        T = !0, m.destroy(q);
      }), o.on("close", () => {
        !_ && !T && b(new ve("Request stream has been aborted", n, m));
      }), o.pipe(m);
    } else
      m.end(o);
  });
}, kd = L.hasStandardBrowserEnv ? /* @__PURE__ */ ((e, n) => (a) => (a = new URL(a, L.origin), e.protocol === a.protocol && e.host === a.host && (n || e.port === a.port)))(
  new URL(L.origin),
  L.navigator && /(msie|trident)/i.test(L.navigator.userAgent)
) : () => !0, _d = L.hasStandardBrowserEnv ? (
  // Standard browser envs support document.cookie
  {
    write(e, n, a, t, i, s) {
      const o = [e + "=" + encodeURIComponent(n)];
      f.isNumber(a) && o.push("expires=" + new Date(a).toGMTString()), f.isString(t) && o.push("path=" + t), f.isString(i) && o.push("domain=" + i), s === !0 && o.push("secure"), document.cookie = o.join("; ");
    },
    read(e) {
      const n = document.cookie.match(new RegExp("(^|;\\s*)(" + e + ")=([^;]*)"));
      return n ? decodeURIComponent(n[3]) : null;
    },
    remove(e) {
      this.write(e, "", Date.now() - 864e5);
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
), Oi = (e) => e instanceof z ? { ...e } : e;
function je(e, n) {
  n = n || {};
  const a = {};
  function t(p, l, u, d) {
    return f.isPlainObject(p) && f.isPlainObject(l) ? f.merge.call({ caseless: d }, p, l) : f.isPlainObject(l) ? f.merge({}, l) : f.isArray(l) ? l.slice() : l;
  }
  function i(p, l, u, d) {
    if (f.isUndefined(l)) {
      if (!f.isUndefined(p))
        return t(void 0, p, u, d);
    } else return t(p, l, u, d);
  }
  function s(p, l) {
    if (!f.isUndefined(l))
      return t(void 0, l);
  }
  function o(p, l) {
    if (f.isUndefined(l)) {
      if (!f.isUndefined(p))
        return t(void 0, p);
    } else return t(void 0, l);
  }
  function r(p, l, u) {
    if (u in n)
      return t(p, l);
    if (u in e)
      return t(void 0, p);
  }
  const c = {
    url: s,
    method: s,
    data: s,
    baseURL: o,
    transformRequest: o,
    transformResponse: o,
    paramsSerializer: o,
    timeout: o,
    timeoutMessage: o,
    withCredentials: o,
    withXSRFToken: o,
    adapter: o,
    responseType: o,
    xsrfCookieName: o,
    xsrfHeaderName: o,
    onUploadProgress: o,
    onDownloadProgress: o,
    decompress: o,
    maxContentLength: o,
    maxBodyLength: o,
    beforeRedirect: o,
    transport: o,
    httpAgent: o,
    httpsAgent: o,
    cancelToken: o,
    socketPath: o,
    responseEncoding: o,
    validateStatus: r,
    headers: (p, l, u) => i(Oi(p), Oi(l), u, !0)
  };
  return f.forEach(Object.keys(Object.assign({}, e, n)), function(l) {
    const u = c[l] || i, d = u(e[l], n[l], l);
    f.isUndefined(d) && u !== r || (a[l] = d);
  }), a;
}
const qo = (e) => {
  const n = je({}, e);
  let { data: a, withXSRFToken: t, xsrfHeaderName: i, xsrfCookieName: s, headers: o, auth: r } = n;
  n.headers = o = z.from(o), n.url = Pt(Nt(n.baseURL, n.url, n.allowAbsoluteUrls), e.params, e.paramsSerializer), r && o.set(
    "Authorization",
    "Basic " + btoa((r.username || "") + ":" + (r.password ? unescape(encodeURIComponent(r.password)) : ""))
  );
  let c;
  if (f.isFormData(a)) {
    if (L.hasStandardBrowserEnv || L.hasStandardBrowserWebWorkerEnv)
      o.setContentType(void 0);
    else if ((c = o.getContentType()) !== !1) {
      const [p, ...l] = c ? c.split(";").map((u) => u.trim()).filter(Boolean) : [];
      o.setContentType([p || "multipart/form-data", ...l].join("; "));
    }
  }
  if (L.hasStandardBrowserEnv && (t && f.isFunction(t) && (t = t(n)), t || t !== !1 && kd(n.url))) {
    const p = i && s && _d.read(s);
    p && o.set(i, p);
  }
  return n;
}, Sd = typeof XMLHttpRequest < "u", Ad = Sd && function(e) {
  return new Promise(function(a, t) {
    const i = qo(e);
    let s = i.data;
    const o = z.from(i.headers).normalize();
    let { responseType: r, onUploadProgress: c, onDownloadProgress: p } = i, l, u, d, h, m;
    function v() {
      h && h(), m && m(), i.cancelToken && i.cancelToken.unsubscribe(l), i.signal && i.signal.removeEventListener("abort", l);
    }
    let x = new XMLHttpRequest();
    x.open(i.method.toUpperCase(), i.url, !0), x.timeout = i.timeout;
    function b() {
      if (!x)
        return;
      const w = z.from(
        "getAllResponseHeaders" in x && x.getAllResponseHeaders()
      ), k = {
        data: !r || r === "text" || r === "json" ? x.responseText : x.response,
        status: x.status,
        statusText: x.statusText,
        headers: w,
        config: e,
        request: x
      };
      Fe(function(E) {
        a(E), v();
      }, function(E) {
        t(E), v();
      }, k), x = null;
    }
    "onloadend" in x ? x.onloadend = b : x.onreadystatechange = function() {
      !x || x.readyState !== 4 || x.status === 0 && !(x.responseURL && x.responseURL.indexOf("file:") === 0) || setTimeout(b);
    }, x.onabort = function() {
      x && (t(new g("Request aborted", g.ECONNABORTED, e, x)), x = null);
    }, x.onerror = function() {
      t(new g("Network Error", g.ERR_NETWORK, e, x)), x = null;
    }, x.ontimeout = function() {
      let S = i.timeout ? "timeout of " + i.timeout + "ms exceeded" : "timeout exceeded";
      const k = i.transitional || Ft;
      i.timeoutErrorMessage && (S = i.timeoutErrorMessage), t(new g(
        S,
        k.clarifyTimeoutError ? g.ETIMEDOUT : g.ECONNABORTED,
        e,
        x
      )), x = null;
    }, s === void 0 && o.setContentType(null), "setRequestHeader" in x && f.forEach(o.toJSON(), function(S, k) {
      x.setRequestHeader(k, S);
    }), f.isUndefined(i.withCredentials) || (x.withCredentials = !!i.withCredentials), r && r !== "json" && (x.responseType = i.responseType), p && ([d, m] = Ie(p, !0), x.addEventListener("progress", d)), c && x.upload && ([u, h] = Ie(c), x.upload.addEventListener("progress", u), x.upload.addEventListener("loadend", h)), (i.cancelToken || i.signal) && (l = (w) => {
      x && (t(!w || w.type ? new ve(null, e, x) : w), x.abort(), x = null);
    }, i.cancelToken && i.cancelToken.subscribe(l), i.signal && (i.signal.aborted ? l() : i.signal.addEventListener("abort", l)));
    const y = Uo(i.url);
    if (y && L.protocols.indexOf(y) === -1) {
      t(new g("Unsupported protocol " + y + ":", g.ERR_BAD_REQUEST, e));
      return;
    }
    x.send(s || null);
  });
}, Td = (e, n) => {
  const { length: a } = e = e ? e.filter(Boolean) : [];
  if (n || a) {
    let t = new AbortController(), i;
    const s = function(p) {
      if (!i) {
        i = !0, r();
        const l = p instanceof Error ? p : this.reason;
        t.abort(l instanceof g ? l : new ve(l instanceof Error ? l.message : l));
      }
    };
    let o = n && setTimeout(() => {
      o = null, s(new g(`timeout ${n} of ms exceeded`, g.ETIMEDOUT));
    }, n);
    const r = () => {
      e && (o && clearTimeout(o), o = null, e.forEach((p) => {
        p.unsubscribe ? p.unsubscribe(s) : p.removeEventListener("abort", s);
      }), e = null);
    };
    e.forEach((p) => p.addEventListener("abort", s));
    const { signal: c } = t;
    return c.unsubscribe = () => f.asap(r), c;
  }
}, Rd = function* (e, n) {
  let a = e.byteLength;
  if (a < n) {
    yield e;
    return;
  }
  let t = 0, i;
  for (; t < a; )
    i = t + n, yield e.slice(t, i), t = i;
}, jd = async function* (e, n) {
  for await (const a of Cd(e))
    yield* Rd(a, n);
}, Cd = async function* (e) {
  if (e[Symbol.asyncIterator]) {
    yield* e;
    return;
  }
  const n = e.getReader();
  try {
    for (; ; ) {
      const { done: a, value: t } = await n.read();
      if (a)
        break;
      yield t;
    }
  } finally {
    await n.cancel();
  }
}, $i = (e, n, a, t) => {
  const i = jd(e, n);
  let s = 0, o, r = (c) => {
    o || (o = !0, t && t(c));
  };
  return new ReadableStream({
    async pull(c) {
      try {
        const { done: p, value: l } = await i.next();
        if (p) {
          r(), c.close();
          return;
        }
        let u = l.byteLength;
        if (a) {
          let d = s += u;
          a(d);
        }
        c.enqueue(new Uint8Array(l));
      } catch (p) {
        throw r(p), p;
      }
    },
    cancel(c) {
      return r(c), i.return();
    }
  }, {
    highWaterMark: 2
  });
}, ka = typeof fetch == "function" && typeof Request == "function" && typeof Response == "function", Mo = ka && typeof ReadableStream == "function", Od = ka && (typeof TextEncoder == "function" ? /* @__PURE__ */ ((e) => (n) => e.encode(n))(new TextEncoder()) : async (e) => new Uint8Array(await new Response(e).arrayBuffer())), Ho = (e, ...n) => {
  try {
    return !!e(...n);
  } catch {
    return !1;
  }
}, $d = Mo && Ho(() => {
  let e = !1;
  const n = new Request(L.origin, {
    body: new ReadableStream(),
    method: "POST",
    get duplex() {
      return e = !0, "half";
    }
  }).headers.has("Content-Type");
  return e && !n;
}), Pi = 64 * 1024, pt = Mo && Ho(() => f.isReadableStream(new Response("").body)), Xn = {
  stream: pt && ((e) => e.body)
};
ka && ((e) => {
  ["text", "arrayBuffer", "blob", "formData", "stream"].forEach((n) => {
    !Xn[n] && (Xn[n] = f.isFunction(e[n]) ? (a) => a[n]() : (a, t) => {
      throw new g(`Response type '${n}' is not supported`, g.ERR_NOT_SUPPORT, t);
    });
  });
})(new Response());
const Pd = async (e) => {
  if (e == null)
    return 0;
  if (f.isBlob(e))
    return e.size;
  if (f.isSpecCompliantForm(e))
    return (await new Request(L.origin, {
      method: "POST",
      body: e
    }).arrayBuffer()).byteLength;
  if (f.isArrayBufferView(e) || f.isArrayBuffer(e))
    return e.byteLength;
  if (f.isURLSearchParams(e) && (e = e + ""), f.isString(e))
    return (await Od(e)).byteLength;
}, Fd = async (e, n) => {
  const a = f.toFiniteNumber(e.getContentLength());
  return a ?? Pd(n);
}, Ld = ka && (async (e) => {
  let {
    url: n,
    method: a,
    data: t,
    signal: i,
    cancelToken: s,
    timeout: o,
    onDownloadProgress: r,
    onUploadProgress: c,
    responseType: p,
    headers: l,
    withCredentials: u = "same-origin",
    fetchOptions: d
  } = qo(e);
  p = p ? (p + "").toLowerCase() : "text";
  let h = Td([i, s && s.toAbortSignal()], o), m;
  const v = h && h.unsubscribe && (() => {
    h.unsubscribe();
  });
  let x;
  try {
    if (c && $d && a !== "get" && a !== "head" && (x = await Fd(l, t)) !== 0) {
      let k = new Request(n, {
        method: "POST",
        body: t,
        duplex: "half"
      }), P;
      if (f.isFormData(t) && (P = k.headers.get("content-type")) && l.setContentType(P), k.body) {
        const [E, A] = Gn(
          x,
          Ie(Yn(c))
        );
        t = $i(k.body, Pi, E, A);
      }
    }
    f.isString(u) || (u = u ? "include" : "omit");
    const b = "credentials" in Request.prototype;
    m = new Request(n, {
      ...d,
      signal: h,
      method: a.toUpperCase(),
      headers: l.normalize().toJSON(),
      body: t,
      duplex: "half",
      credentials: b ? u : void 0
    });
    let y = await fetch(m);
    const w = pt && (p === "stream" || p === "response");
    if (pt && (r || w && v)) {
      const k = {};
      ["status", "statusText", "headers"].forEach((R) => {
        k[R] = y[R];
      });
      const P = f.toFiniteNumber(y.headers.get("content-length")), [E, A] = r && Gn(
        P,
        Ie(Yn(r), !0)
      ) || [];
      y = new Response(
        $i(y.body, Pi, E, () => {
          A && A(), v && v();
        }),
        k
      );
    }
    p = p || "text";
    let S = await Xn[f.findKey(Xn, p) || "text"](y, e);
    return !w && v && v(), await new Promise((k, P) => {
      Fe(k, P, {
        data: S,
        headers: z.from(y.headers),
        status: y.status,
        statusText: y.statusText,
        config: e,
        request: m
      });
    });
  } catch (b) {
    throw v && v(), b && b.name === "TypeError" && /Load failed|fetch/i.test(b.message) ? Object.assign(
      new g("Network Error", g.ERR_NETWORK, e, m),
      {
        cause: b.cause || b
      }
    ) : g.from(b, b && b.code, e, m);
  }
}), lt = {
  http: Ed,
  xhr: Ad,
  fetch: Ld
};
f.forEach(lt, (e, n) => {
  if (e) {
    try {
      Object.defineProperty(e, "name", { value: n });
    } catch {
    }
    Object.defineProperty(e, "adapterName", { value: n });
  }
});
const Fi = (e) => `- ${e}`, Nd = (e) => f.isFunction(e) || e === null || e === !1, Vo = {
  getAdapter: (e) => {
    e = f.isArray(e) ? e : [e];
    const { length: n } = e;
    let a, t;
    const i = {};
    for (let s = 0; s < n; s++) {
      a = e[s];
      let o;
      if (t = a, !Nd(a) && (t = lt[(o = String(a)).toLowerCase()], t === void 0))
        throw new g(`Unknown adapter '${o}'`);
      if (t)
        break;
      i[o || "#" + s] = t;
    }
    if (!t) {
      const s = Object.entries(i).map(
        ([r, c]) => `adapter ${r} ` + (c === !1 ? "is not supported by the environment" : "is not available in the build")
      );
      let o = n ? s.length > 1 ? `since :
` + s.map(Fi).join(`
`) : " " + Fi(s[0]) : "as no adapter specified";
      throw new g(
        "There is no suitable adapter to dispatch the request " + o,
        "ERR_NOT_SUPPORT"
      );
    }
    return t;
  },
  adapters: lt
};
function Ka(e) {
  if (e.cancelToken && e.cancelToken.throwIfRequested(), e.signal && e.signal.aborted)
    throw new ve(null, e);
}
function Li(e) {
  return Ka(e), e.headers = z.from(e.headers), e.data = za.call(
    e,
    e.transformRequest
  ), ["post", "put", "patch"].indexOf(e.method) !== -1 && e.headers.setContentType("application/x-www-form-urlencoded", !1), Vo.getAdapter(e.adapter || rn.adapter)(e).then(function(t) {
    return Ka(e), t.data = za.call(
      e,
      e.transformResponse,
      t
    ), t.headers = z.from(t.headers), t;
  }, function(t) {
    return $o(t) || (Ka(e), t && t.response && (t.response.data = za.call(
      e,
      e.transformResponse,
      t.response
    ), t.response.headers = z.from(t.response.headers))), Promise.reject(t);
  });
}
const _a = {};
["object", "boolean", "number", "function", "string", "symbol"].forEach((e, n) => {
  _a[e] = function(t) {
    return typeof t === e || "a" + (n < 1 ? "n " : " ") + e;
  };
});
const Ni = {};
_a.transitional = function(n, a, t) {
  function i(s, o) {
    return "[Axios v" + Jn + "] Transitional option '" + s + "'" + o + (t ? ". " + t : "");
  }
  return (s, o, r) => {
    if (n === !1)
      throw new g(
        i(o, " has been removed" + (a ? " in " + a : "")),
        g.ERR_DEPRECATED
      );
    return a && !Ni[o] && (Ni[o] = !0, console.warn(
      i(
        o,
        " has been deprecated since v" + a + " and will be removed in the near future"
      )
    )), n ? n(s, o, r) : !0;
  };
};
_a.spelling = function(n) {
  return (a, t) => (console.warn(`${t} is likely a misspelling of ${n}`), !0);
};
function Dd(e, n, a) {
  if (typeof e != "object")
    throw new g("options must be an object", g.ERR_BAD_OPTION_VALUE);
  const t = Object.keys(e);
  let i = t.length;
  for (; i-- > 0; ) {
    const s = t[i], o = n[s];
    if (o) {
      const r = e[s], c = r === void 0 || o(r, s, e);
      if (c !== !0)
        throw new g("option " + s + " must be " + c, g.ERR_BAD_OPTION_VALUE);
      continue;
    }
    if (a !== !0)
      throw new g("Unknown option " + s, g.ERR_BAD_OPTION);
  }
}
const Dn = {
  assertOptions: Dd,
  validators: _a
}, re = Dn.validators;
let Se = class {
  constructor(n) {
    this.defaults = n || {}, this.interceptors = {
      request: new fi(),
      response: new fi()
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
  async request(n, a) {
    try {
      return await this._request(n, a);
    } catch (t) {
      if (t instanceof Error) {
        let i = {};
        Error.captureStackTrace ? Error.captureStackTrace(i) : i = new Error();
        const s = i.stack ? i.stack.replace(/^.+\n/, "") : "";
        try {
          t.stack ? s && !String(t.stack).endsWith(s.replace(/^.+\n.+\n/, "")) && (t.stack += `
` + s) : t.stack = s;
        } catch {
        }
      }
      throw t;
    }
  }
  _request(n, a) {
    typeof n == "string" ? (a = a || {}, a.url = n) : a = n || {}, a = je(this.defaults, a);
    const { transitional: t, paramsSerializer: i, headers: s } = a;
    t !== void 0 && Dn.assertOptions(t, {
      silentJSONParsing: re.transitional(re.boolean),
      forcedJSONParsing: re.transitional(re.boolean),
      clarifyTimeoutError: re.transitional(re.boolean)
    }, !1), i != null && (f.isFunction(i) ? a.paramsSerializer = {
      serialize: i
    } : Dn.assertOptions(i, {
      encode: re.function,
      serialize: re.function
    }, !0)), a.allowAbsoluteUrls !== void 0 || (this.defaults.allowAbsoluteUrls !== void 0 ? a.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls : a.allowAbsoluteUrls = !0), Dn.assertOptions(a, {
      baseUrl: re.spelling("baseURL"),
      withXsrfToken: re.spelling("withXSRFToken")
    }, !0), a.method = (a.method || this.defaults.method || "get").toLowerCase();
    let o = s && f.merge(
      s.common,
      s[a.method]
    );
    s && f.forEach(
      ["delete", "get", "head", "post", "put", "patch", "common"],
      (m) => {
        delete s[m];
      }
    ), a.headers = z.concat(o, s);
    const r = [];
    let c = !0;
    this.interceptors.request.forEach(function(v) {
      typeof v.runWhen == "function" && v.runWhen(a) === !1 || (c = c && v.synchronous, r.unshift(v.fulfilled, v.rejected));
    });
    const p = [];
    this.interceptors.response.forEach(function(v) {
      p.push(v.fulfilled, v.rejected);
    });
    let l, u = 0, d;
    if (!c) {
      const m = [Li.bind(this), void 0];
      for (m.unshift.apply(m, r), m.push.apply(m, p), d = m.length, l = Promise.resolve(a); u < d; )
        l = l.then(m[u++], m[u++]);
      return l;
    }
    d = r.length;
    let h = a;
    for (u = 0; u < d; ) {
      const m = r[u++], v = r[u++];
      try {
        h = m(h);
      } catch (x) {
        v.call(this, x);
        break;
      }
    }
    try {
      l = Li.call(this, h);
    } catch (m) {
      return Promise.reject(m);
    }
    for (u = 0, d = p.length; u < d; )
      l = l.then(p[u++], p[u++]);
    return l;
  }
  getUri(n) {
    n = je(this.defaults, n);
    const a = Nt(n.baseURL, n.url, n.allowAbsoluteUrls);
    return Pt(a, n.params, n.paramsSerializer);
  }
};
f.forEach(["delete", "get", "head", "options"], function(n) {
  Se.prototype[n] = function(a, t) {
    return this.request(je(t || {}, {
      method: n,
      url: a,
      data: (t || {}).data
    }));
  };
});
f.forEach(["post", "put", "patch"], function(n) {
  function a(t) {
    return function(s, o, r) {
      return this.request(je(r || {}, {
        method: n,
        headers: t ? {
          "Content-Type": "multipart/form-data"
        } : {},
        url: s,
        data: o
      }));
    };
  }
  Se.prototype[n] = a(), Se.prototype[n + "Form"] = a(!0);
});
let Id = class Wo {
  constructor(n) {
    if (typeof n != "function")
      throw new TypeError("executor must be a function.");
    let a;
    this.promise = new Promise(function(s) {
      a = s;
    });
    const t = this;
    this.promise.then((i) => {
      if (!t._listeners) return;
      let s = t._listeners.length;
      for (; s-- > 0; )
        t._listeners[s](i);
      t._listeners = null;
    }), this.promise.then = (i) => {
      let s;
      const o = new Promise((r) => {
        t.subscribe(r), s = r;
      }).then(i);
      return o.cancel = function() {
        t.unsubscribe(s);
      }, o;
    }, n(function(s, o, r) {
      t.reason || (t.reason = new ve(s, o, r), a(t.reason));
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
  subscribe(n) {
    if (this.reason) {
      n(this.reason);
      return;
    }
    this._listeners ? this._listeners.push(n) : this._listeners = [n];
  }
  /**
   * Unsubscribe from the cancel signal
   */
  unsubscribe(n) {
    if (!this._listeners)
      return;
    const a = this._listeners.indexOf(n);
    a !== -1 && this._listeners.splice(a, 1);
  }
  toAbortSignal() {
    const n = new AbortController(), a = (t) => {
      n.abort(t);
    };
    return this.subscribe(a), n.signal.unsubscribe = () => this.unsubscribe(a), n.signal;
  }
  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  static source() {
    let n;
    return {
      token: new Wo(function(i) {
        n = i;
      }),
      cancel: n
    };
  }
};
function Ud(e) {
  return function(a) {
    return e.apply(null, a);
  };
}
function zd(e) {
  return f.isObject(e) && e.isAxiosError === !0;
}
const ut = {
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
Object.entries(ut).forEach(([e, n]) => {
  ut[n] = e;
});
function Ko(e) {
  const n = new Se(e), a = so(Se.prototype.request, n);
  return f.extend(a, Se.prototype, n, { allOwnKeys: !0 }), f.extend(a, n, null, { allOwnKeys: !0 }), a.create = function(i) {
    return Ko(je(e, i));
  }, a;
}
const $ = Ko(rn);
$.Axios = Se;
$.CanceledError = ve;
$.CancelToken = Id;
$.isCancel = $o;
$.VERSION = Jn;
$.toFormData = Ea;
$.AxiosError = g;
$.Cancel = $.CanceledError;
$.all = function(n) {
  return Promise.all(n);
};
$.spread = Ud;
$.isAxiosError = zd;
$.mergeConfig = je;
$.AxiosHeaders = z;
$.formToJSON = (e) => Oo(f.isHTMLForm(e) ? new FormData(e) : e);
$.getAdapter = Vo.getAdapter;
$.HttpStatusCode = ut;
$.default = $;
const {
  Axios: rf,
  AxiosError: cf,
  CanceledError: pf,
  isCancel: lf,
  CancelToken: uf,
  VERSION: df,
  all: mf,
  Cancel: ff,
  isAxiosError: hf,
  spread: xf,
  toFormData: vf,
  AxiosHeaders: bf,
  HttpStatusCode: gf,
  formToJSON: yf,
  getAdapter: wf,
  mergeConfig: Ef
} = $;
async function ln(e) {
  const a = (await ee()).playlists.find((o) => o.name === e);
  if (!a) return !1;
  const { url: t, username: i, password: s } = a;
  return {
    getAuthenticateUrl: `${t}/player_api.php?username=${i}&password=${s}`,
    getAllVodUrl: `${t}/player_api.php?username=${i}&password=${s}&action=get_vod_streams`,
    getAllVodCategoriesUrl: `${t}/player_api.php?username=${i}&password=${s}&action=get_vod_categories`,
    getVodStreamUrl: `${t}/movie/${i}/${s}/`,
    getVodInfoUrl: `${t}/player_api.php?username=${i}&password=${s}&action=get_vod_info&vod_id=`,
    getAllSeriesUrl: `${t}/player_api.php?username=${i}&password=${s}&action=get_series`,
    getAllSeriesCategoriesUrl: `${t}/player_api.php?username=${i}&password=${s}&action=get_series_categories`,
    getSeriesInfoUrl: `${t}/player_api.php?username=${i}&password=${s}&action=get_series_info&series_id=`,
    getSeriesStreamUrl: `${t}/series/${i}/${s}/`,
    getAllLiveUrl: `${t}/player_api.php?username=${i}&password=${s}&action=get_live_streams`,
    getAllLiveCategoriesUrl: `${t}/player_api.php?username=${i}&password=${s}&action=get_live_categories`,
    getLiveStreamUrl: `${t}/live/${i}/${s}/`,
    getLiveEpgUrl: `${t}/player_api.php?username=${i}&password=${s}&action=get_short_epg&limit=20&stream_id=`
  };
}
async function Jo(e) {
  const n = await ln(e);
  if (!n) return;
  const a = await $.get(n.getAllVodUrl), t = await $.get(n.getAllVodCategoriesUrl);
  if (a.status !== 200 || t.status !== 200 || !Array.isArray(a.data) || !Array.isArray(t.data) || a.data.length === 0 || t.data.length === 0) return;
  const i = { playlist: a.data, categories: t.data };
  return await j.writeAsync(ao(e), i), i;
}
async function Go(e) {
  const n = await ln(e);
  if (!n) return;
  const a = await $.get(n.getAllSeriesUrl), t = await $.get(n.getAllSeriesCategoriesUrl);
  if (a.status !== 200 || t.status !== 200 || !Array.isArray(a.data) || !Array.isArray(t.data) || a.data.length === 0 || t.data.length === 0) return;
  const i = { playlist: a.data, categories: t.data };
  return await j.writeAsync(to(e), i), i;
}
async function Yo(e) {
  const n = await ln(e);
  if (!n) return;
  const a = await $.get(n.getAllLiveUrl), t = await $.get(n.getAllLiveCategoriesUrl);
  if (a.status !== 200 || t.status !== 200 || !Array.isArray(a.data) || !Array.isArray(t.data) || a.data.length === 0 || t.data.length === 0) return;
  const i = { playlist: a.data, categories: t.data };
  return await j.writeAsync(io(e), i), i;
}
async function Xo(e) {
  try {
    const n = await $.get(e);
    return n.status !== 200 ? { status: !1, message: n.statusText } : n.data.user_info.status === "Expired" ? { status: !1, message: "Access denied, account expired." } : { status: !0, message: "Validated" };
  } catch (n) {
    if (n instanceof Error)
      return { status: !1, message: n.message };
  }
}
async function Bd(e) {
  const n = await j.readAsync(I, "json");
  if (n.playlists) {
    for (const a of n.playlists)
      if (a.name == e.name) return !1;
    n.playlists.push(e);
  } else
    n.playlists = [e];
  return n.currentPlaylist = {
    name: e.name,
    profile: "Default"
  }, await j.writeAsync(I, n);
}
async function Zo(e) {
  const n = ao(e);
  return await j.readAsync(n, "json");
}
async function qd(e) {
  return await j.readAsync(to(e), "json");
}
async function Md(e) {
  return await j.readAsync(io(e), "json");
}
async function Hd(e) {
  return (await j.readAsync(I, "json")).playlists.find((a) => a.name == e);
}
async function Vd(e) {
  if (!e) return;
  const n = await $.get(e);
  if (!(!n.data || n.status !== 200))
    return n.data;
}
async function Wd(e) {
  if (!e) return;
  const n = await $.get(e);
  if (!(!n.data || n.status !== 200))
    return n.data;
}
async function Kd(e) {
  const { currentPlaylist: n } = await ee(), a = Te(n.name, e);
  let t = await j.readAsync(Te(n.name, e), "json");
  return t || (t = { vod: [], series: [], live: [] }, await j.writeAsync(a, t)), t;
}
async function Jd(e) {
  const { currentPlaylist: n } = await ee(), a = Te(n.name, n.profile);
  return await j.writeAsync(a, e), e;
}
async function Gd(e) {
  const n = await j.readAsync(I, "json"), a = n.playlists.find((t) => t.name == e);
  return a ? (n.currentPlaylist = {
    name: e,
    profile: a.profiles[0]
  }, await j.writeAsync(I, n), !0) : !1;
}
async function Qo(e) {
  const n = await j.readAsync(I, "json"), a = n.playlists.map((t) => (t.name == e && (t.updatedAt = /* @__PURE__ */ new Date()), t));
  return n.playlists = a, await j.writeAsync(I, n);
}
async function Yd(e) {
  const n = await ee(), a = Te(n.currentPlaylist.name, e), t = n.playlists.find((r) => r.name === n.currentPlaylist.name);
  if (t == null ? void 0 : t.profiles.find((r) => r === e)) return !1;
  const s = n.playlists.map((r) => (r.name === n.currentPlaylist.name && r.profiles.push(e), r));
  n.playlists = s, await j.writeAsync(I, n);
  let o = await j.readAsync(Te(n.currentPlaylist.name, e), "json");
  return o ? !1 : (o = { vod: [], series: [], live: [] }, await j.writeAsync(a, o), !0);
}
async function Xd(e) {
  const n = await j.readAsync(I, "json");
  return n.currentPlaylist.profile = e, await j.writeAsync(I, n), !0;
}
async function Zd({ profile: e, newName: n }) {
  const a = await ee(), t = Te(a.currentPlaylist.name, e);
  a.currentPlaylist.profile = n;
  const i = a.playlists.map((s) => {
    if (s.name === a.currentPlaylist.name) {
      const o = s.profiles.filter((r) => r !== e);
      o.push(n), s.profiles = o;
    }
    return s;
  });
  return a.playlists = i, await j.writeAsync(I, a), await j.renameAsync(t, `${n}.json`);
}
async function Qd(e) {
  const n = await ee();
  let a = [];
  const t = n.playlists.map((s) => {
    if (s.name === n.currentPlaylist.name) {
      const o = s.profiles.filter((r) => r !== e);
      s.profiles = o, a = o;
    }
    return s;
  });
  n.currentPlaylist.profile = a[0], n.playlists = t, await j.writeAsync(I, n);
  const i = Te(n.currentPlaylist.name, e);
  await j.removeAsync(i);
}
async function em(e) {
  const n = await ee();
  if (n.playlists) {
    const a = n.playlists.filter((t) => t.name !== e);
    n.playlists = a;
  }
  return n.playlists.length === 0 ? n.currentPlaylist = {
    name: "",
    profile: ""
  } : n.currentPlaylist = {
    name: n.playlists[0].name,
    profile: "Default"
  }, await j.removeAsync(xa(e)), await j.writeAsync(I, n), n;
}
async function nm({ path: e, startTime: n, seriesId: a }, t) {
  let i, s = "";
  a ? s = new URL(e).origin + a : s = e;
  const o = Oe.createHash("md5").update(s, "utf8").digest("hex"), c = [
    "--extraintf",
    "http",
    "--http-host",
    "127.0.0.1",
    "--http-port",
    "9090",
    "--http-password",
    "joy",
    "--no-snapshot-preview",
    "--no-osd",
    "--snapshot-format=jpg",
    "--snapshot-width=500",
    "--snapshot-height=0",
    `--snapshot-path=${ur.join(no(), o)}.jpg`,
    "--fullscreen",
    "--start-time",
    n.toString(),
    e
  ], p = await ee();
  return i = vr(p.vlcPath, c), i.setMaxListeners(2), i.stderr.on("data", (l) => {
    const u = l.toString();
    u.includes("access stream error") && (i.kill(), t.webContents.send("vlc-status", { running: !1, error: u }));
  }), i.on("close", () => {
    t.webContents.send("vlc-status", { running: !1 });
  }), i.pid;
}
async function am() {
  return (await $.get("http://127.0.0.1:9090/requests/status.json", {
    auth: {
      username: "",
      password: "joy"
    },
    timeout: 500
  })).data;
}
async function tm({ playlistName: e, newPlaylistInfo: n }) {
  const a = await j.readAsync(I, "json"), t = a.playlists.map((i) => i.name === e ? { ...n, profiles: i.profiles } : i);
  return a.currentPlaylist = { name: n.name, profile: "Default" }, a.playlists = t, await j.renameAsync(xa(e), n.name), await j.writeAsync(I, a);
}
async function im() {
  const e = await ee(), n = e.currentPlaylist.name;
  if (!e.playlists.find((c) => c.name === n)) return Ve(!1, "Error: playlist info");
  const t = await ln(n);
  if (!t) return Ve(!1, "Error: urls");
  const i = await Xo(t.getAuthenticateUrl);
  if (!i || !i.status) return Ve(!1, i == null ? void 0 : i.message);
  const s = await Jo(n), o = await Go(n), r = await Yo(n);
  return await Qo(n), !s || !o || !r ? Ve(!1, "Playlist cannot be added/updated") : Ve(!0, {
    updatedVod: s,
    updatedSeries: o,
    updatedLive: r
  });
}
function Ve(e, n) {
  return {
    isSuccess: e,
    data: n
  };
}
async function sm() {
  const n = (await ee()).currentPlaylist.name;
  return await j.readAsync(F.join(xa(n), "trending.json"), "json") || [];
}
const om = mr(import.meta.url), rm = F.dirname(om);
let we = null;
async function Di(e, n) {
  return we || (we = (async () => {
    const t = (await ee()).currentPlaylist.name, i = await Zo(t), s = await ln(t);
    if (!(!e || !s))
      return new Promise((o, r) => {
        const c = new br(
          F.resolve(rm, "./fetchTmdbTrending.worker.js"),
          { workerData: { apiKey: e, vodPlaylist: i, url: s.getVodInfoUrl } }
        );
        c.on("message", async (p) => {
          we = null, p.isSuccess ? (await j.writeAsync(F.join(xa(t), "trending.json"), p.tmdbData), n.webContents.send("trending", { isSuccess: !0, data: p.result }), o(p.isSuccess), c.terminate()) : r(p.error);
        }), c.on("error", (p) => {
          we = null, r(p);
        }), c.on("exit", (p) => {
          we = null, p !== 0 && r(new Error(`Worker stopped with exit code ${p}`));
        });
      });
  })(), we);
}
async function cm() {
  const e = await pr.showOpenDialog({
    title: "Selecione o executável do programa",
    properties: ["openFile"],
    filters: [
      { name: "Executáveis", extensions: ["exe", "app", "bat", "sh", "*"] }
    ]
  });
  if (e.filePaths.length === 0) return;
  const n = e.filePaths[0], a = await j.readAsync(I, "json");
  return a.vlcPath = n, await j.writeAsync(I, a), n;
}
async function pm(e) {
  const n = Oe.createHash("md5").update(e, "utf8").digest("hex"), a = F.join(no(), n + ".jpg");
  try {
    return `data:image/png;base64,${(await Ce.promises.readFile(a)).toString("base64")}`;
  } catch {
    return "";
  }
}
async function lm() {
  try {
    await $.get("http://127.0.0.1:9090/requests/status.xml?command=snapshot", {
      auth: {
        username: "",
        password: "joy"
      },
      timeout: 500
    });
  } catch {
    console.log("erro snapshot");
  }
}
function um(e) {
  const n = process.env.VITE_TMDB_API_KEY;
  O.handle("get-platform", () => process.platform), O.handle("get-metadata", ee), O.handle("authenticate-user", async (a, t) => await Xo(t)), O.handle("fetch-tmdb-trending", async (a) => await Di(n, e)), O.handle("get-local-tmdb-trending", async (a) => await sm()), O.handle("update-current-playlist", async (a) => {
    const t = await im();
    return t.isSuccess && await Di(n, e), t;
  }), O.handle("take-snapshot", async (a) => await lm()), O.handle("get-snapshot", async (a, t) => await pm(t)), O.handle("update-vod", async (a, t) => await Jo(t)), O.handle("update-series", async (a, t) => await Go(t)), O.handle("update-live", async (a, t) => await Yo(t)), O.handle("add-playlist-to-meta", async (a, t) => await Bd(t)), O.handle("edit-playlist-info", async (a, t) => await tm(t)), O.handle("remove-playlist", async (a, t) => await em(t)), O.handle("get-local-vod-playlist", async (a, t) => await Zo(t)), O.handle("get-local-series-playlist", async (a, t) => await qd(t)), O.handle("get-local-live-playlist", async (a, t) => await Md(t)), O.handle("get-playlist-info", async (a, t) => await Hd(t)), O.handle("get-vod-info", async (a, t) => await Vd(t)), O.handle("get-serie-info", async (a, t) => await Wd(t)), O.handle("get-user-data", async (a, t) => await Kd(t)), O.handle("update-user-data", async (a, t) => await Jd(t)), O.handle("change-current-playlist", async (a, t) => await Gd(t)), O.handle("updated-at-playlist", async (a, t) => await Qo(t)), O.handle("create-profile", async (a, t) => await Yd(t)), O.handle("switch-profile", async (a, t) => await Xd(t)), O.handle("rename-profile", async (a, t) => await Zd(t)), O.handle("remove-profile", async (a, t) => await Qd(t)), O.handle("update-vlc-path", async (a) => cm()), O.handle("launch-vlc", async (a, t) => nm(t, e)), O.handle("get-vlc-state", async (a) => await am());
}
var dt = { exports: {} }, $n = { exports: {} }, Pn = { exports: {} }, Ja, Ii;
function dm() {
  if (Ii) return Ja;
  Ii = 1;
  var e = 1e3, n = e * 60, a = n * 60, t = a * 24, i = t * 365.25;
  Ja = function(p, l) {
    l = l || {};
    var u = typeof p;
    if (u === "string" && p.length > 0)
      return s(p);
    if (u === "number" && isNaN(p) === !1)
      return l.long ? r(p) : o(p);
    throw new Error(
      "val is not a non-empty string or a valid number. val=" + JSON.stringify(p)
    );
  };
  function s(p) {
    if (p = String(p), !(p.length > 100)) {
      var l = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
        p
      );
      if (l) {
        var u = parseFloat(l[1]), d = (l[2] || "ms").toLowerCase();
        switch (d) {
          case "years":
          case "year":
          case "yrs":
          case "yr":
          case "y":
            return u * i;
          case "days":
          case "day":
          case "d":
            return u * t;
          case "hours":
          case "hour":
          case "hrs":
          case "hr":
          case "h":
            return u * a;
          case "minutes":
          case "minute":
          case "mins":
          case "min":
          case "m":
            return u * n;
          case "seconds":
          case "second":
          case "secs":
          case "sec":
          case "s":
            return u * e;
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
  function o(p) {
    return p >= t ? Math.round(p / t) + "d" : p >= a ? Math.round(p / a) + "h" : p >= n ? Math.round(p / n) + "m" : p >= e ? Math.round(p / e) + "s" : p + "ms";
  }
  function r(p) {
    return c(p, t, "day") || c(p, a, "hour") || c(p, n, "minute") || c(p, e, "second") || p + " ms";
  }
  function c(p, l, u) {
    if (!(p < l))
      return p < l * 1.5 ? Math.floor(p / l) + " " + u : Math.ceil(p / l) + " " + u + "s";
  }
  return Ja;
}
var Ui;
function er() {
  return Ui || (Ui = 1, function(e, n) {
    n = e.exports = i.debug = i.default = i, n.coerce = c, n.disable = o, n.enable = s, n.enabled = r, n.humanize = dm(), n.names = [], n.skips = [], n.formatters = {};
    var a;
    function t(p) {
      var l = 0, u;
      for (u in p)
        l = (l << 5) - l + p.charCodeAt(u), l |= 0;
      return n.colors[Math.abs(l) % n.colors.length];
    }
    function i(p) {
      function l() {
        if (l.enabled) {
          var u = l, d = +/* @__PURE__ */ new Date(), h = d - (a || d);
          u.diff = h, u.prev = a, u.curr = d, a = d;
          for (var m = new Array(arguments.length), v = 0; v < m.length; v++)
            m[v] = arguments[v];
          m[0] = n.coerce(m[0]), typeof m[0] != "string" && m.unshift("%O");
          var x = 0;
          m[0] = m[0].replace(/%([a-zA-Z%])/g, function(y, w) {
            if (y === "%%") return y;
            x++;
            var S = n.formatters[w];
            if (typeof S == "function") {
              var k = m[x];
              y = S.call(u, k), m.splice(x, 1), x--;
            }
            return y;
          }), n.formatArgs.call(u, m);
          var b = l.log || n.log || console.log.bind(console);
          b.apply(u, m);
        }
      }
      return l.namespace = p, l.enabled = n.enabled(p), l.useColors = n.useColors(), l.color = t(p), typeof n.init == "function" && n.init(l), l;
    }
    function s(p) {
      n.save(p), n.names = [], n.skips = [];
      for (var l = (typeof p == "string" ? p : "").split(/[\s,]+/), u = l.length, d = 0; d < u; d++)
        l[d] && (p = l[d].replace(/\*/g, ".*?"), p[0] === "-" ? n.skips.push(new RegExp("^" + p.substr(1) + "$")) : n.names.push(new RegExp("^" + p + "$")));
    }
    function o() {
      n.enable("");
    }
    function r(p) {
      var l, u;
      for (l = 0, u = n.skips.length; l < u; l++)
        if (n.skips[l].test(p))
          return !1;
      for (l = 0, u = n.names.length; l < u; l++)
        if (n.names[l].test(p))
          return !0;
      return !1;
    }
    function c(p) {
      return p instanceof Error ? p.stack || p.message : p;
    }
  }(Pn, Pn.exports)), Pn.exports;
}
var zi;
function mm() {
  return zi || (zi = 1, function(e, n) {
    n = e.exports = er(), n.log = i, n.formatArgs = t, n.save = s, n.load = o, n.useColors = a, n.storage = typeof chrome < "u" && typeof chrome.storage < "u" ? chrome.storage.local : r(), n.colors = [
      "lightseagreen",
      "forestgreen",
      "goldenrod",
      "dodgerblue",
      "darkorchid",
      "crimson"
    ];
    function a() {
      return typeof window < "u" && window.process && window.process.type === "renderer" ? !0 : typeof document < "u" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // is firebug? http://stackoverflow.com/a/398120/376773
      typeof window < "u" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || // double check webkit in userAgent just in case we are in a worker
      typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    n.formatters.j = function(c) {
      try {
        return JSON.stringify(c);
      } catch (p) {
        return "[UnexpectedJSONParseError]: " + p.message;
      }
    };
    function t(c) {
      var p = this.useColors;
      if (c[0] = (p ? "%c" : "") + this.namespace + (p ? " %c" : " ") + c[0] + (p ? "%c " : " ") + "+" + n.humanize(this.diff), !!p) {
        var l = "color: " + this.color;
        c.splice(1, 0, l, "color: inherit");
        var u = 0, d = 0;
        c[0].replace(/%[a-zA-Z%]/g, function(h) {
          h !== "%%" && (u++, h === "%c" && (d = u));
        }), c.splice(d, 0, l);
      }
    }
    function i() {
      return typeof console == "object" && console.log && Function.prototype.apply.call(console.log, console, arguments);
    }
    function s(c) {
      try {
        c == null ? n.storage.removeItem("debug") : n.storage.debug = c;
      } catch {
      }
    }
    function o() {
      var c;
      try {
        c = n.storage.debug;
      } catch {
      }
      return !c && typeof process < "u" && "env" in process && (c = process.env.DEBUG), c;
    }
    n.enable(o());
    function r() {
      try {
        return window.localStorage;
      } catch {
      }
    }
  }($n, $n.exports)), $n.exports;
}
var Fn = { exports: {} }, Bi;
function fm() {
  return Bi || (Bi = 1, function(e, n) {
    var a = gt, t = be;
    n = e.exports = er(), n.init = d, n.log = c, n.formatArgs = r, n.save = p, n.load = l, n.useColors = o, n.colors = [6, 2, 3, 4, 5, 1], n.inspectOpts = Object.keys(process.env).filter(function(h) {
      return /^debug_/i.test(h);
    }).reduce(function(h, m) {
      var v = m.substring(6).toLowerCase().replace(/_([a-z])/g, function(b, y) {
        return y.toUpperCase();
      }), x = process.env[m];
      return /^(yes|on|true|enabled)$/i.test(x) ? x = !0 : /^(no|off|false|disabled)$/i.test(x) ? x = !1 : x === "null" ? x = null : x = Number(x), h[v] = x, h;
    }, {});
    var i = parseInt(process.env.DEBUG_FD, 10) || 2;
    i !== 1 && i !== 2 && t.deprecate(function() {
    }, "except for stderr(2) and stdout(1), any other usage of DEBUG_FD is deprecated. Override debug.log if you want to use a different log function (https://git.io/debug_fd)")();
    var s = i === 1 ? process.stdout : i === 2 ? process.stderr : u(i);
    function o() {
      return "colors" in n.inspectOpts ? !!n.inspectOpts.colors : a.isatty(i);
    }
    n.formatters.o = function(h) {
      return this.inspectOpts.colors = this.useColors, t.inspect(h, this.inspectOpts).split(`
`).map(function(m) {
        return m.trim();
      }).join(" ");
    }, n.formatters.O = function(h) {
      return this.inspectOpts.colors = this.useColors, t.inspect(h, this.inspectOpts);
    };
    function r(h) {
      var m = this.namespace, v = this.useColors;
      if (v) {
        var x = this.color, b = "  \x1B[3" + x + ";1m" + m + " \x1B[0m";
        h[0] = b + h[0].split(`
`).join(`
` + b), h.push("\x1B[3" + x + "m+" + n.humanize(this.diff) + "\x1B[0m");
      } else
        h[0] = (/* @__PURE__ */ new Date()).toUTCString() + " " + m + " " + h[0];
    }
    function c() {
      return s.write(t.format.apply(t, arguments) + `
`);
    }
    function p(h) {
      h == null ? delete process.env.DEBUG : process.env.DEBUG = h;
    }
    function l() {
      return process.env.DEBUG;
    }
    function u(h) {
      var m, v = process.binding("tty_wrap");
      switch (v.guessHandleType(h)) {
        case "TTY":
          m = new a.WriteStream(h), m._type = "tty", m._handle && m._handle.unref && m._handle.unref();
          break;
        case "FILE":
          var x = Ce;
          m = new x.SyncWriteStream(h, { autoClose: !1 }), m._type = "fs";
          break;
        case "PIPE":
        case "TCP":
          var b = gr;
          m = new b.Socket({
            fd: h,
            readable: !1,
            writable: !0
          }), m.readable = !1, m.read = null, m._type = "pipe", m._handle && m._handle.unref && m._handle.unref();
          break;
        default:
          throw new Error("Implement me. Unknown stream file type!");
      }
      return m.fd = h, m._isStdio = !0, m;
    }
    function d(h) {
      h.inspectOpts = {};
      for (var m = Object.keys(n.inspectOpts), v = 0; v < m.length; v++)
        h.inspectOpts[m[v]] = n.inspectOpts[m[v]];
    }
    n.enable(l());
  }(Fn, Fn.exports)), Fn.exports;
}
typeof process < "u" && process.type === "renderer" ? dt.exports = mm() : dt.exports = fm();
var hm = dt.exports, mt = F, xm = xr.spawn, nr = hm("electron-squirrel-startup"), Ga = cr.app, qi = function(e, n) {
  var a = mt.resolve(mt.dirname(process.execPath), "..", "Update.exe");
  nr("Spawning `%s` with args `%s`", a, e), xm(a, e, {
    detached: !0
  }).on("close", n);
}, vm = function() {
  if (process.platform === "win32") {
    var e = process.argv[1];
    nr("processing squirrel command `%s`", e);
    var n = mt.basename(process.execPath);
    if (e === "--squirrel-install" || e === "--squirrel-updated")
      return qi(["--createShortcut=" + n], Ga.quit), !0;
    if (e === "--squirrel-uninstall")
      return qi(["--removeShortcut=" + n], Ga.quit), !0;
    if (e === "--squirrel-obsolete")
      return Ga.quit(), !0;
  }
  return !1;
}, bm = vm();
const gm = /* @__PURE__ */ Qn(bm);
var le = { exports: {} };
const ym = "16.5.0", wm = {
  version: ym
}, ft = Ce, Vt = F, Em = xt, km = Oe, _m = wm, ar = _m.version, Sm = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg;
function Am(e) {
  const n = {};
  let a = e.toString();
  a = a.replace(/\r\n?/mg, `
`);
  let t;
  for (; (t = Sm.exec(a)) != null; ) {
    const i = t[1];
    let s = t[2] || "";
    s = s.trim();
    const o = s[0];
    s = s.replace(/^(['"`])([\s\S]*)\1$/mg, "$2"), o === '"' && (s = s.replace(/\\n/g, `
`), s = s.replace(/\\r/g, "\r")), n[i] = s;
  }
  return n;
}
function Tm(e) {
  const n = ir(e), a = D.configDotenv({ path: n });
  if (!a.parsed) {
    const o = new Error(`MISSING_DATA: Cannot parse ${n} for an unknown reason`);
    throw o.code = "MISSING_DATA", o;
  }
  const t = tr(e).split(","), i = t.length;
  let s;
  for (let o = 0; o < i; o++)
    try {
      const r = t[o].trim(), c = jm(a, r);
      s = D.decrypt(c.ciphertext, c.key);
      break;
    } catch (r) {
      if (o + 1 >= i)
        throw r;
    }
  return D.parse(s);
}
function Rm(e) {
  console.log(`[dotenv@${ar}][WARN] ${e}`);
}
function nn(e) {
  console.log(`[dotenv@${ar}][DEBUG] ${e}`);
}
function tr(e) {
  return e && e.DOTENV_KEY && e.DOTENV_KEY.length > 0 ? e.DOTENV_KEY : process.env.DOTENV_KEY && process.env.DOTENV_KEY.length > 0 ? process.env.DOTENV_KEY : "";
}
function jm(e, n) {
  let a;
  try {
    a = new URL(n);
  } catch (r) {
    if (r.code === "ERR_INVALID_URL") {
      const c = new Error("INVALID_DOTENV_KEY: Wrong format. Must be in valid uri format like dotenv://:key_1234@dotenvx.com/vault/.env.vault?environment=development");
      throw c.code = "INVALID_DOTENV_KEY", c;
    }
    throw r;
  }
  const t = a.password;
  if (!t) {
    const r = new Error("INVALID_DOTENV_KEY: Missing key part");
    throw r.code = "INVALID_DOTENV_KEY", r;
  }
  const i = a.searchParams.get("environment");
  if (!i) {
    const r = new Error("INVALID_DOTENV_KEY: Missing environment part");
    throw r.code = "INVALID_DOTENV_KEY", r;
  }
  const s = `DOTENV_VAULT_${i.toUpperCase()}`, o = e.parsed[s];
  if (!o) {
    const r = new Error(`NOT_FOUND_DOTENV_ENVIRONMENT: Cannot locate environment ${s} in your .env.vault file.`);
    throw r.code = "NOT_FOUND_DOTENV_ENVIRONMENT", r;
  }
  return { ciphertext: o, key: t };
}
function ir(e) {
  let n = null;
  if (e && e.path && e.path.length > 0)
    if (Array.isArray(e.path))
      for (const a of e.path)
        ft.existsSync(a) && (n = a.endsWith(".vault") ? a : `${a}.vault`);
    else
      n = e.path.endsWith(".vault") ? e.path : `${e.path}.vault`;
  else
    n = Vt.resolve(process.cwd(), ".env.vault");
  return ft.existsSync(n) ? n : null;
}
function Mi(e) {
  return e[0] === "~" ? Vt.join(Em.homedir(), e.slice(1)) : e;
}
function Cm(e) {
  !!(e && e.debug) && nn("Loading env from encrypted .env.vault");
  const a = D._parseVault(e);
  let t = process.env;
  return e && e.processEnv != null && (t = e.processEnv), D.populate(t, a, e), { parsed: a };
}
function Om(e) {
  const n = Vt.resolve(process.cwd(), ".env");
  let a = "utf8";
  const t = !!(e && e.debug);
  e && e.encoding ? a = e.encoding : t && nn("No encoding is specified. UTF-8 is used by default");
  let i = [n];
  if (e && e.path)
    if (!Array.isArray(e.path))
      i = [Mi(e.path)];
    else {
      i = [];
      for (const c of e.path)
        i.push(Mi(c));
    }
  let s;
  const o = {};
  for (const c of i)
    try {
      const p = D.parse(ft.readFileSync(c, { encoding: a }));
      D.populate(o, p, e);
    } catch (p) {
      t && nn(`Failed to load ${c} ${p.message}`), s = p;
    }
  let r = process.env;
  return e && e.processEnv != null && (r = e.processEnv), D.populate(r, o, e), s ? { parsed: o, error: s } : { parsed: o };
}
function $m(e) {
  if (tr(e).length === 0)
    return D.configDotenv(e);
  const n = ir(e);
  return n ? D._configVault(e) : (Rm(`You set DOTENV_KEY but you are missing a .env.vault file at ${n}. Did you forget to build it?`), D.configDotenv(e));
}
function Pm(e, n) {
  const a = Buffer.from(n.slice(-64), "hex");
  let t = Buffer.from(e, "base64");
  const i = t.subarray(0, 12), s = t.subarray(-16);
  t = t.subarray(12, -16);
  try {
    const o = km.createDecipheriv("aes-256-gcm", a, i);
    return o.setAuthTag(s), `${o.update(t)}${o.final()}`;
  } catch (o) {
    const r = o instanceof RangeError, c = o.message === "Invalid key length", p = o.message === "Unsupported state or unable to authenticate data";
    if (r || c) {
      const l = new Error("INVALID_DOTENV_KEY: It must be 64 characters long (or more)");
      throw l.code = "INVALID_DOTENV_KEY", l;
    } else if (p) {
      const l = new Error("DECRYPTION_FAILED: Please check your DOTENV_KEY");
      throw l.code = "DECRYPTION_FAILED", l;
    } else
      throw o;
  }
}
function Fm(e, n, a = {}) {
  const t = !!(a && a.debug), i = !!(a && a.override);
  if (typeof n != "object") {
    const s = new Error("OBJECT_REQUIRED: Please check the processEnv argument being passed to populate");
    throw s.code = "OBJECT_REQUIRED", s;
  }
  for (const s of Object.keys(n))
    Object.prototype.hasOwnProperty.call(e, s) ? (i === !0 && (e[s] = n[s]), t && nn(i === !0 ? `"${s}" is already defined and WAS overwritten` : `"${s}" is already defined and was NOT overwritten`)) : e[s] = n[s];
}
const D = {
  configDotenv: Om,
  _configVault: Cm,
  _parseVault: Tm,
  config: $m,
  decrypt: Pm,
  parse: Am,
  populate: Fm
};
le.exports.configDotenv = D.configDotenv;
le.exports._configVault = D._configVault;
le.exports._parseVault = D._parseVault;
le.exports.config = D.config;
le.exports.decrypt = D.decrypt;
le.exports.parse = D.parse;
le.exports.populate = D.populate;
le.exports = D;
var Lm = le.exports;
const Nm = /* @__PURE__ */ Qn(Lm);
Nm.config();
const sr = fe.dirname(lr(import.meta.url));
process.env.APP_ROOT = fe.join(sr, "..");
const ht = process.env.VITE_DEV_SERVER_URL, kf = fe.join(process.env.APP_ROOT, "dist-electron"), or = fe.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = ht ? fe.join(process.env.APP_ROOT, "public") : or;
let V;
Ae.commandLine.appendSwitch("gtk-version", "3");
gm && Ae.quit();
function rr() {
  V = new Hi({
    icon: fe.join(process.env.VITE_PUBLIC, "icons/icon.png"),
    webPreferences: {
      preload: fe.join(sr, "preload.mjs"),
      nodeIntegration: !1,
      // nodeIntegrationInWorker: true,
      contextIsolation: !0,
      webSecurity: !1,
      spellcheck: !1
    }
  }), V.menuBarVisible = !1, V.webContents.on("did-finish-load", () => {
    V == null || V.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), ht ? V.loadURL(ht) : V.loadFile(fe.join(or, "index.html")), V.once("ready-to-show", () => {
    V == null || V.maximize();
  });
}
Ae.on("window-all-closed", () => {
  process.platform !== "darwin" && (Ae.quit(), V = null);
});
Ae.on("activate", () => {
  Hi.getAllWindows().length === 0 && rr();
});
Ae.whenReady().then(() => {
  rr(), um(V);
});
export {
  kf as MAIN_DIST,
  or as RENDERER_DIST,
  ht as VITE_DEV_SERVER_URL
};
