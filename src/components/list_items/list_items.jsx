import React, { useState, useEffect , useContext} from 'react';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; 
import { AuthContext  } from ".././context/AuthContext";

function List() {
  const [listItems, setListItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [expandedItem, setExpandedItem] = useState(null); // Track expanded item
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [issueFormData, setIssueFormData] = useState(
    {
      itemName: '',
      description: '',
      issuerName: '',
      issuedTo: '',
      issueDate: '',
      quantityIssued: '',
    }
  );
  
  const { user, logout } = useContext(AuthContext );
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/items');
        setListItems(response.data);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const results = listItems.filter((item) => {
      const searchString = `${item.ItemName} ${item.Description} ${item.storeName} ${item.SupplierName} ${item.locationRack} ${item.storedBy}`.toLowerCase();
      return searchString.includes(searchTerm.toLowerCase());
    });
    setFilteredItems(results);
  }, [searchTerm, listItems]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  const handleAddItemClick = ()=>{
    navigate('/addItems')
  }
  const handleItemClick = (item)=>{
    setExpandedItem(expandedItem=== item ? null :item)
  };

  const handleIssueClick = (item) => {
    console.log('Issue clicked for item:', item.ItemID);
    setIssueFormData({
      itemID:item.ItemID,
      itemName: item.ItemName,
      description: item.Description,
      issuerName: '',
      issuedTo: '',
      issueDate: new Date().toISOString().split('T')[0],
      quantityIssued: '',
    });
    setShowIssueModal(true);
    // Implement your logic for issuing an item here
  };
  const handleIssueSubmit= async()=>{
    try{
      axios.post('http://localhost:5000/issue-item',issueFormData);
      alert('Item issued successfully!');
      setShowIssueModal(false);
      navigate('/issued-items')
    }catch (error) {
      console.error('Error issuing item:', error);
      alert('Failed to issue item.');
    }

  }

  // const handleRaiseMissingClick = (item) => {
  //   console.log('Raise Missing clicked for item:', item);
  //   // Implement your logic for raising a missing item here
  // };

  const handleDeleteClick = async (item) => {
    console.log('Delete clicked for item:', item.ItemID);
    try {
      await axios.delete(`http://localhost:5000/items/${item.ItemID}`);
      alert("This will delete the entry permanently.");
      // Refresh the item list after successful deletion
      fetchData(); // Now fetchData is in scope
      setExpandedItem(null);
    } catch (error) {
      console.error("Error in deleting the item:", error);
      alert("failed to delete the item.");
    }
    // Implement your logic for deleting an item here
  };
  
  // Helper function to refetch data
  const fetchData = async () => { // fetchData is defined here
    try {
      const response = await axios.get('http://localhost:5000/items');
      setListItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };


  return (
    <div className="max-width:100% mx-auto p-6 bg-white rounded-md shadow-md">
      <h2 className="text-3xl font-semibold mb-6  text-gray-800">
        Items List
      </h2>
      <div className="flex items-center mb-4"> {/* Flex container */}
      <div className="relative w-3/4  mb-4"> {/* Reduced width and centered */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="text-gray-400" /> {/* Search icon */}
        </div>
        <input
          type="text"
          placeholder="Search items..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>
      <div className="btn mb-4 p-1"><button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
      onClick={handleAddItemClick} >
          Add Items +
        </button></div>
        </div>
      <ul className="space-y-4">
        {filteredItems.map((item, index) => (
          <li
            key={index}
            className="p-4 border rounded-md shadow-sm hover:shadow-md transition-shadow duration-300"
            onClick={() => handleItemClick(item)}
          >
            <div className="flex flex-col space-y-2">
              <span className="font-medium text-gray-700">
                Item Name: {item.ItemName}
              </span>
              <span className="text-gray-600">
                Description: {item.Description.substring(0, 50)}...
              </span>
              {expandedItem === item && ( // Conditional rendering
                <>
                <span className="text-gray-600">
                Supplier Name: {item.SupplierName}
              </span>
              <span className="text-gray-600">
                Store Name: {item.storeName}
              </span>
              
              <span className="text-gray-600">
                Location Rack: {item.locationRack}
              </span>
              <span className="text-gray-600">
                Stored By ID: {item.storedBy}
              </span>
              <div className="flex space-x-2 mt-2"> {/* Added a flex container for the buttons */}
                    <button
                      className="bg-green-600 hover:bg-yellow-700 text-white text-sm font-bold py-1 px-2 rounded"
                      onClick={() => handleIssueClick(item)}
                    >
                      Issue Item -
                    </button>
                    
                    <button
                      className="bg-orange-500 hover:bg-orange-700 text-white text-sm font-bold py-1 px-2 rounded"
                      onClick={() => navigate("/chat-room")}
                    >
                      Raise Missing
                    </button>
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-1 px-2 rounded"
                      onClick={() => handleDeleteClick(item)}
                    >
                      Delete
                    </button>
                  </div>
              </>
              )}
            </div>
          </li>
        ))}
      </ul>
      {showIssueModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-md">
            <h2 className="text-xl font-semibold mb-4">Issue Item</h2>
            <label className="block">Issuer Name:</label>
            <input type="text" className="border p-2 w-full" value={issueFormData.issuerName} onChange={(e) => setIssueFormData({ ...issueFormData, issuerName: e.target.value })} />

            <label className="block mt-2">Issued To:</label>
            <input type="text" className="border p-2 w-full" value={issueFormData.issuedTo} onChange={(e) => setIssueFormData({ ...issueFormData, issuedTo: e.target.value })} />

            <label className="block mt-2">Quantity Issued:</label>
            <input type="number" className="border p-2 w-full" value={issueFormData.quantityIssued} onChange={(e) => setIssueFormData({ ...issueFormData, quantityIssued: e.target.value })} />

            <button className="bg-blue-500 text-white px-4 py-2 mt-4 rounded" onClick={handleIssueSubmit}>
              Submit
            </button>
            <button className="bg-red-500 text-white px-4 py-2 mt-4 ml-2 rounded" onClick={() => setShowIssueModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default List;