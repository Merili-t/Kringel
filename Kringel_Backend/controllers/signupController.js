const mysql = require("mysql2");
const conn = require('../config/db')

const signupPage =(req, res)=>{
    res.render("signup");
};

const signup = (req, res)=>{
    let notice = "Ootan andmeid.";
    console.log(req.body);
    if(!req.body.firstNameInput || !req.body.lastNameInput || !req.body.birthDateInput || !req.body.genderInput || !req.body.emailInput || req.body.passwordInput.length < 8 || req.body.passwordInput !== req.body.confirmPasswordInput){
        console.log("Andmeid on puudu, või paroolid ei kattu!");
        notice ="Andmeid on puudu, parool liiga lühike, või paroolid ei kattu.";
        res.render("signup", {notice: notice});
    }
    else{
        notice = "Andmed õigesti sisestatud.";
        //loome parooli räsi
        bcrypt.genSalt(10, (err, salt)=> {
            if(err){
                notice = "Tehniline viga, kasutajat ei loodud.";
                res.render("signup", {notice: notice});
            } 
            else {
                //krüptime
                bcrypt.hash(req.body.passwordInput, salt, (err, pwdHash)=>{
                    if(err){
                        notice = "Tehniline viga parooli krüpteerimisel, kasutajat ei loodud.";
                        res.render("signup", {notice: notice});
                    }
                    else{
                        let sqlReq = "INSERT INTO users (first_name, last_name, birth_date, gender, email, password) VALUES(?,?,?,?,?,?)";
                        conn.execute(sqlReq, [req.body.firstNameInput, req.body.lastNameInput, req.body.birthDateInput, req.body.genderInput, req.body.emailInput, pwdHash], (err, result)=>{
                            if(err){
                                notice="Tehniline viga andmebaasi kirjutamisel, kasutajat ei loodud.";
                                res.render("signup", {notice: notice});
                            }
                            else {
                                notice = "Kasutaja " + req.body.emailInput + "edukalt loodud!";
                                res.render("signup", {notice: notice});
                            }
                        }); //conn.execute lõpp
                    }
                });//hash lõppeb
            }
        });//genSalt lõppeb
    }
    //res.render("signup");
};

module.exports = {
    signupPage,
    signup
};