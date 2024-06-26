module Greeting {
    export class Hello {

        constructor(private text: string) {
        }

        say(): void {
            console.log(`${this.text}`);
        }
    }
}

var hello: Greeting.Hello = new Greeting.Hello("Hello, World!");
hello.say();

let numbers = [1, 2, 3];
numbers.forEach(num => {return num + 2})

console.log(numbers)