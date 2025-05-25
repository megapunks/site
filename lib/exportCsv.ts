// lib/exportCsv.ts
export function exportToCSV(data: any[], filename = "data.csv") {
  if (!data.length) return;

  const csvRows = [];
  const headers = Object.keys(data[0]);
  csvRows.push(headers.join(","));

  for (const row of data) {
    const values = headers.map((h) => JSON.stringify(row[h] ?? ""));
    csvRows.push(values.join(","));
  }

  const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
}
