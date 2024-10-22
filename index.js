const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path=require('path');
const session=require('express-session');
const bcrypt = require('bcrypt');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
// app.use(session({
//     secret: 'your_secret_key', // เปลี่ยนเป็นคีย์ที่ซับซ้อน
//     resave: false,
//     saveUninitialized: true,
//     saveUninitialized: true, // กำหนดว่าจะบันทึก session ใหม่ที่ยังไม่มีการเปลี่ยนแปลงหรือไม่
//     cookie: { secure: false } // ตั้งค่า cookie ถ้าใช้ HTTPS ต้องใช้ true
// }))
//เก็บsession
// app.use((req, res, next) => {
//     res.locals.session = req.session;
//     next();
// });

// // เส้นทางตัวอย่างส่งไปยังฟอร์ม
// app.get('/', (req, res) => {
//     // เก็บข้อมูลลงใน session
//     req.session.username = 'JohnDoe';
//     req.session.loggedIn = true;

//     res.render('index'); // ส่งไปยังไฟล์ EJS ที่ชื่อ index.ejs
// })
// ล็อกเอาต์และล้าง session
// app.get('/logout', (req, res) => {
//     req.session.destroy((err) => {
//         if (err) {
//             return res.redirect('/');
//         }
//         res.clearCookie('connect.sid');
//         res.redirect('/login');
//     });
// });


// ตั้งค่า View Engine เป็น EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// สร้างการเชื่อมต่อ MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'crud_app'
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL');
});


//home login
app.get('/', (req, res) => {
   
        res.render('login');
    
});

app.get('/maintanance', (req, res) => {
   
    res.render('maintanance');
});

// เมื่อผู้ใช้ส่งข้อมูลฟอร์มล็อกอิน
// เมื่อผู้ใช้ส่งข้อมูลฟอร์มล็อกอิน
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // ตรวจสอบข้อมูลผู้ใช้ในฐานข้อมูล
    const sql = 'SELECT * FROM userlogin WHERE username = ? AND password = ?';
    connection.query(sql, [username, password], (err, result) => {
        if (err) throw err;
        res.render('adminmysite')
    });
});

//         if (result.length > 0) {
//             // ถ้าข้อมูลตรงกัน สร้าง session และ redirect ไปหน้า dashboard
//             req.session.loggedin = true;
//             req.session.username = username;
//             res.redirect('/adminmysite');
//         } else {
//             // ถ้าไม่ตรงกัน แสดงข้อความว่าไม่พบข้อมูล
//             res.send('Incorrect Username and/or Password!');
//         }
//     });
// });


//maintanance request

// Route admin index table
app.get('/adminindex', (req, res) => {
    const query = 'SELECT * FROM users';
    connection.query(query, (err, results) => {
        if (err) throw err;
        res.render('adminindex', { users: results });
    });
});


//maintanance
// API สำหรับดึงข้อมูลการบำรุงรักษา


// Render หน้า Maintenance Requests

// Route for getting data



//admin mysite
app.get('/adminmysite', (req, res) => {
    
        res.render('adminmysite');
    
});

/////mantanace request
// API สำหรับบันทึกข้อมูล
// app.post('/api/send-repair-request', (req, res) => {
//     const { rooms,name, tel, request } = req.body;
//     const sql = 'INSERT INTO maintanance (rooms, name, tel, request) VALUES (?,?,?,?)'; // เปลี่ยนเป็นชื่อ table จริงของคุณ
//     connection.query(sql, [ rooms,name, tel, request], (err, result) => {
//         if (err) return res.status(500).send('Database error');
//         res.send('Data inserted successfully');
//         res.redirect('maintanance')
//     });
// });



app.get('/show', (req, res) => {
    const query = 'SELECT * FROM users';
    connection.query(query, (err, results) => {
        if (err) throw err;
        res.render('show', { show: results });
    });
});
// CREATE: เพิ่มข้อมูลใหม่
app.post('/add', (req, res) => {
    const { name, email, phone, address } = req.body;
    const query = 'INSERT INTO users (name, email, phone, address) VALUES (?, ?, ?, ?)';
    connection.query(query, [name, email, phone, address], (err, results) => {
        if (err) throw err;
        res.redirect('/adminindex');
    });
});

// UPDATE: แก้ไขข้อมูล
app.post('/update', (req, res) => {
    const { id, name, email, phone, address } = req.body;
    const query = 'UPDATE users SET name = ?, email = ?, phone = ?, address = ? WHERE id = ?';
    connection.query(query, [name, email, phone, address, id], (err, results) => {
        if (err) throw err;
        res.redirect('/adminindex');
    });
});

// DELETE: ลบข้อมูล
app.post('/delete', (req, res) => {
    const { id } = req.body;
    const query = 'DELETE FROM users WHERE id = ?';
    connection.query(query, [id], (err, results) => {
        if (err) throw err;
        res.redirect('/adminindex');
    });
});




///แจ้งการซ่อมmantanance
// API สำหรับรับข้อมูลการแจ้งซ่อม
app.post('/api/send-repair-request', (req, res) => {
    const { rooms, name, tel, request } = req.body;

    if (!rooms || !name || !tel || !request) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // สร้าง query เพื่อบันทึกข้อมูล
    const query = 'INSERT INTO maintanance (rooms, name, tel, request) VALUES (?, ?, ?, ?)';
    connection.query(query, [rooms, name, tel, request], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).json({ success: false, message: 'Failed to insert data' });
        }
        res.json({ success: true, message: 'Repair request submitted successfully!' });
    });
});

       //get แจ้งซ่อม
       app.get('/api/get-repair-requests', (req, res) => {
        const query = 'SELECT * FROM maintanance'; // คำสั่ง SQL สำหรับดึงข้อมูล
        connection.query(query, (err, results) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Database error' });
            }
            res.json(results); // ส่งผลลัพธ์กลับไปให้ Client
        });
    }); 
    



//checkstatus slide btn
// API to get toggle statuses


// เริ่มเซิร์ฟเวอร์
app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
