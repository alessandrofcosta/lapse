document.getElementById('showPassword').addEventListener('change', function() {
    const senhaInput = document.getElementById('senha');
    if (this.checked) {
        senhaInput.type = 'text';
    } else {
        senhaInput.type = 'password';
    }
});

const senhas = [
    "2dac65ec22d72135d3e64811942fad988d221b0f36030e932476d3f2aa380855",
    "b686c9f1dc998f8088d655974c79c2d9d1974a18e646f32a409aaee88801b0e7",
    "575bb429408c1233da72a28e95e92ec5083cbd2cd985e2c6da1b892737437b29",
    "e14df2f7940ee091b49f6e383c161c774acf131ce8ae48cb6dde5deb3701ee84",
    "780a23528c754a504894e9747d7df4fde20e937d3e9e63a86c001eecb0908b46",
    "eea679d534adb97c1fa089e77f5450bd7d176987b6788853f8277d1c76f8b15e",
    "b2ef102cbb356deaf97350a1f1ac4b51ac6bb91f54cea82bd95e03eea7f20255"
];

function removerAcentos(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

async function gerarHash(texto) {
    const hashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(texto));
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function validarSenha(event) {
    event.preventDefault();

    let senhaInserida = document.getElementById('senha').value.toLowerCase();
    senhaInserida = removerAcentos(senhaInserida);

    const senhaHash = await gerarHash(senhaInserida);

    if (senhas.includes(senhaHash)) {
        localStorage.setItem("acesso", senhaHash);
        window.location.href = 'pages/characters/ficha.html';
    } else {
        document.getElementById('errorMessage').style.display = "block";
    }
}

