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
            description: document.getElementById('productDescription').value,
            location: document.getElementById('productLocation').value
        };
        
        this.inventory.push(product);
        this.saveToLocalStorage();
        this.renderInventory();
        this.updateDashboard();
        this.form.reset();
    }
    
    renderInventory() {
        this.inventoryList.innerHTML = '';
        
        if (this.inventory.length === 0) {
            this.inventoryList.innerHTML = '<p>No products in the inventory</p>';
            return;
        }
        
        this.inventory.forEach(product => {
            const item = document.createElement('div');
            item.className = 'inventory-item';
            item.innerHTML = `
                <h3>${product.name}</h3>
                <p><strong>Quantity:</strong> ${product.quantity}</p>
                <p><strong>Price:</strong> $${product.price.toFixed(2)}</p>
                <p><strong>Category:</strong> ${product.section}</p>
                <p><strong>Location:</strong> ${product.location}</p>
                <p><strong>Description:</strong> ${product.description}</p>
                <button class="delete-btn">Delete</button>
            `;
            this.inventoryList.appendChild(item);
        });
        
        // Attach delete buttons' event listeners after inventory is rendered
        const deleteButtons = document.querySelectorAll('.delete-btn');
        deleteButtons.forEach((button, index) => {
            button.addEventListener('click', () => this.deleteProduct(this.inventory[index].id));
        });
    }
    
    deleteProduct(id) {
        this.inventory = this.inventory.filter(product => product.id !== id);
        this.saveToLocalStorage();
        this.renderInventory();
        this.updateDashboard();
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