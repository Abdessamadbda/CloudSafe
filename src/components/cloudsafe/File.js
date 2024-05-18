import { faFile, faImage, faVideo } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useState } from "react"
import { faDownload, faShare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { storage, database } from "../../firebase";
import { Modal, Button } from "react-bootstrap"

export default function File({ file }) {
  const [open, setOpen] = useState(false);
  const [shareableLink, setShareableLink] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  function openModal() {
    setOpen(true)
  }

  function closeModal() {
    setOpen(false)
  }

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

  async function handleShare(file, fileId) {
    try {
      const url = await storage.refFromURL(`${file.url}`).getDownloadURL();
      setShareableLink(url);
    } catch (error) {
      console.error("Error sharing file:", error);
    }
  }

  async function handleDelete(file, fileId, fileName) {
    try {
      await database.files.doc(fileId).delete();
      await storage.ref(`${file.url}`).delete();
      setShowConfirmationModal(false);
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  }

  return (
    <div className="text-truncate w-100 border rounded d-block p-2" >
      <a href={file.url} target="_blank">
        {getFileExtension(file.name) === "jpg" || getFileExtension(file.name) === "png" ? (
          <FontAwesomeIcon icon={faImage} className="file-icon" />
        ) : getFileExtension(file.name) === "mp4" ? (
          <FontAwesomeIcon icon={faVideo} className="file-icon" />
        ) : (
          <FontAwesomeIcon icon={faFile} className="file-icon" />
        )}
        <span className="ml-2">{file.name}</span>
      </a>
      <FontAwesomeIcon
        icon={faDownload}
        onClick={() => handleDownload(file, file.id, file.name)}
        className="ml-5 mr-3"
        style={{ cursor: 'pointer' }}
      />
      <FontAwesomeIcon
        icon={faShare}
        onClick={openModal}
        className="mr-3"
        style={{ cursor: 'pointer' }}
      />
      <FontAwesomeIcon
        icon={faTrash}
        onClick={() => setShowConfirmationModal(true)}
        style={{ cursor: 'pointer' }}
      />

      {/* Delete Confirmation Modal */}
      <Modal show={showConfirmationModal} onHide={() => setShowConfirmationModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this file?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmationModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => handleDelete(file, file.id, file.name)}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Share Modal */}
      <Modal show={open} onHide={closeModal}>
        <Modal.Body>
          {shareableLink ? (
            <div className="w-full">
              <p>Shareable link:</p>
              <input
                type="text"
                value={shareableLink}
                readOnly
                className="w-full p-3 text-lg border border-gray-300 rounded mb-4 p-0 m-0"
                style={{ width: "100%" }}
              />
            </div>
          ) : (
            <p>No shareable link generated yet.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal} size="md">
            Close
          </Button>
          <Button variant="primary" onClick={() => handleShare(file)} size="md">
            Generate Shareable Link
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
