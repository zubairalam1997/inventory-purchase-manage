-- Create the IssueItems table

CREATE TABLE IF NOT EXISTS IssuedItems (
    IssueID CHAR(36) PRIMARY KEY, -- UUID for uniqueness
    ItemID INT NOT NULL, -- Foreign key reference to Items table
    ItemName VARCHAR(255) NOT NULL,
    Description TEXT,
    IssuerName VARCHAR(255) NOT NULL,
    IssuedTo VARCHAR(255) NOT NULL,
    IssueDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    QuantityIssued INT NOT NULL,
    FOREIGN KEY (ItemID) REFERENCES Items(ItemID) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS ChatMessages (
    MessageID INT AUTO_INCREMENT PRIMARY KEY,
    RoomID VARCHAR(36) ,
    SenderID INT NOT NULL,
    Message TEXT,
    FilePath VARCHAR(255),
    Timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (SenderID) REFERENCES Employees(EmployeeID)
);

CREATE TABLE IF NOT EXISTS ChatRooms (
    RoomID VARCHAR(36) PRIMARY KEY,
    RoomName VARCHAR(255) NOT NULL
);
