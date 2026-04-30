(function() {
  var siteUrl   = 'https://www.ryreu.cyou/ayman';
  var shopUrl   = siteUrl + '/shop/';
  var wcApi     = siteUrl + '/wp-json/wc/store/v1/products';
  var RECENTS_KEY = 'bh_recent_searches'; /* localStorage key for recent searches */
  var MAX_RECENTS = 5; /* maximum number of recent searches to remember */
 
  var overlay      = document.getElementById('bh-search-overlay');
  var input        = document.getElementById('bh-search-input');
  var clearBtn     = document.getElementById('bh-clear-btn');
  var sugg         = document.getElementById('bh-suggestions');
  var status       = document.getElementById('bh-search-status');
  var suggLabel    = document.getElementById('bh-suggestions-label');
  var viewAll      = document.getElementById('bh-view-all');
  var trigger      = document.getElementById('bh-search-trigger');
  var tabs         = document.querySelectorAll('.bh-tab');
  var defaultView  = document.getElementById('bh-default-view');
  var resultsView  = document.getElementById('bh-results-view');
  var recentsWrap  = document.getElementById('bh-recents-wrap');
  var recentsEl    = document.getElementById('bh-recents');
  var trendingEl   = document.getElementById('bh-trending');
  var clearRecents = document.getElementById('bh-clear-recents');
  var timer        = null;
  var lastQ        = '';
 
  /* ---- Highlight active tab based on current page URL ---- */
  var path = window.location.pathname;
  tabs.forEach(function(t) {
    var h = t.getAttribute('href');
    if (h && new URL(h, location.origin).pathname === path) {
      t.classList.add('active');
    }
  });
 
  /* ---- Haptic feedback + active tab on click ---- */
  tabs.forEach(function(t) {
    t.addEventListener('click', function() {
      /* Haptic feedback — vibrates phone briefly on tap */
      if (navigator.vibrate) navigator.vibrate(8);
      tabs.forEach(function(x) { x.classList.remove('active'); });
      t.classList.add('active');
    });
  });
 
  /* ============================================================
     RECENT SEARCHES — stored in localStorage
     ============================================================ */
  function getRecents() {
    try {
      return JSON.parse(localStorage.getItem(RECENTS_KEY)) || [];
    } catch(e) { return []; }
  }
 
  function saveRecent(q) {
    if (!q) return;
    var list = getRecents().filter(function(r) { return r !== q; });
    list.unshift(q); /* add to top */
    list = list.slice(0, MAX_RECENTS); /* keep only latest 5 */
    try { localStorage.setItem(RECENTS_KEY, JSON.stringify(list)); } catch(e) {}
  }
 
  function renderRecents() {
    var list = getRecents();
    if (!list.length) { recentsWrap.style.display = 'none'; return; }
    recentsWrap.style.display = 'block';
    recentsEl.innerHTML = '';
    list.forEach(function(q) {
      var chip = document.createElement('button');
      chip.className = 'bh-recent-chip';
      chip.innerHTML = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' + q;
      chip.addEventListener('click', function() {
        input.value = q;
        clearBtn.className = 'show';
        showResults();
        search(q);
      });
      recentsEl.appendChild(chip);
    });
  }
 
  /* ---- Clear all recent searches ---- */
  clearRecents.addEventListener('click', function() {
    try { localStorage.removeItem(RECENTS_KEY); } catch(e) {}
    recentsWrap.style.display = 'none';
  });
 
  /* ============================================================
     TRENDING PRODUCTS — loads latest 4 products on popup open
     ============================================================ */
  function loadTrending() {
    trendingEl.innerHTML = '<div style="text-align:center;padding:16px 0;font-size:13px;color:rgba(115,92,0,0.4)">Loading\u2026</div>';
    /* Fetches newest 4 products as "trending" */
    fetch(wcApi + '?per_page=4&orderby=date&order=desc')
      .then(function(r) { return r.json(); })
      .then(function(data) {
        trendingEl.innerHTML = '';
        if (!data || !data.length) {
          trendingEl.innerHTML = '<div style="text-align:center;padding:16px 0;font-size:13px;color:rgba(115,92,0,0.4)">Nothing to show yet</div>';
          return;
        }
        data.forEach(function(item, i) {
          trendingEl.appendChild(makeTrendingItem(item, i + 1));
        });
      })
      .catch(function() {
        trendingEl.innerHTML = '';
      });
  }
 
  function makeTrendingItem(item, rank) {
    var a = document.createElement('a');
    a.className = 'bh-trending-item';
    a.href = item.permalink || '#';
 
    /* Rank number */
    var rankEl = document.createElement('span');
    rankEl.className = 'bh-trending-rank';
    rankEl.textContent = rank;
    a.appendChild(rankEl);
 
    /* Thumbnail */
    var thumbUrl = null;
    try {
      if (item.images && item.images.length > 0) {
        thumbUrl = item.images[0].thumbnail || item.images[0].src;
      }
    } catch(e) {}
 
    if (thumbUrl) {
      var img = document.createElement('img');
      img.className = 'bh-trending-thumb';
      img.src = thumbUrl; img.alt = ''; img.loading = 'lazy';
      a.appendChild(img);
    } else {
      var ph = document.createElement('div');
      ph.className = 'bh-trending-thumb-ph';
      ph.innerHTML = '<svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>';
      a.appendChild(ph);
    }
 
    /* Info */
    var info = document.createElement('div');
    info.className = 'bh-trending-info';
 
    var nameEl = document.createElement('span');
    nameEl.className = 'bh-trending-name';
    nameEl.textContent = decode(item.name || '');
    info.appendChild(nameEl);
 
    var priceText = getPrice(item);
    if (priceText) {
      var priceEl = document.createElement('span');
      priceEl.className = 'bh-trending-price';
      priceEl.textContent = priceText;
      info.appendChild(priceEl);
    }
 
    var catText = getCat(item);
    if (catText) {
      var catEl = document.createElement('span');
      catEl.className = 'bh-trending-cat';
      catEl.textContent = catText;
      info.appendChild(catEl);
    }
 
    a.appendChild(info);
 
    var arr = document.createElement('span');
    arr.style.cssText = 'color:rgba(115,92,0,0.25);font-size:14px;flex-shrink:0'; /* ARROW ICON COLOR */
    arr.textContent = '\u2192';
    a.appendChild(arr);
 
    return a;
  }
 
  /* ============================================================
     SEARCH POPUP — open / close
     ============================================================ */
  trigger.addEventListener('click', function() {
    overlay.classList.add('open');
    renderRecents();
    loadTrending();
    showDefault();
    setTimeout(function() { input.focus(); }, 280);
  });
 
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) closeSearch();
  });
 
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeSearch();
  });
 
  function closeSearch() {
    overlay.classList.remove('open');
    input.value = '';
    reset();
  }
 
  function showDefault() {
    defaultView.classList.remove('hide');
    resultsView.classList.remove('show');
  }
 
  function showResults() {
    defaultView.classList.add('hide');
    resultsView.classList.add('show');
  }
 
  function reset() {
    sugg.innerHTML = '';
    status.className = '';
    suggLabel.style.display = 'none';
    viewAll.className = '';
    clearBtn.className = '';
    lastQ = '';
    showDefault();
  }
 
  /* ---- Clear button ---- */
  clearBtn.addEventListener('click', function() {
    input.value = '';
    reset();
    input.focus();
  });
 
  /* ---- Enter key: save recent + go to shop search ---- */
  input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      var q = input.value.trim();
      if (q) {
        saveRecent(q);
        window.location.href = shopUrl + '?s=' + encodeURIComponent(q);
      }
    }
  });
 
  /* ---- Typing: debounced search ---- */
  input.addEventListener('input', function() {
    var q = input.value.trim();
    clearBtn.className = q ? 'show' : '';
    clearTimeout(timer);
    if (!q) { reset(); return; }
    showResults();
    timer = setTimeout(function() { search(q); }, 350);
  });
 
  /* ============================================================
     SEARCH
     ============================================================ */
  function search(q) {
    if (q === lastQ) return;
    lastQ = q;
    sugg.innerHTML = '';
    suggLabel.style.display = 'none';
    viewAll.className = '';
    status.textContent = 'Searching\u2026';
    status.className = 'show';
 
    fetch(wcApi + '?search=' + encodeURIComponent(q) + '&per_page=8')
      .then(function(r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function(data) {
        status.className = '';
        if (!data || data.length === 0) { empty(q); return; }
        suggLabel.style.display = 'flex';
        data.forEach(function(item) { sugg.appendChild(makeSuggItem(item)); });
        setViewAll(q);
        /* Save to recent searches when results found */
        saveRecent(q);
      })
      .catch(function() { empty(q); });
  }
 
  function empty(q) {
    status.textContent = 'No results for \u201c' + q + '\u201d';
    status.className = 'show';
    setViewAll(q);
  }
 
  function setViewAll(q) {
    viewAll.href = shopUrl + '?s=' + encodeURIComponent(q);
    viewAll.textContent = 'View all results for \u201c' + q + '\u201d';
    viewAll.className = 'show';
  }
 
  /* ---- Build one suggestion row ---- */
  function makeSuggItem(item) {
    var li = document.createElement('li');
    li.setAttribute('role', 'option');
    var a = document.createElement('a');
    a.href = item.permalink || '#';
 
    var thumbUrl = null;
    try {
      if (item.images && item.images.length > 0) {
        thumbUrl = item.images[0].thumbnail || item.images[0].src;
      }
    } catch(e) {}
 
    if (thumbUrl) {
      var img = document.createElement('img');
      img.className = 'bh-sug-thumb';
      img.src = thumbUrl; img.alt = ''; img.loading = 'lazy';
      a.appendChild(img);
    } else {
      var ph = document.createElement('div');
      ph.className = 'bh-sug-thumb-placeholder';
      ph.innerHTML = '<svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>';
      a.appendChild(ph);
    }
 
    var info = document.createElement('div');
    info.className = 'bh-sug-info';
 
    var nameEl = document.createElement('span');
    nameEl.className = 'bh-sug-name';
    nameEl.textContent = decode(item.name || '');
    info.appendChild(nameEl);
 
    var priceText = getPrice(item);
    if (priceText) {
      var priceEl = document.createElement('span');
      priceEl.className = 'bh-sug-price';
      priceEl.textContent = priceText;
      info.appendChild(priceEl);
    }
 
    var catText = getCat(item);
    if (catText) {
      var catEl = document.createElement('span');
      catEl.className = 'bh-sug-cat';
      catEl.textContent = catText;
      info.appendChild(catEl);
    }
 
    a.appendChild(info);
 
    var arr = document.createElement('span');
    arr.style.cssText = 'color:rgba(115,92,0,0.25);font-size:14px;flex-shrink:0'; /* ARROW ICON COLOR */
    arr.textContent = '\u2192';
    a.appendChild(arr);
 
    li.appendChild(a);
    return li;
  }
 
  /* ---- Helper: extract price from item ---- */
  function getPrice(item) {
    try {
      if (item.prices) {
        var raw = item.prices.price;
        var saleRaw = item.prices.sale_price;
        var curr = item.prices.currency_symbol || '';
        var decimals = item.prices.currency_minor_unit || 2;
        var divisor = Math.pow(10, decimals);
        return (saleRaw && saleRaw !== raw)
          ? curr + parseFloat(parseInt(saleRaw) / divisor).toFixed(decimals)
          : curr + parseFloat(parseInt(raw) / divisor).toFixed(decimals);
      }
    } catch(e) {}
    return '';
  }
 
  /* ---- Helper: extract category from item ---- */
  function getCat(item) {
    try {
      if (item.categories && item.categories.length > 0) {
        return item.categories.map(function(c) { return c.name; }).join(', ');
      }
    } catch(e) {}
    return '';
  }
 
  /* ---- Helper: decode HTML entities ---- */
  function decode(html) {
    var t = document.createElement('textarea');
    t.innerHTML = html || '';
    return t.value;
  }
 
})();
