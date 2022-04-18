const token = localStorage.getItem('token');

document.addEventListener('DOMContentLoaded', () => {
    var btn = document.getElementById('submit');
    btn.addEventListener('click', (e) => {
        var expenseAmount = document.getElementById('money').value;
        var description = document.getElementById('description').value;
        var category = document.getElementById('category').value;

        e.preventDefault();

        const obj = {
            expenseAmount: expenseAmount,
            description: description,
            category: category
        }
        axios.post('http://localhost:3000/user/addexpense', obj, { headers: {"Authorization" : token} })
            .then(res => {
                console.log(res);
                alert('Added');
            })
            .catch(err => {
                console.log(err);
            })
    })
});

window.addEventListener('load', ()=> {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:3000/user/getexpenses', { headers: {"Authorization" : token} }).then(response => {
        if(response.status === 200){
            response.data.expense.forEach(expense => {

                addexpense(expense);
            })
        } else {
            throw new Error();
        }
    })
});

function addexpense(expense){
    const parentElement = document.getElementById('record');
    const expenseElemId = `expense-${expense.id}`;
    parentElement.innerHTML += `
        <li class='list-group-item' id =${expenseElemId}>
        ${expense.expenseAmount} -${expense.description} -${expense.category}
        <button class='btn btn-danger' onclick='deleteExpense(event, ${expense.id})'> Del </button>
        </li>`
}

function deleteExpense(e, expenseid){
    //const token = localStorage.getItem('token');
    axios.delete(`http://localhost:3000/user/deleteexpense/${expenseid}`, {headers:{"Authorization":token}}).then(response => {
        if(response.status === 204){
            removeExpensefromUI(expenseid);
        }else{
            throw new Error('Failed to Delete');
        }
    }).catch(err => {
        console.log(err);
    })
}

function removeExpensefromUI(expenseid){
    const expenseElemId = `expense-${expenseid}`;
    document.getElementById(expenseElemId).remove();
}

document.getElementById('rzp-btn').onclick = async function (e) {
    const response  = await axios.get('http://localhost:3000/purchase/premiummembership', { headers: {"Authorization" : token} });
    console.log(response);
    var options =
    {
     "key": response.data.key_id, // Enter the Key ID generated from the Dashboard
     "name": "Test Company",
     "order_id": response.data.order.id, // For one time payment
     "prefill": {
       "name": "Test User",
       "email": "test.user@example.com",
       "contact": "9784490023"
     },
     "theme": {
      "color": "#3399cc"
     },
     // This handler function will handle the success payment
     "handler": function (response) {
         console.log(response);
         axios.post('http://localhost:3000/purchase/updatetransactionstatus',{
             order_id: options.order_id,
             payment_id: response.razorpay_payment_id,
         }, { headers: {"Authorization" : token} }).then(() => {
             alert('You are a Premium User Now')
         }).catch(() => {
             alert('Something went wrong. Try Again!!!')
         })
     },
  };
  const rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();

  rzp1.on('payment.failed', function (response){
  alert(response.error.code);
  alert(response.error.description);
  alert(response.error.source);
  alert(response.error.step);
  alert(response.error.reason);
  alert(response.error.metadata.order_id);
  alert(response.error.metadata.payment_id);
 });
}