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
        const token = localStorage.getItem('token');
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