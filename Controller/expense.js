const Expense = require('../Models/expense');

exports.addExpense = (req, res) => {
    const expenseAmount = req.body.expenseAmount;
    const description = req.body.description;
    const category = req.body.category;

    req.user.createExpense({
        expenseAmount: expenseAmount,
        description: description,
        category: category
    }).then(expense => {
        return res.status(201).json({expense, success: true})
    }).catch(err => {
        return res.status(403).json({err, success:false});
    })
}

exports.getexpenses = (req, res) => {
    req.user.getExpenses().then(expense => {
        return res.status(200).json({expense, success:true});
    }).catch(err => {
        return res.status(402).json({error:err, success:false});
    })
}

exports.deleteexpense = (req, res) => {
    const expenseid = req.params.expenseid;
    Expense.destroy({where:{id:expenseid}}).then(() => {
        return res.status(204).json({success:true, message:"Deleted Successfully"});
    }).catch(err => {
        console.log(err);
        return res.status(403).json({success:true,message:'Failed'});
    })
}