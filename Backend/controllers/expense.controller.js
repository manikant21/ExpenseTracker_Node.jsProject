import { Expense } from "../models/expense.model.js";
import { User } from "../models/user.model.js";


export const getExpense = async (req, res) => {
    try {
        const { userId } = req.params;
        const expense = await Expense.findAll({
            where: {
                userId: userId
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
        const { amount, description, category, userId } = req.body;
        if (!amount || !description || !category || !userId) {
            return res.status(400).json({ msg: "Please fill all the fileds" })
        }
        const expense = await Expense.create({
            amount: amount,
            description: description,
            category: category,
            userId: userId
        })
        return res.status(201).json({ msg: expense });


    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ msg: "Unable to insert data into DB" });
    }
}

export const deleteExpense = async (req, res) => {
    try {
        const { id, userId } = req.params;
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
                userId: userId
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
        const { amount, description, category, userId } = req.body;
        const expense = await Expense.findOne({
            where: { id, userId }
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