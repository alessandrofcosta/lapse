document.addEventListener('DOMContentLoaded', function() {
    const senhasValidasNPC = [
        "d368c2ac7ffd516dbffabad074c106c35074d22950b198d678dfff1f9af5676d"
    ];

    const acessoNPC = localStorage.getItem('acesso_npc');

    if (!senhasValidasNPC.includes(acessoNPC)) {
        window.location.replace('../../pages/espertinho.html');
    } else {
        document.body.style.display = 'block';
    }
});
