const { players, normalizePassword, hashPassword } = window.PASSWORDS;

document.getElementById('showPassword').addEventListener('change', function () {
    document.getElementById('senha').type = this.checked ? 'text' : 'password';
});

async function validarSenha(event) {
    event.preventDefault();

    const senhaInserida = normalizePassword(document.getElementById('senha').value);
    const senhaHash = await hashPassword(senhaInserida);

    if (players.hashes.includes(senhaHash)) {
        localStorage.setItem('acesso', senhaHash);
        window.location.href = 'pages/characters/ficha.html';
        return;
    }

    document.getElementById('errorMessage').style.display = 'block';
}
