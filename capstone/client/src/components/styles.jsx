// Centralized TailwindCSS styles used across components; edit classnames here to update styles globally
// Page layout
export const layout = {
  app: "min-h-screen bg-slate-900 bg-gradient-to-br from-blue-900/10",
  container: "max-w-[85vw] mx-auto pb-3",
  page: "min-h-screen bg-slate-900 bg-gradient-to-br from-blue-900/20 to-sky-900/10",
  body: "flex items-center justify-center flex-col mx-auto",
  header:
    "flex w-full items-center bg-slate-900 bg-gradient-to-br from-blue-700/20 to-sky-400/10 justify-between mb-4 px-6 py-2 rounded-lg shadow-sm",
  actions: "flex gap-2",
  stats: "text-zinc-200 text-md mt-3",
  content: "mx-auto w-full max-w-[85vw] px-4 ",
  error: "text-rose-500",
   plusButton:
    "fixed bottom-10 right-[calc((100vw-92vw)/2)] w-12 h-12 rounded-full bg-slate-600 text-white text-2xl grid place-items-center shadow-xl hover:bg-slate-500",
};

// Grouping elements; helper
export const group = {
  right: "flex justify-end gap-2",
  between: "flex items-center justify-between gap-2",
};

// Tables
export const tbl = {
  root: "w-full overflow-hidden rounded-2xl border border-slate-200 shadow-xl bg-slate-900 ",
  scroll: "overflow-visible",
  table: "w-full table-auto border-collapse ",
  tableheader:
    "sticky top-0 z-10 bg-slate-800 text-zinc-100 font-semibold text-xs tracking-wide uppercase px-3 py-3 text-left",
  tableheaderCenter:
    "sticky top-0 z-10 bg-slate-800 text-white font-semibold text-xs tracking-wide uppercase px-3 py-3 text-center ",
  th: "px-3 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 align-top border-b border-slate-200",
  td: "px-3 py-3 align-top text-sm text-slate-700 border-b border-slate-200 transition-colors ",
  row: "group cursor-pointer transition-colors hover:bg-indigo-50 focus-within:bg-indigo-50 ",
  rowSelected: "bg-indigo-200 ",
  rowSelectedCell: "!bg-indigo-200",
  rowRobotsBlocked:
    "bg-amber-50 hover:bg-amber-100 focus-within:bg-amber-100 border-l-4 border-amber-300",
  rowRobotsBlockedCell: "!bg-amber-50",
  robotBadge:
    "inline-flex w-fit items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-amber-700",
  link: "text-indigo-600 hover:text-indigo-500 font-semibold underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-400 rounded-sm",
  headerCell:
    "bg-slate-600 text-white text-center px-4 py-3 font-semibold uppercase text-xs tracking-wider",
  cell: "px-4 py-3 align-top text-sm",
  modalTable:
    "w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm ",
  addressColumn: "max-w-[16rem]  overflow-hidden text-ellipsis whitespace-nowrap break-words",
  websiteColumn:
    "max-w-[12rem] truncate whitespace-nowrap overflow-hidden text-ellipsis",
  compactColumn: "whitespace-nowrap text-ellipsis overflow-hidden max-w-[12rem]",
  checkboxCell: "w-12 text-center align-middle",
  checkbox:
    "h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0",
};

// Forms
export const form = {
  input:
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 outline-none focus:ring-2 focus:ring-indigo-400 text-slate-700 transition-colors",
  edit: "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-400 text-slate-700",
  select:
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 pr-10 outline-none focus:ring-2 focus:ring-indigo-400 text-slate-700 appearance-none",
  label: "block text-sm font-medium mb-1.5 text-slate-700",
  labelText: "block text-sm font-medium mb-2 text-slate-700",
  requiredStar: "text-rose-500 ml-1",
  stack: "grid gap-4",
  inputError: "border-rose-400 ring-1 ring-rose-300 focus:ring-rose-300",
  errorText: "text-xs text-rose-600",
};

// Buttons
export const buttonBase =
  "inline-flex items-center gap-2 font-semibold rounded-md px-3 py-2 transition text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:opacity-50";
export const btn = {
  primary: `${buttonBase} bg-slate-600 text-white hover:bg-slate-500`,
  success: `${buttonBase} bg-emerald-600 text-white hover:bg-emerald-700`,
  danger: `${buttonBase} bg-rose-700 text-white hover:bg-rose-600`,
  ghost: `${buttonBase} bg-slate-100 hover:bg-slate-200 text-slate-800`,
  icon: "bg-transparent text-slate-400 hover:text-indigo-600 p-0 text-2xl leading-none",
  tableAction:
    "inline-flex items-center justify-center rounded-full bg-slate-900/5 px-2 py-1 text-indigo-500 hover:text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-400 transition",
};

// Modals
export const modal = {
  overlay:
    "fixed inset-0 z-[1000] bg-black/50 backdrop-blur-sm flex items-center justify-center p-6",
  panel:
    "relative w-[92vw] max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl border border-slate-100 bg-white text-slate-900 shadow-2xl p-6",
  edit: "relative w-[92vw] max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl border border-slate-100 bg-white text-slate-900 shadow-2xl p-6",
  header:
    "sticky top-0 z-10 -mx-6 -mt-6 mb-4 px-6 py-4 border-b border-slate-200 bg-white flex items-center justify-between",
  title: "text-xl font-bold mb-1 flex items-center justify-between gap-2",
  footer: "mt-3",
  divider: "my-2 h-px w-full bg-slate-200",
};

// Toast notifications
export const toast = {
  wrapper:
    "fixed top-4 right-4 z-[10000] flex flex-col gap-3 pointer-events-none",
  cardBase:
    "pointer-events-auto flex items-start gap-3 rounded-xl border bg-white/95 px-4 py-3 shadow-lg backdrop-blur transition-all text-sm text-slate-700",
  success: "border-emerald-200 text-emerald-800",
  error: "border-rose-200 text-rose-800",
  info: "border-slate-200 text-slate-700",
};
