import multer from "multer";
import pool from "../../../lib/db";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "schoolImages", 
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

// Add a size limit at multer-level to fail fast (>10MB rejected)
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      return new Promise((resolve, reject) => {
        upload.single("image")(req, {}, async (err) => {
          if (err) {
            console.error("Upload error:", err);
            // Handle Multer file size limit
            if (err.code === 'LIMIT_FILE_SIZE') {
              return res.status(400).json({
                error: "Image too large. Max allowed size is 10MB.",
              });
            }

            // Handle specific Cloudinary errors
            if (err.message && err.message.includes('File size too large')) {
              return res.status(400).json({ 
                error: "File size too large. Please upload an image smaller than 10MB." 
              });
            }
            
            if (err.message && err.message.includes('Invalid image format')) {
              return res.status(400).json({ 
                error: "Invalid image format. Please upload a JPEG, JPG, or PNG file." 
              });
            }
            
            return res.status(400).json({ 
              error: "File upload failed. Please try again with a different image." 
            });
          }

          try {
            const { name, address, city, state, contact, email_id } = req.body;
            const imagePath = req.file ? req.file.path : null;

            if (!name || !address || !city || !state || !contact || !email_id) {
              return res.status(400).json({ error: "All fields are required" });
            }

            await pool.query(
              `INSERT INTO schools (name, address, city, state, contact, image, email_id)
               VALUES (?, ?, ?, ?, ?, ?, ?)`,
              [name, address, city, state, contact, imagePath, email_id]
            );

            res.status(201).json({ message: "School added successfully" });
            resolve();
          } catch (dbError) {
            console.error("Database error:", dbError);
            
            // If we have a file uploaded but database fails, we should clean it up
            if (req.file && req.file.path) {
              try {
                await cloudinary.uploader.destroy(req.file.public_id);
              } catch (cleanupError) {
                console.error("Failed to cleanup uploaded file:", cleanupError);
              }
            }
            
            res.status(500).json({ 
              error: "Failed to save school data. Please try again." 
            });
            resolve();
          }
        });
      });
    } else if (req.method === "GET") {
      try {
        const [rows] = await pool.query(
          "SELECT id, name, address, city, state, contact, image, email_id FROM schools ORDER BY id DESC"
        );
        res.status(200).json(rows);
      } catch (dbError) {
        console.error("Database error:", dbError);
        res.status(500).json({ error: "Failed to fetch schools" });
      }
    } else {
      res.status(405).json({ error: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("API error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
