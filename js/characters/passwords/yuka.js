document.addEventListener("DOMContentLoaded", function() {
    const senhasValidas = [
        "3d639e7b36de4a605c2d4ee668a0e8930639719d4e867b03c1bd5483a9a0e3a9"
    ];

    const acesso = localStorage.getItem("acesso");

    if (!senhasValidas.includes(acesso)) {
        window.location.replace("../../../pages/espertinho.html");

    } else {
        document.body.style.display = "block";
    }
});
