import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';
import { Society, Due } from '@/lib/types';
import { formatMonthYear } from '@/lib/format';

const styles = StyleSheet.create({
  page: {
    padding: 36,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#1E293B',
  },
  headerContainer: {
    borderBottomWidth: 2,
    borderBottomColor: '#4338CA',
    paddingBottom: 14,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  societyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#312E81',
    marginBottom: 4,
  },
  societyAddress: {
    fontSize: 8.5,
    color: '#64748B',
    maxWidth: 320,
    lineHeight: 1.3,
  },
  receiptBadge: {
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
    borderRadius: 6,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignItems: 'flex-end',
  },
  receiptBadgeText: {
    color: '#4338CA',
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  receiptNo: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1E293B',
    marginTop: 2,
  },
  metaGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  metaItem: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 7.5,
    color: '#64748B',
    textTransform: 'uppercase',
    marginBottom: 2,
    fontWeight: 'bold',
  },
  metaValue: {
    fontSize: 9.5,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  detailsSection: {
    marginBottom: 16,
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 4,
  },
  residentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  residentLabel: {
    fontSize: 8.5,
    color: '#64748B',
    width: 120,
  },
  residentValue: {
    fontSize: 8.5,
    color: '#0F172A',
    fontWeight: 'bold',
    flex: 1,
  },
  table: {
    width: '100%',
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#312E81',
    color: '#FFFFFF',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  tableHeaderCol1: {
    flex: 3,
    fontSize: 8.5,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  tableHeaderCol2: {
    flex: 1,
    fontSize: 8.5,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFFFFF',
  },
  tableHeaderCol3: {
    flex: 1,
    fontSize: 8.5,
    fontWeight: 'bold',
    textAlign: 'right',
    color: '#FFFFFF',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    borderLeftWidth: 1,
    borderLeftColor: '#E2E8F0',
    borderRightWidth: 1,
    borderRightColor: '#E2E8F0',
    paddingVertical: 9,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
  },
  tableCol1: {
    flex: 3,
  },
  col1Title: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  col1Subtitle: {
    fontSize: 7.5,
    color: '#64748B',
    marginTop: 2,
  },
  tableCol2: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paidBadge: {
    backgroundColor: '#DCFCE7',
    color: '#15803D',
    fontSize: 7.5,
    fontWeight: 'bold',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  tableCol3: {
    flex: 1,
    textAlign: 'right',
    fontSize: 9.5,
    fontWeight: 'bold',
    color: '#0F172A',
    justifyContent: 'center',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  totalLabel: {
    fontSize: 9.5,
    fontWeight: 'bold',
    color: '#334155',
    marginRight: 16,
  },
  totalAmount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4338CA',
  },
  paymentDetailsCard: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  paymentCardTitle: {
    fontSize: 8.5,
    fontWeight: 'bold',
    color: '#166534',
    marginBottom: 4,
  },
  paymentCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 8,
    color: '#15803D',
    marginTop: 2,
  },
  signatureSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  sealBlock: {
    borderWidth: 1.5,
    borderColor: '#4338CA',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    width: 140,
  },
  sealText1: {
    fontSize: 7,
    fontWeight: 'bold',
    color: '#4338CA',
    textTransform: 'uppercase',
  },
  sealText2: {
    fontSize: 6.5,
    color: '#6366F1',
    marginTop: 2,
  },
  signBlock: {
    alignItems: 'center',
    width: 160,
  },
  signLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#94A3B8',
    width: '100%',
    marginBottom: 4,
  },
  signName: {
    fontSize: 8.5,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  signRole: {
    fontSize: 7.5,
    color: '#64748B',
  },
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 36,
    right: 36,
    textAlign: 'center',
    fontSize: 7,
    color: '#94A3B8',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 6,
  },
});

interface ReceiptDocumentProps {
  society: Society;
  due: Due;
}

export function ReceiptDocument({ society, due }: ReceiptDocumentProps) {
  const payment = due.payment;
  const receiptNo = payment?.receipt_no || `REC-${due.month_year.replace('-', '')}-${due.flat?.flat_number || '000'}`;
  const paidDateStr = payment?.paid_date
    ? new Date(payment.paid_date).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : new Date().toLocaleDateString('en-IN');

  const formattedMonth = formatMonthYear(due.month_year);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <View>
            <Text style={styles.societyTitle}>{society.name}</Text>
            <Text style={styles.societyAddress}>{society.address}</Text>
            {society.contact_phone && (
              <Text style={styles.societyAddress}>
                Helpline / WhatsApp: {society.contact_phone}
              </Text>
            )}
          </View>
          <View style={styles.receiptBadge}>
            <Text style={styles.receiptBadgeText}>Official Receipt</Text>
            <Text style={styles.receiptNo}>{receiptNo}</Text>
          </View>
        </View>

        {/* Metadata Grid */}
        <View style={styles.metaGrid}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Receipt Date</Text>
            <Text style={styles.metaValue}>{paidDateStr}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Maintenance Period</Text>
            <Text style={styles.metaValue}>{formattedMonth}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Payment Status</Text>
            <Text style={styles.metaValue}>PAID IN FULL</Text>
          </View>
        </View>

        {/* Resident & Flat Particulars */}
        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Resident Particulars</Text>
          <View style={styles.residentRow}>
            <Text style={styles.residentLabel}>Flat / Unit Number:</Text>
            <Text style={styles.residentValue}>Flat No. {due.flat?.flat_number || 'N/A'}</Text>
          </View>
          <View style={styles.residentRow}>
            <Text style={styles.residentLabel}>Owner Name:</Text>
            <Text style={styles.residentValue}>{due.flat?.owner_name || 'N/A'}</Text>
          </View>
          {due.flat?.is_rented && due.flat?.tenant_name && (
            <View style={styles.residentRow}>
              <Text style={styles.residentLabel}>Tenant Name:</Text>
              <Text style={styles.residentValue}>{due.flat.tenant_name}</Text>
            </View>
          )}
          <View style={styles.residentRow}>
            <Text style={styles.residentLabel}>Registered Mobile:</Text>
            <Text style={styles.residentValue}>+91 {due.flat?.phone || 'N/A'}</Text>
          </View>
        </View>

        {/* Table of Charges */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderCol1}>Description</Text>
            <Text style={styles.tableHeaderCol2}>Status</Text>
            <Text style={styles.tableHeaderCol3}>Amount (INR)</Text>
          </View>

          <View style={styles.tableRow}>
            <View style={styles.tableCol1}>
              <Text style={styles.col1Title}>
                Regular Monthly Maintenance & Common Area Upkeep
              </Text>
              <Text style={styles.col1Subtitle}>
                Includes 24/7 Security, Lift AMC, Borewell pumping, Common Area Electricity & Cleaning
              </Text>
            </View>
            <View style={styles.tableCol2}>
              <Text style={styles.paidBadge}>CLEARED</Text>
            </View>
            <Text style={styles.tableCol3}>Rs. {Number(due.amount).toFixed(2)}</Text>
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount Paid:</Text>
            <Text style={styles.totalAmount}>Rs. {Number(due.amount).toFixed(2)}</Text>
          </View>
        </View>

        {/* Payment Verification Card */}
        <View style={styles.paymentDetailsCard}>
          <Text style={styles.paymentCardTitle}>Payment Verification Summary</Text>
          <View style={styles.paymentCardRow}>
            <Text>Payment Mode: {payment?.payment_mode || 'UPI'}</Text>
            <Text>Society UPI VPA: {society.upi_id}</Text>
          </View>
          {payment?.upi_ref_no && (
            <View style={styles.paymentCardRow}>
              <Text>Ref / UTR / Cheque No: {payment.upi_ref_no}</Text>
            </View>
          )}
          {payment?.remarks && (
            <View style={styles.paymentCardRow}>
              <Text>Notes: {payment.remarks}</Text>
            </View>
          )}
        </View>

        {/* Digital Signature & Seal */}
        <View style={styles.signatureSection}>
          <View style={styles.sealBlock}>
            <Text style={styles.sealText1}>DIGITALLY VERIFIED</Text>
            <Text style={styles.sealText2}>{society.name}</Text>
            <Text style={styles.sealText2}>{paidDateStr}</Text>
          </View>

          <View style={styles.signBlock}>
            <View style={styles.signLine} />
            <Text style={styles.signName}>{society.treasurer_name || 'Hon. Treasurer'}</Text>
            <Text style={styles.signRole}>Managing Committee / Treasurer</Text>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          This is a system-generated official receipt issued by {society.name}. No physical signature is required.
          Generated via SocietyDues Management Software.
        </Text>
      </Page>
    </Document>
  );
}
