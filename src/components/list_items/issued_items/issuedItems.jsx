import React, { useState, useEffect } from 'react';
import axios from 'axios';

const IssuedItems = () => {
  const [issuedItemsList, setIssuedItemsList] = useState([]);
  const [ expandedItem, setExpandedItem] = useState(null)

  useEffect(() => {  
    const fetchIssuedItems = async () => {
      try {
        const response = await axios.get('http://localhost:5000/issued-items');
        setIssuedItemsList(response.data);
      } catch (error) {
        console.error('Error fetching issued items List', error);
      }
    };
    fetchIssuedItems();
  }, []);

  const handleIssueItemClick = (item)=>{
    setExpandedItem(expandedItem=== item ? null :item)
  };

  return (
    <div className="max-width:100% mx-auto p-6 bg-white rounded-md shadow-md">
      <h2 className="text-3xl font-semibold mb-6  text-gray-800">
       Issued Items List
      </h2>
      {issuedItemsList.length === 0 ? (
        <p className="text-gray-600 text-center">No items have been issued for now</p>
      ) : (
        <ul className="space-y-4">
          {issuedItemsList.map((item, index) => (
            <li
              key={index}
              className="p-4 border rounded-md shadow-sm hover:shadow-md transition-shadow duration-300"
              onClick={()=> handleIssueItemClick(item)}
            >
              <div className="flex flex-col space-y-2">
                <span className="font-medium text-gray-700">
                  Item Name: {item.ItemName}
                </span>
                <span className="text-gray-600">
                  Issued To: {item.IssuedTo}
                </span>
                {expandedItem === item && (<><span className="text-gray-600">
                  Issuer Name: {item.IssuerName}
                </span>
                <span className="text-gray-600">
                  Quantity: {item.QuantityIssued}
                </span>
                <span className="text-gray-600">
                  Issue Date: {new Date(item.IssueDate).toLocaleDateString()}
                </span>
                {item.Description && (
                  <span className="text-gray-600">
                    Description: {item.Description}...
                  </span>
                )}</>)}
                
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default IssuedItems;