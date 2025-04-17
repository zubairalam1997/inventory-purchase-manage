const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const path = require('path');
const http = require("http");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: path.join(__dirname, 'inventory-backend.env') });
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const { isObject } = require('util');
const { timeStamp } = require('console');
const { Server } = require('socket.io');
const app= express();

const server = http.createServer(app);
app.use(cors());
app.use(express.json())
const socketIo = require("socket.io");
const io = new Server(server, {
  cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] },
});
app.use(cors({ origin: "http://localhost:3000", credentials: true }));




const pool = mysql.createPool({
    host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

// JWT Secret Key
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';
app.post('/items', async (req, res) => {
    try {
        const { itemName, description, storeName, supplierName, locationRack, storedBy } = req.body;
        
        await pool.query(
            'INSERT INTO Items (itemName, description, storeName, supplierName, locationRack, storedBy) VALUES (?, ?, ?, ?, ?, ?)',
            [itemName, description, storeName, supplierName, locationRack, storedBy]
        );
        res.status(201).json({ message: 'Product added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
  
app.get('/items', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Items;'); // Test query
        res.json(rows);
    } catch (error) {
        console.error('Test query error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/employees', async (req, res) => {
    try {
        const { employeeName, jobDesignation, employeeMail, password } = req.body;

        if (!employeeName || !jobDesignation || !employeeMail || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

         // Hash password before storing
         const hashedPassword = await bcrypt.hash(password, 10);

         // Insert user into the database
         const [result] = await pool.query(
             "INSERT INTO Employees (EmployeeName, JobDesignation, Email, Password) VALUES (?, ?, ?, ?)",
             [employeeName, jobDesignation, employeeMail, hashedPassword]
         );

        res.status(201).json({ message: 'Employee added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        // console.log("Received login request:", req.body);

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        // Fetch user
        const [users] = await pool.query(
            "SELECT EmployeeID, EmployeeName, Email, Password FROM Employees WHERE Email = ?",
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const user = users[0];

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.Password);
        console.log("Password Match:", isPasswordValid);

        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { employeeID: user.EmployeeID, email: user.Email, employeeName: user.EmployeeName },
            JWT_SECRET,
            { expiresIn: '3h' }
        );

        
        res.json({ message: "Login Successful", token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

//middleware to verify token 
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extract the token after 'Bearer'
    // console.log("Token received:", token);
    
    if (!token) return res.status(401).json({ error: "Access denied" });

    try {
        const decoded = jwt.verify(token, JWT_SECRET); // Decode the token
        req.user = decoded; // Attach the decoded payload to req.user
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error("Invalid token:", error);
        res.status(400).json({ error: "Invalid token" });
    }
};

app.post('/user', verifyToken, async (req, res) => {
    try {
        const [employee] = await pool.query(
            "SELECT EmployeeID, EmployeeName, Email FROM Employees WHERE EmployeeID = ?",
            [req.user.employeeID] // Use req.user set by the verifyToken middleware
        );
        
        if (employee.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        
        res.json(employee[0]); // Send the first row as user data
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/issue-item', async(req,res)=>{
    try{
        const {itemID,itemName, description, issuerName, issuedTo, issueDate, quantityIssued }=  req.body;
        const issueID = uuidv4();
        await pool.query(
            "INSERT INTO IssuedItems (IssueID, ItemID, ItemName, Description, IssuerName, IssuedTo, IssueDate, QuantityIssued) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [issueID, itemID, itemName, description, issuerName, issuedTo, issueDate, quantityIssued]
        );
        
    res.status(201).json({message:"Item Issued succesfully"});
    }catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
    
});

app.get('/issued-items', async(req,res)=>{
    try{
        const [rows] = await pool.query(
            "SELECT * FROM IssuedItems"
        );
        res.json(rows);
    }catch (error) {
        console.error('Test query error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/items/:id', async (req, res) => {
    
        const itemID = req.params.id;

        if (!itemID) {
          return res.status(400).json({ error: 'Item ID is required' });
        }
      
        try {
          const [result] = await pool.execute('DELETE FROM Items WHERE ItemID = ?', [itemID]);
      
          if (result.affectedRows === 1) {
            res.status(200).json({ message: 'Item deleted successfully' });
          } else {
            res.status(404).json({ error: 'Item not found' });
          }
        } catch (error) {
          console.error('Error deleting item:', error);
          res.status(500).json({ error: 'Internal server error' });
        }
        
        
    });

   
    // API to send messages
    app.post('/send-message', async (req, res)=>{
        try{
            const {roomId, senderId, message} = req.body;
            await pool.query(
                "INSERT INTO ChatMessages(RoomID, SenderID, Message) VALUES (?,?,?)",
                [roomId, senderId, message]
            );
            io.emit('new-message', { senderId, message }); 
            res.json({success:true, message :"Message sent"});
        }catch (error) {
            res.status(500).json({ error: "Failed to send message" });
        }
    });


    //APi to fetch chat history


    // ✅ Fetch chat history with EmployeeName
app.get("/chat-history/:roomId", async (req, res) => {
    try {
      const [messages] = await pool.query(
        `SELECT m.MessageID, m.RoomID, m.SenderID, m.Message, m.FilePath, m.Timestamp, e.EmployeeName 
         FROM ChatMessages m
         LEFT JOIN Employees e ON m.SenderID = e.EmployeeID
         WHERE m.RoomID = ?
         ORDER BY m.Timestamp`,
        [req.params.roomId]
      );
      res.json(messages);
    } catch (error) {
      console.error("Chat history error:", error);
      res.status(500).json({ error: "Failed to fetch chat history" });
    }
  });


  const fs = require("fs");
  app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// File storage config using multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, "uploads");
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath);
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueName = `${Date.now()}-${file.originalname}`;
      cb(null, uniqueName);
    },
  });
  
  const upload = multer({ storage });
  //📤 Upload File Endpoint
  app.post("/upload-file", upload.single("file"), async (req, res) => {
    const { senderId, roomId } = req.body;
    const filePath = `/uploads/${req.file.filename}`;
  
    try {
      // Save file path as a message with NULL message content
      await pool.query(
        "INSERT INTO ChatMessages (RoomID, SenderID, Message, FilePath) VALUES (?, ?, NULL, ?)",
        [roomId, senderId, filePath]
      );
  
      // Get sender name
      const [rows] = await pool.query("SELECT EmployeeName FROM Employees WHERE EmployeeID = ?", [senderId]);
      const senderName = rows[0]?.EmployeeName || "Unknown";
  
      // Emit to all in room
      io.to(roomId).emit("new-file", {
        senderId,
        senderName,
        filePath,
        roomId,
      });
  
      res.status(200).json({ filePath });
    } catch (error) {
      console.error("Upload failed:", error);
      res.status(500).json({ error: "File upload failed" });
    }
  });


  
  
  let socketsConnected = new Set()
  
  // 📌 WebSocket Setup
  io.on("connection", (socket) => {
     // Join general room
     const generalRoom = "general"; // Define the room name as a constant
     socket.join(generalRoom);
     socketsConnected.add(socket.id)
     
    console.log('socLen',socketsConnected.size)
    console.log(`Socket ${socket.id} joined room ${generalRoom}`);
    

    
  
    socket.on('send-message', async (data) => {
        if (!data || typeof data !== 'object' || !data.roomId || !data.senderId || !data.message) {
            console.error('Invalid message data received:', data);
            return; // Stop processing if data is invalid
        }

        const { roomId, senderId, message } = data;
        //save to DB
        try {
            await pool.query('INSERT INTO ChatMessages (RoomID, SenderID, Message) VALUES (?, ?, ?)', [
                roomId,
                senderId,
                message,
            ]);
             // Fetch senderName from employees table
        const [rows] = await pool.query("SELECT EmployeeName FROM Employees WHERE EmployeeID = ?", [senderId]);
        const senderName = rows[0]?.EmployeeName || "Unknown";

        // Emit message with senderName
            io.to(generalRoom).emit('new-message', { senderId, senderName, message });
        } catch (error) {
            console.error('Error sending message to DB:', error);
        }
    });
    socket.on("disconnect", () => {
        socket.leave(generalRoom); // Leave the general room on disconnect
        console.log(`Socket ${socket.id} disconnected`);
        socketsConnected.delete(socket.id)
    });
  });
  


  const PORT = 5000;
  server.listen(PORT, () => { // Use server.listen instead of app.listen
      console.log(`Server is running on port ${PORT}`);
  });




