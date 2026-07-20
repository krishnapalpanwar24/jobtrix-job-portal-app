const ImageKit = require("@imagekit/nodejs");

const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

// fileBuffer -> multer memoryStorage se aata hai (req.file.buffer)
const uploadToImageKit = async (fileBuffer, fileName, folder = "jobtrix") => {
  const result = await imagekit.files.upload({
    file: fileBuffer.toString("base64"),
    fileName,
    folder,
  });
  return { url: result.url, fileId: result.fileId };
};

const deleteFromImageKit = async (fileId) => {
  if (!fileId) return;
  try {
    await imagekit.files.delete(fileId);
  } catch (error) {
    console.log("ImageKit delete error:", error.message);
  }
};

module.exports = { imagekit, uploadToImageKit, deleteFromImageKit };