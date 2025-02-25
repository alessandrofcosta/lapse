document.addEventListener("DOMContentLoaded", function() {
    const senhasValidas = [
        "575bb429408c1233da72a28e95e92ec5083cbd2cd985e2c6da1b892737437b29"
    ];

    const acesso = localStorage.getItem("acesso");

    if (!senhasValidas.includes(acesso)) {
        window.location.replace("../../espertinho.html");

    } else {
        document.body.style.display = "block";
    }
});
