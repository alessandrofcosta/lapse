document.getElementById('showPasswordNPC').addEventListener('change', function() {
    const senhaInput = document.getElementById('senhaNPC');
    senhaInput.type = this.checked ? 'text' : 'password';
});

const senhasNPC = [
    // "familia"
    "d368c2ac7ffd516dbffabad074c106c35074d22950b198d678dfff1f9af5676d",
    "aec62b69f7685e38391295bfcc056adc896da54e0c7ad9a51c232360f04e6cdf",
    "27944092732df96af0311e3e374b751a584e331c2fcf36c24e5b96dd79741c30",
    "b146ee27a559d368f8379f2c17649f29db804e0d3e2e6a5879e179aaedeb09c4"
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
