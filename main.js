function printCurrentTab() {
    window.print(); // Trigger the print dialog for the current tab
}

// Add an event listener to a button to trigger the print function
document.getElementById('printButton').addEventListener('click', printCurrentTab);
