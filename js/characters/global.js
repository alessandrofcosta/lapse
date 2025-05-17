const acesso = localStorage.getItem("acesso");
const senhas = { 
    "2dac65ec22d72135d3e64811942fad988d221b0f36030e932476d3f2aa380855": "saori",
    "b686c9f1dc998f8088d655974c79c2d9d1974a18e646f32a409aaee88801b0e7": "yuka",
    "575bb429408c1233da72a28e95e92ec5083cbd2cd985e2c6da1b892737437b29": "yang",
    "e14df2f7940ee091b49f6e383c161c774acf131ce8ae48cb6dde5deb3701ee84": "shiva",
    "780a23528c754a504894e9747d7df4fde20e937d3e9e63a86c001eecb0908b46": "indra",
    "eea679d534adb97c1fa089e77f5450bd7d176987b6788853f8277d1c76f8b15e": "lommie",
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