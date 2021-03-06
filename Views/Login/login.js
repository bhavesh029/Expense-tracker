document.addEventListener('DOMContentLoaded', () => {
    var btn = document.getElementById('login-btn');
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;

        const obj = {
            email: email,
            password: password
        }

        axios.post('http://54.234.87.107:3000/user/login', obj)
            .then(res => {
                localStorage.setItem("token", res.data.token);
                localStorage.setItem('userDetails', JSON.stringify(res.data.user));
                window.location.href = "../Expense/Expense.html";
            })
            .catch(err => {
                console.log(err);
            })
    })
})