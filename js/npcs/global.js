const acessoNPC = localStorage.getItem('acesso_npc');
const nomeAcessoNPC = window.PASSWORDS.npcs.map[acessoNPC];


if (!nomeAcessoNPC || !npcData[nomeAcessoNPC]) {
    window.location.replace('../../pages/espertinho.html');
}

function renderNPCHead() {
    const head = document.head;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `../../css/npcs/colors/${nomeAcessoNPC}.css`;
    head.appendChild(link);
}

function renderNPCHeader() {
    document.querySelector('.js-header').innerHTML = `
    <div class="container-back">
        <a href="./login.html" class="backa">
            <img src="../../media/back.png" alt="" class="back">
        </a>
    </div>
    <h1>${npcData[nomeAcessoNPC].info.nome}</h1>
    <p id="nivel">Nível ${npcData[nomeAcessoNPC].info.nivel}</p>

    <div class="xp-wrapper">
        <div class="xp-bar-outer">
            <div class="xp-text">${npcData[nomeAcessoNPC].info.xp} | 100</div>
            <div class="xp-bar-container">
                <div class="xp-bar" style="width: ${npcData[nomeAcessoNPC].info.xp}%;"></div>
            </div>
        </div>
    </div>

    <div class="hlinks-container">
        <a href="historia.html" class="hlinks"><p>História</p></a>
        <a href="ficha.html" class="hlinks"><p>Ficha</p></a>
    </div>

    <img src="../../media/lapse.png" alt="" id="lapse">
    `;
}

renderNPCHead();
renderNPCHeader();
