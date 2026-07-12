import type { ComparisonPoint } from "./types";

export const comparisons: ComparisonPoint[] = [
  {
    id: "typing",
    title: "Type System",
    js: "let Tuqa's age = 23;\nage = \"twenty three\";",
    ts: "let Tuqa's age: number = 23;\nage = \"twenty three\"; // error!! wrong!!!!!",
    note: "In JavaScript, we can change variables whenever we want however we want. However, once we define a variable in TypeScript, it stays as it is. No. Matter. What."
  },
  {
    id: "execution",
    title: "Execution",
    js: "const user = { name: \"Tuqa\", age: 23 };\nconsole.log(user.email);",
    ts: "interface User { name: string; age: number; }\nconst user: User = { name: \"Tuqa\", age: 23 };\nuser.email; // property doesn't exist, flagged",
    note: "An interface basically says exactly what fields an object is supposed to have, so you can't accidentally use one that's missing."
  },
  {
    id: "checking",
    title: "Error Handling",
    js: "function shout(text) {\n  return text.toUpperCase();\n}\nshout(7);",
    ts: "function shout(text: string) {\n  return text.toUpperCase();\n}\nshout(7); // caught right away",
    note: "JavaScript detects errors after running the code (run-time). Meanwhile, TypeScript detects errors while the programmer is still writing the code (compile-time)."
  },
  {
    id: "compiling",
    title: "Compiling",
    js: "Runs directly in the browser or Node, nothing extra needed.",
    ts: "Has to be compiled into plain JavaScript first (with tsc or a bundler) before a browser can run it.",
    note: "Once you start a JavaScript program, it runs directly. However, TypeScript needs to be compiled into JavaScript before the browser can run it."
  },
  {
    id: "tooling",
    title: "Where It's Used",
    js: "JavaScript is used for small, simple projects.",
    ts: "TypeScript is used for big, complicated projects.",
    note: "TypeScript is used for bigger projects because of the ability to detect errors before running the program and because the code is cleaner and more consistent (considering the fact that its variables stay as they are once they are defined, unlike JavaScript)."
  }
];
