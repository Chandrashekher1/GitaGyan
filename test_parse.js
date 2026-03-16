const fs = require('fs');

const text = "```json\n{\n  \"score\": 0,\n  \"feedback\": \"I cannot confirm a person or a yoga pose in the image.\",\n  \"corrections\": [],\n  \"alignment_issues\": [],\n  \"nextPose\": \"Tadasana (Mountain Pose)\",\n  \"encouragement\": \"Let's try again!\"\n}\n```";

let stripped = text.trim();
if (stripped.startsWith('```json')) {
  stripped = stripped.substring(7);
} else if (stripped.startsWith('```')) {
  stripped = stripped.substring(3);
}
if (stripped.endsWith('```')) {
  stripped = stripped.substring(0, stripped.length - 3);
}

try {
  console.log(JSON.parse(stripped.trim()));
} catch (e) {
  console.error("Parse failed:", e.message);
}
