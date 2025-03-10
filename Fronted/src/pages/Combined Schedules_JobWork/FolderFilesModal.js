import React from 'react';
import Modal from 'react-bootstrap/Modal';

export default function FolderFilesModal({ openfileModal, setOpenFileModal, files }) {
  return (
    <div>
      <Modal show={openfileModal} onHide={() => setOpenFileModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: '14px' }}>Files</Modal.Title>
        </Modal.Header>
        <Modal.Body>
  <div>
    {files?.length === 0 ? (
      <p>No DWGs to show</p>
    ) : (
      <ol>
        {files?.map((file, index) => (
          <li key={index}>
            <a href={file.url} target="_blank" rel="noopener noreferrer">
              {file.name}
            </a>
          </li>
        ))}
      </ol>
    )}
  </div>
</Modal.Body>

      </Modal>
    </div>
  );
}
