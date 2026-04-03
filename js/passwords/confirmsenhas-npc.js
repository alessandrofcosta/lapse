document.addEventListener('DOMContentLoaded', function() {
    const senhasValidasNPC = [
        "d368c2ac7ffd516dbffabad074c106c35074d22950b198d678dfff1f9af5676d",
        "aec62b69f7685e38391295bfcc056adc896da54e0c7ad9a51c232360f04e6cdf",
        "27944092732df96af0311e3e374b751a584e331c2fcf36c24e5b96dd79741c30"
    ];

    const acessoNPC = localStorage.getItem('acesso_npc');

    if (!senhasValidasNPC.includes(acessoNPC)) {
        window.location.replace('../../pages/espertinho.html');
    } else {
        document.body.style.display = 'block';
    }
});
