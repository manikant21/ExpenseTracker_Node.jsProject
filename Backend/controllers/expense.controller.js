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
        const expense = await Expense.create({
            amount: amount,
            description: description,
            category: category,
            userId: req.user.id
        })
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
        const data = await Expense.update({
            amount: amount,
            description: description,
            category: category
        }, {
            where: { id }
        })

        return res.status(200).json({ msg: data });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ msg: "Unable to update data into DB" });
    }
}

export const getTotalExpenseByEachUser = async (req, res) => {
    try {
        const result = await Expense.findAll({
            attributes: [
                'userId',
                [Sequelize.fn('SUM', Sequelize.col('amount')), 'totalExpense']
            ],
            group: ['userId'],
            include: [
                {
                    model: User,
                    attributes: ['name', 'email']
                }
            ],
            order: [
                [Sequelize.fn("SUM", Sequelize.col("amount")), "DESC"],
            ],
        });

        return res.status(200).json({ result });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ msg: "Unable to expense data for each user from DB" });
    }
}