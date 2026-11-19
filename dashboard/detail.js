/* The detail view: one protocol's model breakdown and its seven farm steps. */
'use strict';

/** Open the detail view for a slug, or hide it when the slug is unknown. */
function openDetail(slug) {
  var row = null;
  RADAR.rows.forEach(function (r) { if (r.slug === slug) row = r; });
  var panel = document.getElementById('detail');
  if (!row) { panel.hidden = true; return; }
  selectedSlug = slug;
  document.getElementById('detail-kicker').textContent =
    'RANK #' + row.rank + ' · ' + (watchlist.has(slug) ? 'WATCHLIST · ' : '') + 'PRE-TOKEN — RECORDS NO TOKEN';
  document.getElementById('detail-name').textContent = row.name;
  document.getElementById('detail-sub').textContent =
    (row.category || 'Uncategorised') + ' · ' + (row.chains || []).join(', ') +
    ' · tracked since ' + (row.listed_at || 'unknown date') +
    ' · ' + fmtAge(row.age_days) + ' with no token recorded';
  var base = row.tvl_usd * 0.3;
  document.getElementById('detail-model').innerHTML =
    '<div><dt>TVL</dt><dd>' + fmtUsd(row.tvl_usd) + '</dd></div>' +
    '<div><dt>Base (TVL &times; 0.30)</dt><dd>' + fmtUsd(base) + '</dd></div>' +
    '<div><dt>7-day growth</dt><dd>' + fmtPct(row.change_7d) + '</dd></div>' +
    '<div><dt>Growth multiplier</dt><dd>&times;' + row.growth_multiplier.toFixed(4) + '</dd></div>' +
    '<div><dt>Maturity multiplier</dt><dd>&times;' + row.maturity_multiplier.toFixed(4) + '</dd></div>' +
    '<div><dt>Implied value</dt><dd><b>' + fmtUsd(row.implied_value_usd) + '</b></dd></div>';
  document.getElementById('detail-steps').innerHTML =
    row.farm_steps.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('');
  panel.hidden = false;
  panel.scrollIntoView({ behavior: 'auto', block: 'start' });
}

document.getElementById('detail-close').addEventListener('click', function () {
  document.getElementById('detail').hidden = true;
  selectedSlug = null;
  applyFilters();
});
