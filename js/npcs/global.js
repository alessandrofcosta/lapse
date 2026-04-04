const acessoNPC = localStorage.getItem('acesso_npc');
const senhasNPC = {
    "d368c2ac7ffd516dbffabad074c106c35074d22950b198d678dfff1f9af5676d": 'keshi', //familia
    "aec62b69f7685e38391295bfcc056adc896da54e0c7ad9a51c232360f04e6cdf": 'zerath', //ceiquer
    "27944092732df96af0311e3e374b751a584e331c2fcf36c24e5b96dd79741c30": 'ami', //olamundo
    "b146ee27a559d368f8379f2c17649f29db804e0d3e2e6a5879e179aaedeb09c4": 'mordrek', //davisus
    "ec96d18a74fb69422ea3e83a64880868d79fbd524c12c175b71af5a805cc7da7": 'caim', // kajolindo12
};

const nomeAcessoNPC = senhasNPC[acessoNPC];


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
        <a href="${nomeAcessoNPC}.html" class="hlinks"><p>História</p></a>
        <a href="ficha.html" class="hlinks"><p>Ficha</p></a>
    </div>

    <img src="../../media/lapse.png" alt="" id="lapse">
    `;
}

renderNPCHead();
renderNPCHeader();
