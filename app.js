/* Kazma SC — application de statistiques.
   Statique : les JSON viennent de kazma-bdd/publie.py. Le navigateur ne peut
   rien ecrire, par construction.

   Trois langues, dont l'arabe en ecriture droite-a-gauche.
   Code couleur unique dans toute l'app : vert = reussi, rouge = rate, gris = neutre.
   Il est porte par la donnee (champ `issue` du dictionnaire), jamais devine ici. */

var IDX = null, CACHE = {}, CARTES = {}, SEL = {}, CMP = {}, LANG = localStorage.getItem("kz-lang") || "fr";
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
  positionN2: { fr: "Position médiane de chaque joueur sur la période",
                en: "Median position of every player over the period",
                ar: "الموقع الوسيط لكل لاعب خلال الفترة" },
  coequipiers:{ fr: "coéquipiers",           en: "team-mates",         ar: "زملاء الفريق" },
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
                ar: "بيانات المزوّد، معالجة محليًا." },

  /* --- profil du joueur (radar) --- */
  profil:     { fr: "Profil",              en: "Profile",            ar: "الملف الفني" },
  profilN:    { fr: "Rang dans l’effectif de Kazma, ramené à 90 minutes",
                en: "Rank within the Kazma squad, per 90 minutes",
                ar: "الترتيب داخل فريق كاظمة، لكل 90 دقيقة" },
  mediane:    { fr: "médiane de l’effectif", en: "squad median",     ar: "وسيط الفريق" },
  forts:      { fr: "Points forts",        en: "Strengths",          ar: "نقاط القوة" },
  faibles:    { fr: "Points faibles",      en: "Weaknesses",         ar: "نقاط الضعف" },
  equilibre:  { fr: "Profil équilibré, aucun axe ne se détache.",
                en: "Balanced profile, no axis stands out.",
                ar: "ملف متوازن، لا يبرز أي محور." },
  minutes:    { fr: "minutes",             en: "minutes",            ar: "دقيقة" },
  minutesN:   { fr: "estimées, ramenées à des matchs de 90",
                en: "estimated, scaled to 90-minute matches",
                ar: "تقديرية، معدّلة إلى مباريات من 90 دقيقة" },
  pasAssez:   { fr: "Pas assez de temps de jeu pour un profil",
                en: "Not enough playing time for a profile",
                ar: "وقت لعب غير كافٍ لعرض الملف" },
  pasAssezN:  { fr: "Il faut l’équivalent d’un match complet. Sur un échantillon plus court, un seul ballon fait basculer un axe d’un bout à l’autre : le radar serait faux et flatteur.",
                en: "A full match equivalent is required. On a shorter sample a single touch swings an axis from end to end: the radar would be wrong and flattering.",
                ar: "يلزم ما يعادل مباراة كاملة. على عينة أقصر، لمسة واحدة تقلب المحور بالكامل: سيكون الرسم خاطئًا ومضلِّلًا." },
  sur:        { fr: "sur",                 en: "of",                 ar: "من" },
  pertes90:   { fr: "Pertes de balle / 90", en: "Losses / 90",       ar: "فقدان الكرة / 90" },
  pctDuels:   { fr: "Duels gagnés",        en: "Duels won",          ar: "الالتحامات المكسوبة" },
  horsBase:   { fr: "Comparé à l’effectif, mais pas encore compté dedans",
                en: "Compared with the squad, not yet counted in it",
                ar: "مقارَن بالفريق، لكنه غير محتسب فيه بعد" },

  ax_volume:      { fr: "Volume de passes", en: "Passing volume",    ar: "حجم التمرير" },
  ax_precision:   { fr: "Précision",        en: "Accuracy",          ar: "دقة التمرير" },
  ax_progression: { fr: "Progression",      en: "Progression",       ar: "التقدم بالكرة" },
  ax_creation:    { fr: "Création",         en: "Chance creation",   ar: "صناعة الفرص" },
  ax_tir:         { fr: "Tir",              en: "Shooting",          ar: "التسديد" },
  ax_dribble:     { fr: "Dribble",          en: "Dribbling",         ar: "المراوغة" },
  ax_duel:        { fr: "Duels",            en: "Duels",             ar: "الالتحامات" },
  ax_recuperation:{ fr: "Récupération",     en: "Ball recovery",     ar: "استخلاص الكرة" },

  ax_avant:       { fr: "Vers l’avant",     en: "Forward passing",   ar: "التمرير للأمام" },
  ax_longue:      { fr: "Jeu long",         en: "Long passing",      ar: "التمرير الطويل" },
  ax_centre:      { fr: "Centres",          en: "Crossing",          ar: "العرضيات" },
  ax_surface:     { fr: "Dans la surface",  en: "Into the box",      ar: "داخل المنطقة" },
  ax_aerien:      { fr: "Jeu aérien",       en: "Aerial duels",      ar: "الكرات الهوائية" },
  ax_tacle:       { fr: "Tacles",           en: "Tackling",          ar: "العرقلات" },
  ax_recup_haute: { fr: "Récupération haute", en: "High recoveries", ar: "الاستخلاص العالي" },
  ax_t3:          { fr: "Dernier tiers",    en: "Final third",       ar: "الثلث الأخير" },

  p_LCB:  { fr: "Défenseur central",  en: "Centre-back",        ar: "قلب دفاع" },
  p_RCB:  { fr: "Défenseur central",  en: "Centre-back",        ar: "قلب دفاع" },
  p_LB:   { fr: "Latéral gauche",     en: "Left-back",          ar: "ظهير أيسر" },
  p_RB:   { fr: "Latéral droit",      en: "Right-back",         ar: "ظهير أيمن" },
  p_LCDM: { fr: "Milieu défensif",    en: "Defensive midfielder", ar: "محور دفاعي" },
  p_RCDM: { fr: "Milieu défensif",    en: "Defensive midfielder", ar: "محور دفاعي" },
  p_RCM:  { fr: "Milieu central",     en: "Central midfielder", ar: "وسط ملعب" },
  p_CAM:  { fr: "Milieu offensif",    en: "Attacking midfielder", ar: "صانع ألعاب" },
  p_LCAM: { fr: "Milieu offensif",    en: "Attacking midfielder", ar: "صانع ألعاب" },
  p_RCAM: { fr: "Milieu offensif",    en: "Attacking midfielder", ar: "صانع ألعاب" },
  p_LAM:  { fr: "Ailier gauche",      en: "Left winger",        ar: "جناح أيسر" },
  p_RAM:  { fr: "Ailier droit",       en: "Right winger",       ar: "جناح أيمن" },
  p_CF:   { fr: "Attaquant",          en: "Forward",            ar: "مهاجم" },

  axesPoste:  { fr: "Axes choisis pour le poste",
                en: "Axes chosen for the position",
                ar: "المحاور المختارة حسب المركز" },

  /* --- explications des colonnes, au survol de l'en-tete --- */
  triAide:    { fr: "Cliquez sur un titre de colonne pour trier",
                en: "Click a column heading to sort",
                ar: "اضغط على عنوان العمود للترتيب" },
  e_numero:   { fr: "Numéro de maillot. Cliquez sur une ligne pour ouvrir la fiche du joueur.",
                en: "Shirt number. Click a row to open the player page.",
                ar: "رقم القميص. اضغط على السطر لفتح صفحة اللاعب." },
  e_joueur:   { fr: "Nom du joueur tel que le fournisseur l’écrit.",
                en: "Player name as the provider writes it.",
                ar: "اسم اللاعب كما يكتبه مزوّد البيانات." },
  e_actions:  { fr: "Toutes les actions relevées par le fournisseur : passes, duels, tirs, récupérations, pertes. C’est un volume de participation, pas une note.",
                en: "Every action recorded by the provider: passes, duels, shots, recoveries, losses. A volume of involvement, not a rating.",
                ar: "كل الأحداث التي سجّلها المزوّد: تمريرات، التحامات، تسديدات، استخلاصات، خسارات. حجم مشاركة، وليس تقييمًا." },
  e_passes:   { fr: "Passes tentées, réussies et ratées confondues.",
                en: "Passes attempted, completed and failed together.",
                ar: "التمريرات المحاولة، الناجحة والخاطئة معًا." },
  e_passesok: { fr: "Passes réussies, c’est-à-dire reçues par un partenaire.",
                en: "Completed passes — those that reached a team-mate.",
                ar: "التمريرات الناجحة التي وصلت إلى زميل." },
  e_prog:     { fr: "Passes progressives réussies : celles qui font nettement avancer le ballon vers le but adverse.",
                en: "Completed progressive passes: those that move the ball clearly towards the opposing goal.",
                ar: "التمريرات التقدمية الناجحة: التي تنقل الكرة بوضوح نحو مرمى الخصم." },
  e_cles:     { fr: "Passes clés : la passe qui amène directement un tir.",
                en: "Key passes: the pass that directly leads to a shot.",
                ar: "التمريرات المفتاحية: التمريرة التي تؤدي مباشرة إلى تسديدة." },
  e_t3:       { fr: "Actions dans le dernier tiers, les 35 derniers mètres avant le but adverse.",
                en: "Actions in the final third, the last 35 metres before the opposing goal.",
                ar: "الأحداث في الثلث الأخير، آخر 35 مترًا قبل مرمى الخصم." },
  e_drib:     { fr: "Dribbles réussis, c’est-à-dire l’adversaire éliminé balle au pied.",
                en: "Successful dribbles — the opponent beaten with the ball.",
                ar: "المراوغات الناجحة التي تخطّى فيها الخصم بالكرة." },
  e_duels:    { fr: "Duels gagnés. Attention : le total du fournisseur contient déjà les duels aériens, les tacles et les dribbles réussis.",
                en: "Duels won. Note: the provider’s total already includes aerial duels, tackles and successful dribbles.",
                ar: "الالتحامات المكسوبة. ملاحظة: مجموع المزوّد يشمل أصلًا الكرات الهوائية والعرقلات والمراوغات الناجحة." },
  e_recup:    { fr: "Ballons récupérés à l’adversaire.",
                en: "Balls won back from the opponent.",
                ar: "الكرات المستخلصة من الخصم." },
  e_pertes:   { fr: "Ballons perdus. Ici, moins il y en a, mieux c’est — un joueur qui touche beaucoup de ballons en perd forcément quelques-uns.",
                en: "Balls lost. Fewer is better here — a player who touches the ball a lot will inevitably lose some.",
                ar: "الكرات المفقودة. هنا الأقل أفضل — من يلمس الكرة كثيرًا يفقد بعضها حتمًا." },
  e_tirs:     { fr: "Tirs tentés, cadrés ou non.",
                en: "Shots attempted, on target or not.",
                ar: "التسديدات المحاولة، على المرمى أو خارجه." },
  e_buts:     { fr: "Buts marqués.",
                en: "Goals scored.",
                ar: "الأهداف المسجلة." },
  e_reussite: { fr: "Part des passes réussies. À lire avec le volume : 100 % sur trois passes ne veut rien dire.",
                en: "Share of completed passes. Read it with the volume: 100 % on three passes means nothing.",
                ar: "نسبة التمريرات الناجحة. اقرأها مع الحجم: 100 ٪ من ثلاث تمريرات لا تعني شيئًا." },

  /* --- cartes de la fiche joueur --- */
  cTirs:      { fr: "Ses tirs",             en: "His shots",          ar: "تسديداته" },
  cTirsN:     { fr: "Chaque point est l’endroit d’où il a tiré. Le fournisseur ne donne pas le placement du ballon dans la cage.",
                en: "Each dot is where he shot from. The provider does not supply where the ball went inside the goal.",
                ar: "كل نقطة هي المكان الذي سدّد منه. مزوّد البيانات لا يوفر موضع الكرة داخل المرمى." },
  cProg:      { fr: "Ses passes progressives", en: "His progressive passes", ar: "تمريراته التقدمية" },
  cBallons:   { fr: "Où il gagne et perd le ballon", en: "Where he wins and loses the ball", ar: "أين يكسب ويفقد الكرة" },
  cZones:     { fr: "Où il touche le ballon", en: "Where he touches the ball", ar: "أين يلمس الكرة" },
  cZonesN:    { fr: "Part de ses actions par zone du terrain",
                en: "Share of his actions by area of the pitch",
                ar: "نسبة تحركاته حسب منطقة الملعب" },
  cGestes:    { fr: "Réussite geste par geste", en: "Success by type of action", ar: "النجاح حسب نوع الأداء" },
  cGestesN:   { fr: "Ce qu’il réussit et ce qu’il rate, dans chaque registre",
                en: "What he completes and what he loses, in each register",
                ar: "ما ينجح فيه وما يخفق فيه، في كل مجال" },
  reussies:   { fr: "réussies",             en: "completed",          ar: "ناجحة" },
  iBut:       { fr: "But",                  en: "Goal",               ar: "هدف" },
  iCadre:     { fr: "Cadré",                en: "On target",          ar: "على المرمى" },
  iPoteau:    { fr: "Poteau ou barre",      en: "Post or bar",        ar: "القائم أو العارضة" },
  iHors:      { fr: "Hors cadre",           en: "Off target",         ar: "خارج المرمى" },
  lRecup:     { fr: "Récupérations",        en: "Recoveries",         ar: "استخلاصات" },
  lPertes:    { fr: "Pertes de balle",      en: "Losses",             ar: "كرات مفقودة" },

  g_passes:   { fr: "Passes",               en: "Passes",             ar: "التمريرات" },
  g_avant:    { fr: "Vers l’avant",         en: "Forward",            ar: "إلى الأمام" },
  g_prog:     { fr: "Progressives",         en: "Progressive",        ar: "التقدمية" },
  g_longues:  { fr: "Longues",              en: "Long",               ar: "الطويلة" },
  g_surface:  { fr: "Dans la surface",      en: "Into the box",       ar: "داخل المنطقة" },
  g_centres:  { fr: "Centres",              en: "Crosses",            ar: "العرضيات" },
  g_duels:    { fr: "Duels",                en: "Duels",              ar: "الالتحامات" },
  g_aeriens:  { fr: "Duels aériens",        en: "Aerial duels",       ar: "الكرات الهوائية" },
  g_dribbles: { fr: "Dribbles",             en: "Dribbles",           ar: "المراوغات" },
  g_tacles:   { fr: "Tacles",               en: "Tackles",            ar: "العرقلات" },
  g_tirs:     { fr: "Tirs",                 en: "Shots",              ar: "التسديدات" },

  /* --- filtre par match sur la fiche joueur --- */
  tousM:      { fr: "Tous les matchs",      en: "All matches",        ar: "كل المباريات" },
  moyM:       { fr: "Moyenne par match",    en: "Average per match",  ar: "المتوسط لكل مباراة" },
  unMatch:    { fr: "Un match…",            en: "One match…",         ar: "مباراة واحدة…" },
  comparer:   { fr: "Comparer à",           en: "Compare with",       ar: "قارن مع" },
  couloirs:   { fr: "Les couloirs",         en: "The channels",       ar: "الممرات" },
  couloirsN:  { fr: "Le terrain coupé en trois bandes de 22,7 m. Le pourcentage donne la part de chaque couloir ; en dessous, le compte. Un couloir très emprunté qui ne fait pas mieux que les autres en réussite est un couloir subi, pas choisi.",
                en: "The pitch cut into three 22.7 m bands. The percentage is each channel's share; the count sits below it. A heavily used channel whose completion is no better than the others is a channel the side falls into, not one it chooses.",
                ar: "الملعب مقسوم إلى ثلاثة أشرطة بعرض 22.7 م. النسبة تمثل حصة كل ممر، والعدد تحتها." },
  cGauche:    { fr: "Couloir gauche",       en: "Left channel",       ar: "الممر الأيسر" },
  cAxe:       { fr: "Axe",                  en: "Centre",             ar: "المحور" },
  cDroite:    { fr: "Couloir droit",        en: "Right channel",      ar: "الممر الأيمن" },
  couT3:      { fr: "Actions, dernier tiers", en: "Final-third actions", ar: "أحداث الثلث الأخير" },
  couProg:    { fr: "Passes progressives",  en: "Progressive passes", ar: "التمريرات التقدمية" },
  couTirs:    { fr: "Tirs",                 en: "Shots",              ar: "التسديدات" },
  couPc:      { fr: "Réussite des passes",  en: "Pass completion",    ar: "نجاح التمرير" },
  aucun:      { fr: "personne",             en: "nobody",             ar: "لا أحد" },
  faceAface:  { fr: "Face à face",          en: "Head to head",       ar: "مواجهة مباشرة" },
  surLesM:    { fr: "Sur les",              en: "Over",               ar: "على مدى" },
  radarN:     { fr: "Chaque axe est déjà ramené à 90 minutes de jeu : le radar est donc identique en moyenne et sur toute la saison.",
                en: "Every axis is already scaled to 90 minutes played: the radar is therefore the same on average and across the season.",
                ar: "كل محور معدّل أصلًا إلى 90 دقيقة لعب: لذلك يبقى الرسم نفسه في وضع المتوسط وفي الموسم كاملًا." },
  totaux:     { fr: "Totaux de la saison",  en: "Season totals",      ar: "مجاميع الموسم" },
  ceMatch:    { fr: "Sur ce match",         en: "In this match",      ar: "في هذه المباراة" },
  sansJoueurs:{ fr: "Pas de détail par joueur pour ce match",
                en: "No player-level detail for this match",
                ar: "لا تتوفر تفاصيل فردية لهذه المباراة" },
  sansJoueursN:{ fr: "Le fournisseur a livré ce match au niveau équipe seulement. Les statistiques collectives ci-dessus sont complètes ; le schéma de passes et les fiches joueurs demandent le fichier par joueur.",
                en: "The provider supplied this match at team level only. The team statistics above are complete; the passing structure and player pages require the per-player file.",
                ar: "زوّد المزوّد هذه المباراة على مستوى الفريق فقط. إحصائيات الفريق أعلاه كاملة؛ أما شبكة التمريرات وصفحات اللاعبين فتحتاج ملف اللاعبين." },
  minutesM:   { fr: "estimées sur ce match", en: "estimated for this match", ar: "تقديرية لهذه المباراة" },
  surCeMatch: { fr: "sur ce match",         en: "in this match",      ar: "في هذه المباراة" },
  tirs1:      { fr: "tir",                  en: "attempt",            ar: "تسديدة" },
  actions1:   { fr: "action",               en: "action",             ar: "لمسة" },
  lRecup1:    { fr: "Récupération",         en: "Recovery",           ar: "استخلاص" },
  lPertes1:   { fr: "Perte de balle",       en: "Loss",               ar: "كرة مفقودة" },
  reussies1:  { fr: "réussie",              en: "completed",          ar: "ناجحة" },
  pasAssezM:  { fr: "Il a joué trop peu de ce match pour être situé dans l’équipe. Sur quelques minutes, un seul ballon fait basculer un axe d’un bout à l’autre.",
                en: "He played too little of this match to be placed within the team. Over a few minutes a single touch swings an axis from end to end.",
                ar: "لعب وقتًا قصيرًا جدًا في هذه المباراة لتحديد موقعه داخل الفريق. في دقائق قليلة، لمسة واحدة تقلب المحور بالكامل." }
};

function t(k) { var e = T[k]; return e ? (e[LANG] || e.fr) : k; }
/* accord en nombre : « 1 tirs » sur la fiche d'un remplacant fait desordre */
function pl(n, cle) { return n + " " + t(n === 1 && T[cle + "1"] ? cle + "1" : cle).toLowerCase(); }
function lib(tag) {
  var d = IDX.libelles.tags[tag];
  return d ? (d[LANG] || d.fr) : tag;
}
function issueDe(tag) {
  var d = IDX.libelles.tags[tag];
  return d ? d.issue : null;
}
function sensDe(tag) {
  var d = IDX.libelles.tags[tag];
  return d && d.sens != null ? d.sens : 0;
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
  /* Les couloirs : trois bandes de 22,67 m. Elles se dessinent SOUS les points,
     assez pales pour ne pas les concurrencer -- une bande de fond ne doit pas
     se lire plus fort que la donnee qu'elle situe. */
  if (o.couloirs) {
    var tot = o.couloirs.reduce(function (a, b) { return a + b; }, 0) || 1;
    for (var ci = 0; ci < 3; ci++) {
      var part = Math.round(100 * o.couloirs[ci] / tot);
      s += '<rect x="0" y="' + (ci * W / 3).toFixed(2) + '" width="' + L
         + '" height="' + (W / 3).toFixed(2) + '" fill="var(--nous)" fill-opacity="'
         + (0.03 + 0.10 * o.couloirs[ci] / Math.max.apply(null, o.couloirs)).toFixed(3) + '"/>'
        + '<line x1="0" y1="' + (ci * W / 3).toFixed(2) + '" x2="' + L + '" y2="'
         + (ci * W / 3).toFixed(2) + '" stroke="' + c + '" stroke-width=".25" '
         + 'stroke-dasharray="1.5 1.5"/>'
        + '<text x="2.5" y="' + (ci * W / 3 + 6).toFixed(2) + '" font-size="4.6" '
         + 'font-weight="700" fill="var(--texte-2)" fill-opacity=".85">' + part + '%</text>';
    }
  }
  if (o.lignes) [35, 70].forEach(function (x) {
    s += '<line x1="' + x + '" y1="0" x2="' + x + '" y2="' + W + '" stroke="' + c
       + '" stroke-width=".4" stroke-dasharray="2 2"/>';
  });
  var c_ = o.cadre || [-3, -3, L + 6, W + 6];
  return '<svg class="pitch" viewBox="' + c_.join(" ")
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

/* Comparaison des deux equipes.
   Une seule chose est mise en evidence : la position de NOTRE equipe.
   Vert = on fait mieux, rouge = on fait moins bien, gris = pas de jugement.
   Le sens vient de la donnee : plus de passes reussies est meilleur, plus de
   pertes de balle est pire, et un volume comme "passes courtes" ne se juge pas. */
function statsCompletes(tagsA, tagsB, nomA, nomB, nous) {
  var tous = {};
  [tagsA, tagsB].forEach(function (o) { Object.keys(o).forEach(function (k) { tous[k] = 1; }); });
  var nousEstA = nous === nomA;
  return parFamille(tous).map(function (f) {
    var lignes = f[1].sort(function (x, y) {
      return (tagsB[y] || 0) + (tagsA[y] || 0) - (tagsB[x] || 0) - (tagsA[x] || 0);
    }).map(function (k) {
      var a = tagsA[k] || 0, b = tagsB[k] || 0, s = a + b || 1, sn = sensDe(k);
      var vn = nousEstA ? a : b, ve = nousEstA ? b : a, etat = "neutre";
      if (sn !== 0 && vn !== ve) etat = (sn > 0 ? vn > ve : vn < ve) ? "sup" : "inf";
      var ca = nousEstA ? etat : "neutre", cb = nousEstA ? "neutre" : etat;
      return '<div class="cmp"><span class="v ' + ca + '">' + a + '</span>'
        + '<span class="bar"><i class="a ' + ca + '" style="width:' + (100 * a / s).toFixed(1) + '%"></i></span>'
        + '<span class="l">' + esc(lib(k)) + '</span>'
        + '<span class="bar"><i class="b ' + cb + '" style="width:' + (100 * b / s).toFixed(1) + '%"></i></span>'
        + '<span class="v ' + cb + '">' + b + '</span></div>';
    }).join("");
    return '<div class="carte"><h2>' + esc(famNom(f[0])) + '</h2>'
      + '<div class="cmp tete"><span></span><span class="v nomEq">' + esc(nomA) + '</span>'
      + '<span class="l"></span><span class="v nomEq b">' + esc(nomB) + '</span><span></span></div>'
      + lignes + '</div>';
  }).join("");
}

/* liste simple, pour une fiche joueur */
function statsListe(tags, par) {
  par = par || function (v) { return v; };
  return parFamille(tags).map(function (f) {
    return '<div class="carte"><h2>' + esc(famNom(f[0])) + '</h2><div class="lst">'
      + f[1].sort(function (a, b) { return tags[b] - tags[a]; }).map(function (k) {
          return '<div class="' + cls(k) + '"><b>' + par(tags[k]) + '</b><span>'
               + esc(lib(k)) + '</span></div>';
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
  document.body.classList.remove("menu");     /* toute navigation referme le menu */
}

/* ---------------------------------------------------------------- vues */
/* Une valeur peut arriver seule, ou en couple [moyenne, total] : le grand
   chiffre est alors la moyenne, et le total suit en petit. */
function kpis(arr, suffixe) {
  var g = '<div class="kpi">' + arr.map(function (k) {
    var v = k[1], duo = Array.isArray(v) && v.length > 1;
    var gros = Array.isArray(v) ? v[0] : v;
    return '<div class="' + (k[2] || "") + '"><b>' + gros + '</b><span>' + esc(k[0])
      + '</span></div>';
  }).join("") + '</div>';
  // le « par match » est dit une fois au-dessus, pas sur chacune des sept tuiles
  return suffixe ? '<div class="astuce">' + esc(suffixe) + '</div>' + g : g;
}

/* une decimale, mais pas de « 12.0 » */
function arrondi(v) {
  var r = Math.round(v * 10) / 10;
  return (r === Math.round(r)) ? String(Math.round(r)) : r.toFixed(1).replace(".", virgule());
}
function virgule() { return LANG === "fr" ? "," : "."; }
/* majuscule en tete : « sur ce match » sert aussi en milieu de phrase */
function cap(x) { return x.charAt(0).toUpperCase() + x.slice(1); }

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
    + tableauJoueurs(IDX.joueurs, 'saison') + '</div>';
  return h;
}

/* -------------------------------------------- tableau des joueurs, triable
   Le tri est garde par tableau (saison, tous, match) et survit au re-rendu.
   Chaque en-tete porte la cle d'une explication : le fournisseur emploie des
   mots qui ne veulent pas dire la meme chose pour tout le monde, « duels
   gagnes » en tete, qui contient deja les tacles et les dribbles. */
var COLS = [
  { c: "actions",   h: "Act",   a: "e_actions" },
  { c: "passes",    h: "Pass",  a: "e_passes" },
  { c: "passes_ok", h: "✓",     a: "e_passesok" },
  { c: "prog",      h: "Prog",  a: "e_prog" },
  { c: "cles",      h: "Clés",  a: "e_cles" },
  { c: "t3",        h: "Tiers", a: "e_t3" },
  { c: "dribbles",  h: "Drib",  a: "e_drib" },
  { c: "duels_ok",  h: "Duels", a: "e_duels" },
  { c: "recup",     h: "Récup", a: "e_recup" },
  { c: "pertes",    h: "Pertes",a: "e_pertes" },
  { c: "tirs",      h: "Tirs",  a: "e_tirs" },
  { c: "buts",      h: "Buts",  a: "e_buts" }
];
var TABLES = {};

function valeurTri(j, cle) {
  if (cle === "nom") return String(j.nom || "").toLowerCase();
  if (cle === "numero") return j.numero;
  var r = j.total || j;
  if (cle === "reussite") return r.passes ? r.passes_ok / r.passes : -1;
  return r[cle] || 0;
}

function triCol(id, cle) {
  var e = TABLES[id];
  if (!e) return;
  // meme colonne : on inverse. Nouvelle colonne : decroissant d'abord pour les
  // chiffres (le meilleur en haut), croissant pour les noms.
  if (e.cle === cle) e.sens = -e.sens;
  else { e.cle = cle; e.sens = (cle === "nom") ? 1 : -1; }
  var vieux = document.getElementById("tab-" + id);
  if (vieux) vieux.outerHTML = tableauJoueurs(e.joueurs, id);
}

function tableauJoueurs(joueurs, id) {
  id = id || "tj";
  var e = TABLES[id] || (TABLES[id] = { cle: "actions", sens: -1 });
  e.joueurs = joueurs;

  var tri = joueurs.slice().sort(function (a, b) {
    var va = valeurTri(a, e.cle), vb = valeurTri(b, e.cle);
    if (va < vb) return -e.sens;
    if (va > vb) return e.sens;
    return (b.total || b).actions - (a.total || a).actions;
  });

  var th = function (cle, texte, aide, g) {
    var actif = e.cle === cle;
    return '<th class="tri' + (g ? " g" : "") + (actif ? " actif" : "") + '" tabindex="0"'
      + ' data-aide="' + aide + '" role="button" aria-sort="'
      + (actif ? (e.sens > 0 ? "ascending" : "descending") : "none") + '"'
      + ' data-tri="' + cle + '" data-tab="' + id + '">'
      + esc(texte) + '<i>' + (actif ? (e.sens > 0 ? "▲" : "▼") : "") + '</i></th>';
  };

  // tout est dans le bloc porteur de l'id : c'est lui que le tri remplace, donc
  // l'astuce ne peut pas se dupliquer a chaque clic.
  return '<div id="tab-' + id + '"><div class="astuce">' + t("triAide") + '</div>'
    + '<div class="tw"><table><thead><tr>'
    + th("numero", "N°", "e_numero", 1)
    + th("nom", t("joueur"), "e_joueur", 1)
    + COLS.map(function (c) { return th(c.c, c.h, c.a); }).join("")
    + th("reussite", t("reussite"), "e_reussite")
    + '</tr></thead><tbody>'
    + tri.map(function (j) {
        var r = j.total || j;
        return '<tr data-joueur="' + j.numero + '">'
          + '<td class="g jn">' + photo(j, 26) + '<span class="nu">' + j.numero + '</span></td>'
          + '<td class="g nom">' + esc(j.nom) + '</td>'
          + COLS.map(function (c) { return "<td>" + (r[c.c] || 0) + "</td>"; }).join("")
          + '<td>' + pct(r.passes_ok, r.passes) + '</td></tr>';
      }).join("") + '</tbody></table></div></div>';
}

/* Une seule bulle, posee sur le body en position fixe : dans le tableau elle
   serait rognee par le conteneur qui defile horizontalement. */
var BULLE = null;
function bulle(cible) {
  if (!BULLE) {
    BULLE = document.createElement("div");
    BULLE.className = "bulle";
    document.body.appendChild(BULLE);
  }
  if (!cible) { BULLE.classList.remove("on"); return; }
  BULLE.textContent = t(cible.getAttribute("data-aide"));
  BULLE.classList.add("on");
  var r = cible.getBoundingClientRect(), b = BULLE.getBoundingClientRect();
  var x = Math.min(Math.max(8, r.left + r.width / 2 - b.width / 2), innerWidth - b.width - 8);
  var y = r.bottom + 8;
  if (y + b.height > innerHeight - 8) y = r.top - b.height - 8;
  BULLE.style.left = Math.round(x) + "px";
  BULLE.style.top = Math.round(y) + "px";
}
document.addEventListener("mouseover", function (ev) {
  var c = ev.target.closest && ev.target.closest("[data-aide]");
  if (c) bulle(c);
});
document.addEventListener("mouseout", function (ev) {
  if (ev.target.closest && ev.target.closest("[data-aide]")) bulle(null);
});
document.addEventListener("focusin", function (ev) {
  var c = ev.target.closest && ev.target.closest("[data-aide]");
  bulle(c || null);
});
document.addEventListener("focusout", function () { bulle(null); });
document.addEventListener("keydown", function (ev) { if (ev.key === "Escape") bulle(null); });

/* Tri et ouverture d'une fiche : ecouteurs delegues plutot que des attributs
   onclick, qui obligent a imbriquer des guillemets dans du HTML dans du JS. */
document.addEventListener("change", function (ev) {
  var cj = ev.target.closest && ev.target.closest("select.choixJ");
  if (cj) {
    var nc = parseInt(cj.getAttribute("data-cj"), 10);
    CMP[nc] = cj.value ? parseInt(cj.value, 10) : null;
    // le compare a besoin de ses propres cartes si un match est selectionne
    var suite = CMP[nc] ? charge("data/joueur_" + CMP[nc] + ".json")
                            .then(function (d) { CARTES[CMP[nc]] = d; })
                            .catch(function () {})
                        : Promise.resolve();
    suite.then(function () { $("#vue").innerHTML = vueJoueur(nc); });
    return;
  }
  var sl = ev.target.closest && ev.target.closest("select.choixM");
  if (!sl) return;
  var nj = parseInt(sl.getAttribute("data-mj"), 10);
  SEL[nj] = sl.value || "moy";
  $("#vue").innerHTML = vueJoueur(nj);
});
document.addEventListener("click", function (ev) {
  var f = ev.target.closest && ev.target.closest("[data-mf]");
  if (f) {
    var nj = parseInt(f.getAttribute("data-mj"), 10);
    SEL[nj] = f.getAttribute("data-mf") || "moy";
    $("#vue").innerHTML = vueJoueur(nj);
    return;
  }
  var h = ev.target.closest && ev.target.closest("th[data-tri]");
  if (h) { triCol(h.getAttribute("data-tab"), h.getAttribute("data-tri")); return; }
  var r = ev.target.closest && ev.target.closest("tr[data-joueur]");
  if (r) { location.hash = "#/joueur/" + r.getAttribute("data-joueur"); return; }
  var q = ev.target.closest && ev.target.closest("tr[data-match]");
  if (q) location.hash = "#/match/" + q.getAttribute("data-match");
});
document.addEventListener("keydown", function (ev) {
  if (ev.key !== "Enter" && ev.key !== " ") return;
  var h = ev.target.closest && ev.target.closest("th[data-tri]");
  if (!h) return;
  ev.preventDefault();
  triCol(h.getAttribute("data-tab"), h.getAttribute("data-tri"));
});

function vueJoueurs() {
  return '<div class="entete"><div><h1>' + t("tousJ") + '</h1><div class="sous">'
    + t("cumul") + '</div></div></div>'
    + '<div class="carte">' + tableauJoueurs(IDX.joueurs, 'tous') + '</div>';
}

/* ------------------------------------------------------- les couloirs
   Trois bandes, trois lignes : part des actions, part des passes progressives,
   et reussite des passes dans chaque bande. La reussite est ce qui distingue
   un cote emprunte d'un cote qui produit. */
function blocCouloirs(d) {
  var A = d.domicile, B = d.exterieur, nous = A === IDX.equipe ? A : B;
  var noms = [t("cGauche"), t("cAxe"), t("cDroite")];
  var ligne = function (lab, vals, pc) {
    var tot = vals.reduce(function (a, b) { return a + b; }, 0) || 1;
    return '<tr><td class="g">' + lab + '</td>'
      + vals.map(function (v, i) {
          return '<td><b>' + Math.round(100 * v / tot) + ' %</b><i>'
               + (pc ? pc[i] : v) + '</i></td>';
        }).join("") + '</tr>';
  };
  var bloc = function (e) {
    var c = d.couloirs[e];
    var pcT3 = c.t3.passes.map(function (n, i) {
      return n ? Math.round(100 * c.t3.ok[i] / n) + " %" : "—";
    });
    return '<div class="carte"><h2>' + esc(e) + '</h2>'
      + '<div class="tw"><table class="cou"><thead><tr><th class="g"></th>'
      + noms.map(function (n) { return "<th>" + esc(n) + "</th>"; }).join("")
      + '</tr></thead><tbody>'
      + ligne(t("couT3"), c.t3.n)
      + ligne(t("couProg"), c.prog.n)
      + ligne(t("couTirs"), c.tirs)
      + '<tr><td class="g">' + t("couPc") + '</td>'
      + pcT3.map(function (x) { return '<td><b>' + x + '</b></td>'; }).join("")
      + '</tr></tbody></table></div></div>';
  };
  return '<h2 class="sec">' + t("couloirs") + '</h2><div class="note sec-lg">'
    + t("couloirsN") + '</div><div class="duo">' + bloc(A) + bloc(B) + '</div>';
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
     + legendeCode()
     + statsCompletes(d.tags[A] || {}, d.tags[B] || {}, A, B, nous);

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
            }).join(""), { lignes: 1, alt: e,
                           couloirs: ((d.couloirs || {})[e] || {}).prog
                                     ? d.couloirs[e].prog.n : null })
          + legende([[coul, t("reussie")], ["var(--rouge)", t("ratee")]]) + '</div>';
      }).join("") + '</div>';

  /* les reseaux prennent toute la largeur : sinon les noms sont illisibles.
     Sans niveau joueur dans l'export, il n'y a ni reseau ni tableau : on le dit
     plutot que d'afficher un terrain vide. */
  var avecJoueurs = (d.joueurs || []).length > 0;
  if (avecJoueurs) {
    h += '<h2 class="sec">' + t("schema") + '</h2>'
       + reseauSvg(d, d.reseau, 6, t("toutes"))
       + reseauSvg(d, d.reseau_prog, 2, t("progSeul"));
  }

  if (d.couloirs) h += blocCouloirs(d);

  h += mk(t("tiersT"), function (e, coul) {
    var s = d.equipes[e], q = d.tiers[e] || [];
    return '<div class="carte"><h2>' + esc(e) + '</h2><div class="lg">' + s.t3_actions + ' '
      + t("actions") + ' · ' + t("passesR") + ' ' + pct(s.t3_ok, s.t3_passes) + '</div>'
      + terrain(q.map(function (x) {
          return point(x[0], x[1], 1.6, x[2] ? "var(--vert)" : "var(--rouge)", 1);
        }).join(""), { lignes: 1, tiers: coul, alt: e,
                       couloirs: ((d.couloirs || {})[e] || {}).t3
                                 ? d.couloirs[e].t3.n : null })
      + legende([["var(--vert)", t("reussie")], ["var(--rouge)", t("ratee")]]) + '</div>';
  });

  if (avecJoueurs) {
    h += '<div class="carte"><h2>' + t("joueurs") + '</h2><div class="lg">' + esc(IDX.equipe)
       + '</div>' + tableauJoueurs(d.joueurs, 'match') + '</div>';
  } else {
    h += '<div class="carte"><h2>' + t("joueurs") + '</h2><div class="vide court"><b>'
       + t("sansJoueurs") + '</b>' + t("sansJoueursN") + '</div></div>';
    return h;
  }

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

function legendeCode() {
  var m = { fr: ["Kazma fait mieux", "Kazma fait moins bien", "pas de jugement possible"],
            en: ["Kazma does better", "Kazma does worse", "no judgement possible"],
            ar: ["كاظمة أفضل", "كاظمة أقل", "لا حكم ممكن"] }[LANG];
  return '<div class="leg code">'
    + '<span><i style="background:var(--vert)"></i>' + m[0] + '</span>'
    + '<span><i style="background:var(--rouge)"></i>' + m[1] + '</span>'
    + '<span><i style="background:var(--texte-3)"></i>' + m[2] + '</span></div>';
}

function legende(items) {
  // le 3e element est une classe de marqueur : « anneau » pour le but, qui est
  // vert comme un tir cadre et doit pourtant se distinguer dans la legende.
  return '<div class="leg">' + items.map(function (i) {
    // color: en plus du fond, pour que currentColor serve aux variantes
    return '<span><i class="' + (i[2] || "") + '" style="background:' + i[0] + ';color:'
         + i[0] + ';border-color:' + i[0] + '"></i>' + esc(i[1]) + '</span>';
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
       + (W - b.y_med) + '" stroke="var(--nous)" stroke-width="' + (k * (0.35 + 2.6 * n / vmax)).toFixed(2)
       + '" stroke-opacity="' + (0.2 + 0.6 * n / vmax).toFixed(2) + '"/>';
  });
  /* Cadrage. Les positions medianes se serrent au centre : sur le terrain entier
     les onze joueurs tiennent dans moins d'un tiers de la surface, et agrandir
     le terrain ne fait qu'agrandir le vide. On cadre donc sur la zone occupee,
     avec assez de marge pour garder la ligne mediane et les surfaces en
     reperes. Les marques sont ensuite mises a l'echelle du cadre, sinon un
     zoom fort donnerait des noms gigantesques. */
  var xs = [], ys = [];
  Object.keys(pos).forEach(function (k) { xs.push(pos[k].x_med); ys.push(W - pos[k].y_med); });
  var marge = 21;
  var x0 = Math.max(-3, Math.min.apply(null, xs) - marge);
  var x1 = Math.min(L + 3, Math.max.apply(null, xs) + marge);
  var y0 = Math.max(-3, Math.min.apply(null, ys) - marge * 0.6);
  var y1 = Math.min(W + 3, Math.max.apply(null, ys) + marge * 0.6);
  var cadre = [x0, y0, x1 - x0, y1 - y0];
  var k = (x1 - x0) / (L + 6);          // 1 = terrain entier, 0,5 = deux fois plus gros

  /* les noms se placent sous le disque, ou au-dessus si un voisin occupe deja la place */
  var poses = [], noms = "";
  Object.keys(pos).map(function (k) { return pos[k]; })
    .sort(function (a, b) { return a.y_med - b.y_med; })
    .forEach(function (j) {
      s += '<circle cx="' + j.x_med + '" cy="' + (W - j.y_med) + '" r="'
         + (k * (2.7 + 2.9 * Math.sqrt(j.actions / 160))).toFixed(2)
         + '" fill="var(--nous)" stroke="var(--fond)" stroke-width="' + (k * .7).toFixed(2) + '"/>';
      var y = W - j.y_med + k * 6.6, haut = false;
      for (var i = 0; i < poses.length; i++)
        if (Math.abs(poses[i][0] - j.x_med) < k * 15 && Math.abs(poses[i][1] - y) < k * 5.4)
          haut = true;
      if (haut) y = W - j.y_med - k * 4.8;
      poses.push([j.x_med, y]);
      noms += '<text x="' + j.x_med + '" y="' + (W - j.y_med + k * 1.15) + '" text-anchor="middle" '
           + 'font-size="' + (k * 3.2).toFixed(2) + '" font-weight="700" fill="#fff">' + j.numero + '</text>'
           + '<text x="' + j.x_med + '" y="' + y + '" text-anchor="middle" font-size="' + (k * 3.5).toFixed(2) + '" '
           + 'font-weight="700" fill="var(--texte)">' + esc(court(j.nom)) + '</text>';
    });
  return '<div class="carte large"><h2>' + esc(titre) + '</h2><div class="lg">'
    + t("liens") + ' ' + seuil + ' ' + t("passesM") + '</div>'
    + terrain(s + noms, { alt: titre, cadre: cadre }) + '</div>';
}

/* ------------------------------------------------------- profil : le radar
   Huit axes, echelle en centiles dans l'effectif de Kazma. Le centile est un
   RANG, pas une note : l'anneau du milieu est par construction la mediane de
   l'effectif, donc ce qui deborde vers l'exterieur est un point fort et ce qui
   rentre vers le centre un point faible. La valeur brute pour 90 minutes est
   ecrite a cote de chaque axe, parce qu'un rang sur douze joueurs ne dit pas
   la meme chose qu'un rang sur toute une ligue. */
/* Une valeur d'axe se lit toujours pareil : pourcentage pour la precision,
   nombre a la virgule ailleurs. */
function axeVal(a) {
  return a.cle === "precision" ? Math.round(a.valeur) + " %" : arrondi(a.valeur);
}

function radarSvg(p, p2) {
  // 470 de large et non 420 : « Récupération haute » et « Dans la surface »
  // debordaient du cadre et se faisaient rogner.
  var A = p.axes, n = A.length, CX = 235, CY = 190, R = 108;
  var ang = function (i) { return (i / n) * 2 * Math.PI - Math.PI / 2; };
  var pol = function (i, r) {
    return [CX + Math.cos(ang(i)) * r, CY + Math.sin(ang(i)) * r];
  };
  var poly = function (r) {
    var d = [];
    for (var i = 0; i < n; i++) { var q = pol(i, r); d.push(q[0].toFixed(1) + "," + q[1].toFixed(1)); }
    return d.join(" ");
  };

  var g = "";
  [25, 50, 75, 100].forEach(function (v) {
    g += '<polygon points="' + poly(R * v / 100) + '" fill="none" stroke="var(--bord)" '
       + 'stroke-width="1"' + (v === 100 ? ' stroke="var(--bord-clair)"' : '') + '/>';
  });
  // l'anneau du milieu : la mediane de l'effectif, la seule reference qui compte
  g += '<polygon points="' + poly(R * .5) + '" fill="none" stroke="var(--texte-3)" '
     + 'stroke-width="1.4" stroke-dasharray="4 4"/>';
  for (var i = 0; i < n; i++) {
    var q = pol(i, R);
    g += '<line x1="' + CX + '" y1="' + CY + '" x2="' + q[0].toFixed(1) + '" y2="' + q[1].toFixed(1)
       + '" stroke="var(--bord)" stroke-width="1"/>';
  }

  var pts = [], som = "";
  for (var k = 0; k < n; k++) {
    var r = R * Math.max(A[k].centile, 2) / 100, q = pol(k, r);
    pts.push(q[0].toFixed(1) + "," + q[1].toFixed(1));
    var c = A[k].centile >= 70 ? "var(--vert)" : (A[k].centile <= 30 ? "var(--rouge)" : "var(--kazma-clair)");
    som += '<circle cx="' + q[0].toFixed(1) + '" cy="' + q[1].toFixed(1) + '" r="4" fill="' + c
         + '" stroke="var(--carte)" stroke-width="1.5"/>';
  }
  // Le compare passe DERRIERE et sans remplissage : deux surfaces pleines l'une
  // sur l'autre ne se lisent plus.
  if (p2) {
    var q2 = [];
    for (var z = 0; z < n; z++) {
      var r2_ = R * Math.max(p2.axes[z].centile, 2) / 100, w = pol(z, r2_);
      q2.push(w[0].toFixed(1) + "," + w[1].toFixed(1));
    }
    g += '<polygon points="' + q2.join(" ") + '" fill="var(--flamme)" fill-opacity=".10" '
       + 'stroke="var(--flamme)" stroke-width="1.8" stroke-dasharray="5 3" '
       + 'stroke-linejoin="round"/>';
  }
  g += '<polygon points="' + pts.join(" ") + '" fill="var(--kazma)" fill-opacity="'
     + (p2 ? ".16" : ".26") + '" '
     + 'stroke="var(--kazma-clair)" stroke-width="2" stroke-linejoin="round"/>' + som;

  for (var m = 0; m < n; m++) {
    var e = pol(m, R + 24), co = Math.cos(ang(m));
    var anc = co > .3 ? "start" : (co < -.3 ? "end" : "middle");
    var val = axeVal(A[m]);
    if (p2) val += " · " + axeVal(p2.axes[m]);
    g += '<text x="' + e[0].toFixed(1) + '" y="' + e[1].toFixed(1) + '" text-anchor="' + anc
       + '" font-size="11.5" fill="var(--texte-2)" font-weight="600">' + esc(t("ax_" + A[m].cle))
       + '<tspan x="' + e[0].toFixed(1) + '" dy="13" font-size="11" font-weight="400" '
       + 'fill="var(--texte-3)">' + val + (p2 ? "" : ' · ' + A[m].rang + '/' + A[m].sur)
       + '</tspan></text>';
  }
  return '<svg class="radar" viewBox="0 0 470 380" role="img" aria-label="'
       + esc(t("profil")) + '">' + g + '</svg>';
}

function blocProfil(p, surUnMatch, num, p2, nom1, nom2, choix) {
  if (!p) return "";
  var poste = p.poste ? '<span class="puce">' + esc(t("p_" + p.poste)) + '</span> · ' : "";
  var tete = '<h2>' + t("profil") + '</h2><div class="lg">' + poste + p.minutes + " "
           + t("minutes") + " "
           + (surUnMatch ? t("minutesM") : t("minutesN"))
           + (p.ligne ? ' · ' + t("axesPoste") : '') + '</div>';

  if (!p.reference) {
    return '<div class="carte">' + tete + '<div class="vide court"><b>' + t("pasAssez")
         + '</b>' + (surUnMatch ? t("pasAssezM") : t("pasAssezN")) + '</div></div>';
  }

  var tri = p.axes.slice().sort(function (a, b) { return b.centile - a.centile; });
  var forts = tri.filter(function (a) { return a.centile >= 70; }).slice(0, 3);
  var faibles = tri.filter(function (a) { return a.centile <= 30; }).reverse().slice(0, 3);
  var liste = function (arr, cl) {
    return arr.map(function (a) {
      return '<span class="tag ' + cl + '">' + esc(t("ax_" + a.cle)) + ' <b>' + a.rang
           + '<i>/' + a.sur + '</i></b></span>';
    }).join("");
  };
  var verdict = (forts.length || faibles.length)
    ? (forts.length ? '<div class="fw"><span class="fw-t">' + t("forts") + '</span>'
                      + liste(forts, "ok") + '</div>' : "")
      + (faibles.length ? '<div class="fw"><span class="fw-t">' + t("faibles") + '</span>'
                      + liste(faibles, "ko") + '</div>' : "")
    : '<div class="fw"><span class="fw-t">' + t("equilibre") + '</span></div>';

  // Comparaison : le panneau lateral passe du verdict a un face-a-face axe par
  // axe. Le rang disparait alors des axes, il n'a plus de sens a deux.
  var cote = verdict;
  if (p2) {
    cote = '<div class="fw"><span class="fw-t">' + t("faceAface") + '</span></div>'
      + '<table class="vs"><tbody>'
      + p.axes.map(function (a, i) {
          var b_ = p2.axes[i], m = Math.max(a.valeur, b_.valeur) || 1;
          return '<tr><td class="v1">' + axeVal(a) + '</td>'
            + '<td class="b"><i class="g" style="width:' + (100 * a.valeur / m).toFixed(0)
            + '%"></i></td>'
            + '<td class="ax">' + esc(t("ax_" + a.cle)) + '</td>'
            + '<td class="b"><i class="d" style="width:' + (100 * b_.valeur / m).toFixed(0)
            + '%"></i></td>'
            + '<td class="v2">' + axeVal(b_) + '</td></tr>';
        }).join("") + '</tbody></table>';
  }

  return '<div class="carte">' + tete + (choix || "")
       + '<div class="radar-wrap">' + radarSvg(p, p2)
       + '<div class="radar-cote">'
       + (p2 ? '<div class="leg"><span><i style="background:var(--kazma)"></i>'
               + esc(nom1) + '</span><span><i style="background:var(--flamme)"></i>'
               + esc(nom2) + '</span></div>' : "")
       + cote
       + (p2 ? "" :
          '<div class="lst mini"><div><b>' + p.hors_axe.pct_duels + ' %</b><span>'
          + t("pctDuels") + '</span></div><div><b>' + p.hors_axe.pertes + '</b><span>'
          + t("pertes90") + '</span></div></div>')
       + '<div class="radar-note"><i></i>' + t("mediane") + ' · ' + p.axes[0].sur + ' '
       + t("joueurs").toLowerCase() + (surUnMatch ? ' · ' + t("surCeMatch") : '') + '</div>'
       + (surUnMatch || p2 ? '' : '<div class="radar-note pt">' + t("radarN") + '</div>')
       + '</div></div></div>';
}

/* =============================== cartes de la fiche joueur ==================
   Les chiffres seuls ne disent pas grand-chose : 3 tirs cadres, oui, mais tires
   d'ou ? Ces cartes reprennent les memes actions et les posent sur le terrain.

   Ce que le fournisseur NE donne PAS : le placement du tir dans la cage. Les
   seules etiquettes de position du XML sont pos_x et pos_y, qui reperent le
   point du terrain d'ou part l'action. Impossible donc de dessiner une cage
   avec les tirs a gauche, a droite ou en lucarne. */

function nuageTirs(tirs) {
  var COUL = ["var(--rouge)", "var(--flamme)", "var(--vert)", "var(--vert)"];
  return tirs.slice().sort(function (a, b) { return a[2] - b[2]; }).map(function (p) {
    var c = COUL[p[2]];
    if (p[2] === 3)                       // un but : disque plein, cercle autour
      return point(p[0], p[1], 2.6, c, 1)
           + '<circle cx="' + p[0] + '" cy="' + (W - p[1]) + '" r="4" fill="none" stroke="'
           + c + '" stroke-width=".7"/>';
    return point(p[0], p[1], 2, c, p[2] === 2 ? 1 : 0);
  }).join("");
}

function carteTirs(c, portee) {
  var n = c.tirs.length;
  if (!n) return "";
  var cpt = [0, 0, 0, 0];
  c.tirs.forEach(function (p) { cpt[p[2]]++; });
  return '<div class="carte"><h2>' + t("cTirs") + '</h2><div class="lg">'
    + portee + pl(n, "tirs") + " · " + t("cTirsN") + '</div>'
    + terrain(nuageTirs(c.tirs), { tiers: "var(--nous)", alt: t("cTirs") })
    + legende([["var(--vert)", t("iBut") + " (" + cpt[3] + ")", "anneau"],
               ["var(--vert)", t("iCadre") + " (" + cpt[2] + ")"],
               ["var(--flamme)", t("iPoteau") + " (" + cpt[1] + ")"],
               ["var(--rouge)", t("iHors") + " (" + cpt[0] + ")", "creux"]])
    + '</div>';
}

function carteProg(c, portee) {
  if (!c.prog.length) return "";
  var ok = c.prog.filter(function (p) { return p[2]; }).length;
  return '<div class="carte"><h2>' + t("cProg") + '</h2><div class="lg">'
    + portee + c.prog.length + " · " + pl(ok, "reussies") + '</div>'
    + terrain(c.prog.map(function (p) {
        return point(p[0], p[1], 1.5, p[2] ? "var(--vert)" : "var(--rouge)", 1);
      }).join(""), { alt: t("cProg") })
    + legende([["var(--vert)", t("reussie")], ["var(--rouge)", t("ratee")]]) + '</div>';
}

function carteBallons(c, portee) {
  if (!c.recup.length && !c.pertes.length) return "";
  return '<div class="carte"><h2>' + t("cBallons") + '</h2><div class="lg">'
    + portee + pl(c.recup.length, "lRecup") + " · " + pl(c.pertes.length, "lPertes") + '</div>'
    + terrain(c.pertes.map(function (p) { return point(p[0], p[1], 1.5, "var(--rouge)", 1); }).join("")
            + c.recup.map(function (p) { return point(p[0], p[1], 1.5, "var(--vert)", 1); }).join(""),
              { alt: t("cBallons") })
    + legende([["var(--vert)", t("lRecup")], ["var(--rouge)", t("lPertes")]]) + '</div>';
}

/* Occupation : une grille 6 x 4 plutot qu'un nuage de points. Sur 200 actions le
   nuage devient une tache ; la grille dit une proportion, et elle ne grossit pas
   quand les matchs s'accumulent. */
function carteZones(c, portee) {
  var z = c.zones || [], tot = z.reduce(function (a, b) { return a + b; }, 0);
  if (!tot) return "";
  var CO = 6, LI = 4, lx = L / CO, ly = W / LI, mx = Math.max.apply(null, z), s = "";
  for (var i = 0; i < z.length; i++) {
    var col = i % CO, lig = Math.floor(i / CO), v = z[i] / mx;
    s += '<rect x="' + (col * lx).toFixed(1) + '" y="' + (W - (lig + 1) * ly).toFixed(1)
       + '" width="' + lx.toFixed(1) + '" height="' + ly.toFixed(1)
       + '" fill="var(--kazma)" fill-opacity="' + (0.05 + 0.75 * v).toFixed(2) + '"/>';
    var part = Math.round(100 * z[i] / tot);
    if (part >= 5)
      s += '<text x="' + (col * lx + lx / 2).toFixed(1) + '" y="'
         + (W - (lig + 0.5) * ly + 1.6).toFixed(1) + '" text-anchor="middle" font-size="4"'
         + ' font-weight="700" fill="#fff" fill-opacity=".92">' + part + '%</text>';
  }
  return '<div class="carte"><h2>' + t("cZones") + '</h2><div class="lg">'
    + portee + pl(tot, "actions") + " · " + t("cZonesN") + '</div>'
    + terrain(s, { alt: t("cZones") }) + '</div>';
}

/* Reussite geste par geste. Chaque paire a ete verifiee : les deux etiquettes
   sont bien disjointes et couvrent le meme geste, sinon le pourcentage serait
   faux. « Passes longues » designe les longues REUSSIES, pas le total. */
var PAIRES = [
  ["Passes réussies", "Passes non-réussies", "g_passes"],
  ["Passes vers l'avant réussies", "Passes vers l'avant incomplètes", "g_avant"],
  ["Passes progressives réussies", "Passes progressives incomplètes", "g_prog"],
  ["Passes longues", "Passes longues incomplètes", "g_longues"],
  ["Passes dans la surface de réparation réussies", "Passes dans la surface incomplètes", "g_surface"],
  ["Centres réussis", "Centres non réussis", "g_centres"],
  ["Duels gangés", "Duels perdus", "g_duels"],
  ["Duels aériens gagnés", "Duels aériens non réussis", "g_aeriens"],
  ["Dribbles réussis", "Dribbles non réussis", "g_dribbles"],
  ["Tacles réussis", "Tacles non réussies", "g_tacles"],
  ["Tirs cadrés", "Tirs hors cadre", "g_tirs"]
];

function gestes(tags, par) {
  var l = PAIRES.map(function (p) {
    return { ok: tags[p[0]] || 0, ko: tags[p[1]] || 0, cle: p[2] };
  }).filter(function (g) { return g.ok + g.ko > 0; })
    .sort(function (a, b) { return (b.ok + b.ko) - (a.ok + a.ko); });
  if (!l.length) return "";
  return '<div class="carte"><h2>' + t("cGestes") + '</h2><div class="lg">'
    + t("cGestesN") + '</div><div class="gestes">'
    + l.map(function (g) {
        var n = g.ok + g.ko, pc = Math.round(100 * g.ok / n);
        // sous 5 gestes le pourcentage est du bruit : on l'attenue au lieu de
        // le cacher, pour que le total reste verifiable.
        return '<div class="ge' + (n < 5 ? " maigre" : "") + '"><span class="gl">' + esc(t(g.cle)) + '</span>'
          + '<span class="gb"><i class="ok" style="width:' + pc + '%"></i>'
          + '<i class="ko" style="width:' + (100 - pc) + '%"></i></span>'
          + '<span class="gn">' + par(g.ok) + '<i>/' + par(n) + '</i></span>'
          + '<span class="gp">' + pc + ' %</span></div>';
      }).join("") + '</div></div>';
}

function vueJoueur(num) {
  var j = IDX.joueurs.filter(function (x) { return x.numero === num; })[0];
  if (!j) return '<div class="vide"><b>' + t("introuvable") + '</b></div>';
  var c = CARTES[num];
  /* Trois modes, et chacun refait TOUTE la page -- un filtre qui ne changerait
     que la moitie de la page serait pire que pas de filtre du tout :
       "moy"      moyenne par match (par defaut)
       "tous"     cumul de la saison
       <match_id> une rencontre                                             */
  var sel = SEL[num] || "moy";
  if (sel !== "moy" && sel !== "tous"
      && !j.matchs.some(function (m) { return m.match_id === sel; })) sel = "moy";

  var mm = (sel !== "moy" && sel !== "tous")
           ? j.matchs.filter(function (m) { return m.match_id === sel; })[0] : null;
  var tt = mm || j.total;
  // le diviseur : tout ce qui se COMPTE est ramene au match en mode moyenne.
  // Les taux et les pourcentages, eux, ne se moyennent pas -- c'est le nombre
  // de passes qui les pondere, pas le nombre de matchs.
  var nm = (sel === "moy") ? j.matchs.length : 1;
  var par = function (v) { return nm > 1 ? arrondi(v / nm) : v; };
  var im = (mm && c) ? c.matchs.map(function (m) { return m.match_id; }).indexOf(sel) : -1;
  var quand = function (pt) { return im < 0 || pt[pt.length - 1] === im; };

  var h = '<div class="entete"><div class="jt">' + photo(j, 62)
    + '<div><h1>' + esc(j.nom) + '</h1><div class="sous"><span class="puce">N° ' + j.numero
    + '</span> · ' + (mm ? dateFr(mm.date) + ' · ' + esc(mm.adversaire)
                         : j.matchs.length + ' ' + t("matchs").toLowerCase())
    + ' · ' + esc(IDX.equipe) + '</div></div></div></div>';

  var pastille = function (cle, texte) {
    return '<b class="' + (sel === cle ? "on" : "") + '" data-mf="' + cle
         + '" data-mj="' + num + '">' + esc(texte) + '</b>';
  };
  h += '<div class="filtre">' + pastille("moy", t("moyM")) + pastille("tous", t("tousM"))
    + '<select class="choixM' + (mm ? " on" : "") + '" data-mj="' + num + '"'
    + ' aria-label="' + esc(t("unMatch")) + '">'
    + '<option value="">' + esc(t("unMatch")) + '</option>'
    + j.matchs.map(function (m) {
        return '<option value="' + m.match_id + '"' + (sel === m.match_id ? " selected" : "")
             + '>' + esc(dateFr(m.date) + " · " + m.adversaire) + '</option>';
      }).join("") + '</select></div>';

  h += kpis([[t("actions"), par(tt.actions)], [t("passes"), par(tt.passes)],
             [t("reussite"), pct(tt.passes_ok, tt.passes)],
             [t("prog"), par(tt.prog), "f"], [t("tiers"), par(tt.t3)],
             [t("tirs"), par(tt.tirs)], [t("but"), par(tt.buts), "ok"]],
            nm > 1 ? t("moyM") + " · " + nm + " " + t("matchs").toLowerCase()
                   : (mm ? null : t("cumul")));

  var prof = mm ? (c && c.radar_m ? c.radar_m[sel] : null)
                : (IDX.radars && IDX.radars.joueurs
                   ? (IDX.radars.joueurs[String(num)] || IDX.radars.joueurs[num]) : null);
  // Le radar ne bouge pas entre « moyenne » et « tous les matchs » : ses axes
  // sont deja des taux pour 90 minutes, c'est-a-dire par match complet joue.
  // Ramener un radar a des totaux de saison le transformerait en classement du
  // temps de jeu.
  /* Comparaison : uniquement entre joueurs de la MEME ligne. Les axes changent
     d'un poste a l'autre ; superposer un ailier et un defenseur central
     tracerait deux formes qui ne parlent pas de la meme chose. */
  var tousP = (IDX.radars && IDX.radars.joueurs) || {};
  var nomDe = function (nu) {
    var y = IDX.joueurs.filter(function (z) { return z.numero === nu; })[0];
    return y ? court(y.nom) : String(nu);
  };
  var candidats = prof && prof.ligne ? IDX.joueurs.filter(function (x) {
    var pr = tousP[String(x.numero)];
    return x.numero !== num && pr && pr.reference && pr.ligne === prof.ligne;
  }) : [];
  var vs = CMP[num];
  if (vs && !candidats.some(function (x) { return x.numero === vs; })) vs = null;
  var pvs = vs ? (mm ? (CARTES[vs] && CARTES[vs].radar_m ? CARTES[vs].radar_m[sel] : null)
                     : tousP[String(vs)]) : null;
  if (pvs && !pvs.reference) pvs = null;

  var choix = candidats.length
    ? '<div class="cmpj"><span>' + t("comparer") + '</span>'
      + '<select class="choixJ" data-cj="' + num + '"><option value="">' + t("aucun")
      + '</option>' + candidats.map(function (x) {
          return '<option value="' + x.numero + '"' + (vs === x.numero ? " selected" : "")
               + '>' + esc(x.nom) + '</option>';
        }).join("") + '</select></div>'
    : "";
  h += blocProfil(prof, !!mm, num, pvs, court(j.nom), vs ? nomDe(vs) : "", choix);

  /* Toute l'equipe sur le meme terrain, le joueur ouvert en surbrillance : une
     position mediane ne dit rien seule, elle ne parle que par rapport aux
     autres. Les coequipiers restent discrets pour ne pas voler l'attention. */
  var posDe = function (x) {
    if (!mm) return [x.x_med, x.y_med];
    var e = (x.matchs || []).filter(function (u) { return u.match_id === sel; })[0];
    return e ? [e.x_med, e.y_med] : [null, null];
  };
  // On ne garde que les joueurs ayant assez joue : la mediane d'un remplacant
  // entre dix minutes ne situe rien et encombre le terrain. Le joueur ouvert y
  // figure toujours, meme s'il n'atteint pas le seuil.
  var R_ = (IDX.radars && IDX.radars.joueurs) || {};
  var retenus = IDX.joueurs.filter(function (x) {
    var pr = R_[String(x.numero)];
    return x.numero === num || (pr && pr.reference);
  }).map(function (x) { return { j: x, q: posDe(x) }; })
    .filter(function (e) { return e.q[0] != null; });

  // etiquettes : sous le point, ou au-dessus si un voisin occupe deja la place
  var pris = [], autres = "", moi = "";
  retenus.sort(function (a, b) { return a.q[1] - b.q[1]; }).forEach(function (e) {
    var x = e.j, cx_ = e.q[0], cy = W - e.q[1], sien = x.numero === num;
    var y = cy + (sien ? 7.4 : 5.2), haut = false;
    for (var i = 0; i < pris.length; i++)
      if (Math.abs(pris[i][0] - cx_) < 11 && Math.abs(pris[i][1] - y) < 4.4) haut = true;
    if (haut) y = cy - (sien ? 4.8 : 3.2);
    pris.push([cx_, y]);
    if (sien) {
      moi = point(cx_, e.q[1], 3.2, "var(--nous)", 1)
          + '<text x="' + cx_ + '" y="' + y.toFixed(1) + '" text-anchor="middle" '
          + 'font-size="3.6" font-weight="700" fill="var(--texte)">' + esc(court(x.nom))
          + '</text>';
    } else {
      autres += point(cx_, e.q[1], 1.9, "var(--bord-clair)", 1)
          + '<text x="' + cx_ + '" y="' + y.toFixed(1) + '" text-anchor="middle" '
          + 'font-size="2.9" fill="var(--texte-3)">' + esc(court(x.nom)) + '</text>';
    }
  });
  var carteP = '<div class="carte"><h2>' + t("position") + '</h2><div class="lg">'
     + t("positionN2") + '</div>' + terrain(autres + moi, { lignes: 1, alt: j.nom })
     + legende([["var(--nous)", esc(court(j.nom))], ["var(--bord-clair)", t("coequipiers")]])
     + '</div>';

  var blocs = [];
  if (c) {
    var cf = {
      tirs:   c.tirs.filter(quand),   prog:   c.prog.filter(quand),
      recup:  c.recup.filter(quand),  pertes: c.pertes.filter(quand),
      zones:  mm ? (c.zones_m || {})[sel] : c.zones
    };
    // Une carte montre des actions reelles, pas une moyenne : on ne dessine pas
    // une demi-passe. Son compteur donne donc toujours le TOTAL de ce qui est
    // affiche, et la portee est annoncee en tete du sous-titre.
    var portee = cap(mm ? t("surCeMatch")
                        : t("surLesM") + " " + j.matchs.length + " " + t("matchs").toLowerCase())
               + " · ";
    blocs = [carteZones(cf, portee), carteTirs(cf, portee), carteProg(cf, portee),
             carteBallons(cf, portee)];
  }
  blocs = blocs.concat([carteP]).filter(function (b) { return b; });
  h += '<div class="duo">' + blocs.join("") + '</div>';

  var tags = mm ? ((c && c.tags_m) ? c.tags_m[sel] : null) : j.tags;
  h += gestes(tags || {}, par);

  h += '<div class="carte"><h2>' + t("parMatch") + '</h2><div class="lg">' + t("ouvrirM") + '</div>'
    + '<div class="tw"><table><thead><tr><th class="g">' + t("date") + '</th><th class="g">'
    + t("adv") + '</th><th>Act</th><th>' + t("passes") + '</th><th>✓</th><th>' + t("prog")
    + '</th><th>' + t("tiers") + '</th><th>' + t("tirs") + '</th><th>' + t("but") + '</th>'
    + '</tr></thead><tbody>'
    + j.matchs.map(function (m) {
        return '<tr data-match="' + m.match_id + '"' + (sel === m.match_id ? ' class="sel"' : '') + '>'
          + '<td class="g nu">' + dateFr(m.date) + '</td><td class="g nom">' + esc(m.adversaire) + '</td>'
          + '<td>' + m.actions + '</td><td>' + m.passes + '</td><td>' + m.passes_ok + '</td>'
          + '<td>' + m.prog + '</td><td>' + m.t3 + '</td><td>' + m.tirs + '</td>'
          + '<td>' + (m.buts || 0) + '</td></tr>';
      }).join("") + '</tbody></table></div></div>';

  var titre = mm ? (dateFr(mm.date) + ' · ' + esc(mm.adversaire))
                 : (nm > 1 ? t("moyM") : t("cumul"));
  h += '<h2 class="sec">' + t("stats") + '</h2><div class="lg sec-lg">'
     + titre + ' · ' + t("toutXml") + '</div>'
     + '<div class="carte"><h2>' + (mm ? t("ceMatch") : (nm > 1 ? t("moyM") : t("totaux")))
     + '</h2><div class="lst">'
     + [[t("actions"), par(tt.actions)], [t("passes"), par(tt.passes)],
        [t("reussite"), pct(tt.passes_ok, tt.passes)],
        [t("prog"), par(tt.prog)], [t("tiers"), par(tt.t3)],
        [t("tirs"), par(tt.tirs)], [t("but"), par(tt.buts)]]
       .map(function (k) { return '<div><b>' + k[1] + '</b><span>' + esc(k[0]) + '</span></div>'; })
       .join("") + '</div></div>'
     + statsListe(tags || {}, par);
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
  if (p) {
    var num = parseInt(p[1], 10);
    // les cartes vivent dans un fichier par joueur : on ne le charge qu'ici, et
    // une absence de fichier n'empeche pas la fiche de s'afficher.
    return charge("data/joueur_" + num + ".json").then(function (d) { CARTES[num] = d; })
      .catch(function () {})
      .then(function () { v.innerHTML = vueJoueur(num); window.scrollTo(0, 0); });
  }
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
document.addEventListener("click", function (e) {
  if (e.target.closest && e.target.closest("#burger")) document.body.classList.toggle("menu");
  else if (e.target.id === "voile") document.body.classList.remove("menu");
});
window.addEventListener("hashchange", rendre);

charge("data/index.json").then(function (d) { IDX = d; rendre(); })
  .catch(function () {
    $("#vue").innerHTML = '<div class="vide"><b>Aucune donnée</b>'
      + 'Lancez <code>python publie.py</code> depuis kazma-bdd.</div>';
  });
