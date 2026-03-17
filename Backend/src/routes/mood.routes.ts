import express from "express";
import UserMood from "../models/UserMood.model.js";

const router = express.Router();

// Step 1: Initialize Mood Entry
router.post("/mood", async (req: any, res: any) => {
  try {
    const { userId, moodType } = req.body;

    if (!userId || !moodType) {
      return res.status(400).json({ error: "userId and moodType are required" });
    }

    const moodEntry = await UserMood.create({
      userId,
      moodType,
      createdAt: new Date()
    });

    res.status(201).json({ 
      success: true, 
      moodId: String(moodEntry._id) 
    });
  } catch (error: any) {
    console.error("Mood submission error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Step 2: Submit Survey Answers & Calculate Severity
router.post("/survey", async (req: any, res: any) => {
  try {
    const { moodId, answers, intensity, duration, frequency } = req.body;

    if (!moodId) {
      return res.status(400).json({ error: "moodId is required" });
    }

    const severityScore = (intensity || 0) + (duration || 0) + (frequency || 0);
    let severityLevel: "Mild" | "Moderate" | "Severe" = "Mild";

    if (severityScore >= 11) {
      severityLevel = "Severe";
    } else if (severityScore >= 6) {
      severityLevel = "Moderate";
    }

    const updatedMood = await UserMood.findByIdAndUpdate(
      moodId,
      {
        answers,
        intensity,
        duration,
        frequency,
        severityScore,
        severityLevel
      },
      { new: true }
    );

    if (!updatedMood) {
      return res.status(404).json({ error: "Mood record not found" });
    }

    res.json({ 
      success: true, 
      severityLevel, 
      severityScore,
      result: updatedMood 
    });
  } catch (error: any) {
    console.error("Survey submission error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Step 3: Fetch Result for a User
router.get("/result/:userId", async (req: any, res: any) => {
  try {
    const moods = await UserMood.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({ success: true, history: moods });
  } catch (error: any) {
    console.error("Fetch results error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
