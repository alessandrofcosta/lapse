document.getElementById('showPasswordNPC').addEventListener('change', function() {
    const senhaInput = document.getElementById('senhaNPC');
    senhaInput.type = this.checked ? 'text' : 'password';
});

const senhasNPC = [
    // "familia"
    "d368c2ac7ffd516dbffabad074c106c35074d22950b198d678dfff1f9af5676d"
];

function removerAcentos(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

async function gerarHash(texto) {
    const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(texto));
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function validarSenhaNPC(event) {
    event.preventDefault();

    let senhaInserida = document.getElementById('senhaNPC').value.toLowerCase();
    senhaInserida = removerAcentos(senhaInserida);

    const senhaHash = await gerarHash(senhaInserida);

    if (senhasNPC.includes(senhaHash)) {
        localStorage.setItem('acesso_npc', senhaHash);
        window.location.href = './ficha.html';
    } else {
        document.getElementById('errorMessageNPC').style.display = 'block';
    }
}

document.getElementById('loginFormNPC').addEventListener('submit', validarSenhaNPC);
