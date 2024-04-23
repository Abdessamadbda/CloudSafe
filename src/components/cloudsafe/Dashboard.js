import React from "react"
import { Container } from "react-bootstrap"
import { useFolder } from "../../hooks/useFolder"
import AddFolderButton from "./AddFolderButton"
import AddFileButton from "./AddFileButton"
import Folder from "./Folder"
import File from "./File"
import Navbar from "./Navbar"
import FolderBreadcrumbs from "./FolderBreadcrumbs"
import { useParams, useLocation } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faShare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { storage, database } from "../../firebase";

export default function Dashboard() {
  const { folderId } = useParams()
  const { state = {} } = useLocation()
  const { folder, childFolders, childFiles } = useFolder(folderId, state.folder)
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
    <>
      <Navbar />
      <Container fluid>
        <div className="d-flex align-items-center">
          <FolderBreadcrumbs currentFolder={folder} />
          <AddFileButton currentFolder={folder} />
          <AddFolderButton currentFolder={folder} />
        </div>
        {childFolders.length > 0 && (
          <div className="d-flex flex-wrap">
            {childFolders.map(childFolder => (
              <div
                key={childFolder.id}
                style={{ maxWidth: "250px" }}
                className="p-2"
              >
                <Folder folder={childFolder} />
              </div>
            ))}
          </div>
        )}
        {childFolders.length > 0 && childFiles.length > 0 && <hr />}
        {childFiles.length > 0 && (
          <div className="d-flex flex-wrap">
            {childFiles.map(childFile => (
              <div
                key={childFile.id}
                style={{ maxWidth: "250px" }}
                className="p-2"
              >
<File file={childFile} key={childFile.id} />
                <div className="file-actions">
        <FontAwesomeIcon
          icon={faDownload}
          onClick={() => handleDownload(childFile,childFile.id, childFile.name)}
          className="action-icon"
        />
        <FontAwesomeIcon
          icon={faShare}
          onClick={() => handleShare(childFile,childFile.id)}
          className="action-icon"
        />
        <FontAwesomeIcon
          icon={faTrash}
          onClick={() => handleDelete(childFile,childFile.id, childFile.name)}
          className="action-icon"
        />
      </div>
              </div>
              
            ))}
          </div>
        )}
      </Container>
    </>
  )
}
