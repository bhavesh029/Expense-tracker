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

window.addEventListener('DOMContentLoaded', (e)=> {
    const token = localStorage.getItem('token');
    axios.get(`http://localhost:3000/user/getexpenses`, { headers: {"Authorization" : token} }).then(response => {
        if(response.status === 200){
            response.data.expense.forEach(expense => {
                addexpense(expense);
            })
        } else {
            throw new Error();
        }
        const pagination = document.getElementById('pagination');
        pagination.addEventListener('click', (e) => {
        if(e.target.className == 'page'){
        const reqpage = e.target.id;
        axios.get(`http://localhost:3000/user/getexpenses?page=${reqpage}`, {headers:{"Authorization":token}}).then(data => {
            const pagination = document.getElementById('pagination');
            const pages = response.data.obj;
            pagination.innerHTML="";

            if(pages.currentpage != 1 && pages.previouspage != 1){
                const newpage = document.createElement("a");
                newpage.setAttribute('id','1');
                newpage.setAttribute('class','page');
                newpage.innerText = "1";
                pagination.appendChild(newpage);
            }
            if(pages.haspreviouspage){
                const newpage2 = document.createElement('a');
                newpage2.setAttribute('class','page');
                newpage2.setAttribute("id",`${pages.previouspage}`);
                newpage2.innerText = `${pages.previouspage}`;
                pagination.appendChild(newpage2);
            }
            const newpage1 = document.createElement('a');
            newpage1.setAttribute('id',`${pages.currentpage}`);
            newpage1.setAttribute('class','page');
            newpage1.innerText = `${pages.currentpage}`;
            pagination.appendChild(newpage1);
    
            if(pages.hasnextpage){
                const newpage3 = document.createElement('a');
                newpage3.setAttribute('class','page');
                newpage3.setAttribute('id',`${pages.nextpage}`);
                newpage3.innerText = `${pages.nextpage}`;
                pagination.appendChild(newpage3);
            }
            if(pages.lastpage !== pages.currentpage &&
                pages.nextpage !== pages.lastpage){
                    const newpage4 = document.createElement('a');
                    newpage4.setAttribute('class','page');
                    newpage4.setAttribute('id',`${pages.lastpage}`);
                    newpage4.innerText = `${pages.lastpage}`;
                    pagination.appendChild(newpage4);
            }

            data.data.expense.forEach(expense => {
                addexpense(expense);
            })
        })
    }
})
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

function download(){
    axios.get('http://localhost:3000/user/download', {headers:{"Authorization":token}})
    .then((response) => {
        if(response.status === 201){
            var a = document.createElement('a');
            a.href = response.data.fileUrl;
            a.download = 'myexpense.csv';
            a.click();
        } else{
            throw new Error(response.data.message);
        }
    })
    .catch(err => {
        console.log(err);
    })
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

// 
        