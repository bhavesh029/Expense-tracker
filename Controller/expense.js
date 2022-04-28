const Expense = require('../Models/expense');
const AWS = require('aws-sdk');
const dotenv = require('dotenv');
dotenv.config();
const ITEMS_PER_PAGE = 10;

function uploadtoS3(data, filename){
    let s3bucket = new AWS.S3({
        accessKeyId:process.env.AWS_ACCESS_KEY,
        secretAccessKey:process.env.AWS_SECRET_KEY
    });

    s3bucket.createBucket(() => {
        var params = {
            Bucket:'expensetracker029',
            Key:filename,
            Body:data
        }
        s3bucket.upload(params, (err, s3response) => {
            if(err){
                console.log('Something went wrong',err);
            }else{
                console.log('Success',s3response);
            }
        })
    })
}


exports.download = async (req,res) => {
    const expenses =  await req.user.getExpenses();
    //console.log(expenses);
    const SringifyExpense = JSON.stringify(expenses);
    const filename = 'Expense.txt';
    const fileURL = uploadtoS3(SringifyExpense, filename);
    res.status(200).json({fileURL, success:true});
}

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

exports.getexpenses = (async (req, res) => {
    const page = req.query.page || 1;
    const userId = req.user.id;
    const expcount = await Expense.count({where:{UserId: userId}});
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
})

exports.deleteexpense = (req, res) => {
    const expenseid = req.params.expenseid;
    Expense.destroy({where:{id:expenseid}}).then(() => {
        return res.status(204).json({success:true, message:"Deleted Successfully"});
    }).catch(err => {
        console.log(err);
        return res.status(403).json({success:true,message:'Failed'});
    })
}