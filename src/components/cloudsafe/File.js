import { faFile,faImage,faVideo } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"
import { faDownload, faShare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { storage, database } from "../../firebase";
export default function File({ file }) {
  const getFileExtension = (filename) => {
    return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
  };
  async function handleDownload(file, fileId, fileName) {
    try {
      const url = await storage.refFromURL(`${file.url}`).getDownloadURL();
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  }

  async function handleShare(file,fileId) {
    try {
      const url = await storage.refFromURL(`${file.url}`).getDownloadURL();
      // Implement logic to generate shareable link (e.g., copy to clipboard)
      // eslint-disable-next-line no-restricted-globals
      alert(`Shareable link: ${url}`);
    } catch (error) {
      console.error("Error sharing file:", error);
    }
  }

  async function handleDelete(file,fileId, fileName) {
    try {
      await database.files.doc(fileId).delete();
      await storage.ref(`${file.url}`).delete();
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  }
  return (
    <div className="text-truncate w-100 border rounded d-block p-2"
    >
    <a
      href={file.url}
      target="_blank"
    >
      {getFileExtension(file.name) === "jpg" ||
              getFileExtension(file.name) === "png" ? (
                <FontAwesomeIcon icon={faImage} className="file-icon" />
              ) : getFileExtension(file.name) === "mp4" ? (
                <FontAwesomeIcon icon={faVideo} className="file-icon" />
              ) : (
                <FontAwesomeIcon icon={faFile} className="file-icon" />
              )}
      <span className="ml-2">{file.name}</span></a>
      <FontAwesomeIcon
      icon={faDownload}
      onClick={() => handleDownload(file, file.id, file.name)}
      className="ml-4 mr-2 cursor-pointer"
    />
    <FontAwesomeIcon
      icon={faShare}
      onClick={() => handleShare(file, file.id)}
      className="mr-2 cursor-pointer"
    />
    <FontAwesomeIcon
      icon={faTrash}
      onClick={() => handleDelete(file, file.id, file.name)}
      className="cursor-pointer"
    />
    </div>
  )
}
