import { NextRequest, NextResponse } from 'next/server';
import { renderToStream } from '@react-pdf/renderer';
import React from 'react';
import { ReceiptDocument } from '@/components/receipt/ReceiptDocument';
import { INITIAL_SOCIETY, INITIAL_DUES } from '@/lib/store';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    // Find due by id or receipt_no
    const due = INITIAL_DUES.find(
      (d) => d.id === id || d.payment?.receipt_no === id
    );

    if (!due) {
      return NextResponse.json(
        { error: 'Receipt not found', id },
        { status: 404 }
      );
    }

    // Check if client requested JSON metadata
    const acceptHeader = request.headers.get('accept') || '';
    if (acceptHeader.includes('application/json')) {
      return NextResponse.json({
        society: INITIAL_SOCIETY,
        due,
        payment: due.payment,
      });
    }

    // Render PDF stream
    const docElement = React.createElement(ReceiptDocument, {
      society: INITIAL_SOCIETY,
      due: due,
    }) as any;

    const stream = await renderToStream(docElement);

    const filename = due.payment?.receipt_no
      ? `${due.payment.receipt_no}.pdf`
      : `receipt-${due.id}.pdf`;

    return new NextResponse(stream as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${filename}"`,
      },
    });
  } catch (err: any) {
    console.error('API Receipt Error:', err);
    return NextResponse.json(
      { error: 'Failed to generate PDF receipt', details: err?.message },
      { status: 500 }
    );
  }
}
