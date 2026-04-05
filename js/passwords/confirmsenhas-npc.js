document.addEventListener('DOMContentLoaded', function () {
    const acessoNPC = localStorage.getItem('acesso_npc');

    if (!window.PASSWORDS.npcs.hashes.includes(acessoNPC)) {
        window.location.replace('../../pages/espertinho.html');
        return;
    }

    document.body.style.display = 'block';
});
