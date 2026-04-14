(async function () {
    'use strict';

    // =========================================================================
    //  STATE
    // =========================================================================
    const S = {
        players: {},
        npcs: {},
        playerStories: {},
        npcStories: {},
        selectedType: null,   // 'player' | 'npc'
        selectedId: null,
        activeTab: 'info',
        dirty: false,
    };

    // =========================================================================
    //  PV FORMULAS  (identical to existing codebase)
    // =========================================================================
    const PV_FORMULAS = {
        tanque:     { pvInicial: 15, pvPorNivel: 8 },
        lutador:    { pvInicial: 13, pvPorNivel: 7 },
        cacador:    { pvInicial: 10, pvPorNivel: 6 },
        feiticeiro: { pvInicial: 8,  pvPorNivel: 4 },
        genio:      { pvInicial: 7,  pvPorNivel: 3 },
    };

    function normalizeArchetype(arq) {
        return (arq || '').toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();
    }

    function calcPV(char, isNpc) {
        const arq = normalizeArchetype(char.info?.arquetipo);
        const f = PV_FORMULAS[arq];
        if (!f || !Array.isArray(char.atributos) || !char.atributos[0]) return;
        const nivel = Number(char.info?.nivel) || 0;
        const vig = char.atributos.find(a => a.sigla === 'VIG') || {};
        const vigor = Number(vig.valor) || 0;
        const prest = Math.max(1, Number(vig.prestigio) || 1);
        if (isNpc) {
            char.atributos[0].pv = f.pvInicial + (f.pvPorNivel * nivel) + vigor + (prest * 10);
        } else {
            char.atributos[0].pv = f.pvInicial + (f.pvPorNivel * nivel) + (vigor * prest);
        }
    }

    // =========================================================================
    //  DATA LOADING
    // =========================================================================
    async function loadFile(path) {
        const res = await fetch(path);
        if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
        return res.text();
    }

    async function loadAllData() {
        try {
            const [charText, npcText, charStoriesText, npcStoriesText] = await Promise.all([
                loadFile('../js/characters/data.js'),
                loadFile('../js/npcs/data.js'),
                loadFile('../js/characters/stories.js'),
                loadFile('../js/npcs/stories.js'),
            ]);

            // Characters — file defines `const data = {...}` then functions then forEach
            const charFn = new Function(charText + '\n; return data;');
            S.players = deepClone(charFn());

            // NPCs — file defines `const npcData = {...}` then functions then forEach
            const npcFn = new Function(npcText + '\n; return npcData;');
            S.npcs = deepClone(npcFn());

            // Character Stories — sets window.CHARACTER_STORIES
            const csFn = new Function('const window = {};\n' + charStoriesText + '\n; return window.CHARACTER_STORIES;');
            S.playerStories = deepClone(csFn() || {});

            // NPC Stories — sets window.NPC_STORIES
            const nsFn = new Function('const window = {};\n' + npcStoriesText + '\n; return window.NPC_STORIES;');
            S.npcStories = deepClone(nsFn() || {});

        } catch (e) {
            console.error('Load error:', e);
            document.getElementById('app').innerHTML =
                `<div class="loading" style="flex-direction:column;gap:12px;">
                    <p style="color:var(--danger);">Failed to load data files.</p>
                    <p style="font-size:13px;">${esc(e.message)}</p>
                    <p style="font-size:12px;color:var(--text-muted);">Make sure you are serving this directory via a local HTTP server (not file://).</p>
                </div>`;
            throw e;
        }
    }

    // =========================================================================
    //  UTILITIES
    // =========================================================================
    function deepClone(obj) { return JSON.parse(JSON.stringify(obj)); }
    function esc(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

    function markDirty() {
        S.dirty = true;
        document.getElementById('btn-save-all').textContent = 'Save All Files *';
    }

    function toast(msg, type = 'success') {
        const t = document.createElement('div');
        t.className = 'toast toast-' + type;
        t.textContent = msg;
        document.body.appendChild(t);
        setTimeout(() => t.remove(), 3000);
    }

    function getSelected() {
        if (!S.selectedType || !S.selectedId) return null;
        const store = S.selectedType === 'player' ? S.players : S.npcs;
        return store[S.selectedId] || null;
    }

    function getStoryStore() {
        return S.selectedType === 'player' ? S.playerStories : S.npcStories;
    }

    // =========================================================================
    //  SIDEBAR RENDERING
    // =========================================================================
    function renderSidebar() {
        renderEntityList('player-list', S.players, 'player');
        renderEntityList('npc-list', S.npcs, 'npc');
        document.getElementById('last-update').textContent = 'Last loaded: ' + new Date().toLocaleDateString('pt-BR');
    }

    function renderEntityList(elId, store, type) {
        const ul = document.getElementById(elId);
        ul.innerHTML = '';
        Object.keys(store).forEach(key => {
            const ch = store[key];
            const li = document.createElement('li');
            li.dataset.key = key;
            li.dataset.type = type;
            if (S.selectedType === type && S.selectedId === key) li.classList.add('active');
            li.innerHTML = `<span>${esc(ch.info?.nome || key)}</span><span class="entity-level">Lv ${ch.info?.nivel || '?'}</span>`;
            li.addEventListener('click', () => selectEntity(type, key));
            ul.appendChild(li);
        });
    }

    function selectEntity(type, key) {
        S.selectedType = type;
        S.selectedId = key;
        S.activeTab = 'info';
        renderSidebar();
        renderDetail();
    }

    // =========================================================================
    //  DETAIL RENDERING
    // =========================================================================
    function renderDetail() {
        const ch = getSelected();
        const emptyEl = document.getElementById('empty-state');
        const detailEl = document.getElementById('detail-view');

        if (!ch) {
            emptyEl.style.display = 'flex';
            detailEl.style.display = 'none';
            return;
        }

        emptyEl.style.display = 'none';
        detailEl.style.display = 'block';

        document.getElementById('detail-title').textContent = ch.info?.nome || S.selectedId;
        const badge = document.getElementById('detail-type-badge');
        badge.textContent = S.selectedType === 'player' ? 'Player' : 'NPC';
        badge.className = 'badge ' + (S.selectedType === 'player' ? 'badge-player' : 'badge-npc');

        // Set active tab
        document.querySelectorAll('.tab').forEach(t => {
            t.classList.toggle('active', t.dataset.tab === S.activeTab);
        });

        renderTabContent();
    }

    function renderTabContent() {
        const el = document.getElementById('tab-content');
        switch (S.activeTab) {
            case 'info': el.innerHTML = renderInfoTab(); break;
            case 'attributes': el.innerHTML = renderAttributesTab(); break;
            case 'skills': el.innerHTML = renderSkillsTab(); break;
            case 'abilities': el.innerHTML = renderAbilitiesTab(); break;
            case 'story': el.innerHTML = renderStoryTab(); break;
        }
        attachTabListeners();
    }

    // ---- INFO TAB ----
    function renderInfoTab() {
        const ch = getSelected();
        const info = ch.info || {};
        return `
        <div class="form-grid">
            <div class="form-group">
                <label>Identifier (nome_data)</label>
                <input type="text" value="${esc(info.nome_data || '')}" readonly>
                <small>Cannot be changed after creation</small>
            </div>
            <div class="form-group">
                <label>Display Name</label>
                <input type="text" value="${esc(info.nome || '')}" data-field="info.nome">
            </div>
            <div class="form-group">
                <label>Level (Nivel)</label>
                <input type="number" value="${info.nivel ?? ''}" data-field="info.nivel" min="1">
            </div>
            <div class="form-group">
                <label>XP</label>
                <input type="number" value="${info.xp ?? ''}" data-field="info.xp" min="0" max="100">
            </div>
            <div class="form-group">
                <label>Age (Idade)</label>
                <input type="text" value="${esc(String(info.idade ?? ''))}" data-field="info.idade">
            </div>
            <div class="form-group">
                <label>Height (Altura) cm</label>
                <input type="number" value="${info.altura ?? ''}" data-field="info.altura">
            </div>
            <div class="form-group">
                <label>Weight (Peso) kg</label>
                <input type="text" value="${esc(String(info.peso ?? ''))}" data-field="info.peso">
            </div>
            <div class="form-group">
                <label>Social Class (Classe)</label>
                <input type="text" value="${esc(info.classe || '')}" data-field="info.classe">
            </div>
            <div class="form-group">
                <label>Archetype (Arquetipo)</label>
                <select data-field="info.arquetipo">
                    <option value="" ${!info.arquetipo ? 'selected' : ''}>-</option>
                    ${[['Feiticeiro','Feiticeiro'],['Lutador','Lutador'],['Ca\u00e7ador','Cacador'],['Tanque','Tanque'],['G\u00eanio','Genio']].map(([label, val]) =>
                        `<option value="${label}" ${normalizeArchetype(info.arquetipo) === normalizeArchetype(val) ? 'selected' : ''}>${label}</option>`
                    ).join('')}
                </select>
                <small>PV is auto-calculated from archetype</small>
            </div>
            <div class="form-group">
                <label>Inspiration (Inspiracao)</label>
                <input type="text" value="${esc(String(info.inspiracao ?? ''))}" data-field="info.inspiracao">
            </div>
            <div class="form-group">
                <label>Discord ID</label>
                <input type="text" value="${esc(info.discord_id || '')}" data-field="info.discord_id">
            </div>
        </div>
        ${renderExtraInfoFields(info)}
        `;
    }

    // Render any extra fields not covered above
    function renderExtraInfoFields(info) {
        const known = ['nome_data','nome','inspiracao','nivel','xp','idade','altura','peso','classe','arquetipo','discord_id'];
        const extra = Object.keys(info).filter(k => !known.includes(k));
        if (!extra.length) return '';
        let html = '<div class="section-header"><h2>Extra Fields</h2></div><div class="form-grid">';
        extra.forEach(k => {
            html += `<div class="form-group">
                <label>${esc(k)}</label>
                <input type="text" value="${esc(String(info[k] ?? ''))}" data-field="info.${k}">
            </div>`;
        });
        return html + '</div>';
    }

    // ---- ATTRIBUTES TAB ----
    function renderAttributesTab() {
        const ch = getSelected();
        const isNpc = S.selectedType === 'npc';
        const pvPs = ch.atributos[0] || {};

        // Recalculate PV
        calcPV(ch, isNpc);
        const calculatedPV = ch.atributos[0]?.pv;

        let html = `
        <div class="pv-ps-bar">
            <div class="pv-ps-item pv">
                <div class="pv-ps-label">PV (Auto)</div>
                <div class="pv-ps-value">${calculatedPV ?? '?'}</div>
            </div>
            <div class="pv-ps-item ps">
                <div class="pv-ps-label">PS</div>
                <div>
                    <input type="text" value="${esc(String(pvPs.ps ?? ''))}" data-field="atributos.0.ps"
                        style="width:80px;text-align:center;font-size:22px;font-weight:700;background:var(--bg-input);border:1px solid var(--border);border-radius:6px;color:#55aaff;">
                </div>
            </div>
        </div>
        <div class="attr-grid">`;

        for (let i = 1; i < ch.atributos.length; i++) {
            const a = ch.atributos[i];
            html += `
            <div class="attr-card">
                <div class="attr-card-header">
                    <span class="attr-sigla">${esc(a.sigla || '')}</span>
                    <span class="attr-nome">${esc(a.nome || '')}</span>
                </div>
                <div class="form-grid cols-3">
                    <div class="form-group">
                        <label>Value</label>
                        <input type="number" value="${a.valor ?? 0}" data-field="atributos.${i}.valor" data-recalc="1">
                    </div>
                    <div class="form-group">
                        <label>Bonus</label>
                        <input type="number" value="${a.bonus ?? ''}" data-field="atributos.${i}.bonus">
                    </div>
                    <div class="form-group">
                        <label>Prestige</label>
                        <input type="number" value="${a.prestigio ?? ''}" data-field="atributos.${i}.prestigio" min="0" max="5" data-recalc="1">
                    </div>
                </div>
            </div>`;
        }

        html += '</div>';
        return html;
    }

    // ---- SKILLS TAB ----
    function renderSkillsTab() {
        const ch = getSelected();
        let html = '<div class="section-header"><h2>Skills (Pericias)</h2><button class="btn-small btn-add" id="btn-add-skill-group">+ Skill Group</button></div>';

        (ch.pericias || []).forEach((group, gi) => {
            html += `<div class="skill-group" data-group="${gi}">
                <div class="skill-group-header">
                    <h3>
                        <select data-field="pericias.${gi}.atributo" style="background:var(--bg-input);border:1px solid var(--border);border-radius:4px;color:var(--accent);padding:2px 6px;font-weight:600;">
                            ${['FOR','VIG','AGL','INT','ESP','MAG'].map(s =>
                                `<option value="${s}" ${group.atributo===s?'selected':''}>${s}</option>`
                            ).join('')}
                        </select>
                    </h3>
                    <div style="display:flex;gap:6px;">
                        <button class="btn-small btn-add btn-add-skill" data-group="${gi}">+ Skill</button>
                        <button class="btn-small btn-remove btn-remove-skill-group" data-group="${gi}">Remove Group</button>
                    </div>
                </div>
                <div style="display:grid;grid-template-columns:2fr 1fr 1fr 30px;gap:4px;margin-bottom:6px;">
                    <small style="color:var(--text-muted)">Name</small><small style="color:var(--text-muted)">Value</small><small style="color:var(--text-muted)">Bonus</small><small></small>
                </div>`;

            (group.pericia_valor || []).forEach((sk, si) => {
                html += `<div class="skill-row">
                    <input type="text" value="${esc(sk.nome || '')}" data-field="pericias.${gi}.pericia_valor.${si}.nome">
                    <input type="number" value="${sk.valor ?? 0}" data-field="pericias.${gi}.pericia_valor.${si}.valor" min="0" max="15">
                    <input type="number" value="${sk.bonus ?? ''}" data-field="pericias.${gi}.pericia_valor.${si}.bonus">
                    <button class="btn-small btn-remove btn-remove-skill" data-group="${gi}" data-skill="${si}" title="Remove">&times;</button>
                </div>`;
            });

            html += '</div>';
        });

        return html;
    }

    // ---- ABILITIES TAB ----
    function renderAbilitiesTab() {
        const ch = getSelected();
        let html = '<div class="section-header"><h2>Abilities (Habilidades)</h2><button class="btn-small btn-add" id="btn-add-ability">+ Ability</button></div>';

        (ch.habilidades || []).forEach((ab, ai) => {
            html += `<div class="ability-card" data-ability="${ai}">
                <div class="ability-card-header">
                    <h3 contenteditable="false">${esc(ab.nome || 'Unnamed')}</h3>
                    <button class="btn-small btn-remove btn-remove-ability" data-ability="${ai}">&times;</button>
                </div>
                <div class="form-grid cols-3">
                    <div class="form-group">
                        <label>Name</label>
                        <input type="text" value="${esc(ab.nome || '')}" data-field="habilidades.${ai}.nome">
                    </div>
                    <div class="form-group">
                        <label>Grimoire</label>
                        <input type="text" value="${esc(ab.grimorio || '')}" data-field="habilidades.${ai}.grimorio">
                    </div>
                    <div class="form-group">
                        <label>Level</label>
                        <input type="text" value="${esc(String(ab.nivel ?? ''))}" data-field="habilidades.${ai}.nivel">
                    </div>
                </div>
                <div class="form-grid" style="margin-top:8px;">
                    <div class="form-group full-width">
                        <label>Description</label>
                        <textarea data-field="habilidades.${ai}.descricao" rows="3">${esc(ab.descricao || '')}</textarea>
                    </div>
                </div>
                <div class="form-grid cols-3" style="margin-top:8px;">
                    <div class="form-group">
                        <label>Damage Formula</label>
                        <input type="text" value="${esc(formatDano(ab.dano))}" data-field="habilidades.${ai}.dano" placeholder="e.g. 1dMag + Mana">
                    </div>
                    <div class="form-group">
                        <label>Calc: Attribute</label>
                        <input type="text" value="${esc(ab.calculoDano?.atributo || '')}" data-field="habilidades.${ai}.calculoDano.atributo" placeholder="MAG, FOR, AGL...">
                    </div>
                    <div class="form-group">
                        <label>Calc: Skill(s)</label>
                        <input type="text" value="${esc(formatCalcSkills(ab.calculoDano))}" data-field="habilidades.${ai}.calculoDano._skills" placeholder="Mana, Grimorio...">
                        <small>Comma-separated</small>
                    </div>
                </div>
                <div class="form-group" style="margin-top:8px;">
                    <label>Effects</label>
                    <input type="text" value="${esc(formatEffects(ab.efeitos))}" data-field="habilidades.${ai}.efeitos" placeholder="[DEBUFF], [AREA], ...">
                    <small>Comma-separated tags</small>
                </div>
                ${renderSubataques(ab, ai)}
            </div>`;
        });

        return html;
    }

    function formatDano(d) {
        if (Array.isArray(d)) return d.join(', ');
        return String(d || '');
    }

    function formatCalcSkills(cd) {
        if (!cd) return '';
        if (Array.isArray(cd.pericias)) return cd.pericias.join(', ');
        if (cd.pericia) return cd.pericia;
        return '';
    }

    function formatEffects(ef) {
        if (!ef) return '';
        if (Array.isArray(ef)) return ef.join(', ');
        return String(ef);
    }

    function renderSubataques(ab, ai) {
        if (!ab.subataques && !ab._showSubs) {
            return `<div style="margin-top:10px;"><button class="btn-small btn-add btn-add-subataque" data-ability="${ai}">+ Sub-attack</button></div>`;
        }
        let html = `<div style="margin-top:12px;border-top:1px solid var(--border);padding-top:10px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                <strong style="font-size:13px;">Sub-attacks</strong>
                <button class="btn-small btn-add btn-add-subataque" data-ability="${ai}">+ Sub-attack</button>
            </div>`;

        (ab.subataques || []).forEach((sub, si) => {
            html += `<div class="subataque-card">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                    <h4>${esc(sub.nome || 'Unnamed')}</h4>
                    <button class="btn-small btn-remove btn-remove-sub" data-ability="${ai}" data-sub="${si}">&times;</button>
                </div>
                <div class="form-grid cols-3" style="gap:8px;">
                    <div class="form-group"><label>Name</label>
                        <input type="text" value="${esc(sub.nome || '')}" data-field="habilidades.${ai}.subataques.${si}.nome"></div>
                    <div class="form-group"><label>Damage</label>
                        <input type="text" value="${esc(formatDano(sub.dano))}" data-field="habilidades.${ai}.subataques.${si}.dano"></div>
                    <div class="form-group"><label>Effects</label>
                        <input type="text" value="${esc(formatEffects(sub.efeitos))}" data-field="habilidades.${ai}.subataques.${si}.efeitos"></div>
                </div>
                <div class="form-grid cols-3" style="gap:8px;margin-top:6px;">
                    <div class="form-group"><label>Calc Attr</label>
                        <input type="text" value="${esc(sub.calculoDano?.atributo || '')}" data-field="habilidades.${ai}.subataques.${si}.calculoDano.atributo"></div>
                    <div class="form-group"><label>Calc Skill(s)</label>
                        <input type="text" value="${esc(formatCalcSkills(sub.calculoDano))}" data-field="habilidades.${ai}.subataques.${si}.calculoDano._skills"></div>
                </div>
                <div class="form-group" style="margin-top:6px;"><label>Description</label>
                    <textarea data-field="habilidades.${ai}.subataques.${si}.descricao" rows="2">${esc(sub.descricao || '')}</textarea></div>
            </div>`;
        });

        return html + '</div>';
    }

    // ---- STORY TAB ----
    function renderStoryTab() {
        const storyStore = getStoryStore();
        const story = storyStore[S.selectedId] || '';
        const ch = getSelected();
        const nomeData = ch.info?.nome_data || S.selectedId;
        // All images live under media/characters/ for both players and NPCs
        const basePath = 'characters';

        // Extract images from story HTML
        const images = extractStoryImages(story);

        let html = `<div class="story-editor">
            <div class="section-header"><h2>Story Images</h2></div>
            <div class="story-images">`;

        // Show existing images + empty slots up to 4
        for (let i = 0; i < Math.max(images.length + 1, 2); i++) {
            const img = images[i];
            if (img) {
                html += `<div class="story-image-slot" data-img-idx="${i}">
                    <img src="../${img}" alt="" onerror="this.style.display='none'">
                    <button class="remove-img" data-img-idx="${i}">&times;</button>
                </div>`;
            } else {
                html += `<div class="story-image-slot" data-img-idx="${i}">
                    <span>+ Image</span>
                    <small>Path relative to media/</small>
                    <input type="text" class="img-path-input" data-img-idx="${i}"
                        placeholder="characters/${nomeData}/${nomeData}-${i+1}.png"
                        style="position:absolute;bottom:4px;width:90%;font-size:10px;padding:2px 4px;background:var(--bg-dark);border:1px solid var(--border);border-radius:4px;color:var(--text);">
                </div>`;
            }
        }

        html += `<div class="story-image-slot" style="border-color:var(--accent);cursor:pointer;" id="btn-add-story-image">
                <span style="color:var(--accent);">+ Add Image Slot</span>
            </div>`;

        html += `</div>
            <div class="section-header"><h2>Story Content (HTML)</h2></div>
            <textarea class="story-html-editor" id="story-editor">${esc(stripImagesFromStory(story))}</textarea>
            <div style="margin-top:12px;">
                <button class="btn-primary" id="btn-save-story">Update Story</button>
            </div>
        </div>`;

        return html;
    }

    function extractStoryImages(html) {
        const imgs = [];
        const re = /<img\s+src="([^"]*)"[^>]*>/gi;
        let m;
        while ((m = re.exec(html))) {
            let src = m[1];
            // Normalize relative paths
            if (src.startsWith('../../')) src = src.slice(6);
            imgs.push(src);
        }
        return imgs;
    }

    function stripImagesFromStory(html) {
        // Remove the images-container div and its contents
        return (html || '').replace(/<div\s+class="images-container">[\s\S]*?<\/div>/gi, '').trim();
    }

    function buildStoryHtml(images, bodyHtml) {
        let html = '';
        if (images.length > 0) {
            html += '\n<div class="images-container">\n';
            images.forEach(src => {
                html += `        <img src="../../${src}" alt="">\n`;
            });
            html += '    </div>\n';
        }
        if (bodyHtml.trim()) {
            html += '\n' + bodyHtml.trim() + '\n';
        }
        return html;
    }

    // =========================================================================
    //  EVENT HANDLING
    // =========================================================================
    function attachTabListeners() {
        // Data-field inputs: auto-save on change
        document.querySelectorAll('[data-field]').forEach(el => {
            const ev = el.tagName === 'SELECT' ? 'change' : 'input';
            el.addEventListener(ev, () => {
                setField(el.dataset.field, el.value, !!el.dataset.recalc);
            });
        });

        // Skill management buttons
        document.querySelectorAll('.btn-add-skill').forEach(btn => {
            btn.addEventListener('click', () => addSkill(Number(btn.dataset.group)));
        });
        document.querySelectorAll('.btn-remove-skill').forEach(btn => {
            btn.addEventListener('click', () => removeSkill(Number(btn.dataset.group), Number(btn.dataset.skill)));
        });
        document.querySelectorAll('.btn-remove-skill-group').forEach(btn => {
            btn.addEventListener('click', () => removeSkillGroup(Number(btn.dataset.group)));
        });
        const addGroupBtn = document.getElementById('btn-add-skill-group');
        if (addGroupBtn) addGroupBtn.addEventListener('click', addSkillGroup);

        // Ability management
        document.querySelectorAll('.btn-remove-ability').forEach(btn => {
            btn.addEventListener('click', () => removeAbility(Number(btn.dataset.ability)));
        });
        document.querySelectorAll('.btn-add-subataque').forEach(btn => {
            btn.addEventListener('click', () => addSubataque(Number(btn.dataset.ability)));
        });
        document.querySelectorAll('.btn-remove-sub').forEach(btn => {
            btn.addEventListener('click', () => removeSubataque(Number(btn.dataset.ability), Number(btn.dataset.sub)));
        });
        const addAbBtn = document.getElementById('btn-add-ability');
        if (addAbBtn) addAbBtn.addEventListener('click', addAbility);

        // Story
        const saveStoryBtn = document.getElementById('btn-save-story');
        if (saveStoryBtn) saveStoryBtn.addEventListener('click', saveStory);

        // Image slots
        document.querySelectorAll('.remove-img').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                removeStoryImage(Number(btn.dataset.imgIdx));
            });
        });
        document.querySelectorAll('.img-path-input').forEach(inp => {
            inp.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    addStoryImageByPath(inp.value.trim());
                }
            });
        });
        const addImgBtn = document.getElementById('btn-add-story-image');
        if (addImgBtn) addImgBtn.addEventListener('click', () => renderTabContent());
    }

    // =========================================================================
    //  FIELD SETTING (generic path setter)
    // =========================================================================
    function setField(path, value, recalc) {
        const ch = getSelected();
        if (!ch) return;

        const parts = path.split('.');
        let obj = ch;

        // Handle special skill calc path
        if (path.endsWith('.calculoDano._skills')) {
            const abPath = parts.slice(0, -2);
            let target = ch;
            abPath.forEach(p => { target = target[isNaN(p) ? p : Number(p)]; });
            if (!target.calculoDano) target.calculoDano = {};
            const skills = value.split(',').map(s => s.trim()).filter(Boolean);
            if (skills.length === 0) {
                delete target.calculoDano.pericia;
                delete target.calculoDano.pericias;
            } else if (skills.length === 1) {
                target.calculoDano.pericia = skills[0];
                delete target.calculoDano.pericias;
            } else {
                delete target.calculoDano.pericia;
                target.calculoDano.pericias = skills;
            }
            markDirty();
            return;
        }

        // Handle effects field
        if (path.endsWith('.efeitos')) {
            const container = parts.slice(0, -1);
            let target = ch;
            container.forEach(p => { target = target[isNaN(p) ? p : Number(p)]; });
            const val = value.trim();
            if (!val) {
                target.efeitos = [];
            } else {
                // Parse comma-separated, keeping bracket tags together
                target.efeitos = val.split(',').map(s => s.trim()).filter(Boolean);
            }
            markDirty();
            return;
        }

        // Generic path traversal
        for (let i = 0; i < parts.length - 1; i++) {
            const key = isNaN(parts[i]) ? parts[i] : Number(parts[i]);
            if (obj[key] === undefined || obj[key] === null) obj[key] = {};
            obj = obj[key];
        }

        const lastKey = isNaN(parts[parts.length-1]) ? parts[parts.length-1] : Number(parts[parts.length-1]);

        // Auto-detect type
        let finalVal = value;
        const numFields = ['nivel','xp','altura','valor','bonus','prestigio','inspiracao','peso'];
        if (numFields.includes(String(lastKey))) {
            if (value === '' || value === undefined) {
                finalVal = undefined;
            } else {
                const n = Number(value);
                finalVal = isNaN(n) ? value : n;
            }
        }

        if (finalVal === undefined || finalVal === '') {
            // For numeric fields, remove or set to empty
            if (numFields.includes(String(lastKey))) {
                delete obj[lastKey];
            } else {
                obj[lastKey] = '';
            }
        } else {
            obj[lastKey] = finalVal;
        }

        markDirty();

        // Recalculate PV if needed
        if (recalc || lastKey === 'arquetipo' || lastKey === 'nivel') {
            calcPV(ch, S.selectedType === 'npc');
            // Update PV display if on attributes tab
            const pvDisplay = document.querySelector('.pv-ps-item.pv .pv-ps-value');
            if (pvDisplay) pvDisplay.textContent = ch.atributos[0]?.pv ?? '?';
        }

        // Update header title
        if (path === 'info.nome') {
            document.getElementById('detail-title').textContent = value;
            renderSidebar();
        }
        if (path === 'info.nivel') {
            renderSidebar();
        }
    }

    // =========================================================================
    //  CRUD OPERATIONS
    // =========================================================================
    function addSkillGroup() {
        const ch = getSelected();
        if (!ch.pericias) ch.pericias = [];
        ch.pericias.push({ atributo: 'MAG', pericia_valor: [{ nome: 'New Skill', valor: 0 }] });
        markDirty();
        renderTabContent();
    }

    function removeSkillGroup(gi) {
        const ch = getSelected();
        ch.pericias.splice(gi, 1);
        markDirty();
        renderTabContent();
    }

    function addSkill(gi) {
        const ch = getSelected();
        ch.pericias[gi].pericia_valor.push({ nome: '', valor: 0 });
        markDirty();
        renderTabContent();
    }

    function removeSkill(gi, si) {
        const ch = getSelected();
        ch.pericias[gi].pericia_valor.splice(si, 1);
        markDirty();
        renderTabContent();
    }

    function addAbility() {
        const ch = getSelected();
        if (!ch.habilidades) ch.habilidades = [];
        ch.habilidades.push({
            nome: 'New Ability',
            grimorio: 'Sem Grimorio',
            nivel: 1,
            descricao: '',
            dano: '',
            calculoDano: { atributo: '' },
            efeitos: []
        });
        markDirty();
        renderTabContent();
    }

    function removeAbility(ai) {
        const ch = getSelected();
        ch.habilidades.splice(ai, 1);
        markDirty();
        renderTabContent();
    }

    function addSubataque(ai) {
        const ch = getSelected();
        const ab = ch.habilidades[ai];
        if (!ab.subataques) ab.subataques = [];
        ab.subataques.push({
            nome: '',
            descricao: '',
            dano: '',
            calculoDano: { atributo: '' },
            efeitos: ''
        });
        markDirty();
        renderTabContent();
    }

    function removeSubataque(ai, si) {
        const ch = getSelected();
        ch.habilidades[ai].subataques.splice(si, 1);
        if (ch.habilidades[ai].subataques.length === 0) {
            delete ch.habilidades[ai].subataques;
        }
        markDirty();
        renderTabContent();
    }

    // ---- Story Operations ----
    function saveStory() {
        const editor = document.getElementById('story-editor');
        if (!editor) return;
        const bodyHtml = editor.value;
        const storyStore = getStoryStore();
        const currentStory = storyStore[S.selectedId] || '';
        const images = extractStoryImages(currentStory);
        storyStore[S.selectedId] = buildStoryHtml(images, bodyHtml);
        markDirty();
        toast('Story updated');
    }

    function removeStoryImage(idx) {
        const storyStore = getStoryStore();
        const story = storyStore[S.selectedId] || '';
        const images = extractStoryImages(story);
        images.splice(idx, 1);
        const body = stripImagesFromStory(story);
        storyStore[S.selectedId] = buildStoryHtml(images, body);
        markDirty();
        renderTabContent();
    }

    function addStoryImageByPath(path) {
        if (!path) return;
        const storyStore = getStoryStore();
        const story = storyStore[S.selectedId] || '';
        const images = extractStoryImages(story);
        images.push(path);
        const body = stripImagesFromStory(story);
        storyStore[S.selectedId] = buildStoryHtml(images, body);
        markDirty();
        renderTabContent();
    }

    // ---- Create / Delete ----
    function showCreateDialog(type) {
        document.getElementById('create-title').textContent = type === 'player' ? 'Create New Player' : 'Create New NPC';
        document.getElementById('create-id').value = '';
        document.getElementById('create-name').value = '';
        document.getElementById('create-dialog').style.display = 'flex';

        const okBtn = document.getElementById('create-ok');
        const cancelBtn = document.getElementById('create-cancel');

        const handler = () => {
            const id = document.getElementById('create-id').value.trim().toLowerCase().replace(/\s+/g, '_');
            const name = document.getElementById('create-name').value.trim();
            const arq = document.getElementById('create-archetype').value;

            if (!id) { toast('Identifier is required', 'error'); return; }
            if (!name) { toast('Name is required', 'error'); return; }

            const store = type === 'player' ? S.players : S.npcs;
            if (store[id]) { toast('Identifier already exists', 'error'); return; }

            // Create with default structure matching existing schema
            store[id] = {
                info: {
                    nome_data: id,
                    nome: name,
                    inspiracao: 0,
                    nivel: 1,
                    xp: 0,
                    idade: '',
                    altura: 0,
                    peso: 0,
                    classe: '-',
                    arquetipo: arq,
                    discord_id: ''
                },
                atributos: [
                    { pv: 0, ps: 0 },
                    { sigla: 'FOR', nome: 'Forca', valor: 0 },
                    { sigla: 'VIG', nome: 'Vigor', valor: 0 },
                    { sigla: 'AGL', nome: 'Agilidade', valor: 0 },
                    { sigla: 'INT', nome: 'Inteligencia', valor: 0 },
                    { sigla: 'ESP', nome: 'Espirito', valor: 0 },
                    { sigla: 'MAG', nome: 'Magia', valor: 0 },
                ],
                pericias: [],
                habilidades: []
            };

            calcPV(store[id], type === 'npc');

            // Create empty story
            const storyStore = type === 'player' ? S.playerStories : S.npcStories;
            storyStore[id] = '';

            markDirty();
            document.getElementById('create-dialog').style.display = 'none';
            selectEntity(type, id);
            renderSidebar();
            toast(`${name} created`);

            okBtn.removeEventListener('click', handler);
        };

        okBtn.addEventListener('click', handler);
        cancelBtn.onclick = () => {
            document.getElementById('create-dialog').style.display = 'none';
            okBtn.removeEventListener('click', handler);
        };
    }

    function showDeleteDialog() {
        const ch = getSelected();
        if (!ch) return;
        const name = ch.info?.nome || S.selectedId;

        document.getElementById('confirm-title').textContent = 'Delete ' + name + '?';
        document.getElementById('confirm-message').textContent = 'This will remove the character from the data. Changes are not final until you save files.';
        document.getElementById('confirm-dialog').style.display = 'flex';

        const okBtn = document.getElementById('confirm-ok');
        const cancelBtn = document.getElementById('confirm-cancel');

        const handler = () => {
            const store = S.selectedType === 'player' ? S.players : S.npcs;
            const storyStore = S.selectedType === 'player' ? S.playerStories : S.npcStories;
            delete store[S.selectedId];
            delete storyStore[S.selectedId];
            S.selectedId = null;
            S.selectedType = null;
            markDirty();
            renderSidebar();
            renderDetail();
            document.getElementById('confirm-dialog').style.display = 'none';
            toast(name + ' deleted');
            okBtn.removeEventListener('click', handler);
        };

        okBtn.addEventListener('click', handler);
        cancelBtn.onclick = () => {
            document.getElementById('confirm-dialog').style.display = 'none';
            okBtn.removeEventListener('click', handler);
        };
    }

    // =========================================================================
    //  FILE GENERATION
    // =========================================================================
    function jsStringify(val, indent, isTopLevel) {
        const pad = '    '.repeat(indent);
        const pad1 = '    '.repeat(indent + 1);

        if (val === null || val === undefined) return "''";
        if (typeof val === 'number') return String(val);
        if (typeof val === 'boolean') return String(val);

        if (typeof val === 'string') {
            // Use backticks for multi-line strings, single quotes otherwise
            if (val.includes('\n') || val.includes('`')) {
                return '`' + val.replace(/`/g, '\\`').replace(/\$/g, '\\$') + '`';
            }
            return "'" + val.replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
        }

        if (Array.isArray(val)) {
            if (val.length === 0) return '[]';

            // Check if it's a simple array (all primitives)
            const allPrimitive = val.every(v => typeof v !== 'object' || v === null);
            if (allPrimitive) {
                const items = val.map(v => jsStringify(v, 0)).join(', ');
                if (items.length < 80) return '[' + items + ']';
            }

            let s = '[\n';
            val.forEach((item, i) => {
                s += pad1 + jsStringify(item, indent + 1);
                if (i < val.length - 1) s += ',';
                s += '\n';
            });
            s += pad + ']';
            return s;
        }

        if (typeof val === 'object') {
            const keys = Object.keys(val);
            if (keys.length === 0) return '{}';

            // Single-line for small objects
            const isSmall = keys.length <= 4 && keys.every(k => typeof val[k] !== 'object' || val[k] === null);
            if (isSmall && !isTopLevel) {
                const pairs = keys.map(k => {
                    const v = val[k];
                    if (v === undefined) return null;
                    return safeKey(k) + ': ' + jsStringify(v, 0);
                }).filter(Boolean);
                const line = '{ ' + pairs.join(', ') + ' }';
                if (line.length < 100) return line;
            }

            let s = '{\n';
            keys.forEach((k, i) => {
                if (val[k] === undefined) return;
                s += pad1 + safeKey(k) + ': ' + jsStringify(val[k], indent + 1);
                if (i < keys.length - 1) s += ',';
                s += '\n';
            });
            s += pad + '}';
            return s;
        }

        return String(val);
    }

    function safeKey(k) {
        if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k)) return k;
        return "'" + k + "'";
    }

    function generateCharacterDataJs() {
        let js = 'const data = { \n';
        const keys = Object.keys(S.players);
        keys.forEach((key, idx) => {
            const ch = deepClone(S.players[key]);
            // Clean up undefined/empty fields
            cleanCharForExport(ch);
            js += '\n' + key + ': ' + jsStringify(ch, 0, true);
            if (idx < keys.length - 1) js += ', ';
            js += '\n';
        });
        js += '}\n';

        // Append PV calculation functions (from original)
        js += `
function normalizarArquetipo(arquetipo = '') {
    return arquetipo
        .toString()
        .normalize('NFD')
        .replace(/[\\u0300-\\u036f]/g, '')
        .trim()
        .toLowerCase();
}

function calcularPvAutomatico(personagem) {
    const formulasPV = {
        tanque: { pvInicial: 15, pvPorNivel: 8 },
        lutador: { pvInicial: 13, pvPorNivel: 7 },
        cacador: { pvInicial: 10, pvPorNivel: 6 },
        feiticeiro: { pvInicial: 8, pvPorNivel: 4 },
        genio: { pvInicial: 7, pvPorNivel: 3 },
    };

    const arquetipoNormalizado = normalizarArquetipo(personagem?.info?.arquetipo);
    const formula = formulasPV[arquetipoNormalizado];

    if (!formula || !Array.isArray(personagem?.atributos) || !personagem.atributos[0]) {
        return;
    }

    const nivel = Number(personagem.info?.nivel) || 0;
    const atributoVigor = personagem.atributos.find((atributo) => atributo.sigla === 'VIG') || {};
    const vigor = Number(atributoVigor.valor) || 0;
    const prestigioVigor = Math.max(1, Number(atributoVigor.prestigio) || 1);
    const vidaPorPontoDeVigor = prestigioVigor;

    personagem.atributos[0].pv =
        formula.pvInicial +
        (formula.pvPorNivel * nivel) +
        (vigor * vidaPorPontoDeVigor);
}

Object.values(data).forEach(calcularPvAutomatico);
`;
        return js;
    }

    function generateNpcDataJs() {
        let js = 'const npcData = {\n';
        const keys = Object.keys(S.npcs);
        keys.forEach((key, idx) => {
            const ch = deepClone(S.npcs[key]);
            cleanCharForExport(ch);
            js += '\n' + key + ': ' + jsStringify(ch, 0, true);
            if (idx < keys.length - 1) js += ',';
            js += '\n';
        });
        js += '\n};\n';

        // Append NPC PV formula (with the different calculation)
        js += `
function normalizarArquetipo(arquetipo = '') {
    return arquetipo
        .toString()
        .normalize('NFD')
        .replace(/[\\u0300-\\u036f]/g, '')
        .trim()
        .toLowerCase();
}

function calcularPvAutomatico(personagem) {
    const formulasPV = {
        tanque: { pvInicial: 15, pvPorNivel: 8 },
        lutador: { pvInicial: 13, pvPorNivel: 7 },
        cacador: { pvInicial: 10, pvPorNivel: 6 },
        feiticeiro: { pvInicial: 8, pvPorNivel: 4 },
        genio: { pvInicial: 7, pvPorNivel: 3 },
    };

    const arquetipoNormalizado = normalizarArquetipo(personagem?.info?.arquetipo);
    const formula = formulasPV[arquetipoNormalizado];

    if (!formula || !Array.isArray(personagem?.atributos) || !personagem.atributos[0]) {
        return;
    }

    const nivel = Number(personagem.info?.nivel) || 0;
    const atributoVigor = personagem.atributos.find((atributo) => atributo.sigla === 'VIG') || {};
    const vigor = Number(atributoVigor.valor) || 0;
    const prestigioVigor = Math.max(1, Number(atributoVigor.prestigio) || 1);
    const bonusVidaPorPrestigio = (prestigioVigor) * 10;

    personagem.atributos[0].pv =
        formula.pvInicial +
        (formula.pvPorNivel * nivel) +
        vigor +
        bonusVidaPorPrestigio;
}

Object.values(npcData).forEach(calcularPvAutomatico);
`;
        return js;
    }

    function cleanCharForExport(ch) {
        // Remove empty/undefined fields but keep structure
        if (ch.info) {
            Object.keys(ch.info).forEach(k => {
                if (ch.info[k] === undefined) delete ch.info[k];
            });
        }
        // Clean attributes — remove undefined bonus/prestigio
        if (ch.atributos) {
            ch.atributos.forEach(a => {
                if (a.bonus === undefined || a.bonus === '' || a.bonus === null) delete a.bonus;
                if (a.prestigio === undefined || a.prestigio === '' || a.prestigio === null) delete a.prestigio;
            });
        }
        // Clean skills — remove empty bonus
        if (ch.pericias) {
            ch.pericias.forEach(g => {
                (g.pericia_valor || []).forEach(sk => {
                    if (sk.bonus === undefined || sk.bonus === '' || sk.bonus === null) delete sk.bonus;
                });
            });
        }
        // Clean abilities
        if (ch.habilidades) {
            ch.habilidades.forEach(ab => {
                if (!ab.dano && ab.dano !== 0) delete ab.dano;
                if (ab.calculoDano) {
                    if (!ab.calculoDano.atributo && !ab.calculoDano.pericia && !ab.calculoDano.pericias) {
                        delete ab.calculoDano;
                    } else {
                        if (!ab.calculoDano.atributo) delete ab.calculoDano.atributo;
                        if (!ab.calculoDano.pericia) delete ab.calculoDano.pericia;
                        if (!ab.calculoDano.pericias || ab.calculoDano.pericias.length === 0) delete ab.calculoDano.pericias;
                    }
                    delete ab.calculoDano?._skills;
                }
                if (Array.isArray(ab.efeitos) && ab.efeitos.length === 0) delete ab.efeitos;
                if (ab.subataques) {
                    ab.subataques.forEach(sub => {
                        if (!sub.dano) delete sub.dano;
                        if (sub.calculoDano) {
                            if (!sub.calculoDano.atributo) delete sub.calculoDano;
                            delete sub.calculoDano?._skills;
                        }
                        if (!sub.efeitos) delete sub.efeitos;
                    });
                }
                delete ab._showSubs;
            });
        }
    }

    function generateCharacterStoriesJs() {
        let js = 'window.CHARACTER_STORIES = {\n';
        const keys = Object.keys(S.playerStories);
        keys.forEach((key, idx) => {
            const story = S.playerStories[key];
            const escaped = (story || '').replace(/`/g, '\\`').replace(/\$/g, '\\$');
            js += '    ' + safeKey(key) + ': `' + escaped + '`';
            if (idx < keys.length - 1) js += ',';
            js += '\n';
        });
        js += '};\n';
        return js;
    }

    function generateNpcStoriesJs() {
        let js = 'window.NPC_STORIES = {\n';
        const keys = Object.keys(S.npcStories);
        keys.forEach((key, idx) => {
            const story = S.npcStories[key];
            const escaped = (story || '').replace(/`/g, '\\`').replace(/\$/g, '\\$');
            js += '    ' + safeKey(key) + ': `' + escaped + '`';
            if (idx < keys.length - 1) js += ',';
            js += '\n';
        });
        js += '};\n';
        return js;
    }

    function downloadFile(filename, content) {
        const blob = new Blob([content], { type: 'text/javascript;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }

    function saveAllFiles() {
        try {
            downloadFile('characters--data.js', generateCharacterDataJs());
            setTimeout(() => downloadFile('npcs--data.js', generateNpcDataJs()), 300);
            setTimeout(() => downloadFile('characters--stories.js', generateCharacterStoriesJs()), 600);
            setTimeout(() => downloadFile('npcs--stories.js', generateNpcStoriesJs()), 900);

            S.dirty = false;
            document.getElementById('btn-save-all').textContent = 'Save All Files';
            toast('4 files downloaded. Rename and replace: characters--*.js -> js/characters/, npcs--*.js -> js/npcs/');
        } catch (e) {
            toast('Save failed: ' + e.message, 'error');
            console.error(e);
        }
    }

    // =========================================================================
    //  GLOBAL EVENT SETUP
    // =========================================================================
    function setupEvents() {
        // Tab switching
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', () => {
                S.activeTab = tab.dataset.tab;
                renderDetail();
            });
        });

        // Create buttons
        document.getElementById('btn-create-player').addEventListener('click', () => showCreateDialog('player'));
        document.getElementById('btn-create-npc').addEventListener('click', () => showCreateDialog('npc'));

        // Delete button
        document.getElementById('btn-delete').addEventListener('click', showDeleteDialog);

        // Save all
        document.getElementById('btn-save-all').addEventListener('click', saveAllFiles);

        // Warn on page leave if dirty
        window.addEventListener('beforeunload', (e) => {
            if (S.dirty) {
                e.preventDefault();
                e.returnValue = '';
            }
        });
    }

    // =========================================================================
    //  INIT
    // =========================================================================
    document.getElementById('app').innerHTML = '<div class="loading">Loading data files</div>';

    await loadAllData();

    // Restore app shell
    document.getElementById('app').innerHTML = `
        <aside id="sidebar">
            <div class="sidebar-header">
                <img src="../media/lapse.png" alt="Lapse" class="sidebar-logo">
                <h2>Admin Panel</h2>
            </div>
            <div class="sidebar-section">
                <div class="sidebar-section-header">
                    <h3>Players</h3>
                    <button class="btn-icon" id="btn-create-player" title="Create Player">+</button>
                </div>
                <ul id="player-list" class="entity-list"></ul>
            </div>
            <div class="sidebar-section">
                <div class="sidebar-section-header">
                    <h3>NPCs</h3>
                    <button class="btn-icon" id="btn-create-npc" title="Create NPC">+</button>
                </div>
                <ul id="npc-list" class="entity-list"></ul>
            </div>
            <div class="sidebar-footer">
                <p id="last-update"></p>
                <button class="btn-save" id="btn-save-all">Save All Files</button>
            </div>
        </aside>
        <main id="main">
            <div id="empty-state" class="empty-state">
                <img src="../media/d20.png" alt="" class="empty-icon">
                <h2>Select a character or NPC</h2>
                <p>Choose from the sidebar or create a new entry.</p>
            </div>
            <div id="detail-view" class="detail-view" style="display:none;">
                <div class="detail-header">
                    <h1 id="detail-title"></h1>
                    <div class="detail-header-actions">
                        <span id="detail-type-badge" class="badge"></span>
                        <button class="btn-danger" id="btn-delete" title="Delete">Delete</button>
                    </div>
                </div>
                <div class="tabs">
                    <button class="tab active" data-tab="info">Info</button>
                    <button class="tab" data-tab="attributes">Attributes</button>
                    <button class="tab" data-tab="skills">Skills</button>
                    <button class="tab" data-tab="abilities">Abilities</button>
                    <button class="tab" data-tab="story">Story</button>
                </div>
                <div id="tab-content" class="tab-content"></div>
            </div>
        </main>
        <!-- Confirm Dialog -->
        <div id="confirm-dialog" class="dialog-overlay" style="display:none;">
            <div class="dialog">
                <h3 id="confirm-title"></h3>
                <p id="confirm-message"></p>
                <div class="dialog-actions">
                    <button class="btn-secondary" id="confirm-cancel">Cancel</button>
                    <button class="btn-danger" id="confirm-ok">Confirm</button>
                </div>
            </div>
        </div>
        <!-- Create Dialog -->
        <div id="create-dialog" class="dialog-overlay" style="display:none;">
            <div class="dialog dialog-wide">
                <h3 id="create-title">Create New Character</h3>
                <div class="form-group">
                    <label>Identifier (nome_data)</label>
                    <input type="text" id="create-id" placeholder="e.g. ryuji (lowercase, no spaces)">
                    <small>Unique key used for file references. Lowercase, no spaces.</small>
                </div>
                <div class="form-group">
                    <label>Display Name</label>
                    <input type="text" id="create-name" placeholder="e.g. Ryuji Takamura">
                </div>
                <div class="form-group">
                    <label>Archetype</label>
                    <select id="create-archetype">
                        <option value="Feiticeiro">Feiticeiro</option>
                        <option value="Lutador">Lutador</option>
                        <option value="Ca\u00e7ador">Ca\u00e7ador</option>
                        <option value="Tanque">Tanque</option>
                        <option value="G\u00eanio">G\u00eanio</option>
                    </select>
                </div>
                <div class="dialog-actions">
                    <button class="btn-secondary" id="create-cancel">Cancel</button>
                    <button class="btn-primary" id="create-ok">Create</button>
                </div>
            </div>
        </div>
    `;

    setupEvents();
    renderSidebar();
    renderDetail();

    console.log('Lapse Admin Panel loaded.', Object.keys(S.players).length, 'players,', Object.keys(S.npcs).length, 'NPCs');

})();
