document.addEventListener('DOMContentLoaded', function () {
    const acesso = localStorage.getItem('acesso');

    if (!window.PASSWORDS.players.hashes.includes(acesso)) {
        window.location.replace('../../../pages/espertinho.html');
        return;
    }

    document.body.style.display = 'block';
});
