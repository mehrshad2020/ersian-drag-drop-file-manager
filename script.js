document.addEventListener('DOMContentLoaded', () => {
    // Sample files data (in a real app, this would come from a server)
    const filesData = [
        { id: 'file1', name: 'سند.pdf', type: 'pdf' },
        { id: 'file2', name: 'صفحه گسترده.xlsx', type: 'xlsx' },
        { id: 'file3', name: 'ارائه.pptx', type: 'pptx' },
        { id: 'file4', name: 'تصویر.jpg', type: 'jpg' },
        { id: 'file5', name: 'آرشیو.zip', type: 'zip' },
        { id: 'file6', name: 'یادداشت‌ها.txt', type: 'txt' },
        { id: 'file7', name: 'گزارش.docx', type: 'docx' },
        { id: 'file8', name: 'بودجه.xlsx', type: 'xlsx' },
        { id: 'file9', name: 'عکس تعطیلات.png', type: 'png' },
        { id: 'file10', name: 'قرارداد.pdf', type: 'pdf' },
        { id: 'file11', name: 'مستندات.docx', type: 'docx' },
        { id: 'file12', name: 'داده‌ها.xlsx', type: 'xlsx' }
    ];

    // Store deleted file IDs
    const trashBin = new Set();
    
    // Current view mode (grid or list)
    let currentView = 'grid';
    
    // Current search query
    let searchQuery = '';

    // DOM elements
    const filesContainer = document.getElementById('filesContainer');
    const trashBinElement = document.getElementById('trashBin');
    const searchInput = document.getElementById('searchInput');
    const viewButtons = document.querySelectorAll('.view-btn');

    // File icon SVGs
    const fileIcons = {
        pdf: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm10 5.5h1v-3h-1v3z" fill="currentColor"/></svg>',
        doc: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" fill="currentColor"/></svg>',
        docx: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" fill="currentColor"/></svg>',
        xls: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1.99 6H17L14.5 13.5 17 18h-2.99l-1.51-3-1.5 3H9l2.5-4.5L9 6h2.99l1.51 3 1.5-3h2.99l-2.49 4.5L17.99 9z" fill="currentColor"/></svg>',
        xlsx: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1.99 6H17L14.5 13.5 17 18h-2.99l-1.51-3-1.5 3H9l2.5-4.5L9 6h2.99l1.51 3 1.5-3h2.99l-2.49 4.5L17.99 9z" fill="currentColor"/></svg>',
        ppt: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4 6h-4v2h2c1.1 0 2 .9 2 2v2c0 1.1-.9 2-2 2h-4v-2h4v-2h-4V7h6v2z" fill="currentColor"/></svg>',
        pptx: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4 6h-4v2h2c1.1 0 2 .9 2 2v2c0 1.1-.9 2-2 2h-4v-2h4v-2h-4V7h6v2z" fill="currentColor"/></svg>',
        jpg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" fill="currentColor"/></svg>',
        jpeg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" fill="currentColor"/></svg>',
        png: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" fill="currentColor"/></svg>',
        txt: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zM16 18H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" fill="currentColor"/></svg>',
        zip: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-1 12H5V8h14v10z" fill="currentColor"/></svg>',
        rar: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-1 12H5V8h14v10z" fill="currentColor"/></svg>',
        default: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" fill="currentColor"/></svg>'
    };

    // Initialize the file system
    function initializeFileSystem() {
        renderFiles();
        setupTrashBinEvents();
        setupViewToggle();
        setupSearch();
    }

    // Render files in the container
    function renderFiles() {
        filesContainer.innerHTML = '';
        
        // Filter files based on search query and trash bin
        const filteredFiles = filesData.filter(file => {
            // Skip files that are in the trash bin
            if (trashBin.has(file.id)) {
                return false;
            }
            
            // Apply search filter if there's a query
            if (searchQuery && !file.name.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false;
            }
            
            return true;
        });
        
        // Apply current view class
        filesContainer.className = 'files-container';
        if (currentView === 'list') {
            filesContainer.classList.add('list-view');
        }
        
        // Show empty state if no files
        if (filteredFiles.length === 0) {
            showEmptyState();
        } else {
            // Add files to container
            filteredFiles.forEach(file => {
                const fileElement = createFileElement(file);
                filesContainer.appendChild(fileElement);
            });
        }
        
        // Setup drag events for the newly rendered files
        setupFileEvents();
    }
    
    // Show empty state
    function showEmptyState() {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        
        // Show different message based on search or if all files are deleted
        let message = '';
        if (searchQuery) {
            message = 'فایلی با این نام پیدا نشد';
            emptyState.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M0 0h24v24H0z" fill="none"/>
                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill="currentColor"/>
                </svg>
                <p>${message}</p>
            `;
        } else if (filesData.length === trashBin.size) {
            message = 'همه فایل‌ها در سطل زباله هستند';
            emptyState.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M0 0h24v24H0z" fill="none"/>
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/>
                </svg>
                <p>${message}</p>
            `;
        } else {
            message = 'هیچ فایلی وجود ندارد';
            emptyState.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M0 0h24v24H0z" fill="none"/>
                    <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z" fill="currentColor"/>
                </svg>
                <p>${message}</p>
            `;
        }
        
        filesContainer.appendChild(emptyState);
    }

    // Create a file element
    function createFileElement(file) {
        const fileElement = document.createElement('div');
        fileElement.className = 'file-item';
        fileElement.dataset.id = file.id;
        fileElement.dataset.type = file.type;
        fileElement.draggable = true;
        
        const iconType = fileIcons[file.type] || fileIcons.default;
        
        fileElement.innerHTML = `
            <div class="file-icon">${iconType}</div>
            <div class="file-name">${file.name}</div>
        `;
        
        return fileElement;
    }

    // Setup view toggle buttons
    function setupViewToggle() {
        viewButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                viewButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                // Update current view
                currentView = button.dataset.view;
                
                // Re-render files with new view
                renderFiles();
            });
        });
    }
    
    // Setup search functionality
    function setupSearch() {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.trim();
            renderFiles();
        });
    }

    // Setup drag and drop functionality - split into two functions
    function setupFileEvents() {
        // File drag events
        document.querySelectorAll('.file-item').forEach(file => {
            file.addEventListener('dragstart', handleDragStart);
            file.addEventListener('dragend', handleDragEnd);
        });
    }
    
    function setupTrashBinEvents() {
        // Trash bin drag events
        trashBinElement.addEventListener('dragover', handleDragOver);
        trashBinElement.addEventListener('dragleave', handleDragLeave);
        trashBinElement.addEventListener('drop', handleDrop);
    }

    // Handle drag start
    function handleDragStart(e) {
        this.classList.add('dragging');
        e.dataTransfer.setData('text/plain', this.dataset.id);
        e.dataTransfer.effectAllowed = 'move';
    }

    // Handle drag end
    function handleDragEnd(e) {
        this.classList.remove('dragging');
    }

    // Handle drag over
    function handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        this.classList.add('highlight');
    }

    // Handle drag leave
    function handleDragLeave(e) {
        this.classList.remove('highlight');
    }

    // Handle drop
    function handleDrop(e) {
        e.preventDefault();
        this.classList.remove('highlight');
        
        const fileId = e.dataTransfer.getData('text/plain');
        const fileElement = document.querySelector(`.file-item[data-id="${fileId}"]`);
        
        if (fileElement) {
            // Add animation class
            fileElement.classList.add('deleting');
            
            // Add file to trash bin
            trashBin.add(fileId);
            
            // Remove file element after animation completes
            setTimeout(() => {
                renderFiles();
            }, 600);
        }
    }

    // Initialize the file system
    initializeFileSystem();
}); 