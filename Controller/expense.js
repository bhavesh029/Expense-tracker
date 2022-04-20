const Expense = require('../Models/expense');

const ITEMS_PER_PAGE = 2;
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
    const page = req.query.page || 1;
    let totalItems = 0;
    const userId = req.user.id;
    const expcount = Expense.count({where:{UserId: userId}});
    const hasnextpage = ITEMS_PER_PAGE * page<expcount;
    const haspreviouspage = page>1;
    const nextpage = Number(page) +1;
    const previouspage = Number(page) -1;
    const lastpage = Math.ceil(expcount/ITEMS_PER_PAGE);
    let obj ={
        currentpage: Number(req.query.page),
        hasnextpage: hasnextpage,
        haspreviouspage: haspreviouspage,
        nextpage: nextpage,
        previouspage: previouspage,
        lastpage: lastpage
    }
    req.user.getExpenses({offset:(page-1)*ITEMS_PER_PAGE, limit:ITEMS_PER_PAGE}).then(expense => {
        return res.status(200).json({expense, success:true,obj});
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