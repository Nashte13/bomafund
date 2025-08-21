const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");

// --- Create a new group ---
router.post("/groups", (req, res) => {
  const { name, leaderId } = req.body;

  if (!name || !leaderId) {
    return res.status(400).json({ message: "Group name and leader ID are required" });
  }

  const groupId = uuidv4();
  const group = { id: groupId, name, leaderId, motto: "", mission: "" };

  db.query(
    "INSERT INTO group_data (id, name, leaderId, motto, mission) VALUES (?, ?, ?, ?, ?)",
    [group.id, group.name, group.leaderId, group.motto, group.mission],
    (err) => {
      if (err) return res.status(500).json({ message: "Failed to create group" });

      // Add leader as member
      db.query("SELECT * FROM users WHERE id = ?", [leaderId], (err, usersResult) => {
        if (err || usersResult.length === 0) {
          return res.status(404).json({ message: "Leader not found" });
        }

        const leader = usersResult[0];
        db.query(
          "INSERT INTO group_members (groupId, userId, name, phoneNumber) VALUES (?, ?, ?, ?)",
          [group.id, leader.id, leader.fullName, leader.phoneNumber],
          (err) => {
            if (err) return res.status(500).json({ message: "Group created but failed to assign leader" });

            res.status(201).json({ message: "Group created successfully", group });
          }
        );
      });
    }
  );
});

// --- Exit Group (remove user from group_members) ---
router.delete("/groups/:groupId/members/:userId", (req, res) => {
  const { groupId, userId } = req.params;

  db.query("SELECT * FROM group_members WHERE groupId = ? AND userId = ?", [groupId, userId], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (results.length === 0) return res.status(400).json({ message: "User is not a member of this group" });

    db.query("DELETE FROM group_members WHERE groupId = ? AND userId = ?", [groupId, userId], (err) => {
      if (err) return res.status(500).json({ message: "Failed to exit group" });

      console.log(`👋 User ${userId} exited group ${groupId}`);
      res.json({ message: "User exited group successfully" });
    });
  });
});

module.exports = { router };
