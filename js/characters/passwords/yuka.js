document.addEventListener("DOMContentLoaded", function() {
    const senhasValidas = [
        "b686c9f1dc998f8088d655974c79c2d9d1974a18e646f32a409aaee88801b0e7"
    ];

    const acesso = localStorage.getItem("acesso");

    if (!senhasValidas.includes(acesso)) {
        window.location.replace("../../../pages/espertinho.html");

    } else {
        document.body.style.display = "block";
    }
});
