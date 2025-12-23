import React from "react";
import { listCols } from "././functions/definitions";
import { tbl } from "././styles";
import { stripeClass } from "././functions/ui";
import { getSecureUrl, valueOrNone } from "././functions/formutilities";

export default function CompanyTable({
  companies,
  selectedRows,
  robotsBlockedMap,
  isSelectAllChecked,
  selectAllCheckboxRef,
  onSelectAllChange,
  onRowCheckboxChange,
  onRowClick,
  disabled = false,
}) {
  const robotsBlockedSet = new Set(Object.keys(robotsBlockedMap));

  return (
    <div className="flex justify-center mt-2">
      <div className={tbl.root}>
        <div className={tbl.scroll}>
          <table className={tbl.table}>
            <thead>
              <tr>
                <th className={`${tbl.tableheaderCenter} ${tbl.checkboxCell}`}>
                  <input
                    ref={selectAllCheckboxRef}
                    type="checkbox"
                    className={tbl.checkbox}
                    aria-label="Select all companies"
                    checked={isSelectAllChecked}
                    onChange={onSelectAllChange}
                    disabled={disabled || !companies.length}
                  />
                </th>
                {listCols.map((col) => (
                  <th
                    key={col.key}
                    className={`${tbl.tableheader} ${col.columnClass ?? ""}`}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {companies.map((company, rowIdx) => {
                const companyId = String(company._id);
                const isSelected = selectedRows.has(company._id);
                const isRobotBlocked = robotsBlockedSet.has(companyId);
                const robotsMessage = robotsBlockedMap[companyId];

                const rowClassName = [
                  tbl.row,
                  stripeClass(rowIdx),
                  isSelected ? tbl.rowSelected : "",
                  isRobotBlocked ? tbl.rowRobotsBlocked : "",
                ]
                  .filter(Boolean)
                  .join(" ");

                const hoverClass = isRobotBlocked
                  ? "group-hover:bg-amber-100"
                  : "group-hover:bg-indigo-50";

                const baseCellClass = [
                  stripeClass(rowIdx),
                  isSelected ? tbl.rowSelectedCell : "",
                  isRobotBlocked ? tbl.rowRobotsBlockedCell : "",
                ]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <tr
                    key={company._id}
                    onClick={(event) => onRowClick(event, company)}
                    className={rowClassName.trim()}
                    title={robotsMessage || undefined}
                  >
                    <td
                      className={`${tbl.td} ${tbl.checkboxCell} ${baseCellClass} ${hoverClass}`.trim()}
                    >
                      <input
                        type="checkbox"
                        aria-label={`Select ${company.name || "company"}`}
                        className={tbl.checkbox}
                        checked={isSelected}
                        onChange={(event) =>
                          onRowCheckboxChange(event, company, rowIdx)
                        }
                      />
                    </td>
                    {listCols.map((col, colIdx) => {
                      const columnValue =
                        col.key === "address"
                          ? company.address
                          : company.rawData[col.key];
                      const content =
                        "render" in col
                          ? col.render(columnValue, getSecureUrl, company)
                          : valueOrNone(columnValue);

                      return (
                        <td
                          key={col.key}
                          className={`${tbl.td} ${baseCellClass} ${
                            col.columnClass ?? ""
                          } ${hoverClass}`.trim()}
                        >
                          <div className="flex flex-col gap-1">
                            {content}
                            {colIdx === 0 && isRobotBlocked ? (
                              <span className={tbl.robotBadge}>
                                robots.txt blocked
                              </span>
                            ) : null}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}