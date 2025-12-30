export default function Table({ headers, rows }) {
  return (
    <table className="w-full border">
      <thead className="bg-gray-100">
        <tr>
          {headers.map(h => (
            <th key={h} className="border p-2 text-left">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className="border-t">
            {row.map((cell, j) => (
              <td key={j} className="p-2">{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}