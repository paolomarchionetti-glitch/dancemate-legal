/* ============================================================
   FILE: legal.js — DanceMate, pagine pubbliche
   N13 (13/09/2026)

   A che serve: portare chi non parla italiano sulla versione inglese, SENZA
   toccare l'app. I link dentro DanceMate puntano a privacy.html e terms.html
   da sempre; cambiarli vorrebbe dire una nuova release solo per questo.

   Regole, in ordine:
     1. `?lang=it` o `?lang=en` nell'indirizzo comanda e viene ricordato.
        (L'app può aggiungerlo, ma non è obbligata: vedi il punto 3.)
     2. Se l'utente ha già scelto con le due linguette in alto a destra, vale
        quella scelta: è in localStorage e non si discute.
     3. Altrimenti, e SOLO alla prima visita, si guarda la lingua del browser:
        se non è italiano si passa alla versione inglese.

   Il salto avviene una volta sola e lascia una traccia in sessionStorage, così
   chi torna indietro a mano non viene rispedito avanti in un ciclo infinito.
   ============================================================ */
(function () {
  var KEY   = "dm_legal_lang";
  var JUMP  = "dm_legal_jumped";
  var isEn  = /-en\.html($|\?)/.test(location.pathname + location.search);

  function save(l) { try { localStorage.setItem(KEY, l); } catch (e) {} }
  function read()  { try { return localStorage.getItem(KEY); } catch (e) { return null; } }

  // 1 — parametro esplicito
  var param = (location.search.match(/[?&]lang=(it|en)/i) || [])[1];
  if (param) param = param.toLowerCase();

  // 2 — scelta già fatta
  var wanted = param || read();

  // 3 — prima visita: lingua del browser
  if (!wanted) {
    var nav = (navigator.language || "it").slice(0, 2).toLowerCase();
    wanted = (nav === "it") ? "it" : "en";
    try {
      if (sessionStorage.getItem(JUMP)) return;   // già saltato: non insistere
      sessionStorage.setItem(JUMP, "1");
    } catch (e) {}
  } else {
    save(wanted);
  }

  if (wanted === "en" && !isEn) {
    location.replace(location.pathname.replace(/\.html$/, "-en.html"));
  } else if (wanted === "it" && isEn) {
    location.replace(location.pathname.replace(/-en\.html$/, ".html"));
  }

  // Le due linguette in alto: ricordano la scelta per le visite successive.
  document.addEventListener("click", function (ev) {
    var a = ev.target.closest && ev.target.closest(".lang a");
    if (a && a.dataset && a.dataset.lang) save(a.dataset.lang);
  });
})();
