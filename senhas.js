document.getElementById('showPassword').addEventListener('change', function() {
    const senhaInput = document.getElementById('senha');
    if (this.checked) {
        senhaInput.type = 'text';
    } else {
        senhaInput.type = 'password';
    }
});

const senhas = {
    "75ab4003f1edfdf6fd43b0eaa5801fab1dab2ebb4572098e8dc89b7758c3c0a4": "c-pages/saori/saori.html",
    "": "c-pages/shin/shin.html",
    "575bb429408c1233da72a28e95e92ec5083cbd2cd985e2c6da1b892737437b29": "c-pages/yang/yang.html",
    "": "c-pages/shiva/shiva.html",
    "780a23528c754a504894e9747d7df4fde20e937d3e9e63a86c001eecb0908b46": "c-pages/indra/indra.html"
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