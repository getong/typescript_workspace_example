let count = 0;

const countHeader = document.getElementById('count')!;

countHeader.innerText = count.toString();


const countAddBtn = document.getElementById('add')!;
countAddBtn.addEventListener('click', () => {
    // console.log("hello from the add button")
    count++;
    countHeader.innerText = count.toString();
});

const countSubBtn = document.getElementById('subtract')!;


countSubBtn.addEventListener('click', () => {
    // console.log("hello from the add button")
    count--;
    countHeader.innerText = count.toString();
});