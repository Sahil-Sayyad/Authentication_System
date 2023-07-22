//import require packages
const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');

        const transporter = nodemailer.createTransport({
            service:'gmail',
            host: "smtp.gmail.com",
            port: 587,
            secure:false,
            auth: {
                user: 'YOUR_USERNAME',
                pass: 'YOUR_PASSWORD',
            },
        });
//rendering ejs file for sending email data 
        let renderTemplate = (data, relativePath)=>{
            let mailHTML;
            ejs.renderFile(
                path.join(__dirname, '../views/mailers', relativePath),
                data,
                function(err, template){
                    if(err){console.log("error in rendering template ");return}
                    mailHTML = template;
                }
                )
                return mailHTML;
            }
            module.exports = {
                transporter:transporter,
                renderTemplate:renderTemplate
            };
