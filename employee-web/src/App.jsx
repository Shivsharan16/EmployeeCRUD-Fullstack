import { useState, useMemo, useEffect } from "react";
import { useTable, useGlobalFilter, useSortBy, usePagination } from "react-table";
import './App.css';
import axios from "axios";

function App() {
  const [employees, setEmployees] = useState([]);
  const columns = useMemo(() => [
    { Header: "EmployeeId", accessor: "employeeId" },
    { Header: "Name", accessor: "name" },
    { Header: "Manager", accessor: "manager" },
    { Header: "Salary", accessor: "salary" },
    {
      Header: "Edit", id: "Edit", accessor: "Edit",
      Cell: props => (<button className='editBtn' onClick={() => handleUpdate(props.cell.row.original)}>Edit</button>)
    },
    {
      Header: "Delete", id: "Delete", accessor: "delete",
      Cell: props => (<button className='deleteBtn' onClick={() => handleDelete(props.cell.row.original)}>Delete</button>)
    }
  ], []);

  const data = useMemo(() => employees, [employees]);
  const [employeeData, setEmployeeData] = useState({ name: "", manager: "", salary: "" });
  const { getTableProps, getTableBodyProps, headerGroups, page, prepareRow, state, setGlobalFilter, pageCount, nextPage, previousPage, canNextPage, canPreviousPage, gotoPage } = useTable({ columns, data: employees, initialState: { pageSize: 5 } }, useGlobalFilter, useSortBy, usePagination);
  const [showCancel, setShowCancel] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const { globalFilter, pageIndex } = state;

  const getAllEmployees = () => {
    axios.get("http://localhost:8085/employee").then((res) => {
      console.log(res.data);
      setEmployees(res.data);
    });
  };

  const handleUpdate = (emp) => {
    setEmployeeData(emp);
    setShowCancel(true);
  };

  const clearAll = () => {
    setEmployeeData({ name: "", manager: "", salary: "" });
    getAllEmployees();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errorMsg = "";
    if (!employeeData.name || !employeeData.manager || !employeeData.salary) {
      errorMsg = "All fields are required!";
      setErrMsg(errorMsg);
    }
    if ((errorMsg.length === 0) && employeeData.employeeId) {
      await axios.patch(`http://localhost:8085/employee/${employeeData.employeeId}`, employeeData).then((res) => {
        console.log(res.data);

      });
    } else if (errorMsg.length === 0) {
      await axios.post("http://localhost:8085/employee", employeeData).then((res) => {
        console.log(res.data);

      });
    }
    clearAll();
  };

  const handleCancel = () => {
    setEmployeeData({ name: "", manager: "", salary: "" });
    setShowCancel(false);
  };

  const handleChange = (e) => {

    setEmployeeData({ ...employeeData, [e.target.name]: e.target.value });
    setErrMsg("");
  };

  const handleDelete = async (emp) => {
    const isConfirmed = window.confirm("Are you sure you want to delete?");
    if (isConfirmed) {
      await axios.delete(`http://localhost:8085/employee/${emp.employeeId}`).then((res) => {
        console.log(res.data);
        setEmployees(res.data);
      });
    }
    //window.location.reload();
  };


  useEffect(() => {
    getAllEmployees();
  }, []);

  return (
    <>
      <div className='main-container'>
        <h3> Full stack Application using React, Spring Boot, and PostgreSQL.</h3>
        {errMsg && <span className='error'>{errMsg}</span>}
        <div className='add-panel'>
          <div className='addpaneldiv'>
            <label htmlFor="name">Name</label><br />
            <input className='addpanelinput' value={employeeData.name} type="text" onChange={handleChange} name="name" id="name" />
          </div>
          <div className='addpaneldiv'>
            <label htmlFor="manager">Manager</label><br />
            <input className='addpanelinput' value={employeeData.manager} onChange={handleChange} type="text" name="manager" id="manager" />
          </div>
          <div className='addpaneldiv'>
            <label htmlFor="salary">Salary</label><br />
            <input className='addpanelinput' value={employeeData.salary} type="text" onChange={handleChange} name="salary" id="salary" />
          </div>
          <button className='addBtn' onClick={handleSubmit}>{employeeData.employeeId ? "Update" : "Add"}</button>
          <button className='cancelBtn' disabled={!showCancel} onClick={handleCancel}>Cancel</button>
        </div>
        <input className='searchinput' value={globalFilter || ""} onChange={(e) => setGlobalFilter(e.target.value)} type="search" name="inputsearch" id="inputsearch" placeholder='Search employee here' />
      </div>
      <table className='table' {...getTableProps()}>
        <thead>
          {headerGroups.map((hg) => (
            <tr {...hg.getHeaderGroupProps()} key={hg.id}>
              {hg.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())} key={column.id}>{column.render("Header")}
                  {column.isSorted && <span> {column.isSortedDesc ? " " : " "}</span>}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} key={row.id}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()} key={cell.id}>{cell.render("Cell")}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className='pagediv'>
        <button disabled={!canPreviousPage} className='pageBtn'>First</button>
        <button disabled={!canPreviousPage} className='pageBtn' onClick={previousPage}>Prev</button>
        <span className="idx">{pageIndex + 1} of {pageCount}</span>
        <button disabled={!canNextPage} className='pageBtn' onClick={nextPage}>Next</button>
        <button disabled={!canNextPage} className='pageBtn' onClick={() => gotoPage(pageCount - 1)}>Last</button>
      </div>
    </>
  );
}

export default App;
