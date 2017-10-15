let $signUpForm = $('form[name = signUp]')
$signUpForm.on('submit', (e) => {
    e.preventDefault();
    // alert('jieguanl submit')
    //get the information
    let string = $signUpForm.serialize()
        //form.serialize()可以得到每一个value拼成的字符串
    console.log(string)
        //check form
    let email = $signUpForm.find('[name=email]').val();
    let password = $signUpForm.find('[name=password]').val();
    let password_confirmation = $signUpForm.find('[name=password_confirmation]').val();
    console.log(email, password, password_confirmation)
    let errors = {}
    if (email.indexOf('@') <= 0) {
        errors.email = 'email is illegal'
    }
    if (password.length < 6) {
        errors.password = 'password is too short'
    }
    if (password_confirmation !== password) {
        errors.password_confirmation = 'the password does not match with the password confirmation'
    }
    if (Object.keys(errors).length !== 0) {
        // $signUpForm.find('span[name$=_error]').each(function() {
        //         console.log(this)
        //         $(this).text('')
        //     })
        //需要遍历，this是dom
        $signUpForm.find('span[name$=_error]').each((index, span) => {
            //each遍历第一个参数是index，第二个才是span
            console.log(span)
            $(span).text('')
        })
        for (var key in errors) {
            let value = errors[key]
            $signUpForm.find(`[name = ${key}_error]`).text(value)
        }
        return
    }



    $.ajax({
        url: $signUpForm.attr('action'),
        method: $signUpForm.attr('method'),
        data: string,
        success: function(response) {
            console.log(response)
            console.log(typeof response)
            let object = JSON.parse(response)
                //将字符串变成对象,在浏览器上运行


        }
    })

})