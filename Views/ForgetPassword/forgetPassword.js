document.addEventListener('DOMContentLoaded', () => {
    var btn = document.getElementById('password-btn');
    btn.addEventListener('click', (e)=> {
        e.preventDefault();
        var email = document.getElementById('email').value;
        
        var userDetails ={
            email:email
        }
        console.log(userDetails);
        axios.post('http://54.234.87.107:3000/password/forgetpassword', userDetails).then(response => {
        if(response.status === 200){
            document.body.innerHTML+= '<div style="color:red;">Mail Successfully Sent </div>'
        }else{
            throw new Error('Something Went Wrong');
        }
        }).catch(err => {
            document.body.innerHTML+= `<div style="color:red;">${err} </div>`
        })
    })
})