import { Card } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import ProgressBar from "react-bootstrap/ProgressBar";
import axios from "axios";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import { useState, useEffect } from "react";

function App() {
  const [start, setStart] = useState(false);
  const [exportModal, setExportModal] = useState(false);
  const [uploadModal, setUploadModal] = useState(false);
  const [progressBar, setProgressBar] = useState(0);
  const [uploadForm, setUploadForm] = useState({
    myFile: "",
    fileName: "",
  });
  const [scanFile, setScanFile] = useState();
  const [myFiles, setMyFiles] = useState([]);
  const [toastShow, setToastShow] = useState(false);
  const [disableButton, setDisableButton] = useState(false);
  const [totalData, setTotalData] = useState(0);
  const [currentData, setCurrentData] = useState(1);
  const [allPhone, setAllPhone] = useState([]);

  const uploadFunction = async (e) => {
    e.preventDefault();
    setDisableButton(true);
    const formData = new FormData();
    formData.append("file", uploadForm.myFile);
    formData.append("fileName", uploadForm.fileName);
    try {
      const axiosInstance = axios.create({
        baseURL: `http://localhost:${process.env.REACT_APP_API}/`,
      });
      const res = await axiosInstance.post("/upload", formData, {
        onUploadProgress: (data) => {
          setProgressBar(Math.round((100 * data.loaded) / data.total));
        },
      });
      console.log(res);
    } catch (ex) {
      console.log(ex);
    }
    setUploadForm({
      myFile: "",
      fileName: "",
    });
    setProgressBar(0);
    updateMyFilesList();
    setDisableButton(false);
  };

  const exportData = async () => {
    await fetch(`http://localhost:${process.env.REACT_APP_API}/export`);
  };

  const handleScan = async (e) => {
    e.preventDefault();
    for (let i = 0; i <= 25; i++) {
      setTimeout(() => {
        setProgressBar(Math.floor(100 * i) / 25);
      }, (i + 1) * 1000);
    }
    setDisableButton(true);
    setToastShow(true);
    const myFile = JSON.parse(scanFile);
    const myFileName = myFile.fileName;
    const response = await fetch(
      `http://localhost:${process.env.REACT_APP_API}/open/${myFileName}`
    ).then((res) => res.json());
    const newData = response.message;
    const myPOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fileName: myFileName,
      }),
    };
    const myPrevious = await fetch(
      `http://localhost:${process.env.REACT_APP_API}/all`,
      myPOptions
    ).then((res) => res.json());
    const myContinue = [];
    for (let i = 0; i < myPrevious.length; i++) {
      myContinue.push("+" + myPrevious[i].phoneNumber);
    }
    setTotalData(newData.length);
    setToastShow(true);
    const getResponse = async (api, num) => {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: num,
          api,
        }),
      };
      const res = await fetch(
        `http://localhost:${process.env.REACT_APP_API}/scan`,
        options
      ).then((res) => res.json());
      console.log("SHOULD INCREMENT");
      const myMessage = res.message;
      const myoptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: myFileName,
          phone: myMessage.phone,
          result: myMessage.result,
        }),
      };
      await fetch(
        `http://localhost:${process.env.REACT_APP_API}/save`,
        myoptions
      );
    };
    // Save response in array
    const saveResponse = async (n, curr, num, api) => {
      setTimeout(() => {
        getResponse(api, num);
        setCurrentData(curr);
      }, (n + 1) * 4000);
    };

    // Iterate data and save responses
    let k = 0;
    let l = 0;
    for (let i = 0, j = 0; i < newData.length; i += 2, j++) {
      if (myContinue.includes(newData[i])) {
        continue;
      }
      k = k + 2;
      l = l + 1;
      let curr = i;
      saveResponse(k, curr, newData[i], process.env.REACT_APP_API1);
      if (i + 1 < newData.length) curr = i + 1;
      saveResponse(l, curr, newData[i + 1], process.env.REACT_APP_API2);
    }
  };

  const updateMyFilesList = async () => {
    const res = await fetch(
      `http://localhost:${process.env.REACT_APP_API}/files`
    ).then((res) => res.json());
    setMyFiles(res.message);
  };

  const updateMyPhoneList = async () => {
    const res = await fetch(
      `http://localhost:${process.env.REACT_APP_API}/all`
    ).then((res) => res.json());
    setAllPhone(res);
  };

  useEffect(() => {
    updateMyFilesList();
    updateMyPhoneList();
  }, []);

  return (
    <>
      <ToastContainer className="p-3" position={"bottom-end"}>
        <Toast show={toastShow}>
          <Toast.Header>
            <strong className="me-auto">Progress</strong>
            <small>Now</small>
          </Toast.Header>
          <Toast.Body>
            {currentData} of {totalData}
          </Toast.Body>
        </Toast>
      </ToastContainer>
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
                {allPhone.map((phone, index) => (
                  <tr key={index.toString() + "phones"}>
                    <td>{phone.phoneNumber}</td>
                    <td>{phone.isActive ? "True" : "False"}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </div>
      <Modal show={start}>
        <Modal.Header closeButton onHide={() => setStart(false)}>
          <Modal.Title>Start</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleScan}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Select File</Form.Label>
              <Form.Select
                value={scanFile}
                onChange={(e) => setScanFile(e.target.value)}
                disabled={disableButton}
              >
                <option>Select File...</option>
                {myFiles.map((myFile, index) => (
                  <option key={index} value={JSON.stringify(myFile)}>
                    {myFile.fileName}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <ProgressBar now={progressBar} label={"Starting"} />
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              disabled={disableButton}
              onClick={() => setStart(false)}
            >
              Close
            </Button>
            <Button variant="primary" type="submit" disabled={disableButton}>
              Start Scan
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      <Modal show={exportModal}>
        <Modal.Header closeButton onHide={() => setExportModal(false)}>
          <Modal.Title>Export Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure about exporting all records?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setExportModal(false)}
            disabled={disableButton}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() =>
              window.location.replace(
                `http://localhost:${process.env.REACT_APP_API}/export`
              )
            }
            disabled={disableButton}
          >
            Export
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={uploadModal}>
        <Modal.Header closeButton onHide={() => setUploadModal(false)}>
          <Modal.Title>Upload File</Modal.Title>
        </Modal.Header>
        <Form encType="multipart/form-data" onSubmit={uploadFunction}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Select File</Form.Label>
              <Form.Control
                type="file"
                name="myFile"
                onChange={(e) =>
                  setUploadForm({ ...uploadForm, myFile: e.target.files[0] })
                }
                accept=".csv"
                disabled={disableButton}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>File Name</Form.Label>
              <Form.Control
                type="text"
                name="fileName"
                onChange={(e) =>
                  setUploadForm({ ...uploadForm, fileName: e.target.value })
                }
                value={uploadForm.fileName}
                placeholder="Enter File Name"
                disabled={disableButton}
              />
            </Form.Group>
            <ProgressBar now={progressBar} />
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                setUploadModal(false);
                setUploadForm({
                  myFile: "",
                  fileName: "",
                });
              }}
              disabled={disableButton}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={disableButton}>
              Upload
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default App;
