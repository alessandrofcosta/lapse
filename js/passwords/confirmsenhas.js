document.addEventListener("DOMContentLoaded", function() {
    const senhasValidas = [
        "780a23528c754a504894e9747d7df4fde20e937d3e9e63a86c001eecb0908b46", "2dac65ec22d72135d3e64811942fad988d221b0f36030e932476d3f2aa380855", "e14df2f7940ee091b49f6e383c161c774acf131ce8ae48cb6dde5deb3701ee84", "575bb429408c1233da72a28e95e92ec5083cbd2cd985e2c6da1b892737437b29", "b686c9f1dc998f8088d655974c79c2d9d1974a18e646f32a409aaee88801b0e7",
        "eea679d534adb97c1fa089e77f5450bd7d176987b6788853f8277d1c76f8b15e",
    ];

    const acesso = localStorage.getItem("acesso");

    if (!senhasValidas.includes(acesso)) {
        window.location.replace("../../../pages/espertinho.html");

    } else {
        document.body.style.display = "block";
    }

    
});

