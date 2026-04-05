(function () {
    const PLAYER_PASSWORD_MAP = {
        "2dac65ec22d72135d3e64811942fad988d221b0f36030e932476d3f2aa380855": "saori",
        "b686c9f1dc998f8088d655974c79c2d9d1974a18e646f32a409aaee88801b0e7": "yuka",
        "575bb429408c1233da72a28e95e92ec5083cbd2cd985e2c6da1b892737437b29": "yang",
        "e14df2f7940ee091b49f6e383c161c774acf131ce8ae48cb6dde5deb3701ee84": "shiva",
        "780a23528c754a504894e9747d7df4fde20e937d3e9e63a86c001eecb0908b46": "indra",
        "eea679d534adb97c1fa089e77f5450bd7d176987b6788853f8277d1c76f8b15e": "lommie",
        "b2ef102cbb356deaf97350a1f1ac4b51ac6bb91f54cea82bd95e03eea7f20255": "alice",
        "5d5bddb577102d0a960bcf6fea9050c10fe5e9feddcb5c2170ccab872db9ee87": "saint",
        "4a38989ac1848855bfe02dfeb9bd31b96fedeab9daf9c334fb9c5d443b195afc": "sombras"
    };

    const NPC_PASSWORD_MAP = {
        "d368c2ac7ffd516dbffabad074c106c35074d22950b198d678dfff1f9af5676d": 'keshi',
        "aec62b69f7685e38391295bfcc056adc896da54e0c7ad9a51c232360f04e6cdf": 'zerath',
        "27944092732df96af0311e3e374b751a584e331c2fcf36c24e5b96dd79741c30": 'ami',
        "b146ee27a559d368f8379f2c17649f29db804e0d3e2e6a5879e179aaedeb09c4": 'mordrek',
        "ec96d18a74fb69422ea3e83a64880868d79fbd524c12c175b71af5a805cc7da7": 'caim',
        "2e81e88f103bc4346870c197caaea4994d57557a380805afafd8a2b3e6f9ee88": 'mercy'
    };

    const toHashList = (passwordMap) => Object.keys(passwordMap);

    const normalizePassword = (text = '') =>
        text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    const hashPassword = async (text) => {
        const bytes = new TextEncoder().encode(text);
        const hashBuffer = await crypto.subtle.digest('SHA-256', bytes);
        return Array.from(new Uint8Array(hashBuffer))
            .map((b) => b.toString(16).padStart(2, '0'))
            .join('');
    };

    window.PASSWORDS = {
        players: {
            map: PLAYER_PASSWORD_MAP,
            hashes: toHashList(PLAYER_PASSWORD_MAP),
        },
        npcs: {
            map: NPC_PASSWORD_MAP,
            hashes: toHashList(NPC_PASSWORD_MAP),
        },
        normalizePassword,
        hashPassword,
    };
})();
