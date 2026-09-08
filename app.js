/* Kazma SC — application de statistiques.
   Tout est statique : les JSON sont produits par kazma-bdd/publie.py et poses
   dans data/. Aucune ecriture possible depuis le navigateur, par construction. */

var IDX = null, CACHE = {};
var L = 105, W = 68, TIERS = 70;

function $(s, r) { return (r || document).querySelector(s); }
function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;"); }
function pct(n, d) { return d ? Math.round(100 * n / d) + " %" : "—"; }
function dateFr(s) { var p = s.split("-"); return p[2] + "." + p[1] + "." + p[0]; }
function court(nom) { return String(nom).split(" ").slice(-1)[0]; }

/* ---------------------------------------------------------------- terrain */
function terrain(pts, opts) {
  opts = opts || {};
  var c = "var(--ligne)", f = 'fill="none" stroke="' + c + '" stroke-width=".4"';
  var s = '<rect x="-3" y="-3" width="' + (L + 6) + '" height="' + (W + 6) + '" fill="var(--pelouse)"/>';
  if (opts.tiers) {
    s += '<rect x="' + TIERS + '" y="0" width="' + (L - TIERS) + '" height="' + W
       + '" fill="' + opts.tiers + '" opacity=".1"/>';
  }
  s += '<rect x="0" y="0" width="' + L + '" height="' + W + '" ' + f + '/>'
     + '<line x1="' + L / 2 + '" y1="0" x2="' + L / 2 + '" y2="' + W + '" stroke="' + c + '" stroke-width=".4"/>'
     + '<circle cx="' + L / 2 + '" cy="' + W / 2 + '" r="9.15" ' + f + '/>'
     + '<rect x="0" y="13.84" width="16.5" height="40.32" ' + f + '/>'
     + '<rect x="' + (L - 16.5) + '" y="13.84" width="16.5" height="40.32" ' + f + '/>'
     + '<rect x="0" y="24.84" width="5.5" height="18.32" ' + f + '/>'
     + '<rect x="' + (L - 5.5) + '" y="24.84" width="5.5" height="18.32" ' + f + '/>';
  if (opts.lignes) {
    [35, 70].forEach(function (x) {
      s += '<line x1="' + x + '" y1="0" x2="' + x + '" y2="' + W + '" stroke="' + c
         + '" stroke-width=".4" stroke-dasharray="2 2"/>';
    });
  }
  return '<svg class="pitch" viewBox="-3 -3 ' + (L + 6) + ' ' + (W + 6) + '" role="img" aria-label="'
       + esc(opts.alt || "carte") + '">' + s + (pts || "") + '</svg>';
}

/* y est mesure depuis le bas ; SVG compte vers le bas, d'ou le W - y */
function point(x, y, r, coul, plein) {
  return '<circle cx="' + x + '" cy="' + (W - y) + '" r="' + r + '" '
       + (plein ? 'fill="' + coul + '" fill-opacity=".85"'
                : 'fill="none" stroke="' + coul + '" stroke-width=".7"') + '/>';
}

/* ---------------------------------------------------------------- barres comparees */
function comparaison(lignes, nomA, nomB) {
  return '<div class="cmp" style="border-bottom:1px solid var(--bord-clair);padding-bottom:8px">'
    + '<span></span><span class="v a" style="text-align:left">' + esc(nomA) + '</span>'
    + '<span class="l"></span><span class="v b">' + esc(nomB) + '</span><span></span></div>'
    + lignes.map(function (r) {
        var a = r[1], b = r[2], t = a + b || 1;
        return '<div class="cmp"><span class="v a">' + a + '</span>'
          + '<span class="bar"><i class="a" style="width:' + (100 * a / t).toFixed(1) + '%"></i></span>'
          + '<span class="l">' + r[0] + '</span>'
          + '<span class="bar"><i class="b" style="width:' + (100 * b / t).toFixed(1) + '%"></i></span>'
          + '<span class="v b">' + b + '</span></div>';
      }).join("");
}

/* ---------------------------------------------------------------- navigation */
function nav() {
  var h = location.hash || "#/";
  $("#nav-equipe").innerHTML =
    ['<a href="#/" class="' + (h === "#/" ? "on" : "") + '"><i class="p"></i>Vue d’ensemble</a>',
     '<a href="#/joueurs" class="' + (h === "#/joueurs" ? "on" : "") + '"><i class="p"></i>Tous les joueurs</a>'
    ].join("");
  $("#nav-matchs").innerHTML = IDX.matchs.slice().reverse().map(function (m) {
    var u = "#/match/" + m.match_id;
    return '<a href="' + u + '" class="' + (h === u ? "on" : "") + '"><i class="p"></i>'
      + esc(m.adversaire) + '</a>';
  }).join("");
  $("#nav-joueurs").innerHTML = IDX.joueurs.slice(0, 8).map(function (j) {
    var u = "#/joueur/" + j.numero;
    return '<a href="' + u + '" class="' + (h === u ? "on" : "") + '"><i class="p"></i>'
      + esc(court(j.nom)) + '</a>';
  }).join("");
  $("#pied").innerHTML = "Données du fournisseur, traitées localement.<br>"
    + IDX.matchs.length + " matchs · " + IDX.joueurs.length + " joueurs";
}

/* ---------------------------------------------------------------- vues */
function vueSaison() {
  var s = IDX.saison, n = IDX.matchs.length;
  var buts = IDX.matchs.reduce(function (a, m) {
    return [a[0] + (m.domicile ? m.score[0] : m.score[1]),
            a[1] + (m.domicile ? m.score[1] : m.score[0])];
  }, [0, 0]);
  var kpi = [["Matchs", n, ""], ["Buts marqués", buts[0], "a"], ["Buts encaissés", buts[1], ""],
             ["Passes", s.passes, ""], ["Réussite", pct(s.passes_ok, s.passes), ""],
             ["Progressives", s.prog, "f"], ["Tirs", s.tirs, ""],
             ["Dans le dernier tiers", s.t3_actions, ""]];
  var h = '<div class="entete"><div><h1>Vue d’ensemble</h1>'
    + '<div class="sous">Saison en cours · ' + n + ' matchs analysés</div></div>'
    + '<div class="maj"><i></i>Mis à jour le ' + dateFr(IDX.maj) + '</div></div>'
    + '<div class="kpi">' + kpi.map(function (k) {
        return '<div class="' + k[2] + '"><b>' + k[1] + '</b><span>' + k[0] + '</span></div>';
      }).join("") + '</div>';

  h += '<div class="carte"><h2>Les matchs</h2><div class="lg">Cliquez pour ouvrir le détail</div>'
    + '<div class="liste">' + IDX.matchs.slice().reverse().map(function (m) {
        var nous = m.domicile ? m.score[0] : m.score[1], eux = m.domicile ? m.score[1] : m.score[0];
        var cl = nous > eux ? "g" : (nous < eux ? "p" : "n");
        return '<a href="#/match/' + m.match_id + '">'
          + '<span class="d">' + dateFr(m.date) + '</span>'
          + '<span class="o">' + esc(m.adversaire)
          + '<span class="lieu">' + (m.domicile ? "dom" : "ext") + '</span></span>'
          + '<span class="sc ' + cl + '">' + nous + ' – ' + eux + '</span>'
          + '<span class="plus">' + m.resume.prog + ' prog · ' + m.resume.tirs + ' tirs</span></a>';
      }).join("") + '</div></div>';

  h += '<div class="carte"><h2>Les joueurs</h2>'
    + '<div class="lg">Cumul sur les ' + n + ' matchs · cliquez pour la fiche</div>'
    + tableauJoueurs(IDX.joueurs.map(function (j) {
        var t = j.total; t.numero = j.numero; t.nom = j.nom; return t;
      })) + '</div>';
  return h;
}

function tableauJoueurs(rows) {
  var cols = [["actions", "Act"], ["passes", "Passes"], ["passes_ok", "Réus."],
              ["prog", "Prog"], ["cles", "Clés"], ["t3", "Tiers"],
              ["dribbles", "Drib"], ["duels_ok", "Duels+"], ["recup", "Récup"],
              ["pertes", "Pertes"], ["tirs", "Tirs"], ["buts", "Buts"]];
  return '<div class="tw"><table><thead><tr><th class="g">N°</th><th class="g">Joueur</th>'
    + cols.map(function (c) { return "<th>" + c[1] + "</th>"; }).join("")
    + '<th>Réussite</th></tr></thead><tbody>'
    + rows.map(function (r) {
        return '<tr onclick="location.hash=\'#/joueur/' + r.numero + '\'">'
          + '<td class="g num">' + r.numero + '</td><td class="g nom">' + esc(r.nom) + '</td>'
          + cols.map(function (c) {
              return "<td>" + (r[c[0]] || 0) + "</td>";
            }).join("")
          + '<td>' + pct(r.passes_ok, r.passes) + '</td></tr>';
      }).join("") + '</tbody></table></div>';
}

function vueJoueurs() {
  return '<div class="entete"><div><h1>Tous les joueurs</h1>'
    + '<div class="sous">Cumul de la saison</div></div></div>'
    + '<div class="carte">' + tableauJoueurs(IDX.joueurs.map(function (j) {
        var t = j.total; t.numero = j.numero; t.nom = j.nom; return t;
      })) + '</div>';
}

function vueMatch(d) {
  var A = d.domicile, B = d.exterieur, sa = d.equipes[A], sb = d.equipes[B];
  var nous = A === IDX.equipe ? A : B, eux = nous === A ? B : A;
  var h = '<div class="entete"><div><h1>' + esc(A) + ' ' + d.score[0] + ' – ' + d.score[1]
    + ' ' + esc(B) + '</h1><div class="sous">' + dateFr(d.date)
    + ' · Dawri Zain</div></div></div>';

  var kpi = [["Passes", sb.passes], ["Réussite", pct(sb.passes_ok, sb.passes)],
             ["Progressives", sb.prog], ["Tirs", sb.tirs],
             ["Dernier tiers", sb.t3_actions], ["Réussite tiers", pct(sb.t3_ok, sb.t3_passes)]];
  h += '<div class="kpi">' + kpi.map(function (k, i) {
      return '<div class="' + (i === 2 ? "f" : "a") + '"><b>' + k[1] + '</b><span>'
        + esc(nous) + " — " + k[0] + '</span></div>';
    }).join("") + '</div>';

  h += '<div class="carte"><h2>Statistiques</h2><div class="lg">Les deux équipes</div>'
    + comparaison([["Buts", sa.buts, sb.buts], ["Tirs", sa.tirs, sb.tirs],
                   ["Passes", sa.passes, sb.passes],
                   ["Passes réussies", sa.passes_ok, sb.passes_ok],
                   ["Vers l’avant", sa.avant, sb.avant],
                   ["Progressives", sa.prog, sb.prog],
                   ["Passes clés", sa.passes_cles, sb.passes_cles],
                   ["Dribbles", sa.dribbles, sb.dribbles],
                   ["Duels gagnés", sa.duels_ok, sb.duels_ok],
                   ["Récupérations", sa.recup, sb.recup],
                   ["Pertes de balle", sa.pertes, sb.pertes],
                   ["Actions dernier tiers", sa.t3_actions, sb.t3_actions]], A, B)
    + '</div>';

  /* tirs */
  var tirs = function (e, coul) {
    var p = d.tirs.filter(function (t) { return t.equipe === e; }).map(function (t) {
      return t.but ? point(t.x, t.y, 2.2, "var(--vert)", 1) : point(t.x, t.y, 1.9, coul, 1);
    }).join("");
    var b = d.tirs.filter(function (t) { return t.equipe === e && t.but; }).length;
    return '<div class="carte"><h2>' + esc(e) + '</h2><div class="lg">'
      + d.tirs.filter(function (t) { return t.equipe === e; }).length + ' tirs · ' + b + ' buts</div>'
      + terrain(p, { lignes: 1, alt: "tirs de " + e }) + '</div>';
  };
  h += '<h2 style="margin:26px 0 12px">Tirs</h2><div class="duo">'
     + tirs(A, "var(--eux)") + tirs(B, "var(--nous)") + '</div>';

  /* progression */
  var prog = function (e, coul) {
    var p = (d.prog[e] || []).map(function (q) { return point(q[0], q[1], 1.5, coul, q[2]); }).join("");
    var n = (d.prog[e] || []).length, ok = (d.prog[e] || []).filter(function (q) { return q[2]; }).length;
    return '<div class="carte"><h2>' + esc(e) + '</h2><div class="lg">' + n
      + ' passes progressives · ' + ok + ' réussies</div>'
      + terrain(p, { lignes: 1, alt: "passes progressives de " + e }) + '</div>';
  };
  h += '<h2 style="margin:26px 0 12px">Passes progressives</h2>'
     + '<div class="note" style="margin-bottom:12px">Chaque point est le <b>départ</b> de la passe. '
     + 'Le fournisseur ne donne pas la destination du ballon, donc aucune flèche ne peut être tracée.</div>'
     + '<div class="duo">' + prog(A, "var(--eux)") + prog(B, "var(--nous)") + '</div>';

  /* reseau */
  h += '<h2 style="margin:26px 0 12px">Schéma de passes</h2>'
     + '<div class="duo">' + reseauSvg(d, d.reseau, 4, "Toutes les passes")
     + reseauSvg(d, d.reseau_prog, 2, "Passes progressives seulement") + '</div>';

  /* dernier tiers */
  var t3 = function (e, coul) {
    var p = (d.tiers[e] || []).map(function (q) {
      return point(q[0], q[1], 1.4, q[2] ? coul : "var(--rouge)", 1);
    }).join("");
    var s = d.equipes[e];
    return '<div class="carte"><h2>' + esc(e) + '</h2><div class="lg">' + s.t3_actions
      + ' actions · passes réussies à ' + pct(s.t3_ok, s.t3_passes) + '</div>'
      + terrain(p, { lignes: 1, tiers: coul, alt: "dernier tiers de " + e })
      + '<div class="leg"><span><i style="background:' + coul + '"></i>réussie</span>'
      + '<span><i style="background:var(--rouge)"></i>ratée</span></div></div>';
  };
  h += '<h2 style="margin:26px 0 12px">Le dernier tiers</h2><div class="duo">'
     + t3(A, "var(--eux)") + t3(B, "var(--nous)") + '</div>';

  h += '<div class="carte" style="margin-top:18px"><h2>Joueurs</h2>'
     + '<div class="lg">' + esc(IDX.equipe) + ' · cliquez pour la fiche</div>'
     + tableauJoueurs(d.joueurs) + '</div>';

  var cv = Object.keys(d.couverture).map(function (k) { return d.couverture[k]; });
  h += '<div class="carte"><h2>Méthode</h2><div class="note">'
     + '<b>Passes progressives</b> : classification du fournisseur. Les catégories sont emboîtées '
     + '— progressives ⊂ vers l’avant ⊂ passes — elles ne s’additionnent pas.<br>'
     + '<b>Schéma de passes</b> : le destinataire n’est pas fourni, il est reconstruit comme le '
     + 'joueur suivant à toucher le ballon dans la même possession. Couverture de '
     + Math.min.apply(null, cv) + ' à ' + Math.max.apply(null, cv) + ' % selon les joueurs.<br>'
     + '<b>Détail par joueur</b> : le fournisseur ne le livre que pour ' + esc(IDX.equipe) + '.'
     + '</div></div>';
  return h;
}

function reseauSvg(d, liens, seuil, titre) {
  var pos = {};
  d.joueurs.forEach(function (j) {
    if (j.x_med != null && j.actions >= 20) pos[j.numero] = j;
  });
  var paires = {};
  liens.forEach(function (l) {
    if (pos[l[0]] && pos[l[1]]) {
      var k = [l[0], l[1]].sort(function (a, b) { return a - b; }).join("-");
      paires[k] = (paires[k] || 0) + l[2];
    }
  });
  var vmax = Math.max.apply(null, Object.keys(paires).map(function (k) { return paires[k]; }).concat([1]));
  var s = "";
  Object.keys(paires).forEach(function (k) {
    var n = paires[k];
    if (n < seuil) return;
    var p = k.split("-"), a = pos[p[0]], b = pos[p[1]];
    s += '<line x1="' + a.x_med + '" y1="' + (W - a.y_med) + '" x2="' + b.x_med
       + '" y2="' + (W - b.y_med) + '" stroke="var(--nous)" stroke-width="' + (0.3 + 2.2 * n / vmax)
       + '" stroke-opacity="' + (0.2 + 0.6 * n / vmax).toFixed(2) + '"/>';
  });
  var noms = "";
  Object.keys(pos).forEach(function (k) {
    var j = pos[k];
    s += '<circle cx="' + j.x_med + '" cy="' + (W - j.y_med) + '" r="'
       + (2.2 + 2.6 * Math.sqrt(j.actions / 160)) + '" fill="var(--nous)" stroke="var(--fond)" stroke-width=".5"/>';
    noms += '<text x="' + j.x_med + '" y="' + (W - j.y_med + 1) + '" text-anchor="middle" '
         + 'font-size="2.7" font-weight="700" fill="#fff">' + j.numero + '</text>'
         + '<text x="' + j.x_med + '" y="' + (W - j.y_med + 7.2) + '" text-anchor="middle" '
         + 'font-size="2.9" font-weight="700" fill="var(--texte)">' + esc(court(j.nom)) + '</text>';
  });
  return '<div class="carte"><h2>' + titre + '</h2>'
    + '<div class="lg">Destinataire reconstruit · liens d’au moins ' + seuil + ' passes</div>'
    + terrain(s + noms, { alt: titre }) + '</div>';
}

function vueJoueur(num) {
  var j = IDX.joueurs.filter(function (x) { return x.numero === num; })[0];
  if (!j) return '<div class="vide"><b>Joueur inconnu</b></div>';
  var t = j.total;
  var h = '<div class="entete"><div><h1>' + esc(j.nom) + '</h1>'
    + '<div class="sous"><span class="puce">N° ' + j.numero + '</span> · '
    + j.matchs.length + ' matchs · ' + esc(IDX.equipe) + '</div></div></div>';

  var kpi = [["Actions", t.actions, ""], ["Passes", t.passes, ""],
             ["Réussite", pct(t.passes_ok, t.passes), ""],
             ["Progressives", t.prog, "f"], ["Part progressive", pct(t.prog, t.passes), "f"],
             ["Passes clés", t.cles, ""], ["Dans le dernier tiers", t.t3, ""],
             ["Tirs", t.tirs, ""], ["Buts", t.buts, "a"]];
  h += '<div class="kpi">' + kpi.map(function (k) {
      return '<div class="' + k[2] + '"><b>' + k[1] + '</b><span>' + k[0] + '</span></div>';
    }).join("") + '</div>';

  var pts = j.matchs.filter(function (m) { return m.x_med != null; }).map(function (m) {
    return point(m.x_med, m.y_med, 2, "var(--nous)", 1);
  }).join("");
  h += '<div class="duo"><div class="carte"><h2>Position</h2>'
    + '<div class="lg">Position médiane de ses actions, un point par match</div>'
    + terrain(pts, { lignes: 1, alt: "positions de " + j.nom }) + '</div>'
    + '<div class="carte"><h2>Match par match</h2><div class="lg">Cliquez pour ouvrir le match</div>'
    + '<div class="tw"><table><thead><tr><th class="g">Date</th><th class="g">Adversaire</th>'
    + '<th>Act</th><th>Passes</th><th>Réus.</th><th>Prog</th><th>Tiers</th><th>Tirs</th>'
    + '</tr></thead><tbody>'
    + j.matchs.map(function (m) {
        return '<tr onclick="location.hash=\'#/match/' + m.match_id + '\'">'
          + '<td class="g num">' + dateFr(m.date) + '</td>'
          + '<td class="g nom">' + esc(m.adversaire) + '</td>'
          + '<td>' + m.actions + '</td><td>' + m.passes + '</td><td>' + m.passes_ok + '</td>'
          + '<td>' + m.prog + '</td><td>' + m.t3 + '</td><td>' + m.tirs + '</td></tr>';
      }).join("") + '</tbody></table></div></div></div>';
  return h;
}

/* ---------------------------------------------------------------- routage */
function charge(url) {
  if (CACHE[url]) return Promise.resolve(CACHE[url]);
  return fetch(url).then(function (r) {
    if (!r.ok) throw new Error(url);
    return r.json();
  }).then(function (d) { CACHE[url] = d; return d; });
}

function rendre() {
  var v = $("#vue"), h = location.hash || "#/";
  nav();
  var m = h.match(/^#\/match\/(.+)$/);
  if (m) {
    v.innerHTML = '<div class="vide"><b>Chargement du match…</b></div>';
    return charge("data/match_" + m[1] + ".json").then(function (d) {
      v.innerHTML = vueMatch(d); window.scrollTo(0, 0);
    }).catch(function () {
      v.innerHTML = '<div class="vide"><b>Match introuvable</b>Le fichier n’a pas encore été publié.</div>';
    });
  }
  var p = h.match(/^#\/joueur\/(\d+)$/);
  if (p) { v.innerHTML = vueJoueur(parseInt(p[1], 10)); window.scrollTo(0, 0); return; }
  if (h === "#/joueurs") { v.innerHTML = vueJoueurs(); window.scrollTo(0, 0); return; }
  v.innerHTML = vueSaison(); window.scrollTo(0, 0);
}

window.addEventListener("hashchange", rendre);
charge("data/index.json").then(function (d) {
  IDX = d;
  rendre();
}).catch(function () {
  $("#vue").innerHTML = '<div class="vide"><b>Aucune donnée</b>'
    + 'Lancez <code>python publie.py</code> depuis kazma-bdd pour générer les fichiers.</div>';
});
