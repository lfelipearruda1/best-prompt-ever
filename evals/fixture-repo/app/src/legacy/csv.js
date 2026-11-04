// Old CSV helper. No tests.
module.exports = function toCsv(rows) {
  return rows.map(function (r) { return Object.values(r).join(","); }).join("\n");
};
