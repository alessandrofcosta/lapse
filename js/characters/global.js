const acesso = localStorage.getItem("acesso");
const nomeAcesso = window.PASSWORDS.players.map[acesso];

function renderHead() {
    const head = document.head;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `../../css/characters/colors/${nomeAcesso}.css`;
    head.appendChild(link);

}


function renderHeader() {
    document.querySelector('.js-header').innerHTML = 
    `
    <div class="container-back">
        <a href="../../index.html" class="backa">
            <img src="../../media/back.png" alt="" class="back">
        </a>
    </div>
    <h1>${data[nomeAcesso].info.nome}</h1>
    <p id="nivel">Nivel ${data[nomeAcesso].info.nivel}</p>

    <div class="xp-wrapper">
    <div class="xp-bar-outer">
        <div class="xp-text">${data[nomeAcesso].info.xp} | 100</div>
        <div class="xp-bar-container">
        <div class="xp-bar" style="width: ${data[nomeAcesso].info.xp}%;"></div>
        </div>
    </div>
    </div>


    <div class="hlinks-container">
        <a href="${nomeAcesso}.html" class="hlinks">
            <p>História</p>
        </a>
        <a href="ficha.html" class="hlinks">
            <p>Ficha</p>
        </a>
    </div>

    <img src="../../media/lapse.png" alt="" id="lapse">
    `;
}

renderHead();
renderHeader();