const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const db = require("./config/db");
const { router: groupRoutes } = require("./routes/groupRoutes"); // ✅ Import group routes

const app = express();

// =====================
// ✅ Multer Storage Setup
// =====================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// =====================
// ✅ Middleware
// =====================
app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use("/uploads", express.static("uploads"));

// =====================
// ✅ Routes
// =====================

// --- Signup ---
app.post("/api/signup", async (req, res) => {
  try {
    const { fullName, email, phoneNumber, password } = req.body;

    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
      if (err) return res.status(500).json({ message: "Database error" });
      if (results.length > 0) return res.status(400).json({ message: "User already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);
      const id = Date.now().toString();

      db.query(
        "INSERT INTO users (id, fullName, email, phoneNumber, password, role) VALUES (?, ?, ?, ?, ?, ?)",
        [id, fullName, email, phoneNumber, hashedPassword, "user"],
        (err) => {
          if (err) return res.status(500).json({ message: "Insert failed" });

          const user = { id, fullName, email, phoneNumber, role: "user" };
          res.status(201).json({ message: "User created successfully.", user });
        }
      );
    });
  } catch (err) {
    return res.status(500).json({ message: "Signup failed" });
  }
});

// --- Login ---
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ message: "DB error" });

    const user = results[0];
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid email or password" });

    res.status(200).json({ message: "Login successful.", user });
  });
});

// --- Create Group (with image upload) ---
app.post("/api/groups", upload.single("profilePicture"), (req, res) => {
  const { name, motto, mission, leaderId } = req.body;

  if (!name || !leaderId) {
    return res.status(400).json({ message: "Group name and leaderId are required." });
  }

  const id = Date.now().toString();
  const profilePicture = req.file ? `/uploads/${req.file.filename}` : null;

  const sql = `
    INSERT INTO group_data (id, name, motto, mission, profilePicture, leaderId)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [id, name, motto || "", mission || "", profilePicture, leaderId], (err) => {
    if (err) return res.status(500).json({ message: "Database insert failed" });

    res.status(201).json({
      message: "Group created successfully.",
      group: { id, name, motto, mission, profilePicture, leaderId },
    });
  });
});

// --- Get User's Groups ---
app.get("/api/users/:id/groups", (req, res) => {
  const userId = req.params.id;

  const leaderSql = "SELECT * FROM group_data WHERE leaderId = ?";
  const memberSql = `
    SELECT g.* 
    FROM group_data g
    INNER JOIN group_members gm ON g.id = gm.groupId
    WHERE gm.userId = ?
  `;

  db.query(leaderSql, [userId], (err, leaderGroups) => {
    if (err) return res.status(500).json({ message: "Failed to fetch leader groups" });

    db.query(memberSql, [userId], (err, memberGroups) => {
      if (err) return res.status(500).json({ message: "Failed to fetch member groups" });

      const allGroups = [...leaderGroups, ...memberGroups].reduce((acc, group) => {
        if (!acc.find((g) => g.id === group.id)) acc.push(group);
        return acc;
      }, []);

      res.status(200).json({ groups: allGroups });
    });
  });
});

// --- Update Group ---
app.put("/api/groups/:groupId", (req, res) => {
  const { groupId } = req.params;
  const { name, motto, mission, profilePicture } = req.body;

  const sql = `
    UPDATE group_data 
    SET name = ?, motto = ?, mission = ?, profilePicture = ?
    WHERE id = ?
  `;

  db.query(sql, [name, motto, mission, profilePicture, groupId], (err, result) => {
    if (err) return res.status(500).json({ message: "Failed to update group" });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Group not found" });

    res.status(200).json({ message: "Group updated successfully" });
  });
});

// --- Get Group Details ---
app.get("/api/groups/:groupId", (req, res) => {
  const { groupId } = req.params;

  db.query("SELECT * FROM group_data WHERE id = ?", [groupId], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (results.length === 0) return res.status(404).json({ message: "Group not found" });

    res.status(200).json({ group: results[0] });
  });
});

// ✅ Group routes (Exit group etc.)
app.use("/api", groupRoutes);

// =====================
// ✅ Server Startup
// =====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
