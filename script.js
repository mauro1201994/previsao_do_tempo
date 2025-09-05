const apiKey = "bc39ea65ce84ed779479a9805bedff4c"; // Substitua pela sua chave da OpenWeatherMap
const lang = "pt_br";
const units = "metric";

async function buscarPorCidade() {
  const cidade = document.getElementById("cidade").value;
  if (!cidade) return alert("Digite o nome da cidade!");

  const climaURL = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${apiKey}&units=${units}&lang=${lang}`;
  const previsaoURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cidade}&appid=${apiKey}&units=${units}&lang=${lang}`;

  await mostrarClima(climaURL, previsaoURL);
}

function buscarPorLocalizacao() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      const climaURL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}&lang=${lang}`;
      const previsaoURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}&lang=${lang}`;

      await mostrarClima(climaURL, previsaoURL);
    });
  } else {
    alert("Geolocalização não suportada pelo navegador.");
  }
}

async function mostrarClima(climaURL, previsaoURL) {
  try {
    const climaResp = await fetch(climaURL);
    const climaDados = await climaResp.json();

    const previsaoResp = await fetch(previsaoURL);
    const previsaoDados = await previsaoResp.json();

    document.getElementById("clima-atual").innerHTML = `
      <h2>${climaDados.name}, ${climaDados.sys.country}</h2>
      <p><strong>${climaDados.weather[0].description}</strong></p>
      <p>🌡️ ${climaDados.main.temp}°C | 💨 ${climaDados.wind.speed} m/s</p>
      <img src="https://openweathermap.org/img/wn/${climaDados.weather[0].icon}@2x.png">
    `;

    // Agrupar previsões por dia
    const previsoesAgrupadas = {};
    previsaoDados.list.forEach(item => {
      const dia = item.dt_txt.split(" ")[0];
      if (!previsoesAgrupadas[dia]) previsoesAgrupadas[dia] = [];
      previsoesAgrupadas[dia].push(item);
    });

    let previsaoHTML = "<h3>Previsão para os próximos dias:</h3>";
    const dias = Object.keys(previsoesAgrupadas).slice(1, 6); // Pega os próximos 5 dias (ignora o atual)

    dias.forEach(dia => {
      const diaDados = previsoesAgrupadas[dia][0]; // Pega a primeira previsão do dia (pode ser ajustado)

      const dataFormatada = new Date(dia).toLocaleDateString("pt-BR", {
        weekday: "long", day: "numeric", month: "short"
      });

      previsaoHTML += `
        <div class="previsao-dia">
          <h4>${dataFormatada}</h4>
          <p>${diaDados.weather[0].description}</p>
          <p>🌡️ ${diaDados.main.temp}°C</p>
          <img src="https://openweathermap.org/img/wn/${diaDados.weather[0].icon}@2x.png">
        </div>
      `;
    });

    document.getElementById("previsao").innerHTML = previsaoHTML;

  } catch (erro) {
    alert("Erro ao obter dados do clima. Verifique a cidade ou tente novamente.");
    console.error(erro);
  }
}
