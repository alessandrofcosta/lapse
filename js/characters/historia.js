function renderHistoria() {
    const main = document.querySelector('.js-main-historia');
    const historia = window.CHARACTER_STORIES?.[nomeAcesso];

    if (!main) {
        return;
    }

    if (!historia) {
        main.innerHTML = `
            <h1>História em construção</h1>
            <p>A história de <strong>${data[nomeAcesso].info.nome}</strong> ainda não foi cadastrada.</p>
            <p>Adicione o conteúdo em <code>js/characters/stories.js</code> para publicar sem criar um novo HTML.</p>
        `;
        return;
    }

    document.title = `${data[nomeAcesso].info.nome} | História`;
    main.innerHTML = historia;
}

renderHistoria();
