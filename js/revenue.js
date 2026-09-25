// js/revenue.js
class RevenueManager {
    constructor() {
        this.invoices = [];
        this.revenueData = [];
        this.init();
    }

    async init() {
        try {
            await db.ensureInitialized();
            await this.loadData();
            this.setupEventListeners();
        } catch (error) {
            console.error('Error initializing revenue manager:', error);
            document.getElementById('revenueTableBody').innerHTML = `
                <tr><td colspan="3" style="text-align:center; color:red;">Error loading revenue data.</td></tr>
            `;
        }
    }

    async loadData() {
        try {
            const invoicesSnapshot = await db.firestore.collection('invoices').get();
            const shortcutsSnapshot = await db.firestore.collection('shortcuts').get();

            const shortcutsMap = new Map();
            shortcutsSnapshot.forEach(doc => {
                const data = doc.data();
                // Map by full description to get the constant purchase rate
                if (data.fullDescription) {
                    const purchaseRate = parseFloat(data.purchaseRate || data.rateAmount || 0);
                    shortcutsMap.set(data.fullDescription.toLowerCase().trim(), purchaseRate);
                }
            });

            this.revenueData = [];
            
            invoicesSnapshot.forEach(doc => {
                const invoice = doc.data();
                let totalProfit = 0;
                
                if (invoice.products && Array.isArray(invoice.products)) {
                    invoice.products.forEach(product => {
                        const desc = (product.description || '').toLowerCase().trim();
                        const qty = parseFloat(product.qty || 0);
                        const actualSaleRate = parseFloat(product.rate || 0);
                        
                        // Note: revenue amount is based on actual bill sale rate - constant purchase rate
                        if (shortcutsMap.has(desc)) {
                            const purchaseRate = shortcutsMap.get(desc);
                            const unitProfit = actualSaleRate - purchaseRate;
                            totalProfit += (unitProfit * qty);
                        }
                    });
                }
                
                this.revenueData.push({
                    billNo: invoice.invoiceNo || 'N/A',
                    customerName: invoice.customerName || 'Unknown',
                    revenueAmount: totalProfit
                });
            });

            // Sort by Bill No descending
            this.revenueData.sort((a, b) => {
                return b.billNo.localeCompare(a.billNo, undefined, { numeric: true });
            });

            this.renderTable(this.revenueData);
        } catch (error) {
            console.error("Error loading data:", error);
            throw error;
        }
    }

    renderTable(data) {
        const tbody = document.getElementById('revenueTableBody');
        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;">No revenue data found.</td></tr>';
            const totalEl = document.getElementById('totalRevenueAmount');
            totalEl.textContent = '₹0.00';
            totalEl.style.color = '#333';
            return;
        }

        let totalRevenue = 0;
        tbody.innerHTML = data.map(item => {
            totalRevenue += item.revenueAmount;
            const textColor = item.revenueAmount >= 0 ? '#2e7d32' : '#d32f2f';
            return `
                <tr>
                    <td><a href="invoice-history.html?search=${item.billNo}" style="color: #2a5298; text-decoration: none; font-weight: bold;">${item.billNo}</a></td>
                    <td>${item.customerName}</td>
                    <td style="font-weight: bold; color: ${textColor};">₹${item.revenueAmount.toFixed(2)}</td>
                </tr>
            `;
        }).join('');

        const totalEl = document.getElementById('totalRevenueAmount');
        totalEl.textContent = `₹${totalRevenue.toFixed(2)}`;
        totalEl.style.color = totalRevenue >= 0 ? '#2e7d32' : '#d32f2f';
    }

    setupEventListeners() {
        document.getElementById('searchRevenue').addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            const filteredData = this.revenueData.filter(item => 
                item.billNo.toLowerCase().includes(query) || 
                item.customerName.toLowerCase().includes(query)
            );
            this.renderTable(filteredData);
        });
        
        // Mobile menu
        const menuToggle = document.getElementById('menuToggle');
        const menuPanel = document.getElementById('menuPanel');
        if (menuToggle && menuPanel) {
            menuToggle.addEventListener('click', () => {
                menuPanel.classList.toggle('menu-open');
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Auth check
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated || isAuthenticated !== 'true') {
        window.location.href = 'login.html';
        return;
    }
    
    window.revenueManager = new RevenueManager();
});
