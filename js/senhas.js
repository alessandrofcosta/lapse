document.getElementById('showPassword').addEventListener('change', function() {
    const senhaInput = document.getElementById('senha');
    if (this.checked) {
        senhaInput.type = 'text';
    } else {
        senhaInput.type = 'password';
    }
});

const senhas = {
    "2dac65ec22d72135d3e64811942fad988d221b0f36030e932476d3f2aa380855": "pages/characters/saori/saori.html",
    "3d639e7b36de4a605c2d4ee668a0e8930639719d4e867b03c1bd5483a9a0e3a9": "pages/characters/yuka/yuka.html",
    "575bb429408c1233da72a28e95e92ec5083cbd2cd985e2c6da1b892737437b29": "pages/characters/yang/yang.html",
    "e14df2f7940ee091b49f6e383c161c774acf131ce8ae48cb6dde5deb3701ee84": "pages/characters/shiva/shiva.html",
    "780a23528c754a504894e9747d7df4fde20e937d3e9e63a86c001eecb0908b46": "pages/characters/indra/indra.html"
};

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

    if (senhas[senhaHash]) {
        localStorage.setItem("acesso", senhaHash);
        window.location.href = senhas[senhaHash];
    } else {
        document.getElementById('errorMessage').style.display = "block";
    }
}