document.addEventListener('DOMContentLoaded', function() {
    const senhasValidasNPC = [
        "e35b77cba779b34b2afc841264681d5cece30519ccc3fa6735229bbd94132a24"
    ];

    const acessoNPC = localStorage.getItem('acesso_npc');

    if (!senhasValidasNPC.includes(acessoNPC)) {
        window.location.replace('../../pages/espertinho.html');
    } else {
        document.body.style.display = 'block';
    }
});
