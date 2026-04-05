const { npcs, normalizePassword, hashPassword } = window.PASSWORDS;

document.getElementById('showPasswordNPC').addEventListener('change', function () {
    document.getElementById('senhaNPC').type = this.checked ? 'text' : 'password';
});

async function validarSenhaNPC(event) {
    event.preventDefault();

    const senhaInserida = normalizePassword(document.getElementById('senhaNPC').value);
    const senhaHash = await hashPassword(senhaInserida);

    if (npcs.hashes.includes(senhaHash)) {
        localStorage.setItem('acesso_npc', senhaHash);
        window.location.href = './ficha.html';
        return;
    }

    document.getElementById('errorMessageNPC').style.display = 'block';
}

document.getElementById('loginFormNPC').addEventListener('submit', validarSenhaNPC);
