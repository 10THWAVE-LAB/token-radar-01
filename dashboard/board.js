/* The ranked board: renders rows, sorts by column, marks the selected row. */
'use strict';

var RADAR = window.RADAR;
var watchlist = new Set(RADAR.watchlist || []);
var selectedSlug = null;

/** The board's rows, sorted by the current sort key. */
function sortedRows(rows, sortKey) {
  var list = rows.slice();
  if (sortKey === 'tvl') list.sort(function (a, b) { return b.tvl_usd - a.tvl_usd; });
  else if (sortKey === 'growth') list.sort(function (a, b) { return (b.change_7d || 0) - (a.change_7d || 0); });
  else if (sortKey === 'age') list.sort(function (a, b) { return (b.age_days || 0) - (a.age_days || 0); });
  else if (sortKey === 'name') list.sort(function (a, b) { return a.name.localeCompare(b.name); });
  else list.sort(function (a, b) { return a.rank - b.rank; });
  return list;
}

/** One board row's HTML. */
function rowHtml(r) {
  var growth = fmtPct(r.change_7d);
  var growthClass = (r.change_7d || 0) >= 0 ? 'pos' : 'neg';
  var chains = (r.chains || []).slice(0, 3).join(', ') || '—';
  var watch = watchlist.has(r.slug) ? '<span class="watch">WATCHLIST</span>' : '';
  return '<tr data-slug="' + esc(r.slug) + '"' + (r.slug === selectedSlug ? ' data-selected="true"' : '') + '>' +
    '<td class="num">' + r.rank + '</td>' +
    '<td class="name-cell"><b>' + esc(r.name) + '</b>' + watch + '<span class="sub">' + esc(r.slug) + '</span></td>' +
    '<td>' + esc(r.category || '—') + '</td>' +
    '<td>' + esc(chains) + '</td>' +
    '<td class="num">' + fmtUsd(r.tvl_usd) + '</td>' +
    '<td class="num ' + growthClass + '">' + growth + '</td>' +
    '<td class="num">' + fmtAge(r.age_days) + '</td>' +
    '<td class="num"><b>' + fmtUsd(r.implied_value_usd) + '</b></td>' +
    '</tr>';
}

/** Render `rows` into the board and update the count line. */
function renderBoard(rows) {
  var body = document.getElementById('rows');
  if (rows.length === 0) {
    body.innerHTML = '<tr><td colspan="8" class="empty">No protocols match these filters. Reset them to see the whole board.</td></tr>';
  } else {
    body.innerHTML = rows.map(rowHtml).join('');
  }
  document.getElementById('count').textContent =
    'Showing ' + rows.length + ' of ' + RADAR.rows.length + ' ranked protocols · ' +
    RADAR.watchlist_size + ' on the watchlist · ' + RADAR.early_size + ' found below the floor';
}

/** The already-trading table: market cap, not a model value. */
function renderLive() {
  var body = document.getElementById('live-rows');
  body.innerHTML = RADAR.live.map(function (p) {
    var growth = fmtPct(p.change_7d);
    var growthClass = (p.change_7d || 0) >= 0 ? 'pos' : 'neg';
    return '<tr><td class="name-cell"><b>' + esc(p.name) + '</b><span class="sub">' + esc(p.slug) + '</span></td>' +
      '<td>' + esc(p.category || '—') + '</td>' +
      '<td class="num">' + fmtUsd(p.tvl_usd) + '</td>' +
      '<td class="num">' + fmtUsd(p.mcap_usd) + '</td>' +
      '<td class="num ' + growthClass + '">' + growth + '</td></tr>';
  }).join('');
}

/** The header stat chips. */
function renderStats() {
  document.getElementById('stats').innerHTML =
    '<div class="stat"><b>' + RADAR.rows.length + '</b><span>ranked protocols</span></div>' +
    '<div class="stat"><b>' + RADAR.watchlist_size + '</b><span>on the watchlist</span></div>' +
    '<div class="stat"><b>' + fmtUsd(RADAR.rows[0].implied_value_usd) + '</b><span>top implied value</span></div>' +
    '<div class="stat"><b>' + RADAR.live_size + '</b><span>already trading</span></div>';
  document.getElementById('asof').textContent = RADAR.as_of;
  document.getElementById('source').textContent = RADAR.source;
}

/* Clicking a column header sorts by it; clicking a row opens its detail view. */
document.querySelectorAll('#board thead th').forEach(function (th) {
  th.addEventListener('click', function () {
    var key = th.getAttribute('data-sort');
    if (key === 'rank' || key === 'value') key = 'value';
    var sort = document.getElementById('sort');
    sort.value = key === 'value' ? 'value' : key;
    applyFilters();
  });
});
document.getElementById('rows').addEventListener('click', function (e) {
  var tr = e.target.closest('tr[data-slug]');
  if (tr) openDetail(tr.getAttribute('data-slug'));
});
