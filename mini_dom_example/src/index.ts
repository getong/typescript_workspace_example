console.log("Hello!");
console.log("abc");
const btn = document.getElementById("btn")!;
// console.log(btn);
const input = document.getElementById("todoinput")! as HTMLInputElement;

btn.addEventListener("click", function() {
    // alert("Clicked!!!");
    alert(input.value);
    input.value = ""
})