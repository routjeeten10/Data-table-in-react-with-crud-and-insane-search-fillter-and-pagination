import React, { useEffect, useRef, useState } from 'react'

const DataTable = () => {
    const [formdate, setFormDate] = useState({name:"",gender:"",age:"",});
    const [data,setData] = useState([]);
    const [editId, setEditId] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1)
    const outsdieClick = useRef(false);
    const Itemperpage = 5;
    const IndexOfLastItem = currentPage * Itemperpage;
    const IndexOfFirstItem = IndexOfLastItem - Itemperpage
    let filteredItems = data.filter((item) => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    const filteredData = filteredItems.slice(IndexOfFirstItem,IndexOfLastItem)

    useEffect(() => {
        setCurrentPage(1); 
    }, [searchTerm])
    

    useEffect(() => {
        if(!editId) return;

        let selectedItem = document.querySelectorAll(`[id='${editId}']`);
        selectedItem[0].focus();
      
    }, [editId])

    useEffect(()=>{
        const handleClickOutside = (event) =>{
            if(outsdieClick.current && !outsdieClick.current.contains(event.target)){
                setEditId(false)
            }

        }
        document.addEventListener("click",handleClickOutside)

        return () => {
            document.removeEventListener("click",handleClickOutside)
        };

    },[])
    

    //input chnage function
    const handleInputChange = (e) =>{
        setFormDate({...formdate,[e.target.name]:e.target.value})//

    }
    // console.log(formdate);

    //handleadd button function
    const handleAddClick = () => {
        if (formdate.name && formdate.gender && formdate.age){
            const newItem = {
                id:Date.now(),
                name:formdate.name,
                gender:formdate.gender,
                age:formdate.age,
            };
            setData([...data,newItem]);
            setFormDate({name:"",gender:"",age:""})
        }
    }
    // console.log(data);

    //handle Delete functionality
    const handleDelete = (id) =>{

        if(filteredData.length === 1 && currentPage !== 1){
            setCurrentPage((prev) => prev - 1)
        } //this  logic is writen for not geting stuck in any particular pagination deleted whenever some pagination get deleted it will be redirected  to the previous page

        const updatedList = data.filter((item) => item.id !== id)
        setData(updatedList);

    }
    //handle Edit function
    const handleEdit =(id,updatedData) =>{
        if(!editId || edit !== id){
            return
        }

        const updatedList = data.map((item) =>
            item.id === id ? {...item,...updatedData} : item
        );
        setData(updatedList);
        
    }
    // console.log(data);

    //handleSearch
    const handleSearch = (e) =>{
        setSearchTerm(e.target.value);
    }

    //handle paginate button
    const paginate = (pageNumber) =>{
        setCurrentPage(pageNumber)
    }
   
  return (
    <div className='container'>
        <div className="add-container">
            <div className="info-container">
                <input type="text"
                 placeholder='Name'
                 name='name'
                 value={formdate.name}
                 onChange={handleInputChange}
                 />
                <input type="gender"
                 name='gender'
                 placeholder='Gender'
                 value={formdate.gender}
                 onChange={handleInputChange}
                 />
                <input type="text"
                 name='age'
                 placeholder='Age'
                 value={formdate.age}
                 onChange={handleInputChange}
                 />
                
            </div>

            <button className='add' onClick={handleAddClick}>Add</button>
        </div>

        <div className="search-table-container" >
            <input type="text" 
            placeholder='search by name'
            value={searchTerm}
            onChange={handleSearch}
            className='search-input'
            />

            <table ref={outsdieClick}>
                {/* this ref will be help us to detect the table click or not */}
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Gender</th>
                        <th>Name</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        filteredData.map((item) => (
                     <tr key={item.id}>
                        <td id={item.id} contentEditable={editId === item.id} 
                        onBlur={(e)=> handleEdit(item.id,{name:e.target.innerText})}
                        >{item.name}</td>
                        <td id={item.id} contentEditable={editId === item.id}
                        onBlur={(e)=> handleEdit(item.id,{gender:e.target.innerText})}
                        >{item.gender}</td>
                        <td id={item.id} contentEditable={editId === item.id}
                        onBlur={(e)=> handleEdit(item.id,{age:e.target.innerText})}
                        >{item.age}</td>
                        <td className='action'>
                            <button className='edit' onClick={() => setEditId(item.id)}>Edit</button>
                            <button className='delete' onClick={()=>handleDelete(item.id)}>Delete</button>
                        </td>
                    </tr> 

                        ))
                    }
                </tbody>
            </table>
            <div className="pagination">
                {Array.from({length: Math.ceil(filteredItems.length / Itemperpage)},(_,index) => (
                    <button key={index+1} onClick={() => paginate(index+1)} style={
                        {backgroundColor: currentPage === index+1 && "lightgreen"}}
                        >{index+1}
                    </button>

                ))}

            </div>

        </div>
    </div>
  )
}

export default DataTable