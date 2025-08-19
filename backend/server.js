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

// ✅ Create a Group (MySQL)
app.post("/api/groups", (req, res) => {
  const { name, motto, mission, profilePicture, leaderId } = req.body;

  if (!name || !leaderId) {
    return res.status(400).json({ message: "Group name and leaderId are required." });
  }

  const id = Date.now().toString();

  const sql = `
    INSERT INTO group_data (id, name, motto, mission, profilePicture, leaderId)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [id, name, motto || "", mission || "", profilePicture || "", leaderId], (err, result) => {
    if (err) {
      console.error("❌ Error inserting group:", err);
      return res.status(500).json({ message: "Database insert failed", error: err });
    }

    console.log("✅ Group created:", { id, name, motto, mission, profilePicture, leaderId });
    return res.status(201).json({
      message: "Group created successfully.",
      group: { id, name, motto, mission, profilePicture, leaderId }
    });
  });
});

// ✅ Get User's Groups (leader OR member)
app.get("/api/users/:id/groups", (req, res) => {
  const userId = req.params.id;

  // First check if user exists
  db.query("SELECT * FROM users WHERE id = ?", [userId], (err, results) => {
    if (err) {
      console.error("DB error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    // Get groups where user is leader
    const leaderSql = "SELECT * FROM group_data WHERE leaderId = ?";

    // Get groups where user is member
    const memberSql = `
      SELECT g.* 
      FROM group_data g
      INNER JOIN group_members gm ON g.id = gm.groupId
      WHERE gm.userId = ?
    `;

    db.query(leaderSql, [userId], (err, leaderGroups) => {
      if (err) {
        console.error("❌ Error fetching leader groups:", err);
        return res.status(500).json({ message: "Failed to fetch leader groups" });
      }

      db.query(memberSql, [userId], (err, memberGroups) => {
        if (err) {
          console.error("❌ Error fetching member groups:", err);
          return res.status(500).json({ message: "Failed to fetch member groups" });
        }

        // Merge both (avoid duplicates if user is leader & member of same group)
        const allGroups = [...leaderGroups, ...memberGroups].reduce((acc, group) => {
          if (!acc.find((g) => g.id === group.id)) {
            acc.push(group);
          }
          return acc;
        }, []);

        console.log("✅ Groups fetched for user:", userId, allGroups);
        res.status(200).json({ groups: allGroups });
      });
    });
  });
});



  // ✅ Update Group Details
app.put("/api/groups/:groupId", (req, res) => {
  const { groupId } = req.params;
  const { name, motto, mission, profilePicture } = req.body;

  const sql = `
    UPDATE group_data 
    SET name = ?, motto = ?, mission = ?, profilePicture = ?
    WHERE id = ?
  `;

  db.query(sql, [name, motto, mission, profilePicture, groupId], (err, result) => {
    if (err) {
      console.error("❌ Error updating group:", err);
      return res.status(500).json({ message: "Failed to update group" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Group not found" });
    }

    console.log("✅ Group updated:", groupId);
    res.status(200).json({ message: "Group updated successfully" });
  });
});

  

// ✅ Get Group Details (from MySQL)
app.get("/api/groups/:groupId", (req, res) => {
  const { groupId } = req.params;
  console.log("Fetching group with ID:", groupId);

  const sql = "SELECT * FROM group_data WHERE id = ?";

  db.query(sql, [groupId], (err, results) => {
    if (err) {
      console.error("❌ DB error fetching group:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Group not found" });
    }

    console.log("✅ Group fetched:", results[0]);
    res.status(200).json({ group: results[0] });
  });
});


// ✅ Server Startup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
