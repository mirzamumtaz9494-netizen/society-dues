import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';
import { Society, Due, Expense, FinancialSummary } from '@/lib/types';
import { formatMonthYear } from '@/lib/format';

const styles = StyleSheet.create({
  page: {
    padding: 32,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
    fontSize: 9,
    color: '#0F172A',
  },
  header: {
    borderBottomWidth: 2,
    borderBottomColor: '#312E81',
    paddingBottom: 10,
    marginBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  societyName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1E1B4B',
  },
  societyAddress: {
    fontSize: 8,
    color: '#64748B',
    marginTop: 2,
    maxWidth: 350,
  },
  reportBadge: {
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
    borderRadius: 6,
    padding: 6,
    alignItems: 'flex-end',
  },
  reportTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#4338CA',
    textTransform: 'uppercase',
  },
  reportPeriod: {
    fontSize: 8.5,
    color: '#1E293B',
    marginTop: 2,
    fontWeight: 'bold',
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 8,
  },
  summaryBox: {
    flex: 1,
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
  },
  boxBilled: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  boxCollected: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  boxExpenses: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  boxSurplus: {
    backgroundColor: '#EEF2FF',
    borderColor: '#C7D2FE',
  },
  summaryLabel: {
    fontSize: 7,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#64748B',
    marginBottom: 3,
  },
  summaryValue: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  sectionHeading: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1E293B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 10,
    marginBottom: 6,
    paddingBottom: 3,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  table: {
    width: '100%',
    marginBottom: 12,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#CBD5E1',
    paddingVertical: 5,
    paddingHorizontal: 6,
  },
  thCol: {
    fontSize: 7.5,
    fontWeight: 'bold',
    color: '#475569',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingVertical: 4.5,
    paddingHorizontal: 6,
  },
  tdCol: {
    fontSize: 7.5,
    color: '#1E293B',
  },
  badgePaid: {
    color: '#15803D',
    fontWeight: 'bold',
  },
  badgeUnpaid: {
    color: '#B45309',
    fontWeight: 'bold',
  },
  badgeOverdue: {
    color: '#B91C1C',
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#CBD5E1',
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 7,
    color: '#64748B',
  },
});

interface FinancialStatementPDFProps {
  society: Society;
  monthYear: string;
  dues: Due[];
  expenses: Expense[];
  summary: FinancialSummary;
}

export function FinancialStatementPDF({
  society,
  monthYear,
  dues,
  expenses,
  summary,
}: FinancialStatementPDFProps) {
  const formattedMonth = formatMonthYear(monthYear);
  const now = new Date().toLocaleDateString('en-IN');

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.societyName}>{society.name}</Text>
            <Text style={styles.societyAddress}>{society.address}</Text>
            <Text style={styles.societyAddress}>
              Treasurer: {society.treasurer_name || 'Managing Committee'} | UPI: {society.upi_id}
            </Text>
          </View>
          <View style={styles.reportBadge}>
            <Text style={styles.reportTitle}>RWA Financial Statement</Text>
            <Text style={styles.reportPeriod}>{formattedMonth}</Text>
          </View>
        </View>

        {/* 4 Summary Scorecards */}
        <View style={styles.summaryGrid}>
          <View style={[styles.summaryBox, styles.boxBilled]}>
            <Text style={styles.summaryLabel}>Total Dues Expected</Text>
            <Text style={[styles.summaryValue, { color: '#0F172A' }]}>
              Rs. {summary.totalDuesExpected.toLocaleString('en-IN')}
            </Text>
          </View>
          <View style={[styles.summaryBox, styles.boxCollected]}>
            <Text style={styles.summaryLabel}>Total Collected ({summary.collectionRate}%)</Text>
            <Text style={[styles.summaryValue, { color: '#166534' }]}>
              Rs. {summary.totalCollected.toLocaleString('en-IN')}
            </Text>
          </View>
          <View style={[styles.summaryBox, styles.boxExpenses]}>
            <Text style={styles.summaryLabel}>Total Expenses</Text>
            <Text style={[styles.summaryValue, { color: '#991B1B' }]}>
              Rs. {summary.totalExpenses.toLocaleString('en-IN')}
            </Text>
          </View>
          <View style={[styles.summaryBox, styles.boxSurplus]}>
            <Text style={styles.summaryLabel}>Net Monthly Balance</Text>
            <Text style={[styles.summaryValue, { color: summary.netSurplus >= 0 ? '#4338CA' : '#B91C1C' }]}>
              Rs. {summary.netSurplus.toLocaleString('en-IN')}
            </Text>
          </View>
        </View>

        {/* Section 1: Income Collections Breakdown */}
        <Text style={styles.sectionHeading}>
          1. Flat Maintenance Collection Status ({summary.paidCount} of {dues.length} Cleared)
        </Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.thCol, { flex: 1 }]}>Flat</Text>
            <Text style={[styles.thCol, { flex: 2.5 }]}>Resident / Owner</Text>
            <Text style={[styles.thCol, { flex: 1.5 }]}>Status</Text>
            <Text style={[styles.thCol, { flex: 1.5, textAlign: 'right' }]}>Amount</Text>
            <Text style={[styles.thCol, { flex: 2, textAlign: 'right' }]}>Receipt / Mode</Text>
          </View>
          {dues.map((due) => (
            <View key={due.id} style={styles.tableRow}>
              <Text style={[styles.tdCol, { flex: 1, fontWeight: 'bold' }]}>
                {due.flat?.flat_number}
              </Text>
              <Text style={[styles.tdCol, { flex: 2.5 }]}>
                {due.flat?.owner_name}
              </Text>
              <Text
                style={[
                  styles.tdCol,
                  { flex: 1.5 },
                  due.status === 'paid'
                    ? styles.badgePaid
                    : due.status === 'overdue'
                    ? styles.badgeOverdue
                    : styles.badgeUnpaid,
                ]}
              >
                {due.status.toUpperCase()}
              </Text>
              <Text style={[styles.tdCol, { flex: 1.5, textAlign: 'right', fontWeight: 'bold' }]}>
                Rs. {Number(due.amount).toFixed(0)}
              </Text>
              <Text style={[styles.tdCol, { flex: 2, textAlign: 'right', fontSize: 6.5 }]}>
                {due.payment?.receipt_no
                  ? `${due.payment.receipt_no} (${due.payment.payment_mode})`
                  : 'Pending'}
              </Text>
            </View>
          ))}
        </View>

        {/* Section 2: Outgoing Expenses Breakdown */}
        <Text style={styles.sectionHeading}>
          2. Society Outgoing Expenses & Maintenance Disbursements
        </Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.thCol, { flex: 1.5 }]}>Date</Text>
            <Text style={[styles.thCol, { flex: 3 }]}>Particulars</Text>
            <Text style={[styles.thCol, { flex: 2 }]}>Category</Text>
            <Text style={[styles.thCol, { flex: 2 }]}>Paid To</Text>
            <Text style={[styles.thCol, { flex: 1.5, textAlign: 'right' }]}>Amount</Text>
          </View>
          {expenses.map((exp) => (
            <View key={exp.id} style={styles.tableRow}>
              <Text style={[styles.tdCol, { flex: 1.5 }]}>{exp.expense_date}</Text>
              <Text style={[styles.tdCol, { flex: 3, fontWeight: 'bold' }]}>{exp.title}</Text>
              <Text style={[styles.tdCol, { flex: 2 }]}>{exp.category}</Text>
              <Text style={[styles.tdCol, { flex: 2 }]}>{exp.paid_to || 'N/A'}</Text>
              <Text style={[styles.tdCol, { flex: 1.5, textAlign: 'right', fontWeight: 'bold' }]}>
                Rs. {Number(exp.amount).toFixed(0)}
              </Text>
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Generated on {now} for RWA General Body Meeting</Text>
          <Text>Prepared by: {society.treasurer_name || 'Society Treasurer'} • SocietyDues</Text>
        </View>
      </Page>
    </Document>
  );
}
