import { User } from "../models/user.model.js";
import { Expense } from "../models/expense.model.js"; 
import { Op } from "sequelize";
import PDFDocument from "pdfkit";


export const dailyReport = async (req, res) => {
    try {
        const result = await Expense.findAll({
            where: {
                userId: req.user.id
            },
            include: [{ model: User }]
        })
         const totalAmount = result.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
        return res.status(200).json({msg: result, totalAmount: totalAmount.toFixed(2)});
        
    } catch (error) {
        
    }
}


export const downloadPDFReport = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type } = req.params;
    const startDate = getDateRange(type);

    const expenses = await Expense.findAll({
      where: {
        userId,
        createdAt: { [Op.gte]: startDate }
      },
      include: [{ model: User }]
    });

    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${type}-report.pdf`);
    doc.pipe(res);

    doc.fontSize(20).text(`${type.toUpperCase()} EXPENSE REPORT`, { align: "center" });
    doc.moveDown();
    doc.fontSize(14).text(`Generated On: ${new Date().toLocaleDateString()}`);
    doc.moveDown();

    if (!expenses.length) {
      doc.moveDown(2);
      doc.fontSize(12).text("No expense data available for this period.", { align: "center" });
      doc.end(); 
      return;
    }

    const totalAmount = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    doc.text(`Total Expenses: Rs. ${totalAmount.toFixed(2)}`);
    doc.moveDown();

    const headers = ["Date", "Category", "Description", "Amount"];
    const colX = [50, 150, 250, 400];
    const colWidth = [100, 100, 140, 100];

    const startY = doc.y;
    const headerHeights = headers.map((title, i) =>
      doc.heightOfString(title, { width: colWidth[i] })
    );
    const maxHeaderHeight = Math.max(...headerHeights);

    headers.forEach((title, i) => {
      doc.text(title, colX[i], startY, { width: colWidth[i], align: "left" });
    });

    doc.y = startY + maxHeaderHeight + 5;

    expenses.forEach(exp => {
      const date = new Date(exp.createdAt).toISOString().split("T")[0];
      const category = exp.category || "N/A";
      let description = exp.description || "N/A";
      if (description.length > 60) {
        description = description.substring(0, 57) + "...";
      }
      const amount = `Rs. ${exp.amount}`;

      const startY = doc.y;

      const dateHeight = doc.heightOfString(date, { width: 100 });
      const catHeight = doc.heightOfString(category, { width: 100 });
      const descHeight = doc.heightOfString(description, { width: 140 });
      const amtHeight = doc.heightOfString(amount, { width: 100 });

      const rowHeight = Math.max(dateHeight, catHeight, descHeight, amtHeight);

      doc.text(date, 50, startY, { width: 100 });
      doc.text(category, 150, startY, { width: 100 });
      doc.text(description, 250, startY, { width: 140 });
      doc.text(amount, 400, startY, { width: 100 });

      doc.y = startY + rowHeight + 5;
    });

    doc.end();

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error generating PDF report" });
  }
};



const getDateRange = (type) => {
  const now = new Date();
  let startDate;

  if (type === "daily") {
    startDate = new Date(now.setHours(0, 0, 0, 0));
  } else if (type === "weekly") {
    startDate = new Date(now.setDate(now.getDate() - 7));
  } else if (type === "monthly") {
    startDate = new Date(now.setMonth(now.getMonth() - 1));
  }
  return startDate;
};

export const getFilteredReport = async (req, res) => {
  try {
    const userId = req.user.id; 
    const { type } = req.params;
    const startDate = getDateRange(type);

    const result = await Expense.findAll({
      where: {
        userId,
        createdAt: {
          [Op.gte]: startDate,
        },
      },
      include: [{ model: User }],
    });

     const totalAmount = result.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);

    res.status(200).json({ msg: result ,
        totalAmount: totalAmount.toFixed(2)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};