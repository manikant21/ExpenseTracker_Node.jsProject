import { Expense } from "../models/expense.model.js";
import { User } from "../models/user.model.js";
import { Sequelize } from "sequelize";



export const getExpense = async (req, res) => {
    try {
        // const { userId } = req.params;
        const expense = await Expense.findAll({
            where: {
                userId: req.user.id
            },
            include: [{ model: User }]
        });
        return res.status(200).json({ msg: expense });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ "msg": "Unable to fetch details from DB" });
    }
}

export const insertExpense = async (req, res) => {
    try {
        const { amount, description, category } = req.body;
        if (!amount || !description || !category) {
            return res.status(400).json({ msg: "Please fill all the fileds" })
        }
        // console.log(typeof amount);
        // console.log(typeof req.user.totalExpenses);
        // const totalExpenses = req.user.totalExpenses + amount;
        // console.log(totalExpenses);
        const totalExpenses = Number(req.user.totalExpenses) + Number(amount);
        const users = await User.update({
            totalExpenses: totalExpenses
        }, {
            where: {
                id: req.user.id
            }
        })

        const expense = await Expense.create({
            amount: amount,
            description: description,
            category: category,
            userId: req.user.id
        })
        console.log(expense);
        return res.status(201).json({ msg: expense });


    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ msg: "Unable to insert data into DB" });
    }
}

export const deleteExpense = async (req, res) => {
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
            return res.status(400).json({ msg: "Expense not found or unauthorized" });
        }
        const amount = Number(expense.amount)
        const totalExpenses = Number(req.user.totalExpenses) - Number(amount);
        const users = await User.update({
            totalExpenses: totalExpenses
        }, {
            where: {
                id: req.user.id
            }
        })
        await Expense.destroy({ where: { id } });
        return res.status(200).json({ msg: "Expense deleted successfully" });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ msg: "Unable to delete expense from DB" });
    }
}

export const editExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, description, category } = req.body;
        const expense = await Expense.findOne({
            where: { id, userId: req.user.id }
        });
        if (!expense) {
            return res.status(400).json({ msg: "Expense not found" });
        }
        const prevAmount = Number(expense.amount);
        console.log(prevAmount);
        const newAmount = Number(amount);
        const updatedTotal = Number(req.user.totalExpenses) - prevAmount + newAmount;

        // Update the user's totalExpenses
        await User.update(
            { totalExpenses: updatedTotal },
            { where: { id: req.user.id } }
        );
        const data = await Expense.update({
            amount: newAmount,
            description: description,
            category: category
        }, {
            where: { id }
        })
        // const new_amount = Number(amount)
        // const totalNewExpenses = Number(req.user.totalExpenses) + Number(new_amount);
        // const user = await User.update({
        //     totalExpenses: totalNewExpenses
        // }, {
        //     where: {
        //         id: req.user.id
        //     }
        // })
        return res.status(200).json({ msg: data });

    } catch (error) {
        console.log(error.message);
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
        const result = await User.findAll({
            order: [['totalExpenses', 'DESC']]
        })

        return res.status(200).json({ result });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ msg: "Unable to expense data for each user from DB" });
    }
}