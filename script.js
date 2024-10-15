const key = "266902ae22edc010380c2ce21e4a86d3";
const apiKeyPixabay = '46502528-109273fc5469f79853ae685b6'; // Sua chave da API do Pixabay
const body = document.body;

async function buscarCidade(cidade) {
    const dados = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${key}&lang=pt_br&units=metric`)
        .then(response => response.json());

    console.log(dados);

    if (dados.cod === 200) {
        const temperatura = dados.main.temp;
        const descricao = dados.weather[0].description; // Descrição do clima
        const umidade = dados.main.humidity;
        const cidadeNome = dados.name;
        const icone = dados.weather[0].icon;

        // Atualizando as informações na página
        document.getElementById('cidadeNome').innerText = `Tempo em ${cidadeNome}`;
        document.querySelector('.temperatura').innerText = `${Math.floor(temperatura)}°C`;
        document.querySelector('.descricao').innerText = descricao.charAt(0).toUpperCase() + descricao.slice(1);
        document.querySelector('.umidade').innerText = `Umidade: ${umidade}%`;
        document.querySelector('.iconeTempo').src = `https://openweathermap.org/img/wn/${icone}@2x.png`;

        // Chamar a função para definir a imagem de fundo
        buscarImagemFundo(descricao); // Passa a descrição do clima para o Pixabay
    } else {
        alert('Cidade não encontrada. Tente novamente.');
    }
}

async function buscarImagemFundo(descricaoClima) {
    // Usar a descrição do clima para buscar imagens no Pixabay
    const response = await fetch(`https://pixabay.com/api/?key=${apiKeyPixabay}&q=${encodeURIComponent(descricaoClima)}&image_type=photo&pretty=true`);
    const data = await response.json();

    console.log(data.hits); // Verifica os resultados no console

    if (data.hits.length > 0) {
        const selectedPhoto = data.hits[0].largeImageURL; // Seleciona a primeira imagem

        // Criar uma nova imagem para carregar a foto primeiro
        const img = new Image();
        img.src = selectedPhoto;

        // Quando a imagem estiver carregada, aplica a transição
        img.onload = () => {
            // Transição de opacidade
            body.style.transition = 'opacity 1s ease-in-out'; // Define uma transição mais suave

            // Diminui a opacidade para 0 antes de trocar a imagem
            body.style.opacity = 0;

            setTimeout(() => {
                // Aplica a nova imagem de fundo
                body.style.backgroundImage = `url(${selectedPhoto})`;
                body.style.backgroundSize = 'cover'; // Garante que a imagem cubra o fundo
                body.style.backgroundPosition = 'center'; // Centraliza a imagem
                
                // Depois de aplicar a nova imagem, volta a opacidade a 1
                body.style.opacity = 1;
            }, 1000); // Tempo suficiente para a transição suave
        };
    } else {
        alert('Nenhuma imagem encontrada para este clima. Usando imagem padrão.');
        body.style.backgroundImage = `url('caminho/para/imagem/padrao.jpg')`; // Define imagem padrão se não encontrar no Pixabay
    }
}


function cliqueinobotão() {
    const cidade = document.querySelector(".cidade").value;
    buscarCidade(cidade); // Chama a função de busca
}
