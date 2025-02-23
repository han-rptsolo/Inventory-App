class InventoryManager {
    constructor() {
        this.inventory = JSON.parse(localStorage.getItem('inventory')) || [];
        this.form = document.getElementById('inventoryForm');
        this.inventoryList = document.getElementById('inventoryList');
        
        this.initializeEventListeners();
        this.renderInventory();
        this.updateDashboard();
    }
    
    initializeEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleFormSubmit(e));
    }
    
    handleFormSubmit(e) {
        e.preventDefault();
        
        const product = {
            id: Date.now(),
            name: document.getElementById('productName').value,
            quantity: parseInt(document.getElementById('productQuantity').value),
            price: parseFloat(document.getElementById('productPrice').value),
            section: document.getElementById('productSection').value,
            
            location: document.getElementById('productLocation').value
            description: document.getElementById('productDescription').value,
        };
        
        this.inventory.push(product);
        this.saveToLocalStorage();
        this.renderInventory();
        this.updateDashboard();
        this.form.reset();
    }
    
    renderInventory() {
        this.inventoryList.innerHTML = ''; // Clear the inventory list
        
        this.inventory.forEach((product) => {
            const item = document.createElement('div');
            item.className = 'inventory-item';
            item.innerHTML = `
                <h3>${product.name}</h3>
                <p><strong>Quantity:</strong> ${product.quantity}</p>
                <p><strong>Price:</strong> $${product.price.toFixed(2)}</p>
                <p><strong>Category:</strong> ${product.section}</p>
                <p><strong>Location:</strong> ${product.location}</p>
                <p><strong>Description:</strong> ${product.description}</p>
                <button class="delete-btn" data-id="${product.id}">Delete</button>
            `;
            this.inventoryList.appendChild(item);
        });
    
        // Attach event listeners to each delete button AFTER rendering the inventory
        const deleteButtons = document.querySelectorAll('.delete-btn');
        deleteButtons.forEach((button) => {
            button.addEventListener('click', (e) => {
                const productId = e.target.getAttribute('data-id'); // Get the product ID from the button's data-id
                this.deleteProduct(productId); // Pass the product ID to the delete function
            });
        });
    }
    
    deleteProduct(id) {
        this.inventory = this.inventory.filter(product => product.id !== parseInt(id)); // Filter out the product by ID
        this.saveToLocalStorage(); // Update localStorage
        this.renderInventory(); // Re-render the inventory list after deletion
        this.updateDashboard(); // Update the dashboard after deletion
    }
    
    updateDashboard() {
        // Update total products
        document.getElementById('totalProduct').textContent = this.inventory.length;
        
        // Update total quantity
        const totalQuantity = this.inventory.reduce((sum, product) => sum + product.quantity, 0);
        document.getElementById('totalQuantity').textContent = totalQuantity;
        
        // Update low stock items (items with quantity < 5)
        const lowStockCount = this.inventory.filter(product => product.quantity < 5).length;
        document.getElementById('lowStockItem').textContent = lowStockCount;
    }
    
    saveToLocalStorage() {
        localStorage.setItem('inventory', JSON.stringify(this.inventory));
    }
}

// Initialize the Inventory Manager
const inventoryManager = new InventoryManager();