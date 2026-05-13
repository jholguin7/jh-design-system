/**
 * Generic PDF report helper. Strips AIA domain coupling (funnel/leads/api).
 *
 * Consumers supply a `ReportData` shape and call `generatePdf(data, opts)`.
 * For more sophisticated reports (multi-section, KPIs, charts) extend this
 * file in your consumer app — registry copies the source verbatim, so you own it.
 */
import { jsPDF } from "jspdf";

export interface ReportColumn {
  key: string;
  label: string;
  width?: number;
}

export interface ReportData {
  title: string;
  subtitle?: string;
  generatedAt?: Date;
  columns: ReportColumn[];
  rows: Record<string, string | number>[];
}

export interface GeneratePdfOptions {
  filename?: string;
  /** Orientation: portrait or landscape */
  orientation?: "portrait" | "landscape";
  /** Page format (default: a4) */
  format?: string | number[];
  /** Optional branding header colour (hex). Defaults to neutral grey. */
  brandColor?: string;
}

export function generatePdf(data: ReportData, opts: GeneratePdfOptions = {}): jsPDF {
  const {
    orientation = "portrait",
    format = "a4",
    brandColor = "#1b1b18",
  } = opts;

  const doc = new jsPDF({ orientation, format, unit: "pt" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;

  // Title
  doc.setFontSize(18);
  doc.setTextColor(brandColor);
  doc.text(data.title, margin, margin + 10);

  // Subtitle
  if (data.subtitle) {
    doc.setFontSize(11);
    doc.setTextColor("#6a6a64");
    doc.text(data.subtitle, margin, margin + 28);
  }

  // Generated-at footer (top-right)
  const generatedAt = data.generatedAt ?? new Date();
  doc.setFontSize(9);
  doc.setTextColor("#959590");
  doc.text(generatedAt.toLocaleString(), pageWidth - margin, margin + 10, {
    align: "right",
  });

  // Column headers
  const tableTop = margin + 56;
  const colCount = data.columns.length;
  const colWidth = (pageWidth - 2 * margin) / colCount;

  doc.setFontSize(10);
  doc.setTextColor(brandColor);
  data.columns.forEach((col, i) => {
    doc.text(col.label, margin + i * colWidth, tableTop);
  });

  // Header underline
  doc.setDrawColor("#e5e5e0");
  doc.line(margin, tableTop + 4, pageWidth - margin, tableTop + 4);

  // Rows
  doc.setTextColor("#1b1b18");
  let y = tableTop + 22;
  for (const row of data.rows) {
    if (y > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage();
      y = margin + 20;
    }
    data.columns.forEach((col, i) => {
      const v = row[col.key];
      doc.text(String(v ?? ""), margin + i * colWidth, y);
    });
    y += 16;
  }

  return doc;
}

/** Helper: trigger browser download. */
export function downloadPdf(doc: jsPDF, filename: string): void {
  doc.save(filename);
}
