import styles from "./scientific-periodic-table.module.css";

type ElementCell = {
  number?: number;
  symbol: string;
  placeholder?: boolean;
};

const e = (number: number, symbol: string): ElementCell => ({ number, symbol });
const gap = null;

const rows: Array<Array<ElementCell | null>> = [
  [e(1, "H"), gap, gap, gap, gap, gap, gap, gap, gap, gap, gap, gap, gap, gap, gap, gap, gap, e(2, "He")],
  [e(3, "Li"), e(4, "Be"), gap, gap, gap, gap, gap, gap, gap, gap, gap, gap, e(5, "B"), e(6, "C"), e(7, "N"), e(8, "O"), e(9, "F"), e(10, "Ne")],
  [e(11, "Na"), e(12, "Mg"), gap, gap, gap, gap, gap, gap, gap, gap, gap, gap, e(13, "Al"), e(14, "Si"), e(15, "P"), e(16, "S"), e(17, "Cl"), e(18, "Ar")],
  [e(19, "K"), e(20, "Ca"), e(21, "Sc"), e(22, "Ti"), e(23, "V"), e(24, "Cr"), e(25, "Mn"), e(26, "Fe"), e(27, "Co"), e(28, "Ni"), e(29, "Cu"), e(30, "Zn"), e(31, "Ga"), e(32, "Ge"), e(33, "As"), e(34, "Se"), e(35, "Br"), e(36, "Kr")],
  [e(37, "Rb"), e(38, "Sr"), e(39, "Y"), e(40, "Zr"), e(41, "Nb"), e(42, "Mo"), e(43, "Tc"), e(44, "Ru"), e(45, "Rh"), e(46, "Pd"), e(47, "Ag"), e(48, "Cd"), e(49, "In"), e(50, "Sn"), e(51, "Sb"), e(52, "Te"), e(53, "I"), e(54, "Xe")],
  [e(55, "Cs"), e(56, "Ba"), { symbol: "57–71", placeholder: true }, e(72, "Hf"), e(73, "Ta"), e(74, "W"), e(75, "Re"), e(76, "Os"), e(77, "Ir"), e(78, "Pt"), e(79, "Au"), e(80, "Hg"), e(81, "Tl"), e(82, "Pb"), e(83, "Bi"), e(84, "Po"), e(85, "At"), e(86, "Rn")],
  [e(87, "Fr"), e(88, "Ra"), { symbol: "89–103", placeholder: true }, e(104, "Rf"), e(105, "Db"), e(106, "Sg"), e(107, "Bh"), e(108, "Hs"), e(109, "Mt"), e(110, "Ds"), e(111, "Rg"), e(112, "Cn"), e(113, "Nh"), e(114, "Fl"), e(115, "Mc"), e(116, "Lv"), e(117, "Ts"), e(118, "Og")],
];

const lanthanoids = [
  e(57, "La"), e(58, "Ce"), e(59, "Pr"), e(60, "Nd"), e(61, "Pm"),
  e(62, "Sm"), e(63, "Eu"), e(64, "Gd"), e(65, "Tb"), e(66, "Dy"),
  e(67, "Ho"), e(68, "Er"), e(69, "Tm"), e(70, "Yb"), e(71, "Lu"),
];

const actinoids = [
  e(89, "Ac"), e(90, "Th"), e(91, "Pa"), e(92, "U"), e(93, "Np"),
  e(94, "Pu"), e(95, "Am"), e(96, "Cm"), e(97, "Bk"), e(98, "Cf"),
  e(99, "Es"), e(100, "Fm"), e(101, "Md"), e(102, "No"), e(103, "Lr"),
];

const metals = new Set([
  "Li", "Be", "Na", "Mg", "Al", "K", "Ca", "Sc", "Ti", "V", "Cr", "Mn", "Fe", "Co", "Ni", "Cu", "Zn", "Ga",
  "Rb", "Sr", "Y", "Zr", "Nb", "Mo", "Tc", "Ru", "Rh", "Pd", "Ag", "Cd", "In", "Sn",
  "Cs", "Ba", "La", "Ce", "Pr", "Nd", "Pm", "Sm", "Eu", "Gd", "Tb", "Dy", "Ho", "Er", "Tm", "Yb", "Lu",
  "Hf", "Ta", "W", "Re", "Os", "Ir", "Pt", "Au", "Hg", "Tl", "Pb", "Bi", "Po",
  "Fr", "Ra", "Ac", "Th", "Pa", "U", "Np", "Pu", "Am", "Cm", "Bk", "Cf", "Es", "Fm", "Md", "No", "Lr",
  "Rf", "Db", "Sg", "Bh", "Hs", "Mt", "Ds", "Rg", "Cn", "Nh", "Fl", "Mc", "Lv",
]);

const boundaries = new Set(["B", "Si", "Ge", "As", "Sb", "Te", "At"]);
const priorities = new Set(["Au", "Ag", "Cu", "Hg", "U"]);

function Cell({ cell }: { cell: ElementCell }) {
  const kind = cell.placeholder
    ? "placeholder"
    : metals.has(cell.symbol)
      ? "metal"
      : boundaries.has(cell.symbol)
        ? "boundary"
        : "nonmetal";

  return (
    <span
      className={`${styles.cell} ${styles[kind]} ${priorities.has(cell.symbol) ? styles.priority : ""}`}
      data-symbol={cell.symbol}
    >
      {cell.number && <small>{cell.number}</small>}
      <strong>{cell.symbol}</strong>
    </span>
  );
}

export function ScientificPeriodicTable({ className = "" }: { className?: string }) {
  return (
    <div className={`${styles.stage} ${className}`} aria-hidden="true">
      <div className={styles.mainTable}>
        {rows.flatMap((row, rowIndex) =>
          row.map((cell, columnIndex) =>
            cell ? (
              <Cell key={`${rowIndex}-${cell.symbol}`} cell={cell} />
            ) : (
              <span className={styles.gap} key={`${rowIndex}-${columnIndex}`} />
            ),
          ),
        )}
      </div>
      <div className={styles.fBlock}>
        {lanthanoids.map((cell) => <Cell key={cell.symbol} cell={cell} />)}
        {actinoids.map((cell) => <Cell key={cell.symbol} cell={cell} />)}
      </div>
      <div className={styles.legend}>
        <span><i className={styles.metalKey} /> Metallic elements</span>
        <span><i className={styles.boundaryKey} /> Metalloid boundary</span>
      </div>
    </div>
  );
}
