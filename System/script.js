// Wait for the DOM to fully load
document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle Functionality
    const themeToggleBtn = document.querySelector('.theme-toggle-btn');
    const body = document.querySelector('body');
    
    // Check if there's a saved theme in localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        enableDarkMode();
    }
    
    // Toggle theme when the button is clicked
    themeToggleBtn.addEventListener('click', function() {
        if (body.classList.contains('dark-mode')) {
            disableDarkMode();
        } else {
            enableDarkMode();
        }
    });
    
    function enableDarkMode() {
        body.classList.add('dark-mode');
        themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
        localStorage.setItem('theme', 'dark');
    }
    
    function disableDarkMode() {
        body.classList.remove('dark-mode');
        themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', 'light');
    }
    
    // Mobile Navigation Toggle
    const menuToggleBtn = document.createElement('button');
    menuToggleBtn.classList.add('menu-toggle-btn');
    menuToggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
    document.querySelector('.top-bar').prepend(menuToggleBtn);
    
    menuToggleBtn.addEventListener('click', function() {
        const sidebar = document.querySelector('.sidebar');
        sidebar.classList.toggle('show-sidebar');
        body.classList.toggle('sidebar-shown');
        
        // Update the icon based on sidebar state
        if (sidebar.classList.contains('show-sidebar')) {
            menuToggleBtn.innerHTML = '<i class="fas fa-times"></i>';
        } else {
            menuToggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(event) {
        const sidebar = document.querySelector('.sidebar');
        const menuBtn = document.querySelector('.menu-toggle-btn');
        
        if (window.innerWidth < 992) {
            if (!sidebar.contains(event.target) && !menuBtn.contains(event.target)) {
                sidebar.classList.remove('show-sidebar');
                body.classList.remove('sidebar-shown');
                menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
        }
    });
    
    // Also close sidebar when clicking on overlay
    document.addEventListener('click', function(event) {
        if (body.classList.contains('sidebar-shown') && 
            !document.querySelector('.sidebar').contains(event.target) && 
            !document.querySelector('.menu-toggle-btn').contains(event.target)) {
            body.classList.remove('sidebar-shown');
            document.querySelector('.sidebar').classList.remove('show-sidebar');
            document.querySelector('.menu-toggle-btn').innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
    
    // Add active class to current page link
    const currentLocation = window.location.href;
    const menuLinks = document.querySelectorAll('.nav-menu a');
    
    menuLinks.forEach(link => {
        if (currentLocation.includes(link.href)) {
            link.parentElement.classList.add('active');
        }
    });
    
    // Add click event to menu links to close sidebar on mobile when clicked
    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth < 992) {
                document.querySelector('.sidebar').classList.remove('show-sidebar');
                body.classList.remove('sidebar-shown');
                document.querySelector('.menu-toggle-btn').innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    });
    
    // Dropdown Menu for Shipments
    const shipmentDropdown = document.querySelector('.dropdown-toggle');
    if (shipmentDropdown) {
        shipmentDropdown.addEventListener('click', function(e) {
            e.preventDefault();
            const parent = this.parentElement;
            parent.classList.toggle('dropdown-active');
        });

        // Handle URL parameters for shipment status filter
        const urlParams = new URLSearchParams(window.location.search);
        const status = urlParams.get('status');
        const currentFilterElement = document.getElementById('currentFilter');
        
        if (status) {
            // Set the shipment menu to be open by default if status is set
            shipmentDropdown.parentElement.classList.add('dropdown-active');
            
            // Set active class for the appropriate dropdown item
            const dropdownLinks = document.querySelectorAll('.dropdown-menu a');
            dropdownLinks.forEach(link => {
                if (link.href.includes(`status=${status}`)) {
                    link.parentElement.classList.add('active');
                    
                    // Update the filter display
                    if (currentFilterElement) {
                        switch(status) {
                            case 'new':
                                currentFilterElement.textContent = 'New Shipments';
                                break;
                            case 'instock':
                                currentFilterElement.textContent = 'In Stock Shipments';
                                break;
                            case 'delivered':
                                currentFilterElement.textContent = 'Delivered to Agent';
                                break;
                            default:
                                currentFilterElement.textContent = 'All Shipments';
                        }
                    }
                }
            });
        }
    }

    // Multi-select functionality for tables
    const selectAllCheckbox = document.getElementById('selectAll');
    const rowCheckboxes = document.querySelectorAll('.row-checkbox');
    const bulkActionsDiv = document.getElementById('bulkActions');
    const selectedCountSpan = document.getElementById('selectedCount');

    if (selectAllCheckbox && rowCheckboxes.length > 0) {
        // Select all checkbox functionality
        selectAllCheckbox.addEventListener('change', function() {
            const isChecked = this.checked;
            
            rowCheckboxes.forEach(checkbox => {
                checkbox.checked = isChecked;
            });
            
            updateBulkActionsVisibility();
        });
        
        // Individual row checkbox functionality
        rowCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                // If any checkbox is unchecked, uncheck the "select all" checkbox
                if (!this.checked) {
                    selectAllCheckbox.checked = false;
                } else {
                    // Check if all checkboxes are checked
                    const allChecked = Array.from(rowCheckboxes).every(cb => cb.checked);
                    selectAllCheckbox.checked = allChecked;
                }
                
                updateBulkActionsVisibility();
            });
        });
        
        // Update bulk actions panel visibility
        function updateBulkActionsVisibility() {
            const checkedCount = document.querySelectorAll('.row-checkbox:checked').length;
            
            if (checkedCount > 0) {
                bulkActionsDiv.style.display = 'flex';
                selectedCountSpan.textContent = `${checkedCount} selected`;
            } else {
                bulkActionsDiv.style.display = 'none';
            }
        }
        
        // Bulk action buttons functionality
        const bulkActionButtons = document.querySelectorAll('.bulk-action-btn');
        bulkActionButtons.forEach(button => {
            button.addEventListener('click', function() {
                const action = this.id || this.classList[2];
                const selectedIds = [];
                
                // Get all checked rows
                rowCheckboxes.forEach(checkbox => {
                    if (checkbox.checked) {
                        // Get shipment ID from the row
                        const shipmentId = checkbox.closest('tr').children[1].textContent;
                        selectedIds.push(shipmentId);
                    }
                });
                
                // In a real application, this would trigger an API call
                console.log(`Performing ${action} on: `, selectedIds);
                
                // Show a simple alert for demonstration
                alert(`${action} would be performed on ${selectedIds.length} items: ${selectedIds.join(', ')}`);
            });
        });
    }
    
    // Simulate loading data or API calls
    function initializeDashboard() {
        // Here you would typically make API calls to get real data
        console.log('Dashboard initialized');
        
        // For demo purposes, we'll simulate a simple chart in the activity area
        const chartPlaceholder = document.querySelector('.chart-placeholder');
        if (chartPlaceholder) {
            // In a real app, you would use a chart library like Chart.js
            setTimeout(() => {
                chartPlaceholder.innerHTML = `
                    <svg width="100%" height="200" viewBox="0 0 800 200">
                        <polyline 
                            fill="none" 
                            stroke="#1a73e8" 
                            stroke-width="3" 
                            points="0,180 100,120 200,160 300,80 400,100 500,60 600,40 700,90 800,20"
                        />
                        <circle cx="100" cy="120" r="6" fill="#1a73e8"/>
                        <circle cx="200" cy="160" r="6" fill="#1a73e8"/>
                        <circle cx="300" cy="80" r="6" fill="#1a73e8"/>
                        <circle cx="400" cy="100" r="6" fill="#1a73e8"/>
                        <circle cx="500" cy="60" r="6" fill="#1a73e8"/>
                        <circle cx="600" cy="40" r="6" fill="#1a73e8"/>
                        <circle cx="700" cy="90" r="6" fill="#1a73e8"/>
                    </svg>
                    <p>Last 7 days activity</p>
                `;
            }, 1000);
        }
    }
    
    // Call the initialization function
    initializeDashboard();
    
    // Handle window resize to adjust layout accordingly
    window.addEventListener('resize', function() {
        const sidebar = document.querySelector('.sidebar');
        if (window.innerWidth >= 992) {
            sidebar.classList.remove('show-sidebar');
            body.classList.remove('sidebar-shown');
            document.querySelector('.menu-toggle-btn').innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
    
    // Tab functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    if (tabButtons.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                tabButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                button.classList.add('active');
                
                // Here you would typically filter content based on the selected tab
                console.log(`Tab ${button.textContent} selected`);
                
                // For demonstration purposes only, we'll just show an alert
                // In a real application, you would filter the data
                // showFilteredShipments(button.textContent.toLowerCase());
            });
        });
    }
    
    // Zone interaction functionality
    const zoneItems = document.querySelectorAll('.zone-item');
    if (zoneItems.length > 0) {
        zoneItems.forEach(item => {
            item.addEventListener('click', () => {
                // Remove active class from all zone items
                zoneItems.forEach(zone => zone.classList.remove('active'));
                // Add active class to clicked zone item
                item.classList.add('active');
                
                // Here you would typically center the map on the selected zone
                // and highlight it on the map
                const zoneName = item.querySelector('h4').textContent;
                console.log(`Zone ${zoneName} selected`);
            });
        });
    }
    
    // Settings navigation functionality
    const settingsNavItems = document.querySelectorAll('.settings-nav-item');
    if (settingsNavItems.length > 0) {
        settingsNavItems.forEach(item => {
            item.addEventListener('click', () => {
                // Remove active class from all settings nav items
                settingsNavItems.forEach(navItem => navItem.classList.remove('active'));
                // Add active class to clicked settings nav item
                item.classList.add('active');
                
                // Here you would typically show the corresponding settings panel
                const settingType = item.querySelector('span').textContent;
                console.log(`${settingType} settings selected`);
                
                // You would load/show the correct settings panel here
                // For demonstration, we're just logging to console
            });
        });
    }
    
    // Reports date filter functionality
    const filterOptions = document.querySelectorAll('.filter-option');
    if (filterOptions.length > 0) {
        filterOptions.forEach(option => {
            option.addEventListener('click', () => {
                // Remove active class from all filter options
                filterOptions.forEach(opt => opt.classList.remove('active'));
                // Add active class to clicked filter option
                option.classList.add('active');
                
                // Here you would typically update the report data based on the selected date range
                const dateRange = option.textContent;
                console.log(`Date range changed to: ${dateRange}`);
                
                // For a real application, you would make an API call to get data for the selected range
                // and then update the charts and statistics
                if (dateRange === 'Custom') {
                    // Show a date picker for custom range
                    console.log('Custom date range selected, would show date picker here');
                    // In a real app, you would show a date range picker here
                }
            });
        });
    }
}); 