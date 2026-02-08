const acesso = localStorage.getItem("acesso");
const senhas = { 
    "2dac65ec22d72135d3e64811942fad988d221b0f36030e932476d3f2aa380855": "saori",
    "b686c9f1dc998f8088d655974c79c2d9d1974a18e646f32a409aaee88801b0e7": "yuka",
    "575bb429408c1233da72a28e95e92ec5083cbd2cd985e2c6da1b892737437b29": "yang",
    "e14df2f7940ee091b49f6e383c161c774acf131ce8ae48cb6dde5deb3701ee84": "shiva",
    "780a23528c754a504894e9747d7df4fde20e937d3e9e63a86c001eecb0908b46": "indra",
    "eea679d534adb97c1fa089e77f5450bd7d176987b6788853f8277d1c76f8b15e": "lommie",
    "b2ef102cbb356deaf97350a1f1ac4b51ac6bb91f54cea82bd95e03eea7f20255": "alice",
    "5d5bddb577102d0a960bcf6fea9050c10fe5e9feddcb5c2170ccab872db9ee87": "saint",
    "4a38989ac1848855bfe02dfeb9bd31b96fedeab9daf9c334fb9c5d443b195afc": "sombras"
};

const nomeAcesso = senhas[acesso];

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