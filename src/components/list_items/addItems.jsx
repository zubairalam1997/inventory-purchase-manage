import React , {useState} from "react";
import axios from 'axios'

const AddItems = ()=>{
    const [itemName, setItemtName] = useState('');
    const [description, setDescription] = useState('');
    const [storeName, setStoreName] = useState('');
    const [supplierName, setSupplierName] = useState('');
    const [locationRack, setLocationRack] = useState(''); //changed
    const [storedBy, setStoredBy] = useState(''); //changed

    
        

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/items", {
                itemName: itemName,
                description: description,
                storeName: storeName,
                supplierName: supplierName,
                locationRack: locationRack, //changed
                storedBy: storedBy //changed
            });
            setItemtName('');
            setDescription('');
            setStoreName('');
            setSupplierName('');
            setLocationRack(''); //changed
            setStoredBy(''); //changed
            alert("Item added successfully!");
        } catch (error) {
            console.error('Error adding product:', error);
            alert("Error adding item. Please check the console.");
        }
    };
    return(
        <div className="max-w-md mx-auto p-3 mt-2 bg-white rounded-md shadow-md">
      <h2 className="text-2xl font-semibold mb-2">Add Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Item Name:</label>
          <input
            type="text"
            value={itemName}
            onChange={(e) => setItemtName(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Store Name:</label>
          <input
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Supplier Name:</label>
          <input
            value={supplierName}
            onChange={(e) => setSupplierName(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Location or Rack number:</label>
          <input
            value={locationRack}
            onChange={(e) => setLocationRack(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Stored By:</label>
          <input
            value={storedBy}
            onChange={(e) => setStoredBy(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
        >
          Add Item
        </button>
      </form>
    </div>
    )
    };
export default AddItems