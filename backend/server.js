const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { router: groupRoutes, groups } = require("./routes/groupRoutes");
const db = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

// Mount all group-related routes
app.use("/api", groupRoutes);

// ✅ Signup Endpoint with MySQL

app.post('/api/signup', async (req, res) => {
    try {
      const { fullName, email, phoneNumber, password } = req.body;
      console.log('Received signup:', fullName, email, phoneNumber);
  
      // Check if email already exists
      db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) {
          console.error('DB error:', err);
          return res.status(500).json({ message: 'Database error' });
        }
  
        if (results.length > 0) {
          console.log('User already exists');
          return res.status(400).json({ message: 'User already exists' });
        }
  
        const hashedPassword = await bcrypt.hash(password, 10);
        const id = Date.now().toString();
  
        db.query(
          'INSERT INTO users (id, fullName, email, phoneNumber, password, role) VALUES (?, ?, ?, ?, ?, ?)',
          [id, fullName, email, phoneNumber, hashedPassword, 'user'],
          (err, result) => {
            if (err) {
              console.error('Insert error:', err);
              return res.status(500).json({ message: 'Insert failed' });
            }
  
            console.log('✅ User inserted into DB:', email);
            const user = { id, fullName, email, phoneNumber, role: 'user' };
            return res.status(201).json({ message: 'User created successfully.', user });
          }
        );
      });
    } catch (err) {
      console.error('Unexpected signup error:', err);
      return res.status(500).json({ message: 'Signup failed' });
    }
  });


// ✅ Login Endpoint
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) return res.status(500).json({ message: "DB error", error: err });

      const user = results[0];
      if (!user)
        return res.status(400).json({ message: "Invalid email or password" });

      const match = await bcrypt.compare(password, user.password);
      if (!match)
        return res.status(400).json({ message: "Invalid email or password" });

      console.log("Login successful for:", user.email);
      res.status(200).json({ message: "Login successful.", user });
    }
  );
});

// ✅ Get User's Groups (based on phone number match using DB)
app.get("/api/users/:id/groups", (req, res) => {
    const userId = req.params.id;
  
    db.query("SELECT * FROM users WHERE id = ?", [userId], (err, results) => {
      if (err) {
        console.error("DB error:", err);
        return res.status(500).json({ message: "Database error" });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ message: "User not found." });
      }
  
      const user = results[0];
  
      // Get groups from memory (temporary)
      const userGroups = groups.filter((g) =>
        g.members.some((m) => m.phoneNumber === user.phoneNumber)
      );
  
      res.status(200).json({ groups: userGroups });
    });
  });
  

// ✅ Get Group Details (used by GroupHome)
app.get("/api/groups/:groupId", (req, res) => {
  const { groupId } = req.params;
  console.log("Fetching group with ID:", groupId);
  const group = groups.find((g) => g.id === groupId);

  if (!group) {
    return res.status(404).json({ message: "Group not found" });
  }

  res.status(200).json({ group });
});

// ✅ Server Startup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
