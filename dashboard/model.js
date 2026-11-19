/* Formatting helpers: every number on the page passes through here. */
'use strict';

/** $1.23B / $456.7M / $12.3K / $42, from a whole-dollar figure. */
function fmtUsd(n) {
  if (n === null || n === undefined || !isFinite(n)) return '—';
  if (n >= 1e9) return '$' + (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return '$' + (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return '$' + (n / 1e3).toFixed(1) + 'K';
  return '$' + Math.round(n).toLocaleString('en-US');
}

/** +4.2% / −8.4% / —, from a change_7d figure in per cent. */
function fmtPct(n) {
  if (n === null || n === undefined || !isFinite(n)) return '—';
  return (n >= 0 ? '+' : '−') + Math.abs(n).toFixed(1) + '%';
}

/** 812 days / 3 days / —, from an age in days. */
function fmtAge(days) {
  if (days === null || days === undefined) return '—';
  if (days < 1) return 'under a day';
  return days.toLocaleString('en-US') + (days === 1 ? ' day' : ' days');
}

/** Escape text before it goes into the page. */
function esc(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}
