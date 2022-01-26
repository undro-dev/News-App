// Custom Http Module
function customHttp() {
  return {
    getUrl(url, cb) {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.addEventListener('load', () => {
          if (Math.floor(xhr.status / 100) !== 2) {
            cb(`Error. Status code: ${xhr.status}`, xhr);
            return;
          }
          const response = JSON.parse(xhr.responseText);
          cb(null, response);
        });

        xhr.addEventListener('error', () => {
          cb(`Error. Status code: ${xhr.status}`, xhr);
        });

        xhr.send();
      } catch (error) {
        cb(error);
      }
    },
    post(url, body, headers, cb) {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        xhr.addEventListener('load', () => {
          if (Math.floor(xhr.status / 100) !== 2) {
            cb(`Error. Status code: ${xhr.status}`, xhr);
            return;
          }
          const response = JSON.parse(xhr.responseText);
          cb(null, response);
        });

        xhr.addEventListener('error', () => {
          cb(`Error. Status code: ${xhr.status}`, xhr);
        });

        if (headers) {
          Object.entries(headers).forEach(([key, value]) => {
            xhr.setRequestHeader(key, value);
          });
        }

        xhr.send(JSON.stringify(body));
      } catch (error) {
        cb(error);
      }
    },
  };
}
// Init http module
const http = customHttp();

const newsService = (function () {
  const apiKey = '25eed8f7cb9c40f8b692cdf754b8c0e8',
    apiUrl = 'https://newsapi.org/v2';

  return {
    topHeadlines(country = 'ru', cb) {
      http.getUrl(`${apiUrl}/top-headlines?country=${country}&category=technology&apiKey=${apiKey}`,
        cb);

    },
    everything(query, cb) {
      http.getUrl(`${apiUrl}/everything?q=${query}&apiKey=${apiKey}`,
        cb);
    }
  };

})();
//  init selects
document.addEventListener('DOMContentLoaded', function () {
  M.AutoInit();
  loadNews();
});

function loadNews() {
  newsService.topHeadlines('ru', omGetResponse)
}

function omGetResponse(err, res) {
  console.log(res);
  renderNews(res.articles);
}

function renderNews(news) {
  const newsContainer = document.querySelector('.news-container .row');
  let fragment = '';

  news.forEach(item => {
    const el = newsTemplate(item);
    fragment += el;
  });

  newsContainer.insertAdjacentHTML('afterbegin', fragment);


}

function newsTemplate({
  urlToImage,
  title,
  url,
  description
}) {
  return `
  <div class="col s12">
    <div class="card">
      <div class="card-image">
        <img src="${urlToImage}" alt="img">
        <span class="card-title">${title || ''}</span>
      </div>
      <div class="card-content">
        <p>${description || ''}</p>
      </div>
      <div class="card-action">
       <a href=${url}>Read more</a>
      </div>
    </div>
  </div>
  `;

}