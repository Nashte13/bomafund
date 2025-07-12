const express = require('express');
const router = express.Router();
const db = require('../config/db');
const {v4:uuidv4} = require('uuid'); 


// Create a new group(using mysql)
router.post("/groups", (req, res) => {
    const { name, leaderId } = req.body;
  
    if (!name || !leaderId) {
      return res.status(400).json({ message: "Group name and leader ID are required" });
    }
  
    const groupId = uuidv4(); // generate unique group ID
    const group = {
      id: groupId,
      name,
      leaderId,
      motto: "",
      mission: "",
    };
  
    // 1️⃣ Insert into groups table
    db.query(
      "INSERT INTO group_data (id, name, leaderId, motto, mission) VALUES (?, ?, ?, ?, ?)",
      [group.id, group.name, group.leaderId, group.goal, group.objectives],
      (err, result) => {
        if (err) {
          console.error("❌ Error inserting group:", err);
          return res.status(500).json({ message: "Failed to create group" });
        }
  
        console.log("✅ Group inserted:", group.name);
  
        // 2️⃣ Add leader as first group member
        db.query("SELECT * FROM users WHERE id = ?", [leaderId], (err, usersResult) => {
          if (err || usersResult.length === 0) {
            return res.status(404).json({ message: "Leader not found" });
          }
  
          const leader = usersResult[0];
  
          db.query(
            "INSERT INTO group_members (groupId, userId, name, phoneNumber) VALUES (?, ?, ?, ?)",
            [group.id, leader.id, leader.fullName, leader.phoneNumber],
            (err, memberResult) => {
              if (err) {
                console.error("❌ Failed to add leader as member:", err);
                return res.status(500).json({ message: "Group created but failed to assign leader" });
              }
  
              console.log("👤 Leader added to group_members");
              return res.status(201).json({ message: "Group created successfully", group });
            }
          );
        });
      }
    );
  });


module.exports = {router}; 
