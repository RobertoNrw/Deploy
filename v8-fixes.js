/*
 * v8-fixes.js
 * Diakonie Ruhr Geoanalyse — Kritische Bugfixes + Vivendi/Diamant-Import
 * Autor: Perplexity AI Analyse → r.bo
 * Version: 8.0.0 | Mai 2026
 *
 * Diese Datei wird nach dem Haupt-Script geladen und überschreibt
 * hardcodierte Werte durch dynamisch berechnete Werte aus den Datenarrays.
 */

(function() {
  'use strict';

  // ═══════════════════════════════════════════════════
  //  1. DYNAMISCHE KPI-BERECHNUNG (ersetzt Hardcodes)
  // ═══════════════════════════════════════════════════

  function berechneDynamischeKPIs() {
    // Prüfe ob ZUW und S bereits geladen sind
    if (typeof ZUW === 'undefined' || typeof S === 'undefined') {
      setTimeout(berechneDynamischeKPIs, 200);
      return;
    }

    // ── Verordner-Zahlen aus ZUW-Array ──────────────
    const anzahlVerordner = ZUW.length; // 118 statt hardcoded 66
    const gesamtVerordnungen = ZUW.reduce((sum, z) => sum + (z.vo || 0), 0);
    const prioAVerordner = ZUW.filter(z => z.pr === 'A').length;

    // ── Kundenzahlen aus S-Array ─────────────────────
    const gesamtKunden = S.reduce((sum, s) => sum + (s.c || 0), 0);
    const gesamtPflege = S.reduce((sum, s) => sum + (s.p || 0), 0);
    const gesamtBeratung = S.reduce((sum, s) => sum + (s.b || 0), 0);
    const pflegeAnteil = gesamtKunden > 0 ? ((gesamtPflege / gesamtKunden) * 100).toFixed(1) : '0';
    const beratungAnteil = gesamtKunden > 0 ? ((gesamtBeratung / gesamtKunden) * 100).toFixed(1) : '0';
    const anzahlStationen = S.length;

    // ── Eff. ø Kunden/MA ────────────────────────────
    const gesamtMA = S.reduce((sum, s) => sum + (s.t || 0), 0);
    const avgEff = gesamtMA > 0 ? (gesamtKunden / gesamtMA).toFixed(1) : '-';

    // ── Topbar-Pills aktualisieren ───────────────────
    const pillEls = document.querySelectorAll('.pill .v');
    if (pillEls.length >= 3) {
      pillEls[0].textContent = anzahlStationen;
      pillEls[1].textContent = gesamtKunden.toLocaleString('de-DE');
      pillEls[2].textContent = anzahlVerordner;
    }

    // ── Topbar-Version aktualisieren ─────────────────
    const appTag = document.querySelector('.app-tag');
    if (appTag) appTag.textContent = 'PRO v8';
    document.title = 'Diakonie Ruhr Geoanalyse PRO v8';

    // ── Datenstand-Badge einfügen ────────────────────
    const tbRight = document.querySelector('.tb-right');
    if (tbRight && !document.getElementById('datenstandBadge')) {
      const badge = document.createElement('div');
      badge.id = 'datenstandBadge';
      badge.className = 'pill';
      badge.style.cssText = 'background:var(--success-bg);color:var(--success);font-size:.55rem;';
      badge.innerHTML = '<span>&#9679;</span><span style="margin-left:2px">Stand: Mai 2026</span>';
      tbRight.insertBefore(badge, tbRight.firstChild);
    }

    // ── Auswertungs-KPIs (sum-strip) ─────────────────
    const skVElems = document.querySelectorAll('.sum-strip .sum-kpi .sk-v');
    if (skVElems.length >= 5) {
      skVElems[0].textContent = gesamtKunden.toLocaleString('de-DE');
      // sk-d unter s1:
      const s1d = document.querySelector('.sum-kpi.s1 .sk-d');
      if (s1d) s1d.textContent = anzahlStationen + ' Stationen';

      skVElems[1].textContent = gesamtPflege.toLocaleString('de-DE');
      const s2d = document.querySelector('.sum-kpi.s2 .sk-d');
      if (s2d) s2d.textContent = pflegeAnteil + '%';

      skVElems[2].textContent = gesamtBeratung.toLocaleString('de-DE');
      const s3d = document.querySelector('.sum-kpi.s3 .sk-d');
      if (s3d) s3d.textContent = beratungAnteil + '%';

      // s4 = Dichte bleibt dynamisch aus JS-Hauptlogik
      skVElems[4].textContent = anzahlVerordner; // Verordner
      const s5d = document.querySelector('.sum-kpi.s5 .sk-d');
      if (s5d) s5d.textContent = gesamtVerordnungen + ' Verordnungen';
    }

    // avgEff-Element
    const avgEffEl = document.getElementById('avgEff');
    if (avgEffEl) avgEffEl.textContent = avgEff;

    // ── Zuweiser-Tab KPIs ────────────────────────────
    const zKpiTotal = document.getElementById('zKpiTotal');
    const zKpiVO = document.getElementById('zKpiVO');
    const zKpiPrioA = document.getElementById('zKpiPrioA');
    if (zKpiTotal) zKpiTotal.textContent = anzahlVerordner;
    if (zKpiVO) zKpiVO.textContent = gesamtVerordnungen;
    if (zKpiPrioA) zKpiPrioA.textContent = prioAVerordner;

    // ── Zuweiser-Karte mbar-t Titel ───────────────────
    const zuwMbar = document.querySelector('#pZuw .mbar-t');
    if (zuwMbar) {
      zuwMbar.innerHTML = `<i data-lucide="stethoscope"></i> Zuweiser-Netzwerk — ${anzahlVerordner} Verordner · ${gesamtVerordnungen} Verordnungen (2024–2025)`;
    }

    // ── Sozialraum DR-Kunden KPI ──────────────────────
    const sozKpiKd = document.getElementById('sozKpiKd');
    if (sozKpiKd) sozKpiKd.textContent = gesamtKunden.toLocaleString('de-DE');

    // ── AI Drawer Willkommensnachricht aktualisieren ──
    const aiFirstMsg = document.querySelector('.ai-body .ai-msg.bot');
    if (aiFirstMsg) {
      aiFirstMsg.innerHTML = `Ich bin dein KI-Analyst für die Diakonie Ruhr Geoanalyse.
        Ich habe Zugriff auf alle <b>${anzahlStationen} Stationen</b>,
        <b>18 PLZ-Gebiete</b>, <b>${anzahlVerordner} Verordner</b>
        (${gesamtVerordnungen} Verordnungen 2024–2025) und die zugehörigen Kennzahlen.<br><br>
        Stelle mir Fragen zu Versorgungslücken, Verordner-Analyse,
        Standortoptimierung oder strategischer Planung.`;
    }

    // Lucide neu rendern nach DOM-Änderungen
    if (window.lucide && window.lucide.createIcons) {
      window.lucide.createIcons();
    }

    console.log('[v8-fixes] KPIs berechnet:', {
      stationen: anzahlStationen, kunden: gesamtKunden,
      pflege: gesamtPflege, beratung: gesamtBeratung,
      verordner: anzahlVerordner, verordnungen: gesamtVerordnungen,
      prioA: prioAVerordner
    });
  }

  // ═══════════════════════════════════════════════════
  //  2. MAP.INVALIDATESIZE() BEI PANE-WECHSELN
  // ═══════════════════════════════════════════════════

  function patchPaneSwitch() {
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        // Nach Transition alle bekannten Leaflet-Karten invalidieren
        setTimeout(() => {
          try {
            if (window._mapMain && typeof window._mapMain.invalidateSize === 'function') {
              window._mapMain.invalidateSize();
            }
            if (window._mapSozial && typeof window._mapSozial.invalidateSize === 'function') {
              window._mapSozial.invalidateSize();
            }
            if (window._mapZuw && typeof window._mapZuw.invalidateSize === 'function') {
              window._mapZuw.invalidateSize();
            }
            if (window._mapDetail && typeof window._mapDetail.invalidateSize === 'function') {
              window._mapDetail.invalidateSize();
            }
          } catch(e) {
            // Karte noch nicht initialisiert — kein Fehler
          }
          // Auch Leaflet-Karten über ID-Suche invalidieren
          ['mapMain','mapSozial','mapZuw','mapDetail'].forEach(id => {
            const el = document.getElementById(id);
            if (el && el._leaflet_map) {
              try { el._leaflet_map.invalidateSize(); } catch(e) {}
            }
          });
        }, 300);
      });
    });
    console.log('[v8-fixes] Pane-Switch-Patch aktiv');
  }

  // ═══════════════════════════════════════════════════
  //  3. SOZIALRAUMKARTE METRIK-WECHSEL (sozM Select)
  // ═══════════════════════════════════════════════════

  function patchSozialraumMetrik() {
    const sozMEl = document.getElementById('sozM');
    if (!sozMEl) {
      setTimeout(patchSozialraumMetrik, 500);
      return;
    }
    if (sozMEl._v8patched) return;
    sozMEl._v8patched = true;

    // Schätzungs-Hinweis für nicht-belegte Metriken
    const SCHAETZUNG_METRIKEN = new Set(['sozialindex','altersquotient','kaufkraft']);

    let hinweisEl = document.getElementById('sozMetrikHinweis');
    if (!hinweisEl) {
      hinweisEl = document.createElement('div');
      hinweisEl.id = 'sozMetrikHinweis';
      hinweisEl.style.cssText = 'font-size:.6rem;color:var(--warn);padding:2px 6px;background:var(--warn-bg);border-radius:4px;display:none;';
      hinweisEl.textContent = '⚠️ Schätzwert — keine amtliche Datenquelle';
      sozMEl.parentNode.insertBefore(hinweisEl, sozMEl.nextSibling);
    }

    const metrikFarben = {
      sozialindex:      ['#d7191c','#fdae61','#ffffbf','#a6d96a','#1a9641'],
      pflegebedarf:     ['#f7fbff','#c6dbef','#6baed6','#2171b5','#08306b'],
      versorgungslage:  ['#fff5f0','#fcbba1','#fc6d47','#d62728','#67000d'],
      altersquotient:   ['#f7f4f9','#d4b9da','#c994c7','#df65b0','#ce1256'],
      kaufkraft:        ['#ffffe5','#f7fcb9','#addd8e','#31a354','#006837']
    };

    sozMEl.addEventListener('change', function() {
      const metrik = this.value;
      const istSchaetzung = SCHAETZUNG_METRIKEN.has(metrik);
      hinweisEl.style.display = istSchaetzung ? 'block' : 'none';

      // Sozialraumkarte-Polygone umfärben wenn PLZ vorhanden
      if (typeof PLZ === 'undefined') return;
      const el = document.getElementById('mapSozial');
      if (!el || !el._leaflet_map) return;

      const lmap = el._leaflet_map;
      const farben = metrikFarben[metrik] || metrikFarben.sozialindex;

      lmap.eachLayer(layer => {
        if (layer.feature && layer.feature.properties && layer.feature.properties.plz) {
          const props = layer.feature.properties;
          let wert = props[metrik] || props.kunden_pro_1000_ew || 0;
          // Normalisierter Farbindex (0-4)
          const maxVals = {
            sozialindex: 10, pflegebedarf: 30, versorgungslage: 15,
            altersquotient: 40, kaufkraft: 100, kunden_pro_1000_ew: 20
          };
          const max = maxVals[metrik] || 20;
          const idx = Math.min(4, Math.floor((wert / max) * 5));
          if (layer.setStyle) {
            layer.setStyle({ fillColor: farben[idx], fillOpacity: 0.65 });
          }
        }
      });

      // Legende updaten
      const clTitle = document.getElementById('clTitle');
      const labels = {
        sozialindex: 'Sozialindex',
        pflegebedarf: 'Pflegebedarf',
        versorgungslage: 'Versorgungslage',
        altersquotient: 'Altersquotient',
        kaufkraft: 'Kaufkraft'
      };
      if (clTitle) clTitle.textContent = labels[metrik] || metrik;

      console.log('[v8-fixes] Sozialraum-Metrik gewechselt:', metrik, istSchaetzung ? '(Schätzwert)' : '');
    });

    console.log('[v8-fixes] Sozialraum-Metrik-Patch aktiv');
  }

  // ═══════════════════════════════════════════════════
  //  4. ZUWEISER-FILTER ANZEIGE VERBESSERN
  // ═══════════════════════════════════════════════════

  function patchZuweiserFilter() {
    if (typeof ZUW === 'undefined') {
      setTimeout(patchZuweiserFilter, 300);
      return;
    }
    const filterBtns = document.querySelectorAll('.zf');
    filterBtns.forEach(btn => {
      const f = btn.getAttribute('data-f');
      if (!f) return;
      let count = 0;
      if (f === 'all') {
        count = ZUW.length;
      } else if (f === 'A' || f === 'B') {
        count = ZUW.filter(z => z.pr === f).length;
      } else {
        count = ZUW.filter(z => z.art === f).length;
      }
      if (count > 0 && !btn.querySelector('.zf-cnt')) {
        const cnt = document.createElement('span');
        cnt.className = 'zf-cnt';
        cnt.style.cssText = 'margin-left:3px;opacity:.7;font-size:.9em;';
        cnt.textContent = '(' + count + ')';
        btn.appendChild(cnt);
      }
    });
    console.log('[v8-fixes] Zuweiser-Filter-Patch aktiv');
  }

  // ═══════════════════════════════════════════════════
  //  5. VIVENDI CSV-IMPORT-MODAL
  // ═══════════════════════════════════════════════════

  const IMPORT_CSS = `
  .import-modal{position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:20000;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px);}
  .import-modal.hidden{display:none;}
  .import-box{background:var(--surface);border-radius:var(--rl);padding:24px;width:560px;max-width:95vw;box-shadow:var(--shadow-l);border:1px solid var(--border);}
  .import-box h2{font-size:.95rem;font-weight:900;color:var(--text);margin-bottom:4px;display:flex;align-items:center;gap:8px;}
  .import-box h2 svg{width:16px;height:16px;color:var(--brand);}
  .import-tabs{display:flex;gap:2px;background:var(--bg);padding:2px;border-radius:8px;margin:12px 0;}
  .import-tab{flex:1;padding:6px;border:none;border-radius:6px;font-family:var(--font);font-size:.7rem;font-weight:700;color:var(--text3);cursor:pointer;background:transparent;transition:all .15s;text-align:center;}
  .import-tab.active{background:var(--surface);color:var(--brand);box-shadow:0 1px 3px rgba(0,0,0,.1);}
  .import-body{display:none;}.import-body.active{display:block;}
  .import-desc{font-size:.7rem;color:var(--text2);margin-bottom:10px;line-height:1.5;background:var(--bg);padding:8px;border-radius:var(--rs);border-left:3px solid var(--brand);}
  .import-dropzone{border:2px dashed var(--border);border-radius:var(--r);padding:24px;text-align:center;cursor:pointer;transition:all .2s;}
  .import-dropzone:hover,.import-dropzone.drag-over{border-color:var(--brand);background:var(--brand-bg);}
  .import-dropzone svg{width:28px;height:28px;color:var(--text4);margin-bottom:8px;}
  .import-dropzone p{font-size:.72rem;color:var(--text3);margin:0;}
  .import-dropzone input{display:none;}
  .import-preview{margin-top:10px;background:var(--bg);border-radius:var(--rs);padding:8px;max-height:150px;overflow-y:auto;font-size:.65rem;font-family:var(--mono);color:var(--text2);display:none;}
  .import-actions{display:flex;gap:6px;margin-top:14px;justify-content:flex-end;}
  .import-btn{padding:7px 16px;border-radius:var(--r);font-family:var(--font);font-size:.72rem;font-weight:700;cursor:pointer;border:none;}
  .import-btn-cancel{background:var(--bg);color:var(--text2);border:1px solid var(--border);}
  .import-btn-ok{background:var(--brand);color:#fff;}
  .import-btn-ok:disabled{opacity:.4;cursor:not-allowed;}
  .import-status{font-size:.65rem;color:var(--accent);margin-top:6px;min-height:16px;}
  .fab-import{bottom:70px;right:62px;background:linear-gradient(135deg,var(--accent),var(--brand));}
  `;

  function injectImportModal() {
    // CSS einfügen
    const style = document.createElement('style');
    style.textContent = IMPORT_CSS;
    document.head.appendChild(style);

    // Modal-HTML
    const modal = document.createElement('div');
    modal.id = 'importModal';
    modal.className = 'import-modal hidden';
    modal.innerHTML = `
      <div class="import-box">
        <h2><i data-lucide="upload"></i> Daten-Import (Vivendi / Diamant)</h2>
        <p style="font-size:.65rem;color:var(--text3);margin-bottom:0">Version: PRO v8 — Datenstand: Mai 2026</p>
        <div class="import-tabs">
          <button class="import-tab active" data-tab="vivendi">Vivendi PD (Klienten)</button>
          <button class="import-tab" data-tab="diamant">Diamant (Mitarbeiter)</button>
          <button class="import-tab" data-tab="manuell">Manuell / Paste</button>
        </div>
        <div class="import-body active" id="ib-vivendi">
          <div class="import-desc">
            <strong>Vivendi PD Export-Format:</strong> CSV-Export aus <em>Auswertung → Listenexport</em>.<br>
            Erwartete Spalten: <code>Klient-Nr, Station, PLZ, Leistungsbereich, Pflegegrad</code><br>
            Die Daten werden in das S[]-Array der App übernommen und alle Charts aktualisiert.
          </div>
          <div class="import-dropzone" id="dz-vivendi" onclick="document.getElementById('fi-vivendi').click()">
            <i data-lucide="file-spreadsheet"></i>
            <p>CSV-Datei aus Vivendi hier ablegen oder klicken</p>
            <p style="font-size:.6rem;margin-top:4px;">Unterstützte Formate: .csv, .txt (Semikolon- oder Komma-getrennt)</p>
            <input type="file" id="fi-vivendi" accept=".csv,.txt">
          </div>
          <div class="import-preview" id="prev-vivendi"></div>
          <div class="import-status" id="stat-vivendi"></div>
        </div>
        <div class="import-body" id="ib-diamant">
          <div class="import-desc">
            <strong>Diamant Mitarbeiter-Export:</strong> Export aus Diamant über <em>Personal → Mitarbeiterliste</em>.<br>
            Erwartete Spalten: <code>Kostenstelle (= Station), Mitarbeiter-Anzahl, Stellenplan-Soll</code><br>
            Aktualisiert den <code>t</code>-Wert (Teamgröße) je Station für die Effizienz-Berechnung.
          </div>
          <div class="import-dropzone" id="dz-diamant" onclick="document.getElementById('fi-diamant').click()">
            <i data-lucide="users"></i>
            <p>Diamant-CSV hier ablegen oder klicken</p>
            <p style="font-size:.6rem;margin-top:4px;">DATEV-kompatibles CSV oder Excel-Export als CSV</p>
            <input type="file" id="fi-diamant" accept=".csv,.txt,.xls,.xlsx">
          </div>
          <div class="import-preview" id="prev-diamant"></div>
          <div class="import-status" id="stat-diamant"></div>
        </div>
        <div class="import-body" id="ib-manuell">
          <div class="import-desc">
            Manuell Stations-Kennzahlen einfügen (JSON oder CSV-Zeile):<br>
            Format: <code>Stationsname;Kunden;Pflege;Beratung;Mitarbeiter</code>
          </div>
          <textarea id="manuell-input" style="width:100%;height:100px;font-family:var(--mono);font-size:.68rem;padding:8px;border:1px solid var(--border);border-radius:var(--rs);resize:vertical;background:var(--bg);color:var(--text);"
            placeholder="DR PT Mitte;97;42;55;8
DR PT Süd;73;35;38;6"></textarea>
          <div class="import-status" id="stat-manuell"></div>
        </div>
        <div class="import-actions">
          <button class="import-btn import-btn-cancel" onclick="window.closeImportModal()">Abbrechen</button>
          <button class="import-btn import-btn-ok" id="importOkBtn" onclick="window.executeImport()" disabled>Importieren</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    // FAB Import-Button
    const fab = document.createElement('button');
    fab.className = 'fab fab-import';
    fab.title = 'Daten importieren';
    fab.innerHTML = '<i data-lucide="upload"></i>';
    fab.onclick = () => window.openImportModal();
    document.body.appendChild(fab);

    // Tab-Switching
    modal.querySelectorAll('.import-tab').forEach(tab => {
      tab.addEventListener('click', function() {
        modal.querySelectorAll('.import-tab').forEach(t => t.classList.remove('active'));
        modal.querySelectorAll('.import-body').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const tabId = this.getAttribute('data-tab');
        const bodyEl = document.getElementById('ib-' + tabId);
        if (bodyEl) bodyEl.classList.add('active');
        window._importActiveTab = tabId;
      });
    });

    // Drag & Drop
    ['vivendi','diamant'].forEach(typ => {
      const dz = document.getElementById('dz-' + typ);
      const fi = document.getElementById('fi-' + typ);
      if (!dz || !fi) return;

      dz.addEventListener('dragover', e => { e.preventDefault(); dz.classList.add('drag-over'); });
      dz.addEventListener('dragleave', () => dz.classList.remove('drag-over'));
      dz.addEventListener('drop', e => {
        e.preventDefault();
        dz.classList.remove('drag-over');
        const file = e.dataTransfer.files[0];
        if (file) verarbeiteCSV(file, typ);
      });
      fi.addEventListener('change', e => {
        if (e.target.files[0]) verarbeiteCSV(e.target.files[0], typ);
      });
    });

    // Manuell-Input
    document.getElementById('manuell-input').addEventListener('input', function() {
      const ok = this.value.trim().length > 5;
      document.getElementById('importOkBtn').disabled = !ok;
      if (ok) window._importActiveTab = 'manuell';
    });

    if (window.lucide) window.lucide.createIcons();
    console.log('[v8-fixes] Import-Modal injiziert');
  }

  function verarbeiteCSV(file, typ) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const text = e.target.result;
      const lines = text.split(/\r?\n/).filter(l => l.trim());
      const preview = document.getElementById('prev-' + typ);
      const status = document.getElementById('stat-' + typ);

      preview.style.display = 'block';
      preview.textContent = lines.slice(0, 8).join('\n') + (lines.length > 8 ? `\n... (${lines.length - 8} weitere Zeilen)` : '');

      const header = lines[0].toLowerCase();
      const trenn = header.includes(';') ? ';' : ',';
      const cols = lines[0].split(trenn);

      window._pendingImport = { typ, lines, trenn, cols, file };
      document.getElementById('importOkBtn').disabled = false;

      if (typ === 'vivendi') {
        const keyCols = ['klient','station','plz','leistung','pflege'];
        const found = keyCols.filter(k => header.includes(k)).length;
        if (found >= 3) {
          status.textContent = `✅ Vivendi-Format erkannt — ${lines.length - 1} Klienten, ${cols.length} Spalten`;
          status.style.color = 'var(--success)';
        } else {
          status.textContent = `⚠️ Format nicht eindeutig erkannt (${cols.length} Spalten). Prüfe Trennzeichen und Spaltennamen.`;
          status.style.color = 'var(--warn)';
        }
      } else if (typ === 'diamant') {
        const keyCols = ['kostenstelle','mitarbeiter','stelle'];
        const found = keyCols.filter(k => header.includes(k)).length;
        status.textContent = found >= 2
          ? `✅ Diamant-Format erkannt — ${lines.length - 1} Einträge`
          : `⚠️ Spaltennamen nicht erkannt. Erwartet: Kostenstelle, Mitarbeiter-Anzahl`;
        status.style.color = found >= 2 ? 'var(--success)' : 'var(--warn)';
      }
    };
    reader.readAsText(file, 'UTF-8');
  }

  window.executeImport = function() {
    const tab = window._importActiveTab || 'vivendi';
    if (tab === 'manuell') {
      importManuell();
    } else if (window._pendingImport) {
      const { typ, lines, trenn, cols } = window._pendingImport;
      if (typ === 'vivendi') importVivendi(lines, trenn, cols);
      else if (typ === 'diamant') importDiamant(lines, trenn, cols);
    }
  };

  function importManuell() {
    const text = document.getElementById('manuell-input').value.trim();
    const lines = text.split(/\r?\n/).filter(l => l.trim());
    let updated = 0;
    lines.forEach(line => {
      const parts = line.split(';');
      if (parts.length < 2) return;
      const name = parts[0].trim();
      const idx = S.findIndex(s => s.n.toLowerCase() === name.toLowerCase());
      if (idx < 0) return;
      if (parts[1]) S[idx].c = parseInt(parts[1]) || S[idx].c;
      if (parts[2]) S[idx].p = parseInt(parts[2]) || S[idx].p;
      if (parts[3]) S[idx].b = parseInt(parts[3]) || S[idx].b;
      if (parts[4]) S[idx].t = parseInt(parts[4]) || S[idx].t;
      updated++;
    });
    if (window.toast) toast(`${updated} Station(en) aktualisiert`, updated > 0 ? 'ok' : 'warn');
    berechneDynamischeKPIs();
    window.closeImportModal();
  }

  function importVivendi(lines, trenn, cols) {
    const header = lines[0].toLowerCase().split(trenn);
    const iStation = header.findIndex(h => h.includes('station'));
    const iPlege = header.findIndex(h => h.includes('pflege') || h.includes('leistung'));

    if (iStation < 0) {
      if (window.toast) toast('Spalte "Station" nicht gefunden. Import abgebrochen.', 'err');
      return;
    }

    const stationCount = {};
    const stationPflege = {};

    lines.slice(1).forEach(line => {
      const parts = line.split(trenn);
      const stn = (parts[iStation] || '').trim();
      if (!stn) return;
      stationCount[stn] = (stationCount[stn] || 0) + 1;
      const isPflege = iPlege >= 0 && parts[iPlege] && parts[iPlege].toLowerCase().includes('pflege');
      if (isPflege) stationPflege[stn] = (stationPflege[stn] || 0) + 1;
    });

    let updated = 0;
    Object.entries(stationCount).forEach(([stn, cnt]) => {
      const idx = S.findIndex(s => s.n.toLowerCase().includes(stn.toLowerCase()) ||
        stn.toLowerCase().includes(s.n.toLowerCase().substring(0, 6)));
      if (idx >= 0) {
        S[idx].c = cnt;
        if (stationPflege[stn]) S[idx].p = stationPflege[stn];
        S[idx].b = cnt - (S[idx].p || 0);
        updated++;
      }
    });

    if (window.toast) toast(`Vivendi-Import: ${lines.length - 1} Klienten, ${updated} Stationen aktualisiert`, 'ok');
    berechneDynamischeKPIs();
    window.closeImportModal();
    console.log('[v8-fixes] Vivendi-Import abgeschlossen:', stationCount);
  }

  function importDiamant(lines, trenn, cols) {
    const header = lines[0].toLowerCase().split(trenn);
    const iKst = header.findIndex(h => h.includes('kosten') || h.includes('station'));
    const iMA = header.findIndex(h => h.includes('mitarb') || h.includes('anzahl') || h.includes('kopf'));

    if (iKst < 0 || iMA < 0) {
      if (window.toast) toast('Spalten "Kostenstelle" und/oder "Mitarbeiter" nicht gefunden.', 'err');
      return;
    }

    let updated = 0;
    lines.slice(1).forEach(line => {
      const parts = line.split(trenn);
      const kst = (parts[iKst] || '').trim();
      const ma = parseInt(parts[iMA]) || 0;
      if (!kst || !ma) return;
      const idx = S.findIndex(s => s.n.toLowerCase().includes(kst.toLowerCase()) ||
        kst.toLowerCase().includes(s.n.toLowerCase().substring(0, 5)));
      if (idx >= 0) {
        S[idx].t = ma;
        updated++;
      }
    });

    if (window.toast) toast(`Diamant-Import: ${updated} Stationen aktualisiert`, 'ok');
    berechneDynamischeKPIs();
    window.closeImportModal();
    console.log('[v8-fixes] Diamant-Import abgeschlossen, aktualisiert:', updated);
  }

  window.openImportModal = function() {
    const modal = document.getElementById('importModal');
    if (modal) {
      modal.classList.remove('hidden');
      window._importActiveTab = 'vivendi';
    }
  };

  window.closeImportModal = function() {
    const modal = document.getElementById('importModal');
    if (modal) {
      modal.classList.add('hidden');
      // Reset
      document.getElementById('importOkBtn').disabled = true;
      ['vivendi','diamant'].forEach(t => {
        const prev = document.getElementById('prev-' + t);
        const stat = document.getElementById('stat-' + t);
        if (prev) { prev.style.display='none'; prev.textContent=''; }
        if (stat) stat.textContent='';
        const fi = document.getElementById('fi-' + t);
        if (fi) fi.value = '';
      });
      const mi = document.getElementById('manuell-input');
      if (mi) mi.value = '';
      window._pendingImport = null;
    }
  };

  // Schließen bei Klick auf Overlay
  document.addEventListener('click', e => {
    if (e.target && e.target.id === 'importModal') window.closeImportModal();
  });

  // Keyboard-Shortcut
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') window.closeImportModal();
  });

  // ═══════════════════════════════════════════════════
  //  6. MBCLOC FIX: Prüfen ob Map initialisiert
  // ═══════════════════════════════════════════════════

  function patchMbLoc() {
    const mbLoc = document.getElementById('mbLoc');
    if (!mbLoc || mbLoc._v8patched) return;
    mbLoc._v8patched = true;
    const orig = mbLoc.onclick;
    mbLoc.onclick = function(e) {
      try {
        if (orig) orig.call(this, e);
      } catch(err) {
        // Karte nicht bereit — versuche über _leaflet_map
        const el = document.getElementById('mapMain');
        if (el && el._leaflet_map) {
          el._leaflet_map.setView([51.477, 7.215], 12);
        }
      }
    };
  }

  // ═══════════════════════════════════════════════════
  //  7. INITIALISIERUNG
  // ═══════════════════════════════════════════════════

  function init() {
    // Warte auf DOMContentLoaded + kurze Verzögerung für Haupt-Script
    setTimeout(() => {
      berechneDynamischeKPIs();
      patchPaneSwitch();
      patchSozialraumMetrik();
      patchZuweiserFilter();
      patchMbLoc();
      injectImportModal();
      if (window.lucide) window.lucide.createIcons();
      console.log('[v8-fixes] Alle Patches aktiv — Diakonie Ruhr Geoanalyse v8');
    }, 800);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
