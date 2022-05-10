import './App.css';
import {useState, useEffect} from 'react'
import {Table, TableBody, Button} from '@mui/material'
import { TableRow } from '@mui/material';
import { TableCell } from '@mui/material';
import { TableHead } from '@mui/material';
import { TextField } from '@mui/material';

function App() {

  const [patients, setPatients] = useState([
    {
      "id": 1,
      "firstname": "John",
      "lastname": "Smith",
      "birthdate": "1940-02-02T00:00:00Z",
      "status": "OPEN"
    },
    {
      "id": 2,
      "firstname": "Peter",
      "lastname": "Smith",
      "birthdate": "1928-02-02T00:00:00Z",
      "status": "OPEN"
    },
    {
      "id": 3,
      "firstname": "John",
      "lastname": "Carlson",
      "birthdate": "1930-02-02T00:00:00Z",
      "status": "SUBMITTED"
    },
    {
      "id": 4,
      "firstname": "Daniel",
      "lastname": "Smith",
      "birthdate": "1942-02-02T00:00:00Z",
      "status": "OPEN"
    },
    {
      "id": 5,
      "firstname": "John",
      "lastname": "Tucker",
      "birthdate": "1932-02-02T00:00:00Z",
      "status": "OPEN"
    },
    {
      "id": 6,
      "firstname": "John",
      "lastname": "Johnson",
      "birthdate": "1951-02-02T00:00:00Z",
      "status": "SUBMITTED"
    },
    {
      "id": 7,
      "firstname": "Carl",
      "lastname": "Carlson",
      "birthdate": "1949-02-02T00:00:00Z",
      "status": "OPEN"
    },
    {
      "id": 8,
      "firstname": "Peter",
      "lastname": "Johnson",
      "birthdate": "1940-02-02T00:00:00Z",
      "status": "OPEN"
    },
    {
      "id": 9,
      "firstname": "Steven",
      "lastname": "Smith",
      "birthdate": "1920-02-02T00:00:00Z",
      "status": "OPEN"
    },
    {
      "id": 10,
      "firstname": "John",
      "lastname": "Stevenson",
      "birthdate": "1921-02-02T00:00:00Z",
      "status": "SUBMITTED"
    }
  ]);
  const [searchValue, setSearchValue] = useState("");
  const [sortArray, setSortArray] = useState([]);

  const updatePatients = async () => {
    fetch("https://c9ee-2a03-4000-65-fdf-28b7-92ff-fe63-4b2b.eu.ngrok.io/patients")
      .then((response) => response.json())
      .then((json) => {setPatients(json);})
      .catch(err => {throw new Error(err)});
  }

  useEffect(() => {
    //updatePatients();
    return () => {};
  }, []);

  const changeStatus = (id, status) => {
    let url = "https://c9ee-2a03-4000-65-fdf-28b7-92ff-fe63-4b2b.eu.ngrok.io/patients/"+id;
    status === "OPEN" ? url+= "/submit" : url+= "/open";
    fetch(url, {method: 'POST'})
      .then(updatePatients())
      .catch(err => {throw new Error(err)});
  }

  function updateFilterArray(filter) {
    if (sortArray.length > 0 && sortArray[0].value === filter) {
      let sortArrayBuffer = [...sortArray];
      sortArrayBuffer[0].ascending = !sortArrayBuffer[0].ascending;
      setSortArray(sortArrayBuffer);
    } else {
      setSortArray([{value: filter, ascending: true}, ...sortArray])
    };
  }

  function getFilteredPatients() {
    return patients
      .filter((patient) => {return (patient.firstname+patient.lastname).includes(searchValue)})
      .sort((a, b) => {
        for(var i = 0; i<sortArray.length; i++) {
          if (a[sortArray[i].value] != b[sortArray[i].value]) {
            if (sortArray[i].ascending) return a[sortArray[i].value] > b[sortArray[i].value];
            else return a[sortArray[i].value] < b[sortArray[i].value]
          }
        }
      });
  }

  function getAgeFromBirthday(birthday) {
    return Math.floor((Date.now() - new Date(birthday))/(1000*60*60*24*365));
  }

  return (
    <div className="App">
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell onClick={()=>updateFilterArray("firstname")}>firstname</TableCell>
            <TableCell onClick={()=>updateFilterArray("lastname")}>lastname</TableCell>
            <TableCell align="right" onClick={()=>updateFilterArray("birthdate")}>age</TableCell>
            <TableCell align="right" onClick={()=>updateFilterArray("status")}>Status</TableCell>
            <TableCell>changeStatus</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {getFilteredPatients().map(patient => (
            <TableRow key={patient.id}>
              <TableCell>{patient.firstname}</TableCell>
              <TableCell>{patient.lastname}</TableCell>
              <TableCell align="right">{getAgeFromBirthday(patient.birthdate)}</TableCell>
              <TableCell align="right">{patient.status}</TableCell>
              <TableCell>
                <Button
                  variant={patient.status === "OPEN" ? "contained" : "outlined"}
                  onClick={() => changeStatus(patient.id, patient.status)}>{patient.status === "OPEN" ? "submit" : "revert"}</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TextField value={searchValue} onChange={(e) => setSearchValue(e.target.value)} id="outlined-search" label="Search field" type="search" />
    </div>
  );
}

export default App;
