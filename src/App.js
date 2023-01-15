import { Card } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import ProgressBar from "react-bootstrap/ProgressBar";
import { useState } from "react";

function App() {
  const [start, setStart] = useState(false);
  const [exportModal, setExportModal] = useState(false);
  const [uploadModal, setUploadModal] = useState(false);
  return (
    <>
      <Navbar bg="light" className="p-3">
        <Navbar.Brand>Data Vendor</Navbar.Brand>
      </Navbar>
      <div className="p-3">
        <Card className="mb-3">
          <Card.Header>Home</Card.Header>
          <Card.Body>
            <Card.Title>Home</Card.Title>
            <hr />
            <Button className="me-3" onClick={() => setStart(true)}>
              Start
            </Button>
            <Button className="me-3" onClick={() => setUploadModal(true)}>
              Upload
            </Button>
            <Button className="me-3" onClick={() => setExportModal(true)}>
              Export
            </Button>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <Card.Title>Phone Number List</Card.Title>
            <Table striped hover>
              <thead>
                <tr>
                  <th>Phone Number</th>
                  <th>Availibility</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>+923134386826</td>
                  <td>True</td>
                </tr>
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </div>
      <Modal show={start}>
        <Modal.Header closeButton onHide={() => setStart(false)}>
          <Modal.Title>Start</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Select File</Form.Label>
              <Form.Select>
                <option>Select File...</option>
              </Form.Select>
            </Form.Group>
            <ProgressBar now={60} />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setStart(false)}>
            Close
          </Button>
          <Button variant="primary">Start Scan</Button>
        </Modal.Footer>
      </Modal>
      <Modal show={exportModal}>
        <Modal.Header closeButton onHide={() => setExportModal(false)}>
          <Modal.Title>Export Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure about exporting all records?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setExportModal(false)}>
            Cancel
          </Button>
          <Button variant="primary">Export</Button>
        </Modal.Footer>
      </Modal>
      <Modal show={uploadModal}>
        <Modal.Header closeButton onHide={() => setUploadModal(false)}>
          <Modal.Title>Upload File</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Select File</Form.Label>
              <Form.Control type="file" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>File Name</Form.Label>
              <Form.Control type="text" placeholder="Enter File Name" />
            </Form.Group>
            <ProgressBar now={60} />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setUploadModal(false)}>
            Cancel
          </Button>
          <Button variant="primary">Upload</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default App;
