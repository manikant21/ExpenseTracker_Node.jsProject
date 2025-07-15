import { User } from "../models/user.model.js";
import { Expense } from "../models/expense.model.js";
import { Op } from "sequelize";
import PDFDocument from "pdfkit";
import logger from "../utils/logger.js";
import { uploadToS3 } from "../services/s3Services.js";
import { FilesDownloaded } from "../models/filesDownloaded.js";



export const dailyReport = async (req, res) => {
  try {
    // const EXPENSE_PER_PAGE = 10;
    const limit = parseInt(req.query.limit) || 5;
    const page = parseInt(req.query.page) || 1;
    const total = await Expense.count({
      where: {
        userId: req.user.id
      },
      include: [{ model: User }]
    })

    const result = await Expense.findAll({
      where: {
        userId: req.user.id
      },
      include: [{ model: User }]
    })

    const totalAmount = result.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    const expense = await Expense.findAll({
      where: {
        userId: req.user.id
      },
      include: [{ model: User }],
      offset: (page - 1) * limit,
      limit: limit
    })

    const fileInfo = await FilesDownloaded.findAll({
      where: {
        userId: req.user.id
      }
    })
    console.log(fileInfo);

    return res.status(200).json({
      expense: expense,
      totalAmount: totalAmount.toFixed(2),
      currentPage: page,
      hasNextPage: page * limit < total,
      nextPage: page + 1,
      hasPreviousPage: page > 1,
      previousPage: page - 1,
      lastPage: Math.ceil(total / limit),
      fileInfo
    });

  } catch (error) {
     logger.error(`Error in /report route, User: ${req.user?.email || "Unknown"} - ${err.stack} - ${error.message}`);
     res.status(500).json({ msg: "Internal Server Error" });
  }
}
// 

// export const downloadPDFReport = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { type } = req.params;
//     const startDate = getDateRange(type);

//     const expenses = await Expense.findAll({
//       where: {
//         userId,
//         createdAt: { [Op.gte]: startDate }
//       },
//       include: [{ model: User }]
//     });

//     const doc = new PDFDocument({ margin: 50 });
//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader("Content-Disposition", `attachment; filename=${type}-report.pdf`);
//     doc.pipe(res);

//     // Header
//     doc.fontSize(20).text(`${type.toUpperCase()} EXPENSE REPORT`, { align: "center" });
//     doc.moveDown();
//     doc.fontSize(14).text(`Generated On: ${new Date().toLocaleDateString()}`);
//     doc.moveDown();

//     if (!expenses.length) {
//       doc.fontSize(12).text("No expense data available for this period.", { align: "center" });
//       doc.end();
//       return;
//     }

//     // Total Amount
//     const totalAmount = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
//     doc.fontSize(14).text(`Total Expenses: Rs. ${totalAmount.toFixed(2)}`, { align: "left" });
//     doc.moveDown(2);

//     // Table Setup
//     const headers = ["Date", "Note", "Category", "Description", "Amount"];
//     const columnPositions = [50, 120, 220, 300, 450];
//     const columnWidths = [70, 100, 80, 150, 70];
//     const rowHeight = 20; 

//     // Draw Headers with consistent height
//     const headerY = doc.y;
//     doc.font('Helvetica-Bold').fontSize(12);
    
//     headers.forEach((header, i) => {
//       doc.text(header, columnPositions[i], headerY, {
//         width: columnWidths[i],
//         align: i === 4 ? 'right' : 'left'
//       });
//     });

//     // Draw horizontal line
//     doc.moveTo(50, headerY + rowHeight).lineTo(520, headerY + rowHeight).stroke();
//     doc.moveDown(0.5);

//     // Draw Rows with perfect alignment
//     doc.font('Helvetica').fontSize(10);
//     expenses.forEach((exp, rowIndex) => {
//       const rowY = headerY + rowHeight + 5 + (rowIndex * rowHeight);
      
//       const date = new Date(exp.createdAt).toISOString().split("T")[0];
//       const note = exp.note || "N/A";
//       const category = exp.category || "N/A";
//       let description = exp.description || "N/A";
//       const amount = `Rs. ${parseFloat(exp.amount).toFixed(2)}`;

//       // Process text to fit columns
//       const processText = (text, maxWidth) => {
//         if (doc.widthOfString(text) > maxWidth) {
//           return text.substring(0, Math.floor(maxWidth / 7)) + "..."; 
//         }
//         return text;
//       };

//       // Draw each cell at the exact same Y position
//       doc.text(processText(date, columnWidths[0]), columnPositions[0], rowY, {
//         width: columnWidths[0]
//       });
      
//       doc.text(processText(note, columnWidths[1]), columnPositions[1], rowY, {
//         width: columnWidths[1]
//       });
      
//       doc.text(category, columnPositions[2], rowY, {
//         width: columnWidths[2]
//       });
      
//       doc.text(processText(description, columnWidths[3]), columnPositions[3], rowY, {
//         width: columnWidths[3]
//       });
      
//       doc.text(amount, columnPositions[4], rowY, {
//         width: columnWidths[4],
//         align: 'right'
//       });
//     });

//     doc.end();

//   } catch (error) {
//     // 
//     logger.error(`Error in /report route, User: ${req.user?.email || "Unknown"} - ${err.stack} - ${error.message}`);
//     res.status(500).json({ msg: "Error generating PDF report" });
//   }
// };



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
    // const EXPENSE_PER_PAGE = 4;
    const limit = parseInt(req.query.limit) || 5;
    const page = parseInt(req.query.page) || 1;
    console.log(page);
    const userId = req.user.id;
    const { type } = req.params;
    console.log(type);
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
    const total = await Expense.count({
      where: {
        userId,
        createdAt: {
          [Op.gte]: startDate,
        },
      },
      include: [{ model: User }],
    });

    const expense = await Expense.findAll({
      where: {
        userId,
        createdAt: {
          [Op.gte]: startDate,
        },
      },
      include: [{ model: User }],
      offset: (page - 1) * limit,
      limit: limit
    });

    res.status(200).json({
      expense: expense,
      totalAmount: totalAmount.toFixed(2),
      currentPage: page,
      hasNextPage: page * limit < total,
      nextPage: page + 1,
      hasPreviousPage: page > 1,
      previousPage: page - 1,
      lastPage: Math.ceil(total / limit)
    });
  } catch (error) {
    // console.error(error);
    logger.error(`Error in /report route, User: ${req.user?.email || "Unknown"} - ${err.stack} - ${error.message}`);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};



export const downloadExpense = async (req, res) => {
  // console.log(req.user.id);
  try {
    const expense = await Expense.findAll({
      where: {
        userId: req.user.id
      }
    })

    let stringifiedExpenses = JSON.stringify(expense);
    let filename = `Expense_${req.user.id}_${Date.now()}.txt`;
    let fileURL = await uploadToS3(stringifiedExpenses, filename);
     if (!fileURL) {
      return res.status(500).json({ msg: "Failed to upload file to S3" });
    }
    await FilesDownloaded.create({
      userId: req.user.id,
      fileUrl: fileURL
    })
    return res.status(200).json({fileURL});
  }
  catch(error) {
    logger.error(`Error in /report route, User: ${req.user?.email || "Unknown"} - ${err.stack} - ${error.message}`);
    res.status(500).json({ msg: "Internal Server Error" });
  }
}