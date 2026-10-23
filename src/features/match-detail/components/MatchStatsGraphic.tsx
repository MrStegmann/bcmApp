import React, { forwardRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import { MatchStatsGraphicProps } from "../types";

export const MatchStatsGraphic = forwardRef<View, MatchStatsGraphicProps>(
  ({ data, captureRefTarget }, forwardedRef) => {
    const targetRef = (forwardedRef as React.RefObject<View>) || captureRefTarget;

    const {
      homeTeamName,
      rivalTeamName,
      roundAndDate,
      players,
      totals,
      periods,
      advancedStats,
    } = data;

    return (
      <View
        ref={targetRef}
        collapsable={false}
        style={styles.container}
        testID="match-stats-graphic-canvas"
      >
        {/* Header Metadata Section */}
        <View style={styles.headerRow}>
          <View style={[styles.headerCard, styles.homeTeamCard]}>
            <Text style={styles.headerCardLabel}>EQUIPO</Text>
            <Text style={styles.headerCardValue} numberOfLines={1}>
              {homeTeamName}
            </Text>
          </View>

          <View style={[styles.headerCard, styles.centerCard]}>
            <Text style={styles.headerCardLabel}>JORNADA Y FECHA</Text>
            <Text style={styles.headerCardCenterValue} numberOfLines={1}>
              {roundAndDate}
            </Text>
          </View>

          <View style={[styles.headerCard, styles.rivalTeamCard]}>
            <Text style={styles.headerCardLabel}>RIVAL</Text>
            <Text style={styles.headerCardValue} numberOfLines={1}>
              {rivalTeamName}
            </Text>
          </View>
        </View>

        {/* 24-Column Box Score Table */}
        <View style={styles.tableCard}>
          {/* Table Column Headers */}
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.thCell, styles.colNum]}>Núm.</Text>
            <Text style={[styles.thCell, styles.colName]}>Nombre</Text>
            <Text style={[styles.thCell, styles.colMin]}>Min</Text>
            <Text style={[styles.thCell, styles.colPts, styles.thHighlight]}>Pts</Text>
            <Text style={[styles.thCell, styles.colStat]}>T2A</Text>
            <Text style={[styles.thCell, styles.colStat]}>T2I</Text>
            <Text style={[styles.thCell, styles.colPct, styles.thHighlight]}>T2%</Text>
            <Text style={[styles.thCell, styles.colStat]}>T3A</Text>
            <Text style={[styles.thCell, styles.colStat]}>T3I</Text>
            <Text style={[styles.thCell, styles.colPct, styles.thHighlight]}>T3%</Text>
            <Text style={[styles.thCell, styles.colStat]}>T1A</Text>
            <Text style={[styles.thCell, styles.colStat]}>T1I</Text>
            <Text style={[styles.thCell, styles.colPct, styles.thHighlight]}>T1%</Text>
            <Text style={[styles.thCell, styles.colReb]}>DReb</Text>
            <Text style={[styles.thCell, styles.colReb]}>OReb</Text>
            <Text style={[styles.thCell, styles.colTReb, styles.thHighlight]}>TReb</Text>
            <Text style={[styles.thCell, styles.colStat]}>Asis</Text>
            <Text style={[styles.thCell, styles.colStat]}>Rec</Text>
            <Text style={[styles.thCell, styles.colStat]}>Per</Text>
            <Text style={[styles.thCell, styles.colStat]}>TapF</Text>
            <Text style={[styles.thCell, styles.colStat]}>TapC</Text>
            <Text style={[styles.thCell, styles.colStat]}>Falt</Text>
            <Text style={[styles.thCell, styles.colStat]}>FaltR</Text>
            <Text style={[styles.thCell, styles.colVal, styles.thHighlightVal]}>Val</Text>
          </View>

          {/* Player Rows */}
          {players.map((p, index) => {
            const isEven = index % 2 === 0;
            return (
              <View
                key={`${p.jerseyNumber}-${p.playerName}-${index}`}
                style={[styles.tableDataRow, isEven ? styles.rowEven : styles.rowOdd]}
              >
                <Text style={[styles.tdCell, styles.colNum, styles.boldText]}>
                  {p.jerseyNumber}
                </Text>
                <Text style={[styles.tdCell, styles.colName, styles.textLeft]} numberOfLines={1}>
                  {p.playerName}
                </Text>
                <Text style={[styles.tdCell, styles.colMin]}>{p.minutes}</Text>
                <Text style={[styles.tdCell, styles.colPts, styles.tdHighlight, styles.boldText]}>
                  {p.pts}
                </Text>
                <Text style={[styles.tdCell, styles.colStat]}>{p.t2a}</Text>
                <Text style={[styles.tdCell, styles.colStat]}>{p.t2i}</Text>
                <Text style={[styles.tdCell, styles.colPct, styles.tdHighlight]}>{p.t2p}</Text>
                <Text style={[styles.tdCell, styles.colStat]}>{p.t3a}</Text>
                <Text style={[styles.tdCell, styles.colStat]}>{p.t3i}</Text>
                <Text style={[styles.tdCell, styles.colPct, styles.tdHighlight]}>{p.t3p}</Text>
                <Text style={[styles.tdCell, styles.colStat]}>{p.t1a}</Text>
                <Text style={[styles.tdCell, styles.colStat]}>{p.t1i}</Text>
                <Text style={[styles.tdCell, styles.colPct, styles.tdHighlight]}>{p.t1p}</Text>
                <Text style={[styles.tdCell, styles.colReb]}>{p.dreb}</Text>
                <Text style={[styles.tdCell, styles.colReb]}>{p.oreb}</Text>
                <Text style={[styles.tdCell, styles.colTReb, styles.tdHighlight, styles.boldText]}>
                  {p.treb}
                </Text>
                <Text style={[styles.tdCell, styles.colStat]}>{p.asis}</Text>
                <Text style={[styles.tdCell, styles.colStat]}>{p.rec}</Text>
                <Text style={[styles.tdCell, styles.colStat]}>{p.per}</Text>
                <Text style={[styles.tdCell, styles.colStat]}>{p.tapF}</Text>
                <Text style={[styles.tdCell, styles.colStat]}>{p.tapC}</Text>
                <Text style={[styles.tdCell, styles.colStat]}>{p.falt}</Text>
                <Text style={[styles.tdCell, styles.colStat]}>{p.faltR}</Text>
                <Text style={[styles.tdCell, styles.colVal, styles.tdHighlightVal, styles.boldText]}>
                  {p.val}
                </Text>
              </View>
            );
          })}

          {/* EQUIPO Summary Row */}
          <View style={styles.totalsRow}>
            <Text style={[styles.totalsCell, styles.colNum]} />
            <Text style={[styles.totalsCell, styles.colName, styles.textLeft, styles.boldText]}>
              {totals.label}
            </Text>
            <Text style={[styles.totalsCell, styles.colMin, styles.boldText]}>
              {totals.minutes}
            </Text>
            <Text style={[styles.totalsCell, styles.colPts, styles.boldText, styles.totalsHighlight]}>
              {totals.pts}
            </Text>
            <Text style={[styles.totalsCell, styles.colStat, styles.boldText]}>{totals.t2a}</Text>
            <Text style={[styles.totalsCell, styles.colStat, styles.boldText]}>{totals.t2i}</Text>
            <Text style={[styles.totalsCell, styles.colPct, styles.boldText, styles.totalsHighlight]}>
              {totals.t2p}
            </Text>
            <Text style={[styles.totalsCell, styles.colStat, styles.boldText]}>{totals.t3a}</Text>
            <Text style={[styles.totalsCell, styles.colStat, styles.boldText]}>{totals.t3i}</Text>
            <Text style={[styles.totalsCell, styles.colPct, styles.boldText, styles.totalsHighlight]}>
              {totals.t3p}
            </Text>
            <Text style={[styles.totalsCell, styles.colStat, styles.boldText]}>{totals.t1a}</Text>
            <Text style={[styles.totalsCell, styles.colStat, styles.boldText]}>{totals.t1i}</Text>
            <Text style={[styles.totalsCell, styles.colPct, styles.boldText, styles.totalsHighlight]}>
              {totals.t1p}
            </Text>
            <Text style={[styles.totalsCell, styles.colReb, styles.boldText]}>{totals.dreb}</Text>
            <Text style={[styles.totalsCell, styles.colReb, styles.boldText]}>{totals.oreb}</Text>
            <Text style={[styles.totalsCell, styles.colTReb, styles.boldText, styles.totalsHighlight]}>
              {totals.treb}
            </Text>
            <Text style={[styles.totalsCell, styles.colStat, styles.boldText]}>{totals.asis}</Text>
            <Text style={[styles.totalsCell, styles.colStat, styles.boldText]}>{totals.rec}</Text>
            <Text style={[styles.totalsCell, styles.colStat, styles.boldText]}>{totals.per}</Text>
            <Text style={[styles.totalsCell, styles.colStat, styles.boldText]}>{totals.tapF}</Text>
            <Text style={[styles.totalsCell, styles.colStat, styles.boldText]}>{totals.tapC}</Text>
            <Text style={[styles.totalsCell, styles.colStat, styles.boldText]}>{totals.falt}</Text>
            <Text style={[styles.totalsCell, styles.colStat, styles.boldText]}>{totals.faltR}</Text>
            <Text style={[styles.totalsCell, styles.colVal, styles.boldText, styles.totalsHighlightVal]}>
              {totals.val}
            </Text>
          </View>
        </View>

        {/* Lower Summary Cards Section (Advanced Stats & Parciales) */}
        <View style={styles.lowerSection}>
          {/* Advanced Stats Lower-Left Block */}
          <View style={styles.advancedStatsCard}>
            <View style={styles.subCardHeader}>
              <Text style={styles.subCardTitle}>ESTADÍSTICAS AVANZADAS</Text>
            </View>
            <View style={styles.advStatsGrid}>
              <View style={styles.advStatRow}>
                <View style={styles.advStatCol}>
                  <Text style={styles.advStatLabel}>Posesiones:</Text>
                  <Text style={styles.advStatValue}>{advancedStats.posesiones}</Text>
                </View>
                <View style={styles.advStatCol}>
                  <Text style={styles.advStatLabel}>OER:</Text>
                  <Text style={styles.advStatValue}>{advancedStats.oer}</Text>
                </View>
              </View>

              <View style={styles.advStatRow}>
                <View style={styles.advStatCol}>
                  <Text style={styles.advStatLabel}>DER*:</Text>
                  <Text style={styles.advStatValue}>{advancedStats.der}</Text>
                </View>
                <View style={styles.advStatCol}>
                  <Text style={styles.advStatLabel}>eFG%:</Text>
                  <Text style={styles.advStatValue}>{advancedStats.efg}</Text>
                </View>
              </View>

              <View style={styles.advStatRow}>
                <View style={styles.advStatCol}>
                  <Text style={styles.advStatLabel}>ORB%*:</Text>
                  <Text style={styles.advStatValue}>{advancedStats.orb}</Text>
                </View>
                <View style={styles.advStatCol}>
                  <Text style={styles.advStatLabel}>AST%:</Text>
                  <Text style={styles.advStatValue}>{advancedStats.ast}</Text>
                </View>
              </View>

              <View style={styles.advStatRow}>
                <View style={styles.advStatCol}>
                  <Text style={styles.advStatLabel}>TOV%:</Text>
                  <Text style={styles.advStatValue}>{advancedStats.tov}</Text>
                </View>
                <View style={styles.advStatCol}>
                  <Text style={styles.advStatLabel}>TLR%:</Text>
                  <Text style={styles.advStatValue}>{advancedStats.tlr}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Parciales Lower-Right Block */}
          <View style={styles.periodsCard}>
            <View style={styles.subCardHeader}>
              <Text style={styles.subCardTitle}>PARCIALES</Text>
            </View>
            <View style={styles.periodsTable}>
              <View style={styles.periodsTableHeader}>
                <Text style={[styles.periodsThCell, styles.periodsTeamCol]}>
                  {homeTeamName}
                </Text>
                <Text style={[styles.periodsThCell, styles.periodsCenterCol]}>Periodo</Text>
                <Text style={[styles.periodsThCell, styles.periodsTeamCol]}>
                  {rivalTeamName}
                </Text>
              </View>

              {periods.map((item, idx) => {
                const isFinal = item.period === "Final";
                return (
                  <View
                    key={`${item.period}-${idx}`}
                    style={[styles.periodsTableRow, isFinal && styles.periodsFinalRow]}
                  >
                    <Text
                      style={[
                        styles.periodsTdCell,
                        styles.periodsTeamCol,
                        isFinal && styles.boldText,
                      ]}
                    >
                      {item.homeScore}
                    </Text>
                    <Text
                      style={[
                        styles.periodsTdCell,
                        styles.periodsCenterCol,
                        isFinal && styles.boldText,
                      ]}
                    >
                      {item.period}
                    </Text>
                    <Text
                      style={[
                        styles.periodsTdCell,
                        styles.periodsTeamCol,
                        isFinal && styles.boldText,
                      ]}
                    >
                      {item.rivalScore}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        {/* Footer / Branding */}
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>
            Basketball Club Manager (BCM) • Estadística Oficial de Partido
          </Text>
        </View>
      </View>
    );
  }
);

MatchStatsGraphic.displayName = "MatchStatsGraphic";

const styles = StyleSheet.create({
  container: {
    width: 1280,
    backgroundColor: "#ffffff",
    padding: 24,
    borderRadius: 8,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 16,
  },
  headerCard: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#cbd5e1",
  },
  homeTeamCard: {
    flex: 3,
    backgroundColor: "#f8fafc",
  },
  centerCard: {
    flex: 2,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
  },
  rivalTeamCard: {
    flex: 3,
    backgroundColor: "#f8fafc",
    alignItems: "flex-end",
  },
  headerCardLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748b",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  headerCardValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0f172a",
  },
  headerCardCenterValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#334155",
  },

  // Table Styles
  tableCard: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 20,
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#1e293b",
    paddingVertical: 10,
    alignItems: "center",
  },
  thCell: {
    color: "#f8fafc",
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
  },
  thHighlight: {
    backgroundColor: "#334155",
  },
  thHighlightVal: {
    backgroundColor: "#065f46",
    color: "#a7f3d0",
  },

  tableDataRow: {
    flexDirection: "row",
    paddingVertical: 7,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  rowEven: {
    backgroundColor: "#ffffff",
  },
  rowOdd: {
    backgroundColor: "#f8fafc",
  },
  tdCell: {
    fontSize: 12,
    color: "#1e293b",
    textAlign: "center",
  },
  tdHighlight: {
    backgroundColor: "#f1f5f9",
  },
  tdHighlightVal: {
    backgroundColor: "#ecfdf5",
    color: "#047857",
  },

  // Totals Row
  totalsRow: {
    flexDirection: "row",
    backgroundColor: "#0f172a",
    paddingVertical: 9,
    alignItems: "center",
    borderTopWidth: 2,
    borderTopColor: "#0f172a",
  },
  totalsCell: {
    color: "#ffffff",
    fontSize: 12,
    textAlign: "center",
  },
  totalsHighlight: {
    backgroundColor: "#1e293b",
    color: "#38bdf8",
  },
  totalsHighlightVal: {
    backgroundColor: "#064e3b",
    color: "#6ee7b7",
  },

  boldText: {
    fontWeight: "800",
  },
  textLeft: {
    textAlign: "left",
    paddingLeft: 6,
  },

  // Column Widths (total ~1232px)
  colNum: { width: 44 },
  colName: { width: 220 },
  colMin: { width: 46 },
  colPts: { width: 52 },
  colStat: { width: 46 },
  colPct: { width: 54 },
  colReb: { width: 48 },
  colTReb: { width: 52 },
  colVal: { width: 54 },

  // Lower Section
  lowerSection: {
    flexDirection: "row",
    gap: 24,
    marginBottom: 16,
  },
  advancedStatsCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 6,
    overflow: "hidden",
    backgroundColor: "#ffffff",
  },
  periodsCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 6,
    overflow: "hidden",
    backgroundColor: "#ffffff",
  },
  subCardHeader: {
    backgroundColor: "#1e293b",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  subCardTitle: {
    color: "#f8fafc",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  advStatsGrid: {
    padding: 12,
    gap: 8,
  },
  advStatRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  advStatCol: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: "#f8fafc",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  advStatLabel: {
    fontSize: 12,
    color: "#475569",
    fontWeight: "600",
  },
  advStatValue: {
    fontSize: 12,
    color: "#0f172a",
    fontWeight: "700",
  },

  // Periods Table
  periodsTable: {
    padding: 10,
  },
  periodsTableHeader: {
    flexDirection: "row",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#cbd5e1",
  },
  periodsThCell: {
    fontSize: 12,
    fontWeight: "700",
    color: "#475569",
    textAlign: "center",
  },
  periodsTableRow: {
    flexDirection: "row",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  periodsFinalRow: {
    borderTopWidth: 2,
    borderTopColor: "#0f172a",
    backgroundColor: "#f8fafc",
    marginTop: 2,
  },
  periodsTdCell: {
    fontSize: 12,
    color: "#1e293b",
    textAlign: "center",
  },
  periodsTeamCol: {
    flex: 2,
  },
  periodsCenterCol: {
    flex: 1,
  },

  // Footer
  footerRow: {
    alignItems: "center",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  footerText: {
    fontSize: 11,
    color: "#94a3b8",
    fontWeight: "500",
  },
});
