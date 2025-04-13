async function loadWikipediaContent() {
    const today = new Date().toISOString().split('T')[0];
    const [year, month, day] = today.split('-');
    const url = `https://en.wikipedia.org/api/rest_v1/feed/featured/${year}/${month}/${day}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        // Today's Featured Article
        const tfa = data.tfa;
        document.getElementById("tfa").innerHTML = `
          <h2>Today's Featured Article: <a href="${tfa.content_urls.desktop.page}" target="_blank">${tfa.title}</a></h2>
          <p>${tfa.extract}</p>
          ${tfa.thumbnail ? `<img src="${tfa.thumbnail.source}" alt="${tfa.title}">` : ''}
        `;

        // Did You Know
        const dykItems = data.dyk.map(item => `
          <li>
            ${item.text}
            ${item.thumbnail ? `<img src="${item.thumbnail.source}" alt="Did You Know">` : ''}
          </li>
        `).join('');
        document.getElementById("dyk").innerHTML = `
          <h2>Did You Know?</h2>
          <ul>${dykItems}</ul>
        `;

        // On This Day
        const events = data.onthisday.map(event => `
          <li>
            ${event.text}
            ${event.thumbnail ? `<img src="${event.thumbnail.source}" alt="On This Day">` : ''}
          </li>
        `).join('');
        document.getElementById("onthisday").innerHTML = `
          <h2>On This Day</h2>
          <ul>${events}</ul>
        `;

    } catch (err) {
        console.error("Failed to load Wikipedia content:", err);
    }
}

// Load on page load
loadWikipediaContent();
