document.addEventListener("DOMContentLoaded", function() {
    const senhasValidas = [
        "2dac65ec22d72135d3e64811942fad988d221b0f36030e932476d3f2aa380855"
    ];

    const acesso = localStorage.getItem("acesso");

    if (!senhasValidas.includes(acesso)) {
        window.location.replace("../../espertinho.html");

    } else {
        document.body.style.display = "block";
    }
});
