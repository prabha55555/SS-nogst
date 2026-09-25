// PDF generation functionality
class PDFGenerator {
    // Generate PDF for printing
    static async generatePDF() {
        if (!Utils.validateForm()) {
            return;
        }

        const invoiceData = Utils.getFormData();
        await PDFGenerator.createPDFWindow(invoiceData, 'print');
    }


    // Add this method to get return details for PDF
    static async getReturnDetailsForPDF(invoiceNo) {
        try {
            const returns = await db.getReturnsByInvoice(invoiceNo);
            return returns;
        } catch (error) {
            console.error('Error getting return details for PDF:', error);
            return [];pur
        }
    }

    static generateCombinedHTMLContent(invoiceData, totalReturns, adjustedBalanceDue, returnDetails) {
        const htmlOriginal = PDFGenerator.generateHTMLContent(invoiceData, totalReturns, adjustedBalanceDue, returnDetails, 'ORIGINAL');
        const htmlCopy = PDFGenerator.generateHTMLContent(invoiceData, totalReturns, adjustedBalanceDue, returnDetails, 'COPY');
        const copyBodyMatch = htmlCopy.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
        const copyBody = copyBodyMatch ? copyBodyMatch[1] : '';
        return htmlOriginal.replace('</body>', '<div style="page-break-before: always;"></div>' + copyBody + '</body>');
    }

    // Save as PDF file
    static async saveAsPDF() {
        if (!Utils.validateForm()) {
            return;
        }

        const invoiceData = Utils.getFormData();

        // Show loading indicator
        PDFGenerator.showLoading(true);

        try {
            // For Electron environment
            if (window.electronAPI) {
                const totalReturns = await Utils.calculateTotalReturns(invoiceData.invoiceNo);
                const adjustedBalanceDue = invoiceData.balanceDue - totalReturns;
                const returnDetails = await PDFGenerator.getReturnDetailsForPDF(invoiceData.invoiceNo);
                const htmlContent = PDFGenerator.generateCombinedHTMLContent(invoiceData, totalReturns, adjustedBalanceDue, returnDetails);

                const result = await window.electronAPI.savePDF(htmlContent, `Invoice_${invoiceData.invoiceNo}.html`);

                if (result.success) {
                    PDFGenerator.showNotification('Invoice saved successfully! Open the file and use "Print > Save as PDF"', 'success');
                } else {
                    throw new Error(result.error || 'Failed to save invoice');
                }
            } else {
                // For browser environment - use the print dialog method
                await PDFGenerator.createPDFWindow(invoiceData, 'save');
            }
        } catch (error) {
            console.error('Save error:', error);
            PDFGenerator.showNotification('Error: ' + error.message, 'error');

            // Fallback to print method
            await PDFGenerator.createPDFWindow(invoiceData, 'save');
        } finally {
            PDFGenerator.showLoading(false);
        }
    }

    // Create PDF window for both print and save
    static async createPDFWindow(invoiceData, action = 'print') {
        const totalReturns = await Utils.calculateTotalReturns(invoiceData.invoiceNo);
        const adjustedBalanceDue = invoiceData.balanceDue - totalReturns;

        // Get return details for the PDF
        const returnDetails = await PDFGenerator.getReturnDetailsForPDF(invoiceData.invoiceNo);

        // Create a new window for PDF
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            // If popup is blocked, show instructions
            PDFGenerator.showNotification('Popup blocked! Please allow popups and try again, or use Ctrl+P to print.', 'error');
            return;
        }

        const htmlContent = PDFGenerator.generateCombinedHTMLContent(invoiceData, totalReturns, adjustedBalanceDue, returnDetails);

        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.focus();

        // Wait for content to load
        setTimeout(() => {
            if (action === 'print') {
                printWindow.print();
            } else {
                // For browser save as PDF
                printWindow.document.title = `Invoice_${invoiceData.invoiceNo}`;
                printWindow.print();
            }

            // Close window after print dialog (with delay)
            setTimeout(() => {
                if (!printWindow.closed) {
                    printWindow.close();
                }
            }, 1000);
        }, 1000);
    }

    // Show loading indicator
    static showLoading(show) {
        let loader = document.getElementById('pdfLoading');
        if (!loader && show) {
            loader = document.createElement('div');
            loader.id = 'pdfLoading';
            loader.innerHTML = `
                <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 9999;">
                    <div style="background: white; padding: 20px; border-radius: 8px; text-align: center;">
                        <div style="margin-bottom: 10px;">Generating Invoice...</div>
                        <div style="border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; width: 30px; height: 30px; animation: spin 1s linear infinite; margin: 0 auto;"></div>
                    </div>
                </div>
                <style>
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                </style>
            `;
            document.body.appendChild(loader);
        } else if (loader && !show) {
            loader.remove();
        }
    }

    // Show notification
    static showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.pdf-notification');
        existingNotifications.forEach(notification => notification.remove());

        const notification = document.createElement('div');
        notification.className = 'pdf-notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'error' ? '#e74c3c' : type === 'success' ? '#27ae60' : '#3498db'};
            color: white;
            border-radius: 5px;
            z-index: 10000;
            font-family: Arial, sans-serif;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            max-width: 400px;
            word-wrap: break-word;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }


    // Add this method to PDFGenerator class
    static getImageBase64() {
        // Replace this with your actual base64 encoded image
        return 'data:image/png;base64,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'; // Your full base64 string here
    }


    // Update the generateHTMLContent method - REPLACE the entire method with this:
    static generateHTMLContent(invoiceData, totalReturns = 0, adjustedBalanceDue = 0, returnDetails = [], copyType = 'BOTH') {
        // Convert image to base64 or use simple text replacement
        const hasImage = PDFGenerator.checkImageExists();

        return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>SS ${invoiceData.invoiceNo}</title>
            <meta name="viewport" content="width=1024">
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    margin: 0;
                    padding: 40px;
                    background: #fff;
                    position: relative;
                    color: #333;
                }
                .invoice-container {
                    position: relative;
                    z-index: 2;
                }
                /* Watermark */
                body::before {
                    content: "SS ${invoiceData.invoiceNo}";
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) rotate(-45deg);
                    font-size: 75px;
                    color: rgba(200, 200, 200, 0.15);
                    font-weight: 900;
                    white-space: pre;
                    text-align: center;
                    pointer-events: none;
                    z-index: 0;
                }
                /* Header */
                .invoice-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    border-bottom: 2px solid #444;
                    padding-bottom: 15px;
                    margin-bottom: 25px;
                }
                .company-info {
                    flex: 1;
                    text-align: left;
                }
                .company-logo {
                    flex: 1;
                    text-align: center;
                    max-width: 180px;
                    height: auto;
                }
                .logo-placeholder {
                    width: 90px;
                    height: 90px;
                    background: #f0f0f0;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    border: 1px solid #ccc;
                    font-size: 12px;
                    color: #666;
                }
                .invoice-title {
                    flex: 1;
                    text-align: right;
                }
                .company-details h2 {
                    margin: 0;
                    color: #2c3e50;
                    font-size: 18px;
                }
                .company-details p {
                    margin: 3px 0;
                    font-size: 11px;
                }
                .invoice-title h2 {
                    margin: 0;
                    color: #2c3e50;
                    font-size: 16px;
                    text-transform: uppercase;
                }
                .invoice-title div {
                    font-size: 14px;
                    margin-top: 4px;
                }
                /* Billing Info */
                .billing-info {
                    margin-bottom: 20px;
                }
                .bill-to {
                    border: 1px solid #555;
                    padding: 6px 10px;
                    border-radius: 6px;
                    background: #f4f4f4;
                    font-weight: 600;
                    color: #222;
                    line-height: 1.3;
                }
                .bill-to h3 {
                    margin: 0 0 5px 0;
                    color: #111;
                    font-size: 14px;
                    font-weight: 700;
                    text-transform: uppercase;
                }
                .bill-to p {
                    margin: 2px 0;
                    font-size: 13px;
                    color: #111;
                    font-weight: 600;
                }
                /* Table */
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                }
                th, td {
                    border: 1px solid #ccc;
                    text-align: center;
                    padding: 8px;
                    font-size: 13px;
                }
                th {
                    background: wheat;
                    color: #1c1b1bff;
                }
                /* Return Table */
                .return-table {
                    margin-top: 20px;
                }
                .return-table h4 {
                    margin: 0 0 10px 0;
                    color: #2c3e50;
                    font-size: 14px;
                    text-align: center;
                    background: #fff4e6;
                    padding: 8px;
                    border-radius: 4px;
                    border-left: 4px solid #f39c12;
                }
                /* Payment Summary */
                .calculation-section {
                    margin-top: 25px;
                    display: flex;
                    justify-content: space-between;
                }
                .payment-calculation {
                    width: 300px;
                    border: 1px solid #ccc;
                    padding: 10px 15px;
                    border-radius: 8px;
                    background: #fdfdfd;
                }
                .payment-calculation h3 {
                    margin-top: 0;
                    text-align: center;
                    font-size: 15px;
                    font-weight: bold;
                    background: #2c3e50;
                    color: #fff;
                    padding: 5px 0;
                    border-radius: 6px;
                }
                .payment-row {
                    display: flex;
                    justify-content: space-between;
                    margin: 6px 0;
                    font-size: 13px;
                }
                .payment-row.total {
                    font-weight: bold;
                    border-top: 1px solid #333;
                    padding-top: 6px;
                }
                .amount-return {
                    color: #e74c3c;
                    font-weight: bold;
                }
                .amount-negative {
                    color: #111;
                    font-weight: bold;
                }
                .amount-positive {
                    color: #27ae60;
                    font-weight: bold;
                }
                /* Return Info Box */
                .return-box {
                    margin-top: 20px;
                    padding: 10px 15px;
                    background: #fff4e6;
                    border-left: 4px solid #f39c12;
                    font-size: 13px;
                    border-radius: 5px;
                }
                /* Signature Section */
                .signature-section {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 50px;
                    font-size: 12px;
                }
                /* Print-specific developer credit */
                .developer-credit-print {
                    text-align: center;
                    margin: 20px 0 10px;
                    font-size: 11px;
                    color: #666;
                    page-break-inside: avoid;
                }

                @media print {
                    .developer-credit-print {
                        position: relative;
                        bottom: auto;
                        right: auto;
                    }
                    
                    /* Hide the floating version in print */
                    .developer-credit {
                        display: none !important;
                    }
                }


                .signature-line {
                    border-top: 1px solid #333;
                    margin: 25px 0 5px;
                    width: 160px;
                }
                .declaration {
                    flex: 1;
                }
                .customer-signature, .company-signature {
                    text-align: center;
                    flex: 1;
                }
                @media print {
                    body {
                        margin: 0;
                        padding: 20px;
                    }
                    .no-print {
                        display: none !important;
                    }
                }
            </style>
        </head>
        <body>
            <div class="invoice-container">
                <!-- Header Section -->
                <div class="invoice-header">
                    <div class="company-info">
                        <div class="company-details">
                            <h2>SANTHAMANI TEXTILES</h2>

                            <p>No.16/1, 25A, Thirumalai Nagar South, 1st Street, TIRUPUR - 641 602. | <span style="white-space: nowrap;">CELL: 90872 93268</span></p>
                            
                        </div>
                    </div>
                    <div class="logo-container" style="flex: 1; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                        <div style="font-size: 11px; margin-bottom: 5px; font-weight: bold; white-space: nowrap;">ஸ்ரீ அங்காளம்மன் துணை</div>
                        <img src="${PDFGenerator.getImageBase64()}" alt="Santhamani Textiles Logo" style="max-width: 180px; height: auto;">
                    </div>
                    <div class="invoice-title">
                        <h2>ESTIMATED COPY <br><span style="font-size: 12px; color: #777;">(${copyType === 'BOTH' ? 'ORIGINAL' : copyType})</span></h2>
                        <div><strong>Invoice No:</strong> ${invoiceData.invoiceNo}</div>
                        <div><strong>Date:</strong> ${new Date(invoiceData.invoiceDate).toLocaleDateString('en-IN')}</div>
                    </div>
                </div>

                <!-- Billing Information -->
                <div class="billing-info">
                    <div class="bill-to">
                        <h3>BILL TO</h3>
                        <p>Name: ${invoiceData.customerName}</p>
                        <p>Address: ${invoiceData.customerAddress || '-'}</p>
                    </div>
                </div>

                <!-- Products Table -->
                <table>
                    <thead>
                        <tr>
                            <th style="width: 8%">S.No.</th>
                            <th style="width: 52%">Product Description</th>
                            <th style="width: 10%">Qty</th>
                            <th style="width: 15%">Rate (Rs.)</th>
                            <th style="width: 15%">Amount (Rs.)</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${invoiceData.products.map(product => `
                            <tr>
                                <td>${product.sno}</td>
                                <td>${product.description}</td>
                                <td>${product.qty}</td>
                                <td>${Utils.formatCurrency(product.rate)}</td>
                                <td>${Utils.formatCurrency(product.amount)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                ${totalReturns > 0 && returnDetails.length > 0 ? `
                <!-- Return Information Table -->
                <div class="return-table">
                    <h4>RETURN INFORMATION</h4>
                    <table>
                        <thead>
                            <tr>
                                <th style="width: 15%">Date</th>
                                <th style="width: 45%">Product</th>
                                <th style="width: 10%">Qty</th>
                                <th style="width: 15%">Rate (Rs.)</th>
                                <th style="width: 15%">Amount (Rs.)</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${returnDetails.map(returnItem => `
                                <tr>
                                    <td>${new Date(returnItem.returnDate).toLocaleDateString('en-IN')}</td>
                                    <td>${returnItem.description}</td>
                                    <td>${returnItem.qty}</td>
                                    <td>${Utils.formatCurrency(returnItem.rate)}</td>
                                    <td>${Utils.formatCurrency(returnItem.returnAmount)}</td>
                                </tr>
                            `).join('')}
                            <!-- Total Return Row -->
                            <tr style="background: #fff4e6; font-weight: bold;">
                                <td colspan="4" style="text-align: right;">Total Return Amount:</td>
                                <td>Rs. ${Utils.formatCurrency(totalReturns)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                ` : ''}

                <!-- Calculation Section -->
                <div class="calculation-section">
                    <div class="amount-in-words" style="flex: 1; margin-right: 20px; align-self: flex-end; padding: 15px; border: 1px solid #ccc; border-radius: 8px; background: #fdfdfd;">
                        <p style="margin: 0 0 5px 0; font-size: 13px;"><strong>Amount in words:</strong></p>
                        <p style="margin: 0 0 15px 0; font-size: 13px; font-style: italic;">${Utils.numberToWords(invoiceData.grandTotal)}</p>
                        <p style="margin: 0; font-weight: bold; font-size: 14px;">G-pay No : 90872 93268</p>
                    </div>
                    <div class="payment-calculation">
                        <h3>PAYMENT SUMMARY</h3>
                        <div class="payment-row">
                            <label>Subtotal:</label>
                            <span>Rs. ${Utils.formatCurrency(invoiceData.subtotal)}</span>
                        </div>
                        <div class="payment-row">
                            <label>Previous Balance:</label>
                            <span>Rs. ${Utils.formatCurrency(invoiceData.previousBalance || 0)}</span>
                        </div>
                        ${invoiceData.manualPreviousBalance ? `
                        <div class="payment-row">
                            <label>Opening Balance:</label>
                            <span>Rs. ${Utils.formatCurrency(invoiceData.manualPreviousBalance)}</span>
                        </div>
                        ` : ''}
                        <div class="payment-row total">
                            <label>Total Amount:</label>
                            <span>Rs. ${Utils.formatCurrency(invoiceData.grandTotal)}</span>
                        </div>
                        
                        ${invoiceData.paymentBreakdown ? `
                        <!-- Multiple Payment Methods Breakdown -->
                        <div class="payment-row">
                            <label>Cash Paid:</label>
                            <span>Rs. ${Utils.formatCurrency(invoiceData.paymentBreakdown.cash || 0)}</span>
                        </div>
                        <div class="payment-row">
                            <label>UPI Paid:</label>
                            <span>Rs. ${Utils.formatCurrency(invoiceData.paymentBreakdown.upi || 0)}</span>
                        </div>
                        <div class="payment-row">
                            <label>Account Paid:</label>
                            <span>Rs. ${Utils.formatCurrency(invoiceData.paymentBreakdown.account || 0)}</span>
                        </div>
                        <div class="payment-row total-paid">
                            <label>Total Amount Paid:</label>
                            <span>Rs. ${Utils.formatCurrency(invoiceData.amountPaid)}</span>
                        </div>
                        ` : `
                        <!-- Fallback for old invoices without paymentBreakdown -->
                        <div class="payment-row">
                            <label>Amount Paid:</label>
                            <span>Rs. ${Utils.formatCurrency(invoiceData.amountPaid)}</span>
                        </div>
                        <div class="payment-row">
                            <label>Payment Method:</label>
                            <span style="font-weight: bold; ${invoiceData.paymentMethod === 'cash' ? 'color: #27ae60;' : 'color: #3498db;'}">
                                ${invoiceData.paymentMethod === 'cash' ? 'CASH' : (invoiceData.paymentMethod === 'gpay' ? 'GPAY' : 'ACCOUNT')}
                            </span>
                        </div>
                        `}
                        
                        ${totalReturns > 0 ? `
                        <div class="payment-row">
                            <label>Return Amount:</label>
                            <span class="amount-return">-Rs. ${Utils.formatCurrency(totalReturns)}</span>
                        </div>
                        ` : ''}
                        
                        <div class="payment-row" style="border-bottom: none; font-weight: bold; color: #111;">
                            <label>${totalReturns > 0 ? 'Adjusted Balance Due:' : 'Balance Due:'}</label>
                            <span class="${adjustedBalanceDue > 0 ? 'amount-negative' : 'amount-positive'}">
                                Rs. ${Utils.formatCurrency(totalReturns > 0 ? adjustedBalanceDue : invoiceData.balanceDue)}
                            </span>
                        </div>
                    </div>
                </div>

                ${totalReturns > 0 ? `
                <!-- Return Information Box -->
                <div class="return-box">
                    <strong>RETURN INFORMATION:</strong> This invoice has processed returns amounting to Rs. ${Utils.formatCurrency(totalReturns)}. 
                    The balance due has been adjusted accordingly.
                </div>
                ` : ''}

                <!-- Signature Section -->
                <div class="signature-section">
                    <div class="declaration">
                        <p>Certified that the particulars given above are true and correct</p>
                        <p>**TERMS & CONDITIONS APPLY</p>
                        <p>**E. & O.E.</p>
                    </div>
                    <div class="customer-signature">
                        <p>Agreed and accepted</p>
                        <p class="signature-line"></p>
                        <p>CUSTOMER SIGNATURE</p>
                    </div>
                    <div class="company-signature">
                        <p>For SANTHAMANI TEXTILES</p>
                        <p class="signature-line"></p>
                        <p>AUTHORIZED SIGNATORY</p>
                    </div>
                </div>

<div class="developer-credit-print" style="text-align: center; margin-top: 20px; font-size: 11px; color: #555; border-top: 2px dashed #eee; padding-top: 12px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <p style="margin: 3px 0;">
        Software created by <strong style="color: #2c3e50; font-size: 12px;">Sabarish R.</strong> 
        <span style="color: #ccc; margin: 0 5px;">|</span> 
        For custom billing solutions, contact: <strong style="color: #e74c3c; font-size: 12px;">7845081278</strong>
    </p>
</div>
            </div>
        </body>
        </html>
    `;
    }

    // Check if image exists
    static checkImageExists() {
        // Simple check - you can implement actual image checking if needed
        return false; // For now, we'll use placeholder
    }

    static async shareOnWhatsApp() {
        const invoiceData = Utils.getFormData();
        PDFGenerator.showLoading(true);

        try {
            const totalReturns = await Utils.calculateTotalReturns(invoiceData.invoiceNo);
            const adjustedBalanceDue = invoiceData.balanceDue - totalReturns;
            const returnDetails = await PDFGenerator.getReturnDetailsForPDF(invoiceData.invoiceNo);
            const htmlOriginal = PDFGenerator.generateHTMLContent(invoiceData, totalReturns, adjustedBalanceDue, returnDetails, 'ORIGINAL');

            // Create hidden iframe to render HTML for html2canvas
            const iframe = document.createElement('iframe');
            iframe.style.position = 'absolute';
            iframe.style.width = '1024px';
            iframe.style.height = '1448px'; // A4 proportion
            iframe.style.top = '-9999px';
            document.body.appendChild(iframe);
            
            // Initialize PDF
            const pdf = new jspdf.jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            
            // 1. Render Original
            iframe.contentDocument.open();
            iframe.contentDocument.write(htmlOriginal);
            iframe.contentDocument.close();
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            const canvasOriginal = await html2canvas(iframe.contentDocument.body, { scale: 2 });
            const imgDataOriginal = canvasOriginal.toDataURL('image/jpeg', 0.9);
            const imgHeightOriginal = (canvasOriginal.height * pdfWidth) / canvasOriginal.width;
            pdf.addImage(imgDataOriginal, 'JPEG', 0, 0, pdfWidth, imgHeightOriginal);
            

            // Output Blob
            const pdfBlob = pdf.output('blob');
            const file = new File([pdfBlob], `Invoice_${invoiceData.invoiceNo}.pdf`, { type: 'application/pdf' });
            
            document.body.removeChild(iframe);
            
            const phone = invoiceData.customerPhone ? invoiceData.customerPhone.replace(/[^0-9]/g, '') : '';

            if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                try {
                    // Share ONLY the PDF file without pre-filling text
                    await navigator.share({
                        files: [file]
                    });
                } catch (e) {
                    if (e.name !== 'AbortError') {
                        throw e;
                    }
                }
            } else {
                // Fallback for browsers that don't support file sharing (like Desktop)
                // Download the file directly
                pdf.save(`Invoice_${invoiceData.invoiceNo}.pdf`);
                PDFGenerator.showNotification('Direct PDF sharing is not supported on this device. The PDF has been downloaded. Opening WhatsApp now, please attach the PDF manually.', 'info');
                
                // Open WhatsApp chat
                setTimeout(() => {
                    if (phone) {
                        window.open(`https://wa.me/91${phone}`, '_blank');
                    } else {
                        window.open(`https://web.whatsapp.com/`, '_blank');
                    }
                }, 1500);
            }
        } catch (error) {
            console.error('Error sharing to WhatsApp:', error);
            Utils.showToast('Error', 'Failed to share via WhatsApp. ' + error.message, 'error');
        } finally {
            PDFGenerator.showLoading(false);
        }
    }
    static async shareStatementOnWhatsApp(invoiceNo) {
        try {
            PDFGenerator.showLoading(true);
            const invoiceData = await db.getInvoice(invoiceNo);

            if (!invoiceData) {
                Utils.showToast('Error', 'Invoice not found!', 'error');
                return;
            }

            // --- Data Preparation & Calculations ---
            const previousBalance = invoiceData.grandTotal - invoiceData.subtotal;
            const totalReturns = await Utils.calculateTotalReturns(invoiceNo);
            const adjustedBalanceDue = invoiceData.balanceDue - totalReturns;
            const returns = await db.getReturnsByInvoice(invoiceNo);
            const dateStr = new Date(invoiceData.invoiceDate).toLocaleDateString('en-IN');

            // Helper for currency - removes decimals for whole numbers to save space
            const fmt = (amt) => Math.round(amt) === amt ? amt : Utils.formatCurrency(amt);

            // --- Message Construction (Mobile Optimized Box Style) ---
            const line = "----------------------";

            // 1. Header
            let message = `*INVOICE STATEMENT*
*SANTHAMANI TEXTILES*


+${line}
� *INVOICE DETAILS*
+${line}
� No: ${invoiceData.invoiceNo}
� Date: ${dateStr}
+${line}\n\n`;

            // 2. Bill To (Customer)
            const custName = invoiceData.customerName.length > 20 ? invoiceData.customerName.substring(0, 20) + ".." : invoiceData.customerName;
            const custAddr = invoiceData.customerAddress ? (invoiceData.customerAddress.length > 20 ? invoiceData.customerAddress.substring(0, 20) + ".." : invoiceData.customerAddress) : 'Not specified';

            message += `+${line}
� *BILL TO*
+${line}
� ${custName}
� ${invoiceData.customerPhone || 'No Phone'}
� ${custAddr}
+${line}\n\n`;

            // 3. Product Details
            message += `+${line}
� *PRODUCT DETAILS*
+${line}\n`;

            invoiceData.products.forEach((p) => {
                message += `� ${p.description}
� ${p.qty} x Rs. ${fmt(p.rate)} = Rs. ${fmt(p.amount)}
+${line}\n`;
            });

            // 4. Returns (With Reasons)
            if (totalReturns > 0) {
                message += `� *RETURNED ITEMS*
+${line}\n`;
                returns.forEach((r) => {
                    message += `� ${r.description}
� ${r.qty} x Rs. ${fmt(r.rate)} = -Rs. ${fmt(r.returnAmount)}`;

                    if (r.reason) {
                        message += `\n� Rsn: ${r.reason}`;
                    }
                    message += `\n+${line}\n`;
                });
            }

            if (message.endsWith(`+${line}\n`)) {
                message = message.substring(0, message.lastIndexOf("+"));
                message += `+${line}\n\n`;
            } else {
                message += `+${line}\n\n`;
            }

            // 5. Account Summary (With Payment Breakdown)
            message += `+${line}
� *ACCOUNT SUMMARY*
+${line}
� Bill Amt:   Rs. ${fmt(invoiceData.subtotal)}
`;

            if (previousBalance > 0) {
                message += `� Prev Bal:   Rs. ${fmt(previousBalance)}\n`;
            }

            message += `� Total:      Rs. ${fmt(invoiceData.grandTotal)}\n`;

            if (totalReturns > 0) {
                message += `� Returns:   -Rs. ${fmt(totalReturns)}\n`;
            }

            message += `� Paid:       Rs. ${fmt(invoiceData.amountPaid)}\n`;

            // Payment Breakdown
            if (invoiceData.paymentBreakdown) {
                if (invoiceData.paymentBreakdown.cash > 0) message += `�  ?? Cash:   Rs. ${fmt(invoiceData.paymentBreakdown.cash)}\n`;
                if (invoiceData.paymentBreakdown.upi > 0) message += `�  ?? UPI:    Rs. ${fmt(invoiceData.paymentBreakdown.upi)}\n`;
                if (invoiceData.paymentBreakdown.account > 0) message += `�  ?? Acct:   Rs. ${fmt(invoiceData.paymentBreakdown.account)}\n`;
            }

            message += `� ${line}
� *DUE:       Rs. ${fmt(totalReturns > 0 ? adjustedBalanceDue : invoiceData.balanceDue)}*
+${line}\n`;

            // 6. Footer (Full Contact Info)
            message += `
??????????????????????
*CONTACT INFORMATION*
?? *SANTHAMANI TEXTILES*
?? Palladam
?? 90872 93268

_Automated invoice statement._`;

            // Append signature
            message += "\n\nSoftware created by Sabarish R.\nFor custom billing solutions, contact: 7845081278";
            const encodedMessage = encodeURIComponent(message);
            const phoneNumber = invoiceData.customerPhone ? invoiceData.customerPhone.replace(/[^0-9]/g, '') : '';
            let cleanPhone = phoneNumber;
            if (cleanPhone && !cleanPhone.startsWith('91') && cleanPhone.length === 10) {
                cleanPhone = '91' + cleanPhone;
            }

            try {
                await navigator.clipboard.writeText(message);
            } catch (err) {
                console.warn('Clipboard write failed:', err);
            }

            let whatsappUrl = cleanPhone ? `https://wa.me/${cleanPhone}?text=${encodedMessage}` : `https://web.whatsapp.com/send?text=${encodedMessage}`;
            const newWindow = window.open(whatsappUrl, '_blank');

            if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
                Utils.showToast('Success', 'Message copied! Popup blocked - please open WhatsApp manually and paste.', 'success');
            } else if (!cleanPhone) {
                Utils.showToast('Success', 'Message copied! If not auto-pasted, click in chat and press Ctrl+V.', 'success');
            }

        } catch (error) {
            console.error('Error sharing statement:', error);
            Utils.showToast('Error', 'Failed to share statement via WhatsApp. ' + error.message, 'error');
        } finally {
            PDFGenerator.showLoading(false);
        }
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function () {
    const generatePDFBtn = document.getElementById('generatePDF');
    const saveAsPDFBtn = document.getElementById('saveAsPDF');

    if (generatePDFBtn) {
        generatePDFBtn.addEventListener('click', PDFGenerator.generatePDF);
    }

    if (saveAsPDFBtn) {
        saveAsPDFBtn.addEventListener('click', PDFGenerator.saveAsPDF);
    }
});


