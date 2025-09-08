import { useState } from 'react';
import { FaUpload, FaFileExcel, FaInfoCircle } from 'react-icons/fa';
import { importarFacturasExcel } from '../api/Facturas';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export default function ImportarFacturasExcel({ onDone }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await importarFacturasExcel(file);
      setResult(data);
      onDone?.(data);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Error al importar');
    } finally {
      setLoading(false);
    }
  };

  // 👉 Descargar plantilla de Excel con columna `fechaEmision`
  const downloadTemplateXlsx = () => {
    const data = [
      {
        numero: 'FF10-500',
        cliente: 'Cliente XYZ',
        ruc: '20000000000',
        moneda: 'PEN',
        observaciones: 'Factura agosto lote 1',
        numeroGuia: 'G-001',
        monto: 500,
        fechaEmision: '2025-08-21' // 👈 ejemplo YYYY-MM-DD
      },
    ];

    const header = [
      'numero',
      'cliente',
      'ruc',
      'moneda',
      'observaciones',
      'numeroGuia',
      'monto',
      'fechaEmision'
    ];

    const ws = XLSX.utils.json_to_sheet(data, { header });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Facturas');

    ws['!cols'] = [
      { wch: 12 }, // numero
      { wch: 20 }, // cliente
      { wch: 20 }, // ruc
      { wch: 8 },  // moneda
      { wch: 30 }, // observaciones
      { wch: 12 }, // numeroGuia
      { wch: 10 }, // monto
      { wch: 15 }  // fechaEmision
    ];

    const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([buf], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    saveAs(blob, 'plantilla_facturas.xlsx');
  };

  return (
    <section className="bg-neutral-900 rounded-2xl shadow-lg p-4 md:p-6 text-white">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Importar facturas desde Excel</h2>
        <button
          onClick={downloadTemplateXlsx}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-sm"
        >
          <FaFileExcel /> Descargar plantilla (Excel)
        </button>
      </div>

      <div className="text-white/70 text-sm flex items-start gap-2 mb-3">
        <FaInfoCircle className="mt-0.5" />
        <div>
          Usa cabeceras exactas:{' '}
          <code>
            numero, cliente, ruc, moneda, observaciones, numeroGuia, monto, fechaEmision
          </code>.
          <br />
          - <b>Varias filas</b> con el mismo <b>numero</b> se agrupan en una sola factura. <br />
          - <b>fechaEmision</b> debe ir en formato <code>YYYY-MM-DD</code>.
        </div>
      </div>

      <form onSubmit={onSubmit} className="grid gap-3">
        <input
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="file:mr-3 file:px-3 file:py-2 file:rounded-xl file:border-0 file:bg-white file:text-black file:font-semibold
                     px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white"
        />
        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={!file || loading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-500 hover:bg-violet-600 disabled:opacity-50"
          >
            <FaUpload /> {loading ? 'Importando…' : 'Importar'}
          </button>
          {file && <span className="text-white/60 text-sm">{file.name}</span>}
        </div>
      </form>

      {error && <p className="text-red-400 text-sm mt-3">{String(error)}</p>}

      {result && (
        <div className="mt-4 grid gap-2">
          <div className="text-sm text-white/80">
            Importadas: <b>{result.imported}</b> | Errores: <b>{result.errors?.length || 0}</b>
          </div>

          {result.errors?.length > 0 && (
            <div className="bg-neutral-800/60 rounded-xl p-3">
              <div className="text-white/70 text-sm font-semibold mb-1">Errores</div>
              <ul className="list-disc pl-5 text-sm">
                {result.errors.map((e, idx) => (
                  <li key={idx} className="text-red-300">
                    {e.row ? `Fila ${e.row}:` : ''} {e.error}{' '}
                    {e.numero ? `— factura ${e.numero}` : ''}{' '}
                    {e.numeroGuia ? `— guía ${e.numeroGuia}` : ''}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {Array.isArray(result.facturas) && result.facturas.length > 0 && (
            <div className="bg-neutral-800/60 rounded-xl p-3">
              <div className="text-white/70 text-sm font-semibold mb-1">Resumen</div>
              <ul className="list-disc pl-5 text-sm">
                {result.facturas.map((f) => (
                  <li key={f._id} className="text-white/90">
                    {f.numero} — {f.cliente || '—'} — S/{' '}
                    {new Intl.NumberFormat('es-PE', {
                      minimumFractionDigits: 2
                    }).format(f.total)}{' '}
                    — 📅{' '}
                    {f.fechaEmision
                      ? new Date(f.fechaEmision).toLocaleDateString('es-PE')
                      : '—'}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
