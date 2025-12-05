import Expense from "../models/Expense.js";
import Friend from "../models/Friend.js";

export const generatePDF = async (req, res) => {
  try {
    const { expenses } = req.body;

    if (!expenses || expenses.length === 0) {
      return res.status(400).json({ message: "No expenses provided" });
    }

    // Get detailed expense data with friend info
    const detailedExpenses = await Promise.all(
      expenses.map(async (exp) => {
        const expense = await Expense.findById(exp._id || exp)
          .populate("friendId", "name upiId");
        return expense;
      })
    );

    const friendInfo = detailedExpenses[0]?.friendId;
    const totalLent = detailedExpenses
      .filter(e => e.type === "lend")
      .reduce((sum, e) => sum + e.amount, 0);
    const totalBorrowed = detailedExpenses
      .filter(e => e.type === "borrow")
      .reduce((sum, e) => sum + e.amount, 0);
    const netBalance = totalLent - totalBorrowed;

    // Create HTML for PDF
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            color: #333;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #3b82f6;
            padding-bottom: 20px;
          }
          .header h1 {
            margin: 0;
            color: #3b82f6;
            font-size: 28px;
          }
          .header p {
            margin: 5px 0;
            color: #666;
          }
          .summary {
            display: flex;
            justify-content: space-around;
            margin: 30px 0;
            background: #f3f4f6;
            padding: 20px;
            border-radius: 8px;
          }
          .summary-item {
            text-align: center;
          }
          .summary-item h3 {
            margin: 0 0 10px 0;
            color: #666;
            font-size: 14px;
            text-transform: uppercase;
          }
          .summary-item .amount {
            font-size: 24px;
            font-weight: bold;
            color: #3b82f6;
          }
          .summary-item.lent .amount {
            color: #22c55e;
          }
          .summary-item.borrowed .amount {
            color: #ef4444;
          }
          .summary-item.balance .amount {
            color: ${netBalance >= 0 ? '#22c55e' : '#ef4444'};
          }
          .transactions {
            margin: 30px 0;
          }
          .transactions h2 {
            color: #3b82f6;
            border-bottom: 2px solid #3b82f6;
            padding-bottom: 10px;
            font-size: 18px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
          }
          th {
            background: #3b82f6;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: bold;
          }
          td {
            padding: 12px;
            border-bottom: 1px solid #e5e7eb;
          }
          tr:nth-child(even) {
            background: #f9fafb;
          }
          .type-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
          }
          .type-lend {
            background: #dcfce7;
            color: #166534;
          }
          .type-borrow {
            background: #fee2e2;
            color: #991b1b;
          }
          .amount-positive {
            color: #22c55e;
            font-weight: bold;
          }
          .amount-negative {
            color: #ef4444;
            font-weight: bold;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            color: #999;
            font-size: 12px;
            border-top: 1px solid #e5e7eb;
            padding-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Transaction Report</h1>
          <p><strong>Friend:</strong> ${friendInfo.name}</p>
          <p><strong>UPI ID:</strong> ${friendInfo.upiId || 'Not added'}</p>
          <p><strong>Generated on:</strong> ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</p>
        </div>

        <div class="summary">
          <div class="summary-item lent">
            <h3>Total Lent</h3>
            <div class="amount">₹${totalLent.toFixed(2)}</div>
          </div>
          <div class="summary-item borrowed">
            <h3>Total Borrowed</h3>
            <div class="amount">₹${totalBorrowed.toFixed(2)}</div>
          </div>
          <div class="summary-item balance">
            <h3>Net Balance</h3>
            <div class="amount">₹${Math.abs(netBalance).toFixed(2)}</div>
            <p style="font-size: 12px; color: #666; margin-top: 5px;">
              ${netBalance > 0 ? `${friendInfo.name} owes you` : netBalance < 0 ? 'You owe ' + friendInfo.name : 'Settled up'}
            </p>
          </div>
        </div>

        <div class="transactions">
          <h2>Transaction Details</h2>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Type</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${detailedExpenses
                .sort((a, b) => new Date(b.datetime) - new Date(a.datetime))
                .map(exp => `
                <tr>
                  <td>${new Date(exp.datetime).toLocaleDateString()}</td>
                  <td>${exp.description}</td>
                  <td>
                    <span class="type-badge type-${exp.type}">
                      ${exp.type === 'lend' ? '💰 You Lent' : '💳 You Borrowed'}
                    </span>
                  </td>
                  <td class="amount-${exp.type === 'lend' ? 'positive' : 'negative'}">
                    ${exp.type === 'lend' ? '+' : '-'}₹${exp.amount.toFixed(2)}
                  </td>
                </tr>
              `)
                .join('')}
            </tbody>
          </table>
        </div>

        <div class="footer">
          <p>This is an auto-generated report from FairShare Expense Tracker</p>
        </div>
      </body>
      </html>
    `;

    // Send HTML as response (frontend will convert to PDF)
    res.json({ html });
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ message: error.message });
  }
};
