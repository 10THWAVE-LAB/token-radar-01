/* Filters: search, category, chain and sort — plus the URL hash, so a filtered
   view or a detail view is a link (the screenshots use it). */
'use strict';

var state = { q: '', category: '', chain: '', sort: 'value' };

/** Fill the category and chain selects from the board's own rows. */
function fillSelects() {
  var cats = {};
  var chains = {};
  RADAR.rows.forEach(function (r) {
    if (r.category) cats[r.category] = true;
    (r.chains || []).forEach(function (c) { chains[c] = true; });
  });
  var catSel = document.getElementById('category');
  Object.keys(cats).sort().forEach(function (c) {
    var o = document.createElement('option');
    o.value = c; o.textContent = c;
    catSel.appendChild(o);
  });
  var chainSel = document.getElementById('chain');
  Object.keys(chains).sort().forEach(function (c) {
    var o = document.createElement('option');
    o.value = c; o.textContent = c;
    chainSel.appendChild(o);
  });
}

/** The rows that pass the current filters, in the current sort order. */
function filteredRows() {
  var q = state.q.trim().toLowerCase();
  var list = RADAR.rows.filter(function (r) {
    if (state.category && r.category !== state.category) return false;
    if (state.chain && (r.chains || []).indexOf(state.chain) === -1) return false;
    if (q && r.name.toLowerCase().indexOf(q) === -1 && r.slug.toLowerCase().indexOf(q) === -1) return false;
    return true;
  });
  return sortedRows(list, state.sort);
}

/** Re-render the board from the current filter state. */
function applyFilters() {
  renderBoard(filteredRows());
}

/** Read the hash (#detail=slug, #category=X, #chain=X, #q=text, #sort=key) on load. */
function readHash() {
  var hash = window.location.hash.slice(1);
  if (!hash) return null;
  var out = {};
  hash.split('&').forEach(function (part) {
    var kv = part.split('=');
    if (kv.length === 2) out[kv[0]] = decodeURIComponent(kv[1].replace(/\+/g, ' '));
  });
  return out;
}

document.getElementById('q').addEventListener('input', function (e) {
  state.q = e.target.value;
  applyFilters();
});
document.getElementById('category').addEventListener('change', function (e) {
  state.category = e.target.value;
  applyFilters();
});
document.getElementById('chain').addEventListener('change', function (e) {
  state.chain = e.target.value;
  applyFilters();
});
document.getElementById('sort').addEventListener('change', function (e) {
  state.sort = e.target.value;
  applyFilters();
});
document.getElementById('reset').addEventListener('click', function () {
  state = { q: '', category: '', chain: '', sort: 'value' };
  document.getElementById('q').value = '';
  document.getElementById('category').value = '';
  document.getElementById('chain').value = '';
  document.getElementById('sort').value = 'value';
  applyFilters();
});

/* Boot: stats, selects, live table, then the hash (if any), then the board. */
fillSelects();
renderStats();
renderLive();
(function () {
  var hash = readHash();
  if (!hash) { applyFilters(); return; }
  if (hash.category) { state.category = hash.category; document.getElementById('category').value = hash.category; }
  if (hash.chain) { state.chain = hash.chain; document.getElementById('chain').value = hash.chain; }
  if (hash.q) { state.q = hash.q; document.getElementById('q').value = hash.q; }
  if (hash.sort) { state.sort = hash.sort; document.getElementById('sort').value = hash.sort; }
  applyFilters();
  if (hash.detail) openDetail(hash.detail);
})();
