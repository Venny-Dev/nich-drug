import { capitalizeFirst, formatCurrency } from "./helpers";

const ESC_POS = {
  INIT: "\x1B\x40", // Initialize printer
  FEED_LINE: "\x0A", // Line feed
  FEED_LINES: "\x1B\x64\x02", // Feed 2 lines
  CUT_PAPER: "\x1D\x56\x00", // Cut paper
  ALIGN_CENTER: "\x1B\x61\x01", // Center alignment
  ALIGN_LEFT: "\x1B\x61\x00", // Left alignment
  ALIGN_RIGHT: "\x1B\x61\x02", // Right alignment
  BOLD_ON: "\x1B\x45\x01", // Bold on
  BOLD_OFF: "\x1B\x45\x00", // Bold off
  UNDERLINE_ON: "\x1B\x2D\x01", // Underline on
  UNDERLINE_OFF: "\x1B\x2D\x00", // Underline off
  DOUBLE_HEIGHT: "\x1B\x21\x10", // Double height
  NORMAL_SIZE: "\x1B\x21\x00", // Normal size
};

const padText = (left: string, right: string, totalWidth: number = 32) => {
  const padding = totalWidth - left.length - right.length;
  return left + " ".repeat(Math.max(0, padding)) + right;
};

// Helper function to center text
// const centerText = (text: string, totalWidth: number = 32) => {
//   const padding = Math.floor((totalWidth - text.length) / 2);
//   return " ".repeat(Math.max(0, padding)) + text;
// };

export function generateReceiptCommands(orderData: any): string[] {
  const commands: string[] = [];

  // Initialize printer
  commands.push(ESC_POS.INIT);

  // Header - Store name (bold, centered, double height)
  commands.push(ESC_POS.ALIGN_CENTER);
  commands.push(ESC_POS.BOLD_ON);
  commands.push(ESC_POS.DOUBLE_HEIGHT);
  commands.push("NICH DRUGS PHARMACY");
  commands.push(ESC_POS.FEED_LINE);
  commands.push(ESC_POS.NORMAL_SIZE);
  commands.push(ESC_POS.BOLD_OFF);

  // Address
  commands.push(capitalizeFirst(orderData.address) || "No Address Provided");
  commands.push(ESC_POS.FEED_LINE);
  commands.push(ESC_POS.FEED_LINE);

  // Order details (left aligned)
  commands.push(ESC_POS.ALIGN_LEFT);
  commands.push(padText(`Date: ${orderData.date}`, `Time: ${orderData.time}`));
  commands.push(ESC_POS.FEED_LINE);
  commands.push(padText(`Shop: ${orderData.shopName}`, `POS Terminal: 1`));
  commands.push(ESC_POS.FEED_LINE);
  commands.push(`Cashier: ${orderData.cashier}`);
  commands.push(ESC_POS.FEED_LINE);

  if (orderData.receiptNumber) {
    commands.push(`Receipt #: ${orderData.receiptNumber}`);
    commands.push(ESC_POS.FEED_LINE);
  }

  // Separator line
  commands.push("-".repeat(32));
  commands.push(ESC_POS.FEED_LINE);

  // Items header
  commands.push(ESC_POS.BOLD_ON);
  commands.push(padText("Item", "Qty  Amt(N)"));
  commands.push(ESC_POS.FEED_LINE);
  commands.push(ESC_POS.BOLD_OFF);
  commands.push("-".repeat(32));
  commands.push(ESC_POS.FEED_LINE);

  // Items
  orderData.items.forEach((item: any) => {
    const itemTotal = item.amount * item.qty;
    const qtyAmount = `${item.qty}x  ${formatCurrency(itemTotal)}`;

    // If item name is too long, wrap it
    if (item.name.length > 32) {
      commands.push(item.name.substring(0, 32));
      commands.push(ESC_POS.FEED_LINE);
      commands.push(padText("", qtyAmount));
    } else {
      commands.push(padText(item.name, qtyAmount));
    }
    commands.push(ESC_POS.FEED_LINE);

    // Show unit price if quantity > 1
    if (item.qty > 1) {
      commands.push(`  @ N${formatCurrency(item.amount)} each`);
      commands.push(ESC_POS.FEED_LINE);
    }
  });

  // Separator line
  commands.push("-".repeat(32));
  commands.push(ESC_POS.FEED_LINE);

  // Totals
  commands.push(
    padText("Sub Total:", `N${formatCurrency(orderData.subTotal)}`)
  );
  commands.push(ESC_POS.FEED_LINE);

  if (orderData.discount > 0) {
    commands.push(
      padText("Discount:", `-N${formatCurrency(orderData.discount)}`)
    );
    commands.push(ESC_POS.FEED_LINE);
  }

  // Calculate total
  const total = orderData.subTotal - (orderData.discount || 0);
  commands.push(ESC_POS.BOLD_ON);
  commands.push(padText("TOTAL:", `N${formatCurrency(total)}`));
  commands.push(ESC_POS.BOLD_OFF);
  commands.push(ESC_POS.FEED_LINE);

  // Payment information
  commands.push("-".repeat(32));
  commands.push(ESC_POS.FEED_LINE);
  commands.push(
    padText(
      "Payment Method:",
      capitalizeFirst(orderData.paymentMethod) || "Unknown"
    )
  );
  commands.push(ESC_POS.FEED_LINE);

  if (orderData.amountPaid) {
    commands.push(
      padText("Amount Paid:", `N${formatCurrency(orderData.amountPaid)}`)
    );
    commands.push(ESC_POS.FEED_LINE);
  }

  if (orderData.change && orderData.change > 0) {
    commands.push(padText("Change:", `N${formatCurrency(orderData.change)}`));
    commands.push(ESC_POS.FEED_LINE);
  }

  if (orderData.transactionId) {
    commands.push(`Tx ID: ${orderData.transactionId}`);
    commands.push(ESC_POS.FEED_LINE);
  }

  // Footer
  commands.push(ESC_POS.FEED_LINE);
  commands.push(ESC_POS.ALIGN_CENTER);
  commands.push(ESC_POS.BOLD_ON);
  commands.push("THANK YOU FOR SHOPPING");
  commands.push(ESC_POS.FEED_LINE);
  commands.push(ESC_POS.BOLD_OFF);
  commands.push("Visit us again at nichdrugss.com.ng");
  commands.push(ESC_POS.FEED_LINE);
  commands.push(ESC_POS.FEED_LINE);

  // Timestamp
  commands.push(new Date().toLocaleString());
  commands.push(ESC_POS.FEED_LINE);

  // Feed lines and cut paper
  commands.push(ESC_POS.FEED_LINES);
  commands.push(ESC_POS.CUT_PAPER);

  return commands;
}

// Fallback function for browsers that don't support Web Serial
// export function fallbackToBrowserPrint(orderData: any) {
//   // Create a temporary div with the receipt content
//   const printWindow = window.open("", "_blank");
//   if (printWindow) {
//     printWindow.document.write(`
//       <html>
//         <head>
//           <title>Receipt</title>
//           <style>
//             body { font-family: monospace; font-size: 12px; margin: 20px; }
//             .receipt { max-width: 300px; margin: 0 auto; }
//             .center { text-align: center; }
//             .bold { font-weight: bold; }
//             .line { border-bottom: 1px solid #000; margin: 10px 0; }
//           </style>
//         </head>
//         <body>
//           <div class="receipt">
//             ${generateReceiptHTML(orderData)}
//           </div>
//         </body>
//       </html>
//     `);
//     printWindow.document.close();
//     printWindow.focus();
//     printWindow.print();
//     printWindow.close();
//   }
// }

// Generate HTML version for fallback
// function generateReceiptHTML(orderData: any): string {
//   const total = orderData.subTotal - (orderData.discount || 0);

//   return `
//     <div class="center bold">
//       <h2>NICH DRUGS PHARMACY</h2>
//       <p>${capitalizeFirst(orderData.address)}</p>
//     </div>

//     <div class="line"></div>

//     <p>Date: ${orderData.date} &nbsp;&nbsp;&nbsp;&nbsp; Time: ${
//     orderData.time
//   }</p>
//     <p>Shop: ${orderData.shopName} &nbsp;&nbsp;&nbsp;&nbsp; POS Terminal: 1</p>
//     <p>Cashier: ${orderData.cashier}</p>
//     ${
//       orderData.receiptNumber
//         ? `<p>Receipt #: ${orderData.receiptNumber}</p>`
//         : ""
//     }

//     <div class="line"></div>

//     <table style="width: 100%; font-size: 12px;">
//       <tr class="bold">
//         <td>Item</td>
//         <td style="text-align: center;">Qty</td>
//         <td style="text-align: right;">Amt(₦)</td>
//       </tr>
//       ${orderData.items
//         .map(
//           (item: any) => `
//         <tr>
//           <td>${item.name}</td>
//           <td style="text-align: center;">${item.qty}</td>
//           <td style="text-align: right;">${formatCurrency(
//             item.amount * item.qty
//           )}</td>
//         </tr>
//       `
//         )
//         .join("")}
//     </table>

//     <div class="line"></div>

//     <p>Sub Total: ${formatCurrency(orderData.subTotal)}</p>
//     ${
//       orderData.discount > 0
//         ? `<p>Discount: -${formatCurrency(orderData.discount)}</p>`
//         : ""
//     }
//     <p class="bold">TOTAL: ${formatCurrency(total)}</p>

//     <div class="line"></div>

//     <p>Payment Method: ${capitalizeFirst(orderData.paymentMethod)}</p>
//     ${
//       orderData.amountPaid
//         ? `<p>Amount Paid: ${formatCurrency(orderData.amountPaid)}</p>`
//         : ""
//     }
//     ${
//       orderData.change && orderData.change > 0
//         ? `<p>Change: ${formatCurrency(orderData.change)}</p>`
//         : ""
//     }
//     ${orderData.transactionId ? `<p>Tx ID: ${orderData.transactionId}</p>` : ""}

//     <div class="center">
//       <p class="bold">THANK YOU FOR SHOPPING</p>
//       <p>Visit us again at nichdrugss.com.ng</p>
//       <p><small>${new Date().toLocaleString()}</small></p>
//     </div>
//   `;
// }
