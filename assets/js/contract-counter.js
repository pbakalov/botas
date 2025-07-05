const startDate = new Date('2023-01-03T00:00:00');
const endDate = new Date('2035-12-31T23:59:59');
const totalValue = 4200000000; // 4.2 billion BGN

// total duration in milliseconds
const totalDuration = endDate.getTime() - startDate.getTime();

// Format number with animation
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const currentValue = progress * (end - start) + start;
        
        if (element.id === 'counter') {
            element.textContent = currentValue.toLocaleString('bg-BG', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }) + ' BGN';
        } else if (element.id === 'percent') {
            element.textContent = currentValue.toLocaleString('bg-BG', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }) + '%';
        }
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

let prevValue = 0;
let prevPercentage = 0;

function updateCounter() {
    const now = new Date();
    
    document.getElementById('current-date').textContent = now.toLocaleString('bg-BG');
    
    if (now < startDate) {
        document.getElementById('counter').textContent = '0.00 BGN';
        document.getElementById('percent').textContent = '0.00%';
        return;
    }
    
    if (now > endDate) {
        document.getElementById('counter').textContent = totalValue.toLocaleString('bg-BG', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }) + ' BGN';
        document.getElementById('percent').textContent = '100.00%';
        return;
    }
    
    // Calculate elapsed time in milliseconds
    const elapsedTime = now.getTime() - startDate.getTime();
    
    // Calculate percentage of time elapsed
    const percentageElapsed = elapsedTime / totalDuration;
    
    // Calculate current value
    const currentValue = totalValue * percentageElapsed;
    const currentPercentage = percentageElapsed * 100;
    
    // Get elements for animation
    const counterElement = document.getElementById('counter');
    const percentElement = document.getElementById('percent');
    
    // Animate the transition (if difference is significant)
    if (Math.abs(currentValue - prevValue) > 1000) {
        animateValue(counterElement, prevValue, currentValue, 1000);
        prevValue = currentValue;
    } else {
        // Just update without animation for small changes
        counterElement.textContent = currentValue.toLocaleString('bg-BG', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }) + ' BGN';
    }
    
    if (Math.abs(currentPercentage - prevPercentage) > 0.01) {
        animateValue(percentElement, prevPercentage, currentPercentage, 1000);
        prevPercentage = currentPercentage;
    } else {
        // Just update without animation for small changes
        percentElement.textContent = currentPercentage.toLocaleString('bg-BG', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }) + '%';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Update immediately on page load
    updateCounter();
    
    // Set initial values for animation
    const now = new Date();
    if (now >= startDate && now <= endDate) {
        const elapsedTime = now.getTime() - startDate.getTime();
        const percentageElapsed = elapsedTime / totalDuration;
        prevValue = totalValue * percentageElapsed;
        prevPercentage = percentageElapsed * 100;
    }
    
    // Update every second
    setInterval(updateCounter, 1000);
});
