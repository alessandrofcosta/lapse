document.getElementById('showPasswordNPC').addEventListener('change', function() {
    const senhaInput = document.getElementById('senhaNPC');
    senhaInput.type = this.checked ? 'text' : 'password';
});

const senhasNPC = [
    // "npcmaster"
    "e35b77cba779b34b2afc841264681d5cece30519ccc3fa6735229bbd94132a24"
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
