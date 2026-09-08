/* Kazma SC — application de statistiques.
   Statique : les JSON viennent de kazma-bdd/publie.py. Le navigateur ne peut
   rien ecrire, par construction.

   Trois langues, dont l'arabe en ecriture droite-a-gauche.
   Code couleur unique dans toute l'app : vert = reussi, rouge = rate, gris = neutre.
   Il est porte par la donnee (champ `issue` du dictionnaire), jamais devine ici. */

var IDX = null, CACHE = {}, LANG = localStorage.getItem("kz-lang") || "fr";
var L = 105, W = 68, TIERS = 70;

var T = {
  titre:      { fr: "Statistiques",        en: "Statistics",        ar: "الإحصائيات" },
  equipe:     { fr: "Équipe",              en: "Team",              ar: "الفريق" },
  matchs:     { fr: "Matchs",              en: "Matches",           ar: "المباريات" },
  joueurs:    { fr: "Joueurs",             en: "Players",           ar: "اللاعبون" },
  ensemble:   { fr: "Vue d’ensemble",      en: "Overview",          ar: "نظرة عامة" },
  tousJ:      { fr: "Tous les joueurs",    en: "All players",       ar: "كل اللاعبين" },
  saison:     { fr: "Saison en cours",     en: "Current season",    ar: "الموسم الحالي" },
  analyses:   { fr: "matchs analysés",     en: "matches analysed",  ar: "مباريات محللة" },
  maj:        { fr: "Mis à jour le",       en: "Updated",           ar: "آخر تحديث" },
  butsP:      { fr: "Buts marqués",        en: "Goals scored",      ar: "الأهداف المسجلة" },
  butsC:      { fr: "Buts encaissés",      en: "Goals conceded",    ar: "الأهداف المستقبلة" },
  passes:     { fr: "Passes",              en: "Passes",            ar: "التمريرات" },
  reussite:   { fr: "Réussite",            en: "Completion",        ar: "نسبة النجاح" },
  prog:       { fr: "Progressives",        en: "Progressive",       ar: "التقدمية" },
  tirs:       { fr: "Tirs",                en: "Attempts",          ar: "التسديدات" },
  tiers:      { fr: "Dans le dernier tiers", en: "In the final third", ar: "في الثلث الأخير" },
  lesMatchs:  { fr: "Les matchs",          en: "Matches",           ar: "المباريات" },
  cliquer:    { fr: "Cliquez pour ouvrir le détail", en: "Click to open", ar: "اضغط للتفصيل" },
  lesJoueurs: { fr: "Les joueurs",         en: "Players",           ar: "اللاعبون" },
  cumul:      { fr: "Cumul de la saison",  en: "Season totals",     ar: "مجموع الموسم" },
  stats:      { fr: "Toutes les statistiques", en: "All statistics", ar: "كل الإحصائيات" },
  toutXml:    { fr: "Tout ce que le fournisseur livre", en: "Everything the provider supplies", ar: "كل ما يوفره مزوّد البيانات" },
  deuxEq:     { fr: "Les deux équipes",    en: "Both teams",        ar: "الفريقان" },
  tirsT:      { fr: "Tirs",                en: "Attempts at goal",  ar: "التسديدات" },
  progT:      { fr: "Passes progressives", en: "Progressive passing", ar: "التمريرات التقدمية" },
  progN:      { fr: "Chaque point est le départ de la passe. Le fournisseur ne donne pas la destination du ballon, donc aucune flèche ne peut être tracée.",
               en: "Each dot is where the pass started. The provider does not supply the ball's destination, so no arrows can be drawn.",
               ar: "كل نقطة هي مكان انطلاق التمريرة. مزوّد البيانات لا يوفر وجهة الكرة، لذلك لا يمكن رسم الأسهم." },
  schema:     { fr: "Schéma de passes",    en: "Passing structure",  ar: "شبكة التمريرات" },
  toutes:     { fr: "Toutes les passes",   en: "All passes",         ar: "كل التمريرات" },
  progSeul:   { fr: "Passes progressives seulement", en: "Progressive passes only", ar: "التمريرات التقدمية فقط" },
  liens:      { fr: "Destinataire reconstruit · liens d’au moins", en: "Receiver reconstructed · links of at least", ar: "المستلم مُستنتج · روابط لا تقل عن" },
  passesM:    { fr: "passes",              en: "passes",             ar: "تمريرة" },
  tiersT:     { fr: "Le dernier tiers",    en: "The final third",    ar: "الثلث الأخير" },
  actions:    { fr: "actions",             en: "actions",            ar: "لمسة" },
  passesR:    { fr: "passes réussies à",   en: "pass completion",    ar: "نجاح التمرير" },
  reussie:    { fr: "réussie",             en: "completed",          ar: "ناجحة" },
  ratee:      { fr: "ratée",               en: "lost",               ar: "خاطئة" },
  but:        { fr: "but",                 en: "goal",               ar: "هدف" },
  methode:    { fr: "Méthode",             en: "Method",             ar: "المنهجية" },
  position:   { fr: "Position",            en: "Position",           ar: "المركز" },
  positionN:  { fr: "Position médiane de ses actions, un point par match",
               en: "Median position of his actions, one dot per match",
               ar: "الموقع الوسيط لتحركاته، نقطة لكل مباراة" },
  parMatch:   { fr: "Match par match",     en: "Match by match",     ar: "مباراة بمباراة" },
  ouvrirM:    { fr: "Cliquez pour ouvrir le match", en: "Click to open the match", ar: "اضغط لفتح المباراة" },
  date:       { fr: "Date",                en: "Date",               ar: "التاريخ" },
  adv:        { fr: "Adversaire",          en: "Opponent",           ar: "الخصم" },
  joueur:     { fr: "Joueur",              en: "Player",             ar: "اللاعب" },
  dom:        { fr: "dom",                 en: "home",               ar: "أرضه" },
  ext:        { fr: "ext",                 en: "away",               ar: "خارجه" },
  chargement: { fr: "Chargement…",         en: "Loading…",           ar: "جارٍ التحميل…" },
  introuvable:{ fr: "Match introuvable",   en: "Match not found",    ar: "المباراة غير موجودة" },
  aucune:     { fr: "Aucune donnée",       en: "No data",            ar: "لا توجد بيانات" },
  source:     { fr: "Données du fournisseur, traitées localement.",
                en: "Provider data, processed locally.",
                ar: "بيانات المزوّد، معالجة محليًا." }
};

function t(k) { var e = T[k]; return e ? (e[LANG] || e.fr) : k; }
function lib(tag) {
  var d = IDX.libelles.tags[tag];
  return d ? (d[LANG] || d.fr) : tag;
}
function issueDe(tag) {
  var d = IDX.libelles.tags[tag];
  return d ? d.issue : null;
}
function famDe(tag) {
  var d = IDX.libelles.tags[tag];
  return d ? d.fam : "autres";
}
function famNom(cle) {
  var f = IDX.libelles.familles.filter(function (x) { return x.cle === cle; })[0];
  return f ? (f[LANG] || f.fr) : cle;
}

function $(s, r) { return (r || document).querySelector(s); }
function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;"); }
function pct(n, d) { return d ? Math.round(100 * n / d) + " %" : "—"; }
function dateFr(s) { var p = s.split("-"); return p[2] + "." + p[1] + "." + p[0]; }
function court(nom) { return String(nom).split(" ").slice(-1)[0]; }
function cls(tag) { var i = issueDe(tag); return i === 1 ? "ok" : (i === 0 ? "ko" : ""); }

/* ---------------------------------------------------------------- terrain */
function terrain(pts, o) {
  o = o || {};
  var c = "var(--ligne)", f = 'fill="none" stroke="' + c + '" stroke-width=".4"', s = "";
  s += '<rect x="-3" y="-3" width="' + (L + 6) + '" height="' + (W + 6) + '" fill="var(--pelouse)"/>';
  if (o.tiers) s += '<rect x="' + TIERS + '" y="0" width="' + (L - TIERS) + '" height="' + W
                  + '" fill="' + o.tiers + '" opacity=".09"/>';
  s += '<rect x="0" y="0" width="' + L + '" height="' + W + '" ' + f + '/>'
     + '<line x1="' + L / 2 + '" y1="0" x2="' + L / 2 + '" y2="' + W + '" stroke="' + c + '" stroke-width=".4"/>'
     + '<circle cx="' + L / 2 + '" cy="' + W / 2 + '" r="9.15" ' + f + '/>'
     + '<rect x="0" y="13.84" width="16.5" height="40.32" ' + f + '/>'
     + '<rect x="' + (L - 16.5) + '" y="13.84" width="16.5" height="40.32" ' + f + '/>'
     + '<rect x="0" y="24.84" width="5.5" height="18.32" ' + f + '/>'
     + '<rect x="' + (L - 5.5) + '" y="24.84" width="5.5" height="18.32" ' + f + '/>';
  if (o.lignes) [35, 70].forEach(function (x) {
    s += '<line x1="' + x + '" y1="0" x2="' + x + '" y2="' + W + '" stroke="' + c
       + '" stroke-width=".4" stroke-dasharray="2 2"/>';
  });
  return '<svg class="pitch" viewBox="-3 -3 ' + (L + 6) + ' ' + (W + 6)
       + '" role="img" aria-label="' + esc(o.alt || "") + '">' + s + (pts || "") + '</svg>';
}
/* y est mesure depuis le bas, SVG compte vers le bas : d'ou le W - y */
function point(x, y, r, coul, plein) {
  return '<circle cx="' + x + '" cy="' + (W - y) + '" r="' + r + '" '
       + (plein ? 'fill="' + coul + '" fill-opacity=".9"'
                : 'fill="none" stroke="' + coul + '" stroke-width=".8"') + '/>';
}

/* ---------------------------------------------------------------- statistiques completes */
function parFamille(tags) {
  var g = {};
  Object.keys(tags).forEach(function (k) {
    (g[famDe(k)] = g[famDe(k)] || []).push(k);
  });
  return IDX.libelles.familles.map(function (f) { return [f.cle, g[f.cle] || []]; })
         .filter(function (x) { return x[1].length; });
}

/* comparaison des deux equipes, toutes etiquettes */
function statsCompletes(tagsA, tagsB, nomA, nomB) {
  var tous = {};
  [tagsA, tagsB].forEach(function (o) { Object.keys(o).forEach(function (k) { tous[k] = 1; }); });
  return parFamille(tous).map(function (f) {
    var lignes = f[1].sort(function (a, b) {
      return (tagsB[b] || 0) + (tagsA[b] || 0) - (tagsB[a] || 0) - (tagsA[a] || 0);
    }).map(function (k) {
      var a = tagsA[k] || 0, b = tagsB[k] || 0, s = a + b || 1;
      return '<div class="cmp ' + cls(k) + '"><span class="v a">' + a + '</span>'
        + '<span class="bar"><i class="a" style="width:' + (100 * a / s).toFixed(1) + '%"></i></span>'
        + '<span class="l">' + esc(lib(k)) + '</span>'
        + '<span class="bar"><i class="b" style="width:' + (100 * b / s).toFixed(1) + '%"></i></span>'
        + '<span class="v b">' + b + '</span></div>';
    }).join("");
    return '<div class="carte"><h2>' + esc(famNom(f[0])) + '</h2>'
      + '<div class="cmp tete"><span></span><span class="v a nomEq">' + esc(nomA) + '</span>'
      + '<span class="l"></span><span class="v b nomEq">' + esc(nomB) + '</span><span></span></div>'
      + lignes + '</div>';
  }).join("");
}

/* liste simple, pour une fiche joueur */
function statsListe(tags) {
  return parFamille(tags).map(function (f) {
    return '<div class="carte"><h2>' + esc(famNom(f[0])) + '</h2><div class="lst">'
      + f[1].sort(function (a, b) { return tags[b] - tags[a]; }).map(function (k) {
          return '<div class="' + cls(k) + '"><b>' + tags[k] + '</b><span>' + esc(lib(k)) + '</span></div>';
        }).join("") + '</div></div>';
  }).join("");
}

/* ---------------------------------------------------------------- photo */
function photo(j, taille) {
  var ini = court(j.nom).slice(0, 2).toUpperCase();
  return '<span class="ph" style="width:' + taille + 'px;height:' + taille + 'px">'
    + '<img src="photos/' + j.numero + '.jpg" alt="" loading="lazy" '
    + 'onerror="this.remove()"><i>' + esc(ini) + '</i></span>';
}

/* ---------------------------------------------------------------- navigation */
function nav() {
  var h = location.hash || "#/";
  document.documentElement.lang = LANG;
  document.documentElement.dir = LANG === "ar" ? "rtl" : "ltr";
  $("#t-equipe").textContent = t("equipe");
  $("#t-matchs").textContent = t("matchs");
  $("#t-joueurs").textContent = t("joueurs");
  $("#t-titre").textContent = t("titre");
  $("#nav-equipe").innerHTML =
    '<a href="#/" class="' + (h === "#/" ? "on" : "") + '"><i class="p"></i>' + t("ensemble") + '</a>'
    + '<a href="#/joueurs" class="' + (h === "#/joueurs" ? "on" : "") + '"><i class="p"></i>' + t("tousJ") + '</a>';
  $("#nav-matchs").innerHTML = IDX.matchs.slice().reverse().map(function (m) {
    var u = "#/match/" + m.match_id;
    return '<a href="' + u + '" class="' + (h === u ? "on" : "") + '"><i class="p"></i>'
      + esc(m.adversaire) + '</a>';
  }).join("");
  $("#nav-joueurs").innerHTML = IDX.joueurs.slice(0, 10).map(function (j) {
    var u = "#/joueur/" + j.numero;
    return '<a href="' + u + '" class="' + (h === u ? "on" : "") + '"><i class="p"></i>'
      + esc(court(j.nom)) + '</a>';
  }).join("");
  $("#pied").innerHTML = t("source") + "<br>" + IDX.matchs.length + " " + t("matchs").toLowerCase()
    + " · " + IDX.joueurs.length + " " + t("joueurs").toLowerCase();
  Array.prototype.forEach.call(document.querySelectorAll(".lang b"), function (b) {
    b.classList.toggle("on", b.dataset.l === LANG);
  });
}

/* ---------------------------------------------------------------- vues */
function kpis(arr) {
  return '<div class="kpi">' + arr.map(function (k) {
    return '<div class="' + (k[2] || "") + '"><b>' + k[1] + '</b><span>' + esc(k[0]) + '</span></div>';
  }).join("") + '</div>';
}

function vueSaison() {
  var s = IDX.saison, n = IDX.matchs.length;
  var b = IDX.matchs.reduce(function (a, m) {
    return [a[0] + (m.domicile ? m.score[0] : m.score[1]),
            a[1] + (m.domicile ? m.score[1] : m.score[0])];
  }, [0, 0]);
  var h = '<div class="entete"><div><h1>' + t("ensemble") + '</h1><div class="sous">'
    + t("saison") + ' · ' + n + ' ' + t("analyses") + '</div></div>'
    + '<div class="maj"><i></i>' + t("maj") + ' ' + dateFr(IDX.maj) + '</div></div>'
    + kpis([[t("matchs"), n], [t("butsP"), b[0], "ok"], [t("butsC"), b[1], "ko"],
            [t("passes"), s.passes], [t("reussite"), pct(s.passes_ok, s.passes)],
            [t("prog"), s.prog, "f"], [t("tirs"), s.tirs], [t("tiers"), s.t3_actions]]);

  h += '<div class="carte"><h2>' + t("lesMatchs") + '</h2><div class="lg">' + t("cliquer") + '</div>'
    + '<div class="liste">' + IDX.matchs.slice().reverse().map(function (m) {
        var nous = m.domicile ? m.score[0] : m.score[1], eux = m.domicile ? m.score[1] : m.score[0];
        return '<a href="#/match/' + m.match_id + '">'
          + '<span class="d">' + dateFr(m.date) + '</span>'
          + '<span class="o">' + esc(m.adversaire) + '<span class="lieu">'
          + (m.domicile ? t("dom") : t("ext")) + '</span></span>'
          + '<span class="sc ' + (nous > eux ? "g" : nous < eux ? "p" : "n") + '">'
          + nous + ' – ' + eux + '</span>'
          + '<span class="plus">' + m.resume.prog + ' ' + t("prog").toLowerCase()
          + ' · ' + m.resume.tirs + ' ' + t("tirs").toLowerCase() + '</span></a>';
      }).join("") + '</div></div>';

  h += '<div class="carte"><h2>' + t("lesJoueurs") + '</h2><div class="lg">' + t("cumul") + '</div>'
    + tableauJoueurs(IDX.joueurs) + '</div>';
  return h;
}

function tableauJoueurs(joueurs) {
  var cols = [["actions", "Act"], ["passes", "Pass"], ["passes_ok", "✓"], ["prog", "Prog"],
              ["cles", "Clés"], ["t3", "Tiers"], ["dribbles", "Drib"], ["duels_ok", "Duels"],
              ["recup", "Récup"], ["pertes", "Pertes"], ["tirs", "Tirs"], ["buts", "Buts"]];
  return '<div class="tw"><table><thead><tr><th class="g"></th><th class="g">' + t("joueur") + '</th>'
    + cols.map(function (c) { return "<th>" + c[1] + "</th>"; }).join("")
    + '<th>' + t("reussite") + '</th></tr></thead><tbody>'
    + joueurs.map(function (j) {
        var r = j.total || j;
        return '<tr onclick="location.hash=\'#/joueur/' + j.numero + '\'">'
          + '<td class="g jn">' + photo(j, 26) + '<span class="nu">' + j.numero + '</span></td>'
          + '<td class="g nom">' + esc(j.nom) + '</td>'
          + cols.map(function (c) { return "<td>" + (r[c[0]] || 0) + "</td>"; }).join("")
          + '<td>' + pct(r.passes_ok, r.passes) + '</td></tr>';
      }).join("") + '</tbody></table></div>';
}

function vueJoueurs() {
  return '<div class="entete"><div><h1>' + t("tousJ") + '</h1><div class="sous">'
    + t("cumul") + '</div></div></div>'
    + '<div class="carte">' + tableauJoueurs(IDX.joueurs) + '</div>';
}

function vueMatch(d) {
  var A = d.domicile, B = d.exterieur, sb = d.equipes[B], sa = d.equipes[A];
  var nous = A === IDX.equipe ? A : B;
  var sn = d.equipes[nous];
  var h = '<div class="entete"><div><h1>' + esc(A) + ' <span class="sc2">' + d.score[0]
    + ' – ' + d.score[1] + '</span> ' + esc(B) + '</h1>'
    + '<div class="sous">' + dateFr(d.date) + ' · Dawri Zain</div></div></div>'
    + kpis([[esc(nous) + " — " + t("passes"), sn.passes],
            [t("reussite"), pct(sn.passes_ok, sn.passes)],
            [t("prog"), sn.prog, "f"], [t("tirs"), sn.tirs],
            [t("tiers"), sn.t3_actions],
            [t("reussite") + " " + t("tiers").toLowerCase(), pct(sn.t3_ok, sn.t3_passes)]]);

  h += '<h2 class="sec">' + t("stats") + '</h2><div class="lg sec-lg">' + t("toutXml") + '</div>'
     + statsCompletes(d.tags[A] || {}, d.tags[B] || {}, A, B);

  var mk = function (titre, faire) {
    return '<h2 class="sec">' + titre + '</h2><div class="duo">'
      + faire(A, "var(--eux)") + faire(B, "var(--nous)") + '</div>';
  };

  h += mk(t("tirsT"), function (e, coul) {
    var ts = d.tirs.filter(function (x) { return x.equipe === e; });
    var p = ts.map(function (x) {
      return x.but ? point(x.x, x.y, 2.4, "var(--vert)", 1) : point(x.x, x.y, 2, coul, 1);
    }).join("");
    return '<div class="carte"><h2>' + esc(e) + '</h2><div class="lg">' + ts.length + ' '
      + t("tirs").toLowerCase() + ' · ' + ts.filter(function (x) { return x.but; }).length
      + ' ' + t("but") + '</div>' + terrain(p, { lignes: 1, alt: e }) + '</div>';
  });

  h += '<h2 class="sec">' + t("progT") + '</h2><div class="note sec-lg">' + t("progN") + '</div>'
     + '<div class="duo">' + [A, B].map(function (e) {
        var coul = e === A ? "var(--eux)" : "var(--nous)";
        var q = d.prog[e] || [];
        return '<div class="carte"><h2>' + esc(e) + '</h2><div class="lg">' + q.length + ' '
          + t("prog").toLowerCase() + ' · ' + q.filter(function (x) { return x[2]; }).length
          + ' ' + t("reussie") + '</div>'
          + terrain(q.map(function (x) {
              return point(x[0], x[1], 1.7, x[2] ? coul : "var(--rouge)", 1);
            }).join(""), { lignes: 1, alt: e })
          + legende([[coul, t("reussie")], ["var(--rouge)", t("ratee")]]) + '</div>';
      }).join("") + '</div>';

  /* les reseaux prennent toute la largeur : sinon les noms sont illisibles */
  h += '<h2 class="sec">' + t("schema") + '</h2>'
     + reseauSvg(d, d.reseau, 4, t("toutes"))
     + reseauSvg(d, d.reseau_prog, 2, t("progSeul"));

  h += mk(t("tiersT"), function (e, coul) {
    var s = d.equipes[e], q = d.tiers[e] || [];
    return '<div class="carte"><h2>' + esc(e) + '</h2><div class="lg">' + s.t3_actions + ' '
      + t("actions") + ' · ' + t("passesR") + ' ' + pct(s.t3_ok, s.t3_passes) + '</div>'
      + terrain(q.map(function (x) {
          return point(x[0], x[1], 1.6, x[2] ? "var(--vert)" : "var(--rouge)", 1);
        }).join(""), { lignes: 1, tiers: coul, alt: e })
      + legende([["var(--vert)", t("reussie")], ["var(--rouge)", t("ratee")]]) + '</div>';
  });

  h += '<div class="carte"><h2>' + t("joueurs") + '</h2><div class="lg">' + esc(IDX.equipe)
     + '</div>' + tableauJoueurs(d.joueurs) + '</div>';

  var cv = Object.keys(d.couverture).map(function (k) { return d.couverture[k]; });
  h += '<div class="carte"><h2>' + t("methode") + '</h2><div class="note">'
     + { fr: "Le destinataire d’une passe n’est pas fourni : il est reconstruit comme le joueur suivant à toucher le ballon dans la même possession. Couverture de "
           + Math.min.apply(null, cv) + " à " + Math.max.apply(null, cv)
           + " % selon les joueurs. Les catégories de passes sont emboîtées et ne s’additionnent pas. Le détail par joueur ne couvre que Kazma.",
         en: "The receiver of a pass is not supplied: it is reconstructed as the next player to touch the ball in the same possession. Coverage runs from "
           + Math.min.apply(null, cv) + " to " + Math.max.apply(null, cv)
           + " % across players. Pass categories are nested and must not be added together. Player-level detail covers Kazma only.",
         ar: "مزوّد البيانات لا يوفر مستلم التمريرة: يُستنتج بأنه اللاعب التالي الذي يلمس الكرة في الاستحواذ نفسه. التغطية من "
           + Math.min.apply(null, cv) + " إلى " + Math.max.apply(null, cv)
           + " ٪ حسب اللاعب. فئات التمرير متداخلة ولا تُجمع. التفاصيل الفردية لفريق كاظمة فقط." }[LANG]
     + '</div></div>';
  return h;
}

function legende(items) {
  return '<div class="leg">' + items.map(function (i) {
    return '<span><i style="background:' + i[0] + '"></i>' + esc(i[1]) + '</span>';
  }).join("") + '</div>';
}

function reseauSvg(d, liens, seuil, titre) {
  var pos = {};
  d.joueurs.forEach(function (j) { if (j.x_med != null && j.actions >= 20) pos[j.numero] = j; });
  var paires = {};
  liens.forEach(function (l) {
    if (pos[l[0]] && pos[l[1]]) {
      var k = [l[0], l[1]].sort(function (a, b) { return a - b; }).join("-");
      paires[k] = (paires[k] || 0) + l[2];
    }
  });
  var vals = Object.keys(paires).map(function (k) { return paires[k]; });
  var vmax = Math.max.apply(null, vals.concat([1])), s = "";
  Object.keys(paires).forEach(function (k) {
    var n = paires[k];
    if (n < seuil) return;
    var p = k.split("-"), a = pos[p[0]], b = pos[p[1]];
    s += '<line x1="' + a.x_med + '" y1="' + (W - a.y_med) + '" x2="' + b.x_med + '" y2="'
       + (W - b.y_med) + '" stroke="var(--nous)" stroke-width="' + (0.3 + 2.4 * n / vmax).toFixed(2)
       + '" stroke-opacity="' + (0.2 + 0.6 * n / vmax).toFixed(2) + '"/>';
  });
  /* les noms se placent sous le disque, ou au-dessus si un voisin occupe deja la place */
  var poses = [], noms = "";
  Object.keys(pos).map(function (k) { return pos[k]; })
    .sort(function (a, b) { return a.y_med - b.y_med; })
    .forEach(function (j) {
      s += '<circle cx="' + j.x_med + '" cy="' + (W - j.y_med) + '" r="'
         + (2.6 + 2.8 * Math.sqrt(j.actions / 160)).toFixed(2)
         + '" fill="var(--nous)" stroke="var(--fond)" stroke-width=".6"/>';
      var y = W - j.y_med + 6.4, haut = false;
      for (var i = 0; i < poses.length; i++)
        if (Math.abs(poses[i][0] - j.x_med) < 13 && Math.abs(poses[i][1] - y) < 5) haut = true;
      if (haut) y = W - j.y_med - 4.6;
      poses.push([j.x_med, y]);
      noms += '<text x="' + j.x_med + '" y="' + (W - j.y_med + 1.1) + '" text-anchor="middle" '
           + 'font-size="3.1" font-weight="700" fill="#fff">' + j.numero + '</text>'
           + '<text x="' + j.x_med + '" y="' + y + '" text-anchor="middle" font-size="3.4" '
           + 'font-weight="700" fill="var(--texte)">' + esc(court(j.nom)) + '</text>';
    });
  return '<div class="carte large"><h2>' + esc(titre) + '</h2><div class="lg">'
    + t("liens") + ' ' + seuil + ' ' + t("passesM") + '</div>'
    + terrain(s + noms, { alt: titre }) + '</div>';
}

function vueJoueur(num) {
  var j = IDX.joueurs.filter(function (x) { return x.numero === num; })[0];
  if (!j) return '<div class="vide"><b>' + t("introuvable") + '</b></div>';
  var tt = j.total;
  var h = '<div class="entete"><div class="jt">' + photo(j, 62)
    + '<div><h1>' + esc(j.nom) + '</h1><div class="sous"><span class="puce">N° ' + j.numero
    + '</span> · ' + j.matchs.length + ' ' + t("matchs").toLowerCase() + ' · ' + esc(IDX.equipe)
    + '</div></div></div></div>'
    + kpis([[t("actions"), tt.actions], [t("passes"), tt.passes],
            [t("reussite"), pct(tt.passes_ok, tt.passes)],
            [t("prog"), tt.prog, "f"], [t("tiers"), tt.t3],
            [t("tirs"), tt.tirs], [t("but"), tt.buts, "ok"]]);

  var pts = j.matchs.filter(function (m) { return m.x_med != null; }).map(function (m) {
    return point(m.x_med, m.y_med, 2.4, "var(--nous)", 1);
  }).join("");
  h += '<div class="carte large"><h2>' + t("position") + '</h2><div class="lg">'
     + t("positionN") + '</div>' + terrain(pts, { lignes: 1, alt: j.nom }) + '</div>';

  h += '<div class="carte"><h2>' + t("parMatch") + '</h2><div class="lg">' + t("ouvrirM") + '</div>'
    + '<div class="tw"><table><thead><tr><th class="g">' + t("date") + '</th><th class="g">'
    + t("adv") + '</th><th>Act</th><th>' + t("passes") + '</th><th>✓</th><th>' + t("prog")
    + '</th><th>' + t("tiers") + '</th><th>' + t("tirs") + '</th><th>' + t("but") + '</th>'
    + '</tr></thead><tbody>'
    + j.matchs.map(function (m) {
        return '<tr onclick="location.hash=\'#/match/' + m.match_id + '\'">'
          + '<td class="g nu">' + dateFr(m.date) + '</td><td class="g nom">' + esc(m.adversaire) + '</td>'
          + '<td>' + m.actions + '</td><td>' + m.passes + '</td><td>' + m.passes_ok + '</td>'
          + '<td>' + m.prog + '</td><td>' + m.t3 + '</td><td>' + m.tirs + '</td>'
          + '<td>' + (m.buts || 0) + '</td></tr>';
      }).join("") + '</tbody></table></div></div>';

  h += '<h2 class="sec">' + t("stats") + '</h2><div class="lg sec-lg">' + t("cumul") + ' · '
     + t("toutXml") + '</div>' + statsListe(j.tags || {});
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
    v.innerHTML = '<div class="vide"><b>' + t("chargement") + '</b></div>';
    return charge("data/match_" + m[1] + ".json").then(function (d) {
      v.innerHTML = vueMatch(d); window.scrollTo(0, 0);
    }).catch(function () {
      v.innerHTML = '<div class="vide"><b>' + t("introuvable") + '</b></div>';
    });
  }
  var p = h.match(/^#\/joueur\/(\d+)$/);
  if (p) { v.innerHTML = vueJoueur(parseInt(p[1], 10)); window.scrollTo(0, 0); return; }
  if (h === "#/joueurs") { v.innerHTML = vueJoueurs(); window.scrollTo(0, 0); return; }
  v.innerHTML = vueSaison(); window.scrollTo(0, 0);
}

document.addEventListener("click", function (e) {
  var b = e.target.closest ? e.target.closest(".lang b") : null;
  if (!b) return;
  LANG = b.dataset.l;
  localStorage.setItem("kz-lang", LANG);
  rendre();
});
window.addEventListener("hashchange", rendre);

charge("data/index.json").then(function (d) { IDX = d; rendre(); })
  .catch(function () {
    $("#vue").innerHTML = '<div class="vide"><b>Aucune donnée</b>'
      + 'Lancez <code>python publie.py</code> depuis kazma-bdd.</div>';
  });
