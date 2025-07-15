import { Expense } from "../models/expense.model.js";
import { User } from "../models/user.model.js";
import { Sequelize } from "sequelize";
import { sequelize } from "../config/db.config.js";
import logger from "../utils/logger.js";


export const getExpense = async (req, res) => {
    try {
        const EXPENSE_PER_PAGE = 5;
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        // const { userId } = req.params;
        const total = await Expense.count({
            where: {
                userId: req.user.id
            },
            include: [{ model: User }]
        });

        const expense = await Expense.findAll({
            where: {
                userId: req.user.id
            },
            include: [{ model: User }],
            offset: (page - 1) * limit,
            limit: limit
        })
        return res.status(200).json({
            expense: expense,
            currentPage: page,
            hasNextPage: page * limit < total,
            nextPage: page + 1,
            hasPreviousPage: page > 1,
            previousPage: page - 1,
            lastPage: Math.ceil(total / limit)

        });
    } catch (error) {
        // console.log(error.message);
           logger.error(`Error in /expense route, User: ${req.user?.email || "Unknown"} - ${err.stack} - ${error.message}`);
        return res.status(500).json({ "msg": "Unable to fetch details from DB" });
    }
}

export const insertExpense = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { amount, note, description, category } = req.body;
        if (!amount || !description || !category || !note) {
            await transaction.rollback();
            return res.status(400).json({ msg: "Please fill all the fileds" })
        }
        // console.log(typeof amount);
        // console.log(typeof req.user.totalExpenses);
        // const totalExpenses = req.user.totalExpenses + amount;
        // console.log(totalExpenses);
        const totalExpenses = Number(req.user.totalExpenses) + Number(amount);

        const expense = await Expense.create({
            amount: amount,
            note: note,
            description: description,
            category: category,
            userId: req.user.id
        }, { transaction })
        console.log(expense);
        await User.update({
            totalExpenses: totalExpenses
        }, {
            where: {
                id: req.user.id
            },
            transaction
        },)

        await transaction.commit();

        return res.status(201).json({ msg: expense });


    } catch (error) {
        // console.log(error.message);
        await transaction.rollback();
        logger.error(`Error in /expense route, User: ${req.user?.email || "Unknown"} - ${err.stack} - ${error.message}`);
        return res.status(500).json({ msg: "Unable to insert data into DB" });
    }
}

export const deleteExpense = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { id } = req.params;
        // const expense = await Expense.findByPk(id);
        // if(!expense) {
        //     return res.status(400).json({msg: "Expense not found"});
        // }
        // await Expense.destroy({
        //     where: {
        //         id: id,
        //         userId: userId
        //     }
        // })
        // return res.status(200).json({msg: "Expense deleted successfully"});

        const expense = await Expense.findOne({
            where: {
                id: id,
                userId: req.user.id
            }
        });

        if (!expense) {
            await transaction.rollback();
            return res.status(400).json({ msg: "Expense not found or unauthorized" });
        }
        const amount = Number(expense.amount)
        const totalExpenses = Number(req.user.totalExpenses) - Number(amount);

        await Expense.destroy({ where: { id }, transaction });
        await User.update({
            totalExpenses: totalExpenses
        }, {
            where: {
                id: req.user.id
            },
            transaction
        })
        await transaction.commit();
        return res.status(200).json({ msg: "Expense deleted successfully" });
    } catch (error) {
        // console.log(error.message);
        await transaction.rollback();
        logger.error(`Error in /expense route, User: ${req.user?.email || "Unknown"} - ${err.stack} - ${error.message}`);
        return res.status(500).json({ msg: "Unable to delete expense from DB" });
    }
}

export const editExpense = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { id } = req.params;
        const { amount, note, description, category } = req.body;
        const expense = await Expense.findOne({
            where: { id, userId: req.user.id }
        });
        if (!expense) {
            await transaction.rollback();
            return res.status(400).json({ msg: "Expense not found" });
        }
        const prevAmount = Number(expense.amount);
        console.log(prevAmount);
        const newAmount = Number(amount);
        const updatedTotal = Number(req.user.totalExpenses) - prevAmount + newAmount;

        // Update the user's totalExpenses

        const data = await Expense.update({
            amount: newAmount,
            note: note,
            description: description,
            category: category
        }, {
            where: { id },
            transaction
        })

        await User.update(
            { totalExpenses: updatedTotal },
            { where: { id: req.user.id }, transaction }
        );
        // const new_amount = Number(amount)
        // const totalNewExpenses = Number(req.user.totalExpenses) + Number(new_amount);
        // const user = await User.update({
        //     totalExpenses: totalNewExpenses
        // }, {
        //     where: {
        //         id: req.user.id
        //     }
        // })
        await transaction.commit();
        return res.status(200).json({ msg: data });

    } catch (error) {
        // console.log(error.message);
        await transaction.rollback();
        logger.error(`Error in /expense route, User: ${req.user?.email || "Unknown"} - ${err.stack} - ${error.message}`);
        return res.status(500).json({ msg: "Unable to update data into DB" });
    }
}

export const getTotalExpenseByEachUser = async (req, res) => {
    try {
        // const result = await Expense.findAll({
        //     attributes: [
        //         'userId',
        //         [Sequelize.fn('SUM', Sequelize.col('amount')), 'totalExpense']
        //     ],
        //     group: ['userId'],
        //     include: [
        //         {
        //             model: User,
        //             attributes: ['name', 'email']
        //         }
        //     ],
        //     order: [
        //         [Sequelize.fn("SUM", Sequelize.col("amount")), "DESC"],
        //     ],
        // });
        // -------------------------------left join on user
        // const result = await User.findAll({
        //     attributes: [
        //         'id',
        //         'name',
        //         'email',
        //         [Sequelize.fn('SUM', Sequelize.col('Expenses.amount')), 'totalExpense']
        //     ],
        //     include: [
        //         {
        //             model: Expense,
        //             attributes: []
        //         }
        //     ],
        //     group: ['User.id'],
        //     order: [[Sequelize.fn('SUM', Sequelize.col('Expenses.amount')), 'DESC']]
        // });
        // -------------optimised way
        // const EXPENSE_PER_PAGE = 3;
        const limit = parseInt(req.query.limit) || 3;
        const page = parseInt(req.query.page) || 1;

        const total = await User.count({
            order: [['totalExpenses', 'DESC']]
        })

        const expense = await User.findAll({
            order: [['totalExpenses', 'DESC']],
            offset: (page - 1) * limit,
            limit: limit
        })

        return res.status(200).json({
            expense: expense,
            currentPage: page,
            hasNextPage: page * limit < total,
            nextPage: page + 1,
            hasPreviousPage: page > 1,
            previousPage: page - 1,
            lastPage: Math.ceil(total / limit)
        });
    } catch (error) {
        // console.log(error.message);
        logger.error(`Error in /expense route, User: ${req.user?.email || "Unknown"} - ${err.stack} - ${error.message}`);
        return res.status(500).json({ msg: "Unable to expense data for each user from DB" });
    }
}