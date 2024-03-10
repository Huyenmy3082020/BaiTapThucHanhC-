function Validator(formSelector){
    var _this= this;
    function getParent (element ,selector){
        // vẫn còn lặp cho tới khi mà element vẫn còn thẻ cha của nó 
        while(element.parentElement){
            //nếu như element có matches 
            if(element.parentElement.matches(selector)){
                // lúc này sẽ return về element cha của nó ở phía trên 
                return element.parentElement;
            }
            // tiếp tục cho đêns khi thẻ khong con thẻ cha cua nno thi dung vong lap 

            element=element.parentElement;
        }
    }
    //Lấy ra formElement trong DOM theo 
    var formRules = {
      
    }

    // neu co loi thi return messes loi 
    //neu khong co loi thi return underfined

    var ValidatorRules ={
        required :function(value){
            return value ? undefined :"vui long nhap truong nay ";
        },
        email :function(value){
            var regex= /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
          return regex.test(value) ? undefined :"vui long nhap email"
        },
        min:function(min){
           return function(value){
            return value.length >=min ? undefined : `nhap it nhat ${min} ki tu`
           }
        }
    }


    var formElement = document.querySelector(formSelector);
 
    // chỉ xử lí khi có element trong DOM 
    if(formElement){
        // lấy ra những thẻ input co rules 
        var input = formElement.querySelectorAll('[name][rules]')
        // lăp input để 
        for (var input of input){
            formRules[input.name]=input.getAttribute('rules');
         
            // lấy ra các rules và cắt | thanh chuoi 
            var rules =  formRules[input.name].split('|');
            for(var rule of rules){
                var isInclude  = rule.includes(':')
                var ruleInfor
                // nếu như rule có chứa dâu hai chấm thì cắt dấu hai chấm ra
                // ở đây là cắt min vá số 6 ra 
                if (isInclude){

                    ruleInfor = rule.split(':')
                 // lúc này rule infor có hai tham số là 6  và min 

                 // min là rule 0 và số 6 là min số 1

                    var rule = ruleInfor[0];
                
                }
                //
                var ruleFunc = ValidatorRules[rule];
                // nêu như có chưa dâu hai chấm thì thực hiện 
                // gán rule = với cái funciton thứ 2 bởi vì 
                // trong min có hai function thì ruleInfor[1] sẽ là rule ta thực hiện validate 
                // rule bên ngoaif sé là rule truyền số min 
                if (isInclude){
                    ruleFunc=ruleFunc(ruleInfor[1])
                }
             
                if (Array.isArray(formRules[input.name])){
                    formRules[input.name].push(ruleFunc)
                }else {

                    formRules[input.name]=[ruleFunc];
                }
            }
            // lang nghe su kien de validate (blur , change)

            input.onblur=handleValidate;
            input.oninput=handleClear;
        }

  function handleValidate(event){

            // khi bấm vào rule sẽ hiện ra name

            var errMess 
            var formMess = formRules[event.target.name]
            // lấy ra key của formMess khi bấm vào 
            // duyêt qua tất cả formMess rồi lấy ra value lỗi  

            formMess.forEach(function(rule){
                errMess= rule(event.target.value);
                return errMess;
            })
          if (errMess){
            // kiêm tra nếu như có errmess thì lấy thẻ cha của nó rồi từ đó lấy lại thẻ con form-message của nó 
        var formGroup =getParent(event.target, ".form-group")
            if (formGroup){
                // nếu như có thí thêm class đỏ 
                formGroup.classList.add('invalid');
                var formMess = formGroup.querySelector('.form-message');
                if (formMess){
                    formMess.innerText = errMess;
                    
                }
            }
          }
          // chuyển đổi sang boolen 
          // lúc này có lỗi thì sẽ trả về là true
          // không có lỗi thì sẽ trả về là false
          return !errMess;
 }
function handleClear(event){

            var formGroup = getParent(event.target, ".form-group")
            if (formGroup.classList.contains('invalid')){
                formGroup.classList.remove('invalid');
                var formMess = formGroup.querySelector('.form-message');
                if (formMess){
                    formMess.innerText = "";
                    
                }

            }
        }
}
    // xu li hanh vi submib form 
    formElement.onsubmit= function(event){
        event.preventDefault();
        var inputs = formElement.querySelectorAll('[name][rules]')
        var isValid = true;

        for (var input of inputs){
       if ( handleValidate({
        target :input
            })){
        isValid=false;
    }
        }
        // khi khong co loi thi submit form 

        if (isValid){
            if (typeof _this.onSubmit==='function')
            {
                _this.onSubmit();
            }
            else{
                formElement.onsubmit();
            }
        }
      
    }

}