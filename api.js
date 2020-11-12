const express = require('express');
const cors = require('cors')
const mysql = require('mysql')
const app = express();

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '12345678',
    database: 'db_project'
});

connection.connect(err => {
    if(err){
        return err;
    }
});

console.log(connection);
app.use(cors());

// ############################################################################ Contact ##################################################################################

app.get('/contact/:contact_name/:contact_tel/:contact_email/:contact_title/:contact_detail', (req, res) => { // contact Unread: USER
    let ts = Date.now();
    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();

    let Hr = date_ob.getHours();
    let Min = date_ob.getMinutes() + 1;
    let Sec = date_ob.getSeconds();
    let contactdate = year + "-" + month + "-" + date + " "  + Hr  + ":" + Min  + ":" + Sec 

    const QUERY_SQL = 'INSERT INTO contact (contact_name, contact_tel, contact_email, contact_title, contact_detail, contact_date, contact_status)  \
    VALUES (\'' + req.params.contact_name + '\',\'' + req.params.contact_tel + '\',\'' + req.params.contact_email 
    + '\',\'' + req.params.contact_title + '\',\'' + req.params.contact_detail + '\',\'' + contactdate+ '\',1)';
    connection.query(QUERY_SQL, (err,results) => {
        if(err) {
            return res.send(err)
        }
        else{ 
            return res.json({
                data: results
            })
        }
    })
});

app.get('/contactRead/:contact_id', (req, res) => { // contact read: USER
    const QUERY_SQL = 'UPDATE contact SET contact_status=2 WHERE contact_id = ' + req.params.contact_id;
    connection.query(QUERY_SQL, (err,results) => {
        if(err) {
            return res.send(err)
        }
        else{ 
            return res.json({
                data: results
            })
        }
    })
});

app.get('/contactDel/:contact_id', (req, res) => { // contact read: USER
    const QUERY_SQL = 'DELETE FROM contact WHERE  contact_id = ' + req.params.contact_id;
    connection.query(QUERY_SQL, (err,results) => {
        if(err) {
            return res.send(err)
        }
        else{ 
            return res.json({
                data: results
            })
        }
    })
});


app.get('/getcontact', (req, res) => {
    const QUERY_SQL = 'SELECT * FROM contact ORDER BY contact_id ASC';
    connection.query(QUERY_SQL, (err,results) => {
        if(err) {
            return res.send(err)
        }
        else{ 
            return res.json(results)
        }
    })
});

app.get('/getcontact/:contact_status', (req, res) => {
    const QUERY_SQL = 'SELECT * FROM contact WHERE contact_status = ' + req.params.contact_status + ' ORDER BY contact_id ASC';
    connection.query(QUERY_SQL, (err,results) => {
        if(err) {
            return res.send(err)
        }
        else{ 
            return res.json(results)
        }
    })
});

// ############################################################################ ADMIN ##################################################################################
app.get('/login/:am_user/:am_pass', (req, res) => { // Login
    const QUERY_SQL = 'SELECT am_id FROM admin WHERE am_user = \'' + req.params.am_user + '\' AND am_pass = \'' + req.params.am_pass +'\'';
    connection.query(QUERY_SQL, (err,results) => {
        if(err) {
            return res.send(err)
        }
        else{ 
            return res.json(results)
        }
    })
});

app.get('/changePassword/:am_pass/:new_pass', (req, res) => { // Change Password Admin
    const QUERY_SQL = 'UPDATE admin SET am_pass = \'' + req.params.new_pass + '\' WHERE am_user = \'admin\' AND am_pass = \'' + req.params.am_pass +'\'';
    connection.query(QUERY_SQL, (err,results) => {
        if(err) {
            return res.send(err)
        }
        else{ 
            return res.json({
                data: results
            })
        }
    })
});

app.get('/changePassword/:am_pass/:new_pass', (req, res) => { // Edit Password Admin
    const QUERY_SQL = 'UPDATE admin SET am_pass = \'' + req.params.new_pass + '\' WHERE am_user = \'admin\' AND am_pass = \'' + req.params.am_pass +'\'';
    connection.query(QUERY_SQL, (err,results) => {
        if(err) {
            return res.send(err)
        }
        else{ 
            return res.json({
                data: results
            })
        }
    })
});

app.get('/changeDataAdmin/:am_name/:am_tel/:am_email', (req, res) => { // Edit Data Admin
    const QUERY_SQL = 'UPDATE admin SET am_name=\'' + req.params.am_name + '\',am_tel=\''  + req.params.am_tel +'\',am_email=\'' + req.params.am_email +'\' WHERE am_user = \'admin\'';
    connection.query(QUERY_SQL, (err,results) => {
        if(err) {
            return res.send(err)
        }
        else{ 
            return res.json({
                data: results
            })
        }
    })
});

// ############################################################################ ข้อมูลผู้เช่าห้องพัก ##################################################################################
app.get('/rentlist', (req, res) => { // rentlist
    const QUERY_SQL = 'SELECT rent.rent_id,room.room_name,member.mb_name,rent.rent_check_in,rent.rent_status FROM room,rent,member \
                        WHERE rent.rent_mb_id = member.mb_id AND rent.rent_room_id = room.room_id AND rent.rent_status = \'ใช้บริการ\' ORDER BY rent.rent_id ASC';
    connection.query(QUERY_SQL, (err,results) => {
        if(err) {
            return res.send(err)
        }
        else{ 
            return res.json(results)
        }
    })
});

app.get('/getrentlist/:rent_id', (req, res) => { // Show Rent list
    const QUERY_SQL = 'SELECT rent.rent_id,member.mb_name,member.mb_card_id,member.mb_address,member.mb_district,member.mb_province,member.mb_zipcode,member.mb_tel,member.mb_email,\
                    room.room_name,room_type.type_name,room_type.type_price, room_type.type_detail,rent.rent_deposits,rent.rent_check_in,rent.rent_status FROM room,rent,member,room_type \
                    WHERE rent.rent_id = ' + req.params.rent_id +' AND rent.rent_mb_id = member.mb_id AND rent.rent_room_id = room.room_id AND room.room_type_id = room_type.type_id'
    connection.query(QUERY_SQL, (err,results) => {
        if(err) {
            return res.send(err)
        }
        else{ 
            return res.json(results)
        }
    })
});

// ############################################################################ คิดค่าเช่า ##################################################################################

app.get('/billlist', (req, res) => { // ดูข้อมูลบิล
    const QUERY_SQL = 'SELECT room.room_name,member.mb_name,rent.rent_check_in,rent.rent_status,bill.bill_date,bill.bill_total FROM room,member,rent,bill \
                    WHERE rent.rent_status = \'ใช้บริการ\' AND rent.rent_mb_id = member.mb_id AND rent.rent_room_id = room.room_id AND bill.bill_status = 1 \
                    AND rent.rent_id = bill.bill_rent_id AND room.room_status = \'ห้องเช่าแล้ว\' GROUP BY room.room_name ORDER BY rent.rent_id ASC'
    connection.query(QUERY_SQL, (err,results) => {
        if(err) {
            return res.send(err)
        }
        else{ 
            return res.json(results)
        }
    })
});


// ############################################################################ ระบบห้องเช่า ##################################################################################

// ############################## ข้อมูลประเภทห้องเช่า ##############################

app.get('/getroom', (req, res) => { // ดูประเภทห้องเช่า
    const QUERY_SQL = 'SELECT * FROM room_type'
    connection.query(QUERY_SQL, (err,results) => {
        if(err) {
            return res.send(err)
        }
        else{ 
            return res.json(results)
        }
    })
});

app.get('/editroom/:type_id/:type_name/:type_detail/:type_price', (req, res) => { // แก้ไขห้องเช่า
    const QUERY_SQL = 'UPDATE room_type SET type_name= \''+ req.params.type_name +'\',type_detail=\''+ req.params.type_detail +'\',type_price=\''+ req.params.type_price +'\' WHERE type_id = ' + req.params.type_id
    connection.query(QUERY_SQL, (err,results) => {
        if(err) {
            return res.send(err)
        }
        else{ 
            return res.json(results)
        }
    })
});

app.get('/deleteroom/:type_id', (req, res) => { // ลบห้องเช่า
    const QUERY_SQL = 'DELETE FROM room_type WHERE type_id = ' + req.params.type_id
    connection.query(QUERY_SQL, (err,results) => {
        if(err) {
            return res.send(err)
        }
        else{ 
            return res.json(results)
        }
    })
});

app.get('/insertroom/:type_name/:type_detail/:type_price', (req, res) => { // เพิ่มห้องเช่า
    const QUERY_SQL = 'INSERT INTO room_type(type_name, type_detail, type_price) VALUES (\'' + req.params.type_name + '\',\'' + req.params.type_detail + '\',' + req.params.type_price + ')'
    connection.query(QUERY_SQL, (err,results) => {
        if(err) {
            return res.send(err)
        }
        else{ 
            return res.json(results)
        }
    })
});

// ############################## ข้อมูลสาธารณูปโภค ##############################

app.get('/getutility', (req, res) => { // ดูข้อมูลสาธารณูปโภค
    const QUERY_SQL = 'SELECT * FROM utility'
    connection.query(QUERY_SQL, (err,results) => {
        if(err) {
            return res.send(err)
        }
        else{ 
            return res.json(results)
        }
    })
});

app.get('/editutility/:utility_id/:utility_name/:utility_unit_price', (req, res) => { // แก้ไขข้อมูลสาธารณูปโภค
    const QUERY_SQL = 'UPDATE utility SET utility_name = \''+ req.params.utility_name +'\',utility_unit_price=\''+ req.params.utility_unit_price +'\' WHERE utility_id = ' + req.params.utility_id
    connection.query(QUERY_SQL, (err,results) => {
        if(err) {
            return res.send(err)
        }
        else{ 
            return res.json(results)
        }
    })
});

app.get('/deleteutility/:utility_id', (req, res) => { // ลบข้อมูลสาธารณูปโภค
    const QUERY_SQL = 'DELETE FROM utility WHERE utility_id = ' + req.params.utility_id
    connection.query(QUERY_SQL, (err,results) => {
        if(err) {
            return res.send(err)
        }
        else{ 
            return res.json(results)
        }
    })
});

app.get('/insertutility/:utility_name/:utility_unit_price', (req, res) => { // เพิ่มข้อมูลสาธารณูปโภค
    const QUERY_SQL = 'INSERT INTO utility(utility_name, utility_unit_price) VALUES (\'' + req.params.utility_name + '\',' + req.params.utility_unit_price + ')'
    connection.query(QUERY_SQL, (err,results) => {
        if(err) {
            return res.send(err)
        }
        else{ 
            return res.json(results)
        }
    })
});

// ############################## ข้อมูลห้องเช่า ##############################

app.get('/getroomdetail', (req, res) => { // ดูข้อมูลห้องเช่า
    const QUERY_SQL = 'SELECT room.room_id, room.room_type_id, room_type.type_name,room_type.type_price, room.room_status FROM room,room_type WHERE room_type.type_id = room.room_type_id'
    connection.query(QUERY_SQL, (err,results) => {
        if(err) {
            return res.send(err)
        }
        else{ 
            return res.json(results)
        }
    })
});

app.get('/deleteroomdetail/:room_id', (req, res) => { // ลบข้อมูลห้องเช่า
    const QUERY_SQL = 'DELETE FROM room WHERE room_id = ' + req.params.room_id
    connection.query(QUERY_SQL, (err,results) => {
        if(err) {
            return res.send(err)
        }
        else{ 
            return res.json(results)
        }
    })
});

app.get('/getroomdetail-for-edit', (req, res) => { // ดูข้อมูลสำหรับแก้ไขและเพิ่มห้องเช่า
    const QUERY_SQL = 'SELECT * FROM room_type'
    connection.query(QUERY_SQL, (err,results) => {
        if(err) {
            return res.send(err)
        }
        else{ 
            return res.json(results)
        }
    })
});

app.get('/insertroomdetail/:room_type_id/:room_name/:room_status', (req, res) => { // เพิ่มข้อมูลห้องเช่า
    const QUERY_SQL = 'INSERT INTO room(room_type_id, room_name, room_status) VALUES (\'' + req.params.room_type_id + '\',\'' + req.params.room_name + '\',\'' + req.params.room_status+ '\')'
    connection.query(QUERY_SQL, (err,results) => {
        if(err) {
            return res.send(err)
        }
        else{ 
            return res.json(results)
        }
    })
});

app.get('/updateroomdetail/:room_id/:room_type_id/:room_name/:room_status', (req, res) => { // แก้ไขข้อมูลห้องเช่า
    const QUERY_SQL = 'UPDATE room SET room_type_id=' + req.params.room_type_id + ',room_name=\'' + req.params.room_name + '\',room_status=\'' + req.params.room_status + '\' WHERE room_id = ' + req.params.room_id
    connection.query(QUERY_SQL, (err,results) => {
        if(err) {
            return res.send(err)
        }
        else{ 
            return res.json(results)
        }
    })
});

// ############################## ข้อมูลมิเตอร์ ##############################

app.get('/getmeter', (req, res) => { // ดูข้อมูลมิเตอร์
    const QUERY_SQL = 'SELECT meter.meter_id,utility.utility_name,room.room_name,meter.meter_unit,meter.meter_update FROM room,meter,utility \
    WHERE meter.meter_utility_id = utility.utility_id AND meter.meter_room_id = room.room_id'
    connection.query(QUERY_SQL, (err,results) => {
        if(err) {
            return res.send(err)
        }
        else{ 
            return res.json(results)
        }
    })
});

app.get('/deletemeter/:meter_id', (req, res) => { // ลบข้อมูลมิเตอร์
    const QUERY_SQL = 'DELETE FROM meter WHERE meter_id = ' + req.params.meter_id
    connection.query(QUERY_SQL, (err,results) => {
        if(err) {
            return res.send(err)
        }
        else{ 
            return res.json(results)
        }
    })
});

app.get('/getmeter-for-edit/:meter_id', (req, res) => { // ดูข้อมูลมิเตอร์สำหรับเพิ่มและแก้ไข
    const QUERY_SQL = 'SELECT utility.utility_id , utility.utility_name , room.room_id , room.room_name , meter.meter_id,meter.meter_unit FROM utility,room,meter \
                    WHERE meter.meter_id = ' + req.params.meter_id + ' GROUP BY room.room_name'
    connection.query(QUERY_SQL, (err,results) => {
        if(err) {
            return res.send(err)
        }
        else{ 
            return res.json(results)
        }
    })
});

app.get('/updatemeter/:meter_id/:meter_utility_id/:meter_room_id/:meter_unit', (req, res) => { // แก้ไขข้อมูลมิเตอร์
    let ts = Date.now();
    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();

    let contactdate = year + "-" + month + "-" + date
    const QUERY_SQL = 'UPDATE meter SET meter_utility_id=' + req.params.meter_id +',meter_room_id='+ req.params.meter_room_id 
                +',meter_unit='+ req.params.meter_unit +',meter_update=\''+ contactdate+'\' WHERE meter_id=' + req.params.meter_id
    connection.query(QUERY_SQL, (err,results) => {
        if(err) {
            return res.send(err)
        }
        else{ 
            return res.json(results)
        }
    })
});

app.get('/insertmeter/:meter_utility_id/:meter_room_id/:meter_unit', (req, res) => { // เพิ่มข้อมูลมิเตอร์
    let ts = Date.now();
    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();

    let contactdate = year + "-" + month + "-" + date
    const QUERY_SQL = 'INSERT INTO meter(meter_utility_id, meter_room_id, meter_unit, meter_update) VALUES (' + req.params.meter_utility_id + ',' + req.params.meter_room_id + ',' 
                + req.params.meter_unit + ',\'' + contactdate + '\'' 
    connection.query(QUERY_SQL, (err,results) => {
        if(err) {
            return res.send(err)
        }
        else{ 
            return res.json(results)
        }
    })
});

app.listen(3100, () => {
    console.log('Products server listening on port 3100');
});